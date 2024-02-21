"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2007],{2059:(e,n,s)=>{s.r(n),s.d(n,{contentTitle:()=>o,default:()=>d,frontMatter:()=>l,toc:()=>c});var r=s(2540),i=s(3023);const l={},o=void 0,c=[{value:"Installation",id:"installation",level:2},{value:"Requirements",id:"requirements",level:2},{value:"Transforms",id:"transforms",level:2},{value:"CJS output",id:"cjs-output",level:3},{value:"MJS output",id:"mjs-output",level:3},{value:"How to&#39;s",id:"how-tos",level:2},{value:"What to replace <code>require()</code> with?",id:"what-to-replace-require-with",level:3},{value:"What to replace <code>require.resolve()</code> with?",id:"what-to-replace-requireresolve-with",level:3}];function t(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://github.com/milesj/packemon/actions?query=branch%3Amaster",children:(0,r.jsx)(n.img,{src:"https://github.com/milesj/packemon/workflows/Build/badge.svg",alt:"Build Status"})}),"\n",(0,r.jsx)(n.a,{href:"https://www.npmjs.com/package/babel-plugin-cjs-esm-interop",children:(0,r.jsx)(n.img,{src:"https://badge.fury.io/js/babel-plugin-cjs-esm-interop.svg",alt:"npm version"})})]}),"\n",(0,r.jsxs)(n.p,{children:["Transform the differences between CommonJS code (",(0,r.jsx)(n.code,{children:".js"}),", ",(0,r.jsx)(n.code,{children:".cjs"}),") and ECMAScript module code (",(0,r.jsx)(n.code,{children:".mjs"}),"),\nbased on the\n",(0,r.jsx)(n.a,{href:"https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs",children:"official Node.js documentation"}),"."]}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsxs)(n.p,{children:["We suggest writing your code as ESM (",(0,r.jsx)(n.code,{children:".mjs"}),", ",(0,r.jsx)(n.code,{children:".ts"}),", ",(0,r.jsx)(n.code,{children:".tsx"}),", ",(0,r.jsx)(n.code,{children:".js"})," with module type) and compiling\ndown to CJS instead of the reverse. This means using new syntax like ",(0,r.jsx)(n.code,{children:"import.meta"}),", ",(0,r.jsx)(n.code,{children:"import()"}),",\netc!"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Input: mjs\nconst self = import.meta.url;\n"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Output: cjs\nconst self = __filename;\n"})}),"\n",(0,r.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"yarn add --dev babel-plugin-cjs-esm-interop\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Add the plugin to your root ",(0,r.jsx)(n.code,{children:"babel.config.*"})," file and configure the output ",(0,r.jsx)(n.code,{children:"format"})," option with\neither ",(0,r.jsx)(n.code,{children:"mjs"})," (default) or ",(0,r.jsx)(n.code,{children:"cjs"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"module.exports = {\n  plugins: [['babel-plugin-cjs-esm-interop', { format: 'mjs' }]],\n};\n"})}),"\n",(0,r.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Linux, OSX, Windows"}),"\n",(0,r.jsx)(n.li,{children:"Node 14.15+"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"transforms",children:"Transforms"}),"\n",(0,r.jsx)(n.p,{children:"The following transforms and error handling are applied."}),"\n",(0,r.jsx)(n.h3,{id:"cjs-output",children:"CJS output"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"export"}),", ",(0,r.jsx)(n.code,{children:"export default"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Will throw an error if used."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"import.meta.url"})," -> ",(0,r.jsx)(n.code,{children:"__filename"})," (with ",(0,r.jsx)(n.code,{children:"file://"})," contextually)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"path.dirname(import.meta.url)"})," -> ",(0,r.jsx)(n.code,{children:"__dirname"})," (with ",(0,r.jsx)(n.code,{children:"file://"})," contextually)"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"mjs-output",children:"MJS output"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"require()"}),", ",(0,r.jsx)(n.code,{children:"require.resolve()"}),", ",(0,r.jsx)(n.code,{children:"require.extensions"}),", ",(0,r.jsx)(n.code,{children:"require.cache"}),", ",(0,r.jsx)(n.code,{children:"exports.<name>"}),",\n",(0,r.jsx)(n.code,{children:"module.exports"}),", ",(0,r.jsx)(n.code,{children:"process.env.NODE_PATH"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Will throw an error if used."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"__filename"})," -> ",(0,r.jsx)(n.code,{children:"import.meta.url"})]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"__dirname"})," -> ",(0,r.jsx)(n.code,{children:"path.dirname(import.meta.url)"})]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"how-tos",children:"How to's"}),"\n",(0,r.jsx)(n.p,{children:"If you want to support ESM code, you'll need to move away from certain features, in which you have a\nfew options."}),"\n",(0,r.jsxs)(n.h3,{id:"what-to-replace-require-with",children:["What to replace ",(0,r.jsx)(n.code,{children:"require()"})," with?"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Use ",(0,r.jsx)(n.code,{children:"import()"})," for JS files. Be aware that this is ",(0,r.jsx)(n.em,{children:"async"})," and cannot be used in the module scope\nunless top-level await is supported."]}),"\n",(0,r.jsxs)(n.li,{children:["Use the ",(0,r.jsx)(n.code,{children:"fs"})," module for JSON files: ",(0,r.jsx)(n.code,{children:"JSON.parse(fs.readFileSync(path))"})]}),"\n",(0,r.jsxs)(n.li,{children:["Use ",(0,r.jsx)(n.code,{children:"module.createRequire()"}),", which returns a require-like function you may use.\n",(0,r.jsx)(n.a,{href:"https://nodejs.org/api/module.html#module_module_createrequire_filename",children:"More info"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"what-to-replace-requireresolve-with",children:["What to replace ",(0,r.jsx)(n.code,{children:"require.resolve()"})," with?"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Use the ",(0,r.jsx)(n.a,{href:"https://www.npmjs.com/package/resolve",children:(0,r.jsx)(n.code,{children:"resolve"})})," npm package."]}),"\n",(0,r.jsxs)(n.li,{children:["Use ",(0,r.jsx)(n.code,{children:"module.createRequire()"}),", which returns a require-like function with a resolver you may use.\n",(0,r.jsx)(n.a,{href:"https://nodejs.org/api/module.html#module_module_createrequire_filename",children:"More info"}),"."]}),"\n"]})]})}function d(e){void 0===e&&(e={});const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(t,{...e})}):t(e)}},3023:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>c});var r=s(3696);const i={},l=r.createContext(i);function o(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(l.Provider,{value:n},e.children)}}}]);