import type { Meeting } from '@/types/entities'

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'meeting-20241215',
    title: '区块链技术发展趋势讨论',
    summary: '聚焦Layer2、跨链与隐私保护的最新研究成果与落地方案。',
    date: '2024-12-15T14:00:00',
    time: '14:00',
    location: '创新中心·会议室A',
    status: 'completed',
    types: ['technical', 'weekly'],
    tags: ['Layer2', '跨链', '隐私计算'],
    duration: 120,
    attendees: [
      { id: 'u-zhangsan', name: '张三', avatar: '/avatars/zhang.jpg', role: '技术负责人' },
      { id: 'u-lisi', name: '李四', avatar: '/avatars/li.jpg', role: '研究员' },
      { id: 'u-wangwu', name: '王五', avatar: '/avatars/wang.jpg', role: '开发成员' }
    ],
    agenda: [
      { id: 'agenda-1', title: 'Layer2 扩容方案复盘', presenter: '张三', duration: 30 },
      { id: 'agenda-2', title: '跨链互操作演示', presenter: '李四', duration: 45 },
      { id: 'agenda-3', title: '隐私计算落地难点', presenter: '王五', duration: 30 }
    ],
    issues: [
      { id: 'issue-1', title: 'DeFi 协议安全性加固', status: 'completed' },
      { id: 'issue-2', title: 'Rollup 节点部署', status: 'in-progress' }
    ],
    decisions: ['确定Q1研究重点：隐私与互操作性', '建立跨组协作共享库'],
    actionItems: [
      {
        id: 'action-1',
        description: '整理Layer2评估报告',
        assignee: '李四',
        dueDate: '2024-12-22',
        status: 'in-progress',
        priority: 'high'
      },
      {
        id: 'action-2',
        description: '搭建跨链演示环境',
        assignee: '王五',
        dueDate: '2025-01-05',
        status: 'pending',
        priority: 'medium'
      }
    ],
    files: [
      { id: 'file-1', name: 'Layer2_Progress_Report.pdf', type: 'pdf', size: '2.3MB', url: '/files/meeting_layer2_report.pdf' },
      { id: 'file-2', name: 'Interoperability_Demo.pptx', type: 'pptx', size: '4.8MB', url: '/files/meeting_interop_demo.pptx' }
    ],
    recording: '/recordings/meeting_layer2.mp4',
    minutes: '/files/meeting_layer2_minutes.md',
    recorder: '赵六',
    isPublic: true,
    createdAt: '2024-12-15T16:20:00',
    updatedAt: '2024-12-15T16:20:00'
  },
  {
    id: 'meeting-20241208',
    title: '项目进展汇报与资源规划',
    summary: '各项目组同步近期进度与风险，规划寒假开发排期。',
    date: '2024-12-08T15:30:00',
    time: '15:30',
    location: '线上会议',
    status: 'completed',
    types: ['project', 'weekly'],
    tags: ['项目管理', '资源协调'],
    duration: 90,
    attendees: [
      { id: 'u-zhangsan', name: '张三', avatar: '/avatars/zhang.jpg', role: '组长' },
      { id: 'u-zhaoliu', name: '赵六', avatar: '/avatars/zhao.jpg', role: '项目经理' },
      { id: 'u-qianqi', name: '钱七', avatar: '/avatars/qian.jpg', role: '研发成员' }
    ],
    agenda: ['项目A进度更新', '风险与资源需求', '寒假排期'],
    issues: [
      { id: 'issue-3', title: '测试环境搭建', status: 'pending' },
      { id: 'issue-4', title: '智能合约部署计划', status: 'completed' }
    ],
    decisions: ['优先完成测试环境上线', '12月完成合约审计'],
    actionItems: [
      {
        id: 'action-3',
        description: '更新项目A文档与看板',
        assignee: '赵六',
        dueDate: '2024-12-12',
        status: 'pending',
        priority: 'medium'
      }
    ],
    files: [
      { id: 'file-3', name: '项目进展汇总.pdf', type: 'pdf', size: '1.8MB', url: '/files/meeting_progress_summary.pdf' }
    ],
    recorder: '张三',
    isPublic: true
  },
  {
    id: 'meeting-20241201',
    title: '零知识证明论文精读',
    summary: '深入讨论ZK-SNARKs实现细节与性能优化策略。',
    date: '2024-12-01T16:00:00',
    time: '16:00',
    location: '学术报告厅',
    status: 'completed',
    types: ['seminar', 'training'],
    tags: ['零知识证明', '密码学'],
    duration: 150,
    attendees: [
      { id: 'u-zhangsan', name: '张三', avatar: '/avatars/zhang.jpg' },
      { id: 'u-sunba', name: '孙八', avatar: '/avatars/sun.jpg' },
      { id: 'u-zhoujiu', name: '周九', avatar: '/avatars/zhou.jpg' }
    ],
    issues: [
      { id: 'issue-5', title: 'ZK-SNARK 实现挑战', status: 'completed' },
      { id: 'issue-6', title: '性能优化方案', status: 'in-progress' }
    ],
    files: [
      { id: 'file-4', name: '零知识证明分享.pdf', type: 'pdf', size: '4.2MB', url: '/files/meeting_zkp_share.pdf' },
      { id: 'file-5', name: '相关论文合集.zip', type: 'zip', size: '15.6MB', url: '/files/meeting_zkp_papers.zip' }
    ],
    recording: '/recordings/meeting_zkp.mp4',
    recorder: '王五',
    isPublic: true
  },
  {
    id: 'meeting-20231120',
    title: '年度总结与表彰筹备会',
    summary: '规划年度总结大会流程及表彰名单，确认物料与宣传安排。',
    date: '2024-11-20T19:00:00',
    time: '19:00',
    location: '创新中心·报告厅',
    status: 'upcoming',
    types: ['planning'],
    tags: ['活动策划', '行政事务'],
    duration: 90,
    attendees: ['张三', '李四', '赵六', '刘十'],
    agenda: ['总结大会流程', '表彰名单确认', '宣传物料安排'],
    actionItems: [
      {
        id: 'action-4',
        description: '整理年度成果视频',
        assignee: '刘十',
        dueDate: '2024-12-05',
        status: 'pending',
        priority: 'high'
      }
    ],
    recorder: '李四',
    isPublic: true
  }
]
