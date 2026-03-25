import { useState } from 'react';
import { Modal, ModalButton } from './Modal';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (passwords: PasswordData) => void;
  userName: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordModal({ isOpen, onClose, onChange, userName }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (currentPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    const passwordData: PasswordData = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    onChange(passwordData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Contraseña"
      maxWidth="md"
      footer={
        <>
          <ModalButton onClick={handleClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton onClick={handleChange} variant="primary">
            Cambiar Contraseña
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <p className="text-xs text-blue-800">
            Cambiando contraseña para: <span className="font-semibold">{userName}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setError('');
              }}
              className="w-full px-2 py-1 pr-7 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCurrentPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              className="w-full px-2 py-1 pr-7 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className="w-full px-2 py-1 pr-7 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
              placeholder="Repite la nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <p className="text-xs font-medium text-gray-700 mb-1.5">Requisitos de contraseña:</p>
          <ul className="text-[10px] text-gray-600 space-y-0.5 list-disc list-inside">
            <li>Mínimo 8 caracteres</li>
            <li>Debe ser diferente a la contraseña actual</li>
            <li>Se recomienda usar mayúsculas, minúsculas, números y símbolos</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}