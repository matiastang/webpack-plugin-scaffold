<!--
 * @Author: tangdaoyong
 * @Date: 2021-04-20 16:59:32
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-25 09:31:25
 * @Description: file content
-->

webpack 已成为前端打包工具链中不可或缺的一环，如若只是配置使用，那么了解到如下几类即可满足大部分需求：

Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。
整体来说，webpack 可以看作是基于事件流的编程实现，其核心概念便是插件机制了，webpack 自身便是利用这套机制构建出来的，你可以将其看成一个插件集合。Tappable 是实现 webpack 插件机制一个很基础的类，但本文不做过多解释，详情可以移步 https://github.com/webpack/tapable 阅读源码。我们简单介绍下 webpack 插件以及如何上手。

我们基于上面的例子，将其中一些关键的概念解释一下。首先是 compiler。这个对象包含了 webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 webpack 实例。

为了在指定生命周期做自定义的一些逻辑处理，我们需要在 compiler 暴露的钩子上指明我们的 tap 配置，一般这由一个字符串命名和一个回调函数组成。一般来说，compile 过程中会触发如下几个钩子：

beforeRun
run
beforeCompile
compile
make
seal
假设我们想在 compiler.run() 之前处理逻辑，那么就要调用 beforeRun 钩子来处理：

compiler.hooks.beforeRun.tap(
  'testPlugin', 
  (comp) => {   
    // ... 
  }
);
而钩子 entryOption 表示在 webpack 选项中的 entry 配置项处理过之后，执行该插件，钩子 compilation 表示在编译创建之后，执行插件，更详细的 compiler 钩子列表可参见官方文档。

说完 complier 我们再来看看 compilation。compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也能读取到 compiler 对象。两者的区别在于，前者代表了整个 webpack 从启动到关闭的生命周期，而 compilation 只代表一次单独的编译。

同样的，compilation 也对应有不同的钩子给开发者调用，具体可参见官方文档。

插件开发两个比较重要的东西compiler 和 compilation

1. compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用
compiler 来访问 webpack 的主环境。

2. compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个
新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以
及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

不论是 compiler 还是 compilation 阶段，从上述举例的几个事件钩子中都可以看出，貌似是存在不同的类型。所以最后，我们再来看看这一块。

根据插件所能触及到的 event hook(事件钩子)，对其进行分类。每个 event hook 都被预先定义为 synchronous hook(同步), asynchronous hook(异步), waterfall hook(瀑布), parallel hook(并行)，而在 webpack 内部会使用 call/callAsync 方法调用这些 hook。 —— webpack 中文文档
其中同步钩子有以下几种，你在查询文档的时候可以在钩子名称后面找到对应的类型：

SyncHook(同步钩子) - SyncHook
Bail Hooks(保释钩子) - SyncBailHook
Waterfall Hooks(瀑布钩子) - SyncWaterfallHook
异步钩子如下：

Async Series Hook(异步串行钩子) - AsyncSeriesHook
Async waterfall(异步瀑布钩子) - AsyncWaterfallHook
Async Series Bail - AsyncSeriesBailHook
Async Parallel - AsyncParallelHook
Async Series Bail - AsyncSeriesBailHook

webpack 的 Hooks
Webpack 的 Compiler 对象主要有以下 Hooks：

entryOption
webpack 处理完 entry 配置项后触发，这是一个同步串行的 SyncBailHook 钩子，只要监听函数有一个函数的返回值不为undefined，则直接跳过剩下逻辑

无参数

afterPlugins
处理完初始化插件后触发，这是一个同步的 SyncHook 钩子，不关心返回值

参数是 compiler 对象

afterResolvers
Resolve 安装完成后触发，这是一个同步的 SyncHook 钩子

参数是 compiler 对象

environment
environment 准备好后触发，这是一个 SyncHook 钩子

无参数

afterEnvironment
environment 安装完成后触发，这是一个 SyncHook 钩子

beforeRun
compiler.run 函数之前触发，这是一个异步串行 AsyncSeriesHook 钩子

参数是 compiler

run
开始读取 records 之前触发，这是一个异步串行 AsyncSeriesHook 钩子

参数是 compiler

watchRun
监听模式下，一个新的编译开始之前触发，这是一个异步串行的 AsyncSeriesHook 钩子

参数是 compiler

normalModuleFactory
normalModuleFactory 创建之后触发，这是一个同步 SyncHook 钩子

参数是 normalModuleFactory

contextModuleFactory
contextModuleFactory 创建之后触发，

参数是 contextModuleFactory

beforeCompile
编译参数创建之后触发，这是一个异步串行 AsyncSeriesHook 钩子

参数是 compilationParams

compile
一个新的编译创建之后触发，这是一个同步 SyncHook 钩子

参数是 compilationParams

thisCompilation
触发 compilation 之前触发，这个是一个同步 SyncHook 钩子

参数是 compilation

compilation
编译创建之后执行，这是一个同步 SyncHook 钩子

参数是 compilation

make
这是一个异步并发 AsyncParallelBailHook 钩子

参数是 compilation

afterCompile
这是一个异步串行 �AsyncSeriesHook 钩子

参数是 compilation

shouldEmit
这是一个 SyncBailHook 钩子

参数是 compilation

emit
�生成资源到 output 目录之前�触发，这是一个异步串行 AsyncSeriesHook 钩子

参数是 compilation

afterEmit
生成资源到 output �目录之后，这是一个异步串行 AsyncSeriesHook 钩子

参数是 compilation

done
编译完成后触发，这是一个异步串行 AsyncSeriesHook 钩子

参数是 stats

failed
编译失败触发，这是一个同步 SyncHook 钩子

参数是 error

invalid
监听模式下，编译无效时触发，这是一个同步 SyncHook 钩子

参数是 fileName，changeTime

�+ watchClose

监听模式停止，一个同步 SyncHook 钩子