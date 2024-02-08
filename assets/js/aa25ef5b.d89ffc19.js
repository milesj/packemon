"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[216],{1568:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>d,metadata:()=>o,toc:()=>a});var r=s(1948),t=s(3460);const d={title:"2.0 migration",sidebar_label:"2.0"},i=void 0,o={id:"migrate/2.0",title:"2.0 migration",description:"Shifted Node.js/npm versions and dropped v10 support",source:"@site/docs/migrate/2.0.md",sourceDirName:"migrate",slug:"/migrate/2.0",permalink:"/docs/migrate/2.0",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/migrate/2.0.md",tags:[],version:"current",frontMatter:{title:"2.0 migration",sidebar_label:"2.0"},sidebar:"docs",previous:{title:"3.0",permalink:"/docs/migrate/3.0"}},l={},a=[{value:"Shifted Node.js/npm versions and dropped v10 support",id:"shifted-nodejsnpm-versions-and-dropped-v10-support",level:2},{value:"Before",id:"before",level:4},{value:"After",id:"after",level:4},{value:"Shifted browser targets and dropped IE and iOS &lt; 12 support",id:"shifted-browser-targets-and-dropped-ie-and-ios--12-support",level:2},{value:"Before",id:"before-1",level:4},{value:"After",id:"after-1",level:4},{value:"Removed multiple <code>format</code> support when configuring a package",id:"removed-multiple-format-support-when-configuring-a-package",level:2},{value:"Removed <code>api</code> support from <code>--declaration</code>",id:"removed-api-support-from---declaration",level:2},{value:"Removed the <code>--analyze</code> option",id:"removed-the---analyze-option",level:2},{value:"Removed <code>.babelrc</code> support within each package",id:"removed-babelrc-support-within-each-package",level:2},{value:"Output of formats <code>esm</code> and <code>mjs</code> are now considered a module",id:"output-of-formats-esm-and-mjs-are-now-considered-a-module",level:2}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.M)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"shifted-nodejsnpm-versions-and-dropped-v10-support",children:"Shifted Node.js/npm versions and dropped v10 support"}),"\n",(0,r.jsxs)(n.p,{children:["Since Node.js v12 has reached ",(0,r.jsx)(n.a,{href:"https://nodejs.org/en/about/releases/",children:"end of life"}),", Packemon now\nrequires at minimum v14.15 and above to run. Furthermore, we're entirely dropping v10 support, and\nshifting v12 into ",(0,r.jsx)(n.code,{children:"legacy"}),", v14 into ",(0,r.jsx)(n.code,{children:"stable"}),", v16 into ",(0,r.jsx)(n.code,{children:"current"}),", and the new v18 into\n",(0,r.jsx)(n.code,{children:"experimental"}),". As part of this process, we are also bumping minimum requirements and coupled npm\nversions."]}),"\n",(0,r.jsxs)(n.p,{children:["The updated ",(0,r.jsx)(n.a,{href:"/docs/config#support",children:(0,r.jsx)(n.code,{children:"support"})})," compatibility table is as follows."]}),"\n",(0,r.jsx)(n.h4,{id:"before",children:"Before"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{}),(0,r.jsx)(n.th,{children:"Legacy"}),(0,r.jsx)(n.th,{children:"Stable"}),(0,r.jsx)(n.th,{children:"Current"}),(0,r.jsx)(n.th,{children:"Experimental"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Node"}),(0,r.jsx)(n.td,{children:">= 10.3.0"}),(0,r.jsx)(n.td,{children:">= 12.17.0"}),(0,r.jsx)(n.td,{children:">= 14.16.0"}),(0,r.jsx)(n.td,{children:">= 16.0.0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"npm"}),(0,r.jsx)(n.td,{children:">= 6.1.0"}),(0,r.jsx)(n.td,{children:">= 6.3.0"}),(0,r.jsx)(n.td,{children:">= 6.14.0"}),(0,r.jsx)(n.td,{children:">= 7.0.0"})]})]})]}),"\n",(0,r.jsx)(n.h4,{id:"after",children:"After"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{}),(0,r.jsx)(n.th,{children:"Legacy"}),(0,r.jsx)(n.th,{children:"Stable"}),(0,r.jsx)(n.th,{children:"Current"}),(0,r.jsx)(n.th,{children:"Experimental"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Node"}),(0,r.jsx)(n.td,{children:">= 12.22.0"}),(0,r.jsx)(n.td,{children:">= 14.15.0"}),(0,r.jsx)(n.td,{children:">= 16.12.0"}),(0,r.jsx)(n.td,{children:">= 18.0.0"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"npm"}),(0,r.jsx)(n.td,{children:">= 6.14.0"}),(0,r.jsx)(n.td,{children:">= 6.14.0"}),(0,r.jsx)(n.td,{children:">= 8.1.0"}),(0,r.jsx)(n.td,{children:">= 8.5.0"})]})]})]}),"\n",(0,r.jsx)(n.p,{children:"Notable changes:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"v14.15 is the start of LTS"}),"\n",(0,r.jsxs)(n.li,{children:["v14.19 supports\n",(0,r.jsx)(n.a,{href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md#corepack",children:"Corepack"})]}),"\n",(0,r.jsxs)(n.li,{children:["v16.12 supports new\n",(0,r.jsx)(n.a,{href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V16.md#experimental-esm-loader-hooks-api",children:"ESM loader hooks"})]}),"\n",(0,r.jsxs)(n.li,{children:["v18 supports native fetch and\n",(0,r.jsx)(n.a,{href:"https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V17.md#openssl-30",children:"OpenSSL 3.0"})]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"shifted-browser-targets-and-dropped-ie-and-ios--12-support",children:"Shifted browser targets and dropped IE and iOS < 12 support"}),"\n",(0,r.jsxs)(n.p,{children:["With Node.js versions changing (above), it was due time to audit the browser targets as well, and as\nsuch, we have dropped Internet Explorer support entirely. This only affected ",(0,r.jsx)(n.code,{children:"legacy"})," support."]}),"\n",(0,r.jsx)(n.p,{children:"We also dropped iOS 8-11 support, as these versions are more than 5 years old. The minimum supported\nversion is now iOS 12, which was released in 2018."}),"\n",(0,r.jsxs)(n.p,{children:["The updated ",(0,r.jsx)(n.a,{href:"/docs/config#support",children:(0,r.jsx)(n.code,{children:"support"})})," compatibility table is as follows."]}),"\n",(0,r.jsx)(n.h4,{id:"before-1",children:"Before"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{}),(0,r.jsx)(n.th,{children:"Legacy"}),(0,r.jsx)(n.th,{children:"Stable"}),(0,r.jsx)(n.th,{children:"Current"}),(0,r.jsx)(n.th,{children:"Experimental"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Browser"}),(0,r.jsx)(n.td,{children:">= IE 11"}),(0,r.jsx)(n.td,{children:"defaults, not IE 11"}),(0,r.jsx)(n.td,{children:"> 1%, not dead"}),(0,r.jsx)(n.td,{children:"last 2 chrome versions"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Native"}),(0,r.jsx)(n.td,{children:">= iOS 8"}),(0,r.jsx)(n.td,{children:">= iOS 10"}),(0,r.jsx)(n.td,{children:">= iOS 12"}),(0,r.jsx)(n.td,{children:">= iOS 14"})]})]})]}),"\n",(0,r.jsx)(n.h4,{id:"after-1",children:"After"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{}),(0,r.jsx)(n.th,{children:"Legacy"}),(0,r.jsx)(n.th,{children:"Stable"}),(0,r.jsx)(n.th,{children:"Current"}),(0,r.jsx)(n.th,{children:"Experimental"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Browser"}),(0,r.jsx)(n.td,{children:">= 0.10%, not IE 11"}),(0,r.jsx)(n.td,{children:"defaults, not IE 11"}),(0,r.jsx)(n.td,{children:">= 1%, not dead"}),(0,r.jsx)(n.td,{children:"last 2 chrome versions"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Native"}),(0,r.jsx)(n.td,{children:">= iOS 12"}),(0,r.jsx)(n.td,{children:">= iOS 13"}),(0,r.jsx)(n.td,{children:">= iOS 14"}),(0,r.jsx)(n.td,{children:">= iOS 15"})]})]})]}),"\n",(0,r.jsxs)(n.p,{children:["A major notable change is that all targets are now on ES2015, which means you should see ",(0,r.jsx)(n.code,{children:"const"}),"\nusage, arrow functions, and more (we no longer downlevel). If this causes issues, you should ask\nyourself why you still need 7 year old syntax."]}),"\n",(0,r.jsxs)(n.h2,{id:"removed-multiple-format-support-when-configuring-a-package",children:["Removed multiple ",(0,r.jsx)(n.code,{children:"format"})," support when configuring a package"]}),"\n",(0,r.jsxs)(n.p,{children:["Previously it was possible to pass a list of formats to the ",(0,r.jsx)(n.a,{href:"/docs/config#formats",children:(0,r.jsx)(n.code,{children:"format"})}),"\nsetting, and Packemon will build them all (according to the platform). For example, a Node.js\nlibrary could have built ",(0,r.jsx)(n.code,{children:"cjs"})," and ",(0,r.jsx)(n.code,{children:"mjs"})," versions. However, in an effort to reduce the\n",(0,r.jsx)(n.a,{href:"https://nodejs.org/api/packages.html#dual-commonjses-module-packages",children:"dual package hazard problem"}),",\nPackemon now only supports a single format."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'// Before\n{\n  "format": ["cjs", "mjs"]\n}\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'// After\n{\n  "format": "mjs"\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["With that being said, you can work around this restriction by passing an\n",(0,r.jsx)(n.a,{href:"../config",children:"array of configuration"})," objects to the ",(0,r.jsx)(n.code,{children:"packemon"})," setting. We ",(0,r.jsx)(n.em,{children:"do not"})," guarantee this\nwill work correctly."]}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsxs)(n.p,{children:["When choosing the ",(0,r.jsx)(n.code,{children:"esm"})," format, Packemon will automatically build a ",(0,r.jsx)(n.code,{children:"lib"})," format. This is an\nexception for backwards compatibility until the Node.js ecosystem is fully on modules."]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"removed-api-support-from---declaration",children:["Removed ",(0,r.jsx)(n.code,{children:"api"})," support from ",(0,r.jsx)(n.code,{children:"--declaration"})]}),"\n",(0,r.jsxs)(n.p,{children:["We removed support for the ",(0,r.jsx)(n.code,{children:"api"})," option, which uses\n",(0,r.jsx)(n.a,{href:"https://api-extractor.com/",children:"@microsoft/api-extractor"})," to generate a single ",(0,r.jsx)(n.code,{children:".d.ts"})," file. This\nfeature was rarely used, overcomplicated the implementation, and had weird edge cases that we\ncouldn't solve on our end."]}),"\n",(0,r.jsxs)(n.p,{children:["Because of this change, the ",(0,r.jsx)(n.code,{children:"--declaration"})," option on the command line is now a flag with no value."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"# Before\n--declaration standard\n--declaration api\n\n# After\n--declaration\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"removed-the---analyze-option",children:["Removed the ",(0,r.jsx)(n.code,{children:"--analyze"})," option"]}),"\n",(0,r.jsxs)(n.p,{children:["Since Packemon now supports ",(0,r.jsx)(n.a,{href:"../advanced#customizing-babel-swc-and-rollup",children:"customizing the Rollup config"}),", the\n",(0,r.jsx)(n.a,{href:"https://github.com/btd/rollup-plugin-visualizer",children:"rollup-plugin-visualizer"})," plugin can now be\nimplemented in user-land, and doesn't need to exist in core."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"const path = require('path');\nconst visualizer = require('rollup-plugin-visualizer');\n\nmodule.exports = {\n  rollupInput(config) {\n    config.plugins.push(\n      visualizer((outputOptions) => ({\n        filename: path.join(outputOptions.dir, 'stats.html'),\n        gzipSize: true,\n        open: true,\n        sourcemap: true,\n        template: 'treemap',\n      })),\n    );\n  },\n};\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"removed-babelrc-support-within-each-package",children:["Removed ",(0,r.jsx)(n.code,{children:".babelrc"})," support within each package"]}),"\n",(0,r.jsxs)(n.p,{children:["Packemon historically supported ",(0,r.jsx)(n.code,{children:".babelrc"})," files within packages as a means to allow custom Babel\nplugins and presets per package. However, this wasn't really documented, and since we now support\n",(0,r.jsx)(n.a,{href:"../advanced#customizing-babel-swc-and-rollup",children:"Packemon config files"}),", we suggest using that instead."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",metastring:'title="packages/foo/.babelrc"',children:'// Before\n{\n  "plugins": ["babel-plugin-formatjs"]\n}\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",metastring:'title="packages/foo/.packemon.js"',children:"// After\nmodule.exports = {\n  babelOutput(config) {\n    config.plugins.push('babel-plugin-formatjs');\n  },\n};\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"output-of-formats-esm-and-mjs-are-now-considered-a-module",children:["Output of formats ",(0,r.jsx)(n.code,{children:"esm"})," and ",(0,r.jsx)(n.code,{children:"mjs"})," are now considered a module"]}),"\n",(0,r.jsxs)(n.p,{children:["While this change isn't technically breaking, and more of an accuracy fix towards the specification,\nall files generated through the ",(0,r.jsx)(n.code,{children:"esm"})," and ",(0,r.jsx)(n.code,{children:"mjs"})," formats are now considered modules (using\n",(0,r.jsx)(n.a,{href:"https://rollupjs.org/guide/en/#outputgeneratedcode",children:(0,r.jsx)(n.code,{children:"generatedCode.symbols"})}),"). This is in addition\nto the ",(0,r.jsx)(n.code,{children:"__esModule"})," property that is already being defined."]}),"\n",(0,r.jsx)(n.p,{children:'What this means, is that any imported value within a module context that is stringified will now\nreturn "Module". This can mainly be used for feature detection.'})]})}function h(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},3460:(e,n,s)=>{s.d(n,{I:()=>o,M:()=>i});var r=s(6952);const t={},d=r.createContext(t);function i(e){const n=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),r.createElement(d.Provider,{value:n},e.children)}}}]);