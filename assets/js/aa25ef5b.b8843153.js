"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[598],{5318:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return c}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),m=s(n),c=r,k=m["".concat(p,".").concat(c)]||m[c]||u[c]||l;return n?a.createElement(k,o(o({ref:t},d),{},{components:n})):a.createElement(k,o({ref:t},d))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1225:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return i},metadata:function(){return s},toc:function(){return u}});var a=n(5773),r=n(808),l=(n(7378),n(5318)),o=["components"],i={title:"2.0 migration",sidebar_label:"2.0"},p=void 0,s={unversionedId:"migrate/2.0",id:"migrate/2.0",title:"2.0 migration",description:"Shifted Node.js/npm versions and dropped v10 support",source:"@site/docs/migrate/2.0.md",sourceDirName:"migrate",slug:"/migrate/2.0",permalink:"/docs/migrate/2.0",draft:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/migrate/2.0.md",tags:[],version:"current",frontMatter:{title:"2.0 migration",sidebar_label:"2.0"},sidebar:"docs",previous:{title:"Advanced",permalink:"/docs/advanced"}},d={},u=[{value:"Shifted Node.js/npm versions and dropped v10 support",id:"shifted-nodejsnpm-versions-and-dropped-v10-support",level:2},{value:"Before",id:"before",level:4},{value:"After",id:"after",level:4},{value:"Shifted browser targets and dropped IE and iOS &lt; 12 support",id:"shifted-browser-targets-and-dropped-ie-and-ios--12-support",level:2},{value:"Before",id:"before-1",level:4},{value:"After",id:"after-1",level:4},{value:"Removed multiple <code>format</code> support when configuring a package",id:"removed-multiple-format-support-when-configuring-a-package",level:2},{value:"Removed <code>api</code> support from <code>--declaration</code>",id:"removed-api-support-from---declaration",level:2},{value:"Removed the <code>--analyze</code> option",id:"removed-the---analyze-option",level:2},{value:"Removed <code>.babelrc</code> support within each package",id:"removed-babelrc-support-within-each-package",level:2},{value:"Output of formats <code>esm</code> and <code>mjs</code> are now considered a module",id:"output-of-formats-esm-and-mjs-are-now-considered-a-module",level:2}],m={toc:u};function c(e){var t=e.components,n=(0,r.Z)(e,o);return(0,l.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"shifted-nodejsnpm-versions-and-dropped-v10-support"},"Shifted Node.js/npm versions and dropped v10 support"),(0,l.kt)("p",null,"Since Node.js v12 has reached ",(0,l.kt)("a",{parentName:"p",href:"https://nodejs.org/en/about/releases/"},"end of life"),", Packemon now\nrequires at minimum v14.15 and above to run. Furthermore, we're entirely dropping v10 support, and\nshifting v12 into ",(0,l.kt)("inlineCode",{parentName:"p"},"legacy"),", v14 into ",(0,l.kt)("inlineCode",{parentName:"p"},"stable"),", v16 into ",(0,l.kt)("inlineCode",{parentName:"p"},"current"),", and the new v18 into\n",(0,l.kt)("inlineCode",{parentName:"p"},"experimental"),". As part of this process, we are also bumping minimum requirements and coupled npm\nversions."),(0,l.kt)("p",null,"The updated ",(0,l.kt)("a",{parentName:"p",href:"/docs/config#support"},(0,l.kt)("inlineCode",{parentName:"a"},"support"))," compatibility table is as follows."),(0,l.kt)("h4",{id:"before"},"Before"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"Legacy"),(0,l.kt)("th",{parentName:"tr",align:null},"Stable"),(0,l.kt)("th",{parentName:"tr",align:null},"Current"),(0,l.kt)("th",{parentName:"tr",align:null},"Experimental"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Node"),(0,l.kt)("td",{parentName:"tr",align:null},">= 10.3.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 12.17.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 14.16.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 16.0.0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"npm"),(0,l.kt)("td",{parentName:"tr",align:null},">= 6.1.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 6.3.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 6.14.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 7.0.0")))),(0,l.kt)("h4",{id:"after"},"After"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"Legacy"),(0,l.kt)("th",{parentName:"tr",align:null},"Stable"),(0,l.kt)("th",{parentName:"tr",align:null},"Current"),(0,l.kt)("th",{parentName:"tr",align:null},"Experimental"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Node"),(0,l.kt)("td",{parentName:"tr",align:null},">= 12.22.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 14.15.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 16.12.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 18.0.0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"npm"),(0,l.kt)("td",{parentName:"tr",align:null},">= 6.14.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 6.14.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 8.1.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 8.5.0")))),(0,l.kt)("p",null,"Notable changes:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"v14.15 is the start of LTS"),(0,l.kt)("li",{parentName:"ul"},"v14.19 supports\n",(0,l.kt)("a",{parentName:"li",href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md#corepack"},"Corepack")),(0,l.kt)("li",{parentName:"ul"},"v16.12 supports new\n",(0,l.kt)("a",{parentName:"li",href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V16.md#experimental-esm-loader-hooks-api"},"ESM loader hooks")),(0,l.kt)("li",{parentName:"ul"},"v18 supports native fetch and\n",(0,l.kt)("a",{parentName:"li",href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V17.md#openssl-30"},"OpenSSL 3.0"))),(0,l.kt)("h2",{id:"shifted-browser-targets-and-dropped-ie-and-ios--12-support"},"Shifted browser targets and dropped IE and iOS < 12 support"),(0,l.kt)("p",null,"With Node.js versions changing (above), it was due time to audit the browser targets as well, and as\nsuch, we have dropped Internet Explorer support entirely. This only affected ",(0,l.kt)("inlineCode",{parentName:"p"},"legacy")," support."),(0,l.kt)("p",null,"We also dropped iOS 8-11 support, as these versions are more than 5 years old. The minimum supported\nversion is now iOS 12, which was released in 2018."),(0,l.kt)("p",null,"The updated ",(0,l.kt)("a",{parentName:"p",href:"/docs/config#support"},(0,l.kt)("inlineCode",{parentName:"a"},"support"))," compatibility table is as follows."),(0,l.kt)("h4",{id:"before-1"},"Before"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"Legacy"),(0,l.kt)("th",{parentName:"tr",align:null},"Stable"),(0,l.kt)("th",{parentName:"tr",align:null},"Current"),(0,l.kt)("th",{parentName:"tr",align:null},"Experimental"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Browser"),(0,l.kt)("td",{parentName:"tr",align:null},">= IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},"defaults, not IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},"> 1%, not dead"),(0,l.kt)("td",{parentName:"tr",align:null},"last 2 chrome versions")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Native"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 8"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 10"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 12"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 14")))),(0,l.kt)("h4",{id:"after-1"},"After"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"Legacy"),(0,l.kt)("th",{parentName:"tr",align:null},"Stable"),(0,l.kt)("th",{parentName:"tr",align:null},"Current"),(0,l.kt)("th",{parentName:"tr",align:null},"Experimental"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Browser"),(0,l.kt)("td",{parentName:"tr",align:null},">= 0.10%, not IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},"defaults, not IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},">= 1%, not dead"),(0,l.kt)("td",{parentName:"tr",align:null},"last 2 chrome versions")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Native"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 12"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 13"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 14"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 15")))),(0,l.kt)("p",null,"A major notable change is that all targets are now on ES2015, which means you should see ",(0,l.kt)("inlineCode",{parentName:"p"},"const"),"\nusage, arrow functions, and more (we no longer downlevel). If this causes issues, you should ask\nyourself why you still need 7 year old syntax."),(0,l.kt)("h2",{id:"removed-multiple-format-support-when-configuring-a-package"},"Removed multiple ",(0,l.kt)("inlineCode",{parentName:"h2"},"format")," support when configuring a package"),(0,l.kt)("p",null,"Previously it was possible to pass a list of formats to the ",(0,l.kt)("a",{parentName:"p",href:"/docs/config#formats"},(0,l.kt)("inlineCode",{parentName:"a"},"format")),"\nsetting, and Packemon will build them all (according to the platform). For example, a Node.js\nlibrary could have built ",(0,l.kt)("inlineCode",{parentName:"p"},"cjs")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"mjs")," versions. However, in an effort to reduce the\n",(0,l.kt)("a",{parentName:"p",href:"https://nodejs.org/api/packages.html#dual-commonjses-module-packages"},"dual package hazard problem"),",\nPackemon now only supports a single format."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'// Before\n{\n    "format": ["cjs", "mjs"]\n}\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'// After\n{\n    "format": "mjs"\n}\n')),(0,l.kt)("p",null,"With that being said, you can work around this restriction by passing an\n",(0,l.kt)("a",{parentName:"p",href:"../config"},"array of configuration")," objects to the ",(0,l.kt)("inlineCode",{parentName:"p"},"packemon")," setting. We ",(0,l.kt)("em",{parentName:"p"},"do not")," guarantee this\nwill work correctly."),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"When choosing the ",(0,l.kt)("inlineCode",{parentName:"p"},"esm")," format, Packemon will automatically build a ",(0,l.kt)("inlineCode",{parentName:"p"},"lib")," format. This is an\nexception for backwards compatibility until the Node.js ecosystem is fully on modules.")),(0,l.kt)("h2",{id:"removed-api-support-from---declaration"},"Removed ",(0,l.kt)("inlineCode",{parentName:"h2"},"api")," support from ",(0,l.kt)("inlineCode",{parentName:"h2"},"--declaration")),(0,l.kt)("p",null,"We removed support for the ",(0,l.kt)("inlineCode",{parentName:"p"},"api")," option, which uses\n",(0,l.kt)("a",{parentName:"p",href:"https://api-extractor.com/"},"@microsoft/api-extractor")," to generate a single ",(0,l.kt)("inlineCode",{parentName:"p"},".d.ts")," file. This\nfeature was rarely used, overcomplicated the implementation, and had weird edge cases that we\ncouldn't solve on our end."),(0,l.kt)("p",null,"Because of this change, the ",(0,l.kt)("inlineCode",{parentName:"p"},"--declaration")," option on the command line is now a flag with no value."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"# Before\n--declaration standard\n--declaration api\n\n# After\n--declaration\n")),(0,l.kt)("h2",{id:"removed-the---analyze-option"},"Removed the ",(0,l.kt)("inlineCode",{parentName:"h2"},"--analyze")," option"),(0,l.kt)("p",null,"Since Packemon now supports ",(0,l.kt)("a",{parentName:"p",href:"../advanced#customizing-babel-swc-and-rollup"},"customizing the Rollup config"),", the\n",(0,l.kt)("a",{parentName:"p",href:"https://github.com/btd/rollup-plugin-visualizer"},"rollup-plugin-visualizer")," plugin can now be\nimplemented in user-land, and doesn't need to exist in core."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"const path = require('path');\nconst visualizer = require('rollup-plugin-visualizer');\n\nmodule.exports = {\n    rollupInput(config) {\n        config.plugins.push(\n            visualizer((outputOptions) => ({\n                filename: path.join(outputOptions.dir, 'stats.html'),\n                gzipSize: true,\n                open: true,\n                sourcemap: true,\n                template: 'treemap',\n            })),\n        );\n    },\n};\n")),(0,l.kt)("h2",{id:"removed-babelrc-support-within-each-package"},"Removed ",(0,l.kt)("inlineCode",{parentName:"h2"},".babelrc")," support within each package"),(0,l.kt)("p",null,"Packemon historically supported ",(0,l.kt)("inlineCode",{parentName:"p"},".babelrc")," files within packages as a means to allow custom Babel\nplugins and presets per package. However, this wasn't really documented, and since we now support\n",(0,l.kt)("a",{parentName:"p",href:"../advanced#customizing-babel-swc-and-rollup"},"Packemon config files"),", we suggest using that instead."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="packages/foo/.babelrc"',title:'"packages/foo/.babelrc"'},'// Before\n{\n    "plugins": ["babel-plugin-formatjs"]\n}\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="packages/foo/.packemon.js"',title:'"packages/foo/.packemon.js"'},"// After\nmodule.exports = {\n    babelOutput(config) {\n        config.plugins.push('babel-plugin-formatjs');\n    },\n};\n")),(0,l.kt)("h2",{id:"output-of-formats-esm-and-mjs-are-now-considered-a-module"},"Output of formats ",(0,l.kt)("inlineCode",{parentName:"h2"},"esm")," and ",(0,l.kt)("inlineCode",{parentName:"h2"},"mjs")," are now considered a module"),(0,l.kt)("p",null,"While this change isn't technically breaking, and more of an accuracy fix towards the specification,\nall files generated through the ",(0,l.kt)("inlineCode",{parentName:"p"},"esm")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"mjs")," formats are now considered modules (using\n",(0,l.kt)("a",{parentName:"p",href:"https://rollupjs.org/guide/en/#outputgeneratedcode"},(0,l.kt)("inlineCode",{parentName:"a"},"generatedCode.symbols")),"). This is in addition\nto the ",(0,l.kt)("inlineCode",{parentName:"p"},"__esModule")," property that is already being defined."),(0,l.kt)("p",null,'What this means, is that any imported value within a module context that is stringified will now\nreturn "Module". This can mainly be used for feature detection.'))}c.isMDXComponent=!0}}]);