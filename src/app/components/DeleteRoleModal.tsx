import { Modal, ModalButton } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName: string;
  assignedUsers: number;
}

export function DeleteRoleModal({ isOpen, onClose, onConfirm, roleName, assignedUsers }: DeleteRoleModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Rol"
      maxWidth="md"
      footer={
        <>
          <ModalButton onClick={onClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton onClick={handleConfirm} variant="danger">
            Eliminar Rol
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
              ¿Estás seguro de que deseas eliminar este rol?
            </h3>
            <p className="text-xs text-gray-600">
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos asociados con este rol.
            </p>
          </div>
        </div>

        {/* Role Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-2">
          <div>
            <p className="text-[10px] font-medium text-gray-600">Rol a eliminar:</p>
            <p className="text-xs font-semibold text-gray-900">{roleName}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-600">Usuarios asignados:</p>
            <p className="text-xs text-gray-900">{assignedUsers} usuario{assignedUsers !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Warning List */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
          <p className="text-xs font-medium text-red-800 mb-1.5">Al eliminar este rol:</p>
          <ul className="text-[10px] text-red-700 space-y-0.5 list-disc list-inside">
            <li>Se removerá el rol de todos los usuarios asignados</li>
            <li>Los usuarios perderán los permisos asociados a este rol</li>
            <li>Se eliminará la configuración de permisos del rol</li>
            <li>Los registros históricos permanecerán para auditoría</li>
            <li>No podrá recuperarse este rol</li>
          </ul>
        </div>

        {/* Users Warning */}
        {assignedUsers > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
            <p className="text-xs font-medium text-yellow-800 mb-1">
              ⚠️ Atención: Este rol está asignado a {assignedUsers} usuario{assignedUsers !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-yellow-700">
              Asegúrate de que estos usuarios tengan otros roles o permisos asignados para mantener su acceso al sistema.
            </p>
          </div>
        )}

        {/* Confirmation Message */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-600 text-center">
            Si estás seguro, haz clic en <span className="font-semibold text-red-600">"Eliminar Rol"</span> para confirmar
          </p>
        </div>
      </div>
    </Modal>
  );
}