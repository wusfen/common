/**
 * <el @longpress="method()" />
 * <el v-longpress="method" />
 * <el v-longpress="e=>method('arg')" />
 * 不支持 <el v-longpress="method()" />
 */

export default {
  install(Vue) {
    // v-longpress
    Vue.directive('longpress', {
      bind: function(el, binding) {
        longPressList.push({ el, fn: binding.value })
      },
      inserted: function(el, binding) {},
      update: function() {},
      componentUpdated: function() {},
      unbind: function(el, binding) {
        // console.log('unbind', el, el.parentNode)
        // fix: 莫名其妙被undind了
        if (el.parentNode) return

        longPressList.splice(
          longPressList.findIndex(e => e.el === el),
          1
        )
      },
    })
  },
}

var longPressList = [
  // { el: '', fn: Function },
]

var moveCount
var touchstartTimer
addEventListener('touchstart', e => {
  moveCount = 0
  touchstartTimer = setTimeout(() => {
    !(function loopUp(el) {
      if (!el || !el.tagName) return

      // v-longpress
      var rs = longPressList.find(e => e.el === el)
      if (rs) {
        rs.fn(e)
      }

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
