/**
 * 本地存储
 * 自动序列化
 * 自动解析
 *
 * @example
 * session.key = 'value'
 * local.obj = {k:'v'}
 */
export var session = createProxy(sessionStorage)
export var local = createProxy(localStorage)
export var storage = local
export default storage

function createProxy(storage) {
  var temp = {}
  var proxy = new Proxy(storage, {
    get(storage, key) {
      // number, string
      var value = storage[key]
      // 'undefined'
      if (value === 'undefined') {
        return
      }

      // obj
      try {
        value = JSON.parse(value)
      } catch (e) {}

      // obj save again
      // session.obj = {key:1}
      // session.obj.key = 'changed'
      // JSON.parse(sessionStorage, '', '  ')
      // session.obj
      if (typeof value === 'object') {
        // First time in
        // session.obj
        value = temp[key] || value
        temp[key] = value
        // wait session.obj.key = 'changed'
        setTimeout(() => {
          // clear?
          // session.obj = {a:1}
          // sessionStorage.clear()
          // session.obj.a = 2
          if (!storage[key]) return
          // type changed?
          // session.obj = {a:1}
          // session.obj = 'string'
          if (temp[key] !== value) return
          // save again
          proxy[key] = value
        }, 0)
        return value
      }
      return value
    },
    set(storage, key, value) {
      temp[key] = value
      // remove
      if (value === undefined) {
        storage.removeItem(key)
        return true
      }
      // save obj
      if (typeof value === 'object') {
        try {
          storage[key] = JSON.stringify(value, null, '  ')
        } catch (e) {
          // try again
          storage.clear()
          try {
            storage[key] = JSON.stringify(value, null, '  ')
          } catch (e) {}
        }
      }
      // save
      else {
        storage[key] = value
      }
      return true
    },
  })

  return proxy
}

// console
window.session = session
window.local = local
window.storage = storage
