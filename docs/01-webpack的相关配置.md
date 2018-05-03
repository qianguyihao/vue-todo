

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

 20180502_2240.png



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


（2）新建文件`src/.index.js`

```javascript
import Vue from 'vue'
import App from './app.vue'

const root = document.createElement('div');

new Vue({
    render: (h) => h(app)
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


vue-loader：原生的webpack只支持js文件类型，而且只支持es5的语法。如果想编译其他文件类型（比如.vue格式的文件），则需要借助一些loader。


(4)在package.json中加一行：

```json
    "build": "webpack --config webpack.config.js"
```

20180503_1100.png


这一行的作用是：在命令行中输入 webpack时，调用当前项目里的 webpack；否则的话，调用的是全局的 webpack，容易出现版本不同的问题。 


（5）编译输出：

```
npm run build
```


如果报错，可能是 css-loader的版本不对。参考链接：<https://www.imooc.com/qadetail/258131>

成功后的效果如下：

20180503_1140.png


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

20180503_1425.png

编译之后，我们发现，dist 目录下生成了重命名后的图片，而且`test.css`里的代码会被编译进`bundle.js`中去：

20180503_1430.png


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

20180503_1455.png




## vue-todo项目的相关链接

- 项目官方演示地址：<http://ssr.todo.jokcy.me/app>

- GitHub官方源码地址：<https://github.com/smyhvae/vue-todo-tech>

- 网友作品：<https://github.com/liangxiaojuan/vue-todos>

- 各种框架实现的todo项目：<http://todomvc.com/>。




















