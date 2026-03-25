import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, Users, Clock, MoreVertical, Edit, Trash2, Shield, GraduationCap, Award, Stethoscope, Building, Star, TrendingUp, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { DetailCard } from '../components/DetailCard';

export function DoctorDetail() {
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

  // Helper functions for phone, email, and address type icons
  const getPhoneTypeIcon = (type: string) => {
    return <Phone size={14} className="text-blue-600" />;
  };

  const getEmailTypeIcon = (type: string) => {
    return <Mail size={14} className="text-blue-600" />;
  };

  const getAddressTypeIcon = (type: string) => {
    return <MapPin size={14} className="text-blue-600" />;
  };

  // Mock data - en producción vendría de una API
  const doctor = {
    id,
    name: 'Dr. Carlos López',
    specialty: 'Cardiología',
    status: 'Activo',
    patients: 45,
    experience: '15 años',
    education: 'Universidad Nacional - Especialización en Cardiología',
    lastModified: '2026-03-19 14:30:00',
    licenseNumber: 'MED-12345',
    rating: 4.8,
    hospital: 'Hospital General Central',
    phones: [
      { type: 'Oficina', number: '+1 234 567 8901', isPrimary: true },
      { type: 'Móvil', number: '+1 234 567 8902', isPrimary: false },
    ],
    emails: [
      { type: 'Profesional', address: 'carlos.lopez@hospital.com', isPrimary: true },
      { type: 'Personal', address: 'clopez@email.com', isPrimary: false },
    ],
    addresses: [
      { 
        type: 'Consultorio', 
        street: 'Av. Médica 789, Consultorio 5B', 
        city: 'Madrid',
        postalCode: '28003',
        isPrimary: true 
      },
      { 
        type: 'Hospital', 
        street: 'Calle Hospital General 100', 
        city: 'Madrid',
        postalCode: '28004',
        isPrimary: false 
      },
    ],
  };

  const upcomingAppointments = [
    { id: 1, patient: 'María García', time: '09:00 AM', date: '2026-03-19', type: 'Consulta General' },
    { id: 2, patient: 'Juan Pérez', time: '10:30 AM', date: '2026-03-19', type: 'Seguimiento' },
    { id: 3, patient: 'Laura Fernández', time: '09:30 AM', date: '2026-03-20', type: 'Control' },
  ];

  const stats = [
    { label: 'Pacientes Activos', value: '45', icon: Users, color: 'blue' },
    { label: 'Citas Esta Semana', value: '18', icon: Calendar, color: 'green' },
    { label: 'Años de Experiencia', value: '15', icon: Clock, color: 'purple' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/doctors')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Doctor</h1>
          <p className="text-xs text-gray-500">Información completa y actividad del doctor</p>
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
                  console.log('Editar doctor');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={14} />
                Editar Doctor
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={() => {
                  console.log('Eliminar doctor');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Eliminar Doctor
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
              {getInitials(doctor.name)}
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {doctor.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={doctor.status === 'Activo' ? 'green' : 'gray'}>
                      {doctor.status}
                    </Badge>
                    <Badge variant="blue">
                      <Shield size={12} />
                      {doctor.specialty}
                    </Badge>
                    <Badge variant="yellow">
                      <Star size={12} />
                      {doctor.rating}
                    </Badge>
                    <Badge variant="gray">
                      <Clock size={12} />
                      {new Date(doctor.lastModified).toLocaleString('es-ES', { 
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
          };
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Información Profesional */}
          <DetailCard title="Información Profesional" icon={Shield}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                    <Stethoscope size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Especialidad</label>
                    <p className="text-xs text-gray-900 font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
                    <Award size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Experiencia</label>
                    <p className="text-xs text-gray-900 font-medium">{doctor.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                    <Shield size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Licencia Médica</label>
                    <p className="text-xs text-gray-900 font-medium">{doctor.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                    <Building size={14} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Hospital</label>
                    <p className="text-xs text-gray-900 font-medium">{doctor.hospital}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
                    <GraduationCap size={14} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Educación</label>
                    <p className="text-xs text-gray-900 font-medium">{doctor.education}</p>
                  </div>
                </div>
              </div>
            </div>
          </DetailCard>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Próximas Citas */}
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
              {upcomingAppointments.map((appointment) => (
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
                  <p className="text-xs font-semibold text-gray-900 mb-1">{appointment.patient}</p>
                  <p className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Clock size={10} />
                    {appointment.time}
                  </p>
                </div>
              ))}
            </div>
          </DetailCard>

          {/* Contactos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Phone size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Contactos</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* Teléfonos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Phone size={10} />
                  Teléfonos
                </label>
                <div className="space-y-2">
                  {doctor.phones.map((phone, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-lg p-3 transition-all ${
                        phone.isPrimary 
                          ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                          : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      {phone.isPrimary && (
                        <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          Principal
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {getPhoneTypeIcon(phone.type)}
                        <span className="text-[10px] font-medium text-gray-600">{phone.type}</span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium">{phone.number}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correos Electrónicos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Mail size={10} />
                  Correos Electrónicos
                </label>
                <div className="space-y-2">
                  {doctor.emails.map((email, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-lg p-3 transition-all ${
                        email.isPrimary 
                          ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                          : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      {email.isPrimary && (
                        <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          Principal
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {getEmailTypeIcon(email.type)}
                        <span className="text-[10px] font-medium text-gray-600">{email.type}</span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium truncate">{email.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direcciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Direcciones</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2.5">
                {doctor.addresses.map((address, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-lg p-3 transition-all ${
                      address.isPrimary 
                        ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                        : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {address.isPrimary && (
                      <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        Principal
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mb-2">
                      {getAddressTypeIcon(address.type)}
                      <span className="text-[10px] font-medium text-gray-600">{address.type}</span>
                    </div>
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
  );
}