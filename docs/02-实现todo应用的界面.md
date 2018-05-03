


## webpack配置 postcss 和 vue 的 jsx 语法


（1）babel相关：

先安装babel相应的loader：

```
npm i postcss-loader autoprefixer babel-loader babel-core --save
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
npm i babel-preset-env babel-plugin-transform-vue-jsx --save
```

输入上方命令后，根据 warn 的提示，继续安装：

```
npm i babel-helper-vue-jsx-merge-props babel-plugin-syntax-jsx --save
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


```javascript
            //加载 jsx 文件
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
```


同时，在css预处理中加一段内容：

```javascript
                    {//使用 'postcss-loader'所生成的 sourceMap，而不要使用 'stylus-loader' 所生成的 sourceMap
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true  
                        }
                    },
```


20180503_1615.png

最后，输入`npm run dev`，编译项目，如果不报错，说明配置成功。效果如下：

20180503_2020.png




## 页面

tabs.vue：

用来定义 all、active、completed这些按钮。



### 父组件 app.vue 调用子组件 header.vue的步骤【重要】

（1）在header.vue中自定义标签。

（2）在app.vue中通过 import 的形式导入 Header.vue。

（3）在app.vue中通过 components 关键字声明子组件 Header

（4）在 app.vue 的标签中使用 子组件的标签。

















