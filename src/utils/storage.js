/**
 * 本地存储
 * 自动序列化
 * 自动解析
 *
 * @example
 * session.key = 'value'
 * local.obj = {k:'v'}
 *
 * x: local.obj.subKey = 'invalid'
 * y: obj = local.obj
 *    obj.subKey = 'new value'
 *    local.obj = obj
 */
var session = createProxy(sessionStorage)
var local = createProxy(localStorage)

function createProxy(storage) {
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

      return value
    },
    set(storage, key, value) {
      // remove
      if (value === undefined) {
        storage.removeItem(key)
        return true
      }

      // obj
      if (typeof value === 'object') {
        value = JSON.stringify(value, null, '  ')
      }

      // save
      try {
        storage[key] = value
      } catch (e) {
        // try again
        storage.clear()
        try {
          storage[key] = value
        } catch (e) {}
      }
      return true
    },
  })

  return proxy
}

var storage = local
export { session, local, storage }
export default storage

// console
window.session = session
window.local = local
window.storage = storage
