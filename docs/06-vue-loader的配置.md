
## 前言

我们打开上一篇文章中的 webpack.connfig.base.js，发现里面和 vue 有关的 loader 如下：

```javascript
            //加载 vue 文件
            {
                // test的意思是：检测文件类型
                test: /\.vue$/,  //通过`vue-loader`工具，让 webpack 支持 .vue 文件的编译
                loader: 'vue-loader'
            }
```


上面这个loader 的配置很简单。但其实， vue-loader 的配置也可以更丰富。我们接下来讲一下。


## vue-loader的配置

### 专门给 vue-loader 新建一个配置文件

（1）新建文件`build/vue-loader.config.js`，内容如下：（在这个文件里给 vue 加一些配置）

```javascript
module.exports = (isDev) =>{
    return {
        preserveWhitepace: true,     //vue模板里，清除多余的空格（因为多余的空格会渲染到页面上，不太好）
        //extractCSS:true      //将vue里的css单独打包成一个文件（这项设置，看个人需要）
    }
}
```

（2）在`webpack.config.base.js`中引入上面的文件：

```javascript
const createVueLoaderOptions = require('./vue-loader.config')  //引入vue-loader.config.js 文件
```

然后加一行代码，就可以调用了：

![](http://img.smyhvae.com/20180505_2215.png)


### 根据需要，给vue-loader增加一些配置



另外，一些其他的属性，这里大概提示一下：

1、`vue-style-loader`：可以帮助我们对vue的样式进行热更新。

比如说，在默认情况下，当我们修改vue文件里的样式时，要手动刷新网页，才能更新页面上的样式；可如果想自动刷新，该怎么做呢？这里就可以利用`vue-style-loader`插件。举个例子，比如说，在我们这个 vue-todo 项目里，vue文件里的样式是采用 stylus 编写的：

![](http://img.smyhvae.com/20180505_0050.png)

如上图所示，我们把红框部分改为`vue-style-loader`，就可以达到目的了。



2、`hotReload`：热重载。暂略。


3、另外，我们还可以给整个 webpack 安装`rimraf`这个包。如下：

```
npm i rimraf -D
```

这个包的作用是：每次在打包生成新的 dist 目录之前，会删除之前的 dist目录。安装完成后，需要在 package.json中进行使用：

```json
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.config.client.js",
    "clean":"rimraf dist",
    "build":"npm run clean && npm run build:client"

```

上方代码的截图如下：

![](http://img.smyhvae.com/20180505_0030.png)

此时，当我们输入`npm run build`，就达到目的了。













