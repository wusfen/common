/**
 * 不同域名的链接用新标签打开
 */
addEventListener('click', function(e) {
  var a = (function findA(el) {
    if (!el || !el.tagName) return

    if (/^a$/i.test(el.tagName)) return el
    return findA(el.parentNode)
  })(e.target)

  // a origin
  // - href="javascript:", !href
  if (a && /^http/.test(a.href)) {
    if (a.origin !== location.origin) {
      e.preventDefault()
      window.open(a.href)
    }
  }
})
