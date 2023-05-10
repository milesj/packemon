"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[124],{5318:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return d}});var r=n(7378);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=l(n),m=i,d=u["".concat(p,".").concat(m)]||u[m]||f[m]||o;return n?r.createElement(d,a(a({ref:t},s),{},{components:n})):r.createElement(d,a({ref:t},s))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=m;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c[u]="string"==typeof e?e:i,a[1]=c;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1094:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return d},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return u}});var r=n(5773),i=n(808),o=(n(7378),n(5318)),a=["components"],c={title:"init"},p=void 0,l={unversionedId:"init",id:"init",title:"init",description:"The init command is an interactive prompt that configures a package. It asks a series of",source:"@site/docs/init.md",sourceDirName:".",slug:"/init",permalink:"/docs/init",draft:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/init.md",tags:[],version:"current",frontMatter:{title:"init"},sidebar:"docs",previous:{title:"files",permalink:"/docs/files"},next:{title:"pack",permalink:"/docs/pack"}},s={},u=[{value:"Options",id:"options",level:2}],f={toc:u},m="wrapper";function d(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)(m,(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"init")," command is an interactive prompt that configures a package. It asks a series of\nquestions, primarily what format(s) the package will build, what platform(s) it will run on, what\nenvironments it will support, entry points, so on and so forth."),(0,o.kt)("p",null,"Once the prompts are complete, it will inject a ",(0,o.kt)("inlineCode",{parentName:"p"},"packemon")," block to the package's ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json"),".\nFor more information on settings, check out the ",(0,o.kt)("a",{parentName:"p",href:"./config"},"configuration documentation"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"packemon init\n")),(0,o.kt)("h2",{id:"options"},"Options"),(0,o.kt)("p",null,"Init supports the following command line options."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--force")," - Override if already been configured."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--skipPrivate")," - Skip ",(0,o.kt)("inlineCode",{parentName:"li"},"private")," packages from being configured.")))}d.isMDXComponent=!0}}]);