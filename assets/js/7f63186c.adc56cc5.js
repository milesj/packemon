"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8874],{5318:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return c}});var a=t(7378);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},d=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),m=p(t),c=i,k=m["".concat(s,".").concat(c)]||m[c]||u[c]||r;return t?a.createElement(k,l(l({ref:n},d),{},{components:t})):a.createElement(k,l({ref:n},d))}));function c(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,l=new Array(r);l[0]=m;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o.mdxType="string"==typeof e?e:i,l[1]=o;for(var p=2;p<r;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},6732:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return d},default:function(){return m}});var a=t(5773),i=t(808),r=(t(7378),t(5318)),l=["components"],o={title:"Build",sidebar_label:"build"},s=void 0,p={unversionedId:"build",id:"build",title:"Build",description:"Packemon was primarily designed and engineered for building packages. But what is building you ask?",source:"@site/docs/build.md",sourceDirName:".",slug:"/build",permalink:"/docs/build",editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/build.md",tags:[],version:"current",frontMatter:{title:"Build",sidebar_label:"build"},sidebar:"docs",previous:{title:"ECMAScript first",permalink:"/docs/esm"},next:{title:"clean",permalink:"/docs/clean"}},d=[{value:"Options",id:"options",children:[],level:2},{value:"How it works",id:"how-it-works",children:[],level:2}],u={toc:d};function m(e){var n=e.components,t=(0,i.Z)(e,l);return(0,r.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Packemon was primarily designed and engineered for building packages. But what is building you ask?\nBuilding is the process of parsing, transforming, and bundling a package's source code into\ndistributable and consumable files for npm, using community favorite tools like ",(0,r.kt)("a",{parentName:"p",href:"https://babeljs.io"},"Babel")," and\n",(0,r.kt)("a",{parentName:"p",href:"https://rollupjs.org"},"Rollup"),"."),(0,r.kt)("p",null,"With that being said, the ",(0,r.kt)("inlineCode",{parentName:"p"},"build")," command can be used to build all packages in a project according\nto their configured build targets (platform, formats, etc)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n    "scripts": {\n        "build": "packemon build --addEngines"\n    }\n}\n')),(0,r.kt)("h2",{id:"options"},"Options"),(0,r.kt)("p",null,"Build supports the following command line options."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--addEngines")," - Add Node.js and npm ",(0,r.kt)("inlineCode",{parentName:"li"},"engine")," versions to each ",(0,r.kt)("inlineCode",{parentName:"li"},"package.json")," when ",(0,r.kt)("inlineCode",{parentName:"li"},"platform")," is\n",(0,r.kt)("inlineCode",{parentName:"li"},"node"),". Uses the ",(0,r.kt)("inlineCode",{parentName:"li"},"support")," setting to determine the version range."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--addExports")," - Add ",(0,r.kt)("inlineCode",{parentName:"li"},"exports")," fields to each ",(0,r.kt)("inlineCode",{parentName:"li"},"package.json"),", based on ",(0,r.kt)("inlineCode",{parentName:"li"},"api"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"bundle"),", and\n",(0,r.kt)("inlineCode",{parentName:"li"},"inputs"),". This is an experimental Node.js feature and may not work correctly\n(",(0,r.kt)("a",{parentName:"li",href:"https://nodejs.org/api/packages.html#packages_package_entry_points"},"more information"),")."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--addFiles")," - Add ",(0,r.kt)("inlineCode",{parentName:"li"},"files")," whitelist entries to each ",(0,r.kt)("inlineCode",{parentName:"li"},"package.json"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--analyze")," - Analyze and visualize all generated builds. Will open a browser visualization for\neach bundle in one of the following formats.",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"sunburst")," - Displays an inner circle surrounded by rings of deeper hierarchy levels."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"treemap")," - Displays hierarchy levels as top-level and nested rectangles of varying size."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"network")," - Displays files as nodes with the relationship between files."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--concurrency")," - Number of builds to run in parallel. Defaults to operating system CPU count."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--declaration")," - Generate TypeScript declarations for each package. Accepts one of the following\nvalues.",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"standard")," - Generates multiple ",(0,r.kt)("inlineCode",{parentName:"li"},"d.ts")," files with ",(0,r.kt)("inlineCode",{parentName:"li"},"tsc"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"api")," - Generates a single ",(0,r.kt)("inlineCode",{parentName:"li"},"d.ts")," file for each input. Uses\n",(0,r.kt)("a",{parentName:"li",href:"https://www.npmjs.com/package/@microsoft/api-extractor"},"@microsoft/api-extractor")," to ",(0,r.kt)("em",{parentName:"li"},"only"),"\ngenerate the public API. ",(0,r.kt)("em",{parentName:"li"},"(NOTE: this is quite slow)")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--declarationConfig")," - Path to a custom ",(0,r.kt)("inlineCode",{parentName:"li"},"tsconfig")," for declaration building."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--filter")," - Filter packages to build based on their name in ",(0,r.kt)("inlineCode",{parentName:"li"},"package.json"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--formats"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"-f")," - Only generate specific output ",(0,r.kt)("inlineCode",{parentName:"li"},"format"),"s."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--platforms"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"-p")," - Only target specific ",(0,r.kt)("inlineCode",{parentName:"li"},"platform"),"s."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--skipPrivate")," - Skip ",(0,r.kt)("inlineCode",{parentName:"li"},"private")," packages from being built."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"--timeout")," - Timeout in milliseconds before a build is cancelled. Defaults to no timeout.")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"All filtering options support standard patterns (",(0,r.kt)("inlineCode",{parentName:"p"},"foo-*"),"), comma separated lists (",(0,r.kt)("inlineCode",{parentName:"p"},"foo,bar"),"), or\nboth.")),(0,r.kt)("h2",{id:"how-it-works"},"How it works"),(0,r.kt)("p",null,"When the build process is ran, Packemon will find all viable packages within the current project and\ngenerate build artifacts. A build artifact is an output file that ",(0,r.kt)("em",{parentName:"p"},"will be")," distributed with the npm\npackage, but ",(0,r.kt)("em",{parentName:"p"},"will ",(0,r.kt)("strong",{parentName:"em"},"not")," be")," committed to the project (ideally git ignored)."),(0,r.kt)("p",null,"To demonstrate this, let's assume we have a package with the following folder structure and file\ncontents (not exhaustive)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 src/\n|   \u251c\u2500\u2500 index.ts\n|   \u2514\u2500\u2500 *.ts\n\u251c\u2500\u2500 tests/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n    "name": "package",\n    "packemon": {\n        "inputs": { "index": "src/index.ts" },\n        "platform": ["node", "browser"],\n        "formats": ["lib", "esm", "umd"],\n        "namespace": "Example"\n    }\n}\n')),(0,r.kt)("p",null,"Based on the package configuration above, our build will target both Node.js and web browsers, while\ngenerating multiple ",(0,r.kt)("inlineCode",{parentName:"p"},"index")," outputs across both platforms. The resulting folder structure will look\nlike the following (when also using ",(0,r.kt)("inlineCode",{parentName:"p"},"--declaration"),")."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 dts/\n|   \u2514\u2500\u2500 index.d.ts\n\u251c\u2500\u2500 esm/\n|   \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 lib/\n|   \u2514\u2500\u2500 browser/index.js\n|   \u2514\u2500\u2500 node/index.js\n\u251c\u2500\u2500 src/\n|   \u251c\u2500\u2500 index.ts\n|   \u2514\u2500\u2500 *.ts\n\u251c\u2500\u2500 tests/\n\u251c\u2500\u2500 umd/\n|   \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")),(0,r.kt)("p",null,"Furthermore, the ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," will automatically be updated with our build artifact entry points\nand files list, as demonstrated below. This can further be expanded upon using the ",(0,r.kt)("inlineCode",{parentName:"p"},"--addEngines"),",\n",(0,r.kt)("inlineCode",{parentName:"p"},"--addExports"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"--addFiles")," options."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n    "name": "package",\n    "main": "./lib/index.js",\n    "module": "./esm/index.js",\n    "browser": "./umd/index.js",\n    "types": "./dts/index.d.ts",\n    "files": ["dts/", "esm/", "lib/", "src/", "umd/"],\n    "packemon": {\n        "inputs": { "index": "src/index.ts" },\n        "platform": ["node", "browser"],\n        "formats": ["lib", "esm", "umd"],\n        "namespace": "Example"\n    }\n}\n')),(0,r.kt)("p",null,"Amazing, we now have self-contained and tree-shaken build artifacts for consumption. However, to\nensure ",(0,r.kt)("em",{parentName:"p"},"only")," build artifacts are packaged and distributed to npm, we rely on the ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json"),"\n",(0,r.kt)("inlineCode",{parentName:"p"},"files")," property. Based on the list above, the files published to npm would be the following (pretty\nmuch everything except tests)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 dts/\n\u251c\u2500\u2500 esm/\n\u251c\u2500\u2500 lib/\n\u251c\u2500\u2500 src/\n\u251c\u2500\u2500 umd/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Why are source files published? For source maps! Packemon will always generate source maps\nregardless of format, and the ",(0,r.kt)("inlineCode",{parentName:"p"},"src")," directory is necessary for proper linking.")))}m.isMDXComponent=!0}}]);