/**
 * config:
 * ajax.base = 'http://server.com/api/base'
 */

/**
 * 发送 GET 请求
 * @param {string} url
 * @param {object?} params
 * @param {boolean?} silence 静默
 */
async function GET(url, params, silence) {
  // - undefined
  for (var key in params) {
    var value = params[key]
    if (value === undefined) {
      delete params[key]
    }
  }

  // toString
  var search = new URLSearchParams(params) + ''
  if (search) {
    search = (url.match('[?]') ? '&' : '?') + search
  }

  return ajax({
    url: `${url}${search}`,
    silence,
  })
}

/**
 * 发送 POST 请求
 * @param {string} url
 * @param {object} data
 * @param {boolean?} silence 静默
 */
async function POST(url, data, silence) {
  return ajax({
    method: 'POST',
    url,
    headers: { 'Content-Type': 'application/json' },
    data,
    silence,
  })
}

/**
 * 发送 PUT 请求
 * @param {string} url
 * @param {object} data
 * @param {boolean?} silence 静默
 */
async function PUT(url, data, silence) {
  return ajax({
    method: 'PUT',
    url,
    headers: { 'Content-Type': 'application/json' },
    data,
    silence,
  })
}

/**
 * 发送 DELETE 请求
 * @param {string} url
 * @param {object} data
 * @param {boolean?} silence 静默
 */
async function DELETE(url, data, silence) {
  return ajax({
    method: 'DELETE',
    url,
    headers: { 'Content-Type': 'application/json' },
    data,
    silence,
  })
}

/**
 * 发送 ajax
 * @param {string?} urlOrOptions
 * @param {object?} options
 * @param {string?} options.type http method: GET, POST, ..
 * @param {string?} options.url
 * @param {boolean?} options.silence 静默
 * @param {object?} options.headers
 * @param {object?} options.data
 */
async function ajax(urlOrOptions, options = {}) {
  if (typeof urlOrOptions === 'object') {
    options = urlOrOptions
  }

  var url = options.url || urlOrOptions
  url = url.match(/^https?:/) ? url : `${ajax.base}/${url}` // +base?
  url = url.replace(/([^:/])[/]{2,}/g, '$1/') // /// => /

  if (!options.silence) {
    ajax.count += 1
  }
  if (ajax.count == 1) {
    document.body.style.pointerEvents = 'none'
    ajax.onloadstart()
  }

  return fetch(url, {
    method: options.method || options.type || 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    body: (function() {
      var data = options.data
      if (toString.call(data) == '[object Object]') {
        return JSON.stringify(options.data, null, '  ')
      }
      return data
    })(),
  })
    .catch(e => {
      // console.error(e)

      return Promise.reject(e)
    })
    .then(res => {
      if (!/^(2..|3..)$/.test(res.status)) {
        ajax.onerror(res)
        return Promise.reject(res)
      }

      return res
    })
    .then(async res => {
      var text = await res.text()
      try {
        return JSON.parse(text)
      } catch (e) {
        return text
      }
    })
    .then(res => {
      res = ajax.onload(res)
      if (res !== undefined) {
        return res
      } else {
        return Promise.reject('ajax.onload => !res')
      }
    })
    .finally(res => {
      if (!options.silence) {
        setTimeout(() => {
          ajax.count -= 1
          if (ajax.count === 0) {
            document.body.style.pointerEvents = ''
            ajax.onloadend()
          }
        }, 300)
      }
    })
}

ajax.base = ''
ajax.count = 0

ajax.onloadstart = function() {
  if (document.title !== 'loading...') {
    ajax._title = document.title
    document.title = 'loading...'
  }
}
ajax.onloadend = function() {
  if (document.title === 'loading...') {
    document.title = ajax._title
  }
}
ajax.onload = function(res) {
  return res
}
ajax.onerror = function(e) {
  alert(e.status)
}

ajax.get = GET
ajax.post = POST
ajax.put = PUT
ajax.delete = DELETE

export { ajax }
export { GET, POST, PUT, DELETE }
export { GET as get, POST as post, PUT as put, DELETE as delete }
export default ajax

// console
window.get = GET
window.post = POST
window.ajax = ajax
