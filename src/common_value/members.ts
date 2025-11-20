import type { Member } from '@/types/entities'

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: '张三',
    role: '实验室负责人',
    avatar: 'https://i.pravatar.cc/150?u=1',
    bio: '专注于区块链底层技术研究，拥有多年开发经验。',
    skills: ['Blockchain', 'Go', 'Rust'],
    grade: '2020级',
    major: '软件工程',
    projectCount: 5,
    email: 'zhangsan@example.com',
    joinDate: '2020-09-01',
    isActive: true
  },
  {
    id: '2',
    name: '李四',
    role: '核心开发者',
    avatar: 'https://i.pravatar.cc/150?u=2',
    bio: '全栈工程师，热爱开源社区。',
    skills: ['Vue', 'Node.js', 'Solidity'],
    grade: '2021级',
    major: '计算机科学与技术',
    projectCount: 3,
    email: 'lisi@example.com',
    joinDate: '2021-09-01',
    isActive: true
  },
  {
    id: '3',
    name: '王五',
    role: '研究员',
    avatar: 'https://i.pravatar.cc/150?u=3',
    bio: '研究方向为零知识证明与隐私计算。',
    skills: ['Cryptography', 'C++', 'Python'],
    grade: '2022级',
    major: '网络安全',
    projectCount: 2,
    email: 'wangwu@example.com',
    joinDate: '2022-09-01',
    isActive: true
  }
]
