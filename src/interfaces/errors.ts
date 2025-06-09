export interface InternalError {
  message: string;
  internalCode: string;
  statusCode: number;
  originalError?: Error;
}
