export type ErrorType = {
  resource?: string;
  field?: string;
  code?: string;
  message?: string;
};

export function createErrorType(
  resource?: string,
  field?: string,
  code?: string,
  message?: string,
): ErrorType {
  return {
    resource,
    field,
    code,
    message,
  };
}
