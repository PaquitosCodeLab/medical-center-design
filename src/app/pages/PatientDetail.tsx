import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, User, FileText, MoreVertical, Edit, Trash2, Clock, Heart, MapPin, Droplet, AlertCircle, Stethoscope, IdCard, Cake, MessageSquare, X, Bold, Italic, List, ListOrdered, AlignLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { DetailCard } from '../components/DetailCard';
import { EditContactsModal, type ContactsData } from '../components/EditContactsModal';
import { EditAddressesModal, type AddressesData } from '../components/EditAddressesModal';
import { Modal, ModalButton } from '../components/Modal';

// --- Observaciones Modal ---
interface ObservacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  onSave: (content: string) => void;
}

function ObservacionesModal({ isOpen, onClose, initialContent, onSave }: ObservacionesModalProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Observaciones</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Rich Text Toolbar */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1">
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Bold size={14} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Italic size={14} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <List size={14} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <ListOrdered size={14} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <AlignLeft size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe las observaciones del paciente..."
            className="w-full h-56 px-3 py-2 text-xs text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <p className="text-[10px] text-gray-400">Última edición: hace 2 días</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Guardar
            </button>
          </div>
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
                    <p className="text-[9px] text-gray-400">Marcar si el paciente presenta comportamiento problemático</p>
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
interface CitaRecord {
  id: number;
  date: string;
  time: string;
  type: string;
  doctor: string;
  status: 'Completada' | 'Cancelada';
  notes: string;
  observation: string;
}

function CitaDetailModal({ record, onClose }: { record: CitaRecord | null; onClose: () => void }) {
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
              <span className="text-sm font-bold text-gray-900 leading-none">
                {new Date(record.date).getDate()}
              </span>
              <span className="text-[9px] text-gray-500 uppercase">
                {new Date(record.date).toLocaleDateString('es-ES', { month: 'short' })}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-900">{record.type} · {record.notes}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                <Stethoscope size={10} />{record.doctor}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{record.time}</span>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                record.status === 'Completada'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>{record.status}</span>
            </div>
          </div>

          {/* Observación */}
          {record.observation ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-100 rounded">
                  <MessageSquare size={12} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Observación de la Cita</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{record.observation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 border border-dashed border-gray-300 rounded-xl">
              <MessageSquare size={16} className="text-gray-400 mx-auto mb-1" />
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

export function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showObsMenu, setShowObsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [isObservacionesModalOpen, setIsObservacionesModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isEditAllergiesModalOpen, setIsEditAllergiesModalOpen] = useState(false);
  const [isEditContactsModalOpen, setIsEditContactsModalOpen] = useState(false);
  const [isEditAddressesModalOpen, setIsEditAddressesModalOpen] = useState(false);
  const [citasFilter, setCitasFilter] = useState<'proximas' | 'historial'>('proximas');
  const [citasYear, setCitasYear] = useState(2026);
  const [allergies, setAllergies] = useState<Allergy[]>([
    { name: 'Penicilina', severity: 'Severa' },
    { name: 'Aspirina', severity: 'Moderada' },
    { name: 'Látex', severity: 'Leve' },
  ]);
  const [observaciones, setObservaciones] = useState('Paciente con antecedentes de hipertensión controlada. Se recomienda seguimiento trimestral y control de presión arterial semanal.\n\nÚltimo control: valores dentro del rango normal. Mantener medicación actual (Losartán 50mg/día).\n\nNota: Paciente refiere episodios de mareo ocasional por las mañanas. Evaluar en próxima consulta.');
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

  const [selectedRecord, setSelectedRecord] = useState<typeof medicalHistory[0] | null>(null);

  const medicalHistory = [
    { id: 1, date: '2026-03-15', time: '09:30 AM', type: 'Consulta General', doctor: 'Dr. López', status: 'Completada' as const, notes: 'Control de rutina', observation: 'Paciente presenta presión arterial estable (120/80). Se mantiene medicación actual. Próximo control en 3 meses. Se recomienda continuar con dieta baja en sodio y actividad física regular.' },
    { id: 2, date: '2026-02-10', time: '11:00 AM', type: 'Seguimiento', doctor: 'Dr. López', status: 'Completada' as const, notes: 'Revisión de tratamiento', observation: 'Revisión de resultados de laboratorio. Valores de colesterol dentro del rango normal. Se ajusta dosis de Losartán de 25mg a 50mg por leve elevación de presión en monitoreo ambulatorio.' },
    { id: 3, date: '2026-01-20', time: '03:00 PM', type: 'Urgencia', doctor: 'Dra. Martínez', status: 'Completada' as const, notes: 'Episodio de mareo', observation: 'Paciente acudió por episodio de mareo severo. Se realizó electrocardiograma sin hallazgos patológicos. Se atribuye a deshidratación. Se indicó hidratación oral y reposo por 24 horas.' },
    { id: 4, date: '2026-01-05', time: '10:00 AM', type: 'Primera Consulta', doctor: 'Dr. López', status: 'Completada' as const, notes: 'Evaluación inicial', observation: 'Evaluación integral del paciente. Se detecta hipertensión arterial grado 1. Se solicitan exámenes de laboratorio completos. Se inicia tratamiento con Losartán 25mg/día.' },
    { id: 5, date: '2025-12-15', time: '02:00 PM', type: 'Control', doctor: 'Dr. López', status: 'Cancelada' as const, notes: 'Paciente no asistió', observation: '' },
  ];

  const upcomingAppointments = [
    { id: 1, date: '2026-03-25', time: '10:00 AM', type: 'Control', doctor: 'Dr. López' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/patients')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Paciente</h1>
          <p className="text-xs text-gray-500">Información completa e historial médico del paciente</p>
        </div>
      </div>

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
                <div className="relative flex-shrink-0" ref={menuRef}>
                  <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mt-1">
                    <MoreVertical size={18} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button onClick={() => { setIsEditPatientModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit size={12} />Editar Paciente</button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => { console.log('Eliminar paciente'); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} />Eliminar Paciente</button>
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
          {/* Observaciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsObservacionesModalOpen(true);
                        setShowObsMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={12} />
                      Editar Observaciones
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              {observaciones ? (
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {observaciones}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                    <MessageSquare size={16} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">Sin observaciones registradas</p>
                  <button
                    onClick={() => setIsObservacionesModalOpen(true)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Agregar Observación
                  </button>
                </div>
              )}
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
                  {citasFilter === 'proximas' ? `${upcomingAppointments.length} próximas` : `${medicalHistory.length} registros`}
                </Badge>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {([
                  { value: 'proximas' as const, label: 'Próximas', count: upcomingAppointments.length },
                  { value: 'historial' as const, label: 'Historial', count: medicalHistory.length },
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
                    }`}>
                      {tab.count}
                    </span>
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
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0">
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900 leading-none">
                          {new Date(appointment.date).getDate()}
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase">
                          {new Date(appointment.date).toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                      </div>

                      <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-gray-900">{appointment.type}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <Stethoscope size={10} />{appointment.doctor}
                        </p>
                      </div>

                      <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">{appointment.time}</span>
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
                medicalHistory.length > 0 ? (
                  medicalHistory.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0 cursor-pointer"
                    >
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900 leading-none">
                          {new Date(record.date).getDate()}
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase">
                          {new Date(record.date).toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                      </div>

                      <div className="w-px h-8 bg-gray-200 flex-shrink-0"></div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-gray-900">{record.type}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <Stethoscope size={10} />{record.doctor}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{record.time}</span>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                          record.status === 'Completada'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                      <FileText size={16} className="text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-500">No hay historial médico</p>
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
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><IdCard size={10} />Identificación</label>
                  <p className="text-xs text-gray-900 font-medium">{patient.identification}</p>
                </div>
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><Cake size={10} />Edad</label>
                  <p className="text-xs text-gray-900 font-medium">{patient.age} años</p>
                  <p className="text-[10px] text-gray-600">{patient.birthDate}</p>
                </div>
              </div>

              {/* Alergias */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><AlertCircle size={10} />Alergias</label>
                <div className="space-y-1.5">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="p-2.5 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle size={10} className="text-red-600" />
                          <p className="text-xs text-gray-900 font-medium">{allergy.name}</p>
                        </div>
                        <span className="text-[9px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">{allergy.severity}</span>
                      </div>
                    </div>
                  ))}
                  {allergies.length === 0 && (
                    <p className="text-[10px] text-gray-500 italic">Sin alergias registradas</p>
                  )}
                </div>
              </div>

              {/* Teléfonos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2"><Phone size={10} />Teléfonos</label>
                <div className="space-y-2">
                  {patient.phones.map((phone, index) => (
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
                  {patient.emails.map((email, index) => (
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
                  {patient.addresses.map((address, index) => (
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

      {/* Modals */}
      <CitaDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      <ObservacionesModal
        isOpen={isObservacionesModalOpen}
        onClose={() => setIsObservacionesModalOpen(false)}
        initialContent={observaciones}
        onSave={setObservaciones}
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
    </div>
  );
}
