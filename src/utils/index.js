var utils = {}
![
  'a',
  'fix',
  'Date',
  'error',
  'console',
  'url',
  'ajax',
  'copy',
  'storage',
  'validate',
  // 'img',
].forEach(item => {
  var m = require('./' + item)
  Object.assign(utils, m)
})

delete utils.default
module.exports = utils

// console
window.utils = utils
