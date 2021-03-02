import { server } from '../config'
import { ajax } from './ajax'
import { Url, param } from './url'

var wx = window.wx
var $wx = {}

// script
if (wx) {
  set$wx()
} else {
  var res = 'http://res.wx.qq.com/open/js/jweixin-1.6.0.js'
  var res2 = 'http://res2.wx.qq.com/open/js/jweixin-1.6.0.js'

  var script = document.createElement('script')
  script.src = res
  script.onerror = e => (script.src = res2)
  script.onload = set$wx
  document.body.appendChild(script)
}

async function config(href = location.href) {
  // console.log('config', href)
  // console.log('firstLocationHref', config.firstLocationHref)

  // cache
  // 可能某些机型（iphone7p） hash 变化也要重新 config，所以要带hash判断
  if (href == config.lastHref) {
    console.warn('config cache', href)
    return true
  }

  // config data
  var { returnObject: data } = await ajax.post(
    server + '/weChatApi/getWebJsApi',
    {
      pageUrl: href.split('#')[0],
    }
  )

  return new Promise(rs => {
    // console.info('config Promise')
    setTimeout(() => {
      // 这个setTimeout应该可以去掉，试试phone7plus是否正常
      wx.config({
        ...data,
        debug: param('debug'),
        jsApiList: [
          'closeWindow',

          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',

          'hideOptionMenu',
          'showOptionMenu',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',

          'chooseImage',
          'uploadImage',
          'downloadImage',
        ],
      })
      wx.ready(function() {
        console.info('config wx.ready')
        rs()

        // cache
        config.lastHref = href
      })
      wx.error(async function(res) {
        if (!config.isAgain) {
          return
        }
        config.isAgain = true

        // ios try again
        console.warn('config error try again')
        await config(config.firstLocationHref)
        rs()
      })
    }, 500)
  })
}
config.firstLocationHref = location.href // ios: history.replaceState
$wx.$config = config

// function: await config()
function set$wx() {
  for (let method in wx) {
    var value = wx[method]

    if (typeof value === 'function') {
      $wx[method] = async function() {
        await config()

        if (method in pageshowCallMap) {
          pageshowCallMap[method] += location.href + ' | '
        }

        return wx[method].apply(this, arguments)
      }
    }
  }
}

// fix: hideAllNonBaseMenuItem,... 跳转之后返回失效
var pageshowCallMap = {
  hideAllNonBaseMenuItem: 'urls | ',
}
addEventListener('pageshow', e => {
  for (var method in pageshowCallMap) {
    var urls = pageshowCallMap[method]
    if (urls.indexOf(location.href) >= 0) {
      console.warn('pageshow $wx', method)
      wx[method]()
    }
  }
})

async function onshare(options = {}) {
  await config()
  var data = {
    link: Url({
      code: undefined,
      state: undefined,
      isShare: true,
    }),
    title: document.title,
    desc: document.querySelector('[name="description"]')?.content,
    imgUrl: document.querySelector('img')?.src,
    ...options,
  }
  console.info('[share data]', data)

  wx.onMenuShareTimeline(data)
  wx.onMenuShareAppMessage(data)
  // 以下两个方法的success在设置成功立即触发，并不是在分享成功后
  // wx.updateAppMessageShareData({ ...data, success: null })
  // wx.updateTimelineShareData({ ...data, success: null })
}

$wx.onshare = onshare
export { $wx, config, onshare }
export default $wx

/**
 * @deprecated
 */
export { onshare as configShare, onshare as resetShare }

// console
window.$wx = $wx
