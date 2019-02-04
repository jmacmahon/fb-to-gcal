export type Dict<T> = {
  [key: string]: T | undefined
}

export function isDict (raw: unknown): raw is Dict<unknown> {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw)
}
