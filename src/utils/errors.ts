import { httpStatus } from '../constants/httpStatus';
import { InternalError } from '../interfaces/errors';

const createInternalError =
  (internalCode: string, statusCode: number) =>
  (message: string, err?: Error): InternalError => {
    const internalError: InternalError = {
      message,
      internalCode,
      statusCode,
    };

    if (err) {
      internalError.originalError = err;
    }

    return internalError;
  };

export const DATABASE_ERROR = 'database_error';
export const databaseError = createInternalError(
  DATABASE_ERROR,
  httpStatus.SERVICE_UNAVAILABLE.code,
);

export const DEFAULT_ERROR = 'default_error';
export const defaultError = createInternalError(
  DEFAULT_ERROR,
  httpStatus.INTERNAL_SERVER_ERROR.code,
);

export const NOT_FOUND_ERROR = 'not_found_error';
export const notFoundError = createInternalError(NOT_FOUND_ERROR, httpStatus.NOT_FOUND.code);

export const INVALID_SCHEMA_ERROR = 'invalid_schema_error';
export const invalidSchemaError = createInternalError(INVALID_SCHEMA_ERROR, httpStatus.UNPROCESSABLE_ENTITY.code);