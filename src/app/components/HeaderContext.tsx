import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface HeaderConfig {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  backTo?: string;
}

interface HeaderContextType {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  config: { title: '', subtitle: '' },
  setConfig: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({ title: '', subtitle: '' });

  return (
    <HeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderConfig() {
  return useContext(HeaderContext);
}

export function useHeader(config: HeaderConfig) {
  const { setConfig } = useHeaderConfig();

  useEffect(() => {
    setConfig(config);
    return () => setConfig({ title: '', subtitle: '' });
  });
}
