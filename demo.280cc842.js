import{t as e,d as t,i as n,m as l,c as i,S as r,F as o,a,g as s,b as c,o as d,r as f}from"./vendor.732dfc10.js";const u=e("<ul></ul>",2),p=e('<li class="empty"></li>',2),g=e('<li class="leaf"></li>',2),h=e('<li class="branch"><span></span></li>',4);function m(e){const t="expanded";return(()=>{const s=u.cloneNode(!0);return n(s,(()=>{const a=l((()=>!!e.filter),!0);return i(o,{get each(){return a()?e.data.filter(e.filter):e.data},get fallback(){return(()=>{const t=p.cloneNode(!0);return n(t,(()=>e.get.emptyLabel(e.prefix))),t})()},children:(l,o)=>i(r,{get when(){return e.get.isLeaf(l)},get fallback(){return(()=>{const r=h.cloneNode(!0),o=r.firstChild;return o.$$click=n=>{let i=n.target;for(;i&&"li"!=i.localName;)i=i.parentNode;if(!i)throw{error:"li not found",event:n};i.classList.toggle(t),i.classList.contains(t)&&e.load(l,e.prefix,e.get)},n(o,(()=>e.get.branchLabel(l,e.prefix))),n(r,i(m,{get data(){return e.get.childNodes(l)},get get(){return e.get},get prefix(){return e.get.path(l,e.prefix)},get load(){return e.load}}),null),r})()},get children(){const t=g.cloneNode(!0);return n(t,(()=>e.get.leafLabel(l,e.prefix))),t}})})})()),a((()=>s.className=e.prefix?"tree-view":"tree-view root")),s})()}t(["click"]);const v=e('<span class="prefix">/</span>',2),w=e('<span class="name"></span>',2),x=e('<span class="link-source"></span>',2),y=e('<span class="link-target"></span>',2),b=e('<span class="file"></span>',2),L=e('<div><div>click on a directory to load more files</div><div>selected file: </div><div style="height: 12em"></div></div>',8),k=e("<code></code>",2);s("\n  ul.tree-view.root { margin-left: 1px; margin-right: 1px; }\n  ul.tree-view.root { height: 100%; /* fit to container */; overflow: auto; /* scroll on demand */ }\n  ul.tree-view { text-align: left; }\n  ul.tree-view, ul.tree-view ul { list-style: none; padding: 0; }\n  ul.tree-view li { white-space: pre; /* dont wrap on x overflow. TODO fix width on overflow */ }\n  ul.tree-view li.branch > span { color: blue; font-family: monospace; }\n  ul.tree-view li.branch > ul { display: none; /* default collapsed */ }\n  ul.tree-view li.branch.expanded { outline: solid 1px grey; }\n  ul.tree-view li.branch.expanded > ul { display: block; }\n  ul.tree-view li.empty { font-style: italic; }\n  ul.tree-view span.link-source { color: green; font-family: monospace; }\n  ul.tree-view span.file { font-family: monospace; }\n  /* ul.tree-view span.prefix { opacity: 0.6; } */ /* this looks worse than expected */\n"),t(["click"]),f((function(){const[e,t]=c({fileList:[],fileSelected:""});async function r(n=null,l="",i=null){const r=n&&i?i.path(n,l):"",o=["fileList"];let a=e.fileList;if(r.split("/").filter(Boolean).forEach(((e,t)=>{const n=a.findIndex((([t,n,l,i])=>"d"==n&&l==e));o.push(n),a=a[n],o.push(3),a=a[3]})),console.dir({prefix:l,keyPath:o,parentDir:a}),a.length>0)return void console.log(`already loaded path /${r}`);var s;await(s=500,new Promise((e=>setTimeout(e,s))));const c={files:Array.from({length:5}).map(((e,t)=>{const n="ddfl"[Math.round(3*Math.random())],i=l.split("/").length;return"d"==n?[i,n,`directory-${i}-${t}`,[]]:"f"==n?[i,n,`file-${i}-${t}`]:"l"==n?[i,n,`link-${i}-${t}`,`link-target-${i}-${t}`]:void 0}))};e.fileList&&0!=e.fileList.length?t(...o,c.files):t("fileList",c.files)}return d((()=>{r()})),(()=>{const o=L.cloneNode(!0),a=o.firstChild.nextSibling;a.firstChild;const s=a.nextSibling;return n(a,(()=>{const t=l((()=>!!e.fileSelected),!0);return()=>t()?(()=>{const t=k.cloneNode(!0);return n(t,(()=>e.fileSelected)),t})():"( none. click a file to select )"})(),null),n(s,i(m,{get data(){return e.fileList},get get(){return function(){const e={isLeaf:e=>"d"!=e[1],name:e=>e[2],path:(t,n)=>n?`${n}/${e.name(t)}`:e.name(t),childNodes:e=>e[3]},l=(t,l)=>l?[(()=>{const e=v.cloneNode(!0),t=e.firstChild;return n(e,(()=>l),t),e})(),(()=>{const l=w.cloneNode(!0);return n(l,(()=>e.name(t))),l})()]:e.name(t);return e.branchLabel=l,e.emptyLabel=e=>"( empty )",e.leafLabel=(i,r)=>(e=>"l"==e[1])(i)?[(()=>{const e=x.cloneNode(!0);return n(e,(()=>l(i,r))),e})()," -> ",(()=>{const e=y.cloneNode(!0);return n(e,(()=>(e=>e[3])(i))),e})()]:(()=>{const o=b.cloneNode(!0);return o.$$click=()=>t("fileSelected",e.path(i,r)),n(o,(()=>l(i,r))),o})(),e}()},get filter(){return e=>"."!=e[2][0]},load:r})),o})()}),document.getElementById("root"));