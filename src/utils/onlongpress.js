/**
 * @example
 * <el @longpress="method()" />
 */

var moveCount
var touchstartTimer
addEventListener('touchstart', e => {
  moveCount = 0
  touchstartTimer = setTimeout(() => {
    !(function loopUp(el) {
      if (!el || !el.tagName) return

      // @longpress
      el.dispatchEvent(new Event('longpress'))
      el.dispatchEvent(new Event('longPress'))

      return loopUp(el.parentNode)
    })(e.target)
  }, 1000)
})
addEventListener('touchmove', e => {
  if (++moveCount > 10) {
    clearTimeout(touchstartTimer)
  }
})
addEventListener('touchend', e => {
  // 安卓长按图片弹窗菜单后不会触发 touchend
  // 所以用 setTimeout 来触发
  clearTimeout(touchstartTimer)
})
