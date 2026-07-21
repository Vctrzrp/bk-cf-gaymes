export interface ListQuery {
  sort?: string
  range?: string
  filter?: string
}

const parseJson = <T>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function listRecords<T extends object>(
  records: T[],
  query: ListQuery
) {
  const filter = parseJson<Record<string, unknown>>(query.filter, {})
  const [field, order] = parseJson<[string, 'ASC' | 'DESC']>(query.sort, ['id', 'ASC'])
  const [start, end] = parseJson<[number, number]>(query.range, [0, records.length - 1])

  const filtered = records.filter(record => Object.entries(filter).every(([key, value]) => {
    const dynamicRecord = record as Record<string, unknown>
    if (key === 'q') {
      return Object.values(dynamicRecord).some(candidate => String(candidate).toLowerCase().includes(String(value).toLowerCase()))
    }
    if (Array.isArray(value)) return value.map(String).includes(String(dynamicRecord[key]))
    return String(dynamicRecord[key] ?? '') === String(value)
  }))

  filtered.sort((left, right) => {
    const leftRecord = left as Record<string, unknown>
    const rightRecord = right as Record<string, unknown>
    const comparison = String(leftRecord[field] ?? '').localeCompare(String(rightRecord[field] ?? ''), 'es', { numeric: true })
    return order === 'DESC' ? -comparison : comparison
  })

  return {
    data: filtered.slice(Math.max(0, start), Math.max(0, end) + 1),
    total: filtered.length,
    start: Math.max(0, start),
    end: Math.min(Math.max(0, end), Math.max(0, filtered.length - 1))
  }
}
