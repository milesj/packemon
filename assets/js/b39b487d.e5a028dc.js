"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[517],{3635:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var n=a(5773),l=a(808),r=a(7378),s=a(8944),i=a(9213),c=a(5796),u="anchorWithStickyNavbar_YDjN",o="anchorWithHideOnScrollNavbar_c5FC",d=["as","id"],m=["as"];function f(e){var t,a=e.as,m=e.id,f=(0,l.Z)(e,d),p=(0,c.useThemeConfig)().navbar.hideOnScroll;return m?r.createElement(a,(0,n.Z)({},f,{className:(0,s.Z)("anchor",(t={},t[o]=p,t[u]=!p,t)),id:m}),f.children,r.createElement("a",{className:"hash-link",href:"#"+m,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):r.createElement(a,f)}function p(e){var t=e.as,a=(0,l.Z)(e,m);return"h1"===t?r.createElement("h1",(0,n.Z)({},a,{id:void 0}),a.children):r.createElement(f,(0,n.Z)({as:t},a))}},1739:function(e,t,a){var n=a(7378),l=a(1884),r=a(5796),s=a(3635),i=a(6498),c=a(6715),u=function(e){return e&&e.__esModule?e:{default:e}},o=u(n),d=u(l),m=u(s);function f(e,t,a){if(!e.match(/api\/([\d.]+)/)&&!e.includes("api/next")&&a&&a.name!==t.label){var n="current"===a.name?"next":a.name;return e.endsWith("/api")?e+"/"+n:e.replace("/api/","/api/"+n+"/")}return e}e.exports=function(e){var t=e.packages,a=e.history,l=e.versionMetadata,s=r.useDocsVersion(),u=r.useDocsPreferredVersion(l.pluginId).preferredVersion;return n.useEffect((function(){1===t.length?a.replace(f(t[0].entryPoints[0].reflection.permalink,s,u)):u&&a.replace(f(a.location.pathname,s,u))}),[t,a,s,u]),o.default.createElement("div",{className:"row"},o.default.createElement("div",{className:"col apiItemCol"},o.default.createElement(c.VersionBanner,{versionMetadata:l}),o.default.createElement("div",{className:"apiItemContainer"},o.default.createElement("article",null,o.default.createElement("div",{className:"markdown"},o.default.createElement("header",null,o.default.createElement(m.default,{as:"h1"},"API")),o.default.createElement("section",{className:"tsd-panel"},o.default.createElement("h3",{className:"tsd-panel-header"},"Packages"),o.default.createElement("div",{className:"tsd-panel-content"},o.default.createElement("ul",{className:"tsd-index-list"},t.map((function(e){return o.default.createElement("li",{key:e.packageName,className:"tsd-truncate"},o.default.createElement(d.default,{className:"tsd-kind-icon",to:e.entryPoints[0].reflection.permalink},o.default.createElement("span",{className:"tsd-signature-symbol"},"v",e.packageVersion)," ",o.default.createElement("span",null,e.packageName)))})))))),o.default.createElement(i.Footer,null)))))}},6498:function(e,t,a){Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(a(7378));t.Footer=function(){return n.default.createElement("footer",{className:"tsd-footer"},"Powered by"," ",n.default.createElement("a",{href:"https://github.com/milesj/docusaurus-plugin-typedoc-api"},"docusaurus-plugin-typedoc-api")," ","and ",n.default.createElement("a",{href:"https://typedoc.org/"},"TypeDoc"))}},6715:function(e,t,a){Object.defineProperty(t,"__esModule",{value:!0});var n=a(7378),l=a(1884),r=a(8696),s=a(5796),i=function(e){return e&&e.__esModule?e:{default:e}},c=i(n),u=i(l);t.VersionBanner=function(e){var t=e.versionMetadata,a=t.banner,l=t.pluginId,i=t.version,o=r.useDocVersionSuggestions(l).latestVersionSuggestion,d=s.useDocsPreferredVersion(l).savePreferredVersionName,m=n.useCallback((function(){d(o.name)}),[o.name,d]);if(!a||!o)return null;var f=t.docs[o.label];return c.default.createElement("div",{className:s.ThemeClassNames.docs.docVersionBanner+" alert alert--warning margin-bottom--md",role:"alert"},c.default.createElement("div",null,"unreleased"===a&&c.default.createElement(c.default.Fragment,null,"This is documentation for an unreleased version."),"unmaintained"===a&&c.default.createElement(c.default.Fragment,null,"This is documentation for version ",c.default.createElement("b",null,i),".")," ","For the latest API, see version"," ",c.default.createElement("b",null,c.default.createElement(u.default,{to:f.id,onClick:m},f.title)),"."))}}}]);