import apiService from '@/api/client'
import { ensurePagedData, assertApiResponseSuccess, requireApiResponseData, type PaginationParams, type PageResult } from '@/api/utils'

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

// 分页响应类型
export type PageFile = PageResult<FileInfo>

// 获取分页文件列表
export const getFiles = async (params?: PaginationParams & Record<string, unknown>): Promise<PageFile> => {
  const res = await apiService.get<PageFile | FileInfo[]>('/api/files', { params })
  assertApiResponseSuccess(res, '获取文件列表失败')
  return ensurePagedData<FileInfo>(res.data, params)
}

// 上传文件
export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiService.upload<FileInfo>('/api/files/upload', formData)
  return requireApiResponseData(res, '上传文件失败')
}

// 删除文件
export const deleteFile = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/files/${id}`)
  assertApiResponseSuccess(res, '删除文件失败')
}

// 下载文件
export const downloadFile = async (id: string | number, fileName?: string): Promise<void> => {
  await apiService.download(`/api/files/download/${id}`, fileName)
}
