const path = require('path')//通过path获取绝对路径，更保险

module.exports = {
    //entry：入口文件
    entry: path.join(__dirname, 'src/index.js'), // __dirname 指的是根路径。将根路径、相对路径进行拼接，形成绝对路径
    //output：编译输出
    output: {
        filename: 'bundle.js',
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
            //加载 css 文件
            {
                test: /\.css$/,
                use: [
                    'style-loader',    //将css文件写到html代码里
                    'css-loader'       //css 的loader
                ]
            },
            //css预处理：stylus
            {
                test:/\.styl/,
                use:[
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
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
    }

}

