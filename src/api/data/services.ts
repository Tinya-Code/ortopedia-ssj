import type { Service } from '../types';
import { categoryWhatsappMessage, whatsappLink } from '../../lib/whatsapp';
import evaluacionImage from '../../assets/services/evaluacion-ortopedica.jpeg';
import ortesisImage from '../../assets/services/ortesis-a-medida.jpeg';
import rehabilitacionImage from '../../assets/services/rehabilitacion-asesoria.jpeg';

/**
 * Datos crudos de servicios (rama `repo` de la bandera de src/api):
 * mock de GET /services con la MISMA forma del JSON remoto, validada por TS
 * con la anotación `: Service[]`.
 * Las páginas NO importan este módulo: usan `api.services.*`, nunca el mock.
 *
 * `href` se calcula aquí (capa de datos) con whatsappLink(), no viaja crudo
 * del API. Los textos fueron extraídos de src/pages/servicios.astro.
 */
export const services: Service[] = [
  {
    slug: 'evaluacion-ortopedica',
    title: 'Evaluación Ortopédica',
    description:
      'Analizamos la distribución de presiones de tu pisada, la alineación corporal y tu dinámica de marcha mediante tecnología baropodométrica y evaluación clínica directa. Este estudio identifica el origen biomecánico de tus dolores o sobrecargas, permitiéndonos formular soluciones ortopédicas a tu medida antes de que se conviertan en patologías crónicas.',
    cases: [
      'Dolor constante en talones, planta, rodillas o zona lumbar al caminar o estar de pie.',
      'Diagnóstico de pie plano, cavo, espolón o fascitis plantar recurrente.',
      'Desgaste irregular y acelerado en las suelas del calzado.',
      'Prevención de lesiones y mejora de rendimiento en deportistas y personas activas.',
    ],
    solution: {
      items: [
        { label: 'Alineación', text: 'Corrige tu postura equilibrando el centro de gravedad desde la pisada.' },
        { label: 'Alivio articular', text: 'Disipa el impacto en tobillos, rodillas y columna.' },
        { label: 'Cero fatiga', text: 'Menor desgaste muscular durante todo el día.' },
      ],
    },
    points: [
      { icon: 'user-check', label: 'Corrección de Apoyo' },
      { icon: 'clock', label: 'Resultados en Sesión Única' },
    ],
    href: whatsappLink(categoryWhatsappMessage('Evaluación Biomecánica y Estudio de la Pisada')),
    image: evaluacionImage,
    imageAlt: 'Ortopedista evaluando el pie de un paciente durante una valoración',
    accent: '#ffffff',
    reverse: false,
  },
  {
    slug: 'ortesis-a-medida',
    title: 'Órtesis a medida',
    description:
      'Una ayuda técnica mal ajustada puede generar lesiones secundarias, dolores de espalda o caídas. Nuestro equipo especializado se encarga de regular con precisión la altura de bastones y andadores, calibrar componentes en sillas de ruedas y verificar el acople de órtesis a la fisonomía exacta de cada usuario.',
    cases: [
      'Nuevo bastón, andador o silla de ruedas que requiere calibración a tu estatura y peso.',
      'Molestias en muñecas, hombros o cuello por uso de apoyos desajustados.',
      'Rehabilitación posquirúrgica que demanda reajustes continuos según tu evolución.',
      'Inestabilidad, tropiezos o inseguridad al usar tu equipo actual.',
    ],
    solution: {
      items: [
        { label: 'Seguridad', text: 'Previene tropiezos, pérdidas de balance y caídas accidentales.' },
        { label: 'Ergonomía', text: 'Elimina tensiones parásitas en brazos y espalda por apoyos desnivelados.' },
        { label: 'Independencia', text: 'Menos energía por traslado y más libertad de movimiento.' },
      ],
    },
    points: [
      { icon: 'ruler', label: 'Ajuste Antropométrico' },
      { icon: 'shield-check', label: 'Prevención de Caídas' },
    ],
    href: whatsappLink(categoryWhatsappMessage('Calibración, Ajuste y Adaptación de Ayudas Técnicas')),
    image: ortesisImage,
    imageAlt: 'Ajuste de una ortesis a medida en la pierna de un paciente infantil',
    accent: 'rgba(113, 192, 226, 0.10)',
    reverse: true,
  },
  {
    slug: 'rehabilitacion-asesoria',
    title: 'Rehabilitación y Asesoría',
    description:
      'Servicio técnico especializado orientado al cuidado, reparación y puesta a punto de sillas de ruedas estándar, semideportivas y de traslado. Inspeccionamos sistemas de rodamientos, alineación de ejes, tensión de frenos, estado de neumáticos y lubricación de crucetas de plegado, garantizando que el equipo funcione siempre con la máxima suavidad y total fiabilidad mecánica.',
    cases: [
      'La silla de ruedas presenta rigidez o resistencia anormal al empujar o rodar.',
      'Frenos descalibrados, flojos o con respuesta deficiente en pendientes y transferencias.',
      'Ruidos estructurales, holgura en las ruedas directrices o dificultad para plegar el chasis.',
      'Equipos con más de 6 meses de uso intensivo sin revisión técnica preventiva.',
    ],
    solution: {
      items: [
        { label: 'Menor esfuerzo', text: 'Un rodaje lubricado y alineado reduce la fuerza que debes aplicar.' },
        { label: 'Mayor vida útil', text: 'Previene roturas prematuras de piezas costosas.' },
        { label: 'Continuidad', text: 'Traslados seguros sin paradas imprevistas ni accidentes.' },
      ],
    },
    points: [
      { icon: 'clipboard-check', label: 'Servicio Técnico Certificado' },
      { icon: 'ruler', label: 'Alineación y Frenos' },
    ],
    href: whatsappLink(categoryWhatsappMessage('Mantenimiento Preventivo y Optimización de Sillas de Ruedas')),
    image: rehabilitacionImage,
    imageAlt: 'Profesional ajustando una férula de rodilla a una paciente en rehabilitación',
    accent: '#ffffff',
    reverse: false,
  },
];
