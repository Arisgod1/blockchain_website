// 成员相关类型
export interface Member {
  id: string
  name: string
  role: string
  avatar?: string
  bio?: string
  skills: string[]
  grade?: string
  major?: string
  projectCount?: number
  email?: string
  github?: string
  linkedin?: string
  joinDate: string
  isActive: boolean
}

export type Identifier = string | number

export type ProjectStatusValue =
  | Status
  | Lowercase<Status>
  | 'planning'
  | 'in-progress'
  | 'ongoing'
  | 'completed'
  | 'paused'
  | 'active'
  | 'archived'

export interface ProjectContributor {
  id?: Identifier
  name: string
  role?: string
  avatar?: string
}

export interface ProjectLink {
  label: string
  url: string
  type?: 'github' | 'demo' | 'docs' | 'external'
}

// 项目相关类型
export interface Project {
  id?: Identifier
  title?: string
  name?: string
  description?: string
  shortDescription?: string
  summary?: string
  achievements?: string
  goals?: string
  category?: Category | string
  status?: ProjectStatusValue
  progress?: number
  techStack?: string[]
  tags?: string[]
  demoUrl?: string
  repositoryUrl?: string
  githubUrl?: string
  documentation?: string
  documentationUrl?: string
  imageUrl?: string
  images?: string[]
  contributors?: Array<ProjectContributor | string>
  links?: ProjectLink[]
  teamSize?: number | string
  startDate?: Date | string
  endDate?: Date | string
  budget?: number
  isPublic?: boolean
  featured?: boolean
  displayOrder?: number
  likes?: number
  views?: number
  isLiked?: boolean
  attachments?: string[]
  [property: string]: unknown
}

export enum Category {
    Collaboration = "COLLABORATION",
    Competition = "COMPETITION",
    Development = "DEVELOPMENT",
    Education = "EDUCATION",
    Research = "RESEARCH",
}

export enum Status {
    Cancelled = "CANCELLED",
    Completed = "COMPLETED",
    InProgress = "IN_PROGRESS",
    OnHold = "ON_HOLD",
    Ongoing = "ONGOING",
    Planning = "PLANNING",
}

// 博客文章类型
export interface ArticleAuthor {
  id?: Identifier
  name?: string
  avatar?: string
  title?: string
  bio?: string
}

export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author?: ArticleAuthor | null
  tags: string[]
  category: string
  publishDate: string
  publishedAt?: string
  updateDate: string
  readTime: number
  isPublished: boolean
  views: number
  likes: number
  image?: string
  coverImage?: string
  isFeatured?: boolean
  excerpt?: string
  description?: string
  comments?: number
  isLiked?: boolean
  bookmarked?: boolean
  thumbnail?: string
}

export type EnrichedArticle = Article & {
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  featured?: boolean
}

// 会议记录类型
export interface MeetingAttendee {
  id: string
  name: string
  avatar?: string
  role?: string
}

export interface MeetingFile {
  id: string
  name: string
  type: string
  size: string
  url: string
}

export interface MeetingIssue {
  id: string
  title: string
  status: string
}

export type MeetingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'draft'

export interface Meeting {
  id: string
  title: string
  date: string
  time?: string
  summary?: string
  location?: string
  status?: MeetingStatus
  types?: string[]
  attendees: Array<MeetingAttendee | string>
  duration?: number
  agenda?: string[]
  content?: string
  decisions?: string[]
  actionItems?: ActionItem[]
  issues?: MeetingIssue[]
  files?: MeetingFile[]
  attachments?: string[]
  tags?: string[]
  recording?: string
  minutes?: string
  recorder?: string
  isPublic?: boolean
}

// 行动项类型
export interface ActionItem {
  id: string
  description: string
  assignee: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
}

// 内容管理类型
export interface Content {
  id: string
  page: string
  section: string
  key: string
  value: unknown
  type: 'text' | 'image' | 'array' | 'object'
  isActive: boolean
  updateDate: string
}

// 轮播图类型
export interface CarouselItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  link?: string
  isActive: boolean
  order: number
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

// 分页类型
export interface PaginationInfo {
  current: number
  pageSize: number
  total: number
  pages: number
}

// 筛选类型
export interface FilterOptions {
  search?: string
  category?: string
  status?: string
  tags?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 统计数据类型
export interface Statistics {
  members: number
  projects: number
  articles: number
  meetings: number
  totalViews: number
  totalLikes: number
}

// 站点公共信息
export interface SiteStats {
  totalMembers: number
  totalProjects: number
  totalArticles: number
  totalMeetings: number
  successfulCollaborations: number
  averageResponseHours: number
  globalPartners: number
}

export interface HeroBanner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  ctaLabel?: string
  ctaLink?: string
  accentColor?: string
  order?: number
}

export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  organization?: string
  consultationType?: string
  privacyAccepted?: boolean
  source?: string
}

export interface ContactResponse {
  ticketId: string
  estimatedReplyHours?: number
}

export interface PublicEvent {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  type: string
  status: 'upcoming' | 'ongoing' | 'finished'
  tags?: string[]
  banner?: string
}

// 管理员用户类型
export interface AdminUser {
  id: string
  username: string
  role: 'admin' | 'super-admin'
  permissions: string[]
  loginTime: Date
  rememberMe?: boolean
}

export type AdminEntity = 'meetings' | 'members' | 'projects' | 'articles' | 'files' | 'logs' | 'dashboard'

export type AdminAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'refresh'
  | 'duplicate'
  | 'import'
  | 'export'
  | 'login'
  | 'logout'

export interface AdminOperationLog {
  id: string
  entity: AdminEntity
  action: AdminAction
  targetId?: string | number
  operator?: string
  result: 'success' | 'failure'
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export type AdminLogPayload = Omit<AdminOperationLog, 'id' | 'timestamp' | 'result'> & {
  result?: AdminOperationLog['result']
}