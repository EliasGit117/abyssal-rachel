import { createSerializationAdapter } from '@tanstack/react-router'

export interface IApiErrorOptions {
  name?: string;
  message?: string;
  status?: number;
}

export class ApiError extends Error {
  status?: number;

  constructor(options?: IApiErrorOptions) {
    super(options?.message)

    const {
      name = 'Unknown error',
      message = 'Something went wrong',
      status = 500
    } = options ?? {};

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name;
    this.message = message;
    this.status = status;
  }
}

export const customErrorAdapter = createSerializationAdapter({
  key: 'api-error',
  test: (v) => v instanceof ApiError,
  toSerializable: ({ name, message, status }) => {
    return { name, message, status };
  },
  fromSerializable: ({ name, message, status }) => {
    return new ApiError({ name, message, status })
  },
});
