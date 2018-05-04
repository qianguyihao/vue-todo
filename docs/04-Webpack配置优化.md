
## Webpack优化：CSS 单独分离打包

（1）安装 pacakge：


```
npm i extract-text-webpack-plugin --save
```

这个包的作用是，将非 js的代码单独打包成静态资源文件。因为我们可能要单独把这个文件作为浏览器缓存。

在 webpack.config.js 中引用：

```

```


（2）针对 css 的打包，将开发环境和生产环境进行区分。


（3）另外，还要对 output 中的文件名进行 hash 转换。注意：

- 开发环境用`[hash:8]`。 注意，开发环境不能用 `[chunkhash:8]`，否则dev-server 会报错。

- 生产化境用`[chunkhash:8]`。

 
 最终， webpack.config.js 的完整代码如下：

```javascript
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
    )
}

module.exports = config
```


输入`npm run build`，编译之后，可以看到， css文件被单独编译成一个文件了，main.js文件也有hash码：

20180504_1625.png


注意，我们在 vue 文件中的css样式，并不会打包到上图中的 style.css 文件中。


## webpack区分打包类库代码及hash优化


我们建议将`业务代码`和`类库代码`单独拆分，分别进行打包。比如说，业务代码可能经常变动，但是后者就不一定了，我希望浏览器能长时间利用后者的缓存。


需要增加的配置：

(1)

```
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']   //比如 vendor: ['vue','vue-rooter']
    }
```


（2）

```
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'  //注意，name里的值是自己起的，但要和上面的值保持一致。
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
```


输入`npm run build`，编译之后，可以看到，会多出一个 render.js 文件。


### 本文的项目地址

本文的项目地址：<https://github.com/smyhvae/vue-todo>。可以在`chapter-04`分支上看到本文截止到目前为止的代码。














