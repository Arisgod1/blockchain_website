interface AdminHotkeyEvent {
  type: 'trigger' | 'reset'
  timestamp: number
  data?: Record<string, unknown>
}

type AdminHotkeyCallback = (event: AdminHotkeyEvent) => void

class AdminHotkeyService {
  private keySequence: Array<{timestamp: number, ctrlKey: boolean, key: string}> = []
  private callback: AdminHotkeyCallback | null = null
  private isListening = false
  private resetTimer: number | null = null
  private readonly MAX_SEQUENCE_LENGTH = 10
  private readonly RESET_DELAY = 3000 // 3秒后重置序列

  /**
   * 开始监听管理员快捷键
   */
  startListening(callback: AdminHotkeyCallback) {
    if (this.isListening) {
      this.stopListening()
    }
    
    this.callback = callback
    this.isListening = true
    this.keySequence = []
    
    // 使用 window 监听键盘事件而不是 document，避免被某些元素拦截
    window.addEventListener('keydown', this.handleKeyDown, true)
    console.log('管理员快捷键监听已启动: Ctrl+5次B键')
    console.log('当前监听状态:', this.isListening)
  }

  /**
   * 停止监听
   */
  stopListening() {
    if (!this.isListening) return
    
    this.isListening = false
    this.callback = null
    this.keySequence = []
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer)
      this.resetTimer = null
    }
    
    // 使用 window 移除键盘事件监听
    window.removeEventListener('keydown', this.handleKeyDown, true)
    console.log('管理员快捷键监听已停止')
  }

  /**
   * 键盘事件处理
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isListening) return
    
    // 调试信息：打印每个按键事件
    console.log(`按键事件: ${event.key} + Ctrl:${event.ctrlKey} + 时间戳:${event.timeStamp}`)

    // 重置定时器
    if (this.resetTimer) {
      clearTimeout(this.resetTimer as number)
    }

    // 添加按键信息到序列
    const keyInfo = {
      timestamp: event.timeStamp,
      ctrlKey: event.ctrlKey,
      key: event.key.toLowerCase()
    }
    
    this.keySequence.push(keyInfo)
    
    // 限制序列长度
    if (this.keySequence.length > this.MAX_SEQUENCE_LENGTH) {
      this.keySequence.shift()
    }

    console.log('当前按键序列:', this.keySequence.map(k => `${k.ctrlKey?'Ctrl+':''}${k.key}`).join(' -> '))
    
    // 检查是否满足触发条件
    if (this.checkTriggerSequence()) {
      console.log('触发条件满足!')
      this.triggerAdminMode()
      this.resetSequence()
      
      return
    }

    // 如果不是触发条件，设置重置定时器
    if (this.keySequence.length >= 3 && !this.isTriggerPattern()) {
      this.resetTimer = window.setTimeout(() => {
        console.log('重置按键序列')
        this.resetSequence()
      }, this.RESET_DELAY)
    }
  }

  /**
   * 检查是否匹配触发序列模式
   * 触发条件: Ctrl+B 连续5次
   */
  private checkTriggerSequence(): boolean {
    if (this.keySequence.length < 5) return false

    // 获取最近的5次按键
    const recentSequence = this.keySequence.slice(-5)
    
    // 检查是否都是 Ctrl+B 组合
    for (const keyInfo of recentSequence) {
      if (!this.isCtrlBPattern(keyInfo)) {
        return false
      }
    }

    // 检查按键时间间隔（确保是连续的快速按键）- 放宽到2秒
    for (let i = 1; i < recentSequence.length; i++) {
      const timeDiff = recentSequence[i].timestamp - recentSequence[i - 1].timestamp
      if (timeDiff > 2000) { // 如果间隔超过2秒，不算连续
        return false
      }
    }

    return true
  }

  /**
   * 检查按键信息是否为 Ctrl+B 模式
   */
  private isCtrlBPattern(keyInfo: {timestamp: number, ctrlKey: boolean, key: string}): boolean {
    return keyInfo.ctrlKey && keyInfo.key === 'b'
  }

  /**
   * 检查当前序列是否匹配触发模式的部分
   */
  private isTriggerPattern(): boolean {
    // 检查最近的几按键是否包含Ctrl+B组合
    const recentKeys = this.keySequence.slice(-3) // 检查最近3个按键
    return recentKeys.some(keyInfo => this.isCtrlBPattern(keyInfo))
  }

  /**
   * 触发管理员模式
   */
  private triggerAdminMode() {
    console.log('🎉 管理员快捷键触发成功!')
    console.log('触发时间:', new Date().toLocaleTimeString())
    
    // 触发全局管理员登录事件
    const adminHotkeyEvent = new CustomEvent('admin-hotkey-trigger', {
      detail: { 
        type: 'trigger',
        timestamp: Date.now()
      }
    })
    window.dispatchEvent(adminHotkeyEvent)
    console.log('🚀 已触发 admin-hotkey-trigger 事件')
    
    if (this.callback) {
      console.log('执行回调函数...')
      this.callback({
        type: 'trigger',
        timestamp: Date.now()
      })
      console.log('回调函数执行完成')
    } else {
      console.warn('❌ 回调函数未设置!')
    }

    // 可选：显示提示信息
    this.showAdminHint()
  }

  /**
   * 显示管理员模式提示
   */
  private showAdminHint() {
    // 创建临时提示元素
    const hint = document.createElement('div')
    hint.className = 'fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg'
    hint.textContent = '管理员模式已激活'
    hint.style.fontSize = '14px'
    hint.style.fontWeight = '500'
    
    document.body.appendChild(hint)
    console.log('管理员提示框已显示')
    
    // 3秒后移除提示
    setTimeout(() => {
      hint.remove()
      console.log('管理员提示框已移除')
    }, 3000)
  }

  /**
   * 重置按键序列
   */
  private resetSequence() {
    this.keySequence = []
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer)
      this.resetTimer = null
    }
  }

  /**
   * 获取当前按键序列（调试用）
   */
  getCurrentSequence(): Array<{timestamp: number, ctrlKey: boolean, key: string}> {
    return [...this.keySequence]
  }

  /**
   * 手动重置序列
   */
  reset() {
    this.resetSequence()
    
    if (this.callback) {
      this.callback({
        type: 'reset',
        timestamp: Date.now()
      })
    }
  }
}

// 导出单例实例
export const adminHotkeyService = new AdminHotkeyService()

// 导出类以便测试或自定义
export { AdminHotkeyService }