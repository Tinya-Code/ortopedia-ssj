// Placeholder: las fotos originales se reemplazaron por una única imagen de prueba.
import rodilleraImage from '../assets/products/rodillera.png';

import type { Database } from './types';

/**
 * Datos crudos del repo (rama `repo` de la bandera de src/api).
 * La forma de db ES la forma de la respuesta de la API remota (doc/seo.md §3),
 * validada por TS con la anotación `: Database`.
 * Las páginas NO importan db: usan `api.*` (src/api), nunca `db`.
 *
 * Textos: intros de categoría (~150 palabras, únicas) y descripciones breves de producto.
 * Con datos reales se amplían las descripciones (150–300 palabras únicas por producto).
 */

export const db: Database = {
  categories: [
    {
      slug: 'rodilleras',
      name: 'Rodilleras',
      seoTitle: 'Rodilleras ortopédicas',
      seoDescription:
        'Diseñadas para brindar estabilidad articular, compresión graduada y alivio inmediato en cada movimiento.',
      intro:
        'Diseñadas para brindar estabilidad articular, compresión graduada y alivio inmediato en cada movimiento. Nuestra línea de rodilleras ortopédicas protege ligamentos y meniscos frente al impacto diario, facilitando una recuperación segura tras lesiones o cirugías y devolviendo la confianza al caminar o realizar actividad física sin rigidez ni sobrecarga.',
      image: rodilleraImage,
      imageAlt: 'Rodillera ortopédica con soporte de ligamentos',
      order: 1,
    },
    {
      slug: 'bastones',
      name: 'Bastones',
      seoTitle: 'Bastones ortopédicos',
      seoDescription:
        'Desarrollados para otorgar un balance firme, autonomía y distribución equilibrada del peso corporal al desplazarse.',
      intro:
        'Desarrollados para otorgar un balance firme, autonomía y distribución equilibrada del peso corporal al desplazarse. Con opciones ergonómicas, plegables y de base múltiple con punteras antideslizantes, cada modelo amortigua la pisada y reduce la tensión en muñecas, caderas y columna para que retomes tus trayectos con total seguridad.',
      image: rodilleraImage,
      imageAlt: 'Bastón ortopédico regulable',
      order: 2,
    },
    {
      slug: 'sillas-de-ruedas',
      name: 'Sillas de ruedas',
      seoTitle: 'Sillas de ruedas manuales',
      seoDescription:
        'Pensadas para maximizar la independencia, el confort postural y la movilidad diaria tanto en interiores como en exteriores.',
      intro:
        'Pensadas para maximizar la independencia, el confort postural y la movilidad diaria tanto en interiores como en exteriores. Fabricadas con estructuras ligeras de alta resistencia, tapizados ergonómicos y sistemas de plegado compacto, ofrecen una experiencia de traslado suave, segura y fácil de maniobrar para usuarios y cuidadores.',
      image: rodilleraImage,
      imageAlt: 'Silla de ruedas plegable en aluminio',
      order: 3,
    },
  ],
  products: [
    {
      slug: 'rodillera-ligamentos',
      name: 'Rodillera con soporte de ligamentos',
      category: 'rodilleras',
      // ≤60 caracteres con el sufijo " | Centro Ortopédico SSJ" (aviso de SEO)
      seoTitle: 'Rodillera con soporte de ligamentos',
      seoDescription:
        'Rodillera con estabilizadores laterales para lesiones de ligamentos y recuperación postoperatoria. Consulta tallas por WhatsApp.',
      description:
        'Rodillera con refuerzos laterales y correas ajustables que brinda soporte a la articulación durante la actividad física y el traslado diario. Su tejido transpirable mantiene la rodilla abrigada sin acumular humedad y se coloca en segundos. Disponible en tallas S a XL; revisa la tabla de tallas antes de pedir por WhatsApp. Producto de uso ortopédico con registro sanitario verificado.',
      images: [
        { src: rodilleraImage, alt: 'Rodillera con soporte de ligamentos vista frontal' },
        { src: rodilleraImage, alt: 'Rodillera con soporte de ligamentos vista lateral' },
      ],
      price: 120,
      availability: 'InStock',
      brand: 'MarcaX',
      sku: 'ROD-001',
      registroSanitario: 'DM-2024-0001',
      claseRiesgo: 'II',
      titularRegistro: 'MarcaX S.A.C.',
      condition: 'new',
      specs: { Material: 'Neopreno transpirable', Tallas: 'S, M, L, XL' },
      faq: [{ q: '¿Sirve para uso deportivo?', a: 'Sí, ofrece estabilidad lateral durante la actividad física.' }],
      featured: true,
    },
    {
      slug: 'rodillera-deporte',
      name: 'Rodillera elástica para deporte',
      category: 'rodilleras',
      seoDescription:
        'Rodillera de compresión para prevención de lesiones y apoyo durante la actividad física.',
      description:
        'Rodillera elástica de compresión para acompañar la rodilla durante caminatas, entrenamiento y deportes de impacto. Su tejido flexible permite el movimiento completo y ofrece un suave efecto de compresión. Indicada para quienes buscan prevención y confort; no reemplaza la indicación de un profesional. Disponible en tallas S, M y L.',
      images: [{ src: rodilleraImage, alt: 'Rodillera elástica para deporte' }],
      price: 85,
      availability: 'InStock',
      brand: 'MarcaY',
      sku: 'ROD-002',
      registroSanitario: 'DM-2024-0002',
      claseRiesgo: 'I',
      condition: 'new',
      specs: { Tallas: 'S, M, L' },
      featured: false,
    },
    {
      slug: 'baston-plegable',
      name: 'Bastón plegable de aluminio',
      category: 'bastones',
      seoDescription: 'Bastón plegable con agarre acolchado y puntera antideslizante.',
      description:
        'Bastón de aluminio plegable que cabe en una mochila o en el baúl del auto. Regulable en altura de 75 a 95 cm, con agarre acolchado y puntera antideslizante para una marcha más segura. Liviano y resistente, acompaña tus traslados sin ocupar espacio.',
      images: [{ src: rodilleraImage, alt: 'Bastón plegable de aluminio' }],
      price: 75,
      availability: 'InStock',
      brand: 'MarcaX',
      sku: 'BAS-001',
      registroSanitario: 'DM-2023-0140',
      claseRiesgo: 'I',
      condition: 'new',
      specs: { Material: 'Aluminio', Altura: 'Regulable 75–95 cm' },
      featured: false,
    },
    {
      slug: 'baston-cuatro-puntos',
      name: 'Bastón de cuatro puntos de apoyo',
      category: 'bastones',
      seoDescription:
        'Bastón de marcha con base de cuatro puntos para mayor estabilidad en desplazamientos.',
      description:
        'Bastón de cuatro puntos de apoyo que ofrece mayor estabilidad al detenerse y al caminar sobre terrenos irregulares. Base con cuatro puntas antideslizantes, altura regulable de 80 a 95 cm y manija ergonómica. Acompaña la movilidad en interiores y exteriores; el uso adecuado debe indicarlo un profesional de la salud.',
      images: [{ src: rodilleraImage, alt: 'Bastón de cuatro puntos de apoyo' }],
      price: 145,
      availability: 'InStock',
      brand: 'MarcaY',
      sku: 'BAS-002',
      registroSanitario: 'DM-2023-0141',
      claseRiesgo: 'II',
      condition: 'new',
      specs: { Base: '4 puntos', Altura: 'Regulable 80–95 cm' },
      featured: true,
    },
    {
      slug: 'silla-ruedas-plegable',
      name: 'Silla de ruedas plegable',
      category: 'sillas-de-ruedas',
      seoTitle: 'Silla de ruedas plegable en aluminio',
      seoDescription:
        'Silla de ruedas manual plegable, liviana, con apoyabrazos desmontables y ruedas de 24".',
      description:
        'Silla de ruedas manual plegable en aluminio, liviana (12 kg) y compacta para trasladar en auto o guardar en casa. Ruedas de 24 pulgadas, apoyabrazos desmontables, reposapies extraíbles y frenos a ambos lados. Soporta hasta 110 kg y se pliega en segundos sin herramientas.',
      images: [
        { src: rodilleraImage, alt: 'Silla de ruedas plegable vista lateral' },
        { src: rodilleraImage, alt: 'Silla de ruedas plegable vista frontal' },
      ],
      price: 890,
      availability: 'InStock',
      brand: 'MarcaZ',
      sku: 'SRU-001',
      registroSanitario: 'DM-2022-0871',
      claseRiesgo: 'I',
      condition: 'new',
      specs: { Peso: '12 kg', 'Peso soportado': '110 kg', Ancho: '44 cm' },
      faq: [{ q: '¿Puedo plegarla sola?', a: 'Sí, se pliega en segundos sin herramientas.' }],
      featured: true,
    },
    {
      slug: 'silla-ruedas-aluminio',
      name: 'Silla de ruedas estándar en aluminio',
      category: 'sillas-de-ruedas',
      seoDescription: 'Silla de ruedas reforzada para uso diario, con frenos duales y reposapies extraíbles.',
      description:
        'Silla de ruedas estándar reforzada en aluminio para uso diario, con frenos duales, apoyabrazos fijos y reposapies extraíbles. Soporta hasta 120 kg y ofrece un asiento amplio para permanecer sentado por períodos prolongados. Disponible por encargo: consulta plazos por WhatsApp.',
      images: [{ src: rodilleraImage, alt: 'Silla de ruedas estándar en aluminio' }],
      price: 1250,
      availability: 'PreOrder',
      brand: 'MarcaZ',
      sku: 'SRU-002',
      registroSanitario: 'DM-2022-0872',
      claseRiesgo: 'I',
      condition: 'new',
      specs: { Peso: '14 kg', 'Peso soportado': '120 kg' },
      featured: false,
    },
    {
      // Regla editorial (doc/legal.md 9.6): sin registro sanitario verificado NO se publica.
      slug: 'rodillera-en-validacion',
      name: 'Rodillera en validación de registro',
      category: 'rodilleras',
      seoDescription: 'Producto pendiente de verificación de registro sanitario.',
      description: 'No publicable hasta tener registro sanitario verificado.',
      images: [{ src: rodilleraImage, alt: 'Rodillera pendiente de validación' }],
      price: 99,
      availability: 'OutOfStock',
      sku: 'ROD-999',
      condition: 'new',
      featured: false,
    },
  ],
};
