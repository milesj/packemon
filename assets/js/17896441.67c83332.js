"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[918],{5318:function(e,t,a){a.d(t,{Zo:function(){return d},kt:function(){return p}});var n=a(7378);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},d=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=c(a),p=r,v=u["".concat(i,".").concat(p)]||u[p]||m[p]||l;return a?n.createElement(v,o(o({ref:t},d),{},{components:a})):n.createElement(v,o({ref:t},d))}));function p(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},9165:function(e,t,a){a.r(t),a.d(t,{default:function(){return $}});var n=a(7378),r=a(8944),l=a(1123),o=a(8357),s=a(5484),i=a(4619),c=a(353),d=a(1884),m=a(9213),u=a(2935),p=a(4453),v=a(5611);var f={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(m.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(m.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function E(e){var t=f[e.versionMetadata.banner];return n.createElement(t,e)}function b(e){var t=e.versionLabel,a=e.to,r=e.onClick;return n.createElement(m.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(d.default,{to:a,onClick:r},n.createElement(m.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function g(e){var t,a=e.className,l=e.versionMetadata,o=(0,c.default)().siteConfig.title,i=(0,u.useActivePlugin)({failfast:!0}).pluginId,d=(0,p.J)(i).savePreferredVersionName,m=(0,u.useDocVersionSuggestions)(i),v=m.latestDocSuggestion,f=m.latestVersionSuggestion,g=null!=v?v:(t=f).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,r.Z)(a,s.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(E,{siteTitle:o,versionMetadata:l})),n.createElement("div",{className:"margin-top--md"},n.createElement(b,{versionLabel:f.label,to:g.path,onClick:function(){return d(f.name)}})))}function h(e){var t=e.className,a=(0,v.E)();return a.banner?n.createElement(g,{className:t,versionMetadata:a}):null}var y=a(5069);function w(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(m.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function k(e){var t=e.lastUpdatedBy;return n.createElement(m.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function U(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,r=e.lastUpdatedBy;return n.createElement("span",{className:s.k.common.lastUpdated},n.createElement(m.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(w,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:r?n.createElement(k,{lastUpdatedBy:r}):""}},"Last updated{atDate}{byUser}"),!1)}var T=a(5773),N=a(808),O="iconEdit_VEMf",L=["className"];function Z(e){var t=e.className,a=(0,N.Z)(e,L);return n.createElement("svg",(0,T.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,r.Z)(O,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function _(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:s.k.common.editThisPage},n.createElement(Z,null),n.createElement(m.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var A="tag_otG2",P="tagRegular_s0E1",j="tagWithCount_PGyn";function x(e){var t=e.permalink,a=e.label,l=e.count;return n.createElement(d.default,{href:t,className:(0,r.Z)(A,l?j:P)},a,l&&n.createElement("span",null,l))}var C="tags_Ow0B",D="tag_DFxh";function M(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(m.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,r.Z)(C,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:D},n.createElement(x,{label:t,permalink:a}))}))))}var B="lastUpdated_EIRz";function V(e){return n.createElement("div",{className:(0,r.Z)(s.k.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(M,e)))}function S(e){var t=e.editUrl,a=e.lastUpdatedAt,l=e.lastUpdatedBy,o=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,r.Z)(s.k.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(_,{editUrl:t})),n.createElement("div",{className:(0,r.Z)("col",B)},(a||l)&&n.createElement(U,{lastUpdatedAt:a,formattedLastUpdatedAt:o,lastUpdatedBy:l})))}function F(e){var t=e.content.metadata,a=t.editUrl,l=t.lastUpdatedAt,o=t.formattedLastUpdatedAt,i=t.lastUpdatedBy,c=t.tags,d=c.length>0,m=!!(a||l||i);return d||m?n.createElement("footer",{className:(0,r.Z)(s.k.docs.docFooter,"docusaurus-mt-lg")},d&&n.createElement(V,{tags:c}),m&&n.createElement(S,{editUrl:a,lastUpdatedAt:l,lastUpdatedBy:i,formattedLastUpdatedAt:o})):null}var I=a(7061),R=a(2218),H=a(1999),z=a(1271),G=a(5318),q=a(2791);function J(e){var t=e.children;return n.createElement(G.Zo,{components:q.default},t)}var W="docItemContainer_f4nO",X="docItemCol_TsoR",K="tocMobile_y4A9";function Q(e){var t,a=e.content,r=a.metadata,o=a.frontMatter,s=a.assets,i=o.keywords,c=r.description,d=r.title,m=null!=(t=s.image)?t:o.image;return n.createElement(l.d,{title:d,description:c,keywords:i,image:m})}function Y(e){var t=e.content,a=t.metadata,l=t.frontMatter,c=l.hide_title,d=l.hide_table_of_contents,m=l.toc_min_heading_level,u=l.toc_max_heading_level,p=a.title,v=!c&&void 0===t.contentTitle,f=(0,o.i)(),E=!d&&t.toc&&t.toc.length>0,b=E&&("desktop"===f||"ssr"===f);return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,r.Z)("col",!d&&X)},n.createElement(h,null),n.createElement("div",{className:W},n.createElement("article",null,n.createElement(z.default,null),n.createElement(y.default,null),E&&n.createElement(R.default,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:u,className:(0,r.Z)(s.k.docs.docTocMobile,K)}),n.createElement("div",{className:(0,r.Z)(s.k.docs.docMarkdown,"markdown")},v&&n.createElement("header",null,n.createElement(H.default,{as:"h1"},p)),n.createElement(J,null,n.createElement(t,null))),n.createElement(F,e)),n.createElement(i.default,{previous:a.previous,next:a.next}))),b&&n.createElement("div",{className:"col col--3"},n.createElement(I.default,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:u,className:s.k.docs.docTocDesktop})))}function $(e){var t="docs-doc-id-"+e.content.metadata.unversionedId;return n.createElement(l.FG,{className:t},n.createElement(Q,e),n.createElement(Y,e))}}}]);