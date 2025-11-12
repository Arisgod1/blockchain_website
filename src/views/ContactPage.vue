<template>
  <div class="contact-page">
    <!-- 页面头部 -->
    <header class="relative bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-4 py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            联系我们
          </h1>
          <p class="text-xl text-purple-100 mb-8 leading-relaxed">
            我们欢迎任何关于区块链技术的咨询、合作机会和学术交流。
            让我们一起探索区块链的无限可能，共同构建可信的数字未来。
          </p>
          <div class="flex justify-center gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-300">24/7</div>
              <div class="text-sm text-purple-200">在线支持</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-300">∞</div>
              <div class="text-sm text-purple-200">合作可能</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-300">100+</div>
              <div class="text-sm text-purple-200">成功合作</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-16">
      <!-- 联系表单区域 -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12">
            <!-- 联系表单 -->
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 class="text-2xl font-bold text-gray-800 mb-6">发送消息</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                    <input 
                      v-model="form.name"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="请输入您的姓名"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
                    <input 
                      v-model="form.email"
                      type="email" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="请输入您的邮箱"
                    >
                  </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">电话</label>
                    <input 
                      v-model="form.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="请输入您的电话号码"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">公司/学校</label>
                    <input 
                      v-model="form.organization"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="请输入您的公司或学校"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">咨询类型 *</label>
                  <select 
                    v-model="form.consultationType"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="">请选择咨询类型</option>
                    <option value="cooperation">合作咨询</option>
                    <option value="academic">学术交流</option>
                    <option value="technical">技术支持</option>
                    <option value="recruitment">招聘信息</option>
                    <option value="feedback">问题反馈</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">主题 *</label>
                  <input 
                    v-model="form.subject"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="请输入消息主题"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">详细信息 *</label>
                  <textarea 
                    v-model="form.message"
                    required
                    rows="5"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="请详细描述您的需求或问题..."
                  ></textarea>
                </div>
                
                <div class="flex items-start">
                  <input 
                    v-model="form.privacy"
                    type="checkbox" 
                    required
                    class="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  >
                  <label class="text-sm text-gray-600">
                    我同意按照<a href="#" class="text-purple-600 hover:underline">隐私政策</a>处理我的个人信息
                  </label>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span v-if="!isSubmitting">发送消息</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    发送中...
                  </span>
                </button>
              </form>
            </div>
            
            <!-- 联系信息 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">联系方式</h2>
                
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">地址</h3>
                      <p class="text-gray-600">辽宁省大连市甘井子区凌工路2号<br>大连理工大学软件学院</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">邮箱</h3>
                      <p class="text-gray-600">blockchain@dut.edu.cn</p>
                      <p class="text-gray-600">research@dutblockchain.com</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">电话</h3>
                      <p class="text-gray-600">+86 411-8470-6000</p>
                      <p class="text-gray-600">+86 138-0000-0000</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">工作时间</h3>
                      <p class="text-gray-600">周一至周五: 9:00 - 18:00</p>
                      <p class="text-gray-600">周末: 10:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 社交媒体 -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 class="text-xl font-bold text-gray-800 mb-6">关注我们</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <a href="#" class="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-gray-700 group-hover:text-blue-600">Twitter</span>
                  </a>
                  
                  <a href="#" class="flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group">
                    <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-gray-700 group-hover:text-red-600">YouTube</span>
                  </a>
                  
                  <a href="#" class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors group">
                    <div class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.891 3.475-2.156 4.839-.445.48-.96.904-1.545 1.272-.585-.368-1.1-.792-1.545-1.272-1.265-1.364-1.987-2.981-2.156-4.839C8.404 8.524 8 9.247 8 10.065V13.87c0 .818.404 1.541 1.176 1.905.169 1.858.891 3.475 2.156 4.839.445.48.96.904 1.545 1.272.585-.368 1.1-.792 1.545-1.272 1.265-1.364 1.987-2.981 2.156-4.839.772-.364 1.176-1.087 1.176-1.905v-3.805c0-.818-.404-1.541-1.176-1.905z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-white group-hover:text-gray-300">GitHub</span>
                  </a>
                  
                  <a href="#" class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
                    <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <span class="font-medium text-gray-700 group-hover:text-green-600">WeChat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 合作机会 -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">合作机会</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">学术合作</h3>
              <p class="text-gray-600 leading-relaxed">
                与高校、研究机构建立合作关系，共同推进区块链技术的学术研究和技术创新。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">企业合作</h3>
              <p class="text-gray-600 leading-relaxed">
                为企业提供区块链技术咨询、解决方案设计、技术培训等专业服务。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">人才招聘</h3>
              <p class="text-gray-600 leading-relaxed">
                招募对区块链技术充满热情的人才，共同参与前沿项目的研究与开发。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="mb-20">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">常见问题</h2>
          <div class="space-y-4">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
            >
              <button 
                @click="toggleFaq(index)"
                class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span class="font-semibold text-gray-800">{{ faq.question }}</span>
                <svg 
                  class="w-5 h-5 text-gray-500 transform transition-transform"
                  :class="{ 'rotate-180': openFaq === index }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                v-if="openFaq === index"
                class="px-6 pb-4 border-t border-gray-100"
              >
                <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 地图 -->
      <section>
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">找到我们</h2>
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-lg font-medium">大连理工大学</p>
                <p>辽宁省大连市甘井子区凌工路2号</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 提交成功提示 -->
    <div 
      v-if="showSuccess"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showSuccess = false"
    >
      <div 
        class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
        @click.stop
      >
        <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">消息发送成功！</h3>
        <p class="text-gray-600 mb-6">感谢您的留言，我们会尽快回复您。</p>
        <button 
          @click="showSuccess = false"
          class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 页面元数据设置
