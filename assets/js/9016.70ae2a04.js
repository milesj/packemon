(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9016],{2373:(e,t,n)=>{"use strict";n.d(t,{_:()=>i,u:()=>o});var r=n(3696),s=n(5198),a=n(2540);const c=r.createContext(null);function i(e){let{children:t,content:n}=e;const s=function(e){return(0,r.useMemo)((()=>({metadata:e.metadata,frontMatter:e.frontMatter,assets:e.assets,contentTitle:e.contentTitle,toc:e.toc})),[e])}(n);return(0,a.jsx)(c.Provider,{value:s,children:t})}function o(){const e=(0,r.useContext)(c);if(null===e)throw new s.dV("DocProvider");return e}},789:(e,t,n)=>{"use strict";n.d(t,{f:()=>i});var r=n(3696),s=n(5198);const a={attributes:!0,characterData:!0,childList:!0,subtree:!0};function c(e,t){const[n,c]=(0,r.useState)(),i=(0,r.useCallback)((()=>{var t;c(null==(t=e.current)?void 0:t.closest("[role=tabpanel][hidden]"))}),[e,c]);(0,r.useEffect)((()=>{i()}),[i]),function(e,t,n){void 0===n&&(n=a);const c=(0,s._q)(t),i=(0,s.Be)(n);(0,r.useEffect)((()=>{const t=new MutationObserver(c);return e&&t.observe(e,i),()=>t.disconnect()}),[e,c,i])}(n,(e=>{e.forEach((e=>{"attributes"===e.type&&"hidden"===e.attributeName&&(t(),i())}))}),{attributes:!0,characterData:!1,childList:!1,subtree:!1})}function i(){const[e,t]=(0,r.useState)(!1),[n,s]=(0,r.useState)(!1),a=(0,r.useRef)(null),i=(0,r.useCallback)((()=>{const n=a.current.querySelector("code");e?n.removeAttribute("style"):(n.style.whiteSpace="pre-wrap",n.style.overflowWrap="anywhere"),t((e=>!e))}),[a,e]),o=(0,r.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=a.current,n=e>t||a.current.querySelector("code").hasAttribute("style");s(n)}),[a]);return c(a,o),(0,r.useEffect)((()=>{o()}),[e,o]),(0,r.useEffect)((()=>(window.addEventListener("resize",o,{passive:!0}),()=>{window.removeEventListener("resize",o)})),[o]),{codeBlockRef:a,isEnabled:e,isCodeScrollable:n,toggle:i}}},8204:(e,t,n)=>{"use strict";n.d(t,{A:()=>a});var r=n(2363),s=n(7412);function a(){const{prism:e}=(0,s.p)(),{colorMode:t}=(0,r.G)(),n=e.theme,a=e.darkTheme||n;return"dark"===t?a:n}},8808:(e,t,n)=>{"use strict";n.d(t,{i:()=>o});var r=n(3696),s=n(7412);function a(e){const t=e.getBoundingClientRect();return t.top===t.bottom?a(e.parentNode):t}function c(e,t){var n;let{anchorTopOffset:r}=t;const s=e.find((e=>a(e).top>=r));if(s){var c;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(a(s))?s:null!=(c=e[e.indexOf(s)-1])?c:null}return null!=(n=e[e.length-1])?n:null}function i(){const e=(0,r.useRef)(0),{navbar:{hideOnScroll:t}}=(0,s.p)();return(0,r.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function o(e){const t=(0,r.useRef)(void 0),n=i();(0,r.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:r,linkActiveClassName:s,minHeadingLevel:a,maxHeadingLevel:i}=e;function o(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(r),o=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const r=[];for(let s=t;s<=n;s+=1)r.push("h"+s+".anchor");return Array.from(document.querySelectorAll(r.join()))}({minHeadingLevel:a,maxHeadingLevel:i}),l=c(o,{anchorTopOffset:n.current}),u=e.find((e=>l&&l.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(s),e.classList.add(s),t.current=e):e.classList.remove(s)}(e,e===u)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),()=>{document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,n])}},1636:(e,t,n)=>{"use strict";n.d(t,{i:()=>s});var r=n(7032);function s(e){void 0===e&&(e={});const{i18n:{currentLocale:t}}=(0,r.default)(),n=function(){const{i18n:{currentLocale:e,localeConfigs:t}}=(0,r.default)();return t[e].calendar}();return new Intl.DateTimeFormat(t,{calendar:n,...e})}},3279:(e,t,n)=>{"use strict";n.d(t,{c:()=>a});var r=n(3696),s=n(2540);function a(e){var t;const{mdxAdmonitionTitle:n,rest:a}=function(e){const t=r.Children.toArray(e),n=t.find((e=>r.isValidElement(e)&&"mdxAdmonitionTitle"===e.type)),a=t.filter((e=>e!==n));return{mdxAdmonitionTitle:null==n?void 0:n.props.children,rest:a.length>0?(0,s.jsx)(s.Fragment,{children:a}):null}}(e.children),c=null!=(t=e.title)?t:n;return{...e,...c&&{title:c},children:a}}},1629:(e,t,n)=>{"use strict";n.d(t,{Li:()=>h,M$:()=>v,Op:()=>m,_u:()=>f,wt:()=>d});var r=n(9934),s=n.n(r);const a=/title=(?<quote>["'])(?<title>.*?)\1/,c=/\{(?<range>[\d,-]+)\}/,i={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}},o={...i,lua:{start:"--",end:""},wasm:{start:"\\;\\;",end:""},tex:{start:"%",end:""},vb:{start:"['\u2018\u2019]",end:""},vbnet:{start:"(?:_\\s*)?['\u2018\u2019]",end:""},rem:{start:"[Rr][Ee][Mm]\\b",end:""},f90:{start:"!",end:""},ml:{start:"\\(\\*",end:"\\*\\)"},cobol:{start:"\\*>",end:""}},l=Object.keys(i);function u(e,t){const n=e.map((e=>{const{start:n,end:r}=o[e];return"(?:"+n+"\\s*("+t.flatMap((e=>{var t,n;return[e.line,null==(t=e.block)?void 0:t.start,null==(n=e.block)?void 0:n.end].filter(Boolean)})).join("|")+")\\s*"+r+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")}function d(e){var t,n;return null!=(t=null==e||null==(n=e.match(a))?void 0:n.groups.title)?t:""}function f(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}function m(e){const t=e.split(" ").find((e=>e.startsWith("language-")));return null==t?void 0:t.replace(/language-/,"")}function h(e,t){let n=e.replace(/\n$/,"");const{language:r,magicComments:a,metastring:i}=t;if(i&&c.test(i)){const e=i.match(c).groups.range;if(0===a.length)throw new Error("A highlight range has been given in code block's metastring (``` "+i+"), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.");const t=a[0].className,r=s()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(r),code:n}}if(void 0===r)return{lineClassNames:{},code:n};const o=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return u(["js","jsBlock"],t);case"jsx":case"tsx":return u(["js","jsBlock","jsx"],t);case"html":return u(["js","jsBlock","html"],t);case"python":case"py":case"bash":return u(["bash"],t);case"markdown":case"md":return u(["html","jsx","bash"],t);case"tex":case"latex":case"matlab":return u(["tex"],t);case"lua":case"haskell":case"sql":return u(["lua"],t);case"wasm":return u(["wasm"],t);case"vb":case"vba":case"visual-basic":return u(["vb","rem"],t);case"vbnet":return u(["vbnet","rem"],t);case"batch":return u(["rem"],t);case"basic":return u(["rem","f90"],t);case"fsharp":return u(["js","ml"],t);case"ocaml":case"sml":return u(["ml"],t);case"fortran":return u(["f90"],t);case"cobol":return u(["cobol"],t);default:return u(l,t)}}(r,a),d=n.split("\n"),f=Object.fromEntries(a.map((e=>[e.className,{start:0,range:""}]))),m=Object.fromEntries(a.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),h=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),v=Object.fromEntries(a.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let s=0;s<d.length;){const e=d[s].match(o);if(!e){s+=1;continue}const t=e.slice(1).find((e=>void 0!==e));m[t]?f[m[t]].range+=s+",":h[t]?f[h[t]].start=s:v[t]&&(f[v[t]].range+=f[v[t]].start+"-"+(s-1)+","),d.splice(s,1)}n=d.join("\n");const p={};return Object.entries(f).forEach((e=>{let[t,{range:n}]=e;s()(n).forEach((e=>{null!=p[e]||(p[e]=[]),p[e].push(t)}))})),{lineClassNames:p,code:n}}function v(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[r,s]=e;const a=t[r];a&&"string"==typeof s&&(n[a]=s)})),n}},725:(e,t,n)=>{"use strict";n.d(t,{h:()=>i,v:()=>a});var r=n(3696);function s(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const r=n.slice(2,e.level);e.parentIndex=Math.max(...r),n[e.level]=t}));const r=[];return t.forEach((e=>{const{parentIndex:n,...s}=e;n>=0?t[n].children.push(s):r.push(s)})),r}function a(e){return(0,r.useMemo)((()=>s(e)),[e])}function c(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:r}=e;return t.flatMap((e=>{const t=c({toc:e.children,minHeadingLevel:n,maxHeadingLevel:r});return function(e){return e.level>=n&&e.level<=r}(e)?[{...e,children:t}]:t}))}function i(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return(0,r.useMemo)((()=>c({toc:s(t),minHeadingLevel:n,maxHeadingLevel:a})),[t,n,a])}},8379:(e,t,n)=>{"use strict";n.d(t,{AE:()=>o,Rc:()=>c,Uh:()=>i});n(3696);var r=n(6590),s=n(7854),a=n(2540);function c(){return(0,a.jsx)(r.A,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function i(){return(0,a.jsx)(r.A,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function o(){return(0,a.jsx)(s.A,{children:(0,a.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}},9934:(e,t)=>{function n(e){let t,n=[];for(let r of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(r))n.push(parseInt(r,10));else if(t=r.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,r,s,a]=t;if(r&&a){r=parseInt(r),a=parseInt(a);const e=r<a?1:-1;"-"!==s&&".."!==s&&"\u2025"!==s||(a+=e);for(let t=r;t!==a;t+=e)n.push(t)}}return n}t.default=n,e.exports=n}}]);