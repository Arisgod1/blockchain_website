<template>
  <div class="contact-page">
    <!-- 页面头部 -->
    <header class="gradient-hero flowing-gradient-horizon text-white overflow-hidden">
      <div class="hero-stars">
        <span style="top:14%;left:16%;animation-duration:18s" />
        <span style="top:32%;left:82%;animation-duration:21s;animation-delay:1.1s" />
        <span style="top:60%;left:30%;animation-duration:16s;animation-delay:2.6s" />
        <span style="top:78%;left:64%;animation-duration:24s;animation-delay:3.4s" />
      </div>
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-500" />
      </div>
      
      <div class="relative z-10 container mx-auto px-4 py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            联系我们
          </h1>
          <p class="text-xl text-purple-100 mb-8 leading-relaxed">
            我们欢迎任何关于创新技术的咨询、合作机会和学术交流。
            让我们一起探索创新技术的无限可能，共同构建可信的数字未来。
          </p>
          <div class="flex justify-center gap-8 flex-wrap">
            <template v-if="statsLoading">
              <div
                v-for="n in 3"
                :key="`stats-loading-${n}`"
                class="w-32 h-20 rounded-xl bg-white/10 animate-pulse"
              />
            </template>
            <template v-else>
              <div
                v-for="item in summaryMetrics"
                :key="item.label"
                class="text-center"
              >
                <div class="text-3xl font-bold text-orange-200">
                  {{ item.value }}
                </div>
                <div class="text-sm text-purple-200">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </div>
          <p
            v-if="statsError"
            class="mt-4 text-sm text-red-100"
          >
            {{ statsError }}
          </p>
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
              <h2 class="text-2xl font-bold text-gray-800 mb-6">
                发送消息
              </h2>
              
              <form
                class="space-y-6"
                @submit.prevent="handleSubmit"
              >
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
                    <option value="">
                      请选择咨询类型
                    </option>
                    <option value="cooperation">
                      合作咨询
                    </option>
                    <option value="academic">
                      学术交流
                    </option>
                    <option value="technical">
                      技术支持
                    </option>
                    <option value="recruitment">
                      招聘信息
                    </option>
                    <option value="feedback">
                      问题反馈
                    </option>
                    <option value="other">
                      其他
                    </option>
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
                  />
                </div>
                
                <div class="flex items-start">
                  <input 
                    v-model="form.privacy"
                    type="checkbox" 
                    required
                    class="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  >
                  <label class="text-sm text-gray-600">
                    我同意按照<a
                      href="#"
                      class="text-purple-600 hover:underline"
                    >隐私政策</a>处理我的个人信息
                  </label>
                </div>

                <p
                  v-if="submitError"
                  class="text-sm text-red-500"
                >
                  {{ submitError }}
                </p>
                
                <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span v-if="!isSubmitting">发送消息</span>
                  <span
                    v-else
                    class="flex items-center justify-center"
                  >
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    发送中...
                  </span>
                </button>
              </form>
            </div>
            
            <!-- 联系信息 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                  联系方式
                </h2>
                
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">
                        地址
                      </h3>
                      <p class="text-gray-600">
                        辽宁省大连市金州区湾里街道图强路321号大连理工大学(开发区校区)<br>大连理工大学软件学院
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">
                        邮箱
                      </h3>
                      <p class="text-gray-600">
                        www.shuaige521@outlook.com
                      </p>
                      <p class="text-gray-600">
                        arisone@foxmail.com
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">
                        电话
                      </h3>
                      <p class="text-gray-600">
                        +86 18540291417
                      </p>
                      <p class="text-gray-600">
                        +86 18241171417
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-1">
                        工作时间
                      </h3>
                      <p class="text-gray-600">
                        周一至周五: 8:00 - 22:00
                      </p>
                      <p class="text-gray-600">
                        周末: 10:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 社交媒体 -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 class="text-xl font-bold text-gray-800 mb-6">
                  关注我们
                </h3>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <a
                    href="https://github.com/Arisgod1/BlockChain_GIt"
                    class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors group sm:col-span-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <img
                        :src="githubIcon"
                        alt="GitHub"
                        class="w-5 h-5 filter invert"
                        loading="lazy"
                        decoding="async"
                      >
                    </div>
                    <span class="font-medium text-white group-hover:text-gray-300">GitHub</span>
                  </a>
                  <a
                    href="#"
                    class="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                    role="button"
                    @click.prevent="openQrModal('qq')"
                  >
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <img
                        :src="qqIcon"
                        alt="QQ群"
                        class="w-5 h-5 invert"
                        loading="lazy"
                      >
                    </div>
                    <span class="font-medium text-gray-700 group-hover:text-blue-600">QQ群</span>
                  </a>
                
                  <a
                    href="#"
                    class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                    role="button"
                    @click.prevent="openQrModal('wechat')"
                  >
                    <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <img
                        :src="wechatIcon"
                        alt="WeChat"
                        class="w-5 h-5"
                        loading="lazy"
                        decoding="async"
                      >
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
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
            合作机会
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                学术合作
              </h3>
              <p class="text-gray-600 leading-relaxed">
                与高校、研究机构建立合作关系，共同推进技术的学术研究和技术创新。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                比赛合作
              </h3>
              <p class="text-gray-600 leading-relaxed">
                为想要进行各种比赛的同学提供技术咨询、解决方案设计、技术培训等服务。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                人才招聘
              </h3>
              <p class="text-gray-600 leading-relaxed">
                招募对前沿技术充满热情的人才，共同参与前沿项目的研究与开发。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="mb-20">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
            常见问题
          </h2>
          <div class="space-y-4">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
            >
              <button 
                class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                @click="toggleFaq(index)"
              >
                <span class="font-semibold text-gray-800">{{ faq.question }}</span>
                <svg 
                  class="w-5 h-5 text-gray-500 transform transition-transform"
                  :class="{ 'rotate-180': openFaq === index }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div 
                v-if="openFaq === index"
                class="px-6 pb-4 border-t border-gray-100"
              >
                <p class="text-gray-600 leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 地图 -->
      <section>
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
            找到我们
          </h2>
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg
                  class="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p class="text-lg font-medium">
                  大连理工大学
                </p>
                <p>辽宁省大连市金州区湾里街道图强路321号大连理工大学(开发区校区)教学楼a315</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 二维码弹窗 -->
    <div
      v-if="qrModal.visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      @click="closeQrModal"
    >
      <div
        class="bg-white rounded-2xl p-10 max-w-xl w-full mx-6 text-center shadow-2xl"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ qrModal.title }}
        </h3>
        <img
          :src="qrModal.image"
          :alt="qrModal.title"
          class="w-72 h-72 object-contain mx-auto mb-4"
        >
        <p class="text-sm text-gray-500 mb-6">
          可长按识别二维码或扫码了解详情。
        </p>
        <button
          class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          @click="closeQrModal"
        >
          关闭
        </button>
      </div>
    </div>

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
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          消息发送成功！
        </h3>
        <p class="text-gray-600 mb-6">
          感谢您的留言，我们会尽快回复您。
        </p>
        <p
          v-if="lastTicketId"
          class="text-sm text-gray-500 mb-4"
        >
          工单编号：{{ lastTicketId }}
        </p>
        <button 
          class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          @click="showSuccess = false"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getSiteStats, submitContactMessage } from '@/api/public'
