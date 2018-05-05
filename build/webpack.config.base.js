/**
 * 存放公共的 webpack 配置。
 * 包含 开发环境、生产环境、服务器端渲染等环境等。
 */

const path = require('path')//通过path获取根路径，更保险
const createVueLoaderOptions = require('./vue-loader.config')  //引入vue-loader.config.js 文件

const isDev = process.env.NODE_ENV === 'development' //我们在package.json中设置的环境变量，全部是存放在process.env中的
const config = {
    target: 'web', //表示webpack的编译目标是 web 平台
    //entry：入口文件
    entry: path.join(__dirname, '../src/index.js'), // __dirname 指的是根路径。将根路径、相对路径进行拼接，形成绝对路径。第二个参数是当前文件的相对路径
    //output：编译输出
    output: {
        filename: 'bundle.[hash:8].js', //对文件名进行hash转换（开发环境）
        path: path.join(__dirname, '../dist') // 指定输出路径
    },
    module: {
        rules: [
            //加载 vue 文件
            {
                // test的意思是：检测文件类型
                test: /\.vue$/,  //通过`vue-loader`工具，让 webpack 支持 .vue 文件的编译
                loader: 'vue-loader',
                options:createVueLoaderOptions(isDev)
            },
            //加载 jsx 文件
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            //加载 js 文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/    //忽略掉 node_modules 目录
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
                            //name: '[name]-hash.[ext]'  //设置图片的文件名。smyh表示所有文件名中都带有这个字符，[ext]指的是文件格式
                            name:'resources/[path][name].[hash:8].[ext]' //设置图片资源的文件路径
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = config