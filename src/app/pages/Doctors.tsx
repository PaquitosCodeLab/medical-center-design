import { Search, Plus, Mail, Phone, Calendar, Stethoscope, Users, User, IdCard, X, Trash2, GraduationCap, Award, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
import { Link, useNavigate } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { Badge } from '../components/Badge';

// --- Create Doctor Modal (Stepper) ---
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const ALL_SPECIALTIES = ['Cardiología', 'Pediatría', 'Neurología', 'Dermatología', 'Traumatología', 'Oftalmología', 'Ginecología', 'Urología', 'Oncología', 'Psiquiatría', 'Endocrinología', 'Nefrología', 'Reumatología', 'Neumología', 'Gastroenterología', 'Otra'];

const DOC_STEPS = [
  { key: 'personal', label: 'Personal', icon: User },
  { key: 'contacts', label: 'Contactos', icon: Phone },
  { key: 'addresses', label: 'Direcciones', icon: MapPin },
  { key: 'professional', label: 'Profesional', icon: Stethoscope },
  { key: 'preview', label: 'Resumen', icon: Search },
] as const;

function CreateDoctorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(4);
  const [firstName, setFirstName] = useState('Carlos');
  const [lastName, setLastName] = useState('López Ramírez');
  const [gender, setGender] = useState('Masculino');
  const [birthDate, setBirthDate] = useState('1978-03-22');
  const [licenseNumber, setLicenseNumber] = useState('MED-12345');
  const [experience, setExperience] = useState('15');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Cardiología']);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [studies, setStudies] = useState([
    { institution: 'Universidad Nacional', title: 'Especialización en Cardiología', startDate: '2008-03-01', endDate: '2010-12-15', inProgress: false },
    { institution: 'Instituto de Investigación', title: 'Doctorado en Ciencias Médicas', startDate: '2024-09-01', endDate: '', inProgress: true },
  ]);
  const [phones, setPhones] = useState<{ number: string; type: string; isPrimary: boolean }[]>([
    { number: '+34 612 345 678', type: 'Móvil', isPrimary: true },
    { number: '+34 91 234 5678', type: 'Oficina', isPrimary: false },
  ]);
  const [emails, setEmails] = useState<{ address: string; type: string; isPrimary: boolean }[]>([
    { address: 'carlos.lopez@hospital.com', type: 'Trabajo', isPrimary: true },
    { address: 'clopez@personal.com', type: 'Personal', isPrimary: false },
  ]);
  const [addresses, setAddresses] = useState<{ street: string; city: string; postalCode: string; type: string; isPrimary: boolean }[]>([
    { street: 'Av. Médica 789, Consultorio 5B', city: 'Madrid', postalCode: '28003', type: 'Trabajo', isPrimary: true },
  ]);

  const handleReset = () => {
    setStep(0); setFirstName(''); setLastName(''); setGender(''); setBirthDate('');
    setLicenseNumber(''); setExperience(''); setSelectedSpecialties([]); setSpecialtySearch('');
    setStudies([]); setPhones([]); setEmails([]); setAddresses([]);
  };
  const handleClose = () => { handleReset(); onClose(); };
  const inputClass = "w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white";
  const filteredSpecialties = ALL_SPECIALTIES.filter(s => s.toLowerCase().includes(specialtySearch.toLowerCase()) && !selectedSpecialties.includes(s));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg"><Stethoscope size={16} className="text-blue-600" /></div>
            <h2 className="text-sm font-semibold text-gray-900">Nuevo Doctor</h2>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"><X size={16} /></button>
        </div>

        {/* Stepper */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          {DOC_STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button key={s.key} onClick={() => i <= step && setStep(i)} className="flex items-center gap-2 group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-600' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</span>
                {i < DOC_STEPS.length - 1 && <div className={`w-8 h-px mx-1 ${isDone ? 'bg-blue-300' : 'bg-gray-200'}`} />}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Step 1: Personal */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
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
                        <button key={opt} onClick={() => setGender(opt)} className={`px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${gender === opt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha de nacimiento</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Número de Licencia</label>
                      <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="MED-12345" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Años de Experiencia</label>
                      <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="15" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Especialidades */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded"><Stethoscope size={12} className="text-blue-600" /></div>
                    <h3 className="text-xs font-semibold text-gray-900">Especialidades</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{selectedSpecialties.length}</span>
                  </div>
                </div>
                {selectedSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedSpecialties.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                        {s}<button onClick={() => setSelectedSpecialties(prev => prev.filter(x => x !== s))} className="text-blue-400 hover:text-blue-700"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={specialtySearch} onChange={(e) => setSpecialtySearch(e.target.value)} placeholder="Buscar especialidad..." className={`pl-7 ${inputClass}`} />
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredSpecialties.length > 0 ? filteredSpecialties.map((s) => (
                    <button key={s} onClick={() => { setSelectedSpecialties(prev => [...prev, s]); setSpecialtySearch(''); }} className="w-full px-3 py-2 text-left text-[10px] text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0">
                      <Stethoscope size={10} className="text-blue-600" />{s}
                    </button>
                  )) : (
                    <div className="px-3 py-3 text-center text-[10px] text-gray-500">{specialtySearch ? 'No encontrada' : 'Todas seleccionadas'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contactos */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><div className="p-1 bg-blue-100 rounded"><Phone size={12} className="text-blue-600" /></div><h3 className="text-xs font-semibold text-gray-900">Teléfonos</h3><span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{phones.length}</span></div>
                  <button onClick={() => setPhones([...phones, { number: '', type: 'Móvil', isPrimary: phones.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"><Plus size={13} />Agregar</button>
                </div>
                {phones.length > 0 ? <div className="space-y-2.5">{phones.map((phone, index) => (
                  <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${phone.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    {phone.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                    <div className="flex items-center gap-1.5 mb-2">
                      {['Móvil', 'Oficina', 'Casa', 'Otro'].map((type) => (<button key={type} onClick={() => { const u = [...phones]; u[index].type = type; setPhones(u); }} className={`px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${phone.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{type}</button>))}
                      <button onClick={() => setPhones(phones.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                    </div>
                    <input type="tel" value={phone.number} onChange={(e) => { const u = [...phones]; u[index].number = e.target.value; setPhones(u); }} placeholder="+34 600 000 000" className={inputClass} />
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors mt-2"><input type="checkbox" checked={phone.isPrimary} onChange={() => setPhones(phones.map((p, i) => ({ ...p, isPrimary: i === index })))} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-[10px] font-medium">Principal</span></label>
                  </div>
                ))}</div> : <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl"><Phone size={20} className="text-gray-400 mx-auto mb-2" /><p className="text-[10px] text-gray-500">Sin teléfonos</p></div>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><div className="p-1 bg-blue-100 rounded"><Mail size={12} className="text-blue-600" /></div><h3 className="text-xs font-semibold text-gray-900">Correos</h3><span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{emails.length}</span></div>
                  <button onClick={() => setEmails([...emails, { address: '', type: 'Trabajo', isPrimary: emails.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"><Plus size={13} />Agregar</button>
                </div>
                {emails.length > 0 ? <div className="space-y-2.5">{emails.map((email, index) => (
                  <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${email.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    {email.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                    <div className="flex items-center gap-1.5 mb-2">
                      {['Trabajo', 'Personal', 'Otro'].map((type) => (<button key={type} onClick={() => { const u = [...emails]; u[index].type = type; setEmails(u); }} className={`px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${email.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{type}</button>))}
                      <button onClick={() => setEmails(emails.filter((_, i) => i !== index))} className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                    </div>
                    <input type="email" value={email.address} onChange={(e) => { const u = [...emails]; u[index].address = e.target.value; setEmails(u); }} placeholder="correo@hospital.com" className={inputClass} />
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors mt-2"><input type="checkbox" checked={email.isPrimary} onChange={() => setEmails(emails.map((e, i) => ({ ...e, isPrimary: i === index })))} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-[10px] font-medium">Principal</span></label>
                  </div>
                ))}</div> : <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl"><Mail size={20} className="text-gray-400 mx-auto mb-2" /><p className="text-[10px] text-gray-500">Sin correos</p></div>}
              </div>
            </div>
          )}

          {/* Step 3: Direcciones */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><div className="p-1 bg-blue-100 rounded"><MapPin size={12} className="text-blue-600" /></div><h3 className="text-xs font-semibold text-gray-900">Direcciones</h3><span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{addresses.length}</span></div>
                <button onClick={() => setAddresses([...addresses, { street: '', city: '', postalCode: '', type: 'Trabajo', isPrimary: addresses.length === 0 }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"><Plus size={13} />Agregar</button>
              </div>
              {addresses.length > 0 ? <div className="space-y-2.5">{addresses.map((addr, index) => (
                <div key={index} className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${addr.isPrimary ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  {addr.isPrimary && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex gap-1">{['Consultorio', 'Hospital', 'Casa', 'Otro'].map((type) => (<button key={type} onClick={() => { const u = [...addresses]; u[index].type = type; setAddresses(u); }} className={`px-2 py-1 text-xs font-medium rounded-lg border transition-all ${addr.type === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{type}</button>))}</div>
                    <div className="flex-1"></div>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600"><input type="checkbox" checked={addr.isPrimary} onChange={() => setAddresses(addresses.map((a, i) => ({ ...a, isPrimary: i === index })))} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-[10px] font-medium">Principal</span></label>
                    <button onClick={() => setAddresses(addresses.filter((_, i) => i !== index))} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                  </div>
                  <div className="space-y-2">
                    <input type="text" value={addr.street} onChange={(e) => { const u = [...addresses]; u[index].street = e.target.value; setAddresses(u); }} placeholder="Av. Médica 789" className={inputClass} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={addr.city} onChange={(e) => { const u = [...addresses]; u[index].city = e.target.value; setAddresses(u); }} placeholder="Ciudad" className={inputClass} />
                      <input type="text" value={addr.postalCode} onChange={(e) => { const u = [...addresses]; u[index].postalCode = e.target.value; setAddresses(u); }} placeholder="28001" className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}</div> : <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl"><MapPin size={20} className="text-gray-400 mx-auto mb-2" /><p className="text-[10px] text-gray-500">Sin direcciones</p></div>}
            </div>
          )}

          {/* Step 4: Profesional (Estudios) */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><div className="p-1 bg-blue-100 rounded"><GraduationCap size={12} className="text-blue-600" /></div><h3 className="text-xs font-semibold text-gray-900">Estudios</h3><span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{studies.length}</span></div>
                <button onClick={() => setStudies([...studies, { institution: '', title: '', startDate: '', endDate: '', inProgress: false }])} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"><Plus size={13} />Agregar</button>
              </div>
              {studies.length > 0 ? <div className="space-y-2">{studies.map((study, index) => (
                <div key={index} className={`group relative border rounded-xl transition-all hover:shadow-md hover:border-gray-300 ${study.inProgress ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white' : 'border-gray-200 bg-white'}`}>
                  {study.inProgress && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">En curso</div>}
                  <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={study.inProgress} onChange={() => { const u = [...studies]; u[index] = { ...u[index], inProgress: !u[index].inProgress, endDate: !u[index].inProgress ? '' : u[index].endDate }; setStudies(u); }} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500" /><span className={`text-[10px] font-medium ${study.inProgress ? 'text-blue-600' : 'text-gray-500'}`}>En curso</span></label>
                    <button onClick={() => setStudies(studies.filter((_, i) => i !== index))} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                  </div>
                  <div className="px-3 pb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Institución</label><input type="text" value={study.institution} onChange={(e) => { const u = [...studies]; u[index].institution = e.target.value; setStudies(u); }} placeholder="Universidad" className={inputClass} /></div>
                      <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Título</label><input type="text" value={study.title} onChange={(e) => { const u = [...studies]; u[index].title = e.target.value; setStudies(u); }} placeholder="Especialización en..." className={inputClass} /></div>
                    </div>
                    <div className={`grid gap-2 ${study.inProgress ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha Inicio</label><input type="date" value={study.startDate} onChange={(e) => { const u = [...studies]; u[index].startDate = e.target.value; setStudies(u); }} className={inputClass} /></div>
                      {!study.inProgress && <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha Fin</label><input type="date" value={study.endDate} onChange={(e) => { const u = [...studies]; u[index].endDate = e.target.value; setStudies(u); }} className={inputClass} /></div>}
                    </div>
                  </div>
                </div>
              ))}</div> : <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl"><GraduationCap size={20} className="text-gray-400 mx-auto mb-2" /><p className="text-[10px] text-gray-500">Sin estudios</p></div>}
            </div>
          )}

          {/* Step 5: Resumen */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{(firstName[0] || '') + (lastName[0] || '')}</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Dr. {firstName} {lastName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {gender && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{gender}</span>}
                    {birthDate && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{new Date(birthDate).toLocaleDateString('es-ES')}</span>}
                    {selectedSpecialties.map(s => <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{s}</span>)}
                    {experience && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{experience} años exp.</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Licencia</p>
                  <p className="text-[10px] font-medium text-gray-900">{licenseNumber || '—'}</p>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Teléfonos</p>
                  {phones.filter(p => p.number).length > 0 ? phones.filter(p => p.number).map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5"><p className="text-[10px] font-medium text-gray-900">{p.number}</p><span className="text-[10px] text-gray-400">{p.type}</span>{p.isPrimary && <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">Principal</span>}</div>
                  )) : <p className="text-[10px] text-gray-400">—</p>}
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Correos</p>
                  {emails.filter(e => e.address).length > 0 ? emails.filter(e => e.address).map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5"><p className="text-[10px] font-medium text-gray-900 truncate">{e.address}</p><span className="text-[10px] text-gray-400 flex-shrink-0">{e.type}</span>{e.isPrimary && <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded flex-shrink-0">Principal</span>}</div>
                  )) : <p className="text-[10px] text-gray-400">—</p>}
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Direcciones</p>
                  {addresses.filter(a => a.street).length > 0 ? addresses.filter(a => a.street).map((a, i) => (
                    <div key={i}><p className="text-[10px] font-medium text-gray-900">{a.street}</p><p className="text-[10px] text-gray-500">{a.city} {a.postalCode} · {a.type} {a.isPrimary && '(Principal)'}</p></div>
                  )) : <p className="text-[10px] text-gray-400">—</p>}
                </div>
              </div>

              {studies.filter(s => s.institution).length > 0 && (
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-1">Estudios</p>
                  <div className="space-y-1.5">
                    {studies.filter(s => s.institution).map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-medium text-gray-900">{s.title}</p>
                          <p className="text-[10px] text-gray-500">{s.institution}</p>
                        </div>
                        {s.inProgress ? (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">En curso</span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                            {s.startDate && new Date(s.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} — {s.endDate && new Date(s.endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <span className="text-[10px] text-gray-400">Paso {step + 1} de {DOC_STEPS.length}</span>
          <div className="flex items-center gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Atrás</button>}
            {step < DOC_STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Siguiente</button>
            ) : (
              <button onClick={handleClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Crear Doctor</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ViewMode = 'cards' | 'table' | 'list';

export function Doctors() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useHeader({
    title: 'Doctores',
    subtitle: 'Gestión de doctores y especialistas',
    actions: (
      <button onClick={() => setIsCreateModalOpen(true)} className="p-1 text-white" title="Nuevo Doctor">
        <Plus size={15} />
      </button>
    ),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [morePopover, setMorePopover] = useState<{ id: number; type: 'phones' | 'emails' } | null>(null);

  useEffect(() => {
    const handleClick = () => setMorePopover(null);
    if (morePopover !== null) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [morePopover]);

  const doctors = [
    { id: 1, name: 'Dr. Carlos López', specialty: 'Cardiología', phones: [{ number: '+1 234 567 8901', isPrimary: true }, { number: '+1 234 567 8910', isPrimary: false }], emails: [{ address: 'carlos.lopez@hospital.com', isPrimary: true }, { address: 'clopez@personal.com', isPrimary: false }], patients: 45, status: 'Activo' as const },
    { id: 2, name: 'Dra. María Martínez', specialty: 'Pediatría', phones: [{ number: '+1 234 567 8902', isPrimary: true }], emails: [{ address: 'maria.martinez@hospital.com', isPrimary: true }], patients: 62, status: 'Activo' as const },
    { id: 3, name: 'Dr. José Sánchez', specialty: 'Neurología', phones: [{ number: '+1 234 567 8903', isPrimary: true }, { number: '+1 234 567 8911', isPrimary: false }], emails: [{ address: 'jose.sanchez@hospital.com', isPrimary: true }], patients: 38, status: 'Activo' as const },
    { id: 4, name: 'Dra. Ana Torres', specialty: 'Dermatología', phones: [{ number: '+1 234 567 8904', isPrimary: true }], emails: [{ address: 'ana.torres@hospital.com', isPrimary: true }, { address: 'atorres@clinica.com', isPrimary: false }], patients: 51, status: 'Inactivo' as const },
  ];

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const hasActiveFilters = specialtyFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Especialidad') {
      setSpecialtyFilter(value as string);
    }
  };

  const clearFilters = () => {
    setSpecialtyFilter('all');
  };

  const filters = [
    {
      label: 'Especialidad',
      value: 'specialty',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todas las especialidades' },
        ...specialties.map(s => ({ value: s, label: s })),
      ],
      selectedValue: specialtyFilter,
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
            placeholder="Buscar doctores..."
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

      {/* Doctors Views */}
      {filteredDoctors.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover:shadow-md transition-all">
                      {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-900 truncate">{doctor.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{doctor.specialty}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          doctor.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>{doctor.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Rows */}
                  <div className="px-4 pb-3 grid grid-rows-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Phone Row */}
                    <div className="flex items-center gap-2 h-5 relative">
                      <Phone size={11} className="text-blue-600 flex-shrink-0" />
                      <span className="text-[10px] text-gray-500 truncate flex-1 min-w-0">{doctor.phones.find(p => p.isPrimary)?.number}</span>
                      {doctor.phones.filter(p => !p.isPrimary).length > 0 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMorePopover(morePopover?.id === doctor.id && morePopover?.type === 'phones' ? null : { id: doctor.id, type: 'phones' }); }}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                          >
                            +{doctor.phones.filter(p => !p.isPrimary).length} más
                          </button>
                          {morePopover?.id === doctor.id && morePopover?.type === 'phones' && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                                <p className="text-[10px] font-semibold text-gray-900">Otros teléfonos</p>
                              </div>
                              <div className="p-2 space-y-1.5">
                                {doctor.phones.filter(p => !p.isPrimary).map((ph, i) => (
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
                      <span className="text-[10px] text-gray-500 truncate flex-1 min-w-0">{doctor.emails.find(e => e.isPrimary)?.address}</span>
                      {doctor.emails.filter(e => !e.isPrimary).length > 0 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMorePopover(morePopover?.id === doctor.id && morePopover?.type === 'emails' ? null : { id: doctor.id, type: 'emails' }); }}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                          >
                            +{doctor.emails.filter(e => !e.isPrimary).length} más
                          </button>
                          {morePopover?.id === doctor.id && morePopover?.type === 'emails' && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                                <p className="text-[10px] font-semibold text-gray-900">Otros correos</p>
                              </div>
                              <div className="p-2 space-y-1.5">
                                {doctor.emails.filter(e => !e.isPrimary).map((em, i) => (
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
                      <Users size={10} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500">Pacientes</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-700">{doctor.patients} activos</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/doctors/${doctor.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold">
                      {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{doctor.patients} pacientes</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      doctor.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>{doctor.status}</span>
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
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Doctor</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Especialidad</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teléfono</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pacientes</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/doctors/${doctor.id}`)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold">
                              {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{doctor.specialty}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{doctor.phones.find(p => p.isPrimary)?.number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">{doctor.emails.find(e => e.isPrimary)?.address}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-900">{doctor.patients}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          doctor.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>{doctor.status}</span>
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
          <h3 className="text-xs font-medium text-gray-900 mb-1">No se encontraron doctores</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}

      <CreateDoctorModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
