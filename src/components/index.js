import Overlay from './Overlay.vue'
import Modal from './Modal.vue'
import Alert from './Alert.vue'
import CountDown from './CountDown.vue'

export default {
  install(Vue, options) {
    Vue.component('Overlay', Overlay)
    Vue.component('Modal', Modal)
    Vue.component('Alert', Alert)
    Vue.component('CountDown', CountDown)

    Vue.prototype.$alert = function(message, cb) {
      var alert = new Vue(Alert)
      alert.isShow = false
      alert.message = message
      alert.$on('close', cb || Function)
      alert.$nextTick(e => {
        alert.isShow = true
      })

      var el = document.createElement('div')
      document.body.appendChild(el)
      alert.$mount(el)
    }
  },
}
