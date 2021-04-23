/*
 * @Author: tangdaoyong
 * @Date: 2021-04-23 17:39:22
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-04-23 18:10:45
 * @Description: 测试文件
 */
/**
 * 测试文件
 */
const testPrint = (message) => {
    /**
     * 打印输入
     */
    console.log(message)
}
function test(){
    console.dir({ will: be, removed: "true" })
    console.log("except for this one!");/*NotClearConsole*/
}
module.exports = {
    testPrint,
    test
}