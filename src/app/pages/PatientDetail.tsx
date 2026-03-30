import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, User, FileText, MoreVertical, Edit, Trash2, Clock, Heart, MapPin, Droplet, AlertCircle, Stethoscope, IdCard, Cake, MessageSquare, X, Bold, Italic, List, ListOrdered, AlignLeft, FolderOpen, Download, Image, ClipboardList, File, Upload, Plus, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
import { DetailHeaderMenu } from '../components/DetailHeaderMenu';
import { Badge } from '../components/Badge';
import { WeekDatePicker, MonthCalendarBadge } from '../components/WeekDatePicker';
import { DetailCard } from '../components/DetailCard';
import { EditContactsModal, type ContactsData } from '../components/EditContactsModal';
import { EditAddressesModal, type AddressesData } from '../components/EditAddressesModal';
import { Modal, ModalButton } from '../components/Modal';

// --- Rich Text Edit Modal (reusable for Antecedentes, Bio) ---
function RichTextEditModal({ isOpen, onClose, title, placeholder, initialContent, onSave }: { isOpen: boolean; onClose: () => void; title: string; placeholder: string; initialContent: string; onSave: (content: string) => void }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1">
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Bold size={14} /></button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Italic size={14} /></button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><List size={14} /></button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ListOrdered size={14} /></button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><AlignLeft size={14} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full h-56 px-3 py-2 text-xs text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-200 bg-gray-50 gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          <button onClick={() => { onSave(content); onClose(); }} className="px-3 py-1.5 text-[10px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// --- Edit Patient Modal ---
interface PatientIdentification {
  type: string;
  number: string;
}

const ID_TYPES = ['DNI', 'NIE', 'Pasaporte', 'Otro'];
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'No definido'];

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: { name: string; identification: string; birthDate: string; gender: string; bloodType: string; isProblematic: boolean };
}

