(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[317],{1999:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return d}});var r=t(5773),i=t(808),a=t(7378),c=t(8944),u=t(9213),o=t(624),s="anchorWithStickyNavbar_JmGV",l="anchorWithHideOnScrollNavbar_pMLv",f=["as","id"];function d(e){var n=e.as,t=e.id,d=(0,i.Z)(e,f),v=(0,o.L)().navbar.hideOnScroll;return"h1"!==n&&t?a.createElement(n,(0,r.Z)({},d,{className:(0,c.Z)("anchor",v?l:s),id:t}),d.children,a.createElement("a",{className:"hash-link",href:"#"+t,title:(0,u.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(n,(0,r.Z)({},d,{id:void 0}))}},9446:function(e,n,t){"use strict";t.d(n,{b:function(){return c},k:function(){return u}});var r=t(7378),i=t(8215),a=r.createContext(null);function c(e){var n=e.children,t=function(e){return(0,r.useMemo)((function(){return{metadata:e.metadata,frontMatter:e.frontMatter,assets:e.assets,contentTitle:e.contentTitle,toc:e.toc}}),[e])}(e.content);return r.createElement(a.Provider,{value:t},n)}function u(){var e=(0,r.useContext)(a);if(null===e)throw new i.i6("DocProvider");return e}},6177:function(e,n,t){"use strict";t.d(n,{F:function(){return u}});var r=t(7378),i=t(8215),a={attributes:!0,characterData:!0,childList:!0,subtree:!0};function c(e,n){var t=(0,r.useState)(),c=t[0],u=t[1],o=(0,r.useCallback)((function(){var n;u(null==(n=e.current)?void 0:n.closest("[role=tabpanel][hidden]"))}),[e,u]);(0,r.useEffect)((function(){o()}),[o]),function(e,n,t){void 0===t&&(t=a);var c=(0,i.zX)(n),u=(0,i.Ql)(t);(0,r.useEffect)((function(){var n=new MutationObserver(c);return e&&n.observe(e,u),function(){return n.disconnect()}}),[e,c,u])}(c,(function(e){e.forEach((function(e){"attributes"===e.type&&"hidden"===e.attributeName&&(n(),o())}))}),{attributes:!0,characterData:!1,childList:!1,subtree:!1})}function u(){var e=(0,r.useState)(!1),n=e[0],t=e[1],i=(0,r.useState)(!1),a=i[0],u=i[1],o=(0,r.useRef)(null),s=(0,r.useCallback)((function(){var e=o.current.querySelector("code");n?e.removeAttribute("style"):(e.style.whiteSpace="pre-wrap",e.style.overflowWrap="anywhere"),t((function(e){return!e}))}),[o,n]),l=(0,r.useCallback)((function(){var e=o.current,n=e.scrollWidth>e.clientWidth||o.current.querySelector("code").hasAttribute("style");u(n)}),[o]);return c(o,l),(0,r.useEffect)((function(){l()}),[n,l]),(0,r.useEffect)((function(){return window.addEventListener("resize",l,{passive:!0}),function(){window.removeEventListener("resize",l)}}),[l]),{codeBlockRef:o,isEnabled:n,isCodeScrollable:a,toggle:s}}},6499:function(e,n,t){"use strict";t.d(n,{p:function(){return a}});var r=t(5421),i=t(624);function a(){var e=(0,i.L)().prism,n=(0,r.I)().colorMode,t=e.theme,a=e.darkTheme||t;return"dark"===n?a:t}},1344:function(e,n,t){"use strict";t.d(n,{S:function(){return o}});var r=t(7378),i=t(624);function a(e){var n=e.getBoundingClientRect();return n.top===n.bottom?a(e.parentNode):n}function c(e,n){var t,r,i=n.anchorTopOffset,c=e.find((function(e){return a(e).top>=i}));return c?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(a(c))?c:null!=(r=e[e.indexOf(c)-1])?r:null:null!=(t=e[e.length-1])?t:null}function u(){var e=(0,r.useRef)(0),n=(0,i.L)().navbar.hideOnScroll;return(0,r.useEffect)((function(){e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function o(e){var n=(0,r.useRef)(void 0),t=u();(0,r.useEffect)((function(){if(!e)return function(){};var r=e.linkClassName,i=e.linkActiveClassName,a=e.minHeadingLevel,u=e.maxHeadingLevel;function o(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(r),o=function(e){for(var n=e.minHeadingLevel,t=e.maxHeadingLevel,r=[],i=n;i<=t;i+=1)r.push("h"+i+".anchor");return Array.from(document.querySelectorAll(r.join()))}({minHeadingLevel:a,maxHeadingLevel:u}),s=c(o,{anchorTopOffset:t.current}),l=e.find((function(e){return s&&s.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,t){t?(n.current&&n.current!==e&&n.current.classList.remove(i),e.classList.add(i),n.current=e):e.classList.remove(i)}(e,e===l)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),function(){document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,t])}},433:function(e,n,t){"use strict";t.d(n,{QC:function(){return m},Vo:function(){return d},bc:function(){return l},nZ:function(){return v},nt:function(){return f}});var r=t(9616),i=t(6324),a=t.n(i),c=(0,r.Z)(/title=(["'])(.*?)\1/,{quote:1,title:2}),u=(0,r.Z)(/\{([\d,-]+)\}/,{range:1}),o={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function s(e,n){var t=e.map((function(e){var t=o[e],r=t.start,i=t.end;return"(?:"+r+"\\s*("+n.flatMap((function(e){var n,t;return[e.line,null==(n=e.block)?void 0:n.start,null==(t=e.block)?void 0:t.end].filter(Boolean)})).join("|")+")\\s*"+i+")"})).join("|");return new RegExp("^\\s*(?:"+t+")\\s*$")}function l(e){var n,t;return null!=(n=null==e||null==(t=e.match(c))?void 0:t.groups.title)?n:""}function f(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}function d(e){var n=e.split(" ").find((function(e){return e.startsWith("language-")}));return null==n?void 0:n.replace(/language-/,"")}function v(e,n){var t=e.replace(/\n$/,""),r=n.language,i=n.magicComments,c=n.metastring;if(c&&u.test(c)){var l=c.match(u).groups.range;if(0===i.length)throw new Error("A highlight range has been given in code block's metastring (``` "+c+"), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.");var f=i[0].className,d=a()(l).filter((function(e){return e>0})).map((function(e){return[e-1,[f]]}));return{lineClassNames:Object.fromEntries(d),code:t}}if(void 0===r)return{lineClassNames:{},code:t};for(var v=function(e,n){switch(e){case"js":case"javascript":case"ts":case"typescript":return s(["js","jsBlock"],n);case"jsx":case"tsx":return s(["js","jsBlock","jsx"],n);case"html":return s(["js","jsBlock","html"],n);case"python":case"py":case"bash":return s(["bash"],n);case"markdown":case"md":return s(["html","jsx","bash"],n);default:return s(Object.keys(o),n)}}(r,i),m=t.split("\n"),h=Object.fromEntries(i.map((function(e){return[e.className,{start:0,range:""}]}))),p=Object.fromEntries(i.filter((function(e){return e.line})).map((function(e){var n=e.className;return[e.line,n]}))),g=Object.fromEntries(i.filter((function(e){return e.block})).map((function(e){var n=e.className;return[e.block.start,n]}))),b=Object.fromEntries(i.filter((function(e){return e.block})).map((function(e){var n=e.className;return[e.block.end,n]}))),k=0;k<m.length;){var E=m[k].match(v);if(E){var L=E.slice(1).find((function(e){return void 0!==e}));p[L]?h[p[L]].range+=k+",":g[L]?h[g[L]].start=k:b[L]&&(h[b[L]].range+=h[b[L]].start+"-"+(k-1)+","),m.splice(k,1)}else k+=1}t=m.join("\n");var j={};return Object.entries(h).forEach((function(e){var n=e[0],t=e[1].range;a()(t).forEach((function(e){null!=j[e]||(j[e]=[]),j[e].push(n)}))})),{lineClassNames:j,code:t}}function m(e){var n={color:"--prism-color",backgroundColor:"--prism-background-color"},t={};return Object.entries(e.plain).forEach((function(e){var r=e[0],i=e[1],a=n[r];a&&"string"==typeof i&&(t[a]=i)})),t}},6934:function(e,n,t){"use strict";t.d(n,{a:function(){return u},b:function(){return s}});var r=t(808),i=t(7378),a=["parentIndex"];function c(e){var n=e.map((function(e){return Object.assign({},e,{parentIndex:-1,children:[]})})),t=Array(7).fill(-1);n.forEach((function(e,n){var r=t.slice(2,e.level);e.parentIndex=Math.max.apply(Math,r),t[e.level]=n}));var i=[];return n.forEach((function(e){var t=e.parentIndex,c=(0,r.Z)(e,a);t>=0?n[t].children.push(c):i.push(c)})),i}function u(e){return(0,i.useMemo)((function(){return c(e)}),[e])}function o(e){var n=e.toc,t=e.minHeadingLevel,r=e.maxHeadingLevel;return n.flatMap((function(e){var n=o({toc:e.children,minHeadingLevel:t,maxHeadingLevel:r});return function(e){return e.level>=t&&e.level<=r}(e)?[Object.assign({},e,{children:n})]:n}))}function s(e){var n=e.toc,t=e.minHeadingLevel,r=e.maxHeadingLevel;return(0,i.useMemo)((function(){return o({toc:c(n),minHeadingLevel:t,maxHeadingLevel:r})}),[n,t,r])}},6324:function(e,n){function t(e){let n,t=[];for(let r of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(r))t.push(parseInt(r,10));else if(n=r.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,r,i,a]=n;if(r&&a){r=parseInt(r),a=parseInt(a);const e=r<a?1:-1;"-"!==i&&".."!==i&&"\u2025"!==i||(a+=e);for(let n=r;n!==a;n+=e)t.push(n)}}return t}n.default=t,e.exports=t}}]);