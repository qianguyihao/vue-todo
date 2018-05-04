const baseConfig = require('./webpack.config.base')  //引入 webpack.config.base.js
const merge = require('webpack-merge')     //帮助我们合并多个webpack文件的配置

const path = require('path')//通过path获取根路径，更保险
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')  //这个插件需要依赖 webpack 插件
const ExtractPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' //我们在package.json中设置的环境变量，全部是存放在process.env中的

const defaultPlugins = [
    new webpack.DefinePlugin({
        //下面这个插件很有用：在这里定义之后，我们就可以在项目的js代码中，直接调用 `process.evn.NODE_ENV` 来判断环境
        //比如说，开发环境中，会打印很多错误信息，但是这些内容并不需要放在生产环境中，这时就可以用到环境的判断
        'process.evn': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),
    new HTMLPlugin()

]


const devServer = {
    port: 8000,
    host: '0.0.0.0',  //注意，ip地址是字符串
    overlay: { // 如果有任何的错误，就让它显示到网页上
        errors: true
    },
    //open:true,
    hot: true
}


let config

//针对开发环境的配置
if (isDev) {
    config = merge(baseConfig, {
        devtool: '#cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    // stylus 预处理（这个只在开发环境中使用）
                    test: /\.styl/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {//使用 'postcss-loader'所生成的 sourceMap，而不要使用 'stylus-loader' 所生成的 sourceMap
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                }


            ]
        },
        devServer,
        plugins: defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()   //减少出现 不必要的错误信息
        ])
    })
} else {
    //对生产环境进行配置
    config = merge(baseConfig, {
        entry: {
            app: path.join(__dirname, '../src/index.js'), //第二个参数是相对路径
            vendor: ['vue']   //比如 vendor: ['vue','vue-rooter']
        },
        output: {
            filename: '[name].[chunkhash:8].js' //对生产环境的文件名用 chunkhash
        },
        module: {
            //注意，rules是数组
            rules: [
                {
                    // stylus 预处理（这个只在生产环境中使用）
                    test: /\.styl/,
                    use: ExtractPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            {//使用 'postcss-loader'所生成的 sourceMap，而不要使用 'stylus-loader' 所生成的 sourceMap
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            'stylus-loader'
                        ]
                    })
                }
            ]
        },
        //注意，plugins是数组
        plugins: defaultPlugins.concat([
            new ExtractPlugin('styles.[contentHash:8].css'),  //将输出的css文件进行hash转换
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'  //注意，name里的值是自己起的，但要和上面的值保持一致。
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime'
            })
        ])
    })
}

module.exports = config