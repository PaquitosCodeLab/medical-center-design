import { X, IdCard, Calendar, User } from 'lucide-react';
import { useState } from 'react';

interface Identification {
  type: string;
  number: string;
}

export interface BasicInfoData {
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

export function EditBasicInfoModal({ isOpen, onClose, basicInfoData, onSave }: EditBasicInfoModalProps) {
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

    // Clear error for this field
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IdCard size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editar Información Básica</h2>
                <p className="text-xs text-gray-500">Actualiza la información básica de la persona</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Identificaciones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                  <IdCard size={14} className="text-blue-600" />
                  Identificaciones
                </label>
                <button
                  onClick={handleAddIdentification}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="text-lg leading-none">+</span>
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {identifications.map((identification, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            Tipo de Identificación
                          </label>
                          <select
                            value={identification.type}
                            onChange={(e) => handleIdentificationChange(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {IDENTIFICATION_TYPES.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            Número de Identificación *
                          </label>
                          <input
                            type="text"
                            value={identification.number}
                            onChange={(e) => handleIdentificationChange(index, 'number', e.target.value)}
                            placeholder="Ej: 12345678A"
                            className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors[index]?.number ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[index]?.number && (
                            <p className="text-[10px] text-red-600 mt-1">{errors[index].number}</p>
                          )}
                        </div>
                      </div>
                      {identifications.length > 1 && (
                        <button
                          onClick={() => handleRemoveIdentification(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-6"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Género */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                Género *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
