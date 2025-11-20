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

export interface RoleOption {
  id: string
  name: string
  count?: number
}

export interface Announcement {
  id: string
  title: string
  description: string
  link?: string
  createdAt: string
  type?: 'info' | 'warning' | 'success'
}

export interface EventItem {
  id: string
  title: string
  type: 'conference' | 'hackathon' | 'sharing' | 'workshop' | string
  description?: string
  startAt: string
  endAt?: string
  location?: string
  topics?: string[]
  registrationLink?: string
  coverImage?: string
  status?: 'draft' | 'upcoming' | 'ongoing' | 'finished' | 'open' | 'closed'
  isPublic?: boolean
}

export interface HomeHero {
  title: string
  subtitle?: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
}

export interface HomeStats {
  members: number
  projects: number
  articles: number
  meetings: number
}

export interface HomeData {
  hero: HomeHero
  stats: HomeStats
  featuredProjects: Project[]
  upcomingEvents: EventItem[]
  announcements: Announcement[]
}

export interface TimelineEntry {
  year: string
  title: string
  description: string
  achievements?: string[]
}

export interface PartnerProfile {
  id: string
  name: string
  logo?: string
  url?: string
  description?: string
}

export interface MentorProfile {
  id: string
  name: string
  title?: string
  avatar?: string
  bio?: string
  contact?: string
}

export interface AboutData {
  mission: string
  vision: string
  timeline: TimelineEntry[]
  partners: PartnerProfile[]
  mentors: MentorProfile[]
}

export interface ContactInfo {
  address: string
  email: string
  phone?: string
  mapEmbedUrl?: string
  socials?: Record<string, string>
  qrCodes?: Array<{ label: string; image: string }>
  geo?: { lat: number; lng: number }
}

export interface ContactMessagePayload {
  name: string
  email: string
  topic: string
  message: string
  consent: boolean
}

export interface ContactMessage extends ContactMessagePayload {
  id: string
  status: 'new' | 'processing' | 'done'
  handler?: string
  handlerNote?: string
  createdAt: string
  updatedAt: string
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
  [property: string]: unknown;
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

export interface ProjectPage extends PaginatedResponse<Project> {
  content: Project[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  sort?: Record<string, unknown>
  pageable?: Record<string, unknown>
  fromFallback?: boolean
}

// 博客文章类型
export interface ArticleAuthor {
  id?: string | number
  name: string
  avatar?: string
  title?: string
  profileUrl?: string
  email?: string
  description?: string
}

export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: ArticleAuthor
  tags: string[]
  category: string
  publishDate: string | Date
  publishedAt?: string | Date
  updateDate: string | Date
  readTime: number
  isPublished: boolean
  views: number
  likes: number
  image?: string
  coverImage?: string
  isFeatured?: boolean
  featured?: boolean
  excerpt?: string
  description?: string
  comments?: number
  isLiked?: boolean
  liked?: boolean
  bookmarked?: boolean
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | string
}

export interface ArticlePage extends PaginatedResponse<Article> {
  content: Article[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  sort?: Record<string, unknown>
  pageable?: Record<string, unknown>
  fromFallback?: boolean
}

// 会议记录类型
export interface MeetingAttendee {
  id?: string
  name: string
  avatar?: string
  role?: string
  title?: string
  email?: string
}

export interface MeetingIssue {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked' | string
  owner?: string
  notes?: string
}

export interface MeetingFile {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadedAt?: string
}

export interface MeetingAgendaItem {
  id?: string
  title: string
  presenter?: string
  duration?: number
  description?: string
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

export interface Meeting {
  id: string
  title: string
  summary?: string
  description?: string
  date: string
  time?: string
  location?: string
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | string
  types?: string[]
  tags?: string[]
  duration?: number
  recorder?: string
  attendees: Array<string | MeetingAttendee>
  attendeeNotes?: string
  agenda?: Array<string | MeetingAgendaItem>
  issues?: MeetingIssue[]
  decisions?: string[]
  actionItems?: ActionItem[]
  files?: MeetingFile[]
  attachments?: string[]
  recording?: string
  minutes?: string
  content?: string
  isPublic?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MeetingPage extends PaginatedResponse<Meeting> {
  content: Meeting[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  sort?: Record<string, unknown>
  pageable?: Record<string, unknown>
  fromFallback?: boolean
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

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages?: number
  facets?: Record<string, unknown>
  filters?: Record<string, unknown>
  totals?: Record<string, unknown>
}

export interface MemberListFilters {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  skills?: string[]
  status?: 'active' | 'inactive'
  sortBy?: 'name' | 'joinDate' | 'projectCount' | 'role'
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
}

export interface MemberListResponse extends PaginatedResponse<Member> {
  filters?: {
    roles?: RoleOption[]
    skills?: string[]
  }
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

export interface AdminLoginPayload {
  username: string
  password: string
  otpCode?: string
}

export interface AdminAuthResponse {
  token: string
  expiresIn: number
  user: AdminUser
}

export interface FileAsset {
  id: string
  name: string
  type: 'image' | 'doc' | 'slide' | 'other' | string
  size: number
  uploader?: string
  tags?: string[]
  downloadUrl: string
  previewUrl?: string
  checksum?: string
  createdAt: string
  expiresAt?: string
}