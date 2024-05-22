"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3983],{366:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>c});var i=s(2540),t=s(3023);const o={title:"build"},d=void 0,r={id:"build",title:"build",description:"Packemon was primarily designed and engineered for building packages. But what is building you ask?",source:"@site/docs/build.md",sourceDirName:".",slug:"/build",permalink:"/docs/build",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/build.md",tags:[],version:"current",frontMatter:{title:"build"},sidebar:"docs",previous:{title:"ECMAScript first",permalink:"/docs/esm"},next:{title:"build-workspace",permalink:"/docs/build-workspace"}},l={},c=[{value:"Options",id:"options",level:2},{value:"How it works",id:"how-it-works",level:2}];function a(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["Packemon was primarily designed and engineered for building packages. But what is building you ask?\nBuilding is the process of parsing, transforming, and bundling a package's source code into\ndistributable and consumable files for npm, using community favorite tools like ",(0,i.jsx)(n.a,{href:"https://babeljs.io",children:"Babel"})," and\n",(0,i.jsx)(n.a,{href:"https://rollupjs.org",children:"Rollup"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["With that being said, the ",(0,i.jsx)(n.code,{children:"build"})," command can be used to build a single package, in the current\nworking directory, according to their configured build targets (platform, formats, etc)."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",metastring:'title="package.json"',children:'{\n  "scripts": {\n    "build": "packemon build --addEngines"\n  }\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,i.jsx)(n.p,{children:"Build supports the following command line options."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--addEngines"})," - Add Node.js ",(0,i.jsx)(n.code,{children:"engine"})," versions to ",(0,i.jsx)(n.code,{children:"package.json"})," when ",(0,i.jsx)(n.code,{children:"platform"})," is ",(0,i.jsx)(n.code,{children:"node"}),". Uses\nthe ",(0,i.jsx)(n.code,{children:"support"})," setting to determine the version range."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--addExports"})," - Add ",(0,i.jsx)(n.code,{children:"exports"})," fields to ",(0,i.jsx)(n.code,{children:"package.json"}),", based on ",(0,i.jsx)(n.code,{children:"api"}),", ",(0,i.jsx)(n.code,{children:"bundle"}),", and ",(0,i.jsx)(n.code,{children:"inputs"}),".\nThis is an experimental Node.js feature and may not work correctly\n(",(0,i.jsx)(n.a,{href:"https://nodejs.org/api/packages.html#packages_package_entry_points",children:"more information"}),")."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--addFiles"})," - Add ",(0,i.jsx)(n.code,{children:"files"})," whitelist entries to ",(0,i.jsx)(n.code,{children:"package.json"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--concurrency"})," - Number of builds to run in parallel. Defaults to operating system CPU count."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--declaration"})," - Generate TypeScript declarations for the package."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--loadConfigs"})," - Search and load config files for customizing Babel and Rollup."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--skipPrivate"})," - Skip ",(0,i.jsx)(n.code,{children:"private"})," packages from being built."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--stamp"})," - Stamp the ",(0,i.jsx)(n.code,{children:"package.json"})," with a release timestamp."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"--timeout"})," - Timeout in milliseconds before a build is cancelled. Defaults to no timeout."]}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["All filtering options support standard patterns (",(0,i.jsx)(n.code,{children:"foo-*"}),"), comma separated lists (",(0,i.jsx)(n.code,{children:"foo,bar"}),"), or\nboth."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"how-it-works",children:"How it works"}),"\n",(0,i.jsxs)(n.p,{children:["When the build process is ran, Packemon will find a viable package within the current directry and\ngenerate build artifacts. A build artifact is an output file that ",(0,i.jsx)(n.em,{children:"will be"})," distributed with the npm\npackage, but ",(0,i.jsxs)(n.em,{children:["will ",(0,i.jsx)(n.strong,{children:"not"})," be"]})," committed to the project (ideally git ignored)."]}),"\n",(0,i.jsx)(n.p,{children:"To demonstrate this, let's assume we have a package with the following folder structure and file\ncontents (not exhaustive)."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"/\n\u251c\u2500\u2500 src/\n|   \u251c\u2500\u2500 index.ts\n|   \u2514\u2500\u2500 *.ts\n\u251c\u2500\u2500 tests/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",metastring:'title="package.json"',children:'{\n  "name": "package",\n  "packemon": {\n    "inputs": { "index": "src/index.ts" },\n    "platform": ["node", "browser"],\n    "format": "esm",\n    "namespace": "Example"\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Based on the package configuration above, our build will target both Node.js and web browsers, while\ngenerating multiple ",(0,i.jsx)(n.code,{children:"index"})," outputs across both platforms. The resulting folder structure will look\nlike the following (when also using ",(0,i.jsx)(n.code,{children:"--declaration"}),")."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"/\n\u251c\u2500\u2500 esm/\n|   \u251c\u2500\u2500 index.d.ts\n|   \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 lib/\n|   \u251c\u2500\u2500 index.d.ts\n|   \u2514\u2500\u2500 browser/index.js\n|   \u2514\u2500\u2500 node/index.js\n\u251c\u2500\u2500 src/\n|   \u251c\u2500\u2500 index.ts\n|   \u2514\u2500\u2500 *.ts\n\u251c\u2500\u2500 tests/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Furthermore, the ",(0,i.jsx)(n.code,{children:"package.json"})," will automatically be updated with our build artifact entry points\nand files list, as demonstrated below. This can further be expanded upon using the ",(0,i.jsx)(n.code,{children:"--addEngines"}),",\n",(0,i.jsx)(n.code,{children:"--addExports"}),", and ",(0,i.jsx)(n.code,{children:"--addFiles"})," options."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",metastring:'title="package.json"',children:'{\n  "name": "package",\n  "main": "./lib/index.js",\n  "module": "./esm/index.js",\n  "types": "./lib/index.d.ts",\n  "files": ["esm/**/*", "lib/**/*", "src/**/*"],\n  "packemon": {\n    "inputs": { "index": "src/index.ts" },\n    "platform": ["node", "browser"],\n    "format": "esm",\n    "namespace": "Example"\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Amazing, we now have self-contained and tree-shaken build artifacts for consumption. However, to\nensure ",(0,i.jsx)(n.em,{children:"only"})," build artifacts are packaged and distributed to npm, we rely on the ",(0,i.jsx)(n.code,{children:"package.json"}),"\n",(0,i.jsx)(n.code,{children:"files"})," property. Based on the list above, the files published to npm would be the following (pretty\nmuch everything except tests)."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"/\n\u251c\u2500\u2500 esm/\n\u251c\u2500\u2500 lib/\n\u251c\u2500\u2500 src/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Why are source files published? For source maps! Packemon will always generate source maps for\nnon-node formats, and the ",(0,i.jsx)(n.code,{children:"src"})," directory is necessary for proper linking."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},3023:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>r});var i=s(3696);const t={},o=i.createContext(t);function d(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);