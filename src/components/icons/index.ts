// Registro único de iconos (§ árbol de componentes).
// - Los datos de página (services, trustItems, points, channels) referencian el
//   icono por su clave tipada `IconName`; los renderers hacen icons[clave].
// - Los usos de un solo icono (menú, chevron, WhatsApp…) importan el componente
//   directo y no pasan por este registro.
import Activity from './Activity.astro';
import Facebook from './Facebook.astro';
import ArrowRight from './ArrowRight.astro';
import Cart from './Cart.astro';
import Check from './Check.astro';
import ChevronDown from './ChevronDown.astro';
import ClipboardCheck from './ClipboardCheck.astro';
import Clock from './Clock.astro';
import FileAlert from './FileAlert.astro';
import Globe from './Globe.astro';
import Instagram from './Instagram.astro';
import Mail from './Mail.astro';
import MapPin from './MapPin.astro';
import Menu from './Menu.astro';
import MessageCircle from './MessageCircle.astro';
import Package from './Package.astro';
import PhoneCall from './PhoneCall.astro';
import RotateCcw from './RotateCcw.astro';
import Ruler from './Ruler.astro';
import Receipt from './Receipt.astro';
import Search from './Search.astro';
import ShieldCheck from './ShieldCheck.astro';
import Star from './Star.astro';
import TikTok from './TikTok.astro';
import Trash from './Trash.astro';
import Truck from './Truck.astro';
import UserCheck from './UserCheck.astro';
import Whatsapp from './Whatsapp.astro';
import X from './X.astro';

export const icons = {
  activity: Activity,
  'arrow-right': ArrowRight,
  facebook: Facebook,
  cart: Cart,
  check: Check,
  'chevron-down': ChevronDown,
  'clipboard-check': ClipboardCheck,
  clock: Clock,
  'file-alert': FileAlert,
  globe: Globe,
  instagram: Instagram,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  'message-circle': MessageCircle,
  package: Package,
  'phone-call': PhoneCall,
  receipt: Receipt,
  'rotate-ccw': RotateCcw,
  ruler: Ruler,
  search: Search,
  'shield-check': ShieldCheck,
  star: Star,
  tiktok: TikTok,
  trash: Trash,
  truck: Truck,
  'user-check': UserCheck,
  whatsapp: Whatsapp,
  x: X,
} as const;

export type IconName = keyof typeof icons;
