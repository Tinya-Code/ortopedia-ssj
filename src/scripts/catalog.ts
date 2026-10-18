/**
 * Buscador + filtro de categoría + orden + paginación de productos
 * (vanilla, sin librerías). Mejora progresiva: sin JS se muestran todos
 * los productos en el orden del build.
 * Reutilizado por /catalogo/ y /catalogo/[category]/.
 */

type CatalogOptions = {
  /** contenedor (ul) de los ítems con [data-product-item] */
  gridId: string;
  /** mensaje "sin resultados" (se muestra solo con 0 coincidencias) */
  emptyId?: string;
};

// Clases de los botones de filtro (CategoryFilters.astro).
const FILTER_ACTIVE =
  'inline-flex min-h-11 shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-primary shadow-sm transition-colors motion-reduce:transition-none';
const FILTER_IDLE =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-neutral transition-colors hover:border-primary hover:text-primary hover:bg-slate-50 motion-reduce:transition-none';

export function initCatalog({ gridId, emptyId }: CatalogOptions) {
  // GA4 view_item_list: push único al init con la lista renderizada en build.
  // El payload viaja serializado en data-view-list (JSON) de la sección contenedora
  // (catálogo o categoría); guard: solo se emite si aún no se emitió en esta página.
  const viewListSection = document.querySelector<HTMLElement>('[data-view-list]');
  if (viewListSection?.dataset.viewList) {
    let pushed = false;
    if (!pushed) {
      pushed = true;
      try {
        const payload = JSON.parse(viewListSection.dataset.viewList) as {
          item_list_name: string;
          items: { item_id: string; item_name: string }[];
        };
        const store = window as Window & { dataLayer?: Record<string, unknown>[] };
        store.dataLayer ??= [];
        store.dataLayer.push({
          event: 'view_item_list',
          item_list_name: payload.item_list_name,
          items: payload.items,
        });
      } catch {
        // JSON malformado en el atributo: no se emite el evento.
      }
    }
  }

  const grid = document.getElementById(gridId);
  const input = document.getElementById('catalog-search');
  if (!(grid instanceof HTMLElement) || !(input instanceof HTMLInputElement)) return;

  const searchBtn = document.getElementById('catalog-search-btn');
  const sortEl = document.getElementById('catalog-sort');
  const sort = sortEl instanceof HTMLSelectElement ? sortEl : null;
  const empty = emptyId ? document.getElementById(emptyId) : null;

  // Contador de resultados (zona aria-live) + chips de filtros activos.
  const count = document.getElementById('catalog-count');
  const activeFilters = document.getElementById('catalog-active-filters');
  const chipQuery = activeFilters?.querySelector<HTMLElement>('[data-chip-query]');
  const chipCategory = activeFilters?.querySelector<HTMLElement>('[data-chip-category]');
  const chipQueryText = activeFilters?.querySelector<HTMLElement>('[data-chip-query-text]');
  const chipCategoryText = activeFilters?.querySelector<HTMLElement>('[data-chip-category-text]');
  const clearAllBtn = activeFilters?.querySelector<HTMLButtonElement>('[data-clear-all]');
  const removeBtns = activeFilters
    ? Array.from(activeFilters.querySelectorAll<HTMLButtonElement>('[data-remove]'))
    : [];

  // Preferencia del sistema: se consulta en cada scroll (matchMedia es live).
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const filters = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-category-filter]'),
  );

  /** Etiqueta visible de un chip de categoría: el nombre sin el contador "(n)". */
  const categoryLabel = (slug: string) =>
    filters.find((btn) => (btn.dataset.categoryFilter ?? '') === slug)?.dataset.label ?? slug;

  const pager = document.getElementById('catalog-pagination');
  const pagesEl = document.getElementById('catalog-pages');
  const prev = document.getElementById('catalog-prev');
  const next = document.getElementById('catalog-next');
  const paged =
    pager instanceof HTMLElement &&
    pagesEl instanceof HTMLElement &&
    prev instanceof HTMLButtonElement &&
    next instanceof HTMLButtonElement
      ? { pager, pagesEl, prev, next }
      : null;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-product-item]'));
  const PER_PAGE = 12;
  let page = 1;
  /** slug activo; null = "Todos" */
  let activeCategory: string | null = null;

  const priceOf = (el: HTMLElement): number | null => {
    const raw = el.dataset.price;
    return raw ? Number(raw) : null;
  };

  const byMode = (a: HTMLElement, b: HTMLElement, mode: string) => {
    if (mode === 'az') return (a.dataset.name ?? '').localeCompare(b.dataset.name ?? '', 'es');
    if (mode === 'za') return (b.dataset.name ?? '').localeCompare(a.dataset.name ?? '', 'es');
    const pa = priceOf(a);
    const pb = priceOf(b);
    if (pa === null && pb === null) return 0;
    if (pa === null) return 1; // sin precio, siempre al final
    if (pb === null) return -1;
    return mode === 'price-asc' ? pa - pb : pb - pa;
  };

  const renderPages = (container: HTMLElement, total: number) => {
    const restoreFocus = container.contains(document.activeElement);
    container.replaceChildren();
    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(i);
      btn.dataset.page = String(i);
      btn.setAttribute('aria-label', `Página ${i}`);
      if (i === page) btn.setAttribute('aria-current', 'page');
      btn.className = `inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
        i === page
          ? 'border-primary bg-primary text-white'
          : 'border-slate-200 bg-white text-neutral hover:border-primary hover:text-primary hover:bg-slate-50'
      }`;
      container.appendChild(btn);
    }
    if (restoreFocus) {
      container
        .querySelector<HTMLButtonElement>(`[data-page="${page}"]`)
        ?.focus({ preventScroll: true });
    }
  };

  const renderFilters = () => {
    filters.forEach((btn) => {
      const slug = btn.dataset.categoryFilter ?? '';
      const active = (activeCategory ?? '') === slug;
      btn.className = active ? FILTER_ACTIVE : FILTER_IDLE;
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  /**
   * Pinta el contador de resultados (zona aria-live) y los chips de filtros
   * activos. El markup de ActiveFilters.astro nace oculto: aquí se muestra el
   * contenedor solo si hay búsqueda y/o categoría activas, se etiqueta cada
   * chip y, sin filtros activos, vuelve a ocultarse.
   */
  const renderStatus = (total: number) => {
    const label = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    if (count && count.textContent?.trim() !== label) count.textContent = label;

    if (!activeFilters) return;
    const query = input.value.trim();
    const hasQuery = query !== '';
    const hasCategory = activeCategory !== null;

    activeFilters.classList.toggle('hidden', !hasQuery && !hasCategory);
    // Mismo patrón que el paginador: el markup no trae `flex`, se añade al
    // mostrarse para que flex-wrap/gap-2/items-center surtan efecto.
    activeFilters.classList.toggle('flex', hasQuery || hasCategory);
    chipQuery?.classList.toggle('hidden', !hasQuery);
    chipCategory?.classList.toggle('hidden', !hasCategory);
    if (hasQuery && chipQueryText) chipQueryText.textContent = `Búsqueda: ${query}`;
    if (hasCategory && activeCategory && chipCategoryText) {
      chipCategoryText.textContent = categoryLabel(activeCategory);
    }
  };

  const apply = () => {
    const q = input.value.trim().toLowerCase();

    const matched = items.filter((el) => {
      const byCategory = !activeCategory || (el.dataset.category ?? '') === activeCategory;
      const byQuery = !q || (el.dataset.search ?? '').includes(q);
      return byCategory && byQuery;
    });

    if (sort) {
      matched.sort((a, b) => byMode(a, b, sort.value));
      // Reordena el DOM respetando el filtro activo.
      matched.forEach((el) => grid.appendChild(el));
    }

    const total = matched.length;

    if (paged) {
      const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
      if (page > totalPages) page = totalPages;
      const start = (page - 1) * PER_PAGE;
      items.forEach((el) => {
        el.hidden = true;
      });
      matched.slice(start, start + PER_PAGE).forEach((el) => {
        el.hidden = false;
      });

      const paginated = total > PER_PAGE;
      paged.pager.classList.toggle('hidden', !paginated);
      paged.pager.classList.toggle('flex', paginated);
      paged.prev.disabled = page === 1;
      paged.next.disabled = page === totalPages;
      if (paginated) renderPages(paged.pagesEl, totalPages);
      else paged.pagesEl.replaceChildren();
    } else {
      items.forEach((el) => {
        el.hidden = !matched.includes(el);
      });
    }

    if (empty) empty.classList.toggle('hidden', total !== 0);
    renderStatus(total);
  };

  const goTo = (target: number) => {
    page = target;
    apply();
    grid.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  // GA4 search: debounce de 400 ms sobre el mismo input. Se emite solo si la
  // consulta no está vacía y cambió respecto al último push (evita duplicados
  // por keystrokes repetidos o re-enfoques del campo).
  let lastSearchTerm: string | null = null;
  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  input.addEventListener('input', () => {
    page = 1;
    apply();

    const term = input.value.trim();
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (term === '' || term === lastSearchTerm) return;
      lastSearchTerm = term;
      const store = window as Window & { dataLayer?: Record<string, unknown>[] };
      store.dataLayer ??= [];
      store.dataLayer.push({ event: 'search', search_term: term });
    }, 400);
  });
  searchBtn?.addEventListener('click', () => {
    page = 1;
    apply();
    input.focus();
  });
  sort?.addEventListener('change', () => {
    page = 1;
    apply();
  });
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.categoryFilter ?? '';
      activeCategory = slug === '' ? null : slug;
      page = 1;
      renderFilters();
      apply();
    });
  });
  // Chips de filtros activos: quitar un chip elimina SOLO ese filtro y
  // re-renderiza; "Limpiar filtros" resetea búsqueda y categoría. Como el
  // botón enfocado queda oculto al eliminarse el chip, el foco vuelve a un
  // control estable (nunca al body).
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.remove === 'query') {
        input.value = '';
        page = 1;
        apply();
        input.focus({ preventScroll: true });
      } else if (btn.dataset.remove === 'category') {
        activeCategory = null;
        page = 1;
        renderFilters();
        apply();
        // El chip de categoría solo existe junto a los botones de filtro;
        // filters[0] es "Todos", que vuelve a quedar activo.
        filters[0]?.focus({ preventScroll: true });
      }
    });
  });
  clearAllBtn?.addEventListener('click', () => {
    input.value = '';
    activeCategory = null;
    page = 1;
    renderFilters();
    apply();
    input.focus({ preventScroll: true });
  });
  paged?.prev.addEventListener('click', () => {
    if (page > 1) goTo(page - 1);
  });
  paged?.next.addEventListener('click', () => {
    goTo(page + 1);
  });
  paged?.pagesEl.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-page]');
    if (target?.dataset.page) goTo(Number(target.dataset.page));
  });

  apply();
}
