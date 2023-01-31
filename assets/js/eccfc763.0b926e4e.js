"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[154,893,514],{2214:function(e,t,n){n.r(t),n.d(t,{default:function(){return ye}});var a=n(7378),r=n(8944),i=n(1123),l=n(5484),o=n(3149),c=n(2949),d=n(5611),s=n(2095),u=n(3379),m=n(9213),b=n(9169),p="backToTopButton_iEvu",f="backToTopButtonShow_DO8w";function v(){var e=(0,b.a)({threshold:300}),t=e.shown,n=e.scrollToTop;return a.createElement("button",{"aria-label":(0,m.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,r.Z)("clean-btn",l.k.common.backToTopButton,p,t&&f),type:"button",onClick:n})}var h=n(5331),E=n(8357),g=n(624),k=n(898),_=n(5773);function C(e){return a.createElement("svg",(0,_.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}var I="collapseSidebarButton_oTwn",S="collapseSidebarButtonIcon_pMEX";function y(e){var t=e.onClick;return a.createElement("button",{type:"button",title:(0,m.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,r.Z)("button button--secondary button--outline",I),onClick:t},a.createElement(C,{className:S}))}var N=n(10),Z=n(3457),x=n(808),T=n(3205),w=n(8215),A=n(376),L=n(8862),M=n(1884),P=n(6457),B=["item","onItemClick","activePath","level","index"];function F(e){var t=e.categoryLabel,n=e.onClick;return a.createElement("button",{"aria-label":(0,m.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function H(e){var t=e.item,n=e.onItemClick,i=e.activePath,o=e.level,d=e.index,s=(0,x.Z)(e,B),u=t.items,m=t.label,b=t.collapsible,p=t.className,f=t.href,v=(0,g.L)().docs.sidebar.autoCollapseCategories,h=function(e){var t=(0,P.Z)();return(0,a.useMemo)((function(){return e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0}),[e,t])}(t),E=(0,c._F)(t,i),k=(0,L.Mg)(f,i),C=(0,A.u)({initialState:function(){return!!b&&(!E&&t.collapsed)}}),I=C.collapsed,S=C.setCollapsed,y=(0,T.f)(),N=y.expandedItem,Z=y.setExpandedItem,H=function(e){void 0===e&&(e=!I),Z(e?null:d),S(e)};return function(e){var t=e.isActive,n=e.collapsed,r=e.updateCollapsed,i=(0,w.D9)(t);(0,a.useEffect)((function(){t&&!i&&n&&r(!1)}),[t,i,n,r])}({isActive:E,collapsed:I,updateCollapsed:H}),(0,a.useEffect)((function(){b&&null!=N&&N!==d&&v&&S(!0)}),[b,N,d,S,v]),a.createElement("li",{className:(0,r.Z)(l.k.docs.docSidebarItemCategory,l.k.docs.docSidebarItemCategoryLevel(o),"menu__list-item",{"menu__list-item--collapsed":I},p)},a.createElement("div",{className:(0,r.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":k})},a.createElement(M.default,(0,_.Z)({className:(0,r.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!f&&b,"menu__link--active":E}),onClick:b?function(e){null==n||n(t),f?H(!1):(e.preventDefault(),H())}:function(){null==n||n(t)},"aria-current":k?"page":void 0,"aria-expanded":b?!I:void 0,href:b?null!=h?h:"#":h},s),m),f&&b&&a.createElement(F,{categoryLabel:m,onClick:function(e){e.preventDefault(),H()}})),a.createElement(A.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:I},a.createElement(J,{items:u,tabIndex:I?-1:0,onItemClick:n,activePath:i,level:o+1})))}var O=n(5626),D=n(6125),R="menuExternalLink_BiEj",j=["item","onItemClick","activePath","level","index"];function W(e){var t=e.item,n=e.onItemClick,i=e.activePath,o=e.level,d=(e.index,(0,x.Z)(e,j)),s=t.href,u=t.label,m=t.className,b=t.autoAddBaseUrl,p=(0,c._F)(t,i),f=(0,O.Z)(s);return a.createElement("li",{className:(0,r.Z)(l.k.docs.docSidebarItemLink,l.k.docs.docSidebarItemLinkLevel(o),"menu__list-item",m),key:u},a.createElement(M.default,(0,_.Z)({className:(0,r.Z)("menu__link",!f&&R,{"menu__link--active":p}),autoAddBaseUrl:b,"aria-current":p?"page":void 0,to:s},f&&{onClick:n?function(){return n(t)}:void 0},d),u,!f&&a.createElement(D.Z,null)))}var V="menuHtmlItem_OniL";function Y(e){var t=e.item,n=e.level,i=e.index,o=t.value,c=t.defaultStyle,d=t.className;return a.createElement("li",{className:(0,r.Z)(l.k.docs.docSidebarItemLink,l.k.docs.docSidebarItemLinkLevel(n),c&&[V,"menu__list-item"],d),key:i,dangerouslySetInnerHTML:{__html:o}})}var z=["item"];function U(e){var t=e.item,n=(0,x.Z)(e,z);switch(t.type){case"category":return a.createElement(H,(0,_.Z)({item:t},n));case"html":return a.createElement(Y,(0,_.Z)({item:t},n));default:return a.createElement(W,(0,_.Z)({item:t},n))}}var G=["items"];function K(e){var t=e.items,n=(0,x.Z)(e,G);return a.createElement(T.D,null,t.map((function(e,t){return a.createElement(U,(0,_.Z)({key:t,item:e,index:t},n))})))}var J=(0,a.memo)(K),q="menu_jmj1",Q="menuWithAnnouncementBar_YufC";function X(e){var t=e.path,n=e.sidebar,i=e.className,o=function(){var e=(0,N.nT)().isActive,t=(0,a.useState)(e),n=t[0],r=t[1];return(0,Z.RF)((function(t){var n=t.scrollY;e&&r(0===n)}),[e]),e&&n}();return a.createElement("nav",{"aria-label":(0,m.I)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,r.Z)("menu thin-scrollbar",q,o&&Q,i)},a.createElement("ul",{className:(0,r.Z)(l.k.docs.docSidebarMenu,"menu__list")},a.createElement(J,{items:n,activePath:t,level:1})))}var $="sidebar_CUen",ee="sidebarWithHideableNavbar_w4KB",te="sidebarHidden_k6VE",ne="sidebarLogo_CYvI";function ae(e){var t=e.path,n=e.sidebar,i=e.onCollapse,l=e.isHidden,o=(0,g.L)(),c=o.navbar.hideOnScroll,d=o.docs.sidebar.hideable;return a.createElement("div",{className:(0,r.Z)($,c&&ee,l&&te)},c&&a.createElement(k.Z,{tabIndex:-1,className:ne}),a.createElement(X,{path:t,sidebar:n}),d&&a.createElement(y,{onClick:i}))}var re=a.memo(ae),ie=n(3471),le=n(5536),oe=function(e){var t=e.sidebar,n=e.path,i=(0,le.e)();return a.createElement("ul",{className:(0,r.Z)(l.k.docs.docSidebarMenu,"menu__list")},a.createElement(J,{items:t,activePath:n,onItemClick:function(e){"category"===e.type&&e.href&&i.toggle(),"link"===e.type&&i.toggle()},level:1}))};function ce(e){return a.createElement(ie.Zo,{component:oe,props:e})}var de=a.memo(ce);function se(e){var t=(0,E.i)(),n="desktop"===t||"ssr"===t,r="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(re,e),r&&a.createElement(de,e))}var ue="expandButton_YOoA",me="expandButtonIcon_GZLG";function be(e){var t=e.toggleSidebar;return a.createElement("div",{className:ue,title:(0,m.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(C,{className:me}))}var pe={docSidebarContainer:"docSidebarContainer_y0RQ",docSidebarContainerHidden:"docSidebarContainerHidden_uArb",sidebarViewport:"sidebarViewport_EJ1r"};function fe(e){var t,n=e.children,r=(0,s.V)();return a.createElement(a.Fragment,{key:null!=(t=null==r?void 0:r.name)?t:"noSidebar"},n)}function ve(e){var t=e.sidebar,n=e.hiddenSidebarContainer,i=e.setHiddenSidebarContainer,o=(0,h.TH)().pathname,c=(0,a.useState)(!1),d=c[0],s=c[1],u=(0,a.useCallback)((function(){d&&s(!1),i((function(e){return!e}))}),[i,d]);return a.createElement("aside",{className:(0,r.Z)(l.k.docs.docSidebarContainer,pe.docSidebarContainer,n&&pe.docSidebarContainerHidden),onTransitionEnd:function(e){e.currentTarget.classList.contains(pe.docSidebarContainer)&&n&&s(!0)}},a.createElement(fe,null,a.createElement("div",{className:(0,r.Z)(pe.sidebarViewport,d&&pe.sidebarViewportHidden)},a.createElement(se,{sidebar:t,path:o,onCollapse:u,isHidden:d}),d&&a.createElement(be,{toggleSidebar:u}))))}var he={docMainContainer:"docMainContainer_sTIZ",docMainContainerEnhanced:"docMainContainerEnhanced_iSjt",docItemWrapperEnhanced:"docItemWrapperEnhanced_PxMR"};function Ee(e){var t=e.hiddenSidebarContainer,n=e.children,i=(0,s.V)();return a.createElement("main",{className:(0,r.Z)(he.docMainContainer,(t||!i)&&he.docMainContainerEnhanced)},a.createElement("div",{className:(0,r.Z)("container padding-top--md padding-bottom--lg",he.docItemWrapper,t&&he.docItemWrapperEnhanced)},n))}var ge="docPage_KLoz",ke="docsWrapper_ct1J";function _e(e){var t=e.children,n=(0,s.V)(),r=(0,a.useState)(!1),i=r[0],l=r[1];return a.createElement(u.Z,{wrapperClassName:ke},a.createElement(v,null),a.createElement("div",{className:ge},n&&a.createElement(ve,{sidebar:n.items,hiddenSidebarContainer:i,setHiddenSidebarContainer:l}),a.createElement(Ee,{hiddenSidebarContainer:i},t)))}var Ce=n(3893),Ie=n(505);function Se(e){var t=e.versionMetadata;return a.createElement(a.Fragment,null,a.createElement(Ie.Z,{version:t.version,tag:(0,o.os)(t.pluginId,t.version)}),a.createElement(i.d,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function ye(e){var t=e.versionMetadata,n=(0,c.hI)(e);if(!n)return a.createElement(Ce.default,null);var o=n.docElement,u=n.sidebarName,m=n.sidebarItems;return a.createElement(a.Fragment,null,a.createElement(Se,e),a.createElement(i.FG,{className:(0,r.Z)(l.k.wrapper.docsPages,l.k.page.docsDocPage,e.versionMetadata.className)},a.createElement(d.q,{version:t},a.createElement(s.b,{name:u,items:m},a.createElement(_e,null,o)))))}},3893:function(e,t,n){n.r(t),n.d(t,{default:function(){return o}});var a=n(7378),r=n(9213),i=n(1123),l=n(3379);function o(){return a.createElement(a.Fragment,null,a.createElement(i.d,{title:(0,r.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(l.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(r.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},3205:function(e,t,n){n.d(t,{D:function(){return o},f:function(){return c}});var a=n(7378),r=n(8215),i=Symbol("EmptyContext"),l=a.createContext(i);function o(e){var t=e.children,n=(0,a.useState)(null),r=n[0],i=n[1],o=(0,a.useMemo)((function(){return{expandedItem:r,setExpandedItem:i}}),[r]);return a.createElement(l.Provider,{value:o},t)}function c(){var e=(0,a.useContext)(l);if(e===i)throw new r.i6("DocSidebarItemsExpandedStateProvider");return e}},9169:function(e,t,n){n.d(t,{a:function(){return l}});var a=n(7378),r=n(3457),i=n(4993);function l(e){var t=e.threshold,n=(0,a.useState)(!1),l=n[0],o=n[1],c=(0,a.useRef)(!1),d=(0,r.Ct)(),s=d.startScroll,u=d.cancelScroll;return(0,r.RF)((function(e,n){var a=e.scrollY,r=null==n?void 0:n.scrollY;r&&(c.current?c.current=!1:a>=r?(u(),o(!1)):a<t?o(!1):a+window.innerHeight<document.documentElement.scrollHeight&&o(!0))})),(0,i.S)((function(e){e.location.hash&&(c.current=!0,o(!1))})),{shown:l,scrollToTop:function(){return s(0)}}}},9746:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var a=n(7378).createContext({options:{banner:"",breadcrumbs:!0,gitRefName:"master",minimal:!1,pluginId:"default",scopes:[]},reflections:{}});t.ApiDataContext=a},6723:function(e,t,n){var a=["options","packages"];function r(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}n(4675),n(3335);var i=n(7378),l=n(2214),o=n(9746),c=function(e){return e&&e.__esModule?e:{default:e}},d=c(i),s=c(l);function u(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)}function m(e,t,n){return Object.entries(e).forEach((function(a){var r=a[0],i=a[1];if("id"===r){var l="type"in e;(!l||l&&"reference"!==e.type)&&(t[Number(i)]=e,n&&(e.parentId=n.id))}else Array.isArray(i)?i.forEach((function(n){u(n)&&m(n,t,e)})):u(i)&&m(i,t,e)})),t}function b(e){var t={};return e.forEach((function(e){e.entryPoints.forEach((function(e){m(e.reflection,t)}))})),t}e.exports=function(e){var t=e.options,n=e.packages,l=r(e,a),c=i.useMemo((function(){return{options:t,reflections:b(n)}}),[t,n]);return d.default.createElement(o.ApiDataContext.Provider,{value:c},d.default.createElement("div",{className:"apiPage"},d.default.createElement(s.default,l)))}},4675:function(e,t,n){n.r(t)},3335:function(e,t,n){n.r(t)}}]);