import type { SiteStats, ContactRequest } from '@/types/entities'
import githubIcon from '@/assets/github.svg'
import qqIcon from '@/assets/qq.svg'
import wechatIcon from '@/assets/wechat.svg'
import socialQrPlaceholder from '@/assets/qr-code.png'
import wechatQr from '@/assets/wechat_QR.png'
// 页面元数据设置 + 数据加载
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

  loadSiteStats()
})

// 站点统计
const siteStats = ref<SiteStats | null>(null)
const statsLoading = ref(false)
const statsError = ref<string | null>(null)

const summaryMetrics = computed(() => {
  const stats = siteStats.value
  return [
    {
      label: '项目案例',
      value: stats ? `${stats.totalProjects}+` : '—'
    },
    {
      label: '合作成功',
      value: stats ? `${stats.successfulCollaborations}` : '—'
    },
    {
      label: '平均响应时间',
      value: stats ? `${stats.averageResponseHours}h` : '—'
    }
  ]
})

const loadSiteStats = async () => {
  statsLoading.value = true
  try {
    siteStats.value = await getSiteStats()
    statsError.value = null
  } catch (error) {
    console.error('加载站点统计失败:', error)
    statsError.value = error instanceof Error ? error.message : '暂时无法获取统计数据'
  } finally {
    statsLoading.value = false
  }
}

// 表单数据
interface ContactFormState {
  name: string
  email: string
  phone: string
  organization: string
  consultationType: string
  subject: string
  message: string
  privacy: boolean
}

const defaultFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  consultationType: '',
  subject: '',
  message: '',
  privacy: false
}

const form = reactive<ContactFormState>({ ...defaultFormState })

const isSubmitting = ref(false)
const showSuccess = ref(false)
const submitError = ref<string | null>(null)
const lastTicketId = ref<string | null>(null)

const socialQrSources: Record<'qq' | 'wechat', string> = {
  qq: socialQrPlaceholder,
  wechat: wechatQr
}

const qrModal = reactive({
  visible: false,
  title: '',
  image: ''
})

// 常见问题数据
const faqs = [
  {
    question: '如何加入区块链组？',
    answer: '我们欢迎对前沿技术充满热情的同学加入。您可以通过发送邮件或在联系我们页面留言，说明您的背景和兴趣，我们会尽快回复您。校内同学可以在学年末参与面试考核进组。'
  },
  {
    question: '你们提供哪些技术支持？',
    answer: '我们提供前沿技术咨询、智能合约开发、DeFi应用设计、NFT技术实现、共识算法优化等多种技术支持服务。'
  },
  {
    question: '可以与你们合作开展项目吗？',
    answer: '当然可以！如果您有具体的项目需求或合作意向，请通过邮件或联系表单与我们沟通。'
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
function resetForm() {
  Object.assign(form, { ...defaultFormState })
}

function openQrModal(type: 'qq' | 'wechat') {
  const image = socialQrSources[type]
  if (!image) return
  qrModal.title = type === 'qq' ? 'QQ群二维码' : 'WeChat 二维码'
  qrModal.image = image
  qrModal.visible = true
}

function closeQrModal() {
  qrModal.visible = false
}

async function handleSubmit() {
  if (!form.privacy) {
    submitError.value = '请先同意隐私政策'
    return
  }

  const payload: ContactRequest = {
    name: form.name,
    email: form.email,
    phone: form.phone || undefined,
    organization: form.organization || undefined,
    consultationType: form.consultationType || undefined,
    subject: form.subject,
    message: form.message,
    privacyAccepted: form.privacy,
    source: 'contact-page'
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    const response = await submitContactMessage(payload)
    lastTicketId.value = response.ticketId
    resetForm()
    showSuccess.value = true

    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('提交联系表单失败:', error)
    submitError.value = error instanceof Error ? error.message : '发送失败，请稍后重试'
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