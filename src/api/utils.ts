import type { ApiResponse, PaginationInfo } from '@/types/entities'

export interface PaginationParams {
  page?: number | string
  size?: number | string
}

const DEFAULT_SORT_STATE = {
  empty: true,
  sorted: false,
  unsorted: true
}

export type SortState = typeof DEFAULT_SORT_STATE

const buildPageableMeta = (page: number, size: number) => ({
  pageNumber: page,
  pageSize: size,
  offset: page * size,
  paged: true,
  unpaged: false,
  sort: DEFAULT_SORT_STATE
})

export type QueryPrimitive = string | number | boolean
export type QueryValue = QueryPrimitive | QueryPrimitive[]
export type QueryParams = Record<string, QueryValue | undefined | null>

export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: SortState
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

export const isApiSuccessResponse = (response?: ApiResponse<unknown> | null): response is ApiResponse<unknown> => {
  if (!response) return false
  if (typeof response.code !== 'number') return false
  return response.code >= 200 && response.code < 300
}

export const assertApiResponseSuccess = <T>(
  response: ApiResponse<T> | null | undefined,
  fallbackMessage: string
): ApiResponse<T> => {
  if (!isApiSuccessResponse(response)) {
    const errorMessage = (response as ApiResponse<unknown> | undefined)?.message || fallbackMessage
    throw new Error(errorMessage)
  }
  return response
}

export const requireApiResponseData = <T>(
  response: ApiResponse<T> | null | undefined,
  fallbackMessage: string
): T => {
  const res = assertApiResponseSuccess(response, fallbackMessage)
  if (res.data === undefined || res.data === null) {
    throw new Error(fallbackMessage)
  }
  return res.data
}
