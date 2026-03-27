import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, Clock, MoreVertical, Edit, Trash2, Shield, GraduationCap, Award, Stethoscope, Building, MapPin, User, IdCard, Cake, FileText, X, Plus, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
import { Badge } from '../components/Badge';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { EditContactsModal, type ContactsData } from '../components/EditContactsModal';
import { EditAddressesModal, type AddressesData } from '../components/EditAddressesModal';
import { Modal, ModalButton } from '../components/Modal';

// --- Cita Detail Modal ---
function CitaDetailModal({ record, onClose }: { record: { id: number; patient: string; time: string; date: string; type: string; status: string; notes: string; observation: string } | null; onClose: () => void }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FileText size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Detalle de Cita</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Unified Info Row */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
              <span className="text-sm font-bold text-gray-900 leading-none">{new Date(record.date).getDate()}</span>
              <span className="text-[9px] text-gray-500 uppercase">{new Date(record.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
            </div>
            <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-900">{record.type} · {record.notes}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><User size={10} />{record.patient}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{record.time}</span>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${record.status === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span>
            </div>
          </div>

          {/* Observación */}
          {record.observation ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-100 rounded">
                  <FileText size={12} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Observación de la Cita</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{record.observation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 border border-dashed border-gray-300 rounded-xl">
              <FileText size={16} className="text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-500">Sin observaciones registradas</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// --- Edit Doctor Modal ---
const ALL_SPECIALTIES = ['Cardiología', 'Pediatría', 'Neurología', 'Dermatología', 'Traumatología', 'Oftalmología', 'Ginecología', 'Urología', 'Oncología', 'Psiquiatría', 'Endocrinología', 'Nefrología', 'Reumatología', 'Neumología', 'Gastroenterología', 'Otra'];
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

function EditDoctorModal({ isOpen, onClose, doctor }: { isOpen: boolean; onClose: () => void; doctor: { name: string; specialty: string; birthDate: string; gender: string; licenseNumber: string; experience: string } }) {
  const parts = doctor.name.replace(/^(Dr\.|Dra\.)\s*/, '').split(' ');
  const [firstName, setFirstName] = useState(parts[0] || '');
  const [lastName, setLastName] = useState(parts.slice(1).join(' ') || '');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([doctor.specialty]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [birthDate, setBirthDate] = useState(doctor.birthDate);
  const [gender, setGender] = useState(doctor.gender);
  const [licenseNumber, setLicenseNumber] = useState(doctor.licenseNumber);
  const [experience, setExperience] = useState(doctor.experience);

  useEffect(() => {
    const p = doctor.name.replace(/^(Dr\.|Dra\.)\s*/, '').split(' ');
    setFirstName(p[0] || ''); setLastName(p.slice(1).join(' ') || '');
    setSelectedSpecialties([doctor.specialty]); setBirthDate(doctor.birthDate);
    setGender(doctor.gender); setLicenseNumber(doctor.licenseNumber); setExperience(doctor.experience);
  }, [doctor]);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setSpecialtySearch('');
  };

  const filteredSpecialties = ALL_SPECIALTIES.filter(s =>
    s.toLowerCase().includes(specialtySearch.toLowerCase()) && !selectedSpecialties.includes(s)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg"><User size={16} className="text-blue-600" /></div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Doctor</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left — Info Personal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-blue-100 rounded"><User size={12} className="text-blue-600" /></div>
                <h3 className="text-xs font-semibold text-gray-900">Información Personal</h3>
              </div>
              <div className="border rounded-xl p-3 border-gray-200 bg-white space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Apellido</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Género</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {GENDER_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => setGender(opt)} className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${gender === opt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        <User size={10} className="text-blue-600" /><span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Fecha de nacimiento</label>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg"><Calendar size={13} className="text-blue-600" /></div>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Número de Licencia</label>
                    <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="MED-12345" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Años de Experiencia</label>
                    <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="15" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                </div>
              </div>
            </div>
            {/* Right — Especialidades */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded"><Stethoscope size={12} className="text-blue-600" /></div>
                  <h3 className="text-xs font-semibold text-gray-900">Especialidades</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{selectedSpecialties.length}</span>
                </div>
              </div>

              {/* Selected */}
              {selectedSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedSpecialties.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                      {s}
                      <button onClick={() => toggleSpecialty(s)} className="text-blue-400 hover:text-blue-700 transition-colors"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                  placeholder="Buscar especialidad..."
                  className="w-full pl-7 pr-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                />
              </div>

              {/* Options */}
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSpecialty(s)}
                      className="w-full px-3 py-2 text-left text-[10px] text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0"
                    >
                      <Stethoscope size={10} className="text-blue-600 flex-shrink-0" />
                      {s}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-center text-[10px] text-gray-500">
                    {specialtySearch ? 'No se encontraron especialidades' : 'Todas las especialidades seleccionadas'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={onClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// --- Edit Studies Modal ---
interface Study { institution: string; title: string; startDate: string; endDate: string; inProgress: boolean }

function EditStudiesModal({ isOpen, onClose, studies: initial, onSave }: { isOpen: boolean; onClose: () => void; studies: Study[]; onSave: (s: Study[]) => void }) {
  const [items, setItems] = useState<Study[]>(initial);
  useEffect(() => { setItems(initial); }, [initial]);

  const handleAdd = () => setItems([...items, { institution: '', title: '', startDate: '', endDate: '', inProgress: false }]);
  const handleRemove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const handleChange = (i: number, field: keyof Study, value: string) => {
    const updated = [...items]; updated[i][field] = value; setItems(updated);
  };
  const handleCancel = () => { setItems(initial); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg"><GraduationCap size={16} className="text-blue-600" /></div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Estudios</h2>
          </div>
          <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded"><GraduationCap size={12} className="text-blue-600" /></div>
              <h3 className="text-xs font-semibold text-gray-900">Estudios</h3>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{items.length}</span>
            </div>
            <button onClick={handleAdd} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
              <Plus size={13} /><span>Agregar</span>
            </button>
          </div>
          <div className="space-y-2">
            {items.map((study, index) => (
              <div key={index} className={`group relative border rounded-xl transition-all hover:shadow-md hover:border-gray-300 ${study.inProgress ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white' : 'border-gray-200 bg-white'}`}>
                {/* In progress badge */}
                {study.inProgress && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">En curso</div>
                )}
                {/* Top bar: icon + toggle + delete */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={study.inProgress} onChange={() => { const u = [...items]; u[index] = { ...u[index], inProgress: !u[index].inProgress, endDate: !u[index].inProgress ? '' : u[index].endDate }; setItems(u); }} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500" />
                    <span className={`text-[10px] font-medium ${study.inProgress ? 'text-blue-600' : 'text-gray-500'}`}>En curso</span>
                  </label>
                  <button onClick={() => handleRemove(index)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" disabled={items.length === 1}><Trash2 size={13} /></button>
                </div>
                {/* Fields */}
                <div className="px-3 pb-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Institución</label>
                      <input type="text" value={study.institution} onChange={(e) => handleChange(index, 'institution', e.target.value)} placeholder="Universidad Nacional" className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Título</label>
                      <input type="text" value={study.title} onChange={(e) => handleChange(index, 'title', e.target.value)} placeholder="Especialización en..." className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white" />
                    </div>
                  </div>
                  <div className={`grid gap-2 ${study.inProgress ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha Inicio</label>
                      <input type="date" value={study.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white" />
                    </div>
                    {!study.inProgress && (
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Fecha Fin</label>
                        <input type="date" value={study.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2"><GraduationCap size={20} className="text-gray-400" /></div>
              <p className="text-xs text-gray-600 mb-2">No hay estudios registrados</p>
              <button onClick={handleAdd} className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">Agregar estudio</button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={handleCancel} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={() => { onSave(items.filter(s => s.institution.trim())); onClose(); }} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

export function DoctorDetail() {
  useHeader({ title: 'Detalle del Doctor', subtitle: 'Información completa y actividad del doctor', backTo: '/doctors' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [isEditStudiesModalOpen, setIsEditStudiesModalOpen] = useState(false);
  const [isEditContactsModalOpen, setIsEditContactsModalOpen] = useState(false);
  const [isEditAddressesModalOpen, setIsEditAddressesModalOpen] = useState(false);
  const [pacientesPeriod, setPacientesPeriod] = useState<'7d' | '1m' | '1y'>('7d');
  const [especialidadPeriod, setEspecialidadPeriod] = useState<'7d' | '1m' | '1y'>('7d');
  const [studies, setStudies] = useState<Study[]>([
    { institution: 'Universidad Nacional', title: 'Especialización en Cardiología', startDate: '2008-03-01', endDate: '2010-12-15', inProgress: false },
    { institution: 'Hospital Universitario', title: 'Residencia en Medicina Interna', startDate: '2003-01-10', endDate: '2006-06-30', inProgress: false },
    { institution: 'Instituto de Investigación Cardiovascular', title: 'Doctorado en Ciencias Médicas', startDate: '2024-09-01', endDate: '', inProgress: true },
  ]);
  const menuRef = useRef<HTMLDivElement>(null);
  const infoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) setShowInfoMenu(false);
    };

    if (showMenu || showInfoMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showInfoMenu]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getPhoneTypeIcon = (_type: string) => <Phone size={14} className="text-blue-600" />;
  const getEmailTypeIcon = (_type: string) => <Mail size={14} className="text-blue-600" />;
  const getAddressTypeIcon = (_type: string) => <MapPin size={14} className="text-blue-600" />;

  const doctor = {
    id,
    name: 'Dr. Carlos López',
    specialty: 'Cardiología',
    status: 'Activo',
    patients: 45,
    experience: '15 años',
    education: 'Universidad Nacional - Especialización en Cardiología',
    createdAt: '2025-06-10 09:00:00',
    lastModified: '2026-03-19 14:30:00',
    licenseNumber: 'MED-12345',
    specialties: ['Cardiología', 'Medicina Interna', 'Ecocardiografía', 'Electrofisiología'],
    hospital: 'Hospital General Central',
    gender: 'Masculino',
    birthDate: '1978-03-22',
    age: 48,
    phones: [
      { type: 'Oficina', number: '+1 234 567 8901', isPrimary: true },
      { type: 'Móvil', number: '+1 234 567 8902', isPrimary: false },
    ],
    emails: [
      { type: 'Profesional', address: 'carlos.lopez@hospital.com', isPrimary: true },
      { type: 'Personal', address: 'clopez@email.com', isPrimary: false },
    ],
    addresses: [
      { type: 'Consultorio', street: 'Av. Médica 789, Consultorio 5B', city: 'Madrid', postalCode: '28003', isPrimary: true },
      { type: 'Hospital', street: 'Calle Hospital General 100', city: 'Madrid', postalCode: '28004', isPrimary: false },
    ],
  };

  const [citasFilter, setCitasFilter] = useState<'proximas' | 'historial'>('proximas');
  const [citasYear, setCitasYear] = useState(2026);
  const [selectedRecord, setSelectedRecord] = useState<typeof appointmentHistory[0] | null>(null);

  const upcomingAppointments = [
    { id: 1, patient: 'María García', time: '09:00 AM', date: '2026-03-25', type: 'Consulta General', isProblematic: false },
    { id: 2, patient: 'Juan Pérez', time: '10:30 AM', date: '2026-03-25', type: 'Seguimiento', isProblematic: true },
    { id: 3, patient: 'Laura Fernández', time: '09:30 AM', date: '2026-03-26', type: 'Control', isProblematic: false },
  ];

  const appointmentHistory = [
    { id: 1, patient: 'María García', time: '09:00 AM', date: '2026-03-15', type: 'Consulta General', status: 'Completada' as const, notes: 'Control de rutina', observation: 'Paciente presenta presión arterial estable (120/80). Se mantiene medicación actual. Próximo control en 3 meses.', isProblematic: false },
    { id: 2, patient: 'Juan Pérez', time: '11:00 AM', date: '2026-03-10', type: 'Seguimiento', status: 'Completada' as const, notes: 'Revisión de tratamiento', observation: 'Revisión de resultados de laboratorio. Valores de colesterol dentro del rango normal. Se ajusta dosis de medicación.', isProblematic: true },
    { id: 3, patient: 'Ana Rodríguez', time: '03:00 PM', date: '2026-02-28', type: 'Urgencia', status: 'Completada' as const, notes: 'Episodio de mareo', observation: 'Paciente acudió por episodio de mareo severo. Electrocardiograma sin hallazgos patológicos. Se indicó hidratación oral y reposo.', isProblematic: false },
    { id: 4, patient: 'Carlos Díaz', time: '10:00 AM', date: '2026-02-20', type: 'Control', status: 'Cancelada' as const, notes: 'Paciente no asistió', observation: '', isProblematic: true },
    { id: 5, patient: 'Laura Fernández', time: '09:30 AM', date: '2026-02-15', type: 'Primera Consulta', status: 'Completada' as const, notes: 'Evaluación inicial', observation: 'Evaluación integral del paciente. Se solicitan exámenes de laboratorio completos. Se inicia plan de tratamiento preventivo.', isProblematic: false },
  ];

  return (
    <div className="space-y-5">

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 rounded-t-xl"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
              {getInitials(doctor.name)}
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{doctor.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={doctor.status === 'Activo' ? 'green' : 'gray'}>{doctor.status}</Badge>


                    <Badge variant="blue"><Award size={12} />{doctor.experience} de experiencia</Badge>
                    <Badge variant="gray">
                      <Calendar size={12} />
                      Creado: {new Date(doctor.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Badge>
                    <Badge variant="gray">
                      <Clock size={12} />
                      Modificado: {new Date(doctor.lastModified).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                </div>
                <div className="relative flex-shrink-0" ref={menuRef}>
                  <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mt-1">
                    <MoreVertical size={18} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button onClick={() => { setIsEditDoctorModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit size={12} />Editar Doctor</button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => { console.log('Eliminar doctor'); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} />Eliminar Doctor</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Charts Row */}
          <div className="grid grid-cols-12 gap-4">
            {/* Pacientes últimos 7 días — Line Chart */}
            <div className="col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900">Pacientes Atendidos</h3>
                  </div>
                  <select value={pacientesPeriod} onChange={(e) => setPacientesPeriod(e.target.value as '7d' | '1m' | '1y')} className="px-2 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer">
                    <option value="7d">Últimos 7 días</option>
                    <option value="1m">Último mes</option>
                    <option value="1y">Último año</option>
                  </select>
                </div>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={
                    pacientesPeriod === '7d' ? [
                      { day: 'Lun', pacientes: 8 },
                      { day: 'Mar', pacientes: 12 },
                      { day: 'Mié', pacientes: 6 },
                      { day: 'Jue', pacientes: 15 },
                      { day: 'Vie', pacientes: 10 },
                      { day: 'Sáb', pacientes: 4 },
                      { day: 'Dom', pacientes: 2 },
                    ] : pacientesPeriod === '1m' ? [
                      { day: 'Sem 1', pacientes: 32 },
                      { day: 'Sem 2', pacientes: 45 },
                      { day: 'Sem 3', pacientes: 38 },
                      { day: 'Sem 4', pacientes: 52 },
                    ] : [
                      { day: 'Ene', pacientes: 120 },
                      { day: 'Feb', pacientes: 145 },
                      { day: 'Mar', pacientes: 132 },
                      { day: 'Abr', pacientes: 158 },
                      { day: 'May', pacientes: 142 },
                      { day: 'Jun', pacientes: 168 },
                      { day: 'Jul', pacientes: 155 },
                      { day: 'Ago', pacientes: 130 },
                      { day: 'Sep', pacientes: 172 },
                      { day: 'Oct', pacientes: 148 },
                      { day: 'Nov', pacientes: 165 },
                      { day: 'Dic', pacientes: 180 },
                    ]
                  }>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={25} />
                    <Tooltip
                      contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value} pacientes`, 'Atendidos']}
                      labelFormatter={(label: string) => {
                        const days: Record<string, string> = { Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles', Jue: 'Jueves', Vie: 'Viernes', Sáb: 'Sábado', Dom: 'Domingo' };
                        const weeks: Record<string, string> = { 'Sem 1': 'Semana 1', 'Sem 2': 'Semana 2', 'Sem 3': 'Semana 3', 'Sem 4': 'Semana 4' };
                        const months: Record<string, string> = { Ene: 'Enero', Feb: 'Febrero', Mar: 'Marzo', Abr: 'Abril', May: 'Mayo', Jun: 'Junio', Jul: 'Julio', Ago: 'Agosto', Sep: 'Septiembre', Oct: 'Octubre', Nov: 'Noviembre', Dic: 'Diciembre' };
                        return days[label] || weeks[label] || months[label] || label;
                      }}
                    />
                    <Line type="monotone" dataKey="pacientes" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} activeDot={{ r: 5, fill: '#2563eb' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Consultas por Especialidad — Pie Chart */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Stethoscope size={14} className="text-blue-600" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900">Por Especialidad</h3>
                  </div>
                  <select value={especialidadPeriod} onChange={(e) => setEspecialidadPeriod(e.target.value as '7d' | '1m' | '1y')} className="px-2 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer">
                    <option value="7d">Últimos 7 días</option>
                    <option value="1m">Último mes</option>
                    <option value="1y">Último año</option>
                  </select>
                </div>
              </div>
              <div className="p-3 flex flex-col items-center flex-1">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={
                        especialidadPeriod === '7d' ? [
                          { name: 'Cardiología', value: 45 },
                          { name: 'Medicina Interna', value: 28 },
                          { name: 'Ecocardiografía', value: 18 },
                          { name: 'Electrofisiología', value: 9 },
                        ] : especialidadPeriod === '1m' ? [
                          { name: 'Cardiología', value: 120 },
                          { name: 'Medicina Interna', value: 85 },
                          { name: 'Ecocardiografía', value: 52 },
                          { name: 'Electrofisiología', value: 30 },
                        ] : [
                          { name: 'Cardiología', value: 580 },
                          { name: 'Medicina Interna', value: 420 },
                          { name: 'Ecocardiografía', value: 280 },
                          { name: 'Electrofisiología', value: 150 },
                        ]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value, cx, cy, midAngle, outerRadius: or }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = or + 16;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: 8, fill: '#6b7280' }}>
                            {name} ({value})
                          </text>
                        );
                      }}
                      labelLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                    >
                      {['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'].map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 9, borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(value: number, _: string, props: { payload: { name: string } }) => [`${value}`, props.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Citas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Citas</h3>
                </div>
                <Badge variant="gray" size="sm">
                  {citasFilter === 'proximas' ? `${upcomingAppointments.length} próximas` : `${appointmentHistory.length} registros`}
                </Badge>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {([
                  { value: 'proximas' as const, label: 'Próximas', count: upcomingAppointments.length },
                  { value: 'historial' as const, label: 'Historial', count: appointmentHistory.length },
                ]).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setCitasFilter(tab.value)}
                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                      citasFilter === tab.value
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[9px] px-1 py-0.5 rounded-full ${
                      citasFilter === tab.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>{tab.count}</span>
                  </button>
                ))}
              </div>
              {citasFilter === 'historial' && <select
                value={citasYear}
                onChange={(e) => setCitasYear(Number(e.target.value))}
                className="px-2 py-1 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>}
            </div>

            {/* Content */}
            <div>
              {citasFilter === 'proximas' ? (
                upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0">
                      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900 leading-none">{new Date(apt.date).getDate()}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{new Date(apt.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-gray-900">{apt.type}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <User size={10} /><span onClick={() => navigate(`/patients/${apt.id}`)} className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">{apt.patient}</span>
                          {apt.isProblematic && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 ml-1">Problemático</span>}
                        </p>
                      </div>
                      <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">{apt.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-500">No hay citas programadas</p>
                  </div>
                )
              ) : (
                appointmentHistory.length > 0 ? (
                  appointmentHistory.map((record) => (
                    <div key={record.id} onClick={() => setSelectedRecord(record)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900 leading-none">{new Date(record.date).getDate()}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{new Date(record.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-gray-900">{record.type}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <User size={10} /><span onClick={(e) => { e.stopPropagation(); navigate(`/patients/${record.id}`); }} className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">{record.patient}</span>
                          {record.isProblematic && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 ml-1">Problemático</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{record.time}</span>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                          record.status === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{record.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                      <FileText size={16} className="text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-500">No hay historial de citas</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Persona Card */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <User size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Información del Doctor</h3>
              </div>
              <div className="relative" ref={infoMenuRef}>
                <button onClick={() => setShowInfoMenu(!showInfoMenu)} className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <MoreVertical size={14} />
                </button>
                {showInfoMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    <button onClick={() => { setIsEditDoctorModalOpen(true); setShowInfoMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <User size={12} />Editar Información Básica
                    </button>
                    <button onClick={() => { setIsEditStudiesModalOpen(true); setShowInfoMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <GraduationCap size={12} />Editar Estudios
                    </button>
                    <button onClick={() => { setIsEditContactsModalOpen(true); setShowInfoMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Phone size={12} />Editar Contactos
                    </button>
                    <button onClick={() => { setIsEditAddressesModalOpen(true); setShowInfoMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <MapPin size={12} />Editar Direcciones
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* Especialidades */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><Stethoscope size={10} />Especialidades</label>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.specialties.map((spec, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      <Stethoscope size={10} />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><IdCard size={10} />Licencia</label>
                  <p className="text-xs text-gray-900 font-medium">{doctor.licenseNumber}</p>
                </div>
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><Cake size={10} />Edad</label>
                  <p className="text-xs text-gray-900 font-medium">{doctor.age} años</p>
                  <p className="text-[10px] text-gray-600">{doctor.birthDate}</p>
                </div>
              </div>

              {/* Educación */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><GraduationCap size={10} />Educación</label>
                <div className="space-y-2">
                  {[...studies].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((study, index) => (
                    <div key={index} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900 font-medium">{study.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{study.institution}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {study.inProgress ? (
                          <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">En curso</span>
                        ) : (
                          <span className="text-[9px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                            {new Date(study.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} — {new Date(study.endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teléfonos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><Phone size={10} />Teléfonos</label>
                <div className="space-y-2">
                  {doctor.phones.map((phone, index) => (
                    <div key={index} className={`relative rounded-lg p-3 transition-all ${phone.isPrimary ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' : 'border border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                      {phone.isPrimary && <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                      <div className="flex items-center gap-1.5 mb-1.5">{getPhoneTypeIcon(phone.type)}<span className="text-[10px] font-medium text-gray-600">{phone.type}</span></div>
                      <p className="text-xs text-gray-900 font-medium">{phone.number}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><Mail size={10} />Correos Electrónicos</label>
                <div className="space-y-2">
                  {doctor.emails.map((email, index) => (
                    <div key={index} className={`relative rounded-lg p-3 transition-all ${email.isPrimary ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' : 'border border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                      {email.isPrimary && <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                      <div className="flex items-center gap-1.5 mb-1.5">{getEmailTypeIcon(email.type)}<span className="text-[10px] font-medium text-gray-600">{email.type}</span></div>
                      <p className="text-xs text-gray-900 font-medium truncate">{email.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direcciones */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><MapPin size={10} />Direcciones</label>
                <div className="space-y-2.5">
                  {doctor.addresses.map((address, index) => (
                    <div key={index} className={`relative rounded-lg p-3 transition-all ${address.isPrimary ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' : 'border border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                      {address.isPrimary && <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Principal</div>}
                      <div className="flex items-center gap-1.5 mb-2">{getAddressTypeIcon(address.type)}<span className="text-[10px] font-medium text-gray-600">{address.type}</span></div>
                      <p className="text-xs text-gray-900 font-medium">{address.street}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{address.city}, {address.postalCode}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CitaDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      <EditDoctorModal isOpen={isEditDoctorModalOpen} onClose={() => setIsEditDoctorModalOpen(false)} doctor={doctor} />
      <EditStudiesModal isOpen={isEditStudiesModalOpen} onClose={() => setIsEditStudiesModalOpen(false)} studies={studies} onSave={setStudies} />
      <EditContactsModal
        isOpen={isEditContactsModalOpen}
        onClose={() => setIsEditContactsModalOpen(false)}
        contactsData={{ emails: doctor.emails.map(e => ({ address: e.address, type: e.type, isPrimary: e.isPrimary })), phones: doctor.phones.map(p => ({ number: p.number, type: p.type, isPrimary: p.isPrimary })) }}
        onSave={(data: ContactsData) => console.log('Contactos actualizados:', data)}
      />
      <EditAddressesModal
        isOpen={isEditAddressesModalOpen}
        onClose={() => setIsEditAddressesModalOpen(false)}
        addressesData={{ addresses: doctor.addresses.map(a => ({ street: a.street, city: a.city, postalCode: a.postalCode, country: 'España', type: a.type, isPrimary: a.isPrimary })) }}
        onSave={(data: AddressesData) => console.log('Direcciones actualizadas:', data)}
      />
    </div>
  );
}
