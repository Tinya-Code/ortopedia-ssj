import fajaSacroLumbarImage from '../../assets/products/faja-sacro-lumbar.webp';
import inmovilizadorRodillaImage from '../../assets/products/inmovilizador-de-rodilla-argym.webp';
import cabestrilloHombroImage from '../../assets/products/cabestrillo-inmovilizador-de-hombro-argymsport.webp';
import sillaRuedasImage from '../../assets/products/silla-de-ruedas.webp';
import baston4Image from '../../assets/products/baston-4-soportes.webp';
import baston3Image from '../../assets/products/baston-3-soportes.webp';
import almohadaOrtopedicaImage from '../../assets/products/almohada-ortopedica.webp';
import correctorPosturaImage from '../../assets/products/corrector-de-postura-magnetic-inpesi.webp';
import mediasCompresionImage from '../../assets/products/medias-compresion-siriform.png';
import type { Database } from '../types';

/**
 * Datos crudos del repo (rama `repo` de la bandera de src/api):
 * mock de GET /categories + GET /products.
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
      slug: 'fajas',
      name: 'Fajas',
      seoTitle: 'Fajas ortopédicas de soporte',
      seoDescription:
        'Fajas ortopédicas que brindan soporte y compresión a la zona abdominal y lumbar durante el día a día.',
      intro:
        'Nuestra línea de fajas ortopédicas está diseñada para acompañar la zona abdominal y lumbar con soporte envolvente y compresión graduada. Ideales para quienes pasan largas horas de pie, sentados frente a una computadora o recuperándose de un embarazo, una cirugía o una molestia de espalda, estas fajas ayudan a mantener una postura más aliviada sin limitar el movimiento. Sus tejidos flexibles y transpirables se adaptan al cuerpo, se colocan con facilidad bajo la ropa y resisten el uso diario. Encontrarás modelos con refuerzo sacrolumbar, cierre ajustable y diferentes niveles de sujeción según tu necesidad. Antes de elegir tu talla, te recomendamos tomar medidas y consultar por WhatsApp: te orientamos personalmente para que la faja se ajuste bien y cumpla su función de soporte en cada actividad.',
      image: fajaSacroLumbarImage,
      imageAlt: 'Faja ortopédica de soporte sacrolumbar',
      order: 1,
    },
    {
      slug: 'inmovilizadores',
      name: 'Inmovilizadores',
      seoTitle: 'Inmovilizadores ortopédicos de hombro y rodilla',
      seoDescription:
        'Inmovilizadores que estabilizan y descargan articulaciones durante la recuperación o ante molestias.',
      intro:
        'Los inmovilizadores ortopédicos ofrecen sujeción y estabilidad a articulaciones que necesitan descansar: hombros, rodillas y brazos. Diseñados con bandas ajustables, materiales resistentes y acabados suaves, limitan los desplazamientos no deseados sin aprisionar en exceso, favoreciendo una recuperación más ordenada tras esguinces, contusiones, sobrecargas o intervenciones quirúrgicas. Son livianos, fáciles de colocar sobre el torso o la pierna y permiten acompañar las tareas diarias y la rehabilitación indicada por un profesional. Cada modelo se ofrece en varias tallas y se ajusta a ambos lados cuando la diseño lo permite. Si no estás seguro de la medida o del tipo de inmovilizador que necesitas, escríbenos por WhatsApp con tu caso y te ayudamos a elegir el producto adecuado antes de hacer tu pedido.',
      image: inmovilizadorRodillaImage,
      imageAlt: 'Inmovilizador ortopédico de rodilla con bandas ajustables',
      order: 2,
    },
    {
      slug: 'sillas',
      name: 'Sillas',
      seoTitle: 'Sillas de ruedas manuales',
      seoDescription:
        'Sillas de ruedas manuales para maximizar la independencia, el confort y la movilidad diaria.',
      intro:
        'Nuestras sillas de ruedas manuales están pensadas para devolver autonomía y comodidad en cada traslado. Fabricadas con estructuras ligeras de alta resistencia, ofrecen asientos amplios, frenos seguros y componentes desmontables que facilitan el plegado y el guardado en casa o en el auto. Sirven tanto para desplazarse en interiores como en exteriores, con una maniobrabilidad sencilla para usuarios y cuidadores. Cada modelo indica el peso soportado, el ancho de asiento y el peso total para que elijas según tu contextura y tus espacios. Antes de pedir, confirma la disponibilidad y el plazo de entrega por WhatsApp: nuestro equipo te asesora sobre medidas, accesorios y el uso correcto de la silla. Una ayuda técnica bien ajustada marca la diferencia en la seguridad y en la calidad de vida de quien la utiliza todos los días.',
      image: sillaRuedasImage,
      imageAlt: 'Silla de ruedas manual plegable',
      order: 3,
    },
    {
      slug: 'bastones',
      name: 'Bastones',
      seoTitle: 'Bastones ortopédicos de apoyo',
      seoDescription:
        'Bastones ortopédicos con bases de 3 y 4 puntos para un balance firme y una marcha más segura.',
      intro:
        'Los bastones ortopédicos están desarrollados para otorgar un balance firme, autonomía y distribución equilibrada del peso corporal al desplazarse. Contamos con modelos de tres y cuatro puntos de apoyo, pensados para quienes necesitan mayor estabilidad que un bastón tradicional al detenerse, al girar o sobre terrenos irregulares. Sus bases con puntas antideslizantes y sus manijas ergonómicas reducen la tensión en muñecas, caderas y columna, mientras que la altura regulable permite adaptar el bastón a la estatura de cada usuario. Livianos y resistentes, acompañan la rehabilitación, el uso diario y la movilidad en interiores y exteriores. El uso adecuado debe indicarlo un profesional de la salud; si tienes dudas sobre el modelo o la altura, consulta por WhatsApp y te orientamos antes de pedir.',
      image: baston4Image,
      imageAlt: 'Bastón ortopédico con base de cuatro puntos de apoyo',
      order: 4,
    },
    {
      slug: 'almohadas-ortopedicas',
      name: 'Almohadas ortopédicas',
      seoTitle: 'Almohadas ortopédicas de soporte cervical',
      seoDescription:
        'Almohadas ortopédicas que acompañan la postura del cuello y la cabeza durante el descanso.',
      intro:
        'Las almohadas ortopédicas están diseñadas para acompañar la curvatura natural del cuello y ofrecer un descanso más reparador. Su estructura ergonómica distribuye la presión de la cabeza y el cuello, ayudando a reducir rigideces al despertar y a mantener una alineación más neutra durante la noche. Son una buena opción para quienes duermen boca arriba o de lado, viajan con frecuencia o pasan largas jornadas sentados y buscan un soporte extra al descansar. Fabricadas con materiales firmes pero confortables y fundas fáciles de quitar para su limpieza. Elige el modelo según tu postura habitual de sueño y tu estatura; si no estás seguro, escríbenos por WhatsApp y te ayudamos a decidir. Una almohada bien elegida complementa cualquier tratamiento ortopédico y mejora la calidad del descanso diario.',
      image: almohadaOrtopedicaImage,
      imageAlt: 'Almohada ortopédica de soporte cervical',
      order: 5,
    },
    {
      slug: 'medias',
      name: 'Medias de compresión',
      seoTitle: 'Medias elásticas de compresión gradual',
      seoDescription:
        'Medias de compresión gradual 15-20 mmHg en microfibra: mejor circulación, menos cansancio en piernas y pies.',
      intro:
        'Las medias elásticas de compresión gradual están diseñadas para mejorar la circulación sanguínea y aliviar la sensación de cansancio en piernas y pies durante el día. Fabricadas con hilos de alta elasticidad y microfibra suave, ejercen una presión controlada que es más firme en el tobillo y se reduce hacia la pantorrilla, favoreciendo el retorno venoso sin resultar incómodas ni limitar el movimiento. Son una buena opción para quienes permanecen mucho tiempo de pie o sentado, viajan con frecuencia, entrenan o presentan inflamación leve a moderada. Su diseño de calcetín largo se coloca fácilmente, no deja pliegues bajo la ropa y acompaña desde la jornada laboral hasta el descanso. Elegir la talla correcta según el contorno de pantorrilla y tobillo es clave para que la compresión funcione como corresponde; si dudas entre dos medidas, escríbenos por WhatsApp y te orientamos antes de hacer tu pedido.',
      image: mediasCompresionImage,
      imageAlt: 'Par de medias elásticas de compresión gradual negras',
      order: 6,
    },
  ],
  // Contrato uniforme: TODOS los productos llevan TODAS las claves del schema
  // (mismos nombres y misma cantidad, src/api/types.ts). Sentinelas: price null
  // = cotiza sin precio publicado; '' = sin brand / registroSanitario /
  // claseRiesgo / titularRegistro. benefits, care y faq están completos para
  // todo el catálogo; instructions y sizeGuide quedan en [] salvo donde existen
  // datos reales de uso y de medidas (son trabajo futuro con datos verificados).
  products: [
    {
      slug: 'faja-sacrolumbar',
      name: 'Faja sacrolumbar argymsport',
      category: 'fajas',
      seoTitle: 'Faja sacrolumbar argymsport',
      seoDescription:
        'Faja de soporte sacrolumbar para aliviar la zona baja de la espalda. Consulta tallas por WhatsApp.',
      description:
        'Faja sacrolumbar argymsport que brinda soporte y compresión a la zona baja de la espalda y el sacro durante las actividades diarias. Su diseño envolvente ayuda a mantener una postura más aliviada al estar de pie, caminar o sentado por periodos prolongados. Tejido flexible que se adapta al cuerpo sin limitar el movimiento y se coloca en segundos bajo la ropa. Disponible en varias tallas; consulta la medida por WhatsApp antes de pedir. Producto de uso ortopédico.',
      images: [{ src: fajaSacroLumbarImage, alt: 'Faja sacrolumbar argymsport de soporte para la zona baja de la espalda' }],
      price: null,
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'FAJ-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Soporte sacrolumbar', Ajuste: 'Envoltorio con compresión' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver la faja?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la talla?',
          a: 'La medida se verifica en la ficha del producto; si tienes dudas, consulta la talla por WhatsApp antes de pedir.',
        },
        {
          q: '¿Para qué sirve la faja sacrolumbar?',
          a: 'Está diseñada para brindar soporte y compresión a la zona baja de la espalda y el sacro durante las actividades diarias.',
        },
      ],
      featured: true,
      benefits: [
        'Brinda soporte y compresión a la zona baja de la espalda y el sacro.',
        'Ayuda a mantener una postura más aliviada al estar de pie, caminar o sentado.',
        'Diseño envolvente que se adapta al cuerpo sin limitar el movimiento.',
        'Tejido flexible que se coloca en segundos bajo la ropa.',
        'Disponible en varias tallas según la medida que consultes.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Lavar a mano con agua fría.',
        'Usar jabón suave y no blanquear.',
        'No planchar.',
        'Secar a la sombra.',
      ],
    },
    {
      slug: 'inmovilizador-de-rodilla-argymsport',
      name: 'Inmovilizador de rodilla argymsport',
      category: 'inmovilizadores',
      seoTitle: 'Inmovilizador de rodilla argymsport',
      seoDescription:
        'Inmovilizador de rodilla para estabilidad y sujeción de la articulación. Consulta tallas por WhatsApp.',
      description:
        'Inmovilizador de rodilla argymsport diseñado para ofrecer sujeción y estabilidad a la articulación durante el movimiento y la recuperación. Su estructura envuelve la rodilla con bandas ajustables que limitan los desplazamientos no deseados sin aprisionar en exceso. Material resistente y transpirable que acompaña caminatas, trabajo diario y rehabilitación. Disponible en varias tallas; revisa la medida por WhatsApp antes de pedir. Producto de uso ortopédico.',
      images: [{ src: inmovilizadorRodillaImage, alt: 'Inmovilizador de rodilla argymsport con bandas ajustables' }],
      price: null,
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'INM-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Sujeción de rodilla', Ajuste: 'Bandas ajustables' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver el inmovilizador?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la talla?',
          a: 'La medida se verifica en la ficha del producto; si tienes dudas, consulta la talla por WhatsApp antes de pedir.',
        },
        {
          q: '¿Qué cubre el inmovilizador de rodilla?',
          a: 'Envuelve la rodilla con bandas ajustables para dar sujeción y estabilidad durante el movimiento y la actividad diaria.',
        },
      ],
      featured: true,
      benefits: [
        'Brinda sujeción y estabilidad a la articulación de la rodilla.',
        'Las bandas ajustables limitan los desplazamientos no deseados sin aprisionar en exceso.',
        'Material resistente y transpirable que acompaña el uso diario.',
        'Adecuado para caminatas, trabajo diario y rehabilitación indicada.',
        'Se adapta al cuerpo sin limitar el movimiento.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Lavar a mano con agua fría.',
        'Usar jabón suave y no blanquear.',
        'No planchar.',
        'Secar a la sombra.',
      ],
    },
    {
      slug: 'inmovilizador-de-hombro-argymsport',
      name: 'Inmovilizador de hombro argymsport',
      category: 'inmovilizadores',
      seoTitle: 'Inmovilizador de hombro argymsport',
      seoDescription:
        'Inmovilizador de hombro para sostener y descansar el brazo tras una lesión. Consulta por WhatsApp.',
      description:
        'Inmovilizador de hombro argymsport que sostiene el brazo y descarga la articulación del hombro durante la recuperación o ante molestias. Su banda ancha reparte el peso del brazo de forma cómoda y el cinturón de sujeción evita que el brazo se desplace. Liviano, ajustable y fácil de colocar sobre el torso; útil para reposo del hombro tras esguinces, contusiones o indicación médica. Ajusta a ambos lados. Producto de uso ortopédico.',
      images: [
        {
          src: cabestrilloHombroImage,
          alt: 'Inmovilizador de hombro argymsport sosteniendo el brazo',
        },
      ],
      price: null,
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'INM-002',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Inmovilización de hombro', Ajuste: 'Regulable, ambos lados' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver el producto?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo se usa el inmovilizador de hombro?',
          a: 'Se coloca sobre el torso y el brazo, ajustando la banda ancha y el cinturón de sujeción sin apretar en exceso. Ajusta a ambos lados.',
        },
        {
          q: '¿Cómo elijo la talla?',
          a: 'La medida se verifica en la ficha del producto; si tienes dudas, consulta la talla por WhatsApp antes de pedir.',
        },
      ],
      featured: true,
      benefits: [
        'Sostiene el brazo y descarga la articulación del hombro.',
        'La banda ancha reparte el peso del brazo de forma cómoda.',
        'El cinturón de sujeción evita que el brazo se desplace.',
        'Liviano, ajustable y fácil de colocar sobre el torso.',
        'Ajusta a ambos lados según cómo lo necesites.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Lavar a mano con agua fría.',
        'Usar jabón suave y no blanquear.',
        'No planchar.',
        'Secar a la sombra.',
      ],
    },
    {
      slug: 'silla-de-ruedas',
      name: 'Silla de ruedas',
      category: 'sillas',
      seoTitle: 'Silla de ruedas manual',
      seoDescription:
        'Silla de ruedas manual para traslados diarios. Consulta disponibilidad y medidas por WhatsApp.',
      description:
        'Silla de ruedas manual para acompañar tus desplazamientos en interiores y exteriores. Estructura resistente, asiento amplio y frenos para una marcha segura y controlada. Antes de pedir, consulta por WhatsApp la disponibilidad, el plazo de entrega y las medidas del modelo para verificar que se adapta a tu estatura y a tus espacios. Producto de uso ortopédico.',
      images: [{ src: sillaRuedasImage, alt: 'Silla de ruedas manual vista lateral' }],
      price: null,
      availability: 'InStock',
      brand: '',
      sku: 'SRU-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Movilidad diaria', Tipo: 'Manual' },
      faq: [
        {
          q: '¿Cuánto demora la entrega?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver la silla?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo confirmo la medida de la silla?',
          a: 'Antes de pedir, consulta por WhatsApp las medidas del modelo para verificar que se adapta a tu estatura y a tus espacios.',
        },
        {
          q: '¿Cómo se coordina la compra?',
          a: 'No hay checkout online: escribes por WhatsApp, confirmamos disponibilidad y datos de entrega, y coordinamos el pago y la entrega.',
        },
      ],
      featured: false,
      benefits: [
        'Estructura resistente para desplazamientos en interiores y exteriores.',
        'Asiento amplio que acompaña el uso diario.',
        'Frenos que favorecen una marcha segura y controlada.',
        'Diseñada para devolver autonomía y comodidad en cada traslado.',
        'Consulta la disponibilidad y las medidas del modelo por WhatsApp.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Revisar periódicamente el estado y el ajuste de los frenos.',
        'Comprobar que las ruedas giren libremente y no presenten desgaste.',
        'Limpiar con un paño húmedo y jabón suave.',
        'Guardar en un lugar seco, evitando la humedad prolongada.',
      ],
    },
    {
      slug: 'baston-de-4-apoyos',
      name: 'Bastón de 4 apoyos',
      category: 'bastones',
      seoTitle: 'Bastón de 4 puntos de apoyo',
      seoDescription:
        'Bastón de marcha con base de cuatro puntos para mayor estabilidad al caminar y al detenerse.',
      description:
        'Bastón de cuatro puntos de apoyo que ofrece mayor estabilidad al detenerse y al caminar sobre terrenos irregulares. Base con puntas antideslizantes y manija ergonómica para un agarre cómodo. Acompaña la movilidad en interiores y exteriores; la altura y el uso adecuado deben indicarlo un profesional de la salud. Consulta por WhatsApp antes de pedir.',
      images: [{ src: baston4Image, alt: 'Bastón de 4 apoyos con base antideslizante' }],
      price: null,
      availability: 'InStock',
      brand: '',
      sku: 'BAS-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Base: '4 puntos', Uso: 'Marcha asistida' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver el bastón?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la altura del bastón?',
          a: 'La altura regulable y el uso adecuado deben indicarlos un profesional de la salud; consulta por WhatsApp antes de pedir.',
        },
        {
          q: '¿Qué aporta la base de 4 puntos?',
          a: 'Ofrece mayor estabilidad al detenerse y al caminar sobre terrenos irregulares, con puntas antideslizantes en cada punto de apoyo.',
        },
      ],
      featured: false,
      benefits: [
        'Ofrece mayor estabilidad al detenerse y al caminar.',
        'Base de cuatro puntos para apoyo equilibrado del peso corporal.',
        'Puntas antideslizantes que favorecen un apoyo firme en el suelo.',
        'Manija ergonómica para un agarre cómodo.',
        'Acompaña la movilidad en interiores y exteriores.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Revisar que las puntas de goma no estén gastadas.',
        'Verificar que las puntas antideslizantes se sujeten bien al suelo antes de cada uso.',
        'Limpiar con un paño húmedo y jabón suave.',
        'Guardar en un lugar seco.',
      ],
    },
    {
      slug: 'baston-de-3-apoyos',
      name: 'Bastón de 3 apoyos',
      category: 'bastones',
      seoTitle: 'Bastón de 3 puntos de apoyo',
      seoDescription:
        'Bastón de tres puntos de apoyo para mayor equilibrio en desplazamientos cortos y diarios.',
      description:
        'Bastón de tres puntos de apoyo, alternativa intermedia entre el bastón tradicional y la base de cuatro puntos. Brinda mayor equilibrio al apoyarlo en el suelo y acompaña desplazamientos diarios en casa o en la calle. Manija ergonómica y base con puntas antideslizantes. El uso y la regulación de altura deben indicarlos un profesional de la salud. Disponible por consulta por WhatsApp.',
      images: [{ src: baston3Image, alt: 'Bastón de 3 apoyos con base antideslizante' }],
      price: null,
      availability: 'InStock',
      brand: '',
      sku: 'BAS-002',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Base: '3 puntos', Uso: 'Marcha asistida' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver el bastón?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la altura del bastón?',
          a: 'La altura regulable y el uso adecuado deben indicarlos un profesional de la salud; consulta por WhatsApp antes de pedir.',
        },
        {
          q: '¿En qué se diferencia del bastón de 4 apoyos?',
          a: 'Es la alternativa intermedia: más liviano que el de cuatro puntos, brinda mayor equilibrio que un bastón tradicional al apoyarlo en el suelo.',
        },
      ],
      featured: false,
      benefits: [
        'Brinda mayor equilibrio al apoyarlo en el suelo.',
        'Alternativa intermedia entre el bastón tradicional y la base de cuatro puntos.',
        'Acompaña desplazamientos diarios en casa o en la calle.',
        'Manija ergonómica para un agarre cómodo.',
        'Base con puntas antideslizantes y altura regulable.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Revisar que las puntas de goma no estén gastadas.',
        'Verificar que las puntas antideslizantes se sujeten bien al suelo antes de cada uso.',
        'Limpiar con un paño húmedo y jabón suave.',
        'Guardar en un lugar seco.',
      ],
    },
    {
      slug: 'almohada-ortopedica',
      name: 'Almohada ortopédica',
      category: 'almohadas-ortopedicas',
      seoTitle: 'Almohada ortopédica de soporte cervical',
      seoDescription:
        'Almohada ortopédica que acompaña la postura del cuello durante el descanso. Consulta por WhatsApp.',
      description:
        'Almohada ortopédica con estructura ergonómica que distribuye la presión de la cabeza y el cuello durante el sueño. Acompaña la alineación natural de la columna cervical y ayuda a reducir rigideces al despertar. Adecuada para posturas de sueño en decúbito lateral y supino. Funda extraíble para su limpieza. Consulta por WhatsApp el modelo disponible y las indicaciones de uso. Producto de uso ortopédico.',
      images: [{ src: almohadaOrtopedicaImage, alt: 'Almohada ortopédica de soporte cervical' }],
      price: null,
      availability: 'InStock',
      brand: '',
      sku: 'ALM-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Soporte cervical', Descanso: 'Nocturno' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver la almohada?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo cuido la almohada?',
          a: 'Quita la funda extraíble y lávala a mano con agua fría, sin blanqueador y sin planchar. Deja secar a la sombra.',
        },
        {
          q: '¿Para qué posturas de sueño sirve?',
          a: 'Adecuada para dormir boca arriba o de lado; su estructura ergonómica distribuye la presión de la cabeza y el cuello durante el descanso.',
        },
      ],
      featured: false,
      benefits: [
        'Estructura ergonómica que distribuye la presión de la cabeza y el cuello.',
        'Acompaña la alineación natural de la columna cervical.',
        'Ayuda a reducir rigideces al despertar.',
        'Adecuada para posturas de sueño en decúbito lateral y supino.',
        'Funda extraíble que facilita su limpieza.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Retirar y lavar la funda por separado.',
        'Lavar a mano con agua fría.',
        'No usar blanqueadores ni planchar.',
        'Secar a la sombra.',
      ],
    },
    {
      slug: 'corrector-de-postura-magnetic-inpesi',
      name: 'Corrector de postura magnetic inpesi',
      category: 'fajas',
      seoTitle: 'Corrector de postura magnetic inpesi',
      seoDescription:
        'Corrector de postura con imanes para apoyar la alineación de espalda y hombros. Consulta por WhatsApp.',
      description:
        'Corrector de postura magnetic inpesi que ayuda a recordar una posición más alineada de espalda y hombros durante el día. Se coloca sobre el torso con bandas ajustables que aplican una suave tensión hacia atrás, favoreciendo una postura más erguida al estar sentado o de pie. Su diseño discreto permite usarlo bajo la ropa. Liviano y ajustable; el uso continuado se adapta al cuerpo. Producto de uso ortopédico.',
      images: [{ src: correctorPosturaImage, alt: 'Corrector de postura magnetic inpesi para espalda y hombros' }],
      price: null,
      availability: 'InStock',
      brand: 'argym',
      sku: 'COR-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: { Uso: 'Corrección postural', Ajuste: 'Bandas ajustables bajo la ropa' },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver el corrector?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la talla?',
          a: 'La medida se verifica en la ficha del producto; si tienes dudas, consulta la talla por WhatsApp antes de pedir.',
        },
        {
          q: '¿Cómo se usa el corrector de postura?',
          a: 'Se coloca sobre el torso con bandas ajustables, bajo la ropa; aplica una suave tensión hacia atrás que ayuda a recordar una posición más erguida.',
        },
      ],
      featured: true,
      benefits: [
        'Ayuda a recordar una posición más alineada de espalda y hombros.',
        'Bandas ajustables que aplican una suave tensión hacia atrás.',
        'Favorece una postura más erguida al estar sentado o de pie.',
        'Diseño discreto que se usa bajo la ropa.',
        'Liviano y ajustable; el uso continuado se adapta al cuerpo.',
      ],
      instructions: [],
      sizeGuide: [],
      care: [
        'Lavar a mano con agua fría.',
        'Usar jabón suave y no blanquear.',
        'No planchar.',
        'Secar a la sombra.',
      ],
    },
    {
      slug: 'medias-compresion-siriform',
      name: 'Medias de compresión gradual Siriform 15-20 mmHg',
      category: 'medias',
      seoTitle: 'Medias de compresión gradual Siriform 15-20 mmHg',
      seoDescription:
        'Medias elásticas de compresión gradual Siriform® 15-20 mmHg en microfibra: mejoran la circulación, reducen la fatiga y brindan confort en jornadas largas.',
      description:
        'Las medias elásticas de compresión gradual Siriform® están diseñadas para mejorar la circulación sanguínea, ayudando a prevenir la inflamación leve o moderada y a aliviar la sensación de cansancio y dolor en piernas y pies. Fabricadas con hilos de alta elasticidad y microfibra, ofrecen comodidad durante todo el día y son fáciles de colocar. Nivel de compresión: 15-20 mmHg (compresión ligera a moderada). Ideales para personas que permanecen mucho tiempo de pie, sentadas o que buscan soporte y bienestar en sus piernas.',
      images: [
        {
          src: mediasCompresionImage,
          alt: 'Par de medias elásticas de compresión gradual Siriform negras, vista frontal',
        },
      ],
      price: null,
      availability: 'InStock',
      brand: 'Siriform Therapeutic',
      sku: 'MED-001',
      registroSanitario: '',
      claseRiesgo: '',
      titularRegistro: '',
      condition: 'new',
      specs: {
        'Nivel de compresión': '15-20 mmHg (ligera a moderada)',
        Composición: '70% Nylon, 30% Lycra',
        Tipo: 'Calcetín de compresión',
        Color: 'Negro',
      },
      faq: [
        {
          q: '¿Cuánto demora el envío?',
          a: 'El plazo depende del destino y se informa antes de pagar; la entrega se coordina por WhatsApp.',
        },
        {
          q: '¿Puedo cambiar o devolver las medias?',
          a: 'Solicítalo dentro de los 10 días calendario desde el recojo o entrega. Si hay defecto de fábrica, recojo y reenvío son por nuestra cuenta; por cambio de opinión, el costo de envío lo asume el cliente.',
        },
        {
          q: '¿Cómo elijo la talla?',
          a: 'La talla se elige según el contorno de pantorrilla y tobillo, usando la tabla de la ficha; si dudas entre dos medidas, consulta por WhatsApp.',
        },
        {
          q: '¿Qué nivel de compresión tienen?',
          a: 'Son medias de compresión gradual 15-20 mmHg, de nivel ligero a moderado, en tejido de microfibra suave.',
        },
      ],
      featured: true,
      benefits: [
        'Favorece una mejor circulación sanguínea.',
        'Ayuda a reducir la hinchazón en piernas y pies.',
        'Disminuye la sensación de cansancio y fatiga.',
        'Alivia molestias ocasionadas por estar mucho tiempo de pie o sentado.',
        'Diseño cómodo para uso diario.',
        'Elaboradas con tejido de microfibra suave y resistente.',
      ],
      instructions: [
        {
          step: 1,
          text: 'Sentarse en una posición cómoda. Tomar la media e introducir el pie hasta que la punta y el talón queden correctamente ubicados.',
        },
        {
          step: 2,
          text: 'Deslizar la media hacia arriba desenrollándola sobre la pierna.',
        },
        {
          step: 3,
          text: 'Una vez colocada correctamente, verificar que no existan pliegues ni arrugas.',
        },
      ],
      sizeGuide: [
        {
          measure: 'Contorno de pantorrilla',
          rows: [
            { size: 'S', range: '38 - 46 cm' },
            { size: 'M', range: '44 - 52 cm' },
            { size: 'L', range: '51 - 58 cm' },
            { size: 'XL', range: '57 - 65 cm' },
            { size: 'XXL', range: '64 - 71 cm' },
          ],
        },
        {
          measure: 'Tobillo',
          rows: [
            { size: 'S', range: '16 - 19 cm' },
            { size: 'M', range: '19 - 22 cm' },
            { size: 'L', range: '22 - 25 cm' },
            { size: 'XL', range: '25 - 29 cm' },
            { size: 'XXL', range: '29 - 32 cm' },
          ],
        },
        {
          measure: 'Empeine / pie',
          rows: [
            { size: 'S', range: '27 - 33 cm' },
            { size: 'M', range: '29 - 36 cm' },
            { size: 'L', range: '32 - 38 cm' },
            { size: 'XL', range: '34 - 41 cm' },
            { size: 'XXL', range: '37 - 43 cm' },
          ],
        },
      ],
      care: [
        'Lavar a mano con agua fría o tibia.',
        'Utilizar jabón suave.',
        'Evitar la exposición prolongada al calor.',
        'No planchar.',
        'No usar blanqueadores.',
      ],
    },
  ],
};
