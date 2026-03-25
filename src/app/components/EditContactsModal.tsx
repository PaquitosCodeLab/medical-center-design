import { X, Mail, Phone, Plus, Trash2, Briefcase, User, Smartphone, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './Badge';

interface Email {
  address: string;
  type: string;
  isPrimary: boolean;
}

interface PhoneNumber {
  number: string;
  type: string;
  isPrimary: boolean;
}

export interface ContactsData {
  emails: Email[];
  phones: PhoneNumber[];
}

interface EditContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactsData: ContactsData;
  onSave: (data: ContactsData) => void;
}

export function EditContactsModal({ isOpen, onClose, contactsData, onSave }: EditContactsModalProps) {
  const [emails, setEmails] = useState<Email[]>(contactsData.emails);
  const [phones, setPhones] = useState<PhoneNumber[]>(contactsData.phones);
  const [errors, setErrors] = useState<{ emails: string[]; phones: string[] }>({ emails: [], phones: [] });

  if (!isOpen) return null;

  const handleAddEmail = () => {
    setEmails([...emails, { address: '', type: 'Trabajo', isPrimary: false }]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleEmailChange = (index: number, field: keyof Email, value: string | boolean) => {
    const newEmails = [...emails];
    if (field === 'isPrimary' && value === true) {
      // Desmarcar otros como primarios
      newEmails.forEach((email, i) => {
        if (i !== index) email.isPrimary = false;
      });
    }
    (newEmails[index][field] as any) = value;
    setEmails(newEmails);
  };

  const handleAddPhone = () => {
    setPhones([...phones, { number: '', type: 'Móvil', isPrimary: false }]);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  const handlePhoneChange = (index: number, field: keyof PhoneNumber, value: string | boolean) => {
    const newPhones = [...phones];
    if (field === 'isPrimary' && value === true) {
      // Desmarcar otros como primarios
      newPhones.forEach((phone, i) => {
        if (i !== index) phone.isPrimary = false;
      });
    }
    (newPhones[index][field] as any) = value;
    setPhones(newPhones);
  };

  const validateForm = () => {
    const emailErrors: string[] = [];
    const phoneErrors: string[] = [];

    emails.forEach((email, index) => {
      if (!email.address) {
        emailErrors[index] = 'El correo electrónico es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.address)) {
        emailErrors[index] = 'Formato de correo inválido';
      }
    });

    phones.forEach((phone, index) => {
      if (!phone.number) {
        phoneErrors[index] = 'El número de teléfono es requerido';
      }
    });

    setErrors({ emails: emailErrors, phones: phoneErrors });
    return emailErrors.filter(Boolean).length === 0 && phoneErrors.filter(Boolean).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ emails, phones });
      onClose();
    }
  };

  const handleCancel = () => {
    setEmails(contactsData.emails);
    setPhones(contactsData.phones);
    setErrors({ emails: [], phones: [] });
    onClose();
  };

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case 'Trabajo':
        return <Briefcase size={13} className="text-blue-600" />;
      case 'Personal':
        return <User size={13} className="text-green-600" />;
      default:
        return <Mail size={13} className="text-gray-600" />;
    }
  };

  const getEmailTypeColor = (type: string) => {
    switch (type) {
      case 'Trabajo':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Personal':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getPhoneTypeIcon = (type: string) => {
    switch (type) {
      case 'Móvil':
        return <Smartphone size={13} className="text-purple-600" />;
      case 'Trabajo':
        return <Briefcase size={13} className="text-blue-600" />;
      case 'Casa':
        return <HomeIcon size={13} className="text-orange-600" />;
      default:
        return <Phone size={13} className="text-gray-600" />;
    }
  };

  const getPhoneTypeColor = (type: string) => {
    switch (type) {
      case 'Móvil':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'Trabajo':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Casa':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-green-50 via-blue-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
              <Mail size={16} className="text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Contactos</h2>
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
            {/* Correos Electrónicos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded">
                    <Mail size={12} className="text-green-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Correos</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {emails.length}
                  </span>
                </div>
                <button
                  onClick={handleAddEmail}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                  title="Agregar correo"
                >
                  <Plus size={13} />
                  <span>Agregar</span>
                </button>
              </div>
              
              <div className="space-y-2.5">
                {emails.map((email, index) => (
                  <div 
                    key={index} 
                    className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${
                      email.isPrimary 
                        ? 'border-green-300 bg-gradient-to-br from-green-50 to-white shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Primary Badge */}
                    {email.isPrimary && (
                      <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        Principal
                      </div>
                    )}

                    {/* Type Selector */}
                    <div className="flex items-center gap-1.5 mb-2">
                      {['Trabajo', 'Personal', 'Otro'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleEmailChange(index, 'type', type)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                            email.type === type
                              ? getEmailTypeColor(type)
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {getEmailTypeIcon(type)}
                          <span>{type}</span>
                        </button>
                      ))}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveEmail(index)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        disabled={emails.length === 1}
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-gray-600">
                        Dirección de correo
                      </label>
                      <input
                        type="email"
                        value={email.address}
                        onChange={(e) => handleEmailChange(index, 'address', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                          errors.emails[index] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors.emails[index] && (
                        <p className="text-[10px] text-red-600 ml-1">{errors.emails[index]}</p>
                      )}
                    </div>

                    {/* Primary Checkbox */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-green-600 transition-colors mt-2">
                      <input
                        type="checkbox"
                        checked={email.isPrimary}
                        onChange={(e) => handleEmailChange(index, 'isPrimary', e.target.checked)}
                        className="w-3.5 h-3.5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-[10px] font-medium">Marcar como principal</span>
                    </label>
                  </div>
                ))}
              </div>

              {emails.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">No hay correos agregados</p>
                  <button
                    onClick={handleAddEmail}
                    className="px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                  >
                    Agregar correo
                  </button>
                </div>
              )}
            </div>

            {/* Teléfonos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <Phone size={12} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Teléfonos</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {phones.length}
                  </span>
                </div>
                <button
                  onClick={handleAddPhone}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  title="Agregar teléfono"
                >
                  <Plus size={13} />
                  <span>Agregar</span>
                </button>
              </div>
              
              <div className="space-y-2.5">
                {phones.map((phone, index) => (
                  <div 
                    key={index} 
                    className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${
                      phone.isPrimary 
                        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Primary Badge */}
                    {phone.isPrimary && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        Principal
                      </div>
                    )}

                    {/* Type Selector */}
                    <div className="flex items-center gap-1.5 mb-2">
                      {['Móvil', 'Trabajo', 'Casa', 'Otro'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handlePhoneChange(index, 'type', type)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-lg border transition-all ${
                            phone.type === type
                              ? getPhoneTypeColor(type)
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {getPhoneTypeIcon(type)}
                          <span>{type}</span>
                        </button>
                      ))}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemovePhone(index)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        disabled={phones.length === 1}
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-medium text-gray-600">
                        Número de teléfono
                      </label>
                      <input
                        type="tel"
                        value={phone.number}
                        onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                        placeholder="+34 600 000 000"
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          errors.phones[index] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors.phones[index] && (
                        <p className="text-[10px] text-red-600 ml-1">{errors.phones[index]}</p>
                      )}
                    </div>

                    {/* Primary Checkbox */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors mt-2">
                      <input
                        type="checkbox"
                        checked={phone.isPrimary}
                        onChange={(e) => handlePhoneChange(index, 'isPrimary', e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-[10px] font-medium">Marcar como principal</span>
                    </label>
                  </div>
                ))}
              </div>

              {phones.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">No hay teléfonos agregados</p>
                  <button
                    onClick={handleAddPhone}
                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  >
                    Agregar teléfono
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
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}