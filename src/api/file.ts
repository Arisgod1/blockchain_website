import apiService from '@/api/client'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'
import { MOCK_FILES } from '@/common_value/files'

type HttpError = { response?: unknown }
const hasResponse = (error: unknown): error is HttpError => typeof error === 'object' && error !== null && 'response' in error

const LOCAL_KEY = 'admin-files-local'
const readLocal = (): FileInfo[] => {
  const stored = localStorage.getItem(LOCAL_KEY)
  if (!stored) return [...MOCK_FILES]
  try {
    const parsed = JSON.parse(stored) as FileInfo[]
    return Array.isArray(parsed) ? parsed : [...MOCK_FILES]
  } catch {
    return [...MOCK_FILES]
  }
}
const writeLocal = (items: FileInfo[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
const nextId = () => Date.now().toString()

export interface FileInfo {
  id: string
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  uploadTime: string
  uploader: string
  downloadCount: number
}

interface FileUploadDto {
  id?: string | number
  fileName?: string
  originalName?: string
  filePath?: string
  fileSize?: number
  fileType?: string
  category?: string
  description?: string
  uploadedBy?: string
  downloadCount?: number
  uploadedAt?: string
  downloadUrl?: string
}

const mapDtoToFileInfo = (dto: FileUploadDto): FileInfo => ({
  id: String(dto.id ?? ''),
  originalName: dto.originalName || dto.fileName || '未命名文件',
  fileName: dto.fileName || dto.originalName || 'unknown',
  filePath: dto.filePath || '',
  fileSize: dto.fileSize ?? 0,
  fileType: dto.fileType || 'application/octet-stream',
  uploadTime: dto.uploadedAt || new Date().toISOString(),
  uploader: dto.uploadedBy || 'unknown',
  downloadCount: dto.downloadCount ?? 0
})

const normalizeIncomingFile = (value: FileInfo | FileUploadDto): FileInfo => {
  if (value && typeof value === 'object' && 'uploadTime' in value) {
    return value as FileInfo
  }
  return mapDtoToFileInfo(value as FileUploadDto)
}

// 分页响应类型
export type PageFile = PageResult<FileInfo>

// 获取分页文件列表
export const getFiles = async (params?: PaginationParams & Record<string, unknown>): Promise<PageFile> => {
  try {
    const res = await apiService.get<PageResult<FileUploadDto | FileInfo> | Array<FileUploadDto | FileInfo>>('/api/files', { params })
    assertApiResponseSuccess(res, '获取文件列表失败')
    const page = ensurePagedData<FileUploadDto | FileInfo>(res.data, params, readLocal())
    return {
      ...page,
      content: (page.content || []).map((item) => normalizeIncomingFile(item))
    }
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    return ensurePagedData<FileInfo>(readLocal(), params)
  }
}

// 上传文件
export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await apiService.upload<FileUploadDto | FileInfo>('/api/files/upload', formData)
    return normalizeIncomingFile(requireApiResponseData(res, '上传文件失败'))
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    // 本地模拟：只保存元数据，不保存文件内容
    const items = readLocal()
    const created: FileInfo = {
      id: nextId(),
      originalName: file.name,
      fileName: file.name,
      filePath: `/local/${file.name}`,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      uploadTime: new Date().toISOString(),
      uploader: 'local',
      downloadCount: 0
    }
    items.unshift(created)
    writeLocal(items)
    return created
  }
}

// 删除文件
export const deleteFile = async (id: string | number): Promise<void> => {
  try {
    const res = await apiService.delete(`/api/files/${id}`)
    assertApiResponseSuccess(res, '删除文件失败')
    return
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    const items = readLocal().filter(item => item.id !== id)
    writeLocal(items)
  }
}

// 下载文件
export const downloadFile = async (fileName: string): Promise<void> => {
  try {
    await apiService.download(`/api/files/download/${encodeURIComponent(fileName)}`, fileName)
  } catch (error) {
    if (hasResponse(error) && error.response) throw error
    // 本地模式仅提示，不做实际下载
    console.warn('下载失败（网络），本地模式下无实际文件可供下载')
  }
}
