if (
  /[?&#]f12\b/.test(location.href) ||
  (/^https?:\/\/(1|wx)/.test(location.href) &&
    /mobile|WindowsWechat/i.test(navigator.userAgent) &&
    !/wechatdevtools/i.test(navigator.userAgent))
) {
  console.show = 1

  if (!document.currentScript.async) {
    document.write(
      '<script f12 src=https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.10/dist/console.js></script>'
    )
  } else {
    var s = document.createElement('script')
    s.src =
      'https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.10/dist/console.js'
    document.body.appendChild(s)
  }
}
