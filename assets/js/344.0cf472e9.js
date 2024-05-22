"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[344],{7069:(e,r,t)=>{t.d(r,{e:()=>u,i:()=>l});var o=t(3696),a=t(5198),n=t(2540);const s=o.createContext(null);function l(e){let{children:r,content:t,isBlogPostPage:a=!1}=e;const l=function(e){let{content:r,isBlogPostPage:t}=e;return(0,o.useMemo)((()=>({metadata:r.metadata,frontMatter:r.frontMatter,assets:r.assets,toc:r.toc,isBlogPostPage:t})),[r,t])}({content:t,isBlogPostPage:a});return(0,n.jsx)(s.Provider,{value:l,children:r})}function u(){const e=(0,o.useContext)(s);if(null===e)throw new a.dV("BlogPostProvider");return e}},1471:(e,r,t)=>{t.d(r,{A:()=>u,G:()=>i});var o=t(3696),a=t(5198),n=t(2540);const s=Symbol("EmptyContext"),l=o.createContext(s);function u(e){let{children:r}=e;const[t,a]=(0,o.useState)(null),s=(0,o.useMemo)((()=>({expandedItem:t,setExpandedItem:a})),[t]);return(0,n.jsx)(l.Provider,{value:s,children:r})}function i(){const e=(0,o.useContext)(l);if(e===s)throw new a.dV("DocSidebarItemsExpandedStateProvider");return e}},8389:(e,r,t)=>{t.d(r,{H:()=>s});var o=t(3696),a=t(766),n=t(2432);function s(e){let{threshold:r}=e;const[t,s]=(0,o.useState)(!1),l=(0,o.useRef)(!1),{startScroll:u,cancelScroll:i}=(0,a.gk)();return(0,a.Mq)(((e,t)=>{let{scrollY:o}=e;const a=null==t?void 0:t.scrollY;a&&(l.current?l.current=!1:o>=a?(i(),s(!1)):o<r?s(!1):o+window.innerHeight<document.documentElement.scrollHeight&&s(!0))})),(0,n.$)((e=>{e.location.hash&&(l.current=!0,s(!1))})),{shown:t,scrollToTop:()=>u(0)}}},5107:(e,r,t)=>{t.r(r),t.d(r,{Collapsible:()=>C.N,ErrorBoundaryError:()=>H.bq,ErrorBoundaryErrorMessageFallback:()=>H.MN,ErrorBoundaryTryAgainButton:()=>H.a2,ErrorCauseBoundary:()=>H.k2,HtmlClassNameProvider:()=>B.e3,NavbarSecondaryMenuFiller:()=>E.GX,PageMetadata:()=>B.be,ReactContextError:()=>T.dV,SkipToContentFallbackId:()=>q.j,SkipToContentLink:()=>q.K,ThemeClassNames:()=>y.G,ThemedComponent:()=>a.A,UnlistedBannerMessage:()=>R.Uh,UnlistedBannerTitle:()=>R.Rc,UnlistedMetadata:()=>R.AE,composeProviders:()=>T.fM,createStorageSlot:()=>n.Wf,duplicates:()=>L.X,filterDocCardListItems:()=>l.d1,isMultiColumnFooterLinks:()=>F.C,isRegexpStringMatch:()=>I.G,listStorageKeys:()=>n.Eo,listTagsByLetters:()=>V,prefersReducedMotion:()=>P.O,processAdmonitionProps:()=>U.c,translateTagsPageTitle:()=>D,uniq:()=>L.s,useBlogListPageStructuredData:()=>h,useBlogPostStructuredData:()=>f,useClearQueryString:()=>j.W9,useCollapsible:()=>C.u,useColorMode:()=>M.G,useContextualSearchFilters:()=>s.af,useCurrentSidebarCategory:()=>l.$S,useDocsPreferredVersion:()=>N.g1,useEvent:()=>T._q,useHistorySelector:()=>j.Hl,usePluralForm:()=>v.W,usePrevious:()=>T.ZC,usePrismTheme:()=>A.A,useQueryString:()=>j.l,useQueryStringList:()=>j.fV,useSearchLinkCreator:()=>x.w,useSearchQueryString:()=>x.b,useStorageSlot:()=>n.Dv,useThemeConfig:()=>o.p,useWindowSize:()=>w.l});var o=t(7412),a=t(1205),n=t(8708),s=t(8721),l=t(8600),u=t(883),i=t(7032),c=t(6745);var d=t(7069);const g=e=>new Date(e).toISOString();function m(e){const r=e.map(b);return{author:1===r.length?r[0]:r}}function p(e,r,t){return e?{image:S({imageUrl:r(e,{absolute:!0}),caption:"title image for the blog post: "+t})}:{}}function h(e){const{siteConfig:r}=(0,i.default)(),{withBaseUrl:t}=(0,u.h)(),{metadata:{blogDescription:o,blogTitle:a,permalink:n}}=e,s=""+r.url+n;return{"@context":"https://schema.org","@type":"Blog","@id":s,mainEntityOfPage:s,headline:a,description:o,blogPost:e.items.map((e=>function(e,r,t){var o,a;const{assets:n,frontMatter:s,metadata:l}=e,{date:u,title:i,description:c,lastUpdatedAt:d}=l,h=null!=(o=n.image)?o:s.image,f=null!=(a=s.keywords)?a:[],b=""+r.url+l.permalink,S=d?g(d):void 0;return{"@type":"BlogPosting","@id":b,mainEntityOfPage:b,url:b,headline:i,name:i,description:c,datePublished:u,...S?{dateModified:S}:{},...m(l.authors),...p(h,t,i),...f?{keywords:f}:{}}}(e.content,r,t)))}}function f(){var e,r;const t=function(){var e;const r=(0,c.A)(),t=null==r||null==(e=r.data)?void 0:e.blogMetadata;if(!t)throw new Error("useBlogMetadata() can't be called on the current route because the blog metadata could not be found in route context");return t}(),{assets:o,metadata:a}=(0,d.e)(),{siteConfig:n}=(0,i.default)(),{withBaseUrl:s}=(0,u.h)(),{date:l,title:h,description:f,frontMatter:b,lastUpdatedAt:S}=a,v=null!=(e=o.image)?e:b.image,C=null!=(r=b.keywords)?r:[],y=S?g(S):void 0,P=""+n.url+a.permalink;return{"@context":"https://schema.org","@type":"BlogPosting","@id":P,mainEntityOfPage:P,url:P,headline:h,name:h,description:f,datePublished:l,...y?{dateModified:y}:{},...m(a.authors),...p(v,s,h),...C?{keywords:C}:{},isPartOf:{"@type":"Blog","@id":""+n.url+t.blogBasePath,name:t.blogTitle}}}function b(e){return{"@type":"Person",...e.name?{name:e.name}:{},...e.title?{description:e.title}:{},...e.url?{url:e.url}:{},...e.email?{email:e.email}:{},...e.imageURL?{image:e.imageURL}:{}}}function S(e){let{imageUrl:r,caption:t}=e;return{"@type":"ImageObject","@id":r,url:r,contentUrl:r,caption:t}}var v=t(2815),C=t(51),y=t(3237),P=t(7683),T=t(5198),B=t(8586),M=t(2363),E=t(5454),w=t(2575),k=t(6590);const D=()=>(0,k.T)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});function V(e){const r={};return Object.values(e).forEach((e=>{const t=function(e){return e[0].toUpperCase()}(e.label);null!=r[t]||(r[t]=[]),r[t].push(e)})),Object.entries(r).sort(((e,r)=>{let[t]=e,[o]=r;return t.localeCompare(o)})).map((e=>{let[r,t]=e;return{letter:r,tags:t.sort(((e,r)=>e.label.localeCompare(r.label)))}}))}var x=t(945),F=t(568),I=t(4242),L=t(4544),A=t(8204),N=t(3947),U=t(3279),j=t(5043),q=t(7018),R=t(8379),H=t(2199)},2368:(e,r,t)=>{t.r(r),t.d(r,{AnnouncementBarProvider:()=>c.oq,BlogPostProvider:()=>u.i,Collapsible:()=>o.Collapsible,ColorModeProvider:()=>p.a,DEFAULT_SEARCH_TAG:()=>b.Cy,DocProvider:()=>l._,DocSidebarItemsExpandedStateProvider:()=>a.A,DocsPreferredVersionContextProvider:()=>i.VQ,DocsSidebarProvider:()=>s.V,DocsVersionProvider:()=>n.n,ErrorBoundaryError:()=>o.ErrorBoundaryError,ErrorBoundaryErrorMessageFallback:()=>o.ErrorBoundaryErrorMessageFallback,ErrorBoundaryTryAgainButton:()=>o.ErrorBoundaryTryAgainButton,ErrorCauseBoundary:()=>o.ErrorCauseBoundary,HtmlClassNameProvider:()=>o.HtmlClassNameProvider,NavbarProvider:()=>w.G,NavbarSecondaryMenuFiller:()=>o.NavbarSecondaryMenuFiller,PageMetadata:()=>o.PageMetadata,PluginHtmlClassNameProvider:()=>E.Jx,ReactContextError:()=>o.ReactContextError,ScrollControllerProvider:()=>B.Tv,SkipToContentFallbackId:()=>o.SkipToContentFallbackId,SkipToContentLink:()=>o.SkipToContentLink,ThemeClassNames:()=>o.ThemeClassNames,ThemedComponent:()=>o.ThemedComponent,UnlistedBannerMessage:()=>o.UnlistedBannerMessage,UnlistedBannerTitle:()=>o.UnlistedBannerTitle,UnlistedMetadata:()=>o.UnlistedMetadata,composeProviders:()=>o.composeProviders,containsLineNumbers:()=>f._u,createStorageSlot:()=>o.createStorageSlot,docVersionSearchTag:()=>b.tU,duplicates:()=>o.duplicates,filterDocCardListItems:()=>o.filterDocCardListItems,findFirstSidebarItemLink:()=>S.Nr,findSidebarCategory:()=>S._j,getPrismCssVariables:()=>f.M$,isActiveSidebarItem:()=>S.w8,isDocsPluginEnabled:()=>S.C5,isMultiColumnFooterLinks:()=>o.isMultiColumnFooterLinks,isRegexpStringMatch:()=>o.isRegexpStringMatch,isSamePath:()=>M.ys,isVisibleSidebarItem:()=>S.Se,keyboardFocusedClassName:()=>L.w,listStorageKeys:()=>o.listStorageKeys,listTagsByLetters:()=>o.listTagsByLetters,parseCodeBlockTitle:()=>f.wt,parseLanguage:()=>f.Op,parseLines:()=>f.Li,prefersReducedMotion:()=>o.prefersReducedMotion,processAdmonitionProps:()=>o.processAdmonitionProps,sanitizeTabsChildren:()=>d.v,splitNavbarItems:()=>w.D,translateTagsPageTitle:()=>o.translateTagsPageTitle,uniq:()=>o.uniq,useAlternatePageUtils:()=>h.o,useAnnouncementBar:()=>c.Mj,useBackToTopButton:()=>U.H,useBlogListPageStructuredData:()=>o.useBlogListPageStructuredData,useBlogPost:()=>u.e,useBlogPostStructuredData:()=>o.useBlogPostStructuredData,useClearQueryString:()=>o.useClearQueryString,useCodeWordWrap:()=>N.f,useCollapsible:()=>o.useCollapsible,useColorMode:()=>o.useColorMode,useContextualSearchFilters:()=>o.useContextualSearchFilters,useCurrentSidebarCategory:()=>o.useCurrentSidebarCategory,useDateTimeFormat:()=>F.i,useDoc:()=>l.u,useDocById:()=>S.cC,useDocRootMetadata:()=>S.B5,useDocSidebarItemsExpandedState:()=>a.G,useDocsPreferredVersion:()=>o.useDocsPreferredVersion,useDocsPreferredVersionByPluginId:()=>i.XK,useDocsSidebar:()=>s.t,useDocsVersion:()=>n.r,useDocsVersionCandidates:()=>S.Vd,useEvent:()=>o.useEvent,useFilteredAndTreeifiedTOC:()=>T.h,useHideableNavbar:()=>I.S,useHistoryPopHandler:()=>P.$Z,useHistorySelector:()=>P.Hl,useHomePageRoute:()=>M.Dt,useKeyboardNavigation:()=>L.J,useLayoutDoc:()=>S.QB,useLayoutDocsSidebar:()=>S.fW,useLocalPathname:()=>y.B,useLocationChange:()=>C.$,useLockBodyScroll:()=>A._,useNavbarMobileSidebar:()=>g.M,useNavbarSecondaryMenu:()=>m.T,usePluralForm:()=>o.usePluralForm,usePrevious:()=>o.usePrevious,usePrismTheme:()=>o.usePrismTheme,useQueryString:()=>o.useQueryString,useQueryStringList:()=>o.useQueryStringList,useQueryStringValue:()=>P.aZ,useScrollController:()=>B.n1,useScrollPosition:()=>B.Mq,useScrollPositionBlocker:()=>B.a_,useSearchLinkCreator:()=>o.useSearchLinkCreator,useSearchQueryString:()=>o.useSearchQueryString,useSidebarBreadcrumbs:()=>S.OF,useSmoothScrollTo:()=>B.gk,useStorageSlot:()=>o.useStorageSlot,useTOCHighlight:()=>k.i,useTabs:()=>d.u,useThemeConfig:()=>o.useThemeConfig,useTitleFormatter:()=>v.s,useTreeifiedTOC:()=>T.v,useVisibleBlogSidebarItems:()=>x,useVisibleSidebarItems:()=>S.Y,useWindowSize:()=>o.useWindowSize});var o=t(5107),a=t(1471),n=t(7294),s=t(4382),l=t(2373),u=t(7069),i=t(3947),c=t(3043),d=t(5373),g=t(9539),m=t(2145),p=t(2363),h=t(577),f=t(1629),b=t(8721),S=t(8600),v=t(4343),C=t(2432),y=t(7052),P=t(5043),T=t(725),B=t(766),M=t(4379),E=t(8586),w=t(6927),k=t(8808),D=t(3696),V=t(9519);function x(e){const{pathname:r}=(0,V.zy)();return(0,D.useMemo)((()=>e.filter((e=>function(e,r){return!(e.unlisted&&!(0,M.ys)(e.permalink,r))}(e,r)))),[e,r])}var F=t(1636),I=t(8484),L=t(9984),A=t(6856),N=t(789),U=t(8389)},5373:(e,r,t)=>{t.d(r,{u:()=>m,v:()=>i});var o=t(3696),a=t(9519),n=t(4395),s=t(5043),l=t(4544),u=t(8708);function i(e){var r,t;return null!=(r=null==(t=o.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,o.isValidElement)(e)&&function(e){const{props:r}=e;return!!r&&"object"==typeof r&&"value"in r}(e))return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:t.filter(Boolean))?r:[]}function c(e){const{values:r,children:t}=e;return(0,o.useMemo)((()=>{const e=null!=r?r:function(e){return i(e).map((e=>{let{props:{value:r,label:t,attributes:o,default:a}}=e;return{value:r,label:t,attributes:o,default:a}}))}(t);return function(e){const r=(0,l.X)(e,((e,r)=>e.value===r.value));if(r.length>0)throw new Error('Docusaurus error: Duplicate values "'+r.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[r,t])}function d(e){let{value:r,tabValues:t}=e;return t.some((e=>e.value===r))}function g(e){let{queryString:r=!1,groupId:t}=e;const n=(0,a.W6)(),l=function(e){let{queryString:r=!1,groupId:t}=e;if("string"==typeof r)return r;if(!1===r)return null;if(!0===r&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=t?t:null}({queryString:r,groupId:t});return[(0,s.aZ)(l),(0,o.useCallback)((e=>{if(!l)return;const r=new URLSearchParams(n.location.search);r.set(l,e),n.replace({...n.location,search:r.toString()})}),[l,n])]}function m(e){const{defaultValue:r,queryString:t=!1,groupId:a}=e,s=c(e),[l,i]=(0,o.useState)((()=>function(e){var r;let{defaultValue:t,tabValues:o}=e;if(0===o.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:o}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+t+'" but none of its children has the corresponding value. Available values are: '+o.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return t}const a=null!=(r=o.find((e=>e.default)))?r:o[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:r,tabValues:s}))),[m,p]=g({queryString:t,groupId:a}),[h,f]=function(e){let{groupId:r}=e;const t=function(e){return e?"docusaurus.tab."+e:null}(r),[a,n]=(0,u.Dv)(t);return[a,(0,o.useCallback)((e=>{t&&n.set(e)}),[t,n])]}({groupId:a}),b=(()=>{const e=null!=m?m:h;return d({value:e,tabValues:s})?e:null})();(0,n.A)((()=>{b&&i(b)}),[b]);return{selectedValue:l,selectValue:(0,o.useCallback)((e=>{if(!d({value:e,tabValues:s}))throw new Error("Can't select invalid tab value="+e);i(e),p(e),f(e)}),[p,f,s]),tabValues:s}}},2815:(e,r,t)=>{t.d(r,{W:()=>i});var o=t(3696),a=t(7032);const n=["zero","one","two","few","many","other"];function s(e){return n.filter((r=>e.includes(r)))}const l={locale:"en",pluralForms:s(["one","other"]),select:e=>1===e?"one":"other"};function u(){const{i18n:{currentLocale:e}}=(0,a.default)();return(0,o.useMemo)((()=>{try{return function(e){const r=new Intl.PluralRules(e);return{locale:e,pluralForms:s(r.resolvedOptions().pluralCategories),select:e=>r.select(e)}}(e)}catch(r){return console.error('Failed to use Intl.PluralRules for locale "'+e+'".\nDocusaurus will fallback to the default (English) implementation.\nError: '+r.message+"\n"),l}}),[e])}function i(){const e=u();return{selectMessage:(r,t)=>function(e,r,t){const o=e.split("|");if(1===o.length)return o[0];o.length>t.pluralForms.length&&console.error("For locale="+t.locale+", a maximum of "+t.pluralForms.length+" plural forms are expected ("+t.pluralForms.join(",")+"), but the message contains "+o.length+": "+e);const a=t.select(r),n=t.pluralForms.indexOf(a);return o[Math.min(n,o.length-1)]}(t,r,e)}}},8814:(e,r,t)=>{const o=t(2540);r.Footer=function(){return o.jsxs("footer",{className:"tsd-footer",children:["Powered by"," ",o.jsx("a",{href:"https://github.com/milesj/docusaurus-plugin-typedoc-api",children:"docusaurus-plugin-typedoc-api"})," ","and ",o.jsx("a",{href:"https://typedoc.org/",children:"TypeDoc"})]})}},9123:(e,r,t)=>{const o=t(3696),a=t(3587),n=t(4548),s=t(5107),l=t(2368),u=t(2540),i=(e=>e&&e.__esModule?e:{default:e})(a);r.VersionBanner=function(){const e=l.useDocsVersion(),r=e.banner,t=e.docs,a=e.pluginId,c=e.version,d=n.useDocVersionSuggestions(a).latestVersionSuggestion,g=s.useDocsPreferredVersion(a).savePreferredVersionName,m=o.useCallback((()=>{g(d.name)}),[d.name,g]);if(!r||!d)return null;const p=t[d.label];return u.jsx("div",{className:s.ThemeClassNames.docs.docVersionBanner+" alert alert--warning margin-bottom--md",role:"alert",children:u.jsxs("div",{children:["unreleased"===r&&u.jsx(u.Fragment,{children:"This is documentation for an unreleased version."}),"unmaintained"===r&&u.jsxs(u.Fragment,{children:["This is documentation for version ",u.jsx("b",{children:c}),"."]})," ","For the latest API, see version"," ",u.jsx("b",{children:u.jsx(i.default,{to:p.id,onClick:m,children:p.title})}),"."]})})}}}]);