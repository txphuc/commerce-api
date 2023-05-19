import { LogLevel } from '@nestjs/common';

export function getLogLevels(isProduction: boolean): LogLevel[] {
  return isProduction ? ['log', 'warn', 'error'] : ['error', 'warn', 'log', 'verbose', 'debug'];
}
