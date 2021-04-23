/*
 * @Author: tangdaoyong
 * @Date: 2021-04-23 17:41:00
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-23 18:18:31
 * @Description: webpack配置文件
 */
const path = require('path');

/* - 常量 - */

// 入口
const ENTRYPATH = path.resolve(__dirname, './src/index.js');
// 出口
const OUTPUTPATH = path.resolve(__dirname, './dist');

/* - 自定义webpack插件 - */

const RemoveCommentsPlugin = require('./plugin/remove-comments-plugin');

module.exports = {
    entry: {
        app: ENTRYPATH
    },
    //_生产环境_中使用 source-map 选项，而不是我们在_开发环境_中用到的 inline-source-map
    // devtool: 'inline-source-map',
    plugins: [
        new RemoveCommentsPlugin()
    ],
    output: {
        path: OUTPUTPATH,      // 出口路径
        filename: '[name].bundle.js'
    },
    resolve: {
        // extensions: ['.js'],
        alias: { // 别名
            root: path.resolve(__dirname, 'src/'),
        }
    },
    module: { // 加载器
        rules: [// 规则
            // {
            //     test: /\.js|jsx$/,            // 匹配文件
            //     exclude: /node_modules/,      // 排除文件夹
            //     // use: [
            //     //     { loader: 'babel-loader' } // babel 加载器
            //     // ]
            // }
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