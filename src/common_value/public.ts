import { MOCK_MEMBERS } from '@/common_value/members'
import { MOCK_PROJECTS } from '@/common_value/projects'
import { MOCK_ARTICLES } from '@/common_value/articles'
import { MOCK_MEETINGS } from '@/common_value/meetings'
import type { SiteStats, HeroBanner, ContactResponse, PublicEvent } from '@/types/entities'

export const MOCK_SITE_STATS: SiteStats = {
  totalMembers: MOCK_MEMBERS.length,
  totalProjects: MOCK_PROJECTS.length,
  totalArticles: MOCK_ARTICLES.length,
  totalMeetings: MOCK_MEETINGS.length,
  successfulCollaborations: 42,
  averageResponseHours: 12,
  globalPartners: 18
}

export const MOCK_HERO_BANNERS: HeroBanner[] = [
  {
    id: 'hero-1',
    title: '链上可信，连接未来',
    subtitle: 'DUT Blockchain',
    description: '区块链创新实践与科研平台，连接学术与产业生态。',
    ctaLabel: '立即联系',
    ctaLink: '/contact',
    image: '/images/hero/contact-hero-1.png',
    accentColor: '#C084FC',
    order: 1
  },
  {
    id: 'hero-2',
    title: '共建可信数字社会',
    subtitle: 'Academic • Industry • Builder',
    description: '从科研到落地，助力数字经济转型。',
    ctaLabel: '查看项目',
    ctaLink: '/projects',
    image: '/images/hero/contact-hero-2.png',
    accentColor: '#60A5FA',
    order: 2
  }
]

export const MOCK_CONTACT_RESPONSE: ContactResponse = {
  ticketId: 'mock-ticket-001',
  estimatedReplyHours: 24
}

export const MOCK_PUBLIC_EVENTS: PublicEvent[] = [
  {
    id: 'event-1',
    title: '区块链国际峰会',
    description: '聚焦区块链底层技术、跨链互操作、DeFi 新趋势。',
    location: '北京·国家会议中心',
    startTime: '2025-03-15T09:00:00+08:00',
    endTime: '2025-03-15T18:00:00+08:00',
    type: 'summit',
    status: 'upcoming',
    tags: ['conference', 'blockchain', 'summit'],
    banner: '/images/events/summit.jpg'
  },
  {
    id: 'event-2',
    title: '智能合约安全研讨会',
    description: '智能合约审计流程、常见漏洞及防御实践。',
    location: '大连·创新创业中心',
    startTime: '2025-02-20T14:00:00+08:00',
    endTime: '2025-02-20T17:00:00+08:00',
    type: 'workshop',
    status: 'upcoming',
    tags: ['security', 'smart-contract'],
    banner: '/images/events/workshop.jpg'
  },
  {
    id: 'event-3',
    title: 'DeFi 创新论坛',
    description: '探索流动性优化、稳定币与跨链借贷等创新。',
    location: '上海·陆家嘴金融中心',
    startTime: '2024-12-01T10:00:00+08:00',
    endTime: '2024-12-01T17:00:00+08:00',
    type: 'conference',
    status: 'finished',
    tags: ['defi', 'finance'],
    banner: '/images/events/defi.jpg'
  }
]
