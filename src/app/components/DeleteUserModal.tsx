import { Modal, ModalButton } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, userName, userEmail }: DeleteUserModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Usuario"
      maxWidth="md"
      footer={
        <>
          <ModalButton onClick={onClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton onClick={handleConfirm} variant="danger">
            Eliminar Usuario
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Warning Icon and Message */}
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-900 mb-1">
              ¿Estás seguro de que deseas eliminar este usuario?
            </h3>
            <p className="text-xs text-gray-600">
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos asociados con este usuario.
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-2">
          <div>
            <p className="text-[10px] font-medium text-gray-600">Usuario a eliminar:</p>
            <p className="text-xs font-semibold text-gray-900">{userName}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-600">Correo electrónico:</p>
            <p className="text-xs text-gray-900">{userEmail}</p>
          </div>
        </div>

        {/* Warning List */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
          <p className="text-xs font-medium text-red-800 mb-1.5">Al eliminar este usuario:</p>
          <ul className="text-[10px] text-red-700 space-y-0.5 list-disc list-inside">
            <li>Se revocarán todos los permisos y roles asignados</li>
            <li>Se eliminará el acceso al sistema</li>
            <li>Los registros históricos permanecerán para auditoría</li>
            <li>No podrá recuperarse esta cuenta</li>
          </ul>
        </div>

        {/* Confirmation Message */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-600 text-center">
            Si estás seguro, haz clic en <span className="font-semibold text-red-600">"Eliminar Usuario"</span> para confirmar
          </p>
        </div>
      </div>
    </Modal>
  );
}