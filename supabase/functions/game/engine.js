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
if(a[b]!==s){A.iD(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.ej(b)
return new s(c,this)}:function(){if(s===null)s=A.ej(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.ej(a).prototype
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
eo(a,b,c,d){return{i:a,p:b,e:c,x:d}},
ek(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.em==null){A.is()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eR("Return interceptor for "+A.t(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dB
if(o==null)o=$.dB=A.dP(n)
p=q[o]}if(p!=null)return p
p=A.ix(a)
if(p!=null)return p
if(typeof a=="function")return B.X
s=Object.getPrototypeOf(a)
if(s==null)return B.I
if(s===Object.prototype)return B.I
if(typeof q=="function"){o=$.dB
if(o==null)o=$.dB=A.dP(n)
Object.defineProperty(q,o,{value:B.A,enumerable:false,writable:true,configurable:true})
return B.A}return B.A},
h0(a,b){if(a<0||a>4294967295)throw A.d(A.aL(a,0,4294967295,"length",null))
return J.h1(new Array(a),b)},
eB(a,b){if(a<0)throw A.d(A.d_("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("i<0>"))},
e3(a,b){if(a<0)throw A.d(A.d_("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("i<0>"))},
h1(a,b){var s=A.e(a,b.h("i<0>"))
s.$flags=1
return s},
eC(a,b){var s=t.q
return J.fD(s.a(a),s.a(b))},
ax(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bs.prototype
return J.cu.prototype}if(typeof a=="string")return J.aG.prototype
if(a==null)return J.bt.prototype
if(typeof a=="boolean")return J.ct.prototype
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.m)return a
return J.ek(a)},
dO(a){if(typeof a=="string")return J.aG.prototype
if(a==null)return a
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.m)return a
return J.ek(a)},
cd(a){if(a==null)return a
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bu.prototype
return a}if(a instanceof A.m)return a
return J.ek(a)},
im(a){if(typeof a=="number")return J.b3.prototype
if(typeof a=="string")return J.aG.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.bf.prototype
return a},
O(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ax(a).E(a,b)},
a7(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.iv(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dO(a).l(a,b)},
fB(a,b,c){return J.cd(a).i(a,b,c)},
et(a,b){return J.cd(a).k(a,b)},
fC(a,b){return J.cd(a).T(a,b)},
fD(a,b){return J.im(a).aS(a,b)},
e0(a,b){return J.cd(a).J(a,b)},
a8(a){return J.ax(a).gu(a)},
fE(a){return J.dO(a).gt(a)},
fF(a){return J.cd(a).gv(a)},
ak(a){return J.cd(a).gq(a)},
cZ(a){return J.dO(a).gm(a)},
fG(a){return J.ax(a).gB(a)},
ce(a){return J.ax(a).j(a)},
cq:function cq(){},
ct:function ct(){},
bt:function bt(){},
bv:function bv(){},
as:function as(){},
cH:function cH(){},
bf:function bf(){},
ar:function ar(){},
bu:function bu(){},
bw:function bw(){},
i:function i(a){this.$ti=a},
cs:function cs(){},
d9:function d9(a){this.$ti=a},
az:function az(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
b3:function b3(){},
bs:function bs(){},
cu:function cu(){},
aG:function aG(){}},A={e4:function e4(){},
fM(a,b,c){if(t.O.b(a))return new A.bX(a,b.h("@<0>").A(c).h("bX<1,2>"))
return new A.aA(a,b.h("@<0>").A(c).h("aA<1,2>"))},
h3(a){return new A.b4("Field '"+a+"' has not been initialized.")},
h2(a){return new A.b4("Field '"+a+"' has already been initialized.")},
au(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
eb(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
en(a){var s,r
for(s=$.V.length,r=0;r<s;++r)if(a===$.V[r])return!0
return!1},
hc(a,b,c,d){A.e9(b,"start")
if(c!=null){A.e9(c,"end")
if(b>c)A.ay(A.aL(b,0,c,"start",null))}return new A.bR(a,b,c,d.h("bR<0>"))},
h8(a,b,c,d){if(t.O.b(a))return new A.br(a,b,c.h("@<0>").A(d).h("br<1,2>"))
return new A.aK(a,b,c.h("@<0>").A(d).h("aK<1,2>"))},
cr(){return new A.bd("No element")},
eA(){return new A.bd("Too many elements")},
bg:function bg(){},
bn:function bn(a,b){this.a=a
this.$ti=b},
aA:function aA(a,b){this.a=a
this.$ti=b},
bX:function bX(a,b){this.a=a
this.$ti=b},
aB:function aB(a,b){this.a=a
this.$ti=b},
d3:function d3(a,b){this.a=a
this.b=b},
d2:function d2(a){this.a=a},
b4:function b4(a){this.a=a},
dk:function dk(){},
f:function f(){},
H:function H(){},
bR:function bR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
ac:function ac(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aK:function aK(a,b,c){this.a=a
this.b=b
this.$ti=c},
br:function br(a,b,c){this.a=a
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
bV:function bV(a,b,c){this.a=a
this.b=b
this.$ti=c},
bW:function bW(a,b){this.a=a
this.$ti=b},
aO:function aO(a,b){this.a=a
this.$ti=b},
r:function r(){},
bN:function bN(a,b){this.a=a
this.$ti=b},
d4(a,b,c){var s,r,q,p,o,n,m,l=A.j(a),k=A.aI(new A.ab(a,l.h("ab<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.x)(k),++i,p=o){r=k[i]
c.a(a.l(0,r))
o=p+1
q[r]=p}n=A.aI(new A.bC(a,l.h("bC<2>")),!0,c)
m=new A.W(q,n,b.h("@<0>").A(c).h("W<1,2>"))
m.$keys=k
return m}return new A.bp(A.h4(a,b,c),b.h("@<0>").A(c).h("bp<1,2>"))},
fS(){throw A.d(A.bU("Cannot modify constant Set"))},
fo(a){var s=A.fn(a)
if(s!=null)return s
return"minified:"+a},
iv(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
t(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.ce(a)
return s},
bL(a){var s,r=$.eJ
if(r==null)r=$.eJ=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cI(a){var s,r,q,p
if(a instanceof A.m)return A.U(A.aj(a),null)
s=J.ax(a)
if(s===B.W||s===B.Y||t.cr.b(a)){r=B.C(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.U(A.aj(a),null)},
eK(a){var s,r,q
if(a==null||typeof a=="number"||A.eg(a))return J.ce(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.am)return a.j(0)
if(a instanceof A.a3)return a.aP(!0)
s=$.fA()
for(r=0;r<1;++r){q=s[r].bP(a)
if(q!=null)return q}return"Instance of '"+A.cI(a)+"'"},
K(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aO(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aL(a,0,1114111,null,null))},
b(a,b){if(a==null)J.cZ(a)
throw A.d(A.fi(a,b))},
fi(a,b){var s,r="index"
if(!A.eh(b))return new A.al(!0,b,r,null)
s=J.cZ(a)
if(b<0||b>=s)return A.e1(b,s,a,r)
return A.eM(b,r)},
d(a){return A.G(a,new Error())},
G(a,b){var s
if(a==null)a=new A.bS()
b.dartException=a
s=A.iF
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iF(){return J.ce(this.dartException)},
ay(a,b){throw A.G(a,b==null?new Error():b)},
aX(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.ay(A.hL(a,b,c),s)},
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
return new A.bT("'"+s+"': Cannot "+o+" "+l+k+n)},
x(a){throw A.d(A.a_(a))},
ae(a){var s,r,q,p,o,n
a=A.iA(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.e([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.dy(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dz(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
eQ(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
e5(a,b){var s=b==null,r=s?null:b.method
return new A.cv(a,r,s?null:b.receiver)},
eq(a){if(a==null)return new A.dj(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aW(a,a.dartException)
return A.ic(a)},
aW(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
ic(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aO(r,16)&8191)===10)switch(q){case 438:return A.aW(a,A.e5(A.t(s)+" (Error "+q+")",null))
case 445:case 5007:A.t(s)
return A.aW(a,new A.bJ())}}if(a instanceof TypeError){p=$.fq()
o=$.fr()
n=$.fs()
m=$.ft()
l=$.fw()
k=$.fx()
j=$.fv()
$.fu()
i=$.fz()
h=$.fy()
g=p.M(s)
if(g!=null)return A.aW(a,A.e5(A.a6(s),g))
else{g=o.M(s)
if(g!=null){g.method="call"
return A.aW(a,A.e5(A.a6(s),g))}else if(n.M(s)!=null||m.M(s)!=null||l.M(s)!=null||k.M(s)!=null||j.M(s)!=null||m.M(s)!=null||i.M(s)!=null||h.M(s)!=null){A.a6(s)
return A.aW(a,new A.bJ())}}return A.aW(a,new A.cP(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bQ()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aW(a,new A.al(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bQ()
return a},
ep(a){if(a==null)return J.a8(a)
if(typeof a=="object")return A.bL(a)
return J.a8(a)},
id(a){if(typeof a=="number")return B.p.gu(a)
if(a instanceof A.cY)return A.bL(a)
if(a instanceof A.a3)return a.gu(a)
return A.ep(a)},
ik(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
hU(a,b,c,d,e,f){t.Z.a(a)
switch(A.N(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(new A.dA("Unsupported number of arguments for wrapped closure"))},
ie(a,b){var s=a.$identity
if(!!s)return s
s=A.ig(a,b)
a.$identity=s
return s},
ig(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.hU)},
fR(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cL().constructor.prototype):Object.create(new A.aY(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ey(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fN(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ey(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fN(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fI)}throw A.d("Error in functionType of tearoff")},
fO(a,b,c,d){var s=A.ex
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ey(a,b,c,d){if(c)return A.fQ(a,b,d)
return A.fO(b.length,d,a,b)},
fP(a,b,c,d){var s=A.ex,r=A.fJ
switch(b?-1:a){case 0:throw A.d(new A.cK("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fQ(a,b,c){var s,r
if($.ev==null)$.ev=A.eu("interceptor")
if($.ew==null)$.ew=A.eu("receiver")
s=b.length
r=A.fP(s,c,a,b)
return r},
ej(a){return A.fR(a)},
fI(a,b){return A.ca(v.typeUniverse,A.aj(a.a),b)},
ex(a){return a.a},
fJ(a){return a.b},
eu(a){var s,r,q,p=new A.aY("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.d_("Field name "+a+" not found."))},
dP(a){return v.getIsolateTag(a)},
ix(a){var s,r,q,p,o,n=A.a6($.fj.$1(a)),m=$.dK[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dV[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.f7($.fg.$2(a,n))
if(q!=null){m=$.dK[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dV[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.dX(s)
$.dK[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dV[n]=s
return s}if(p==="-"){o=A.dX(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fl(a,s)
if(p==="*")throw A.d(A.eR(n))
if(v.leafTags[n]===true){o=A.dX(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fl(a,s)},
fl(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.eo(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
dX(a){return J.eo(a,!1,null,!!a.$iS)},
iz(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.dX(s)
else return J.eo(s,c,null,null)},
is(){if(!0===$.em)return
$.em=!0
A.it()},
it(){var s,r,q,p,o,n,m,l
$.dK=Object.create(null)
$.dV=Object.create(null)
A.ir()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.fm.$1(o)
if(n!=null){m=A.iz(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
ir(){var s,r,q,p,o,n,m=B.M()
m=A.bl(B.N,A.bl(B.O,A.bl(B.D,A.bl(B.D,A.bl(B.P,A.bl(B.Q,A.bl(B.R(B.C),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fj=new A.dS(p)
$.fg=new A.dT(o)
$.fm=new A.dU(n)},
bl(a,b){return a(b)||b},
ii(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
iA(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ag:function ag(a){this.a=a},
ah:function ah(a,b){this.a=a
this.b=b},
c3:function c3(a,b){this.a=a
this.b=b},
bp:function bp(a,b){this.a=a
this.$ti=b},
bo:function bo(){},
W:function W(a,b,c){this.a=a
this.b=b
this.$ti=c},
bY:function bY(a,b){this.a=a
this.$ti=b},
aP:function aP(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bq:function bq(){},
ap:function ap(a,b){this.a=a
this.$ti=b},
bP:function bP(){},
dy:function dy(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bJ:function bJ(){},
cv:function cv(a,b,c){this.a=a
this.b=b
this.c=c},
cP:function cP(a){this.a=a},
dj:function dj(a){this.a=a},
am:function am(){},
ch:function ch(){},
ci:function ci(){},
cM:function cM(){},
cL:function cL(){},
aY:function aY(a,b){this.a=a
this.b=b},
cK:function cK(a){this.a=a},
a0:function a0(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
da:function da(a){this.a=a},
de:function de(a,b){this.a=a
this.b=b
this.c=null},
ab:function ab(a,b){this.a=a
this.$ti=b},
bA:function bA(a,b,c,d){var _=this
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
aa:function aa(a,b){this.a=a
this.$ti=b},
bz:function bz(a,b,c,d){var _=this
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
dS:function dS(a){this.a=a},
dT:function dT(a){this.a=a},
dU:function dU(a){this.a=a},
a3:function a3(){},
aS:function aS(){},
bh:function bh(){},
b7:function b7(){},
bG:function bG(){},
cx:function cx(){},
b8:function b8(){},
bE:function bE(){},
bF:function bF(){},
cy:function cy(){},
cz:function cz(){},
cA:function cA(){},
cB:function cB(){},
cC:function cC(){},
cD:function cD(){},
cE:function cE(){},
bH:function bH(){},
cF:function cF(){},
c_:function c_(){},
c0:function c0(){},
c1:function c1(){},
c2:function c2(){},
ea(a,b){var s=b.c
return s==null?b.c=A.c8(a,"ez",[b.x]):s},
eN(a){var s=a.w
if(s===6||s===7)return A.eN(a.x)
return s===11||s===12},
ha(a){return a.as},
ai(a){return A.dG(v.typeUniverse,a,!1)},
aT(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aT(a1,s,a3,a4)
if(r===s)return a2
return A.eZ(a1,r,!0)
case 7:s=a2.x
r=A.aT(a1,s,a3,a4)
if(r===s)return a2
return A.eY(a1,r,!0)
case 8:q=a2.y
p=A.bk(a1,q,a3,a4)
if(p===q)return a2
return A.c8(a1,a2.x,p)
case 9:o=a2.x
n=A.aT(a1,o,a3,a4)
m=a2.y
l=A.bk(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ed(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bk(a1,j,a3,a4)
if(i===j)return a2
return A.f_(a1,k,i)
case 11:h=a2.x
g=A.aT(a1,h,a3,a4)
f=a2.y
e=A.i9(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.eX(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bk(a1,d,a3,a4)
o=a2.x
n=A.aT(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.ee(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.cg("Attempted to substitute unexpected RTI kind "+a0))}},
bk(a,b,c,d){var s,r,q,p,o=b.length,n=A.dH(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aT(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
ia(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dH(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aT(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
i9(a,b,c,d){var s,r=b.a,q=A.bk(a,r,c,d),p=b.b,o=A.bk(a,p,c,d),n=b.c,m=A.ia(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cS()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
fh(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ip(s)
return a.$S()}return null},
iu(a,b){var s
if(A.eN(b))if(a instanceof A.am){s=A.fh(a)
if(s!=null)return s}return A.aj(a)},
aj(a){if(a instanceof A.m)return A.j(a)
if(Array.isArray(a))return A.F(a)
return A.ef(J.ax(a))},
F(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
j(a){var s=a.$ti
return s!=null?s:A.ef(a)},
ef(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hS(a,s)},
hS(a,b){var s=a instanceof A.am?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hB(v.typeUniverse,s.name)
b.$ccache=r
return r},
ip(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dG(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
io(a){return A.aU(A.j(a))},
ei(a){var s
if(a instanceof A.a3)return A.ij(a.$r,a.aj())
s=a instanceof A.am?A.fh(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fG(a).a
if(Array.isArray(a))return A.F(a)
return A.aj(a)},
aU(a){var s=a.r
return s==null?a.r=new A.cY(a):s},
ij(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.b(q,0)
s=A.ca(v.typeUniverse,A.ei(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.b(q,r)
s=A.f1(v.typeUniverse,s,A.ei(q[r]))}return A.ca(v.typeUniverse,s,a)},
a4(a){return A.aU(A.dG(v.typeUniverse,a,!1))},
hR(a){var s=this
s.b=A.i8(s)
return s.b(a)},
i8(a){var s,r,q,p,o
if(a===t.K)return A.i_
if(A.aV(a))return A.i3
s=a.w
if(s===6)return A.hP
if(s===1)return A.fc
if(s===7)return A.hV
r=A.i7(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aV)){a.f="$i"+q
if(q==="h")return A.hY
if(a===t.m)return A.hX
return A.i2}}else if(s===10){p=A.ii(a.x,a.y)
o=p==null?A.fc:p
return o==null?A.f6(o):o}return A.hN},
i7(a){if(a.w===8){if(a===t.S)return A.eh
if(a===t.i||a===t.o)return A.hZ
if(a===t.N)return A.i1
if(a===t.y)return A.eg}return null},
hQ(a){var s=this,r=A.hM
if(A.aV(s))r=A.hI
else if(s===t.K)r=A.f6
else if(A.bm(s)){r=A.hO
if(s===t.a3)r=A.f4
else if(s===t.aD)r=A.f7
else if(s===t.az)r=A.cc
else if(s===t.ae)r=A.dI
else if(s===t.dd)r=A.hF
else if(s===t.aQ)r=A.hH}else if(s===t.S)r=A.N
else if(s===t.N)r=A.a6
else if(s===t.y)r=A.hD
else if(s===t.o)r=A.f5
else if(s===t.i)r=A.hE
else if(s===t.m)r=A.hG
s.a=r
return s.a(a)},
hN(a){var s=this
if(a==null)return A.bm(s)
return A.iw(v.typeUniverse,A.iu(a,s),s)},
hP(a){if(a==null)return!0
return this.x.b(a)},
i2(a){var s,r=this
if(a==null)return A.bm(r)
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.ax(a)[s]},
hY(a){var s,r=this
if(a==null)return A.bm(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.ax(a)[s]},
hX(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.m)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
fb(a){if(typeof a=="object"){if(a instanceof A.m)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hM(a){var s=this
if(a==null){if(A.bm(s))return a}else if(s.b(a))return a
throw A.G(A.f8(a,s),new Error())},
hO(a){var s=this
if(a==null||s.b(a))return a
throw A.G(A.f8(a,s),new Error())},
f8(a,b){return new A.c6("TypeError: "+A.eS(a,A.U(b,null)))},
eS(a,b){return A.cm(a)+": type '"+A.U(A.ei(a),null)+"' is not a subtype of type '"+b+"'"},
Y(a,b){return new A.c6("TypeError: "+A.eS(a,b))},
hV(a){var s=this
return s.x.b(a)||A.ea(v.typeUniverse,s).b(a)},
i_(a){return a!=null},
f6(a){if(a!=null)return a
throw A.G(A.Y(a,"Object"),new Error())},
i3(a){return!0},
hI(a){return a},
fc(a){return!1},
eg(a){return!0===a||!1===a},
hD(a){if(!0===a)return!0
if(!1===a)return!1
throw A.G(A.Y(a,"bool"),new Error())},
cc(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.G(A.Y(a,"bool?"),new Error())},
hE(a){if(typeof a=="number")return a
throw A.G(A.Y(a,"double"),new Error())},
hF(a){if(typeof a=="number")return a
if(a==null)return a
throw A.G(A.Y(a,"double?"),new Error())},
eh(a){return typeof a=="number"&&Math.floor(a)===a},
N(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.G(A.Y(a,"int"),new Error())},
f4(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.G(A.Y(a,"int?"),new Error())},
hZ(a){return typeof a=="number"},
f5(a){if(typeof a=="number")return a
throw A.G(A.Y(a,"num"),new Error())},
dI(a){if(typeof a=="number")return a
if(a==null)return a
throw A.G(A.Y(a,"num?"),new Error())},
i1(a){return typeof a=="string"},
a6(a){if(typeof a=="string")return a
throw A.G(A.Y(a,"String"),new Error())},
f7(a){if(typeof a=="string")return a
if(a==null)return a
throw A.G(A.Y(a,"String?"),new Error())},
hG(a){if(A.fb(a))return a
throw A.G(A.Y(a,"JSObject"),new Error())},
hH(a){if(a==null)return a
if(A.fb(a))return a
throw A.G(A.Y(a,"JSObject?"),new Error())},
fd(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.U(a[q],b)
return s},
i6(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.fd(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.U(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
f9(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.U(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.U(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.U(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.U(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.U(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
U(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.U(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.U(a.x,b)+">"
if(l===8){p=A.ib(a.x)
o=a.y
return o.length>0?p+("<"+A.fd(o,b)+">"):p}if(l===10)return A.i6(a,b)
if(l===11)return A.f9(a,b,null)
if(l===12)return A.f9(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.b(b,n)
return b[n]}return"?"},
ib(a){var s=A.fn(a)
if(s!=null)return s
return"minified:"+a},
hC(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hB(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dG(a,b,!1)
else if(typeof m=="number"){s=m
r=A.c9(a,5,"#")
q=A.dH(s)
for(p=0;p<s;++p)q[p]=r
o=A.c8(a,b,q)
n[b]=o
return o}else return m},
hA(a,b){return A.f2(a.tR,b)},
hz(a,b){return A.f2(a.eT,b)},
dG(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.f0(a,null,b,!1)
r.set(b,s)
return s},
ca(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.f0(a,b,c,!0)
q.set(c,r)
return r},
f1(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ed(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
f0(a,b,c,d){return A.hs(A.hm(a,b,c,d))},
aw(a,b){b.a=A.hQ
b.b=A.hR
return b},
c9(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a2(null,null)
s.w=b
s.as=c
r=A.aw(a,s)
a.eC.set(c,r)
return r},
eZ(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hx(a,b,r,c)
a.eC.set(r,s)
return s},
hx(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aV(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bm(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a2(null,null)
q.w=6
q.x=b
q.as=c
return A.aw(a,q)},
eY(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.hv(a,b,r,c)
a.eC.set(r,s)
return s},
hv(a,b,c,d){var s,r
if(d){s=b.w
if(A.aV(b)||b===t.K)return b
else if(s===1)return A.c8(a,"ez",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.a2(null,null)
r.w=7
r.x=b
r.as=c
return A.aw(a,r)},
hy(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a2(null,null)
s.w=13
s.x=b
s.as=q
r=A.aw(a,s)
a.eC.set(q,r)
return r},
c7(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hu(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
c8(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.c7(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a2(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.aw(a,r)
a.eC.set(p,q)
return q},
ed(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.c7(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a2(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.aw(a,o)
a.eC.set(q,n)
return n},
f_(a,b,c){var s,r,q="+"+(b+"("+A.c7(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a2(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.aw(a,s)
a.eC.set(q,r)
return r},
eX(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.c7(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.c7(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hu(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a2(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.aw(a,p)
a.eC.set(r,o)
return o},
ee(a,b,c,d){var s,r=b.as+("<"+A.c7(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hw(a,b,c,r,d)
a.eC.set(r,s)
return s},
hw(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dH(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aT(a,b,r,0)
m=A.bk(a,c,r,0)
return A.ee(a,n,m,c!==m)}}l=new A.a2(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.aw(a,l)},
hm(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hs(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.ho(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eU(a,r,l,k,!1)
else if(q===46)r=A.eU(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aR(a.u,a.e,k.pop()))
break
case 94:k.push(A.hy(a.u,k.pop()))
break
case 35:k.push(A.c9(a.u,5,"#"))
break
case 64:k.push(A.c9(a.u,2,"@"))
break
case 126:k.push(A.c9(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.hq(a,k)
break
case 38:A.hp(a,k)
break
case 63:p=a.u
k.push(A.eZ(p,A.aR(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.eY(p,A.aR(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.hn(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.eV(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.ht(a.u,a.e,o)
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
return A.aR(a.u,a.e,m)},
ho(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eU(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hC(s,o.x)[p]
if(n==null)A.ay('No "'+p+'" in "'+A.ha(o)+'"')
d.push(A.ca(s,o,n))}else d.push(p)
return m},
hq(a,b){var s,r=a.u,q=A.eT(a,b),p=b.pop()
if(typeof p=="string")b.push(A.c8(r,p,q))
else{s=A.aR(r,a.e,p)
switch(s.w){case 11:b.push(A.ee(r,s,q,a.n))
break
default:b.push(A.ed(r,s,q))
break}}},
hn(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eT(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aR(p,a.e,o)
q=new A.cS()
q.a=s
q.b=n
q.c=m
b.push(A.eX(p,r,q))
return
case-4:b.push(A.f_(p,b.pop(),s))
return
default:throw A.d(A.cg("Unexpected state under `()`: "+A.t(o)))}},
hp(a,b){var s=b.pop()
if(0===s){b.push(A.c9(a.u,1,"0&"))
return}if(1===s){b.push(A.c9(a.u,4,"1&"))
return}throw A.d(A.cg("Unexpected extended operation "+A.t(s)))},
eT(a,b){var s=b.splice(a.p)
A.eV(a.u,a.e,s)
a.p=b.pop()
return s},
aR(a,b,c){if(typeof c=="string")return A.c8(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hr(a,b,c)}else return c},
eV(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aR(a,b,c[s])},
ht(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aR(a,b,c[s])},
hr(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.cg("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.cg("Bad index "+c+" for "+b.j(0)))},
iw(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.C(a,b,null,c,null)
r.set(c,s)}return s},
C(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aV(d))return!0
s=b.w
if(s===4)return!0
if(A.aV(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.C(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.C(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.C(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.C(a,b.x,c,d,e))return!1
return A.C(a,A.ea(a,b),c,d,e)}if(s===6)return A.C(a,p,c,d,e)&&A.C(a,b.x,c,d,e)
if(q===7){if(A.C(a,b,c,d.x,e))return!0
return A.C(a,b,c,A.ea(a,d),e)}if(q===6)return A.C(a,b,c,p,e)||A.C(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.cY)return!0
if(q===12){if(b===t.V)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.C(a,j,c,i,e)||!A.C(a,i,e,j,c))return!1}return A.fa(a,b.x,c,d.x,e)}if(q===11){if(b===t.V)return!0
if(p)return!1
return A.fa(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hW(a,b,c,d,e)}if(o&&q===10)return A.i0(a,b,c,d,e)
return!1},
fa(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.C(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.C(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.C(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.C(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.C(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
hW(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.ca(a,b,r[o])
return A.f3(a,p,null,c,d.y,e)}return A.f3(a,b.y,null,c,d.y,e)},
f3(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.C(a,b[s],d,e[s],f))return!1
return!0},
i0(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.C(a,r[s],c,q[s],e))return!1
return!0},
bm(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aV(a))if(s!==6)r=s===7&&A.bm(a.x)
return r},
aV(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
f2(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dH(a){return a>0?new Array(a):v.typeUniverse.sEA},
a2:function a2(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cS:function cS(){this.c=this.b=this.a=null},
cY:function cY(a){this.a=a},
cR:function cR(){},
c6:function c6(a){this.a=a},
eW(a,b,c){return 0},
c5:function c5(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
bi:function bi(a,b){this.a=a
this.$ti=b},
eE(a,b){return new A.a0(a.h("@<0>").A(b).h("a0<1,2>"))},
aH(a,b,c){return b.h("@<0>").A(c).h("e6<1,2>").a(A.ik(a,new A.a0(b.h("@<0>").A(c).h("a0<1,2>"))))},
w(a,b){return new A.a0(a.h("@<0>").A(b).h("a0<1,2>"))},
eG(a){return new A.aQ(a.h("aQ<0>"))},
dg(a){return new A.aQ(a.h("aQ<0>"))},
ec(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
h4(a,b,c){var s=A.eE(b,c)
a.F(0,new A.df(s,b,c))
return s},
eF(a,b,c){var s=A.eE(b,c)
s.T(0,a)
return s},
h5(a,b){var s=A.eG(b)
s.T(0,a)
return s},
e7(a){var s,r
if(A.en(a))return"{...}"
s=new A.be("")
try{r={}
B.a.k($.V,a)
s.a+="{"
r.a=!0
a.F(0,new A.di(r,s))
s.a+="}"}finally{if(0>=$.V.length)return A.b($.V,-1)
$.V.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
aQ:function aQ(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cW:function cW(a){this.a=a
this.c=this.b=null},
bZ:function bZ(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
df:function df(a,b,c){this.a=a
this.b=b
this.c=c},
q:function q(){},
o:function o(){},
dh:function dh(a){this.a=a},
di:function di(a,b){this.a=a
this.b=b},
cb:function cb(){},
b6:function b6(){},
aN:function aN(a,b){this.a=a
this.$ti=b},
at:function at(){},
c4:function c4(){},
bj:function bj(){},
i5(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.eq(r)
q=String(s)
throw A.d(new A.d5(q))}q=A.dJ(p)
return q},
dJ(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cU(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dJ(a[s])
return a},
eD(a,b,c){return new A.by(a,b)},
hK(a){return a.O()},
hk(a,b){return new A.dC(a,[],A.ih())},
hl(a,b,c){var s,r=new A.be(""),q=A.hk(r,b)
q.ac(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cU:function cU(a,b){this.a=a
this.b=b
this.c=null},
cV:function cV(a){this.a=a},
cj:function cj(){},
cl:function cl(){},
by:function by(a,b){this.a=a
this.b=b},
cw:function cw(a,b){this.a=a
this.b=b},
db:function db(){},
dd:function dd(a){this.b=a},
dc:function dc(a){this.a=a},
dD:function dD(){},
dE:function dE(a,b){this.a=a
this.b=b},
dC:function dC(a,b,c){this.c=a
this.a=b
this.b=c},
h6(a,b,c,d){var s,r=c?J.eB(a,d):J.h0(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
aI(a,b,c){var s,r=A.e([],c.h("i<0>"))
for(s=J.ak(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
b5(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("i<0>"))
s=A.e([],b.h("i<0>"))
for(r=J.ak(a);r.n();)B.a.k(s,r.gp())
return s},
h7(a,b,c){var s,r=J.eB(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
z(a,b){var s=A.aI(a,!1,b)
s.$flags=3
return s},
eP(a,b,c){var s=J.ak(b)
if(!s.n())return a
if(c.length===0){do a+=A.t(s.gp())
while(s.n())}else{a+=A.t(s.gp())
while(s.n())a=a+c+A.t(s.gp())}return a},
fU(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fH(b,"name","No enum value with that name"))},
fT(a,b){var s,r,q=A.w(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cm(a){if(typeof a=="number"||A.eg(a)||a==null)return J.ce(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eK(a)},
cg(a){return new A.cf(a)},
d_(a){return new A.al(!1,null,null,a)},
fH(a,b,c){return new A.al(!0,a,b,c)},
eL(a){var s=null
return new A.bb(s,s,!1,s,s,a)},
eM(a,b){return new A.bb(null,null,!0,a,b,"Value not in range")},
aL(a,b,c,d,e){return new A.bb(b,c,!0,a,d,"Invalid value")},
h9(a,b,c){if(0>a||a>c)throw A.d(A.aL(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aL(b,a,c,"end",null))
return b}return c},
e9(a,b){if(a<0)throw A.d(A.aL(a,0,null,b,null))
return a},
e1(a,b,c,d){return new A.cp(b,!0,a,d,"Index out of range")},
bU(a){return new A.bT(a)},
eR(a){return new A.cO(a)},
eO(a){return new A.bd(a)},
a_(a){return new A.ck(a)},
h_(a,b,c){var s,r
if(A.en(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.k($.V,a)
try{A.i4(a,s)}finally{if(0>=$.V.length)return A.b($.V,-1)
$.V.pop()}r=A.eP(b,t.bi.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
e2(a,b,c){var s,r
if(A.en(a))return b+"..."+c
s=new A.be(b)
B.a.k($.V,a)
try{r=s
r.a=A.eP(r.a,a,", ")}finally{if(0>=$.V.length)return A.b($.V,-1)
$.V.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
i4(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.t(l.gp())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.b(b,-1)
r=b.pop()
if(0>=b.length)return A.b(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.k(b,A.t(p))
return}r=A.t(p)
if(0>=b.length)return A.b(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.b(b,-1)
k-=b.pop().length+2;--j}B.a.k(b,"...")
return}}q=A.t(p)
r=A.t(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.b(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.k(b,m)
B.a.k(b,q)
B.a.k(b,r)},
eH(a,b,c,d,e){return new A.aB(a,b.h("@<0>").A(c).A(d).A(e).h("aB<1,2,3,4>"))},
eI(a,b,c,d){var s
if(B.j===c){s=B.d.gu(a)
b=J.a8(b)
return A.eb(A.au(A.au($.e_(),s),b))}if(B.j===d){s=B.d.gu(a)
b=J.a8(b)
c=J.a8(c)
return A.eb(A.au(A.au(A.au($.e_(),s),b),c))}s=B.d.gu(a)
b=J.a8(b)
c=J.a8(c)
d=J.a8(d)
d=A.eb(A.au(A.au(A.au(A.au($.e_(),s),b),c),d))
return d},
cQ:function cQ(){},
u:function u(){},
cf:function cf(a){this.a=a},
bS:function bS(){},
al:function al(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bb:function bb(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
cp:function cp(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bT:function bT(a){this.a=a},
cO:function cO(a){this.a=a},
bd:function bd(a){this.a=a},
ck:function ck(a){this.a=a},
bQ:function bQ(){},
dA:function dA(a){this.a=a},
d5:function d5(a){this.a=a},
c:function c(){},
B:function B(a,b,c){this.a=a
this.b=b
this.$ti=c},
bI:function bI(){},
m:function m(){},
be:function be(a){this.a=a},
cT:function cT(){},
cX:function cX(){this.b=this.a=0},
iC(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b5(a1,t.bM),c=A.b5(a,t.R)
for(s=A.F(c),r=s.h("p(1)"),s=s.h("af<1>"),q=s.h("c.E"),p=b,o=a2;;){n={}
m=A.fk(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.b(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.a8(k,p.b)
p=null}else j=A.el(k,c,d,o)
k.$flags&1&&A.aX(k,"removeAt",1)
if(j<0||j>=k.length)A.ay(A.eM(j,null))
B.a.k(c,new A.ah(o,k.splice(j,1)[0]))
o=B.d.C(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.b5(new A.af(c,r.a(new A.dY(n)),s),q)
l=A.F(f)
e=new A.ad(f,l.h("E(1)").a(new A.dZ()),l.h("ad<1,E>")).b1(0)
B.a.k(d,e.a===1?e.ga4(0):null)
o=B.a.gU(f).a
B.a.I(c)}},
el(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=new A.dR(a),d=new A.dQ(a)
if(a.length===1)return 0
s=(a0&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gU(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?d.$0():e.$0()
q=A.b5(a,t.S)
B.a.b4(q)
if(B.a.gbJ(q)>=10){p=q.length
o=p-2
if(!(o>=0))return A.b(q,o)
o=q[o]>=6
p=o}else p=!1
if(p){p=q.length
o=p-2
if(!(o>=0))return A.b(q,o)
return B.a.a8(a,q[o])}return d.$0()}for(n=-2,m=-2,l=0;l<q;++l){p=b[l]
k=p.b
if(((p.a&1)===0?B.b:B.c)===s)m=Math.max(m,k)
else n=Math.max(n,k)}if(q===1)q=((B.a.gU(b).a&1)===0?B.b:B.c)!==s
else q=!1
if(q){for(q=a.length,j=-1,i=0;i<q;++i){p=a[i]
if(p>n)if(j>=0){if(!(j>=0&&j<q))return A.b(a,j)
p=p<a[j]}else p=!0
else p=!1
if(p)j=i}if(j>=0){if(!(j<q))return A.b(a,j)
q=a[j]<10||r}else q=!1
if(q)return j
return e.$0()}q=b.length
p=m>n
if(p)q=q===3||m>=8
else q=!1
if(q)return e.$0()
q=p?m:-2
h=Math.max(n,q)
for(q=a.length,g=-1,i=0;i<q;++i){p=a[i]
if(p>h)if(g>=0){if(!(g>=0&&g<q))return A.b(a,g)
p=p<a[g]}else p=!0
else p=!1
if(p)g=i}if(g>=0)return g
if(c.length!==0&&B.a.gU(c)===s){f=B.a.a8(a,n)
if(f>=0)return f}return e.$0()},
a5:function a5(a,b){this.a=a
this.b=b},
cN:function cN(a,b){this.a=a
this.b=b},
dr:function dr(){},
dn:function dn(){},
dp:function dp(){},
dq:function dq(a,b){this.a=a
this.b=b},
ds:function ds(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dY:function dY(a){this.a=a},
dZ:function dZ(){},
dR:function dR(a){this.a=a},
dQ:function dQ(a){this.a=a},
fK(a,b){return new A.P(a,b)},
fL(a){return new A.P(B.a.aV(B.x,new A.d0(a)),B.a.aV(B.q,new A.d1(a)))},
T:function T(a,b){this.a=a
this.b=b},
M:function M(a,b,c){this.c=a
this.a=b
this.b=c},
P:function P(a,b){this.a=a
this.b=b},
d0:function d0(a){this.a=a},
d1:function d1(a){this.a=a},
il(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.w(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.dg(s))
if(B.a.W(a7,new A.dL()))return a6
q=new A.dN(a6)
p=A.dg(t.H)
o=A.w(a5,t.L)
for(a5=a7.length,s=t._,n=!1,m=null,l=1,k=0,j=!1,i=!1,h=0;h<a7.length;a7.length===a5||(0,A.x)(a7),++h){g=a7[h]
A:{if(g instanceof A.b2){o.I(0)
m=g
l=1
k=0
j=!1
i=!1
break A}if(g instanceof A.ba){k=g.b
break A}f=g instanceof A.aC
if(f&&g.b)break A
if(f){p.k(0,(g.a&1)===0?B.b:B.c)
i=k===6
j=!0
break A}if(g instanceof A.aZ){if(l===3&&!g.c)o.i(0,g.a,g.b)
break A}if(g instanceof A.bc){l=g.a+1
break A}if(g instanceof A.aq){e=g.a
f=m!=null
if(f&&m.e==null&&g.b>1)n=!0
if(!f||e==null)continue
if(i)q.$2(e,"game_seis_burro")
f=!j
if(f&&g.b===12)q.$2(e,"game_truco_12")
if(m.f)q.$2(e,"game_iron_hand")
for(d=m.d,c=m.b,r=0;r<4;++r){if(((r&1)===0?B.b:B.c)!==e)continue
if(f&&J.O(o.l(0,r),B.F))a6.l(0,r).k(0,"game_ace_river")
b=c.length
if(b!==4)continue
if(!(r<b))return A.b(c,r)
a=c[r]
if(a.length===3&&B.a.aU(a,new A.dM()))a6.l(0,r).k(0,"game_666")
b=A.dg(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.x)(a),++a1){a2=a[a1]
if(a8.D(a2,d)>=10){a3=a8.D(a2,d)-10
if(!(a3>=0&&a3<4))return A.b(B.q,a3)
b.k(0,B.q[a3])}}for(a0=B.a8.gK(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.by(a3.b))a6.l(0,r).k(0,a4)}}break A}if(g instanceof A.aD||g instanceof A.b_)break A
if(g instanceof A.aF){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.N(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dL:function dL(){},
dN:function dN(a){this.a=a},
dM:function dM(){},
ff(a){var s
A:{if(a instanceof A.I){s=A.w(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.ga7())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.L){s=A.aH(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.J){s=A.aH(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.Q){s=A.aH(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
fe(a){var s,r,q=a.l(0,"s")
q.toString
A.N(q)
s=a.l(0,"t")
A:{if("play"===s){r=a.l(0,"c")
r.toString
q=new A.I(A.fL(A.a6(r)),J.O(a.l(0,"x"),!0),q)
break A}if("raise"===s){q=new A.L(q)
break A}if("accept"===s){q=new A.J(q)
break A}if("fold"===s){q=new A.Q(q)
break A}q=A.ay(A.ao("unknown action "+A.t(a.l(0,"t"))))}return q},
co:function co(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$
_.w=g
_.x=0
_.y=h
_.z=!1},
d6:function d6(a){this.a=a},
d7:function d7(a){this.a=a},
d8:function d8(a){this.a=a},
aJ:function aJ(a,b){this.a=a
this.b=b},
dx:function dx(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
hd(b3,b4,b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bK(b3,b4),b0=new A.dm(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
A:{if(B.f===b2){s=b3.ch
s=((s.a&1)===0?B.b:B.c)!==b1&&s.c!==b4&&b7.$1(b4)
break A}if(B.e===b2){s=b3.CW===b1&&b7.$1(b4)
break A}s=!1
break A}r=b3.r
q=b3.as
p=b3.e
o=B.d.C(b3.at+3,4)
n=b3.f
m=b3.y
l=b3.gap()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.d4(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.z(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cJ(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.z(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.gY()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.b(a2,a5)
a6=A.aI(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gaw()
a2=a9.gaZ()
a3=b3.gan()
a7=b3.aQ(b4)
a8=b3.r===B.k&&b3.as===b4
return new A.av(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,b3.fr,A.d4(b3.dy,g,t.x),b8,b5,A.d4(b9.a,g,t.N),b9.bO(b1),b9.d,b6)},
b9:function b9(a,b,c){this.a=a
this.b=b
this.c=c},
cJ:function cJ(a,b,c){this.a=a
this.b=b
this.c=c},
av:function av(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3){var _=this
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
_.ok=b3},
dm:function dm(a){this.a=a},
dl:function dl(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
ao(a){return new A.cn(a)},
he(a,b,c){var s,r,q,p,o,n=t.S,m=A.aH([B.b,0,B.c,0],t.H,n),l=A.e([],t.c4),k=t.x,j=J.e3(4,k)
for(s=t.Y,r=0;r<4;++r)j[r]=A.e([],s)
q=J.e3(4,k)
for(r=0;r<4;++r)q[r]=A.e([],s)
s=A.e([],t.d2)
p=A.e([],t.c5)
o=new A.cX()
o.b8(c)
n=new A.dt(b,o,m,l,B.d.C(a+3,4),B.h,j,q,s,p,A.w(n,k))
n.ad()
return n},
hf(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.I
r=!1
if(s){r=b instanceof A.I
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.E(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.L){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.L
q=a}else q=o
if(r){r=s?p:b
t.aN.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.J){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.J
q=a}else q=o
if(r){r=s?p:b
t.l.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.Q){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.Q
q=a}else q=o
if(r){r=s?p:b
t.r.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
iq(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.x)(a),++r)q.push(a[r].b)
return A.fk(q)},
fk(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.aj
if(q>=2)return B.ak
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.ag(n)
if(l&&m!=null)return new A.ag(m)}if(s===3){if(2>=s)return A.b(a,2)
s=a[2]
return new A.ag(s==null?a[0]:s)}return null},
an:function an(a,b){this.a=a
this.b=b},
X:function X(){},
I:function I(a,b,c){this.b=a
this.c=b
this.a=c},
L:function L(a){this.a=a},
J:function J(a){this.a=a},
Q:function Q(a){this.a=a},
D:function D(){},
b2:function b2(a,b,c,d){var _=this
_.b=a
_.d=b
_.e=c
_.f=d},
b0:function b0(a,b){this.a=a
this.b=b},
aZ:function aZ(a,b,c){this.a=a
this.b=b
this.c=c},
ba:function ba(a,b,c){this.a=a
this.b=b
this.c=c},
bM:function bM(a){this.a=a},
aC:function aC(a,b){this.a=a
this.b=b},
bc:function bc(a){this.a=a},
aq:function aq(a,b){this.a=a
this.b=b},
aF:function aF(a){this.a=a},
b_:function b_(){},
aD:function aD(){},
a1:function a1(a,b,c){this.a=a
this.b=b
this.c=c},
bO:function bO(a,b,c){this.a=a
this.b=b
this.c=c},
cG:function cG(a,b,c){this.a=a
this.b=b
this.c=c},
cn:function cn(a){this.a=a},
dt:function dt(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
dw:function dw(a){this.a=a},
du:function du(a,b){this.a=a
this.b=b},
dv:function dv(){},
bK:function bK(a,b){this.a=a
this.b=b},
E:function E(a,b){this.a=a
this.b=b},
iB(b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=null,a7="forfeit",a8=t.G,a9=t.N,b0=t.X,b1=a8.a(B.E.bz(b3,a6)).H(0,a9,b0),b2=J.a7(b1,"rules")
b2.toString
b2=a8.a(b2).H(0,a9,b0)
h=A.fT(B.a0,t.aJ).l(0,b2.l(0,"manilhas"))
g=A.cc(b2.l(0,"coberta"))
f=A.cc(b2.l(0,"ferro"))
e=A.cc(b2.l(0,"verNoTruco"))
d=A.cc(b2.l(0,"verNaMaoDeOnze"))
c=A.cc(b2.l(0,"terceiraCarta"))
b=A.dI(b2.l(0,"tempo"))
b=b==null?a6:B.p.b0(b)
b2=A.dI(b2.l(0,"lento"))
b2=b2==null?a6:B.p.b0(b2)
if(h==null)h=B.y
if(b==null)b=20
if(b2==null)b2=0
b2=new A.dx("paulista","Truco",h,B.a5,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b,b2)
b=J.a7(b1,"seed")
b.toString
A.N(b)
c=J.a7(b1,"firstDealer")
c.toString
A.N(c)
d=A.e([],t.cG)
h=J.a7(b1,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.k
a=0
for(;a<h.length;h.length===g||(0,A.x)(h),++a){a0=h[a]
d.push(a0==null?a6:A.fU(B.a1,A.a6(a0),f))}h=t.d
g=A.e([],h)
f=t.h.a(J.a7(b1,"log"))
if(f==null)f=B.a4
e=f.length
a=0
for(;a<f.length;f.length===e||(0,A.x)(f),++a)g.push(a8.a(f[a]).H(0,a9,b0))
f=t.S
e=A.aH([B.b,0,B.c,0],t.H,f)
a1=A.z(d,t.ch)
a2=new A.co(b2,b,c,a1,A.e([],h),B.S,new A.dl(A.w(f,a9),e),A.dg(f))
a2.b7(d,c,g,a6,b2,b)
s=a2
r=null
q=null
b2=t.a5.a(J.a7(b1,"act"))
p=b2==null?a6:b2.H(0,a9,b0)
try{if(A.eh(J.a7(b1,a7))){a8=J.a7(b1,a7)
a8.toString
a3=s.a3(A.N(a8))}else if(J.O(J.a7(b1,"timeout"),!0)){a8=s.bN(A.f4(J.a7(b1,"missLimit")))
a3=a8}else{if(p==null){a8=s
a4=A.w(f,t.Q)
a8.a0(a4)
if(a4.a===0)a8.R(a4,0)
a8=a4}else{b2=p.l(0,"seat")
b2.toString
A.N(b2)
h=p.l(0,"action")
h.toString
b0=s.bx(b2,a8.a(h).H(0,a9,b0))
a8=b0}a3=a8}o=a3
n=A.w(f,t.W)
for(a8=o,a8=new A.aa(a8,A.j(a8).h("aa<1,2>")).gq(0);a8.n();){b0=a8.d
b0.toString
m=b0
b0=m.a
l=[]
for(b2=m.b,h=b2.length,a=0;a<b2.length;b2.length===h||(0,A.x)(b2),++a){k=b2[a]
J.et(l,k.O())}J.fB(n,b0,l)}r=n}catch(a5){n=A.eq(a5)
if(n instanceof A.cn){j=n
q=j.a
r=B.G}else{i=n
q=A.t(i)
r=B.G}}n=s.r
n===$&&A.Z()
l=t.K
a8=A.w(a9,l)
a8.i(0,"log",s.e)
b0=A.w(a9,t.W)
for(b2=r.gK(),b2=b2.gq(b2);b2.n();){h=b2.gp()
b0.i(0,""+h.a,h.b)}a8.i(0,"frames",b0)
a8.i(0,"phase",n.r.b)
b0=n.db
if(b0!=null)a8.i(0,"winner",b0.b)
b0=n.c
a8.i(0,"scores",A.e([b0.l(0,B.b),b0.l(0,B.c)],t.e))
b0=s.gaA()
if(b0!=null)a8.i(0,"waitingFor",b0)
if(s.gZ())a8.i(0,"reveal",!0)
b0=A.e([],t.bc)
for(b2=n.d,h=B.a.gq(b2),g=new A.aO(h,t.ca),f=t.A;g.n();){e=f.a(h.gp())
d=A.w(a9,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b0.push(d)}a8.i(0,"hands",b0)
if(n.r===B.i){l=A.w(a9,t.a)
for(a9=A.il(b2,n.a),a9=new A.aa(a9,A.j(a9).h("aa<1,2>")).gq(0);a9.n();){m=a9.d
b0=m.b
if(b0.gv(b0)){b2=m.a
b0=A.b5(b0,A.j(b0).c)
l.i(0,""+b2,b0)}}a8.i(0,"feats",l)}n=n.fr
if(n!=null)a8.i(0,a7,n.b)
n=q
if(n!=null)a8.i(0,"error",n)
return B.E.bB(a8,a6)},
iy(){var s,r=v.G.globalThis,q=new A.dW()
if(typeof q=="function")A.ay(A.d_("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hJ,q)
s[$.er()]=q
r.trucoEngine=s},
dW:function dW(){},
fn(a){return v.mangledGlobalNames[a]},
iD(a){throw A.G(new A.b4("Field '"+a+"' has been assigned during initialization."),new Error())},
Z(){throw A.G(A.h3(""),new Error())},
iE(){throw A.G(A.h2(""),new Error())},
hJ(a,b,c){t.Z.a(a)
if(A.N(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.e4.prototype={}
J.cq.prototype={
E(a,b){return a===b},
gu(a){return A.bL(a)},
j(a){return"Instance of '"+A.cI(a)+"'"},
gB(a){return A.aU(A.ef(this))}}
J.ct.prototype={
j(a){return String(a)},
gu(a){return a?519018:218159},
gB(a){return A.aU(t.y)},
$in:1,
$ip:1}
J.bt.prototype={
E(a,b){return null==b},
j(a){return"null"},
gu(a){return 0},
$in:1}
J.bv.prototype={$iy:1}
J.as.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.cH.prototype={}
J.bf.prototype={}
J.ar.prototype={
j(a){var s=a[$.fp()]
if(s==null)s=a[$.er()]
if(s==null)return this.b6(a)
return"JavaScript function for "+J.ce(s)},
$iaE:1}
J.bu.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.bw.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.i.prototype={
k(a,b){A.F(a).c.a(b)
a.$flags&1&&A.aX(a,29)
a.push(b)},
bM(a,b){var s
a.$flags&1&&A.aX(a,"remove",1)
for(s=0;s<a.length;++s)if(J.O(a[s],b)){a.splice(s,1)
return!0}return!1},
T(a,b){var s,r
A.F(a).h("c<1>").a(b)
a.$flags&1&&A.aX(a,"addAll",2)
if(Array.isArray(b)){this.bb(a,b)
return}for(s=b.length,r=0;r<b.length;b.length===s||(0,A.x)(b),++r)a.push(b[r])},
bb(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.a_(a))
for(r=0;r<s;++r)a.push(b[r])},
I(a){a.$flags&1&&A.aX(a,"clear","clear")
a.length=0},
aV(a,b){var s,r,q
A.F(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.a_(a))}throw A.d(A.cr())},
J(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
b5(a,b,c){var s=a.length
if(b>s)throw A.d(A.aL(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aL(c,b,s,"end",null))
if(b===c)return A.e([],A.F(a))
return A.e(a.slice(b,c),A.F(a))},
gU(a){if(a.length>0)return a[0]
throw A.d(A.cr())},
gbJ(a){var s=a.length
if(s>0)return a[s-1]
throw A.d(A.cr())},
ga4(a){var s=a.length
if(s===1){if(0>=s)return A.b(a,0)
return a[0]}if(s===0)throw A.d(A.cr())
throw A.d(A.eA())},
W(a,b){var s,r
A.F(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.a_(a))}return!1},
aU(a,b){var s,r
A.F(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.a_(a))}return!0},
b4(a){var s,r,q,p,o,n
a.$flags&2&&A.aX(a,"sort")
s=a.length
if(s<2)return
if(s===2){r=a[0]
q=a[1]
p=J.eC(r,q)
if(typeof p!=="number")return p.bT()
if(p>0){a[0]=q
a[1]=r}return}o=0
if(A.F(a).c.b(null))for(n=0;n<a.length;++n)if(a[n]===void 0){a[n]=null;++o}a.sort(A.ie(J.hT(),2))
if(o>0)this.bq(a,o)},
bq(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aD(a,b){var s,r,q,p
a.$flags&2&&A.aX(a,"shuffle")
s=a.length
while(s>1){r=b.aa(s);--s
q=a.length
if(!(s<q))return A.b(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.b(a,r)
a[s]=a[r]
a[r]=p}},
a8(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.b(a,s)
if(J.O(a[s],b))return s}return-1},
N(a,b){var s
for(s=0;s<a.length;++s)if(J.O(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gv(a){return a.length!==0},
j(a){return A.e2(a,"[","]")},
gq(a){return new J.az(a,a.length,A.F(a).h("az<1>"))},
gu(a){return A.bL(a)},
gm(a){return a.length},
i(a,b,c){A.F(a).c.a(c)
a.$flags&2&&A.aX(a)
if(!(b>=0&&b<a.length))throw A.d(A.fi(a,b))
a[b]=c},
bK(a,b){var s,r
A.F(a).h("p(1)").a(b)
s=a.length-1
if(s<0)return-1
for(r=s;r>=0;--r){if(!(r<a.length))return A.b(a,r)
if(b.$1(a[r]))return r}return-1},
$if:1,
$ic:1,
$ih:1}
J.cs.prototype={
bP(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cI(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.d9.prototype={}
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
$iv:1}
J.b3.prototype={
aS(a,b){var s
A.f5(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gau(b)
if(this.gau(a)===s)return 0
if(this.gau(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gau(a){return a===0?1/a<0:a<0},
b0(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.bU(""+a+".toInt()"))},
j(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gu(a){var s,r,q,p,o=a|0
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
S(a,b){return(a|0)===a?a/b|0:this.bu(a,b)},
bu(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.bU("Result of truncating division is "+A.t(s)+": "+A.t(a)+" ~/ "+b))},
aO(a,b){var s
if(a>0)s=this.bs(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bs(a,b){return b>31?0:a>>>b},
gB(a){return A.aU(t.o)},
$ia9:1,
$il:1,
$iR:1}
J.bs.prototype={
gB(a){return A.aU(t.S)},
$in:1,
$ia:1}
J.cu.prototype={
gB(a){return A.aU(t.i)},
$in:1}
J.aG.prototype={
a_(a,b,c){return a.substring(b,A.h9(b,c,a.length))},
aS(a,b){var s
A.a6(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
j(a){return a},
gu(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gB(a){return A.aU(t.N)},
gm(a){return a.length},
$in:1,
$ia9:1,
$ik:1}
A.bg.prototype={
gq(a){var s=this.a
return new A.bn(s.gq(s),A.j(this).h("bn<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
j(a){return this.a.j(0)}}
A.bn.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iv:1}
A.aA.prototype={}
A.bX.prototype={$if:1}
A.aB.prototype={
H(a,b,c){return new A.aB(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("aB<1,2,3,4>"))},
l(a,b){return this.$ti.h("4?").a(this.a.l(0,b))},
F(a,b){this.a.F(0,new A.d3(this,this.$ti.h("~(3,4)").a(b)))},
gG(){var s=this.$ti
return A.fM(this.a.gG(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gK(){return this.a.gK().av(0,new A.d2(this),this.$ti.h("B<3,4>"))}}
A.d3.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d2.prototype={
$1(a){var s=this.a.$ti
s.h("B<1,2>").a(a)
return new A.B(s.y[2].a(a.a),s.y[3].a(a.b),s.h("B<3,4>"))},
$S(){return this.a.$ti.h("B<3,4>(B<1,2>)")}}
A.b4.prototype={
j(a){return"LateInitializationError: "+this.a}}
A.dk.prototype={}
A.f.prototype={}
A.H.prototype={
gq(a){var s=this
return new A.ac(s,s.gm(s),A.j(s).h("ac<H.E>"))},
gt(a){return this.gm(this)===0},
av(a,b,c){var s=A.j(this)
return new A.ad(this,s.A(c).h("1(H.E)").a(b),s.h("@<H.E>").A(c).h("ad<1,2>"))},
b1(a){var s,r=this,q=A.eG(A.j(r).h("H.E"))
for(s=0;s<r.gm(r);++s)q.k(0,r.J(0,s))
return q}}
A.bR.prototype={
gbj(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbt(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
J(a,b){var s=this,r=s.gbt()+b,q=s.gbj()
if(r>=q)throw A.d(A.e1(b,s.gm(0),s,"index"))
return J.e0(s.a,r)}}
A.ac.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dO(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.a_(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.J(q,s);++r.c
return!0},
$iv:1}
A.aK.prototype={
gq(a){return new A.bD(J.ak(this.a),this.b,A.j(this).h("bD<1,2>"))},
gm(a){return J.cZ(this.a)},
gt(a){return J.fE(this.a)}}
A.br.prototype={$if:1}
A.bD.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iv:1}
A.ad.prototype={
gm(a){return J.cZ(this.a)},
J(a,b){return this.b.$1(J.e0(this.a,b))}}
A.af.prototype={
gq(a){return new A.bV(J.ak(this.a),this.b,this.$ti.h("bV<1>"))}}
A.bV.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iv:1}
A.bW.prototype={
gq(a){return new A.aO(J.ak(this.a),this.$ti.h("aO<1>"))}}
A.aO.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iv:1}
A.r.prototype={
sm(a,b){throw A.d(A.bU("Cannot change the length of a fixed-length list"))},
k(a,b){A.aj(a).h("r.E").a(b)
throw A.d(A.bU("Cannot add to a fixed-length list"))},
T(a,b){A.aj(a).h("c<r.E>").a(b)
throw A.d(A.bU("Cannot add to a fixed-length list"))}}
A.bN.prototype={
gm(a){return this.a.length},
J(a,b){var s=this.a
return J.e0(s,s.length-1-b)}}
A.ag.prototype={$r:"+winner(1)",$s:1}
A.ah.prototype={$r:"+(1,2)",$s:2}
A.c3.prototype={$r:"+points,winner(1,2)",$s:3}
A.bp.prototype={}
A.bo.prototype={
H(a,b,c){var s=A.j(this)
return A.eH(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
j(a){return A.e7(this)},
gK(){return new A.bi(this.bD(),A.j(this).h("bi<B<1,2>>"))},
bD(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gK(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gG(),o=o.gq(o),n=A.j(s),m=n.y[1],n=n.h("B<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.l(0,l)
r=4
return a.b=new A.B(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iA:1}
A.W.prototype={
gm(a){return this.b.length},
gaL(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
a2(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
l(a,b){if(!this.a2(b))return null
return this.b[this.a[b]]},
F(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaL()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gG(){return new A.bY(this.gaL(),this.$ti.h("bY<1>"))}}
A.bY.prototype={
gm(a){return this.a.length},
gt(a){return 0===this.a.length},
gv(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.aP(s,s.length,this.$ti.h("aP<1>"))}}
A.aP.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iv:1}
A.bq.prototype={
k(a,b){A.j(this).c.a(b)
A.fS()}}
A.ap.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gv(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aP(s,s.length,this.$ti.h("aP<1>"))},
bm(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.bx(o.$ti.h("bx<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
N(a,b){return this.bm().a2(b)}}
A.bP.prototype={}
A.dy.prototype={
M(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
j(a){return"Null check operator used on a null value"}}
A.cv.prototype={
j(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cP.prototype={
j(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.dj.prototype={
j(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.am.prototype={
j(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.fo(r==null?"unknown":r)+"'"},
$iaE:1,
gbS(){return this},
$C:"$1",
$R:1,
$D:null}
A.ch.prototype={$C:"$0",$R:0}
A.ci.prototype={$C:"$2",$R:2}
A.cM.prototype={}
A.cL.prototype={
j(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.fo(s)+"'"}}
A.aY.prototype={
E(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aY))return!1
return this.$_target===b.$_target&&this.a===b.a},
gu(a){return(A.ep(this.a)^A.bL(this.$_target))>>>0},
j(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cI(this.a)+"'")}}
A.cK.prototype={
j(a){return"RuntimeError: "+this.a}}
A.a0.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
gG(){return new A.ab(this,A.j(this).h("ab<1>"))},
gK(){return new A.aa(this,A.j(this).h("aa<1,2>"))},
a2(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bE(a)},
bE(a){var s=this.d
if(s==null)return!1
return this.a9(this.aK(s,a),a)>=0},
T(a,b){A.j(this).h("A<1,2>").a(b).F(0,new A.da(this))},
l(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bF(b)},
bF(a){var s,r,q=this.d
if(q==null)return null
s=this.aK(q,a)
r=this.a9(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.j(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.aF(s==null?q.b=q.ak():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.aF(r==null?q.c=q.ak():r,b,c)}else q.bG(b,c)},
bG(a,b){var s,r,q,p,o=this,n=A.j(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ak()
r=o.aq(a)
q=s[r]
if(q==null)s[r]=[o.ae(a,b)]
else{p=o.a9(q,a)
if(p>=0)q[p].b=b
else q.push(o.ae(a,b))}},
I(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aM()}},
F(a,b){var s,r,q=this
A.j(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.a_(q))
s=s.c}},
aF(a,b,c){var s,r=A.j(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ae(b,c)
else s.b=c},
aM(){this.r=this.r+1&1073741823},
ae(a,b){var s=this,r=A.j(s),q=new A.de(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aM()
return q},
aq(a){return J.a8(a)&1073741823},
aK(a,b){return a[this.aq(b)]},
a9(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.O(a[r].a,b))return r
return-1},
j(a){return A.e7(this)},
ak(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ie6:1}
A.da.prototype={
$2(a,b){var s=this.a,r=A.j(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.j(this.a).h("~(1,2)")}}
A.de.prototype={}
A.ab.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bA(s,s.r,s.e,this.$ti.h("bA<1>"))}}
A.bA.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iv:1}
A.bC.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bB(s,s.r,s.e,this.$ti.h("bB<1>"))}}
A.bB.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iv:1}
A.aa.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bz(s,s.r,s.e,this.$ti.h("bz<1,2>"))}}
A.bz.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.B(s.a,s.b,r.$ti.h("B<1,2>"))
r.c=s.c
return!0}},
$iv:1}
A.bx.prototype={
aq(a){return A.id(a)&1073741823},
a9(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.O(a[r].a,b))return r
return-1}}
A.dS.prototype={
$1(a){return this.a(a)},
$S:1}
A.dT.prototype={
$2(a,b){return this.a(a,b)},
$S:6}
A.dU.prototype={
$1(a){return this.a(A.a6(a))},
$S:7}
A.a3.prototype={
j(a){return this.aP(!1)},
aP(a){var s,r,q,p,o,n=this.bk(),m=this.aj(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.b(m,q)
o=m[q]
l=a?l+A.eK(o):l+A.t(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
bk(){var s,r=this.$s
while($.dF.length<=r)B.a.k($.dF,null)
s=$.dF[r]
if(s==null){s=this.bg()
B.a.i($.dF,r,s)}return s},
bg(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.e3(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.z(j,k)}}
A.aS.prototype={
aj(){return[this.a,this.b]},
E(a,b){if(b==null)return!1
return b instanceof A.aS&&this.$s===b.$s&&J.O(this.a,b.a)&&J.O(this.b,b.b)},
gu(a){return A.eI(this.$s,this.a,this.b,B.j)}}
A.bh.prototype={
aj(){return[this.a]},
E(a,b){if(b==null)return!1
return b instanceof A.bh&&this.$s===b.$s&&J.O(this.a,b.a)},
gu(a){return A.eI(this.$s,this.a,B.j,B.j)}}
A.b7.prototype={
gB(a){return B.ap},
$in:1}
A.bG.prototype={}
A.cx.prototype={
gB(a){return B.aq},
$in:1}
A.b8.prototype={
gm(a){return a.length},
$iS:1}
A.bE.prototype={$if:1,$ic:1,$ih:1}
A.bF.prototype={$if:1,$ic:1,$ih:1}
A.cy.prototype={
gB(a){return B.ar},
$in:1}
A.cz.prototype={
gB(a){return B.as},
$in:1}
A.cA.prototype={
gB(a){return B.at},
$in:1}
A.cB.prototype={
gB(a){return B.au},
$in:1}
A.cC.prototype={
gB(a){return B.av},
$in:1}
A.cD.prototype={
gB(a){return B.ax},
$in:1}
A.cE.prototype={
gB(a){return B.ay},
$in:1}
A.bH.prototype={
gB(a){return B.az},
gm(a){return a.length},
$in:1}
A.cF.prototype={
gB(a){return B.aA},
gm(a){return a.length},
$in:1}
A.c_.prototype={}
A.c0.prototype={}
A.c1.prototype={}
A.c2.prototype={}
A.a2.prototype={
h(a){return A.ca(v.typeUniverse,this,a)},
A(a){return A.f1(v.typeUniverse,this,a)}}
A.cS.prototype={}
A.cY.prototype={
j(a){return A.U(this.a,null)}}
A.cR.prototype={
j(a){return this.a}}
A.c6.prototype={}
A.c5.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
br(a,b){var s,r,q
a=A.N(a)
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
o.d=null}q=o.br(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.eW
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
o.a=A.eW
throw n
return!1}if(0>=p.length)return A.b(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eO("sync*"))}return!1},
bU(a){var s,r,q=this
if(a instanceof A.bi){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.ak(a)
return 2}},
$iv:1}
A.bi.prototype={
gq(a){return new A.c5(this.a(),this.$ti.h("c5<1>"))}}
A.aQ.prototype={
gq(a){var s=this,r=new A.bZ(s,s.r,A.j(s).h("bZ<1>"))
r.c=s.e
return r},
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
N(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.g.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.g.a(r[b])!=null}else return this.bh(b)},
bh(a){var s=this.d
if(s==null)return!1
return this.aJ(s[this.aI(a)],a)>=0},
k(a,b){var s,r,q=this
A.j(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aG(s==null?q.b=A.ec():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aG(r==null?q.c=A.ec():r,b)}else return q.ba(b)},
ba(a){var s,r,q,p=this
A.j(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.ec()
r=p.aI(a)
q=s[r]
if(q==null)s[r]=[p.al(a)]
else{if(p.aJ(q,a)>=0)return!1
q.push(p.al(a))}return!0},
I(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aH()}},
aG(a,b){A.j(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.al(b)
return!0},
aH(){this.r=this.r+1&1073741823},
al(a){var s,r=this,q=new A.cW(A.j(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.aH()
return q},
aI(a){return J.a8(a)&1073741823},
aJ(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.O(a[r].a,b))return r
return-1}}
A.cW.prototype={}
A.bZ.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.a_(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$iv:1}
A.df.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:8}
A.q.prototype={
gq(a){return new A.ac(a,a.length,A.aj(a).h("ac<q.E>"))},
J(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
gt(a){return a.length===0},
gv(a){return a.length!==0},
k(a,b){var s
A.aj(a).h("q.E").a(b)
s=a.length
this.sm(a,s+1)
if(!(s<a.length))return A.b(a,s)
a[s]=b},
T(a,b){var s,r,q
A.aj(a).h("c<q.E>").a(b)
s=a.length
for(r=b.length,q=0;q<b.length;b.length===r||(0,A.x)(b),++q){this.k(a,b[q]);++s}},
j(a){return A.e2(a,"[","]")}}
A.o.prototype={
H(a,b,c){var s=A.j(this)
return A.eH(this,s.h("o.K"),s.h("o.V"),b,c)},
F(a,b){var s,r,q,p=A.j(this)
p.h("~(o.K,o.V)").a(b)
for(s=this.gG(),s=s.gq(s),p=p.h("o.V");s.n();){r=s.gp()
q=this.l(0,r)
b.$2(r,q==null?p.a(q):q)}},
gK(){return this.gG().av(0,new A.dh(this),A.j(this).h("B<o.K,o.V>"))},
gm(a){var s=this.gG()
return s.gm(s)},
gt(a){var s=this.gG()
return s.gt(s)},
gv(a){var s=this.gG()
return s.gv(s)},
j(a){return A.e7(this)},
$iA:1}
A.dh.prototype={
$1(a){var s=this.a,r=A.j(s)
r.h("o.K").a(a)
s=s.l(0,a)
if(s==null)s=r.h("o.V").a(s)
return new A.B(a,s,r.h("B<o.K,o.V>"))},
$S(){return A.j(this.a).h("B<o.K,o.V>(o.K)")}}
A.di.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.t(a)
r.a=(r.a+=s)+": "
s=A.t(b)
r.a+=s},
$S:2}
A.cb.prototype={}
A.b6.prototype={
H(a,b,c){return this.a.H(0,b,c)},
l(a,b){return this.a.l(0,b)},
F(a,b){this.a.F(0,A.j(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gm(a){var s=this.a
return s.gm(s)},
j(a){return this.a.j(0)},
gK(){return this.a.gK()},
$iA:1}
A.aN.prototype={
H(a,b,c){return new A.aN(this.a.H(0,b,c),b.h("@<0>").A(c).h("aN<1,2>"))}}
A.at.prototype={
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
T(a,b){var s
for(s=J.ak(A.j(this).h("c<1>").a(b));s.n();)this.k(0,s.gp())},
by(a){var s
for(s=a.gq(a);s.n();)if(!this.N(0,s.gp()))return!1
return!0},
ga4(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.eA())
s=r.gq(r)
if(!s.n())throw A.d(A.cr())
return s.gp()},
j(a){return A.e2(this,"{","}")},
$if:1,
$ic:1,
$iaM:1}
A.c4.prototype={}
A.bj.prototype={}
A.cU.prototype={
l(a,b){var s,r=this.b
if(r==null)return this.c.l(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bp(b):s}},
gm(a){return this.b==null?this.c.a:this.a5().length},
gt(a){return this.gm(0)===0},
gv(a){return this.gm(0)>0},
gG(){if(this.b==null){var s=this.c
return new A.ab(s,A.j(s).h("ab<1>"))}return new A.cV(this)},
F(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.F(0,b)
s=o.a5()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dJ(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.a_(o))}},
a5(){var s=t.h.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
bp(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dJ(this.a[a])
return this.b[a]=s}}
A.cV.prototype={
gm(a){return this.a.gm(0)},
J(a,b){var s=this.a
if(s.b==null)s=s.gG().J(0,b)
else{s=s.a5()
if(!(b<s.length))return A.b(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gG()
s=s.gq(s)}else{s=s.a5()
s=new J.az(s,s.length,A.F(s).h("az<1>"))}return s}}
A.cj.prototype={}
A.cl.prototype={}
A.by.prototype={
j(a){var s=A.cm(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cw.prototype={
j(a){return"Cyclic error in JSON stringify"}}
A.db.prototype={
bz(a,b){var s=A.i5(a,this.gbA().a)
return s},
bB(a,b){var s=A.hl(a,this.gbC().b,null)
return s},
gbC(){return B.a_},
gbA(){return B.Z}}
A.dd.prototype={}
A.dc.prototype={}
A.dD.prototype={
b3(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.l.a_(a,r,q)
r=q+1
o=A.K(92)
s.a+=o
o=A.K(117)
s.a+=o
o=A.K(100)
s.a+=o
o=p>>>8&15
o=A.K(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.K(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.K(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.l.a_(a,r,q)
r=q+1
o=A.K(92)
s.a+=o
switch(p){case 8:o=A.K(98)
s.a+=o
break
case 9:o=A.K(116)
s.a+=o
break
case 10:o=A.K(110)
s.a+=o
break
case 12:o=A.K(102)
s.a+=o
break
case 13:o=A.K(114)
s.a+=o
break
default:o=A.K(117)
s.a+=o
o=A.K(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.K(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.K(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.l.a_(a,r,q)
r=q+1
o=A.K(92)
s.a+=o
o=A.K(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.l.a_(a,r,m)},
af(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.d(new A.cw(a,null))}B.a.k(s,a)},
ac(a){var s,r,q,p,o=this
if(o.b2(a))return
o.af(a)
try{s=o.b.$1(a)
if(!o.b2(s)){q=A.eD(a,null,o.gaN())
throw A.d(q)}q=o.a
if(0>=q.length)return A.b(q,-1)
q.pop()}catch(p){r=A.eq(p)
q=A.eD(a,r,o.gaN())
throw A.d(q)}},
b2(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.p.j(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.b3(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.af(a)
q.bQ(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return!0}else if(t.G.b(a)){q.af(a)
r=q.bR(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return r}else return!1},
bQ(a){var s,r=this.c
r.a+="["
if(J.fF(a)){if(0>=a.length)return A.b(a,0)
this.ac(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.ac(a[s])}}r.a+="]"},
bR(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.h6(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.F(0,new A.dE(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.b3(A.a6(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.b(r,n)
m.ac(r[n])}p.a+="}"
return!0}}
A.dE.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:2}
A.dC.prototype={
gaN(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cQ.prototype={
j(a){return this.V()},
$ib1:1}
A.u.prototype={}
A.cf.prototype={
j(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cm(s)
return"Assertion failed"}}
A.bS.prototype={}
A.al.prototype={
gai(){return"Invalid argument"+(!this.a?"(s)":"")},
gah(){return""},
j(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gai()+q+o
if(!s.a)return n
return n+s.gah()+": "+A.cm(s.gar())},
gar(){return this.b}}
A.bb.prototype={
gar(){return A.dI(this.b)},
gai(){return"RangeError"},
gah(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.t(q):""
else if(q==null)s=": Not greater than or equal to "+A.t(r)
else if(q>r)s=": Not in inclusive range "+A.t(r)+".."+A.t(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.t(r)
return s}}
A.cp.prototype={
gar(){return A.N(this.b)},
gai(){return"RangeError"},
gah(){if(A.N(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bT.prototype={
j(a){return"Unsupported operation: "+this.a}}
A.cO.prototype={
j(a){return"UnimplementedError: "+this.a}}
A.bd.prototype={
j(a){return"Bad state: "+this.a}}
A.ck.prototype={
j(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cm(s)+"."}}
A.bQ.prototype={
j(a){return"Stack Overflow"},
$iu:1}
A.dA.prototype={
j(a){return"Exception: "+this.a}}
A.d5.prototype={
j(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.c.prototype={
av(a,b,c){var s=A.j(this)
return A.h8(this,s.A(c).h("1(c.E)").a(b),s.h("c.E"),c)},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gv(a){return!this.gt(this)},
J(a,b){var s,r
A.e9(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.e1(b,b-r,this,"index"))},
j(a){return A.h_(this,"(",")")}}
A.B.prototype={
j(a){return"MapEntry("+A.t(this.a)+": "+A.t(this.b)+")"}}
A.bI.prototype={
gu(a){return A.m.prototype.gu.call(this,0)},
j(a){return"null"}}
A.m.prototype={$im:1,
E(a,b){return this===b},
gu(a){return A.bL(this)},
j(a){return"Instance of '"+A.cI(this)+"'"},
gB(a){return A.io(this)},
toString(){return this.j(this)}}
A.be.prototype={
gm(a){return this.a.length},
j(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ihb:1}
A.cT.prototype={
aa(a){if(a<=0||a>4294967296)throw A.d(A.eL(u.c+a))
return Math.random()*a>>>0},
L(){return Math.random()},
$ie8:1}
A.cX.prototype={
b8(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
do{s=a>>>0
a=B.d.S(a-s,k)
r=a>>>0
a=B.d.S(a-r,k)
q=(~s>>>0)+(s<<21>>>0)
p=q>>>0
r=(~r>>>0)+((r<<21|s>>>11)>>>0)+B.d.S(q-p,k)>>>0
q=((p^(p>>>24|r<<8))>>>0)*265
s=q>>>0
r=((r^r>>>24)>>>0)*265+B.d.S(q-s,k)>>>0
q=((s^(s>>>14|r<<18))>>>0)*21
s=q>>>0
r=((r^r>>>14)>>>0)*21+B.d.S(q-s,k)>>>0
s=(s^(s>>>28|r<<4))>>>0
r=(r^r>>>28)>>>0
q=(s<<31>>>0)+s
p=q>>>0
o=B.d.S(q-p,k)
q=l.a*1037
n=l.a=q>>>0
m=l.b*1037+B.d.S(q-n,k)>>>0
l.b=m
n=(n^p)>>>0
l.a=n
o=(m^r+((r<<31|s>>>1)>>>0)+o>>>0)>>>0
l.b=o}while(a!==j)
if(o===0&&n===0)l.a=23063
l.P()
l.P()
l.P()
l.P()},
P(){var s=this,r=s.a,q=4294901760*r,p=q>>>0,o=55905*r,n=o>>>0,m=n+p+s.b
r=m>>>0
s.a=r
s.b=B.d.S(o-n+(q-p)+(m-r),4294967296)>>>0},
aa(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.d(A.eL(u.c+a))
s=a-1
if((a&s)>>>0===0){p.P()
return(p.a&s)>>>0}do{p.P()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
L(){var s,r=this
r.P()
s=r.a
r.P()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$ie8:1}
A.a5.prototype={
V(){return"AiLevel."+this.b}}
A.cN.prototype={
aT(a){var s,r,q=this,p=a.a,o=a.b,n=p.aY(o)
if(n.length===0)throw A.d(A.eO("no legal action for "+o))
if(p.cx){p=t.db
s=new A.af(new A.bW(n,p),p.h("p(c.E)").a(new A.dr()),p.h("af<c.E>"))
return s.J(0,q.b.aa(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.bi(a)
break A}if(B.f===r){p=q.bc(a,n)
break A}p=q.bn(a,n)
break A}return p},
ga6(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
bi(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.n){s=a.b
return l.b.L()<0.6?new A.J(s):new A.Q(s)}r=l.ab(a,l.ga6())
s=a.a
q=s.a
p=q.f
o=B.a.gU(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.l(0,m)
m.toString
if(m+o>=q.r)return new A.J(n)
return r>(p-o)/(2*p)+l.a1(0.08)?new A.J(n):new A.Q(n)},
bc(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.W(t.U.a(b),new A.dn()),g=i.a
if(g===B.n){s=i.b.L()
if(h&&s<0.05)return new A.L(a.b)
g=a.b
return s<0.65?new A.J(g):new A.Q(g)}r=a.a
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
q=i.ab(a,i.ga6())
g=g===B.o
k=q-(g?0:0.08)
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.l(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.L(q):new A.J(q)
if(h&&k>0.78+i.a1(0.05))return new A.L(q)
j=g&&i.b.L()<0.06
return(2*k-1)*l>-m+i.a1(0.3)||j?new A.J(q):new A.Q(q)},
bn(a,b){t.U.a(b)
if(B.a.W(b,new A.dp())&&this.bv(a))return new A.L(a.b)
return this.bf(a,b)},
bv(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.l(0,q)
q.toString
if(q+p.gap()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.L()<0.08
case 1:return r.ab(a,r.ga6())>0.72+r.a1(0.06)||r.b.L()<0.03
case 2:s=r.ab(a,r.ga6())
if(s>0.9&&a.gY().length>1&&r.b.L()<0.8)return!1
if(s>0.62+r.a1(0.03))return!0
return A.z(p.z,t.F).length!==0&&s<0.3&&r.b.L()<0.04}},
a1(a){return(this.b.L()*2-1)*a},
bf(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.gY()
r=f.a
if(r===B.n&&f.b.L()<0.55){r=s.length
q=f.b.aa(r)
if(!(q>=0&&q<r))return A.b(s,q)
return new A.I(s[q],!1,a.b)}r=r===B.o
if(r&&s.length>1)p=f.bd(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.D(s[l],n.y))
k=A.e([],t.w)
for(j=A.z(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.D(h.b,n.y)
k.push(new A.ah(h.a,g))}m=A.e([],t.v)
for(n=A.z(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.el(q,k,m,a.b)
if(!(q>=0&&q<o))return A.b(s,q)
p=s[q]}if(r&&a.a.gan()&&!f.bw(a,p)&&f.b.L()<0.5)return new A.I(p,!0,a.b)
return new A.I(p,!1,a.b)},
bw(a,b){var s=a.a,r=s.a.D(b,s.y)
return B.a.aU(A.z(s.Q,t.n),new A.dq(a,r))},
bd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.gY(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.D(e[p],r.y))
o=A.e([],t.w)
for(n=A.z(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.D(l.b,r.y)
o.push(new A.ah(l.a,k))}q=A.e([],t.v)
for(r=A.z(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.el(d,o,q,a.b)
if(!(d>=0&&d<s))return A.b(e,d)
j=e[d]
i=this.aB(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.E(0,j))continue
f=this.aB(a,g,160)
if(f>i){i=f
h=g}}return h},
aB(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbI()
r=A.e([],t.Y)
for(q=$.es(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.N(0,n))r.push(n)}q=b8.b
m=B.d.C(q+2,4)
l=b8.gaw()
if(this.a===B.o){p=b8.a
k=p.ch
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ay
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.aD(r,b)
a5.a=0
a6=A.h7(4,new A.ds(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.C(a0,4),B.d.C(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.b(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.aI(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.D(b4.b,p.y)
a8.push(new A.ah(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.aI(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.iC(a8,j?null:new A.ah(q,k.D(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
ab(a,b){return this.aB(a,null,b)}}
A.dr.prototype={
$1(a){return!t.D.a(a).c},
$S:9}
A.dn.prototype={
$1(a){return t.J.a(a) instanceof A.L},
$S:0}
A.dp.prototype={
$1(a){return t.J.a(a) instanceof A.L},
$S:0}
A.dq.prototype={
$1(a){return this.a.a.aE(t.n.a(a))<this.b},
$S:3}
A.ds.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.gY(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.D(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.w:s}else n=B.w
i=i.a
s=i.w
if(!(a<s.length))return A.b(s,a)
m=A.z(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.x)(n),++o)s.push(q.D(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.b(r,k)
s.push(q.D(r[k],i.y))}p.a+=m
return s},
$S:10}
A.dY.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:11}
A.dZ.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:12}
A.dR.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o<s[q])q=p}return q},
$S:4}
A.dQ.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o>s[q])q=p}return q},
$S:4}
A.T.prototype={
V(){return"Suit."+this.b}}
A.M.prototype={
V(){return"Rank."+this.b}}
A.P.prototype={
ga7(){var s=this.b.b
if(0>=s.length)return A.b(s,0)
return this.a.c+s[0]},
E(a,b){if(b==null)return!1
return b instanceof A.P&&b.a===this.a&&b.b===this.b},
gu(a){return this.a.a*4+this.b.a},
j(a){return this.ga7()}}
A.d0.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.l.a_(s,0,s.length-1)},
$S:13}
A.d1.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.b(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.b(s,q)
return p===s[q]},
$S:14}
A.dL.prototype={
$1(a){return t.E.a(a) instanceof A.aD},
$S:15}
A.dN.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.l(0,r).k(0,b)},
$S:16}
A.dM.prototype={
$1(a){return t.L.a(a).a===B.K},
$S:17}
A.co.prototype={
b7(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=this,j=A.he(k.c,k.a,k.b)
k.r!==$&&A.iE()
k.r=j
for(s=c.length,r=k.e,q=t.f,p=k.y,o=0;o<c.length;c.length===s||(0,A.x)(c),++o){n=q.a(c[o])
m=n.l(0,"t")
l=J.ax(m)
if(l.E(m,"next")){j.ad()
p.I(0)
k.z=!1}else if(l.E(m,"show")){l=n.l(0,"s")
l.toString
j.aC(A.N(l))}else if(l.E(m,"ready")){l=n.l(0,"s")
l.toString
p.k(0,A.N(l))}else if(l.E(m,"reveal-end"))k.z=!0
else if(J.O(n.l(0,"t"),"forfeit")){l=n.l(0,"s")
l.toString
j.a3((A.N(l)&1)===0?B.b:B.c)}else j.X(A.fe(n))
B.a.k(r,n)}j=j.d
k.w.X(j)
k.x=j.length},
bH(a){var s
A.N(a)
s=this.d
if(!(a>=0&&a<s.length))return A.b(s,a)
return s[a]==null},
gaW(){var s,r,q,p=A.e([],t.t)
for(s=this.d,r=s.length,q=0;q<4;++q){if(!(q<r))return A.b(s,q)
if(s[q]==null)p.push(q)}return p},
gZ(){var s=this,r=!1
if(s.a.at<=0)if(!s.z){r=s.r
r===$&&A.Z()
r=r.gb_()&&B.a.W(s.gaW(),new A.d6(s))}return r},
aR(a){var s,r=this,q=r.d
if(!(a>=0&&a<q.length))return A.b(q,a)
s=!1
if(q[a]==null)if(r.gZ()){q=r.r
q===$&&A.Z()
q=q.ao(a)&&!r.y.N(0,a)}else q=s
else q=s
return q},
am(a,b){var s,r=this,q=r.d
if(!(a>=0&&a<q.length))return A.b(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.ao("seat "+a+" is not a person"))
q=r.r
q===$&&A.Z()
q.X(b)
B.a.k(r.e,A.ff(b))
s=A.w(t.S,t.Q)
r.R(s,0)
r.a0(s)
return s},
gaA(){var s,r,q,p,o,n=this,m=null,l=n.r
l===$&&A.Z()
s=l.r
switch(s.a){case 1:l=l.as
s=n.d
if(!(l>=0&&l<s.length))return A.b(s,l)
if(!(s[l]==null))l=m
return l
case 2:case 0:if(s===B.e){r=l.CW
r.toString
q=r}else q=((l.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
p=l.gaz()
if(p!=null){r=n.d
if(p>>>0!==p||p>=r.length)return A.b(r,p)
r=r[p]==null}else r=!1
if(r)return p
if(s===B.f&&l.ch.c!=null)return m
for(l=n.d,s=l.length,o=0;o<4;++o){if(((o&1)===0?B.b:B.c)===q){if(!(o<s))return A.b(l,o)
r=l[o]==null}else r=!1
if(r)return o}return m
case 3:case 4:return m}},
bN(a){var s,r,q,p,o,n,m=this
if(m.gaA()==null&&m.gZ()){m.z=!0
B.a.k(m.e,B.a9)
s=A.w(t.S,t.Q)
m.a0(s)
if(s.a===0)m.R(s,0)
return s}r=m.gaA()
if(r==null)throw A.d(A.ao("nobody to wait for"))
q=m.r
q===$&&A.Z()
s=m.am(r,new A.cN(B.B,m.f).aT(new A.bK(q,r)))
p=m.e
o=B.a.bK(p,new A.d7(r))
if(!(o>=0&&o<p.length))return A.b(p,o)
n=A.eF(p[o],t.N,t.X)
n.i(0,"to",!0)
B.a.i(p,o,n)
if(a!=null&&q.r!==B.i&&m.bL(r)>=a)m.a3(r).F(0,new A.d8(s))
return s},
bL(a){var s,r,q,p
for(s=this.e,r=A.F(s).h("bN<1>"),s=new A.bN(s,r),s=new A.ac(s,s.gm(0),r.h("ac<H.E>")),r=r.h("H.E"),q=0;s.n();){p=s.d
if(p==null)p=r.a(p)
if(!J.O(p.l(0,"s"),a))continue
if(!J.O(p.l(0,"to"),!0))break;++q}return q},
a3(a){var s,r=this.r
r===$&&A.Z()
r.a3((a&1)===0?B.b:B.c)
B.a.k(this.e,A.aH(["t","forfeit","s",a],t.N,t.X))
s=A.w(t.S,t.Q)
this.R(s,0)
return s},
bx(a,b){var s,r,q,p,o,n=this
t.f.a(b)
s=b.l(0,"t")
A:{if("blind"===s){r=b.l(0,"i")
r.toString
A.N(r)
q=n.r
q===$&&A.Z()
q=q.w
if(!(a>=0&&a<q.length))return A.b(q,a)
p=A.z(q[a],t.L)
if(r<0||r>=p.length)A.ay(A.ao("no card "+r))
if(!(r>=0&&r<p.length))return A.b(p,r)
r=n.am(a,new A.I(p[r],!1,a))
break A}if("show"===s){if(!n.aR(a))A.ay(A.ao("nothing to show"))
r=n.r
r===$&&A.Z()
r.aC(a)
B.a.k(n.e,A.aH(["t","show","s",a],t.N,t.X))
o=A.w(t.S,t.Q)
n.R(o,0)
n.a0(o)
r=o
break A}if("ready"===s){if(!n.aR(a))A.ay(A.ao("nothing to pass"))
n.y.k(0,a)
B.a.k(n.e,A.aH(["t","ready","s",a],t.N,t.X))
o=A.w(t.S,t.Q)
n.a0(o)
if(o.a===0)n.R(o,0)
r=o
break A}r=A.eF(b,t.N,t.X)
r.i(0,"s",a)
r=n.am(a,A.fe(r))
break A}return r},
a0(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
t.p.a(a)
for(s=e.e,r=e.d,q=r.length,p=e.f,o=e.w,n=e.y,m=t.S,l=t.x;;){k=e.r
k===$&&A.Z()
j=k.r
if(j===B.i)return
if(j===B.h){if(e.gZ())return
i=A.d4(k.dy,m,l)
h=i.gt(i)?2200:3500
k.ad()
n.I(0)
e.z=!1
B.a.k(s,B.aa)
e.R(a,h)
continue}g=e.be()
if(g==null)return
h=o.e?1400:850
if(g>>>0!==g||g>=q)return A.b(r,g)
i=r[g]
i.toString
f=new A.cN(i,p).aT(new A.bK(k,g))
k.X(f)
B.a.k(s,A.ff(f))
e.R(a,h)}},
be(){var s,r,q,p,o=this,n=null,m=o.r
m===$&&A.Z()
s=m.r
switch(s.a){case 1:m=m.as
s=o.d
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.f&&m.ch.c!=null){m=m.gaz()
m.toString
s=o.d
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m}s=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)s.push(p)
if(B.a.W(s,o.gaX()))return n
return m.gaz()
case 3:case 4:return n}},
R(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
t.p.a(a)
s=b.w
r=b.r
r===$&&A.Z()
q=r.d
s.X(A.hc(q,b.x,null,A.F(q).c))
b.x=r.d.length
for(q=b.gaW(),p=q.length,o=b.d,n=o.length,m=b.gaX(),l=t.M,k=t.L,j=b.y,i=0;i<q.length;q.length===p||(0,A.x)(q),++i){h=q[i]
g=a.l(0,h)
if(g==null){g=A.e([],l)
a.i(0,h,g)}f=b.gZ()
if(!(h<n))return A.b(o,h)
e=!1
if(o[h]==null)if(b.gZ()){if(r.r===B.h)e=r.dx||r.CW!=null
else e=!1
d=!1
if(e)if(!r.dy.a2(h)){e=r.w
if(!(h<e.length))return A.b(e,h)
c=A.aI(e[h],!1,k)
c.$flags=3
e=c.length!==0}else e=d
else e=d
e=e&&!j.N(0,h)}J.et(g,A.hd(r,h,e,a0,m,f,s))}}}
A.d6.prototype={
$1(a){var s,r
A.N(a)
s=this.a
r=s.r
r===$&&A.Z()
return r.ao(a)&&!s.y.N(0,a)},
$S:5}
A.d7.prototype={
$1(a){return J.O(t.f.a(a).l(0,"s"),this.a)},
$S:18}
A.d8.prototype={
$2(a,b){var s,r
A.N(a)
t.Q.a(b)
s=this.a
r=s.l(0,a)
if(r==null){r=A.e([],t.M)
s.i(0,a,r)
s=r}else s=r
return J.fC(s,b)},
$S:19}
A.aJ.prototype={
V(){return"ManilhaMode."+this.b}}
A.dx.prototype={
O(){var s,r=this,q=A.w(t.N,t.X)
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
D(a,b){var s
switch(this.c.a){case 0:if(b!=null&&a.a===B.x[(b.a.a+1)%10])return 10+a.b.a
break
case 1:s=B.a.a8(B.a6,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b9.prototype={
O(){var s,r=A.w(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.ga7())
if(this.c)r.i(0,"x",!0)
return r}}
A.cJ.prototype={
O(){var s,r,q,p=A.w(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.x)(s),++q)o.push(s[q].O())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.av.prototype={
O(){var s,r,q,p,o,n,m,l,k,j,i=this,h=t.N,g=A.w(h,t.X)
g.i(0,"me",i.a)
g.i(0,"rules",i.b.O())
g.i(0,"phase",i.c.b)
g.i(0,"turn",i.d)
g.i(0,"dealer",i.e)
g.i(0,"foot",i.f)
g.i(0,"hand#",i.r)
s=i.w
if(s!=null)g.i(0,"vira",s.ga7())
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
g.i(0,"scores",A.e([s.l(0,B.b),s.l(0,B.c)],t.e))
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
if(r.gv(r)){q=A.w(h,t.a)
for(r=r.gK(),r=r.gq(r);r.n();){p=r.gp()
m=p.a
l=A.e([],s)
for(p=p.b,k=p.length,o=0;o<p.length;p.length===k||(0,A.x)(p),++o){n=p[o]
j=n.b.b
if(0>=j.length)return A.b(j,0)
l.push(n.a.c+j[0])}q.i(0,""+m,l)}g.i(0,"shown",q)}if(i.id)g.i(0,"reveal",!0)
if(i.k1)g.i(0,"canShow",!0)
s=i.k2
if(s.gv(s)){h=A.w(h,h)
for(s=s.gK(),s=s.gq(s);s.n();){r=s.gp()
h.i(0,""+r.a,r.b)}g.i(0,"speech",h)}h=i.k3
if(h!=null)g.i(0,"toast",h)
if(i.k4)g.i(0,"showLast",!0)
h=i.ok
if(h>0)g.i(0,"delay",h)
return g}}
A.dm.prototype={
$1(a){var s,r=a.a,q=a.c
if(q){s=this.a
s=r!==s&&r!==B.d.C(s+2,4)}else s=!1
return new A.b9(r,s?null:a.b,q)},
$S:20}
A.dl.prototype={
X(a){var s,r,q,p,o,n=this
t.B.a(a)
n.e=!1
for(s=J.ak(a),r=n.r,q=n.a;s.n();){p=s.gp()
if(p instanceof A.b2){q.I(0)
n.b=null
n.d=!1
n.c=p.f
continue}if(p instanceof A.aZ){n.c=n.e=n.d=!1
continue}if(p instanceof A.ba){q.i(0,p.a,p.c+"!")
continue}if(p instanceof A.bM){q.i(0,p.a,"Cai dentro!")
continue}if(p instanceof A.aC){o=p.a
q.i(0,o,p.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(p instanceof A.b0){o=p.a
q.i(0,o,p.b?"Vamos jogar!":"Corro.")
continue}if(p instanceof A.bc){n.e=n.d=!0
continue}if(p instanceof A.aq){o=p.a
n.b=new A.c3(p.b,o)
continue}if(p instanceof A.aF){p=p.a
o=r.l(0,p)
o.toString
r.i(0,p,o+1)
continue}if(p instanceof A.aD){n.b=null
n.d=!1
continue}if(p instanceof A.b_)continue}},
bO(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.an.prototype={
V(){return"GamePhase."+this.b}}
A.X.prototype={}
A.I.prototype={
j(a){var s=this.b.j(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.L.prototype={
j(a){return"Raise("+this.a+")"}}
A.J.prototype={
j(a){return"Accept("+this.a+")"}}
A.Q.prototype={
j(a){return"Fold("+this.a+")"}}
A.D.prototype={}
A.b2.prototype={}
A.b0.prototype={}
A.aZ.prototype={}
A.ba.prototype={}
A.bM.prototype={}
A.aC.prototype={}
A.bc.prototype={}
A.aq.prototype={}
A.aF.prototype={}
A.b_.prototype={}
A.aD.prototype={}
A.a1.prototype={}
A.bO.prototype={}
A.cG.prototype={}
A.cn.prototype={
j(a){return"GameRuleError: "+this.a}}
A.dt.prototype={
gap(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.b(s,r)
return s[r]},
gaz(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.C(r+2,4):B.d.C(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.C(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.C(q+1,4)
default:return null}},
aE(a){return a.c?-1:this.a.D(a.b,this.y)},
ad(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.h)throw A.d(A.ao("hand still in progress"));++j.f
j.e=B.d.C(j.e+1,4)
s=t.L
r=A.b5($.es(),s)
B.a.aD(r,j.b)
q=t.ba
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.b5(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.x)(p),++m){l=A.aI(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.y){if(12>=r.length)return A.b(r,12)
r=r[12]}else r=null
j.y=r
B.a.I(j.z)
B.a.I(j.Q)
m=j.ax=0
j.ch=j.ay=null
r=j.dx=!1
j.dy.I(0)
j.at=j.as=B.d.C(j.e+1,4)
q=A.e([],t.c)
for(p=j.c,n=s.e;m<2;++m){k=B.a2[m]
if(p.l(0,k)===n)q.push(k)}p=q.length
n=p===2
j.cy=n
j.cx=n?s.x:r
s=p===1?B.a.ga4(q):null
j.CW=s
j.r=s!=null?B.e:B.k
r=j.y
q=j.cx
B.a.k(j.d,new A.b2(j.x,r,s,q))},
aY(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.CW)return B.m
return A.e([new A.J(a),new A.Q(a)],t.u)
case 2:s=o.ch
if(n===((s.a&1)===0?B.b:B.c))return B.m
if(s.c===a)return B.m
s=A.e([new A.J(a),new A.Q(a)],t.u)
if(o.ch.b+1<5)s.push(new A.L(a))
return s
case 1:if(a!==o.as)return B.m
s=A.e([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.I(r[p],!1,a))
if(o.gan()){r=o.w
if(!(a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.x)(r),++p)s.push(new A.I(r[p],!0,a))}if(o.aQ(a))s.push(new A.L(a))
return s
case 3:case 4:return B.m}},
gan(){return this.a.w&&!this.cx&&this.z.length!==0},
aQ(a){var s=this,r=!1
if(s.r===B.k)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
X(a){var s,r,q,p,o=this,n=a.a
if(!B.a.W(o.aY(n),new A.dw(a)))throw A.d(A.ao("illegal "+a.j(0)+" in "+o.r.j(0)))
A:{if(a instanceof A.I){o.bo(a)
break A}if(a instanceof A.L){o.dx=!0
s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cG(n,p,null)
o.r=B.f
s=o.a.d
if(!(p<5))return A.b(s,p)
B.a.k(o.d,new A.ba(n,s[p],B.a3[p-1]))
break A}if(a instanceof A.J){o.b9(n)
break A}if(a instanceof A.Q)o.bl(n)}},
b9(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.b0(a,!0))
q.r=B.k
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.k
if(!(r<5))return A.b(q.a.d,r)
B.a.k(q.d,new A.bM(a))},
bl(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.k(o.d,new A.b0(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.ag(s,B.a.gU(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cG(r.a,r.b,a)
B.a.k(o.d,new A.aC(a,!0))
return}B.a.k(o.d,new A.aC(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.b(q,p)
o.ag(s,q[p])},
bo(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.b(s,r)
q=a.b
B.a.bM(s[r],q)
s=f.Q
p=a.c
B.a.k(s,new A.a1(r,q,p))
o=f.d
B.a.k(o,new A.aZ(r,q,p))
r=s.length
if(r<4){f.as=B.d.C(f.as+1,4)
return}q=e.a=-2
for(p=f.a,n=0;n<s.length;s.length===r||(0,A.x)(s),++n,q=k){m=s[n]
l=m.c?-1:p.D(m.b,f.y)
k=Math.max(q,l)
e.a=k}r=A.F(s)
q=r.h("af<1>")
j=A.b5(new A.af(s,r.h("p(1)").a(new A.du(e,f)),q),q.h("c.E"))
r=A.F(j)
i=new A.ad(j,r.h("E(1)").a(new A.dv()),r.h("ad<1,E>")).b1(0)
h=i.a===1?i.ga4(0):null
r=A.z(s,t.n)
q=B.a.gU(j).a
p=f.z
B.a.k(p,new A.bO(r,h,q))
B.a.I(s)
B.a.k(o,new A.bc(p.length))
g=A.iq(p)
if(g!=null)f.ag(g.a,f.gap())
else f.at=f.as=h==null?f.at:q},
ag(a,b){var s,r,q,p,o=this
o.ch=null
s=o.d
r=a==null
B.a.k(s,new A.aq(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.l(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.l(0,a)
r.toString
if(r>=q){o.db=a
o.r=B.i
B.a.k(s,new A.aF(a))
return}}o.r=B.h},
a3(a){var s,r,q=this
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
gb_(){if(this.r===B.h)var s=this.dx||this.CW!=null
else s=!1
return s},
ao(a){var s=!1
if(this.gb_())if(!this.dy.a2(a)){s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
s=A.z(s[a],t.L).length!==0}return s},
aC(a){var s,r,q=this
if(!q.ao(a))throw A.d(A.ao("nothing to show"))
s=q.w
if(!(a>=0&&a<s.length))return A.b(s,a)
r=t.L
q.dy.i(0,a,A.z(A.z(s[a],r),r))
B.a.k(q.d,new A.b_())}}
A.dw.prototype={
$1(a){return A.hf(t.J.a(a),this.a)},
$S:0}
A.du.prototype={
$1(a){return this.b.aE(t.n.a(a))===this.a.a},
$S:3}
A.dv.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:21}
A.bK.prototype={
gY(){var s,r=this.a
if(r.cx)r=B.w
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.b(r,s)
s=A.z(r[s],t.L)
r=s}return r},
gaw(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gaZ()
else q=!0
s=B.d.C(r+2,4)
p=l.w
if(!(s<p.length))return A.b(p,s)
o=t.L
n=A.z(p[s],o)
if(q)return n
if(k.Q&&l.e===r){r=l.x
if(!(s<r.length))return A.b(r,s)
o=A.z(r[s],o)
if(2>=o.length)return A.b(o,2)
m=o[2]
if(B.a.N(n,m))return A.e([m],t.Y)}return null},
gaZ(){var s=this.a,r=!1
if(s.a.y)if(!s.cy)if(s.r===B.f){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbI(){var s,r,q,p,o,n,m=A.h5(this.gY(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gaw()
if(k!=null)m.T(0,k)
for(k=A.z(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.z(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.E.prototype={
V(){return"Team."+this.b}}
A.dW.prototype={
$1(a){return A.iB(A.a6(a))},
$S:22};(function aliases(){var s=J.as.prototype
s.b6=s.j})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_1,q=hunkHelpers._instance_1u
s(J,"hT","eC",23)
r(A,"ih","hK",1)
q(A.co.prototype,"gaX","bH",5)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.m,null)
q(A.m,[A.e4,J.cq,A.bP,J.az,A.c,A.bn,A.o,A.am,A.u,A.dk,A.ac,A.bD,A.bV,A.aO,A.r,A.a3,A.b6,A.bo,A.aP,A.at,A.dy,A.dj,A.de,A.bA,A.bB,A.bz,A.a2,A.cS,A.cY,A.c5,A.cW,A.bZ,A.q,A.cb,A.cj,A.cl,A.dD,A.cQ,A.bQ,A.dA,A.d5,A.B,A.bI,A.be,A.cT,A.cX,A.cN,A.P,A.co,A.dx,A.b9,A.cJ,A.av,A.dl,A.X,A.D,A.a1,A.bO,A.cG,A.cn,A.dt,A.bK])
q(J.cq,[J.ct,J.bt,J.bv,J.bu,J.bw,J.b3,J.aG])
q(J.bv,[J.as,J.i,A.b7,A.bG])
q(J.as,[J.cH,J.bf,J.ar])
r(J.cs,A.bP)
r(J.d9,J.i)
q(J.b3,[J.bs,J.cu])
q(A.c,[A.bg,A.f,A.aK,A.af,A.bW,A.bY,A.bi])
r(A.aA,A.bg)
r(A.bX,A.aA)
q(A.o,[A.aB,A.a0,A.cU])
q(A.am,[A.ci,A.d2,A.ch,A.cM,A.dS,A.dU,A.dh,A.dr,A.dn,A.dp,A.dq,A.ds,A.dY,A.dZ,A.d0,A.d1,A.dL,A.dM,A.d6,A.d7,A.dm,A.dw,A.du,A.dv,A.dW])
q(A.ci,[A.d3,A.da,A.dT,A.df,A.di,A.dE,A.dN,A.d8])
q(A.u,[A.b4,A.bS,A.cv,A.cP,A.cK,A.cR,A.by,A.cf,A.al,A.bT,A.cO,A.bd,A.ck])
q(A.f,[A.H,A.ab,A.bC,A.aa])
q(A.H,[A.bR,A.ad,A.bN,A.cV])
r(A.br,A.aK)
q(A.a3,[A.bh,A.aS])
r(A.ag,A.bh)
q(A.aS,[A.ah,A.c3])
r(A.bj,A.b6)
r(A.aN,A.bj)
r(A.bp,A.aN)
r(A.W,A.bo)
q(A.at,[A.bq,A.c4])
r(A.ap,A.bq)
r(A.bJ,A.bS)
q(A.cM,[A.cL,A.aY])
r(A.bx,A.a0)
q(A.bG,[A.cx,A.b8])
q(A.b8,[A.c_,A.c1])
r(A.c0,A.c_)
r(A.bE,A.c0)
r(A.c2,A.c1)
r(A.bF,A.c2)
q(A.bE,[A.cy,A.cz])
q(A.bF,[A.cA,A.cB,A.cC,A.cD,A.cE,A.bH,A.cF])
r(A.c6,A.cR)
r(A.aQ,A.c4)
r(A.cw,A.by)
r(A.db,A.cj)
q(A.cl,[A.dd,A.dc])
r(A.dC,A.dD)
q(A.al,[A.bb,A.cp])
q(A.cQ,[A.a5,A.T,A.M,A.aJ,A.an,A.E])
q(A.ch,[A.dR,A.dQ])
q(A.X,[A.I,A.L,A.J,A.Q])
q(A.D,[A.b2,A.b0,A.aZ,A.ba,A.bM,A.aC,A.bc,A.aq,A.aF,A.b_,A.aD])
s(A.c_,A.q)
s(A.c0,A.r)
s(A.c1,A.q)
s(A.c2,A.r)
s(A.bj,A.cb)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",l:"double",R:"num",k:"String",p:"bool",bI:"Null",h:"List",m:"Object",A:"Map",y:"JSObject"},mangledNames:{},types:["p(X)","@(@)","~(m?,m?)","p(a1)","a()","p(a)","@(@,k)","@(k)","~(@,@)","p(I)","h<a>(a)","p(+(a,a))","E(+(a,a))","p(M)","p(T)","p(D)","~(E,k)","p(P)","p(A<k,m?>)","~(a,h<av>)","b9(a1)","E(a1)","k(k)","a(@,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ag&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ah&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.c3&&a.b(c.a)&&b.b(c.b)}}
A.hA(v.typeUniverse,JSON.parse('{"ar":"as","cH":"as","bf":"as","iK":"b7","ct":{"p":[],"n":[]},"bt":{"n":[]},"bv":{"y":[]},"as":{"y":[]},"i":{"h":["1"],"f":["1"],"y":[],"c":["1"]},"cs":{"bP":[]},"d9":{"i":["1"],"h":["1"],"f":["1"],"y":[],"c":["1"]},"az":{"v":["1"]},"b3":{"l":[],"R":[],"a9":["R"]},"bs":{"l":[],"a":[],"R":[],"a9":["R"],"n":[]},"cu":{"l":[],"R":[],"a9":["R"],"n":[]},"aG":{"k":[],"a9":["k"],"n":[]},"bg":{"c":["2"]},"bn":{"v":["2"]},"aA":{"bg":["1","2"],"c":["2"],"c.E":"2"},"bX":{"aA":["1","2"],"bg":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"aB":{"o":["3","4"],"A":["3","4"],"o.K":"3","o.V":"4"},"b4":{"u":[]},"f":{"c":["1"]},"H":{"f":["1"],"c":["1"]},"bR":{"H":["1"],"f":["1"],"c":["1"],"H.E":"1","c.E":"1"},"ac":{"v":["1"]},"aK":{"c":["2"],"c.E":"2"},"br":{"aK":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"bD":{"v":["2"]},"ad":{"H":["2"],"f":["2"],"c":["2"],"H.E":"2","c.E":"2"},"af":{"c":["1"],"c.E":"1"},"bV":{"v":["1"]},"bW":{"c":["1"],"c.E":"1"},"aO":{"v":["1"]},"bN":{"H":["1"],"f":["1"],"c":["1"],"H.E":"1","c.E":"1"},"ag":{"bh":[],"a3":[]},"ah":{"aS":[],"a3":[]},"c3":{"aS":[],"a3":[]},"bp":{"aN":["1","2"],"bj":["1","2"],"b6":["1","2"],"cb":["1","2"],"A":["1","2"]},"bo":{"A":["1","2"]},"W":{"bo":["1","2"],"A":["1","2"]},"bY":{"c":["1"],"c.E":"1"},"aP":{"v":["1"]},"bq":{"at":["1"],"aM":["1"],"f":["1"],"c":["1"]},"ap":{"bq":["1"],"at":["1"],"aM":["1"],"f":["1"],"c":["1"]},"bJ":{"u":[]},"cv":{"u":[]},"cP":{"u":[]},"am":{"aE":[]},"ch":{"aE":[]},"ci":{"aE":[]},"cM":{"aE":[]},"cL":{"aE":[]},"aY":{"aE":[]},"cK":{"u":[]},"a0":{"o":["1","2"],"e6":["1","2"],"A":["1","2"],"o.K":"1","o.V":"2"},"ab":{"f":["1"],"c":["1"],"c.E":"1"},"bA":{"v":["1"]},"bC":{"f":["1"],"c":["1"],"c.E":"1"},"bB":{"v":["1"]},"aa":{"f":["B<1,2>"],"c":["B<1,2>"],"c.E":"B<1,2>"},"bz":{"v":["B<1,2>"]},"bx":{"a0":["1","2"],"o":["1","2"],"e6":["1","2"],"A":["1","2"],"o.K":"1","o.V":"2"},"aS":{"a3":[]},"bh":{"a3":[]},"b7":{"y":[],"n":[]},"bG":{"y":[]},"cx":{"y":[],"n":[]},"b8":{"S":["1"],"y":[]},"bE":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"y":[],"c":["l"],"r":["l"]},"bF":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"]},"cy":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"y":[],"c":["l"],"r":["l"],"n":[],"q.E":"l","r.E":"l"},"cz":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"y":[],"c":["l"],"r":["l"],"n":[],"q.E":"l","r.E":"l"},"cA":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cB":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cC":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cD":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cE":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"bH":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cF":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"y":[],"c":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cR":{"u":[]},"c6":{"u":[]},"c5":{"v":["1"]},"bi":{"c":["1"],"c.E":"1"},"aQ":{"at":["1"],"aM":["1"],"f":["1"],"c":["1"]},"bZ":{"v":["1"]},"o":{"A":["1","2"]},"b6":{"A":["1","2"]},"aN":{"bj":["1","2"],"b6":["1","2"],"cb":["1","2"],"A":["1","2"]},"at":{"aM":["1"],"f":["1"],"c":["1"]},"c4":{"at":["1"],"aM":["1"],"f":["1"],"c":["1"]},"cU":{"o":["k","@"],"A":["k","@"],"o.K":"k","o.V":"@"},"cV":{"H":["k"],"f":["k"],"c":["k"],"H.E":"k","c.E":"k"},"by":{"u":[]},"cw":{"u":[]},"l":{"R":[],"a9":["R"]},"a":{"R":[],"a9":["R"]},"h":{"f":["1"],"c":["1"]},"R":{"a9":["R"]},"aM":{"f":["1"],"c":["1"]},"k":{"a9":["k"]},"cQ":{"b1":[]},"cf":{"u":[]},"bS":{"u":[]},"al":{"u":[]},"bb":{"u":[]},"cp":{"u":[]},"bT":{"u":[]},"cO":{"u":[]},"bd":{"u":[]},"ck":{"u":[]},"bQ":{"u":[]},"be":{"hb":[]},"cT":{"e8":[]},"cX":{"e8":[]},"a5":{"b1":[]},"T":{"b1":[]},"M":{"b1":[]},"aJ":{"b1":[]},"I":{"X":[]},"aq":{"D":[]},"an":{"b1":[]},"L":{"X":[]},"J":{"X":[]},"Q":{"X":[]},"b2":{"D":[]},"b0":{"D":[]},"aZ":{"D":[]},"ba":{"D":[]},"bM":{"D":[]},"aC":{"D":[]},"bc":{"D":[]},"aF":{"D":[]},"b_":{"D":[]},"aD":{"D":[]},"E":{"b1":[]},"fZ":{"h":["a"],"f":["a"],"c":["a"]},"hj":{"h":["a"],"f":["a"],"c":["a"]},"hi":{"h":["a"],"f":["a"],"c":["a"]},"fX":{"h":["a"],"f":["a"],"c":["a"]},"hg":{"h":["a"],"f":["a"],"c":["a"]},"fY":{"h":["a"],"f":["a"],"c":["a"]},"hh":{"h":["a"],"f":["a"],"c":["a"]},"fV":{"h":["l"],"f":["l"],"c":["l"]},"fW":{"h":["l"],"f":["l"],"c":["l"]}}'))
A.hz(v.typeUniverse,JSON.parse('{"b8":1,"c4":1,"cj":2,"cl":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.ai
return{l:s("J"),k:s("a5"),L:s("P"),q:s("a9<@>"),z:s("W<k,m?>"),O:s("f<@>"),C:s("u"),r:s("Q"),Z:s("aE"),J:s("X"),E:s("D"),I:s("ap<T>"),A:s("aq"),B:s("c<D>"),bi:s("c<@>"),Y:s("i<P>"),u:s("i<X>"),c4:s("i<D>"),ba:s("i<h<P>>"),bc:s("i<A<k,m>>"),d:s("i<A<k,m?>>"),c5:s("i<a1>"),cd:s("i<b9>"),w:s("i<+(a,a)>"),d2:s("i<bO>"),bP:s("i<cJ>"),s:s("i<k>"),M:s("i<av>"),c:s("i<E>"),b:s("i<@>"),t:s("i<a>"),cG:s("i<a5?>"),v:s("i<E?>"),e:s("i<a?>"),T:s("bt"),m:s("y"),V:s("ar"),da:s("S<@>"),x:s("h<P>"),U:s("h<X>"),a:s("h<k>"),Q:s("h<av>"),j:s("h<@>"),aH:s("h<a>"),W:s("h<m?>"),aJ:s("aJ"),G:s("A<@,@>"),f:s("A<k,m?>"),p:s("A<a,h<av>>"),P:s("bI"),K:s("m"),n:s("a1"),D:s("I"),aN:s("L"),al:s("M"),cY:s("iL"),cD:s("+()"),R:s("+(a,a)"),F:s("bO"),at:s("aM<k>"),N:s("k"),_:s("T"),H:s("E"),bW:s("n"),cr:s("bf"),db:s("bW<I>"),ca:s("aO<aq>"),y:s("p"),i:s("l"),S:s("a"),ch:s("a5?"),cR:s("ez<bI>?"),aQ:s("y?"),h:s("h<@>?"),a5:s("A<@,@>?"),X:s("m?"),aD:s("k?"),bM:s("E?"),g:s("cW?"),az:s("p?"),dd:s("l?"),a3:s("a?"),ae:s("R?"),o:s("R"),cQ:s("~(k,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.W=J.cq.prototype
B.a=J.i.prototype
B.d=J.bs.prototype
B.p=J.b3.prototype
B.l=J.aG.prototype
B.X=J.ar.prototype
B.Y=J.bv.prototype
B.I=J.cH.prototype
B.A=J.bf.prototype
B.n=new A.a5(0,"easy")
B.B=new A.a5(1,"medium")
B.o=new A.a5(2,"hard")
B.C=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.M=function() {
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
B.R=function(getTagFallback) {
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
B.N=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.Q=function(hooks) {
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
B.P=function(hooks) {
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
B.O=function(hooks) {
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
B.D=function(hooks) { return hooks; }

B.E=new A.db()
B.j=new A.dk()
B.S=new A.cT()
B.J=new A.M("A",7,"ace")
B.t=new A.T(1,"espadas")
B.F=new A.P(B.J,B.t)
B.e=new A.an(0,"decision")
B.k=new A.an(1,"playing")
B.f=new A.an(2,"raisePending")
B.h=new A.an(3,"handOver")
B.i=new A.an(4,"gameOver")
B.Z=new A.dc(null)
B.a_=new A.dd(null)
B.r=new A.T(0,"ouros")
B.u=new A.T(2,"copas")
B.v=new A.T(3,"paus")
B.q=s([B.r,B.t,B.u,B.v],A.ai("i<T>"))
B.y=new A.aJ(0,"vira")
B.a7=new A.aJ(1,"fixed")
B.a0=s([B.y,B.a7],A.ai("i<aJ>"))
B.a1=s([B.n,B.B,B.o],A.ai("i<a5>"))
B.b=new A.E(0,"a")
B.c=new A.E(1,"b")
B.a2=s([B.b,B.c],t.c)
B.a3=s(["Truco","Seis","Nove","Doze"],t.s)
B.w=s([],t.Y)
B.m=s([],t.u)
B.aB=s([],t.d)
B.a4=s([],t.b)
B.a5=s([1,3,6,9,12],t.t)
B.L=new A.M("4",0,"four")
B.ag=new A.M("5",1,"five")
B.K=new A.M("6",2,"six")
B.z=new A.M("7",3,"seven")
B.ah=new A.M("Q",4,"queen")
B.ae=new A.M("J",5,"jack")
B.af=new A.M("K",6,"king")
B.ai=new A.M("2",8,"two")
B.ad=new A.M("3",9,"three")
B.x=s([B.L,B.ag,B.K,B.z,B.ah,B.ae,B.af,B.J,B.ai,B.ad],A.ai("i<M>"))
B.T=new A.P(B.z,B.r)
B.U=new A.P(B.z,B.u)
B.V=new A.P(B.L,B.v)
B.a6=s([B.T,B.F,B.U,B.V],t.Y)
B.ab={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.am=new A.ap([B.v,B.u],t.I)
B.al=new A.ap([B.r,B.t],t.I)
B.an=new A.ap([B.t,B.v],t.I)
B.ao=new A.ap([B.r,B.u],t.I)
B.a8=new A.W(B.ab,[B.am,B.al,B.an,B.ao],A.ai("W<k,aM<T>>"))
B.ac={}
B.G=new A.W(B.ac,[],A.ai("W<a,h<m?>>"))
B.H={t:0}
B.a9=new A.W(B.H,["reveal-end"],t.z)
B.aa=new A.W(B.H,["next"],t.z)
B.aj=new A.ag(B.b)
B.ak=new A.ag(B.c)
B.ap=A.a4("iG")
B.aq=A.a4("iH")
B.ar=A.a4("fV")
B.as=A.a4("fW")
B.at=A.a4("fX")
B.au=A.a4("fY")
B.av=A.a4("fZ")
B.aw=A.a4("m")
B.ax=A.a4("hg")
B.ay=A.a4("hh")
B.az=A.a4("hi")
B.aA=A.a4("hj")})();(function staticFields(){$.dB=null
$.V=A.e([],A.ai("i<m>"))
$.eJ=null
$.ew=null
$.ev=null
$.fj=null
$.fg=null
$.fm=null
$.dK=null
$.dV=null
$.em=null
$.dF=A.e([],A.ai("i<h<m>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iJ","fp",()=>A.dP("_$dart_dartClosure"))
s($,"iI","er",()=>A.dP("_$dart_dartClosure_dartJSInterop"))
s($,"iX","fA",()=>A.e([new J.cs()],A.ai("i<bP>")))
s($,"iM","fq",()=>A.ae(A.dz({
toString:function(){return"$receiver$"}})))
s($,"iN","fr",()=>A.ae(A.dz({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iO","fs",()=>A.ae(A.dz(null)))
s($,"iP","ft",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iS","fw",()=>A.ae(A.dz(void 0)))
s($,"iT","fx",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iR","fv",()=>A.ae(A.eQ(null)))
s($,"iQ","fu",()=>A.ae(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iV","fz",()=>A.ae(A.eQ(void 0)))
s($,"iU","fy",()=>A.ae(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iW","e_",()=>A.ep(B.aw))
s($,"iY","es",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.x[r]
for(p=0;p<4;++p)o.push(A.fK(q,B.q[p]))}return A.z(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b7,SharedArrayBuffer:A.b7,ArrayBufferView:A.bG,DataView:A.cx,Float32Array:A.cy,Float64Array:A.cz,Int16Array:A.cA,Int32Array:A.cB,Int8Array:A.cC,Uint16Array:A.cD,Uint32Array:A.cE,Uint8ClampedArray:A.bH,CanvasPixelArray:A.bH,Uint8Array:A.cF})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b8.$nativeSuperclassTag="ArrayBufferView"
A.c_.$nativeSuperclassTag="ArrayBufferView"
A.c0.$nativeSuperclassTag="ArrayBufferView"
A.bE.$nativeSuperclassTag="ArrayBufferView"
A.c1.$nativeSuperclassTag="ArrayBufferView"
A.c2.$nativeSuperclassTag="ArrayBufferView"
A.bF.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.iy
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()