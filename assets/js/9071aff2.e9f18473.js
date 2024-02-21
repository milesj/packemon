"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1777],{7262:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>t,default:()=>h,frontMatter:()=>c,metadata:()=>o,toc:()=>r});var s=i(2540),d=i(3023);const c={title:"validate"},t=void 0,o={id:"validate",title:"validate",description:"Before a package can be published, there are many requirements that should be checked and validated.",source:"@site/docs/validate.md",sourceDirName:".",slug:"/validate",permalink:"/docs/validate",draft:!1,unlisted:!1,editUrl:"https://github.com/milesj/packemon/edit/master/website/docs/validate.md",tags:[],version:"current",frontMatter:{title:"validate"},sidebar:"docs",previous:{title:"scaffold",permalink:"/docs/scaffold"},next:{title:"watch",permalink:"/docs/watch"}},a={},r=[{value:"Options",id:"options",level:2}];function l(e){const n={a:"a",code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["Before a package can be published, there are many requirements that should be checked and validated.\nDoes the package have a valid entry point? Does it have a license? Is the ",(0,s.jsx)(n.code,{children:"package.json"})," configured\ncorrectly? So on and so forth."]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"validate"})," command does just that and can be used to validate an array of options as a thorough\npre-publish step. It accomplishes this by inspecting the package's ",(0,s.jsx)(n.code,{children:"package.json"})," and\n",(0,s.jsx)(n.a,{href:"./build",children:"build artifacts"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",metastring:'title="package.json"',children:'{\n  "scripts": {\n    "validate": "packemon validate"\n  }\n}\n'})}),"\n",(0,s.jsx)(n.p,{children:"Any errors found within the validation process will cause a non-zero exit code, while warnings only,\nor no warnings or errors would cause a zero exit code."}),"\n",(0,s.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,s.jsx)(n.p,{children:"Validate supports the following command line options."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--deps"})," - Check that ",(0,s.jsx)(n.code,{children:"dependencies"}),", ",(0,s.jsx)(n.code,{children:"peerDependencies"}),", and ",(0,s.jsx)(n.code,{children:"devDependencies"})," are valid by:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Requiring peer deps to have version satisfying dev deps."}),"\n",(0,s.jsx)(n.li,{children:"Disallowing peer and prod deps of the same package."}),"\n",(0,s.jsxs)(n.li,{children:["Disallowing ",(0,s.jsx)(n.code,{children:"file:"})," and ",(0,s.jsx)(n.code,{children:"link:"})," versions."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--engines"})," - Check that the current ",(0,s.jsx)(n.code,{children:"node"}),", ",(0,s.jsx)(n.code,{children:"npm"}),", and ",(0,s.jsx)(n.code,{children:"yarn"})," runtimes (on your host machine)\nsatisfy the configured ",(0,s.jsx)(n.code,{children:"engines"})," constraint."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--entries"})," - Check the ",(0,s.jsx)(n.code,{children:"main"}),", ",(0,s.jsx)(n.code,{children:"module"}),", ",(0,s.jsx)(n.code,{children:"browser"}),", ",(0,s.jsx)(n.code,{children:"types"}),", ",(0,s.jsx)(n.code,{children:"typings"}),", ",(0,s.jsx)(n.code,{children:"bin"}),", and ",(0,s.jsx)(n.code,{children:"man"})," entry\npoints are valid by:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Requiring either ",(0,s.jsx)(n.code,{children:"main"})," or ",(0,s.jsx)(n.code,{children:"exports"})," to be configured."]}),"\n",(0,s.jsx)(n.li,{children:"Verifying the relative path exists on the file system."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--license"})," - Check that ",(0,s.jsx)(n.code,{children:"license"})," is a valid SPDX license and a ",(0,s.jsx)(n.code,{children:"LICENSE"})," (or ",(0,s.jsx)(n.code,{children:"LICENSE.md"}),") file\nexists."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--links"})," - Check that ",(0,s.jsx)(n.code,{children:"homepage"})," and ",(0,s.jsx)(n.code,{children:"bugs"})," links are valid URLs."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--meta"})," - Check that ",(0,s.jsx)(n.code,{children:"name"}),", ",(0,s.jsx)(n.code,{children:"version"}),", ",(0,s.jsx)(n.code,{children:"description"}),", and ",(0,s.jsx)(n.code,{children:"keywords"})," are valid."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--people"})," - Check that ",(0,s.jsx)(n.code,{children:"author"})," and ",(0,s.jsx)(n.code,{children:"contributors"})," contain a name and optional but valid URL."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--repo"})," - Check that ",(0,s.jsx)(n.code,{children:"repository"})," exists and is a valid URL."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"--skipPrivate"})," - Skip ",(0,s.jsx)(n.code,{children:"private"})," packages from being packed."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["By default ",(0,s.jsx)(n.em,{children:"all"})," options are enabled, so you'd need to negate them with ",(0,s.jsx)(n.code,{children:"--no-*"})," to disable each one\n(this is not suggested)."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"packemon validate --no-people\n"})})]})}function h(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},3023:(e,n,i)=>{i.d(n,{R:()=>t,x:()=>o});var s=i(3696);const d={},c=s.createContext(d);function t(e){const n=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:t(e.components),s.createElement(c.Provider,{value:n},e.children)}}}]);