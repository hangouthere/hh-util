export * from './Logger.js';

export const definedProps = <T>(obj: object): T =>
  Object.fromEntries(Object.entries(obj).filter(([_k, v]) => v !== undefined)) as T;
