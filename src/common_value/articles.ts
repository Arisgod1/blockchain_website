import type { Article } from '@/types/entities'

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '【上学期】第一次例会 - Git版本控制',
    summary: '区块链第一次例会 主讲人：唐明迪 Git 版本控制 && 见面会 Git 工作区、版本库和暂存区概念...',
    content: `区块链第一次例会
主讲人：唐明迪
Git
版本控制
&&
见面会
Git
工作区、版本库和暂存区概念：
暂存区（ Staging Area ） 暂存区是一个临时存储区域...
常用命令：
git add filename       # 将单个文件添加到暂存区
git add .              # 将工作区中的所有修改添加到暂存区
git status             # 查看哪些文件在暂存区中
git commit -m "Commit message" # 将暂存区的更改提交到本地版本库
git push origin branch-name # 推送到远程仓库
密钥配置：
ssh-keygen -t ed25519 -C "your_email@example.com"
fork贡献代码流程：
1. fork公共仓库到自己的仓库
2. clone自己的仓库到本地
3. 新建文件，git add -> git commit -m -> git push
4. 新建pull request
5. 等待合并
见面会内容：
1. 扁平化的办公室氛围
2. 提供资源，注重每个人的发展
3. 为不同步频的人找到共鸣
4. 不画饼，不好高骛远`,
    author: { name: '唐明迪', avatar: '' },
    tags: ['例会', 'Git', '上学期', '编程技巧'],
    category: '例会分享',
    publishDate: '2025-10-12',
    updateDate: '2025-10-12',
    readTime: 7,
    isPublished: true,
    views: 0,
    likes: 0,
    isFeatured: true
  },
  {
    id: '2',
    title: '【上学期】第二次例会 - 前端基础（HTML/CSS/JavaScript）',
    summary: '区块链第 二次例会 主讲人： 包昀烨 前端基础 HTML 的基本语法 · 文本内容 ：使用 <p> 标签定义段落， <h1> 到 <h6> 标签定义标题...',
    content: `区块链第
二次例会
主讲人：
包昀烨
前端基础
HTML
的基本语法：
· 文本内容：使用 <p> 标签定义段落，<h1> 到 <h6> 标签定义标题，<strong>、<del> 和 <em> 标签强调文本
· 列表：<ul>/<ol> 和 <li> 标签
· 表格：<table>、<tr>、<td>、<th> 等标签
· 图像：<img> 标签
· 链接：<a> 标签

HTML属性：
· class属性：添加类名，用于CSS和JavaScript
· id属性：元素唯一标识符
· style属性：直接应用CSS样式

块级元素 vs 行内元素：
· 块级元素（block）：<div>, <p>, <h1>-<h6>, <ul>, <ol>, <li>, <table> 等，独占一行
· 行内元素（inline）：<span>, <a>, <strong>, <em>, <img>, <br>, <input> 等，不独占一行

CSS基本语法：
选择器 { 属性1: 属性值1; 属性2: 属性值2; }

导入方式优先级：内联样式 > 内部样式表 > 外部样式表

JavaScript：
· 轻量级、解释型、面向对象的脚本语言
· 主要用于网页动态效果和用户交互
· 可嵌入HTML，在浏览器中执行`,
    author: { name: '包昀烨', avatar: '' },
    tags: ['例会', '上学期', '前端', 'HTML', 'CSS', 'JavaScript'],
    category: '例会分享',
    publishDate: '2025-10-19',
    updateDate: '2025-10-19',
    readTime: 12,
    isPublished: true,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '3',
    title: '【上学期】第三次例会（无PPT）',
    summary: '本次例会无PPT文件，内容待补充。',
    content: `本次例会无PPT文件，内容待补充。
（如有相关资料，请补充到 ~/twork/blockchain/区块链/例会/第三次例会/ 文件夹中）`,
    author: { name: '未知', avatar: '' },
    tags: ['上学期', '例会'],
    category: '例会分享',
    publishDate: '2025-11-02',
    updateDate: '2025-11-02',
    readTime: 1,
    isPublished: false,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '4',
    title: '【上学期】第四次例会 - Coder技巧与编程素养',
    summary: '区块链第四次例会 主讲人：唐明迪 Coder 技巧 02 Programing Sense 环境变量 环境变量（ environment variables ）是操作系统中用于指定运行环境的一些参数...',
    content: `区块链第四次例会
主讲人：唐明迪
Coder 技巧

环境变量：
· 环境变量（environment variables）是操作系统中用于指定运行环境的一些参数
· 例如：Windows和DOS系统中，path环境变量用于指定可执行文件的搜索路径
· 配置环境变量就是将要调用的东西的路径放进去，告诉系统这个东西在这里

终端的使用：
· Win + R 输入 cmd 打开命令提示符
· 终端支持的东西很多，但cmd和终端有区别
· 某些命令只能在cmd运行，不能在powershell运行

基本命令：
· ls：列出当前目录下的文件和文件夹
· cd [目录名]：切换当前工作目录
· pwd：显示当前工作目录的路径
· mkdir [目录名]：创建新目录
· rm [文件名]：删除文件

IDE选择：
· 前端、客户端：vscode
· Android Studio：C/C++项目
· Visual Studio：C/C++项目
· IDEA：Java项目
· Pycharm：Python项目

AI的使用：
· 适用：短期难以速成的、自制小工具、辅助代码编写
· 不能替代你想专精的能力
· 不能替代面试时你对能力的展示
· 不能替代你的idea

发展方向：
前端：Flutter、Vue3
后端：Java、SpringBoot、Golang
深度学习：PyTorch、动手学深度学习`,
    author: { name: '唐明迪', avatar: '' },
    tags: ['例会', '上学期', '编程技巧', '环境变量', 'IDE', 'AI'],
    category: '例会分享',
    publishDate: '2025-12-07',
    updateDate: '2025-12-07',
    readTime: 31,
    isPublished: true,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '5',
    title: '【下学期】第五次例会 - 后端语言（Python/Java等）',
    summary: '区块链第五次例会 主讲人：任诚达 后端语言 应用场景：数据密集型应用、数据分析、机器学习服务、快速原型开发、创业公司MVP...',
    content: `区块链第五次例会
主讲人：任诚达
后端语言

Java核心特点：
· 强类型：编译时类型检查，减少运行时错误
· 面向对象：完整的OOP支持，包括封装、继承、多态
· 平台无关性：通过JVM实现跨平台运行
· 内存管理：自动垃圾回收机制

主要技术：
· Spring Boot：简化Spring应用的初始搭建和开发
· Spring MVC：基于MVC模式的Web框架
· Spring Data：简化数据访问操作
· Spring Security：安全和权限管理框架

Python后端 - Conda环境管理：
· 为什么使用conda配置环境？
  - 项目不打架：每个项目有自己的"调料架"
  - 版本不冲突：不同项目可用不同版本的工具
  - 安装不混乱：不会因为一个项目的需求影响另一个项目

Flask框架：
· 轻量级可定制框架，使用Python语言编写
· 基本模式：将视图函数分配给URL
· 装饰器：@app.route('/') 绑定URL
· GET请求：参数通过URL传递
· POST请求：参数通过请求体传递`,
    author: { name: '任诚达', avatar: '' },
    tags: ['例会', '下学期', '后端', 'Java', 'Python', 'Flask'],
    category: '例会分享',
    publishDate: '2026-03-08',
    updateDate: '2026-03-08',
    readTime: 14,
    isPublished: true,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '6',
    title: '【下学期】第六次例会 - 后端框架及开发',
    summary: '区块链第六次例会 主讲人：蔡瑞含 后端框架及开发 请求格式：Get请求将数据放在路径后面，Post请求有请求体...',
    content: `区块链第六次例会
主讲人：蔡瑞含
后端框架及开发

Socket是什么？
· 网络通信中的"插孔"或"端点"
· 应用程序通过网络发送和接收数据的接口
· 操作系统提供的一组标准的编程接口（API）

前后端分离：
· 前后端不分离：应用服务器既要处理数据又要渲染页面
· 前后端分离：后端服务器只需要返回数据，前端页面效果分配到另一个服务器

API（应用程序接口）：
· 应用程序对外提供的操作数据的入口
· 可以是函数、类方法、URL地址或网络地址

RESTful规范：
· 面向资源开发
· URL路径表示要操作的数据资源
· HTTP方法表达增删查改：POST、DELETE、GET、UPDATE

FastAPI：
· Python的现代化Web框架
· 基于ASGI异步
· 自动生成测试文档
· 两个核心组件：Startlette（web部分）+ Pydantic（数据部分）

HTTP方法：
· GET请求：参数通过URL传递，可被缓存
· POST请求：参数通过请求体传递，不会被缓存

状态码：
200：成功
404：找不到资源
500：服务器内部错误`,
    author: { name: '蔡瑞含', avatar: '' },
    tags: ['例会', '下学期', '后端', 'FastAPI', 'RESTful', 'Socket'],
    category: '例会分享',
    publishDate: '2026-04-12',
    updateDate: '2026-04-12',
    readTime: 10,
    isPublished: true,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '7',
    title: '【下学期】第七次例会（无PPT）',
    summary: '本次例会无PPT文件，内容待补充。',
    content: `本次例会无PPT文件，内容待补充。
（如有相关资料，请补充到 ~/twork/blockchain/区块链/例会/第七次例会/ 文件夹中）`,
    author: { name: '未知', avatar: '' },
    tags: ['下学期', '例会'],
    category: '例会分享',
    publishDate: '2026-05-10',
    updateDate: '2026-05-10',
    readTime: 1,
    isPublished: false,
    views: 0,
    likes: 0,
    isFeatured: false
  },
  {
    id: '8',
    title: '【下学期】第八次例会（无PPT）',
    summary: '本次例会无PPT文件，内容待补充。',
    content: `本次例会无PPT文件，内容待补充。
（如有相关资料，请补充到 ~/twork/blockchain/区块链/例会/第八次例会/ 文件夹中）`,
    author: { name: '未知', avatar: '' },
    tags: ['下学期', '例会'],
    category: '例会分享',
    publishDate: '2026-06-07',
    updateDate: '2026-06-07',
    readTime: 1,
    isPublished: false,
    views: 0,
    likes: 0,
    isFeatured: false
  }
]
