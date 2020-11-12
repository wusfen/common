/**
 * 注意接口和参数是否相同才使用
 */

import { ajax } from './ajax'
import { session } from './storage'

/**
 * <a bi="action"></a>
 */
addEventListener('click', function(e) {
  !(async function findUp(el) {
    if (!el || !el.tagName) return
    var biAttr = el.getAttribute('bi')

    if (biAttr) {
      var href = el.href

      // 避免跳转其它页面bi请求被取消
      if (href) {
        e.preventDefault()
        var timer = setTimeout(() => {
          location.href = href
        }, 1000)
      }

      await bi(biAttr)

      // go
      clearTimeout(timer)
      if (href) {
        location.href = href
      }
    }

    return findUp(el.parentNode)
  })(e.target)
})

/**
 * 长按bi
 * <div bilp="action"></div>
 */
var moveCount
var touchstartTimer
addEventListener('touchstart', e => {
  moveCount = 0
  touchstartTimer = setTimeout(() => {
    !(function findUp(el) {
      if (!el || !el.tagName) return
      var biAttr = el.getAttribute('bilp')

      if (biAttr) {
        bi(biAttr)
      }

      return findUp(el.parentNode)
    })(e.target)
  }, 1000)
})
addEventListener('touchmove', e => {
  if (++moveCount > 10) {
    clearTimeout(touchstartTimer)
  }
})
addEventListener('touchend', e => {
  // 安卓长按图片弹窗菜单后不会触发 touched
  clearTimeout(touchstartTimer)
})

/**
 * @example
 * bi('action')
 * @param {string} action
 */
export function bi(eventName) {
  var sessionId = session['bi/sessionId']
  sessionId =
    sessionId ||
    +new Date() +
      Math.random()
        .toString()
        .slice(-5)

  return ajax.post(
    '/weChatApi/marketActivity/addBtnClick',
    {
      sessionId,
      eventId: {
        2: {
          进入页面: -1,
          关闭页面: -2,
          点击打卡: 1,
          分享朋友圈: 2,
          点击领课时: 3,
          点击上传图片: 4,
          点击确认上传: 5,
          点击兑换: 6,
        }[eventName],
        3: {
          进入页面: -1,
          关闭页面: -2,
          点击立即上传截图: 1,
          点击上传图片: 2,
          点击确认上传: 3,
          点击兑换: 4,
        }[eventName],
      }[bi.activityId],
      eventName,
      activityId: bi.activityId,
      spOpenId: bi.spOpenId,
      pageType: bi.pageType,
      registerOrigin: bi.registerOrigin,
      openId: bi.openId,
      unionId: bi.unionId,
      device: navigator.userAgent,
    },
    true
  )
}

// ip
// var script = document.createElement('script')
// script.src = 'https://pv.sohu.com/cityjson?ie=utf-8'
// document.head.appendChild(script)

export default bi
