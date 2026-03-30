import { Search, Plus, Mail, Phone, Calendar, User, IdCard, Cake, Droplet, AlertCircle, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
import { Link, useNavigate } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { Badge } from '../components/Badge';

// --- Create Patient Modal (Stepper) ---
const ID_TYPES = ['DNI', 'NIE', 'Pasaporte', 'Otro'];
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'No definido'];

const STEPS = [
  { key: 'personal', label: 'Personal', icon: User },
  { key: 'contacts', label: 'Contactos', icon: Phone },
  { key: 'addresses', label: 'Direcciones', icon: Calendar },
  { key: 'medical', label: 'Médico', icon: Droplet },
  { key: 'preview', label: 'Resumen', icon: Search },
] as const;

function CreatePatientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(4);
  const [firstName, setFirstName] = useState('María');
  const [lastName, setLastName] = useState('García López');
  const [gender, setGender] = useState('Femenino');
  const [birthDate, setBirthDate] = useState('1985-05-15');
  const [idType, setIdType] = useState('DNI');
  const [idNumber, setIdNumber] = useState('');
  const [identifications, setIdentifications] = useState([{ type: 'DNI', number: '12345678A' }, { type: 'Pasaporte', number: 'ES9876543' }]);
  const [emails, setEmails] = useState<{ address: string; type: string; isPrimary: boolean }[]>([
    { address: 'maria.garcia@email.com', type: 'Personal', isPrimary: true },
    { address: 'mgarcia@empresa.com', type: 'Trabajo', isPrimary: false },
  ]);
  const [phones, setPhones] = useState<{ number: string; type: string; isPrimary: boolean }[]>([
    { number: '+34 612 345 678', type: 'Móvil', isPrimary: true },
    { number: '+34 91 234 5678', type: 'Trabajo', isPrimary: false },
  ]);
  const [addresses, setAddresses] = useState<{ street: string; city: string; postalCode: string; type: string; isPrimary: boolean }[]>([
    { street: 'Calle Mayor 123', city: 'Madrid', postalCode: '28013', type: 'Casa', isPrimary: true },
    { street: 'Av. de la Castellana 261', city: 'Madrid', postalCode: '28046', type: 'Trabajo', isPrimary: false },
  ]);
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState<{ name: string; severity: 'Leve' | 'Moderada' | 'Severa' }[]>([
    { name: 'Penicilina', severity: 'Severa' },
    { name: 'Aspirina', severity: 'Moderada' },
    { name: 'Látex', severity: 'Leve' },
  ]);
  const [isProblematic, setIsProblematic] = useState(true);

  const handleReset = () => {
    setStep(0); setFirstName(''); setLastName(''); setGender(''); setBirthDate('');
    setIdentifications([{ type: 'DNI', number: '' }]);
    setEmails([]);
    setPhones([]);
    setAddresses([]);
    setBloodType(''); setAllergies([]); setIsProblematic(false);
  };

  const handleClose = () => { handleReset(); onClose(); };
  const inputClass = "w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg"><User size={16} className="text-blue-600" /></div>
            <h2 className="text-sm font-semibold text-gray-900">Nuevo Paciente</h2>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"><X size={16} /></button>
        </div>

        {/* Stepper */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button key={s.key} onClick={() => i <= step && setStep(i)} className="flex items-center gap-2 group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-600' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`w-8 h-px mx-1 ${isDone ? 'bg-blue-300' : 'bg-gray-200'}`} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Step 1: Personal + Identificaciones */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {/* Info Personal */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-100 rounded"><User size={12} className="text-blue-600" /></div>
                  <h3 className="text-xs font-semibold text-gray-900">Información Personal</h3>
                </div>
                <div className="border rounded-xl p-3 border-gray-200 bg-white space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Apellido</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Género</label>
                    <div className="flex flex-wrap gap-1.5">
                      {GENDER_OPTIONS.map((opt) => (
                        <button key={opt} onClick={() => setGender(opt)} className={`px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${gender === opt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}><User size={10} className="text-blue-600 inline mr-0.5" />{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha de nacimiento</label>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg"><Calendar size={13} className="text-blue-600" /></div>
                      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={`flex-1 ${inputClass}`} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Identificaciones */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded"><IdCard size={12} className="text-blue-600" /></div>
                    <h3 className="text-xs font-semibold text-gray-900">Identificaciones</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{identifications.length}</span>
                  </div>
                  <button onClick={() => setIdentifications([...identifications, { type: 'DNI', number: '' }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    <Plus size={13} />Agregar
                  </button>
                </div>
                <div className="space-y-2.5">
                  {identifications.map((id, index) => (
                    <div key={index} className="group relative border rounded-xl p-3 transition-all hover:shadow-md border-gray-200 bg-white hover:border-gray-300">
                      <div className="flex items-center gap-1.5 mb-2">
                        {ID_TYPES.map((type) => (
                          <button key={type} onClick={() => { const u = [...identifications]; u[index].type = type; setIdentifications(u); }} className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${id.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            <IdCard size={10} className="text-blue-600" />{type}
                          </button>
                        ))}
                        <button onClick={() => setIdentifications(identifications.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" disabled={identifications.length === 1}><Trash2 size={13} /></button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-medium text-gray-600">Número de identificación</label>
                        <input type="text" value={id.number} onChange={(e) => { const u = [...identifications]; u[index].number = e.target.value; setIdentifications(u); }} placeholder="Ej: 12345678A" className={inputClass} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contactos (Teléfonos | Correos) */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {/* Teléfonos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded"><Phone size={12} className="text-blue-600" /></div>
                    <h3 className="text-xs font-semibold text-gray-900">Teléfonos</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{phones.length}</span>
                  </div>
                  <button onClick={() => setPhones([...phones, { number: '', type: 'Móvil', isPrimary: phones.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    <Plus size={13} />Agregar
                  </button>
                </div>
                {phones.length > 0 ? (
                  <div className="space-y-2.5">
                    {phones.map((phone, index) => (
                      <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${phone.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        {phone.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                        <div className="flex items-center gap-1.5 mb-2">
                          {['Móvil', 'Trabajo', 'Casa', 'Otro'].map((type) => (
                            <button key={type} onClick={() => { const u = [...phones]; u[index].type = type; setPhones(u); }} className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${phone.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                              <Phone size={10} className="text-blue-600" />{type}
                            </button>
                          ))}
                          <button onClick={() => setPhones(phones.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                        </div>
                        <input type="tel" value={phone.number} onChange={(e) => { const u = [...phones]; u[index].number = e.target.value; setPhones(u); }} placeholder="+34 600 000 000" className={inputClass} />
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors mt-2">
                          <input type="checkbox" checked={phone.isPrimary} onChange={() => { const u = phones.map((ph, i) => ({ ...ph, isPrimary: i === index })); setPhones(u); }} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="text-[10px] font-medium">Marcar como principal</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                    <Phone size={20} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500">Sin teléfonos agregados</p>
                  </div>
                )}
              </div>
              {/* Correos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded"><Mail size={12} className="text-blue-600" /></div>
                    <h3 className="text-xs font-semibold text-gray-900">Correos</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{emails.length}</span>
                  </div>
                  <button onClick={() => setEmails([...emails, { address: '', type: 'Personal', isPrimary: emails.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    <Plus size={13} />Agregar
                  </button>
                </div>
                {emails.length > 0 ? (
                  <div className="space-y-2.5">
                    {emails.map((email, index) => (
                      <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${email.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        {email.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                        <div className="flex items-center gap-1.5 mb-2">
                          {['Trabajo', 'Personal', 'Otro'].map((type) => (
                            <button key={type} onClick={() => { const u = [...emails]; u[index].type = type; setEmails(u); }} className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${email.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                              <Mail size={10} className="text-blue-600" />{type}
                            </button>
                          ))}
                          <button onClick={() => setEmails(emails.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                        </div>
                        <input type="email" value={email.address} onChange={(e) => { const u = [...emails]; u[index].address = e.target.value; setEmails(u); }} placeholder="correo@ejemplo.com" className={inputClass} />
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors mt-2">
                          <input type="checkbox" checked={email.isPrimary} onChange={() => { const u = emails.map((em, i) => ({ ...em, isPrimary: i === index })); setEmails(u); }} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="text-[10px] font-medium">Marcar como principal</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                    <Mail size={20} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500">Sin correos agregados</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Direcciones */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded"><Calendar size={12} className="text-blue-600" /></div>
                  <h3 className="text-xs font-semibold text-gray-900">Direcciones</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{addresses.length}</span>
                </div>
                <button onClick={() => setAddresses([...addresses, { street: '', city: '', postalCode: '', type: 'Casa', isPrimary: addresses.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <Plus size={13} />Agregar
                </button>
              </div>
              {addresses.length > 0 ? (
              <div className="space-y-2.5">
                {addresses.map((addr, index) => (
                  <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${addr.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    {addr.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex gap-1">
                        {['Casa', 'Trabajo', 'Otro'].map((type) => (
                          <button key={type} onClick={() => { const u = [...addresses]; u[index].type = type; setAddresses(u); }} className={`px-2 py-1 text-xs font-medium rounded-lg border transition-all ${addr.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{type}</button>
                        ))}
                      </div>
                      <div className="flex-1"></div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors">
                        <input type="checkbox" checked={addr.isPrimary} onChange={() => { const u = addresses.map((a, i) => ({ ...a, isPrimary: i === index })); setAddresses(u); }} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="text-[10px] font-medium">Principal</span>
                      </label>
                      <button onClick={() => setAddresses(addresses.filter((_, i) => i !== index))} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Calle y número</label>
                        <input type="text" value={addr.street} onChange={(e) => { const u = [...addresses]; u[index].street = e.target.value; setAddresses(u); }} placeholder="Av. Principal 123" className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Ciudad</label>
                          <input type="text" value={addr.city} onChange={(e) => { const u = [...addresses]; u[index].city = e.target.value; setAddresses(u); }} placeholder="Ciudad" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Código Postal</label>
                          <input type="text" value={addr.postalCode} onChange={(e) => { const u = [...addresses]; u[index].postalCode = e.target.value; setAddresses(u); }} placeholder="28001" className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                  <Calendar size={20} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-500">Sin direcciones agregadas</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Datos Médicos */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {/* Left — Tipo de Sangre + Problemático */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-100 rounded"><Droplet size={12} className="text-blue-600" /></div>
                  <h3 className="text-xs font-semibold text-gray-900">Datos Médicos</h3>
                </div>
                <div className="border rounded-xl p-3 border-gray-200 bg-white space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Tipo de Sangre</label>
                    <div className="flex flex-wrap gap-1.5">
                      {BLOOD_TYPES.map((bt) => (
                        <button key={bt} onClick={() => setBloodType(bt)} className={`px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${bloodType === bt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{bt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-gray-600">Paciente Problemático</p>
                      <p className="text-[10px] text-gray-400">Comportamiento problemático</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" checked={isProblematic} onChange={() => setIsProblematic(!isProblematic)} />
                      <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right — Alergias */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded"><AlertCircle size={12} className="text-blue-600" /></div>
                    <h3 className="text-xs font-semibold text-gray-900">Alergias</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{allergies.length}</span>
                  </div>
                  <button onClick={() => setAllergies([...allergies, { name: '', severity: 'Leve' }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    <Plus size={13} />Agregar
                  </button>
                </div>
                {allergies.length > 0 ? (
                  <div className="space-y-2.5">
                    {allergies.map((allergy, index) => (
                      <div key={index} className="group relative border rounded-xl p-3 transition-all hover:shadow-md border-gray-200 bg-white hover:border-gray-300">
                        <div className="flex items-center gap-1.5 mb-2">
                          {(['Leve', 'Moderada', 'Severa'] as const).map((sev) => {
                            const sevColors = { Leve: 'bg-green-50 border-green-200 text-green-700', Moderada: 'bg-yellow-50 border-yellow-200 text-yellow-700', Severa: 'bg-red-50 border-red-200 text-red-700' };
                            return <button key={sev} onClick={() => { const u = [...allergies]; u[index].severity = sev; setAllergies(u); }} className={`px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${allergy.severity === sev ? sevColors[sev] : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{sev}</button>;
                          })}
                          <button onClick={() => setAllergies(allergies.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                        </div>
                        <input type="text" value={allergy.name} onChange={(e) => { const u = [...allergies]; u[index].name = e.target.value; setAllergies(u); }} placeholder="Ej: Penicilina" className={inputClass} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                    <AlertCircle size={20} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500">Sin alergias registradas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Resumen */}
          {step === 4 && (
            <div className="space-y-3">
              {/* Header card */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {(firstName[0] || '') + (lastName[0] || '')}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{firstName} {lastName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {gender && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{gender}</span>}
                    {birthDate && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{new Date(birthDate).toLocaleDateString('es-ES')}</span>}
                    {bloodType && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">{bloodType}</span>}
                    {isProblematic && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Problemático</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Identificaciones */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Identificaciones</p>
                  {identifications.filter(id => id.number).length > 0 ? (
                    <div className="space-y-1">
                      {identifications.filter(id => id.number).map((id, i) => (
                        <p key={i} className="text-[10px] font-medium text-gray-900">{id.type}: {id.number}</p>
                      ))}
                    </div>
                  ) : <p className="text-[10px] text-gray-400">—</p>}
                </div>

                {/* Teléfonos */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Teléfonos</p>
                  {phones.filter(p => p.number).length > 0 ? (
                    <div className="space-y-1">
                      {phones.filter(p => p.number).map((p, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <p className="text-[10px] font-medium text-gray-900">{p.number}</p>
                          <span className="text-[10px] text-gray-400">{p.type}</span>
                          {p.isPrimary && <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">Principal</span>}
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-[10px] text-gray-400">—</p>}
                </div>

                {/* Correos */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Correos</p>
                  {emails.filter(e => e.address).length > 0 ? (
                    <div className="space-y-1">
                      {emails.filter(e => e.address).map((e, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <p className="text-[10px] font-medium text-gray-900 truncate">{e.address}</p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">{e.type}</span>
                          {e.isPrimary && <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded flex-shrink-0">Principal</span>}
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-[10px] text-gray-400">—</p>}
                </div>

                {/* Direcciones */}
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Direcciones</p>
                  {addresses.filter(a => a.street).length > 0 ? (
                    <div className="space-y-1">
                      {addresses.filter(a => a.street).map((a, i) => (
                        <div key={i}>
                          <p className="text-[10px] font-medium text-gray-900">{a.street}</p>
                          <p className="text-[10px] text-gray-500">{a.city} {a.postalCode} · {a.type} {a.isPrimary && '(Principal)'}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-[10px] text-gray-400">—</p>}
                </div>
              </div>

              {/* Alergias */}
              {allergies.filter(a => a.name).length > 0 && (
                <div className="p-2.5 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200">
                  <p className="text-[10px] text-red-600 font-medium mb-1">Alergias</p>
                  <div className="flex flex-wrap gap-1">
                    {allergies.filter(a => a.name).map((a, i) => (
                      <span key={i} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">{a.name} · {a.severity}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <span className="text-[10px] text-gray-400">Paso {step + 1} de {STEPS.length}</span>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Atrás</button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Siguiente</button>
            ) : (
              <button onClick={handleClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Crear Paciente</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ViewMode = 'cards' | 'table' | 'list';

export function Patients() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useHeader({
    title: 'Pacientes',
    subtitle: 'Gestión de pacientes',
    actions: (
      <button onClick={() => setIsCreateModalOpen(true)} className="p-1 text-white" title="Nuevo Paciente">
        <Plus size={15} />
      </button>
    ),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');

  const [morePopover, setMorePopover] = useState<{ id: number; type: 'phones' | 'emails' } | null>(null);

  useEffect(() => {
    const handleClick = () => setMorePopover(null);
    if (morePopover !== null) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [morePopover]);

  const patients = [
    { id: 1, name: 'María García', age: 45, phones: [{ number: '+1 234 567 8901', isPrimary: true }, { number: '+1 234 567 9999', isPrimary: false }], emails: [{ address: 'maria.garcia@email.com', isPrimary: true }, { address: 'mgarcia@empresa.com', isPrimary: false }], lastVisit: '2026-03-15', isProblematic: false, gender: 'F' },
    { id: 2, name: 'Juan Pérez', age: 32, phones: [{ number: '+1 234 567 8902', isPrimary: true }], emails: [{ address: 'juan.perez@email.com', isPrimary: true }], lastVisit: '2026-03-10', isProblematic: true, gender: 'M' },
    { id: 3, name: 'Ana Rodríguez', age: 28, phones: [{ number: '+1 234 567 8903', isPrimary: true }, { number: '+1 234 567 7777', isPrimary: false }, { number: '+1 234 567 6666', isPrimary: false }], emails: [{ address: 'ana.rodriguez@email.com', isPrimary: true }, { address: 'ana.r@trabajo.com', isPrimary: false }], lastVisit: '2026-03-18', isProblematic: false, gender: 'F' },
    { id: 4, name: 'Carlos Díaz', age: 51, phones: [{ number: '+1 234 567 8904', isPrimary: true }], emails: [{ address: 'carlos.diaz@email.com', isPrimary: true }, { address: 'cdiaz@hospital.com', isPrimary: false }], lastVisit: '2026-03-12', isProblematic: true, gender: 'M' },
    { id: 5, name: 'Laura Fernández', age: 38, phones: [{ number: '+1 234 567 8905', isPrimary: true }], emails: [{ address: 'laura.fernandez@email.com', isPrimary: true }], lastVisit: '2026-03-17', isProblematic: false, gender: 'F' },
  ];

  const doctors = Array.from(new Set(patients.map(p => p.doctor)));

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.emails.find(e => e.isPrimary)?.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = doctorFilter === 'all' || patient.doctor === doctorFilter;
    
    let matchesAge = true;
    if (ageRangeFilter === '0-18') matchesAge = patient.age <= 18;
    else if (ageRangeFilter === '19-35') matchesAge = patient.age >= 19 && patient.age <= 35;
    else if (ageRangeFilter === '36-50') matchesAge = patient.age >= 36 && patient.age <= 50;
    else if (ageRangeFilter === '51+') matchesAge = patient.age >= 51;
    
    return matchesSearch && matchesDoctor && matchesAge;
  });

  const hasActiveFilters = doctorFilter !== 'all' || ageRangeFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Doctor Asignado') {
      setDoctorFilter(value as string);
    } else if (filterLabel === 'Rango de Edad') {
      setAgeRangeFilter(value as string);
    }
  };

  const clearFilters = () => {
    setDoctorFilter('all');
    setAgeRangeFilter('all');
  };

  const filters = [
    {
      label: 'Doctor Asignado',
      value: 'doctor',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos los doctores' },
        ...doctors.map(d => ({ value: d, label: d })),
      ],
      selectedValue: doctorFilter,
    },
    {
      label: 'Rango de Edad',
      value: 'age',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todas las edades' },
        { value: '0-18', label: '0-18 años' },
        { value: '19-35', label: '19-35 años' },
        { value: '36-50', label: '36-50 años' },
        { value: '51+', label: '51+ años' },
      ],
      selectedValue: ageRangeFilter,
    },
  ];

  return (
    <div className="space-y-4">

      {/* Search, Filters and View Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-xs"
          />
        </div>
        
        <FilterPopover
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Patients Views */}
      {filteredPatients.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover:shadow-md transition-all">
                      {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-900 truncate">{patient.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{patient.age} años</span>
                        {patient.isProblematic && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Problemático</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Rows — fixed 2-row grid to prevent spacing inconsistency */}
                  <div className="px-4 pb-3 grid grid-rows-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Phone Row */}
                    <div className="flex items-center gap-2 h-5 relative">
                      <Phone size={11} className="text-blue-600 flex-shrink-0" />
                      <span className="text-[10px] text-gray-500 truncate flex-1 min-w-0">{patient.phones.find(p => p.isPrimary)?.number}</span>
                      {patient.phones.filter(p => !p.isPrimary).length > 0 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMorePopover(morePopover?.id === patient.id && morePopover?.type === 'phones' ? null : { id: patient.id, type: 'phones' }); }}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                          >
                            +{patient.phones.filter(p => !p.isPrimary).length} más
                          </button>
                          {morePopover?.id === patient.id && morePopover?.type === 'phones' && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                                <p className="text-[10px] font-semibold text-gray-900">Otros teléfonos</p>
                              </div>
                              <div className="p-2 space-y-1.5">
                                {patient.phones.filter(p => !p.isPrimary).map((ph, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Phone size={10} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-[10px] text-gray-700">{ph.number}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {/* Email Row */}
                    <div className="flex items-center gap-2 h-5 relative">
                      <Mail size={11} className="text-blue-600 flex-shrink-0" />
                      <span className="text-[10px] text-gray-500 truncate flex-1 min-w-0">{patient.emails.find(e => e.isPrimary)?.address}</span>
                      {patient.emails.filter(e => !e.isPrimary).length > 0 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMorePopover(morePopover?.id === patient.id && morePopover?.type === 'emails' ? null : { id: patient.id, type: 'emails' }); }}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                          >
                            +{patient.emails.filter(e => !e.isPrimary).length} más
                          </button>
                          {morePopover?.id === patient.id && morePopover?.type === 'emails' && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                                <p className="text-[10px] font-semibold text-gray-900">Otros correos</p>
                              </div>
                              <div className="p-2 space-y-1.5">
                                {patient.emails.filter(e => !e.isPrimary).map((em, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Mail size={10} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-[10px] text-gray-700 truncate">{em.address}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between rounded-b-xl">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500">Última visita</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-700">
                      {new Date(patient.lastVisit).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-white font-medium">
                      {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 truncate">{patient.name}</h3>
                    <p className="text-xs text-gray-500">{patient.emails.find(e => e.isPrimary)?.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {patient.isProblematic && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Problemático</span>
                    )}
                    <div className="text-xs text-gray-600">{patient.age} años</div>
                    <div className="text-xs text-gray-500">{new Date(patient.lastVisit).toLocaleDateString('es-ES')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Paciente</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teléfono</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Edad</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Última Visita</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/patients/${patient.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white font-medium">
                              {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">{patient.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{patient.emails.find(e => e.isPrimary)?.address}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{patient.phones.find(p => p.isPrimary)?.number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-900">{patient.age} años</span>
                      </td>
                      <td className="px-4 py-3">
                        {patient.isProblematic ? (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Problemático</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">
                          {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-xs font-medium text-gray-900 mb-1">No se encontraron pacientes</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}

      {/* Create Patient Modal */}
      <CreatePatientModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}