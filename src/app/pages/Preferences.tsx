import { Settings, Globe, Moon, PanelLeftClose, Lock, Eye, EyeOff, Bell, Mail, Smartphone, X } from 'lucide-react';
import { useState } from 'react';
import { useSidebar } from '../components/SidebarContext';
import { useTheme } from '../components/ThemeContext';
import { Badge } from '../components/Badge';

// --- Notification Config Modal ---
const emailNotifItems = [
  { key: 'citasNuevas', label: 'Citas nuevas', desc: 'Cuando se agenda una nueva cita' },
  { key: 'citasCanceladas', label: 'Citas canceladas', desc: 'Cuando se cancela una cita' },
  { key: 'recordatorios', label: 'Recordatorios', desc: 'Recordatorios de citas próximas' },
  { key: 'reportes', label: 'Reportes', desc: 'Resúmenes y reportes periódicos' },
  { key: 'actualizacionesSistema', label: 'Actualizaciones', desc: 'Mantenimientos y nuevas funciones' },
];

const appNotifItems = [
  { key: 'citasNuevas', label: 'Citas nuevas', desc: 'Cuando se agenda una nueva cita' },
  { key: 'citasCanceladas', label: 'Citas canceladas', desc: 'Cuando se cancela una cita' },
  { key: 'recordatorios', label: 'Recordatorios', desc: 'Recordatorios de citas próximas' },
  { key: 'mensajes', label: 'Mensajes', desc: 'Mensajes internos del equipo' },
  { key: 'actualizacionesSistema', label: 'Actualizaciones', desc: 'Mantenimientos y nuevas funciones' },
];

