import type { Meeting } from '@/types/entities'

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: '第10次全体例会',
    date: '2023-11-01',
    time: '19:00',
    location: '创新中心302',
    attendees: ['张三', '李四', '王五'],
    agenda: ['项目进度汇报', '下周工作计划', '技术分享'],
    content: '本次会议主要讨论了...',
    decisions: ['确定了年会时间', '批准了新项目立项'],
    actionItems: [
      {
        id: '1',
        description: '完成首页UI设计',
        assignee: '李四',
        dueDate: '2023-11-05',
        status: 'in-progress',
        priority: 'high'
      }
    ],
    attachments: [],
    recorder: '王五',
    isPublic: true
  },
  {
    id: '2',
    title: '技术研讨会：零知识证明',
    date: '2023-11-15',
    time: '14:00',
    location: '线上会议',
    attendees: ['张三', '王五'],
    agenda: ['zk-SNARKs原理讲解', '应用案例分析'],
    content: '深入探讨了零知识证明在隐私保护中的应用...',
    decisions: [],
    actionItems: [],
    attachments: [],
    recorder: '张三',
    isPublic: true
  }
]
