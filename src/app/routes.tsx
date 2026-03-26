import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Doctors } from './pages/Doctors';
import { DoctorDetail } from './pages/DoctorDetail';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { Users } from './pages/Users';
import { UserDetail } from './pages/UserDetail';
import { Roles } from './pages/Roles';
import { RoleDetail } from './pages/RoleDetail';
import { Preferences } from './pages/Preferences';
import { NotificationsSettings } from './pages/NotificationsSettings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { SystemConfig } from './pages/SystemConfig';
import { Catalogs } from './pages/Catalogs';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'appointments', Component: Appointments },
      { path: 'doctors', Component: Doctors },
      { path: 'doctors/:id', Component: DoctorDetail },
      { path: 'patients', Component: Patients },
      { path: 'patients/:id', Component: PatientDetail },
      { path: 'accounts/users', Component: Users },
      { path: 'accounts/users/:id', Component: UserDetail },
      { path: 'accounts/roles', Component: Roles },
      { path: 'accounts/roles/:id', Component: RoleDetail },
      { path: 'settings/preferences', Component: Preferences },
      { path: 'settings/notifications', Component: NotificationsSettings },
      { path: 'config/system', Component: SystemConfig },
      { path: 'config/catalogs', Component: Catalogs },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
]);