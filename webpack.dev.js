const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

const defaultDevelopmentConf = {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  }
}

const developmentConf = merge([common, defaultDevelopmentConf])
module.exports = developmentConf
