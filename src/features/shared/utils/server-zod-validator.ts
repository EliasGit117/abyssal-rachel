import { z, ZodTypeAny } from "zod";
import { throwBadRequest } from '@/features/shared/utils/throw-api-error.ts';


export function serverZodValidator<TSchema extends ZodTypeAny>(schema: TSchema,) {
  return (data: z.input<TSchema>): z.output<TSchema> => {
    const { success, error, data: parsedData } = schema.safeParse(data);

    if (success)
      return parsedData;

    if (typeof error === "string")
      throwBadRequest(error);

    throwBadRequest(z.prettifyError(error));
  };
}