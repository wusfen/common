// <img src=error> => <img src=1x1.gif>
addEventListener(
  'error',
  function(e) {
    var img = e.target
    if (img && /img/i.test(img.tagName)) {
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    }
  },
  true
)
