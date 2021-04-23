/*
 * @Author: tangdaoyong
 * @Date: 2021-04-23 17:26:12
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-23 17:27:21
 * @Description: webpack移除注释插件
 */
module.exports = class RemoveCommentsPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
            // compilation  可以理解为此次打包的上下文
            // 使用 compilation 对象的 assets 属性可以获取文件名称信息
            for( const name in compilation.assets) {
                // console.log(name);

                // 通过 source() 方法，获取文件中的内容
                // console.log(compilation.assets[name].source());

                // 处理 .js 文件中的注释，先判断获取 .js 文件,使用 endsWith() 方法
                if (name.endsWith('.js')) {
                    // 定义source()方法
                    const contents = compilation.assets[name].source()
                    // 使用正则替换掉注释
                    const noComments = contents.replace(/\/\*{2,}\/\s?/g,'')
                    // 替换后覆盖掉原内容，根据 webpack 格式要求，暴露以下方法
                    // 暴露 source() 方法，返回新的内容
                    // 暴露 size() 方法，返回新内容大小
                    compilation.assets[name]= {
                        source: () => noComments,
                        size: () => noComments.length
                    }
                }
            }
        })
    }
}