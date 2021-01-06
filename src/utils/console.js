if (
  /[?&#]f12\b/.test(location.href) ||
  (/^https?:\/\/(1|wx)|[/][!]test/.test(location.href) &&
    /mobile|WindowsWechat/i.test(navigator.userAgent) &&
    !/wechatdevtools/i.test(navigator.userAgent))
) {
  var consoleSrc =
    'https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.10/dist/console.js'

  if (/10.1.4.222/.test(location)) {
    consoleSrc = 'http://10.1.4.222:3333/src/console.js'
  }

  document.write('<script f12 src=' + consoleSrc + '><' + '/script>')

  // async || module
  if (!document.querySelector('[f12]')) {
    var s = document.createElement('script')
    s.src = consoleSrc
    document.body.appendChild(s)
  }

  console.show = 1
}
