/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../esm-exports-js/index.js":
/*!**********************************!*\
  !*** ../esm-exports-js/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-exports-js');


/***/ }),

/***/ "../esm-module-js/index.js":
/*!*********************************!*\
  !*** ../esm-module-js/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-module-js');


/***/ }),

/***/ "../valid-cjs-via-import/index.cjs":
/*!*****************************************!*\
  !*** ../valid-cjs-via-import/index.cjs ***!
  \*****************************************/
/***/ ((module) => {

module.exports = 'valid-cjs-via-import';


/***/ }),

/***/ "../esm-exports-js-module/index.js":
/*!*****************************************!*\
  !*** ../esm-exports-js-module/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-exports-js-module');


/***/ }),

/***/ "../esm-exports-mjs/index.mjs":
/*!************************************!*\
  !*** ../esm-exports-mjs/index.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-exports-mjs');


/***/ }),

/***/ "../esm-module-js-module/index.js":
/*!****************************************!*\
  !*** ../esm-module-js-module/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-module-js-module');


/***/ }),

/***/ "../esm-module-mjs/index.mjs":
/*!***********************************!*\
  !*** ../esm-module-mjs/index.mjs ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('esm-module-mjs');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var esm_exports_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esm-exports-js */ "../esm-exports-js/index.js");
/* harmony import */ var esm_exports_js_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! esm-exports-js-module */ "../esm-exports-js-module/index.js");
/* harmony import */ var esm_exports_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! esm-exports-mjs */ "../esm-exports-mjs/index.mjs");
/* harmony import */ var esm_module_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! esm-module-js */ "../esm-module-js/index.js");
/* harmony import */ var esm_module_js_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! esm-module-js-module */ "../esm-module-js-module/index.js");
/* harmony import */ var esm_module_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! esm-module-mjs */ "../esm-module-mjs/index.mjs");
/* harmony import */ var valid_cjs_via_import__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! valid-cjs-via-import */ "../valid-cjs-via-import/index.cjs");
/* harmony import */ var valid_cjs_via_import__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(valid_cjs_via_import__WEBPACK_IMPORTED_MODULE_6__);







// These are weird but allowed


// These should fail
// import 'invalid-js-module-via-require';
// import 'invalid-mjs-via-require';

console.log(
	esm_exports_js__WEBPACK_IMPORTED_MODULE_0__["default"],
	esm_exports_js_module__WEBPACK_IMPORTED_MODULE_1__["default"],
	esm_exports_mjs__WEBPACK_IMPORTED_MODULE_2__["default"],
	esm_module_js__WEBPACK_IMPORTED_MODULE_3__["default"],
	esm_module_js_module__WEBPACK_IMPORTED_MODULE_4__["default"],
	esm_module_mjs__WEBPACK_IMPORTED_MODULE_5__["default"],
);

})();

/******/ })()
;