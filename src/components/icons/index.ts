// Registro único de iconos (§ árbol de componentes).
// - Los datos de página (services, trustItems, points, channels) referencian el
//   icono por su clave tipada `IconName`; los renderers hacen icons[clave].
// - Los usos de un solo icono (menú, chevron, WhatsApp…) importan el componente
//   directo y no pasan por este registro.
import Activity from './Activity.astro';
import Check from './Check.astro';
import ChevronDown from './ChevronDown.astro';
import ClipboardCheck from './ClipboardCheck.astro';
import Clock from './Clock.astro';
import FileAlert from './FileAlert.astro';
import Mail from './Mail.astro';
import Menu from './Menu.astro';
import MessageCircle from './MessageCircle.astro';
import PhoneCall from './PhoneCall.astro';
import Ruler from './Ruler.astro';
import Receipt from './Receipt.astro';
import ShieldCheck from './ShieldCheck.astro';
import UserCheck from './UserCheck.astro';
import Whatsapp from './Whatsapp.astro';

export const icons = {
  activity: Activity,
  check: Check,
  'chevron-down': ChevronDown,
  'clipboard-check': ClipboardCheck,
  clock: Clock,
  'file-alert': FileAlert,
  mail: Mail,
  menu: Menu,
  'message-circle': MessageCircle,
  'phone-call': PhoneCall,
  receipt: Receipt,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  'user-check': UserCheck,
  whatsapp: Whatsapp,
} as const;

export type IconName = keyof typeof icons;
