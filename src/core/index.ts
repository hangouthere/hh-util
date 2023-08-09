export * from './Logger.js';

export type JsonStringify<T> = T extends Date
  ? string
  : T extends object
  ? {
      [k in keyof T]: JsonStringify<T[k]>;
    }
  : T;

export type JSONTypes = string | number | boolean | JSONObject | JSONArray | null;

export type JSONObject = {
  [key: string]: JSONTypes;
};

export type JSONArray = Array<JSONTypes>;

export const definedProps = <T>(obj: object): T =>
  Object.fromEntries(Object.entries(obj).filter(([_k, v]) => v !== undefined)) as T;