onMounted(() => {
  document.title = '联系我们 - 大连理工大学区块链组'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', '联系大连理工大学区块链组，探讨合作机会，获得技术支持')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = '联系大连理工大学区块链组，探讨合作机会，获得技术支持'
    document.head.appendChild(meta)
  }
})

// 表单数据
const form = reactive({
  name: '',
  email: '',
  phone: '',
  organization: '',
  consultationType: '',
  subject: '',
  message: '',
  privacy: false
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

// 常见问题数据
const faqs = [
  {
    question: '如何加入区块链组？',
    answer: '我们欢迎对区块链技术充满热情的同学加入。您可以通过发送邮件或在联系我们页面留言，说明您的背景和兴趣，我们会尽快回复您。'
  },
  {
    question: '你们提供哪些技术支持？',
    answer: '我们提供区块链技术咨询、智能合约开发、DeFi应用设计、NFT技术实现、共识算法优化等多种技术支持服务。'
  },
  {
    question: '可以与你们合作开展项目吗？',
    answer: '当然可以！我们与多家企业和研究机构建立了合作关系。如果您有具体的项目需求或合作意向，请通过邮件或联系表单与我们沟通。'
  },
  {
    question: '你们的研究方向有哪些？',
    answer: '我们的主要研究方向包括共识算法、智能合约、DeFi应用、NFT技术、区块链扩容方案和跨链技术等六大领域。'
  },
  {
    question: '如何获取学术合作机会？',
    answer: '我们欢迎学术界同仁的交流合作。您可以通过学术邮箱联系我们，或参与我们的学术交流活动。'
  }
]

const openFaq = ref<number | null>(null)

// 切换FAQ展开状态
function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

// 处理表单提交
async function handleSubmit() {
  if (!form.privacy) {
    alert('请同意隐私政策')
    return
  }

  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 重置表单
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') {
        form[key] = false
      } else {
        form[key] = ''
      }
    })
    
    showSuccess.value = true
    
    // 3秒后自动关闭
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    
  } catch (error) {
    alert('发送失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background-color: #fafafa;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>