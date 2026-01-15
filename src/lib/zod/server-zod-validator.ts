import { z, ZodType } from "zod";
import { throwBadRequest } from '@/lib/errors/throw-api-error.ts';


export function serverZodValidator<TSchema extends ZodType>(schema: TSchema,) {
  return (data: z.input<TSchema>): z.output<TSchema> => {
    const { success, error, data: parsedData } = schema.safeParse(data);

    if (success)
      return parsedData;

    throwBadRequest({ message: z.prettifyError(error) });
  };
}