var _Date = global.Date

/**
 * @example
 * new Date()
 *  .add('FullYear', +1)
 *  .add('Month', -1)
 *  .format('yyyy-MM-dd')
 */
class Date extends global.Date {
  constructor(...args) {
    var arg0 = args[0]
    if (typeof arg0 === 'string') {
      args[0] = arg0
        .replace(/-/g, '/') // fix ios: 'yyyy-MM-dd' => 'yyyy/MM/dd'
        .replace(/^\d{4}\/\d{1,2}$/, '$&/01') // fix ios: 'yyyy/MM' => 'yyyy/MM/01'
        .replace(
          /[.]\d{3,}$/,
          +new _Date('2020/01/01 10:10:10.1234') ? '$&' : ''
        ) // fix: 'yyyy/MM/dd HH:mm:ss.SSSS' => 'yyyy/MM/dd HH:mm:ss'
    }
    super(...args)
  }

  /**
   * 日期格式化
   * @param {string} pattern y:年, M:月, d:日, E:星期 H:时, m:分, s:秒, S:毫秒
   */
  format(pattern = 'yyyy-MM-dd HH:mm:ss') {
    var date = this

    // pattern: value
    var map = {
      y: date.getFullYear(),
      M: date.getMonth() + 1,
      d: date.getDate(),
      H: date.getHours(),
      h: (function() {
        var h = date.getHours()
        return h > 12 ? h - 12 : h
      })(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      S: date.getMilliseconds(),
    }

    // pattern => value
    for (var key in map) {
      pattern = pattern.replace(RegExp(key + '+', 'g'), function($and) {
        var value = String(map[key])
        // pad 0
        var length0 = Math.max($and.length - value.length, 0)
        return Array(length0 + 1).join(0) + value
      })
    }

    // E
    return pattern.replace(/E+/g, function($and) {
      return /中国/.test(date)
        ? ($and == 'E' ? '周' : '星期') +
            '日一二三四五六'.split('')[date.getDay()]
        : 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')[date.getDay()]
    })
  }

  /**
   * 链式加减日期
   * @param {string} name FullYear Month Date Hours Minutes Seconds Milliseconds
   * short: y M d H h m s S
   * @param {number} n +1, -1
   */
  add(name, n) {
    name =
      {
        y: 'FullYear',
        M: 'Month',
        d: 'Date',
        H: 'Hours',
        h: 'Hours',
        m: 'Minutes',
        s: 'Seconds',
        S: 'Milliseconds',
      }[name] || name

    this['set' + name](this['get' + name]() + n)

    return this
  }
}

export default Date

global.Date = Date
