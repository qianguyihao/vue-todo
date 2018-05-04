

## VS Code 相关


### VS Code中的推荐插件

- editorConfig for VS Code

- ESlint

- gitignore

- language-stylus

- Nunjucks

- One Dark Pro

- PostCSS syntax

- Vetur

- View in Browser

- vscode-icons

### 设置

![](http://img.smyhvae.com/20180502_2240.png)


## webpack配置Vue项目


### 项目初始化

```bash
# 初始化项目
npm init

# 安装环境
npm i webpack@^3.10.0 vue vue-loader@13.6.0 --save //这里暂不区分 devDepandency 和 Depandency。

# 安装指定版本的webpack
npm i 

# 根据错误提示，安装下面这两个包
npm i css-loader vue-template-compiler --save
```

初始化完成后，自动生成的 package.json文件的内容如下：

```json
{
  "name": "vue-todo",
  "version": "1.0.0",
  "description": "Vue+Webpack打造todo应用",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/smyhvae/vue-todo.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/smyhvae/vue-todo/issues"
  },
  "homepage": "https://github.com/smyhvae/vue-todo#readme",
  "dependencies": {
    "css-loader": "^0.28.11",
    "vue": "^2.5.16",
    "vue-loader": "^15.0.6",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^3.11.0"
  }
}

```



###  webpack配置：加载.vue文件

新建文件`src/app.vue`，我们可以在这里面写代码。格式如下：

```html
<template>
  
</template> 

<script>
export default {};
</script>

<style>

</style>
```

上方代码中，我们在`<template>`标签中写html标签。而`<script>`和`<style>`标签里的内容只针对这个vue文件有效。


我们来举个例子。

（1）新建文件`src/app.vue`：

```html
<template>
  <div class="div1">{{myText}}</div>
</template> 

<script>
export default {
  data() {
    return {
      myText: 'smyhvae'
    };
  }
};
</script>

<style>
.div1 {
  color: red;
}
</style>

```


上面这个`app.vue`组件，是无法在浏览器中直接运行的，而是要通过`index.js`来使用它。这就需要通过 webpack 来配置，我们继续来看步骤。


（2）新建文件`src/.index.js`：

```javascript
import Vue from 'vue'
import App from './app.vue'

const root = document.createElement('div');
document.body.appendChild(root)

new Vue({
    render: (h) => h(App)
}).$mount(root); //挂在到 root 节点
```

我们在这里引入 vue 组件。


（3）新建文件`webpack.config.js`：（配置入口文件和输出路径，并配置 vue的loader）


```javascript
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
            {
                // test的作用是：检测文件类型
                test: /\.vue$/,  //通过`vue-loader`工具，让 webpack 支持 .vue 文件的编译
                loader: 'vue-loader'
            }
        ]
    }

}  
 
```


vue-loader：原生的webpack只支持js文件类型，而且只支持es5的语法。如果想编译其他文件类型（比如.vue格式的文件），则需要借助各种loader。


(4)在package.json中加一行：

```json
    "build": "webpack --config webpack.config.js"
```

![](http://img.smyhvae.com/20180503_1100.png)


这一行的作用是：在命令行中输入 webpack时，调用当前项目里的 webpack；否则的话，调用的是全局的 webpack，容易出现版本不同的问题。 


（5）编译输出：

```
npm run build
```


如果报错，可能是 css-loader的版本不对。参考链接：[#](https://www.imooc.com/qadetail/258131)

成功后的效果如下：

![](http://img.smyhvae.com/20180503_1140.png)


###  webpack配置：加载静态资源（css文件和img）

（1）在 webpack.config.js 中配置loader：

为了加载 css文件、图片，我们同样需要在 webpack.config.js 中配置loader：

```javascript
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
```

根据上面的代码，我们安装相应的loader，如下：

```
npm i style-loader url-loader file-loader --save
```

备注：url-loader 是基于 file-loader的，所以要把后者一起安装。


（2）放入静态资源：

为了验证图片的编译，我们在`src/assets/images`目录下放一张图片`bg.jpeg`。

为了验证 css 文件的编译，我们在`src/assets/style`目录下新建一个文件`test.css`，代码如下：


```css
body {
  color: red;
  background-image: url('../images/done.svg')
}
```



（3）在 index.js 中引入静态资源：

```javascript
import './assets/styles/test.css'
import './assets/images/bg.jpeg'
```



（4）编译打包：

```
npm run build
```

效果如下：

![](http://img.smyhvae.com/20180503_1425.png)

编译之后，我们发现，dist 目录下生成了重命名后的图片，而且`test.css`里的代码会被编译进`bundle.js`中去：

![](http://img.smyhvae.com/20180503_1430.png)


###  webpack配置：CSS预处理

（1）在 webpack.config.js 中配置loader：


根据上面的代码，我们安装相应的loader，如下：

```
npm i stylus-loader stylus --save
```



（2）在`src/assets/style`目录下新建一个文件`test-stylus.styl`，代码如下：

```
body
  font-size 20px
```



（3）在 index.js 中引入 stylus 文件：

```javascript
import './assets/styles/test-stylus.styl'

```



（4）编译打包：

```
npm run build
```



编译之后，我们发现，`test-stylus.styl`里的代码会被编译进`bundle.js`中去：

![](http://img.smyhvae.com/20180503_1455.png)

### 截止到目前为止的最终代码

index.js：

```javascript
import Vue from 'vue'
import App from './app.vue'

import './assets/styles/test.css'
import './assets/images/bg.jpeg'
import './assets/styles/test-stylus.styl'


const root = document.createElement('div');

new Vue({
    render: (h) => h(app)
}).$mount(root); //挂在到 root 节点
```


webpack.config.js：

```javascript
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


```


package.json：

```json
{
  "name": "vue-todo",
  "version": "1.0.0",
  "description": "Vue+Webpack打造todo应用",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.config.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/smyhvae/vue-todo.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/smyhvae/vue-todo/issues"
  },
  "homepage": "https://github.com/smyhvae/vue-todo#readme",
  "dependencies": {
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "style-loader": "^0.21.0",
    "stylus": "^0.54.5",
    "stylus-loader": "^3.0.2",
    "url-loader": "^1.0.1",
    "vue": "^2.5.16",
    "vue-loader": "^13.6.0",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^3.11.0"
  }
}

```


## webpack-dev-server

我们在上面的进度之上，继续学习。

打开package.json，如下：

![](http://img.smyhvae.com/20180503_1616.png)

上图所示，我们是通过 webpack 来启动 webpack.config.js 。

当然，我们还可以利用 webpack-dev-server 来启动，它是专门针对开发环境的。步骤如下。


### 1、安装

输入如下命令进行安装：

```
npm i webpack-dev-server --save
```



### 2、package.json中配置环境变量

在 package.json 中配置开发环境和生产环境的「环境变量」：

安装`cross-env`：

```
npm i cross-env --save
```


PS：`cross-env`可以解决跨平台环境变量的问题。保证在不同的平台都可以正常执行`webpack.config.js`脚本。 


然后配置：

```json
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
```


这里我们定义了两个关键字：`development`、`production`，分别代表不同的环境。


### 3、webpack.config.js中的设置

上面设置了环境变量后，我们接下来，在 webpack.config.js 中进行环境的判断：

```javascript
const isDev = process.env.NODE_ENV === 'development' //我们在package.json中设置的环境变量，全部是存放在process.env中的


//针对开发环境的配置
if (isDev) {
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',  //注意，ip地址是字符串
        overlay: { // 如果有任何的错误，就让它显示到网页上
            errors: true
        }
    }
}
```


### 4、创建html页面

上面的内容配置完毕后，我们需要将js文件放在html上，才能把项目跑起来。

这里，我们可以使用`html-webpack-plugin`插件。

首先进行安装：

```
npm install html-webpack-plugin --save
```

然后在 webpack.config.js中设置：



```javascript
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')  //这个插件需要依赖 webpack 插件


    plugins:[
        new webpack.DefinePlugin({ 
            //下面这个插件很有用：在这里定义之后，我们就可以在项目的js代码中，直接调用 `process.evn.NODE_ENV` 来判断环境
            //比如说，开发环境中，会打印很多错误信息，但是这些内容并不需要放在生产环境中，这时就可以用到环境的判断
            'process.evn':{
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()

    ]
```


最后配置开发环境的ip、端口号等：

```javascript
//针对开发环境的配置
if (isDev) {
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',  //注意，ip地址是字符串
        overlay: { // 如果有任何的错误，就让它显示到网页上
            errors: true
        }
    }
}
```


之后，输入`npm run dev`，把开发环境跑起来。效果如下：

![](http://img.smyhvae.com/20180503_1810.png)

然后，我们就可以在浏览器中打开了：

![](http://img.smyhvae.com/20180503_1812.png)

大功告成。

当然，我们还可以对 webpack-server 进行一些额外的配置。下面举几个例子。

1、比如：

```
  open:true    
```

上面这个配置的意思是：项目跑起来后，自动打开浏览器。这个看个人情况，如果你经常修改 webpack的配置，那就不用开启这个功能。

2、再比如：（设置路由的跳转相关）

```
historyFallback:{

}
```

3、页面是否重新渲染：

```
hot: true
```

上面这个配置其实指的是`hotmodulereplacement`。作用是：每次改代码后，只是重新渲染当前组件的效果，而不是导致整个页面的刷新。

就拿我们当前这个例子来说：

- 如果没有这行配置，当我修改 myText 变量的值时，页面会自动刷新一下，然后更新网页上的myText数据。

- 如果加了这一行配置，当我修改 myText 变量的值时，页面并不会自动刷新，就会自动更新网页上的数据。

这个 `hot: true`要结合另外两个插件来使用。具体设置如下：


![](http://img.smyhvae.com/20180503_1920.png)


上方截图的文本内容为：

```javascript
//针对开发环境的配置
if (isDev) {
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
}
```


### 完整代码

这一段中，完整的 package.json为：

```json
{
  "name": "vue-todo",
  "version": "1.0.0",
  "description": "Vue+Webpack打造todo应用",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/smyhvae/vue-todo.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/smyhvae/vue-todo/issues"
  },
  "homepage": "https://github.com/smyhvae/vue-todo#readme",
  "dependencies": {
    "cross-env": "^5.1.4",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "style-loader": "^0.21.0",
    "stylus": "^0.54.5",
    "stylus-loader": "^3.0.2",
    "url-loader": "^1.0.1",
    "vue": "^2.5.16",
    "vue-loader": "^13.6.0",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^3.11.0",
    "webpack-dev-server": "^2.9.7"
  }
}


```



这一段中，完整的 webpack.config.js 为：

```javascript
const path = require('path')//通过path获取根路径，更保险
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')  //这个插件需要依赖 webpack 插件

const isDev = process.env.NODE_ENV === 'development' //我们在package.json中设置的环境变量，全部是存放在process.env中的

const config = {
    target: 'web', //表示webpack的编译目标是 web 平台
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
                test: /\.styl/,
                use: [
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
    },
    plugins:[
        new webpack.DefinePlugin({ 
            //下面这个插件很有用：在这里定义之后，我们就可以在项目的js代码中，直接调用 `process.evn.NODE_ENV` 来判断环境
            //比如说，开发环境中，会打印很多错误信息，但是这些内容并不需要放在生产环境中，这时就可以用到环境的判断
            'process.evn':{
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()

    ]

}

//针对开发环境的配置
if (isDev) {
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
}

module.exports = config


```


### 本文的项目地址

本文的项目地址：<https://github.com/smyhvae/vue-todo>。可以在`chapter-01`分支上看到本文截止到目前为止的代码。





## vue-todo项目的相关链接

- 项目地址：<https://github.com/smyhvae/vue-todo>

- 项目演示地址（有服务器端渲染）：<http://ssr.todo.jokcy.me>

- 项目演示地址（无服务器端渲染）：<http://todo.jokcy.me>






















