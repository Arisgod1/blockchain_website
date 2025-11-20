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

// 项目相关类型
/**
 * ProjectDto
 */
export interface Project {
    achievements?: string;
    budget?: number;
    category: Category;
    demoUrl?: string;
    description: string;
    displayOrder?: number;
    documentationUrl?: string;
    endDate?: Date | string;
    featured?: boolean;
    goals?: string;
    id?: number;
    imageUrl?: string;
    isPublic?: boolean;
    name?: string;
    progress?: number;
    repositoryUrl?: string;
    startDate?: Date;
    status: Status;
    techStack?: string[];
    [property: string]: any;
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
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: any
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
}

// 会议记录类型
export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location?: string
  attendees: string[]
  agenda: string[]
  content: string
  decisions: string[]
  actionItems: ActionItem[]
  attachments: string[]
  recorder: string
  isPublic: boolean
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
  value: any
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
export interface ApiResponse<T = any> {
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

// 管理员用户类型
export interface AdminUser {
  id: string
  username: string
  role: 'admin' | 'super-admin'
  permissions: string[]
  loginTime: Date
  rememberMe?: boolean
}