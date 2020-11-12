import Modal from './Modal.vue'
import Overlay from './Overlay.vue'
import CountDown from './CountDown.vue'

export default {
  install(Vue, options) {
    Vue.component('Modal', Modal)
    Vue.component('Overlay', Overlay)
    Vue.component('CountDown', CountDown)
  },
}
