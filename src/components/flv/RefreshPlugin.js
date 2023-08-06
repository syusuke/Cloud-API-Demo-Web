import { Plugin } from 'xgplayer'

const { POSITIONS } = Plugin

export default class RefreshPlugin extends Plugin {
  // 插件的名称，将作为插件实例的唯一key值
  static get pluginName () {
    return 'refreshPlugin'
  }

  static get defaultConfig () {
    return {
      // 挂载在controls的右侧，如果不指定则默认挂载在播放器根节点上
      position: POSITIONS.CONTROLS_LEFT,
      name: '刷新',
    }
  }

  beforeCreate (args) {
    if (typeof args.player.config.refresh === 'boolean') {
      args.config.disable = !args.player.config.refresh
    }
  }

  beforePlayerInit () {
    // TODO 播放器调用start初始化播放源之前的逻辑
  }

  afterPlayerInit () {
    // TODO 播放器调用start初始化播放源之后的逻辑
  }

  afterCreate () {
    this.icon = this.find('.icon')
    this.onIconClick = (e) => {
      console.log('class为icon元素点击回调')
    }
    this.onClick = () => {
      if (this.player.isPlaying || this.player.isPaused) {
        // console.log('reload player')
        this.player.retry()
      }
    }
    // 对当前插件根节点内部类名为.icon的元素绑定click事件
    this.bind('.icon', 'click', this.onIconClick)
    // 对当前插件根节点绑定click事件
    this.bind('click', this.onClick)
  }

  destroy () {
    this.unbind('.icon', 'click', this.onIconClick)
    this.unbind('click', this.onClick)
    this.icon = null
    // 播放器销毁的时候一些逻辑
  }

  render () {
    if (this.config.disable) {
      return
    }
    return '<xg-icon><div class="xgplayer-icon btn-text"><span>刷新</span></div></xg-icon>'
  }
}
