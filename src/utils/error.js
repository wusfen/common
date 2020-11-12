function handler(e) {
  // - <img src="">
  if (e.target instanceof Image && !e.target.getAttribute('src')) {
    return
  }

  // _hmt
  if (!window._hmt) {
    window._hmt = []
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?fa813225546f511a4b09a61537cdd131'
    document.head.appendChild(hm)
  }

  // wait
  var timer = setInterval(() => {
    if (window._hmt && window._hmt.id) {
      clearInterval(timer)

      // send
      if (location.href.match('iandcode.com')) {
        window._hmt.push([
          '_trackEvent',
          `error`,
          (/iphone/i.test(navigator.userAgent) ? 'iphone: ' : '') +
            location.href,
          e.message,
        ])
      }
    }
  }, 500)
}

addEventListener('error', handler, true)
