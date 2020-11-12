var configMap = {
  production: {
    server: '//www.iandcode.com',
    oss: 'https://oss.iandcode.com',
    appid: 'wx50e8939e6c051abe',
    // appid: 'wx9f1f0ca5ecd9b3c4',
  },
  test: {
    server: '//wx.wit-learn.com',
    oss: 'https://oss.wit-learn.com',
    appid: 'wx2b9112520d6ba294',
  },
  development: {
    server: '//wx.wit-learn.com',
    oss: 'https://oss.wit-learn.com',
    appid: 'wx2b9112520d6ba294',
  },
}

var config = configMap.production
if (/^https?:..(1|wx)/.test(location.href)) {
  config = configMap.test
}
if (/^https?:..localhost/.test(location.href)) {
  config = configMap.development
}

var server = config.server
var oss = config.oss
export { config, server, oss }
export default config

// console
window.config = config