function NotifConfigModal({ type, onClose }: { type: 'email' | 'app' | null; onClose: () => void }) {
  const items = type === 'email' ? emailNotifItems : appNotifItems;
  const defaults = type === 'email'
    ? { citasNuevas: true, citasCanceladas: true, recordatorios: false, reportes: true, actualizacionesSistema: false }
    : { citasNuevas: true, citasCanceladas: true, recordatorios: true, mensajes: true, actualizacionesSistema: true };
  const [values, setValues] = useState<Record<string, boolean>>(defaults);

  if (!type) return null;

  const toggle = (key: string) => setValues(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-80 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              {type === 'email' ? <Mail size={16} className="text-blue-600" /> : <Smartphone size={16} className="text-blue-600" />}
            </div>
            <h2 className="text-sm font-semibold text-gray-900">{type === 'email' ? 'Correo Electrónico' : 'En la Aplicación'}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-[10px] font-medium text-gray-900">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" className="sr-only peer" checked={values[item.key] ?? false} onChange={() => toggle(item.key)} />
                <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={onClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// --- Change Password Modal ---
function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-80 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg"><Lock size={16} className="text-blue-600" /></div>
            <h2 className="text-sm font-semibold text-gray-900">Cambiar Contraseña</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-gray-600 mb-1">Contraseña Actual</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Ingresa tu contraseña actual" className="w-full px-2.5 py-1.5 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-600 mb-1">Nueva Contraseña</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" className="w-full px-2.5 py-1.5 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-600 mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repite la nueva contraseña" className="w-full px-2.5 py-1.5 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
            <p className="text-[10px] font-medium text-gray-700 mb-1">Requisitos:</p>
            <ul className="text-[10px] text-gray-500 space-y-0.5 list-disc list-inside">
              <li>Mínimo 8 caracteres</li>
              <li>Diferente a la contraseña actual</li>
              <li>Mayúsculas, minúsculas, números y símbolos</li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={onClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Cambiar</button>
        </div>
      </div>
    </div>
  );
}

// --- Toggle Switch Component ---
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
}

export function Preferences() {
  const { collapsed: compactSidebar, setCollapsed: setCompactSidebar } = useSidebar();
  const { darkMode, setDarkMode } = useTheme();
  const [appColor, setAppColor] = useState('blue');
  const [fontSize, setFontSize] = useState('sm');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [notifModalType, setNotifModalType] = useState<'email' | 'app' | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Preferencias</h1>
        <p className="text-[10px] text-gray-500">Configuración general del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* General */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Settings size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">General</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre del Sistema</label>
              <input
                type="text"
                defaultValue="Sistema Médico"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-600 mb-1">Idioma</label>
              <select className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all bg-white">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visualización */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Moon size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Visualización</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Tema Oscuro</p>
                <p className="text-[10px] text-gray-500">Activar modo oscuro</p>
              </div>
              <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>
            <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Sidebar Compacto</p>
                <p className="text-[10px] text-gray-500">Reducir el ancho del menú lateral</p>
              </div>
              <Toggle checked={compactSidebar} onChange={() => setCompactSidebar(!compactSidebar)} />
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Tamaño de Letra</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[
                  { key: 'sm', label: 'A', size: 'text-[9px]' },
                  { key: 'md', label: 'A', size: 'text-[11px]' },
                  { key: 'lg', label: 'A', size: 'text-[13px]' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setFontSize(opt.key)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold transition-all ${
                      fontSize === opt.key
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                    } ${opt.size}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App Color */}
            <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
              <div>
                <p className="text-[10px] font-medium text-gray-900">Color</p>
              </div>
              <div className="flex items-center gap-1">
                {[
                  { key: 'blue', color: '#3b82f6' },
                  { key: 'indigo', color: '#6366f1' },
                  { key: 'violet', color: '#8b5cf6' },
                  { key: 'emerald', color: '#10b981' },
                  { key: 'teal', color: '#14b8a6' },
                  { key: 'rose', color: '#f43f5e' },
                  { key: 'orange', color: '#f97316' },
                  { key: 'slate', color: '#64748b' },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setAppColor(c.key)}
                    className={`w-4 h-4 rounded-full transition-all ${appColor === c.key && appColor !== 'custom' ? 'ring-2 ring-offset-1 ring-gray-900 scale-125' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
                <button
                  onClick={() => setIsColorPickerOpen(true)}
                  className={`w-4 h-4 rounded-full transition-all bg-gradient-to-br from-red-400 via-green-400 to-blue-500 ${appColor === 'custom' ? 'ring-2 ring-offset-1 ring-gray-900 scale-125' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Lock size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Seguridad</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Lock size={14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-900">Cambiar Contraseña</p>
                <p className="text-[10px] text-gray-500">Última vez: hace 15 días</p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Cambiar
              </button>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Bell size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Notificaciones</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Mail size={14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-900">Correo Electrónico</p>
                <p className="text-[10px] text-gray-500">Recibe notificaciones por email</p>
              </div>
              <Badge variant="blue" size="sm">3 activas</Badge>
              <button onClick={() => setNotifModalType('email')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings size={13} />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Smartphone size={14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-900">En la Aplicación</p>
                <p className="text-[10px] text-gray-500">Notificaciones dentro del sistema</p>
              </div>
              <Badge variant="blue" size="sm">5 activas</Badge>
              <button onClick={() => setNotifModalType('app')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NotifConfigModal type={notifModalType} onClose={() => setNotifModalType(null)} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

      {/* Color Picker Modal */}
      {isColorPickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-72 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: customColor + '20' }}>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: customColor }}></div>
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Color Personalizado</h2>
              </div>
              <button onClick={() => setIsColorPickerOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Preview */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl shadow-inner" style={{ backgroundColor: customColor }}></div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-600 mb-1">HEX</p>
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Color Slider */}
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-1">Color</p>
                <input
                  type="range" min="0" max="360"
                  value={(() => { const r = parseInt(customColor.slice(1,3),16)/255, g = parseInt(customColor.slice(3,5),16)/255, b = parseInt(customColor.slice(5,7),16)/255; const max = Math.max(r,g,b), min = Math.min(r,g,b); let h = 0; if (max !== min) { const d = max-min; if (max===r) h=((g-b)/d+(g<b?6:0))/6; else if (max===g) h=((b-r)/d+2)/6; else h=((r-g)/d+4)/6; } return Math.round(h*360); })()}
                  onChange={(e) => {
                    const h = parseInt(e.target.value)/360, s = 0.7, l = 0.55;
                    const hue2rgb = (p: number, q: number, t: number) => { if (t<0) t+=1; if (t>1) t-=1; if (t<1/6) return p+(q-p)*6*t; if (t<1/2) return q; if (t<2/3) return p+(q-p)*(2/3-t)*6; return p; };
                    const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
                    const r = Math.round(hue2rgb(p,q,h+1/3)*255), g = Math.round(hue2rgb(p,q,h)*255), b = Math.round(hue2rgb(p,q,h-1/3)*255);
                    setCustomColor(`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`);
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
                />
              </div>

              {/* Shade Slider */}
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-1">Tono</p>
                <input
                  type="range" min="20" max="80"
                  value={(() => { const r = parseInt(customColor.slice(1,3),16)/255, g = parseInt(customColor.slice(3,5),16)/255, b = parseInt(customColor.slice(5,7),16)/255; const max = Math.max(r,g,b), min = Math.min(r,g,b); return Math.round(((max+min)/2)*100); })()}
                  onChange={(e) => {
                    const l = parseInt(e.target.value)/100;
                    const r2 = parseInt(customColor.slice(1,3),16)/255, g2 = parseInt(customColor.slice(3,5),16)/255, b2 = parseInt(customColor.slice(5,7),16)/255;
                    const max = Math.max(r2,g2,b2), min = Math.min(r2,g2,b2);
                    let h = 0; if (max !== min) { const d = max-min; if (max===r2) h=((g2-b2)/d+(g2<b2?6:0))/6; else if (max===g2) h=((b2-r2)/d+2)/6; else h=((r2-g2)/d+4)/6; }
                    const s = 0.7;
                    const hue2rgb = (p: number, q: number, t: number) => { if (t<0) t+=1; if (t>1) t-=1; if (t<1/6) return p+(q-p)*6*t; if (t<1/2) return q; if (t<2/3) return p+(q-p)*(2/3-t)*6; return p; };
                    const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
                    const r = Math.round(hue2rgb(p,q,h+1/3)*255), g = Math.round(hue2rgb(p,q,h)*255), b = Math.round(hue2rgb(p,q,h-1/3)*255);
                    setCustomColor(`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`);
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #000 0%, ${customColor} 50%, #fff 100%)` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setIsColorPickerOpen(false)} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
              <button onClick={() => { setAppColor('custom'); setIsColorPickerOpen(false); }} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
