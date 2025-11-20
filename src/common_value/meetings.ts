import type { Meeting, MeetingAgendaItem, MeetingFile, MeetingIssue } from '@/types/entities'

const baseLocation = '创新创业中心 A315 / 腾讯会议'
const resourceBase = 'https://static.blockchain-club.cn/meetings'

const defaultAttendees = [
  { id: 'member-tangmingdi', name: '唐明迪', role: '主持人' },
  { id: 'member-maxingrui', name: '马鑫蕊', role: '前端讲师' },
  { id: 'member-zhanghonghao', name: '张鸿昊', role: '后端导师' },
  { id: 'member-zhaoshuyang', name: '赵舒阳', role: '产品联络' }
]

const agendaItems = (prefix: string, items: string[], presenters: string[]): MeetingAgendaItem[] =>
  items.map((title, index) => ({
    id: `${prefix}-agenda-${index + 1}`,
    title,
    presenter: presenters[index] ?? presenters[presenters.length - 1],
    duration: 30,
    description: title
  }))

const buildIssues = (prefix: string, titles: string[], status: MeetingIssue['status'] = 'completed'): MeetingIssue[] =>
  titles.map((title, index) => ({
    id: `${prefix}-issue-${index + 1}`,
    title,
    status
  }))

const buildFiles = (prefix: string, resources: Array<{ name: string; type?: string; size?: string; filename: string }>): MeetingFile[] =>
  resources.map((resource, index) => ({
    id: `${prefix}-file-${index + 1}`,
    name: resource.name,
    type: resource.type ?? resource.filename.split('.').pop() ?? 'pdf',
    size: resource.size ?? '—',
    url: `${resourceBase}/${prefix}/${resource.filename}`
  }))

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'meeting-git-basics',
    title: '版本管理技术 Git',
    summary: '从版本控制理念到小组协作规范的系统演练。',
    date: '2024-09-07T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['training', 'workshop'],
    tags: ['Git', '版本控制'],
    duration: 120,
    attendees: defaultAttendees,
    agenda: agendaItems('git', [
      'Git 基础概念与版本控制意义',
      'Clone / Commit / Push / Pull / Branch 实战',
      '小组协作流程演练'
    ], ['唐明迪', '刘静雯', '张鸿昊']),
    decisions: [
      '统一采用 Git Flow 规范，所有项目必须创建开发分支',
      '建立共享仓库并同步到 QQ 群资料夹'
    ],
    actionItems: [
      {
        id: 'git-guide',
        description: '整理 Git 入门指引并录制 Demo 视频',
        assignee: '刘静雯',
        dueDate: '2024-09-10',
        status: 'in-progress',
        priority: 'medium'
      }
    ],
    issues: buildIssues('git', [
      'Git 基础概念（版本控制意义）',
      '常用命令操作演示（clone / push / pull / branch）',
      '团队协作规范与冲突解决'
    ]),
    files: buildFiles('git-basics', [
      { name: 'Git 入门讲义.pdf', filename: 'slides.pdf', size: '3.2MB' },
      { name: 'Git Flow 演示录屏.mp4', filename: 'demo.mp4', type: 'mp4', size: '420MB' }
    ]),
    minutes: `${resourceBase}/git-basics/minutes.pdf`,
    recording: `${resourceBase}/git-basics/recording.mp4`,
    recorder: '赵舒阳',
    isPublic: true
  },
  {
    id: 'meeting-frontend-basics',
    title: '前端语言基础（HTML + CSS + JS）',
    summary: '梳理 Web 标准、样式布局与 DOM 操作，帮助零基础成员搭建首个页面。',
    date: '2024-09-14T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['training'],
    tags: ['HTML', 'CSS', 'JavaScript'],
    duration: 120,
    attendees: [
      defaultAttendees[1],
      defaultAttendees[2],
      { id: 'member-wangmingfu', name: '王明富', role: '移动端代表' }
    ],
    agenda: agendaItems('frontend-basics', [
      'HTML 结构与常用语义标签',
      'CSS 选择器、Flex 布局与响应式技巧',
      'JavaScript 语法基础与 DOM 交互'
    ], ['马鑫蕊', '王明富', '马鑫蕊']),
    decisions: [
      '建立组件库代码片段，供新同学直接引用',
      '每周提交一份页面作品，纳入考核'
    ],
    actionItems: [
      {
        id: 'frontend-demo',
        description: '准备「报名落地页」示例仓库',
        assignee: '马鑫蕊',
        dueDate: '2024-09-17',
        status: 'pending',
        priority: 'medium'
      }
    ],
    issues: buildIssues('frontend-basics', [
      'HTML 结构、语义标签与模块化思维',
      'CSS 选择器、Flex 布局与响应式技巧',
      'JavaScript 基础语法与 DOM 交互'
    ]),
    files: buildFiles('frontend-basics', [
      { name: 'HTML & CSS 基础讲义.pdf', filename: 'slides.pdf', size: '4.5MB' },
      { name: 'DOM 操作 Demo.zip', filename: 'dom-demo.zip', type: 'zip', size: '1.2MB' }
    ]),
    minutes: `${resourceBase}/frontend-basics/minutes.pdf`,
    recording: `${resourceBase}/frontend-basics/recording.mp4`,
    recorder: '王明富',
    isPublic: true
  },
  {
    id: 'meeting-frontend-framework',
    title: '前端框架简介',
    summary: '介绍现代前端框架的设计理念，并以 Vue 与 React 做对比演示。',
    date: '2024-09-21T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['sharing'],
    tags: ['Vue', 'React', '前端框架'],
    duration: 120,
    attendees: [
      defaultAttendees[1],
      { id: 'member-liujingwen', name: '刘静雯', role: '讲师' },
      { id: 'member-baoyunye', name: '包昀烨', role: '前端助教' }
    ],
    agenda: agendaItems('frontend-framework', [
      '框架存在的意义与常见模式',
      'Vue 组合式 API 上手',
      'React Hooks 与生态简介'
    ], ['马鑫蕊', '刘静雯', '包昀烨']),
    decisions: [
      '之后的项目统一采用 Vue3 组合式写法',
      'React 小组负责维护组件库对照表'
    ],
    actionItems: [
      {
        id: 'framework-compare',
        description: '输出 Vue / React API 速查表',
        assignee: '包昀烨',
        dueDate: '2024-09-25',
        status: 'pending',
        priority: 'low'
      }
    ],
    issues: buildIssues('frontend-framework', [
      '现代前端框架出现的背景与痛点',
      'Vue 组合式 API 核心概念与示例',
      'React Hooks 与生态链介绍'
    ]),
    files: buildFiles('frontend-framework', [
      { name: '前端框架对比 PPT.pdf', filename: 'slides.pdf', size: '6.1MB' },
      { name: 'Vue & React Demo 代码.zip', filename: 'demos.zip', type: 'zip', size: '2.8MB' }
    ]),
    minutes: `${resourceBase}/frontend-framework/minutes.pdf`,
    recording: `${resourceBase}/frontend-framework/recording.mp4`,
    recorder: '刘静雯',
    isPublic: true
  },
  {
    id: 'meeting-client-intro',
    title: '客户端开发入门',
    summary: '介绍 Android 工程结构、常用 UI 组件以及调试流程。',
    date: '2024-09-28T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['training'],
    tags: ['Android', '客户端开发'],
    duration: 90,
    attendees: [
      { id: 'member-sunchangxiang', name: '孙常翔', role: '主持人' },
      { id: 'member-wangmingfu', name: '王明富', role: 'Flutter 分享' },
      { id: 'member-wangyida', name: '王毅达', role: 'Godot 实践' }
    ],
    agenda: agendaItems('client', [
      'Android Studio 环境与调试',
      '项目结构与模块拆分',
      '常用 UI 组件与布局示例'
    ], ['孙常翔', '王明富', '王毅达']),
    decisions: [
      '移动端项目采用统一包名规范',
      '每期例会后同步 Demo APK 到群文件'
    ],
    actionItems: [
      {
        id: 'client-starter',
        description: '制作客户端脚手架模板',
        assignee: '孙常翔',
        dueDate: '2024-10-03',
        status: 'in-progress',
        priority: 'medium'
      }
    ],
    issues: buildIssues('client', [
      'Android Studio 环境配置与调试技巧',
      '项目结构划分及模块化实践',
      '常用 UI 组件与交互范式'
    ]),
    files: buildFiles('client-intro', [
      { name: '客户端入门 PPT.pdf', filename: 'slides.pdf', size: '5.8MB' },
      { name: 'Demo APK & 源码.zip', filename: 'demo.zip', type: 'zip', size: '18MB' }
    ]),
    minutes: `${resourceBase}/client-intro/minutes.pdf`,
    recording: `${resourceBase}/client-intro/recording.mp4`,
    recorder: '王毅达',
    isPublic: true
  },
  {
    id: 'meeting-backend-language',
    title: '后端语言基础',
    summary: '覆盖 Java/Golang/Python 基础语法、数据结构与算法思维。',
    date: '2024-10-12T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['training'],
    tags: ['Java', 'Golang', 'Python'],
    duration: 120,
    attendees: [
      defaultAttendees[0],
      { id: 'member-cairuihan', name: '蔡瑞含', role: 'Golang 分享' },
      { id: 'member-mayuha', name: '马玉灏', role: 'Go 实践' }
    ],
    agenda: agendaItems('backend-language', [
      'Java / Golang 语言特点',
      'Python 基础语法与数据结构',
      '算法与数据结构快速复习'
    ], ['唐明迪', '蔡瑞含', '马玉灏']),
    decisions: [
      '设立语言互助小组，彼此 code review',
      '算法作业并入周报制度'
    ],
    actionItems: [
      {
        id: 'algo-practice',
        description: '整理 5 道链表/树结构练习题',
        assignee: '唐明迪',
        dueDate: '2024-10-15',
        status: 'pending',
        priority: 'medium'
      }
    ],
    issues: buildIssues('backend-language', [
      'Java / Golang 核心语法与对比',
      'Python 数据结构与脚本实践',
      '算法与数据结构复盘'
    ]),
    files: buildFiles('backend-language', [
      { name: '后端语言基础讲义.pdf', filename: 'slides.pdf', size: '7.5MB' },
      { name: '算法练习题目合集.pdf', filename: 'exercises.pdf', size: '1.9MB' }
    ]),
    minutes: `${resourceBase}/backend-language/minutes.pdf`,
    recording: `${resourceBase}/backend-language/recording.mp4`,
    recorder: '蔡瑞含',
    isPublic: true
  },
  {
    id: 'meeting-backend-framework',
    title: '后端框架及 RESTful 设计',
    summary: '拆解常见后端框架结构，并以 RESTful API 为例完成一次小型实战。',
    date: '2024-10-19T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'completed',
    types: ['training'],
    tags: ['SpringBoot', 'RESTful'],
    duration: 120,
    attendees: [
      defaultAttendees[0],
      defaultAttendees[2],
      { id: 'member-renchengda', name: '任诚达', role: 'Python 框架' }
    ],
    agenda: agendaItems('backend-framework', [
      '常见框架的模块拆分',
      '快速搭建 RESTful API',
      '接口文档与调试流程'
    ], ['张鸿昊', '唐明迪', '任诚达']),
    decisions: [
      '所有新项目必须附带 OpenAPI 文档',
      '后端仓库统一接入自动化测试'
    ],
    actionItems: [
      {
        id: 'rest-demo',
        description: '发布课程共用的 RESTful Demo 项目',
        assignee: '张鸿昊',
        dueDate: '2024-10-22',
        status: 'pending',
        priority: 'high'
      }
    ],
    issues: buildIssues('backend-framework', [
      '主流后端框架模块拆分思路',
      'RESTful API 设计规范与示例',
      '接口文档、调试与自动化测试'
    ]),
    files: buildFiles('backend-framework', [
      { name: '后端框架与 REST 实战 PPT.pdf', filename: 'slides.pdf', size: '8.4MB' },
      { name: 'RESTful Demo 源码.zip', filename: 'demo.zip', type: 'zip', size: '3.6MB' }
    ]),
    minutes: `${resourceBase}/backend-framework/minutes.pdf`,
    recording: `${resourceBase}/backend-framework/recording.mp4`,
    recorder: '任诚达',
    isPublic: true
  },
  {
    id: 'meeting-orm-db',
    title: 'ORM 框架与数据库操作',
    summary: '讲解 ORM 思维与常见框架，展示如何简化数据库操作。',
    date: '2024-10-26T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'upcoming',
    types: ['training'],
    tags: ['ORM', '数据库'],
    duration: 90,
    attendees: defaultAttendees,
    agenda: agendaItems('orm', [
      'ORM 的优势与适用场景',
      '示例：使用 MyBatis / Prisma 读写数据',
      '数据库调优与常见坑'
    ], ['张鸿昊', '马鑫蕊', '唐明迪']),
    actionItems: [
      {
        id: 'orm-handout',
        description: '提前发放 ORM 对照讲义',
        assignee: '张鸿昊',
        dueDate: '2024-10-24',
        status: 'pending',
        priority: 'medium'
      }
    ],
    issues: buildIssues('orm', [
      'ORM 核心理念与适用场景',
      'MyBatis / Prisma 读写示例',
      '数据库调优与常见坑'
    ], 'in-progress'),
    files: buildFiles('orm-db', [
      { name: 'ORM 对照讲义.pdf', filename: 'slides.pdf', size: '5.1MB' },
      { name: '数据库调优 Checklist.docx', filename: 'db-checklist.docx', type: 'docx', size: '320KB' }
    ]),
    minutes: `${resourceBase}/orm-db/minutes.pdf`,
    recording: `${resourceBase}/orm-db/recording.mp4`,
    recorder: '马鑫蕊',
    isPublic: true
  },
  {
    id: 'meeting-cloud-native',
    title: '云原生与容器部署',
    summary: 'Docker / Kubernetes / CI-CD 的一站式入门，帮助团队掌握部署流水线。',
    date: '2024-11-02T19:00:00',
    time: '19:00',
    location: baseLocation,
    status: 'upcoming',
    types: ['training'],
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    duration: 120,
    attendees: [
      defaultAttendees[0],
      { id: 'member-sichenfei', name: '司辰飞', role: '平台运维' },
      { id: 'member-cairuihan', name: '蔡瑞含', role: '后端同学' }
    ],
    agenda: agendaItems('cloud', [
      'Docker 基础与镜像管理',
      'Kubernetes 工作流简介',
      'CI/CD 流水线搭建与实战'
    ], ['司辰飞', '唐明迪', '蔡瑞含']),
    actionItems: [
      {
        id: 'cloud-lab',
        description: '准备在线实验环境与脚本',
        assignee: '司辰飞',
        dueDate: '2024-10-31',
        status: 'pending',
        priority: 'high'
      }
    ],
    issues: buildIssues('cloud', [
      'Docker 核心概念与镜像管理',
      'Kubernetes 工作流示例',
      'CI/CD 流水线搭建实战'
    ], 'pending'),
    files: buildFiles('cloud-native', [
      { name: '云原生与容器部署 PPT.pdf', filename: 'slides.pdf', size: '9.6MB' },
      { name: 'CI/CD Pipeline Demo.zip', filename: 'pipeline-demo.zip', type: 'zip', size: '4.4MB' }
    ]),
    minutes: `${resourceBase}/cloud-native/minutes.pdf`,
    recording: `${resourceBase}/cloud-native/recording.mp4`,
    recorder: '蔡瑞含',
    isPublic: true
  }
]
