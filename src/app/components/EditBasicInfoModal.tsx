import { X, IdCard, Calendar, User, Users, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Identification {
  type: string;
  number: string;
}

export interface BasicInfoData {
  firstName?: string;
  lastName?: string;
  userType?: string;
  identifications: Identification[];
  gender: string;
  birthDate: string;
}

interface EditBasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  basicInfoData: BasicInfoData;
  onSave: (data: BasicInfoData) => void;
}

const IDENTIFICATION_TYPES = ['DNI', 'NIE', 'Pasaporte', 'Otro'];
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const USER_TYPE_OPTIONS = ['Usuario', 'Administrador', 'Desarrollador'];

export function EditBasicInfoModal({ isOpen, onClose, basicInfoData, onSave }: EditBasicInfoModalProps) {
  const [firstName, setFirstName] = useState(basicInfoData.firstName || '');
  const [lastName, setLastName] = useState(basicInfoData.lastName || '');
  const [userType, setUserType] = useState(basicInfoData.userType || '');

  useEffect(() => {
    if (isOpen) {
      setFirstName(basicInfoData.firstName || '');
      setLastName(basicInfoData.lastName || '');
      setUserType(basicInfoData.userType || '');
      setIdentifications(basicInfoData.identifications);
      setGender(basicInfoData.gender);
      setBirthDate(basicInfoData.birthDate);
    }
  }, [isOpen]);
  const [identifications, setIdentifications] = useState<Identification[]>(basicInfoData.identifications);
  const [gender, setGender] = useState(basicInfoData.gender);
  const [birthDate, setBirthDate] = useState(basicInfoData.birthDate);
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});

  if (!isOpen) return null;

  const handleAddIdentification = () => {
    setIdentifications([...identifications, { type: 'DNI', number: '' }]);
  };

  const handleRemoveIdentification = (index: number) => {
    const newIdentifications = identifications.filter((_, i) => i !== index);
    setIdentifications(newIdentifications);
  };

  const handleIdentificationChange = (index: number, field: keyof Identification, value: string) => {
    const newIdentifications = [...identifications];
    newIdentifications[index][field] = value;
    setIdentifications(newIdentifications);

    const newErrors = { ...errors };
    if (newErrors[index]) {
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: { [key: number]: { [key: string]: string } } = {};
    let isValid = true;

    identifications.forEach((id, index) => {
      if (!id.number.trim()) {
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index].number = 'El número de identificación es requerido';
        isValid = false;
      }
    });

    if (!gender) {
      isValid = false;
    }

    if (!birthDate) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        identifications,
        gender,
        birthDate,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setIdentifications(basicInfoData.identifications);
    setGender(basicInfoData.gender);
    setBirthDate(basicInfoData.birthDate);
    setErrors({});
    onClose();
  };

  const getIdTypeIcon = (type: string) => {
    switch (type) {
      case 'DNI':
        return <IdCard size={13} className="text-blue-600" />;
      case 'NIE':
        return <IdCard size={13} className="text-blue-600" />;
      case 'Pasaporte':
        return <IdCard size={13} className="text-blue-600" />;
      default:
        return <HelpCircle size={13} className="text-blue-600" />;
    }
  };

  const getIdTypeColor = (_type: string) => {
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  const getGenderIcon = (option: string) => {
    switch (option) {
      case 'Masculino':
        return <User size={13} className="text-blue-600" />;
      case 'Femenino':
        return <User size={13} className="text-blue-600" />;
      case 'Otro':
        return <Users size={13} className="text-blue-600" />;
      default:
        return <HelpCircle size={13} className="text-blue-600" />;
    }
  };

  const getGenderColor = (_option: string) => {
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <IdCard size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Información Básica</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Información Personal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-blue-100 rounded">
                  <User size={12} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Información Personal</h3>
              </div>

              <div className="border rounded-xl p-3 border-gray-200 bg-white space-y-3">
                {/* Nombre, Apellido y Tipo */}
                <div className={`grid gap-2 ${userType ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Apellido</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  {userType && (
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Tipo de Usuario</label>
                      <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                        {USER_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Género */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">
                    Género
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => setGender(option)}
                        className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                          gender === option
                            ? getGenderColor(option)
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {getGenderIcon(option)}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5">
                    Fecha de nacimiento
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Calendar size={13} className="text-blue-600" />
                    </div>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Identificaciones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <IdCard size={12} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Identificaciones</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {identifications.length}
                  </span>
                </div>
                <button
                  onClick={handleAddIdentification}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  title="Agregar identificación"
                >
                  <Plus size={13} />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {identifications.map((identification, index) => (
                  <div
                    key={index}
                    className="group relative border rounded-xl p-3 transition-all hover:shadow-md border-gray-200 bg-white hover:border-gray-300"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      {IDENTIFICATION_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleIdentificationChange(index, 'type', type)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                            identification.type === type
                              ? getIdTypeColor(type)
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {getIdTypeIcon(type)}
                          <span>{type}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleRemoveIdentification(index)}
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
                        value={identification.number}
                        onChange={(e) => handleIdentificationChange(index, 'number', e.target.value)}
                        placeholder="Ej: 12345678A"
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          errors[index]?.number ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors[index]?.number && (
                        <p className="text-[10px] text-red-600 ml-1">{errors[index].number}</p>
                      )}
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
                  <button
                    onClick={handleAddIdentification}
                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  >
                    Agregar identificación
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
