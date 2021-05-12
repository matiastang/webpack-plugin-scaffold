/*
 * @Author: tangdaoyong
 * @Date: 2021-05-11 18:15:18
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-05-12 21:29:42
 * @Description: file content
 */
// const path = require('path');
import path from 'path'

/* - 常量 - */

// 入口
const ENTRYPATH = path.resolve(__dirname, './src/index.js');
// 出口
const OUTPUTPATH = path.resolve(__dirname, './dist');

/* - 自定义webpack插件 - */

// const RemoveCommentsPlugin = require('./plugin/remove-comments-plugin');
import RemoveUnusedFilesWebpackPlugin from './plugin/unused';// 清除无用文件

// module.exports = {
export default {
    entry: {
        app: ENTRYPATH
    },
    //_生产环境_中使用 source-map 选项，而不是我们在_开发环境_中用到的 inline-source-map
    // devtool: 'inline-source-map',
    plugins: [
        // new RemoveCommentsPlugin(),
        // 清除无用文件
        new RemoveUnusedFilesWebpackPlugin({
            patterns: ['src/**']
        })
    ],
    output: {
        path: OUTPUTPATH,      // 出口路径
        filename: '[name].bundle.js'
    },
    resolve: {
        // extensions: ['.js'],
        alias: { // 别名
            root: path.resolve(__dirname, 'src/'),
            test1: path.resolve(__dirname, 'src/test1/'),
        }
    },
    /*
    babel-loader: 负责 es6 语法转化
    babel-preset-env: 包含 es6、7 等版本的语法转化规则
    babel-polyfill: es6 内置方法和函数转化垫片
    babel-plugin-transform-runtime: 避免 polyfill 污染全局变量
    Plugin/Preset files are not allowed to export objects, only functions
    babel 7.0 版本的( @babel/core ， @babel/preset-react )
　　也可命令查看 bebel-cli 的版本 （ babel -V ）
　　也有 babel 6.0 版本的 ( babel-core@6.26.0 , babel-cli@6.26.0 , babel-preset-react@6.24.1 )

    @babel/plugin-transform-async-to-generator // 把async函数转化成generator函数
    */
    module: { // 加载器
        rules: [// 规则
            {
                test: /\.js|jsx$/,            // 匹配文件
                exclude: /node_modules/,      // 排除文件夹
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    } // babel 加载器
                ]
            }
            // {
            //     test: /\.js|jsx$/,            // 匹配文件
            //     exclude: /node_modules/,      // 排除文件夹
            //     use: [
            //         { loader: 'babel-loader' } // babel 加载器
            //     ]
            // },
            // {
            //     test: /\.(ts|tsx)$/,
            //     use: [{
            //         loader: 'babel-loader'
            //     }, {
            //         loader: 'ts-loader',
            //         options: {
            //             // 关闭类型校验：disable type checker - we will use it in fork plugin
            //             transpileOnly: true
            //             /*
            //             transpileOnly: false 单进程，只使用ts-loader进行'转译'和‘类型检查’(单进程因为是同步所以webpack可以收集错误信息，并通过dev-server反馈到浏览器)
            //             transpileOnly: true 则关闭类型检查，即只进行转译
            //             */
            //         }
            //     }],
            //     exclude: /node_modules/
            // },
            // {
            //     test: /\.css$/, // 匹配 css 文件
            //     include: /src/,
            //     use: [
            //         {
            //             // fallback to style-loader in development
            //             // loader: process.env.NODE_ENV !== 'production' ? 'style-loader': MiniCssExtractPlugin.loader,
            //             loader: 'style-loader'
            //         },
            //         {
            //             loader: '@teamsupercell/typings-for-css-modules-loader',
            //             options: {
            //                 // css-loader相关参数在css-loader中设置：pass all the options for `css-loader` to `css-loader`, eg.
            //                 formatter: 'prettier'
            //             }
            //         },
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: {
            //                     localIdentName: '[local]_[hash:base64:5]'
            //                 },
            //                 sourceMap: true,
            //                 importLoaders: 2
            //             }
            //         }
            //     ]
            // },
            // {
            //     test: /\.(s(a|c)|le)ss$/,
            //     include: /src/,
            //     use: [{
            //         loader: 'style-loader'
            //     }, {
            //         loader: '@teamsupercell/typings-for-css-modules-loader', // @teamsupercell/typings-for-css-modules-loader 生成样式的类型声明文件 typings-for-css-modules-loader让我们可以像使用js模块一样引入css和scss文件。
            //         options: {
            //             formatter: 'prettier'
            //         }
            //     }, {
            //         loader: 'css-loader',
            //         options: {
            //             modules: {
            //                 localIdentName: '[local]_[hash:base64:5]'
            //             },
            //             sourceMap: true,
            //             importLoaders: 2
            //         }
            //     }, {
            //         loader: 'sass-loader'// 处理`.scss`、`.less`文件，需要依赖`node-sass`包。
            //     }, {
            //         loader: 'postcss-loader'
            //     }]
            // },
            // {
            //     test: /\.(png|jpg|jpeg|gif)$/,
            //     type: 'asset/resource'
            // },
            // {
            //     test: /\.svg$/,
            //     use: ['@svgr/webpack']
            // },
            // {
            //     /*
            //     * .vert - 顶点着色器
            //     * .tesc - 曲面细分控制着色器
            //     * .tese - 曲面细分评估着色器
            //     * .geom - 几何着色器
            //     * .frag - 片段着色器
            //     * .comp - 计算着色器
            //     */
            //     test: /\.(vert|tesc|tese|geom|frag|comp|glsl)$/i,
            //     use: ['webpack-glsl-minify']
            // }
        ]
    }
    // ,
    // devServer: { // 配置 webpack-dev-server
    //     host: 'localhost',
    //     port: 3000,
    //     open: true,
    //     contentBase: OUTPUTPATH,
    //     historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    //     compress: true // 压缩
    // }
};