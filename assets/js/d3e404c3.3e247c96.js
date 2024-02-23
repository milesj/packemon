"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2569],{2062:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>a,frontMatter:()=>i,metadata:()=>l,toc:()=>o});var d=n(2540),r=n(3023);const i={title:"4.0 migration",sidebar_label:"4.0"},s=void 0,l={id:"migrate/4.0",title:"4.0 migration",description:"Shifted supported platform versions",source:"@site/docs/migrate/4.0.md",sourceDirName:"migrate",slug:"/migrate/4.0",permalink:"/docs/migrate/4.0",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/migrate/4.0.md",tags:[],version:"current",frontMatter:{title:"4.0 migration",sidebar_label:"4.0"}},c={},o=[{value:"Shifted supported platform versions",id:"shifted-supported-platform-versions",level:2},{value:"Before",id:"before",level:4},{value:"After",id:"after",level:4},{value:"Packemon is now ESM only",id:"packemon-is-now-esm-only",level:2},{value:"React Native now supports <code>esm</code> target",id:"react-native-now-supports-esm-target",level:2},{value:"Streamlined exports and the <code>default</code> condition",id:"streamlined-exports-and-the-default-condition",level:2}];function h(e){const t={a:"a",code:"code",h2:"h2",h4:"h4",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(t.h2,{id:"shifted-supported-platform-versions",children:"Shifted supported platform versions"}),"\n",(0,d.jsxs)(t.p,{children:["Since Node.js v16 has reached ",(0,d.jsx)(t.a,{href:"https://nodejs.org/en/about/releases/",children:"end of life"}),", Packemon now\nrequires at minimum v18.12 and above to run. Furthermore, we're entirely dropping v14 support, and\nshifting v16 into ",(0,d.jsx)(t.code,{children:"legacy"}),", v18 into ",(0,d.jsx)(t.code,{children:"stable"}),", v20 into ",(0,d.jsx)(t.code,{children:"current"}),", and the new v21 into\n",(0,d.jsx)(t.code,{children:"experimental"}),". As part of this process, we are also bumping minimum requirements and coupled npm\nversions."]}),"\n",(0,d.jsxs)(t.p,{children:["The updated ",(0,d.jsx)(t.a,{href:"/docs/config#support",children:(0,d.jsx)(t.code,{children:"support"})})," compatibility table is as follows."]}),"\n",(0,d.jsx)(t.h4,{id:"before",children:"Before"}),"\n",(0,d.jsxs)(t.table,{children:[(0,d.jsx)(t.thead,{children:(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.th,{}),(0,d.jsx)(t.th,{children:"Legacy"}),(0,d.jsx)(t.th,{children:"Stable"}),(0,d.jsx)(t.th,{children:"Current"}),(0,d.jsx)(t.th,{children:"Experimental"})]})}),(0,d.jsxs)(t.tbody,{children:[(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"node"}),(0,d.jsx)(t.td,{children:">= 14.15.0"}),(0,d.jsx)(t.td,{children:">= 16.12.0"}),(0,d.jsx)(t.td,{children:">= 18.12.0"}),(0,d.jsx)(t.td,{children:">= 19.0.0"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"npm"}),(0,d.jsx)(t.td,{children:">= 6.14.0"}),(0,d.jsx)(t.td,{children:">= 8.1.0"}),(0,d.jsx)(t.td,{children:">= 8.19.0"}),(0,d.jsx)(t.td,{children:">= 9.0.0"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"electron"}),(0,d.jsx)(t.td,{children:">= 7"}),(0,d.jsx)(t.td,{children:">= 11"}),(0,d.jsx)(t.td,{children:">= 16"}),(0,d.jsx)(t.td,{children:">= 21"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"native"}),(0,d.jsx)(t.td,{children:"iOS 13"}),(0,d.jsx)(t.td,{children:"iOS 14"}),(0,d.jsx)(t.td,{children:"iOS 15"}),(0,d.jsx)(t.td,{children:"iOS 16"})]})]})]}),"\n",(0,d.jsx)(t.h4,{id:"after",children:"After"}),"\n",(0,d.jsxs)(t.table,{children:[(0,d.jsx)(t.thead,{children:(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.th,{}),(0,d.jsx)(t.th,{children:"Legacy"}),(0,d.jsx)(t.th,{children:"Stable"}),(0,d.jsx)(t.th,{children:"Current"}),(0,d.jsx)(t.th,{children:"Experimental"})]})}),(0,d.jsxs)(t.tbody,{children:[(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"node"}),(0,d.jsx)(t.td,{children:">= 16.12.0"}),(0,d.jsx)(t.td,{children:">= 18.12.0"}),(0,d.jsx)(t.td,{children:">= 20.10.0"}),(0,d.jsx)(t.td,{children:">= 21.6.0"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"npm"}),(0,d.jsx)(t.td,{children:">= 8.1.0"}),(0,d.jsx)(t.td,{children:">= 8.19.0"}),(0,d.jsx)(t.td,{children:">= 10.0.0"}),(0,d.jsx)(t.td,{children:">= 10.4.0"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"electron"}),(0,d.jsx)(t.td,{children:">= 11"}),(0,d.jsx)(t.td,{children:">= 16"}),(0,d.jsx)(t.td,{children:">= 21"}),(0,d.jsx)(t.td,{children:">= 26"})]}),(0,d.jsxs)(t.tr,{children:[(0,d.jsx)(t.td,{children:"native"}),(0,d.jsx)(t.td,{children:"iOS 14"}),(0,d.jsx)(t.td,{children:"iOS 15"}),(0,d.jsx)(t.td,{children:"iOS 16"}),(0,d.jsx)(t.td,{children:"iOS 17"})]})]})]}),"\n",(0,d.jsx)(t.p,{children:"Notable Node.js changes:"}),"\n",(0,d.jsxs)(t.ul,{children:["\n",(0,d.jsxs)(t.li,{children:["Supports ",(0,d.jsx)(t.code,{children:"fetch"})," natively."]}),"\n",(0,d.jsx)(t.li,{children:"Registering ESM hooks."}),"\n",(0,d.jsx)(t.li,{children:(0,d.jsx)(t.code,{children:"import.meta.resolve()"})}),"\n",(0,d.jsx)(t.li,{children:(0,d.jsx)(t.code,{children:"--experimental-detect-module"})}),"\n",(0,d.jsx)(t.li,{children:(0,d.jsx)(t.code,{children:"--experimental-default-type"})}),"\n"]}),"\n",(0,d.jsx)(t.h2,{id:"packemon-is-now-esm-only",children:"Packemon is now ESM only"}),"\n",(0,d.jsxs)(t.h2,{id:"react-native-now-supports-esm-target",children:["React Native now supports ",(0,d.jsx)(t.code,{children:"esm"})," target"]}),"\n",(0,d.jsxs)(t.h2,{id:"streamlined-exports-and-the-default-condition",children:["Streamlined exports and the ",(0,d.jsx)(t.code,{children:"default"})," condition"]})]})}function a(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(h,{...e})}):h(e)}},3023:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>l});var d=n(3696);const r={},i=d.createContext(r);function s(e){const t=d.useContext(i);return d.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),d.createElement(i.Provider,{value:t},e.children)}}}]);