import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './components/SidebarContext';
import { ThemeProvider } from './components/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </ThemeProvider>
  );
}
