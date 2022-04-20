"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[501],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),m=r,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return n?a.createElement(f,i(i({ref:t},c),{},{components:n})):a.createElement(f,i({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},517:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(7378);function r(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},637:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(5773),r=n(7378),o=n(6457),i=n(1309),l=n(8944),s="tabItem_WhCL";function u(e){var t,n,o,u=e.lazy,c=e.block,p=e.defaultValue,d=e.values,m=e.groupId,f=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=d?d:k.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,i.duplicates)(g,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===p?p:null!=(t=null!=p?p:null==(n=k.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=k[0])?void 0:o.props.value;if(null!==b&&!g.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var v=(0,i.useTabGroupChoice)(),y=v.tabGroupChoices,N=v.setTabGroupChoices,E=(0,r.useState)(b),j=E[0],w=E[1],C=[],T=(0,i.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=m){var O=y[m];null!=O&&O!==j&&g.some((function(e){return e.value===O}))&&w(O)}var D=function(e){var t=e.currentTarget,n=C.indexOf(t),a=g[n].value;a!==j&&(T(t),w(a),null!=m&&N(m,a))},P=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=C.indexOf(e.currentTarget)+1;n=C[a]||C[0];break;case"ArrowLeft":var r=C.indexOf(e.currentTarget)-1;n=C[r]||C[C.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},f)},g.map((function(e){var t=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:j===t?0:-1,"aria-selected":j===t,key:t,ref:function(e){return C.push(e)},onKeyDown:P,onFocus:D,onClick:D},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":j===t})}),null!=n?n:t)}))),u?(0,r.cloneElement)(k.filter((function(e){return e.props.value===j}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==j})}))))}function c(e){var t=(0,o.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},3650:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return c},default:function(){return k},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return m}});var a=n(5773),r=n(808),o=(n(7378),n(5318)),i=n(637),l=n(517),s=["components"],u={title:"Setup & requirements"},c=void 0,p={unversionedId:"setup",id:"setup",title:"Setup & requirements",description:"Packemon has been designed to build and prepare packages for distribution, and as such, supports",source:"@site/docs/setup.mdx",sourceDirName:".",slug:"/setup",permalink:"/docs/setup",editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/setup.mdx",tags:[],version:"current",frontMatter:{title:"Setup & requirements"},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/install"},next:{title:"Features & optimizations",permalink:"/docs/features"}},d={},m=[{value:"Package structure",id:"package-structure",level:2},{value:"TypeScript integration",id:"typescript-integration",level:2},{value:"Update output directories",id:"update-output-directories",level:3},{value:"Enable emitting",id:"enable-emitting",level:3},{value:"Disable JSON resolving",id:"disable-json-resolving",level:3},{value:"Supporting project references",id:"supporting-project-references",level:3}],f={toc:m};function k(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Packemon has been designed to build and prepare packages for distribution, and as such, supports\nworkspaces (monorepos) or single packages (polyrepo). By default, only packages configured for\nPackemon will be built (denoted by a ",(0,o.kt)("inlineCode",{parentName:"p"},"packemon")," block in ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json"),"). This allows specific\npackages to be completely ignored if need be."),(0,o.kt)("p",null,"To ease the setup process, Packemon provides an interactive ",(0,o.kt)("a",{parentName:"p",href:"/docs/init"},(0,o.kt)("inlineCode",{parentName:"a"},"init"))," command that will\nconfigure each package one-by-one. This ",(0,o.kt)("em",{parentName:"p"},"must")," be ran in the project root."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"packemon init\n")),(0,o.kt)("h2",{id:"package-structure"},"Package structure"),(0,o.kt)("p",null,"Regardless of your project type, Packemon makes the following assumptions, some of which are hard\nrequirements."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," (of course)."),(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," have a source folder named ",(0,o.kt)("inlineCode",{parentName:"li"},"src"),". Builds will output relative to this."),(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," have a source entry point, typically a ",(0,o.kt)("inlineCode",{parentName:"li"},"src/index.(js|ts)")," file."),(0,o.kt)("li",{parentName:"ul"},"Each package may contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json"),"."),(0,o.kt)("li",{parentName:"ul"},"Each package should contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"LICENSE(.md)?")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"README(.md)?"),".")),(0,o.kt)("p",null,"This would look something like the following."),(0,o.kt)(i.Z,{groupId:"package-structure",defaultValue:"poly",values:[{label:"Polyrepo",value:"poly"},{label:"Monorepo",value:"mono"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"poly",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 src/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"))),(0,o.kt)(l.Z,{value:"mono",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 packages/\n\u2502   \u251c\u2500\u2500 foo/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u251c\u2500\u2500 bar/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u2514\u2500\u2500 baz/\n\u2502       \u251c\u2500\u2500 src/\n\u2502       \u251c\u2500\u2500 package.json\n\u2502       \u251c\u2500\u2500 LICENSE\n\u2502       \u2514\u2500\u2500 README.md\n\u251c\u2500\u2500 lerna.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")))),(0,o.kt)("h2",{id:"typescript-integration"},"TypeScript integration"),(0,o.kt)("p",null,"Integrating with TypeScript can sometimes be tricky, and with Packemon, that is definitely the case.\nSince Packemon now handles the build process, TypeScript should be configured for type checking and\ndeclaration generation only."),(0,o.kt)("p",null,"However, if that is not possible. You can supply a custom tsconfig for Packemon building only\nthrough the ",(0,o.kt)("inlineCode",{parentName:"p"},"--declarationConfig")," option."),(0,o.kt)("h3",{id:"update-output-directories"},"Update output directories"),(0,o.kt)("p",null,"Both the ",(0,o.kt)("inlineCode",{parentName:"p"},"outDir")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"declarationDir")," settings should be updated to ",(0,o.kt)("inlineCode",{parentName:"p"},"dts"),", and should ",(0,o.kt)("em",{parentName:"p"},"not")," be set\nto ",(0,o.kt)("inlineCode",{parentName:"p"},"lib"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"build"),", or some other variant. This is especially true if using project references."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "declaration": true,\n        "declarationDir": "dts",\n        "outDir": "dts"\n    }\n}\n')),(0,o.kt)("h3",{id:"enable-emitting"},"Enable emitting"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"noEmit")," setting should ",(0,o.kt)("em",{parentName:"p"},"only")," be used on the command line (via an npm script) and should not be\nconfigured explicitly. We require emitting of declarations."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-diff",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n  "compilerOptions": {\n-    "noEmit": false\n  }\n}\n')),(0,o.kt)("h3",{id:"disable-json-resolving"},"Disable JSON resolving"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"resolveJsonModule")," setting alters the output folder structure in such a way that it breaks the\nguarantees that Packemon needs for handling declarations."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "resolveJsonModule": false\n    }\n}\n')),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"If you really need to support this feature, please create an issue so that we can track it\nproperly.")),(0,o.kt)("h3",{id:"supporting-project-references"},"Supporting project references"),(0,o.kt)("p",null,"Alongside the requirements listed above, the ",(0,o.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," within each project reference package\nshould be updated to only emit declarations to ",(0,o.kt)("inlineCode",{parentName:"p"},"dts"),", like so."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "declaration": true,\n        "declarationDir": "dts",\n        "outDir": "dts",\n        "rootDir": "src",\n        "emitDeclarationOnly": true\n    }\n}\n')))}k.isMDXComponent=!0}}]);