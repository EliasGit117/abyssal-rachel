import { createStart } from '@tanstack/react-start'
import { customErrorAdapter } from '@/features/shared/utils/api-error.ts';
import { functionLoggingMiddleware } from '@/middleware/logging.ts';


export const startInstance = createStart(() => {

  return {
    functionMiddleware: [
      functionLoggingMiddleware
    ],
    serializationAdapters: [customErrorAdapter]
  };
});