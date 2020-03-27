const { smart } = require('webpack-merge')
const base = require('./webpack.base.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const BundleAnalyzerPlugin= require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

module.exports = smart(base, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCssPlugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('production')
    }),
    // new BundleAnalyzerPlugin(),
  ]
})
