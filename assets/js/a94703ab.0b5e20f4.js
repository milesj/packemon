"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[666],{4007:(e,t,n)=>{n.r(t),n.d(t,{default:()=>ue});var a=n(6952),o=n(8112),i=n(3420),s=n(4696),l=n(7808),c=n(5752),r=n(3432),d=n(8632);const u={backToTopButton:"backToTopButton_iEvu",backToTopButtonShow:"backToTopButtonShow_DO8w"};var m=n(1948);function b(){const{shown:e,scrollToTop:t}=(0,d.O)({threshold:300});return(0,m.jsx)("button",{"aria-label":(0,r.G)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,o.c)("clean-btn",s.W.common.backToTopButton,u.backToTopButton,e&&u.backToTopButtonShow),type:"button",onClick:t})}var h=n(7312),p=n(7976),x=n(7260),f=n(3408),j=n(9624);function v(e){return(0,m.jsx)("svg",{width:"20",height:"20","aria-hidden":"true",...e,children:(0,m.jsxs)("g",{fill:"#7a7a7a",children:[(0,m.jsx)("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),(0,m.jsx)("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})]})})}const g={collapseSidebarButton:"collapseSidebarButton_oTwn",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_pMEX"};function _(e){let{onClick:t}=e;return(0,m.jsx)("button",{type:"button",title:(0,r.G)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,r.G)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,o.c)("button button--secondary button--outline",g.collapseSidebarButton),onClick:t,children:(0,m.jsx)(v,{className:g.collapseSidebarButtonIcon})})}var C=n(4631),S=n(320),k=n(7152),I=n(5104),N=n(5264),T=n(4140),B=n(4308),y=n(6576);function w(e){let{collapsed:t,categoryLabel:n,onClick:a}=e;return(0,m.jsx)("button",{"aria-label":t?(0,r.G)({id:"theme.DocSidebarItem.expandCategoryAriaLabel",message:"Expand sidebar category '{label}'",description:"The ARIA label to expand the sidebar category"},{label:n}):(0,r.G)({id:"theme.DocSidebarItem.collapseCategoryAriaLabel",message:"Collapse sidebar category '{label}'",description:"The ARIA label to collapse the sidebar category"},{label:n}),type:"button",className:"clean-btn menu__caret",onClick:a})}function E(e){let{item:t,onItemClick:n,activePath:i,level:c,index:r,...d}=e;const{items:u,label:b,collapsible:h,className:p,href:x}=t,{docs:{sidebar:{autoCollapseCategories:j}}}=(0,f.y)(),v=function(e){const t=(0,y.c)();return(0,a.useMemo)((()=>e.href&&!e.linkUnlisted?e.href:!t&&e.collapsible?(0,l.Gw)(e):void 0),[e,t])}(t),g=(0,l.Md)(t,i),_=(0,T.Sc)(x,i),{collapsed:C,setCollapsed:S}=(0,N.a)({initialState:()=>!!h&&(!g&&t.collapsed)}),{expandedItem:E,setExpandedItem:A}=(0,k.E)(),L=function(e){void 0===e&&(e=!C),A(e?null:r),S(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:o}=e;const i=(0,I.i0)(t);(0,a.useEffect)((()=>{t&&!i&&n&&o(!1)}),[t,i,n,o])}({isActive:g,collapsed:C,updateCollapsed:L}),(0,a.useEffect)((()=>{h&&null!=E&&E!==r&&j&&S(!0)}),[h,E,r,S,j]),(0,m.jsxs)("li",{className:(0,o.c)(s.W.docs.docSidebarItemCategory,s.W.docs.docSidebarItemCategoryLevel(c),"menu__list-item",{"menu__list-item--collapsed":C},p),children:[(0,m.jsxs)("div",{className:(0,o.c)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":_}),children:[(0,m.jsx)(B.default,{className:(0,o.c)("menu__link",{"menu__link--sublist":h,"menu__link--sublist-caret":!x&&h,"menu__link--active":g}),onClick:h?e=>{null==n||n(t),x?L(!1):(e.preventDefault(),L())}:()=>{null==n||n(t)},"aria-current":_?"page":void 0,"aria-expanded":h?!C:void 0,href:h?null!=v?v:"#":v,...d,children:b}),x&&h&&(0,m.jsx)(w,{collapsed:C,categoryLabel:b,onClick:e=>{e.preventDefault(),L()}})]}),(0,m.jsx)(N.U,{lazy:!0,as:"ul",className:"menu__list",collapsed:C,children:(0,m.jsx)(G,{items:u,tabIndex:C?-1:0,onItemClick:n,activePath:i,level:c+1})})]})}var A=n(5912),L=n(3752);const W={menuExternalLink:"menuExternalLink_BiEj"};function M(e){let{item:t,onItemClick:n,activePath:a,level:i,index:c,...r}=e;const{href:d,label:u,className:b,autoAddBaseUrl:h}=t,p=(0,l.Md)(t,a),x=(0,A.c)(d);return(0,m.jsx)("li",{className:(0,o.c)(s.W.docs.docSidebarItemLink,s.W.docs.docSidebarItemLinkLevel(i),"menu__list-item",b),children:(0,m.jsxs)(B.default,{className:(0,o.c)("menu__link",!x&&W.menuExternalLink,{"menu__link--active":p}),autoAddBaseUrl:h,"aria-current":p?"page":void 0,to:d,...x&&{onClick:n?()=>n(t):void 0},...r,children:[u,!x&&(0,m.jsx)(L.c,{})]})},u)}const H={menuHtmlItem:"menuHtmlItem_OniL"};function D(e){let{item:t,level:n,index:a}=e;const{value:i,defaultStyle:l,className:c}=t;return(0,m.jsx)("li",{className:(0,o.c)(s.W.docs.docSidebarItemLink,s.W.docs.docSidebarItemLinkLevel(n),l&&[H.menuHtmlItem,"menu__list-item"],c),dangerouslySetInnerHTML:{__html:i}},a)}function P(e){let{item:t,...n}=e;switch(t.type){case"category":return(0,m.jsx)(E,{item:t,...n});case"html":return(0,m.jsx)(D,{item:t,...n});default:return(0,m.jsx)(M,{item:t,...n})}}function R(e){let{items:t,...n}=e;const a=(0,l.mg)(t,n.activePath);return(0,m.jsx)(k.g,{children:a.map(((e,t)=>(0,m.jsx)(P,{item:e,index:t,...n},t)))})}const G=(0,a.memo)(R),U={menu:"menu_jmj1",menuWithAnnouncementBar:"menuWithAnnouncementBar_YufC"};function V(e){let{path:t,sidebar:n,className:i}=e;const l=function(){const{isActive:e}=(0,C.el)(),[t,n]=(0,a.useState)(e);return(0,S.SM)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return(0,m.jsx)("nav",{"aria-label":(0,r.G)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,o.c)("menu thin-scrollbar",U.menu,l&&U.menuWithAnnouncementBar,i),children:(0,m.jsx)("ul",{className:(0,o.c)(s.W.docs.docSidebarMenu,"menu__list"),children:(0,m.jsx)(G,{items:n,activePath:t,level:1})})})}const F="sidebar_CUen",Y="sidebarWithHideableNavbar_w4KB",O="sidebarHidden_k6VE",q="sidebarLogo_CYvI";function z(e){let{path:t,sidebar:n,onCollapse:a,isHidden:i}=e;const{navbar:{hideOnScroll:s},docs:{sidebar:{hideable:l}}}=(0,f.y)();return(0,m.jsxs)("div",{className:(0,o.c)(F,s&&Y,i&&O),children:[s&&(0,m.jsx)(j.c,{tabIndex:-1,className:q}),(0,m.jsx)(V,{path:t,sidebar:n}),l&&(0,m.jsx)(_,{onClick:a})]})}const K=a.memo(z);var J=n(2936),X=n(340);const Q=e=>{let{sidebar:t,path:n}=e;const a=(0,X.q)();return(0,m.jsx)("ul",{className:(0,o.c)(s.W.docs.docSidebarMenu,"menu__list"),children:(0,m.jsx)(G,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&a.toggle(),"link"===e.type&&a.toggle()},level:1})})};function Z(e){return(0,m.jsx)(J.Mx,{component:Q,props:e})}const $=a.memo(Z);function ee(e){const t=(0,x.U)(),n="desktop"===t||"ssr"===t,a="mobile"===t;return(0,m.jsxs)(m.Fragment,{children:[n&&(0,m.jsx)(K,{...e}),a&&(0,m.jsx)($,{...e})]})}const te={expandButton:"expandButton_pLDq",expandButtonIcon:"expandButtonIcon_X5ff"};function ne(e){let{toggleSidebar:t}=e;return(0,m.jsx)("div",{className:te.expandButton,title:(0,r.G)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,r.G)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t,children:(0,m.jsx)(v,{className:te.expandButtonIcon})})}const ae={docSidebarContainer:"docSidebarContainer_c7NB",docSidebarContainerHidden:"docSidebarContainerHidden_P3S_",sidebarViewport:"sidebarViewport_KYo0"};function oe(e){var t;let{children:n}=e;const o=(0,c.m)();return(0,m.jsx)(a.Fragment,{children:n},null!=(t=null==o?void 0:o.name)?t:"noSidebar")}function ie(e){let{sidebar:t,hiddenSidebarContainer:n,setHiddenSidebarContainer:i}=e;const{pathname:l}=(0,p.IT)(),[c,r]=(0,a.useState)(!1),d=(0,a.useCallback)((()=>{c&&r(!1),!c&&(0,h.I)()&&r(!0),i((e=>!e))}),[i,c]);return(0,m.jsx)("aside",{className:(0,o.c)(s.W.docs.docSidebarContainer,ae.docSidebarContainer,n&&ae.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(ae.docSidebarContainer)&&n&&r(!0)},children:(0,m.jsx)(oe,{children:(0,m.jsxs)("div",{className:(0,o.c)(ae.sidebarViewport,c&&ae.sidebarViewportHidden),children:[(0,m.jsx)(ee,{sidebar:t,path:l,onCollapse:d,isHidden:c}),c&&(0,m.jsx)(ne,{toggleSidebar:d})]})})})}const se={docMainContainer:"docMainContainer_a9sJ",docMainContainerEnhanced:"docMainContainerEnhanced_grEJ",docItemWrapperEnhanced:"docItemWrapperEnhanced_VqDq"};function le(e){let{hiddenSidebarContainer:t,children:n}=e;const a=(0,c.m)();return(0,m.jsx)("main",{className:(0,o.c)(se.docMainContainer,(t||!a)&&se.docMainContainerEnhanced),children:(0,m.jsx)("div",{className:(0,o.c)("container padding-top--md padding-bottom--lg",se.docItemWrapper,t&&se.docItemWrapperEnhanced),children:n})})}const ce={docRoot:"docRoot_DfVB",docsWrapper:"docsWrapper__sE8"};function re(e){let{children:t}=e;const n=(0,c.m)(),[o,i]=(0,a.useState)(!1);return(0,m.jsxs)("div",{className:ce.docsWrapper,children:[(0,m.jsx)(b,{}),(0,m.jsxs)("div",{className:ce.docRoot,children:[n&&(0,m.jsx)(ie,{sidebar:n.items,hiddenSidebarContainer:o,setHiddenSidebarContainer:i}),(0,m.jsx)(le,{hiddenSidebarContainer:o,children:t})]})]})}var de=n(328);function ue(e){const t=(0,l.Uj)(e);if(!t)return(0,m.jsx)(de.c,{});const{docElement:n,sidebarName:a,sidebarItems:r}=t;return(0,m.jsx)(i.cr,{className:(0,o.c)(s.W.page.docsDocPage),children:(0,m.jsx)(c.y,{name:a,items:r,children:(0,m.jsx)(re,{children:n})})})}},328:(e,t,n)=>{n.d(t,{c:()=>l});n(6952);var a=n(8112),o=n(3432),i=n(1468),s=n(1948);function l(e){let{className:t}=e;return(0,s.jsx)("main",{className:(0,a.c)("container margin-vert--xl",t),children:(0,s.jsx)("div",{className:"row",children:(0,s.jsxs)("div",{className:"col col--6 col--offset-3",children:[(0,s.jsx)(i.default,{as:"h1",className:"hero__title",children:(0,s.jsx)(o.c,{id:"theme.NotFound.title",description:"The title of the 404 page",children:"Page Not Found"})}),(0,s.jsx)("p",{children:(0,s.jsx)(o.c,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page",children:"We could not find what you were looking for."})}),(0,s.jsx)("p",{children:(0,s.jsx)(o.c,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page",children:"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."})})]})})})}},7152:(e,t,n)=>{n.d(t,{E:()=>r,g:()=>c});var a=n(6952),o=n(5104),i=n(1948);const s=Symbol("EmptyContext"),l=a.createContext(s);function c(e){let{children:t}=e;const[n,o]=(0,a.useState)(null),s=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:o})),[n]);return(0,i.jsx)(l.Provider,{value:s,children:t})}function r(){const e=(0,a.useContext)(l);if(e===s)throw new o.AH("DocSidebarItemsExpandedStateProvider");return e}},8632:(e,t,n)=>{n.d(t,{O:()=>s});var a=n(6952),o=n(320),i=n(4752);function s(e){let{threshold:t}=e;const[n,s]=(0,a.useState)(!1),l=(0,a.useRef)(!1),{startScroll:c,cancelScroll:r}=(0,o.yI)();return(0,o.SM)(((e,n)=>{let{scrollY:a}=e;const o=null==n?void 0:n.scrollY;o&&(l.current?l.current=!1:a>=o?(r(),s(!1)):a<t?s(!1):a+window.innerHeight<document.documentElement.scrollHeight&&s(!0))})),(0,i.c)((e=>{e.location.hash&&(l.current=!0,s(!1))})),{shown:n,scrollToTop:()=>c(0)}}}}]);