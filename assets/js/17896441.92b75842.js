"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[918],{5318:function(e,t,a){a.d(t,{Zo:function(){return d},kt:function(){return v}});var n=a(7378);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},d=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=c(a),v=r,p=u["".concat(s,".").concat(v)]||u[v]||m[v]||l;return a?n.createElement(p,o(o({ref:t},d),{},{components:a})):n.createElement(p,o({ref:t},d))}));function v(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<l;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2296:function(e,t,a){a.r(t),a.d(t,{default:function(){return re}});var n=a(7378),r=a(1123),l=a(9446);function o(){var e,t=(0,l.k)(),a=t.metadata,o=t.frontMatter,i=t.assets;return n.createElement(r.d,{title:a.title,description:a.description,keywords:o.keywords,image:null!=(e=i.image)?e:o.image})}var i=a(8944),s=a(8357),c=a(4619);function d(){var e=(0,l.k)().metadata;return n.createElement(c.default,{previous:e.previous,next:e.next})}var m=a(353),u=a(1884),v=a(9213),p=a(2935),f=a(5484),E=a(4453),b=a(5611);var h={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function g(e){var t=h[e.versionMetadata.banner];return n.createElement(t,e)}function y(e){var t=e.versionLabel,a=e.to,r=e.onClick;return n.createElement(v.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(u.default,{to:a,onClick:r},n.createElement(v.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function k(e){var t,a=e.className,r=e.versionMetadata,l=(0,m.default)().siteConfig.title,o=(0,p.useActivePlugin)({failfast:!0}).pluginId,s=(0,E.J)(o).savePreferredVersionName,c=(0,p.useDocVersionSuggestions)(o),d=c.latestDocSuggestion,u=c.latestVersionSuggestion,v=null!=d?d:(t=u).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,i.Z)(a,f.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(g,{siteTitle:l,versionMetadata:r})),n.createElement("div",{className:"margin-top--md"},n.createElement(y,{versionLabel:u.label,to:v.path,onClick:function(){return s(u.name)}})))}function w(e){var t=e.className,a=(0,b.E)();return a.banner?n.createElement(k,{className:t,versionMetadata:a}):null}var U=a(5069);function T(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(v.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function N(e){var t=e.lastUpdatedBy;return n.createElement(v.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function O(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,r=e.lastUpdatedBy;return n.createElement("span",{className:f.k.common.lastUpdated},n.createElement(v.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(T,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:r?n.createElement(N,{lastUpdatedBy:r}):""}},"Last updated{atDate}{byUser}"),!1)}var L=a(5773),_=a(808),Z="iconEdit_bHB7",j=["className"];function P(e){var t=e.className,a=(0,_.Z)(e,j);return n.createElement("svg",(0,L.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,i.Z)(Z,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function A(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:f.k.common.editThisPage},n.createElement(P,null),n.createElement(v.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var x="tag_otG2",M="tagRegular_s0E1",C="tagWithCount_PGyn";function D(e){var t=e.permalink,a=e.label,r=e.count;return n.createElement(u.default,{href:t,className:(0,i.Z)(x,r?C:M)},a,r&&n.createElement("span",null,r))}var B="tags_Ow0B",S="tag_DFxh";function V(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(v.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,i.Z)(B,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:S},n.createElement(D,{label:t,permalink:a}))}))))}var F="lastUpdated_pbO5";function I(e){return n.createElement("div",{className:(0,i.Z)(f.k.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(V,e)))}function H(e){var t=e.editUrl,a=e.lastUpdatedAt,r=e.lastUpdatedBy,l=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,i.Z)(f.k.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(A,{editUrl:t})),n.createElement("div",{className:(0,i.Z)("col",F)},(a||r)&&n.createElement(O,{lastUpdatedAt:a,formattedLastUpdatedAt:l,lastUpdatedBy:r})))}function R(){var e=(0,l.k)().metadata,t=e.editUrl,a=e.lastUpdatedAt,r=e.formattedLastUpdatedAt,o=e.lastUpdatedBy,s=e.tags,c=s.length>0,d=!!(t||a||o);return c||d?n.createElement("footer",{className:(0,i.Z)(f.k.docs.docFooter,"docusaurus-mt-lg")},c&&n.createElement(I,{tags:s}),d&&n.createElement(H,{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:o,formattedLastUpdatedAt:r})):null}var G=a(2218),q="tocMobile_Ojys";function z(){var e=(0,l.k)(),t=e.toc,a=e.frontMatter;return n.createElement(G.default,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:(0,i.Z)(f.k.docs.docTocMobile,q)})}var J=a(7061);function Q(){var e=(0,l.k)(),t=e.toc,a=e.frontMatter;return n.createElement(J.default,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:f.k.docs.docTocDesktop})}var W=a(1999),X=a(5318),K=a(34);function Y(e){var t=e.children;return n.createElement(X.Zo,{components:K.default},t)}function $(e){var t,a,r,o,s=e.children,c=(t=(0,l.k)(),a=t.metadata,r=t.frontMatter,o=t.contentTitle,r.hide_title||void 0!==o?null:a.title);return n.createElement("div",{className:(0,i.Z)(f.k.docs.docMarkdown,"markdown")},c&&n.createElement("header",null,n.createElement(W.default,{as:"h1"},c)),n.createElement(Y,null,s))}var ee=a(3911),te="docItemContainer_tjFy",ae="docItemCol_Qr34";function ne(e){var t,a,r,o,c,m,u=e.children,v=(t=(0,l.k)(),a=t.frontMatter,r=t.toc,o=(0,s.i)(),c=a.hide_table_of_contents,m=!c&&r.length>0,{hidden:c,mobile:m?n.createElement(z,null):void 0,desktop:!m||"desktop"!==o&&"ssr"!==o?void 0:n.createElement(Q,null)});return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,i.Z)("col",!v.hidden&&ae)},n.createElement(w,null),n.createElement("div",{className:te},n.createElement("article",null,n.createElement(ee.default,null),n.createElement(U.default,null),v.mobile,n.createElement($,null,u),n.createElement(R,null)),n.createElement(d,null))),v.desktop&&n.createElement("div",{className:"col col--3"},v.desktop))}function re(e){var t="docs-doc-id-"+e.content.metadata.unversionedId,a=e.content;return n.createElement(l.b,{content:e.content},n.createElement(r.FG,{className:t},n.createElement(o,null),n.createElement(ne,null,n.createElement(a,null))))}}}]);