function EditPatientModal({ isOpen, onClose, patient }: EditPatientModalProps) {
  const nameParts = patient.name.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [identifications, setIdentifications] = useState<PatientIdentification[]>([
    { type: 'DNI', number: patient.identification.replace(/^DNI\s*/, '') }
  ]);
  const [birthDate, setBirthDate] = useState(patient.birthDate);
  const [gender, setGender] = useState(patient.gender);
  const [bloodType, setBloodType] = useState(patient.bloodType);
  const [isProblematic, setIsProblematic] = useState(patient.isProblematic);

  useEffect(() => {
    const parts = patient.name.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setBirthDate(patient.birthDate);
    setGender(patient.gender);
    setBloodType(patient.bloodType);
    setIsProblematic(patient.isProblematic);
  }, [patient]);

  const handleAddId = () => setIdentifications([...identifications, { type: 'DNI', number: '' }]);
  const handleRemoveId = (i: number) => setIdentifications(identifications.filter((_, idx) => idx !== i));
  const handleIdChange = (i: number, field: keyof PatientIdentification, value: string) => {
    const updated = [...identifications];
    updated[i][field] = value;
    setIdentifications(updated);
  };

  const handleCancel = () => {
    const parts = patient.name.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setIdentifications([{ type: 'DNI', number: patient.identification.replace(/^DNI\s*/, '') }]);
    setBirthDate(patient.birthDate);
    setGender(patient.gender);
    setBloodType(patient.bloodType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <User size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Paciente</h2>
          </div>
          <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left — Información Personal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-blue-100 rounded">
                  <User size={12} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Información Personal</h3>
              </div>

              <div className="border rounded-xl p-3 border-gray-200 bg-white space-y-3">
                {/* Nombre y Apellido */}
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

                {/* Género - Pills */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Género</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => setGender(option)}
                        className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                          gender === option
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <User size={10} className="text-blue-600" />
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Fecha de nacimiento</label>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Calendar size={13} className="text-blue-600" />
                    </div>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" />
                  </div>
                </div>

                {/* Tipo de Sangre - Pills */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Tipo de sangre</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {BLOOD_TYPES.map((bt) => (
                      <button
                        key={bt}
                        onClick={() => setBloodType(bt)}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                          bloodType === bt
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{bt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problemático */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600">Paciente Problemático</p>
                    <p className="text-[10px] text-gray-400">Marcar si el paciente presenta comportamiento problemático</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={isProblematic} onChange={() => setIsProblematic(!isProblematic)} />
                    <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right — Identificaciones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <IdCard size={12} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Identificaciones</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{identifications.length}</span>
                </div>
                <button onClick={handleAddId} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200" title="Agregar identificación">
                  <span className="text-lg leading-none">+</span>
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {identifications.map((id, index) => (
                  <div key={index} className="group relative border rounded-xl p-3 transition-all hover:shadow-md border-gray-200 bg-white hover:border-gray-300">
                    <div className="flex items-center gap-1.5 mb-2">
                      {ID_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleIdChange(index, 'type', type)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                            id.type === type
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <IdCard size={10} className="text-blue-600" />
                          <span>{type}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleRemoveId(index)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        disabled={identifications.length === 1}
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-gray-600">Número de identificación</label>
                      <input
                        type="text"
                        value={id.number}
                        onChange={(e) => handleIdChange(index, 'number', e.target.value)}
                        placeholder="Ej: 12345678A"
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {identifications.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                    <IdCard size={20} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">No hay identificaciones agregadas</p>
                  <button onClick={handleAddId} className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                    Agregar identificación
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={handleCancel} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={onClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// --- Edit Allergies Modal ---
interface Allergy {
  name: string;
  severity: 'Leve' | 'Moderada' | 'Severa';
}

interface EditAllergiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allergies: Allergy[];
  onSave: (allergies: Allergy[]) => void;
}

const SEVERITY_OPTIONS: Allergy['severity'][] = ['Leve', 'Moderada', 'Severa'];

function EditAllergiesModal({ isOpen, onClose, allergies: initialAllergies, onSave }: EditAllergiesModalProps) {
  const [items, setItems] = useState<Allergy[]>(initialAllergies);

  useEffect(() => {
    setItems(initialAllergies);
  }, [initialAllergies]);

  const handleAdd = () => {
    setItems([...items, { name: '', severity: 'Leve' }]);
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Allergy, value: string) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleCancel = () => {
    setItems(initialAllergies);
    onClose();
  };

  const handleSave = () => {
    onSave(items.filter(a => a.name.trim()));
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Leve': return 'bg-green-50 border-green-200 text-green-700';
      case 'Moderada': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'Severa': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${!isOpen ? 'hidden' : ''}`}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <AlertCircle size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Alergias</h2>
          </div>
          <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Warning */}
          <div className="flex items-start gap-2 p-2.5 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 mb-3">
            <AlertCircle size={12} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-700">Las alergias son información crítica. Asegúrate de mantenerla actualizada.</p>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <Heart size={12} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Alergias</h3>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{items.length}</span>
            </div>
            <button onClick={handleAdd} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
              <span className="text-lg leading-none">+</span>
              <span>Agregar</span>
            </button>
          </div>

          {/* Allergy Items */}
          <div className="space-y-2.5">
            {items.map((allergy, index) => (
              <div key={index} className="group relative border rounded-xl p-3 transition-all hover:shadow-md border-gray-200 bg-white hover:border-gray-300">
                {/* Severity Selector */}
                <div className="flex items-center gap-1.5 mb-2">
                  {SEVERITY_OPTIONS.map((sev) => (
                    <button
                      key={sev}
                      onClick={() => handleChange(index, 'severity', sev)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                        allergy.severity === sev
                          ? getSeverityColor(sev)
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{sev}</span>
                    </button>
                  ))}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemove(index)}
                    className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium text-gray-600">Nombre de la alergia</label>
                  <input
                    type="text"
                    value={allergy.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Ej: Penicilina"
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all border-gray-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                <Heart size={20} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 mb-2">No hay alergias registradas</p>
              <button onClick={handleAdd} className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                Agregar alergia
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={handleCancel} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// --- Cita Detail Modal ---
function CitaDetailModal({ record, onClose, onNavigateDoctor }: { record: { id: number; date: string; time: string; type: string; specialty: string; duration: string; color: string; avatar: string; doctor: string; status: string; notes: string; observation: string } | null; onClose: () => void; onNavigateDoctor?: (id: number) => void }) {
  const [subModal, setSubModal] = useState<'cancel' | 'complete' | null>(null);
  const [subModalText, setSubModalText] = useState('');

  if (!record) return null;

  const statusColor = record.status === 'Confirmada' ? 'text-blue-600 bg-blue-50 border-blue-100' : record.status === 'Completada' ? 'text-green-600 bg-green-50 border-green-100' : record.status === 'Pendiente' ? 'text-yellow-600 bg-yellow-50 border-yellow-100' : 'text-red-600 bg-red-50 border-red-100';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Detalle de Cita</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
              <span className="text-sm font-bold text-blue-700 leading-none">{parseInt(record.date.split('-')[2])}</span>
              <span className="text-[10px] font-medium text-blue-500 uppercase">{new Date(record.date + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' })}</span>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-[10px] font-bold text-gray-900">{record.time}</p>
              <p className="text-[10px] text-gray-400">{record.duration}</p>
            </div>
            <div className="w-0.5 h-10 rounded-full flex-shrink-0 bg-blue-500" />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-blue-600">
              {record.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span onClick={() => { onClose(); onNavigateDoctor?.(record.id); }} className="text-[10px] font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">{record.doctor}</span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${statusColor}`}>{record.status}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                <span>{record.type}</span>
                <span>·</span>
                <span>{record.specialty}</span>
              </p>
            </div>
          </div>

          {/* Observación (siempre visible) */}
          {record.observation ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-100 rounded"><FileText size={12} className="text-blue-600" /></div>
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

          {/* Result / Cancel Reason */}
          {record.status === 'Completada' && record.result && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-green-100 rounded"><CheckCircle size={12} className="text-green-600" /></div>
                <h3 className="text-xs font-semibold text-gray-900">Resultado de la Cita</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{record.result}</p>
              </div>
            </div>
          )}
          {record.status === 'Cancelada' && record.cancelReason && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-red-100 rounded"><X size={12} className="text-red-600" /></div>
                <h3 className="text-xs font-semibold text-gray-900">Motivo de Cancelación</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{record.cancelReason}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {(record.status === 'Pendiente' || record.status === 'Confirmada') && (
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => { setSubModal('cancel'); setSubModalText(''); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-all">
                <X size={12} />
                Cancelar Cita
              </button>
              {record.status === 'Pendiente' && (
                <button onClick={onClose} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20">
                  <CheckCircle size={12} />
                  Confirmar Cita
                </button>
              )}
              {record.status === 'Confirmada' && (
                <button onClick={() => { setSubModal('complete'); setSubModalText(''); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-sm shadow-green-500/20">
                  <CheckCircle size={12} />
                  Completar Cita
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors">Cerrar</button>
        </div>
      </div>

      {/* Sub-modal */}
      {subModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-200 ${subModal === 'cancel' ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${subModal === 'cancel' ? 'bg-red-100' : 'bg-green-100'}`}>
                  {subModal === 'cancel' ? <X size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />}
                </div>
                <h2 className="text-sm font-semibold text-gray-900">{subModal === 'cancel' ? 'Motivo de Cancelación' : 'Resultado de la Cita'}</h2>
              </div>
              <button onClick={() => setSubModal(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"><X size={16} /></button>
            </div>
            <div className="p-4">
              <textarea value={subModalText} onChange={(e) => setSubModalText(e.target.value)} placeholder={subModal === 'cancel' ? 'Describe el motivo de la cancelación...' : 'Describe el resultado de la cita...'} className="w-full h-32 px-3 py-2 text-xs text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed" />
            </div>
            <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-200 bg-gray-50 gap-2">
              <button onClick={() => setSubModal(null)} className="px-3 py-1.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Volver</button>
              <button onClick={() => { setSubModal(null); onClose(); }} className={`px-3 py-1.5 text-[10px] font-medium text-white rounded-lg transition-colors ${subModal === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {subModal === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Resultado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- File Preview Modal ---
function FilePreviewModal({ file, onClose }: { file: { name: string; date: string; size: string; type: string; category: string } | null; onClose: () => void }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              {file.type === 'PDF' ? <FileText size={16} className="text-blue-600" /> : <Image size={16} className="text-blue-600" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{file.name}</h2>
              <p className="text-[10px] text-gray-500">{file.category} · {file.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors" title="Descargar">
              <Download size={14} />
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          {file.type === 'IMG' ? (
            <div className="p-6 flex items-center justify-center bg-gray-50">
              <div className="w-full max-w-md aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Image size={28} className="text-blue-500" />
                </div>
                <p className="text-xs font-medium text-gray-700">{file.name}</p>
                <p className="text-[10px] text-gray-400">Vista previa de imagen</p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-50">
              {/* Mock PDF preview */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Page header */}
                <div className="px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Stethoscope size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900">Centro Médico MCH</p>
                        <p className="text-[10px] text-gray-500">Sistema de Gestión Integral</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500">Fecha: {new Date(file.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <p className="text-[10px] text-gray-500">Ref: MCH-{Math.floor(Math.random() * 9000 + 1000)}</p>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 text-center">{file.name}</h3>
                </div>

                {/* Mock content */}
                <div className="px-8 py-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-700 mb-1">Datos del Paciente</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <p className="text-[10px] text-gray-500">Nombre: <span className="text-gray-700 font-medium">María García López</span></p>
                      <p className="text-[10px] text-gray-500">Edad: <span className="text-gray-700 font-medium">38 años</span></p>
                      <p className="text-[10px] text-gray-500">ID: <span className="text-gray-700 font-medium">DNI 12345678A</span></p>
                      <p className="text-[10px] text-gray-500">Tipo de sangre: <span className="text-gray-700 font-medium">O+</span></p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-semibold text-gray-700 mb-1">Resultados</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] py-1 border-b border-gray-50">
                        <span className="text-gray-600">Parámetro evaluado</span>
                        <span className="text-gray-900 font-medium">Dentro de rango normal</span>
                      </div>
                      <div className="flex justify-between text-[10px] py-1 border-b border-gray-50">
                        <span className="text-gray-600">Observaciones clínicas</span>
                        <span className="text-gray-900 font-medium">Sin hallazgos relevantes</span>
                      </div>
                      <div className="flex justify-between text-[10px] py-1 border-b border-gray-50">
                        <span className="text-gray-600">Recomendaciones</span>
                        <span className="text-gray-900 font-medium">Control en 3 meses</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-semibold text-gray-700 mb-1">Conclusión</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      Los resultados obtenidos se encuentran dentro de los parámetros normales. Se recomienda mantener el seguimiento médico habitual y repetir los estudios en el plazo indicado.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400">Documento generado por MCH · {file.size}</p>
                  <p className="text-[10px] text-gray-400">Página 1 de 1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${file.type === 'PDF' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              {file.type === 'PDF' ? <FileText size={9} /> : <Image size={9} />}
              {file.type}
            </span>
            <span className="text-[10px] text-gray-500">{new Date(file.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[10px] font-medium">
            <Download size={11} />
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Upload File Modal ---
function UploadFileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; type: string; category: string }[]>([]);
  const [category, setCategory] = useState('examenes');

  if (!isOpen) return null;

  const addMockFile = () => {
    setFiles(prev => [...prev, {
      name: `archivo_${prev.length + 1}.pdf`,
      size: `${Math.floor(Math.random() * 900 + 100)} KB`,
      type: 'PDF',
      category,
    }]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Upload size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Agregar Archivo</h2>
              <p className="text-[10px] text-gray-500">Sube archivos al expediente del paciente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Category selector */}
          <div>
            <label className="text-[10px] font-medium text-gray-700 mb-1.5 block">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="examenes">Exámenes</option>
              <option value="informes">Informes</option>
              <option value="constancias">Constancias</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Drop zone */}
          <div
            onClick={addMockFile}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addMockFile(); }}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
              <Upload size={20} className="text-blue-500" />
            </div>
            <p className="text-xs font-medium text-gray-700">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG hasta 10 MB</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-gray-700">Archivos seleccionados ({files.length})</label>
              <div className="max-h-[140px] overflow-y-auto space-y-1">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 text-red-500">
                      <FileText size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400">{file.size} · {({ examenes: 'Exámenes', informes: 'Informes', constancias: 'Constancias', otros: 'Otros' } as Record<string, string>)[file.category]}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors flex-shrink-0">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button onClick={onClose} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[10px] font-medium">
            <Upload size={11} />
            Subir {files.length > 0 ? `(${files.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PatientDetail() {
  useHeader({
    title: 'Detalle del Paciente',
    subtitle: 'Información completa e historial médico del paciente',
    backTo: '/patients',
    actions: <DetailHeaderMenu editTitle="Editar Paciente" deleteTitle="Eliminar Paciente" onEdit={() => setIsEditPatientModalOpen(true)} onDelete={() => console.log('Eliminar paciente')} />,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showObsMenu, setShowObsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [isAntecedentesModalOpen, setIsAntecedentesModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isEditAllergiesModalOpen, setIsEditAllergiesModalOpen] = useState(false);
  const [isEditContactsModalOpen, setIsEditContactsModalOpen] = useState(false);
  const [isEditAddressesModalOpen, setIsEditAddressesModalOpen] = useState(false);
  const [filesCategory, setFilesCategory] = useState<'examenes' | 'informes' | 'constancias' | 'otros'>('examenes');
  const [previewFile, setPreviewFile] = useState<{ name: string; date: string; size: string; type: string; category: string } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [obsTab, setObsTab] = useState<'citas' | 'antecedentes' | 'bio'>('citas');
  const [obsDoctorFilter, setObsDoctorFilter] = useState('all');
  const [antecedentes, setAntecedentes] = useState('Hipertensión arterial diagnosticada en enero 2026. Antecedentes familiares de diabetes tipo 2 (madre). Sin cirugías previas. Alergia conocida a Penicilina (severa) y Aspirina (moderada).');
  const [bio, setBio] = useState('Paciente femenina de 45 años, casada, trabaja como contadora. Estilo de vida sedentario. No fuma. Consumo ocasional de alcohol. Dieta regular con tendencia alta en sodio. Se recomienda actividad física regular y dieta controlada.');
  const [showFilesMenu, setShowFilesMenu] = useState(false);
  const filesMenuRef = useRef<HTMLDivElement>(null);
  const [citasDate, setCitasDate] = useState(new Date(2026, 2, 25));
  const [allergies, setAllergies] = useState<Allergy[]>([
    { name: 'Penicilina', severity: 'Severa' },
    { name: 'Aspirina', severity: 'Moderada' },
    { name: 'Látex', severity: 'Leve' },
  ]);
  const menuRef = useRef<HTMLDivElement>(null);
  const obsMenuRef = useRef<HTMLDivElement>(null);
  const infoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (obsMenuRef.current && !obsMenuRef.current.contains(event.target as Node)) {
        setShowObsMenu(false);
      }
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
        setShowInfoMenu(false);
      }
    };

    if (showMenu || showObsMenu || showInfoMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showObsMenu, showInfoMenu]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getPhoneTypeIcon = (_type: string) => <Phone size={14} className="text-blue-600" />;
  const getEmailTypeIcon = (_type: string) => <Mail size={14} className="text-blue-600" />;
  const getAddressTypeIcon = (_type: string) => <MapPin size={14} className="text-blue-600" />;

  const patient = {
    id,
    name: 'María García',
    age: 45,
    bloodType: 'O+',
    allergies: 'Penicilina', // initial, state used for display
    doctor: 'Dr. Carlos López',
    isProblematic: true,
    createdAt: '2026-01-05 10:30:00',
    lastModified: '2026-03-19 14:30:00',
    identification: 'DNI 12345678A',
    birthDate: '1980-05-15',
    gender: 'Femenino',
    phones: [
      { type: 'Móvil', number: '+1 234 567 8901', isPrimary: true },
      { type: 'Casa', number: '+1 234 567 8902', isPrimary: false },
    ],
    emails: [
      { type: 'Personal', address: 'maria.garcia@email.com', isPrimary: true },
      { type: 'Trabajo', address: 'mgarcia@empresa.com', isPrimary: false },
    ],
    addresses: [
      { type: 'Casa', street: 'Calle Principal 123', city: 'Madrid', postalCode: '28001', isPrimary: true },
      { type: 'Trabajo', street: 'Av. Empresarial 456', city: 'Madrid', postalCode: '28002', isPrimary: false },
    ],
  };

  const [selectedRecord, setSelectedRecord] = useState<typeof allPatientAppointments[0] | null>(null);

  const allPatientAppointments = [
    { id: 1, date: '2026-03-25', time: '09:00', type: 'Control', specialty: 'Cardiología', duration: '30 min', color: '#3B82F6', avatar: 'DL', doctor: 'Dr. López', status: 'Completada' as const, notes: 'Control de rutina', observation: 'Paciente presenta presión arterial estable (120/80). Se mantiene medicación actual. Próximo control en 3 meses.', result: 'Paciente presenta presión arterial estable (120/80). Se mantiene medicación actual. Próximo control en 3 meses.' },
    { id: 2, date: '2026-03-25', time: '11:00', type: 'Seguimiento', specialty: 'Pediatría', duration: '45 min', color: '#8B5CF6', avatar: 'DM', doctor: 'Dra. Martínez', status: 'Pendiente' as const, notes: 'Revisión', observation: '' },
    { id: 3, date: '2026-03-25', time: '14:00', type: 'Consulta', specialty: 'Neurología', duration: '30 min', color: '#10B981', avatar: 'DS', doctor: 'Dr. Sánchez', status: 'Confirmada' as const, notes: 'Evaluación', observation: '' },
    { id: 4, date: '2026-03-25', time: '16:00', type: 'Urgencia', specialty: 'Cardiología', duration: '30 min', color: '#3B82F6', avatar: 'DL', doctor: 'Dr. López', status: 'Cancelada' as const, notes: 'Paciente canceló', observation: '', cancelReason: 'El paciente no pudo asistir por emergencia familiar.' },
    { id: 5, date: '2026-03-26', time: '09:00', type: 'Consulta', specialty: 'Neurología', duration: '30 min', color: '#10B981', avatar: 'DS', doctor: 'Dr. Sánchez', status: 'Completada' as const, notes: '', observation: 'Evaluación neurológica sin hallazgos patológicos. Reflejos normales. Se descarta origen neurológico de los mareos.', result: 'Evaluación neurológica sin hallazgos patológicos. Reflejos normales. Se descarta origen neurológico de los mareos.' },
    { id: 6, date: '2026-03-27', time: '11:00', type: 'Primera Consulta', specialty: 'Cardiología', duration: '45 min', color: '#3B82F6', avatar: 'DL', doctor: 'Dr. López', status: 'Completada' as const, notes: 'Evaluación inicial', observation: 'Evaluación integral del paciente. Se detecta hipertensión arterial grado 1. Se solicitan exámenes de laboratorio completos. Se inicia tratamiento con Losartán 25mg/día.', result: 'Evaluación integral del paciente. Se detecta hipertensión arterial grado 1. Se solicitan exámenes de laboratorio completos. Se inicia tratamiento con Losartán 25mg/día.' },
    { id: 7, date: '2026-03-28', time: '14:00', type: 'Control', specialty: 'Cardiología', duration: '30 min', color: '#3B82F6', avatar: 'DL', doctor: 'Dr. López', status: 'Cancelada' as const, notes: 'Paciente no asistió', observation: '', cancelReason: 'Doctor no disponible por emergencia en otro paciente.' },
    { id: 8, date: '2026-03-29', time: '10:30', type: 'Urgencia', specialty: 'Pediatría', duration: '30 min', color: '#8B5CF6', avatar: 'DM', doctor: 'Dra. Martínez', status: 'Confirmada' as const, notes: 'Episodio de mareo', observation: '' },
  ];

  const citasDateStr = `${citasDate.getFullYear()}-${String(citasDate.getMonth() + 1).padStart(2, '0')}-${String(citasDate.getDate()).padStart(2, '0')}`;
  const dayCitas = allPatientAppointments.filter(a => a.date === citasDateStr).sort((a, b) => b.time.localeCompare(a.time));
  const citasCounts: Record<string, number> = {};
  allPatientAppointments.forEach(a => { citasCounts[a.date] = (citasCounts[a.date] || 0) + 1; });

  return (
    <div className="space-y-5">

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 rounded-t-xl"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
              {getInitials(patient.name)}
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {patient.isProblematic && <Badge variant="red">Problemático</Badge>}
                    <Badge variant="blue"><User size={12} />{patient.age} años</Badge>
                    <Badge variant="gray">{patient.gender}</Badge>
                    <Badge variant="green"><Droplet size={12} />{patient.bloodType}</Badge>
                    <Badge variant="gray">
                      <Calendar size={12} />
                      Creado: {new Date(patient.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Badge>
                    <Badge variant="gray">
                      <Clock size={12} />
                      Modificado: {new Date(patient.lastModified).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Observaciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MessageSquare size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Observaciones</h3>
              </div>
              <div className="relative" ref={obsMenuRef}>
                <button
                  onClick={() => setShowObsMenu(!showObsMenu)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <MoreVertical size={14} />
                </button>
                {showObsMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    <button
                      onClick={() => { setIsAntecedentesModalOpen(true); setShowObsMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={12} />
                      Editar Antecedentes
                    </button>
                    <button
                      onClick={() => { setIsBioModalOpen(true); setShowObsMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={12} />
                      Editar Bio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {([
                  { value: 'citas' as const, label: 'Citas', count: allPatientAppointments.filter(a => a.status === 'Completada' && a.observation && (obsDoctorFilter === 'all' || a.doctor === obsDoctorFilter)).length },
                  { value: 'antecedentes' as const, label: 'Antecedentes' },
                  { value: 'bio' as const, label: 'Bio' },
                ]).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setObsTab(tab.value)}
                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                      obsTab === tab.value
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                    {'count' in tab && tab.count !== undefined && (
                      <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                        obsTab === tab.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>
              {obsTab === 'citas' && (
                <select
                  value={obsDoctorFilter}
                  onChange={(e) => setObsDoctorFilter(e.target.value)}
                  className="px-2 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer"
                >
                  <option value="all">Todos los doctores</option>
                  {Array.from(new Set(allPatientAppointments.filter(a => a.observation).map(a => a.doctor))).map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Tab Content */}
            <div>
              {obsTab === 'citas' && (() => {
                const filtered = allPatientAppointments
                  .filter(a => a.status === 'Completada' && a.observation && (obsDoctorFilter === 'all' || a.doctor === obsDoctorFilter))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.time.localeCompare(a.time));

                if (filtered.length === 0) return (
                  <div className="text-center py-6">
                    <MessageSquare size={16} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Sin observaciones de citas</p>
                  </div>
                );

                // Group by doctor
                const grouped: { doctor: string; items: typeof filtered }[] = [];
                filtered.forEach(apt => {
                  const existing = grouped.find(g => g.doctor === apt.doctor);
                  if (existing) existing.items.push(apt);
                  else grouped.push({ doctor: apt.doctor, items: [apt] });
                });

                const groupColors = [
                  { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-600' },
                  { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-600' },
                  { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-600' },
                  { bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-600' },
                  { bg: 'bg-rose-50/50', border: 'border-rose-100', text: 'text-rose-600' },
                  { bg: 'bg-cyan-50/50', border: 'border-cyan-100', text: 'text-cyan-600' },
                ];

                return grouped.map((group, gi) => {
                  const color = groupColors[gi % groupColors.length];
                  return (
                    <div key={gi} className="flex border-b border-gray-100 last:border-0">
                      {/* Doctor lateral label */}
                      <div className={`flex-shrink-0 w-7 relative ${color.bg} border-r ${color.border}`} title={group.doctor}>
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <span className={`text-[10px] font-semibold ${color.text} max-h-full overflow-hidden text-ellipsis`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: 'calc(100% - 8px)' }}>
                            {group.doctor}
                          </span>
                        </div>
                      </div>
                      {/* Items */}
                      <div className="flex-1 min-w-0">
                        {group.items.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedRecord(apt)}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 cursor-pointer min-w-0"
                          >
                            <div className="flex flex-col items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg px-1.5 py-0.5">
                              <span className="text-xs font-bold text-blue-700 leading-none">{parseInt(apt.date.split('-')[2])}</span>
                              <span className="text-[10px] font-medium text-blue-500 uppercase">{new Date(apt.date + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' })}</span>
                            </div>
                            <div className="flex-shrink-0 text-center">
                              <p className="text-[10px] font-bold text-gray-900">{apt.time}</p>
                              <p className="text-[10px] text-gray-400">{apt.duration}</p>
                            </div>
                            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
                            <p className="flex-1 text-[10px] text-gray-600 truncate">{apt.observation}</p>
                          </div>
                        ))}
                      </div>
                  </div>
                  );
                });
              })()}

              {obsTab === 'antecedentes' && (
                <div className="p-4">
                  {antecedentes ? (
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{antecedentes}</div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                      <MessageSquare size={16} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-500">Sin antecedentes registrados</p>
                    </div>
                  )}
                </div>
              )}

              {obsTab === 'bio' && (
                <div className="p-4">
                  {bio ? (
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{bio}</div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                      <MessageSquare size={16} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-500">Sin biografía registrada</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Archivos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FolderOpen size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Archivos</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="gray" size="sm">11 archivos</Badge>
                  <div className="relative" ref={filesMenuRef}>
                    <button onClick={() => setShowFilesMenu(!showFilesMenu)} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors">
                      <MoreVertical size={14} />
                    </button>
                    {showFilesMenu && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                        <button onClick={() => { setIsUploadModalOpen(true); setShowFilesMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Upload size={12} />
                          Agregar archivo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-1">
              {([
                { value: 'examenes' as const, label: 'Exámenes', count: 4, icon: ClipboardList },
                { value: 'informes' as const, label: 'Informes', count: 3, icon: FileText },
                { value: 'constancias' as const, label: 'Constancias', count: 2, icon: File },
                { value: 'otros' as const, label: 'Otros', count: 2, icon: FolderOpen },
              ]).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilesCategory(tab.value)}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                    filesCategory === tab.value
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                    filesCategory === tab.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* File List */}
            <div>
              {({
                examenes: [
                  { name: 'Hemograma completo', date: '2026-03-15', size: '245 KB', type: 'PDF' },
                  { name: 'Perfil lipídico', date: '2026-03-15', size: '180 KB', type: 'PDF' },
                  { name: 'Electrocardiograma', date: '2026-02-20', size: '1.2 MB', type: 'IMG' },
                  { name: 'Radiografía de tórax', date: '2026-01-10', size: '3.4 MB', type: 'IMG' },
                ],
                informes: [
                  { name: 'Informe cardiológico', date: '2026-03-10', size: '520 KB', type: 'PDF' },
                  { name: 'Evaluación nutricional', date: '2026-02-15', size: '310 KB', type: 'PDF' },
                  { name: 'Informe de alta', date: '2026-01-20', size: '280 KB', type: 'PDF' },
                ],
                constancias: [
                  { name: 'Constancia de atención', date: '2026-03-15', size: '150 KB', type: 'PDF' },
                  { name: 'Certificado médico', date: '2026-02-10', size: '120 KB', type: 'PDF' },
                ],
                otros: [
                  { name: 'Consentimiento informado', date: '2026-01-15', size: '95 KB', type: 'PDF' },
                  { name: 'Foto de identificación', date: '2026-01-15', size: '850 KB', type: 'IMG' },
                ],
              })[filesCategory].map((file, i) => (
                <div key={i} onClick={() => setPreviewFile({ ...file, category: filesCategory.charAt(0).toUpperCase() + filesCategory.slice(1) })} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${file.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    {file.type === 'PDF' ? <FileText size={14} /> : <Image size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(file.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })} · {file.size}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0">
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Citas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Citas</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="gray" size="sm">{dayCitas.length} citas</Badge>
                  <MonthCalendarBadge selectedDate={citasDate} onDateChange={setCitasDate} />
                </div>
              </div>
            </div>

            {/* Week Date Picker */}
            <WeekDatePicker selectedDate={citasDate} onDateChange={setCitasDate} appointmentCounts={citasCounts} />

            {/* Content */}
            <div>
              {dayCitas.length > 0 ? (
                dayCitas.map((apt) => (
                  <div key={apt.id} onClick={() => setSelectedRecord(apt)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 cursor-pointer">
                    <div className="flex flex-col items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
                      <span className="text-sm font-bold text-blue-700 leading-none">{parseInt(apt.date.split('-')[2])}</span>
                      <span className="text-[10px] font-medium text-blue-500 uppercase">{new Date(apt.date + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' })}</span>
                    </div>
                    <div className="flex-shrink-0 text-center">
                      <p className="text-[10px] font-bold text-gray-900">{apt.time}</p>
                      <p className="text-[10px] text-gray-400">{apt.duration}</p>
                    </div>
                    <div className="w-0.5 h-10 rounded-full flex-shrink-0 bg-blue-500" />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-blue-600">
                      {apt.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${apt.id}`); }} className="text-[10px] font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">{apt.doctor}</span>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                          apt.status === 'Confirmada' ? 'text-blue-600 bg-blue-50 border-blue-100' : apt.status === 'Completada' ? 'text-green-600 bg-green-50 border-green-100' : apt.status === 'Pendiente' ? 'text-yellow-600 bg-yellow-50 border-yellow-100' : 'text-red-600 bg-red-50 border-red-100'
                        }`}>{apt.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>{apt.type}</span>
                        <span>·</span>
                        <span>{apt.specialty}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-500">No hay citas para este día</p>
                </div>
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
                <h3 className="text-xs font-semibold text-gray-900">Información del Paciente</h3>
              </div>
              <div className="relative" ref={infoMenuRef}>
                <button
                  onClick={() => setShowInfoMenu(!showInfoMenu)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <MoreVertical size={14} />
                </button>
                {showInfoMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    <button
                      onClick={() => { setIsEditPatientModalOpen(true); setShowInfoMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={12} />
                      Editar Información Básica
                    </button>
                    <button
                      onClick={() => { setIsEditAllergiesModalOpen(true); setShowInfoMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <AlertCircle size={12} />
                      Editar Alergias
                    </button>
                    <button
                      onClick={() => { setIsEditContactsModalOpen(true); setShowInfoMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Phone size={12} />
                      Editar Contactos
                    </button>
                    <button
                      onClick={() => { setIsEditAddressesModalOpen(true); setShowInfoMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <MapPin size={12} />
                      Editar Direcciones
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* Info unificada */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {patient.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-900">{patient.name}</span>
                    {patient.isProblematic && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Problemático</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>{patient.gender}</span>
                    <span>·</span>
                    <span>{patient.age} años</span>
                    <span>·</span>
                    <span>{patient.bloodType}</span>
                  </p>
                </div>
              </div>

              {/* Alergias */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <AlertCircle size={10} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Alergias</span>
                </div>
                {allergies.length > 0 ? allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0"><AlertCircle size={11} className="text-red-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{allergy.name}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                      allergy.severity === 'Severa' ? 'bg-red-50 text-red-600 border-red-100' : allergy.severity === 'Moderada' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>{allergy.severity}</span>
                  </div>
                )) : (
                  <div className="px-3 py-3 text-center">
                    <p className="text-[10px] text-gray-400">Sin alergias registradas</p>
                  </div>
                )}
              </div>

              {/* Identificaciones */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <IdCard size={10} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Identificaciones</span>
                </div>
                {[
                  { type: 'DNI', number: '12345678A', isPrimary: true },
                  { type: 'Pasaporte', number: 'ES9876543', isPrimary: false },
                ].map((id, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><IdCard size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{id.number}</p>
                      <p className="text-[10px] text-gray-500">{id.type}</p>
                    </div>
                    {id.isPrimary && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Teléfonos */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <Phone size={10} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Teléfonos</span>
                </div>
                {patient.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><Phone size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{phone.number}</p>
                      <p className="text-[10px] text-gray-500">{phone.type}</p>
                    </div>
                    {phone.isPrimary && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Correos */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <Mail size={10} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Correos</span>
                </div>
                {patient.emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><Mail size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{email.address}</p>
                      <p className="text-[10px] text-gray-500">{email.type}</p>
                    </div>
                    {email.isPrimary && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Direcciones */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <MapPin size={10} className="text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Direcciones</span>
                </div>
                {patient.addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><MapPin size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{address.street}</p>
                      <p className="text-[10px] text-gray-500">{address.city}, {address.postalCode} · {address.type}</p>
                    </div>
                    {address.isPrimary && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CitaDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} onNavigateDoctor={(id) => navigate(`/doctors/${id}`)} />
      <RichTextEditModal
        isOpen={isAntecedentesModalOpen}
        onClose={() => setIsAntecedentesModalOpen(false)}
        title="Editar Antecedentes"
        placeholder="Escribe los antecedentes médicos del paciente..."
        initialContent={antecedentes}
        onSave={setAntecedentes}
      />
      <RichTextEditModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        title="Editar Bio"
        placeholder="Escribe la biografía del paciente..."
        initialContent={bio}
        onSave={setBio}
      />
      <EditPatientModal
        isOpen={isEditPatientModalOpen}
        onClose={() => setIsEditPatientModalOpen(false)}
        patient={patient}
      />
      <EditAllergiesModal
        isOpen={isEditAllergiesModalOpen}
        onClose={() => setIsEditAllergiesModalOpen(false)}
        allergies={allergies}
        onSave={setAllergies}
      />
      <EditContactsModal
        isOpen={isEditContactsModalOpen}
        onClose={() => setIsEditContactsModalOpen(false)}
        contactsData={{ emails: patient.emails.map(e => ({ address: e.address, type: e.type, isPrimary: e.isPrimary })), phones: patient.phones.map(p => ({ number: p.number, type: p.type, isPrimary: p.isPrimary })) }}
        onSave={(data: ContactsData) => console.log('Contactos actualizados:', data)}
      />
      <EditAddressesModal
        isOpen={isEditAddressesModalOpen}
        onClose={() => setIsEditAddressesModalOpen(false)}
        addressesData={{ addresses: patient.addresses.map(a => ({ street: a.street, city: a.city, postalCode: a.postalCode, country: 'España', type: a.type, isPrimary: a.isPrimary })) }}
        onSave={(data: AddressesData) => console.log('Direcciones actualizadas:', data)}
      />
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      <UploadFileModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
}
