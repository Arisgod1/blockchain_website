import apiService from '@/api/client'

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
export interface PageFile {
  totalElements: number
  totalPages: number
  size: number
  content: FileInfo[]
  number: number
  sort: any
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: any
  empty: boolean
}

// 获取分页文件列表
export const getFiles = async (params?: Record<string, any>): Promise<PageFile> => {
  const res = await apiService.get<PageFile>('/api/files', { params })
  if (!res.success) throw new Error(res.message || '获取文件列表失败')
  return res.data as PageFile
}

// 上传文件
export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiService.upload<FileInfo>('/api/files/upload', formData)
  if (!res.success) throw new Error(res.message || '上传文件失败')
  if (!res.data) throw new Error('上传文件未返回数据')
  return res.data
}

// 删除文件
export const deleteFile = async (id: string | number): Promise<void> => {
  const res = await apiService.delete(`/api/files/${id}`)
  if (!res.success) throw new Error(res.message || '删除文件失败')
}

// 下载文件
export const downloadFile = async (id: string | number, fileName?: string): Promise<void> => {
  await apiService.download(`/api/files/download/${id}`, fileName)
}
