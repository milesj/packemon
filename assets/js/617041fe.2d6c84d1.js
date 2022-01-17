"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[501],{5318:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var a=t(7378);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),u=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(t),m=r,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return t?a.createElement(f,i(i({ref:n},c),{},{components:t})):a.createElement(f,i({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=d;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},517:function(e,n,t){var a=t(7378);n.Z=function(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},2120:function(e,n,t){t.d(n,{Z:function(){return d}});var a=t(5773),r=t(7378),o=t(6457),i=t(4956);var l=function(){var e=(0,r.useContext)(i.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=t(6429),u=t(8944),c="tabItem_c0e5";function p(e){var n,t,o,i=e.lazy,p=e.block,d=e.defaultValue,m=e.values,f=e.groupId,g=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:k.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),h=(0,s.duplicates)(b,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===d?d:null!=(n=null!=d?d:null==(t=k.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(o=k[0])?void 0:o.props.value;if(null!==v&&!b.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=l(),N=y.tabGroupChoices,E=y.setTabGroupChoices,j=(0,r.useState)(v),w=j[0],T=j[1],C=[],O=(0,s.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=f){var D=N[f];null!=D&&D!==w&&b.some((function(e){return e.value===D}))&&T(D)}var P=function(e){var n=e.currentTarget,t=C.indexOf(n),a=b[t].value;a!==w&&(O(n),T(a),null!=f&&E(f,a))},x=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=C.indexOf(e.currentTarget)+1;t=C[a]||C[0];break;case"ArrowLeft":var r=C.indexOf(e.currentTarget)-1;t=C[r]||C[C.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.Z)("tabs",{"tabs--block":p},g)},b.map((function(e){var n=e.value,t=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,key:n,ref:function(e){return C.push(e)},onKeyDown:x,onFocus:P,onClick:P},o,{className:(0,u.Z)("tabs__item",c,null==o?void 0:o.className,{"tabs__item--active":w===n})}),null!=t?t:n)}))),i?(0,r.cloneElement)(k.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function d(e){var n=(0,o.Z)();return r.createElement(p,(0,a.Z)({key:String(n)},e))}},3650:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return f}});var a=t(5773),r=t(808),o=(t(7378),t(5318)),i=t(2120),l=t(517),s=["components"],u={title:"Setup & requirements"},c=void 0,p={unversionedId:"setup",id:"setup",title:"Setup & requirements",description:"Packemon has been designed to build and prepare packages for distribution, and as such, supports",source:"@site/docs/setup.mdx",sourceDirName:".",slug:"/setup",permalink:"/docs/setup",editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/setup.mdx",tags:[],version:"current",frontMatter:{title:"Setup & requirements"},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/install"},next:{title:"Features & optimizations",permalink:"/docs/features"}},d=[{value:"Package structure",id:"package-structure",children:[],level:2},{value:"Babel integration",id:"babel-integration",children:[{value:"Transforming generators",id:"transforming-generators",children:[],level:3}],level:2},{value:"TypeScript integration",id:"typescript-integration",children:[{value:"Update output directories",id:"update-output-directories",children:[],level:3},{value:"Enable emitting",id:"enable-emitting",children:[],level:3},{value:"Disable JSON resolving",id:"disable-json-resolving",children:[],level:3},{value:"Supporting project references",id:"supporting-project-references",children:[],level:3}],level:2}],m={toc:d};function f(e){var n=e.components,t=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Packemon has been designed to build and prepare packages for distribution, and as such, supports\nworkspaces (monorepos) or single packages (polyrepo). By default, only packages configured for\nPackemon will be built (denoted by a ",(0,o.kt)("inlineCode",{parentName:"p"},"packemon")," block in ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json"),"). This allows specific\npackages to be completely ignored if need be."),(0,o.kt)("p",null,"To ease the setup process, Packemon provides an interactive ",(0,o.kt)("a",{parentName:"p",href:"/docs/init"},(0,o.kt)("inlineCode",{parentName:"a"},"init"))," command that will\nconfigure each package one-by-one. This ",(0,o.kt)("em",{parentName:"p"},"must")," be ran in the project root."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"packemon init\n")),(0,o.kt)("h2",{id:"package-structure"},"Package structure"),(0,o.kt)("p",null,"Regardless of your project type, Packemon makes the following assumptions, some of which are hard\nrequirements."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," (of course)."),(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," have a source folder named ",(0,o.kt)("inlineCode",{parentName:"li"},"src"),". Builds will output relative to this."),(0,o.kt)("li",{parentName:"ul"},"Each package ",(0,o.kt)("em",{parentName:"li"},"must")," have a source entry point, typically a ",(0,o.kt)("inlineCode",{parentName:"li"},"src/index.(js|ts)")," file."),(0,o.kt)("li",{parentName:"ul"},"Each package may contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"tsconfig.json"),"."),(0,o.kt)("li",{parentName:"ul"},"Each package should contain a ",(0,o.kt)("inlineCode",{parentName:"li"},"LICENSE(.md)?")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"README(.md)?"),".")),(0,o.kt)("p",null,"This would look something like the following."),(0,o.kt)(i.Z,{groupId:"package-structure",defaultValue:"poly",values:[{label:"Polyrepo",value:"poly"},{label:"Monorepo",value:"mono"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"poly",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 src/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"))),(0,o.kt)(l.Z,{value:"mono",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 packages/\n\u2502   \u251c\u2500\u2500 foo/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u251c\u2500\u2500 bar/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u2514\u2500\u2500 baz/\n\u2502       \u251c\u2500\u2500 src/\n\u2502       \u251c\u2500\u2500 package.json\n\u2502       \u251c\u2500\u2500 LICENSE\n\u2502       \u2514\u2500\u2500 README.md\n\u251c\u2500\u2500 lerna.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")))),(0,o.kt)("h2",{id:"babel-integration"},"Babel integration"),(0,o.kt)("h3",{id:"transforming-generators"},"Transforming generators"),(0,o.kt)("p",null,"If you are using generators and are targeting the ",(0,o.kt)("inlineCode",{parentName:"p"},"browser")," platform with an old supported version,\nyou will need to include the ",(0,o.kt)("inlineCode",{parentName:"p"},"@babel/runtime")," dependency in your project. This is because generators\nare compiled to ",(0,o.kt)("inlineCode",{parentName:"p"},"regenerator-runtime"),"\n(",(0,o.kt)("a",{parentName:"p",href:"https://babeljs.io/docs/en/babel-plugin-transform-runtime#regenerator-aliasing"},"more info"),")."),(0,o.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @babel/runtime\n"))),(0,o.kt)(l.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @babel/runtime\n")))),(0,o.kt)("h2",{id:"typescript-integration"},"TypeScript integration"),(0,o.kt)("p",null,"Integrating with TypeScript can sometimes be tricky, and with Packemon, that is definitely the case.\nSince Packemon now handles the build process, TypeScript should be configured for type checking and\ndeclaration generation only."),(0,o.kt)("p",null,"However, if that is not possible. You can supply a custom tsconfig for Packemon building only\nthrough the ",(0,o.kt)("inlineCode",{parentName:"p"},"--declarationConfig")," option."),(0,o.kt)("h3",{id:"update-output-directories"},"Update output directories"),(0,o.kt)("p",null,"Both the ",(0,o.kt)("inlineCode",{parentName:"p"},"outDir")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"declarationDir")," settings should be updated to ",(0,o.kt)("inlineCode",{parentName:"p"},"dts"),", and should ",(0,o.kt)("em",{parentName:"p"},"not")," be set\nto ",(0,o.kt)("inlineCode",{parentName:"p"},"lib"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"build"),", or some other variant. This is especially true if using project references."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "declaration": true,\n        "declarationDir": "dts",\n        "outDir": "dts"\n    }\n}\n')),(0,o.kt)("h3",{id:"enable-emitting"},"Enable emitting"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"noEmit")," setting should ",(0,o.kt)("em",{parentName:"p"},"only")," be used on the command line (via an npm script) and should not be\nconfigured explicitly. We require emitting of declarations."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-diff",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n  "compilerOptions": {\n-    "noEmit": false\n  }\n}\n')),(0,o.kt)("h3",{id:"disable-json-resolving"},"Disable JSON resolving"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"resolveJsonModule")," setting alters the output folder structure in such a way that it breaks the\nguarantees that Packemon needs for handling declarations."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "resolveJsonModule": false\n    }\n}\n')),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"If you really need to support this feature, please create an issue so that we can track it\nproperly.")),(0,o.kt)("h3",{id:"supporting-project-references"},"Supporting project references"),(0,o.kt)("p",null,"Alongside the requirements listed above, the ",(0,o.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," within each project reference package\nshould be updated to only emit declarations to ",(0,o.kt)("inlineCode",{parentName:"p"},"dts"),", like so."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tsconfig.json"',title:'"tsconfig.json"'},'{\n    "compilerOptions": {\n        "declaration": true,\n        "declarationDir": "dts",\n        "outDir": "dts",\n        "rootDir": "src",\n        "emitDeclarationOnly": true\n    }\n}\n')))}f.isMDXComponent=!0}}]);