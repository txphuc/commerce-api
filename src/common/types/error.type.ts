export type ErrorType = {
  resource?: string;
  field?: string;
  code?: string;
  value?: any;
  message?: string;
};

export function createErrorType(
  resource?: string,
  field?: string,
  code?: string,
  value?: any,
  message?: string,
): ErrorType {
  return {
    resource,
    field,
    code,
    value,
    message,
  };
}
