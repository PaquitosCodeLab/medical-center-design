import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, User, FileText, MoreVertical, Edit, Trash2, Clock, Heart, MapPin, Droplet, AlertCircle, Stethoscope, IdCard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { DetailCard } from '../components/DetailCard';

export function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Mock data - en producción vendría de una API
  const patient = {
    id,
    name: 'María García',
    age: 45,
    email: 'maria.garcia@email.com',
    phone: '+1 234 567 8901',
    address: 'Calle Principal 123, Ciudad',
    bloodType: 'O+',
    allergies: 'Penicilina',
    doctor: 'Dr. Carlos López',
    status: 'Activo',
    lastModified: '2026-03-19 14:30:00',
    identification: 'DNI 12345678A',
    birthDate: '1980-05-15',
    gender: 'Femenino',
  };

  const medicalHistory = [
    { id: 1, date: '2026-03-15', type: 'Consulta General', doctor: 'Dr. López', notes: 'Control de rutina' },
    { id: 2, date: '2026-02-10', type: 'Seguimiento', doctor: 'Dr. López', notes: 'Revisión de tratamiento' },
    { id: 3, date: '2026-01-05', type: 'Primera Consulta', doctor: 'Dr. López', notes: 'Evaluación inicial' },
  ];

  const upcomingAppointments = [
    { id: 1, date: '2026-03-25', time: '10:00 AM', type: 'Control', doctor: 'Dr. López' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Paciente</h1>
          <p className="text-xs text-gray-500">Información completa e historial médico del paciente</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button 
                onClick={() => {
                  console.log('Editar paciente');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={14} />
                Editar Paciente
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={() => {
                  console.log('Eliminar paciente');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Eliminar Paciente
              </button>
            </div>
          )}
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
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {patient.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={patient.status === 'Activo' ? 'green' : 'gray'}>
                      {patient.status}
                    </Badge>
                    <Badge variant="blue">
                      <User size={12} />
                      {patient.age} años
                    </Badge>
                    <Badge variant="gray">
                      <Clock size={12} />
                      {new Date(patient.lastModified).toLocaleString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
          {/* Información Personal */}
          <DetailCard title="Información Personal" icon={User}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                    <IdCard size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Identificación</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.identification}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
                    <Calendar size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Fecha de Nacimiento</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.birthDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100">
                    <User size={14} className="text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Género</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
                    <Droplet size={14} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Tipo de Sangre</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                    <Mail size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Email</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
                    <Phone size={14} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Teléfono</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                    <MapPin size={14} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Dirección</label>
                    <p className="text-xs text-gray-900 font-medium">{patient.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </DetailCard>

          {/* Información Médica */}
          <DetailCard 
            title="Información Médica" 
            icon={Heart}
            badge={
              <Badge variant="red" size="sm">
                <AlertCircle size={10} />
                Alergias
              </Badge>
            }
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
                  <AlertCircle size={14} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-red-600 mb-0.5">Alergias Conocidas</label>
                  <p className="text-xs text-gray-900 font-medium">{patient.allergies}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                  <Stethoscope size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Doctor Asignado</label>
                  <p className="text-xs text-gray-900 font-medium">{patient.doctor}</p>
                </div>
              </div>
            </div>
          </DetailCard>

          {/* Medical History */}
          <DetailCard 
            title="Historial Médico" 
            icon={FileText}
            badge={
              <Badge variant="gray" size="sm">
                {medicalHistory.length} registros
              </Badge>
            }
          >
            <div className="p-4 space-y-3">
              {medicalHistory.map((record) => (
                <div key={record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-gray-900">{record.type}</p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 mb-1 flex items-center gap-1">
                      <Stethoscope size={10} />
                      {record.doctor}
                    </p>
                    <p className="text-[10px] text-gray-500">{record.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Upcoming Appointments */}
          <DetailCard 
            title="Próximas Citas" 
            icon={Calendar}
            badge={
              <Badge variant="blue" size="sm">
                {upcomingAppointments.length}
              </Badge>
            }
          >
            <div className="p-4 space-y-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="blue" size="sm">
                        {appointment.type}
                      </Badge>
                      <span className="text-[10px] text-gray-500">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mb-1">{appointment.doctor}</p>
                    <p className="text-[10px] text-gray-600 flex items-center gap-1">
                      <Clock size={10} />
                      {appointment.time}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No hay citas programadas</p>
              )}
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}