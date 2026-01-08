import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { ProgressProvider } from '@bprogress/react';
import { ThemeProvider } from '@/components/theme';
import { Toaster } from '@/components/ui/sonner.tsx';
import { BProgress } from '@bprogress/core';
import { useRouter } from '@tanstack/react-router';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog.tsx';



interface IProps extends PropsWithChildren {}

const Providers: FC<IProps> = ({ children }) => {
  const router = useRouter();
  const progressTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubOnBeforeLoad = router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
      if (!fromLocation || !pathChanged)
        return;

      progressTimeoutRef.current = window.setTimeout(() => BProgress.start(), 200);
    });

    const unsubOnLoad = router.subscribe('onLoad', () => {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }

      BProgress.done();
    });

    return () => {
      if (progressTimeoutRef.current)
        clearTimeout(progressTimeoutRef.current);

      unsubOnBeforeLoad();
      unsubOnLoad();
    };
  }, [router]);

  return (
    <ThemeProvider defaultTheme="system">
      <ProgressProvider
        options={{ template: null, positionUsing: 'width' }}
        disableStyle
      >
        <ConfirmDialogProvider>
          {children}
          <Toaster richColors/>
        </ConfirmDialogProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default Providers;