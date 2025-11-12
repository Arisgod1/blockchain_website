<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <header class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-4 py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            关于我们
          </h1>
          <p class="text-xl text-blue-100 mb-8 leading-relaxed">
            大连理工大学区块链组致力于区块链技术的研究与创新应用，
            探索分布式系统的无限可能，为数字未来贡献智慧与力量。
          </p>
          <div class="flex justify-center gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-300">2019</div>
              <div class="text-sm text-blue-200">成立年份</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-300">5+</div>
              <div class="text-sm text-blue-200">研究领域</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-300">28</div>
              <div class="text-sm text-blue-200">团队成员</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-16">
      <!-- 团队介绍 -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">团队介绍</h2>
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <div class="prose prose-lg text-gray-600">
                <p>
                  大连理工大学区块链组成立于2019年，是一个专注于区块链技术研究与应用创新的学术研究团队。
                  我们致力于探索区块链技术的深层原理，推动其在实际场景中的落地应用。
                </p>
                <p>
                  团队汇聚了来自计算机科学、软件工程、数学等多个专业的优秀学生，
                  在指导老师的带领下，开展前沿技术研究，参与学术交流，培养创新型人才。
                </p>
                <p>
                  我们相信区块链技术将重塑数字世界的信任机制，为构建更加透明、安全、高效的
                  数字社会贡献力量。通过持续的研究与实践，我们希望成为区块链技术领域的
                  重要推动者和创新引领者。
                </p>
              </div>
            </div>
            <div class="relative">
              <!-- 团队展示卡片 -->
              <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div class="text-center mb-6">
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    DUTS
                  </div>
                  <h3 class="text-xl font-semibold text-gray-800">大连理工大学区块链组</h3>
                  <p class="text-sm text-gray-500">Blockchain Research Group</p>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span class="text-sm font-medium text-gray-700">成立时间</span>
                    <span class="text-sm text-blue-600 font-semibold">2019年</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span class="text-sm font-medium text-gray-700">指导单位</span>
                    <span class="text-sm text-orange-600 font-semibold">大连理工大学</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span class="text-sm font-medium text-gray-700">团队性质</span>
                    <span class="text-sm text-green-600 font-semibold">学术研究</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span class="text-sm font-medium text-gray-700">主要活动</span>
                    <span class="text-sm text-purple-600 font-semibold">技术研究</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 使命与愿景 -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">使命与愿景</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <!-- 使命 -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-blue-800 mb-4">使命</h3>
              <p class="text-blue-700 leading-relaxed">
                致力于区块链技术的研究与应用创新，
                推动分布式系统技术发展，为构建可信数字社会贡献力量。
              </p>
            </div>

            <!-- 愿景 -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-orange-800 mb-4">愿景</h3>
              <p class="text-orange-700 leading-relaxed">
                成为国内领先的区块链技术研究团队，
                在学术研究、技术创新、人才培养等方面发挥示范作用。
              </p>
            </div>

            <!-- 价值观 -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-green-800 mb-4">价值观</h3>
              <p class="text-green-700 leading-relaxed">
                诚信、创新、协作、开放，
                秉承学术严谨态度，追求技术创新突破，倡导团队合作精神。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 研究方向 -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">研究方向</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(field, index) in researchFields" 
              :key="field.id"
              class="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="flex items-center mb-4">
                <div 
                  class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  :class="field.colorClass"
                >
                  {{ field.icon }}
                </div>
                <h3 class="text-lg font-semibold text-gray-800 ml-4">{{ field.title }}</h3>
              </div>
              <p class="text-gray-600 leading-relaxed">{{ field.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 发展历程 -->
      <section class="mb-20">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">发展历程</h2>
          <div class="relative">
            <!-- 时间线 -->
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-orange-500"></div>
            
            <div class="space-y-8">
              <div 
                v-for="(milestone, index) in timeline" 
                :key="milestone.year"
                class="relative flex items-start"
              >
                <!-- 时间点 -->
                <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                     :class="milestone.colorClass">
                  <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <!-- 内容 -->
                <div class="ml-8 bg-white rounded-lg shadow-md border border-gray-100 p-6 flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-semibold text-gray-800">{{ milestone.year }}</h3>
                    <span class="px-3 py-1 text-xs font-medium rounded-full"
                          :class="milestone.badgeClass">{{ milestone.event }}</span>
                  </div>
                  <p class="text-gray-600">{{ milestone.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系信息 -->
      <section class="text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold mb-8 text-gray-800">加入我们</h2>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed">
            如果你对区块链技术充满热情，欢迎加入我们的团队！
            无论你是技术专家还是初学者，我们都欢迎你的参与。
          </p>
          <div class="flex justify-center">
            <router-link 
              to="/contact" 
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              联系我们
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 页面元数据设置
onMounted(() => {
  document.title = '关于我们 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '了解大连理工大学区块链组的使命、愿景、研究方向和发展历程')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '了解大连理工大学区块链组的使命、愿景、研究方向和发展历程'
    document.head.appendChild(meta)
  }
})

// 研究方向数据
const researchFields = [
  {
    id: 'consensus',
    title: '共识算法',
    icon: '⚡',
    colorClass: 'bg-blue-500',
    description: '研究分布式共识机制，包括PoW、PoS、DPoS等算法，优化网络性能和安全性。'
  },
  {
    id: 'smart-contract',
    title: '智能合约',
    icon: '📝',
    colorClass: 'bg-orange-500',
    description: '开发安全可靠的智能合约平台，研究合约审计和漏洞检测技术。'
  },
  {
    id: 'defi',
    title: 'DeFi应用',
    icon: '💰',
    colorClass: 'bg-green-500',
    description: '探索去中心化金融应用，包括去中心化交易所、借贷协议等创新模式。'
  },
  {
    id: 'nft',
    title: 'NFT技术',
    icon: '🎨',
    colorClass: 'bg-purple-500',
    description: '研究非同质化代币技术，推动数字资产和版权保护的创新发展。'
  },
  {
    id: 'scaling',
    title: '扩容方案',
    icon: '🚀',
    colorClass: 'bg-indigo-500',
    description: '研究和实现区块链扩容技术，提高交易处理能力和降低手续费。'
  },
  {
    id: 'cross-chain',
    title: '跨链技术',
    icon: '🔗',
    colorClass: 'bg-teal-500',
    description: '开发跨链桥接协议，实现不同区块链网络之间的互操作性。'
  }
]

// 发展历程数据
const timeline = [
  {
    year: '2019',
    event: '团队成立',
    description: '大连理工大学区块链组正式成立，汇聚首批区块链技术爱好者。',
    colorClass: 'bg-blue-500',
    badgeClass: 'bg-blue-100 text-blue-800'
  },
  {
    year: '2020',
    event: '研究方向确定',
    description: '确立六大研究领域：共识算法、智能合约、DeFi、NFT、扩容方案、跨链技术。',
    colorClass: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-800'
  },
  {
    year: '2021',
    event: '项目落地',
    description: '成功开发多个区块链应用项目，团队规模扩大到20余人。',
    colorClass: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-800'
  },
  {
    year: '2022',
    event: '学术成果',
    description: '发表多篇高质量学术论文，获得校内外技术竞赛奖项。',
    colorClass: 'bg-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800'
  },
  {
    year: '2023',
    event: '校企合作',
    description: '与多家企业建立合作关系，推动区块链技术的产业化应用。',
    colorClass: 'bg-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-800'
  },
  {
    year: '2024',
    event: '持续创新',
    description: '继续深化研究，布局新兴技术领域，培养更多区块链专业人才。',
    colorClass: 'bg-teal-500',
    badgeClass: 'bg-teal-100 text-teal-800'
  }
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: #fafafa;
}
</style>