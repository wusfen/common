/**
 * @example
 * <el @longpress="method()" />
 */

var moveCount
var touchstartTimer
addEventListener('touchstart', e => {
  moveCount = 0
  touchstartTimer = setTimeout(() => {
    e.target.dispatchEvent(new Event('longpress', { bubbles: true }))
  }, 500)
})
addEventListener('touchmove', e => {
  if (++moveCount > 5) {
    clearTimeout(touchstartTimer)
  }
})

// 安卓长按图片弹窗菜单后不会触发 touchend
// 所以必须用 setTimeout 派发事件
addEventListener('touchend', e => {
  clearTimeout(touchstartTimer)
})
