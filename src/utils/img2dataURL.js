/**
 * 'http://domain.com/img.png' => await 'data:image/png;base64,'
 * @param {string} url img.src
 * @returns {promise} 'data:image/png;base64,'
 */
export default function img2dataURL(imgOrSrc) {
  var url = imgOrSrc.src || imgOrSrc
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (String(this.status).match(/^(2..|304)/)) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      } else {
        reject()
      }
    }
    xhr.onerror = function() {
      reject()
    }
    xhr.send()
  })
}
