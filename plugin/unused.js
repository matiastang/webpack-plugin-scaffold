import path from "path";
import warning from "warning";
import nativeGlobAll from "glob-all";
import promisify from "util.promisify";
import shell from 'shelljs';
import inquirer from 'inquirer';// CLI交互


/**
 * 同步获取路径下面的文件夹
 * @param {*} dirPath 
 * @returns 
 */
const syncGetDirAllFiles = (pattern, options) => {
    return nativeGlobAll.sync(
        pattern,
        options
    );
}

/**
 * 异步获取路径下面的文件夹
 * @param {*} dirPath 
 * @returns 
 */
const asyncGetDirAllFiles = async (pattern, options) => {
    const files = await promisify(nativeGlobAll)(
        pattern,
        options
    );
    return files;
}

/**
 * 执行指令
 * @param {*} command 
 */
const runShell = (command) => {
    return new Promise((resolve, reject) => {
        shell.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`docs 指令 exec error: ${error}`)
                reject(false)
                return
            }
            console.log(`${stdout}`)
            console.log(`${stderr}`)
            resolve(true)
        });
    })
}

/**
 * 同步指令移除文件或文件夹
 * @param {*} unuseds 
 * @param {*} removeDir 
 */
const syncRemoveDirAndFiles = (unuseds, globOptions, removeDir) => {
    // 排序
    let sortUnuseds = unuseds.sort((left, right) => {
        return right.length - left.length
    })
    // 移除
    for (let i = 0; i < sortUnuseds.length; i++) {
        const unused = sortUnuseds[i];
        //
        let splitArr = unused.split('/');
        let isFile = splitArr[splitArr.length - 1].indexOf('.') !== -1;
        if (isFile) {// 文件
            let remove = shell.rm('-r', unused);
            console.log(`删除${unused}文件${remove.code === 0 ? '成功' : '失败'}`);
        } else {// 文件夹
            if (!removeDir) {// 是否移除文件夹
                continue
            }
            let dirFiles = syncGetDirAllFiles([`${unused}/**`], globOptions);
            if (dirFiles.length <= 1 && dirFiles[0] === unused) {
                let remove = shell.rm('-r', unused);
                console.log(`删除${unused}文件夹${remove.code === 0 ? '成功' : '失败'}`);
            } else {
                throw `文件夹${unused}不为空！`;
            }
        }
    }
};


/**
 * 异步指令移除文件或文件夹
 * @param {*} unuseds 
 * @param {*} removeDir 
 */
const asyncRemoveDirAndFiles = async (unuseds, globOptions, removeDir) => {
    // 排序
    let sortUnuseds = unuseds.sort((left, right) => {
        return right.length - left.length
    })
    // 移除
    for (let i = 0; i < sortUnuseds.length; i++) {
        const unused = sortUnuseds[i];
        let splitArr = unused.split('/');
        let isFile = splitArr[splitArr.length - 1].indexOf('.') !== -1;
        if (isFile) {// 文件
            let remove = await runShell(`rm ${unused}`);
            console.log(`删除${unused}文件${remove ? '成功' : '失败'}`);
        } else {// 文件夹
            if (!removeDir) {// 是否移除文件夹
                continue
            }
            let dirFiles = await asyncGetDirAllFiles(
                [`${unused}/**`],
                globOptions
            );
            if (dirFiles.length <= 1 && dirFiles[0] === unused) {
                let remove = await runShell(`rm -R ${unused}`);
                console.log(`删除${unused}文件夹${remove ? '成功' : '失败'}`);
            } else {
                console.log(`文件夹${unused}不为空！`)
            }
        }
    }
};

/**
 * 组装全局配置
 * @param {*} compiler 
 * @param {*} globOptions 
 * @returns 
 */
function globOptionsWith(compiler, globOptions) {
    return {
        cwd: compiler.context,// 当前路径
        ...globOptions// 配置
    };
}

/**
 * 获取依赖资源文件路径列表
 * @param {*} compilation 
 * @returns 
 */
function getFileDepsMap(compilation) {
    /*
    compilation.fileDependencies一个存放模块中包含的源文件路径的数组。它包含了 JavaScript 源文件自身（例如：index.js），和所有被请求（required）的依赖资源文件（样式表，图像等等）。想要知道哪些源文件属于这个模块时，检查这些依赖是有帮助的。
    */
    const fileDepsBy = [...compilation.fileDependencies].reduce(
        (acc, usedFilepath) => {
            acc[usedFilepath] = true;
            return acc;
        },
        {}
    );
    const { assets } = compilation;
    Object.keys(assets).forEach(assetRelpath => {
        const existsAt = assets[assetRelpath].existsAt;
        fileDepsBy[existsAt] = true;
    });
    return fileDepsBy;
}

/**
 * 同步处理AfterEmit
 * @param {*} compiler 
 * @param {*} compilation 
 * @param {*} plugin 
 */
