<!--
 * @Author: tangdaoyong
 * @Date: 2021-04-20 16:59:32
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-23 18:19:42
 * @Description: file content
-->

插件开发两个比较重要的东西compiler 和 compilation

1. compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用
compiler 来访问 webpack 的主环境。

2. compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个
新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以
及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

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