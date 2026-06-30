type ParamType = 'string' | 'number' | 'boolean'
export type ParamSchema<T> = { [K in keyof T]-?: ParamType }

export default function parseParams<T extends object>(qs: string, schema: ParamSchema<T>, defaults?: Partial<T>): T {
  const sp = new URLSearchParams(qs)
  const result = { ...defaults } as unknown as T

  for (const key in schema) {
    const raw = sp.get(key)
    if (raw === null) continue

    switch (schema[key]) {
      case 'number':
        ;(result as any)[key] = Number(raw)
        break
      case 'boolean':
        ;(result as any)[key] = raw === 'true'
        break
      default:
        ;(result as any)[key] = raw
    }
  }

  return result
}
