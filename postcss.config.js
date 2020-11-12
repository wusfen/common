module.exports = {
  plugins: {
    'autoprefixer': {},
    // https://github.com/cuth/postcss-pxtorem#readme
    'postcss-pxtorem': {
      rootValue: 100,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [/^(html|body)$/],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2,
      exclude: /node_modules/i,
    },
  },
}
