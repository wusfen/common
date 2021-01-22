import { Url, param, replaceUrl } from './url'
import { session, local } from './storage'
import { config, server } from '../config'
import { ajax } from './ajax'

/**
 * 返回微信授权地址
 * @param {object|boolean} options true=>{scope:'snsapi_userinfo'}
 */
function getAuthUrl(options = {}) {
  // (true)
  if (options === true) {
    options = { scope: 'snsapi_userinfo' }
  }

  // redirect_uri
  var redirect_uri = options.redirect_uri || location.href
  redirect_uri = Url(redirect_uri, {
    code: undefined,
    state: undefined,
  })
  if (process.env.NODE_ENV === 'development') {
    redirect_uri = `https://wx.wit-learn.com/subProg/weChat/h5Seed/code.html?redirect_uri=${encodeURIComponent(
      redirect_uri
    )}`
  }
  options.redirect_uri = redirect_uri

  // 参数顺序不可调换，特别是 微信pc版 appid 须放第一位
  var authUrl = `
      https://open.weixin.qq.com/connect/oauth2/authorize
      ?appid=${config.appid}
      &redirect_uri=${encodeURIComponent(options.redirect_uri)}
      &response_type=code
      &scope=${options.scope || 'snsapi_base' || 'snsapi_userinfo'}
      &state=${options.state || 'STATE'}
      #wechat_redirect
    `.replace(/\s/g, '')

  return authUrl
}

/**
 * A(url) -> B(url+code) -> back => A(url)
 * 返回微信code
 * @param {object|boolean} options true=>{scope:'snsapi_userinfo'}
 * @returns code
 */
async function getCode1(options) {
  var code = param('code')

  if (!code) {
    // used?
    if (session['wx:code'] && session['wx:code'] == session['wx:code:used']) {
      session['wx:code'] = undefined
    }

    // step 1: jump
    if (!session['wx:code']) {
      // pre
      session['wx:code:back'] = true
      session['wx:code:options'] = options
      document.body.style.pointerEvents = 'none'
      Object.assign(document.documentElement.style, {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
      })

      // jump
      var authUrl = getAuthUrl(options)
      // timeout wait bgi
      // 这个时间必须并且不能短，否则有些机型（iphone7plus） history.back 之后 wx.config 没有任何反应
      setTimeout(() => {
        // location.replace 对微信授权链接无效
        location.href = authUrl
      }, 666)
      // must
      // document: window 微信并非点所有元素都触发
      document.addEventListener('click', e => {
        if (!session['wx:code']) {
          location.href = authUrl
        }
      })
    }

    // step 2: wait
    return new Promise(resolve => {
      var timer = setInterval(() => {
        if (session['wx:code']) {
          var code = session['wx:code']
          resolve(code)

          clearInterval(timer)
          setTimeout(() => {
            session['wx:code:used'] = code
            document.body.style.pointerEvents = ''
            Object.assign(document.documentElement.style, {
              position: '',
              left: '',
              right: '',
              top: '',
            })
          }, 300)
        }
      }, 1)
    })
  }

  // param('code')
  if (code) {
    if (session['wx:code:back']) {
      // back by pageshow
      return new Promise(r => {})
    } else {
      replaceUrl({ code: undefined, state: undefined })
      return code
    }
  }
}

/**
 * A(url) -> B(url+code) => B(url)
 */
function getCode2(options) {
  var code = param('code')

  // 1: !code jump
  if (!code) {
    // jump
    var authUrl = getAuthUrl(options)
    location.replace(authUrl)

    // reject? click jump again
    // document: window 微信并非点所有元素都触发
    document.addEventListener('click', e => {
      location.replace(authUrl)
    })
    document.body.style.pointerEvents = 'none'

    // back closeWindow
    setTimeout(() => {
      addEventListener('pageshow', e => {
        // 微信中跳转之后， replaceState url 跟前一个页面的一样，返回时，前一个共享了后一个的上下文
        // window.wx.closeWindow()
      })
    }, 1)

    return new Promise(r => {}) // never resolve
  }

  // 2: code
  if (code) {
    replaceUrl({ code: undefined, state: undefined })
    return code
  }
}

