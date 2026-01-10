import { createMiddleware } from '@tanstack/react-start';

const SLOW_FUNCTION_THRESHOLD_MS = 500;

export const functionLoggingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next, functionId }) => {
  const start = Date.now();

  try {
    const result = await next();
    const duration = Date.now() - start;

    if (duration > SLOW_FUNCTION_THRESHOLD_MS) {
      console.warn('[Start] Slow server function detected', {
        functionId,
        durationMs: duration,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;

    console.warn('[Start] Server function failed', {
      functionId,
      durationMs: duration,
    });

    throw error;
  }
});