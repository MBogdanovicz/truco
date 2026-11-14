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
if(a[b]!==s){A.iz(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.eq(b)
return new s(c,this)}:function(){if(s===null)s=A.eq(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.eq(a).prototype
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
ev(a,b,c,d){return{i:a,p:b,e:c,x:d}},
er(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.et==null){A.io()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eW("Return interceptor for "+A.u(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dE
if(o==null)o=$.dE=A.dS(n)
p=q[o]}if(p!=null)return p
p=A.it(a)
if(p!=null)return p
if(typeof a=="function")return B.Y
s=Object.getPrototypeOf(a)
if(s==null)return B.J
if(s===Object.prototype)return B.J
if(typeof q=="function"){o=$.dE
if(o==null)o=$.dE=A.dS(n)
Object.defineProperty(q,o,{value:B.B,enumerable:false,writable:true,configurable:true})
return B.B}return B.B},
h3(a,b){if(a<0||a>4294967295)throw A.d(A.aJ(a,0,4294967295,"length",null))
return J.h4(new Array(a),b)},
e9(a,b){if(a<0)throw A.d(A.d1("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
e8(a,b){if(a<0)throw A.d(A.d1("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
h4(a,b){var s=A.e(a,b.h("j<0>"))
s.$flags=1
return s},
ax(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bs.prototype
return J.cx.prototype}if(typeof a=="string")return J.b1.prototype
if(a==null)return J.bt.prototype
if(typeof a=="boolean")return J.cw.prototype
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bx.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.k)return a
return J.er(a)},
dR(a){if(typeof a=="string")return J.b1.prototype
if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bx.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.k)return a
return J.er(a)},
bk(a){if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aq.prototype
if(typeof a=="symbol")return J.bx.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.k)return a
return J.er(a)},
K(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ax(a).C(a,b)},
a8(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.ir(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dR(a).j(a,b)},
fF(a,b,c){return J.bk(a).i(a,b,c)},
e4(a,b){return J.bk(a).k(a,b)},
fG(a,b){return J.bk(a).W(a,b)},
e5(a,b){return J.bk(a).H(a,b)},
ac(a){return J.ax(a).gv(a)},
fH(a){return J.dR(a).gt(a)},
fI(a){return J.bk(a).gu(a)},
ay(a){return J.bk(a).gq(a)},
d0(a){return J.dR(a).gm(a)},
fJ(a){return J.ax(a).gB(a)},
cg(a){return J.ax(a).l(a)},
ct:function ct(){},
cw:function cw(){},
bt:function bt(){},
bw:function bw(){},
ar:function ar(){},
cK:function cK(){},
bW:function bW(){},
aq:function aq(){},
bv:function bv(){},
bx:function bx(){},
j:function j(a){this.$ti=a},
cv:function cv(){},
dc:function dc(a){this.$ti=a},
az:function az(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bu:function bu(){},
bs:function bs(){},
cx:function cx(){},
b1:function b1(){}},A={ea:function ea(){},
fP(a,b,c){if(t.V.b(a))return new A.c0(a,b.h("@<0>").A(c).h("c0<1,2>"))
return new A.aA(a,b.h("@<0>").A(c).h("aA<1,2>"))},
h5(a){return new A.bA("Field '"+a+"' has not been initialized.")},
au(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
ei(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ib(a,b,c){return a},
eu(a){var s,r
for(s=$.X.length,r=0;r<s;++r)if(a===$.X[r])return!0
return!1},
eh(a,b,c,d){A.ef(b,"start")
if(c!=null){A.ef(c,"end")
if(b>c)A.ak(A.aJ(b,0,c,"start",null))}return new A.bS(a,b,c,d.h("bS<0>"))},
h9(a,b,c,d){if(t.V.b(a))return new A.br(a,b,c.h("@<0>").A(d).h("br<1,2>"))
return new A.aI(a,b,c.h("@<0>").A(d).h("aI<1,2>"))},
cu(){return new A.ba("No element")},
eF(){return new A.ba("Too many elements")},
bc:function bc(){},
bn:function bn(a,b){this.a=a
this.$ti=b},
aA:function aA(a,b){this.a=a
this.$ti=b},
c0:function c0(a,b){this.a=a
this.$ti=b},
aB:function aB(a,b){this.a=a
this.$ti=b},
d5:function d5(a,b){this.a=a
this.b=b},
d4:function d4(a){this.a=a},
bA:function bA(a){this.a=a},
dp:function dp(){},
f:function f(){},
D:function D(){},
bS:function bS(a,b,c,d){var _=this
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
br:function br(a,b,c){this.a=a
this.b=b
this.$ti=c},
bE:function bE(a,b,c){var _=this
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
bZ:function bZ(a,b,c){this.a=a
this.b=b
this.$ti=c},
c_:function c_(a,b){this.a=a
this.$ti=b},
aM:function aM(a,b){this.a=a
this.$ti=b},
t:function t(){},
bO:function bO(a,b){this.a=a
this.$ti=b},
cn(a,b,c){var s,r,q,p,o,n,m,l=A.h(a),k=A.as(new A.U(a,l.h("U<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.x)(k),++i,p=o){r=k[i]
c.a(a.j(0,r))
o=p+1
q[r]=p}n=A.as(new A.bD(a,l.h("bD<2>")),!0,c)
m=new A.N(q,n,b.h("@<0>").A(c).h("N<1,2>"))
m.$keys=k
return m}return new A.bp(A.h6(a,b,c),b.h("@<0>").A(c).h("bp<1,2>"))},
fV(){throw A.d(A.bY("Cannot modify constant Set"))},
fs(a){var s=A.fr(a)
if(s!=null)return s
return"minified:"+a},
ir(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
u(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.cg(a)
return s},
bM(a){var s,r=$.eN
if(r==null)r=$.eN=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cL(a){var s,r,q,p
if(a instanceof A.k)return A.W(A.aj(a),null)
s=J.ax(a)
if(s===B.X||s===B.Z||t.cr.b(a)){r=B.D(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.W(A.aj(a),null)},
eO(a){var s,r,q
if(a==null||typeof a=="number"||A.en(a))return J.cg(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.am)return a.l(0)
if(a instanceof A.a6)return a.b_(!0)
s=$.fE()
for(r=0;r<1;++r){q=s[r].bW(a)
if(q!=null)return q}return"Instance of '"+A.cL(a)+"'"},
O(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aZ(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aJ(a,0,1114111,null,null))},
b(a,b){if(a==null)J.d0(a)
throw A.d(A.fm(a,b))},
fm(a,b){var s,r="index"
if(!A.eo(b))return new A.al(!0,b,r,null)
s=J.d0(a)
if(b<0||b>=s)return A.e6(b,s,a,r)
return A.eQ(b,r)},
d(a){return A.L(a,new Error())},
L(a,b){var s
if(a==null)a=new A.bV()
b.dartException=a
s=A.iA
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iA(){return J.cg(this.dartException)},
ak(a,b){throw A.L(a,b==null?new Error():b)},
bm(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.ak(A.hL(a,b,c),s)},
hL(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.bX("'"+s+"': Cannot "+o+" "+l+k+n)},
x(a){throw A.d(A.Y(a))},
ae(a){var s,r,q,p,o,n
a=A.iw(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.e([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.dC(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dD(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
eV(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
eb(a,b){var s=b==null,r=s?null:b.method
return new A.cy(a,r,s?null:b.receiver)},
ex(a){if(a==null)return new A.dn(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aV(a,a.dartException)
return A.ia(a)},
aV(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
ia(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aZ(r,16)&8191)===10)switch(q){case 438:return A.aV(a,A.eb(A.u(s)+" (Error "+q+")",null))
case 445:case 5007:A.u(s)
return A.aV(a,new A.bK())}}if(a instanceof TypeError){p=$.fu()
o=$.fv()
n=$.fw()
m=$.fx()
l=$.fA()
k=$.fB()
j=$.fz()
$.fy()
i=$.fD()
h=$.fC()
g=p.R(s)
if(g!=null)return A.aV(a,A.eb(A.ai(s),g))
else{g=o.R(s)
if(g!=null){g.method="call"
return A.aV(a,A.eb(A.ai(s),g))}else if(n.R(s)!=null||m.R(s)!=null||l.R(s)!=null||k.R(s)!=null||j.R(s)!=null||m.R(s)!=null||i.R(s)!=null||h.R(s)!=null){A.ai(s)
return A.aV(a,new A.bK())}}return A.aV(a,new A.cS(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bR()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aV(a,new A.al(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bR()
return a},
ew(a){if(a==null)return J.ac(a)
if(typeof a=="object")return A.bM(a)
return J.ac(a)},
ic(a){if(typeof a=="number")return B.q.gv(a)
if(a instanceof A.d_)return A.bM(a)
if(a instanceof A.a6)return a.gv(a)
return A.ew(a)},
ih(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
fU(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cO().constructor.prototype):Object.create(new A.aW(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.eD(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fQ(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.eD(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fQ(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fL)}throw A.d("Error in functionType of tearoff")},
fR(a,b,c,d){var s=A.eC
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
eD(a,b,c,d){if(c)return A.fT(a,b,d)
return A.fR(b.length,d,a,b)},
fS(a,b,c,d){var s=A.eC,r=A.fM
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
fT(a,b,c){var s,r
if($.eA==null)$.eA=A.ez("interceptor")
if($.eB==null)$.eB=A.ez("receiver")
s=b.length
r=A.fS(s,c,a,b)
return r},
eq(a){return A.fU(a)},
fL(a,b){return A.ce(v.typeUniverse,A.aj(a.a),b)},
eC(a){return a.a},
fM(a){return a.b},
ez(a){var s,r,q,p=new A.aW("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.d1("Field name "+a+" not found."))},
dS(a){return v.getIsolateTag(a)},
it(a){var s,r,q,p,o,n=A.ai($.fn.$1(a)),m=$.dN[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dY[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.fb($.fk.$2(a,n))
if(q!=null){m=$.dN[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dY[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.e_(s)
$.dN[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dY[n]=s
return s}if(p==="-"){o=A.e_(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fp(a,s)
if(p==="*")throw A.d(A.eW(n))
if(v.leafTags[n]===true){o=A.e_(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fp(a,s)},
fp(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.ev(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
e_(a){return J.ev(a,!1,null,!!a.$iT)},
iv(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.e_(s)
else return J.ev(s,c,null,null)},
io(){if(!0===$.et)return
$.et=!0
A.ip()},
ip(){var s,r,q,p,o,n,m,l
$.dN=Object.create(null)
$.dY=Object.create(null)
A.im()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.fq.$1(o)
if(n!=null){m=A.iv(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
im(){var s,r,q,p,o,n,m=B.N()
m=A.bj(B.O,A.bj(B.P,A.bj(B.E,A.bj(B.E,A.bj(B.Q,A.bj(B.R,A.bj(B.S(B.D),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fn=new A.dV(p)
$.fk=new A.dW(o)
$.fq=new A.dX(n)},
bj(a,b){return a(b)||b},
ie(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
iw(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ag:function ag(a){this.a=a},
ah:function ah(a,b){this.a=a
this.b=b},
c7:function c7(a,b){this.a=a
this.b=b},
bp:function bp(a,b){this.a=a
this.$ti=b},
bo:function bo(){},
N:function N(a,b,c){this.a=a
this.b=b
this.$ti=c},
c1:function c1(a,b){this.a=a
this.$ti=b},
aN:function aN(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bq:function bq(){},
ao:function ao(a,b){this.a=a
this.$ti=b},
bQ:function bQ(){},
dC:function dC(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bK:function bK(){},
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
aG:function aG(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bD:function bD(a,b){this.a=a
this.$ti=b},
bC:function bC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
a2:function a2(a,b){this.a=a
this.$ti=b},
bB:function bB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
by:function by(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
dV:function dV(a){this.a=a},
dW:function dW(a){this.a=a},
dX:function dX(a){this.a=a},
a6:function a6(){},
aQ:function aQ(){},
be:function be(){},
b4:function b4(){},
bH:function bH(){},
cA:function cA(){},
b5:function b5(){},
bF:function bF(){},
bG:function bG(){},
cB:function cB(){},
cC:function cC(){},
cD:function cD(){},
cE:function cE(){},
cF:function cF(){},
cG:function cG(){},
cH:function cH(){},
bI:function bI(){},
cI:function cI(){},
c3:function c3(){},
c4:function c4(){},
c5:function c5(){},
c6:function c6(){},
eg(a,b){var s=b.c
return s==null?b.c=A.cc(a,"eE",[b.x]):s},
eR(a){var s=a.w
if(s===6||s===7)return A.eR(a.x)
return s===11||s===12},
hb(a){return a.as},
ab(a){return A.dJ(v.typeUniverse,a,!1)},
aR(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aR(a1,s,a3,a4)
if(r===s)return a2
return A.f3(a1,r,!0)
case 7:s=a2.x
r=A.aR(a1,s,a3,a4)
if(r===s)return a2
return A.f2(a1,r,!0)
case 8:q=a2.y
p=A.bi(a1,q,a3,a4)
if(p===q)return a2
return A.cc(a1,a2.x,p)
case 9:o=a2.x
n=A.aR(a1,o,a3,a4)
m=a2.y
l=A.bi(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ek(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bi(a1,j,a3,a4)
if(i===j)return a2
return A.f4(a1,k,i)
case 11:h=a2.x
g=A.aR(a1,h,a3,a4)
f=a2.y
e=A.i7(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.f1(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bi(a1,d,a3,a4)
o=a2.x
n=A.aR(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.el(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.ci("Attempted to substitute unexpected RTI kind "+a0))}},
bi(a,b,c,d){var s,r,q,p,o=b.length,n=A.dK(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aR(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
i8(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dK(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aR(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
i7(a,b,c,d){var s,r=b.a,q=A.bi(a,r,c,d),p=b.b,o=A.bi(a,p,c,d),n=b.c,m=A.i8(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cV()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
fl(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ik(s)
return a.$S()}return null},
iq(a,b){var s
if(A.eR(b))if(a instanceof A.am){s=A.fl(a)
if(s!=null)return s}return A.aj(a)},
aj(a){if(a instanceof A.k)return A.h(a)
if(Array.isArray(a))return A.E(a)
return A.em(J.ax(a))},
E(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
h(a){var s=a.$ti
return s!=null?s:A.em(a)},
em(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hS(a,s)},
hS(a,b){var s=a instanceof A.am?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hA(v.typeUniverse,s.name)
b.$ccache=r
return r},
ik(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dJ(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
ij(a){return A.aS(A.h(a))},
ep(a){var s
if(a instanceof A.a6)return A.ig(a.$r,a.an())
s=a instanceof A.am?A.fl(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fJ(a).a
if(Array.isArray(a))return A.E(a)
return A.aj(a)},
aS(a){var s=a.r
return s==null?a.r=new A.d_(a):s},
ig(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.b(q,0)
s=A.ce(v.typeUniverse,A.ep(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.b(q,r)
s=A.f6(v.typeUniverse,s,A.ep(q[r]))}return A.ce(v.typeUniverse,s,a)},
a7(a){return A.aS(A.dJ(v.typeUniverse,a,!1))},
hR(a){var s=this
s.b=A.i6(s)
return s.b(a)},
i6(a){var s,r,q,p,o
if(a===t.K)return A.hY
if(A.aT(a))return A.i1
s=a.w
if(s===6)return A.hP
if(s===1)return A.fg
if(s===7)return A.hT
r=A.i5(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aT)){a.f="$i"+q
if(q==="i")return A.hW
if(a===t.m)return A.hV
return A.i0}}else if(s===10){p=A.ie(a.x,a.y)
o=p==null?A.fg:p
return o==null?A.fa(o):o}return A.hN},
i5(a){if(a.w===8){if(a===t.S)return A.eo
if(a===t.i||a===t.o)return A.hX
if(a===t.N)return A.i_
if(a===t.y)return A.en}return null},
hQ(a){var s=this,r=A.hM
if(A.aT(s))r=A.hI
else if(s===t.K)r=A.fa
else if(A.bl(s)){r=A.hO
if(s===t.a3)r=A.f9
else if(s===t.aD)r=A.fb
else if(s===t.az)r=A.bh
else if(s===t.ae)r=A.dL
else if(s===t.dd)r=A.hE
else if(s===t.z)r=A.hG}else if(s===t.S)r=A.J
else if(s===t.N)r=A.ai
else if(s===t.y)r=A.hC
else if(s===t.o)r=A.hH
else if(s===t.i)r=A.hD
else if(s===t.m)r=A.hF
s.a=r
return s.a(a)},
hN(a){var s=this
if(a==null)return A.bl(s)
return A.is(v.typeUniverse,A.iq(a,s),s)},
hP(a){if(a==null)return!0
return this.x.b(a)},
i0(a){var s,r=this
if(a==null)return A.bl(r)
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.ax(a)[s]},
hW(a){var s,r=this
if(a==null)return A.bl(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.ax(a)[s]},
hV(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.k)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
ff(a){if(typeof a=="object"){if(a instanceof A.k)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hM(a){var s=this
if(a==null){if(A.bl(s))return a}else if(s.b(a))return a
throw A.L(A.fc(a,s),new Error())},
hO(a){var s=this
if(a==null||s.b(a))return a
throw A.L(A.fc(a,s),new Error())},
fc(a,b){return new A.ca("TypeError: "+A.eX(a,A.W(b,null)))},
eX(a,b){return A.cp(a)+": type '"+A.W(A.ep(a),null)+"' is not a subtype of type '"+b+"'"},
a1(a,b){return new A.ca("TypeError: "+A.eX(a,b))},
hT(a){var s=this
return s.x.b(a)||A.eg(v.typeUniverse,s).b(a)},
hY(a){return a!=null},
fa(a){if(a!=null)return a
throw A.L(A.a1(a,"Object"),new Error())},
i1(a){return!0},
hI(a){return a},
fg(a){return!1},
en(a){return!0===a||!1===a},
hC(a){if(!0===a)return!0
if(!1===a)return!1
throw A.L(A.a1(a,"bool"),new Error())},
bh(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.L(A.a1(a,"bool?"),new Error())},
hD(a){if(typeof a=="number")return a
throw A.L(A.a1(a,"double"),new Error())},
hE(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a1(a,"double?"),new Error())},
eo(a){return typeof a=="number"&&Math.floor(a)===a},
J(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.L(A.a1(a,"int"),new Error())},
f9(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.L(A.a1(a,"int?"),new Error())},
hX(a){return typeof a=="number"},
hH(a){if(typeof a=="number")return a
throw A.L(A.a1(a,"num"),new Error())},
dL(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a1(a,"num?"),new Error())},
i_(a){return typeof a=="string"},
ai(a){if(typeof a=="string")return a
throw A.L(A.a1(a,"String"),new Error())},
fb(a){if(typeof a=="string")return a
if(a==null)return a
throw A.L(A.a1(a,"String?"),new Error())},
hF(a){if(A.ff(a))return a
throw A.L(A.a1(a,"JSObject"),new Error())},
hG(a){if(a==null)return a
if(A.ff(a))return a
throw A.L(A.a1(a,"JSObject?"),new Error())},
fh(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.W(a[q],b)
return s},
i4(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.fh(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.W(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
fd(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(l===8){p=A.i9(a.x)
o=a.y
return o.length>0?p+("<"+A.fh(o,b)+">"):p}if(l===10)return A.i4(a,b)
if(l===11)return A.fd(a,b,null)
if(l===12)return A.fd(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.b(b,n)
return b[n]}return"?"},
i9(a){var s=A.fr(a)
if(s!=null)return s
return"minified:"+a},
hB(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hA(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dJ(a,b,!1)
else if(typeof m=="number"){s=m
r=A.cd(a,5,"#")
q=A.dK(s)
for(p=0;p<s;++p)q[p]=r
o=A.cc(a,b,q)
n[b]=o
return o}else return m},
hz(a,b){return A.f7(a.tR,b)},
hy(a,b){return A.f7(a.eT,b)},
dJ(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.f5(a,null,b,!1)
r.set(b,s)
return s},
ce(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.f5(a,b,c,!0)
q.set(c,r)
return r},
f6(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ek(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
f5(a,b,c,d){return A.hr(A.hl(a,b,c,d))},
aw(a,b){b.a=A.hQ
b.b=A.hR
return b},
cd(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a5(null,null)
s.w=b
s.as=c
r=A.aw(a,s)
a.eC.set(c,r)
return r},
f3(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hw(a,b,r,c)
a.eC.set(r,s)
return s},
hw(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aT(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bl(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a5(null,null)
q.w=6
q.x=b
q.as=c
return A.aw(a,q)},
f2(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.hu(a,b,r,c)
a.eC.set(r,s)
return s},
hu(a,b,c,d){var s,r
if(d){s=b.w
if(A.aT(b)||b===t.K)return b
else if(s===1)return A.cc(a,"eE",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.a5(null,null)
r.w=7
r.x=b
r.as=c
return A.aw(a,r)},
hx(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a5(null,null)
s.w=13
s.x=b
s.as=q
r=A.aw(a,s)
a.eC.set(q,r)
return r},
cb(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
ht(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
cc(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.cb(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a5(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.aw(a,r)
a.eC.set(p,q)
return q},
ek(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.cb(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a5(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.aw(a,o)
a.eC.set(q,n)
return n},
f4(a,b,c){var s,r,q="+"+(b+"("+A.cb(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a5(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.aw(a,s)
a.eC.set(q,r)
return r},
f1(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.cb(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.cb(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.ht(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a5(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.aw(a,p)
a.eC.set(r,o)
return o},
el(a,b,c,d){var s,r=b.as+("<"+A.cb(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hv(a,b,c,r,d)
a.eC.set(r,s)
return s},
hv(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dK(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aR(a,b,r,0)
m=A.bi(a,c,r,0)
return A.el(a,n,m,c!==m)}}l=new A.a5(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.aw(a,l)},
hl(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hr(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.hn(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eZ(a,r,l,k,!1)
else if(q===46)r=A.eZ(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aP(a.u,a.e,k.pop()))
break
case 94:k.push(A.hx(a.u,k.pop()))
break
case 35:k.push(A.cd(a.u,5,"#"))
break
case 64:k.push(A.cd(a.u,2,"@"))
break
case 126:k.push(A.cd(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.hp(a,k)
break
case 38:A.ho(a,k)
break
case 63:p=a.u
k.push(A.f3(p,A.aP(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.f2(p,A.aP(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.hm(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.f_(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.hs(a.u,a.e,o)
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
hn(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eZ(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hB(s,o.x)[p]
if(n==null)A.ak('No "'+p+'" in "'+A.hb(o)+'"')
d.push(A.ce(s,o,n))}else d.push(p)
return m},
hp(a,b){var s,r=a.u,q=A.eY(a,b),p=b.pop()
if(typeof p=="string")b.push(A.cc(r,p,q))
else{s=A.aP(r,a.e,p)
switch(s.w){case 11:b.push(A.el(r,s,q,a.n))
break
default:b.push(A.ek(r,s,q))
break}}},
hm(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eY(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aP(p,a.e,o)
q=new A.cV()
q.a=s
q.b=n
q.c=m
b.push(A.f1(p,r,q))
return
case-4:b.push(A.f4(p,b.pop(),s))
return
default:throw A.d(A.ci("Unexpected state under `()`: "+A.u(o)))}},
ho(a,b){var s=b.pop()
if(0===s){b.push(A.cd(a.u,1,"0&"))
return}if(1===s){b.push(A.cd(a.u,4,"1&"))
return}throw A.d(A.ci("Unexpected extended operation "+A.u(s)))},
eY(a,b){var s=b.splice(a.p)
A.f_(a.u,a.e,s)
a.p=b.pop()
return s},
aP(a,b,c){if(typeof c=="string")return A.cc(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hq(a,b,c)}else return c},
f_(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aP(a,b,c[s])},
hs(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aP(a,b,c[s])},
hq(a,b,c){var s,r,q=b.w
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
is(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.F(a,b,null,c,null)
r.set(c,s)}return s},
F(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aT(d))return!0
s=b.w
if(s===4)return!0
if(A.aT(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.F(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.F(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.F(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.F(a,b.x,c,d,e))return!1
return A.F(a,A.eg(a,b),c,d,e)}if(s===6)return A.F(a,p,c,d,e)&&A.F(a,b.x,c,d,e)
if(q===7){if(A.F(a,b,c,d.x,e))return!0
return A.F(a,b,c,A.eg(a,d),e)}if(q===6)return A.F(a,b,c,p,e)||A.F(a,b,c,d.x,e)
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
if(!A.F(a,j,c,i,e)||!A.F(a,i,e,j,c))return!1}return A.fe(a,b.x,c,d.x,e)}if(q===11){if(b===t.h)return!0
if(p)return!1
return A.fe(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hU(a,b,c,d,e)}if(o&&q===10)return A.hZ(a,b,c,d,e)
return!1},
fe(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.F(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.F(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.F(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.F(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.F(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
hU(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.ce(a,b,r[o])
return A.f8(a,p,null,c,d.y,e)}return A.f8(a,b.y,null,c,d.y,e)},
f8(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.F(a,b[s],d,e[s],f))return!1
return!0},
hZ(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.F(a,r[s],c,q[s],e))return!1
return!0},
bl(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aT(a))if(s!==6)r=s===7&&A.bl(a.x)
return r},
aT(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
f7(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dK(a){return a>0?new Array(a):v.typeUniverse.sEA},
a5:function a5(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cV:function cV(){this.c=this.b=this.a=null},
d_:function d_(a){this.a=a},
cU:function cU(){},
ca:function ca(a){this.a=a},
f0(a,b,c){return 0},
c9:function c9(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
bf:function bf(a,b){this.a=a
this.$ti=b},
eH(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
a0(a,b,c){return b.h("@<0>").A(c).h("ec<1,2>").a(A.ih(a,new A.a_(b.h("@<0>").A(c).h("a_<1,2>"))))},
o(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
eJ(a){return new A.aO(a.h("aO<0>"))},
dk(a){return new A.aO(a.h("aO<0>"))},
ej(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
h6(a,b,c){var s=A.eH(b,c)
a.J(0,new A.dj(s,b,c))
return s},
eI(a,b,c){var s=A.eH(b,c)
s.W(0,a)
return s},
h7(a,b){var s=A.eJ(b)
s.W(0,a)
return s},
ed(a){var s,r
if(A.eu(a))return"{...}"
s=new A.bb("")
try{r={}
B.a.k($.X,a)
s.a+="{"
r.a=!0
a.J(0,new A.dm(r,s))
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
c2:function c2(a,b,c){var _=this
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
cf:function cf(){},
b3:function b3(){},
aL:function aL(a,b){this.a=a
this.$ti=b},
at:function at(){},
c8:function c8(){},
bg:function bg(){},
i3(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ex(r)
q=String(s)
throw A.d(new A.d7(q))}q=A.dM(p)
return q},
dM(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cX(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dM(a[s])
return a},
eG(a,b,c){return new A.bz(a,b)},
hK(a){return a.O()},
hj(a,b){return new A.dF(a,[],A.id())},
hk(a,b,c){var s,r=new A.bb(""),q=A.hj(r,b)
q.ad(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cX:function cX(a,b){this.a=a
this.b=b
this.c=null},
cY:function cY(a){this.a=a},
cl:function cl(){},
co:function co(){},
bz:function bz(a,b){this.a=a
this.b=b},
cz:function cz(a,b){this.a=a
this.b=b},
df:function df(){},
dh:function dh(a){this.b=a},
dg:function dg(a){this.a=a},
dG:function dG(){},
dH:function dH(a,b){this.a=a
this.b=b},
dF:function dF(a,b,c){this.c=a
this.a=b
this.b=c},
eK(a,b,c,d){var s,r=c?J.e9(a,d):J.h3(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
as(a,b,c){var s,r=A.e([],c.h("j<0>"))
for(s=J.ay(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
b2(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("j<0>"))
s=A.e([],b.h("j<0>"))
for(r=J.ay(a);r.n();)B.a.k(s,r.gp())
return s},
h8(a,b,c){var s,r=J.e9(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
v(a,b){var s=A.as(a,!1,b)
s.$flags=3
return s},
eT(a,b,c){var s=J.ay(b)
if(!s.n())return a
if(c.length===0){do a+=A.u(s.gp())
while(s.n())}else{a+=A.u(s.gp())
while(s.n())a=a+c+A.u(s.gp())}return a},
fX(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fK(b,"name","No enum value with that name"))},
fW(a,b){var s,r,q=A.o(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cp(a){if(typeof a=="number"||A.en(a)||a==null)return J.cg(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eO(a)},
ci(a){return new A.ch(a)},
d1(a){return new A.al(!1,null,null,a)},
fK(a,b,c){return new A.al(!0,a,b,c)},
eP(a){var s=null
return new A.b8(s,s,!1,s,s,a)},
eQ(a,b){return new A.b8(null,null,!0,a,b,"Value not in range")},
aJ(a,b,c,d,e){return new A.b8(b,c,!0,a,d,"Invalid value")},
ha(a,b,c){if(0>a||a>c)throw A.d(A.aJ(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aJ(b,a,c,"end",null))
return b}return c},
ef(a,b){if(a<0)throw A.d(A.aJ(a,0,null,b,null))
return a},
e6(a,b,c,d){return new A.cs(b,!0,a,d,"Index out of range")},
bY(a){return new A.bX(a)},
eW(a){return new A.cR(a)},
eS(a){return new A.ba(a)},
Y(a){return new A.cm(a)},
h2(a,b,c){var s,r
if(A.eu(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.k($.X,a)
try{A.i2(a,s)}finally{if(0>=$.X.length)return A.b($.X,-1)
$.X.pop()}r=A.eT(b,t.bi.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
e7(a,b,c){var s,r
if(A.eu(a))return b+"..."+c
s=new A.bb(b)
B.a.k($.X,a)
try{r=s
r.a=A.eT(r.a,a,", ")}finally{if(0>=$.X.length)return A.b($.X,-1)
$.X.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
i2(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
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
eL(a,b,c,d,e){return new A.aB(a,b.h("@<0>").A(c).A(d).A(e).h("aB<1,2,3,4>"))},
eM(a,b,c,d){var s
if(B.k===c){s=B.d.gv(a)
b=J.ac(b)
return A.ei(A.au(A.au($.e2(),s),b))}if(B.k===d){s=B.d.gv(a)
b=J.ac(b)
c=J.ac(c)
return A.ei(A.au(A.au(A.au($.e2(),s),b),c))}s=B.d.gv(a)
b=J.ac(b)
c=J.ac(c)
d=J.ac(d)
d=A.ei(A.au(A.au(A.au(A.au($.e2(),s),b),c),d))
return d},
cT:function cT(){},
w:function w(){},
ch:function ch(a){this.a=a},
bV:function bV(){},
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
bX:function bX(a){this.a=a},
cR:function cR(a){this.a=a},
ba:function ba(a){this.a=a},
cm:function cm(a){this.a=a},
bR:function bR(){},
d7:function d7(a){this.a=a},
c:function c(){},
C:function C(a,b,c){this.a=a
this.b=b
this.$ti=c},
bJ:function bJ(){},
k:function k(){},
bb:function bb(a){this.a=a},
cW:function cW(){},
bd:function bd(){this.b=this.a=0},
iy(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b2(a1,t.bM),c=A.b2(a,t.R)
for(s=A.E(c),r=s.h("l(1)"),s=s.h("af<1>"),q=s.h("c.E"),p=b,o=a2;;){n={}
m=A.fo(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.b(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.aA(k,p.b)
p=null}else j=A.es(k,c,d,o)
k.$flags&1&&A.bm(k,"removeAt",1)
if(j<0||j>=k.length)A.ak(A.eQ(j,null))
B.a.k(c,new A.ah(o,k.splice(j,1)[0]))
o=B.d.D(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.b2(new A.af(c,r.a(new A.e0(n)),s),q)
l=A.E(f)
e=new A.ad(f,l.h("I(1)").a(new A.e1()),l.h("ad<1,I>")).b8(0)
B.a.k(d,e.a===1?e.ga6(0):null)
o=B.a.gN(f).a
B.a.F(c)}},
es(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.dU(a)
if(a.length===1)return 0
s=(d&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gN(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?new A.dT(a).$0():f.$0()
return f.$0()}for(p=-2,o=-2,n=0;n<q;++n){m=b[n]
l=m.b
if(((m.a&1)===0?B.b:B.c)===s)o=Math.max(o,l)
else p=Math.max(p,l)}if(q===1)q=((B.a.gN(b).a&1)===0?B.b:B.c)!==s
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
if(c.length!==0&&B.a.gN(c)===s){g=B.a.aA(a,p)
if(g>=0)return g}return f.$0()},
a9:function a9(a,b){this.a=a
this.b=b},
cQ:function cQ(a,b){this.a=a
this.b=b},
dv:function dv(){},
dr:function dr(){},
ds:function ds(){},
dt:function dt(a){this.a=a},
du:function du(a,b){this.a=a
this.b=b},
dw:function dw(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
e0:function e0(a){this.a=a},
e1:function e1(){},
dU:function dU(a){this.a=a},
dT:function dT(a){this.a=a},
fN(a,b){return new A.R(a,b)},
fO(a){return new A.R(B.a.b3(B.y,new A.d2(a)),B.a.b3(B.r,new A.d3(a)))},
V:function V(a,b){this.a=a
this.b=b},
Q:function Q(a,b,c){this.c=a
this.a=b
this.b=c},
R:function R(a,b){this.a=a
this.b=b},
d2:function d2(a){this.a=a},
d3:function d3(a){this.a=a},
ii(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.o(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.dk(s))
if(B.a.S(a7,new A.dO()))return a6
q=new A.dQ(a6)
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
break A}f=g instanceof A.aC
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
if(a.length===3&&B.a.aw(a,new A.dP()))a6.j(0,r).k(0,"game_666")
b=A.dk(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.x)(a),++a1){a2=a[a1]
if(a8.E(a2,d)>=10){a3=a8.E(a2,d)-10
if(!(a3>=0&&a3<4))return A.b(B.r,a3)
b.k(0,B.r[a3])}}for(a0=B.a9.gI(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.bE(a3.b))a6.j(0,r).k(0,a4)}}break A}if(g instanceof A.aD||g instanceof A.aY)break A
if(g instanceof A.aF){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.T(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dO:function dO(){},
dQ:function dQ(a){this.a=a},
dP:function dP(){},
fj(a){var s
A:{if(a instanceof A.H){s=A.o(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.gab())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.P){s=A.a0(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.M){s=A.a0(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.S){s=A.a0(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
fi(a){var s,r,q=a.j(0,"s")
q.toString
A.J(q)
s=a.j(0,"t")
A:{if("play"===s){r=a.j(0,"c")
r.toString
q=new A.H(A.fO(A.ai(r)),J.K(a.j(0,"x"),!0),q)
break A}if("raise"===s){q=new A.P(q)
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
_.ay=_.ax=!1},
d8:function d8(){},
d9:function d9(a){this.a=a},
da:function da(a){this.a=a},
db:function db(a){this.a=a},
aH:function aH(a,b){this.a=a
this.b=b},
dB:function dB(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
_.ax=o},
eU(b3,b4,b5,b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bL(b3,b4),b0=new A.dq(b4,b3),b1=(b4&1)===0?B.b:B.c,b2=b3.r
A:{if(B.h===b2){s=b3.ch
s=((s.a&1)===0?B.b:B.c)!==b1&&s.c!==b4&&b8.$1(b4)
break A}if(B.e===b2){s=b3.CW===b1&&b8.$1(b4)
break A}s=!1
break A}r=b3.r
q=b3.as
p=b3.e
o=B.d.D(b3.at+3,4)
n=b3.f
m=b3.y
l=b3.gaz()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.cn(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.v(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cM(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.v(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.gY()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.b(a2,a5)
a6=A.as(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gaE()
a2=a9.gb6()
a3=b3.ga9()
a7=b3.b0(b4)
a8=b3.r===B.l&&b3.as===b4
return new A.av(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,b3.fr,A.cn(b3.dy,g,t.x),b9,b5,A.cn(c0.a,g,t.N),c0.bV(b1),c0.d,b6,b7)},
hd(){var s=t.S
return new A.bT(A.o(s,t.N),A.a0([B.b,0,B.c,0],t.H,s))},
b6:function b6(a,b,c){this.a=a
this.b=b
this.c=c},
cM:function cM(a,b,c){this.a=a
this.b=b
this.c=c},
av:function av(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var _=this
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
dq:function dq(a,b){this.a=a
this.b=b},
d6:function d6(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bT:function bT(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
aa(a){return new A.cq(a)},
bU(a,b,c){var s,r,q,p,o,n=t.S,m=A.a0([B.b,0,B.c,0],t.H,n),l=A.e([],t.c4),k=t.x,j=J.e8(4,k)
for(s=t.Y,r=0;r<4;++r)j[r]=A.e([],s)
q=J.e8(4,k)
for(r=0;r<4;++r)q[r]=A.e([],s)
s=A.e([],t.d2)
p=A.e([],t.c5)
o=new A.bd()
o.ah(c)
n=new A.dx(b,o,m,l,B.d.D(a+3,4),B.f,j,q,s,p,A.o(n,k))
n.ag()
return n},
he(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.H
r=!1
if(s){r=b instanceof A.H
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.C(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.P){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.P
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
il(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.x)(a),++r)q.push(a[r].b)
return A.fo(q)},
fo(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.an
if(q>=2)return B.ao
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
H:function H(a,b,c){this.b=a
this.c=b
this.a=c},
P:function P(a){this.a=a},
M:function M(a){this.a=a},
S:function S(a){this.a=a},
G:function G(){},
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
bN:function bN(a){this.a=a},
aC:function aC(a,b){this.a=a
this.b=b},
b9:function b9(a){this.a=a},
ap:function ap(a,b){this.a=a
this.b=b},
aF:function aF(a){this.a=a},
aY:function aY(){},
aD:function aD(){},
a4:function a4(a,b,c){this.a=a
this.b=b
this.c=c},
bP:function bP(a,b,c){this.a=a
this.b=b
this.c=c},
cJ:function cJ(a,b,c){this.a=a
this.b=b
this.c=c},
cq:function cq(a){this.a=a},
dx:function dx(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
dA:function dA(a){this.a=a},
dy:function dy(a,b){this.a=a
this.b=b},
dz:function dz(){},
bL:function bL(a,b){this.a=a
this.b=b},
I:function I(a,b){this.a=a
this.b=b},
ix(b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=null,a9="forfeit",b0=t.G,b1=t.N,b2=t.X,b3=b0.a(B.F.bG(b5,a8)).L(0,b1,b2),b4=J.a8(b3,"rules")
b4.toString
b4=b0.a(b4).L(0,b1,b2)
h=A.fW(B.a1,t.aJ).j(0,b4.j(0,"manilhas"))
g=A.bh(b4.j(0,"coberta"))
f=A.bh(b4.j(0,"cobertaParceiro"))
e=A.bh(b4.j(0,"ferro"))
d=A.bh(b4.j(0,"verNoTruco"))
c=A.bh(b4.j(0,"verNaMaoDeOnze"))
b=A.bh(b4.j(0,"terceiraCarta"))
a=A.dL(b4.j(0,"tempo"))
a=a==null?a8:B.q.b7(a)
b4=A.dL(b4.j(0,"lento"))
b4=b4==null?a8:B.q.b7(b4)
if(h==null)h=B.z
if(a==null)a=20
if(b4==null)b4=0
b4=new A.dB("paulista","Truco",h,B.a6,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b!==!1,a,b4)
a=J.a8(b3,"seed")
a.toString
A.J(a)
b=J.a8(b3,"firstDealer")
b.toString
A.J(b)
c=J.K(J.a8(b3,"drawDealer"),!0)
d=A.e([],t.cG)
h=J.a8(b3,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.q
a0=0
for(;a0<h.length;h.length===g||(0,A.x)(h),++a0){a1=h[a0]
d.push(a1==null?a8:A.fX(B.a2,A.ai(a1),f))}h=t.d
g=A.e([],h)
f=t.k.a(J.a8(b3,"log"))
if(f==null)f=B.a5
e=f.length
a0=0
for(;a0<f.length;f.length===e||(0,A.x)(f),++a0)g.push(b0.a(f[a0]).L(0,b1,b2))
f=t.S
e=A.hd()
a2=A.v(d,t.ch)
if(!c)a3=g.length!==0&&J.K(B.a.gN(g).j(0,"t"),"draw")
else a3=!0
a4=new A.cr(a3,B.t,A.o(f,f),b4,a,b,a2,A.e([],h),B.T,e,A.dk(f))
a4.bd(d,c,b,g,a8,b4,a)
s=a4
r=null
q=null
a=t.a5.a(J.a8(b3,"act"))
p=a==null?a8:a.L(0,b1,b2)
try{if(A.eo(J.a8(b3,a9))){b0=J.a8(b3,a9)
b0.toString
a5=s.a4(A.J(b0))}else if(J.K(J.a8(b3,"timeout"),!0)){b0=s.bT(A.f9(J.a8(b3,"missLimit")))
a5=b0}else{if(p==null){b0=s
a6=A.o(f,t.Q)
b0.X(a6)
if(a6.a===0)b0.P(a6,0)
b0=a6}else{b4=p.j(0,"seat")
b4.toString
A.J(b4)
h=p.j(0,"action")
h.toString
b2=s.bD(b4,b0.a(h).L(0,b1,b2))
b0=b2}a5=b0}o=a5
n=A.o(f,t.W)
for(b0=o,b0=new A.a2(b0,A.h(b0).h("a2<1,2>")).gq(0);b0.n();){b2=b0.d
b2.toString
m=b2
b2=m.a
l=[]
for(b4=m.b,h=b4.length,a0=0;a0<b4.length;b4.length===h||(0,A.x)(b4),++a0){k=b4[a0]
J.e4(l,k.O())}J.fF(n,b2,l)}r=n}catch(a7){n=A.ex(a7)
if(n instanceof A.cq){j=n
q=j.a
r=B.H}else{i=n
q=A.u(i)
r=B.H}}n=s.z
n===$&&A.z()
l=t.K
b0=A.o(b1,l)
b0.i(0,"log",s.x)
b2=A.o(b1,t.W)
for(b4=r.gI(),b4=b4.gq(b4);b4.n();){h=b4.gp()
b2.i(0,""+h.a,h.b)}b0.i(0,"frames",b2)
b0.i(0,"phase",n.r.b)
b2=n.db
if(b2!=null)b0.i(0,"winner",b2.b)
b2=n.c
b0.i(0,"scores",A.e([b2.j(0,B.b),b2.j(0,B.c)],t.e))
b0.i(0,"dealer",n.e)
b2=s.gaH()
if(b2!=null)b0.i(0,"waitingFor",b2)
if(s.ga2())b0.i(0,"reveal",!0)
if(s.b)b0.i(0,"draw",!0)
b2=A.e([],t.bc)
for(b4=n.d,h=B.a.gq(b4),g=new A.aM(h,t.ca),f=t.A;g.n();){e=f.a(h.gp())
d=A.o(b1,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b2.push(d)}b0.i(0,"hands",b2)
if(n.r===B.i){l=A.o(b1,t.a)
for(b1=A.ii(b4,n.a),b1=new A.a2(b1,A.h(b1).h("a2<1,2>")).gq(0);b1.n();){m=b1.d
b2=m.b
if(b2.gu(b2)){b4=m.a
b2=A.b2(b2,A.h(b2).c)
l.i(0,""+b4,b2)}}b0.i(0,"feats",l)}n=n.fr
if(n!=null)b0.i(0,a9,n.b)
n=q
if(n!=null)b0.i(0,"error",n)
return B.F.bI(b0,a8)},
iu(){var s,r=v.G.globalThis,q=new A.dZ()
if(typeof q=="function")A.ak(A.d1("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hJ,q)
s[$.ey()]=q
r.trucoEngine=s},
dZ:function dZ(){},
fr(a){return v.mangledGlobalNames[a]},
iz(a){throw A.L(new A.bA("Field '"+a+"' has been assigned during initialization."),new Error())},
z(){throw A.L(A.h5(""),new Error())},
hJ(a,b,c){t.Z.a(a)
if(A.J(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.ea.prototype={}
J.ct.prototype={
C(a,b){return a===b},
gv(a){return A.bM(a)},
l(a){return"Instance of '"+A.cL(a)+"'"},
gB(a){return A.aS(A.em(this))}}
J.cw.prototype={
l(a){return String(a)},
gv(a){return a?519018:218159},
gB(a){return A.aS(t.y)},
$ip:1,
$il:1}
J.bt.prototype={
C(a,b){return null==b},
l(a){return"null"},
gv(a){return 0},
$ip:1}
J.bw.prototype={$iA:1}
J.ar.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.cK.prototype={}
J.bW.prototype={}
J.aq.prototype={
l(a){var s=a[$.ft()]
if(s==null)s=a[$.ey()]
if(s==null)return this.bc(a)
return"JavaScript function for "+J.cg(s)},
$iaE:1}
J.bv.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.bx.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.j.prototype={
k(a,b){A.E(a).c.a(b)
a.$flags&1&&A.bm(a,29)
a.push(b)},
bS(a,b){var s
a.$flags&1&&A.bm(a,"remove",1)
for(s=0;s<a.length;++s)if(J.K(a[s],b)){a.splice(s,1)
return!0}return!1},
W(a,b){var s,r
A.E(a).h("c<1>").a(b)
a.$flags&1&&A.bm(a,"addAll",2)
if(Array.isArray(b)){this.bg(a,b)
return}for(s=b.length,r=0;r<b.length;b.length===s||(0,A.x)(b),++r)a.push(b[r])},
bg(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.Y(a))
for(r=0;r<s;++r)a.push(b[r])},
F(a){a.$flags&1&&A.bm(a,"clear","clear")
a.length=0},
b3(a,b){var s,r,q
A.E(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.Y(a))}throw A.d(A.cu())},
H(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
bb(a,b,c){var s=a.length
if(b>s)throw A.d(A.aJ(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aJ(c,b,s,"end",null))
if(b===c)return A.e([],A.E(a))
return A.e(a.slice(b,c),A.E(a))},
gN(a){if(a.length>0)return a[0]
throw A.d(A.cu())},
ga6(a){var s=a.length
if(s===1){if(0>=s)return A.b(a,0)
return a[0]}if(s===0)throw A.d(A.cu())
throw A.d(A.eF())},
S(a,b){var s,r
A.E(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.Y(a))}return!1},
aw(a,b){var s,r
A.E(a).h("l(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.Y(a))}return!0},
af(a,b){var s,r,q,p
a.$flags&2&&A.bm(a,"shuffle")
s=a.length
while(s>1){r=b.a1(s);--s
q=a.length
if(!(s<q))return A.b(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.b(a,r)
a[s]=a[r]
a[r]=p}},
aA(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.b(a,s)
if(J.K(a[s],b))return s}return-1},
T(a,b){var s
for(s=0;s<a.length;++s)if(J.K(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gu(a){return a.length!==0},
l(a){return A.e7(a,"[","]")},
gq(a){return new J.az(a,a.length,A.E(a).h("az<1>"))},
gv(a){return A.bM(a)},
gm(a){return a.length},
i(a,b,c){A.E(a).c.a(c)
a.$flags&2&&A.bm(a)
if(!(b>=0&&b<a.length))throw A.d(A.fm(a,b))
a[b]=c},
bQ(a,b){var s,r
A.E(a).h("l(1)").a(b)
s=a.length-1
if(s<0)return-1
for(r=s;r>=0;--r){if(!(r<a.length))return A.b(a,r)
if(b.$1(a[r]))return r}return-1},
$if:1,
$ic:1,
$ii:1}
J.cv.prototype={
bW(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cL(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.dc.prototype={}
J.az.prototype={
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
J.bu.prototype={
b7(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.bY(""+a+".toInt()"))},
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
V(a,b){return(a|0)===a?a/b|0:this.bA(a,b)},
bA(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.bY("Result of truncating division is "+A.u(s)+": "+A.u(a)+" ~/ "+b))},
aZ(a,b){var s
if(a>0)s=this.by(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
by(a,b){return b>31?0:a>>>b},
gB(a){return A.aS(t.o)},
$im:1,
$iaU:1}
J.bs.prototype={
gB(a){return A.aS(t.S)},
$ip:1,
$ia:1}
J.cx.prototype={
gB(a){return A.aS(t.i)},
$ip:1}
J.b1.prototype={
a3(a,b,c){return a.substring(b,A.ha(b,c,a.length))},
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
return new A.bn(s.gq(s),A.h(this).h("bn<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
l(a){return this.a.l(0)}}
A.bn.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iy:1}
A.aA.prototype={}
A.c0.prototype={$if:1}
A.aB.prototype={
L(a,b,c){return new A.aB(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("aB<1,2,3,4>"))},
j(a,b){return this.$ti.h("4?").a(this.a.j(0,b))},
J(a,b){this.a.J(0,new A.d5(this,this.$ti.h("~(3,4)").a(b)))},
gK(){var s=this.$ti
return A.fP(this.a.gK(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
gI(){return this.a.gI().aD(0,new A.d4(this),this.$ti.h("C<3,4>"))}}
A.d5.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d4.prototype={
$1(a){var s=this.a.$ti
s.h("C<1,2>").a(a)
return new A.C(s.y[2].a(a.a),s.y[3].a(a.b),s.h("C<3,4>"))},
$S(){return this.a.$ti.h("C<3,4>(C<1,2>)")}}
A.bA.prototype={
l(a){return"LateInitializationError: "+this.a}}
A.dp.prototype={}
A.f.prototype={}
A.D.prototype={
gq(a){var s=this
return new A.a3(s,s.gm(s),A.h(s).h("a3<D.E>"))},
gt(a){return this.gm(this)===0},
aD(a,b,c){var s=A.h(this)
return new A.ad(this,s.A(c).h("1(D.E)").a(b),s.h("@<D.E>").A(c).h("ad<1,2>"))},
b8(a){var s,r=this,q=A.eJ(A.h(r).h("D.E"))
for(s=0;s<r.gm(r);++s)q.k(0,r.H(0,s))
return q}}
A.bS.prototype={
gbq(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbz(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
H(a,b){var s=this,r=s.gbz()+b,q=s.gbq()
if(r>=q)throw A.d(A.e6(b,s.gm(0),s,"index"))
return J.e5(s.a,r)},
bU(a){var s,r,q,p,o=this,n=o.b,m=o.a,l=m.length,k=o.c
if(k!=null&&k<l)l=k
s=l-n
if(s<=0){m=J.e9(0,o.$ti.c)
return m}r=J.bk(m)
q=A.eK(s,r.H(m,n),!0,o.$ti.c)
for(p=1;p<s;++p){B.a.i(q,p,r.H(m,n+p))
if(m.length<l)throw A.d(A.Y(o))}return q}}
A.a3.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dR(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.Y(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.H(q,s);++r.c
return!0},
$iy:1}
A.aI.prototype={
gq(a){return new A.bE(J.ay(this.a),this.b,A.h(this).h("bE<1,2>"))},
gm(a){return J.d0(this.a)},
gt(a){return J.fH(this.a)}}
A.br.prototype={$if:1}
A.bE.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iy:1}
A.ad.prototype={
gm(a){return J.d0(this.a)},
H(a,b){return this.b.$1(J.e5(this.a,b))}}
A.af.prototype={
gq(a){return new A.bZ(J.ay(this.a),this.b,this.$ti.h("bZ<1>"))}}
A.bZ.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iy:1}
A.c_.prototype={
gq(a){return new A.aM(J.ay(this.a),this.$ti.h("aM<1>"))}}
A.aM.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iy:1}
A.t.prototype={
sm(a,b){throw A.d(A.bY("Cannot change the length of a fixed-length list"))},
k(a,b){A.aj(a).h("t.E").a(b)
throw A.d(A.bY("Cannot add to a fixed-length list"))},
W(a,b){A.aj(a).h("c<t.E>").a(b)
throw A.d(A.bY("Cannot add to a fixed-length list"))}}
A.bO.prototype={
gm(a){return this.a.length},
H(a,b){var s=this.a
return J.e5(s,s.length-1-b)}}
A.ag.prototype={$r:"+winner(1)",$s:1}
A.ah.prototype={$r:"+(1,2)",$s:2}
A.c7.prototype={$r:"+points,winner(1,2)",$s:3}
A.bp.prototype={}
A.bo.prototype={
L(a,b,c){var s=A.h(this)
return A.eL(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
l(a){return A.ed(this)},
gI(){return new A.bf(this.bK(),A.h(this).h("bf<C<1,2>>"))},
bK(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gI(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gK(),o=o.gq(o),n=A.h(s),m=n.y[1],n=n.h("C<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.j(0,l)
r=4
return a.b=new A.C(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iB:1}
A.N.prototype={
gm(a){return this.b.length},
gaW(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
M(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
j(a,b){if(!this.M(b))return null
return this.b[this.a[b]]},
J(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaW()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gK(){return new A.c1(this.gaW(),this.$ti.h("c1<1>"))}}
A.c1.prototype={
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
A.bq.prototype={
k(a,b){A.h(this).c.a(b)
A.fV()}}
A.ao.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gu(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aN(s,s.length,this.$ti.h("aN<1>"))},
bt(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.by(o.$ti.h("by<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
T(a,b){return this.bt().M(b)}}
A.bQ.prototype={}
A.dC.prototype={
R(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.bK.prototype={
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
return"Closure '"+A.fs(r==null?"unknown":r)+"'"},
$iaE:1,
gbZ(){return this},
$C:"$1",
$R:1,
$D:null}
A.cj.prototype={$C:"$0",$R:0}
A.ck.prototype={$C:"$2",$R:2}
A.cP.prototype={}
A.cO.prototype={
l(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.fs(s)+"'"}}
A.aW.prototype={
C(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aW))return!1
return this.$_target===b.$_target&&this.a===b.a},
gv(a){return(A.ew(this.a)^A.bM(this.$_target))>>>0},
l(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cL(this.a)+"'")}}
A.cN.prototype={
l(a){return"RuntimeError: "+this.a}}
A.a_.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gu(a){return this.a!==0},
gK(){return new A.U(this,A.h(this).h("U<1>"))},
gI(){return new A.a2(this,A.h(this).h("a2<1,2>"))},
M(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bL(a)},
bL(a){var s=this.d
if(s==null)return!1
return this.ac(this.aV(s,a),a)>=0},
av(a){return new A.U(this,A.h(this).h("U<1>")).S(0,new A.de(this,a))},
W(a,b){A.h(this).h("B<1,2>").a(b).J(0,new A.dd(this))},
j(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bM(b)},
bM(a){var s,r,q=this.d
if(q==null)return null
s=this.aV(q,a)
r=this.ac(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.h(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.aK(s==null?q.b=q.ap():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.aK(r==null?q.c=q.ap():r,b,c)}else q.bN(b,c)},
bN(a,b){var s,r,q,p,o=this,n=A.h(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ap()
r=o.aB(a)
q=s[r]
if(q==null)s[r]=[o.ai(a,b)]
else{p=o.ac(q,a)
if(p>=0)q[p].b=b
else q.push(o.ai(a,b))}},
F(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aX()}},
J(a,b){var s,r,q=this
A.h(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.Y(q))
s=s.c}},
aK(a,b,c){var s,r=A.h(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ai(b,c)
else s.b=c},
aX(){this.r=this.r+1&1073741823},
ai(a,b){var s=this,r=A.h(s),q=new A.di(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aX()
return q},
aB(a){return J.ac(a)&1073741823},
aV(a,b){return a[this.aB(b)]},
ac(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1},
l(a){return A.ed(this)},
ap(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$iec:1}
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
return new A.aG(s,s.r,s.e,this.$ti.h("aG<1>"))}}
A.aG.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iy:1}
A.bD.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bC(s,s.r,s.e,this.$ti.h("bC<1>"))}}
A.bC.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iy:1}
A.a2.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bB(s,s.r,s.e,this.$ti.h("bB<1,2>"))}}
A.bB.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.C(s.a,s.b,r.$ti.h("C<1,2>"))
r.c=s.c
return!0}},
$iy:1}
A.by.prototype={
aB(a){return A.ic(a)&1073741823},
ac(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1}}
A.dV.prototype={
$1(a){return this.a(a)},
$S:2}
A.dW.prototype={
$2(a,b){return this.a(a,b)},
$S:8}
A.dX.prototype={
$1(a){return this.a(A.ai(a))},
$S:9}
A.a6.prototype={
l(a){return this.b_(!1)},
b_(a){var s,r,q,p,o,n=this.br(),m=this.an(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.b(m,q)
o=m[q]
l=a?l+A.eO(o):l+A.u(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
br(){var s,r=this.$s
while($.dI.length<=r)B.a.k($.dI,null)
s=$.dI[r]
if(s==null){s=this.bm()
B.a.i($.dI,r,s)}return s},
bm(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.e8(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.v(j,k)}}
A.aQ.prototype={
an(){return[this.a,this.b]},
C(a,b){if(b==null)return!1
return b instanceof A.aQ&&this.$s===b.$s&&J.K(this.a,b.a)&&J.K(this.b,b.b)},
gv(a){return A.eM(this.$s,this.a,this.b,B.k)}}
A.be.prototype={
an(){return[this.a]},
C(a,b){if(b==null)return!1
return b instanceof A.be&&this.$s===b.$s&&J.K(this.a,b.a)},
gv(a){return A.eM(this.$s,this.a,B.k,B.k)}}
A.b4.prototype={
gB(a){return B.at},
$ip:1}
A.bH.prototype={}
A.cA.prototype={
gB(a){return B.au},
$ip:1}
A.b5.prototype={
gm(a){return a.length},
$iT:1}
A.bF.prototype={$if:1,$ic:1,$ii:1}
A.bG.prototype={$if:1,$ic:1,$ii:1}
A.cB.prototype={
gB(a){return B.av},
$ip:1}
A.cC.prototype={
gB(a){return B.aw},
$ip:1}
A.cD.prototype={
gB(a){return B.ax},
$ip:1}
A.cE.prototype={
gB(a){return B.ay},
$ip:1}
A.cF.prototype={
gB(a){return B.az},
$ip:1}
A.cG.prototype={
gB(a){return B.aB},
$ip:1}
A.cH.prototype={
gB(a){return B.aC},
$ip:1}
A.bI.prototype={
gB(a){return B.aD},
gm(a){return a.length},
$ip:1}
A.cI.prototype={
gB(a){return B.aE},
gm(a){return a.length},
$ip:1}
A.c3.prototype={}
A.c4.prototype={}
A.c5.prototype={}
A.c6.prototype={}
A.a5.prototype={
h(a){return A.ce(v.typeUniverse,this,a)},
A(a){return A.f6(v.typeUniverse,this,a)}}
A.cV.prototype={}
A.d_.prototype={
l(a){return A.W(this.a,null)}}
A.cU.prototype={
l(a){return this.a}}
A.ca.prototype={}
A.c9.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bx(a,b){var s,r,q
a=A.J(a)
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
o.d=null}q=o.bx(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.f0
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
o.a=A.f0
throw n
return!1}if(0>=p.length)return A.b(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eS("sync*"))}return!1},
c_(a){var s,r,q=this
if(a instanceof A.bf){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.ay(a)
return 2}},
$iy:1}
A.bf.prototype={
gq(a){return new A.c9(this.a(),this.$ti.h("c9<1>"))}}
A.aO.prototype={
gq(a){var s=this,r=new A.c2(s,s.r,A.h(s).h("c2<1>"))
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
return t.g.a(r[b])!=null}else return this.bn(b)},
bn(a){var s=this.d
if(s==null)return!1
return this.aT(s[this.aP(a)],a)>=0},
k(a,b){var s,r,q=this
A.h(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aL(s==null?q.b=A.ej():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aL(r==null?q.c=A.ej():r,b)}else return q.bf(b)},
bf(a){var s,r,q,p=this
A.h(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.ej()
r=p.aP(a)
q=s[r]
if(q==null)s[r]=[p.aq(a)]
else{if(p.aT(q,a)>=0)return!1
q.push(p.aq(a))}return!0},
F(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aO()}},
aL(a,b){A.h(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.aq(b)
return!0},
aO(){this.r=this.r+1&1073741823},
aq(a){var s,r=this,q=new A.cZ(A.h(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.aO()
return q},
aP(a){return J.ac(a)&1073741823},
aT(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.K(a[r].a,b))return r
return-1}}
A.cZ.prototype={}
A.c2.prototype={
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
$S:10}
A.r.prototype={
gq(a){return new A.a3(a,a.length,A.aj(a).h("a3<r.E>"))},
H(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
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
l(a){return A.e7(a,"[","]")}}
A.q.prototype={
L(a,b,c){var s=A.h(this)
return A.eL(this,s.h("q.K"),s.h("q.V"),b,c)},
J(a,b){var s,r,q,p=A.h(this)
p.h("~(q.K,q.V)").a(b)
for(s=this.gK(),s=s.gq(s),p=p.h("q.V");s.n();){r=s.gp()
q=this.j(0,r)
b.$2(r,q==null?p.a(q):q)}},
gI(){return this.gK().aD(0,new A.dl(this),A.h(this).h("C<q.K,q.V>"))},
gm(a){var s=this.gK()
return s.gm(s)},
gt(a){var s=this.gK()
return s.gt(s)},
gu(a){var s=this.gK()
return s.gu(s)},
l(a){return A.ed(this)},
$iB:1}
A.dl.prototype={
$1(a){var s=this.a,r=A.h(s)
r.h("q.K").a(a)
s=s.j(0,a)
if(s==null)s=r.h("q.V").a(s)
return new A.C(a,s,r.h("C<q.K,q.V>"))},
$S(){return A.h(this.a).h("C<q.K,q.V>(q.K)")}}
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
A.cf.prototype={}
A.b3.prototype={
L(a,b,c){return this.a.L(0,b,c)},
j(a,b){return this.a.j(0,b)},
J(a,b){this.a.J(0,A.h(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
gm(a){var s=this.a
return s.gm(s)},
l(a){return this.a.l(0)},
gI(){return this.a.gI()},
$iB:1}
A.aL.prototype={
L(a,b,c){return new A.aL(this.a.L(0,b,c),b.h("@<0>").A(c).h("aL<1,2>"))}}
A.at.prototype={
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
W(a,b){var s
for(s=J.ay(A.h(this).h("c<1>").a(b));s.n();)this.k(0,s.gp())},
bE(a){var s
for(s=a.gq(a);s.n();)if(!this.T(0,s.gp()))return!1
return!0},
ga6(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.eF())
s=r.gq(r)
if(!s.n())throw A.d(A.cu())
return s.gp()},
l(a){return A.e7(this,"{","}")},
$if:1,
$ic:1,
$iaK:1}
A.c8.prototype={}
A.bg.prototype={}
A.cX.prototype={
j(a,b){var s,r=this.b
if(r==null)return this.c.j(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bw(b):s}},
gm(a){return this.b==null?this.c.a:this.a7().length},
gt(a){return this.gm(0)===0},
gu(a){return this.gm(0)>0},
gK(){if(this.b==null){var s=this.c
return new A.U(s,A.h(s).h("U<1>"))}return new A.cY(this)},
J(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.J(0,b)
s=o.a7()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dM(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.Y(o))}},
a7(){var s=t.k.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
bw(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dM(this.a[a])
return this.b[a]=s}}
A.cY.prototype={
gm(a){return this.a.gm(0)},
H(a,b){var s=this.a
if(s.b==null)s=s.gK().H(0,b)
else{s=s.a7()
if(!(b<s.length))return A.b(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gK()
s=s.gq(s)}else{s=s.a7()
s=new J.az(s,s.length,A.E(s).h("az<1>"))}return s}}
A.cl.prototype={}
A.co.prototype={}
A.bz.prototype={
l(a){var s=A.cp(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cz.prototype={
l(a){return"Cyclic error in JSON stringify"}}
A.df.prototype={
bG(a,b){var s=A.i3(a,this.gbH().a)
return s},
bI(a,b){var s=A.hk(a,this.gbJ().b,null)
return s},
gbJ(){return B.a0},
gbH(){return B.a_}}
A.dh.prototype={}
A.dg.prototype={}
A.dG.prototype={
ba(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.m.a3(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
o=A.O(117)
s.a+=o
o=A.O(100)
s.a+=o
o=p>>>8&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.O(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.m.a3(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
switch(p){case 8:o=A.O(98)
s.a+=o
break
case 9:o=A.O(116)
s.a+=o
break
case 10:o=A.O(110)
s.a+=o
break
case 12:o=A.O(102)
s.a+=o
break
case 13:o=A.O(114)
s.a+=o
break
default:o=A.O(117)
s.a+=o
o=A.O(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.O(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.m.a3(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
o=A.O(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.m.a3(a,r,m)},
aj(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.d(new A.cz(a,null))}B.a.k(s,a)},
ad(a){var s,r,q,p,o=this
if(o.b9(a))return
o.aj(a)
try{s=o.b.$1(a)
if(!o.b9(s)){q=A.eG(a,null,o.gaY())
throw A.d(q)}q=o.a
if(0>=q.length)return A.b(q,-1)
q.pop()}catch(p){r=A.ex(p)
q=A.eG(a,r,o.gaY())
throw A.d(q)}},
b9(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.q.l(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.ba(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.aj(a)
q.bX(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return!0}else if(t.G.b(a)){q.aj(a)
r=q.bY(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return r}else return!1},
bX(a){var s,r=this.c
r.a+="["
if(J.fI(a)){if(0>=a.length)return A.b(a,0)
this.ad(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.ad(a[s])}}r.a+="]"},
bY(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.eK(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.J(0,new A.dH(l,r))
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
A.dH.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:3}
A.dF.prototype={
gaY(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cT.prototype={
l(a){return this.Z()},
$ib_:1}
A.w.prototype={}
A.ch.prototype={
l(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cp(s)
return"Assertion failed"}}
A.bV.prototype={}
A.al.prototype={
gam(){return"Invalid argument"+(!this.a?"(s)":"")},
gal(){return""},
l(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gam()+q+o
if(!s.a)return n
return n+s.gal()+": "+A.cp(s.gaC())},
gaC(){return this.b}}
A.b8.prototype={
gaC(){return A.dL(this.b)},
gam(){return"RangeError"},
gal(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.u(q):""
else if(q==null)s=": Not greater than or equal to "+A.u(r)
else if(q>r)s=": Not in inclusive range "+A.u(r)+".."+A.u(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.u(r)
return s}}
A.cs.prototype={
gaC(){return A.J(this.b)},
gam(){return"RangeError"},
gal(){if(A.J(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bX.prototype={
l(a){return"Unsupported operation: "+this.a}}
A.cR.prototype={
l(a){return"UnimplementedError: "+this.a}}
A.ba.prototype={
l(a){return"Bad state: "+this.a}}
A.cm.prototype={
l(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cp(s)+"."}}
A.bR.prototype={
l(a){return"Stack Overflow"},
$iw:1}
A.d7.prototype={
l(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.c.prototype={
aD(a,b,c){var s=A.h(this)
return A.h9(this,s.A(c).h("1(c.E)").a(b),s.h("c.E"),c)},
S(a,b){var s
A.h(this).h("l(c.E)").a(b)
for(s=this.gq(this);s.n();)if(b.$1(s.gp()))return!0
return!1},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gu(a){return!this.gt(this)},
gN(a){var s=this.gq(this)
if(!s.n())throw A.d(A.cu())
return s.gp()},
H(a,b){var s,r
A.ef(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.e6(b,b-r,this,"index"))},
l(a){return A.h2(this,"(",")")}}
A.C.prototype={
l(a){return"MapEntry("+A.u(this.a)+": "+A.u(this.b)+")"}}
A.bJ.prototype={
gv(a){return A.k.prototype.gv.call(this,0)},
l(a){return"null"}}
A.k.prototype={$ik:1,
C(a,b){return this===b},
gv(a){return A.bM(this)},
l(a){return"Instance of '"+A.cL(this)+"'"},
gB(a){return A.ij(this)},
toString(){return this.l(this)}}
A.bb.prototype={
gm(a){return this.a.length},
l(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ihc:1}
A.cW.prototype={
a1(a){if(a<=0||a>4294967296)throw A.d(A.eP(u.c+a))
return Math.random()*a>>>0},
G(){return Math.random()},
$iee:1}
A.bd.prototype={
ah(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
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
a1(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.d(A.eP(u.c+a))
s=a-1
if((a&s)>>>0===0){p.U()
return(p.a&s)>>>0}do{p.U()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
G(){var s,r=this
r.U()
s=r.a
r.U()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$iee:1}
A.a9.prototype={
Z(){return"AiLevel."+this.b}}
A.cQ.prototype={
b2(a){var s,r,q=this,p=a.a,o=a.b,n=p.b5(o)
if(n.length===0)throw A.d(A.eS("no legal action for "+o))
if(p.cx){p=t.db
s=new A.af(new A.c_(n,p),p.h("l(c.E)").a(new A.dv()),p.h("af<c.E>"))
return s.H(0,q.b.a1(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.bo(a)
break A}if(B.h===r){p=q.bh(a,n)
break A}p=q.bu(a,n)
break A}return p},
ga8(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
bo(a){var s,r,q,p,o,n,m=this,l=m.a
if(l===B.p){l=a.b
return m.b.G()<0.6?new A.M(l):new A.S(l)}s=m.a5(a,m.ga8())
if(l===B.j){l=(B.d.D(a.a.e+1,4)&1)===0?B.b:B.c
l=l===((a.b&1)===0?B.b:B.c)}else l=!1
if(l)s-=0.08
l=a.a
r=l.a
q=r.f
p=B.a.gN(r.d)
o=a.b
n=((o&1)===0?B.b:B.c)===B.b?B.c:B.b
n=l.c.j(0,n)
n.toString
if(n+p>=r.r)return new A.M(o)
return s>(q-p)/(2*q)+m.a_(0.08)?new A.M(o):new A.S(o)},
bh(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.S(t.U.a(b),new A.dr()),g=i.a
if(g===B.p){s=i.b.G()
if(h&&s<0.05)return new A.P(a.b)
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
g=g===B.j
if(g)q=q>=2?0.12:0
else q=0.08
k=o-q
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.j(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.P(q):new A.M(q)
if(h&&k>0.78+i.a_(0.05))return new A.P(q)
j=g&&i.b.G()<0.06
return(2*k-1)*l>-m+i.a_(0.3)||j?new A.M(q):new A.S(q)},
bu(a,b){t.U.a(b)
if(B.a.S(b,new A.ds())&&this.bB(a))return new A.P(a.b)
return this.bl(a,b)},
bB(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.j(0,q)
q.toString
if(q+p.gaz()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.G()<0.08
case 1:return r.a5(a,r.ga8())>0.72+r.a_(0.06)||r.b.G()<0.03
case 2:s=r.a5(a,r.ga8())
if(s>0.9&&a.gY().length>1&&r.b.G()<0.8)return!1
q=p.z
p=t.F
if(A.v(q,p).length===0){if(s>0.85+r.a_(0.03))return r.b.G()<0.35
if(B.a.aw(a.gY(),new A.dt(a)))return r.b.G()<0.3
return!1}if(s>0.62+r.a_(0.03))return!0
return A.v(q,p).length!==0&&s<0.3&&r.b.G()<0.04}},
a_(a){return(this.b.G()*2-1)*a},
bl(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.gY()
r=f.a
if(r===B.p&&f.b.G()<0.55){r=s.length
q=f.b.a1(r)
if(!(q>=0&&q<r))return A.b(s,q)
return new A.H(s[q],!1,a.b)}r=r===B.j
if(r&&s.length>1)p=f.bi(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.E(s[l],n.y))
k=A.e([],t.w)
for(j=A.v(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.E(h.b,n.y)
k.push(new A.ah(h.a,g))}m=A.e([],t.v)
for(n=A.v(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.es(q,k,m,a.b)
if(!(q>=0&&q<o))return A.b(s,q)
p=s[q]}if(r&&a.a.ga9()&&!f.bC(a,p)&&f.b.G()<0.5)return new A.H(p,!0,a.b)
q=!1
if(r){r=a.a
if(r.ga9())if(A.v(r.Q,t.n).length===0){o=r.z
n=t.F
if(A.v(o,n).length===1){q=B.a.gN(A.v(o,n))
o=(a.b&1)===0?B.b:B.c
r=q.b===o&&s.length>1&&r.a.E(p,r.y)<10&&f.a5(a,120)>0.9}else r=q}else r=q
else r=q}else r=q
if(r)return new A.H(p,!0,a.b)
return new A.H(p,!1,a.b)},
bC(a,b){var s=a.a,r=s.a.E(b,s.y)
return B.a.aw(A.v(s.Q,t.n),new A.du(a,r))},
bi(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.gY(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.E(e[p],r.y))
o=A.e([],t.w)
for(n=A.v(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.E(l.b,r.y)
o.push(new A.ah(l.a,k))}q=A.e([],t.v)
for(r=A.v(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.es(d,o,q,a.b)
if(!(d>=0&&d<s))return A.b(e,d)
j=e[d]
i=this.aI(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.C(0,j))continue
f=this.aI(a,g,160)
if(f>i){i=f
h=g}}return h},
aI(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbP()
r=A.e([],t.Y)
for(q=$.e3(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.T(0,n))r.push(n)}q=b8.b
m=B.d.D(q+2,4)
l=b8.gaE()
if(this.a===B.j){p=b8.a
k=p.ch
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ay
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.af(r,b)
a5.a=0
a6=A.h8(4,new A.dw(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.D(a0,4),B.d.D(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.b(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.as(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.E(b4.b,p.y)
a8.push(new A.ah(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.as(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.iy(a8,j?null:new A.ah(q,k.E(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
a5(a,b){return this.aI(a,null,b)}}
A.dv.prototype={
$1(a){return!t.D.a(a).c},
$S:11}
A.dr.prototype={
$1(a){return t.M.a(a) instanceof A.P},
$S:0}
A.ds.prototype={
$1(a){return t.M.a(a) instanceof A.P},
$S:0}
A.dt.prototype={
$1(a){var s=this.a.a
return s.a.E(t.L.a(a),s.y)<=3},
$S:4}
A.du.prototype={
$1(a){return this.a.a.aJ(t.n.a(a))<this.b},
$S:5}
A.dw.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.gY(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.E(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.t:s}else n=B.t
i=i.a
s=i.w
if(!(a<s.length))return A.b(s,a)
m=A.v(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.x)(n),++o)s.push(q.E(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.b(r,k)
s.push(q.E(r[k],i.y))}p.a+=m
return s},
$S:12}
A.e0.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:13}
A.e1.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:14}
A.dU.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o<s[q])q=p}return q},
$S:6}
A.dT.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o>s[q])q=p}return q},
$S:6}
A.V.prototype={
Z(){return"Suit."+this.b}}
A.Q.prototype={
Z(){return"Rank."+this.b}}
A.R.prototype={
gab(){var s=this.b.b
if(0>=s.length)return A.b(s,0)
return this.a.c+s[0]},
C(a,b){if(b==null)return!1
return b instanceof A.R&&b.a===this.a&&b.b===this.b},
gv(a){return this.a.a*4+this.b.a},
l(a){return this.gab()}}
A.d2.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.m.a3(s,0,s.length-1)},
$S:15}
A.d3.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.b(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.b(s,q)
return p===s[q]},
$S:16}
A.dO.prototype={
$1(a){return t.E.a(a) instanceof A.aD},
$S:17}
A.dQ.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.j(0,r).k(0,b)},
$S:18}
A.dP.prototype={
$1(a){return t.L.a(a).a===B.L},
$S:4}
A.cr.prototype={
bd(a,b,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
if(c.a){if(a1.length===0)B.a.k(c.x,B.af)
c.b=!0
s=A.b2($.e3(),t.L)
r=c.f
q=new A.bd()
q.ah((r^625341585)>>>0)
B.a.af(s,q)
c.c=A.eh(s,0,A.ib(20,"count",t.S),A.E(s).c).bU(0)
s=c.e
c.z=A.bU(3,s,(r^1540483477)>>>0)
p=r
r=s
s=p}else{s=c.e
r=c.f
c.z=A.bU(c.r,s,r)
p=r
r=s
s=p}for(q=a1.length,o=c.x,n=t.f,m=c.r,l=c.Q,k=l.a,j=c.at,i=c.d,h=0;h<a1.length;a1.length===q||(0,A.x)(a1),++h){g=n.a(a1[h])
f=g.j(0,"t")
e=J.ax(f)
if(!e.C(f,"draw"))if(e.C(f,"pick")){e=g.j(0,"s")
e.toString
A.J(e)
d=g.j(0,"i")
d.toString
i.i(0,e,A.J(d))
if(i.a===4){e=c.ao()
c.b=!1
c.z=A.bU(e,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}}else if(e.C(f,"draw-end")){e=c.aN()
if(e==null)e=m
c.b=!1
c.z=A.bU(e,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}else if(e.C(f,"next")){e=c.z
e===$&&A.z()
e.ag()
j.F(0)
c.ay=c.ax=!1}else if(e.C(f,"show")){e=c.z
e===$&&A.z()
d=g.j(0,"s")
d.toString
e.ae(A.J(d))}else if(e.C(f,"ready")){e=g.j(0,"s")
e.toString
j.k(0,A.J(e))}else if(e.C(f,"reveal-end"))c.ax=!0
else if(e.C(f,"bots-reveal"))c.ay=!0
else if(J.K(g.j(0,"t"),"forfeit")){if(c.b){c.b=!1
c.z=A.bU(m,r,s)
k.F(0)
l.b=null
l.d=l.c=!1
c.as=0}e=c.z
e===$&&A.z()
d=g.j(0,"s")
d.toString
e.a4((A.J(d)&1)===0?B.b:B.c)}else{e=c.z
e===$&&A.z()
e.a0(A.fi(g))}B.a.k(o,g)}if(!c.b){s=c.z
s===$&&A.z()
s=s.d
l.a0(A.eh(s,c.as,null,A.E(s).c))}s=c.z
s===$&&A.z()
c.as=s.d.length},
ao(){var s,r,q,p,o=this.d,n=A.h(o),m=new A.U(o,n.h("U<1>")).gN(0)
for(n=new A.aG(o,o.r,o.e,n.h("aG<1>"));n.n();){s=n.d
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
aS(a,b,c){var s,r,q,p,o,n=this,m=n.c.length,l=n.d,k=t.S,j=A.cn(l,k,k),i=b==null
if(i||c)k=B.aa
else{k=A.o(k,t.L)
for(s=new A.a2(l,A.h(l).h("a2<1,2>")).gq(0);s.n();){r=s.d
q=r.a
p=n.c
o=r.b
if(!(o>=0&&o<p.length))return A.b(p,o)
k.i(0,q,p[o])}}s=!1
if(n.b)if(i){i=n.w
if(!(a>=0&&a<i.length))return A.b(i,a)
l=i[a]==null&&!l.M(a)}else l=s
else l=s
return new A.d6(m,j,k,b,c,l)},
bp(a){return this.aS(a,null,!1)},
aR(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i
t.p.a(a)
for(s=this.gaa(),r=s.length,q=t.S,p=t.N,o=t.H,n=t.O,m=0;m<s.length;s.length===r||(0,A.x)(s),++m){l=s[m]
k=a.j(0,l)
if(k==null){k=A.e([],n)
a.i(0,l,k)}j=this.z
j===$&&A.z()
i=A.a0([B.b,0,B.c,0],o,q)
J.e4(k,A.eU(j,l,!1,b,this.aS(l,c,d),new A.d8(),!1,new A.bT(A.o(q,p),i)))}},
aQ(a,b){return this.aR(a,b,null,!1)},
aM(a){var s,r=this
r.b=!1
r.z=A.bU(a,r.e,r.f)
s=r.Q
s.a.F(0)
s.b=null
s.d=s.c=!1
r.as=0},
aN(){var s,r,q,p,o,n,m=this,l=m.d
if(!B.a.S(m.gaa(),l.gbF()))return null
s=new A.bd()
s.ah(m.f)
for(r=t.t,q=0;q<4;++q){if(l.M(q))continue
p=A.e([],r)
for(o=0;o<m.c.length;++o)if(!l.av(o))p.push(o)
n=s.a1(p.length)
if(!(n>=0&&n<p.length))return A.b(p,n)
l.i(0,q,p[n])}return m.ao()},
bO(a){var s
A.J(a)
s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
return s[a]==null},
gaa(){var s,r,q,p=A.e([],t.t)
for(s=this.w,r=s.length,q=0;q<4;++q){if(!(q<r))return A.b(s,q)
if(s[q]==null)p.push(q)}return p},
ga2(){var s=this,r=!1
if(!s.b)if(s.e.ax<=0)if(!s.ax){r=s.z
r===$&&A.z()
r=r.gaG()&&B.a.S(s.gaa(),new A.d9(s))}return r},
b1(a){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
s=!1
if(q[a]==null)if(r.ga2()){q=r.z
q===$&&A.z()
q=q.au(a)&&!r.at.T(0,a)}else q=s
else q=s
return q},
ar(a,b){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.aa("seat "+a+" is not a person"))
if(r.b)throw A.d(A.aa("drawing for the dealer"))
q=r.z
q===$&&A.z()
q.a0(b)
B.a.k(r.x,A.fj(b))
s=A.o(t.S,t.Q)
r.P(s,0)
r.X(s)
return s},
gaH(){var s,r,q,p,o,n,m=this,l=null
if(m.b)return l
s=m.z
s===$&&A.z()
r=s.r
switch(r.a){case 1:s=s.as
r=m.w
if(!(s>=0&&s<r.length))return A.b(r,s)
if(!(r[s]==null))s=l
return s
case 2:case 0:if(r===B.e){q=s.CW
q.toString
p=q}else p=((s.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
o=s.gaF()
if(o!=null){q=m.w
if(o>>>0!==o||o>=q.length)return A.b(q,o)
q=q[o]==null}else q=!1
if(q)return o
if(r===B.h&&s.ch.c!=null)return l
for(s=m.w,r=s.length,n=0;n<4;++n){if(((n&1)===0?B.b:B.c)===p){if(!(n<r))return A.b(s,n)
q=s[n]==null}else q=!1
if(q)return n}return l
case 3:case 4:return l}},
bT(a){var s,r,q,p,o,n=this
if(n.b){B.a.k(n.x,B.ab)
s=A.o(t.S,t.Q)
n.aU(s,n.aN())
n.X(s)
return s}if(n.gaH()==null&&n.ga2()){n.ax=!0
B.a.k(n.x,B.ac)
s=A.o(t.S,t.Q)
n.X(s)
if(s.a===0)n.P(s,0)
return s}r=n.gaH()
if(r==null)throw A.d(A.aa("nobody to wait for"))
q=n.z
q===$&&A.z()
s=n.ar(r,new A.cQ(B.C,n.y).b2(new A.bL(q,r)))
q=n.x
p=B.a.bQ(q,new A.da(r))
if(!(p>=0&&p<q.length))return A.b(q,p)
o=A.eI(q[p],t.N,t.X)
o.i(0,"to",!0)
B.a.i(q,p,o)
if(a!=null&&n.z.r!==B.i&&n.bR(r)>=a)n.a4(r).J(0,new A.db(s))
return s},
bR(a){var s,r,q,p
for(s=this.x,r=A.E(s).h("bO<1>"),s=new A.bO(s,r),s=new A.a3(s,s.gm(0),r.h("a3<D.E>")),r=r.h("D.E"),q=0;s.n();){p=s.d
if(p==null)p=r.a(p)
if(!J.K(p.j(0,"s"),a))continue
if(!J.K(p.j(0,"to"),!0))break;++q}return q},
a4(a){var s,r,q=this
if(q.b)q.aM(q.r)
s=q.z
s===$&&A.z()
s.a4((a&1)===0?B.b:B.c)
B.a.k(q.x,A.a0(["t","forfeit","s",a],t.N,t.X))
r=A.o(t.S,t.Q)
q.P(r,0)
return r},
bD(a,b){var s,r,q,p,o,n,m=this
t.f.a(b)
s=b.j(0,"t")
A:{if("blind"===s){r=b.j(0,"i")
r.toString
A.J(r)
q=m.z
q===$&&A.z()
q=q.w
if(!(a>=0&&a<q.length))return A.b(q,a)
p=A.v(q[a],t.L)
if(r<0||r>=p.length)A.ak(A.aa("no card "+r))
if(!(r>=0&&r<p.length))return A.b(p,r)
r=m.ar(a,new A.H(p[r],!1,a))
break A}if("pick"===s){r=b.j(0,"i")
r.toString
A.J(r)
q=!0
if(m.b){o=m.w
if(!(a>=0&&a<o.length))return A.b(o,a)
if(o[a]==null){q=m.d
q=q.M(a)||r<0||r>=m.c.length||q.av(r)}}if(q)A.ak(A.aa("cannot draw "+r))
m.d.i(0,a,r)
B.a.k(m.x,A.a0(["t","pick","s",a,"i",r],t.N,t.X))
n=A.o(t.S,t.Q)
m.aQ(n,0)
m.X(n)
r=n
break A}if("show"===s){if(!m.b1(a))A.ak(A.aa("nothing to show"))
r=m.z
r===$&&A.z()
r.ae(a)
B.a.k(m.x,A.a0(["t","show","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.P(n,0)
m.X(n)
r=n
break A}if("ready"===s){if(!m.b1(a))A.ak(A.aa("nothing to pass"))
m.at.k(0,a)
B.a.k(m.x,A.a0(["t","ready","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.P(n,0)
m.X(n)
r=n
break A}r=A.eI(b,t.N,t.X)
r.i(0,"s",a)
r=m.ar(a,A.fi(r))
break A}return r},
aU(a,b){var s,r,q=this
t.p.a(a)
s=b==null
r=s?q.r:b
q.aR(a,s?0:850,r,s)
q.aM(r)
q.P(a,s?1800:2800)},
X(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
t.p.a(a)
if(c.b){for(s=c.d,r=c.y,q=c.x,p=t.N,o=t.X,n=t.t,m=c.w,l=m.length,k=0;k<4;++k){if(!(k<l))return A.b(m,k)
if(m[k]==null||s.M(k))continue
j=A.e([],n)
for(i=0;i<c.c.length;++i)if(!s.av(i))j.push(i)
h=r.a1(j.length)
if(!(h>=0&&h<j.length))return A.b(j,h)
s.i(0,k,j[h])
B.a.k(q,A.a0(["t","pick","s",k,"i",s.j(0,k)],p,o))
c.aQ(a,600)}if(s.a<4)return
c.aU(a,c.ao())}for(s=c.x,r=c.w,q=r.length,p=c.y,o=c.Q,n=c.at,m=t.S,l=t.x;;){j=c.z
j===$&&A.z()
g=j.r
if(g===B.i)return
if(g===B.f){c.bk(a)
if(c.ga2())return
j=A.cn(c.z.dy,m,l)
f=j.gt(j)?2200:3500
c.z.ag()
n.F(0)
c.ay=c.ax=!1
B.a.k(s,B.ae)
c.P(a,f)
continue}e=c.bj()
if(e==null)return
f=o.e?1400:850
if(e>>>0!==e||e>=q)return A.b(r,e)
j=r[e]
j.toString
d=new A.cQ(j,p).b2(new A.bL(c.z,e))
c.z.a0(d)
B.a.k(s,A.fj(d))
c.P(a,f)}},
bj(){var s,r,q,p,o=this,n=null,m=o.z
m===$&&A.z()
s=m.r
switch(s.a){case 1:m=m.as
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.h&&m.ch.c!=null){m=m.gaF()
m.toString
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m}m=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)m.push(p)
if(B.a.S(m,o.gb4()))return n
return o.z.gaF()
case 3:case 4:return n}},
P(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
t.p.a(a4)
s=a3.Q
r=a3.z
r===$&&A.z()
r=r.d
s.a0(A.eh(r,a3.as,null,A.E(r).c))
a3.as=a3.z.d.length
for(r=a3.gaa(),q=r.length,p=a3.w,o=p.length,n=a3.gb4(),m=t.O,l=t.S,k=t.N,j=t.H,i=t.L,h=a3.at,g=0;g<r.length;r.length===q||(0,A.x)(r),++g){f=r[g]
e=a4.j(0,f)
if(e==null){e=A.e([],m)
a4.i(0,f,e)}d=a3.z
c=a3.b?new A.bT(A.o(l,k),A.a0([B.b,0,B.c,0],j,l)):s
b=a3.ga2()
if(!(f<o))return A.b(p,f)
a=!1
if(p[f]==null)if(a3.ga2()){a=a3.z
if(a.r===B.f)a0=a.dx||a.CW!=null
else a0=!1
a1=!1
if(a0)if(!a.dy.M(f)){a=a.w
if(!(f<a.length))return A.b(a,f)
a2=A.as(a[f],!1,i)
a2.$flags=3
a=a2.length!==0}else a=a1
else a=a1
a=a&&!h.T(0,f)}J.e4(e,A.eU(d,f,a,a5,a3.b?a3.bp(f):null,n,b,c))}},
bk(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
t.p.a(a)
if(!g.ay){s=g.z
s===$&&A.z()
s=!s.gaG()||g.e.ax>0}else s=!0
if(s)return
g.ay=!0
s=g.x
B.a.k(s,B.ad)
for(r=t.N,q=t.X,p=g.y,o=g.w,n=o.length,m=t.L,l=0;l<4;++l){if(!(l<n))return A.b(o,l)
if(o[l]!=null){k=g.z
k===$&&A.z()
if(k.r===B.f)j=k.dx||k.CW!=null
else j=!1
i=!1
if(j)if(!k.dy.M(l)){k=k.w
if(!(l<k.length))return A.b(k,l)
h=A.as(k[l],!1,m)
h.$flags=3
k=h.length!==0}else k=i
else k=i
k=!k}else k=!0
if(k)continue
if(p.G()>=0.001)continue
k=g.z
k===$&&A.z()
k.ae(l)
B.a.k(s,A.a0(["t","show","s",l],r,q))
g.P(a,850)}}}
A.d8.prototype={
$1(a){return!1},
$S:1}
A.d9.prototype={
$1(a){var s,r
A.J(a)
s=this.a
r=s.z
r===$&&A.z()
return r.au(a)&&!s.at.T(0,a)},
$S:1}
A.da.prototype={
$1(a){return J.K(t.f.a(a).j(0,"s"),this.a)},
$S:19}
A.db.prototype={
$2(a,b){var s,r
A.J(a)
t.Q.a(b)
s=this.a
r=s.j(0,a)
if(r==null){r=A.e([],t.O)
s.i(0,a,r)
s=r}else s=r
return J.fG(s,b)},
$S:20}
A.aH.prototype={
Z(){return"ManilhaMode."+this.b}}
A.dB.prototype={
O(){var s,r=this,q=A.o(t.N,t.X)
q.i(0,"manilhas",r.c.b)
q.i(0,"coberta",r.w)
if(!r.x)q.i(0,"cobertaParceiro",!1)
q.i(0,"ferro",r.y)
q.i(0,"verNoTruco",r.z)
q.i(0,"verNaMaoDeOnze",r.Q)
q.i(0,"terceiraCarta",r.as)
q.i(0,"tempo",r.at)
s=r.ax
if(s>0)q.i(0,"lento",s)
return q},
E(a,b){var s
switch(this.c.a){case 0:if(b!=null&&a.a===B.y[(b.a.a+1)%10])return 10+a.b.a
break
case 1:s=B.a.aA(B.a7,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b6.prototype={
O(){var s,r=A.o(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.gab())
if(this.c)r.i(0,"x",!0)
return r}}
A.cM.prototype={
O(){var s,r,q,p=A.o(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q)o.push(s[q].O())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.av.prototype={
O(){var s,r,q,p,o,n,m,l,k,j,i=this,h=t.N,g=A.o(h,t.X)
g.i(0,"me",i.a)
g.i(0,"rules",i.b.O())
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
for(q=i.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.x)(q),++o)r.push(q[o].O())
g.i(0,"rounds",r)
s=A.e([],s)
for(r=i.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.x)(r),++o)s.push(r[o].O())
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
for(r=r.gI(),r=r.gq(r);r.n();){p=r.gp()
m=p.a
l=A.e([],s)
for(p=p.b,k=p.length,o=0;o<p.length;p.length===k||(0,A.x)(p),++o){n=p[o]
j=n.b.b
if(0>=j.length)return A.b(j,0)
l.push(n.a.c+j[0])}q.i(0,""+m,l)}g.i(0,"shown",q)}if(i.id)g.i(0,"reveal",!0)
if(i.k1)g.i(0,"canShow",!0)
s=i.k2
if(s.gu(s)){h=A.o(h,h)
for(s=s.gI(),s=s.gq(s);s.n();){r=s.gp()
h.i(0,""+r.a,r.b)}g.i(0,"speech",h)}h=i.k3
if(h!=null)g.i(0,"toast",h)
if(i.k4)g.i(0,"showLast",!0)
h=i.ok
if(h>0)g.i(0,"delay",h)
h=i.p1
if(h!=null)g.i(0,"draw",h.O())
return g}}
A.dq.prototype={
$1(a){var s,r=a.a,q=a.c,p=!1
if(q){s=this.a
if(r!==s)p=r!==B.d.D(s+2,4)||!this.b.a.x}return new A.b6(r,p?null:a.b,q)},
$S:21}
A.d6.prototype={
O(){var s,r,q,p,o=this,n=t.N,m=A.o(n,t.X)
m.i(0,"n",o.a)
s=A.o(n,t.S)
for(r=o.b.gI(),r=r.gq(r);r.n();){q=r.gp()
s.i(0,""+q.a,q.b)}m.i(0,"p",s)
s=o.c
if(s.gu(s)){n=A.o(n,n)
for(s=s.gI(),s=s.gq(s);s.n();){r=s.gp()
q=r.a
r=r.b
p=r.b.b
if(0>=p.length)return A.b(p,0)
n.i(0,""+q,r.a.c+p[0])}m.i(0,"c",n)}n=o.d
if(n!=null)m.i(0,"d",n)
if(o.e)m.i(0,"to",!0)
if(o.f)m.i(0,"can",!0)
return m}}
A.bT.prototype={
a0(a){var s,r,q,p,o,n,m=this
t.B.a(a)
m.e=!1
for(s=a.$ti,r=new A.a3(a,a.gm(0),s.h("a3<D.E>")),s=s.h("D.E"),q=m.r,p=m.a;r.n();){o=r.d
if(o==null)o=s.a(o)
if(o instanceof A.b0){p.F(0)
m.b=null
m.d=!1
m.c=o.f
continue}if(o instanceof A.aX){m.c=m.e=m.d=!1
continue}if(o instanceof A.b7){p.i(0,o.a,o.c+"!")
continue}if(o instanceof A.bN){p.i(0,o.a,"Cai dentro!")
continue}if(o instanceof A.aC){n=o.a
p.i(0,n,o.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(o instanceof A.aZ){n=o.a
p.i(0,n,o.b?"Vamos jogar!":"Corro.")
continue}if(o instanceof A.b9){m.e=m.d=!0
continue}if(o instanceof A.ap){n=o.a
m.b=new A.c7(o.b,n)
continue}if(o instanceof A.aF){o=o.a
n=q.j(0,o)
n.toString
q.i(0,o,n+1)
continue}if(o instanceof A.aD){m.b=null
m.d=!1
continue}if(o instanceof A.aY)continue}},
bV(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.an.prototype={
Z(){return"GamePhase."+this.b}}
A.Z.prototype={}
A.H.prototype={
l(a){var s=this.b.l(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.P.prototype={
l(a){return"Raise("+this.a+")"}}
A.M.prototype={
l(a){return"Accept("+this.a+")"}}
A.S.prototype={
l(a){return"Fold("+this.a+")"}}
A.G.prototype={}
A.b0.prototype={}
A.aZ.prototype={}
A.aX.prototype={}
A.b7.prototype={}
A.bN.prototype={}
A.aC.prototype={}
A.b9.prototype={}
A.ap.prototype={}
A.aF.prototype={}
A.aY.prototype={}
A.aD.prototype={}
A.a4.prototype={}
A.bP.prototype={}
A.cJ.prototype={}
A.cq.prototype={
l(a){return"GameRuleError: "+this.a}}
A.dx.prototype={
gaz(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.b(s,r)
return s[r]},
gaF(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.D(r+2,4):B.d.D(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.D(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.D(q+1,4)
default:return null}},
aJ(a){return a.c?-1:this.a.E(a.b,this.y)},
ag(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.f)throw A.d(A.aa("hand still in progress"));++j.f
j.e=B.d.D(j.e+1,4)
s=t.L
r=A.b2($.e3(),s)
B.a.af(r,j.b)
q=t.ba
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.bb(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.x)(p),++m){l=A.as(p[m],!1,s)
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
j.cx=n?s.y:r
s=p===1?B.a.ga6(q):null
j.CW=s
j.r=s!=null?B.e:B.l
r=j.y
q=j.cx
B.a.k(j.d,new A.b0(j.x,r,s,q))},
b5(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.CW)return B.n
return A.e([new A.M(a),new A.S(a)],t.u)
case 2:s=o.ch
if(n===((s.a&1)===0?B.b:B.c))return B.n
if(s.c===a)return B.n
s=A.e([new A.M(a),new A.S(a)],t.u)
if(o.ch.b+1<5)s.push(new A.P(a))
return s
case 1:if(a!==o.as)return B.n
s=A.e([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.H(r[p],!1,a))
if(o.ga9()){r=o.w
if(!(a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.H(r[p],!0,a))}if(o.b0(a))s.push(new A.P(a))
return s
case 3:case 4:return B.n}},
ga9(){return this.a.w&&!this.cx&&this.z.length!==0},
b0(a){var s=this,r=!1
if(s.r===B.l)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
a0(a){var s,r,q,p,o=this,n=a.a
if(!B.a.S(o.b5(n),new A.dA(a)))throw A.d(A.aa("illegal "+a.l(0)+" in "+o.r.l(0)))
A:{if(a instanceof A.H){o.bv(a)
break A}if(a instanceof A.P){o.dx=!0
s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cJ(n,p,null)
o.r=B.h
s=o.a.d
if(!(p<5))return A.b(s,p)
B.a.k(o.d,new A.b7(n,s[p],B.a4[p-1]))
break A}if(a instanceof A.M){o.be(n)
break A}if(a instanceof A.S)o.bs(n)}},
be(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.aZ(a,!0))
q.r=B.l
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.l
if(!(r<5))return A.b(q.a.d,r)
B.a.k(q.d,new A.bN(a))},
bs(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.k(o.d,new A.aZ(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.ak(s,B.a.gN(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cJ(r.a,r.b,a)
B.a.k(o.d,new A.aC(a,!0))
return}B.a.k(o.d,new A.aC(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.b(q,p)
o.ak(s,q[p])},
bv(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.b(s,r)
q=a.b
B.a.bS(s[r],q)
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
e.a=k}r=A.E(s)
q=r.h("af<1>")
j=A.b2(new A.af(s,r.h("l(1)").a(new A.dy(e,f)),q),q.h("c.E"))
r=A.E(j)
i=new A.ad(j,r.h("I(1)").a(new A.dz()),r.h("ad<1,I>")).b8(0)
h=i.a===1?i.ga6(0):null
r=A.v(s,t.n)
q=B.a.gN(j).a
p=f.z
B.a.k(p,new A.bP(r,h,q))
B.a.F(s)
B.a.k(o,new A.b9(p.length))
g=A.il(p)
if(g!=null)f.ak(g.a,f.gaz())
else f.at=f.as=h==null?f.at:q},
ak(a,b){var s,r,q,p,o=this
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
B.a.k(s,new A.aF(a))
return}}o.r=B.f},
a4(a){var s,r,q=this
if(q.r===B.i)return
s=a===B.b?B.c:B.b
q.ch=null
q.fr=a
q.c.i(0,s,q.a.r)
q.db=s
q.r=B.i
r=q.d
B.a.k(r,new A.aD())
B.a.k(r,new A.aF(s))},
gaG(){if(this.r===B.f)var s=this.dx||this.CW!=null
else s=!1
return s},
au(a){var s=!1
if(this.gaG())if(!this.dy.M(a)){s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
s=A.v(s[a],t.L).length!==0}return s},
ae(a){var s,r,q=this
if(!q.au(a))throw A.d(A.aa("nothing to show"))
s=q.w
if(!(a>=0&&a<s.length))return A.b(s,a)
r=t.L
q.dy.i(0,a,A.v(A.v(s[a],r),r))
B.a.k(q.d,new A.aY())}}
A.dA.prototype={
$1(a){return A.he(t.M.a(a),this.a)},
$S:0}
A.dy.prototype={
$1(a){return this.b.aJ(t.n.a(a))===this.a.a},
$S:5}
A.dz.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:22}
A.bL.prototype={
gY(){var s,r=this.a
if(r.cx)r=B.t
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.b(r,s)
s=A.v(r[s],t.L)
r=s}return r},
gaE(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.Q||this.gb6()
else q=!0
s=B.d.D(r+2,4)
p=l.w
if(!(s<p.length))return A.b(p,s)
o=t.L
n=A.v(p[s],o)
if(q)return n
if(k.as&&l.e===r){r=l.x
if(!(s<r.length))return A.b(r,s)
o=A.v(r[s],o)
if(2>=o.length)return A.b(o,2)
m=o[2]
if(B.a.T(n,m))return A.e([m],t.Y)}return null},
gb6(){var s=this.a,r=!1
if(s.a.z)if(!s.cy)if(s.r===B.h){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbP(){var s,r,q,p,o,n,m=A.h7(this.gY(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gaE()
if(k!=null)m.W(0,k)
for(k=A.v(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.v(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.I.prototype={
Z(){return"Team."+this.b}}
A.dZ.prototype={
$1(a){return A.ix(A.ai(a))},
$S:23};(function aliases(){var s=J.ar.prototype
s.bc=s.l})();(function installTearOffs(){var s=hunkHelpers._instance_1u,r=hunkHelpers._static_1
s(A.a_.prototype,"gbF","M",7)
r(A,"id","hK",2)
s(A.cr.prototype,"gb4","bO",1)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.k,null)
q(A.k,[A.ea,J.ct,A.bQ,J.az,A.c,A.bn,A.q,A.am,A.w,A.dp,A.a3,A.bE,A.bZ,A.aM,A.t,A.a6,A.b3,A.bo,A.aN,A.at,A.dC,A.dn,A.di,A.aG,A.bC,A.bB,A.a5,A.cV,A.d_,A.c9,A.cZ,A.c2,A.r,A.cf,A.cl,A.co,A.dG,A.cT,A.bR,A.d7,A.C,A.bJ,A.bb,A.cW,A.bd,A.cQ,A.R,A.cr,A.dB,A.b6,A.cM,A.av,A.d6,A.bT,A.Z,A.G,A.a4,A.bP,A.cJ,A.cq,A.dx,A.bL])
q(J.ct,[J.cw,J.bt,J.bw,J.bv,J.bx,J.bu,J.b1])
q(J.bw,[J.ar,J.j,A.b4,A.bH])
q(J.ar,[J.cK,J.bW,J.aq])
r(J.cv,A.bQ)
r(J.dc,J.j)
q(J.bu,[J.bs,J.cx])
q(A.c,[A.bc,A.f,A.aI,A.af,A.c_,A.c1,A.bf])
r(A.aA,A.bc)
r(A.c0,A.aA)
q(A.q,[A.aB,A.a_,A.cX])
q(A.am,[A.ck,A.d4,A.cj,A.cP,A.de,A.dV,A.dX,A.dl,A.dv,A.dr,A.ds,A.dt,A.du,A.dw,A.e0,A.e1,A.d2,A.d3,A.dO,A.dP,A.d8,A.d9,A.da,A.dq,A.dA,A.dy,A.dz,A.dZ])
q(A.ck,[A.d5,A.dd,A.dW,A.dj,A.dm,A.dH,A.dQ,A.db])
q(A.w,[A.bA,A.bV,A.cy,A.cS,A.cN,A.cU,A.bz,A.ch,A.al,A.bX,A.cR,A.ba,A.cm])
q(A.f,[A.D,A.U,A.bD,A.a2])
q(A.D,[A.bS,A.ad,A.bO,A.cY])
r(A.br,A.aI)
q(A.a6,[A.be,A.aQ])
r(A.ag,A.be)
q(A.aQ,[A.ah,A.c7])
r(A.bg,A.b3)
r(A.aL,A.bg)
r(A.bp,A.aL)
r(A.N,A.bo)
q(A.at,[A.bq,A.c8])
r(A.ao,A.bq)
r(A.bK,A.bV)
q(A.cP,[A.cO,A.aW])
r(A.by,A.a_)
q(A.bH,[A.cA,A.b5])
q(A.b5,[A.c3,A.c5])
r(A.c4,A.c3)
r(A.bF,A.c4)
r(A.c6,A.c5)
r(A.bG,A.c6)
q(A.bF,[A.cB,A.cC])
q(A.bG,[A.cD,A.cE,A.cF,A.cG,A.cH,A.bI,A.cI])
r(A.ca,A.cU)
r(A.aO,A.c8)
r(A.cz,A.bz)
r(A.df,A.cl)
q(A.co,[A.dh,A.dg])
r(A.dF,A.dG)
q(A.al,[A.b8,A.cs])
q(A.cT,[A.a9,A.V,A.Q,A.aH,A.an,A.I])
q(A.cj,[A.dU,A.dT])
q(A.Z,[A.H,A.P,A.M,A.S])
q(A.G,[A.b0,A.aZ,A.aX,A.b7,A.bN,A.aC,A.b9,A.ap,A.aF,A.aY,A.aD])
s(A.c3,A.r)
s(A.c4,A.t)
s(A.c5,A.r)
s(A.c6,A.t)
s(A.bg,A.cf)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",m:"double",aU:"num",n:"String",l:"bool",bJ:"Null",i:"List",k:"Object",B:"Map",A:"JSObject"},mangledNames:{},types:["l(Z)","l(a)","@(@)","~(k?,k?)","l(R)","l(a4)","a()","l(k?)","@(@,n)","@(n)","~(@,@)","l(H)","i<a>(a)","l(+(a,a))","I(+(a,a))","l(Q)","l(V)","l(G)","~(I,n)","l(B<n,k?>)","~(a,i<av>)","b6(a4)","I(a4)","n(n)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ag&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ah&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.c7&&a.b(c.a)&&b.b(c.b)}}
A.hz(v.typeUniverse,JSON.parse('{"aq":"ar","cK":"ar","bW":"ar","iF":"b4","cw":{"l":[],"p":[]},"bt":{"p":[]},"bw":{"A":[]},"ar":{"A":[]},"j":{"i":["1"],"f":["1"],"A":[],"c":["1"]},"cv":{"bQ":[]},"dc":{"j":["1"],"i":["1"],"f":["1"],"A":[],"c":["1"]},"az":{"y":["1"]},"bu":{"m":[],"aU":[]},"bs":{"m":[],"a":[],"aU":[],"p":[]},"cx":{"m":[],"aU":[],"p":[]},"b1":{"n":[],"p":[]},"bc":{"c":["2"]},"bn":{"y":["2"]},"aA":{"bc":["1","2"],"c":["2"],"c.E":"2"},"c0":{"aA":["1","2"],"bc":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"aB":{"q":["3","4"],"B":["3","4"],"q.K":"3","q.V":"4"},"bA":{"w":[]},"f":{"c":["1"]},"D":{"f":["1"],"c":["1"]},"bS":{"D":["1"],"f":["1"],"c":["1"],"D.E":"1","c.E":"1"},"a3":{"y":["1"]},"aI":{"c":["2"],"c.E":"2"},"br":{"aI":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"bE":{"y":["2"]},"ad":{"D":["2"],"f":["2"],"c":["2"],"D.E":"2","c.E":"2"},"af":{"c":["1"],"c.E":"1"},"bZ":{"y":["1"]},"c_":{"c":["1"],"c.E":"1"},"aM":{"y":["1"]},"bO":{"D":["1"],"f":["1"],"c":["1"],"D.E":"1","c.E":"1"},"ag":{"be":[],"a6":[]},"ah":{"aQ":[],"a6":[]},"c7":{"aQ":[],"a6":[]},"bp":{"aL":["1","2"],"bg":["1","2"],"b3":["1","2"],"cf":["1","2"],"B":["1","2"]},"bo":{"B":["1","2"]},"N":{"bo":["1","2"],"B":["1","2"]},"c1":{"c":["1"],"c.E":"1"},"aN":{"y":["1"]},"bq":{"at":["1"],"aK":["1"],"f":["1"],"c":["1"]},"ao":{"bq":["1"],"at":["1"],"aK":["1"],"f":["1"],"c":["1"]},"bK":{"w":[]},"cy":{"w":[]},"cS":{"w":[]},"am":{"aE":[]},"cj":{"aE":[]},"ck":{"aE":[]},"cP":{"aE":[]},"cO":{"aE":[]},"aW":{"aE":[]},"cN":{"w":[]},"a_":{"q":["1","2"],"ec":["1","2"],"B":["1","2"],"q.K":"1","q.V":"2"},"U":{"f":["1"],"c":["1"],"c.E":"1"},"aG":{"y":["1"]},"bD":{"f":["1"],"c":["1"],"c.E":"1"},"bC":{"y":["1"]},"a2":{"f":["C<1,2>"],"c":["C<1,2>"],"c.E":"C<1,2>"},"bB":{"y":["C<1,2>"]},"by":{"a_":["1","2"],"q":["1","2"],"ec":["1","2"],"B":["1","2"],"q.K":"1","q.V":"2"},"aQ":{"a6":[]},"be":{"a6":[]},"b4":{"A":[],"p":[]},"bH":{"A":[]},"cA":{"A":[],"p":[]},"b5":{"T":["1"],"A":[]},"bF":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"A":[],"c":["m"],"t":["m"]},"bG":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"]},"cB":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"A":[],"c":["m"],"t":["m"],"p":[],"r.E":"m","t.E":"m"},"cC":{"r":["m"],"i":["m"],"T":["m"],"f":["m"],"A":[],"c":["m"],"t":["m"],"p":[],"r.E":"m","t.E":"m"},"cD":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cE":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cF":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cG":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cH":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"bI":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cI":{"r":["a"],"i":["a"],"T":["a"],"f":["a"],"A":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cU":{"w":[]},"ca":{"w":[]},"c9":{"y":["1"]},"bf":{"c":["1"],"c.E":"1"},"aO":{"at":["1"],"aK":["1"],"f":["1"],"c":["1"]},"c2":{"y":["1"]},"q":{"B":["1","2"]},"b3":{"B":["1","2"]},"aL":{"bg":["1","2"],"b3":["1","2"],"cf":["1","2"],"B":["1","2"]},"at":{"aK":["1"],"f":["1"],"c":["1"]},"c8":{"at":["1"],"aK":["1"],"f":["1"],"c":["1"]},"cX":{"q":["n","@"],"B":["n","@"],"q.K":"n","q.V":"@"},"cY":{"D":["n"],"f":["n"],"c":["n"],"D.E":"n","c.E":"n"},"bz":{"w":[]},"cz":{"w":[]},"m":{"aU":[]},"a":{"aU":[]},"i":{"f":["1"],"c":["1"]},"aK":{"f":["1"],"c":["1"]},"cT":{"b_":[]},"ch":{"w":[]},"bV":{"w":[]},"al":{"w":[]},"b8":{"w":[]},"cs":{"w":[]},"bX":{"w":[]},"cR":{"w":[]},"ba":{"w":[]},"cm":{"w":[]},"bR":{"w":[]},"bb":{"hc":[]},"cW":{"ee":[]},"bd":{"ee":[]},"a9":{"b_":[]},"V":{"b_":[]},"Q":{"b_":[]},"aH":{"b_":[]},"H":{"Z":[]},"ap":{"G":[]},"an":{"b_":[]},"P":{"Z":[]},"M":{"Z":[]},"S":{"Z":[]},"b0":{"G":[]},"aZ":{"G":[]},"aX":{"G":[]},"b7":{"G":[]},"bN":{"G":[]},"aC":{"G":[]},"b9":{"G":[]},"aF":{"G":[]},"aY":{"G":[]},"aD":{"G":[]},"I":{"b_":[]},"h1":{"i":["a"],"f":["a"],"c":["a"]},"hi":{"i":["a"],"f":["a"],"c":["a"]},"hh":{"i":["a"],"f":["a"],"c":["a"]},"h_":{"i":["a"],"f":["a"],"c":["a"]},"hf":{"i":["a"],"f":["a"],"c":["a"]},"h0":{"i":["a"],"f":["a"],"c":["a"]},"hg":{"i":["a"],"f":["a"],"c":["a"]},"fY":{"i":["m"],"f":["m"],"c":["m"]},"fZ":{"i":["m"],"f":["m"],"c":["m"]}}'))
A.hy(v.typeUniverse,JSON.parse('{"b5":1,"c8":1,"cl":2,"co":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.ab
return{l:s("M"),q:s("a9"),L:s("R"),J:s("N<n,k?>"),V:s("f<@>"),C:s("w"),r:s("S"),Z:s("aE"),M:s("Z"),E:s("G"),I:s("ao<V>"),A:s("ap"),B:s("c<G>"),bi:s("c<@>"),Y:s("j<R>"),u:s("j<Z>"),c4:s("j<G>"),ba:s("j<i<R>>"),bc:s("j<B<n,k>>"),d:s("j<B<n,k?>>"),c5:s("j<a4>"),cd:s("j<b6>"),w:s("j<+(a,a)>"),d2:s("j<bP>"),bP:s("j<cM>"),s:s("j<n>"),O:s("j<av>"),c:s("j<I>"),b:s("j<@>"),t:s("j<a>"),cG:s("j<a9?>"),v:s("j<I?>"),e:s("j<a?>"),T:s("bt"),m:s("A"),h:s("aq"),da:s("T<@>"),x:s("i<R>"),U:s("i<Z>"),a:s("i<n>"),Q:s("i<av>"),j:s("i<@>"),aH:s("i<a>"),W:s("i<k?>"),aJ:s("aH"),G:s("B<@,@>"),f:s("B<n,k?>"),p:s("B<a,i<av>>"),P:s("bJ"),K:s("k"),n:s("a4"),D:s("H"),aN:s("P"),al:s("Q"),cY:s("iG"),cD:s("+()"),R:s("+(a,a)"),F:s("bP"),at:s("aK<n>"),N:s("n"),_:s("V"),H:s("I"),bW:s("p"),cr:s("bW"),db:s("c_<H>"),ca:s("aM<ap>"),y:s("l"),i:s("m"),S:s("a"),ch:s("a9?"),cR:s("eE<bJ>?"),z:s("A?"),k:s("i<@>?"),a5:s("B<@,@>?"),X:s("k?"),aD:s("n?"),bM:s("I?"),g:s("cZ?"),az:s("l?"),dd:s("m?"),a3:s("a?"),ae:s("aU?"),o:s("aU"),cQ:s("~(n,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.X=J.ct.prototype
B.a=J.j.prototype
B.d=J.bs.prototype
B.q=J.bu.prototype
B.m=J.b1.prototype
B.Y=J.aq.prototype
B.Z=J.bw.prototype
B.J=J.cK.prototype
B.B=J.bW.prototype
B.p=new A.a9(0,"easy")
B.C=new A.a9(1,"medium")
B.j=new A.a9(2,"hard")
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
B.k=new A.dp()
B.T=new A.cW()
B.K=new A.Q("A",7,"ace")
B.v=new A.V(1,"espadas")
B.G=new A.R(B.K,B.v)
B.e=new A.an(0,"decision")
B.l=new A.an(1,"playing")
B.h=new A.an(2,"raisePending")
B.f=new A.an(3,"handOver")
B.i=new A.an(4,"gameOver")
B.a_=new A.dg(null)
B.a0=new A.dh(null)
B.u=new A.V(0,"ouros")
B.w=new A.V(2,"copas")
B.x=new A.V(3,"paus")
B.r=s([B.u,B.v,B.w,B.x],A.ab("j<V>"))
B.z=new A.aH(0,"vira")
B.a8=new A.aH(1,"fixed")
B.a1=s([B.z,B.a8],A.ab("j<aH>"))
B.a2=s([B.p,B.C,B.j],A.ab("j<a9>"))
B.b=new A.I(0,"a")
B.c=new A.I(1,"b")
B.a3=s([B.b,B.c],t.c)
B.a4=s(["Truco","Seis","Nove","Doze"],t.s)
B.t=s([],t.Y)
B.n=s([],t.u)
B.aF=s([],t.d)
B.a5=s([],t.b)
B.a6=s([1,3,6,9,12],t.t)
B.M=new A.Q("4",0,"four")
B.ak=new A.Q("5",1,"five")
B.L=new A.Q("6",2,"six")
B.A=new A.Q("7",3,"seven")
B.al=new A.Q("Q",4,"queen")
B.ai=new A.Q("J",5,"jack")
B.aj=new A.Q("K",6,"king")
B.am=new A.Q("2",8,"two")
B.ah=new A.Q("3",9,"three")
B.y=s([B.M,B.ak,B.L,B.A,B.al,B.ai,B.aj,B.K,B.am,B.ah],A.ab("j<Q>"))
B.U=new A.R(B.A,B.u)
B.V=new A.R(B.A,B.w)
B.W=new A.R(B.M,B.x)
B.a7=s([B.U,B.G,B.V,B.W],t.Y)
B.ag={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.aq=new A.ao([B.x,B.w],t.I)
B.ap=new A.ao([B.u,B.v],t.I)
B.ar=new A.ao([B.v,B.x],t.I)
B.as=new A.ao([B.u,B.w],t.I)
B.a9=new A.N(B.ag,[B.aq,B.ap,B.ar,B.as],A.ab("N<n,aK<V>>"))
B.I={}
B.aa=new A.N(B.I,[],A.ab("N<a,R>"))
B.H=new A.N(B.I,[],A.ab("N<a,i<k?>>"))
B.o={t:0}
B.ab=new A.N(B.o,["draw-end"],t.J)
B.ac=new A.N(B.o,["reveal-end"],t.J)
B.ad=new A.N(B.o,["bots-reveal"],t.J)
B.ae=new A.N(B.o,["next"],t.J)
B.af=new A.N(B.o,["draw"],t.J)
B.an=new A.ag(B.b)
B.ao=new A.ag(B.c)
B.at=A.a7("iB")
B.au=A.a7("iC")
B.av=A.a7("fY")
B.aw=A.a7("fZ")
B.ax=A.a7("h_")
B.ay=A.a7("h0")
B.az=A.a7("h1")
B.aA=A.a7("k")
B.aB=A.a7("hf")
B.aC=A.a7("hg")
B.aD=A.a7("hh")
B.aE=A.a7("hi")})();(function staticFields(){$.dE=null
$.X=A.e([],A.ab("j<k>"))
$.eN=null
$.eB=null
$.eA=null
$.fn=null
$.fk=null
$.fq=null
$.dN=null
$.dY=null
$.et=null
$.dI=A.e([],A.ab("j<i<k>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iE","ft",()=>A.dS("_$dart_dartClosure"))
s($,"iD","ey",()=>A.dS("_$dart_dartClosure_dartJSInterop"))
s($,"iS","fE",()=>A.e([new J.cv()],A.ab("j<bQ>")))
s($,"iH","fu",()=>A.ae(A.dD({
toString:function(){return"$receiver$"}})))
s($,"iI","fv",()=>A.ae(A.dD({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iJ","fw",()=>A.ae(A.dD(null)))
s($,"iK","fx",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iN","fA",()=>A.ae(A.dD(void 0)))
s($,"iO","fB",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iM","fz",()=>A.ae(A.eV(null)))
s($,"iL","fy",()=>A.ae(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iQ","fD",()=>A.ae(A.eV(void 0)))
s($,"iP","fC",()=>A.ae(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iR","e2",()=>A.ew(B.aA))
s($,"iT","e3",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.y[r]
for(p=0;p<4;++p)o.push(A.fN(q,B.r[p]))}return A.v(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b4,SharedArrayBuffer:A.b4,ArrayBufferView:A.bH,DataView:A.cA,Float32Array:A.cB,Float64Array:A.cC,Int16Array:A.cD,Int32Array:A.cE,Int8Array:A.cF,Uint16Array:A.cG,Uint32Array:A.cH,Uint8ClampedArray:A.bI,CanvasPixelArray:A.bI,Uint8Array:A.cI})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b5.$nativeSuperclassTag="ArrayBufferView"
A.c3.$nativeSuperclassTag="ArrayBufferView"
A.c4.$nativeSuperclassTag="ArrayBufferView"
A.bF.$nativeSuperclassTag="ArrayBufferView"
A.c5.$nativeSuperclassTag="ArrayBufferView"
A.c6.$nativeSuperclassTag="ArrayBufferView"
A.bG.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.iu
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()