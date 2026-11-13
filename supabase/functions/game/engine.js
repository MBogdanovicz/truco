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
if(a[b]!==s){A.iy(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.ep(b)
return new s(c,this)}:function(){if(s===null)s=A.ep(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.ep(a).prototype
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
eu(a,b,c,d){return{i:a,p:b,e:c,x:d}},
eq(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.es==null){A.im()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eV("Return interceptor for "+A.u(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dD
if(o==null)o=$.dD=A.dR(n)
p=q[o]}if(p!=null)return p
p=A.is(a)
if(p!=null)return p
if(typeof a=="function")return B.Y
s=Object.getPrototypeOf(a)
if(s==null)return B.J
if(s===Object.prototype)return B.J
if(typeof q=="function"){o=$.dD
if(o==null)o=$.dD=A.dR(n)
Object.defineProperty(q,o,{value:B.B,enumerable:false,writable:true,configurable:true})
return B.B}return B.B},
h2(a,b){if(a<0||a>4294967295)throw A.d(A.aJ(a,0,4294967295,"length",null))
return J.h3(new Array(a),b)},
e8(a,b){if(a<0)throw A.d(A.d1("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
e7(a,b){if(a<0)throw A.d(A.d1("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
h3(a,b){var s=A.e(a,b.h("j<0>"))
s.$flags=1
return s},
aw(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.br.prototype
return J.cx.prototype}if(typeof a=="string")return J.b1.prototype
if(a==null)return J.bs.prototype
if(typeof a=="boolean")return J.cw.prototype
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.k)return a
return J.eq(a)},
dQ(a){if(typeof a=="string")return J.b1.prototype
if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.k)return a
return J.eq(a)},
bj(a){if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.k)return a
return J.eq(a)},
K(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aw(a).C(a,b)},
a8(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.iq(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dQ(a).j(a,b)},
fE(a,b,c){return J.bj(a).i(a,b,c)},
e3(a,b){return J.bj(a).k(a,b)},
fF(a,b){return J.bj(a).W(a,b)},
e4(a,b){return J.bj(a).G(a,b)},
ac(a){return J.aw(a).gv(a)},
fG(a){return J.dQ(a).gt(a)},
fH(a){return J.bj(a).gu(a)},
ax(a){return J.bj(a).gq(a)},
d0(a){return J.dQ(a).gm(a)},
fI(a){return J.aw(a).gB(a)},
cg(a){return J.aw(a).l(a)},
ct:function ct(){},
cw:function cw(){},
bs:function bs(){},
bv:function bv(){},
ar:function ar(){},
cK:function cK(){},
bV:function bV(){},
aq:function aq(){},
bu:function bu(){},
bw:function bw(){},
j:function j(a){this.$ti=a},
cv:function cv(){},
dc:function dc(a){this.$ti=a},
ay:function ay(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bt:function bt(){},
br:function br(){},
cx:function cx(){},
b1:function b1(){}},A={e9:function e9(){},
fO(a,b,c){if(t.V.b(a))return new A.c_(a,b.h("@<0>").A(c).h("c_<1,2>"))
return new A.az(a,b.h("@<0>").A(c).h("az<1,2>"))},
h4(a){return new A.bz("Field '"+a+"' has not been initialized.")},
at(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
eh(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ia(a,b,c){return a},
et(a){var s,r
for(s=$.X.length,r=0;r<s;++r)if(a===$.X[r])return!0
return!1},
eg(a,b,c,d){A.ee(b,"start")
if(c!=null){A.ee(c,"end")
if(b>c)A.ak(A.aJ(b,0,c,"start",null))}return new A.bR(a,b,c,d.h("bR<0>"))},
h8(a,b,c,d){if(t.V.b(a))return new A.bq(a,b,c.h("@<0>").A(d).h("bq<1,2>"))
return new A.aI(a,b,c.h("@<0>").A(d).h("aI<1,2>"))},
cu(){return new A.ba("No element")},
eE(){return new A.ba("Too many elements")},
bc:function bc(){},
bm:function bm(a,b){this.a=a
this.$ti=b},
az:function az(a,b){this.a=a
this.$ti=b},
c_:function c_(a,b){this.a=a
this.$ti=b},
aA:function aA(a,b){this.a=a
this.$ti=b},
d5:function d5(a,b){this.a=a
this.b=b},
d4:function d4(a){this.a=a},
bz:function bz(a){this.a=a},
dp:function dp(){},
f:function f(){},
C:function C(){},
bR:function bR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a3:function a3(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aI:function aI(a,b,c){this.a=a
this.b=b
this.$ti=c},
bq:function bq(a,b,c){this.a=a
this.b=b
this.$ti=c},
bD:function bD(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ad:function ad(a,b,c){this.a=a
this.b=b
this.$ti=c},
af:function af(a,b,c){this.a=a
this.b=b
this.$ti=c},
bY:function bY(a,b,c){this.a=a
this.b=b
this.$ti=c},
bZ:function bZ(a,b){this.a=a
this.$ti=b},
aM:function aM(a,b){this.a=a
this.$ti=b},
t:function t(){},
bN:function bN(a,b){this.a=a
this.$ti=b},
cn(a,b,c){var s,r,q,p,o,n,m,l=A.h(a),k=A.aG(new A.U(a,l.h("U<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.x)(k),++i,p=o){r=k[i]
c.a(a.j(0,r))
o=p+1
q[r]=p}n=A.aG(new A.bC(a,l.h("bC<2>")),!0,c)
m=new A.R(q,n,b.h("@<0>").A(c).h("R<1,2>"))
m.$keys=k
return m}return new A.bo(A.h5(a,b,c),b.h("@<0>").A(c).h("bo<1,2>"))},
fU(){throw A.d(A.bX("Cannot modify constant Set"))},
fr(a){var s=A.fq(a)
if(s!=null)return s
return"minified:"+a},
iq(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
u(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.cg(a)
return s},
bL(a){var s,r=$.eM
if(r==null)r=$.eM=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cL(a){var s,r,q,p
if(a instanceof A.k)return A.W(A.aj(a),null)
s=J.aw(a)
if(s===B.X||s===B.Z||t.cr.b(a)){r=B.D(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.W(A.aj(a),null)},
eN(a){var s,r,q
if(a==null||typeof a=="number"||A.em(a))return J.cg(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.am)return a.l(0)
if(a instanceof A.a6)return a.aY(!0)
s=$.fD()
for(r=0;r<1;++r){q=s[r].bV(a)
if(q!=null)return q}return"Instance of '"+A.cL(a)+"'"},
N(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aX(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aJ(a,0,1114111,null,null))},
b(a,b){if(a==null)J.d0(a)
throw A.d(A.fl(a,b))},
fl(a,b){var s,r="index"
if(!A.en(b))return new A.al(!0,b,r,null)
s=J.d0(a)
if(b<0||b>=s)return A.e5(b,s,a,r)
return A.eP(b,r)},
d(a){return A.L(a,new Error())},
L(a,b){var s
if(a==null)a=new A.bU()
b.dartException=a
s=A.iz
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iz(){return J.cg(this.dartException)},
ak(a,b){throw A.L(a,b==null?new Error():b)},
bl(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.ak(A.hK(a,b,c),s)},
hK(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.bW("'"+s+"': Cannot "+o+" "+l+k+n)},
x(a){throw A.d(A.Y(a))},
ae(a){var s,r,q,p,o,n
a=A.iv(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.e([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.dB(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dC(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
eU(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
ea(a,b){var s=b==null,r=s?null:b.method
return new A.cy(a,r,s?null:b.receiver)},
ew(a){if(a==null)return new A.dn(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aV(a,a.dartException)
return A.i9(a)},
aV(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
i9(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aX(r,16)&8191)===10)switch(q){case 438:return A.aV(a,A.ea(A.u(s)+" (Error "+q+")",null))
case 445:case 5007:A.u(s)
return A.aV(a,new A.bJ())}}if(a instanceof TypeError){p=$.ft()
o=$.fu()
n=$.fv()
m=$.fw()
l=$.fz()
k=$.fA()
j=$.fy()
$.fx()
i=$.fC()
h=$.fB()
g=p.P(s)
if(g!=null)return A.aV(a,A.ea(A.ai(s),g))
else{g=o.P(s)
if(g!=null){g.method="call"
return A.aV(a,A.ea(A.ai(s),g))}else if(n.P(s)!=null||m.P(s)!=null||l.P(s)!=null||k.P(s)!=null||j.P(s)!=null||m.P(s)!=null||i.P(s)!=null||h.P(s)!=null){A.ai(s)
return A.aV(a,new A.bJ())}}return A.aV(a,new A.cS(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bQ()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aV(a,new A.al(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bQ()
return a},
ev(a){if(a==null)return J.ac(a)
if(typeof a=="object")return A.bL(a)
return J.ac(a)},
ib(a){if(typeof a=="number")return B.p.gv(a)
if(a instanceof A.d_)return A.bL(a)
if(a instanceof A.a6)return a.gv(a)
return A.ev(a)},
ig(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
fT(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cO().constructor.prototype):Object.create(new A.aW(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.eC(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fP(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.eC(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fP(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fK)}throw A.d("Error in functionType of tearoff")},
fQ(a,b,c,d){var s=A.eB
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
eC(a,b,c,d){if(c)return A.fS(a,b,d)
return A.fQ(b.length,d,a,b)},
fR(a,b,c,d){var s=A.eB,r=A.fL
switch(b?-1:a){case 0:throw A.d(new A.cN("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fS(a,b,c){var s,r
if($.ez==null)$.ez=A.ey("interceptor")
if($.eA==null)$.eA=A.ey("receiver")
s=b.length
r=A.fR(s,c,a,b)
return r},
ep(a){return A.fT(a)},
fK(a,b){return A.cd(v.typeUniverse,A.aj(a.a),b)},
eB(a){return a.a},
fL(a){return a.b},
ey(a){var s,r,q,p=new A.aW("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.d1("Field name "+a+" not found."))},
dR(a){return v.getIsolateTag(a)},
is(a){var s,r,q,p,o,n=A.ai($.fm.$1(a)),m=$.dM[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dX[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.fa($.fj.$2(a,n))
if(q!=null){m=$.dM[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dX[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.dZ(s)
$.dM[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dX[n]=s
return s}if(p==="-"){o=A.dZ(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fo(a,s)
if(p==="*")throw A.d(A.eV(n))
if(v.leafTags[n]===true){o=A.dZ(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fo(a,s)},
fo(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.eu(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
dZ(a){return J.eu(a,!1,null,!!a.$iT)},
iu(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.dZ(s)
else return J.eu(s,c,null,null)},
im(){if(!0===$.es)return
$.es=!0
A.io()},
io(){var s,r,q,p,o,n,m,l
$.dM=Object.create(null)
$.dX=Object.create(null)
A.il()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.fp.$1(o)
if(n!=null){m=A.iu(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
il(){var s,r,q,p,o,n,m=B.N()
m=A.bi(B.O,A.bi(B.P,A.bi(B.E,A.bi(B.E,A.bi(B.Q,A.bi(B.R,A.bi(B.S(B.D),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fm=new A.dU(p)
$.fj=new A.dV(o)
$.fp=new A.dW(n)},
bi(a,b){return a(b)||b},
id(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
iv(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ag:function ag(a){this.a=a},
ah:function ah(a,b){this.a=a
this.b=b},
c6:function c6(a,b){this.a=a
this.b=b},
bo:function bo(a,b){this.a=a
this.$ti=b},
bn:function bn(){},
R:function R(a,b,c){this.a=a
this.b=b
this.$ti=c},
c0:function c0(a,b){this.a=a
this.$ti=b},
aN:function aN(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bp:function bp(){},
ao:function ao(a,b){this.a=a
this.$ti=b},
bP:function bP(){},
dB:function dB(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bJ:function bJ(){},
cy:function cy(a,b,c){this.a=a
this.b=b
this.c=c},
cS:function cS(a){this.a=a},
dn:function dn(a){this.a=a},
am:function am(){},
cj:function cj(){},
ck:function ck(){},
cP:function cP(){},
cO:function cO(){},
aW:function aW(a,b){this.a=a
this.b=b},
cN:function cN(a){this.a=a},
a_:function a_(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
de:function de(a,b){this.a=a
this.b=b},
dd:function dd(a){this.a=a},
di:function di(a,b){this.a=a
this.b=b
this.c=null},
U:function U(a,b){this.a=a
this.$ti=b},
aF:function aF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bC:function bC(a,b){this.a=a
this.$ti=b},
bB:function bB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
a1:function a1(a,b){this.a=a
this.$ti=b},
bA:function bA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bx:function bx(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
dU:function dU(a){this.a=a},
dV:function dV(a){this.a=a},
dW:function dW(a){this.a=a},
a6:function a6(){},
aQ:function aQ(){},
be:function be(){},
b4:function b4(){},
bG:function bG(){},
cA:function cA(){},
b5:function b5(){},
bE:function bE(){},
bF:function bF(){},
cB:function cB(){},
cC:function cC(){},
cD:function cD(){},
cE:function cE(){},
cF:function cF(){},
cG:function cG(){},
cH:function cH(){},
bH:function bH(){},
cI:function cI(){},
c2:function c2(){},
c3:function c3(){},
c4:function c4(){},
c5:function c5(){},
ef(a,b){var s=b.c
return s==null?b.c=A.cb(a,"eD",[b.x]):s},
eQ(a){var s=a.w
if(s===6||s===7)return A.eQ(a.x)
return s===11||s===12},
ha(a){return a.as},
ab(a){return A.dI(v.typeUniverse,a,!1)},
aR(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aR(a1,s,a3,a4)
if(r===s)return a2
return A.f2(a1,r,!0)
case 7:s=a2.x
r=A.aR(a1,s,a3,a4)
if(r===s)return a2
return A.f1(a1,r,!0)
case 8:q=a2.y
p=A.bh(a1,q,a3,a4)
if(p===q)return a2
return A.cb(a1,a2.x,p)
case 9:o=a2.x
n=A.aR(a1,o,a3,a4)
m=a2.y
l=A.bh(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ej(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bh(a1,j,a3,a4)
if(i===j)return a2
return A.f3(a1,k,i)
case 11:h=a2.x
g=A.aR(a1,h,a3,a4)
f=a2.y
e=A.i6(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.f0(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bh(a1,d,a3,a4)
o=a2.x
n=A.aR(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.ek(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.ci("Attempted to substitute unexpected RTI kind "+a0))}},
bh(a,b,c,d){var s,r,q,p,o=b.length,n=A.dJ(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aR(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
i7(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dJ(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aR(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
i6(a,b,c,d){var s,r=b.a,q=A.bh(a,r,c,d),p=b.b,o=A.bh(a,p,c,d),n=b.c,m=A.i7(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cV()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
fk(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ij(s)
return a.$S()}return null},
ip(a,b){var s
if(A.eQ(b))if(a instanceof A.am){s=A.fk(a)
if(s!=null)return s}return A.aj(a)},
aj(a){if(a instanceof A.k)return A.h(a)
if(Array.isArray(a))return A.D(a)
return A.el(J.aw(a))},
D(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
h(a){var s=a.$ti
return s!=null?s:A.el(a)},
el(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hR(a,s)},
hR(a,b){var s=a instanceof A.am?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hz(v.typeUniverse,s.name)
b.$ccache=r
return r},
ij(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dI(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
ii(a){return A.aS(A.h(a))},
eo(a){var s
if(a instanceof A.a6)return A.ie(a.$r,a.am())
s=a instanceof A.am?A.fk(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fI(a).a
if(Array.isArray(a))return A.D(a)
return A.aj(a)},
aS(a){var s=a.r
return s==null?a.r=new A.d_(a):s},
ie(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.b(q,0)
s=A.cd(v.typeUniverse,A.eo(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.b(q,r)
s=A.f5(v.typeUniverse,s,A.eo(q[r]))}return A.cd(v.typeUniverse,s,a)},
a7(a){return A.aS(A.dI(v.typeUniverse,a,!1))},
hQ(a){var s=this
s.b=A.i5(s)
return s.b(a)},
i5(a){var s,r,q,p,o
if(a===t.K)return A.hX
if(A.aT(a))return A.i0
s=a.w
if(s===6)return A.hO
if(s===1)return A.ff
if(s===7)return A.hS
r=A.i4(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aT)){a.f="$i"+q
if(q==="i")return A.hV
if(a===t.m)return A.hU
return A.i_}}else if(s===10){p=A.id(a.x,a.y)
o=p==null?A.ff:p
return o==null?A.f9(o):o}return A.hM},
i4(a){if(a.w===8){if(a===t.S)return A.en
if(a===t.i||a===t.o)return A.hW
if(a===t.N)return A.hZ
if(a===t.y)return A.em}return null},
hP(a){var s=this,r=A.hL
if(A.aT(s))r=A.hH
else if(s===t.K)r=A.f9
else if(A.bk(s)){r=A.hN
if(s===t.a3)r=A.f8
else if(s===t.aD)r=A.fa
else if(s===t.az)r=A.cf
else if(s===t.ae)r=A.dK
else if(s===t.dd)r=A.hD
else if(s===t.z)r=A.hF}else if(s===t.S)r=A.I
else if(s===t.N)r=A.ai
else if(s===t.y)r=A.hB
else if(s===t.o)r=A.hG
else if(s===t.i)r=A.hC
else if(s===t.m)r=A.hE
s.a=r
return s.a(a)},
hM(a){var s=this
if(a==null)return A.bk(s)
return A.ir(v.typeUniverse,A.ip(a,s),s)},
hO(a){if(a==null)return!0
return this.x.b(a)},
i_(a){var s,r=this
if(a==null)return A.bk(r)
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.aw(a)[s]},
hV(a){var s,r=this
if(a==null)return A.bk(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.aw(a)[s]},
hU(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.k)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
fe(a){if(typeof a=="object"){if(a instanceof A.k)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hL(a){var s=this
if(a==null){if(A.bk(s))return a}else if(s.b(a))return a
throw A.L(A.fb(a,s),new Error())},
hN(a){var s=this
if(a==null||s.b(a))return a
throw A.L(A.fb(a,s),new Error())},
fb(a,b){return new A.c9("TypeError: "+A.eW(a,A.W(b,null)))},
eW(a,b){return A.cp(a)+": type '"+A.W(A.eo(a),null)+"' is not a subtype of type '"+b+"'"},
a0(a,b){return new A.c9("TypeError: "+A.eW(a,b))},
hS(a){var s=this
return s.x.b(a)||A.ef(v.typeUniverse,s).b(a)},
hX(a){return a!=null},
f9(a){if(a!=null)return a
throw A.L(A.a0(a,"Object"),new Error())},
i0(a){return!0},
hH(a){return a},
ff(a){return!1},
em(a){return!0===a||!1===a},
hB(a){if(!0===a)return!0
if(!1===a)return!1
throw A.L(A.a0(a,"bool"),new Error())},
cf(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.L(A.a0(a,"bool?"),new Error())},
hC(a){if(typeof a=="number")return a
throw A.L(A.a0(a,"double"),new Error())},
hD(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a0(a,"double?"),new Error())},
en(a){return typeof a=="number"&&Math.floor(a)===a},
I(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.L(A.a0(a,"int"),new Error())},
f8(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.L(A.a0(a,"int?"),new Error())},
hW(a){return typeof a=="number"},
hG(a){if(typeof a=="number")return a
throw A.L(A.a0(a,"num"),new Error())},
dK(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a0(a,"num?"),new Error())},
hZ(a){return typeof a=="string"},
ai(a){if(typeof a=="string")return a
throw A.L(A.a0(a,"String"),new Error())},
fa(a){if(typeof a=="string")return a
if(a==null)return a
throw A.L(A.a0(a,"String?"),new Error())},
hE(a){if(A.fe(a))return a
throw A.L(A.a0(a,"JSObject"),new Error())},
hF(a){if(a==null)return a
if(A.fe(a))return a
throw A.L(A.a0(a,"JSObject?"),new Error())},
fg(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.W(a[q],b)
return s},
i3(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.fg(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.W(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
fc(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.e([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.k(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.b(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.W(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.W(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.W(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.W(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.W(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
W(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.W(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.W(a.x,b)+">"
if(l===8){p=A.i8(a.x)
o=a.y
return o.length>0?p+("<"+A.fg(o,b)+">"):p}if(l===10)return A.i3(a,b)
if(l===11)return A.fc(a,b,null)
if(l===12)return A.fc(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.b(b,n)
return b[n]}return"?"},
i8(a){var s=A.fq(a)
if(s!=null)return s
return"minified:"+a},
hA(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hz(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dI(a,b,!1)
else if(typeof m=="number"){s=m
r=A.cc(a,5,"#")
q=A.dJ(s)
for(p=0;p<s;++p)q[p]=r
o=A.cb(a,b,q)
n[b]=o
return o}else return m},
hy(a,b){return A.f6(a.tR,b)},
hx(a,b){return A.f6(a.eT,b)},
dI(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.f4(a,null,b,!1)
r.set(b,s)
return s},
cd(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.f4(a,b,c,!0)
q.set(c,r)
return r},
f5(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ej(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
f4(a,b,c,d){return A.hq(A.hk(a,b,c,d))},
av(a,b){b.a=A.hP
b.b=A.hQ
return b},
cc(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a5(null,null)
s.w=b
s.as=c
r=A.av(a,s)
a.eC.set(c,r)
return r},
f2(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hv(a,b,r,c)
a.eC.set(r,s)
return s},
hv(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aT(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bk(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a5(null,null)
q.w=6
q.x=b
q.as=c
return A.av(a,q)},
f1(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.ht(a,b,r,c)
a.eC.set(r,s)
return s},
ht(a,b,c,d){var s,r
if(d){s=b.w
if(A.aT(b)||b===t.K)return b
else if(s===1)return A.cb(a,"eD",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.a5(null,null)
r.w=7
r.x=b
r.as=c
return A.av(a,r)},
hw(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a5(null,null)
s.w=13
s.x=b
s.as=q
r=A.av(a,s)
a.eC.set(q,r)
return r},
ca(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hs(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
cb(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.ca(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a5(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.av(a,r)
a.eC.set(p,q)
return q},
ej(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.ca(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a5(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.av(a,o)
a.eC.set(q,n)
return n},
f3(a,b,c){var s,r,q="+"+(b+"("+A.ca(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a5(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.av(a,s)
a.eC.set(q,r)
return r},
f0(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.ca(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.ca(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hs(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a5(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.av(a,p)
a.eC.set(r,o)
return o},
ek(a,b,c,d){var s,r=b.as+("<"+A.ca(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hu(a,b,c,r,d)
a.eC.set(r,s)
return s},
hu(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dJ(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aR(a,b,r,0)
m=A.bh(a,c,r,0)
return A.ek(a,n,m,c!==m)}}l=new A.a5(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.av(a,l)},
hk(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hq(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.hm(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eY(a,r,l,k,!1)
else if(q===46)r=A.eY(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aP(a.u,a.e,k.pop()))
break
case 94:k.push(A.hw(a.u,k.pop()))
break
case 35:k.push(A.cc(a.u,5,"#"))
break
case 64:k.push(A.cc(a.u,2,"@"))
break
case 126:k.push(A.cc(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.ho(a,k)
break
case 38:A.hn(a,k)
break
case 63:p=a.u
k.push(A.f2(p,A.aP(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.f1(p,A.aP(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.hl(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.eZ(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.hr(a.u,a.e,o)
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
return A.aP(a.u,a.e,m)},
hm(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eY(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hA(s,o.x)[p]
if(n==null)A.ak('No "'+p+'" in "'+A.ha(o)+'"')
d.push(A.cd(s,o,n))}else d.push(p)
return m},
ho(a,b){var s,r=a.u,q=A.eX(a,b),p=b.pop()
if(typeof p=="string")b.push(A.cb(r,p,q))
else{s=A.aP(r,a.e,p)
switch(s.w){case 11:b.push(A.ek(r,s,q,a.n))
break
default:b.push(A.ej(r,s,q))
break}}},
hl(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eX(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aP(p,a.e,o)
q=new A.cV()
q.a=s
q.b=n
q.c=m
b.push(A.f0(p,r,q))
return
case-4:b.push(A.f3(p,b.pop(),s))
return
default:throw A.d(A.ci("Unexpected state under `()`: "+A.u(o)))}},
hn(a,b){var s=b.pop()
if(0===s){b.push(A.cc(a.u,1,"0&"))
return}if(1===s){b.push(A.cc(a.u,4,"1&"))
return}throw A.d(A.ci("Unexpected extended operation "+A.u(s)))},
eX(a,b){var s=b.splice(a.p)
A.eZ(a.u,a.e,s)
a.p=b.pop()
return s},
aP(a,b,c){if(typeof c=="string")return A.cb(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hp(a,b,c)}else return c},
eZ(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aP(a,b,c[s])},
hr(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aP(a,b,c[s])},
hp(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.ci("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.ci("Bad index "+c+" for "+b.l(0)))},
ir(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.E(a,b,null,c,null)
r.set(c,s)}return s},
E(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aT(d))return!0
s=b.w
if(s===4)return!0
if(A.aT(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.E(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.E(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.E(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.E(a,b.x,c,d,e))return!1
return A.E(a,A.ef(a,b),c,d,e)}if(s===6)return A.E(a,p,c,d,e)&&A.E(a,b.x,c,d,e)
if(q===7){if(A.E(a,b,c,d.x,e))return!0
return A.E(a,b,c,A.ef(a,d),e)}if(q===6)return A.E(a,b,c,p,e)||A.E(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.cY)return!0
if(q===12){if(b===t.h)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.E(a,j,c,i,e)||!A.E(a,i,e,j,c))return!1}return A.fd(a,b.x,c,d.x,e)}if(q===11){if(b===t.h)return!0
if(p)return!1
return A.fd(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hT(a,b,c,d,e)}if(o&&q===10)return A.hY(a,b,c,d,e)
return!1},
fd(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.E(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.E(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.E(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.E(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.E(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
hT(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.cd(a,b,r[o])
return A.f7(a,p,null,c,d.y,e)}return A.f7(a,b.y,null,c,d.y,e)},
f7(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.E(a,b[s],d,e[s],f))return!1
return!0},
hY(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.E(a,r[s],c,q[s],e))return!1
return!0},
bk(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aT(a))if(s!==6)r=s===7&&A.bk(a.x)
return r},
aT(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
f6(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dJ(a){return a>0?new Array(a):v.typeUniverse.sEA},
a5:function a5(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cV:function cV(){this.c=this.b=this.a=null},
d_:function d_(a){this.a=a},
cU:function cU(){},
c9:function c9(a){this.a=a},
f_(a,b,c){return 0},
c8:function c8(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
bf:function bf(a,b){this.a=a
this.$ti=b},
eG(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
a2(a,b,c){return b.h("@<0>").A(c).h("eb<1,2>").a(A.ig(a,new A.a_(b.h("@<0>").A(c).h("a_<1,2>"))))},
o(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
eI(a){return new A.aO(a.h("aO<0>"))},
dk(a){return new A.aO(a.h("aO<0>"))},
ei(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
h5(a,b,c){var s=A.eG(b,c)
a.I(0,new A.dj(s,b,c))
return s},
eH(a,b,c){var s=A.eG(b,c)
s.W(0,a)
return s},
h6(a,b){var s=A.eI(b)
s.W(0,a)
return s},
ec(a){var s,r
if(A.et(a))return"{...}"
s=new A.bb("")
try{r={}
B.a.k($.X,a)
s.a+="{"
r.a=!0
a.I(0,new A.dm(r,s))
s.a+="}"}finally{if(0>=$.X.length)return A.b($.X,-1)
$.X.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
aO:function aO(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cZ:function cZ(a){this.a=a
this.c=this.b=null},
c1:function c1(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
dj:function dj(a,b,c){this.a=a
this.b=b
this.c=c},
r:function r(){},
q:function q(){},
dl:function dl(a){this.a=a},
dm:function dm(a,b){this.a=a
this.b=b},
ce:function ce(){},
b3:function b3(){},
aL:function aL(a,b){this.a=a
this.$ti=b},
as:function as(){},
c7:function c7(){},
bg:function bg(){},
i2(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ew(r)
q=String(s)
throw A.d(new A.d7(q))}q=A.dL(p)
return q},
dL(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cX(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dL(a[s])
return a},
eF(a,b,c){return new A.by(a,b)},
hJ(a){return a.N()},
hi(a,b){return new A.dE(a,[],A.ic())},
hj(a,b,c){var s,r=new A.bb(""),q=A.hi(r,b)
q.ad(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cX:function cX(a,b){this.a=a
this.b=b
this.c=null},
cY:function cY(a){this.a=a},
cl:function cl(){},
co:function co(){},
by:function by(a,b){this.a=a
this.b=b},
cz:function cz(a,b){this.a=a
this.b=b},
df:function df(){},
dh:function dh(a){this.b=a},
dg:function dg(a){this.a=a},
dF:function dF(){},
dG:function dG(a,b){this.a=a
this.b=b},
dE:function dE(a,b,c){this.c=a
this.a=b
this.b=c},
eJ(a,b,c,d){var s,r=c?J.e8(a,d):J.h2(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
aG(a,b,c){var s,r=A.e([],c.h("j<0>"))
for(s=J.ax(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
b2(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("j<0>"))
s=A.e([],b.h("j<0>"))
for(r=J.ax(a);r.n();)B.a.k(s,r.gp())
return s},
h7(a,b,c){var s,r=J.e8(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
w(a,b){var s=A.aG(a,!1,b)
s.$flags=3
return s},
eS(a,b,c){var s=J.ax(b)
if(!s.n())return a
if(c.length===0){do a+=A.u(s.gp())
while(s.n())}else{a+=A.u(s.gp())
while(s.n())a=a+c+A.u(s.gp())}return a},
fW(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fJ(b,"name","No enum value with that name"))},
fV(a,b){var s,r,q=A.o(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cp(a){if(typeof a=="number"||A.em(a)||a==null)return J.cg(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eN(a)},
ci(a){return new A.ch(a)},
d1(a){return new A.al(!1,null,null,a)},
fJ(a,b,c){return new A.al(!0,a,b,c)},
eO(a){var s=null
return new A.b8(s,s,!1,s,s,a)},
eP(a,b){return new A.b8(null,null,!0,a,b,"Value not in range")},
aJ(a,b,c,d,e){return new A.b8(b,c,!0,a,d,"Invalid value")},
h9(a,b,c){if(0>a||a>c)throw A.d(A.aJ(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aJ(b,a,c,"end",null))
return b}return c},
ee(a,b){if(a<0)throw A.d(A.aJ(a,0,null,b,null))
return a},
e5(a,b,c,d){return new A.cs(b,!0,a,d,"Index out of range")},
bX(a){return new A.bW(a)},
eV(a){return new A.cR(a)},
eR(a){return new A.ba(a)},
Y(a){return new A.cm(a)},
h1(a,b,c){var s,r
if(A.et(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.k($.X,a)
try{A.i1(a,s)}finally{if(0>=$.X.length)return A.b($.X,-1)
$.X.pop()}r=A.eS(b,t.bi.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
e6(a,b,c){var s,r
if(A.et(a))return b+"..."+c
s=new A.bb(b)
B.a.k($.X,a)
try{r=s
r.a=A.eS(r.a,a,", ")}finally{if(0>=$.X.length)return A.b($.X,-1)
$.X.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
i1(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.u(l.gp())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.b(b,-1)
r=b.pop()
if(0>=b.length)return A.b(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.k(b,A.u(p))
return}r=A.u(p)
if(0>=b.length)return A.b(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.b(b,-1)
k-=b.pop().length+2;--j}B.a.k(b,"...")
return}}q=A.u(p)
r=A.u(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.b(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.k(b,m)
B.a.k(b,q)
B.a.k(b,r)},
eK(a,b,c,d,e){return new A.aA(a,b.h("@<0>").A(c).A(d).A(e).h("aA<1,2,3,4>"))},
eL(a,b,c,d){var s
if(B.j===c){s=B.d.gv(a)
b=J.ac(b)
return A.eh(A.at(A.at($.e1(),s),b))}if(B.j===d){s=B.d.gv(a)
b=J.ac(b)
c=J.ac(c)
return A.eh(A.at(A.at(A.at($.e1(),s),b),c))}s=B.d.gv(a)
b=J.ac(b)
c=J.ac(c)
d=J.ac(d)
d=A.eh(A.at(A.at(A.at(A.at($.e1(),s),b),c),d))
return d},
cT:function cT(){},
v:function v(){},
ch:function ch(a){this.a=a},
bU:function bU(){},
al:function al(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b8:function b8(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
cs:function cs(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bW:function bW(a){this.a=a},
cR:function cR(a){this.a=a},
ba:function ba(a){this.a=a},
cm:function cm(a){this.a=a},
bQ:function bQ(){},
d7:function d7(a){this.a=a},
c:function c(){},
B:function B(a,b,c){this.a=a
this.b=b
this.$ti=c},
bI:function bI(){},
k:function k(){},
bb:function bb(a){this.a=a},
cW:function cW(){},
bd:function bd(){this.b=this.a=0},
ix(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b2(a1,t.bM),c=A.b2(a,t.R)
for(s=A.D(c),r=s.h("l(1)"),s=s.h("af<1>"),q=s.h("c.E"),p=b,o=a2;;){n={}
m=A.fn(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.b(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.aw(k,p.b)
p=null}else j=A.er(k,c,d,o)
k.$flags&1&&A.bl(k,"removeAt",1)
if(j<0||j>=k.length)A.ak(A.eP(j,null))
B.a.k(c,new A.ah(o,k.splice(j,1)[0]))
o=B.d.D(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.b2(new A.af(c,r.a(new A.e_(n)),s),q)
l=A.D(f)
e=new A.ad(f,l.h("H(1)").a(new A.e0()),l.h("ad<1,H>")).b8(0)
B.a.k(d,e.a===1?e.ga6(0):null)
o=B.a.gL(f).a
B.a.F(c)}},
er(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.dT(a)
if(a.length===1)return 0
s=(d&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gL(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?new A.dS(a).$0():f.$0()
return f.$0()}for(p=-2,o=-2,n=0;n<q;++n){m=b[n]
l=m.b
if(((m.a&1)===0?B.b:B.c)===s)o=Math.max(o,l)
else p=Math.max(p,l)}if(q===1)q=((B.a.gL(b).a&1)===0?B.b:B.c)!==s
else q=!1
if(q){for(q=a.length,k=-1,j=0;j<q;++j){m=a[j]
if(m>p)if(k>=0){if(!(k>=0&&k<q))return A.b(a,k)
m=m<a[k]}else m=!0
else m=!1
if(m)k=j}if(k>=0){if(!(k<q))return A.b(a,k)
q=a[k]<10||r}else q=!1
if(q)return k
return f.$0()}q=b.length
m=o>p
if(m)q=q===3||o>=8
else q=!1
if(q)return f.$0()
q=m?o:-2
i=Math.max(p,q)
for(q=a.length,h=-1,j=0;j<q;++j){m=a[j]
if(m>i)if(h>=0){if(!(h>=0&&h<q))return A.b(a,h)
m=m<a[h]}else m=!0
else m=!1
if(m)h=j}if(h>=0)return h
if(c.length!==0&&B.a.gL(c)===s){g=B.a.aw(a,p)
if(g>=0)return g}return f.$0()},
a9:function a9(a,b){this.a=a
this.b=b},
cQ:function cQ(a,b){this.a=a
this.b=b},
du:function du(){},
dr:function dr(){},
ds:function ds(){},
dt:function dt(a,b){this.a=a
this.b=b},
dv:function dv(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
e_:function e_(a){this.a=a},
e0:function e0(){},
dT:function dT(a){this.a=a},
dS:function dS(a){this.a=a},
fM(a,b){return new A.Q(a,b)},
fN(a){return new A.Q(B.a.b2(B.y,new A.d2(a)),B.a.b2(B.q,new A.d3(a)))},
V:function V(a,b){this.a=a
this.b=b},
P:function P(a,b,c){this.c=a
this.a=b
this.b=c},
Q:function Q(a,b){this.a=a
this.b=b},
d2:function d2(a){this.a=a},
d3:function d3(a){this.a=a},
ih(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.o(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.dk(s))
if(B.a.S(a7,new A.dN()))return a6
q=new A.dP(a6)
p=A.dk(t.H)
o=A.o(a5,t.L)
for(a5=a7.length,s=t._,n=!1,m=null,l=1,k=0,j=!1,i=!1,h=0;h<a7.length;a7.length===a5||(0,A.x)(a7),++h){g=a7[h]
A:{if(g instanceof A.b0){o.F(0)
m=g
l=1
k=0
j=!1
i=!1
break A}if(g instanceof A.b7){k=g.b
break A}f=g instanceof A.aB
if(f&&g.b)break A
if(f){p.k(0,(g.a&1)===0?B.b:B.c)
i=k===6
j=!0
break A}if(g instanceof A.aX){if(l===3&&!g.c)o.i(0,g.a,g.b)
break A}if(g instanceof A.b9){l=g.a+1
break A}if(g instanceof A.ap){e=g.a
f=m!=null
if(f&&m.e==null&&g.b>1)n=!0
if(!f||e==null)continue
if(i)q.$2(e,"game_seis_burro")
f=!j
if(f&&g.b===12)q.$2(e,"game_truco_12")
if(m.f)q.$2(e,"game_iron_hand")
for(d=m.d,c=m.b,r=0;r<4;++r){if(((r&1)===0?B.b:B.c)!==e)continue
if(f&&J.K(o.j(0,r),B.G))a6.j(0,r).k(0,"game_ace_river")
b=c.length
if(b!==4)continue
if(!(r<b))return A.b(c,r)
a=c[r]
if(a.length===3&&B.a.b1(a,new A.dO()))a6.j(0,r).k(0,"game_666")
b=A.dk(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.x)(a),++a1){a2=a[a1]
if(a8.E(a2,d)>=10){a3=a8.E(a2,d)-10
if(!(a3>=0&&a3<4))return A.b(B.q,a3)
b.k(0,B.q[a3])}}for(a0=B.a9.gH(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.bD(a3.b))a6.j(0,r).k(0,a4)}}break A}if(g instanceof A.aC||g instanceof A.aY)break A
if(g instanceof A.aE){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.T(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dN:function dN(){},
dP:function dP(a){this.a=a},
dO:function dO(){},
fi(a){var s
A:{if(a instanceof A.G){s=A.o(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.gab())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.O){s=A.a2(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.M){s=A.a2(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.S){s=A.a2(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
fh(a){var s,r,q=a.j(0,"s")
q.toString
A.I(q)
s=a.j(0,"t")
A:{if("play"===s){r=a.j(0,"c")
r.toString
q=new A.G(A.fN(A.ai(r)),J.K(a.j(0,"x"),!0),q)
break A}if("raise"===s){q=new A.O(q)
break A}if("accept"===s){q=new A.M(q)
break A}if("fold"===s){q=new A.S(q)
break A}q=A.ak(A.aa("unknown action "+A.u(a.j(0,"t"))))}return q},
cr:function cr(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=!1
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.w=g
_.x=h
_.y=i
_.z=$
_.Q=j
_.as=0
_.at=k
_.ax=!1},
d8:function d8(){},
d9:function d9(a){this.a=a},
da:function da(a){this.a=a},
db:function db(a){this.a=a},
aH:function aH(a,b){this.a=a
this.b=b},
dA:function dA(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
_.at=n},
eT(b3,b4,b5,b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bK(b3,b4),b0=new A.dq(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
A:{if(B.f===b2){s=b3.ch
s=((s.a&1)===0?B.b:B.c)!==b1&&s.c!==b4&&b8.$1(b4)
break A}if(B.e===b2){s=b3.CW===b1&&b8.$1(b4)
break A}s=!1
break A}r=b3.r
q=b3.as
p=b3.e
o=B.d.D(b3.at+3,4)
n=b3.f
m=b3.y
l=b3.gav()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.cn(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.w(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cM(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.w(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.ga_()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.b(a2,a5)
a6=A.aG(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gaC()
a2=a9.gb5()
a3=b3.ga9()
a7=b3.aZ(b4)
a8=b3.r===B.k&&b3.as===b4
return new A.au(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,b3.fr,A.cn(b3.dy,g,t.x),b9,b5,A.cn(c0.a,g,t.N),c0.bU(b1),c0.d,b6,b7)},
hc(){var s=t.S
return new A.bS(A.o(s,t.N),A.a2([B.b,0,B.c,0],t.H,s))},
b6:function b6(a,b,c){this.a=a
this.b=b
this.c=c},
cM:function cM(a,b,c){this.a=a
this.b=b
this.c=c},
au:function au(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var _=this
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
_.k1=a9
_.k2=b0
_.k3=b1
_.k4=b2
_.ok=b3
_.p1=b4},
dq:function dq(a){this.a=a},
d6:function d6(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bS:function bS(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
aa(a){return new A.cq(a)},
bT(a,b,c){var s,r,q,p,o,n=t.S,m=A.a2([B.b,0,B.c,0],t.H,n),l=A.e([],t.c4),k=t.x,j=J.e7(4,k)
for(s=t.Y,r=0;r<4;++r)j[r]=A.e([],s)
q=J.e7(4,k)
for(r=0;r<4;++r)q[r]=A.e([],s)
s=A.e([],t.d2)
p=A.e([],t.c5)
o=new A.bd()
o.ag(c)
n=new A.dw(b,o,m,l,B.d.D(a+3,4),B.h,j,q,s,p,A.o(n,k))
n.af()
return n},
hd(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.G
r=!1
if(s){r=b instanceof A.G
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.C(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.O){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.O
q=a}else q=o
if(r){r=s?p:b
t.aN.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.M){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.M
q=a}else q=o
if(r){r=s?p:b
t.l.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.S){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.S
q=a}else q=o
if(r){r=s?p:b
t.r.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
ik(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.x)(a),++r)q.push(a[r].b)
return A.fn(q)},
fn(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.am
if(q>=2)return B.an
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.ag(n)
if(l&&m!=null)return new A.ag(m)}if(s===3){if(2>=s)return A.b(a,2)
s=a[2]
return new A.ag(s==null?a[0]:s)}return null},
an:function an(a,b){this.a=a
this.b=b},
Z:function Z(){},
G:function G(a,b,c){this.b=a
this.c=b
this.a=c},
O:function O(a){this.a=a},
M:function M(a){this.a=a},
S:function S(a){this.a=a},
F:function F(){},
b0:function b0(a,b,c,d){var _=this
_.b=a
_.d=b
_.e=c
_.f=d},
aZ:function aZ(a,b){this.a=a
this.b=b},
aX:function aX(a,b,c){this.a=a
this.b=b
this.c=c},
b7:function b7(a,b,c){this.a=a
this.b=b
this.c=c},
bM:function bM(a){this.a=a},
aB:function aB(a,b){this.a=a
this.b=b},
b9:function b9(a){this.a=a},
ap:function ap(a,b){this.a=a
this.b=b},
aE:function aE(a){this.a=a},
aY:function aY(){},
aC:function aC(){},
a4:function a4(a,b,c){this.a=a
this.b=b
this.c=c},
bO:function bO(a,b,c){this.a=a
this.b=b
this.c=c},
cJ:function cJ(a,b,c){this.a=a
this.b=b
this.c=c},
cq:function cq(a){this.a=a},
dw:function dw(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
_.ax=_.at=_.as=0
_.CW=_.ch=_.ay=null
_.cy=_.cx=!1
_.db=null
_.dx=!1
_.dy=k
_.fr=null},
dz:function dz(a){this.a=a},
dx:function dx(a,b){this.a=a
this.b=b},
dy:function dy(){},
bK:function bK(a,b){this.a=a
this.b=b},
H:function H(a,b){this.a=a
this.b=b},
iw(b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=null,a9="forfeit",b0=t.G,b1=t.N,b2=t.X,b3=b0.a(B.F.bF(b5,a8)).K(0,b1,b2),b4=J.a8(b3,"rules")
b4.toString
b4=b0.a(b4).K(0,b1,b2)
h=A.fV(B.a1,t.aJ).j(0,b4.j(0,"manilhas"))
g=A.cf(b4.j(0,"coberta"))
f=A.cf(b4.j(0,"ferro"))
e=A.cf(b4.j(0,"verNoTruco"))
d=A.cf(b4.j(0,"verNaMaoDeOnze"))
c=A.cf(b4.j(0,"terceiraCarta"))
b=A.dK(b4.j(0,"tempo"))
b=b==null?a8:B.p.b7(b)
b4=A.dK(b4.j(0,"lento"))
b4=b4==null?a8:B.p.b7(b4)
if(h==null)h=B.z
if(b==null)b=20
if(b4==null)b4=0
b4=new A.dA("paulista","Truco",h,B.a6,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b,b4)
b=J.a8(b3,"seed")
b.toString
A.I(b)
c=J.a8(b3,"firstDealer")
c.toString
A.I(c)
d=J.K(J.a8(b3,"drawDealer"),!0)
e=A.e([],t.cG)
h=J.a8(b3,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.q
a=0
for(;a<h.length;h.length===g||(0,A.x)(h),++a){a0=h[a]
e.push(a0==null?a8:A.fW(B.a2,A.ai(a0),f))}h=t.d
g=A.e([],h)
f=t.k.a(J.a8(b3,"log"))
if(f==null)f=B.a5
a1=f.length
a=0
for(;a<f.length;f.length===a1||(0,A.x)(f),++a)g.push(b0.a(f[a]).K(0,b1,b2))
f=t.S
a1=A.hc()
a2=A.w(e,t.ch)
if(!d)a3=g.length!==0&&J.K(B.a.gL(g).j(0,"t"),"draw")
else a3=!0
a4=new A.cr(a3,B.r,A.o(f,f),b4,b,c,a2,A.e([],h),B.T,a1,A.dk(f))
a4.bd(e,d,c,g,a8,b4,b)
s=a4
r=null
q=null
b=t.a5.a(J.a8(b3,"act"))
p=b==null?a8:b.K(0,b1,b2)
try{if(A.en(J.a8(b3,a9))){b0=J.a8(b3,a9)
b0.toString
a5=s.a4(A.I(b0))}else if(J.K(J.a8(b3,"timeout"),!0)){b0=s.bS(A.f8(J.a8(b3,"missLimit")))
a5=b0}else{if(p==null){b0=s
a6=A.o(f,t.Q)
b0.X(a6)
if(a6.a===0)b0.R(a6,0)
b0=a6}else{b4=p.j(0,"seat")
b4.toString
A.I(b4)
h=p.j(0,"action")
h.toString
b2=s.bC(b4,b0.a(h).K(0,b1,b2))
b0=b2}a5=b0}o=a5
n=A.o(f,t.W)
for(b0=o,b0=new A.a1(b0,A.h(b0).h("a1<1,2>")).gq(0);b0.n();){b2=b0.d
b2.toString
m=b2
b2=m.a
l=[]
for(b4=m.b,h=b4.length,a=0;a<b4.length;b4.length===h||(0,A.x)(b4),++a){k=b4[a]
J.e3(l,k.N())}J.fE(n,b2,l)}r=n}catch(a7){n=A.ew(a7)
if(n instanceof A.cq){j=n
q=j.a
r=B.H}else{i=n
q=A.u(i)
r=B.H}}n=s.z
n===$&&A.J()
l=t.K
b0=A.o(b1,l)
b0.i(0,"log",s.x)
b2=A.o(b1,t.W)
for(b4=r.gH(),b4=b4.gq(b4);b4.n();){h=b4.gp()
b2.i(0,""+h.a,h.b)}b0.i(0,"frames",b2)
b0.i(0,"phase",n.r.b)
b2=n.db
if(b2!=null)b0.i(0,"winner",b2.b)
b2=n.c
b0.i(0,"scores",A.e([b2.j(0,B.b),b2.j(0,B.c)],t.e))
b0.i(0,"dealer",n.e)
b2=s.gaE()
if(b2!=null)b0.i(0,"waitingFor",b2)
if(s.ga1())b0.i(0,"reveal",!0)
if(s.b)b0.i(0,"draw",!0)
b2=A.e([],t.bc)
for(b4=n.d,h=B.a.gq(b4),g=new A.aM(h,t.ca),f=t.A;g.n();){e=f.a(h.gp())
d=A.o(b1,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b2.push(d)}b0.i(0,"hands",b2)
if(n.r===B.i){l=A.o(b1,t.a)
for(b1=A.ih(b4,n.a),b1=new A.a1(b1,A.h(b1).h("a1<1,2>")).gq(0);b1.n();){m=b1.d
b2=m.b
if(b2.gu(b2)){b4=m.a
b2=A.b2(b2,A.h(b2).c)
l.i(0,""+b4,b2)}}b0.i(0,"feats",l)}n=n.fr
if(n!=null)b0.i(0,a9,n.b)
n=q
if(n!=null)b0.i(0,"error",n)
return B.F.bH(b0,a8)},
it(){var s,r=v.G.globalThis,q=new A.dY()
if(typeof q=="function")A.ak(A.d1("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hI,q)
s[$.ex()]=q
r.trucoEngine=s},
dY:function dY(){},
fq(a){return v.mangledGlobalNames[a]},
iy(a){throw A.L(new A.bz("Field '"+a+"' has been assigned during initialization."),new Error())},
J(){throw A.L(A.h4(""),new Error())},
hI(a,b,c){t.Z.a(a)
if(A.I(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.e9.prototype={}
J.ct.prototype={
C(a,b){return a===b},
gv(a){return A.bL(a)},
l(a){return"Instance of '"+A.cL(a)+"'"},
gB(a){return A.aS(A.el(this))}}
J.cw.prototype={
l(a){return String(a)},
gv(a){return a?519018:218159},
gB(a){return A.aS(t.y)},
$ip:1,
$il:1}
J.bs.prototype={
C(a,b){return null==b},
l(a){return"null"},
gv(a){return 0},
$ip:1}
J.bv.prototype={$iz:1}
J.ar.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.cK.prototype={}
J.bV.prototype={}
J.aq.prototype={
l(a){var s=a[$.fs()]
if(s==null)s=a[$.ex()]
if(s==null)return this.bc(a)
return"JavaScript function for "+J.cg(s)},
$iaD:1}
J.bu.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.bw.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.j.prototype={
k(a,b){A.D(a).c.a(b)
a.$flags&1&&A.bl(a,29)
a.push(b)},
bR(a,b){var s
a.$flags&1&&A.bl(a,"remove",1)
for(s=0;s<a.length;++s)if(J.K(a[s],b)){a.splice(s,1)
return!0}return!1},
W(a,b){var s,r
A.D(a).h("c<1>").a(b)
a.$flags&1&&A.bl(a,"addAll",2)
if(Array.isArray(b)){this.bg(a,b)
return}for(s=b.length,r=0;r<b.length;b.length===s||(0,A.x)(b),++r)a.push(b[r])},
bg(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.Y(a))
for(r=0;r<s;++r)a.push(b[r])},
F(a){a.$flags&1&&A.bl(a,"clear","clear")
a.length=0},
b2(a,b){var s,r,q
A.D(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.Y(a))}throw A.d(A.cu())},
G(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
bb(a,b,c){var s=a.length
if(b>s)throw A.d(A.aJ(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aJ(c,b,s,"end",null))
if(b===c)return A.e([],A.D(a))
return A.e(a.slice(b,c),A.D(a))},
gL(a){if(a.length>0)return a[0]
throw A.d(A.cu())},
ga6(a){var s=a.length
if(s===1){if(0>=s)return A.b(a,0)
return a[0]}if(s===0)throw A.d(A.cu())
throw A.d(A.eE())},
S(a,b){var s,r
A.D(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.Y(a))}return!1},
b1(a,b){var s,r
A.D(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.Y(a))}return!0},
ae(a,b){var s,r,q,p
a.$flags&2&&A.bl(a,"shuffle")
s=a.length
while(s>1){r=b.a0(s);--s
q=a.length
if(!(s<q))return A.b(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.b(a,r)
a[s]=a[r]
a[r]=p}},
aw(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.b(a,s)
if(J.K(a[s],b))return s}return-1},
T(a,b){var s
for(s=0;s<a.length;++s)if(J.K(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gu(a){return a.length!==0},
l(a){return A.e6(a,"[","]")},
gq(a){return new J.ay(a,a.length,A.D(a).h("ay<1>"))},
gv(a){return A.bL(a)},
gm(a){return a.length},
i(a,b,c){A.D(a).c.a(c)
a.$flags&2&&A.bl(a)
if(!(b>=0&&b<a.length))throw A.d(A.fl(a,b))
a[b]=c},
bP(a,b){var s,r
A.D(a).h("l(1)").a(b)
s=a.length-1
if(s<0)return-1
for(r=s;r>=0;--r){if(!(r<a.length))return A.b(a,r)
if(b.$1(a[r]))return r}return-1},
$if:1,
$ic:1,
$ii:1}
J.cv.prototype={
bV(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cL(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.dc.prototype={}
J.ay.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.x(q)
throw A.d(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iy:1}
J.bt.prototype={
b7(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.bX(""+a+".toInt()"))},
l(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gv(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
D(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
return s+b},
V(a,b){return(a|0)===a?a/b|0:this.bz(a,b)},
bz(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.bX("Result of truncating division is "+A.u(s)+": "+A.u(a)+" ~/ "+b))},
aX(a,b){var s
if(a>0)s=this.bx(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bx(a,b){return b>31?0:a>>>b},
gB(a){return A.aS(t.o)},
$im:1,
$iaU:1}
J.br.prototype={
gB(a){return A.aS(t.S)},
$ip:1,
$ia:1}
J.cx.prototype={
gB(a){return A.aS(t.i)},
$ip:1}
J.b1.prototype={
a2(a,b,c){return a.substring(b,A.h9(b,c,a.length))},
l(a){return a},
gv(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gB(a){return A.aS(t.N)},
gm(a){return a.length},
$ip:1,
$in:1}
A.bc.prototype={
gq(a){var s=this.a
return new A.bm(s.gq(s),A.h(this).h("bm<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
l(a){return this.a.l(0)}}
A.bm.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iy:1}
A.az.prototype={}
A.c_.prototype={$if:1}
A.aA.prototype={
K(a,b,c){return new A.aA(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("aA<1,2,3,4>"))},
j(a,b){return this.$ti.h("4?").a(this.a.j(0,b))},
I(a,b){this.a.I(0,new A.d5(this,this.$ti.h("~(3,4)").a(b)))},
gJ(){var s=this.$ti
return A.fO(this.a.gJ(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
gH(){return this.a.gH().aB(0,new A.d4(this),this.$ti.h("B<3,4>"))}}
A.d5.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d4.prototype={
$1(a){var s=this.a.$ti
s.h("B<1,2>").a(a)
return new A.B(s.y[2].a(a.a),s.y[3].a(a.b),s.h("B<3,4>"))},
$S(){return this.a.$ti.h("B<3,4>(B<1,2>)")}}
A.bz.prototype={
l(a){return"LateInitializationError: "+this.a}}
A.dp.prototype={}
A.f.prototype={}
A.C.prototype={
gq(a){var s=this
return new A.a3(s,s.gm(s),A.h(s).h("a3<C.E>"))},
gt(a){return this.gm(this)===0},
aB(a,b,c){var s=A.h(this)
return new A.ad(this,s.A(c).h("1(C.E)").a(b),s.h("@<C.E>").A(c).h("ad<1,2>"))},
b8(a){var s,r=this,q=A.eI(A.h(r).h("C.E"))
for(s=0;s<r.gm(r);++s)q.k(0,r.G(0,s))
return q}}
A.bR.prototype={
gbp(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gby(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
G(a,b){var s=this,r=s.gby()+b,q=s.gbp()
if(r>=q)throw A.d(A.e5(b,s.gm(0),s,"index"))
return J.e4(s.a,r)},
bT(a){var s,r,q,p,o=this,n=o.b,m=o.a,l=m.length,k=o.c
if(k!=null&&k<l)l=k
s=l-n
if(s<=0){m=J.e8(0,o.$ti.c)
return m}r=J.bj(m)
q=A.eJ(s,r.G(m,n),!0,o.$ti.c)
for(p=1;p<s;++p){B.a.i(q,p,r.G(m,n+p))
if(m.length<l)throw A.d(A.Y(o))}return q}}
A.a3.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dQ(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.Y(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.G(q,s);++r.c
return!0},
$iy:1}
A.aI.prototype={
gq(a){return new A.bD(J.ax(this.a),this.b,A.h(this).h("bD<1,2>"))},
gm(a){return J.d0(this.a)},
gt(a){return J.fG(this.a)}}
A.bq.prototype={$if:1}
A.bD.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iy:1}
A.ad.prototype={
gm(a){return J.d0(this.a)},
G(a,b){return this.b.$1(J.e4(this.a,b))}}
A.af.prototype={
gq(a){return new A.bY(J.ax(this.a),this.b,this.$ti.h("bY<1>"))}}
A.bY.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iy:1}
A.bZ.prototype={
gq(a){return new A.aM(J.ax(this.a),this.$ti.h("aM<1>"))}}
A.aM.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iy:1}
A.t.prototype={
sm(a,b){throw A.d(A.bX("Cannot change the length of a fixed-length list"))},
k(a,b){A.aj(a).h("t.E").a(b)
throw A.d(A.bX("Cannot add to a fixed-length list"))},
W(a,b){A.aj(a).h("c<t.E>").a(b)
throw A.d(A.bX("Cannot add to a fixed-length list"))}}
A.bN.prototype={
gm(a){return this.a.length},
G(a,b){var s=this.a
return J.e4(s,s.length-1-b)}}
A.ag.prototype={$r:"+winner(1)",$s:1}
A.ah.prototype={$r:"+(1,2)",$s:2}
A.c6.prototype={$r:"+points,winner(1,2)",$s:3}
A.bo.prototype={}
A.bn.prototype={
K(a,b,c){var s=A.h(this)
return A.eK(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
l(a){return A.ec(this)},
gH(){return new A.bf(this.bJ(),A.h(this).h("bf<B<1,2>>"))},
bJ(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gH(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gJ(),o=o.gq(o),n=A.h(s),m=n.y[1],n=n.h("B<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.j(0,l)
r=4
return a.b=new A.B(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iA:1}
A.R.prototype={
gm(a){return this.b.length},
gaU(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
O(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
j(a,b){if(!this.O(b))return null
return this.b[this.a[b]]},
I(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaU()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gJ(){return new A.c0(this.gaU(),this.$ti.h("c0<1>"))}}
A.c0.prototype={
gm(a){return this.a.length},
gt(a){return 0===this.a.length},
gu(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.aN(s,s.length,this.$ti.h("aN<1>"))}}
A.aN.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iy:1}
A.bp.prototype={
k(a,b){A.h(this).c.a(b)
A.fU()}}
A.ao.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gu(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aN(s,s.length,this.$ti.h("aN<1>"))},
bs(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.bx(o.$ti.h("bx<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
T(a,b){return this.bs().O(b)}}
A.bP.prototype={}
A.dB.prototype={
P(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.bJ.prototype={
l(a){return"Null check operator used on a null value"}}
A.cy.prototype={
l(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cS.prototype={
l(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.dn.prototype={
l(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.am.prototype={
l(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.fr(r==null?"unknown":r)+"'"},
$iaD:1,
gbY(){return this},
$C:"$1",
$R:1,
$D:null}
A.cj.prototype={$C:"$0",$R:0}
A.ck.prototype={$C:"$2",$R:2}
A.cP.prototype={}
A.cO.prototype={
l(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.fr(s)+"'"}}
A.aW.prototype={
C(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aW))return!1
return this.$_target===b.$_target&&this.a===b.a},
gv(a){return(A.ev(this.a)^A.bL(this.$_target))>>>0},
l(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cL(this.a)+"'")}}
A.cN.prototype={
l(a){return"RuntimeError: "+this.a}}
A.a_.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gu(a){return this.a!==0},
gJ(){return new A.U(this,A.h(this).h("U<1>"))},
gH(){return new A.a1(this,A.h(this).h("a1<1,2>"))},
O(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bK(a)},
bK(a){var s=this.d
if(s==null)return!1
return this.ac(this.aT(s,a),a)>=0},
au(a){return new A.U(this,A.h(this).h("U<1>")).S(0,new A.de(this,a))},
W(a,b){A.h(this).h("A<1,2>").a(b).I(0,new A.dd(this))},
j(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bL(b)},
bL(a){var s,r,q=this.d
if(q==null)return null
s=this.aT(q,a)
r=this.ac(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.h(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.aI(s==null?q.b=q.ao():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.aI(r==null?q.c=q.ao():r,b,c)}else q.bM(b,c)},
bM(a,b){var s,r,q,p,o=this,n=A.h(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ao()
r=o.az(a)
q=s[r]
if(q==null)s[r]=[o.ah(a,b)]
else{p=o.ac(q,a)
if(p>=0)q[p].b=b
else q.push(o.ah(a,b))}},
F(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aV()}},
I(a,b){var s,r,q=this
A.h(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.Y(q))
s=s.c}},
aI(a,b,c){var s,r=A.h(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ah(b,c)
else s.b=c},
aV(){this.r=this.r+1&1073741823},
ah(a,b){var s=this,r=A.h(s),q=new A.di(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aV()
return q},
az(a){return J.ac(a)&1073741823},
aT(a,b){return a[this.az(b)]},
ac(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1},
l(a){return A.ec(this)},
ao(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ieb:1}
A.de.prototype={
$1(a){var s=this.a
return J.K(s.j(0,A.h(s).c.a(a)),this.b)},
$S(){return A.h(this.a).h("l(1)")}}
A.dd.prototype={
$2(a,b){var s=this.a,r=A.h(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.h(this.a).h("~(1,2)")}}
A.di.prototype={}
A.U.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.aF(s,s.r,s.e,this.$ti.h("aF<1>"))}}
A.aF.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iy:1}
A.bC.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bB(s,s.r,s.e,this.$ti.h("bB<1>"))}}
A.bB.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iy:1}
A.a1.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bA(s,s.r,s.e,this.$ti.h("bA<1,2>"))}}
A.bA.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.B(s.a,s.b,r.$ti.h("B<1,2>"))
r.c=s.c
return!0}},
$iy:1}
A.bx.prototype={
az(a){return A.ib(a)&1073741823},
ac(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1}}
A.dU.prototype={
$1(a){return this.a(a)},
$S:2}
A.dV.prototype={
$2(a,b){return this.a(a,b)},
$S:7}
A.dW.prototype={
$1(a){return this.a(A.ai(a))},
$S:8}
A.a6.prototype={
l(a){return this.aY(!1)},
aY(a){var s,r,q,p,o,n=this.bq(),m=this.am(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.b(m,q)
o=m[q]
l=a?l+A.eN(o):l+A.u(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
bq(){var s,r=this.$s
while($.dH.length<=r)B.a.k($.dH,null)
s=$.dH[r]
if(s==null){s=this.bl()
B.a.i($.dH,r,s)}return s},
bl(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.e7(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.w(j,k)}}
A.aQ.prototype={
am(){return[this.a,this.b]},
C(a,b){if(b==null)return!1
return b instanceof A.aQ&&this.$s===b.$s&&J.K(this.a,b.a)&&J.K(this.b,b.b)},
gv(a){return A.eL(this.$s,this.a,this.b,B.j)}}
A.be.prototype={
am(){return[this.a]},
C(a,b){if(b==null)return!1
return b instanceof A.be&&this.$s===b.$s&&J.K(this.a,b.a)},
gv(a){return A.eL(this.$s,this.a,B.j,B.j)}}
A.b4.prototype={
gB(a){return B.as},
$ip:1}
A.bG.prototype={}
A.cA.prototype={
gB(a){return B.at},
$ip:1}
A.b5.prototype={
gm(a){return a.length},
$iT:1}
A.bE.prototype={$if:1,$ic:1,$ii:1}
A.bF.prototype={$if:1,$ic:1,$ii:1}
A.cB.prototype={
gB(a){return B.au},
$ip:1}
A.cC.prototype={
gB(a){return B.av},
$ip:1}
A.cD.prototype={
gB(a){return B.aw},
$ip:1}
A.cE.prototype={
gB(a){return B.ax},
$ip:1}
A.cF.prototype={
gB(a){return B.ay},
$ip:1}
A.cG.prototype={
gB(a){return B.aA},
$ip:1}
A.cH.prototype={
gB(a){return B.aB},
$ip:1}
A.bH.prototype={
gB(a){return B.aC},
gm(a){return a.length},
$ip:1}
A.cI.prototype={
gB(a){return B.aD},
gm(a){return a.length},
$ip:1}
A.c2.prototype={}
A.c3.prototype={}
A.c4.prototype={}
A.c5.prototype={}
A.a5.prototype={
h(a){return A.cd(v.typeUniverse,this,a)},
A(a){return A.f5(v.typeUniverse,this,a)}}
A.cV.prototype={}
A.d_.prototype={
l(a){return A.W(this.a,null)}}
A.cU.prototype={
l(a){return this.a}}
A.c9.prototype={}
A.c8.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bw(a,b){var s,r,q
a=A.I(a)
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
o.d=null}q=o.bw(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.f_
return!1}if(0>=p.length)return A.b(p,-1)
o.a=p.pop()
m=0
n=null
continue}if(2===q){m=0
n=null
continue}if(3===q){n=o.c
o.c=null
p=o.e
if(p==null||p.length===0){o.b=null
o.a=A.f_
throw n
return!1}if(0>=p.length)return A.b(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eR("sync*"))}return!1},
bZ(a){var s,r,q=this
if(a instanceof A.bf){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.ax(a)
return 2}},
$iy:1}
A.bf.prototype={
gq(a){return new A.c8(this.a(),this.$ti.h("c8<1>"))}}
A.aO.prototype={
gq(a){var s=this,r=new A.c1(s,s.r,A.h(s).h("c1<1>"))
r.c=s.e
return r},
gm(a){return this.a},
gt(a){return this.a===0},
gu(a){return this.a!==0},
T(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.g.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.g.a(r[b])!=null}else return this.bm(b)},
bm(a){var s=this.d
if(s==null)return!1
return this.aR(s[this.aN(a)],a)>=0},
k(a,b){var s,r,q=this
A.h(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aJ(s==null?q.b=A.ei():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aJ(r==null?q.c=A.ei():r,b)}else return q.bf(b)},
bf(a){var s,r,q,p=this
A.h(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.ei()
r=p.aN(a)
q=s[r]
if(q==null)s[r]=[p.ap(a)]
else{if(p.aR(q,a)>=0)return!1
q.push(p.ap(a))}return!0},
F(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aM()}},
aJ(a,b){A.h(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.ap(b)
return!0},
aM(){this.r=this.r+1&1073741823},
ap(a){var s,r=this,q=new A.cZ(A.h(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.aM()
return q},
aN(a){return J.ac(a)&1073741823},
aR(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1}}
A.cZ.prototype={}
A.c1.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.Y(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$iy:1}
A.dj.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:9}
A.r.prototype={
gq(a){return new A.a3(a,a.length,A.aj(a).h("a3<r.E>"))},
G(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
gt(a){return a.length===0},
gu(a){return a.length!==0},
k(a,b){var s
A.aj(a).h("r.E").a(b)
s=a.length
this.sm(a,s+1)
if(!(s<a.length))return A.b(a,s)
a[s]=b},
W(a,b){var s,r,q
A.aj(a).h("c<r.E>").a(b)
s=a.length
for(r=b.length,q=0;q<b.length;b.length===r||(0,A.x)(b),++q){this.k(a,b[q]);++s}},
l(a){return A.e6(a,"[","]")}}
A.q.prototype={
K(a,b,c){var s=A.h(this)
return A.eK(this,s.h("q.K"),s.h("q.V"),b,c)},
I(a,b){var s,r,q,p=A.h(this)
p.h("~(q.K,q.V)").a(b)
for(s=this.gJ(),s=s.gq(s),p=p.h("q.V");s.n();){r=s.gp()
q=this.j(0,r)
b.$2(r,q==null?p.a(q):q)}},
gH(){return this.gJ().aB(0,new A.dl(this),A.h(this).h("B<q.K,q.V>"))},
gm(a){var s=this.gJ()
return s.gm(s)},
gt(a){var s=this.gJ()
return s.gt(s)},
gu(a){var s=this.gJ()
return s.gu(s)},
l(a){return A.ec(this)},
$iA:1}
A.dl.prototype={
$1(a){var s=this.a,r=A.h(s)
r.h("q.K").a(a)
s=s.j(0,a)
if(s==null)s=r.h("q.V").a(s)
return new A.B(a,s,r.h("B<q.K,q.V>"))},
$S(){return A.h(this.a).h("B<q.K,q.V>(q.K)")}}
A.dm.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.u(a)
r.a=(r.a+=s)+": "
s=A.u(b)
r.a+=s},
$S:3}
A.ce.prototype={}
A.b3.prototype={
K(a,b,c){return this.a.K(0,b,c)},
j(a,b){return this.a.j(0,b)},
I(a,b){this.a.I(0,A.h(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
gm(a){var s=this.a
return s.gm(s)},
l(a){return this.a.l(0)},
gH(){return this.a.gH()},
$iA:1}
A.aL.prototype={
K(a,b,c){return new A.aL(this.a.K(0,b,c),b.h("@<0>").A(c).h("aL<1,2>"))}}
A.as.prototype={
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
W(a,b){var s
for(s=J.ax(A.h(this).h("c<1>").a(b));s.n();)this.k(0,s.gp())},
bD(a){var s
for(s=a.gq(a);s.n();)if(!this.T(0,s.gp()))return!1
return!0},
ga6(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.eE())
s=r.gq(r)
if(!s.n())throw A.d(A.cu())
return s.gp()},
l(a){return A.e6(this,"{","}")},
$if:1,
$ic:1,
$iaK:1}
A.c7.prototype={}
A.bg.prototype={}
A.cX.prototype={
j(a,b){var s,r=this.b
if(r==null)return this.c.j(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bv(b):s}},
gm(a){return this.b==null?this.c.a:this.a7().length},
gt(a){return this.gm(0)===0},
gu(a){return this.gm(0)>0},
gJ(){if(this.b==null){var s=this.c
return new A.U(s,A.h(s).h("U<1>"))}return new A.cY(this)},
I(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.I(0,b)
s=o.a7()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dL(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.Y(o))}},
a7(){var s=t.k.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
bv(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dL(this.a[a])
return this.b[a]=s}}
A.cY.prototype={
gm(a){return this.a.gm(0)},
G(a,b){var s=this.a
if(s.b==null)s=s.gJ().G(0,b)
else{s=s.a7()
if(!(b<s.length))return A.b(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gJ()
s=s.gq(s)}else{s=s.a7()
s=new J.ay(s,s.length,A.D(s).h("ay<1>"))}return s}}
A.cl.prototype={}
A.co.prototype={}
A.by.prototype={
l(a){var s=A.cp(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cz.prototype={
l(a){return"Cyclic error in JSON stringify"}}
A.df.prototype={
bF(a,b){var s=A.i2(a,this.gbG().a)
return s},
bH(a,b){var s=A.hj(a,this.gbI().b,null)
return s},
gbI(){return B.a0},
gbG(){return B.a_}}
A.dh.prototype={}
A.dg.prototype={}
A.dF.prototype={
ba(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.l.a2(a,r,q)
r=q+1
o=A.N(92)
s.a+=o
o=A.N(117)
s.a+=o
o=A.N(100)
s.a+=o
o=p>>>8&15
o=A.N(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.N(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.N(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.l.a2(a,r,q)
r=q+1
o=A.N(92)
s.a+=o
switch(p){case 8:o=A.N(98)
s.a+=o
break
case 9:o=A.N(116)
s.a+=o
break
case 10:o=A.N(110)
s.a+=o
break
case 12:o=A.N(102)
s.a+=o
break
case 13:o=A.N(114)
s.a+=o
break
default:o=A.N(117)
s.a+=o
o=A.N(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.N(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.N(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.l.a2(a,r,q)
r=q+1
o=A.N(92)
s.a+=o
o=A.N(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.l.a2(a,r,m)},
ai(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.d(new A.cz(a,null))}B.a.k(s,a)},
ad(a){var s,r,q,p,o=this
if(o.b9(a))return
o.ai(a)
try{s=o.b.$1(a)
if(!o.b9(s)){q=A.eF(a,null,o.gaW())
throw A.d(q)}q=o.a
if(0>=q.length)return A.b(q,-1)
q.pop()}catch(p){r=A.ew(p)
q=A.eF(a,r,o.gaW())
throw A.d(q)}},
b9(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.p.l(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.ba(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.ai(a)
q.bW(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return!0}else if(t.G.b(a)){q.ai(a)
r=q.bX(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return r}else return!1},
bW(a){var s,r=this.c
r.a+="["
if(J.fH(a)){if(0>=a.length)return A.b(a,0)
this.ad(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.ad(a[s])}}r.a+="]"},
bX(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.eJ(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.I(0,new A.dG(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.ba(A.ai(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.b(r,n)
m.ad(r[n])}p.a+="}"
return!0}}
A.dG.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:3}
A.dE.prototype={
gaW(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cT.prototype={
l(a){return this.Y()},
$ib_:1}
A.v.prototype={}
A.ch.prototype={
l(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cp(s)
return"Assertion failed"}}
A.bU.prototype={}
A.al.prototype={
gal(){return"Invalid argument"+(!this.a?"(s)":"")},
gak(){return""},
l(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gal()+q+o
if(!s.a)return n
return n+s.gak()+": "+A.cp(s.gaA())},
gaA(){return this.b}}
A.b8.prototype={
gaA(){return A.dK(this.b)},
gal(){return"RangeError"},
gak(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.u(q):""
else if(q==null)s=": Not greater than or equal to "+A.u(r)
else if(q>r)s=": Not in inclusive range "+A.u(r)+".."+A.u(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.u(r)
return s}}
A.cs.prototype={
gaA(){return A.I(this.b)},
gal(){return"RangeError"},
gak(){if(A.I(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bW.prototype={
l(a){return"Unsupported operation: "+this.a}}
A.cR.prototype={
l(a){return"UnimplementedError: "+this.a}}
A.ba.prototype={
l(a){return"Bad state: "+this.a}}
A.cm.prototype={
l(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cp(s)+"."}}
A.bQ.prototype={
l(a){return"Stack Overflow"},
$iv:1}
A.d7.prototype={
l(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.c.prototype={
aB(a,b,c){var s=A.h(this)
return A.h8(this,s.A(c).h("1(c.E)").a(b),s.h("c.E"),c)},
S(a,b){var s
A.h(this).h("l(c.E)").a(b)
for(s=this.gq(this);s.n();)if(b.$1(s.gp()))return!0
return!1},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gu(a){return!this.gt(this)},
gL(a){var s=this.gq(this)
if(!s.n())throw A.d(A.cu())
return s.gp()},
G(a,b){var s,r
A.ee(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.e5(b,b-r,this,"index"))},
l(a){return A.h1(this,"(",")")}}
A.B.prototype={
l(a){return"MapEntry("+A.u(this.a)+": "+A.u(this.b)+")"}}
A.bI.prototype={
gv(a){return A.k.prototype.gv.call(this,0)},
l(a){return"null"}}
A.k.prototype={$ik:1,
C(a,b){return this===b},
gv(a){return A.bL(this)},
l(a){return"Instance of '"+A.cL(this)+"'"},
gB(a){return A.ii(this)},
toString(){return this.l(this)}}
A.bb.prototype={
gm(a){return this.a.length},
l(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ihb:1}
A.cW.prototype={
a0(a){if(a<=0||a>4294967296)throw A.d(A.eO(u.c+a))
return Math.random()*a>>>0},
M(){return Math.random()},
$ied:1}
A.bd.prototype={
ag(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
do{s=a>>>0
a=B.d.V(a-s,k)
r=a>>>0
a=B.d.V(a-r,k)
q=(~s>>>0)+(s<<21>>>0)
p=q>>>0
r=(~r>>>0)+((r<<21|s>>>11)>>>0)+B.d.V(q-p,k)>>>0
q=((p^(p>>>24|r<<8))>>>0)*265
s=q>>>0
r=((r^r>>>24)>>>0)*265+B.d.V(q-s,k)>>>0
q=((s^(s>>>14|r<<18))>>>0)*21
s=q>>>0
r=((r^r>>>14)>>>0)*21+B.d.V(q-s,k)>>>0
s=(s^(s>>>28|r<<4))>>>0
r=(r^r>>>28)>>>0
q=(s<<31>>>0)+s
p=q>>>0
o=B.d.V(q-p,k)
q=l.a*1037
n=l.a=q>>>0
m=l.b*1037+B.d.V(q-n,k)>>>0
l.b=m
n=(n^p)>>>0
l.a=n
o=(m^r+((r<<31|s>>>1)>>>0)+o>>>0)>>>0
l.b=o}while(a!==j)
if(o===0&&n===0)l.a=23063
l.U()
l.U()
l.U()
l.U()},
U(){var s=this,r=s.a,q=4294901760*r,p=q>>>0,o=55905*r,n=o>>>0,m=n+p+s.b
r=m>>>0
s.a=r
s.b=B.d.V(o-n+(q-p)+(m-r),4294967296)>>>0},
a0(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.d(A.eO(u.c+a))
s=a-1
if((a&s)>>>0===0){p.U()
return(p.a&s)>>>0}do{p.U()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
M(){var s,r=this
r.U()
s=r.a
r.U()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$ied:1}
A.a9.prototype={
Y(){return"AiLevel."+this.b}}
A.cQ.prototype={
b0(a){var s,r,q=this,p=a.a,o=a.b,n=p.b4(o)
if(n.length===0)throw A.d(A.eR("no legal action for "+o))
if(p.cx){p=t.db
s=new A.af(new A.bZ(n,p),p.h("l(c.E)").a(new A.du()),p.h("af<c.E>"))
return s.G(0,q.b.a0(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.bn(a)
break A}if(B.f===r){p=q.bh(a,n)
break A}p=q.bt(a,n)
break A}return p},
ga8(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
bn(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.n){s=a.b
return l.b.M()<0.6?new A.M(s):new A.S(s)}r=l.a5(a,l.ga8())
s=a.a
q=s.a
p=q.f
o=B.a.gL(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.j(0,m)
m.toString
if(m+o>=q.r)return new A.M(n)
return r>(p-o)/(2*p)+l.a3(0.08)?new A.M(n):new A.S(n)},
bh(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.S(t.U.a(b),new A.dr()),g=i.a
if(g===B.n){s=i.b.M()
if(h&&s<0.05)return new A.O(a.b)
g=a.b
return s<0.65?new A.M(g):new A.S(g)}r=a.a
q=r.ch
q.toString
p=r.a
o=p.d
n=r.ax
if(!(n<5))return A.b(o,n)
m=o[n]
q=q.b
if(!(q<5))return A.b(o,q)
l=o[q]
o=i.a5(a,i.ga8())
g=g===B.o
if(g)q=q>=2?0.12:0
else q=0.08
k=o-q
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.j(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.O(q):new A.M(q)
if(h&&k>0.78+i.a3(0.05))return new A.O(q)
j=g&&i.b.M()<0.06
return(2*k-1)*l>-m+i.a3(0.3)||j?new A.M(q):new A.S(q)},
bt(a,b){t.U.a(b)
if(B.a.S(b,new A.ds())&&this.bA(a))return new A.O(a.b)
return this.bk(a,b)},
bA(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.j(0,q)
q.toString
if(q+p.gav()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.M()<0.08
case 1:return r.a5(a,r.ga8())>0.72+r.a3(0.06)||r.b.M()<0.03
case 2:s=r.a5(a,r.ga8())
if(s>0.9&&a.ga_().length>1&&r.b.M()<0.8)return!1
if(s>0.62+r.a3(0.03))return!0
return A.w(p.z,t.F).length!==0&&s<0.3&&r.b.M()<0.04}},
a3(a){return(this.b.M()*2-1)*a},
bk(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.ga_()
r=f.a
if(r===B.n&&f.b.M()<0.55){r=s.length
q=f.b.a0(r)
if(!(q>=0&&q<r))return A.b(s,q)
return new A.G(s[q],!1,a.b)}r=r===B.o
if(r&&s.length>1)p=f.bi(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.E(s[l],n.y))
k=A.e([],t.w)
for(j=A.w(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.E(h.b,n.y)
k.push(new A.ah(h.a,g))}m=A.e([],t.v)
for(n=A.w(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.er(q,k,m,a.b)
if(!(q>=0&&q<o))return A.b(s,q)
p=s[q]}if(r&&a.a.ga9()&&!f.bB(a,p)&&f.b.M()<0.5)return new A.G(p,!0,a.b)
q=!1
if(r){r=a.a
if(r.ga9())if(A.w(r.Q,t.n).length===0){o=r.z
n=t.F
if(A.w(o,n).length===1){q=B.a.gL(A.w(o,n))
o=(a.b&1)===0?B.b:B.c
r=q.b===o&&s.length>1&&r.a.E(p,r.y)<10&&f.a5(a,120)>0.9}else r=q}else r=q
else r=q}else r=q
if(r)return new A.G(p,!0,a.b)
return new A.G(p,!1,a.b)},
bB(a,b){var s=a.a,r=s.a.E(b,s.y)
return B.a.b1(A.w(s.Q,t.n),new A.dt(a,r))},
bi(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.ga_(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.E(e[p],r.y))
o=A.e([],t.w)
for(n=A.w(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.E(l.b,r.y)
o.push(new A.ah(l.a,k))}q=A.e([],t.v)
for(r=A.w(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.er(d,o,q,a.b)
if(!(d>=0&&d<s))return A.b(e,d)
j=e[d]
i=this.aF(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.C(0,j))continue
f=this.aF(a,g,160)
if(f>i){i=f
h=g}}return h},
aF(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbO()
r=A.e([],t.Y)
for(q=$.e2(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.T(0,n))r.push(n)}q=b8.b
m=B.d.D(q+2,4)
l=b8.gaC()
if(this.a===B.o){p=b8.a
k=p.ch
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ay
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.ae(r,b)
a5.a=0
a6=A.h7(4,new A.dv(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.D(a0,4),B.d.D(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.b(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.aG(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.E(b4.b,p.y)
a8.push(new A.ah(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.aG(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.ix(a8,j?null:new A.ah(q,k.E(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
a5(a,b){return this.aF(a,null,b)}}
A.du.prototype={
$1(a){return!t.D.a(a).c},
$S:10}
A.dr.prototype={
$1(a){return t.M.a(a) instanceof A.O},
$S:0}
A.ds.prototype={
$1(a){return t.M.a(a) instanceof A.O},
$S:0}
A.dt.prototype={
$1(a){return this.a.a.aH(t.n.a(a))<this.b},
$S:4}
A.dv.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.ga_(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.E(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.r:s}else n=B.r
i=i.a
s=i.w
if(!(a<s.length))return A.b(s,a)
m=A.w(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.x)(n),++o)s.push(q.E(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.b(r,k)
s.push(q.E(r[k],i.y))}p.a+=m
return s},
$S:11}
A.e_.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:12}
A.e0.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:13}
A.dT.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o<s[q])q=p}return q},
$S:5}
A.dS.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o>s[q])q=p}return q},
$S:5}
A.V.prototype={
Y(){return"Suit."+this.b}}
A.P.prototype={
Y(){return"Rank."+this.b}}
A.Q.prototype={
gab(){var s=this.b.b
if(0>=s.length)return A.b(s,0)
return this.a.c+s[0]},
C(a,b){if(b==null)return!1
return b instanceof A.Q&&b.a===this.a&&b.b===this.b},
gv(a){return this.a.a*4+this.b.a},
l(a){return this.gab()}}
A.d2.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.l.a2(s,0,s.length-1)},
$S:14}
A.d3.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.b(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.b(s,q)
return p===s[q]},
$S:15}
A.dN.prototype={
$1(a){return t.E.a(a) instanceof A.aC},
$S:16}
A.dP.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.j(0,r).k(0,b)},
$S:17}
A.dO.prototype={
$1(a){return t.L.a(a).a===B.L},
$S:18}
A.cr.prototype={
bd(a,b,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
if(c.a){if(a1.length===0)B.a.k(c.x,B.ae)
c.b=!0
s=A.b2($.e2(),t.L)
r=c.f
q=new A.bd()
q.ag((r^625341585)>>>0)
B.a.ae(s,q)
c.c=A.eg(s,0,A.ia(20,"count",t.S),A.D(s).c).bT(0)
s=c.e
c.z=A.bT(3,s,(r^1540483477)>>>0)
p=r
r=s
s=p}else{s=c.e
r=c.f
c.z=A.bT(c.r,s,r)
p=r
r=s
s=p}for(q=a1.length,o=c.x,n=t.f,m=c.r,l=c.Q,k=l.a,j=c.at,i=c.d,h=0;h<a1.length;a1.length===q||(0,A.x)(a1),++h){g=n.a(a1[h])
f=g.j(0,"t")
e=J.aw(f)
if(!e.C(f,"draw"))if(e.C(f,"pick")){e=g.j(0,"s")
e.toString
A.I(e)
d=g.j(0,"i")
d.toString
i.i(0,e,A.I(d))
if(i.a===4){e=c.an()
c.b=!1
c.z=A.bT(e,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}}else if(e.C(f,"draw-end")){e=c.aL()
if(e==null)e=m
c.b=!1
c.z=A.bT(e,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}else if(e.C(f,"next")){e=c.z
e===$&&A.J()
e.af()
j.F(0)
c.ax=!1}else if(e.C(f,"show")){e=c.z
e===$&&A.J()
d=g.j(0,"s")
d.toString
e.aG(A.I(d))}else if(e.C(f,"ready")){e=g.j(0,"s")
e.toString
j.k(0,A.I(e))}else if(e.C(f,"reveal-end"))c.ax=!0
else if(J.K(g.j(0,"t"),"forfeit")){if(c.b){c.b=!1
c.z=A.bT(m,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}e=c.z
e===$&&A.J()
d=g.j(0,"s")
d.toString
e.a4((A.I(d)&1)===0?B.b:B.c)}else{e=c.z
e===$&&A.J()
e.Z(A.fh(g))}B.a.k(o,g)}if(!c.b){s=c.z
s===$&&A.J()
s=s.d
l.Z(A.eg(s,c.as,null,A.D(s).c))}s=c.z
s===$&&A.J()
c.as=s.d.length},
an(){var s,r,q,p,o=this.d,n=A.h(o),m=new A.U(o,n.h("U<1>")).gL(0)
for(n=new A.aF(o,o.r,o.e,n.h("aF<1>"));n.n();){s=n.d
r=this.c
q=o.j(0,s)
q.toString
if(!(q>=0&&q<r.length))return A.b(r,q)
q=r[q]
r=this.c
p=o.j(0,m)
p.toString
if(!(p>=0&&p<r.length))return A.b(r,p)
p=r[p]
if(q.a.a*4+q.b.a>p.a.a*4+p.b.a)m=s}return m},
aQ(a,b,c){var s,r,q,p,o,n=this,m=n.c.length,l=n.d,k=t.S,j=A.cn(l,k,k),i=b==null
if(i||c)k=B.aa
else{k=A.o(k,t.L)
for(s=new A.a1(l,A.h(l).h("a1<1,2>")).gq(0);s.n();){r=s.d
q=r.a
p=n.c
o=r.b
if(!(o>=0&&o<p.length))return A.b(p,o)
k.i(0,q,p[o])}}s=!1
if(n.b)if(i){i=n.w
if(!(a>=0&&a<i.length))return A.b(i,a)
l=i[a]==null&&!l.O(a)}else l=s
else l=s
return new A.d6(m,j,k,b,c,l)},
bo(a){return this.aQ(a,null,!1)},
aP(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i
t.p.a(a)
for(s=this.gaa(),r=s.length,q=t.S,p=t.N,o=t.H,n=t.O,m=0;m<s.length;s.length===r||(0,A.x)(s),++m){l=s[m]
k=a.j(0,l)
if(k==null){k=A.e([],n)
a.i(0,l,k)}j=this.z
j===$&&A.J()
i=A.a2([B.b,0,B.c,0],o,q)
J.e3(k,A.eT(j,l,!1,b,this.aQ(l,c,d),new A.d8(),!1,new A.bS(A.o(q,p),i)))}},
aO(a,b){return this.aP(a,b,null,!1)},
aK(a){var s,r=this
r.b=!1
r.z=A.bT(a,r.e,r.f)
s=r.Q
s.a.F(0)
s.b=null
s.d=s.c=!1
r.as=0},
aL(){var s,r,q,p,o,n,m=this,l=m.d
if(!B.a.S(m.gaa(),l.gbE()))return null
s=new A.bd()
s.ag(m.f)
for(r=t.t,q=0;q<4;++q){if(l.O(q))continue
p=A.e([],r)
for(o=0;o<m.c.length;++o)if(!l.au(o))p.push(o)
n=s.a0(p.length)
if(!(n>=0&&n<p.length))return A.b(p,n)
l.i(0,q,p[n])}return m.an()},
bN(a){var s
A.I(a)
s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
return s[a]==null},
gaa(){var s,r,q,p=A.e([],t.t)
for(s=this.w,r=s.length,q=0;q<4;++q){if(!(q<r))return A.b(s,q)
if(s[q]==null)p.push(q)}return p},
ga1(){var s=this,r=!1
if(!s.b)if(s.e.at<=0)if(!s.ax){r=s.z
r===$&&A.J()
r=r.gb6()&&B.a.S(s.gaa(),new A.d9(s))}return r},
b_(a){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
s=!1
if(q[a]==null)if(r.ga1()){q=r.z
q===$&&A.J()
q=q.ar(a)&&!r.at.T(0,a)}else q=s
else q=s
return q},
aq(a,b){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.aa("seat "+a+" is not a person"))
if(r.b)throw A.d(A.aa("drawing for the dealer"))
q=r.z
q===$&&A.J()
q.Z(b)
B.a.k(r.x,A.fi(b))
s=A.o(t.S,t.Q)
r.R(s,0)
r.X(s)
return s},
gaE(){var s,r,q,p,o,n,m=this,l=null
if(m.b)return l
s=m.z
s===$&&A.J()
r=s.r
switch(r.a){case 1:s=s.as
r=m.w
if(!(s>=0&&s<r.length))return A.b(r,s)
if(!(r[s]==null))s=l
return s
case 2:case 0:if(r===B.e){q=s.CW
q.toString
p=q}else p=((s.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
o=s.gaD()
if(o!=null){q=m.w
if(o>>>0!==o||o>=q.length)return A.b(q,o)
q=q[o]==null}else q=!1
if(q)return o
if(r===B.f&&s.ch.c!=null)return l
for(s=m.w,r=s.length,n=0;n<4;++n){if(((n&1)===0?B.b:B.c)===p){if(!(n<r))return A.b(s,n)
q=s[n]==null}else q=!1
if(q)return n}return l
case 3:case 4:return l}},
bS(a){var s,r,q,p,o,n=this
if(n.b){B.a.k(n.x,B.ab)
s=A.o(t.S,t.Q)
n.aS(s,n.aL())
n.X(s)
return s}if(n.gaE()==null&&n.ga1()){n.ax=!0
B.a.k(n.x,B.ac)
s=A.o(t.S,t.Q)
n.X(s)
if(s.a===0)n.R(s,0)
return s}r=n.gaE()
if(r==null)throw A.d(A.aa("nobody to wait for"))
q=n.z
q===$&&A.J()
s=n.aq(r,new A.cQ(B.C,n.y).b0(new A.bK(q,r)))
q=n.x
p=B.a.bP(q,new A.da(r))
if(!(p>=0&&p<q.length))return A.b(q,p)
o=A.eH(q[p],t.N,t.X)
o.i(0,"to",!0)
B.a.i(q,p,o)
if(a!=null&&n.z.r!==B.i&&n.bQ(r)>=a)n.a4(r).I(0,new A.db(s))
return s},
bQ(a){var s,r,q,p
for(s=this.x,r=A.D(s).h("bN<1>"),s=new A.bN(s,r),s=new A.a3(s,s.gm(0),r.h("a3<C.E>")),r=r.h("C.E"),q=0;s.n();){p=s.d
if(p==null)p=r.a(p)
if(!J.K(p.j(0,"s"),a))continue
if(!J.K(p.j(0,"to"),!0))break;++q}return q},
a4(a){var s,r,q=this
if(q.b)q.aK(q.r)
s=q.z
s===$&&A.J()
s.a4((a&1)===0?B.b:B.c)
B.a.k(q.x,A.a2(["t","forfeit","s",a],t.N,t.X))
r=A.o(t.S,t.Q)
q.R(r,0)
return r},
bC(a,b){var s,r,q,p,o,n,m=this
t.f.a(b)
s=b.j(0,"t")
A:{if("blind"===s){r=b.j(0,"i")
r.toString
A.I(r)
q=m.z
q===$&&A.J()
q=q.w
if(!(a>=0&&a<q.length))return A.b(q,a)
p=A.w(q[a],t.L)
if(r<0||r>=p.length)A.ak(A.aa("no card "+r))
if(!(r>=0&&r<p.length))return A.b(p,r)
r=m.aq(a,new A.G(p[r],!1,a))
break A}if("pick"===s){r=b.j(0,"i")
r.toString
A.I(r)
q=!0
if(m.b){o=m.w
if(!(a>=0&&a<o.length))return A.b(o,a)
if(o[a]==null){q=m.d
q=q.O(a)||r<0||r>=m.c.length||q.au(r)}}if(q)A.ak(A.aa("cannot draw "+r))
m.d.i(0,a,r)
B.a.k(m.x,A.a2(["t","pick","s",a,"i",r],t.N,t.X))
n=A.o(t.S,t.Q)
m.aO(n,0)
m.X(n)
r=n
break A}if("show"===s){if(!m.b_(a))A.ak(A.aa("nothing to show"))
r=m.z
r===$&&A.J()
r.aG(a)
B.a.k(m.x,A.a2(["t","show","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.R(n,0)
m.X(n)
r=n
break A}if("ready"===s){if(!m.b_(a))A.ak(A.aa("nothing to pass"))
m.at.k(0,a)
B.a.k(m.x,A.a2(["t","ready","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.X(n)
if(n.a===0)m.R(n,0)
r=n
break A}r=A.eH(b,t.N,t.X)
r.i(0,"s",a)
r=m.aq(a,A.fh(r))
break A}return r},
aS(a,b){var s,r,q=this
t.p.a(a)
s=b==null
r=s?q.r:b
q.aP(a,s?0:850,r,s)
q.aK(r)
q.R(a,s?1800:2800)},
X(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
t.p.a(a)
if(c.b){for(s=c.d,r=c.y,q=c.x,p=t.N,o=t.X,n=t.t,m=c.w,l=m.length,k=0;k<4;++k){if(!(k<l))return A.b(m,k)
if(m[k]==null||s.O(k))continue
j=A.e([],n)
for(i=0;i<c.c.length;++i)if(!s.au(i))j.push(i)
h=r.a0(j.length)
if(!(h>=0&&h<j.length))return A.b(j,h)
s.i(0,k,j[h])
B.a.k(q,A.a2(["t","pick","s",k,"i",s.j(0,k)],p,o))
c.aO(a,600)}if(s.a<4)return
c.aS(a,c.an())}for(s=c.x,r=c.w,q=r.length,p=c.y,o=c.Q,n=c.at,m=t.S,l=t.x;;){j=c.z
j===$&&A.J()
g=j.r
if(g===B.i)return
if(g===B.h){if(c.ga1())return
j=A.cn(c.z.dy,m,l)
f=j.gt(j)?2200:3500
c.z.af()
n.F(0)
c.ax=!1
B.a.k(s,B.ad)
c.R(a,f)
continue}e=c.bj()
if(e==null)return
f=o.e?1400:850
if(e>>>0!==e||e>=q)return A.b(r,e)
j=r[e]
j.toString
d=new A.cQ(j,p).b0(new A.bK(c.z,e))
c.z.Z(d)
B.a.k(s,A.fi(d))
c.R(a,f)}},
bj(){var s,r,q,p,o=this,n=null,m=o.z
m===$&&A.J()
s=m.r
switch(s.a){case 1:m=m.as
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.f&&m.ch.c!=null){m=m.gaD()
m.toString
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m}m=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)m.push(p)
if(B.a.S(m,o.gb3()))return n
return o.z.gaD()
case 3:case 4:return n}},
R(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
t.p.a(a4)
s=a3.Q
r=a3.z
r===$&&A.J()
r=r.d
s.Z(A.eg(r,a3.as,null,A.D(r).c))
a3.as=a3.z.d.length
for(r=a3.gaa(),q=r.length,p=a3.w,o=p.length,n=a3.gb3(),m=t.O,l=t.S,k=t.N,j=t.H,i=t.L,h=a3.at,g=0;g<r.length;r.length===q||(0,A.x)(r),++g){f=r[g]
e=a4.j(0,f)
if(e==null){e=A.e([],m)
a4.i(0,f,e)}d=a3.z
c=a3.b?new A.bS(A.o(l,k),A.a2([B.b,0,B.c,0],j,l)):s
b=a3.ga1()
if(!(f<o))return A.b(p,f)
a=!1
if(p[f]==null)if(a3.ga1()){a=a3.z
if(a.r===B.h)a0=a.dx||a.CW!=null
else a0=!1
a1=!1
if(a0)if(!a.dy.O(f)){a=a.w
if(!(f<a.length))return A.b(a,f)
a2=A.aG(a[f],!1,i)
a2.$flags=3
a=a2.length!==0}else a=a1
else a=a1
a=a&&!h.T(0,f)}J.e3(e,A.eT(d,f,a,a5,a3.b?a3.bo(f):null,n,b,c))}}}
A.d8.prototype={
$1(a){return!1},
$S:1}
A.d9.prototype={
$1(a){var s,r
A.I(a)
s=this.a
r=s.z
r===$&&A.J()
return r.ar(a)&&!s.at.T(0,a)},
$S:1}
A.da.prototype={
$1(a){return J.K(t.f.a(a).j(0,"s"),this.a)},
$S:19}
A.db.prototype={
$2(a,b){var s,r
A.I(a)
t.Q.a(b)
s=this.a
r=s.j(0,a)
if(r==null){r=A.e([],t.O)
s.i(0,a,r)
s=r}else s=r
return J.fF(s,b)},
$S:20}
A.aH.prototype={
Y(){return"ManilhaMode."+this.b}}
A.dA.prototype={
N(){var s,r=this,q=A.o(t.N,t.X)
q.i(0,"manilhas",r.c.b)
q.i(0,"coberta",r.w)
q.i(0,"ferro",r.x)
q.i(0,"verNoTruco",r.y)
q.i(0,"verNaMaoDeOnze",r.z)
q.i(0,"terceiraCarta",r.Q)
q.i(0,"tempo",r.as)
s=r.at
if(s>0)q.i(0,"lento",s)
return q},
E(a,b){var s
switch(this.c.a){case 0:if(b!=null&&a.a===B.y[(b.a.a+1)%10])return 10+a.b.a
break
case 1:s=B.a.aw(B.a7,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b6.prototype={
N(){var s,r=A.o(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.gab())
if(this.c)r.i(0,"x",!0)
return r}}
A.cM.prototype={
N(){var s,r,q,p=A.o(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q)o.push(s[q].N())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.au.prototype={
N(){var s,r,q,p,o,n,m,l,k,j,i=this,h=t.N,g=A.o(h,t.X)
g.i(0,"me",i.a)
g.i(0,"rules",i.b.N())
g.i(0,"phase",i.c.b)
g.i(0,"turn",i.d)
g.i(0,"dealer",i.e)
g.i(0,"foot",i.f)
g.i(0,"hand#",i.r)
s=i.w
if(s!=null)g.i(0,"vira",s.gab())
g.i(0,"value",i.x)
g.i(0,"level",i.y)
s=i.z
if(s!=null){r=A.e([s.a,s.b],t.t)
s=s.c
if(s!=null)r.push(s)
g.i(0,"pending",r)}s=i.Q
if(s!=null)g.i(0,"decision",s.b)
if(i.as)g.i(0,"iron",!0)
s=i.at
g.i(0,"scores",A.e([s.j(0,B.b),s.j(0,B.c)],t.e))
s=t.d
r=A.e([],s)
for(q=i.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.x)(q),++o)r.push(q[o].N())
g.i(0,"rounds",r)
s=A.e([],s)
for(r=i.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.x)(r),++o)s.push(r[o].N())
g.i(0,"plays",s)
s=t.s
r=A.e([],s)
for(q=i.ch,p=q.length,o=0;o<p;++o){n=q[o]
m=n.b.b
if(0>=m.length)return A.b(m,0)
r.push(n.a.c+m[0])}g.i(0,"hand",r)
g.i(0,"counts",i.CW)
r=i.cx
if(r!=null){q=A.e([],s)
for(p=r.length,o=0;o<r.length;r.length===p||(0,A.x)(r),++o){n=r[o]
m=n.b.b
if(0>=m.length)return A.b(m,0)
q.push(n.a.c+m[0])}g.i(0,"partner",q)}if(i.cy)g.i(0,"partnerRaise",!0)
if(i.db)g.i(0,"canCover",!0)
if(i.dx)g.i(0,"canRaise",!0)
if(i.dy)g.i(0,"mustAnswer",!0)
if(i.fr)g.i(0,"myTurn",!0)
r=i.fx
if(r!=null)g.i(0,"winner",r.b)
r=i.fy
if(r!=null)g.i(0,"wo",r.b)
r=i.go
if(r.gu(r)){q=A.o(h,t.a)
for(r=r.gH(),r=r.gq(r);r.n();){p=r.gp()
m=p.a
l=A.e([],s)
for(p=p.b,k=p.length,o=0;o<p.length;p.length===k||(0,A.x)(p),++o){n=p[o]
j=n.b.b
if(0>=j.length)return A.b(j,0)
l.push(n.a.c+j[0])}q.i(0,""+m,l)}g.i(0,"shown",q)}if(i.id)g.i(0,"reveal",!0)
if(i.k1)g.i(0,"canShow",!0)
s=i.k2
if(s.gu(s)){h=A.o(h,h)
for(s=s.gH(),s=s.gq(s);s.n();){r=s.gp()
h.i(0,""+r.a,r.b)}g.i(0,"speech",h)}h=i.k3
if(h!=null)g.i(0,"toast",h)
if(i.k4)g.i(0,"showLast",!0)
h=i.ok
if(h>0)g.i(0,"delay",h)
h=i.p1
if(h!=null)g.i(0,"draw",h.N())
return g}}
A.dq.prototype={
$1(a){var s,r=a.a,q=a.c
if(q){s=this.a
s=r!==s&&r!==B.d.D(s+2,4)}else s=!1
return new A.b6(r,s?null:a.b,q)},
$S:21}
A.d6.prototype={
N(){var s,r,q,p,o=this,n=t.N,m=A.o(n,t.X)
m.i(0,"n",o.a)
s=A.o(n,t.S)
for(r=o.b.gH(),r=r.gq(r);r.n();){q=r.gp()
s.i(0,""+q.a,q.b)}m.i(0,"p",s)
s=o.c
if(s.gu(s)){n=A.o(n,n)
for(s=s.gH(),s=s.gq(s);s.n();){r=s.gp()
q=r.a
r=r.b
p=r.b.b
if(0>=p.length)return A.b(p,0)
n.i(0,""+q,r.a.c+p[0])}m.i(0,"c",n)}n=o.d
if(n!=null)m.i(0,"d",n)
if(o.e)m.i(0,"to",!0)
if(o.f)m.i(0,"can",!0)
return m}}
A.bS.prototype={
Z(a){var s,r,q,p,o,n,m=this
t.B.a(a)
m.e=!1
for(s=a.$ti,r=new A.a3(a,a.gm(0),s.h("a3<C.E>")),s=s.h("C.E"),q=m.r,p=m.a;r.n();){o=r.d
if(o==null)o=s.a(o)
if(o instanceof A.b0){p.F(0)
m.b=null
m.d=!1
m.c=o.f
continue}if(o instanceof A.aX){m.c=m.e=m.d=!1
continue}if(o instanceof A.b7){p.i(0,o.a,o.c+"!")
continue}if(o instanceof A.bM){p.i(0,o.a,"Cai dentro!")
continue}if(o instanceof A.aB){n=o.a
p.i(0,n,o.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(o instanceof A.aZ){n=o.a
p.i(0,n,o.b?"Vamos jogar!":"Corro.")
continue}if(o instanceof A.b9){m.e=m.d=!0
continue}if(o instanceof A.ap){n=o.a
m.b=new A.c6(o.b,n)
continue}if(o instanceof A.aE){o=o.a
n=q.j(0,o)
n.toString
q.i(0,o,n+1)
continue}if(o instanceof A.aC){m.b=null
m.d=!1
continue}if(o instanceof A.aY)continue}},
bU(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.an.prototype={
Y(){return"GamePhase."+this.b}}
A.Z.prototype={}
A.G.prototype={
l(a){var s=this.b.l(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.O.prototype={
l(a){return"Raise("+this.a+")"}}
A.M.prototype={
l(a){return"Accept("+this.a+")"}}
A.S.prototype={
l(a){return"Fold("+this.a+")"}}
A.F.prototype={}
A.b0.prototype={}
A.aZ.prototype={}
A.aX.prototype={}
A.b7.prototype={}
A.bM.prototype={}
A.aB.prototype={}
A.b9.prototype={}
A.ap.prototype={}
A.aE.prototype={}
A.aY.prototype={}
A.aC.prototype={}
A.a4.prototype={}
A.bO.prototype={}
A.cJ.prototype={}
A.cq.prototype={
l(a){return"GameRuleError: "+this.a}}
A.dw.prototype={
gav(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.b(s,r)
return s[r]},
gaD(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.D(r+2,4):B.d.D(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.D(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.D(q+1,4)
default:return null}},
aH(a){return a.c?-1:this.a.E(a.b,this.y)},
af(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.h)throw A.d(A.aa("hand still in progress"));++j.f
j.e=B.d.D(j.e+1,4)
s=t.L
r=A.b2($.e2(),s)
B.a.ae(r,j.b)
q=t.ba
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.bb(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.x)(p),++m){l=A.aG(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.z){if(12>=r.length)return A.b(r,12)
r=r[12]}else r=null
j.y=r
B.a.F(j.z)
B.a.F(j.Q)
m=j.ax=0
j.ch=j.ay=null
r=j.dx=!1
j.dy.F(0)
j.at=j.as=B.d.D(j.e+1,4)
q=A.e([],t.c)
for(p=j.c,n=s.e;m<2;++m){k=B.a3[m]
if(p.j(0,k)===n)q.push(k)}p=q.length
n=p===2
j.cy=n
j.cx=n?s.x:r
s=p===1?B.a.ga6(q):null
j.CW=s
j.r=s!=null?B.e:B.k
r=j.y
q=j.cx
B.a.k(j.d,new A.b0(j.x,r,s,q))},
b4(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.CW)return B.m
return A.e([new A.M(a),new A.S(a)],t.u)
case 2:s=o.ch
if(n===((s.a&1)===0?B.b:B.c))return B.m
if(s.c===a)return B.m
s=A.e([new A.M(a),new A.S(a)],t.u)
if(o.ch.b+1<5)s.push(new A.O(a))
return s
case 1:if(a!==o.as)return B.m
s=A.e([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.G(r[p],!1,a))
if(o.ga9()){r=o.w
if(!(a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.G(r[p],!0,a))}if(o.aZ(a))s.push(new A.O(a))
return s
case 3:case 4:return B.m}},
ga9(){return this.a.w&&!this.cx&&this.z.length!==0},
aZ(a){var s=this,r=!1
if(s.r===B.k)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
Z(a){var s,r,q,p,o=this,n=a.a
if(!B.a.S(o.b4(n),new A.dz(a)))throw A.d(A.aa("illegal "+a.l(0)+" in "+o.r.l(0)))
A:{if(a instanceof A.G){o.bu(a)
break A}if(a instanceof A.O){o.dx=!0
s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cJ(n,p,null)
o.r=B.f
s=o.a.d
if(!(p<5))return A.b(s,p)
B.a.k(o.d,new A.b7(n,s[p],B.a4[p-1]))
break A}if(a instanceof A.M){o.be(n)
break A}if(a instanceof A.S)o.br(n)}},
be(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.aZ(a,!0))
q.r=B.k
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.k
if(!(r<5))return A.b(q.a.d,r)
B.a.k(q.d,new A.bM(a))},
br(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.k(o.d,new A.aZ(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.aj(s,B.a.gL(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cJ(r.a,r.b,a)
B.a.k(o.d,new A.aB(a,!0))
return}B.a.k(o.d,new A.aB(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.b(q,p)
o.aj(s,q[p])},
bu(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.b(s,r)
q=a.b
B.a.bR(s[r],q)
s=f.Q
p=a.c
B.a.k(s,new A.a4(r,q,p))
o=f.d
B.a.k(o,new A.aX(r,q,p))
r=s.length
if(r<4){f.as=B.d.D(f.as+1,4)
return}q=e.a=-2
for(p=f.a,n=0;n<s.length;s.length===r||(0,A.x)(s),++n,q=k){m=s[n]
l=m.c?-1:p.E(m.b,f.y)
k=Math.max(q,l)
e.a=k}r=A.D(s)
q=r.h("af<1>")
j=A.b2(new A.af(s,r.h("l(1)").a(new A.dx(e,f)),q),q.h("c.E"))
r=A.D(j)
i=new A.ad(j,r.h("H(1)").a(new A.dy()),r.h("ad<1,H>")).b8(0)
h=i.a===1?i.ga6(0):null
r=A.w(s,t.n)
q=B.a.gL(j).a
p=f.z
B.a.k(p,new A.bO(r,h,q))
B.a.F(s)
B.a.k(o,new A.b9(p.length))
g=A.ik(p)
if(g!=null)f.aj(g.a,f.gav())
else f.at=f.as=h==null?f.at:q},
aj(a,b){var s,r,q,p,o=this
o.ch=null
s=o.d
r=a==null
B.a.k(s,new A.ap(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.j(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.j(0,a)
r.toString
if(r>=q){o.db=a
o.r=B.i
B.a.k(s,new A.aE(a))
return}}o.r=B.h},
a4(a){var s,r,q=this
if(q.r===B.i)return
s=a===B.b?B.c:B.b
q.ch=null
q.fr=a
q.c.i(0,s,q.a.r)
q.db=s
q.r=B.i
r=q.d
B.a.k(r,new A.aC())
B.a.k(r,new A.aE(s))},
gb6(){if(this.r===B.h)var s=this.dx||this.CW!=null
else s=!1
return s},
ar(a){var s=!1
if(this.gb6())if(!this.dy.O(a)){s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
s=A.w(s[a],t.L).length!==0}return s},
aG(a){var s,r,q=this
if(!q.ar(a))throw A.d(A.aa("nothing to show"))
s=q.w
if(!(a>=0&&a<s.length))return A.b(s,a)
r=t.L
q.dy.i(0,a,A.w(A.w(s[a],r),r))
B.a.k(q.d,new A.aY())}}
A.dz.prototype={
$1(a){return A.hd(t.M.a(a),this.a)},
$S:0}
A.dx.prototype={
$1(a){return this.b.aH(t.n.a(a))===this.a.a},
$S:4}
A.dy.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:22}
A.bK.prototype={
ga_(){var s,r=this.a
if(r.cx)r=B.r
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.b(r,s)
s=A.w(r[s],t.L)
r=s}return r},
gaC(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gb5()
else q=!0
s=B.d.D(r+2,4)
p=l.w
if(!(s<p.length))return A.b(p,s)
o=t.L
n=A.w(p[s],o)
if(q)return n
if(k.Q&&l.e===r){r=l.x
if(!(s<r.length))return A.b(r,s)
o=A.w(r[s],o)
if(2>=o.length)return A.b(o,2)
m=o[2]
if(B.a.T(n,m))return A.e([m],t.Y)}return null},
gb5(){var s=this.a,r=!1
if(s.a.y)if(!s.cy)if(s.r===B.f){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbO(){var s,r,q,p,o,n,m=A.h6(this.ga_(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gaC()
if(k!=null)m.W(0,k)
for(k=A.w(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.w(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.H.prototype={
Y(){return"Team."+this.b}}
A.dY.prototype={
$1(a){return A.iw(A.ai(a))},
$S:23};(function aliases(){var s=J.ar.prototype
s.bc=s.l})();(function installTearOffs(){var s=hunkHelpers._instance_1u,r=hunkHelpers._static_1
s(A.a_.prototype,"gbE","O",6)
r(A,"ic","hJ",2)
s(A.cr.prototype,"gb3","bN",1)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.k,null)
q(A.k,[A.e9,J.ct,A.bP,J.ay,A.c,A.bm,A.q,A.am,A.v,A.dp,A.a3,A.bD,A.bY,A.aM,A.t,A.a6,A.b3,A.bn,A.aN,A.as,A.dB,A.dn,A.di,A.aF,A.bB,A.bA,A.a5,A.cV,A.d_,A.c8,A.cZ,A.c1,A.r,A.ce,A.cl,A.co,A.dF,A.cT,A.bQ,A.d7,A.B,A.bI,A.bb,A.cW,A.bd,A.cQ,A.Q,A.cr,A.dA,A.b6,A.cM,A.au,A.d6,A.bS,A.Z,A.F,A.a4,A.bO,A.cJ,A.cq,A.dw,A.bK])
q(J.ct,[J.cw,J.bs,J.bv,J.bu,J.bw,J.bt,J.b1])
q(J.bv,[J.ar,J.j,A.b4,A.bG])
q(J.ar,[J.cK,J.bV,J.aq])
r(J.cv,A.bP)
r(J.dc,J.j)
q(J.bt,[J.br,J.cx])
q(A.c,[A.bc,A.f,A.aI,A.af,A.bZ,A.c0,A.bf])
r(A.az,A.bc)
r(A.c_,A.az)
q(A.q,[A.aA,A.a_,A.cX])
q(A.am,[A.ck,A.d4,A.cj,A.cP,A.de,A.dU,A.dW,A.dl,A.du,A.dr,A.ds,A.dt,A.dv,A.e_,A.e0,A.d2,A.d3,A.dN,A.dO,A.d8,A.d9,A.da,A.dq,A.dz,A.dx,A.dy,A.dY])
q(A.ck,[A.d5,A.dd,A.dV,A.dj,A.dm,A.dG,A.dP,A.db])
q(A.v,[A.bz,A.bU,A.cy,A.cS,A.cN,A.cU,A.by,A.ch,A.al,A.bW,A.cR,A.ba,A.cm])
q(A.f,[A.C,A.U,A.bC,A.a1])
q(A.C,[A.bR,A.ad,A.bN,A.cY])
r(A.bq,A.aI)
q(A.a6,[A.be,A.aQ])
r(A.ag,A.be)
q(A.aQ,[A.ah,A.c6])
r(A.bg,A.b3)
r(A.aL,A.bg)
r(A.bo,A.aL)
r(A.R,A.bn)
q(A.as,[A.bp,A.c7])
r(A.ao,A.bp)
r(A.bJ,A.bU)
q(A.cP,[A.cO,A.aW])
r(A.bx,A.a_)
q(A.bG,[A.cA,A.b5])
q(A.b5,[A.c2,A.c4])
r(A.c3,A.c2)
r(A.bE,A.c3)
r(A.c5,A.c4)
r(A.bF,A.c5)
q(A.bE,[A.cB,A.cC])
q(A.bF,[A.cD,A.cE,A.cF,A.cG,A.cH,A.bH,A.cI])
r(A.c9,A.cU)
r(A.aO,A.c7)
r(A.cz,A.by)
r(A.df,A.cl)
q(A.co,[A.dh,A.dg])
r(A.dE,A.dF)
q(A.al,[A.b8,A.cs])
q(A.cT,[A.a9,A.V,A.P,A.aH,A.an,A.H])
q(A.cj,[A.dT,A.dS])
q(A.Z,[A.G,A.O,A.M,A.S])
q(A.F,[A.b0,A.aZ,A.aX,A.b7,A.bM,A.aB,A.b9,A.ap,A.aE,A.aY,A.aC])
s(A.c2,A.r)
s(A.c3,A.t)
s(A.c4,A.r)
s(A.c5,A.t)
s(A.bg,A.ce)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",m:"double",aU:"num",n:"String",l:"bool",bI:"Null",i:"List",k:"Object",A:"Map",z:"JSObject"},mangledNames:{},types:["l(Z)","l(a)","@(@)","~(k?,k?)","l(a4)","a()","l(k?)","@(@,n)","@(n)","~(@,@)","l(G)","i<a>(a)","l(+(a,a))","H(+(a,a))","l(P)","l(V)","l(F)","~(H,n)","l(Q)","l(A<n,k?>)","~(a,i<au>)","b6(a4)","H(a4)","n(n)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ag&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ah&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.c6&&a.b(c.a)&&b.b(c.b)}}
A.hy(v.typeUniverse,JSON.parse('{"aq":"ar","cK":"ar","bV":"ar","iE":"b4","cw":{"l":[],"p":[]},"bs":{"p":[]},"bv":{"z":[]},"ar":{"z":[]},"j":{"i":["1"],"f":["1"],"z":[],"c":["1"]},"cv":{"bP":[]},"dc":{"j":["1"],"i":["1"],"f":["1"],"z":[],"c":["1"]},"ay":{"y":["1"]},"bt":{"m":[],"aU":[]},"br":{"m":[],"a":[],"aU":[],"p":[]},"cx":{"m":[],"aU":[],"p":[]},"b1":{"n":[],"p":[]},"bc":{"c":["2"]},"bm":{"y":["2"]},"az":{"bc":["1","2"],"c":["2"],"c.E":"2"},"c_":{"az":["1","2"],"bc":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"aA":{"q":["3","4"],"A":["3","4"],"q.K":"3","q.V":"4"},"bz":{"v":[]},"f":{"c":["1"]},"C":{"f":["1"],"c":["1"]},"bR":{"C":["1"],"f":["1"],"c":["1"],"C.E":"1","c.E":"1"},"a3":{"y":["1"]},"aI":{"c":["2"],"c.E":"2"},"bq":{"aI":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"bD":{"y":["2"]},"ad":{"C":["2"],"f":["2"],"c":["2"],"C.E":"2","c.E":"2"},"af":{"c":["1"],"c.E":"1"},"bY":{"y":["1"]},"bZ":{"c":["1"],"c.E":"1"},"aM":{"y":["1"]},"bN":{"C":["1"],"f":["1"],"c":["1"],"C.E":"1","c.E":"1"},"ag":{"be":[],"a6":[]},"ah":{"aQ":[],"a6":[]},"c6":{"aQ":[],"a6":[]},"bo":{"aL":["1","2"],"bg":["1","2"],"b3":["1","2"],"ce":["1","2"],"A":["1","2"]},"bn":{"A":["1","2"]},"R":{"bn":["1","2"],"A":["1","2"]},"c0":{"c":["1"],"c.E":"1"},"aN":{"y":["1"]},"bp":{"as":["1"],"aK":["1"],"f":["1"],"c":["1"]},"ao":{"bp":["1"],"as":["1"],"aK":["1"],"f":["1"],"c":["1"]},"bJ":{"v":[]},"cy":{"v":[]},"cS":{"v":[]},"am":{"aD":[]},"cj":{"aD":[]},"ck":{"aD":[]},"cP":{"aD":[]},"cO":{"aD":[]},"aW":{"aD":[]},"cN":{"v":[]},"a_":{"q":["1","2"],"eb":["1","2"],"A":["1","2"],"q.K":"1","q.V":"2"},"U":{"f":["1"],"c":["1"],"c.E":"1"},"aF":{"y":["1"]},"bC":{"f":["1"],"c":["1"],"c.E":"1"},"bB":{"y":["1"]},"a1":{"f":["B<1,2>"],"c":["B<1,2>"],"c.E":"B<1,2>"},"bA":{"y":["B<1,2>"]},"bx":{"a_":["1","2"],"q":["1","2"],"eb":["1","2"],"A":["1","2"],"q.K":"1","q.V":"2"},"aQ":{"a6":[]},"be":{"a6":[]},"b4":{"z":[],"p":[]},"bG":{"z":[]},"cA":{"z":[],"p":[]},"b5":{"T":["1"],"z":[]},"bE":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"z":[],"c":["m"],"t":["m"]},"bF":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"]},"cB":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"z":[],"c":["m"],"t":["m"],"p":[],"r.E":"m","t.E":"m"},"cC":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"z":[],"c":["m"],"t":["m"],"p":[],"r.E":"m","t.E":"m"},"cD":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cE":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cF":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cG":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cH":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"bH":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cI":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"z":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cU":{"v":[]},"c9":{"v":[]},"c8":{"y":["1"]},"bf":{"c":["1"],"c.E":"1"},"aO":{"as":["1"],"aK":["1"],"f":["1"],"c":["1"]},"c1":{"y":["1"]},"q":{"A":["1","2"]},"b3":{"A":["1","2"]},"aL":{"bg":["1","2"],"b3":["1","2"],"ce":["1","2"],"A":["1","2"]},"as":{"aK":["1"],"f":["1"],"c":["1"]},"c7":{"as":["1"],"aK":["1"],"f":["1"],"c":["1"]},"cX":{"q":["n","@"],"A":["n","@"],"q.K":"n","q.V":"@"},"cY":{"C":["n"],"f":["n"],"c":["n"],"C.E":"n","c.E":"n"},"by":{"v":[]},"cz":{"v":[]},"m":{"aU":[]},"a":{"aU":[]},"i":{"f":["1"],"c":["1"]},"aK":{"f":["1"],"c":["1"]},"cT":{"b_":[]},"ch":{"v":[]},"bU":{"v":[]},"al":{"v":[]},"b8":{"v":[]},"cs":{"v":[]},"bW":{"v":[]},"cR":{"v":[]},"ba":{"v":[]},"cm":{"v":[]},"bQ":{"v":[]},"bb":{"hb":[]},"cW":{"ed":[]},"bd":{"ed":[]},"a9":{"b_":[]},"V":{"b_":[]},"P":{"b_":[]},"aH":{"b_":[]},"G":{"Z":[]},"ap":{"F":[]},"an":{"b_":[]},"O":{"Z":[]},"M":{"Z":[]},"S":{"Z":[]},"b0":{"F":[]},"aZ":{"F":[]},"aX":{"F":[]},"b7":{"F":[]},"bM":{"F":[]},"aB":{"F":[]},"b9":{"F":[]},"aE":{"F":[]},"aY":{"F":[]},"aC":{"F":[]},"H":{"b_":[]},"h0":{"i":["a"],"f":["a"],"c":["a"]},"hh":{"i":["a"],"f":["a"],"c":["a"]},"hg":{"i":["a"],"f":["a"],"c":["a"]},"fZ":{"i":["a"],"f":["a"],"c":["a"]},"he":{"i":["a"],"f":["a"],"c":["a"]},"h_":{"i":["a"],"f":["a"],"c":["a"]},"hf":{"i":["a"],"f":["a"],"c":["a"]},"fX":{"i":["m"],"f":["m"],"c":["m"]},"fY":{"i":["m"],"f":["m"],"c":["m"]}}'))
A.hx(v.typeUniverse,JSON.parse('{"b5":1,"c7":1,"cl":2,"co":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.ab
return{l:s("M"),q:s("a9"),L:s("Q"),J:s("R<n,k?>"),V:s("f<@>"),C:s("v"),r:s("S"),Z:s("aD"),M:s("Z"),E:s("F"),I:s("ao<V>"),A:s("ap"),B:s("c<F>"),bi:s("c<@>"),Y:s("j<Q>"),u:s("j<Z>"),c4:s("j<F>"),ba:s("j<i<Q>>"),bc:s("j<A<n,k>>"),d:s("j<A<n,k?>>"),c5:s("j<a4>"),cd:s("j<b6>"),w:s("j<+(a,a)>"),d2:s("j<bO>"),bP:s("j<cM>"),s:s("j<n>"),O:s("j<au>"),c:s("j<H>"),b:s("j<@>"),t:s("j<a>"),cG:s("j<a9?>"),v:s("j<H?>"),e:s("j<a?>"),T:s("bs"),m:s("z"),h:s("aq"),da:s("T<@>"),x:s("i<Q>"),U:s("i<Z>"),a:s("i<n>"),Q:s("i<au>"),j:s("i<@>"),aH:s("i<a>"),W:s("i<k?>"),aJ:s("aH"),G:s("A<@,@>"),f:s("A<n,k?>"),p:s("A<a,i<au>>"),P:s("bI"),K:s("k"),n:s("a4"),D:s("G"),aN:s("O"),al:s("P"),cY:s("iF"),cD:s("+()"),R:s("+(a,a)"),F:s("bO"),at:s("aK<n>"),N:s("n"),_:s("V"),H:s("H"),bW:s("p"),cr:s("bV"),db:s("bZ<G>"),ca:s("aM<ap>"),y:s("l"),i:s("m"),S:s("a"),ch:s("a9?"),cR:s("eD<bI>?"),z:s("z?"),k:s("i<@>?"),a5:s("A<@,@>?"),X:s("k?"),aD:s("n?"),bM:s("H?"),g:s("cZ?"),az:s("l?"),dd:s("m?"),a3:s("a?"),ae:s("aU?"),o:s("aU"),cQ:s("~(n,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.X=J.ct.prototype
B.a=J.j.prototype
B.d=J.br.prototype
B.p=J.bt.prototype
B.l=J.b1.prototype
B.Y=J.aq.prototype
B.Z=J.bv.prototype
B.J=J.cK.prototype
B.B=J.bV.prototype
B.n=new A.a9(0,"easy")
B.C=new A.a9(1,"medium")
B.o=new A.a9(2,"hard")
B.D=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.N=function() {
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
B.S=function(getTagFallback) {
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
B.O=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.R=function(hooks) {
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
B.Q=function(hooks) {
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
B.P=function(hooks) {
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
B.E=function(hooks) { return hooks; }

B.F=new A.df()
B.j=new A.dp()
B.T=new A.cW()
B.K=new A.P("A",7,"ace")
B.v=new A.V(1,"espadas")
B.G=new A.Q(B.K,B.v)
B.e=new A.an(0,"decision")
B.k=new A.an(1,"playing")
B.f=new A.an(2,"raisePending")
B.h=new A.an(3,"handOver")
B.i=new A.an(4,"gameOver")
B.a_=new A.dg(null)
B.a0=new A.dh(null)
B.u=new A.V(0,"ouros")
B.w=new A.V(2,"copas")
B.x=new A.V(3,"paus")
B.q=s([B.u,B.v,B.w,B.x],A.ab("j<V>"))
B.z=new A.aH(0,"vira")
B.a8=new A.aH(1,"fixed")
B.a1=s([B.z,B.a8],A.ab("j<aH>"))
B.a2=s([B.n,B.C,B.o],A.ab("j<a9>"))
B.b=new A.H(0,"a")
B.c=new A.H(1,"b")
B.a3=s([B.b,B.c],t.c)
B.a4=s(["Truco","Seis","Nove","Doze"],t.s)
B.r=s([],t.Y)
B.m=s([],t.u)
B.aE=s([],t.d)
B.a5=s([],t.b)
B.a6=s([1,3,6,9,12],t.t)
B.M=new A.P("4",0,"four")
B.aj=new A.P("5",1,"five")
B.L=new A.P("6",2,"six")
B.A=new A.P("7",3,"seven")
B.ak=new A.P("Q",4,"queen")
B.ah=new A.P("J",5,"jack")
B.ai=new A.P("K",6,"king")
B.al=new A.P("2",8,"two")
B.ag=new A.P("3",9,"three")
B.y=s([B.M,B.aj,B.L,B.A,B.ak,B.ah,B.ai,B.K,B.al,B.ag],A.ab("j<P>"))
B.U=new A.Q(B.A,B.u)
B.V=new A.Q(B.A,B.w)
B.W=new A.Q(B.M,B.x)
B.a7=s([B.U,B.G,B.V,B.W],t.Y)
B.af={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.ap=new A.ao([B.x,B.w],t.I)
B.ao=new A.ao([B.u,B.v],t.I)
B.aq=new A.ao([B.v,B.x],t.I)
B.ar=new A.ao([B.u,B.w],t.I)
B.a9=new A.R(B.af,[B.ap,B.ao,B.aq,B.ar],A.ab("R<n,aK<V>>"))
B.I={}
B.aa=new A.R(B.I,[],A.ab("R<a,Q>"))
B.H=new A.R(B.I,[],A.ab("R<a,i<k?>>"))
B.t={t:0}
B.ab=new A.R(B.t,["draw-end"],t.J)
B.ac=new A.R(B.t,["reveal-end"],t.J)
B.ad=new A.R(B.t,["next"],t.J)
B.ae=new A.R(B.t,["draw"],t.J)
B.am=new A.ag(B.b)
B.an=new A.ag(B.c)
B.as=A.a7("iA")
B.at=A.a7("iB")
B.au=A.a7("fX")
B.av=A.a7("fY")
B.aw=A.a7("fZ")
B.ax=A.a7("h_")
B.ay=A.a7("h0")
B.az=A.a7("k")
B.aA=A.a7("he")
B.aB=A.a7("hf")
B.aC=A.a7("hg")
B.aD=A.a7("hh")})();(function staticFields(){$.dD=null
$.X=A.e([],A.ab("j<k>"))
$.eM=null
$.eA=null
$.ez=null
$.fm=null
$.fj=null
$.fp=null
$.dM=null
$.dX=null
$.es=null
$.dH=A.e([],A.ab("j<i<k>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iD","fs",()=>A.dR("_$dart_dartClosure"))
s($,"iC","ex",()=>A.dR("_$dart_dartClosure_dartJSInterop"))
s($,"iR","fD",()=>A.e([new J.cv()],A.ab("j<bP>")))
s($,"iG","ft",()=>A.ae(A.dC({
toString:function(){return"$receiver$"}})))
s($,"iH","fu",()=>A.ae(A.dC({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iI","fv",()=>A.ae(A.dC(null)))
s($,"iJ","fw",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iM","fz",()=>A.ae(A.dC(void 0)))
s($,"iN","fA",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iL","fy",()=>A.ae(A.eU(null)))
s($,"iK","fx",()=>A.ae(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iP","fC",()=>A.ae(A.eU(void 0)))
s($,"iO","fB",()=>A.ae(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iQ","e1",()=>A.ev(B.az))
s($,"iS","e2",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.y[r]
for(p=0;p<4;++p)o.push(A.fM(q,B.q[p]))}return A.w(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b4,SharedArrayBuffer:A.b4,ArrayBufferView:A.bG,DataView:A.cA,Float32Array:A.cB,Float64Array:A.cC,Int16Array:A.cD,Int32Array:A.cE,Int8Array:A.cF,Uint16Array:A.cG,Uint32Array:A.cH,Uint8ClampedArray:A.bH,CanvasPixelArray:A.bH,Uint8Array:A.cI})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b5.$nativeSuperclassTag="ArrayBufferView"
A.c2.$nativeSuperclassTag="ArrayBufferView"
A.c3.$nativeSuperclassTag="ArrayBufferView"
A.bE.$nativeSuperclassTag="ArrayBufferView"
A.c4.$nativeSuperclassTag="ArrayBufferView"
A.c5.$nativeSuperclassTag="ArrayBufferView"
A.bF.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$2$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.it
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()