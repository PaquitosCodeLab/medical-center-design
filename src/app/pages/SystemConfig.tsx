import { Server, Database, Globe, Clock, Shield, Activity, HardDrive, Cpu } from 'lucide-react';
import { Badge } from '../components/Badge';
import { useHeader } from '../components/HeaderContext';

export function SystemConfig() {
  useHeader({ title: 'Sistema', subtitle: 'Configuración y estado del sistema' });

  return (
    <div className="space-y-4">

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Server size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Estado del Servidor</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-xs font-semibold text-gray-900">En línea</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <HardDrive size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Almacenamiento</p>
              <p className="text-xs font-semibold text-gray-900">12.4 / 50 GB</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">CPU / RAM</p>
              <p className="text-xs font-semibold text-gray-900">2 cores / 8 GB</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Uptime</p>
              <p className="text-xs font-semibold text-gray-900">99.9%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Información del Sistema */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Server size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Información del Sistema</h3>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            {[
              { label: 'Versión', value: 'v2.4.1', icon: Activity },
              { label: 'Entorno', value: 'Staging', icon: Globe },
              { label: 'Última actualización', value: '20/03/2026, 14:30', icon: Clock },
              { label: 'Plataforma', value: 'Dokploy VPS', icon: HardDrive },
              { label: 'Red', value: 'dokploy-network', icon: Globe },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon size={12} className="text-blue-600" />
                  <span className="text-[10px] text-gray-500">{item.label}</span>
                </div>
                <span className="text-[10px] font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Shield size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Servicios</h3>
              <Badge variant="gray" size="sm" className="ml-auto">5 activos</Badge>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {/* Microservicios */}
            <div>
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Microservicios</p>
              <div className="space-y-1.5">
                {[
                  { name: 'API Gateway', version: 'YARP 2.1' },
                  { name: 'User Service', version: '.NET 8' },
                  { name: 'Audit Service', version: '.NET 8' },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-medium text-gray-900">{svc.name}</span>
                    </div>
                    <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{svc.version}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bases de Datos */}
            <div>
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bases de Datos</p>
              <div className="space-y-1.5">
                {[
                  { name: 'PostgreSQL', version: '16.1' },
                  { name: 'Redis Cache', version: '7.2' },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-medium text-gray-900">{svc.name}</span>
                    </div>
                    <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{svc.version}</span>
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
