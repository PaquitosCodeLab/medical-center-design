import { Server, Database, Globe, Clock, Shield, Activity, HardDrive, Cpu, Wifi, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../components/Badge';
import { useHeader } from '../components/HeaderContext';

export function SystemConfig() {
  useHeader({ title: 'Sistema', subtitle: 'Configuración y estado del sistema' });

  return (
    <div className="space-y-4">

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Servidor', value: 'En línea', icon: Server, dot: 'bg-green-500' },
          { label: 'Almacenamiento', value: '12.4 / 50 GB', icon: HardDrive, dot: 'bg-blue-500' },
          { label: 'CPU / RAM', value: '2 cores / 8 GB', icon: Cpu, dot: 'bg-blue-500' },
          { label: 'Uptime', value: '99.9%', icon: Activity, dot: 'bg-green-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2.5 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-900">{stat.value}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                  </div>
                  <p className="text-[9px] text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Información del Sistema */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Server size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Información del Sistema</h3>
            </div>
          </div>
          <div>
            {[
              { label: 'Versión', value: 'v2.4.1', icon: Activity },
              { label: 'Entorno', value: 'Staging', icon: Globe },
              { label: 'Última actualización', value: '20/03/2026, 14:30', icon: Clock },
              { label: 'Plataforma', value: 'Dokploy VPS', icon: HardDrive },
              { label: 'Red', value: 'dokploy-network', icon: Wifi },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 last:border-0">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <item.icon size={11} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-900">{item.value}</p>
                  <p className="text-[9px] text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Shield size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Servicios</h3>
            </div>
            <Badge variant="gray" size="sm">5 activos</Badge>
          </div>
          <div>
            {/* Microservicios */}
            <div className="bg-gray-50 border-b border-gray-100">
              <div className="px-4 py-1.5 flex items-center gap-1.5">
                <Server size={10} className="text-gray-400" />
                <span className="text-[9px] font-semibold text-gray-500 uppercase">Microservicios</span>
              </div>
            </div>
            {[
              { name: 'API Gateway', version: 'YARP 2.1', status: 'online' },
              { name: 'User Service', version: '.NET 8', status: 'online' },
              { name: 'Audit Service', version: '.NET 8', status: 'online' },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Server size={11} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-900">{svc.name}</p>
                  <p className="text-[9px] text-gray-500">{svc.version}</p>
                </div>
                <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 inline-flex items-center gap-0.5">
                  <CheckCircle size={8} />Activo
                </span>
              </div>
            ))}

            {/* Bases de Datos */}
            <div className="bg-gray-50 border-b border-gray-100">
              <div className="px-4 py-1.5 flex items-center gap-1.5">
                <Database size={10} className="text-gray-400" />
                <span className="text-[9px] font-semibold text-gray-500 uppercase">Bases de Datos</span>
              </div>
            </div>
            {[
              { name: 'PostgreSQL', version: '16.1', status: 'online' },
              { name: 'Redis Cache', version: '7.2', status: 'online' },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 last:border-0">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Database size={11} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-900">{svc.name}</p>
                  <p className="text-[9px] text-gray-500">{svc.version}</p>
                </div>
                <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 inline-flex items-center gap-0.5">
                  <CheckCircle size={8} />Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
