const {smart} = require('webpack-merge')
const base  = require('./webpack.base.config')
// speed-measure-webpack-plugin在更改文件后会出错，需要重启
// const SpeedMeasurePlugin= require('speed-measure-webpack-plugin')
const webpack = require('webpack')

// const smp = new SpeedMeasurePlugin()

const config = smart(base, {
  mode: 'development',
  devServer: {
    port: '8888',
    hot:true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('development'),
      FLAG:'true',
    })
  ]
})

module.exports = config
// module.exports = smp.wrap(config)
