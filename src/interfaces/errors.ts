export interface InternalError {
  message: string;
  internalCode: string;
  statusCode: number;
  statusTitle: string;
  originalError?: Error;
}
