function _(){}function D(t,n){for(const e in n)t[e]=n[e];return t}function z(t){return t()}function q(){return Object.create(null)}function h(t){t.forEach(z)}function G(t){return typeof t=="function"}function U(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function H(t){return Object.keys(t).length===0}function W(t,n,e,o){if(t){const r=M(t,n,e,o);return t[0](r)}}function M(t,n,e,o){return t[1]&&o?D(e.ctx.slice(),t[1](o(n))):e.ctx}function X(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const f=[],i=Math.max(n.dirty.length,r.length);for(let c=0;c<i;c+=1)f[c]=n.dirty[c]|r[c];return f}return n.dirty|r}return n.dirty}function Y(t,n,e,o,r,f){if(r){const i=M(n,e,o,f);t.p(i,r)}}function Z(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}function v(t,n){t.appendChild(n)}function tt(t,n,e){t.insertBefore(n,e||null)}function I(t){t.parentNode.removeChild(t)}function nt(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function et(t){return document.createElement(t)}function N(t){return document.createTextNode(t)}function ot(){return N(" ")}function rt(){return N("")}function st(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function J(t){return Array.from(t.childNodes)}function ct(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function ut(t,n,e,o){e===null?t.style.removeProperty(n):t.style.setProperty(n,e,o?"important":"")}let g;function p(t){g=t}function $(){if(!g)throw new Error("Function called outside component initialization");return g}function it(t){$().$$.on_mount.push(t)}function ft(t){$().$$.after_update.push(t)}function at(t,n){$().$$.context.set(t,n)}const m=[],O=[],y=[],P=[],B=Promise.resolve();let w=!1;function F(){w||(w=!0,B.then(T))}function lt(){return F(),B}function k(t){y.push(t)}const j=new Set;let b=0;function T(){const t=g;do{for(;b<m.length;){const n=m[b];b++,p(n),K(n.$$)}for(p(null),m.length=0,b=0;O.length;)O.pop()();for(let n=0;n<y.length;n+=1){const e=y[n];j.has(e)||(j.add(e),e())}y.length=0}while(m.length);for(;P.length;)P.pop()();w=!1,j.clear(),p(t)}function K(t){if(t.fragment!==null){t.update(),h(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(k)}}const x=new Set;let l;function dt(){l={r:0,c:[],p:l}}function _t(){l.r||h(l.c),l=l.p}function L(t,n){t&&t.i&&(x.delete(t),t.i(n))}function ht(t,n,e,o){if(t&&t.o){if(x.has(t))return;x.add(t),l.c.push(()=>{x.delete(t),o&&(e&&t.d(1),o())}),t.o(n)}}function gt(t,n){const e={},o={},r={$$scope:1};let f=t.length;for(;f--;){const i=t[f],c=n[f];if(c){for(const u in i)u in c||(o[u]=1);for(const u in c)r[u]||(e[u]=c[u],r[u]=1);t[f]=c}else for(const u in i)r[u]=1}for(const i in o)i in e||(e[i]=void 0);return e}function pt(t){return typeof t=="object"&&t!==null?t:{}}function mt(t){t&&t.c()}function Q(t,n,e,o){const{fragment:r,on_mount:f,on_destroy:i,after_update:c}=t.$$;r&&r.m(n,e),o||k(()=>{const u=f.map(z).filter(G);i?i.push(...u):h(u),t.$$.on_mount=[]}),c.forEach(k)}function R(t,n){const e=t.$$;e.fragment!==null&&(h(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function V(t,n){t.$$.dirty[0]===-1&&(m.push(t),F(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function yt(t,n,e,o,r,f,i,c=[-1]){const u=g;p(t);const s=t.$$={fragment:null,ctx:null,props:f,update:_,not_equal:r,bound:q(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(u?u.$$.context:[])),callbacks:q(),dirty:c,skip_bound:!1,root:n.target||u.$$.root};i&&i(s.root);let E=!1;if(s.ctx=e?e(t,n.props||{},(a,A,...C)=>{const S=C.length?C[0]:A;return s.ctx&&r(s.ctx[a],s.ctx[a]=S)&&(!s.skip_bound&&s.bound[a]&&s.bound[a](S),E&&V(t,a)),A}):[],s.update(),E=!0,h(s.before_update),s.fragment=o?o(s.ctx):!1,n.target){if(n.hydrate){const a=J(n.target);s.fragment&&s.fragment.l(a),a.forEach(I)}else s.fragment&&s.fragment.c();n.intro&&L(t.$$.fragment),Q(t,n.target,n.anchor,n.customElement),T()}p(u)}class bt{$destroy(){R(this,1),this.$destroy=_}$on(n,e){const o=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return o.push(e),()=>{const r=o.indexOf(e);r!==-1&&o.splice(r,1)}}$set(n){this.$$set&&!H(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}const d=[];function xt(t,n=_){let e;const o=new Set;function r(c){if(U(t,c)&&(t=c,e)){const u=!d.length;for(const s of o)s[1](),d.push(s,t);if(u){for(let s=0;s<d.length;s+=2)d[s][0](d[s+1]);d.length=0}}}function f(c){r(c(t))}function i(c,u=_){const s=[c,u];return o.add(s),o.size===1&&(e=n(r)||_),c(t),()=>{o.delete(s),o.size===0&&(e(),e=null)}}return{set:r,update:f,subscribe:i}}export{_ as A,W as B,Y as C,Z as D,X as E,v as F,nt as G,bt as S,st as a,ut as b,tt as c,ct as d,et as e,I as f,ot as g,rt as h,yt as i,dt as j,ht as k,_t as l,L as m,at as n,ft as o,it as p,mt as q,Q as r,U as s,N as t,gt as u,pt as v,R as w,D as x,xt as y,lt as z};