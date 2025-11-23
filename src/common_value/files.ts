import type { FileInfo } from '@/api/file'

export const MOCK_FILES: FileInfo[] = [
  {
    id: 'file-001',
    originalName: '团队手册.pdf',
    fileName: 'team-handbook.pdf',
    filePath: '/files/team-handbook.pdf',
    fileSize: 1_024_000,
    fileType: 'application/pdf',
    uploadTime: '2024-01-03 10:22',
    uploader: 'system',
    downloadCount: 42
  },
  {
    id: 'file-002',
    originalName: '会议纪要模板.docx',
    fileName: 'meeting-minutes-template.docx',
    filePath: '/files/meeting-minutes-template.docx',
    fileSize: 256_000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-02-15 09:10',
    uploader: 'admin',
    downloadCount: 18
  },
  {
    id: 'file-003',
    originalName: '预算表.xlsx',
    fileName: 'budget.xlsx',
    filePath: '/files/budget.xlsx',
    fileSize: 512_000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-03-08 14:55',
    uploader: 'finance',
    downloadCount: 27
  }
]
