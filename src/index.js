/*
 * @Author: tangdaoyong
 * @Date: 2021-04-23 17:38:25
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-05-12 16:47:13
 * @Description: webpack入口
 */
import { testPrint } from './test/test';
/**
 * 输出位置
 */
testPrint('webpack入口')

async function asyscTest(message) {
    const asyscTestPrint = await import(/* webpackChunkName: "asyncTest" */ 'test1/test2')
    asyscTestPrint(message)
}

asyscTest('异步测试')