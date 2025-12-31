import { createStart } from '@tanstack/react-start'
import { customErrorAdapter } from '@/features/shared/utils/api-error.ts';


export const startInstance = createStart(() => {

  return {
    serializationAdapters: [
      customErrorAdapter
    ]
  };
});