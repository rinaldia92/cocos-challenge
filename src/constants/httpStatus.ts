export const httpStatus = {
  // 2xx Success
  OK: {
    code: 200,
    name: 'OK',
  },
  CREATED: {
    code: 201,
    name: 'Created',
  },
  ACCEPTED: {
    code: 202,
    name: 'Accepted',
  },
  NO_CONTENT: {
    code: 204,
    name: 'No Content',
  },

  // 4xx Client Errors
  BAD_REQUEST: {
    code: 400,
    name: 'Bad Request',
  },
  UNAUTHORIZED: {
    code: 401,
    name: 'Unauthorized',
  },
  FORBIDDEN: {
    code: 403,
    name: 'Forbidden',
  },
  NOT_FOUND: {
    code: 404,
    name: 'Not Found',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    name: 'Method Not Allowed',
  },
  CONFLICT: {
    code: 409,
    name: 'Conflict',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    name: 'Unprocessable Entity',
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    name: 'Too Many Requests',
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: {
    code: 500,
    name: 'Internal Server Error',
  },
  NOT_IMPLEMENTED: {
    code: 501,
    name: 'Not Implemented',
  },
  BAD_GATEWAY: {
    code: 502,
    name: 'Bad Gateway',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    name: 'Service Unavailable',
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    name: 'Gateway Timeout',
  },
} as const;
