<!--
 * @Author: tangdaoyong
 * @Date: 2021-04-26 10:40:47
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-26 11:10:30
 * @Description:`webpack`plugin
-->
# webpack插件

## 介绍

`webpack`插件开发两个比较重要的东西`compiler` 和 `compilation`

1. `compiler`对象代表了完整的 `webpack`环境配置。这个对象在启动 `webpack`时被一次性建立，并配置好所有可操作的设置，包括 `options`，`loader`和 `plugin`当在 `webpack`环境中应用一个插件时，插件将收到此 `compiler`对象的引用。可以使用`compiler`来访问 `webpack`的主环境。

2. `compilation`对象代表了一次资源版本构建。当运行 `webpack`开发环境中间件时，每当检测到一个文件变化，就会创建一个
新的 `compilation`从而生成一组新的编译资源。一个 `compilation`对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation`对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## compiler

[compiler-hooks](https://webpack.docschina.org/api/compiler-hooks/)
为了在指定生命周期做自定义的一些逻辑处理，我们需要在 `compiler`暴露的钩子上指明我们的 `tap`配置，一般这由一个字符串命名和一个回调函数组成。一般来说，`compile`过程中会触发如下几个钩子：

* beforeRun
* run
* beforeCompile
* compile
* make
* seal
假设我们想在 `compiler.run()` 之前处理逻辑，那么就要调用 `beforeRun`钩子来处理：
```js
compiler.hooks.beforeRun.tap(
  'testPlugin', 
  (comp) => {   
    // ... 
  }
);
```
## compilation

[compilation-hooks](https://webpack.docschina.org/api/compilation-hooks/)