import { createStart } from '@tanstack/react-start'
import { customErrorAdapter } from '@/lib/errors/api-error.ts';
import { functionLoggingMiddleware } from '@/middleware/logging.ts';


export const startInstance = createStart(() => {

  return {
    functionMiddleware: [
      functionLoggingMiddleware
    ],
    serializationAdapters: [customErrorAdapter]
  };
});