/**
 * A(url) -> B(url+code) => B(url+code)
 */
function getCode3(options) {
  var code = param('code')

  // 1: !code jump
  if (!code) {
    // jump
    var authUrl = getAuthUrl(options)
    location.replace(authUrl)

    // reject? click jump again
    // document: window 微信并非点所有元素都触发
    document.addEventListener('click', e => {
      location.replace(authUrl)
    })
    document.body.style.pointerEvents = 'none'

    // back closeWindow
    setTimeout(() => {
      addEventListener('pageshow', e => {
        // window.wx.closeWindow()
      })
    }, 1)

    return new Promise(r => {}) // never resolve
  }

  // 2: code
  if (code) {
    // wechatdevtools remove code
    if (/wechatdevtools/i.test(navigator.userAgent)) {
      replaceUrl({ code: undefined, state: undefined })
    }
    return code
  }
}

function getCode(params) {
  return getCode3(params)
}

const OPEN_ID_KEY = `wx:openId:${config.appid}`
const UNION_ID_KEY = `wx:unionId:${config.appid}`
const USER_INFO_KEY = `wx:userInfo:${config.appid}`

/**
 *
 * @param {boolean} bool true? {unionId,openId}: {openId}
 */
async function fetchUserInfo(bool) {
  // !wx test
  if (!/MicroMessenger/i.test(navigator.userAgent)) {
    console.warn('!wx fetchUserInfo')

    if (/^https?:..(1|wx)/.test(location.href)) {
      return {
        openId: 'test',
        // openId: 'otXGV1QGGno4OzmAUMAu8jvbCqNA',
        unionId: 'test',
      }
    }

    return {
      openId: '',
      unionId: '',
    }
  }

  // fetch
  fetchUserInfo.promise =
    fetchUserInfo.promise ||
    new Promise(async rs => {
      local[OPEN_ID_KEY] = undefined
      session[OPEN_ID_KEY] = undefined

      var code = await getCode(bool)
      var { returnObject: data } = await ajax.get(
        server + '/weChatApi/sr/rmk/xqbg/login',
        {
          code,
        }
      )

      // save
      local[OPEN_ID_KEY] = data.openId
      session[OPEN_ID_KEY] = data.openId
      if (bool) {
        local[UNION_ID_KEY] = data.unionId
        local[USER_INFO_KEY] = data
        session[UNION_ID_KEY] = data.unionId
        session[USER_INFO_KEY] = data
      }

      rs(data)
    })

  return fetchUserInfo.promise
}

async function getOpenId() {
  var openId = local[OPEN_ID_KEY]
  if (openId) {
    return openId
  }

  return new Promise(rs => {
    // delay for getUnionId
    setTimeout(async () => {
      var userInfo = await fetchUserInfo()
      rs(userInfo.openId)
    }, 1)
  })
}

async function getUnionId() {
  var unionId = local[UNION_ID_KEY]
  if (unionId) {
    return unionId
  }
  var userInfo = await fetchUserInfo(true)
  return userInfo.unionId
}

// TODO 用户修改微信头像，头像链接会失效
async function getUserInfo() {
  var userInfo = local[USER_INFO_KEY]
  if (param('debug')) {
    userInfo = session[USER_INFO_KEY]
  }

  if (userInfo) {
    return userInfo
  }
  var userInfo = await fetchUserInfo(true)
  return userInfo
}

// code back
if (param('code') && session['wx:code:back']) {
  console.warn('wx:code:back')

  // !run
  getCode = e => new Promise(r => {})
  getOpenId = e => new Promise(r => {})
  getUnionId = e => new Promise(r => {})
  getUserInfo = e => new Promise(r => {})
  document.body.style.pointerEvents = 'none'

  // back
  addEventListener('pageshow', e => {
    session['wx:code'] = param('code')
    console.warn('pageshow code back', param('code'))

    history.back()
    history.go(-1) // !!!
  })
}

export { getAuthUrl, getCode, getOpenId, getUnionId, getUserInfo }
export default getAuthUrl

// console
window.getAuthUrl = getAuthUrl
