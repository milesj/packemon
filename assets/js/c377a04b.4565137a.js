"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[971],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=s(n),f=o,m=p["".concat(u,".").concat(f)]||p[f]||d[f]||a;return n?r.createElement(m,i(i({ref:t},c),{},{components:n})):r.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[p]="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},8185:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p}});var r=n(5773),o=n(808),a=(n(7378),n(5318)),i=["components"],l={title:"Introduction",slug:"/"},u=void 0,s={unversionedId:"index",id:"index",title:"Introduction",description:"Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/docs/",draft:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/index.md",tags:[],version:"current",frontMatter:{title:"Introduction",slug:"/"},sidebar:"docs",next:{title:"Installation",permalink:"/docs/install"}},c={},p=[{value:"Features",id:"features",level:2},{value:"Requirements",id:"requirements",level:2}],d={toc:p},f="wrapper";function m(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)(f,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Are you a library maintainer? Confused on how to build packages for consumers? Unsure of what\ntooling and plugins to use? What about CommonJS vs ECMAScript? TypeScript, JavaScript, or FlowType?\nForget that headache and let Packemon do the heavy lifting for you. No need to fiddle with Babel or\nRollup configurations!"),(0,a.kt)("p",null,'Packemon is a "batteries included" CLI that will prepare each package for distribution by building\nwith the proper tooling and plugins, provide sane defaults and configurations, verify package\nrequirements, and much more! By default Packemon will generate ECMAScript modules, but can be\nconfigured to support all formats.'),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"./install"},"Sound great? Let's get started!")),(0,a.kt)("h2",{id:"features"},"Features"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Scaffold TypeScript packages, in either a monorepo or polyrepo project setup."),(0,a.kt)("li",{parentName:"ul"},"Configure packages for Node.js, Web browsers, React Native, or Electron, with multiple output\nformats like CommonJS and ECMAScript."),(0,a.kt)("li",{parentName:"ul"},"Build packages with Rollup to create self-contained and tree-shaken bundles. Provide the smallest\nfile sizes possible!"),(0,a.kt)("li",{parentName:"ul"},"Support a single index import, multiple imports, deep imports, or any kind of entry point."),(0,a.kt)("li",{parentName:"ul"},"Transform packages with Babel's ",(0,a.kt)("inlineCode",{parentName:"li"},"preset-env")," and the configured platform targets. Only ship and\npolyfill what's truly necessary!"),(0,a.kt)("li",{parentName:"ul"},"Generate and combine TypeScript declarations into a single public-only API representation."),(0,a.kt)("li",{parentName:"ul"},"Generate compact source maps for platform + format based builds."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./features"},"And many more..."))),(0,a.kt)("h2",{id:"requirements"},"Requirements"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Linux, OSX, Windows"),(0,a.kt)("li",{parentName:"ul"},"Node 16.12+")))}m.isMDXComponent=!0}}]);