const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: 'cheap-module-eval-source-map', // 定位代码位置
  // entry: ['./src/index.js'],
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash].js',
    publicPath: '/' //通常是CDN地址
  },
  resolve: {
    // 寻找第三方模块
    modules: ['./src/components', 'node_modules'], //从左到右依次查找
    // 文件查找类型. 在导入语句没带文件后缀时，会自动带上extensions 中配置的后缀
    extensions: ['.jsx', '.css', '.js'],
    alias: {
      '@': '/src'
    }
  },
  module: {
    noParse: /jquery|lodash/, // 不进行转化和解析
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  'core.js': 3
                }
              ]
            ]
          }
        },
        include: [path.resolve(__dirname, 'src')], // 使用include来转译尽可能少的文件
        exclude: /node_modules/
      },
      // loader 的执行顺序是从右向左执行, 注意顺序
      {
        test: /\.(le|c)ss$/,
        use: [
          'cache-loader',
          {
            loader: MiniCssExtractPlugin.loader, //替换之前的 style-loader
            options: {
              // CSS热更新
              hmr: isDev,
              reloadAll: true
            }
          },
          // MiniCssExtractPlugin.loader,
          'css-loader',

          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('autoprefixer')() //autoprefixed 不用放参数， 从.browserslistrc 读取
                ]
              }
            }
          },
          'less-loader'
        ],
        exclude: /node_module/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10K
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets' // npm run build时图片产生路径
            }
          }
        ],
        exclude: /node_module/
      }
    ]
  },
  devServer: {
    hot: true, //热更新
    port: '8888',
    quiet: false,
    inline: true,
    stats: 'errors-only',
    overlay: false,
    clientLogLevel: 'silent',
    compress: true
  },
  plugins: [
    // 多文件打包，要配置多个HtmlWebpackPlugin。
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', // 打包后的文件名
      chunks: ['index'], // 将数组中指定的js引入到html文件中(entry中)
      config: config.template,
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', // 打包后的文件名, 不可省略
      chunks: ['login']
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    }),
    new CopyWebpackPlugin(
      [
        {
          from: 'public/js/*.js',
          to: path.resolve(__dirname, 'dist', 'js'),
          flatten: true // 只拷贝from目录下的文件， 不会吧from的整个路径都拷贝过来
        }
      ],
      {
        ignore: ['other.js']
      }
    ),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    // new OptimizeCssPlugin(), // webpack.prod.config.js里配置
    // new webpack.HotModuleReplacementPlugin(), //热更新插件 // webpack.dev.config.js里配置 ** 不可以配置多处 **
    new webpack.ProvidePlugin({
      // 全局变量
      React: 'react',
      Component: ['react', 'Component'],
      Vue: ['vue/dist/vue.esm.js', 'default'],
      $: 'jquery',
      _map: ['lodash', 'map']
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // webpack 的内置插件，作用是忽略第三方包指定目录。
  ],
  externals: { // 将一些JS文件存储在 CDN 上, webpack不打包，可以通过import引入
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    jquery: 'jQuery'
  }
}