const syncApplyAfterEmit = (compiler, compilation, plugin) => {
    const globOptions = globOptionsWith(compiler, plugin.globOptions);
    const fileDepsMap = getFileDepsMap(compilation);
    // 获取所有文件目录列表
    const files = syncGetDirAllFiles(
        plugin.options.patterns || plugin.options.pattern,
        globOptions
    );
    /*
    path.join(path1，path2，path3.......)作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。
    path.resolve([from...],to)作用：把一个路径或路径片段的序列解析为一个绝对路径。相当于执行cd操作。/被解析为根目录。
    */
    // 过滤出未使用的文件或文件夹
    const unused = files.filter(
        it => !fileDepsMap[path.join(globOptions.cwd, it)]
    );
    if (unused.length !== 0) {
        let message = `
        remove-unused-files-webpack-plugin found some unused files:
        ${unused.join(`\n`)}`
        // 命令配置了 bail 参数并传递 true ，错误的时候，退出打包过程。
        if (plugin.options.failOnUnused && compilation.bail) {
            throw message;
        }
        const errorsList = plugin.options.failOnUnused ? compilation.errors : compilation.warnings;
        errorsList.push(message);
        if (plugin.options.remove) {// 是否配置了删除
            inquirerPrompt(unused, globOptions);
        }
    }
    // not found unused files 不提示
}

/**
 * CLI交互询问事件
 */
const inquirerPrompt = (unused, globOptions) => {

    /**
     * 询问
     */
    const promptList = [{
        type: "confirm",
        message: "已检测到的未使用的",
        name: "file",
        prefix: "是否删除",
        suffix: "文件？(本地如果rm防护将无法恢复)"
    },{
        type: "confirm",
        message: "已检测到的未使用的",
        name: "dir",
        prefix: "是否删除",
        suffix: "文件夹？(本地如果rm防护将无法恢复)",
        when: function(answers) { // 只有当选择删除文件后才询问是否删除文件夹，否则默认不删除
            return answers.file
        }
    }];

    return inquirer.prompt(promptList)
    // inquirer.prompt(promptList).then((answers) => {
    //     if (answers.file) {// 执行删除
    //         syncRemoveDirAndFiles(unused, globOptions, answers.dir);
    //         await asyncRemoveDirAndFiles(unused, globOptions, answers.dir);
    //     }
    // })
};

const asyncApplyAfterEmit = async (compiler, compilation, plugin) => {
    const globOptions = globOptionsWith(compiler, plugin.globOptions);
    const fileDepsMap = getFileDepsMap(compilation);

    const files = await asyncGetDirAllFiles(
        plugin.options.patterns || plugin.options.pattern,
        globOptions
    );
    /*
    path.join(path1，path2，path3.......)作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。
    path.resolve([from...],to)作用：把一个路径或路径片段的序列解析为一个绝对路径。相当于执行cd操作。/被解析为根目录。
    */
    // 过滤出未使用的文件或文件夹
    const unused = files.filter(
        it => !fileDepsMap[path.join(globOptions.cwd, it)]
    );
    if (unused.length !== 0) {
        let message = `
        remove-unused-files-webpack-plugin found some unused files:
        ${unused.join(`\n`)}`
        // 命令配置了 bail 参数并传递 true ，错误的时候，退出打包过程。
        if (plugin.options.failOnUnused && compilation.bail) {
            throw message;
        }
        const errorsList = plugin.options.failOnUnused ? compilation.errors : compilation.warnings;
        errorsList.push(message);
        if (plugin.options.remove) {// 是否配置了删除
            console.log('调用删除')
            await asyncRemoveDirAndFiles(unused, globOptions, true);
            // await inquirerPrompt(unused).then((answers) => {
            //         if (answers.file) {// 执行删除
            //             // syncRemoveDirAndFiles(unused, globOptions, answers.dir);
            //             await asyncRemoveDirAndFiles(unused, globOptions, answers.dir);
            //         }
            //     });
        }
    }
    // not found unused files 不提示
}

/**
 * 清除没有使用到的文件或文件夹
 */
export class RemoveUnusedFilesWebpackPlugin {

    constructor(options = {}) {
        // pattern必传
        warning(
            !options.pattern,
            `
            "options.pattern" is deprecated and will be removed in v4.0.0.
            Use "options.patterns" instead, which supports array of patterns and exclude pattern.
            See https://www.npmjs.com/package/glob-all#notes
            `
        );
        // 挂载options
        this.options = {
            ...options,
            patterns: options.patterns || options.pattern || [`**/*.*`],
            failOnUnused: options.failOnUnused === true,
            remove: options.remove || true,
            async: options.async || true
        };
        // 挂载globOptions
        this.globOptions = {
            ignore: `node_modules/**/*`,
            ...options.globOptions
        };
    }

    apply(compiler) {
        // 注册afterEmit处理
        compiler.hooks.afterEmit.tap('remove-unused-files-webpack-plugin', compilation => {
            if (this.options.async) {
                asyncApplyAfterEmit(compiler, compilation, this).then(() => {
                    console.log('完成');
                })
            } else {
                syncApplyAfterEmit(compiler, compilation, this)
            }
        });
    }
}

export default RemoveUnusedFilesWebpackPlugin;