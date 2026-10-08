/**
 * Buscador + orden + paginación de productos (vanilla, sin librerías).
 * Mejora progresiva: sin JS se muestran todos los productos en el orden del build.
 * Reutilizado por /catalogo/ y /catalogo/[category]/.
 */

type CatalogOptions = {
  /** contenedor (ul) de los ítems con [data-product-item] */
  gridId: string;
  /** mensaje "sin resultados" (se muestra solo con 0 coincidencias) */
  emptyId?: string;
  /** se oculta mientras hay consulta (ej. grid de categorías) */
  hideId?: string;
  /** envoltorio de resultados: solo visible mientras hay consulta */
  revealId?: string;
};

export function initCatalog({ gridId, emptyId, hideId, revealId }: CatalogOptions) {
  const grid = document.getElementById(gridId);
  const input = document.getElementById('catalog-search');
  if (!(grid instanceof HTMLElement) || !(input instanceof HTMLInputElement)) return;

  const searchBtn = document.getElementById('catalog-search-btn');
  const sortEl = document.getElementById('catalog-sort');
  const sort = sortEl instanceof HTMLSelectElement ? sortEl : null;
  const empty = emptyId ? document.getElementById(emptyId) : null;
  const hide = hideId ? document.getElementById(hideId) : null;
  const reveal = revealId ? document.getElementById(revealId) : null;

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
          : 'border-slate-200 bg-white text-neutral hover:border-tertiary'
      }`;
      container.appendChild(btn);
    }
    if (restoreFocus) {
      container
        .querySelector<HTMLButtonElement>(`[data-page="${page}"]`)
        ?.focus({ preventScroll: true });
    }
  };

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    const searching = q !== '';

    const matched = items.filter((el) => !q || (el.dataset.search ?? '').includes(q));
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
    if (hide) hide.classList.toggle('hidden', searching);
    if (reveal) reveal.classList.toggle('hidden', !searching);
  };

  const goTo = (target: number) => {
    page = target;
    apply();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  input.addEventListener('input', () => {
    page = 1;
    apply();
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
