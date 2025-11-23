import type { PaginationInfo } from '@/types/entities'

export interface PaginationParams {
  page?: number | string
  size?: number | string
}

const DEFAULT_SORT_STATE = {
  empty: true,
  sorted: false,
  unsorted: true
}

const buildPageableMeta = (page: number, size: number) => ({
  pageNumber: page,
  pageSize: size,
  offset: page * size,
  paged: true,
  unpaged: false,
  sort: DEFAULT_SORT_STATE
})

export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: typeof DEFAULT_SORT_STATE
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: ReturnType<typeof buildPageableMeta>
  empty: boolean
}

const coerceNumber = (value: number | string | undefined, fallback: number) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10)
    return Number.isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

export const createPagedResponse = <T>(items: T[], params?: PaginationParams): PageResult<T> => {
  const page = Math.max(0, coerceNumber(params?.page, 0))
  const size = Math.max(1, coerceNumber(params?.size, items.length || 10))
  const start = page * size
  const content = items.slice(start, start + size)
  const totalElements = items.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))

  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
    sort: DEFAULT_SORT_STATE,
    first: page === 0,
    last: page >= totalPages - 1,
    numberOfElements: content.length,
    pageable: buildPageableMeta(page, size),
    empty: content.length === 0
  }
}

export const ensurePagedData = <T>(
  data: unknown,
  params?: PaginationParams,
  fallbackItems: T[] = []
): PageResult<T> => {
  if (Array.isArray(data)) {
    return createPagedResponse<T>(data, params)
  }

  if (data && typeof data === 'object' && 'content' in data) {
    return data as PageResult<T>
  }

  return createPagedResponse<T>(fallbackItems, params)
}

export const fallbackPaginationInfo = (result: PageResult<unknown>): PaginationInfo => ({
  current: result.number + 1,
  pageSize: result.size,
  total: result.totalElements,
  pages: result.totalPages
})
