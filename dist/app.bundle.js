/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => { // webpackBootstrap
	var __webpack_modules__ = ({

"./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _test_test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test/test */ \"./src/test/test.js\");\n/* harmony import */ var _test_test__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_test_test__WEBPACK_IMPORTED_MODULE_0__);\n/*\n * @Author: tangdaoyong\n * @Date: 2021-04-23 17:38:25\n * @LastEditors: tangdaoyong\n * @LastEditTime: 2021-04-23 17:57:06\n * @Description: webpack入口\n */\n\n/**\n * 输出位置\n */\n(0,_test_test__WEBPACK_IMPORTED_MODULE_0__.testPrint)('webpack入口')\n\n//# sourceURL=webpack://webpack-plugin-scaffold/./src/index.js?");

}),

"./src/test/test.js":
/*!**************************!*\
  !*** ./src/test/test.js ***!
  \**************************/
((module) => {

eval("/*\n * @Author: tangdaoyong\n * @Date: 2021-04-23 17:39:22\n * @LastEditors: tangdaoyong\n * @LastEditTime: 2021-04-23 18:10:45\n * @Description: 测试文件\n */\n/**\n * \b测试文件\n */\nconst testPrint = (message) => {\n    /**\n     * 打印输入\n     */\n    console.log(message)\n}\nfunction test(){\n    console.dir({ will: be, removed: \"true\" })\n    console.log(\"except for this one!\");/*NotClearConsole*/\n}\nmodule.exports = {\n    testPrint,\n    test\n}\n\n//# sourceURL=webpack://webpack-plugin-scaffold/./src/test/test.js?");

})

	});
	// The module cache
	var __webpack_module_cache__ = {};
	
	// The require function
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		var cachedModule = __webpack_module_cache__[moduleId];
		if (cachedModule !== undefined) {
			return cachedModule.exports;
		}
		// Create a new module (and put it into the cache)
		var module = __webpack_module_cache__[moduleId] = {
			// no module.id needed
			// no module.loaded needed
			exports: {}
		};
	
		// Execute the module function
		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
	
		// Return the exports of the module
		return module.exports;
	}
	
	/* webpack/runtime/compat get default export */
	(() => {
		// getDefaultExport function for compatibility with non-harmony modules
		__webpack_require__.n = (module) => {
			var getter = module && module.__esModule ?
				() => (module['default']) :
				() => (module);
			__webpack_require__.d(getter, { a: getter });
			return getter;
		};
	})();
	
	/* webpack/runtime/define property getters */
	(() => {
		// define getter functions for harmony exports
		__webpack_require__.d = (exports, definition) => {
			for(var key in definition) {
				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
				}
			}
		};
	})();
	
	/* webpack/runtime/hasOwnProperty shorthand */
	(() => {
		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
	})();
	
	/* webpack/runtime/make namespace object */
	(() => {
		// define __esModule on exports
		__webpack_require__.r = (exports) => {
			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
			}
			Object.defineProperty(exports, '__esModule', { value: true });
		};
	})();
	
	
	// startup
	// Load entry module and return exports
	// This entry module can't be inlined because the eval devtool is used.
	var __webpack_exports__ = __webpack_require__("./src/index.js");
	
})()
;