import { setResponseStatus } from '@tanstack/start-server-core';
import { StatusCodes } from 'http-status-codes';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { ApiError, IApiErrorOptions } from '@/features/shared/utils/api-error.ts';

interface IErrorTranslation {
  name: Record<Locale, string>;
  message: Record<Locale, string>;
}

interface IResolvedErrorTranslation {
  name?: string;
  message?: string;
}

const ERROR_TRANSLATIONS: Partial<Record<StatusCodes, IErrorTranslation>> = {
  [StatusCodes.BAD_REQUEST]: {
    name: { ro: 'Request incorect', ru: 'Неправильный запрос' },
    message: { ro: 'Datele introduse nu sunt valide', ru: 'Введенные данные недействительны' }
  },

  [StatusCodes.UNAUTHORIZED]: {
    name: { ro: 'Neautorizat', ru: 'Неавторизован' },
    message: { ro: 'Va rugam sa va autentificati pentru a obtine acces', ru: 'Пожалуйста авторизуйтесь чтобы получить доступ' }
  },

  [StatusCodes.FORBIDDEN]: {
    name: { ro: 'Interzis', ru: 'Доступ запрещен' },
    message: { ro: 'Nu aveți permisiuni', ru: 'Недостаточно прав' }
  },

  [StatusCodes.NOT_FOUND]: {
    name: { ro: 'Nu a fost găsit', ru: 'Не найдено' },
    message: { ro: 'Resursa nu există', ru: 'Ресурс не существует' }
  }
}


function getTranslatedError(status: StatusCodes, locale: Locale): IResolvedErrorTranslation {
  const translation = ERROR_TRANSLATIONS[status];

  return {
    name: translation?.name?.[locale],
    message: translation?.message?.[locale]
  };
}



function throwApiError({ status = StatusCodes.INTERNAL_SERVER_ERROR, ...options }: IApiErrorOptions): never {
  setResponseStatus(status);
  throw new ApiError({ status, ...options });
}

export function throwBadRequest(
  message?: string,
  options: Omit<IApiErrorOptions, 'message' | 'status'> = {}
): never {
  const locale = getLocale();
  const translated = getTranslatedError(StatusCodes.BAD_REQUEST, locale);

  throwApiError({
    status: StatusCodes.BAD_REQUEST,
    name: options.name ?? translated.name ?? 'Bad request',
    message: message ?? translated.message ?? 'Invalid input'
  });
}


export function throwUnauthorizedError(
  message?: string,
  options: Omit<IApiErrorOptions, 'message' | 'status'> = {}
): never {
  const locale = getLocale();
  const translated = getTranslatedError(StatusCodes.UNAUTHORIZED, locale);

  throwApiError({
    status: StatusCodes.UNAUTHORIZED,
    name: options.name ?? translated.name ?? 'Unauthorized',
    message: message ?? translated.message ?? 'Please sign in to get access'
  });
}

