

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




### 父组件 app.vue 调用子组件 header.vue的步骤【重要】

（1）在header.vue中自定义标签。

（2）在app.vue中通过 import 的形式导入 Header.vue。

（3）在app.vue中通过 components 关键字声明子组件 Header

（4）在 app.vue 的标签中使用 子组件的标签。


### content.vue 文件

`content.vue`代表的是中间区域的组件。



（1）首先在文件中加入`<input>`输入框标签，为其增加`@keyup.enter="addTodo"`键盘输入事件。

（2）通过引入子组件的方式，引入 `<item>`。




### tabs栏

tabs.vue：用来定义 all、active、completed这些按钮。


all、active、completed这三个内容，我们只用一个span即可，通过 v-for的形式将数组展现出来。

注意，如果是通过 v-for 循环出来的节点，我们一定要加上 `:key`这个属性。这样的话，下次循环的时候，如果key相同，就会复用；而不是重新生成新的节点，去替换旧的节点。
























