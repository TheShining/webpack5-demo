# 1.Webpack干什么的

[官网](https://webpack.js.org/)

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_base.png)



![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_dabao.png)

## 好啥子好处？

1. 减少部署体积。 代码压缩，资源压缩 ，去除无引用代码（tree-shaking）。
2. 处理游览器兼容性问题( es6->es5 less sass -> less)。
3. 提供更好的本地开发体验，本地服务（Dev-Server），热更新（HMR）。
4. 将复杂项目打包成简单模块，分包，懒加载。

# 2.引出5个核心概念

| 概念             | 职能              |
| ---------------- | ----------------- |
| Entry (入口)     | 文件入口          |
| Output(输出)     | 打包后文件配置    |
| Loader（翻译官） | 非js,json文件处理 |
| Plugins （插件） | 优化、资产管理    |
| Mode (模式)      | 内置优化模式      |



## Entry 

入口（Entry）指示Webpack以哪个文件为入口起点开始打包。



```js
// webpack.config.js webpack5
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```



## Output

输出（Output）指示Webpack打包后的资源（bundles）输出到的文件夹，以及命名方式。



```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
};
```



## Loader

Webpack 默认只支持 js json.

Loader 可以理解为翻译官，让Webpack 能够去处理非js,json文件。



```js
npm i style-loader css-loader -D // 安装loader

module.exports = {
    module: {
        // test 表示匹配哪些文件（正则）。  use 表示使用哪些loader
        rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }],
    },
};
```

### 一些常用loader

| 名称                     | 作用                   |
| ------------------------ | ---------------------- |
| css-loader               | css 文件处理           |
| less-loader ,sass-loader | less,sass 文件预处理   |
| postcss-loader           | 添加游览器css前缀      |
| babel-loader             | es6 转 es5             |
| cache-loader             | 缓存，提高重新构建速度 |
| vue-loader               | 对vue模板文件的解析    |



## Plugins

插件（Plugins）执行更广泛的任务，如包优化、资产管理和环境变量注入；原理是可以对webpack各个生命周期的产物进行处理。

```js
npm i html-webpack-plugin -D //安装插件

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }],
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

### 常用Plugins

| 名称                    | 作用                           |
| ----------------------- | ------------------------------ |
| html-webpack-plugin     | 将打包后的文件引入指定html文件 |
| purgecss-webpack-plugin | 清除无用css                    |
| clean-webpack-plugin    | 自动清空打包目录               |
| mini-css-extract-plugin | 分离样式文件，使用link方式引入 |
| webpack-bundle-analyzer | 构建结果可视化分析             |



## Mode

模式（Mode）指示webpack 使用相应的内置优化。

```js
module.exports = {
  mode: 'development',
};
```

实际将 process.env.NODE_ENV 改为对应的选项。

| 选项        | 打包后表现                                                   | 特点                                                  |
| ----------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| development | ![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_dev.png) | 开发模式，打包更加快速，省了代码优化步骤              |
| production  | ![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_production.png) | 生产模式，打包比较慢，会开启 tree-shaking 和 压缩代码 |
| none        | ![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_none.png) |                                                       |



![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_adm.png)



# 3.实践--打包less文件

源码：https://github.com/TheShining/webpack5-demo

## 初始包文件

```shell
npm init -y
```

## 安装webpack

```shell
npm i webpack webpack-cli -D
```

## 自建项目结构

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_path.png)

## 初始配置

配置入口 main.js 文件

配置输出文件目录为 dist

```js
// webpack.config.js 文件（webpack4以后支持）

module.exports = {
    mode: 'production', // 模式
    entry: './src/main.js', // 打包入口地址
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.join(__dirname, 'dist'), // 输出文件目录
    },
};
```

配置 **package.json**

```json
// package.json
{
    "scripts": {
        "build": "webpack ./main.js"
    },
}
```

配置 **index.html**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>webpack_demo</title>
    </head>
    <body>
        <div class="title">webpack less 预处理</div>
    </body>
</html>
```

配置 **main.less**

```less
html,body {
	background-color: aquamarine;
	line-height: 100vh;
    text-align: center;
	.title {
		font-size: 200px;
		color: lightcoral;
	}
}
```

配置 main.js  引入less文件

```
import './main.less';
```

## 安装处理less loader

上面配置完成之后 直接执行 

```shell
npm run build
```

然后报错

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_less_error.png)

按照之前的理论，需要按照对less文件对应loader来处理。

```shell
npm i less style-loader css-loader less-loader -D
```

在 [webpack.config.js]() 文件中配置loader

```js
// webpack.config.js
module.exports = {
    mode: 'production', // 模式
    entry: './src/main.js', // 打包入口地址
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.join(__dirname, 'dist'), // 输出文件目录
    },
    module: {
        rules: [
            // 转换规则
            {
                test: /\.less$/, //匹配所有的 less 文件
                use: 'css-loader', // use: 对应的 Loader 名称
                use: ['style-loader', 'css-loader', 'less-loader'], // use: 对应的 Loader 名称
            },
        ],
    },
};
```

## 将打包后的文件引入 index.html

引入html文件 需要安装前面提到的 **html-webpack-plugin** 插件

```SH
npm i html-webpack-plugin -D
```

配置 **html-webpack-plugin**

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
   // ...
	plugins:[ // 配置插件
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
```

## 安装本地服务

安装 **webpack-dev-server**

```sh
npm i webpack-dev-server -D
```

配置 **devServer**

```js
// webpack.config.js

module.exports = {
	// ...
    devServer: {
        static: path.resolve(__dirname, 'dist'), // 静态文件目录
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        open: true, // 是否自动打开浏览器
    },
};
```

配置 **package.json**

```json
{
    "scripts": {
        "dev": "webpack serve  ./main.js", //开启本地服务
        "build": "webpack ./main.js"	//构建
    },
}
```

## 运行

```shell
npm run dev
```

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_less_end.png)

# 4.优化 TODO

# 5.原理

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/webpack_theory.png)

## 流程概括

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

[掘金](https://juejin.cn/post/6859538537830858759)

知道原理后，如何写插件。

# 6.vite

[官网](https://www.vitejs.net/)

![](https://raw.githubusercontent.com/TheShining/webpack5-demo/master/img/vite.png)

Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

- **依赖** 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。

  Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](https://www.vitejs.net/guide/dep-pre-bundling.html)。Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

- **源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。

  Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

# 7.参考

webpack 官网 ：https://webpack.js.org/concepts/

掘金：[【万字】透过分析 webpack 面试题，构建 webpack5.x 知识体系](https://juejin.cn/post/7023242274876162084#heading-9)

掘金：[2020年了,再不会webpack敲得代码就不香了(近万字实战)](https://juejin.cn/post/6859538537830858759)

