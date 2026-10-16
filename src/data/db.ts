import fajaSacroLumbarImage from '../assets/products/faja-sacro-lumbar.webp';
import inmovilizadorRodillaImage from '../assets/products/inmovilizador-de-rodilla-argym.webp';
import cabestrilloHombroImage from '../assets/products/cabestrillo-inmovilizador-de-hombro-argymsport.webp';
import sillaRuedasImage from '../assets/products/silla-de-ruedas.webp';
import baston4Image from '../assets/products/baston-4-soportes.webp';
import baston3Image from '../assets/products/baston-3-soportes.webp';
import almohadaOrtopedicaImage from '../assets/products/almohada-ortopedica.webp';
import correctorPosturaImage from '../assets/products/corrector-de-postura-magnetic-inpesi.webp';
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
  ],
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
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'FAJ-001',
      condition: 'new',
      specs: { Uso: 'Soporte sacrolumbar', Ajuste: 'Envoltorio con compresión' },
      featured: true,
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
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'INM-001',
      condition: 'new',
      specs: { Uso: 'Sujeción de rodilla', Ajuste: 'Bandas ajustables' },
      featured: true,
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
      availability: 'InStock',
      brand: 'argymsport',
      sku: 'INM-002',
      condition: 'new',
      specs: { Uso: 'Inmovilización de hombro', Ajuste: 'Regulable, ambos lados' },
      featured: true,
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
      availability: 'InStock',
      sku: 'SRU-001',
      condition: 'new',
      specs: { Uso: 'Movilidad diaria', Tipo: 'Manual' },
      featured: false,
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
      availability: 'InStock',
      sku: 'BAS-001',
      condition: 'new',
      specs: { Base: '4 puntos', Uso: 'Marcha asistida' },
      featured: false,
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
      availability: 'InStock',
      sku: 'BAS-002',
      condition: 'new',
      specs: { Base: '3 puntos', Uso: 'Marcha asistida' },
      featured: false,
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
      availability: 'InStock',
      sku: 'ALM-001',
      condition: 'new',
      specs: { Uso: 'Soporte cervical', Descanso: 'Nocturno' },
      featured: false,
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
      availability: 'InStock',
      brand: 'argym',
      sku: 'COR-001',
      condition: 'new',
      specs: { Uso: 'Corrección postural', Ajuste: 'Bandas ajustables bajo la ropa' },
      featured: true,
    },
  ],
};
