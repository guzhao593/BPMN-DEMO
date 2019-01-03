const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  devServer: {
    open: true,
    hot: true,
    hotOnly: true
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('utils', resolve('src/utils'))
      .set('views', resolve('src/views'))
      .set('assets', resolve('src/assets'))
  }
}
