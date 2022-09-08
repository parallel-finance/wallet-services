let counter = 0;
const EXTENSION_PREFIX = 'parallel_';

export function getCustomSignerId(): string {
  return `${EXTENSION_PREFIX}.${Date.now()}.${++counter}`;
}
