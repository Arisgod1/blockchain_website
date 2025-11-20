import type { Article } from '@/types/entities'

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '区块链技术入门指南',
    summary: '本文介绍了区块链的基本概念、工作原理以及应用场景，适合初学者阅读。',
    content: '区块链是一种分布式数据库技术...',
    author: { name: '张三', avatar: 'https://i.pravatar.cc/150?u=1' },
    tags: ['区块链', '入门', '技术'],
    category: '技术分享',
    publishDate: '2023-10-01',
    updateDate: '2023-10-01',
    readTime: 5,
    isPublished: true,
    views: 1200,
    likes: 45,
    coverImage: 'https://picsum.photos/id/10/800/400',
    isFeatured: true
  },
  {
    id: '2',
    title: '以太坊智能合约开发实战',
    summary: '通过一个简单的众筹合约案例，讲解Solidity编程语言的基础语法和开发流程。',
    content: 'Solidity是以太坊智能合约的主要开发语言...',
    author: { name: '李四', avatar: 'https://i.pravatar.cc/150?u=2' },
    tags: ['Ethereum', 'Solidity', 'Smart Contract'],
    category: '开发教程',
    publishDate: '2023-10-15',
    updateDate: '2023-10-15',
    readTime: 10,
    isPublished: true,
    views: 850,
    likes: 32,
    coverImage: 'https://picsum.photos/id/20/800/400',
    isFeatured: false
  }
]
