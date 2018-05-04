const path = require('path')//通过path获取根路径，更保险
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')  //这个插件需要依赖 webpack 插件
const ExtractPlugin = require('extract-text-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development' //我们在package.json中设置的环境变量，全部是存放在process.env中的

const config = {
    target: 'web', //表示webpack的编译目标是 web 平台
    //entry：入口文件
    entry: path.join(__dirname, 'src/index.js'), // __dirname 指的是根路径。将根路径、相对路径进行拼接，形成绝对路径
    //output：编译输出
    output: {
        filename: 'bundle.[hash:8].js', //对文件名进行hash转换（开发环境）
        path: path.join(__dirname, 'dist') // 指定输出路径
    },
    module: {
        rules: [
            //加载 vue 文件
            {
                // test的意思是：检测文件类型
                test: /\.vue$/,  //通过`vue-loader`工具，让 webpack 支持 .vue 文件的编译
                loader: 'vue-loader'
            },
            //加载 jsx 文件
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            //加载 css 文件
            {
                test: /\.css$/,
                use: [
                    'style-loader',    //将css文件写到html代码里
                    'css-loader'       //css 的loader
                ]
            },

            //加载图片
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {  //通过 optons 参数配置上面这个 url-loader 
                            limit: 1024, //如果图片的小于1024，则将图片转成 base64的代码，直接写到代码里去，减少http请求
                            name: '[name]-smyh.[ext]'  //设置图片的文件名。smyh表示所有文件名中都带有这个字符，[ext]指的是文件格式
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            //下面这个插件很有用：在这里定义之后，我们就可以在项目的js代码中，直接调用 `process.evn.NODE_ENV` 来判断环境
            //比如说，开发环境中，会打印很多错误信息，但是这些内容并不需要放在生产环境中，这时就可以用到环境的判断
            'process.evn': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()

    ]

}

//针对开发环境的配置
if (isDev) {
    config.module.rules.push({
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
    })
    config.devtool = '#cheap-module-eval-source-map'  //webpack官方推荐的。提高效率和准确性
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',  //注意，ip地址是字符串
        overlay: { // 如果有任何的错误，就让它显示到网页上
            errors: true
        },
        //open:true,
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()   //减少出现 不必要的错误信息
    )
} else {
    //对生产环境进行配置
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']   //比如 vendor: ['vue','vue-rooter']
    }
    config.output.filename = '[name].[chunkhash:8].js' //对生产环境的文件名用 chunkhash

    config.module.rules.push({
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
    })
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),  //将输出的css文件进行hash转换
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'  //注意，name里的值是自己起的，但要和上面的值保持一致。
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
    )
}

module.exports = config

