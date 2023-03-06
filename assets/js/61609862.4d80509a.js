"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[979],{5318:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return f}});var r=t(7378);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=r.createContext({}),p=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(t),f=a,d=m["".concat(u,".").concat(f)]||m[f]||s[f]||o;return t?r.createElement(d,i(i({ref:n},c),{},{components:t})):r.createElement(d,i({ref:n},c))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8955:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return u},default:function(){return s},frontMatter:function(){return l},toc:function(){return p}});var r=t(5773),a=t(808),o=(t(7378),t(5318)),i=["components"],l={},u=void 0,p=[{value:"Installation",id:"installation",level:2},{value:"Requirements",id:"requirements",level:2}],c={toc:p};function s(e){var n=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/milesj/packemon/actions?query=branch%3Amaster"},(0,o.kt)("img",{parentName:"a",src:"https://github.com/milesj/packemon/workflows/Build/badge.svg",alt:"Build Status"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/babel-plugin-conditional-invariant"},(0,o.kt)("img",{parentName:"a",src:"https://badge.fury.io/js/babel-plugin-conditional-invariant.svg",alt:"npm version"}))),(0,o.kt)("p",null,"Wrap invariant function checks in ",(0,o.kt)("inlineCode",{parentName:"p"},"process.env.NODE_ENV")," conditionals that only run in development."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"// Input\ninvariant(value === false, 'Value must be falsy!');\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"// Output\nif (process.env.NODE_ENV !== 'production') {\n  invariant(value === false, 'Value must be falsy!');\n}\n")),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"yarn add --dev babel-plugin-conditional-invariant\n")),(0,o.kt)("p",null,"Add the plugin to your root ",(0,o.kt)("inlineCode",{parentName:"p"},"babel.config.*")," file."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"module.exports = {\n  plugins: ['babel-plugin-conditional-invariant'],\n};\n")),(0,o.kt)("h2",{id:"requirements"},"Requirements"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Linux, OSX, Windows"),(0,o.kt)("li",{parentName:"ul"},"Node 14.15+")))}s.isMDXComponent=!0}}]);