"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2569],{2062:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var s=t(2540),r=t(3023);const i={title:"4.0 migration",sidebar_label:"4.0"},d=void 0,o={id:"migrate/4.0",title:"4.0 migration",description:"Shifted supported platform versions",source:"@site/docs/migrate/4.0.md",sourceDirName:"migrate",slug:"/migrate/4.0",permalink:"/docs/migrate/4.0",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/migrate/4.0.md",tags:[],version:"current",frontMatter:{title:"4.0 migration",sidebar_label:"4.0"},sidebar:"docs",previous:{title:"Advanced",permalink:"/docs/advanced"},next:{title:"3.0",permalink:"/docs/migrate/3.0"}},l={},c=[{value:"Shifted supported platform versions",id:"shifted-supported-platform-versions",level:2},{value:"Before",id:"before",level:4},{value:"After",id:"after",level:4},{value:"Packemon is now ESM only",id:"packemon-is-now-esm-only",level:2},{value:"React Native now supports <code>esm</code> target",id:"react-native-now-supports-esm-target",level:2},{value:"Streamlined exports and the <code>default</code> condition",id:"streamlined-exports-and-the-default-condition",level:2}];function a(e){const n={a:"a",code:"code",em:"em",h2:"h2",h4:"h4",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"shifted-supported-platform-versions",children:"Shifted supported platform versions"}),"\n",(0,s.jsxs)(n.p,{children:["Since Node.js v16 has reached ",(0,s.jsx)(n.a,{href:"https://nodejs.org/en/about/releases/",children:"end of life"}),", Packemon now\nrequires at minimum v18.12 and above to run. Furthermore, we're entirely dropping v14 support, and\nshifting v16 into ",(0,s.jsx)(n.code,{children:"legacy"}),", v18 into ",(0,s.jsx)(n.code,{children:"stable"}),", v20 into ",(0,s.jsx)(n.code,{children:"current"}),", and the new v21 into\n",(0,s.jsx)(n.code,{children:"experimental"}),". As part of this process, we are also bumping minimum requirements and coupled npm\nversions."]}),"\n",(0,s.jsxs)(n.p,{children:["The updated ",(0,s.jsx)(n.a,{href:"/docs/config#support",children:(0,s.jsx)(n.code,{children:"support"})})," compatibility table is as follows."]}),"\n",(0,s.jsx)(n.h4,{id:"before",children:"Before"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{}),(0,s.jsx)(n.th,{children:"Legacy"}),(0,s.jsx)(n.th,{children:"Stable"}),(0,s.jsx)(n.th,{children:"Current"}),(0,s.jsx)(n.th,{children:"Experimental"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"node"}),(0,s.jsx)(n.td,{children:">= 14.15.0"}),(0,s.jsx)(n.td,{children:">= 16.12.0"}),(0,s.jsx)(n.td,{children:">= 18.12.0"}),(0,s.jsx)(n.td,{children:">= 19.0.0"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"npm"}),(0,s.jsx)(n.td,{children:">= 6.14.0"}),(0,s.jsx)(n.td,{children:">= 8.1.0"}),(0,s.jsx)(n.td,{children:">= 8.19.0"}),(0,s.jsx)(n.td,{children:">= 9.0.0"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"electron"}),(0,s.jsx)(n.td,{children:">= 7"}),(0,s.jsx)(n.td,{children:">= 11"}),(0,s.jsx)(n.td,{children:">= 16"}),(0,s.jsx)(n.td,{children:">= 21"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"native"}),(0,s.jsx)(n.td,{children:"iOS 13"}),(0,s.jsx)(n.td,{children:"iOS 14"}),(0,s.jsx)(n.td,{children:"iOS 15"}),(0,s.jsx)(n.td,{children:"iOS 16"})]})]})]}),"\n",(0,s.jsx)(n.h4,{id:"after",children:"After"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{}),(0,s.jsx)(n.th,{children:"Legacy"}),(0,s.jsx)(n.th,{children:"Stable"}),(0,s.jsx)(n.th,{children:"Current"}),(0,s.jsx)(n.th,{children:"Experimental"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"node"}),(0,s.jsx)(n.td,{children:">= 16.12.0"}),(0,s.jsx)(n.td,{children:">= 18.12.0"}),(0,s.jsx)(n.td,{children:">= 20.10.0"}),(0,s.jsx)(n.td,{children:">= 21.6.0"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"npm"}),(0,s.jsx)(n.td,{children:">= 8.1.0"}),(0,s.jsx)(n.td,{children:">= 8.19.0"}),(0,s.jsx)(n.td,{children:">= 10.0.0"}),(0,s.jsx)(n.td,{children:">= 10.4.0"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"electron"}),(0,s.jsx)(n.td,{children:">= 11"}),(0,s.jsx)(n.td,{children:">= 16"}),(0,s.jsx)(n.td,{children:">= 21"}),(0,s.jsx)(n.td,{children:">= 26"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"native"}),(0,s.jsx)(n.td,{children:"iOS 14"}),(0,s.jsx)(n.td,{children:"iOS 15"}),(0,s.jsx)(n.td,{children:"iOS 16"}),(0,s.jsx)(n.td,{children:"iOS 17"})]})]})]}),"\n",(0,s.jsx)(n.p,{children:"Notable Node.js changes:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Supports ",(0,s.jsx)(n.code,{children:"fetch"})," natively."]}),"\n",(0,s.jsx)(n.li,{children:"Registering ESM hooks."}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"import.meta.resolve()"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"--experimental-detect-module"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"--experimental-default-type"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"packemon-is-now-esm-only",children:"Packemon is now ESM only"}),"\n",(0,s.jsxs)(n.p,{children:["We've finished our migration to an ESM only package by shipping only ",(0,s.jsx)(n.code,{children:".mjs"})," files. This was made\npossible by our underlying ",(0,s.jsx)(n.code,{children:"@boost"})," framework,\n",(0,s.jsx)(n.a,{href:"https://boostlib.dev/docs/migrate/5.0",children:"which was also converted to ESM only in v5"}),". For users of\nPackemon, ESM only should be entirely transparent to you, but at minimum, you should see increased\nperformance and reduced memory usage, as ESM is far more performant than CJS."]}),"\n",(0,s.jsxs)(n.h2,{id:"react-native-now-supports-esm-target",children:["React Native now supports ",(0,s.jsx)(n.code,{children:"esm"})," target"]}),"\n",(0,s.jsxs)(n.p,{children:["Over the last year, ",(0,s.jsx)(n.a,{href:"https://metrobundler.dev/",children:"Metro"}),", the React Native bundler has received a ton\nof new features, such as symlinks support, ESM support, ",(0,s.jsx)(n.code,{children:"package.json"})," exports/imports, Hermes\nintegration, Terser, Node.js 18+, and much more."]}),"\n",(0,s.jsxs)(n.p,{children:["Since Metro has been modernized to such an extent, we're now confident in it's ESM support, so have\nadded ",(0,s.jsx)(n.code,{children:"esm"})," as a valid format for the ",(0,s.jsx)(n.code,{children:"native"})," platform."]}),"\n",(0,s.jsxs)(n.h2,{id:"streamlined-exports-and-the-default-condition",children:["Streamlined exports and the ",(0,s.jsx)(n.code,{children:"default"})," condition"]}),"\n",(0,s.jsxs)(n.p,{children:["Packemon has supported ",(0,s.jsxs)(n.a,{href:"../features#automatic-package-exports",children:["automatic ",(0,s.jsx)(n.code,{children:"package.json"})," ",(0,s.jsx)(n.code,{children:"exports"})]}),"\nsince its inception, and we believe this to be one of its greatest features. However, automating\nexports correctly has been ",(0,s.jsx)(n.em,{children:"very difficult"})," to get right, especially when building a package for\nmultiple platforms and formats."]}),"\n",(0,s.jsxs)(n.p,{children:["One of the biggest issues that users face, is when a package is built for browers only, only a\n",(0,s.jsx)(n.code,{children:"browser"})," export condition is generated. This ",(0,s.jsx)(n.em,{children:"looks correct"}),", and is, but when it's not. For\nnon-bundler environments, such as Node.js and TypeScript, this condition is completely ignored,\nresulting in \"missing exports or types\" errors. Although the package is built correctly, this feels\nlike a bug, and is a poor developer experience. It's also very confusing on how to fix it,\nespecially when a user has no knowledge on how exports and conditions work."]}),"\n",(0,s.jsxs)(n.p,{children:["To remedy this problem, we've implemented a new algorithm that will automatically flatten exports\nand add a ",(0,s.jsx)(n.code,{children:"default"})," condition if it does not exist. The ",(0,s.jsx)(n.code,{children:"default"})," condition is supported by ",(0,s.jsx)(n.em,{children:"all\ntools"}),", and should avoid the problem above. We believe this will work much better, but we're also\nnot 100% confident it will work correctly for all use cases, so all feedback is appreciated!"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},3023:(e,n,t)=>{t.d(n,{R:()=>d,x:()=>o});var s=t(3696);const r={},i=s.createContext(r);function d(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);