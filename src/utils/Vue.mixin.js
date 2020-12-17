export default {
  install(Vue, options) {
    // Vue.config.productionTip = false

    /**
     * 自动设置 document.title
     * @example
     * export default{
     *  title: 'document.title',
     *  data(){}
     * }
     */
    var documentTitle = document.title
    function setVueTitle(vue) {
      try {
        if (vue.$options.title) {
          document.title = vue.$options.title
        }
        var routeVue = [...vue.$router.currentRoute.matched].pop().instances
          .default
        if (vue === routeVue) {
          document.title = vue.$options.title || documentTitle
        }
      } catch (_) {}
    }
    Vue.mixin({
      created() {
        setVueTitle(this)
      },
      activated() {
        setVueTitle(this)
      },
    })

    /**
     * auto clear setInterval
     * @param {function} cb
     * @param {*} time
     */
    Vue.prototype.setInterval = function(cb, time) {
      var timer = setInterval(cb, time)
      this._timers = this._timers || []
      this._timers.push(timer)
    }
    /**
     * auto clear setTimeout
     * @param {function} cb
     * @param {*} time
     */
    Vue.prototype.setTimeout = function(cb, time) {
      var timer = setTimeout(cb, time)
      this._timers = this._timers || []
      this._timers.push(timer)
    }
    Vue.mixin({
      destroyed() {
        var timers = this._timers || []
        for (let i = 0; i < timers.length; i++) {
          const timer = timers[i]
          clearInterval(timer)
          clearTimeout(timer)
        }
      },
    })

    /**
     * console
     * vue
     */
    Vue.mixin({
      mounted() {
        setTimeout(() => {
          try {
            if (this.$el.className.match('page') || this.$options.title) {
              window.vue = this
            }
            window.vue = [
              ...this.$router.currentRoute.matched,
            ].pop().instances.default
          } catch (_) {}
        }, 500)
      },
      activated() {
        setTimeout(() => {
          try {
            if (this.$el.className.match('page') || this.$options.title) {
              window.vue = this
            }
            window.vue = [
              ...this.$router.currentRoute.matched,
            ].pop().instances.default
          } catch (_) {}
        }, 500)
      },
    })

    /**
     * log data
     */
    Vue.prototype.log = function() {
      return JSON.parse(
        JSON.stringify(
          this,
          function(k, v) {
            if (k.match(/^[_$]/)) return
            return v
          },
          '  '
        )
      )
    }

    // [vue warn]: error => warn
    Vue.config.warnHandler = function(msg, vm, trace) {
      console.warn('[vue warn]', msg, vm, trace)
    }

    // TODO
    // // [vue error]
    // Vue.config.errorHandler = function(err, vm, info) {
    //   if (err instanceof Error) {
    //     throw err
    //   }
    //   // promise: error => warn
    //   console.warn('[vue warn]', err, vm, info)
    // }

    // console
    window.Vue = Vue
  },
}
