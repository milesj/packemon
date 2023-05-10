"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[446],{5318:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return k}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=s(n),c=r,k=m["".concat(p,".").concat(c)]||m[c]||d[c]||l;return n?a.createElement(k,i(i({ref:t},u),{},{components:n})):a.createElement(k,i({ref:t},u))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=c;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[m]="string"==typeof e?e:r,i[1]=o;for(var s=2;s<l;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},1226:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return p},default:function(){return k},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return m}});var a=n(5773),r=n(808),l=(n(7378),n(5318)),i=["components"],o={title:"Package configuration"},p=void 0,s={unversionedId:"config",id:"config",title:"Package configuration",description:"To configure a package, add a packemon block to their package.json, with any of the following",source:"@site/docs/config.md",sourceDirName:".",slug:"/config",permalink:"/docs/config",draft:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/config.md",tags:[],version:"current",frontMatter:{title:"Package configuration"},sidebar:"docs",previous:{title:"Features & optimizations",permalink:"/docs/features"},next:{title:"Experimental swc support",permalink:"/docs/swc"}},u={},m=[{value:"Platforms",id:"platforms",level:2},{value:"Support",id:"support",level:2},{value:"Legend",id:"legend",level:3},{value:"Formats",id:"formats",level:2},{value:"Browser",id:"browser",level:3},{value:"Electron",id:"electron",level:3},{value:"Native",id:"native",level:3},{value:"Node",id:"node",level:3},{value:"Inputs",id:"inputs",level:2},{value:"Externals",id:"externals",level:2},{value:"API",id:"api",level:2},{value:"Bundle",id:"bundle",level:2},{value:"Namespace",id:"namespace",level:2}],d={toc:m},c="wrapper";function k(e){var t=e.components,n=(0,r.Z)(e,i);return(0,l.kt)(c,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"To configure a package, add a ",(0,l.kt)("inlineCode",{parentName:"p"},"packemon")," block to their ",(0,l.kt)("inlineCode",{parentName:"p"},"package.json"),", with any of the following\noptional options. We suggest defining a platform at minimum."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n  "name": "package",\n  "packemon": {\n    "platform": "node"\n  }\n}\n')),(0,l.kt)("p",null,"If you would like to support granular combinations of platforms, its formats, and supported\nenvironments, you may pass an array of options to ",(0,l.kt)("inlineCode",{parentName:"p"},"packemon"),". This is an advanced feature, so use\nwith caution."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n  "name": "package",\n  "packemon": [\n    {\n      "inputs": { "index": "src/index.ts" },\n      "platform": "node"\n    },\n    {\n      "inputs": { "web": "src/web.ts" },\n      "platform": "browser",\n      "support": "current"\n    },\n    {\n      "inputs": { "node": "src/node.mjs" },\n      "format": "mjs",\n      "platform": "node",\n      "support": "experimental"\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"platforms"},"Platforms"),(0,l.kt)("p",null,"The platform in which built code will be ran."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"browser")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - Web browsers on desktop and mobile."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"electron")," - Electron applications."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"native")," - Native devices, primarily for React Native."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"node")," - Node.js runtime.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "platform": "browser"\n}\n')),(0,l.kt)("p",null,"To support multiple platforms, pass an array."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "platform": ["browser", "node"]\n}\n')),(0,l.kt)("h2",{id:"support"},"Support"),(0,l.kt)("p",null,"The supported environment and or version for the configured platform(s)."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"legacy")," - An unsupported version. Only exists for legacy projects and systems."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"stable")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - The oldest supported version, typically a version in LTS maintenance mode."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current")," - The current supported LTS version."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"experimental")," - The newest version, typically not yet released for LTS. Is experimental or\nunstable.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "support": "current"\n}\n')),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"We suggest leaving this setting at ",(0,l.kt)("inlineCode",{parentName:"p"},"stable")," for all libraries, as it offers the widest range of\nsupport for consumers.")),(0,l.kt)("h3",{id:"legend"},"Legend"),(0,l.kt)("p",null,"The supported environments above map to the following platform targets."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null}),(0,l.kt)("th",{parentName:"tr",align:null},"Legacy"),(0,l.kt)("th",{parentName:"tr",align:null},"Stable"),(0,l.kt)("th",{parentName:"tr",align:null},"Current"),(0,l.kt)("th",{parentName:"tr",align:null},"Experimental"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Browser"),(0,l.kt)("td",{parentName:"tr",align:null},">= 0.10%, not IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},"defaults, not IE 11"),(0,l.kt)("td",{parentName:"tr",align:null},">= 1%, not dead"),(0,l.kt)("td",{parentName:"tr",align:null},"last 2 chrome versions")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Electron"),(0,l.kt)("td",{parentName:"tr",align:null},">= 7.0.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 11.0.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 16.0.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 21.0.0")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Native"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 13"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 14"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 15"),(0,l.kt)("td",{parentName:"tr",align:null},">= iOS 16")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Node"),(0,l.kt)("td",{parentName:"tr",align:null},">= 14.15.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 16.12.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 18.12.0"),(0,l.kt)("td",{parentName:"tr",align:null},">= 19.0.0")))),(0,l.kt)("h2",{id:"formats"},"Formats"),(0,l.kt)("p",null,"The output format for each platform build target. Each format will create a folder relative to the\nproject root that will house the built files."),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Packemon defaults to an ECMAScript format if available.")),(0,l.kt)("h3",{id:"browser"},"Browser"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"lib")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/modules.html"},"CommonJS")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. For\nstandard JavaScript and TypeScript projects."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"esm")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - ECMAScript module output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. The same as ",(0,l.kt)("inlineCode",{parentName:"li"},"lib"),", but\nuses ",(0,l.kt)("inlineCode",{parentName:"li"},"import/export")," instead of ",(0,l.kt)("inlineCode",{parentName:"li"},"require"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"umd")," - Universal Module Definition output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. Meant to be used directly\nin the browser (via CDN) instead of being bundled. Will be automatically enabled if\n",(0,l.kt)("a",{parentName:"li",href:"#namespace"},"namespace")," is provided and using default formats.")),(0,l.kt)("h3",{id:"electron"},"Electron"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"lib")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/modules.html"},"CommonJS")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. For\nstandard JavaScript and TypeScript projects."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"esm")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - ECMAScript module output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. The same as ",(0,l.kt)("inlineCode",{parentName:"li"},"lib"),", but\nuses ",(0,l.kt)("inlineCode",{parentName:"li"},"import/export")," instead of ",(0,l.kt)("inlineCode",{parentName:"li"},"require"),".")),(0,l.kt)("h3",{id:"native"},"Native"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"lib")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/modules.html"},"CommonJS")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file\nextension. For standard JavaScript and TypeScript projects. ",(0,l.kt)("em",{parentName:"li"},"This is the only format supported by\nReact Native and Metro."))),(0,l.kt)("h3",{id:"node"},"Node"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"lib")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/modules.html"},"CommonJS")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".js")," file extension. For\nstandard JavaScript and TypeScript projects."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"cjs")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/modules.html"},"CommonJS")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".cjs")," file extension. Source\nfiles must be written in CommonJS (",(0,l.kt)("inlineCode",{parentName:"li"},".cjs"),") and ",(0,l.kt)("inlineCode",{parentName:"li"},"require")," paths must use trailing extensions. ",(0,l.kt)("em",{parentName:"li"},"Will\nautomatically create ",(0,l.kt)("a",{parentName:"em",href:"/docs/features#automatic-mjs-wrappers-for-cjs-inputs"},(0,l.kt)("inlineCode",{parentName:"a"},".mjs")," wrappers")," for\ninputs.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"mjs")," ",(0,l.kt)("em",{parentName:"li"},"(default)")," - ",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/esm.html"},"ECMAScript module")," output using ",(0,l.kt)("inlineCode",{parentName:"li"},".mjs")," file\nextension. Source files must be written in ESM (",(0,l.kt)("inlineCode",{parentName:"li"},".mjs"),") and ",(0,l.kt)("inlineCode",{parentName:"li"},"import")," paths must use trailing\nextensions.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "format": "lib"\n}\n')),(0,l.kt)("p",null,"To support multiple formats, pass an array."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "format": ["lib", "esm"]\n}\n')),(0,l.kt)("h2",{id:"inputs"},"Inputs"),(0,l.kt)("p",null,"A mapping of entry points for the library (only when ",(0,l.kt)("a",{parentName:"p",href:"#bundle"},"bundling"),"), where the object key is\nthe name of the output file to be built (without extension), and the value is an input source file\nrelative to the package root."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "inputs": {\n    "index": "src/index.ts",\n    "client": "src/client/index.ts",\n    "server": "src/server.ts"\n  }\n}\n')),(0,l.kt)("p",null,"Defaults to ",(0,l.kt)("inlineCode",{parentName:"p"},'{ "index": "src/index.ts" }')," if not defined. If you're ",(0,l.kt)("em",{parentName:"p"},"not")," using TypeScript, you will\nneed to configure this."),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"These inputs can be automatically mapped to ",(0,l.kt)("inlineCode",{parentName:"p"},"package.json")," ",(0,l.kt)("inlineCode",{parentName:"p"},"exports")," using the ",(0,l.kt)("inlineCode",{parentName:"p"},"--addExports")," CLI\noption. Do note that this feature is still experimental.")),(0,l.kt)("h2",{id:"externals"},"Externals"),(0,l.kt)("p",null,"By default, Packemon will denote all ",(0,l.kt)("inlineCode",{parentName:"p"},"package.json")," dependencies (peer, dev, and prod) as Rollup\nexternals. If you need to define custom externals (path aliases, etc), you can utilize the\n",(0,l.kt)("inlineCode",{parentName:"p"},"externals")," option, which accepts a string or an array of strings."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "externals": "some-module-name"\n}\n')),(0,l.kt)("p",null,"Externals can also be provided as regex-strings that will be used with string ",(0,l.kt)("inlineCode",{parentName:"p"},"match()"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "externals": ["@scope/\\\\*"]\n}\n')),(0,l.kt)("h2",{id:"api"},"API"),(0,l.kt)("p",null,"Declares the type of import/export API this package is providing, either ",(0,l.kt)("inlineCode",{parentName:"p"},"public")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"private"),". If\nnot provided, is ",(0,l.kt)("inlineCode",{parentName:"p"},"public")," for ",(0,l.kt)("inlineCode",{parentName:"p"},"node")," platform, but ",(0,l.kt)("inlineCode",{parentName:"p"},"private")," for all other platforms."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Public")," - Allows deep imports, where the import path is a 1:1 to a file system path within the\npackage. When adding ",(0,l.kt)("inlineCode",{parentName:"li"},"exports"),", will use\n",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/packages.html#subpath-patterns"},"subpath export patterns")," that will\nwildcard match any file in the output format."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Private")," - Disallows deep imports, and ",(0,l.kt)("em",{parentName:"li"},"only")," allows index and ",(0,l.kt)("a",{parentName:"li",href:"#inputs"},"inputs")," imports. When\nusing ",(0,l.kt)("inlineCode",{parentName:"li"},"exports"),", inputs will use\n",(0,l.kt)("a",{parentName:"li",href:"https://nodejs.org/api/packages.html#subpath-exports"},"subpath exports")," that are relative from the\npackage index.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "api": "public"\n}\n')),(0,l.kt)("h2",{id:"bundle"},"Bundle"),(0,l.kt)("p",null,"Whether to bundle the source code into a single file for each ",(0,l.kt)("a",{parentName:"p",href:"#inputs"},"input"),". If not provided, is\n",(0,l.kt)("inlineCode",{parentName:"p"},"false")," for ",(0,l.kt)("inlineCode",{parentName:"p"},"node")," platform, but ",(0,l.kt)("inlineCode",{parentName:"p"},"true")," for all other platforms."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "bundle": false\n}\n')),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Prefer the defaults as much as possible. The only time this setting should change is if the\npackage should allow deep imports. For example, a component library.")),(0,l.kt)("h2",{id:"namespace"},"Namespace"),(0,l.kt)("p",null,"For browsers only, this would be the name of the UMD global variable."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "namespace": "Packemon"\n}\n')))}k.isMDXComponent=!0}}]);