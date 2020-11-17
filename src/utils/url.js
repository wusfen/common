/**
 * 获取所有 url 参数
 * @example
 * params().id
 * @param {string?} url
 * @returns {object} url上的所有参数，返回一个对象
 */
function params(url = location.href) {
  var reg = /([^?=&#]*)=([^?=&#]*)/g
  var m
  var map = {}

  while ((m = reg.exec(url))) {
    var key = decodeURIComponent(m[1])
    var value = decodeURIComponent(m[2])
    if (value === 'true') value = true
    if (value === 'false') value = false
    if (value === 'null') value = null
    if (value === 'undefined') value = undefined
    map[key] = value
  }

  return map
}

/**
 * 获取单个url参数
 * @param {string} name url参数名
 * @returns {string} 返回url参数值
 */
function param(name) {
  return params()[name]
}

/**
 * 设置参数返回新的url
 *
 * @example
 * setParams('url?a=1&b=2#/Page?c=3&d=4', {a:2,e:5})
 * @example
 * setParams({a:2,e:5})
 * @param {string?} url
 * @param {object} params 设置的参数
 * @returns {string} new url
 */
function setParams(url, params) {
  if (!params) {
    params = url
    url = location.href
  }

  for (var key in params) {
    var value = params[key]

    // - ?k=1&  ?..&k=1&..  ?k=1  ?k=1#
    var kv = `${key}=[^?=&#]*`
    url = url
      .replace(RegExp(`${kv}&|&${kv}`, 'g'), '')
      .replace(RegExp(`[?]${kv}($|#)`), '$1')

    // + url  url?e=1  url?e=1&e=2  url#  url?e=1#
    if (value !== undefined) {
      var arr = url.split('#')
      var urlSub = arr[0]
      var hash = arr[1]
      url = urlSub + `${urlSub.match(/[?]/) ? '&' : '?'}${key}=${value}`
      url = url + (hash ? `#${hash}` : '')
    }
  }
  return url
}

/**
 * 修改当前url
 * @param {object} params
 */
function replaceUrl(params) {
  var url = setParams(params)
  history.replaceState('', '', url)
}

/**
 * 相对地址转绝对地址
 * @param {string} path
 */
function getFullPath(path) {
  var a = document.createElement('a')
  a.href = path
  return a.href
}

/**
 * 返回新的url并设置参数
 * @param {string} path
 * @param {object} params
 */
function Url(path = location.href, params = {}) {
  if (typeof path == 'object') {
    params = path
    path = location.href
  }

  var url = getFullPath(path)
  return setParams(url, params)
}

export { params, param, Url, replaceUrl, getFullPath }
export { params as getParams, param as getParam, setParams }
export default Url

// console
window.param = param
window.params = params
window.Url = Url
window.replaceUrl = replaceUrl
