(function dartProgram(){function copyProperties(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
b[q]=a[q]}}function mixinPropertiesHard(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
if(!b.hasOwnProperty(q)){b[q]=a[q]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var s=function(){}
s.prototype={p:{}}
var r=new s()
if(!(Object.getPrototypeOf(r)&&Object.getPrototypeOf(r).p===s.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var q=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(q))return true}}catch(p){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var s=Object.create(b.prototype)
copyProperties(a.prototype,s)
a.prototype=s}}function inheritMany(a,b){for(var s=0;s<b.length;s++){inherit(b[s],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){var r=d()
if(a[b]!==s){A.ik(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.d(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.e0(b)
return new s(c,this)}:function(){if(s===null)s=A.e0(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.e0(a).prototype
return s}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var s=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var r=staticTearOffGetter(s)
a[b]=r}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var s=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var r=instanceTearOffGetter(c,s)
a[b]=r}function setOrUpdateInterceptorsByTag(a){var s=v.interceptorsByTag
if(!s){v.interceptorsByTag=a
return}copyProperties(a,s)}function setOrUpdateLeafTags(a){var s=v.leafTags
if(!s){v.leafTags=a
return}copyProperties(a,s)}function updateTypes(a){var s=v.types
var r=s.length
s.push.apply(s,a)
return r}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var s=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},r=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:s(0,0,null,["$0"],0),_instance_1u:s(0,1,null,["$1"],0),_instance_2u:s(0,2,null,["$2"],0),_instance_0i:s(1,0,null,["$0"],0),_instance_1i:s(1,1,null,["$1"],0),_instance_2i:s(1,2,null,["$2"],0),_static_0:r(0,null,["$0"],0),_static_1:r(1,null,["$1"],0),_static_2:r(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
e5(a,b,c,d){return{i:a,p:b,e:c,x:d}},
e1(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.e3==null){A.i8()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.ez("Return interceptor for "+A.q(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dm
if(o==null)o=$.dm=A.dy(n)
p=q[o]}if(p!=null)return p
p=A.id(a)
if(p!=null)return p
if(typeof a=="function")return B.V
s=Object.getPrototypeOf(a)
if(s==null)return B.B
if(s===Object.prototype)return B.B
if(typeof q=="function"){o=$.dm
if(o==null)o=$.dm=A.dy(n)
Object.defineProperty(q,o,{value:B.t,enumerable:false,writable:true,configurable:true})
return B.t}return B.t},
fJ(a,b){if(a<0||a>4294967295)throw A.e(A.ax(a,0,4294967295,"length",null))
return J.fK(new Array(a),b)},
ej(a,b){if(a<0)throw A.e(A.cQ("Length must be a non-negative integer: "+a))
return A.d(new Array(a),b.h("h<0>"))},
dM(a,b){if(a<0)throw A.e(A.cQ("Length must be a non-negative integer: "+a))
return A.d(new Array(a),b.h("h<0>"))},
fK(a,b){var s=A.d(a,b.h("h<0>"))
s.$flags=1
return s},
ek(a,b){var s=t.V
return J.fm(s.a(a),s.a(b))},
aF(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bi.prototype
return J.ck.prototype}if(typeof a=="string")return J.as.prototype
if(a==null)return J.bj.prototype
if(typeof a=="boolean")return J.cj.prototype
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bm.prototype
if(typeof a=="bigint")return J.bk.prototype
return a}if(a instanceof A.l)return a
return J.e1(a)},
dx(a){if(typeof a=="string")return J.as.prototype
if(a==null)return a
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bm.prototype
if(typeof a=="bigint")return J.bk.prototype
return a}if(a instanceof A.l)return a
return J.e1(a)},
cO(a){if(a==null)return a
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bm.prototype
if(typeof a=="bigint")return J.bk.prototype
return a}if(a instanceof A.l)return a
return J.e1(a)},
i3(a){if(typeof a=="number")return J.aP.prototype
if(typeof a=="string")return J.as.prototype
if(a==null)return a
if(!(a instanceof A.l))return J.b0.prototype
return a},
V(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aF(a).K(a,b)},
aL(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.ib(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dx(a).m(a,b)},
fl(a,b,c){return J.cO(a).i(a,b,c)},
e9(a,b){return J.cO(a).k(a,b)},
fm(a,b){return J.i3(a).aG(a,b)},
ea(a,b){return J.cO(a).H(a,b)},
a4(a){return J.aF(a).gv(a)},
fn(a){return J.dx(a).gt(a)},
fo(a){return J.cO(a).gB(a)},
af(a){return J.cO(a).gq(a)},
cP(a){return J.dx(a).gl(a)},
fp(a){return J.aF(a).gA(a)},
c4(a){return J.aF(a).j(a)},
cg:function cg(){},
cj:function cj(){},
bj:function bj(){},
bl:function bl(){},
ak:function ak(){},
cw:function cw(){},
b0:function b0(){},
aj:function aj(){},
bk:function bk(){},
bm:function bm(){},
h:function h(a){this.$ti=a},
ci:function ci(){},
cW:function cW(a){this.$ti=a},
an:function an(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aP:function aP(){},
bi:function bi(){},
ck:function ck(){},
as:function as(){}},A={dN:function dN(){},
fv(a,b,c){if(t.O.b(a))return new A.bN(a,b.h("@<0>").u(c).h("bN<1,2>"))
return new A.ao(a,b.h("@<0>").u(c).h("ao<1,2>"))},
fM(a){return new A.aQ("Field '"+a+"' has not been initialized.")},
fL(a){return new A.aQ("Field '"+a+"' has already been initialized.")},
al(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
dT(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
e4(a){var s,r
for(s=$.R.length,r=0;r<s;++r)if(a===$.R[r])return!0
return!1},
fV(a,b,c,d){A.dR(b,"start")
if(c!=null){A.dR(c,"end")
if(b>c)A.aJ(A.ax(b,0,c,"start",null))}return new A.bI(a,b,c,d.h("bI<0>"))},
fR(a,b,c,d){if(t.O.b(a))return new A.bd(a,b,c.h("@<0>").u(d).h("bd<1,2>"))
return new A.aw(a,b,c.h("@<0>").u(d).h("aw<1,2>"))},
ch(){return new A.aY("No element")},
ei(){return new A.aY("Too many elements")},
b1:function b1(){},
ba:function ba(a,b){this.a=a
this.$ti=b},
ao:function ao(a,b){this.a=a
this.$ti=b},
bN:function bN(a,b){this.a=a
this.$ti=b},
ap:function ap(a,b){this.a=a
this.$ti=b},
cU:function cU(a,b){this.a=a
this.b=b},
cT:function cT(a){this.a=a},
aQ:function aQ(a){this.a=a},
d6:function d6(){},
f:function f(){},
M:function M(){},
bI:function bI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
au:function au(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aw:function aw(a,b,c){this.a=a
this.b=b
this.$ti=c},
bd:function bd(a,b,c){this.a=a
this.b=b
this.$ti=c},
bu:function bu(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
a9:function a9(a,b,c){this.a=a
this.b=b
this.$ti=c},
ab:function ab(a,b,c){this.a=a
this.b=b
this.$ti=c},
bL:function bL(a,b,c){this.a=a
this.b=b
this.$ti=c},
bM:function bM(a,b){this.a=a
this.$ti=b},
az:function az(a,b){this.a=a
this.$ti=b},
r:function r(){},
eg(a,b,c){var s,r,q,p,o,n,m,l=A.j(a),k=A.aR(new A.a8(a,l.h("a8<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.J)(k),++i,p=o){r=k[i]
c.a(a.m(0,r))
o=p+1
q[r]=p}n=A.aR(new A.br(a,l.h("br<2>")),!0,c)
m=new A.a6(q,n,b.h("@<0>").u(c).h("a6<1,2>"))
m.$keys=k
return m}return new A.bc(A.fN(a,b,c),b.h("@<0>").u(c).h("bc<1,2>"))},
f8(a){var s=A.f7(a)
if(s!=null)return s
return"minified:"+a},
ib(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
q(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.c4(a)
return s},
cx(a){var s,r=$.er
if(r==null)r=$.er=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cy(a){var s,r,q,p
if(a instanceof A.l)return A.Q(A.aG(a),null)
s=J.aF(a)
if(s===B.T||s===B.W||t.cr.b(a)){r=B.v(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.Q(A.aG(a),null)},
es(a){var s,r,q
if(a==null||typeof a=="number"||A.dZ(a))return J.c4(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.ah)return a.j(0)
if(a instanceof A.a2)return a.aE(!0)
s=$.fk()
for(r=0;r<1;++r){q=s[r].bz(a)
if(q!=null)return q}return"Instance of '"+A.cy(a)+"'"},
E(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aD(s,10)|55296)>>>0,s&1023|56320)}throw A.e(A.ax(a,0,1114111,null,null))},
c(a,b){if(a==null)J.cP(a)
throw A.e(A.f1(a,b))},
f1(a,b){var s,r="index"
if(!A.eU(b))return new A.ag(!0,b,r,null)
s=J.cP(a)
if(b<0||b>=s)return A.dK(b,s,a,r)
return A.eu(b,r)},
e(a){return A.z(a,new Error())},
z(a,b){var s
if(a==null)a=new A.bJ()
b.dartException=a
s=A.im
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
im(){return J.c4(this.dartException)},
aJ(a,b){throw A.z(a,b==null?new Error():b)},
b8(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.aJ(A.hv(a,b,c),s)},
hv(a,b,c){var s,r,q,p,o,n,m,l,k
if(typeof b=="string")s=b
else{r="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
q=r.length
p=b
if(p>q){c=p/q|0
p%=q}s=r[p]}o=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
n=t.j.b(a)?"list":"ByteData"
m=a.$flags|0
l="a "
if((m&4)!==0)k="constant "
else if((m&2)!==0){k="unmodifiable "
l="an "}else k=(m&1)!==0?"fixed-length ":""
return new A.bK("'"+s+"': Cannot "+o+" "+l+k+n)},
J(a){throw A.e(A.a1(a))},
aa(a){var s,r,q,p,o,n
a=A.ih(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.d([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.dj(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dk(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
ey(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
dO(a,b){var s=b==null,r=s?null:b.method
return new A.cl(a,r,s?null:b.receiver)},
e6(a){if(a==null)return new A.d4(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aI(a,a.dartException)
return A.hX(a)},
aI(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
hX(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aD(r,16)&8191)===10)switch(q){case 438:return A.aI(a,A.dO(A.q(s)+" (Error "+q+")",null))
case 445:case 5007:A.q(s)
return A.aI(a,new A.bA())}}if(a instanceof TypeError){p=$.fa()
o=$.fb()
n=$.fc()
m=$.fd()
l=$.fg()
k=$.fh()
j=$.ff()
$.fe()
i=$.fj()
h=$.fi()
g=p.I(s)
if(g!=null)return A.aI(a,A.dO(A.a3(s),g))
else{g=o.I(s)
if(g!=null){g.method="call"
return A.aI(a,A.dO(A.a3(s),g))}else if(n.I(s)!=null||m.I(s)!=null||l.I(s)!=null||k.I(s)!=null||j.I(s)!=null||m.I(s)!=null||i.I(s)!=null||h.I(s)!=null){A.a3(s)
return A.aI(a,new A.bA())}}return A.aI(a,new A.cF(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bH()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aI(a,new A.ag(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bH()
return a},
f4(a){if(a==null)return J.a4(a)
if(typeof a=="object")return A.cx(a)
return J.a4(a)},
i2(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
hE(a,b,c,d,e,f){t.Z.a(a)
switch(A.Z(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.dl("Unsupported number of arguments for wrapped closure"))},
hY(a,b){var s=a.$identity
if(!!s)return s
s=A.hZ(a,b)
a.$identity=s
return s},
hZ(a,b){var s
switch(b){case 0:s=a.$0
break
case 1:s=a.$1
break
case 2:s=a.$2
break
case 3:s=a.$3
break
case 4:s=a.$4
break
default:s=null}if(s!=null)return s.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.hE)},
fA(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cB().constructor.prototype):Object.create(new A.aM(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ef(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fw(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ef(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fw(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fr)}throw A.e("Error in functionType of tearoff")},
fx(a,b,c,d){var s=A.ee
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ef(a,b,c,d){if(c)return A.fz(a,b,d)
return A.fx(b.length,d,a,b)},
fy(a,b,c,d){var s=A.ee,r=A.fs
switch(b?-1:a){case 0:throw A.e(new A.cA("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fz(a,b,c){var s,r
if($.ec==null)$.ec=A.eb("interceptor")
if($.ed==null)$.ed=A.eb("receiver")
s=b.length
r=A.fy(s,c,a,b)
return r},
e0(a){return A.fA(a)},
fr(a,b){return A.c1(v.typeUniverse,A.aG(a.a),b)},
ee(a){return a.a},
fs(a){return a.b},
eb(a){var s,r,q,p=new A.aM("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.cQ("Field name "+a+" not found."))},
dy(a){return v.getIsolateTag(a)},
id(a){var s,r,q,p,o,n=A.a3($.f2.$1(a)),m=$.dw[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dE[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.eQ($.f_.$2(a,n))
if(q!=null){m=$.dw[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dE[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.dG(s)
$.dw[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dE[n]=s
return s}if(p==="-"){o=A.dG(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.f5(a,s)
if(p==="*")throw A.e(A.ez(n))
if(v.leafTags[n]===true){o=A.dG(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.f5(a,s)},
f5(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.e5(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
dG(a){return J.e5(a,!1,null,!!a.$iP)},
ig(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.dG(s)
else return J.e5(s,c,null,null)},
i8(){if(!0===$.e3)return
$.e3=!0
A.i9()},
i9(){var s,r,q,p,o,n,m,l
$.dw=Object.create(null)
$.dE=Object.create(null)
A.i7()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.f6.$1(o)
if(n!=null){m=A.ig(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
i7(){var s,r,q,p,o,n,m=B.I()
m=A.b6(B.J,A.b6(B.K,A.b6(B.w,A.b6(B.w,A.b6(B.L,A.b6(B.M,A.b6(B.N(B.v),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.f2=new A.dB(p)
$.f_=new A.dC(o)
$.f6=new A.dD(n)},
b6(a,b){return a(b)||b},
i0(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
ih(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ac:function ac(a){this.a=a},
ad:function ad(a,b){this.a=a
this.b=b},
bV:function bV(a,b){this.a=a
this.b=b},
bc:function bc(a,b){this.a=a
this.$ti=b},
bb:function bb(){},
a6:function a6(a,b,c){this.a=a
this.b=b
this.$ti=c},
bO:function bO(a,b){this.a=a
this.$ti=b},
bP:function bP(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bG:function bG(){},
dj:function dj(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bA:function bA(){},
cl:function cl(a,b,c){this.a=a
this.b=b
this.c=c},
cF:function cF(a){this.a=a},
d4:function d4(a){this.a=a},
ah:function ah(){},
c7:function c7(){},
c8:function c8(){},
cC:function cC(){},
cB:function cB(){},
aM:function aM(a,b){this.a=a
this.b=b},
cA:function cA(a){this.a=a},
a7:function a7(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cX:function cX(a){this.a=a},
d0:function d0(a,b){this.a=a
this.b=b
this.c=null},
a8:function a8(a,b){this.a=a
this.$ti=b},
bp:function bp(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
br:function br(a,b){this.a=a
this.$ti=b},
bq:function bq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
at:function at(a,b){this.a=a
this.$ti=b},
bo:function bo(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
dB:function dB(a){this.a=a},
dC:function dC(a){this.a=a},
dD:function dD(a){this.a=a},
a2:function a2(){},
aC:function aC(){},
b2:function b2(){},
aT:function aT(){},
bx:function bx(){},
cn:function cn(){},
aU:function aU(){},
bv:function bv(){},
bw:function bw(){},
co:function co(){},
cp:function cp(){},
cq:function cq(){},
cr:function cr(){},
cs:function cs(){},
ct:function ct(){},
cu:function cu(){},
by:function by(){},
cv:function cv(){},
bR:function bR(){},
bS:function bS(){},
bT:function bT(){},
bU:function bU(){},
dS(a,b){var s=b.c
return s==null?b.c=A.c_(a,"eh",[b.x]):s},
ev(a){var s=a.w
if(s===6||s===7)return A.ev(a.x)
return s===11||s===12},
fT(a){return a.as},
ae(a){return A.dt(v.typeUniverse,a,!1)},
aD(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aD(a1,s,a3,a4)
if(r===s)return a2
return A.eH(a1,r,!0)
case 7:s=a2.x
r=A.aD(a1,s,a3,a4)
if(r===s)return a2
return A.eG(a1,r,!0)
case 8:q=a2.y
p=A.b5(a1,q,a3,a4)
if(p===q)return a2
return A.c_(a1,a2.x,p)
case 9:o=a2.x
n=A.aD(a1,o,a3,a4)
m=a2.y
l=A.b5(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.dW(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.b5(a1,j,a3,a4)
if(i===j)return a2
return A.eI(a1,k,i)
case 11:h=a2.x
g=A.aD(a1,h,a3,a4)
f=a2.y
e=A.hU(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.eF(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.b5(a1,d,a3,a4)
o=a2.x
n=A.aD(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.dX(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.c6("Attempted to substitute unexpected RTI kind "+a0))}},
b5(a,b,c,d){var s,r,q,p,o=b.length,n=A.du(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aD(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
hV(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.du(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aD(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
hU(a,b,c,d){var s,r=b.a,q=A.b5(a,r,c,d),p=b.b,o=A.b5(a,p,c,d),n=b.c,m=A.hV(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cI()
s.a=q
s.b=o
s.c=m
return s},
d(a,b){a[v.arrayRti]=b
return a},
f0(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.i5(s)
return a.$S()}return null},
ia(a,b){var s
if(A.ev(b))if(a instanceof A.ah){s=A.f0(a)
if(s!=null)return s}return A.aG(a)},
aG(a){if(a instanceof A.l)return A.j(a)
if(Array.isArray(a))return A.I(a)
return A.dY(J.aF(a))},
I(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
j(a){var s=a.$ti
return s!=null?s:A.dY(a)},
dY(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hC(a,s)},
hC(a,b){var s=a instanceof A.ah?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hk(v.typeUniverse,s.name)
b.$ccache=r
return r},
i5(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dt(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
i4(a){return A.aE(A.j(a))},
e_(a){var s
if(a instanceof A.a2)return A.i1(a.$r,a.ad())
s=a instanceof A.ah?A.f0(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fp(a).a
if(Array.isArray(a))return A.I(a)
return A.aG(a)},
aE(a){var s=a.r
return s==null?a.r=new A.ds(a):s},
i1(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.c(q,0)
s=A.c1(v.typeUniverse,A.e_(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.c(q,r)
s=A.eK(v.typeUniverse,s,A.e_(q[r]))}return A.c1(v.typeUniverse,s,a)},
a_(a){return A.aE(A.dt(v.typeUniverse,a,!1))},
hB(a){var s=this
s.b=A.hT(s)
return s.b(a)},
hT(a){var s,r,q,p,o
if(a===t.K)return A.hK
if(A.aH(a))return A.hO
s=a.w
if(s===6)return A.hz
if(s===1)return A.eW
if(s===7)return A.hF
r=A.hS(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aH)){a.f="$i"+q
if(q==="i")return A.hI
if(a===t.m)return A.hH
return A.hN}}else if(s===10){p=A.i0(a.x,a.y)
o=p==null?A.eW:p
return o==null?A.eP(o):o}return A.hx},
hS(a){if(a.w===8){if(a===t.S)return A.eU
if(a===t.i||a===t.o)return A.hJ
if(a===t.N)return A.hM
if(a===t.y)return A.dZ}return null},
hA(a){var s=this,r=A.hw
if(A.aH(s))r=A.hs
else if(s===t.K)r=A.eP
else if(A.b7(s)){r=A.hy
if(s===t.a3)r=A.hp
else if(s===t.aD)r=A.eQ
else if(s===t.az)r=A.c3
else if(s===t.ae)r=A.eO
else if(s===t.dd)r=A.ho
else if(s===t.z)r=A.hr}else if(s===t.S)r=A.Z
else if(s===t.N)r=A.a3
else if(s===t.y)r=A.hm
else if(s===t.o)r=A.eN
else if(s===t.i)r=A.hn
else if(s===t.m)r=A.hq
s.a=r
return s.a(a)},
hx(a){var s=this
if(a==null)return A.b7(s)
return A.ic(v.typeUniverse,A.ia(a,s),s)},
hz(a){if(a==null)return!0
return this.x.b(a)},
hN(a){var s,r=this
if(a==null)return A.b7(r)
s=r.f
if(a instanceof A.l)return!!a[s]
return!!J.aF(a)[s]},
hI(a){var s,r=this
if(a==null)return A.b7(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.l)return!!a[s]
return!!J.aF(a)[s]},
hH(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.l)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
eV(a){if(typeof a=="object"){if(a instanceof A.l)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hw(a){var s=this
if(a==null){if(A.b7(s))return a}else if(s.b(a))return a
throw A.z(A.eR(a,s),new Error())},
hy(a){var s=this
if(a==null||s.b(a))return a
throw A.z(A.eR(a,s),new Error())},
eR(a,b){return new A.bY("TypeError: "+A.eA(a,A.Q(b,null)))},
eA(a,b){return A.cc(a)+": type '"+A.Q(A.e_(a),null)+"' is not a subtype of type '"+b+"'"},
U(a,b){return new A.bY("TypeError: "+A.eA(a,b))},
hF(a){var s=this
return s.x.b(a)||A.dS(v.typeUniverse,s).b(a)},
hK(a){return a!=null},
eP(a){if(a!=null)return a
throw A.z(A.U(a,"Object"),new Error())},
hO(a){return!0},
hs(a){return a},
eW(a){return!1},
dZ(a){return!0===a||!1===a},
hm(a){if(!0===a)return!0
if(!1===a)return!1
throw A.z(A.U(a,"bool"),new Error())},
c3(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.z(A.U(a,"bool?"),new Error())},
hn(a){if(typeof a=="number")return a
throw A.z(A.U(a,"double"),new Error())},
ho(a){if(typeof a=="number")return a
if(a==null)return a
throw A.z(A.U(a,"double?"),new Error())},
eU(a){return typeof a=="number"&&Math.floor(a)===a},
Z(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.z(A.U(a,"int"),new Error())},
hp(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.z(A.U(a,"int?"),new Error())},
hJ(a){return typeof a=="number"},
eN(a){if(typeof a=="number")return a
throw A.z(A.U(a,"num"),new Error())},
eO(a){if(typeof a=="number")return a
if(a==null)return a
throw A.z(A.U(a,"num?"),new Error())},
hM(a){return typeof a=="string"},
a3(a){if(typeof a=="string")return a
throw A.z(A.U(a,"String"),new Error())},
eQ(a){if(typeof a=="string")return a
if(a==null)return a
throw A.z(A.U(a,"String?"),new Error())},
hq(a){if(A.eV(a))return a
throw A.z(A.U(a,"JSObject"),new Error())},
hr(a){if(a==null)return a
if(A.eV(a))return a
throw A.z(A.U(a,"JSObject?"),new Error())},
eX(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.Q(a[q],b)
return s},
hR(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.eX(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.Q(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
eS(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.d([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.k(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.c(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.Q(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.Q(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.Q(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.Q(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.Q(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
Q(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.Q(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.Q(a.x,b)+">"
if(l===8){p=A.hW(a.x)
o=a.y
return o.length>0?p+("<"+A.eX(o,b)+">"):p}if(l===10)return A.hR(a,b)
if(l===11)return A.eS(a,b,null)
if(l===12)return A.eS(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.c(b,n)
return b[n]}return"?"},
hW(a){var s=A.f7(a)
if(s!=null)return s
return"minified:"+a},
hl(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hk(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dt(a,b,!1)
else if(typeof m=="number"){s=m
r=A.c0(a,5,"#")
q=A.du(s)
for(p=0;p<s;++p)q[p]=r
o=A.c_(a,b,q)
n[b]=o
return o}else return m},
hj(a,b){return A.eL(a.tR,b)},
hi(a,b){return A.eL(a.eT,b)},
dt(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.eJ(a,null,b,!1)
r.set(b,s)
return s},
c1(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.eJ(a,b,c,!0)
q.set(c,r)
return r},
eK(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.dW(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
eJ(a,b,c,d){return A.hb(A.h5(a,b,c,d))},
am(a,b){b.a=A.hA
b.b=A.hB
return b},
c0(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.X(null,null)
s.w=b
s.as=c
r=A.am(a,s)
a.eC.set(c,r)
return r},
eH(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hg(a,b,r,c)
a.eC.set(r,s)
return s},
hg(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aH(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.b7(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.X(null,null)
q.w=6
q.x=b
q.as=c
return A.am(a,q)},
eG(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.he(a,b,r,c)
a.eC.set(r,s)
return s},
he(a,b,c,d){var s,r
if(d){s=b.w
if(A.aH(b)||b===t.K)return b
else if(s===1)return A.c_(a,"eh",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.X(null,null)
r.w=7
r.x=b
r.as=c
return A.am(a,r)},
hh(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.X(null,null)
s.w=13
s.x=b
s.as=q
r=A.am(a,s)
a.eC.set(q,r)
return r},
bZ(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hd(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
c_(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.bZ(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.X(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.am(a,r)
a.eC.set(p,q)
return q},
dW(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.bZ(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.X(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.am(a,o)
a.eC.set(q,n)
return n},
eI(a,b,c){var s,r,q="+"+(b+"("+A.bZ(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.X(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.am(a,s)
a.eC.set(q,r)
return r},
eF(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.bZ(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.bZ(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hd(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.X(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.am(a,p)
a.eC.set(r,o)
return o},
dX(a,b,c,d){var s,r=b.as+("<"+A.bZ(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hf(a,b,c,r,d)
a.eC.set(r,s)
return s},
hf(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.du(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aD(a,b,r,0)
m=A.b5(a,c,r,0)
return A.dX(a,n,m,c!==m)}}l=new A.X(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.am(a,l)},
h5(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hb(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.h7(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eC(a,r,l,k,!1)
else if(q===46)r=A.eC(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aB(a.u,a.e,k.pop()))
break
case 94:k.push(A.hh(a.u,k.pop()))
break
case 35:k.push(A.c0(a.u,5,"#"))
break
case 64:k.push(A.c0(a.u,2,"@"))
break
case 126:k.push(A.c0(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.h9(a,k)
break
case 38:A.h8(a,k)
break
case 63:p=a.u
k.push(A.eH(p,A.aB(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.eG(p,A.aB(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.h6(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.eD(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.hc(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-2)
break
case 43:n=l.indexOf("(",r)
k.push(l.substring(r,n))
k.push(-4)
k.push(a.p)
a.p=k.length
r=n+1
break
default:throw"Bad character "+q}}}m=k.pop()
return A.aB(a.u,a.e,m)},
h7(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eC(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hl(s,o.x)[p]
if(n==null)A.aJ('No "'+p+'" in "'+A.fT(o)+'"')
d.push(A.c1(s,o,n))}else d.push(p)
return m},
h9(a,b){var s,r=a.u,q=A.eB(a,b),p=b.pop()
if(typeof p=="string")b.push(A.c_(r,p,q))
else{s=A.aB(r,a.e,p)
switch(s.w){case 11:b.push(A.dX(r,s,q,a.n))
break
default:b.push(A.dW(r,s,q))
break}}},
h6(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eB(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aB(p,a.e,o)
q=new A.cI()
q.a=s
q.b=n
q.c=m
b.push(A.eF(p,r,q))
return
case-4:b.push(A.eI(p,b.pop(),s))
return
default:throw A.e(A.c6("Unexpected state under `()`: "+A.q(o)))}},
h8(a,b){var s=b.pop()
if(0===s){b.push(A.c0(a.u,1,"0&"))
return}if(1===s){b.push(A.c0(a.u,4,"1&"))
return}throw A.e(A.c6("Unexpected extended operation "+A.q(s)))},
eB(a,b){var s=b.splice(a.p)
A.eD(a.u,a.e,s)
a.p=b.pop()
return s},
aB(a,b,c){if(typeof c=="string")return A.c_(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.ha(a,b,c)}else return c},
eD(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aB(a,b,c[s])},
hc(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aB(a,b,c[s])},
ha(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.c6("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.c6("Bad index "+c+" for "+b.j(0)))},
ic(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.y(a,b,null,c,null)
r.set(c,s)}return s},
y(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aH(d))return!0
s=b.w
if(s===4)return!0
if(A.aH(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.y(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.y(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.y(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.y(a,b.x,c,d,e))return!1
return A.y(a,A.dS(a,b),c,d,e)}if(s===6)return A.y(a,p,c,d,e)&&A.y(a,b.x,c,d,e)
if(q===7){if(A.y(a,b,c,d.x,e))return!0
return A.y(a,b,c,A.dS(a,d),e)}if(q===6)return A.y(a,b,c,p,e)||A.y(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.cY)return!0
if(q===12){if(b===t.g)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.y(a,j,c,i,e)||!A.y(a,i,e,j,c))return!1}return A.eT(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.eT(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hG(a,b,c,d,e)}if(o&&q===10)return A.hL(a,b,c,d,e)
return!1},
eT(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.y(a3,a4.x,a5,a6.x,a7))return!1
s=a4.y
r=a6.y
q=s.a
p=r.a
o=q.length
n=p.length
if(o>n)return!1
m=n-o
l=s.b
k=r.b
j=l.length
i=k.length
if(o+j<n+i)return!1
for(h=0;h<o;++h){g=q[h]
if(!A.y(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.y(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.y(a3,k[h],a7,g,a5))return!1}f=s.c
e=r.c
d=f.length
c=e.length
for(b=0,a=0;a<c;a+=3){a0=e[a]
for(;;){if(b>=d)return!1
a1=f[b]
b+=3
if(a0<a1)return!1
a2=f[b-2]
if(a1<a0){if(a2)return!1
continue}g=e[a+1]
if(a2&&!g)return!1
g=f[b-1]
if(!A.y(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
hG(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.c1(a,b,r[o])
return A.eM(a,p,null,c,d.y,e)}return A.eM(a,b.y,null,c,d.y,e)},
eM(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.y(a,b[s],d,e[s],f))return!1
return!0},
hL(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.y(a,r[s],c,q[s],e))return!1
return!0},
b7(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aH(a))if(s!==6)r=s===7&&A.b7(a.x)
return r},
aH(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
eL(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
du(a){return a>0?new Array(a):v.typeUniverse.sEA},
X:function X(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cI:function cI(){this.c=this.b=this.a=null},
ds:function ds(a){this.a=a},
cH:function cH(){},
bY:function bY(a){this.a=a},
eE(a,b,c){return 0},
bX:function bX(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
b3:function b3(a,b){this.a=a
this.$ti=b},
en(a,b){return new A.a7(a.h("@<0>").u(b).h("a7<1,2>"))},
bs(a,b,c){return b.h("@<0>").u(c).h("em<1,2>").a(A.i2(a,new A.a7(b.h("@<0>").u(c).h("a7<1,2>"))))},
T(a,b){return new A.a7(a.h("@<0>").u(b).h("a7<1,2>"))},
eo(a){return new A.bQ(a.h("bQ<0>"))},
dV(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
h4(a,b,c){var s=new A.aA(a,b,c.h("aA<0>"))
s.c=a.e
return s},
fN(a,b,c){var s=A.en(b,c)
a.E(0,new A.d1(s,b,c))
return s},
fO(a,b){var s=A.eo(b)
s.a0(0,a)
return s},
dP(a){var s,r
if(A.e4(a))return"{...}"
s=new A.aZ("")
try{r={}
B.a.k($.R,a)
s.a+="{"
r.a=!0
a.E(0,new A.d3(r,s))
s.a+="}"}finally{if(0>=$.R.length)return A.c($.R,-1)
$.R.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bQ:function bQ(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cM:function cM(a){this.a=a
this.b=null},
aA:function aA(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
d1:function d1(a,b,c){this.a=a
this.b=b
this.c=c},
p:function p(){},
o:function o(){},
d2:function d2(a){this.a=a},
d3:function d3(a,b){this.a=a
this.b=b},
c2:function c2(){},
aS:function aS(){},
ay:function ay(a,b){this.a=a
this.$ti=b},
aX:function aX(){},
bW:function bW(){},
b4:function b4(){},
hQ(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.e6(r)
q=String(s)
throw A.e(new A.cV(q))}q=A.dv(p)
return q},
dv(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cK(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dv(a[s])
return a},
el(a,b,c){return new A.bn(a,b)},
hu(a){return a.M()},
h2(a,b){return new A.dn(a,[],A.i_())},
h3(a,b,c){var s,r=new A.aZ(""),q=A.h2(r,b)
q.a6(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cK:function cK(a,b){this.a=a
this.b=b
this.c=null},
cL:function cL(a){this.a=a},
c9:function c9(){},
cb:function cb(){},
bn:function bn(a,b){this.a=a
this.b=b},
cm:function cm(a,b){this.a=a
this.b=b},
cY:function cY(){},
d_:function d_(a){this.b=a},
cZ:function cZ(a){this.a=a},
dp:function dp(){},
dq:function dq(a,b){this.a=a
this.b=b},
dn:function dn(a,b,c){this.c=a
this.a=b
this.b=c},
fP(a,b,c,d){var s,r=c?J.ej(a,d):J.fJ(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
aR(a,b,c){var s,r=A.d([],c.h("h<0>"))
for(s=J.af(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
bt(a,b){var s,r
if(Array.isArray(a))return A.d(a.slice(0),b.h("h<0>"))
s=A.d([],b.h("h<0>"))
for(r=J.af(a);r.n();)B.a.k(s,r.gp())
return s},
fQ(a,b,c){var s,r=J.ej(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
A(a,b){var s=A.aR(a,!1,b)
s.$flags=3
return s},
ex(a,b,c){var s=J.af(b)
if(!s.n())return a
if(c.length===0){do a+=A.q(s.gp())
while(s.n())}else{a+=A.q(s.gp())
while(s.n())a=a+c+A.q(s.gp())}return a},
fC(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.e(A.fq(b,"name","No enum value with that name"))},
fB(a,b){var s,r,q=A.T(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cc(a){if(typeof a=="number"||A.dZ(a)||a==null)return J.c4(a)
if(typeof a=="string")return JSON.stringify(a)
return A.es(a)},
c6(a){return new A.c5(a)},
cQ(a){return new A.ag(!1,null,null,a)},
fq(a,b,c){return new A.ag(!0,a,b,c)},
et(a){var s=null
return new A.aW(s,s,!1,s,s,a)},
eu(a,b){return new A.aW(null,null,!0,a,b,"Value not in range")},
ax(a,b,c,d,e){return new A.aW(b,c,!0,a,d,"Invalid value")},
fS(a,b,c){if(0>a||a>c)throw A.e(A.ax(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.ax(b,a,c,"end",null))
return b}return c},
dR(a,b){if(a<0)throw A.e(A.ax(a,0,null,b,null))
return a},
dK(a,b,c,d){return new A.cf(b,!0,a,d,"Index out of range")},
dU(a){return new A.bK(a)},
ez(a){return new A.cE(a)},
ew(a){return new A.aY(a)},
a1(a){return new A.ca(a)},
fI(a,b,c){var s,r
if(A.e4(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.d([],t.s)
B.a.k($.R,a)
try{A.hP(a,s)}finally{if(0>=$.R.length)return A.c($.R,-1)
$.R.pop()}r=A.ex(b,t.k.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
dL(a,b,c){var s,r
if(A.e4(a))return b+"..."+c
s=new A.aZ(b)
B.a.k($.R,a)
try{r=s
r.a=A.ex(r.a,a,", ")}finally{if(0>=$.R.length)return A.c($.R,-1)
$.R.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
hP(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.q(l.gp())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.c(b,-1)
r=b.pop()
if(0>=b.length)return A.c(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.k(b,A.q(p))
return}r=A.q(p)
if(0>=b.length)return A.c(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.c(b,-1)
k-=b.pop().length+2;--j}B.a.k(b,"...")
return}}q=A.q(p)
r=A.q(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.c(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.k(b,m)
B.a.k(b,q)
B.a.k(b,r)},
ep(a,b,c,d,e){return new A.ap(a,b.h("@<0>").u(c).u(d).u(e).h("ap<1,2,3,4>"))},
eq(a,b,c,d){var s
if(B.f===c){s=B.d.gv(a)
b=J.a4(b)
return A.dT(A.al(A.al($.dJ(),s),b))}if(B.f===d){s=B.d.gv(a)
b=J.a4(b)
c=J.a4(c)
return A.dT(A.al(A.al(A.al($.dJ(),s),b),c))}s=B.d.gv(a)
b=J.a4(b)
c=J.a4(c)
d=J.a4(d)
d=A.dT(A.al(A.al(A.al(A.al($.dJ(),s),b),c),d))
return d},
cG:function cG(){},
t:function t(){},
c5:function c5(a){this.a=a},
bJ:function bJ(){},
ag:function ag(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aW:function aW(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
cf:function cf(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bK:function bK(a){this.a=a},
cE:function cE(a){this.a=a},
aY:function aY(a){this.a=a},
ca:function ca(a){this.a=a},
bH:function bH(){},
dl:function dl(a){this.a=a},
cV:function cV(a){this.a=a},
b:function b(){},
x:function x(a,b,c){this.a=a
this.b=b
this.$ti=c},
bz:function bz(){},
l:function l(){},
aZ:function aZ(a){this.a=a},
cJ:function cJ(){},
cN:function cN(){this.b=this.a=0},
ij(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.bt(a1,t.bM),c=A.bt(a,t.R)
for(s=A.I(c),r=s.h("u(1)"),s=s.h("ab<1>"),q=s.h("b.E"),p=b,o=a2;;){n={}
m=A.f3(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.c(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.a3(k,p.b)
p=null}else j=A.e2(k,c,d,o)
k.$flags&1&&A.b8(k,"removeAt",1)
if(j<0||j>=k.length)A.aJ(A.eu(j,null))
B.a.k(c,new A.ad(o,k.splice(j,1)[0]))
o=B.d.C(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.bt(new A.ab(c,r.a(new A.dH(n)),s),q)
l=A.I(f)
e=new A.a9(f,l.h("H(1)").a(new A.dI()),l.h("a9<1,H>")).aQ(0)
B.a.k(d,e.a===1?e.gX(0):null)
o=B.a.gV(f).a
B.a.S(c)}},
e2(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h=new A.dA(a),g=new A.dz(a),f=a.length
if(f===1)return 0
s=(d&1)===0?B.b:B.c
r=b.length
if(r===0){if(c.length!==0)return g.$0()
f=A.bt(a,t.S)
B.a.aU(f)
if(B.a.gaM(f)>=10){r=f.length
q=r-2
if(!(q>=0))return A.c(f,q)
q=f[q]>=6
r=q}else r=!1
if(r){r=f.length
q=r-2
if(!(q>=0))return A.c(f,q)
return B.a.a3(a,f[q])}return g.$0()}for(p=-2,o=-2,n=0;n<r;++n){q=b[n]
m=q.b
if(((q.a&1)===0?B.b:B.c)===s)o=Math.max(o,m)
else p=Math.max(p,m)}q=o>p
if(q)r=r===3||o>=8
else r=!1
if(r)return h.$0()
r=q?o:-2
l=Math.max(p,r)
for(k=-1,j=0;j<f;++j){r=a[j]
if(r>l)if(k>=0){if(!(k>=0&&k<f))return A.c(a,k)
r=r<a[k]}else r=!0
else r=!1
if(r)k=j}if(k>=0)return k
if(c.length!==0&&B.a.gV(c)===s){i=B.a.a3(a,p)
if(i>=0)return i}return h.$0()},
a0:function a0(a,b){this.a=a
this.b=b},
cD:function cD(a,b){this.a=a
this.b=b},
dc:function dc(){},
d9:function d9(){},
da:function da(){},
db:function db(a,b){this.a=a
this.b=b},
dd:function dd(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dH:function dH(a){this.a=a},
dI:function dI(){},
dA:function dA(a){this.a=a},
dz:function dz(a){this.a=a},
ft(a,b){return new A.O(a,b)},
fu(a){return new A.O(B.a.aI(B.p,new A.cR(a)),B.a.aI(B.z,new A.cS(a)))},
Y:function Y(a,b){this.a=a
this.b=b},
G:function G(a,b,c){this.c=a
this.a=b
this.b=c},
O:function O(a,b){this.a=a
this.b=b},
cR:function cR(a){this.a=a},
cS:function cS(a){this.a=a},
eZ(a){var s
A:{if(a instanceof A.C){s=A.T(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.ga2())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.F){s=A.bs(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.D){s=A.bs(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.K){s=A.bs(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
eY(a){var s,r,q=a.m(0,"s")
q.toString
A.Z(q)
s=a.m(0,"t")
A:{if("play"===s){r=a.m(0,"c")
r.toString
q=new A.C(A.fu(A.a3(r)),J.V(a.m(0,"x"),!0),q)
break A}if("raise"===s){q=new A.F(q)
break A}if("accept"===s){q=new A.D(q)
break A}if("fold"===s){q=new A.K(q)
break A}q=A.aJ(A.bg("unknown action "+A.q(a.m(0,"t"))))}return q},
ce:function ce(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$
_.w=g
_.x=0},
av:function av(a,b){this.a=a
this.b=b},
di:function di(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l},
fW(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bB(b3,b4),b0=new A.d8(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
A:{if(B.l===b2){s=((b3.ay.a&1)===0?B.b:B.c)!==b1&&b6.$1(b4)
break A}if(B.e===b2){s=b3.ch===b1&&b6.$1(b4)
break A}s=!1
break A}r=b3.r
q=b3.as
p=b3.e
o=b3.z
n=B.d.C((o.length===0?B.d.C(p+1,4):B.a.gaM(o).c)+3,4)
m=b3.f
l=b3.y
k=b3.gaj()
j=b3.at
i=b3.ay
h=b3.ch
g=b3.CW
f=t.S
e=A.eg(b3.c,t.H,f)
d=A.d([],t.bP)
for(o=A.A(o,t.F),c=o.length,b=t.A,a=0;a<c;++a){a0=o[a]
a1=A.d([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
d.push(new A.cz(a1,a0.b,a0.c))}o=A.d([],b)
for(c=A.A(b3.Q,t.n),b=c.length,a=0;a<b;++a)o.push(b0.$1(c[a]))
c=a9.gW()
b=A.d([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.c(a2,a5)
a6=A.aR(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gan()
a2=a9.gaO()
a3=b3.gah()
a7=b3.aF(b4)
a8=b3.r===B.h&&b3.as===b4
return new A.b_(b4,b3.a,r,q,p,n,m,l,k,j,i,h,g,e,d,o,c,b,a1,a2,a3,a7,s,a8,b3.cy,A.eg(b7.a,f,t.N),b7.by(b1),b7.d,b5)},
aV:function aV(a,b,c){this.a=a
this.b=b
this.c=c},
cz:function cz(a,b,c){this.a=a
this.b=b
this.c=c},
b_:function b_(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=q
_.CW=r
_.cx=s
_.cy=a0
_.db=a1
_.dx=a2
_.dy=a3
_.fr=a4
_.fx=a5
_.fy=a6
_.go=a7
_.id=a8
_.k1=a9},
d8:function d8(a){this.a=a},
d7:function d7(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
bg(a){return new A.cd(a)},
fX(a,b,c){var s,r,q,p,o=A.bs([B.b,0,B.c,0],t.H,t.S),n=A.d([],t.q),m=t.cm,l=J.dM(4,m)
for(s=t.Y,r=0;r<4;++r)l[r]=A.d([],s)
q=J.dM(4,m)
for(r=0;r<4;++r)q[r]=A.d([],s)
m=A.d([],t.B)
s=A.d([],t.r)
p=new A.cN()
p.aY(c)
o=new A.de(b,p,o,n,B.d.C(a+3,4),B.m,l,q,m,s)
o.a7()
return o},
fY(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.C
r=!1
if(s){r=b instanceof A.C
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.K(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.F){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.F
q=a}else q=o
if(r){r=s?p:b
t.aN.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.D){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.D
q=a}else q=o
if(r){r=s?p:b
t.l.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.K){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.K
q=a}else q=o
if(r){r=s?p:b
t.c.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
i6(a){var s,r,q=A.d([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.J)(a),++r)q.push(a[r].b)
return A.f3(q)},
f3(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.ag
if(q>=2)return B.ah
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.ac(n)
if(l&&m!=null)return new A.ac(m)}if(s===3){if(2>=s)return A.c(a,2)
s=a[2]
return new A.ac(s==null?a[0]:s)}return null},
ai:function ai(a,b){this.a=a
this.b=b},
S:function S(){},
C:function C(a,b,c){this.b=a
this.c=b
this.a=c},
F:function F(a){this.a=a},
D:function D(a){this.a=a},
K:function K(a){this.a=a},
L:function L(){},
bh:function bh(a){this.e=a},
aN:function aN(a,b){this.a=a
this.b=b},
b9:function b9(){},
bD:function bD(a,b){this.a=a
this.c=b},
bC:function bC(a){this.a=a},
be:function be(a){this.a=a},
bE:function bE(){},
ar:function ar(a,b){this.a=a
this.b=b},
bf:function bf(a){this.a=a},
W:function W(a,b,c){this.a=a
this.b=b
this.c=c},
bF:function bF(a,b,c){this.a=a
this.b=b
this.c=c},
d5:function d5(a,b){this.a=a
this.b=b},
cd:function cd(a){this.a=a},
de:function de(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=0
_.r=f
_.w=g
_.x=h
_.y=null
_.z=i
_.Q=j
_.at=_.as=0
_.ch=_.ay=_.ax=null
_.cx=_.CW=!1
_.cy=null},
dh:function dh(a){this.a=a},
df:function df(a,b){this.a=a
this.b=b},
dg:function dg(){},
bB:function bB(a,b){this.a=a
this.b=b},
H:function H(a,b){this.a=a
this.b=b},
ii(b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=null,a9=t.f,b0=t.N,b1=t.X,b2=a9.a(B.x.bm(b4,a8)).G(0,b0,b1),b3=J.aL(b2,"rules")
b3.toString
b3=a9.a(b3).G(0,b0,b1)
h=A.fB(B.Z,t.aJ).m(0,b3.m(0,"manilhas"))
g=A.c3(b3.m(0,"coberta"))
f=A.c3(b3.m(0,"ferro"))
e=A.c3(b3.m(0,"verNoTruco"))
d=A.c3(b3.m(0,"verNaMaoDeOnze"))
b3=A.c3(b3.m(0,"terceiraCarta"))
if(h==null)h=B.q
b3=new A.di("paulista","Paulista",h,B.a3,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,b3!==!1)
h=J.aL(b2,"seed")
h.toString
A.Z(h)
g=J.aL(b2,"firstDealer")
g.toString
A.Z(g)
f=A.d([],t.cG)
e=J.aL(b2,"bots")
e.toString
t.j.a(e)
d=e.length
c=t.h
b=0
for(;b<e.length;e.length===d||(0,A.J)(e),++b){a=e[b]
f.push(a==null?a8:A.fC(B.a_,A.a3(a),c))}e=t.d
d=A.d([],e)
c=t.M.a(J.aL(b2,"log"))
if(c==null)c=B.a2
a0=c.length
b=0
for(;b<c.length;c.length===a0||(0,A.J)(c),++b)d.push(a9.a(c[b]).G(0,b0,b1))
c=t.S
a0=A.bs([B.b,0,B.c,0],t.H,c)
a1=A.A(f,t.ch)
a2=new A.ce(b3,h,g,a1,A.d([],e),B.O,new A.d7(A.T(c,b0),a0))
a2.aX(f,g,d,a8,b3,h)
s=a2
r=null
q=null
b3=t.a5.a(J.aL(b2,"act"))
p=b3==null?a8:b3.G(0,b0,b1)
try{if(J.V(J.aL(b2,"timeout"),!0)){a9=s
a3=a9.gaR()
if(a3==null)A.aJ(A.bg("nobody to wait for"))
b1=a9.f
b3=a9.r
b3===$&&A.aK()
a4=a9.ag(a3,new A.cD(B.u,b1).aH(new A.bB(b3,a3)))}else if(p==null){a9=s
a5=A.T(c,t.Q)
a9.av(a5)
if(a5.a===0)a9.a_(a5,0)
a4=a5}else{b3=s
h=p.m(0,"seat")
h.toString
A.Z(h)
g=p.m(0,"action")
g.toString
g=t.G.a(a9.a(g).G(0,b0,b1))
if(J.V(g.m(0,"t"),"blind")){a9=g.m(0,"i")
a9.toString
A.Z(a9)
b1=b3.r
b1===$&&A.aK()
b1=b1.w
if(!(h>=0&&h<b1.length))return A.c(b1,h)
a6=A.A(b1[h],t.L)
if(a9<0||a9>=a6.length)A.aJ(A.bg("no card "+a9))
if(!(a9>=0&&a9<a6.length))return A.c(a6,a9)
a9=b3.ag(h,new A.C(a6[a9],!1,h))}else{a9=A.en(b0,b1)
a9.a0(0,g)
a9.i(0,"s",h)
a9=b3.ag(h,A.eY(a9))}a4=a9}o=a4
n=A.T(c,t.W)
for(a9=o,a9=new A.at(a9,A.j(a9).h("at<1,2>")).gq(0);a9.n();){b1=a9.d
b1.toString
m=b1
b1=m.a
l=[]
for(b3=m.b,h=b3.length,b=0;b<b3.length;b3.length===h||(0,A.J)(b3),++b){k=b3[b]
J.e9(l,k.M())}J.fl(n,b1,l)}r=n}catch(a7){n=A.e6(a7)
if(n instanceof A.cd){j=n
q=j.a
r=B.A}else{i=n
q=A.q(i)
r=B.A}}n=s.r
n===$&&A.aK()
l=t.K
a9=A.T(b0,l)
a9.i(0,"log",s.e)
b1=A.T(b0,t.W)
for(b3=r.gL(),b3=b3.gq(b3);b3.n();){h=b3.gp()
b1.i(0,""+h.a,h.b)}a9.i(0,"frames",b1)
a9.i(0,"phase",n.r.b)
b1=n.cy
if(b1!=null)a9.i(0,"winner",b1.b)
b1=n.c
a9.i(0,"scores",A.d([b1.m(0,B.b),b1.m(0,B.c)],t.a))
b1=s.gaR()
if(b1!=null)a9.i(0,"waitingFor",b1)
b1=A.d([],t.J)
for(n=B.a.gq(n.d),b3=new A.az(n,t.ca),h=t.e;b3.n();){g=h.a(n.gp())
f=A.T(b0,l)
e=g.a
if(e!=null)f.i(0,"w",e.b)
f.i(0,"p",g.b)
b1.push(f)}a9.i(0,"hands",b1)
n=q
if(n!=null)a9.i(0,"error",n)
return B.x.bo(a9,a8)},
ie(){var s,r=v.G.globalThis,q=new A.dF()
if(typeof q=="function")A.aJ(A.cQ("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.ht,q)
s[$.e7()]=q
r.trucoEngine=s},
dF:function dF(){},
f7(a){return v.mangledGlobalNames[a]},
ik(a){throw A.z(new A.aQ("Field '"+a+"' has been assigned during initialization."),new Error())},
aK(){throw A.z(A.fM(""),new Error())},
il(){throw A.z(A.fL(""),new Error())},
ht(a,b,c){t.Z.a(a)
if(A.Z(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.dN.prototype={}
J.cg.prototype={
K(a,b){return a===b},
gv(a){return A.cx(a)},
j(a){return"Instance of '"+A.cy(a)+"'"},
gA(a){return A.aE(A.dY(this))}}
J.cj.prototype={
j(a){return String(a)},
gv(a){return a?519018:218159},
gA(a){return A.aE(t.y)},
$im:1,
$iu:1}
J.bj.prototype={
K(a,b){return null==b},
j(a){return"null"},
gv(a){return 0},
$im:1}
J.bl.prototype={$iw:1}
J.ak.prototype={
gv(a){return 0},
j(a){return String(a)}}
J.cw.prototype={}
J.b0.prototype={}
J.aj.prototype={
j(a){var s=a[$.f9()]
if(s==null)s=a[$.e7()]
if(s==null)return this.aW(a)
return"JavaScript function for "+J.c4(s)},
$iaq:1}
J.bk.prototype={
gv(a){return 0},
j(a){return String(a)}}
J.bm.prototype={
gv(a){return 0},
j(a){return String(a)}}
J.h.prototype={
k(a,b){A.I(a).c.a(b)
a.$flags&1&&A.b8(a,29)
a.push(b)},
bx(a,b){var s
a.$flags&1&&A.b8(a,"remove",1)
for(s=0;s<a.length;++s)if(J.V(a[s],b)){a.splice(s,1)
return!0}return!1},
S(a){a.$flags&1&&A.b8(a,"clear","clear")
a.length=0},
aI(a,b){var s,r,q
A.I(a).h("u(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.e(A.a1(a))}throw A.e(A.ch())},
H(a,b){if(!(b<a.length))return A.c(a,b)
return a[b]},
aV(a,b,c){var s=a.length
if(b>s)throw A.e(A.ax(b,0,s,"start",null))
if(c<b||c>s)throw A.e(A.ax(c,b,s,"end",null))
if(b===c)return A.d([],A.I(a))
return A.d(a.slice(b,c),A.I(a))},
gV(a){if(a.length>0)return a[0]
throw A.e(A.ch())},
gaM(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.ch())},
gX(a){var s=a.length
if(s===1){if(0>=s)return A.c(a,0)
return a[0]}if(s===0)throw A.e(A.ch())
throw A.e(A.ei())},
a1(a,b){var s,r
A.I(a).h("u(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.a1(a))}return!1},
br(a,b){var s,r
A.I(a).h("u(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.a1(a))}return!0},
aU(a){var s,r,q,p,o,n
a.$flags&2&&A.b8(a,"sort")
s=a.length
if(s<2)return
if(s===2){r=a[0]
q=a[1]
p=J.ek(r,q)
if(typeof p!=="number")return p.bD()
if(p>0){a[0]=q
a[1]=r}return}o=0
if(A.I(a).c.b(null))for(n=0;n<a.length;++n)if(a[n]===void 0){a[n]=null;++o}a.sort(A.hY(J.hD(),2))
if(o>0)this.be(a,o)},
be(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
ap(a,b){var s,r,q,p
a.$flags&2&&A.b8(a,"shuffle")
s=a.length
while(s>1){r=b.a4(s);--s
q=a.length
if(!(s<q))return A.c(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.c(a,r)
a[s]=a[r]
a[r]=p}},
a3(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.c(a,s)
if(J.V(a[s],b))return s}return-1},
ai(a,b){var s
for(s=0;s<a.length;++s)if(J.V(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gB(a){return a.length!==0},
j(a){return A.dL(a,"[","]")},
gq(a){return new J.an(a,a.length,A.I(a).h("an<1>"))},
gv(a){return A.cx(a)},
gl(a){return a.length},
i(a,b,c){A.I(a).c.a(c)
a.$flags&2&&A.b8(a)
if(!(b>=0&&b<a.length))throw A.e(A.f1(a,b))
a[b]=c},
$if:1,
$ib:1,
$ii:1}
J.ci.prototype={
bz(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cy(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.cW.prototype={}
J.an.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.J(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iv:1}
J.aP.prototype={
aG(a,b){var s
A.eN(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gal(b)
if(this.gal(a)===s)return 0
if(this.gal(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gal(a){return a===0?1/a<0:a<0},
j(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gv(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
C(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
return s+b},
O(a,b){return(a|0)===a?a/b|0:this.bi(a,b)},
bi(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.dU("Result of truncating division is "+A.q(s)+": "+A.q(a)+" ~/ "+b))},
aD(a,b){var s
if(a>0)s=this.bg(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bg(a,b){return b>31?0:a>>>b},
gA(a){return A.aE(t.o)},
$ia5:1,
$ik:1,
$iN:1}
J.bi.prototype={
gA(a){return A.aE(t.S)},
$im:1,
$ia:1}
J.ck.prototype={
gA(a){return A.aE(t.i)},
$im:1}
J.as.prototype={
T(a,b,c){return a.substring(b,A.fS(b,c,a.length))},
aG(a,b){var s
A.a3(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
j(a){return a},
gv(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gA(a){return A.aE(t.N)},
gl(a){return a.length},
$im:1,
$ia5:1,
$in:1}
A.b1.prototype={
gq(a){var s=this.a
return new A.ba(s.gq(s),A.j(this).h("ba<1,2>"))},
gl(a){var s=this.a
return s.gl(s)},
gt(a){var s=this.a
return s.gt(s)},
gB(a){var s=this.a
return s.gB(s)},
j(a){return this.a.j(0)}}
A.ba.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iv:1}
A.ao.prototype={}
A.bN.prototype={$if:1}
A.ap.prototype={
G(a,b,c){return new A.ap(this.a,this.$ti.h("@<1,2>").u(b).u(c).h("ap<1,2,3,4>"))},
m(a,b){return this.$ti.h("4?").a(this.a.m(0,b))},
E(a,b){this.a.E(0,new A.cU(this,this.$ti.h("~(3,4)").a(b)))},
gF(){var s=this.$ti
return A.fv(this.a.gF(),s.c,s.y[2])},
gl(a){var s=this.a
return s.gl(s)},
gt(a){var s=this.a
return s.gt(s)},
gB(a){var s=this.a
return s.gB(s)},
gL(){return this.a.gL().am(0,new A.cT(this),this.$ti.h("x<3,4>"))}}
A.cU.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.cT.prototype={
$1(a){var s=this.a.$ti
s.h("x<1,2>").a(a)
return new A.x(s.y[2].a(a.a),s.y[3].a(a.b),s.h("x<3,4>"))},
$S(){return this.a.$ti.h("x<3,4>(x<1,2>)")}}
A.aQ.prototype={
j(a){return"LateInitializationError: "+this.a}}
A.d6.prototype={}
A.f.prototype={}
A.M.prototype={
gq(a){var s=this
return new A.au(s,s.gl(s),A.j(s).h("au<M.E>"))},
gt(a){return this.gl(this)===0},
am(a,b,c){var s=A.j(this)
return new A.a9(this,s.u(c).h("1(M.E)").a(b),s.h("@<M.E>").u(c).h("a9<1,2>"))},
aQ(a){var s,r=this,q=A.eo(A.j(r).h("M.E"))
for(s=0;s<r.gl(r);++s)q.k(0,r.H(0,s))
return q}}
A.bI.prototype={
gb7(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbh(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gl(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
H(a,b){var s=this,r=s.gbh()+b,q=s.gb7()
if(r>=q)throw A.e(A.dK(b,s.gl(0),s,"index"))
return J.ea(s.a,r)}}
A.au.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dx(q),o=p.gl(q)
if(r.b!==o)throw A.e(A.a1(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.H(q,s);++r.c
return!0},
$iv:1}
A.aw.prototype={
gq(a){return new A.bu(J.af(this.a),this.b,A.j(this).h("bu<1,2>"))},
gl(a){return J.cP(this.a)},
gt(a){return J.fn(this.a)}}
A.bd.prototype={$if:1}
A.bu.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iv:1}
A.a9.prototype={
gl(a){return J.cP(this.a)},
H(a,b){return this.b.$1(J.ea(this.a,b))}}
A.ab.prototype={
gq(a){return new A.bL(J.af(this.a),this.b,this.$ti.h("bL<1>"))}}
A.bL.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iv:1}
A.bM.prototype={
gq(a){return new A.az(J.af(this.a),this.$ti.h("az<1>"))}}
A.az.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iv:1}
A.r.prototype={
sl(a,b){throw A.e(A.dU("Cannot change the length of a fixed-length list"))},
k(a,b){A.aG(a).h("r.E").a(b)
throw A.e(A.dU("Cannot add to a fixed-length list"))}}
A.ac.prototype={$r:"+winner(1)",$s:1}
A.ad.prototype={$r:"+(1,2)",$s:2}
A.bV.prototype={$r:"+points,winner(1,2)",$s:3}
A.bc.prototype={}
A.bb.prototype={
G(a,b,c){var s=A.j(this)
return A.ep(this,s.c,s.y[1],b,c)},
gt(a){return this.gl(this)===0},
gB(a){return this.gl(this)!==0},
j(a){return A.dP(this)},
gL(){return new A.b3(this.bq(),A.j(this).h("b3<x<1,2>>"))},
bq(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gL(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gF(),o=o.gq(o),n=A.j(s),m=n.y[1],n=n.h("x<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.m(0,l)
r=4
return a.b=new A.x(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iB:1}
A.a6.prototype={
gl(a){return this.b.length},
gaA(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
bl(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
m(a,b){if(!this.bl(b))return null
return this.b[this.a[b]]},
E(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaA()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gF(){return new A.bO(this.gaA(),this.$ti.h("bO<1>"))}}
A.bO.prototype={
gl(a){return this.a.length},
gt(a){return 0===this.a.length},
gB(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.bP(s,s.length,this.$ti.h("bP<1>"))}}
A.bP.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iv:1}
A.bG.prototype={}
A.dj.prototype={
I(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
if(p==null)return null
s=Object.create(null)
r=q.b
if(r!==-1)s.arguments=p[r+1]
r=q.c
if(r!==-1)s.argumentsExpr=p[r+1]
r=q.d
if(r!==-1)s.expr=p[r+1]
r=q.e
if(r!==-1)s.method=p[r+1]
r=q.f
if(r!==-1)s.receiver=p[r+1]
return s}}
A.bA.prototype={
j(a){return"Null check operator used on a null value"}}
A.cl.prototype={
j(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cF.prototype={
j(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.d4.prototype={
j(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.ah.prototype={
j(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.f8(r==null?"unknown":r)+"'"},
$iaq:1,
gbC(){return this},
$C:"$1",
$R:1,
$D:null}
A.c7.prototype={$C:"$0",$R:0}
A.c8.prototype={$C:"$2",$R:2}
A.cC.prototype={}
A.cB.prototype={
j(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.f8(s)+"'"}}
A.aM.prototype={
K(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aM))return!1
return this.$_target===b.$_target&&this.a===b.a},
gv(a){return(A.f4(this.a)^A.cx(this.$_target))>>>0},
j(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cy(this.a)+"'")}}
A.cA.prototype={
j(a){return"RuntimeError: "+this.a}}
A.a7.prototype={
gl(a){return this.a},
gt(a){return this.a===0},
gB(a){return this.a!==0},
gF(){return new A.a8(this,A.j(this).h("a8<1>"))},
gL(){return new A.at(this,A.j(this).h("at<1,2>"))},
a0(a,b){A.j(this).h("B<1,2>").a(b).E(0,new A.cX(this))},
m(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bt(b)},
bt(a){var s,r,q=this.d
if(q==null)return null
s=this.ba(q,a)
r=this.aK(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.j(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.ar(s==null?q.b=q.ae():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.ar(r==null?q.c=q.ae():r,b,c)}else q.bu(b,c)},
bu(a,b){var s,r,q,p,o=this,n=A.j(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ae()
r=o.aJ(a)
q=s[r]
if(q==null)s[r]=[o.a8(a,b)]
else{p=o.aK(q,a)
if(p>=0)q[p].b=b
else q.push(o.a8(a,b))}},
S(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aB()}},
E(a,b){var s,r,q=this
A.j(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.a1(q))
s=s.c}},
ar(a,b,c){var s,r=A.j(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.a8(b,c)
else s.b=c},
aB(){this.r=this.r+1&1073741823},
a8(a,b){var s=this,r=A.j(s),q=new A.d0(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aB()
return q},
aJ(a){return J.a4(a)&1073741823},
ba(a,b){return a[this.aJ(b)]},
aK(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.V(a[r].a,b))return r
return-1},
j(a){return A.dP(this)},
ae(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$iem:1}
A.cX.prototype={
$2(a,b){var s=this.a,r=A.j(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.j(this.a).h("~(1,2)")}}
A.d0.prototype={}
A.a8.prototype={
gl(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bp(s,s.r,s.e,this.$ti.h("bp<1>"))}}
A.bp.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a1(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iv:1}
A.br.prototype={
gl(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bq(s,s.r,s.e,this.$ti.h("bq<1>"))}}
A.bq.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a1(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iv:1}
A.at.prototype={
gl(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bo(s,s.r,s.e,this.$ti.h("bo<1,2>"))}}
A.bo.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a1(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.x(s.a,s.b,r.$ti.h("x<1,2>"))
r.c=s.c
return!0}},
$iv:1}
A.dB.prototype={
$1(a){return this.a(a)},
$S:1}
A.dC.prototype={
$2(a,b){return this.a(a,b)},
$S:5}
A.dD.prototype={
$1(a){return this.a(A.a3(a))},
$S:6}
A.a2.prototype={
j(a){return this.aE(!1)},
aE(a){var s,r,q,p,o,n=this.b8(),m=this.ad(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.c(m,q)
o=m[q]
l=a?l+A.es(o):l+A.q(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
b8(){var s,r=this.$s
while($.dr.length<=r)B.a.k($.dr,null)
s=$.dr[r]
if(s==null){s=this.b4()
B.a.i($.dr,r,s)}return s},
b4(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.dM(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.A(j,k)}}
A.aC.prototype={
ad(){return[this.a,this.b]},
K(a,b){if(b==null)return!1
return b instanceof A.aC&&this.$s===b.$s&&J.V(this.a,b.a)&&J.V(this.b,b.b)},
gv(a){return A.eq(this.$s,this.a,this.b,B.f)}}
A.b2.prototype={
ad(){return[this.a]},
K(a,b){if(b==null)return!1
return b instanceof A.b2&&this.$s===b.$s&&J.V(this.a,b.a)},
gv(a){return A.eq(this.$s,this.a,B.f,B.f)}}
A.aT.prototype={
gA(a){return B.ai},
$im:1}
A.bx.prototype={}
A.cn.prototype={
gA(a){return B.aj},
$im:1}
A.aU.prototype={
gl(a){return a.length},
$iP:1}
A.bv.prototype={$if:1,$ib:1,$ii:1}
A.bw.prototype={$if:1,$ib:1,$ii:1}
A.co.prototype={
gA(a){return B.ak},
$im:1}
A.cp.prototype={
gA(a){return B.al},
$im:1}
A.cq.prototype={
gA(a){return B.am},
$im:1}
A.cr.prototype={
gA(a){return B.an},
$im:1}
A.cs.prototype={
gA(a){return B.ao},
$im:1}
A.ct.prototype={
gA(a){return B.aq},
$im:1}
A.cu.prototype={
gA(a){return B.ar},
$im:1}
A.by.prototype={
gA(a){return B.as},
gl(a){return a.length},
$im:1}
A.cv.prototype={
gA(a){return B.at},
gl(a){return a.length},
$im:1}
A.bR.prototype={}
A.bS.prototype={}
A.bT.prototype={}
A.bU.prototype={}
A.X.prototype={
h(a){return A.c1(v.typeUniverse,this,a)},
u(a){return A.eK(v.typeUniverse,this,a)}}
A.cI.prototype={}
A.ds.prototype={
j(a){return A.Q(this.a,null)}}
A.cH.prototype={
j(a){return this.a}}
A.bY.prototype={}
A.bX.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bf(a,b){var s,r,q
a=A.Z(a)
b=b
s=this.a
for(;;)try{r=s(this,a,b)
return r}catch(q){b=q
a=1}},
n(){var s,r,q,p,o=this,n=null,m=0
for(;;){s=o.d
if(s!=null)try{if(s.n()){o.b=s.gp()
return!0}else o.d=null}catch(r){n=r
m=1
o.d=null}q=o.bf(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.eE
return!1}if(0>=p.length)return A.c(p,-1)
o.a=p.pop()
m=0
n=null
continue}if(2===q){m=0
n=null
continue}if(3===q){n=o.c
o.c=null
p=o.e
if(p==null||p.length===0){o.b=null
o.a=A.eE
throw n
return!1}if(0>=p.length)return A.c(p,-1)
o.a=p.pop()
m=1
continue}throw A.e(A.ew("sync*"))}return!1},
bE(a){var s,r,q=this
if(a instanceof A.b3){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.af(a)
return 2}},
$iv:1}
A.b3.prototype={
gq(a){return new A.bX(this.a(),this.$ti.h("bX<1>"))}}
A.bQ.prototype={
gq(a){var s=this,r=new A.aA(s,s.r,A.j(s).h("aA<1>"))
r.c=s.e
return r},
gl(a){return this.a},
gt(a){return this.a===0},
ai(a,b){var s=this.b5(b)
return s},
b5(a){var s=this.d
if(s==null)return!1
return this.az(s[this.aw(a)],a)>=0},
k(a,b){var s,r,q=this
A.j(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.au(s==null?q.b=A.dV():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.au(r==null?q.c=A.dV():r,b)}else return q.b_(b)},
b_(a){var s,r,q,p=this
A.j(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.dV()
r=p.aw(a)
q=s[r]
if(q==null)s[r]=[p.af(a)]
else{if(p.az(q,a)>=0)return!1
q.push(p.af(a))}return!0},
au(a,b){A.j(this).c.a(b)
if(t.c8.a(a[b])!=null)return!1
a[b]=this.af(b)
return!0},
af(a){var s=this,r=new A.cM(A.j(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
aw(a){return J.a4(a)&1073741823},
az(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.V(a[r].a,b))return r
return-1}}
A.cM.prototype={}
A.aA.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.a1(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$iv:1}
A.d1.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:7}
A.p.prototype={
gq(a){return new A.au(a,a.length,A.aG(a).h("au<p.E>"))},
H(a,b){if(!(b<a.length))return A.c(a,b)
return a[b]},
gt(a){return a.length===0},
gB(a){return a.length!==0},
k(a,b){var s
A.aG(a).h("p.E").a(b)
s=a.length
this.sl(a,s+1)
if(!(s<a.length))return A.c(a,s)
a[s]=b},
j(a){return A.dL(a,"[","]")}}
A.o.prototype={
G(a,b,c){var s=A.j(this)
return A.ep(this,s.h("o.K"),s.h("o.V"),b,c)},
E(a,b){var s,r,q,p=A.j(this)
p.h("~(o.K,o.V)").a(b)
for(s=this.gF(),s=s.gq(s),p=p.h("o.V");s.n();){r=s.gp()
q=this.m(0,r)
b.$2(r,q==null?p.a(q):q)}},
gL(){return this.gF().am(0,new A.d2(this),A.j(this).h("x<o.K,o.V>"))},
gl(a){var s=this.gF()
return s.gl(s)},
gt(a){var s=this.gF()
return s.gt(s)},
gB(a){var s=this.gF()
return s.gB(s)},
j(a){return A.dP(this)},
$iB:1}
A.d2.prototype={
$1(a){var s=this.a,r=A.j(s)
r.h("o.K").a(a)
s=s.m(0,a)
if(s==null)s=r.h("o.V").a(s)
return new A.x(a,s,r.h("x<o.K,o.V>"))},
$S(){return A.j(this.a).h("x<o.K,o.V>(o.K)")}}
A.d3.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.q(a)
r.a=(r.a+=s)+": "
s=A.q(b)
r.a+=s},
$S:2}
A.c2.prototype={}
A.aS.prototype={
G(a,b,c){return this.a.G(0,b,c)},
m(a,b){return this.a.m(0,b)},
E(a,b){this.a.E(0,A.j(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gB(a){var s=this.a
return s.gB(s)},
gl(a){var s=this.a
return s.gl(s)},
j(a){return this.a.j(0)},
gL(){return this.a.gL()},
$iB:1}
A.ay.prototype={
G(a,b,c){return new A.ay(this.a.G(0,b,c),b.h("@<0>").u(c).h("ay<1,2>"))}}
A.aX.prototype={
gt(a){return this.a===0},
a0(a,b){var s
for(s=J.af(A.j(this).h("b<1>").a(b));s.n();)this.k(0,s.gp())},
gX(a){var s,r,q=this
if(q.a>1)throw A.e(A.ei())
s=A.h4(q,q.r,A.j(q).c)
if(!s.n())throw A.e(A.ch())
r=s.d
return r==null?s.$ti.c.a(r):r},
j(a){return A.dL(this,"{","}")},
$if:1,
$ib:1}
A.bW.prototype={}
A.b4.prototype={}
A.cK.prototype={
m(a,b){var s,r=this.b
if(r==null)return this.c.m(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bd(b):s}},
gl(a){return this.b==null?this.c.a:this.Y().length},
gt(a){return this.gl(0)===0},
gB(a){return this.gl(0)>0},
gF(){if(this.b==null){var s=this.c
return new A.a8(s,A.j(s).h("a8<1>"))}return new A.cL(this)},
E(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.E(0,b)
s=o.Y()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dv(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.a1(o))}},
Y(){var s=t.M.a(this.c)
if(s==null)s=this.c=A.d(Object.keys(this.a),t.s)
return s},
bd(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dv(this.a[a])
return this.b[a]=s}}
A.cL.prototype={
gl(a){return this.a.gl(0)},
H(a,b){var s=this.a
if(s.b==null)s=s.gF().H(0,b)
else{s=s.Y()
if(!(b<s.length))return A.c(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gF()
s=s.gq(s)}else{s=s.Y()
s=new J.an(s,s.length,A.I(s).h("an<1>"))}return s}}
A.c9.prototype={}
A.cb.prototype={}
A.bn.prototype={
j(a){var s=A.cc(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cm.prototype={
j(a){return"Cyclic error in JSON stringify"}}
A.cY.prototype={
bm(a,b){var s=A.hQ(a,this.gbn().a)
return s},
bo(a,b){var s=A.h3(a,this.gbp().b,null)
return s},
gbp(){return B.Y},
gbn(){return B.X}}
A.d_.prototype={}
A.cZ.prototype={}
A.dp.prototype={
aT(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.i.T(a,r,q)
r=q+1
o=A.E(92)
s.a+=o
o=A.E(117)
s.a+=o
o=A.E(100)
s.a+=o
o=p>>>8&15
o=A.E(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.E(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.E(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.i.T(a,r,q)
r=q+1
o=A.E(92)
s.a+=o
switch(p){case 8:o=A.E(98)
s.a+=o
break
case 9:o=A.E(116)
s.a+=o
break
case 10:o=A.E(110)
s.a+=o
break
case 12:o=A.E(102)
s.a+=o
break
case 13:o=A.E(114)
s.a+=o
break
default:o=A.E(117)
s.a+=o
o=A.E(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.E(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.E(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.i.T(a,r,q)
r=q+1
o=A.E(92)
s.a+=o
o=A.E(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.i.T(a,r,m)},
a9(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.e(new A.cm(a,null))}B.a.k(s,a)},
a6(a){var s,r,q,p,o=this
if(o.aS(a))return
o.a9(a)
try{s=o.b.$1(a)
if(!o.aS(s)){q=A.el(a,null,o.gaC())
throw A.e(q)}q=o.a
if(0>=q.length)return A.c(q,-1)
q.pop()}catch(p){r=A.e6(p)
q=A.el(a,r,o.gaC())
throw A.e(q)}},
aS(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.U.j(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.aT(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.a9(a)
q.bA(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.a9(a)
r=q.bB(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return r}else return!1},
bA(a){var s,r=this.c
r.a+="["
if(J.fo(a)){if(0>=a.length)return A.c(a,0)
this.a6(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.a6(a[s])}}r.a+="]"},
bB(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gl(a)*2
r=A.fP(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.E(0,new A.dq(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.aT(A.a3(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.c(r,n)
m.a6(r[n])}p.a+="}"
return!0}}
A.dq.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:2}
A.dn.prototype={
gaC(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cG.prototype={
j(a){return this.P()},
$iaO:1}
A.t.prototype={}
A.c5.prototype={
j(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cc(s)
return"Assertion failed"}}
A.bJ.prototype={}
A.ag.prototype={
gac(){return"Invalid argument"+(!this.a?"(s)":"")},
gab(){return""},
j(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gac()+q+o
if(!s.a)return n
return n+s.gab()+": "+A.cc(s.gak())},
gak(){return this.b}}
A.aW.prototype={
gak(){return A.eO(this.b)},
gac(){return"RangeError"},
gab(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.q(q):""
else if(q==null)s=": Not greater than or equal to "+A.q(r)
else if(q>r)s=": Not in inclusive range "+A.q(r)+".."+A.q(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.q(r)
return s}}
A.cf.prototype={
gak(){return A.Z(this.b)},
gac(){return"RangeError"},
gab(){if(A.Z(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gl(a){return this.f}}
A.bK.prototype={
j(a){return"Unsupported operation: "+this.a}}
A.cE.prototype={
j(a){return"UnimplementedError: "+this.a}}
A.aY.prototype={
j(a){return"Bad state: "+this.a}}
A.ca.prototype={
j(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cc(s)+"."}}
A.bH.prototype={
j(a){return"Stack Overflow"},
$it:1}
A.dl.prototype={
j(a){return"Exception: "+this.a}}
A.cV.prototype={
j(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.b.prototype={
am(a,b,c){var s=A.j(this)
return A.fR(this,s.u(c).h("1(b.E)").a(b),s.h("b.E"),c)},
gl(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gB(a){return!this.gt(this)},
H(a,b){var s,r
A.dR(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.e(A.dK(b,b-r,this,"index"))},
j(a){return A.fI(this,"(",")")}}
A.x.prototype={
j(a){return"MapEntry("+A.q(this.a)+": "+A.q(this.b)+")"}}
A.bz.prototype={
gv(a){return A.l.prototype.gv.call(this,0)},
j(a){return"null"}}
A.l.prototype={$il:1,
K(a,b){return this===b},
gv(a){return A.cx(this)},
j(a){return"Instance of '"+A.cy(this)+"'"},
gA(a){return A.i4(this)},
toString(){return this.j(this)}}
A.aZ.prototype={
gl(a){return this.a.length},
j(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ifU:1}
A.cJ.prototype={
a4(a){if(a<=0||a>4294967296)throw A.e(A.et(u.c+a))
return Math.random()*a>>>0},
J(){return Math.random()},
$idQ:1}
A.cN.prototype={
aY(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
do{s=a>>>0
a=B.d.O(a-s,k)
r=a>>>0
a=B.d.O(a-r,k)
q=(~s>>>0)+(s<<21>>>0)
p=q>>>0
r=(~r>>>0)+((r<<21|s>>>11)>>>0)+B.d.O(q-p,k)>>>0
q=((p^(p>>>24|r<<8))>>>0)*265
s=q>>>0
r=((r^r>>>24)>>>0)*265+B.d.O(q-s,k)>>>0
q=((s^(s>>>14|r<<18))>>>0)*21
s=q>>>0
r=((r^r>>>14)>>>0)*21+B.d.O(q-s,k)>>>0
s=(s^(s>>>28|r<<4))>>>0
r=(r^r>>>28)>>>0
q=(s<<31>>>0)+s
p=q>>>0
o=B.d.O(q-p,k)
q=l.a*1037
n=l.a=q>>>0
m=l.b*1037+B.d.O(q-n,k)>>>0
l.b=m
n=(n^p)>>>0
l.a=n
o=(m^r+((r<<31|s>>>1)>>>0)+o>>>0)>>>0
l.b=o}while(a!==j)
if(o===0&&n===0)l.a=23063
l.N()
l.N()
l.N()
l.N()},
N(){var s=this,r=s.a,q=4294901760*r,p=q>>>0,o=55905*r,n=o>>>0,m=n+p+s.b
r=m>>>0
s.a=r
s.b=B.d.O(o-n+(q-p)+(m-r),4294967296)>>>0},
a4(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.e(A.et(u.c+a))
s=a-1
if((a&s)>>>0===0){p.N()
return(p.a&s)>>>0}do{p.N()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
J(){var s,r=this
r.N()
s=r.a
r.N()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$idQ:1}
A.a0.prototype={
P(){return"AiLevel."+this.b}}
A.cD.prototype={
aH(a){var s,r,q=this,p=a.a,o=a.b,n=p.aN(o)
if(n.length===0)throw A.e(A.ew("no legal action for "+o))
if(p.CW){p=t.db
s=new A.ab(new A.bM(n,p),p.h("u(b.E)").a(new A.dc()),p.h("ab<b.E>"))
return s.H(0,q.b.a4(s.gl(0)))}r=p.r
A:{if(B.e===r){p=q.b6(a)
break A}if(B.l===r){p=q.b0(a,n)
break A}p=q.bb(a,n)
break A}return p},
gZ(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
b6(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.j){s=a.b
return l.b.J()<0.6?new A.D(s):new A.K(s)}r=l.a5(a,l.gZ())
s=a.a
q=s.a
p=q.f
o=B.a.gV(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.m(0,m)
m.toString
if(m+o>=q.r)return new A.D(n)
return r>(p-o)/(2*p)+l.U(0.08)?new A.D(n):new A.K(n)},
b0(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.a1(t.U.a(b),new A.d9()),g=i.a
if(g===B.j){s=i.b.J()
if(h&&s<0.05)return new A.F(a.b)
g=a.b
return s<0.65?new A.D(g):new A.K(g)}r=a.a
q=r.ay
q.toString
p=r.a
o=p.d
n=r.at
if(!(n<5))return A.c(o,n)
m=o[n]
q=q.b
if(!(q<5))return A.c(o,q)
l=o[q]
q=i.a5(a,i.gZ())
g=g===B.k
k=q-(g?0:0.08)
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.m(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.F(q):new A.D(q)
if(h&&k>0.78+i.U(0.05))return new A.F(q)
j=g&&i.b.J()<0.06
return(2*k-1)*l>-m+i.U(0.3)||j?new A.D(q):new A.K(q)},
bb(a,b){t.U.a(b)
if(B.a.a1(b,new A.da())&&this.bj(a))return new A.F(a.b)
return this.b3(a,b)},
bj(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.m(0,q)
q.toString
if(q+p.gaj()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.J()<0.08
case 1:return r.a5(a,r.gZ())>0.72+r.U(0.06)||r.b.J()<0.03
case 2:s=r.a5(a,r.gZ())
if(s>0.62+r.U(0.03))return!0
return A.A(p.z,t.F).length!==0&&s<0.3&&r.b.J()<0.04}},
U(a){return(this.b.J()*2-1)*a},
b3(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.gW()
r=f.a
if(r===B.j&&f.b.J()<0.55){r=s.length
q=f.b.a4(r)
if(!(q>=0&&q<r))return A.c(s,q)
return new A.C(s[q],!1,a.b)}r=r===B.k
if(r&&s.length>1)p=f.b1(a)
else{q=A.d([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.D(s[l],n.y))
k=A.d([],t.w)
for(j=A.A(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.D(h.b,n.y)
k.push(new A.ad(h.a,g))}m=A.d([],t.v)
for(n=A.A(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.e2(q,k,m,a.b)
if(!(q>=0&&q<o))return A.c(s,q)
p=s[q]}if(r&&a.a.gah()&&!f.bk(a,p)&&f.b.J()<0.5)return new A.C(p,!0,a.b)
return new A.C(p,!1,a.b)},
bk(a,b){var s=a.a,r=s.a.D(b,s.y)
return B.a.br(A.A(s.Q,t.n),new A.db(a,r))},
b1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.gW(),d=A.d([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.D(e[p],r.y))
o=A.d([],t.w)
for(n=A.A(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.D(l.b,r.y)
o.push(new A.ad(l.a,k))}q=A.d([],t.v)
for(r=A.A(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.e2(d,o,q,a.b)
if(!(d>=0&&d<s))return A.c(e,d)
j=e[d]
i=this.ao(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.K(0,j))continue
f=this.ao(a,g,160)
if(f>i){i=f
h=g}}return h},
ao(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbw()
r=A.d([],t.Y)
for(q=$.e8(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.ai(0,n))r.push(n)}q=b8.b
m=B.d.C(q+2,4)
l=b8.gan()
if(this.a===B.k){p=b8.a
k=p.ay
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ax
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.ap(r,b)
a5.a=0
a6=A.fQ(4,new A.dd(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.C(a0,4),B.d.C(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.c(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.d([],c)
b3=A.aR(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.D(b4.b,p.y)
a8.push(new A.ad(b4.a,b5))}b0=p.as
b1=A.d([],f)
b3=A.aR(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.ij(a8,j?null:new A.ad(q,k.D(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
a5(a,b){return this.ao(a,null,b)}}
A.dc.prototype={
$1(a){return!t.D.a(a).c},
$S:8}
A.d9.prototype={
$1(a){return t.I.a(a) instanceof A.F},
$S:0}
A.da.prototype={
$1(a){return t.I.a(a) instanceof A.F},
$S:0}
A.db.prototype={
$1(a){return this.a.a.aq(t.n.a(a))<this.b},
$S:3}
A.dd.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.d([],t.t)
for(r=i.gW(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.D(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.o:s}else n=B.o
i=i.a
s=i.w
if(!(a<s.length))return A.c(s,a)
m=A.A(s[a],t.L).length-n.length
s=A.d([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.J)(n),++o)s.push(q.D(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.c(r,k)
s.push(q.D(r[k],i.y))}p.a+=m
return s},
$S:9}
A.dH.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:10}
A.dI.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:11}
A.dA.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o<s[q])q=p}return q},
$S:4}
A.dz.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o>s[q])q=p}return q},
$S:4}
A.Y.prototype={
P(){return"Suit."+this.b}}
A.G.prototype={
P(){return"Rank."+this.b}}
A.O.prototype={
ga2(){var s=this.b.b
if(0>=s.length)return A.c(s,0)
return this.a.c+s[0]},
K(a,b){if(b==null)return!1
return b instanceof A.O&&b.a===this.a&&b.b===this.b},
gv(a){return this.a.a*4+this.b.a},
j(a){return this.ga2()}}
A.cR.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.i.T(s,0,s.length-1)},
$S:12}
A.cS.prototype={
$1(a){var s,r,q,p=t.bc.a(a).b
if(0>=p.length)return A.c(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.c(s,q)
return p===s[q]},
$S:13}
A.ce.prototype={
aX(a,b,c,d,e,f){var s,r,q,p,o,n=this,m=A.fX(n.c,n.a,n.b)
n.r!==$&&A.il()
n.r=m
for(s=c.length,r=n.e,q=t.G,p=0;p<c.length;c.length===s||(0,A.J)(c),++p){o=q.a(c[p])
if(J.V(o.m(0,"t"),"next"))m.a7()
else m.R(A.eY(o))
B.a.k(r,o)}m=m.d
n.w.R(m)
n.x=m.length},
bv(a){var s
A.Z(a)
s=this.d
if(!(a>=0&&a<s.length))return A.c(s,a)
return s[a]==null},
gbs(){var s,r,q,p=A.d([],t.t)
for(s=this.d,r=s.length,q=0;q<4;++q){if(!(q<r))return A.c(s,q)
if(s[q]==null)p.push(q)}return p},
ag(a,b){var s,r=this,q=r.d
if(!(a>=0&&a<q.length))return A.c(q,a)
if(q[a]!=null||b.a!==a)throw A.e(A.bg("seat "+a+" is not a person"))
q=r.r
q===$&&A.aK()
q.R(b)
B.a.k(r.e,A.eZ(b))
s=A.T(t.S,t.Q)
r.a_(s,0)
r.av(s)
return s},
gaR(){var s,r,q,p,o,n=this,m=n.r
m===$&&A.aK()
s=m.r
switch(s.a){case 1:m=m.as
s=n.d
if(!(m>=0&&m<s.length))return A.c(s,m)
if(!(s[m]==null))m=null
return m
case 2:case 0:if(s===B.e){s=m.ch
s.toString
r=s}else r=((m.ay.a&1)===0?B.b:B.c)===B.b?B.c:B.b
q=m.gaP()
if(q!=null){m=n.d
if(q>>>0!==q||q>=m.length)return A.c(m,q)
m=m[q]==null}else m=!1
if(m)return q
for(m=n.d,s=m.length,p=0;p<4;++p){if(((p&1)===0?B.b:B.c)===r){if(!(p<s))return A.c(m,p)
o=m[p]==null}else o=!1
if(o)return p}return null
case 3:case 4:return null}},
av(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
t.p.a(a)
for(s=h.e,r=h.d,q=r.length,p=h.f,o=h.w;;){n=h.r
n===$&&A.aK()
m=n.r
if(m===B.y)return
if(m===B.m){n.a7()
B.a.k(s,B.a6)
h.a_(a,2200)
continue}l=h.b2()
if(l==null)return
k=o.e?1400:850
if(l>>>0!==l||l>=q)return A.c(r,l)
j=r[l]
j.toString
i=new A.cD(j,p).aH(new A.bB(n,l))
n.R(i)
B.a.k(s,A.eZ(i))
h.a_(a,k)}},
b2(){var s,r,q,p=this.r
p===$&&A.aK()
s=p.r
switch(s.a){case 1:p=p.as
s=this.d
if(!(p>=0&&p<s.length))return A.c(s,p)
if(s[p]==null)p=null
return p
case 2:case 0:if(s===B.e){s=p.ch
s.toString
r=s}else r=((p.ay.a&1)===0?B.b:B.c)===B.b?B.c:B.b
s=A.d([],t.t)
for(q=0;q<4;++q)if(((q&1)===0?B.b:B.c)===r)s.push(q)
if(B.a.a1(s,this.gaL()))return null
return p.gaP()
case 3:case 4:return null}},
a_(a,b){var s,r,q,p,o,n,m,l,k,j=this
t.p.a(a)
s=j.w
r=j.r
r===$&&A.aK()
q=r.d
s.R(A.fV(q,j.x,null,A.I(q).c))
j.x=r.d.length
for(q=j.gbs(),p=q.length,o=j.gaL(),n=t.bw,m=0;m<q.length;q.length===p||(0,A.J)(q),++m){l=q[m]
k=a.m(0,l)
if(k==null){k=A.d([],n)
a.i(0,l,k)}J.e9(k,A.fW(r,l,b,o,s))}}}
A.av.prototype={
P(){return"ManilhaMode."+this.b}}
A.di.prototype={
M(){var s=this
return A.bs(["manilhas",s.c.b,"coberta",s.w,"ferro",s.x,"verNoTruco",s.y,"verNaMaoDeOnze",s.z,"terceiraCarta",s.Q],t.N,t.X)},
D(a,b){var s
switch(this.c.a){case 0:if(b!=null&&a.a===B.p[(b.a.a+1)%10])return 10+a.b.a
break
case 1:s=B.a.a3(B.a4,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.aV.prototype={
M(){var s,r=A.T(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.ga2())
if(this.c)r.i(0,"x",!0)
return r}}
A.cz.prototype={
M(){var s,r,q,p=A.T(t.N,t.X),o=A.d([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.J)(s),++q)o.push(s[q].M())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.b_.prototype={
M(){var s,r,q,p,o,n,m,l=this,k=t.N,j=A.T(k,t.X)
j.i(0,"me",l.a)
j.i(0,"rules",l.b.M())
j.i(0,"phase",l.c.b)
j.i(0,"turn",l.d)
j.i(0,"dealer",l.e)
j.i(0,"foot",l.f)
j.i(0,"hand#",l.r)
s=l.w
if(s!=null)j.i(0,"vira",s.ga2())
j.i(0,"value",l.x)
j.i(0,"level",l.y)
s=l.z
if(s!=null)j.i(0,"pending",A.d([s.a,s.b],t.t))
s=l.Q
if(s!=null)j.i(0,"decision",s.b)
if(l.as)j.i(0,"iron",!0)
s=l.at
j.i(0,"scores",A.d([s.m(0,B.b),s.m(0,B.c)],t.a))
s=t.d
r=A.d([],s)
for(q=l.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.J)(q),++o)r.push(q[o].M())
j.i(0,"rounds",r)
s=A.d([],s)
for(r=l.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.J)(r),++o)s.push(r[o].M())
j.i(0,"plays",s)
s=t.s
r=A.d([],s)
for(q=l.ch,p=q.length,o=0;o<p;++o){n=q[o]
m=n.b.b
if(0>=m.length)return A.c(m,0)
r.push(n.a.c+m[0])}j.i(0,"hand",r)
j.i(0,"counts",l.CW)
r=l.cx
if(r!=null){s=A.d([],s)
for(q=r.length,o=0;o<r.length;r.length===q||(0,A.J)(r),++o){n=r[o]
p=n.b.b
if(0>=p.length)return A.c(p,0)
s.push(n.a.c+p[0])}j.i(0,"partner",s)}if(l.cy)j.i(0,"partnerRaise",!0)
if(l.db)j.i(0,"canCover",!0)
if(l.dx)j.i(0,"canRaise",!0)
if(l.dy)j.i(0,"mustAnswer",!0)
if(l.fr)j.i(0,"myTurn",!0)
s=l.fx
if(s!=null)j.i(0,"winner",s.b)
s=l.fy
if(s.gB(s)){k=A.T(k,k)
for(s=s.gL(),s=s.gq(s);s.n();){r=s.gp()
k.i(0,""+r.a,r.b)}j.i(0,"speech",k)}k=l.go
if(k!=null)j.i(0,"toast",k)
if(l.id)j.i(0,"showLast",!0)
k=l.k1
if(k>0)j.i(0,"delay",k)
return j}}
A.d8.prototype={
$1(a){var s=a.a,r=a.c
return new A.aV(s,r&&s!==this.a?null:a.b,r)},
$S:15}
A.d7.prototype={
R(a){var s,r,q,p,o,n=this
t.x.a(a)
n.e=!1
for(s=J.af(a),r=n.r,q=n.a;s.n();){p=s.gp()
if(p instanceof A.bh){q.S(0)
n.b=null
n.d=!1
n.c=p.e
continue}if(p instanceof A.b9){n.c=n.e=n.d=!1
continue}if(p instanceof A.bD){q.i(0,p.a,p.c+"!")
continue}if(p instanceof A.bC){q.i(0,p.a,"Cai dentro!")
continue}if(p instanceof A.be){q.i(0,p.a,"Corro.")
continue}if(p instanceof A.aN){o=p.a
q.i(0,o,p.b?"Vamos jogar!":"Corro.")
continue}if(p instanceof A.bE){n.e=n.d=!0
continue}if(p instanceof A.ar){o=p.a
n.b=new A.bV(p.b,o)
continue}if(p instanceof A.bf){p=p.a
o=r.m(0,p)
o.toString
r.i(0,p,o+1)}}},
by(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Empatou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.ai.prototype={
P(){return"GamePhase."+this.b}}
A.S.prototype={}
A.C.prototype={
j(a){var s=this.b.j(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.F.prototype={
j(a){return"Raise("+this.a+")"}}
A.D.prototype={
j(a){return"Accept("+this.a+")"}}
A.K.prototype={
j(a){return"Fold("+this.a+")"}}
A.L.prototype={}
A.bh.prototype={}
A.aN.prototype={}
A.b9.prototype={}
A.bD.prototype={}
A.bC.prototype={}
A.be.prototype={}
A.bE.prototype={}
A.ar.prototype={}
A.bf.prototype={}
A.W.prototype={}
A.bF.prototype={}
A.d5.prototype={}
A.cd.prototype={
j(a){return"GameRuleError: "+this.a}}
A.de.prototype={
gaj(){var s,r,q=this
if(q.ch!=null)return q.a.f
s=q.a.d
r=q.at
if(!(r<5))return A.c(s,r)
return s[r]},
gaP(){var s,r,q=this
switch(q.r.a){case 2:return B.d.C(q.ay.a+1,4)
case 0:s=q.ch
s.toString
r=B.d.C(q.e+1,4)
return((r&1)===0?B.b:B.c)===s?r:B.d.C(r+1,4)
default:return null}},
aq(a){return a.c?-1:this.a.D(a.b,this.y)},
a7(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.m)throw A.e(A.bg("hand still in progress"));++j.f
j.e=B.d.C(j.e+1,4)
s=t.L
r=A.bt($.e8(),s)
B.a.ap(r,j.b)
q=t.E
p=A.d([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.aV(r,n,n+3))}j.w=p
q=A.d([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.J)(p),++m){l=A.aR(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.q){if(12>=r.length)return A.c(r,12)
r=r[12]}else r=null
j.y=r
B.a.S(j.z)
B.a.S(j.Q)
m=j.at=0
j.ay=j.ax=null
j.as=B.d.C(j.e+1,4)
r=A.d([],t._)
for(q=j.c,p=s.e;m<2;++m){k=B.a0[m]
if(q.m(0,k)===p)r.push(k)}q=r.length
p=q===2
j.cx=p
j.CW=p&&s.x
s=q===1?B.a.gX(r):null
j.ch=s
j.r=s!=null?B.e:B.h
B.a.k(j.d,new A.bh(j.CW))},
aN(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.ch)return B.n
return A.d([new A.D(a),new A.K(a)],t.u)
case 2:if(n===((o.ay.a&1)===0?B.b:B.c))return B.n
s=A.d([new A.D(a),new A.K(a)],t.u)
if(o.ay.b+1<5)s.push(new A.F(a))
return s
case 1:if(a!==o.as)return B.n
s=A.d([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.J)(r),++p)s.push(new A.C(r[p],!1,a))
if(o.gah()){r=o.w
if(!(a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.J)(r),++p)s.push(new A.C(r[p],!0,a))}if(o.aF(a))s.push(new A.F(a))
return s
case 3:case 4:return B.n}},
gah(){return this.a.w&&!this.CW&&this.z.length!==0},
aF(a){var s=this,r=!1
if(s.r===B.h)if(a===s.as)if(s.ch==null)if(!s.cx){r=s.ax
r=r!==((a&1)===0?B.b:B.c)&&s.at+1<5}return r},
R(a){var s,r,q,p,o=this,n=a.a
if(!B.a.a1(o.aN(n),new A.dh(a)))throw A.e(A.bg("illegal "+a.j(0)+" in "+o.r.j(0)))
A:{if(a instanceof A.C){o.bc(a)
break A}if(a instanceof A.F){s=o.ay
r=s==null
q=r?null:s.b
if(q==null)q=o.at
if(!r){o.at=s.b
o.ax=(s.a&1)===0?B.b:B.c}p=q+1
o.ay=new A.d5(n,p)
o.r=B.l
if(!(p<5))return A.c(o.a.d,p)
B.a.k(o.d,new A.bD(n,B.a1[p-1]))
break A}if(a instanceof A.D){o.aZ(n)
break A}if(a instanceof A.K)o.b9(n)}},
aZ(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.aN(a,!0))
q.r=B.h
return}s=q.ay
r=s.b
q.at=r
q.ax=(s.a&1)===0?B.b:B.c
q.ay=null
q.r=B.h
if(!(r<5))return A.c(q.a.d,r)
B.a.k(q.d,new A.bC(a))},
b9(a){var s,r,q,p=this
if(p.r===B.e){B.a.k(p.d,new A.aN(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
p.aa(s,B.a.gV(p.a.d))
return}B.a.k(p.d,new A.be(a))
s=(p.ay.a&1)===0?B.b:B.c
r=p.a.d
q=p.at
if(!(q<5))return A.c(r,q)
p.aa(s,r[q])},
bc(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.c(s,r)
q=a.b
B.a.bx(s[r],q)
s=f.Q
B.a.k(s,new A.W(r,q,a.c))
q=f.d
B.a.k(q,new A.b9())
r=s.length
if(r<4){f.as=B.d.C(f.as+1,4)
return}p=e.a=-2
for(o=f.a,n=0;n<s.length;s.length===r||(0,A.J)(s),++n,p=k){m=s[n]
l=m.c?-1:o.D(m.b,f.y)
k=Math.max(p,l)
e.a=k}r=A.I(s)
p=r.h("ab<1>")
j=A.bt(new A.ab(s,r.h("u(1)").a(new A.df(e,f)),p),p.h("b.E"))
r=A.I(j)
i=new A.a9(j,r.h("H(1)").a(new A.dg()),r.h("a9<1,H>")).aQ(0)
h=i.a===1?i.gX(0):null
r=A.A(s,t.n)
p=B.a.gV(j).a
o=f.z
B.a.k(o,new A.bF(r,h,p))
B.a.S(s)
B.a.k(q,new A.bE())
g=A.i6(o)
if(g!=null)f.aa(g.a,f.gaj())
else f.as=p},
aa(a,b){var s,r,q,p,o=this
o.ay=null
s=o.d
r=a==null
B.a.k(s,new A.ar(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.m(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.m(0,a)
r.toString
if(r>=q){o.cy=a
o.r=B.y
B.a.k(s,new A.bf(a))
return}}o.r=B.m}}
A.dh.prototype={
$1(a){return A.fY(t.I.a(a),this.a)},
$S:0}
A.df.prototype={
$1(a){return this.b.aq(t.n.a(a))===this.a.a},
$S:3}
A.dg.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:16}
A.bB.prototype={
gW(){var s,r=this.a
if(r.CW)r=B.o
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.c(r,s)
s=A.A(r[s],t.L)
r=s}return r},
gan(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cx)return null
s=l.ch
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gaO()
else q=!0
s=B.d.C(r+2,4)
p=l.w
if(!(s<p.length))return A.c(p,s)
o=t.L
n=A.A(p[s],o)
if(q)return n
if(k.Q&&l.e===r){r=l.x
if(!(s<r.length))return A.c(r,s)
o=A.A(r[s],o)
if(2>=o.length)return A.c(o,2)
m=o[2]
if(B.a.ai(n,m))return A.d([m],t.Y)}return null},
gaO(){var s=this.a,r=!1
if(s.a.y)if(!s.cx)if(s.r===B.l){s=(s.ay.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbw(){var s,r,q,p,o,n,m=A.fO(this.gW(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gan()
if(k!=null)m.a0(0,k)
for(k=A.A(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.A(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.H.prototype={
P(){return"Team."+this.b}}
A.dF.prototype={
$1(a){return A.ii(A.a3(a))},
$S:17};(function aliases(){var s=J.ak.prototype
s.aW=s.j})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_1,q=hunkHelpers._instance_1u
s(J,"hD","ek",18)
r(A,"i_","hu",1)
q(A.ce.prototype,"gaL","bv",14)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.l,null)
q(A.l,[A.dN,J.cg,A.bG,J.an,A.b,A.ba,A.o,A.ah,A.t,A.d6,A.au,A.bu,A.bL,A.az,A.r,A.a2,A.aS,A.bb,A.bP,A.dj,A.d4,A.d0,A.bp,A.bq,A.bo,A.X,A.cI,A.ds,A.bX,A.aX,A.cM,A.aA,A.p,A.c2,A.c9,A.cb,A.dp,A.cG,A.bH,A.dl,A.cV,A.x,A.bz,A.aZ,A.cJ,A.cN,A.cD,A.O,A.ce,A.di,A.aV,A.cz,A.b_,A.d7,A.S,A.L,A.W,A.bF,A.d5,A.cd,A.de,A.bB])
q(J.cg,[J.cj,J.bj,J.bl,J.bk,J.bm,J.aP,J.as])
q(J.bl,[J.ak,J.h,A.aT,A.bx])
q(J.ak,[J.cw,J.b0,J.aj])
r(J.ci,A.bG)
r(J.cW,J.h)
q(J.aP,[J.bi,J.ck])
q(A.b,[A.b1,A.f,A.aw,A.ab,A.bM,A.bO,A.b3])
r(A.ao,A.b1)
r(A.bN,A.ao)
q(A.o,[A.ap,A.a7,A.cK])
q(A.ah,[A.c8,A.cT,A.c7,A.cC,A.dB,A.dD,A.d2,A.dc,A.d9,A.da,A.db,A.dd,A.dH,A.dI,A.cR,A.cS,A.d8,A.dh,A.df,A.dg,A.dF])
q(A.c8,[A.cU,A.cX,A.dC,A.d1,A.d3,A.dq])
q(A.t,[A.aQ,A.bJ,A.cl,A.cF,A.cA,A.cH,A.bn,A.c5,A.ag,A.bK,A.cE,A.aY,A.ca])
q(A.f,[A.M,A.a8,A.br,A.at])
q(A.M,[A.bI,A.a9,A.cL])
r(A.bd,A.aw)
q(A.a2,[A.b2,A.aC])
r(A.ac,A.b2)
q(A.aC,[A.ad,A.bV])
r(A.b4,A.aS)
r(A.ay,A.b4)
r(A.bc,A.ay)
r(A.a6,A.bb)
r(A.bA,A.bJ)
q(A.cC,[A.cB,A.aM])
q(A.bx,[A.cn,A.aU])
q(A.aU,[A.bR,A.bT])
r(A.bS,A.bR)
r(A.bv,A.bS)
r(A.bU,A.bT)
r(A.bw,A.bU)
q(A.bv,[A.co,A.cp])
q(A.bw,[A.cq,A.cr,A.cs,A.ct,A.cu,A.by,A.cv])
r(A.bY,A.cH)
r(A.bW,A.aX)
r(A.bQ,A.bW)
r(A.cm,A.bn)
r(A.cY,A.c9)
q(A.cb,[A.d_,A.cZ])
r(A.dn,A.dp)
q(A.ag,[A.aW,A.cf])
q(A.cG,[A.a0,A.Y,A.G,A.av,A.ai,A.H])
q(A.c7,[A.dA,A.dz])
q(A.S,[A.C,A.F,A.D,A.K])
q(A.L,[A.bh,A.aN,A.b9,A.bD,A.bC,A.be,A.bE,A.ar,A.bf])
s(A.bR,A.p)
s(A.bS,A.r)
s(A.bT,A.p)
s(A.bU,A.r)
s(A.b4,A.c2)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",k:"double",N:"num",n:"String",u:"bool",bz:"Null",i:"List",l:"Object",B:"Map",w:"JSObject"},mangledNames:{},types:["u(S)","@(@)","~(l?,l?)","u(W)","a()","@(@,n)","@(n)","~(@,@)","u(C)","i<a>(a)","u(+(a,a))","H(+(a,a))","u(G)","u(Y)","u(a)","aV(W)","H(W)","n(n)","a(@,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ac&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ad&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.bV&&a.b(c.a)&&b.b(c.b)}}
A.hj(v.typeUniverse,JSON.parse('{"aj":"ak","cw":"ak","b0":"ak","is":"aT","cj":{"u":[],"m":[]},"bj":{"m":[]},"bl":{"w":[]},"ak":{"w":[]},"h":{"i":["1"],"f":["1"],"w":[],"b":["1"]},"ci":{"bG":[]},"cW":{"h":["1"],"i":["1"],"f":["1"],"w":[],"b":["1"]},"an":{"v":["1"]},"aP":{"k":[],"N":[],"a5":["N"]},"bi":{"k":[],"a":[],"N":[],"a5":["N"],"m":[]},"ck":{"k":[],"N":[],"a5":["N"],"m":[]},"as":{"n":[],"a5":["n"],"m":[]},"b1":{"b":["2"]},"ba":{"v":["2"]},"ao":{"b1":["1","2"],"b":["2"],"b.E":"2"},"bN":{"ao":["1","2"],"b1":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"ap":{"o":["3","4"],"B":["3","4"],"o.K":"3","o.V":"4"},"aQ":{"t":[]},"f":{"b":["1"]},"M":{"f":["1"],"b":["1"]},"bI":{"M":["1"],"f":["1"],"b":["1"],"M.E":"1","b.E":"1"},"au":{"v":["1"]},"aw":{"b":["2"],"b.E":"2"},"bd":{"aw":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"bu":{"v":["2"]},"a9":{"M":["2"],"f":["2"],"b":["2"],"M.E":"2","b.E":"2"},"ab":{"b":["1"],"b.E":"1"},"bL":{"v":["1"]},"bM":{"b":["1"],"b.E":"1"},"az":{"v":["1"]},"ac":{"b2":[],"a2":[]},"ad":{"aC":[],"a2":[]},"bV":{"aC":[],"a2":[]},"bc":{"ay":["1","2"],"b4":["1","2"],"aS":["1","2"],"c2":["1","2"],"B":["1","2"]},"bb":{"B":["1","2"]},"a6":{"bb":["1","2"],"B":["1","2"]},"bO":{"b":["1"],"b.E":"1"},"bP":{"v":["1"]},"bA":{"t":[]},"cl":{"t":[]},"cF":{"t":[]},"ah":{"aq":[]},"c7":{"aq":[]},"c8":{"aq":[]},"cC":{"aq":[]},"cB":{"aq":[]},"aM":{"aq":[]},"cA":{"t":[]},"a7":{"o":["1","2"],"em":["1","2"],"B":["1","2"],"o.K":"1","o.V":"2"},"a8":{"f":["1"],"b":["1"],"b.E":"1"},"bp":{"v":["1"]},"br":{"f":["1"],"b":["1"],"b.E":"1"},"bq":{"v":["1"]},"at":{"f":["x<1,2>"],"b":["x<1,2>"],"b.E":"x<1,2>"},"bo":{"v":["x<1,2>"]},"aC":{"a2":[]},"b2":{"a2":[]},"aT":{"w":[],"m":[]},"bx":{"w":[]},"cn":{"w":[],"m":[]},"aU":{"P":["1"],"w":[]},"bv":{"p":["k"],"i":["k"],"P":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"]},"bw":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"]},"co":{"p":["k"],"i":["k"],"P":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"],"m":[],"p.E":"k","r.E":"k"},"cp":{"p":["k"],"i":["k"],"P":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"],"m":[],"p.E":"k","r.E":"k"},"cq":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"cr":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"cs":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"ct":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"cu":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"by":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"cv":{"p":["a"],"i":["a"],"P":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"m":[],"p.E":"a","r.E":"a"},"cH":{"t":[]},"bY":{"t":[]},"bX":{"v":["1"]},"b3":{"b":["1"],"b.E":"1"},"bQ":{"aX":["1"],"f":["1"],"b":["1"]},"aA":{"v":["1"]},"o":{"B":["1","2"]},"aS":{"B":["1","2"]},"ay":{"b4":["1","2"],"aS":["1","2"],"c2":["1","2"],"B":["1","2"]},"aX":{"f":["1"],"b":["1"]},"bW":{"aX":["1"],"f":["1"],"b":["1"]},"cK":{"o":["n","@"],"B":["n","@"],"o.K":"n","o.V":"@"},"cL":{"M":["n"],"f":["n"],"b":["n"],"M.E":"n","b.E":"n"},"bn":{"t":[]},"cm":{"t":[]},"k":{"N":[],"a5":["N"]},"a":{"N":[],"a5":["N"]},"i":{"f":["1"],"b":["1"]},"N":{"a5":["N"]},"n":{"a5":["n"]},"cG":{"aO":[]},"c5":{"t":[]},"bJ":{"t":[]},"ag":{"t":[]},"aW":{"t":[]},"cf":{"t":[]},"bK":{"t":[]},"cE":{"t":[]},"aY":{"t":[]},"ca":{"t":[]},"bH":{"t":[]},"aZ":{"fU":[]},"cJ":{"dQ":[]},"cN":{"dQ":[]},"a0":{"aO":[]},"Y":{"aO":[]},"G":{"aO":[]},"av":{"aO":[]},"C":{"S":[]},"ar":{"L":[]},"ai":{"aO":[]},"F":{"S":[]},"D":{"S":[]},"K":{"S":[]},"bh":{"L":[]},"aN":{"L":[]},"b9":{"L":[]},"bD":{"L":[]},"bC":{"L":[]},"be":{"L":[]},"bE":{"L":[]},"bf":{"L":[]},"H":{"aO":[]},"fH":{"i":["a"],"f":["a"],"b":["a"]},"h1":{"i":["a"],"f":["a"],"b":["a"]},"h0":{"i":["a"],"f":["a"],"b":["a"]},"fF":{"i":["a"],"f":["a"],"b":["a"]},"fZ":{"i":["a"],"f":["a"],"b":["a"]},"fG":{"i":["a"],"f":["a"],"b":["a"]},"h_":{"i":["a"],"f":["a"],"b":["a"]},"fD":{"i":["k"],"f":["k"],"b":["k"]},"fE":{"i":["k"],"f":["k"],"b":["k"]}}'))
A.hi(v.typeUniverse,JSON.parse('{"aU":1,"bW":1,"c9":2,"cb":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.ae
return{l:s("D"),h:s("a0"),L:s("O"),V:s("a5<@>"),O:s("f<@>"),C:s("t"),c:s("K"),Z:s("aq"),I:s("S"),e:s("ar"),x:s("b<L>"),k:s("b<@>"),Y:s("h<O>"),u:s("h<S>"),q:s("h<L>"),E:s("h<i<O>>"),J:s("h<B<n,l>>"),d:s("h<B<n,l?>>"),r:s("h<W>"),A:s("h<aV>"),w:s("h<+(a,a)>"),B:s("h<bF>"),bP:s("h<cz>"),s:s("h<n>"),bw:s("h<b_>"),_:s("h<H>"),b:s("h<@>"),t:s("h<a>"),cG:s("h<a0?>"),v:s("h<H?>"),a:s("h<a?>"),T:s("bj"),m:s("w"),g:s("aj"),da:s("P<@>"),cm:s("i<O>"),U:s("i<S>"),Q:s("i<b_>"),j:s("i<@>"),aH:s("i<a>"),W:s("i<l?>"),aJ:s("av"),f:s("B<@,@>"),G:s("B<n,l?>"),p:s("B<a,i<b_>>"),P:s("bz"),K:s("l"),n:s("W"),D:s("C"),aN:s("F"),al:s("G"),cY:s("it"),cD:s("+()"),R:s("+(a,a)"),F:s("bF"),N:s("n"),bc:s("Y"),H:s("H"),bW:s("m"),cr:s("b0"),db:s("bM<C>"),ca:s("az<ar>"),y:s("u"),i:s("k"),S:s("a"),ch:s("a0?"),cR:s("eh<bz>?"),z:s("w?"),M:s("i<@>?"),a5:s("B<@,@>?"),X:s("l?"),aD:s("n?"),bM:s("H?"),c8:s("cM?"),az:s("u?"),dd:s("k?"),a3:s("a?"),ae:s("N?"),o:s("N"),cQ:s("~(n,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.T=J.cg.prototype
B.a=J.h.prototype
B.d=J.bi.prototype
B.U=J.aP.prototype
B.i=J.as.prototype
B.V=J.aj.prototype
B.W=J.bl.prototype
B.B=J.cw.prototype
B.t=J.b0.prototype
B.j=new A.a0(0,"easy")
B.u=new A.a0(1,"medium")
B.k=new A.a0(2,"hard")
B.v=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.I=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.N=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.J=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.M=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.L=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.K=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.w=function(hooks) { return hooks; }

B.x=new A.cY()
B.f=new A.d6()
B.O=new A.cJ()
B.e=new A.ai(0,"decision")
B.h=new A.ai(1,"playing")
B.l=new A.ai(2,"raisePending")
B.m=new A.ai(3,"handOver")
B.y=new A.ai(4,"gameOver")
B.X=new A.cZ(null)
B.Y=new A.d_(null)
B.E=new A.Y(0,"ouros")
B.F=new A.Y(1,"espadas")
B.G=new A.Y(2,"copas")
B.H=new A.Y(3,"paus")
B.z=s([B.E,B.F,B.G,B.H],A.ae("h<Y>"))
B.q=new A.av(0,"vira")
B.a5=new A.av(1,"fixed")
B.Z=s([B.q,B.a5],A.ae("h<av>"))
B.a_=s([B.j,B.u,B.k],A.ae("h<a0>"))
B.b=new A.H(0,"a")
B.c=new A.H(1,"b")
B.a0=s([B.b,B.c],t._)
B.a1=s(["Truco","Seis","Nove","Doze"],t.s)
B.o=s([],t.Y)
B.n=s([],t.u)
B.au=s([],t.d)
B.a2=s([],t.b)
B.a3=s([1,3,6,9,12],t.t)
B.D=new A.G("4",0,"four")
B.ad=new A.G("5",1,"five")
B.ac=new A.G("6",2,"six")
B.r=new A.G("7",3,"seven")
B.ae=new A.G("Q",4,"queen")
B.aa=new A.G("J",5,"jack")
B.ab=new A.G("K",6,"king")
B.C=new A.G("A",7,"ace")
B.af=new A.G("2",8,"two")
B.a9=new A.G("3",9,"three")
B.p=s([B.D,B.ad,B.ac,B.r,B.ae,B.aa,B.ab,B.C,B.af,B.a9],A.ae("h<G>"))
B.P=new A.O(B.r,B.E)
B.R=new A.O(B.C,B.F)
B.Q=new A.O(B.r,B.G)
B.S=new A.O(B.D,B.H)
B.a4=s([B.P,B.R,B.Q,B.S],t.Y)
B.a7={}
B.A=new A.a6(B.a7,[],A.ae("a6<a,i<l?>>"))
B.a8={t:0}
B.a6=new A.a6(B.a8,["next"],A.ae("a6<n,l?>"))
B.ag=new A.ac(B.b)
B.ah=new A.ac(B.c)
B.ai=A.a_("io")
B.aj=A.a_("ip")
B.ak=A.a_("fD")
B.al=A.a_("fE")
B.am=A.a_("fF")
B.an=A.a_("fG")
B.ao=A.a_("fH")
B.ap=A.a_("l")
B.aq=A.a_("fZ")
B.ar=A.a_("h_")
B.as=A.a_("h0")
B.at=A.a_("h1")})();(function staticFields(){$.dm=null
$.R=A.d([],A.ae("h<l>"))
$.er=null
$.ed=null
$.ec=null
$.f2=null
$.f_=null
$.f6=null
$.dw=null
$.dE=null
$.e3=null
$.dr=A.d([],A.ae("h<i<l>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"ir","f9",()=>A.dy("_$dart_dartClosure"))
s($,"iq","e7",()=>A.dy("_$dart_dartClosure_dartJSInterop"))
s($,"iF","fk",()=>A.d([new J.ci()],A.ae("h<bG>")))
s($,"iu","fa",()=>A.aa(A.dk({
toString:function(){return"$receiver$"}})))
s($,"iv","fb",()=>A.aa(A.dk({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iw","fc",()=>A.aa(A.dk(null)))
s($,"ix","fd",()=>A.aa(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iA","fg",()=>A.aa(A.dk(void 0)))
s($,"iB","fh",()=>A.aa(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iz","ff",()=>A.aa(A.ey(null)))
s($,"iy","fe",()=>A.aa(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iD","fj",()=>A.aa(A.ey(void 0)))
s($,"iC","fi",()=>A.aa(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iE","dJ",()=>A.f4(B.ap))
s($,"iG","e8",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.p[r]
for(p=0;p<4;++p)o.push(A.ft(q,B.z[p]))}return A.A(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
m[a]=1
return Object.keys(hunkHelpers.convertToFastObject(m))[0]}
v.getIsolateTag=function(a){return s("___dart_"+a+v.isolateTag)}
var r="___dart_isolate_tags_"
var q=Object[r]||(Object[r]=Object.create(null))
var p="_ZxYxX"
for(var o=0;;o++){var n=s(p+"_"+o+"_")
if(!(n in q)){q[n]=1
v.isolateTag=n
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.aT,SharedArrayBuffer:A.aT,ArrayBufferView:A.bx,DataView:A.cn,Float32Array:A.co,Float64Array:A.cp,Int16Array:A.cq,Int32Array:A.cr,Int8Array:A.cs,Uint16Array:A.ct,Uint32Array:A.cu,Uint8ClampedArray:A.by,CanvasPixelArray:A.by,Uint8Array:A.cv})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.aU.$nativeSuperclassTag="ArrayBufferView"
A.bR.$nativeSuperclassTag="ArrayBufferView"
A.bS.$nativeSuperclassTag="ArrayBufferView"
A.bv.$nativeSuperclassTag="ArrayBufferView"
A.bT.$nativeSuperclassTag="ArrayBufferView"
A.bU.$nativeSuperclassTag="ArrayBufferView"
A.bw.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$2$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.ie
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()