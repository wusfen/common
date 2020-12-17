/**
 * 1天前 2小时前 3分钟前 4秒前 刚刚
 * @param {Date} date
 */
function ago(date) {
  let S = new Date() - new Date(date)
  let s = Math.floor(S / 1000)
  let m = Math.floor(s / 60)
  let H = Math.floor(m / 60)
  let d = Math.floor(H / 24)

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
