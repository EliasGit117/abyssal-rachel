import { setResponseStatus } from '@tanstack/start-server-core';
import { StatusCodes } from 'http-status-codes';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { ApiError, IApiErrorOptions } from '@/lib/errors/api-error.ts';

type ErrorLocale = Locale | 'en';

interface IErrorTranslation {
  name: Record<ErrorLocale, string>;
  message: Record<ErrorLocale, string>;
}

interface IResolvedErrorTranslation {
  name?: string;
  message?: string;
}

const ERROR_TRANSLATIONS: Partial<Record<StatusCodes, IErrorTranslation>> = {
  [StatusCodes.BAD_REQUEST]: {
    name: {
      en: 'Bad request',
      ro: 'Request incorect',
      ru: 'Неправильный запрос'
    },
    message: {
      en: 'Invalid input',
      ro: 'Datele introduse nu sunt valide',
      ru: 'Введенные данные недействительны'
    }
  },

  [StatusCodes.UNAUTHORIZED]: {
    name: {
      en: 'Unauthorized',
      ro: 'Neautorizat',
      ru: 'Неавторизован'
    },
    message: {
      en: 'Please sign in to get access',
      ro: 'Vă rugăm să vă autentificați pentru a obține acces',
      ru: 'Пожалуйста, авторизуйтесь, чтобы получить доступ'
    }
  },

  [StatusCodes.FORBIDDEN]: {
    name: {
      en: 'Forbidden',
      ro: 'Interzis',
      ru: 'Доступ запрещен'
    },
    message: {
      en: 'You do not have permission',
      ro: 'Nu aveți permisiuni',
      ru: 'Недостаточно прав'
    }
  },

  [StatusCodes.NOT_FOUND]: {
    name: {
      en: 'Not found',
      ro: 'Nu a fost găsit',
      ru: 'Не найдено'
    },
    message: {
      en: 'Resource does not exist',
      ro: 'Resursa nu există',
      ru: 'Ресурс не существует'
    }
  }
};

function getTranslatedError(status: StatusCodes, locale: ErrorLocale): IResolvedErrorTranslation {
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

interface IThrowOptions
  extends Omit<IApiErrorOptions, 'status'> {
  translated?: boolean;
}

export function throwBadRequest({ translated = true, ...options }: IThrowOptions = {}): never {
  const locale: ErrorLocale = translated ? getLocale() : 'en';
  const translatedError = getTranslatedError(
    StatusCodes.BAD_REQUEST,
    locale
  );

  throwApiError({
    status: StatusCodes.BAD_REQUEST,
    name: options.name ?? translatedError.name,
    message: options.message ?? translatedError.message
  });
}

export function throwUnauthorizedError({ translated = true, ...options }: IThrowOptions = {}): never {
  const locale: ErrorLocale = translated ? getLocale() : 'en';
  const translatedError = getTranslatedError(
    StatusCodes.UNAUTHORIZED,
    locale
  );

  throwApiError({
    status: StatusCodes.UNAUTHORIZED,
    name: options.name ?? translatedError.name,
    message: options.message ?? translatedError.message
  });
}

export function throwForbiddenError({ translated = true, ...options }: IThrowOptions = {}): never {
  const locale: ErrorLocale = translated ? getLocale() : 'en';
  const translatedError = getTranslatedError(
    StatusCodes.FORBIDDEN,
    locale
  );

  throwApiError({
    status: StatusCodes.FORBIDDEN,
    name: options.name ?? translatedError.name,
    message: options.message ?? translatedError.message
  });
}
