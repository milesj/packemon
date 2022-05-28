"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[786],{5318:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return f}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),c=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=c(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),d=c(n),f=r,u=d["".concat(p,".").concat(f)]||d[f]||m[f]||o;return n?a.createElement(u,l(l({ref:t},s),{},{components:n})):a.createElement(u,l({ref:t},s))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9208:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return m}});var a=n(5773),r=n(808),o=(n(7378),n(5318)),l=["components"],i={title:"Scaffold",sidebar_label:"scaffold"},p=void 0,c={unversionedId:"scaffold",id:"scaffold",title:"Scaffold",description:"The scaffold command is an interactive prompt that scaffolds a project or package from scratch. It",source:"@site/docs/scaffold.md",sourceDirName:".",slug:"/scaffold",permalink:"/docs/scaffold",draft:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/scaffold.md",tags:[],version:"current",frontMatter:{title:"Scaffold",sidebar_label:"scaffold"},sidebar:"docs",previous:{title:"pack",permalink:"/docs/pack"},next:{title:"validate",permalink:"/docs/validate"}},s={},m=[{value:"Options",id:"options",level:2},{value:"Templates",id:"templates",level:2},{value:"<code>monorepo</code>",id:"monorepo",level:3},{value:"<code>monorepo-package</code>",id:"monorepo-package",level:3},{value:"<code>polyrepo</code>",id:"polyrepo",level:3},{value:"<code>polyrepo-package</code>",id:"polyrepo-package",level:3}],d={toc:m};function f(e){var t=e.components,n=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"scaffold")," command is an interactive prompt that scaffolds a project or package from scratch. It\ncreates all the necessary files, folders, and configurations for maintaining an npm package(s)."),(0,o.kt)("p",null,"The command ",(0,o.kt)("em",{parentName:"p"},"requires")," a destination folder param to copy files to. The path is relative to the\ncurrent working directory."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"packemon scaffold .\n")),(0,o.kt)("h2",{id:"options"},"Options"),(0,o.kt)("p",null,"Scaffold supports the following command line options."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--force")," - Overwrite files that already exist (if running the same command multiple times)."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--skipInstall")," - Skip installation of npm dependencies. Defaults to ",(0,o.kt)("inlineCode",{parentName:"li"},"false"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--packageManager")," - Package manager to install dependencies with. Defaults to ",(0,o.kt)("inlineCode",{parentName:"li"},"yarn"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--packagesFolder")," - Folder in which packages will be located (monorepo only). Defaults to\n",(0,o.kt)("inlineCode",{parentName:"li"},"packages"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"--template")," - Template to select by default.")),(0,o.kt)("h2",{id:"templates"},"Templates"),(0,o.kt)("p",null,"The following templates can be scaffolded."),(0,o.kt)("h3",{id:"monorepo"},(0,o.kt)("inlineCode",{parentName:"h3"},"monorepo")),(0,o.kt)("p",null,"Structures a project to be a monorepo of many packages."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Creates config files for common developer tools (Babel, ESLint, Jest, TypeScript, etc), based on\n",(0,o.kt)("a",{parentName:"li",href:"https://github.com/beemojs/dev"},"Beemo presets"),"."),(0,o.kt)("li",{parentName:"ul"},"Creates a ",(0,o.kt)("inlineCode",{parentName:"li"},"packages")," folder where all packages will exist. Create a package with the\n",(0,o.kt)("inlineCode",{parentName:"li"},"monorepo-package")," template."),(0,o.kt)("li",{parentName:"ul"},"Configures ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," with pre-defined scripts ",(0,o.kt)("em",{parentName:"li"},"and")," Yarn workspaces."),(0,o.kt)("li",{parentName:"ul"},"Configures ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json")," for type-checking ",(0,o.kt)("em",{parentName:"li"},"and")," project references.")),(0,o.kt)("h3",{id:"monorepo-package"},(0,o.kt)("inlineCode",{parentName:"h3"},"monorepo-package")),(0,o.kt)("p",null,"Creates an npm package within a monorepo's ",(0,o.kt)("inlineCode",{parentName:"p"},"packages")," folder. Requires ",(0,o.kt)("inlineCode",{parentName:"p"},"monorepo")," to be scaffolded\nfirst!"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Creates ",(0,o.kt)("inlineCode",{parentName:"li"},"src")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"tests")," folders with example TypeScript files."),(0,o.kt)("li",{parentName:"ul"},"Creates a ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," with information gathered from the prompts."),(0,o.kt)("li",{parentName:"ul"},"Configures package ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json"),"s to use project references."),(0,o.kt)("li",{parentName:"ul"},"Adds a reference to the root ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json"),".")),(0,o.kt)("h3",{id:"polyrepo"},(0,o.kt)("inlineCode",{parentName:"h3"},"polyrepo")),(0,o.kt)("p",null,"Structures a project to be a polyrepo of 1 package."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Creates config files for common developer tools (Babel, ESLint, Jest, TypeScript, etc), based on\n",(0,o.kt)("a",{parentName:"li",href:"https://github.com/beemojs/dev"},"Beemo presets"),"."),(0,o.kt)("li",{parentName:"ul"},"Configures ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," with pre-defined scripts."),(0,o.kt)("li",{parentName:"ul"},"Configures ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json")," for type-checking.")),(0,o.kt)("h3",{id:"polyrepo-package"},(0,o.kt)("inlineCode",{parentName:"h3"},"polyrepo-package")),(0,o.kt)("p",null,"Creates a single npm package within the current folder. This will scaffold ",(0,o.kt)("inlineCode",{parentName:"p"},"polyrepo")," if it hasn't\nbeen!"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Creates ",(0,o.kt)("inlineCode",{parentName:"li"},"src")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"tests")," folders with example TypeScript files."),(0,o.kt)("li",{parentName:"ul"},"Creates a ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," with information gathered from the prompts.")))}f.isMDXComponent=!0}}]);