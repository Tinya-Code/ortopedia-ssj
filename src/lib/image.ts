/**
 * `<Image>` de astro:assets declara Props como DOS ramas separadas
 * (local: `ImageMetadata` | remota: `string` con width/height) y un valor
 * con union no es asignable a ninguna de las dos, aunque en runtime
 * `getImage` resuelve ambos casos.
 *
 * El contrato de datos (src/data/types.ts) es dual porque en modo api las
 * imágenes llegan como URL remota —con width/height explícitos en el
 * componente—; en modo repo siempre es el asset local (ImageMetadata).
 * Este helper solo estrecha estáticamente: no transforma nada.
 */
export const imageSrc = (src: ImageMetadata | string): ImageMetadata => src as ImageMetadata;
