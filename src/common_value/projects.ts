import { type Project, Category, Status } from '@/types/entities'

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: '区块链溯源系统',
    description: '基于区块链技术的农产品溯源平台，确保食品安全。',
    category: Category.Development,
    status: Status.Completed,
    techStack: ['Vue3', 'Solidity', 'Node.js'],
    imageUrl: 'https://picsum.photos/id/1/800/600',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-06-01'),
    featured: true,
    progress: 100
  },
  {
    id: 2,
    name: '去中心化身份认证',
    description: '基于DID的数字身份认证系统，保护用户隐私。',
    category: Category.Research,
    status: Status.InProgress,
    techStack: ['React', 'Rust', 'Substrate'],
    imageUrl: 'https://picsum.photos/id/2/800/600',
    startDate: new Date('2023-03-15'),
    featured: true,
    progress: 60
  },
  {
    id: 3,
    name: '智能合约安全审计工具',
    description: '自动化智能合约漏洞检测与分析工具。',
    category: Category.Development,
    status: Status.Planning,
    techStack: ['Python', 'Go'],
    imageUrl: 'https://picsum.photos/id/3/800/600',
    startDate: new Date('2023-09-01'),
    featured: false,
    progress: 10
  }
]
