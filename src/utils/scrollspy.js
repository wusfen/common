/**
 * @example
 * <a href="#id1" class="active">to:id1</a>
 * <a href="#id2">to:id2</a>
 *
 * <el id="id1">
 *   ...
 * </el>
 * <el id="id2">
 *   if scrollIntoView: $('[href="#id2"]').addClass('active')
 * </el>
 *
 * html{
 *   scroll-padding-top: 100px;
 * }
 * @todo
 * ios: scrollIntoView smooth
 * el{ overflow: auto }
 */

addEventListener('click', function(e) {
  // <a>
  var a = (function up(a) {
    if (!a || !a.getAttribute) return
    var href = a.getAttribute('href')
    return /^#/.test(href) ? a : up(a.parentNode)
  })(e.target)

  // scrollIntoView
  if (a) {
    e.preventDefault()

    var id = a.getAttribute('href')
    var idEl = document.querySelector(id)
    if (idEl) {
      idEl.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
})

addEventListener('scroll', function fun(e) {
  if (new Date() - fun.lastDate < 100) return
  fun.lastDate = new Date()

  // [id]s top: active
  var idEls = document.querySelectorAll('[id]')
  idEls.forEach(idEl => {
    var a = document.querySelector(`[href="#${idEl.id}"]`)
    if (a) {
      var rect = idEl.getBoundingClientRect()
      if (rect.top <= 150) {
        a.parentNode
          .querySelectorAll('a')
          .forEach(a => a.classList.remove('active'))
        a.classList.add('active')
      }
    }
  })
})
