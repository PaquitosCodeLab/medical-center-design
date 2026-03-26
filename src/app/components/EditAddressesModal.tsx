import { X, MapPin, Plus, Trash2, Home, Briefcase, MapPinned } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './Badge';

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: string;
  isPrimary: boolean;
}

export interface AddressesData {
  addresses: Address[];
}

interface EditAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressesData: AddressesData;
  onSave: (data: AddressesData) => void;
}

export function EditAddressesModal({ isOpen, onClose, addressesData, onSave }: EditAddressesModalProps) {
  const [addresses, setAddresses] = useState<Address[]>(addressesData.addresses);
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});

  if (!isOpen) return null;

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { street: '', city: '', postalCode: '', country: 'España', type: 'Casa', isPrimary: false }
    ]);
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    const newAddresses = [...addresses];
    if (field === 'isPrimary' && value === true) {
      // Desmarcar otros como primarios
      newAddresses.forEach((address, i) => {
        if (i !== index) address.isPrimary = false;
      });
    }
    (newAddresses[index][field] as any) = value;
    setAddresses(newAddresses);
  };

  const validateForm = () => {
    const newErrors: { [key: number]: { [key: string]: string } } = {};

    addresses.forEach((address, index) => {
      const addressErrors: { [key: string]: string } = {};
      
      if (!address.street) addressErrors.street = 'La calle es requerida';
      if (!address.city) addressErrors.city = 'La ciudad es requerida';
      if (!address.postalCode) addressErrors.postalCode = 'El código postal es requerido';
      if (!address.country) addressErrors.country = 'El país es requerido';

      if (Object.keys(addressErrors).length > 0) {
        newErrors[index] = addressErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ addresses });
      onClose();
    }
  };

  const handleCancel = () => {
    setAddresses(addressesData.addresses);
    setErrors({});
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Casa':
        return <Home size={13} className="text-blue-600" />;
      case 'Trabajo':
        return <Briefcase size={13} className="text-blue-600" />;
      default:
        return <MapPinned size={13} className="text-blue-600" />;
    }
  };

  const getTypeColor = (_type: string) => {
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <MapPin size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Editar Direcciones</h2>
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-gray-900">Direcciones guardadas</h3>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {addresses.length}
              </span>
            </div>
            <button
              onClick={handleAddAddress}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              <Plus size={13} />
              <span>Agregar</span>
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((address, index) => (
              <div 
                key={index} 
                className={`group relative border rounded-xl p-3 transition-all hover:shadow-md ${
                  address.isPrimary
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Primary Badge */}
                {address.isPrimary && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                    Principal
                  </div>
                )}

                {/* Type Selector */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex gap-1">
                    {['Casa', 'Trabajo', 'Otro'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAddressChange(index, 'type', type)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border transition-all ${
                          address.type === type
                            ? getTypeColor(type)
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {getTypeIcon(type)}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex-1"></div>

                  {/* Primary Checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 hover:text-blue-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={address.isPrimary}
                      onChange={(e) => handleAddressChange(index, 'isPrimary', e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-[10px] font-medium">Marcar como principal</span>
                  </label>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveAddress(index)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    disabled={addresses.length === 1}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Address Fields */}
                <div className="space-y-2">
                  {/* Street Address */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">
                      Calle y número
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      placeholder="Ej: Av. Principal 123"
                      className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors[index]?.street ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    />
                    {errors[index]?.street && (
                      <p className="text-[10px] text-red-600 ml-1 mt-1">{errors[index].street}</p>
                    )}
                  </div>

                  {/* City, Postal Code, Country */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                        placeholder="Ciudad"
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          errors[index]?.city ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors[index]?.city && (
                        <p className="text-[10px] text-red-600 ml-1 mt-1">{errors[index].city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">
                        Código postal
                      </label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                        placeholder="28001"
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          errors[index]?.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors[index]?.postalCode && (
                        <p className="text-[10px] text-red-600 ml-1 mt-1">{errors[index].postalCode}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">
                        País
                      </label>
                      <select
                        value={address.country}
                        onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                        className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          errors[index]?.country ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <option value="España">España</option>
                        <option value="México">México</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Chile">Chile</option>
                        <option value="Perú">Perú</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="República Dominicana">República Dominicana</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Panamá">Panamá</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="Otro">Otro</option>
                      </select>
                      {errors[index]?.country && (
                        <p className="text-[10px] text-red-600 ml-1 mt-1">{errors[index].country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {addresses.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                <MapPin size={24} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-600">No hay direcciones agregadas</p>
              <button
                onClick={handleAddAddress}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                Agregar primera dirección
              </button>
            </div>
          )}
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