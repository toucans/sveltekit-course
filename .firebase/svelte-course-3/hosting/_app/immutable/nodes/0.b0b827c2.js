import{s as c,e as f,u as _,g as d,f as p}from"../chunks/scheduler.cc9b4bb6.js";import{S as m,i as g,d as u,v,f as $,t as y}from"../chunks/index.a8a90220.js";const b=!0,h=async()=>({}),O=Object.freeze(Object.defineProperty({__proto__:null,load:h,prerender:b},Symbol.toStringTag,{value:"Module"}));function i(s){let o;const a=s[1].default,e=f(a,s,s[0],null),l={c:function(){e&&e.c()},l:function(t){e&&e.l(t)},m:function(t,r){e&&e.m(t,r),o=!0},p:function(t,[r]){e&&e.p&&(!o||r&1)&&_(e,a,t,t[0],o?p(a,t[0],r,null):d(t[0]),null)},i:function(t){o||($(e,t),o=!0)},o:function(t){y(e,t),o=!1},d:function(t){e&&e.d(t)}};return u("SvelteRegisterBlock",{block:l,id:i.name,type:"component",source:"",ctx:s}),l}function S(s,o,a){let{$$slots:e={},$$scope:l}=o;v("Layout",e,["default"]);const n=[];return Object.keys(o).forEach(t=>{!~n.indexOf(t)&&t.slice(0,2)!=="$$"&&t!=="slot"&&console.warn(`<Layout> was created with unknown prop '${t}'`)}),s.$$set=t=>{"$$scope"in t&&a(0,l=t.$$scope)},[l,e]}class j extends m{constructor(o){super(o),g(this,o,S,i,c,{}),u("SvelteRegisterComponent",{component:this,tagName:"Layout",options:o,id:i.name})}}export{j as component,O as universal};