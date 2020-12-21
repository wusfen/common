/**
 * 1天前 2小时前 3分钟前 4秒前 刚刚
 * @param {Date|number|string} date Date, timestamp, date string
 */
function ago(date) {
  var S = new Date() - new Date(date)
  var s = Math.floor(S / 1000)
  var m = Math.floor(s / 60)
  var H = Math.floor(m / 60)
  var d = Math.floor(H / 24)

  return d
    ? d + '天前'
    : H
    ? H + '小时前'
    : m
    ? m + '分钟前'
    : s
    ? s + '秒前'
    : '刚刚'
}

export { ago, ago as default }
