if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const c=e=>i(e,t),o={module:{uri:t},exports:l,require:c};s[t]=Promise.all(n.map((e=>o[e]||c(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"0bbc47923522c101b35ab6185fe393e3"},{url:"assets/html2canvas.esm-CBrSDip1.js",revision:null},{url:"assets/index-C-1Z7iTt.js",revision:null},{url:"assets/index-kQJbKSsj.css",revision:null},{url:"assets/index.es-DaKfGk5W.js",revision:null},{url:"assets/purify.es-Ci5xwkH_.js",revision:null},{url:"index.html",revision:"c4e738c8196eb6f479fdb27cd45c676c"},{url:"registerSW.js",revision:"f29ee307c7a817babd28a18de80297c8"},{url:"icon_192x192.png",revision:"b75a12c4a24d3ee0e32965a3dbab3957"},{url:"icon_512x512.png",revision:"816f10e3303958fca0193c791858bce4"},{url:"manifest.webmanifest",revision:"dc8aa4a61bc4fb490798c792dcbcf1de"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
