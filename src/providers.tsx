import {
  FC,
  PropsWithChildren,
  useEffect,
  useRef
} from 'react';
import { ProgressProvider } from '@bprogress/react';
import { ThemeProvider } from '@/components/theme';
import { Toaster } from '@/components/ui/sonner.tsx';
import { BProgress } from '@bprogress/core';
import { useRouter } from '@tanstack/react-router';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog.tsx';

interface IProps extends PropsWithChildren {}

const PROGRESS_DELAY = 200;

export const Providers: FC<IProps> = ({ children }) => {
  const router = useRouter();

  const startTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const stopProgress = () => {
      resolvedRef.current = true;

      if (startTimeoutRef.current !== null) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }

      if (startedRef.current) {
        BProgress.done();
        startedRef.current = false;
      }
    };

    const unsubBeforeLoad = router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
      if (!fromLocation || !pathChanged)
        return;

      resolvedRef.current = false;
      startTimeoutRef.current = window.setTimeout(() => {
        if (resolvedRef.current)
          return;

        BProgress.start();
        startedRef.current = true;
      }, PROGRESS_DELAY);
    });

    const unsubResolved = router.subscribe('onResolved', () => {
      stopProgress();
    });

    return () => {
      stopProgress();
      unsubBeforeLoad();
      unsubResolved();
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

