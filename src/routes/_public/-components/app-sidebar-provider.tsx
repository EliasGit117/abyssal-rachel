import { ReactNode, useState } from 'react';
import { createStore, StoreApi } from 'zustand/vanilla';
import { useStore } from 'zustand/react';
import { contextFactory } from '@/lib/context-factory.ts';

interface IAppSidebarStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
}

const [AppSidebarContext, useAppSidebarStore] = contextFactory<StoreApi<IAppSidebarStore>>({ name: 'AppSidebarContext' });

export const AppSidebarProvider = ({ children }: { children: ReactNode; }) => {
  const [store] = useState(() => createStore<IAppSidebarStore>((set) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false })
    }))
  );

  return (
    <AppSidebarContext.Provider value={store}>
      {children}
    </AppSidebarContext.Provider>
  );
};

export const useAppSidebar = <T, >(selector: (state: IAppSidebarStore) => T) => {
  const store = useAppSidebarStore()
  if (!store)
    throw new Error('Missing AppSidebarProvider');

  return useStore(store, selector);
};
