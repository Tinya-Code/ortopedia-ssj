import rodillera1 from '../assets/products/rodillera-1.jpg';
import rodillera2 from '../assets/products/rodillera-2.jpg';
import baston1 from '../assets/products/baston-1.jpg';
import baston2 from '../assets/products/baston-2.jpg';
import silla1 from '../assets/products/silla-ruedas-1.jpg';
import silla2 from '../assets/products/silla-ruedas-2.jpg';

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
      seoDescription: 'Rodilleras y soportes de rodilla para deporte, lesiones y recuperación.',
      intro:
        'Las rodilleras acompañan la rodilla durante la actividad diaria y el ejercicio: ofrecen compresión y un punto de apoyo que brinda soporte a la articulación sin limitar el movimiento. En esta categoría encuentras rodilleras elásticas para deporte, modelos con soporte de ligamentos y férulas con refuerzos laterales para mayor estabilidad. Cada ficha indica talla, material, registro sanitario y titular del registro para que compres con información completa. Antes de elegir, mide el contorno de la rodilla según la tabla de tallas de cada producto; si dudas entre dos tallas o necesitas orientación según tu actividad, escríbenos por WhatsApp y un asesor te responde. Los precios están expresados en soles e incluyen IGV y emitimos comprobante electrónico en cada venta. Recuerda que una rodillera es un producto de uso ortopédico: lee las instrucciones y consulta con un profesional de la salud si sientes dolor o inflamación persistente. Si buscas una opción para el periodo de recuperación, comenta tu caso con tu profesional de la salud antes de elegir talla.',
      image: rodillera1,
      imageAlt: 'Rodillera ortopédica con soporte de ligamentos',
      order: 1,
    },
    {
      slug: 'bastones',
      name: 'Bastones',
      seoTitle: 'Bastones ortopédicos',
      seoDescription: 'Bastones de apoyo y marcha, regulables y plegables.',
      intro:
        'Un buen bastón distribuye el peso y acompaña el paso con seguridad. En esta categoría encuentras bastones plegables de aluminio, modelos con agarre acolchado y bastones de cuatro puntos de apoyo para quienes necesitan mayor estabilidad al desplazarse. Las fichas indican altura regulable, material, peso soportado, registro sanitario y titular del registro. Antes de comprar, verifica la altura correcta: con el brazo caído a un costado, el agarre debe quedar a la altura de la muñeca. Si necesitas orientación sobre el modelo más adecuado a tu caso, escríbenos por WhatsApp y te asesoramos sin costo. Los precios están expresados en soles e incluyen IGV y emitimos comprobante electrónico en cada venta. Los bastones de este catálogo son productos de uso ortopédico: lee las instrucciones de uso y consulta a un profesional de la salud antes de utilizarlos. Todos los modelos del catálogo traen puntera antideslizante y se ajustan sin herramientas; revisa medidas, peso soportado y disponibilidad en la ficha de cada producto antes de pedir.',
      image: baston1,
      imageAlt: 'Bastón ortopédico regulable',
      order: 2,
    },
    {
      slug: 'sillas-de-ruedas',
      name: 'Sillas de ruedas',
      seoTitle: 'Sillas de ruedas manuales',
      seoDescription: 'Sillas de ruedas plegables en aluminio, para uso urbano y domiciliario.',
      intro:
        'Encuentra sillas de ruedas manuales plegables en aluminio para uso urbano y domiciliario, con ruedas de 24 pulgadas, apoyabrazos desmontables y reposapies extraíbles para facilitar el ingreso y el guardado. Cada ficha indica peso del producto, peso soportado, ancho total, registro sanitario y titular del registro; una de ellas está disponible por encargo. Antes de comprar, revisa el ancho de la silla y de las puertas por donde circula a diario, y confirma el peso que necesita soportar. Si tienes dudas sobre el modelo, la entrega o la coordinación del envío, escríbenos por WhatsApp y un asesor te responde. Los precios están expresados en soles e incluyen IGV, con comprobante electrónico en cada venta. Una silla de ruedas es un producto de uso ortopédico: lee las instrucciones y consulta a un profesional de la salud sobre el uso adecuado a tu movilidad. Verifica medidas, peso soportado y disponibilidad en la ficha de cada modelo antes de hacer tu pedido.',
      image: silla1,
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
        { src: rodillera1, alt: 'Rodillera con soporte de ligamentos vista frontal' },
        { src: rodillera2, alt: 'Rodillera con soporte de ligamentos vista lateral' },
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
      images: [{ src: rodillera2, alt: 'Rodillera elástica para deporte' }],
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
      images: [{ src: baston1, alt: 'Bastón plegable de aluminio' }],
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
      images: [{ src: baston2, alt: 'Bastón de cuatro puntos de apoyo' }],
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
        { src: silla1, alt: 'Silla de ruedas plegable vista lateral' },
        { src: silla2, alt: 'Silla de ruedas plegable vista frontal' },
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
      images: [{ src: silla2, alt: 'Silla de ruedas estándar en aluminio' }],
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
      images: [{ src: rodillera1, alt: 'Rodillera pendiente de validación' }],
      price: 99,
      availability: 'OutOfStock',
      sku: 'ROD-999',
      condition: 'new',
      featured: false,
    },
  ],
};
