"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[146],{5318:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var a=t(7378);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),u=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(t),m=r,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return t?a.createElement(f,i(i({ref:n},c),{},{components:t})):a.createElement(f,i({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=d;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},517:function(e,n,t){var a=t(7378);n.Z=function(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},2120:function(e,n,t){t.d(n,{Z:function(){return d}});var a=t(5773),r=t(7378),o=t(6457),i=t(4956);var l=function(){var e=(0,r.useContext)(i.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=t(6429),u=t(8944),c="tabItem_c0e5";function p(e){var n,t,o,i=e.lazy,p=e.block,d=e.defaultValue,m=e.values,f=e.groupId,b=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=m?m:k.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),h=(0,s.duplicates)(g,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===d?d:null!=(n=null!=d?d:null==(t=k.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(o=k[0])?void 0:o.props.value;if(null!==v&&!g.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=l(),N=y.tabGroupChoices,w=y.setTabGroupChoices,j=(0,r.useState)(v),C=j[0],E=j[1],T=[],O=(0,s.useScrollPositionBlocker)().blockElementScrollPositionUntilNextRender;if(null!=f){var x=N[f];null!=x&&x!==C&&g.some((function(e){return e.value===x}))&&E(x)}var I=function(e){var n=e.currentTarget,t=T.indexOf(n),a=g[t].value;a!==C&&(O(n),E(a),null!=f&&w(f,a))},S=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=T.indexOf(e.currentTarget)+1;t=T[a]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;t=T[r]||T[T.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.Z)("tabs",{"tabs--block":p},b)},g.map((function(e){var n=e.value,t=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:C===n?0:-1,"aria-selected":C===n,key:n,ref:function(e){return T.push(e)},onKeyDown:S,onFocus:I,onClick:I},o,{className:(0,u.Z)("tabs__item",c,null==o?void 0:o.className,{"tabs__item--active":C===n})}),null!=t?t:n)}))),i?(0,r.cloneElement)(k.filter((function(e){return e.props.value===C}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==C})}))))}function d(e){var n=(0,o.Z)();return r.createElement(p,(0,a.Z)({key:String(n)},e))}},4140:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return f}});var a=t(5773),r=t(808),o=(t(7378),t(5318)),i=t(2120),l=t(517),s=["components"],u={title:"Advanced"},c=void 0,p={unversionedId:"advanced",id:"advanced",title:"Advanced",description:"Creating binary files",source:"@site/docs/advanced.mdx",sourceDirName:".",slug:"/advanced",permalink:"/docs/advanced",editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/advanced.mdx",tags:[],version:"current",frontMatter:{title:"Advanced"},sidebar:"docs",previous:{title:"watch",permalink:"/docs/watch"}},d=[{value:"Creating binary files",id:"creating-binary-files",children:[],level:2},{value:"Customizing Babel and Rollup",id:"customizing-babel-and-rollup",children:[],level:2},{value:"Stamping releases",id:"stamping-releases",children:[],level:2},{value:"Version constraints",id:"version-constraints",children:[],level:2}],m={toc:d};function f(e){var n=e.components,t=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"creating-binary-files"},"Creating binary files"),(0,o.kt)("p",null,"A binary is an executable file distributed in an npm package via the\n",(0,o.kt)("a",{parentName:"p",href:"https://docs.npmjs.com/files/package.json#bin"},"bin")," field. Packemon offers first class support for\nbinary files by:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Prepending a ",(0,o.kt)("inlineCode",{parentName:"li"},"#!/usr/bin/env node")," shebang to the output file. Do not include this in the source\nfile!"),(0,o.kt)("li",{parentName:"ul"},"Updating the ",(0,o.kt)("inlineCode",{parentName:"li"},"bin")," field in ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," to the output file (if not already defined).")),(0,o.kt)("p",null,"To make use of this functionality, you must define an ",(0,o.kt)("a",{parentName:"p",href:"/docs/config#inputs"},"input")," with the name\n",(0,o.kt)("inlineCode",{parentName:"p"},"bin"),", like so."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n    "name": "package",\n    "packemon": {\n        "inputs": {\n            "bin": "src/bin.ts"\n        },\n        "platform": "node"\n    }\n}\n')),(0,o.kt)("p",null,"The contents of the binary source file can be whatever you want, but do be aware that code in the\nmodule scope will be executed immediately when the file is executed by Node.js."),(0,o.kt)("h2",{id:"customizing-babel-and-rollup"},"Customizing Babel and Rollup"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"This is an advanced escape hatch and should be avoided unless absolutely necessary, for example,\nprocessing CSS files in a way that Packemon does not support.")),(0,o.kt)("p",null,"Customizing the Babel and Rollup configs are an ",(0,o.kt)("em",{parentName:"p"},"opt-in feature"),", and require the following\nconditions to be met:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"A ",(0,o.kt)("inlineCode",{parentName:"li"},"--loadConfigs")," option is passed on the command line. This enables searching and loading of\nconfig files, otherwise, we want to avoid the filesystem lookups."),(0,o.kt)("li",{parentName:"ul"},"A ",(0,o.kt)("inlineCode",{parentName:"li"},"packemon.config.{ts,js}")," file at the monorepo/polyrepo root, which applies customizations to\nall packages. Or ",(0,o.kt)("em",{parentName:"li"},"optional")," ",(0,o.kt)("inlineCode",{parentName:"li"},".packemon.{ts,js}")," files within each package, which applies\ncustomizations to that package individually. An example of this is found below, or view the\n",(0,o.kt)("a",{parentName:"li",href:"https://boostlib.dev/docs/config"},"@boost/config")," docs.")),(0,o.kt)(i.Z,{groupId:"package-structure",defaultValue:"poly",values:[{label:"Polyrepo",value:"poly"},{label:"Monorepo",value:"mono"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"poly",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 src/\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 packemon.config.js\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n"))),(0,o.kt)(l.Z,{value:"mono",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/\n\u251c\u2500\u2500 packages/\n\u2502   \u251c\u2500\u2500 foo/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 .packemon.js\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u251c\u2500\u2500 bar/\n\u2502   |   \u251c\u2500\u2500 src/\n\u2502   |   \u251c\u2500\u2500 .packemon.js\n\u2502   |   \u251c\u2500\u2500 package.json\n\u2502   |   \u251c\u2500\u2500 LICENSE\n\u2502   |   \u2514\u2500\u2500 README.md\n\u2502   \u2514\u2500\u2500 baz/\n\u2502       \u251c\u2500\u2500 src/\n\u2502       \u251c\u2500\u2500 .packemon.js\n\u2502       \u251c\u2500\u2500 package.json\n\u2502       \u251c\u2500\u2500 LICENSE\n\u2502       \u2514\u2500\u2500 README.md\n\u251c\u2500\u2500 lerna.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 packemon.config.js\n\u251c\u2500\u2500 LICENSE\n\u2514\u2500\u2500 README.md\n")))),(0,o.kt)("p",null,"Both of these config files have the same structure, and may define the fields below. All of these\nfields require a function, which is passed the finalized config as an argument (with output fields\nalso accepting the current build as the 2nd argument). This config can then be mutated in place."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"babelInput")," - For parsing syntax into an AST (TypeScript, JSX, etc)."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"babelOutput")," - For applying transformations."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rollupInput")," - For defining inputs, outputs, and more."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rollupOutput")," - For customizing each output.")),(0,o.kt)(i.Z,{groupId:"configs",defaultValue:"ts",values:[{label:"TypeScript",value:"ts"},{label:"JavaScript",value:"js"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"ts",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ConfigFile } from 'packemon';\nimport linaria from '@linaria/rollup';\n\nconst config: ConfigFile = {\n    babelOutput(config, build) {\n        config.presets.push('@linaria/babel-preset');\n    },\n    rollupInput(config) {\n        config.plugins.unshift(linaria());\n    },\n};\n\nexport default config;\n"))),(0,o.kt)(l.Z,{value:"js",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const linaria = require('@linaria/rollup');\n\nmodule.exports = {\n    babelOutput(config) {\n        config.presets.push('@linaria/babel-preset');\n    },\n    rollupInput(config) {\n        config.plugins.unshift(linaria());\n    },\n};\n")))),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"We suggest ",(0,o.kt)("em",{parentName:"p"},"not mutating")," the config that Packemon generates, as it may break our assumptions.\nInstead, prefer to only apply additions that add new functionality.")),(0,o.kt)("h2",{id:"stamping-releases"},"Stamping releases"),(0,o.kt)("p",null,"For situations where you update Packemon and want to release ",(0,o.kt)("em",{parentName:"p"},"every")," package, even those that have\nnot been modified since the last release, you can use stamping. Stamping is a very simple concept\nwhere we modify the ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json")," of each package with a ",(0,o.kt)("inlineCode",{parentName:"p"},"release")," timestamp, and can be achieved\nby passing ",(0,o.kt)("inlineCode",{parentName:"p"},"--stamp")," to the ",(0,o.kt)("inlineCode",{parentName:"p"},"build")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"pack")," commands."),(0,o.kt)("h2",{id:"version-constraints"},"Version constraints"),(0,o.kt)("p",null,"If you're using packemon as a global dependency and want to ensure all contributors of your project\nare using the correct packemon version, you can provide an ",(0,o.kt)("inlineCode",{parentName:"p"},"engines")," constraint to your root\n",(0,o.kt)("inlineCode",{parentName:"p"},"package.json"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="package.json"',title:'"package.json"'},'{\n    "name": "package",\n    "engines": {\n        "packemon": "^1.0.0"\n    }\n}\n')))}f.isMDXComponent=!0}}]);