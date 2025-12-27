import { FC, PropsWithChildren, useEffect } from 'react';
import { ProgressProvider } from '@bprogress/react';
import { ThemeProvider } from '@/components/theme';
import { Toaster } from '@/components/ui/sonner.tsx';
import { BProgress } from '@bprogress/core';
import { useRouter } from '@tanstack/react-router';

interface IProps extends PropsWithChildren {
}

const Providers: FC<IProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const unsubOnBeforeLoad = router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
      fromLocation && pathChanged && BProgress.start();
    });

    const unsubOnLoad = router.subscribe('onLoad', () => BProgress.done());

    return () => {
      unsubOnBeforeLoad();
      unsubOnLoad();
    };
  }, [router]);

  return (
    <>
      <ThemeProvider defaultTheme="system">
        <ProgressProvider options={{ template: null, positionUsing: 'width' }} disableStyle>
            {children}
            <Toaster richColors/>
        </ProgressProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;