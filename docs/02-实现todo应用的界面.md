


## webpack配置 postcss 和 vue 的 jsx 语法


（1）babel相关：

先安装babel相应的loader：

```
npm i postcss-loader autoprefixer babel-loader babel-core
```

在根目录下，新建文件`.babelrc`，内容如下：

```
{
    "presets": [
        "env"
    ],
    "plugins": [
        "transform-vue-jsx"
    ]
}
```


同时安装相应的包：

```
npm i babel-preset-env babel-plugin-transform-vue-jsx
```

输入上方命令后，根据 warn 的提示，继续安装：

```
npm i babel-plugin-transform-vue-jsx babel-helper-vue-jsx-merge-props
```

（2）在根目录下，新建文件`postcss.config.js`。内容如下：

```javascript
const autoprefixer = require('autoprefixer');

module.exports= {
    plugins:[
        autoprefixer()
    ]
}
```


（3）在 webpack.config.js 中配置loader：


```
            //加载 jsx 文件
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
```


同时，在css预处理中加一段内容：

```
                    {//使用 'postcss-loader'所生成的 sourceMap，而不要使用 'stylus-loader' 所生成的 sourceMap
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true  
                        }
                    },
```




加了二者之后，效果如下：

```
           //css预处理：stylus
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',

                    // {//使用 'postcss-loader'所生成的 sourceMap，而不要使用 'stylus-loader' 所生成的 sourceMap
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         sourceMap: true
                    //     }
                    // },
                    'stylus-loader'
                ]
            },
```

20180503_1615.png

最后，输入`npm run dev`，编译项目，如果不报错，说明配置成功。

















