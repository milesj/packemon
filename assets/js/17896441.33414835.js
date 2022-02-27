"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[918],{2086:function(e,t,a){a.r(t),a.d(t,{default:function(){return v}});var n=a(7378),l=a(5796),s="breadcrumbsContainer_nmcO",r="breadcrumbsItemLink_LVKE",i=a(8944),c=a(1884),o=a(8948);function d(e){var t=e.children,a=e.href,l=(0,i.Z)("breadcrumbs__link",r);return a?n.createElement(c.default,{className:l,href:a},t):n.createElement("span",{className:l},t)}function m(e){var t=e.children,a=e.active;return n.createElement("li",{className:(0,i.Z)("breadcrumbs__item",{"breadcrumbs__item--active":a})},t)}function u(){var e=(0,o.Z)("/");return n.createElement(m,null,n.createElement(d,{href:e},"\ud83c\udfe0"))}function v(){var e=(0,l.useSidebarBreadcrumbs)(),t=(0,l.useHomePageRoute)();return e?n.createElement("nav",{className:(0,i.Z)(l.ThemeClassNames.docs.docBreadcrumbs,s),"aria-label":"breadcrumbs"},n.createElement("ul",{className:"breadcrumbs"},t&&n.createElement(u,null),e.map((function(t,a){return n.createElement(m,{key:a,active:a===e.length-1},n.createElement(d,{href:t.href},t.label))})))):null}},4674:function(e,t,a){a.r(t),a.d(t,{default:function(){return j}});var n=a(7378),l=a(8944),s=a(6030),r=a(353),i=a(1884),c=a(9213),o=a(8696),d=a(5796);var m={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(c.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(c.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function u(e){var t=m[e.versionMetadata.banner];return n.createElement(t,e)}function v(e){var t=e.versionLabel,a=e.to,l=e.onClick;return n.createElement(c.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(i.default,{to:a,onClick:l},n.createElement(c.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function h(e){var t,a=e.className,s=e.versionMetadata,i=(0,r.default)().siteConfig.title,c=(0,o.useActivePlugin)({failfast:!0}).pluginId,m=(0,d.useDocsPreferredVersion)(c).savePreferredVersionName,h=(0,o.useDocVersionSuggestions)(c),b=h.latestDocSuggestion,f=h.latestVersionSuggestion,g=null!=b?b:(t=f).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,l.Z)(a,d.ThemeClassNames.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(u,{siteTitle:i,versionMetadata:s})),n.createElement("div",{className:"margin-top--md"},n.createElement(v,{versionLabel:f.label,to:g.path,onClick:function(){return m(f.name)}})))}function b(e){var t=e.className,a=(0,d.useDocsVersion)();return a.banner?n.createElement(h,{className:t,versionMetadata:a}):null}var f=a(2461),g=a(1956);function E(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(c.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function p(e){var t=e.lastUpdatedBy;return n.createElement(c.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function N(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,l=e.lastUpdatedBy;return n.createElement("span",{className:d.ThemeClassNames.common.lastUpdated},n.createElement(c.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(E,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(p,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var _=a(5773),C=a(808),L="iconEdit_OMbO",T=["className"];function k(e){var t=e.className,a=(0,C.Z)(e,T);return n.createElement("svg",(0,_.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,l.Z)(L,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function Z(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:d.ThemeClassNames.common.editThisPage},n.createElement(k,null),n.createElement(c.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var U="tag_VWGF",y="tagRegular_sIPu",w="tagWithCount_YgKf";function A(e){var t,a=e.permalink,s=e.name,r=e.count;return n.createElement(i.default,{href:a,className:(0,l.Z)(U,(t={},t[y]=!r,t[w]=r,t))},s,r&&n.createElement("span",null,r))}var H="tags_WPdo",x="tag_XHyC";function V(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(c.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,l.Z)(H,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:x},n.createElement(A,{name:t,permalink:a}))}))))}var B="lastUpdated_vA0S";function O(e){return n.createElement("div",{className:(0,l.Z)(d.ThemeClassNames.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(V,e)))}function D(e){var t=e.editUrl,a=e.lastUpdatedAt,s=e.lastUpdatedBy,r=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,l.Z)(d.ThemeClassNames.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(Z,{editUrl:t})),n.createElement("div",{className:(0,l.Z)("col",B)},(a||s)&&n.createElement(N,{lastUpdatedAt:a,formattedLastUpdatedAt:r,lastUpdatedBy:s})))}function M(e){var t=e.content.metadata,a=t.editUrl,s=t.lastUpdatedAt,r=t.formattedLastUpdatedAt,i=t.lastUpdatedBy,c=t.tags,o=c.length>0,m=!!(a||s||i);return o||m?n.createElement("footer",{className:(0,l.Z)(d.ThemeClassNames.docs.docFooter,"docusaurus-mt-lg")},o&&n.createElement(O,{tags:c}),m&&n.createElement(D,{editUrl:a,lastUpdatedAt:s,lastUpdatedBy:i,formattedLastUpdatedAt:r})):null}var S=a(7488),I=a(1140),F=a(3635),P="docItemContainer_yJzi",W="docItemCol_ygLL",z="tocMobile_By44",R=a(2086);function j(e){var t,a,r=e.content,i=r.metadata,c=r.frontMatter,o=r.assets,m=c.keywords,u=c.hide_title,v=c.hide_table_of_contents,h=c.toc_min_heading_level,E=c.toc_max_heading_level,p=i.description,N=i.title,_=null!=(t=o.image)?t:c.image,C=!u&&void 0===r.contentTitle,L=(0,d.useWindowSize)(),T=!v&&r.toc&&r.toc.length>0,k=T&&("desktop"===L||"ssr"===L);return n.createElement(n.Fragment,null,n.createElement(g.default,{title:N,description:p,keywords:m,image:_}),n.createElement("div",{className:"row"},n.createElement("div",{className:(0,l.Z)("col",(a={},a[W]=!v,a))},n.createElement(b,null),n.createElement("div",{className:P},n.createElement("article",null,n.createElement(R.default,null),n.createElement(f.default,null),T&&n.createElement(I.default,{toc:r.toc,minHeadingLevel:h,maxHeadingLevel:E,className:(0,l.Z)(d.ThemeClassNames.docs.docTocMobile,z)}),n.createElement("div",{className:(0,l.Z)(d.ThemeClassNames.docs.docMarkdown,"markdown")},C&&n.createElement("header",null,n.createElement(F.default,{as:"h1"},N)),n.createElement(r,null)),n.createElement(M,e)),n.createElement(s.default,{previous:i.previous,next:i.next}))),k&&n.createElement("div",{className:"col col--3"},n.createElement(S.default,{toc:r.toc,minHeadingLevel:h,maxHeadingLevel:E,className:d.ThemeClassNames.docs.docTocDesktop}))))}},6030:function(e,t,a){a.r(t),a.d(t,{default:function(){return c}});var n=a(5773),l=a(7378),s=a(9213),r=a(1884);function i(e){var t=e.permalink,a=e.title,n=e.subLabel;return l.createElement(r.default,{className:"pagination-nav__link",to:t},n&&l.createElement("div",{className:"pagination-nav__sublabel"},n),l.createElement("div",{className:"pagination-nav__label"},a))}function c(e){var t=e.previous,a=e.next;return l.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,s.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},l.createElement("div",{className:"pagination-nav__item"},t&&l.createElement(i,(0,n.Z)({},t,{subLabel:l.createElement(s.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")}))),l.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},a&&l.createElement(i,(0,n.Z)({},a,{subLabel:l.createElement(s.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next")}))))}},2461:function(e,t,a){a.r(t),a.d(t,{default:function(){return i}});var n=a(7378),l=a(9213),s=a(5796),r=a(8944);function i(e){var t=e.className,a=(0,s.useDocsVersion)();return a.badge?n.createElement("span",{className:(0,r.Z)(t,s.ThemeClassNames.docs.docVersionBadge,"badge badge--secondary")},n.createElement(l.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:a.label}},"Version: {versionLabel}")):null}},3635:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});var n=a(5773),l=a(808),s=a(7378),r=a(8944),i=a(9213),c=a(5796),o="anchorWithStickyNavbar_YDjN",d="anchorWithHideOnScrollNavbar_c5FC",m=["as","id"],u=["as"];function v(e){var t,a=e.as,u=e.id,v=(0,l.Z)(e,m),h=(0,c.useThemeConfig)().navbar.hideOnScroll;return u?s.createElement(a,(0,n.Z)({},v,{className:(0,r.Z)("anchor",(t={},t[d]=h,t[o]=!h,t)),id:u}),v.children,s.createElement("a",{className:"hash-link",href:"#"+u,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):s.createElement(a,v)}function h(e){var t=e.as,a=(0,l.Z)(e,u);return"h1"===t?s.createElement("h1",(0,n.Z)({},a,{id:void 0}),a.children):s.createElement(v,(0,n.Z)({as:t},a))}},7488:function(e,t,a){a.r(t),a.d(t,{default:function(){return d}});var n=a(5773),l=a(808),s=a(7378),r=a(8944),i=a(3160),c="tableOfContents_jWtb",o=["className"];function d(e){var t=e.className,a=(0,l.Z)(e,o);return s.createElement("div",{className:(0,r.Z)(c,"thin-scrollbar",t)},s.createElement(i.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},1140:function(e,t,a){a.r(t),a.d(t,{default:function(){return u}});var n=a(7378),l=a(8944),s=a(9213),r=a(5796),i="tocCollapsible_aX8Q",c="tocCollapsibleButton_Va7b",o="tocCollapsibleContent_EOAA",d="tocCollapsibleExpanded_mrpG",m=a(3160);function u(e){var t,a=e.toc,u=e.className,v=e.minHeadingLevel,h=e.maxHeadingLevel,b=(0,r.useCollapsible)({initialState:!0}),f=b.collapsed,g=b.toggleCollapsed;return n.createElement("div",{className:(0,l.Z)(i,(t={},t[d]=!f,t),u)},n.createElement("button",{type:"button",className:(0,l.Z)("clean-btn",c),onClick:g},n.createElement(s.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page")),n.createElement(r.Collapsible,{lazy:!0,className:o,collapsed:f},n.createElement(m.Z,{toc:a,minHeadingLevel:v,maxHeadingLevel:h})))}},3160:function(e,t,a){a.d(t,{Z:function(){return o}});var n=a(5773),l=a(808),s=a(7378),r=a(5796),i=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function c(e){var t=e.toc,a=e.className,n=e.linkClassName,l=e.isChild;return t.length?s.createElement("ul",{className:l?void 0:a},t.map((function(e){return s.createElement("li",{key:e.id},s.createElement("a",{href:"#"+e.id,className:null!=n?n:void 0,dangerouslySetInnerHTML:{__html:e.value}}),s.createElement(c,{isChild:!0,toc:e.children,className:a,linkClassName:n}))}))):null}function o(e){var t=e.toc,a=e.className,o=void 0===a?"table-of-contents table-of-contents__left-border":a,d=e.linkClassName,m=void 0===d?"table-of-contents__link":d,u=e.linkActiveClassName,v=void 0===u?void 0:u,h=e.minHeadingLevel,b=e.maxHeadingLevel,f=(0,l.Z)(e,i),g=(0,r.useThemeConfig)(),E=null!=h?h:g.tableOfContents.minHeadingLevel,p=null!=b?b:g.tableOfContents.maxHeadingLevel,N=(0,r.useFilteredAndTreeifiedTOC)({toc:t,minHeadingLevel:E,maxHeadingLevel:p}),_=(0,s.useMemo)((function(){if(m&&v)return{linkClassName:m,linkActiveClassName:v,minHeadingLevel:E,maxHeadingLevel:p}}),[m,v,E,p]);return(0,r.useTOCHighlight)(_),s.createElement(c,(0,n.Z)({toc:N,className:o,linkClassName:m},f))}}}]);