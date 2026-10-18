/** Navegación principal. Es código, no dato: una página nueva implica crear archivo. */
export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo/', label: 'Catálogo' },
  { href: '/servicios/', label: 'Servicios' },
  { href: '/contacto/', label: 'Contacto' },
];
