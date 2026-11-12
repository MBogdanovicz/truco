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
if(a[b]!==s){A.iu(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.e9(b)
return new s(c,this)}:function(){if(s===null)s=A.e9(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.e9(a).prototype
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
ee(a,b,c,d){return{i:a,p:b,e:c,x:d}},
ea(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.ec==null){A.ii()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eI("Return interceptor for "+A.q(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dt
if(o==null)o=$.dt=A.dG(n)
p=q[o]}if(p!=null)return p
p=A.io(a)
if(p!=null)return p
if(typeof a=="function")return B.W
s=Object.getPrototypeOf(a)
if(s==null)return B.H
if(s===Object.prototype)return B.H
if(typeof q=="function"){o=$.dt
if(o==null)o=$.dt=A.dG(n)
Object.defineProperty(q,o,{value:B.A,enumerable:false,writable:true,configurable:true})
return B.A}return B.A},
fR(a,b){if(a<0||a>4294967295)throw A.d(A.aA(a,0,4294967295,"length",null))
return J.fS(new Array(a),b)},
et(a,b){if(a<0)throw A.d(A.cX("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("h<0>"))},
dU(a,b){if(a<0)throw A.d(A.cX("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("h<0>"))},
fS(a,b){var s=A.e(a,b.h("h<0>"))
s.$flags=1
return s},
eu(a,b){var s=t.e
return J.ft(s.a(a),s.a(b))},
aK(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bp.prototype
return J.co.prototype}if(typeof a=="string")return J.aw.prototype
if(a==null)return J.bq.prototype
if(typeof a=="boolean")return J.cn.prototype
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bt.prototype
if(typeof a=="bigint")return J.br.prototype
return a}if(a instanceof A.m)return a
return J.ea(a)},
dF(a){if(typeof a=="string")return J.aw.prototype
if(a==null)return a
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bt.prototype
if(typeof a=="bigint")return J.br.prototype
return a}if(a instanceof A.m)return a
return J.ea(a)},
cV(a){if(a==null)return a
if(Array.isArray(a))return J.h.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bt.prototype
if(typeof a=="bigint")return J.br.prototype
return a}if(a instanceof A.m)return a
return J.ea(a)},
ic(a){if(typeof a=="number")return J.aX.prototype
if(typeof a=="string")return J.aw.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.ba.prototype
return a},
Q(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aK(a).L(a,b)},
aQ(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.il(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dF(a).l(a,b)},
fs(a,b,c){return J.cV(a).i(a,b,c)},
ej(a,b){return J.cV(a).k(a,b)},
ft(a,b){return J.ic(a).aL(a,b)},
ek(a,b){return J.cV(a).I(a,b)},
a7(a){return J.aK(a).gu(a)},
fu(a){return J.dF(a).gt(a)},
fv(a){return J.cV(a).gv(a)},
ag(a){return J.cV(a).gq(a)},
cW(a){return J.dF(a).gm(a)},
fw(a){return J.aK(a).gB(a)},
c8(a){return J.aK(a).j(a)},
ck:function ck(){},
cn:function cn(){},
bq:function bq(){},
bs:function bs(){},
an:function an(){},
cC:function cC(){},
ba:function ba(){},
am:function am(){},
br:function br(){},
bt:function bt(){},
h:function h(a){this.$ti=a},
cm:function cm(){},
d2:function d2(a){this.$ti=a},
ar:function ar(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aX:function aX(){},
bp:function bp(){},
co:function co(){},
aw:function aw(){}},A={dV:function dV(){},
fC(a,b,c){if(t.O.b(a))return new A.bS(a,b.h("@<0>").A(c).h("bS<1,2>"))
return new A.as(a,b.h("@<0>").A(c).h("as<1,2>"))},
fU(a){return new A.aY("Field '"+a+"' has not been initialized.")},
fT(a){return new A.aY("Field '"+a+"' has already been initialized.")},
ap(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
e2(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ed(a){var s,r
for(s=$.U.length,r=0;r<s;++r)if(a===$.U[r])return!0
return!1},
h2(a,b,c,d){A.e0(b,"start")
if(c!=null){A.e0(c,"end")
if(b>c)A.aO(A.aA(b,0,c,"start",null))}return new A.bN(a,b,c,d.h("bN<0>"))},
fZ(a,b,c,d){if(t.O.b(a))return new A.bn(a,b,c.h("@<0>").A(d).h("bn<1,2>"))
return new A.az(a,b,c.h("@<0>").A(d).h("az<1,2>"))},
cl(){return new A.b7("No element")},
es(){return new A.b7("Too many elements")},
bb:function bb(){},
bj:function bj(a,b){this.a=a
this.$ti=b},
as:function as(a,b){this.a=a
this.$ti=b},
bS:function bS(a,b){this.a=a
this.$ti=b},
at:function at(a,b){this.a=a
this.$ti=b},
d0:function d0(a,b){this.a=a
this.b=b},
d_:function d_(a){this.a=a},
aY:function aY(a){this.a=a},
dc:function dc(){},
f:function f(){},
O:function O(){},
bN:function bN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
ax:function ax(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
az:function az(a,b,c){this.a=a
this.b=b
this.$ti=c},
bn:function bn(a,b,c){this.a=a
this.b=b
this.$ti=c},
bA:function bA(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ab:function ab(a,b,c){this.a=a
this.b=b
this.$ti=c},
ad:function ad(a,b,c){this.a=a
this.b=b
this.$ti=c},
bQ:function bQ(a,b,c){this.a=a
this.b=b
this.$ti=c},
bR:function bR(a,b){this.a=a
this.$ti=b},
aD:function aD(a,b){this.a=a
this.$ti=b},
r:function r(){},
eq(a,b,c){var s,r,q,p,o,n,m,l=A.j(a),k=A.b_(new A.aa(a,l.h("aa<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.C)(k),++i,p=o){r=k[i]
c.a(a.l(0,r))
o=p+1
q[r]=p}n=A.b_(new A.bz(a,l.h("bz<2>")),!0,c)
m=new A.X(q,n,b.h("@<0>").A(c).h("X<1,2>"))
m.$keys=k
return m}return new A.bl(A.fV(a,b,c),b.h("@<0>").A(c).h("bl<1,2>"))},
fI(){throw A.d(A.cL("Cannot modify constant Set"))},
ff(a){var s=A.fe(a)
if(s!=null)return s
return"minified:"+a},
il(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
q(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.c8(a)
return s},
bI(a){var s,r=$.eA
if(r==null)r=$.eA=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cD(a){var s,r,q,p
if(a instanceof A.m)return A.T(A.aL(a),null)
s=J.aK(a)
if(s===B.V||s===B.X||t.cr.b(a)){r=B.C(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.T(A.aL(a),null)},
eB(a){var s,r,q
if(a==null||typeof a=="number"||A.e7(a))return J.c8(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.ai)return a.j(0)
if(a instanceof A.a0)return a.aJ(!0)
s=$.fr()
for(r=0;r<1;++r){q=s[r].bD(a)
if(q!=null)return q}return"Instance of '"+A.cD(a)+"'"},
G(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aI(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aA(a,0,1114111,null,null))},
c(a,b){if(a==null)J.cW(a)
throw A.d(A.f9(a,b))},
f9(a,b){var s,r="index"
if(!A.f1(b))return new A.ah(!0,b,r,null)
s=J.cW(a)
if(b<0||b>=s)return A.dS(b,s,a,r)
return A.eD(b,r)},
d(a){return A.B(a,new Error())},
B(a,b){var s
if(a==null)a=new A.bO()
b.dartException=a
s=A.iw
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iw(){return J.c8(this.dartException)},
aO(a,b){throw A.B(a,b==null?new Error():b)},
bi(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.aO(A.hC(a,b,c),s)},
hC(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.bP("'"+s+"': Cannot "+o+" "+l+k+n)},
C(a){throw A.d(A.a4(a))},
ac(a){var s,r,q,p,o,n
a=A.ir(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.e([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.dq(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dr(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
eH(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
dW(a,b){var s=b==null,r=s?null:b.method
return new A.cp(a,r,s?null:b.receiver)},
eg(a){if(a==null)return new A.db(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aN(a,a.dartException)
return A.i3(a)},
aN(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
i3(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aI(r,16)&8191)===10)switch(q){case 438:return A.aN(a,A.dW(A.q(s)+" (Error "+q+")",null))
case 445:case 5007:A.q(s)
return A.aN(a,new A.bG())}}if(a instanceof TypeError){p=$.fh()
o=$.fi()
n=$.fj()
m=$.fk()
l=$.fn()
k=$.fo()
j=$.fm()
$.fl()
i=$.fq()
h=$.fp()
g=p.K(s)
if(g!=null)return A.aN(a,A.dW(A.a5(s),g))
else{g=o.K(s)
if(g!=null){g.method="call"
return A.aN(a,A.dW(A.a5(s),g))}else if(n.K(s)!=null||m.K(s)!=null||l.K(s)!=null||k.K(s)!=null||j.K(s)!=null||m.K(s)!=null||i.K(s)!=null||h.K(s)!=null){A.a5(s)
return A.aN(a,new A.bG())}}return A.aN(a,new A.cK(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bM()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aN(a,new A.ah(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bM()
return a},
ef(a){if(a==null)return J.a7(a)
if(typeof a=="object")return A.bI(a)
return J.a7(a)},
i4(a){if(typeof a=="number")return B.o.gu(a)
if(a instanceof A.cU)return A.bI(a)
if(a instanceof A.a0)return a.gu(a)
return A.ef(a)},
ia(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
hL(a,b,c,d,e,f){t.Z.a(a)
switch(A.a1(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(new A.ds("Unsupported number of arguments for wrapped closure"))},
i5(a,b){var s=a.$identity
if(!!s)return s
s=A.i6(a,b)
a.$identity=s
return s},
i6(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.hL)},
fH(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cG().constructor.prototype):Object.create(new A.aR(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ep(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fD(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ep(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fD(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fy)}throw A.d("Error in functionType of tearoff")},
fE(a,b,c,d){var s=A.eo
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ep(a,b,c,d){if(c)return A.fG(a,b,d)
return A.fE(b.length,d,a,b)},
fF(a,b,c,d){var s=A.eo,r=A.fz
switch(b?-1:a){case 0:throw A.d(new A.cF("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fG(a,b,c){var s,r
if($.em==null)$.em=A.el("interceptor")
if($.en==null)$.en=A.el("receiver")
s=b.length
r=A.fF(s,c,a,b)
return r},
e9(a){return A.fH(a)},
fy(a,b){return A.c5(v.typeUniverse,A.aL(a.a),b)},
eo(a){return a.a},
fz(a){return a.b},
el(a){var s,r,q,p=new A.aR("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.cX("Field name "+a+" not found."))},
dG(a){return v.getIsolateTag(a)},
io(a){var s,r,q,p,o,n=A.a5($.fa.$1(a)),m=$.dC[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dM[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.eY($.f7.$2(a,n))
if(q!=null){m=$.dC[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dM[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.dO(s)
$.dC[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dM[n]=s
return s}if(p==="-"){o=A.dO(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fc(a,s)
if(p==="*")throw A.d(A.eI(n))
if(v.leafTags[n]===true){o=A.dO(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fc(a,s)},
fc(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.ee(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
dO(a){return J.ee(a,!1,null,!!a.$iR)},
iq(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.dO(s)
else return J.ee(s,c,null,null)},
ii(){if(!0===$.ec)return
$.ec=!0
A.ij()},
ij(){var s,r,q,p,o,n,m,l
$.dC=Object.create(null)
$.dM=Object.create(null)
A.ih()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.fd.$1(o)
if(n!=null){m=A.iq(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
ih(){var s,r,q,p,o,n,m=B.L()
m=A.bg(B.M,A.bg(B.N,A.bg(B.D,A.bg(B.D,A.bg(B.O,A.bg(B.P,A.bg(B.Q(B.C),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fa=new A.dJ(p)
$.f7=new A.dK(o)
$.fd=new A.dL(n)},
bg(a,b){return a(b)||b},
i8(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
ir(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ae:function ae(a){this.a=a},
af:function af(a,b){this.a=a
this.b=b},
bZ:function bZ(a,b){this.a=a
this.b=b},
bl:function bl(a,b){this.a=a
this.$ti=b},
bk:function bk(){},
X:function X(a,b,c){this.a=a
this.b=b
this.$ti=c},
bT:function bT(a,b){this.a=a
this.$ti=b},
aE:function aE(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bm:function bm(){},
ak:function ak(a,b){this.a=a
this.$ti=b},
bL:function bL(){},
dq:function dq(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bG:function bG(){},
cp:function cp(a,b,c){this.a=a
this.b=b
this.c=c},
cK:function cK(a){this.a=a},
db:function db(a){this.a=a},
ai:function ai(){},
cb:function cb(){},
cc:function cc(){},
cH:function cH(){},
cG:function cG(){},
aR:function aR(a,b){this.a=a
this.b=b},
cF:function cF(a){this.a=a},
Y:function Y(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
d3:function d3(a){this.a=a},
d7:function d7(a,b){this.a=a
this.b=b
this.c=null},
aa:function aa(a,b){this.a=a
this.$ti=b},
bx:function bx(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bz:function bz(a,b){this.a=a
this.$ti=b},
by:function by(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
a9:function a9(a,b){this.a=a
this.$ti=b},
bw:function bw(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bu:function bu(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
dJ:function dJ(a){this.a=a},
dK:function dK(a){this.a=a},
dL:function dL(a){this.a=a},
a0:function a0(){},
aH:function aH(){},
bc:function bc(){},
b1:function b1(){},
bD:function bD(){},
cs:function cs(){},
b2:function b2(){},
bB:function bB(){},
bC:function bC(){},
ct:function ct(){},
cu:function cu(){},
cv:function cv(){},
cw:function cw(){},
cx:function cx(){},
cy:function cy(){},
cz:function cz(){},
bE:function bE(){},
cA:function cA(){},
bV:function bV(){},
bW:function bW(){},
bX:function bX(){},
bY:function bY(){},
e1(a,b){var s=b.c
return s==null?b.c=A.c3(a,"er",[b.x]):s},
eE(a){var s=a.w
if(s===6||s===7)return A.eE(a.x)
return s===11||s===12},
h0(a){return a.as},
a6(a){return A.dy(v.typeUniverse,a,!1)},
aI(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aI(a1,s,a3,a4)
if(r===s)return a2
return A.eQ(a1,r,!0)
case 7:s=a2.x
r=A.aI(a1,s,a3,a4)
if(r===s)return a2
return A.eP(a1,r,!0)
case 8:q=a2.y
p=A.bf(a1,q,a3,a4)
if(p===q)return a2
return A.c3(a1,a2.x,p)
case 9:o=a2.x
n=A.aI(a1,o,a3,a4)
m=a2.y
l=A.bf(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.e4(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bf(a1,j,a3,a4)
if(i===j)return a2
return A.eR(a1,k,i)
case 11:h=a2.x
g=A.aI(a1,h,a3,a4)
f=a2.y
e=A.i0(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.eO(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bf(a1,d,a3,a4)
o=a2.x
n=A.aI(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.e5(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.ca("Attempted to substitute unexpected RTI kind "+a0))}},
bf(a,b,c,d){var s,r,q,p,o=b.length,n=A.dz(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aI(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
i1(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dz(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aI(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
i0(a,b,c,d){var s,r=b.a,q=A.bf(a,r,c,d),p=b.b,o=A.bf(a,p,c,d),n=b.c,m=A.i1(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cO()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
f8(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ie(s)
return a.$S()}return null},
ik(a,b){var s
if(A.eE(b))if(a instanceof A.ai){s=A.f8(a)
if(s!=null)return s}return A.aL(a)},
aL(a){if(a instanceof A.m)return A.j(a)
if(Array.isArray(a))return A.K(a)
return A.e6(J.aK(a))},
K(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
j(a){var s=a.$ti
return s!=null?s:A.e6(a)},
e6(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hJ(a,s)},
hJ(a,b){var s=a instanceof A.ai?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hr(v.typeUniverse,s.name)
b.$ccache=r
return r},
ie(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dy(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
id(a){return A.aJ(A.j(a))},
e8(a){var s
if(a instanceof A.a0)return A.i9(a.$r,a.af())
s=a instanceof A.ai?A.f8(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fw(a).a
if(Array.isArray(a))return A.K(a)
return A.aL(a)},
aJ(a){var s=a.r
return s==null?a.r=new A.cU(a):s},
i9(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.c(q,0)
s=A.c5(v.typeUniverse,A.e8(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.c(q,r)
s=A.eT(v.typeUniverse,s,A.e8(q[r]))}return A.c5(v.typeUniverse,s,a)},
a2(a){return A.aJ(A.dy(v.typeUniverse,a,!1))},
hI(a){var s=this
s.b=A.i_(s)
return s.b(a)},
i_(a){var s,r,q,p,o
if(a===t.K)return A.hR
if(A.aM(a))return A.hV
s=a.w
if(s===6)return A.hG
if(s===1)return A.f3
if(s===7)return A.hM
r=A.hZ(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aM)){a.f="$i"+q
if(q==="i")return A.hP
if(a===t.m)return A.hO
return A.hU}}else if(s===10){p=A.i8(a.x,a.y)
o=p==null?A.f3:p
return o==null?A.eX(o):o}return A.hE},
hZ(a){if(a.w===8){if(a===t.S)return A.f1
if(a===t.i||a===t.o)return A.hQ
if(a===t.N)return A.hT
if(a===t.y)return A.e7}return null},
hH(a){var s=this,r=A.hD
if(A.aM(s))r=A.hz
else if(s===t.K)r=A.eX
else if(A.bh(s)){r=A.hF
if(s===t.a3)r=A.hw
else if(s===t.aD)r=A.eY
else if(s===t.az)r=A.c7
else if(s===t.ae)r=A.dA
else if(s===t.dd)r=A.hv
else if(s===t.z)r=A.hy}else if(s===t.S)r=A.a1
else if(s===t.N)r=A.a5
else if(s===t.y)r=A.ht
else if(s===t.o)r=A.eW
else if(s===t.i)r=A.hu
else if(s===t.m)r=A.hx
s.a=r
return s.a(a)},
hE(a){var s=this
if(a==null)return A.bh(s)
return A.im(v.typeUniverse,A.ik(a,s),s)},
hG(a){if(a==null)return!0
return this.x.b(a)},
hU(a){var s,r=this
if(a==null)return A.bh(r)
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.aK(a)[s]},
hP(a){var s,r=this
if(a==null)return A.bh(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.aK(a)[s]},
hO(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.m)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
f2(a){if(typeof a=="object"){if(a instanceof A.m)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hD(a){var s=this
if(a==null){if(A.bh(s))return a}else if(s.b(a))return a
throw A.B(A.eZ(a,s),new Error())},
hF(a){var s=this
if(a==null||s.b(a))return a
throw A.B(A.eZ(a,s),new Error())},
eZ(a,b){return new A.c1("TypeError: "+A.eJ(a,A.T(b,null)))},
eJ(a,b){return A.cg(a)+": type '"+A.T(A.e8(a),null)+"' is not a subtype of type '"+b+"'"},
W(a,b){return new A.c1("TypeError: "+A.eJ(a,b))},
hM(a){var s=this
return s.x.b(a)||A.e1(v.typeUniverse,s).b(a)},
hR(a){return a!=null},
eX(a){if(a!=null)return a
throw A.B(A.W(a,"Object"),new Error())},
hV(a){return!0},
hz(a){return a},
f3(a){return!1},
e7(a){return!0===a||!1===a},
ht(a){if(!0===a)return!0
if(!1===a)return!1
throw A.B(A.W(a,"bool"),new Error())},
c7(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.B(A.W(a,"bool?"),new Error())},
hu(a){if(typeof a=="number")return a
throw A.B(A.W(a,"double"),new Error())},
hv(a){if(typeof a=="number")return a
if(a==null)return a
throw A.B(A.W(a,"double?"),new Error())},
f1(a){return typeof a=="number"&&Math.floor(a)===a},
a1(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.B(A.W(a,"int"),new Error())},
hw(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.B(A.W(a,"int?"),new Error())},
hQ(a){return typeof a=="number"},
eW(a){if(typeof a=="number")return a
throw A.B(A.W(a,"num"),new Error())},
dA(a){if(typeof a=="number")return a
if(a==null)return a
throw A.B(A.W(a,"num?"),new Error())},
hT(a){return typeof a=="string"},
a5(a){if(typeof a=="string")return a
throw A.B(A.W(a,"String"),new Error())},
eY(a){if(typeof a=="string")return a
if(a==null)return a
throw A.B(A.W(a,"String?"),new Error())},
hx(a){if(A.f2(a))return a
throw A.B(A.W(a,"JSObject"),new Error())},
hy(a){if(a==null)return a
if(A.f2(a))return a
throw A.B(A.W(a,"JSObject?"),new Error())},
f4(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.T(a[q],b)
return s},
hY(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.f4(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.T(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
f_(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.e([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.k(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.c(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.T(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.T(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.T(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.T(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.T(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
T(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.T(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.T(a.x,b)+">"
if(l===8){p=A.i2(a.x)
o=a.y
return o.length>0?p+("<"+A.f4(o,b)+">"):p}if(l===10)return A.hY(a,b)
if(l===11)return A.f_(a,b,null)
if(l===12)return A.f_(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.c(b,n)
return b[n]}return"?"},
i2(a){var s=A.fe(a)
if(s!=null)return s
return"minified:"+a},
hs(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hr(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dy(a,b,!1)
else if(typeof m=="number"){s=m
r=A.c4(a,5,"#")
q=A.dz(s)
for(p=0;p<s;++p)q[p]=r
o=A.c3(a,b,q)
n[b]=o
return o}else return m},
hq(a,b){return A.eU(a.tR,b)},
hp(a,b){return A.eU(a.eT,b)},
dy(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.eS(a,null,b,!1)
r.set(b,s)
return s},
c5(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.eS(a,b,c,!0)
q.set(c,r)
return r},
eT(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.e4(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
eS(a,b,c,d){return A.hi(A.hc(a,b,c,d))},
aq(a,b){b.a=A.hH
b.b=A.hI
return b},
c4(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a_(null,null)
s.w=b
s.as=c
r=A.aq(a,s)
a.eC.set(c,r)
return r},
eQ(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hn(a,b,r,c)
a.eC.set(r,s)
return s},
hn(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aM(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bh(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a_(null,null)
q.w=6
q.x=b
q.as=c
return A.aq(a,q)},
eP(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.hl(a,b,r,c)
a.eC.set(r,s)
return s},
hl(a,b,c,d){var s,r
if(d){s=b.w
if(A.aM(b)||b===t.K)return b
else if(s===1)return A.c3(a,"er",[b])
else if(b===t.P||b===t.T)return t.bc}r=new A.a_(null,null)
r.w=7
r.x=b
r.as=c
return A.aq(a,r)},
ho(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a_(null,null)
s.w=13
s.x=b
s.as=q
r=A.aq(a,s)
a.eC.set(q,r)
return r},
c2(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hk(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
c3(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.c2(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a_(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.aq(a,r)
a.eC.set(p,q)
return q},
e4(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.c2(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a_(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.aq(a,o)
a.eC.set(q,n)
return n},
eR(a,b,c){var s,r,q="+"+(b+"("+A.c2(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a_(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.aq(a,s)
a.eC.set(q,r)
return r},
eO(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.c2(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.c2(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hk(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a_(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.aq(a,p)
a.eC.set(r,o)
return o},
e5(a,b,c,d){var s,r=b.as+("<"+A.c2(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hm(a,b,c,r,d)
a.eC.set(r,s)
return s},
hm(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dz(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aI(a,b,r,0)
m=A.bf(a,c,r,0)
return A.e5(a,n,m,c!==m)}}l=new A.a_(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.aq(a,l)},
hc(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hi(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.he(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eL(a,r,l,k,!1)
else if(q===46)r=A.eL(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aG(a.u,a.e,k.pop()))
break
case 94:k.push(A.ho(a.u,k.pop()))
break
case 35:k.push(A.c4(a.u,5,"#"))
break
case 64:k.push(A.c4(a.u,2,"@"))
break
case 126:k.push(A.c4(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.hg(a,k)
break
case 38:A.hf(a,k)
break
case 63:p=a.u
k.push(A.eQ(p,A.aG(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.eP(p,A.aG(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.hd(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.eM(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.hj(a.u,a.e,o)
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
return A.aG(a.u,a.e,m)},
he(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eL(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hs(s,o.x)[p]
if(n==null)A.aO('No "'+p+'" in "'+A.h0(o)+'"')
d.push(A.c5(s,o,n))}else d.push(p)
return m},
hg(a,b){var s,r=a.u,q=A.eK(a,b),p=b.pop()
if(typeof p=="string")b.push(A.c3(r,p,q))
else{s=A.aG(r,a.e,p)
switch(s.w){case 11:b.push(A.e5(r,s,q,a.n))
break
default:b.push(A.e4(r,s,q))
break}}},
hd(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eK(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aG(p,a.e,o)
q=new A.cO()
q.a=s
q.b=n
q.c=m
b.push(A.eO(p,r,q))
return
case-4:b.push(A.eR(p,b.pop(),s))
return
default:throw A.d(A.ca("Unexpected state under `()`: "+A.q(o)))}},
hf(a,b){var s=b.pop()
if(0===s){b.push(A.c4(a.u,1,"0&"))
return}if(1===s){b.push(A.c4(a.u,4,"1&"))
return}throw A.d(A.ca("Unexpected extended operation "+A.q(s)))},
eK(a,b){var s=b.splice(a.p)
A.eM(a.u,a.e,s)
a.p=b.pop()
return s},
aG(a,b,c){if(typeof c=="string")return A.c3(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hh(a,b,c)}else return c},
eM(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aG(a,b,c[s])},
hj(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aG(a,b,c[s])},
hh(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.ca("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.ca("Bad index "+c+" for "+b.j(0)))},
im(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.y(a,b,null,c,null)
r.set(c,s)}return s},
y(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aM(d))return!0
s=b.w
if(s===4)return!0
if(A.aM(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.y(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.y(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.y(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.y(a,b.x,c,d,e))return!1
return A.y(a,A.e1(a,b),c,d,e)}if(s===6)return A.y(a,p,c,d,e)&&A.y(a,b.x,c,d,e)
if(q===7){if(A.y(a,b,c,d.x,e))return!0
return A.y(a,b,c,A.e1(a,d),e)}if(q===6)return A.y(a,b,c,p,e)||A.y(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.cY)return!0
if(q===12){if(b===t.M)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.y(a,j,c,i,e)||!A.y(a,i,e,j,c))return!1}return A.f0(a,b.x,c,d.x,e)}if(q===11){if(b===t.M)return!0
if(p)return!1
return A.f0(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hN(a,b,c,d,e)}if(o&&q===10)return A.hS(a,b,c,d,e)
return!1},
f0(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
hN(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.c5(a,b,r[o])
return A.eV(a,p,null,c,d.y,e)}return A.eV(a,b.y,null,c,d.y,e)},
eV(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.y(a,b[s],d,e[s],f))return!1
return!0},
hS(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.y(a,r[s],c,q[s],e))return!1
return!0},
bh(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aM(a))if(s!==6)r=s===7&&A.bh(a.x)
return r},
aM(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
eU(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dz(a){return a>0?new Array(a):v.typeUniverse.sEA},
a_:function a_(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cO:function cO(){this.c=this.b=this.a=null},
cU:function cU(a){this.a=a},
cN:function cN(){},
c1:function c1(a){this.a=a},
eN(a,b,c){return 0},
c0:function c0(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
bd:function bd(a,b){this.a=a
this.$ti=b},
ew(a,b){return new A.Y(a.h("@<0>").A(b).h("Y<1,2>"))},
cr(a,b,c){return b.h("@<0>").A(c).h("dX<1,2>").a(A.ia(a,new A.Y(b.h("@<0>").A(c).h("Y<1,2>"))))},
J(a,b){return new A.Y(a.h("@<0>").A(b).h("Y<1,2>"))},
ex(a){return new A.aF(a.h("aF<0>"))},
dY(a){return new A.aF(a.h("aF<0>"))},
e3(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
fV(a,b,c){var s=A.ew(b,c)
a.E(0,new A.d8(s,b,c))
return s},
fW(a,b){var s=A.ex(b)
s.a1(0,a)
return s},
dZ(a){var s,r
if(A.ed(a))return"{...}"
s=new A.b8("")
try{r={}
B.a.k($.U,a)
s.a+="{"
r.a=!0
a.E(0,new A.da(r,s))
s.a+="}"}finally{if(0>=$.U.length)return A.c($.U,-1)
$.U.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
aF:function aF(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cS:function cS(a){this.a=a
this.b=null},
bU:function bU(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
d8:function d8(a,b,c){this.a=a
this.b=b
this.c=c},
p:function p(){},
o:function o(){},
d9:function d9(a){this.a=a},
da:function da(a,b){this.a=a
this.b=b},
c6:function c6(){},
b0:function b0(){},
aC:function aC(a,b){this.a=a
this.$ti=b},
ao:function ao(){},
c_:function c_(){},
be:function be(){},
hX(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.eg(r)
q=String(s)
throw A.d(new A.d1(q))}q=A.dB(p)
return q},
dB(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cQ(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dB(a[s])
return a},
ev(a,b,c){return new A.bv(a,b)},
hB(a){return a.M()},
ha(a,b){return new A.du(a,[],A.i7())},
hb(a,b,c){var s,r=new A.b8(""),q=A.ha(r,b)
q.a8(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cQ:function cQ(a,b){this.a=a
this.b=b
this.c=null},
cR:function cR(a){this.a=a},
cd:function cd(){},
cf:function cf(){},
bv:function bv(a,b){this.a=a
this.b=b},
cq:function cq(a,b){this.a=a
this.b=b},
d4:function d4(){},
d6:function d6(a){this.b=a},
d5:function d5(a){this.a=a},
dv:function dv(){},
dw:function dw(a,b){this.a=a
this.b=b},
du:function du(a,b,c){this.c=a
this.a=b
this.b=c},
fX(a,b,c,d){var s,r=c?J.et(a,d):J.fR(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
b_(a,b,c){var s,r=A.e([],c.h("h<0>"))
for(s=J.ag(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
aZ(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("h<0>"))
s=A.e([],b.h("h<0>"))
for(r=J.ag(a);r.n();)B.a.k(s,r.gp())
return s},
fY(a,b,c){var s,r=J.et(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
D(a,b){var s=A.b_(a,!1,b)
s.$flags=3
return s},
eG(a,b,c){var s=J.ag(b)
if(!s.n())return a
if(c.length===0){do a+=A.q(s.gp())
while(s.n())}else{a+=A.q(s.gp())
while(s.n())a=a+c+A.q(s.gp())}return a},
fK(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fx(b,"name","No enum value with that name"))},
fJ(a,b){var s,r,q=A.J(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cg(a){if(typeof a=="number"||A.e7(a)||a==null)return J.c8(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eB(a)},
ca(a){return new A.c9(a)},
cX(a){return new A.ah(!1,null,null,a)},
fx(a,b,c){return new A.ah(!0,a,b,c)},
eC(a){var s=null
return new A.b5(s,s,!1,s,s,a)},
eD(a,b){return new A.b5(null,null,!0,a,b,"Value not in range")},
aA(a,b,c,d,e){return new A.b5(b,c,!0,a,d,"Invalid value")},
h_(a,b,c){if(0>a||a>c)throw A.d(A.aA(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aA(b,a,c,"end",null))
return b}return c},
e0(a,b){if(a<0)throw A.d(A.aA(a,0,null,b,null))
return a},
dS(a,b,c,d){return new A.cj(b,!0,a,d,"Index out of range")},
cL(a){return new A.bP(a)},
eI(a){return new A.cJ(a)},
eF(a){return new A.b7(a)},
a4(a){return new A.ce(a)},
fQ(a,b,c){var s,r
if(A.ed(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.k($.U,a)
try{A.hW(a,s)}finally{if(0>=$.U.length)return A.c($.U,-1)
$.U.pop()}r=A.eG(b,t.r.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
dT(a,b,c){var s,r
if(A.ed(a))return b+"..."+c
s=new A.b8(b)
B.a.k($.U,a)
try{r=s
r.a=A.eG(r.a,a,", ")}finally{if(0>=$.U.length)return A.c($.U,-1)
$.U.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
hW(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
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
ey(a,b,c,d,e){return new A.at(a,b.h("@<0>").A(c).A(d).A(e).h("at<1,2,3,4>"))},
ez(a,b,c,d){var s
if(B.h===c){s=B.d.gu(a)
b=J.a7(b)
return A.e2(A.ap(A.ap($.dR(),s),b))}if(B.h===d){s=B.d.gu(a)
b=J.a7(b)
c=J.a7(c)
return A.e2(A.ap(A.ap(A.ap($.dR(),s),b),c))}s=B.d.gu(a)
b=J.a7(b)
c=J.a7(c)
d=J.a7(d)
d=A.e2(A.ap(A.ap(A.ap(A.ap($.dR(),s),b),c),d))
return d},
cM:function cM(){},
u:function u(){},
c9:function c9(a){this.a=a},
bO:function bO(){},
ah:function ah(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b5:function b5(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
cj:function cj(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bP:function bP(a){this.a=a},
cJ:function cJ(a){this.a=a},
b7:function b7(a){this.a=a},
ce:function ce(a){this.a=a},
bM:function bM(){},
ds:function ds(a){this.a=a},
d1:function d1(a){this.a=a},
b:function b(){},
x:function x(a,b,c){this.a=a
this.b=b
this.$ti=c},
bF:function bF(){},
m:function m(){},
b8:function b8(a){this.a=a},
cP:function cP(){},
cT:function cT(){this.b=this.a=0},
it(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.aZ(a1,t.bM),c=A.aZ(a,t.R)
for(s=A.K(c),r=s.h("t(1)"),s=s.h("ad<1>"),q=s.h("b.E"),p=b,o=a2;;){n={}
m=A.fb(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.c(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.a4(k,p.b)
p=null}else j=A.eb(k,c,d,o)
k.$flags&1&&A.bi(k,"removeAt",1)
if(j<0||j>=k.length)A.aO(A.eD(j,null))
B.a.k(c,new A.af(o,k.splice(j,1)[0]))
o=B.d.C(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.aZ(new A.ad(c,r.a(new A.dP(n)),s),q)
l=A.K(f)
e=new A.ab(f,l.h("A(1)").a(new A.dQ()),l.h("ab<1,A>")).aT(0)
B.a.k(d,e.a===1?e.gY(0):null)
o=B.a.gR(f).a
B.a.P(c)}},
eb(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=new A.dI(a),d=new A.dH(a)
if(a.length===1)return 0
s=(a0&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gR(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?d.$0():e.$0()
q=A.aZ(a,t.S)
B.a.aX(q)
if(B.a.gbA(q)>=10){p=q.length
o=p-2
if(!(o>=0))return A.c(q,o)
o=q[o]>=6
p=o}else p=!1
if(p){p=q.length
o=p-2
if(!(o>=0))return A.c(q,o)
return B.a.a4(a,q[o])}return d.$0()}for(n=-2,m=-2,l=0;l<q;++l){p=b[l]
k=p.b
if(((p.a&1)===0?B.b:B.c)===s)m=Math.max(m,k)
else n=Math.max(n,k)}if(q===1)q=((B.a.gR(b).a&1)===0?B.b:B.c)!==s
else q=!1
if(q){for(q=a.length,j=-1,i=0;i<q;++i){p=a[i]
if(p>n)if(j>=0){if(!(j>=0&&j<q))return A.c(a,j)
p=p<a[j]}else p=!0
else p=!1
if(p)j=i}if(j>=0){if(!(j<q))return A.c(a,j)
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
if(p>h)if(g>=0){if(!(g>=0&&g<q))return A.c(a,g)
p=p<a[g]}else p=!0
else p=!1
if(p)g=i}if(g>=0)return g
if(c.length!==0&&B.a.gR(c)===s){f=B.a.a4(a,n)
if(f>=0)return f}return e.$0()},
a3:function a3(a,b){this.a=a
this.b=b},
cI:function cI(a,b){this.a=a
this.b=b},
di:function di(){},
df:function df(){},
dg:function dg(){},
dh:function dh(a,b){this.a=a
this.b=b},
dj:function dj(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dP:function dP(a){this.a=a},
dQ:function dQ(){},
dI:function dI(a){this.a=a},
dH:function dH(a){this.a=a},
fA(a,b){return new A.L(a,b)},
fB(a){return new A.L(B.a.aO(B.x,new A.cY(a)),B.a.aO(B.p,new A.cZ(a)))},
S:function S(a,b){this.a=a
this.b=b},
I:function I(a,b,c){this.c=a
this.a=b
this.b=c},
L:function L(a,b){this.a=a
this.b=b},
cY:function cY(a){this.a=a},
cZ:function cZ(a){this.a=a},
ib(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.J(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.dY(s))
q=new A.dE(a6)
p=A.dY(t.H)
o=A.J(a5,t.L)
for(a5=a7.length,s=t._,n=!1,m=null,l=1,k=0,j=!1,i=!1,h=0;h<a7.length;a7.length===a5||(0,A.C)(a7),++h){g=a7[h]
A:{if(g instanceof A.aW){o.P(0)
m=g
l=1
k=0
j=!1
i=!1
break A}if(g instanceof A.b4){k=g.b
break A}f=g instanceof A.au
if(f&&g.b)break A
if(f){p.k(0,(g.a&1)===0?B.b:B.c)
i=k===6
j=!0
break A}if(g instanceof A.aS){if(l===3&&!g.c)o.i(0,g.a,g.b)
break A}if(g instanceof A.b6){l=g.a+1
break A}if(g instanceof A.al){e=g.a
f=m!=null
if(f&&m.e==null&&g.b>1)n=!0
if(!f||e==null)continue
if(i)q.$2(e,"game_seis_burro")
f=!j
if(f&&g.b===12)q.$2(e,"game_truco_12")
if(m.f)q.$2(e,"game_iron_hand")
for(d=m.d,c=m.b,r=0;r<4;++r){if(((r&1)===0?B.b:B.c)!==e)continue
if(f&&J.Q(o.l(0,r),B.F))a6.l(0,r).k(0,"game_ace_river")
b=c.length
if(b!==4)continue
if(!(r<b))return A.c(c,r)
a=c[r]
if(a.length===3&&B.a.aN(a,new A.dD()))a6.l(0,r).k(0,"game_666")
b=A.dY(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.C)(a),++a1){a2=a[a1]
if(a8.D(a2,d)>=10){a3=a8.D(a2,d)-10
if(!(a3>=0&&a3<4))return A.c(B.p,a3)
b.k(0,B.p[a3])}}for(a0=B.a7.gJ(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.bo(a3.b))a6.l(0,r).k(0,a4)}}break A}if(g instanceof A.aV){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.U(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dE:function dE(a){this.a=a},
dD:function dD(){},
f6(a){var s
A:{if(a instanceof A.E){s=A.J(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.ga3())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.H){s=A.cr(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.F){s=A.cr(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.M){s=A.cr(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
f5(a){var s,r,q=a.l(0,"s")
q.toString
A.a1(q)
s=a.l(0,"t")
A:{if("play"===s){r=a.l(0,"c")
r.toString
q=new A.E(A.fB(A.a5(r)),J.Q(a.l(0,"x"),!0),q)
break A}if("raise"===s){q=new A.H(q)
break A}if("accept"===s){q=new A.F(q)
break A}if("fold"===s){q=new A.M(q)
break A}q=A.aO(A.bo("unknown action "+A.q(a.l(0,"t"))))}return q},
ci:function ci(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$
_.w=g
_.x=0},
ay:function ay(a,b){this.a=a
this.b=b},
dp:function dp(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
h3(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bH(b3,b4),b0=new A.de(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
A:{if(B.f===b2){s=b3.ch
s=((s.a&1)===0?B.b:B.c)!==b1&&s.c!==b4&&b6.$1(b4)
break A}if(B.e===b2){s=b3.CW===b1&&b6.$1(b4)
break A}s=!1
break A}r=b3.r
q=b3.as
p=b3.e
o=B.d.C(b3.at+3,4)
n=b3.f
m=b3.y
l=b3.gal()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.eq(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.D(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cE(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.D(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.gV()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.c(a2,a5)
a6=A.b_(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gaq()
a2=a9.gaR()
a3=b3.gaj()
a7=b3.aK(b4)
a8=b3.r===B.i&&b3.as===b4
return new A.b9(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,A.eq(b7.a,g,t.N),b7.bC(b1),b7.d,b5)},
b3:function b3(a,b,c){this.a=a
this.b=b
this.c=c},
cE:function cE(a,b,c){this.a=a
this.b=b
this.c=c},
b9:function b9(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
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
de:function de(a){this.a=a},
dd:function dd(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
bo(a){return new A.ch(a)},
h4(a,b,c){var s,r,q,p,o=A.cr([B.b,0,B.c,0],t.H,t.S),n=A.e([],t.A),m=t.cm,l=J.dU(4,m)
for(s=t.Y,r=0;r<4;++r)l[r]=A.e([],s)
q=J.dU(4,m)
for(r=0;r<4;++r)q[r]=A.e([],s)
m=A.e([],t.d2)
s=A.e([],t.c5)
p=new A.cT()
p.b0(c)
o=new A.dk(b,p,o,n,B.d.C(a+3,4),B.n,l,q,m,s)
o.a9()
return o},
h5(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.E
r=!1
if(s){r=b instanceof A.E
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.L(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.H){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.H
q=a}else q=o
if(r){r=s?p:b
t.aN.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.F){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.F
q=a}else q=o
if(r){r=s?p:b
t.l.a(r)
r=q.a===r.a
break A}r=!1
if(a instanceof A.M){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.M
q=a}else q=o
if(r){r=s?p:b
t.k.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
ig(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.C)(a),++r)q.push(a[r].b)
return A.fb(q)},
fb(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.ai
if(q>=2)return B.aj
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.ae(n)
if(l&&m!=null)return new A.ae(m)}if(s===3){if(2>=s)return A.c(a,2)
s=a[2]
return new A.ae(s==null?a[0]:s)}return null},
aj:function aj(a,b){this.a=a
this.b=b},
V:function V(){},
E:function E(a,b,c){this.b=a
this.c=b
this.a=c},
H:function H(a){this.a=a},
F:function F(a){this.a=a},
M:function M(a){this.a=a},
N:function N(){},
aW:function aW(a,b,c,d){var _=this
_.b=a
_.d=b
_.e=c
_.f=d},
aT:function aT(a,b){this.a=a
this.b=b},
aS:function aS(a,b,c){this.a=a
this.b=b
this.c=c},
b4:function b4(a,b,c){this.a=a
this.b=b
this.c=c},
bJ:function bJ(a){this.a=a},
au:function au(a,b){this.a=a
this.b=b},
b6:function b6(a){this.a=a},
al:function al(a,b){this.a=a
this.b=b},
aV:function aV(a){this.a=a},
Z:function Z(a,b,c){this.a=a
this.b=b
this.c=c},
bK:function bK(a,b,c){this.a=a
this.b=b
this.c=c},
cB:function cB(a,b,c){this.a=a
this.b=b
this.c=c},
ch:function ch(a){this.a=a},
dk:function dk(a,b,c,d,e,f,g,h,i,j){var _=this
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
_.db=null},
dn:function dn(a){this.a=a},
dl:function dl(a,b){this.a=a
this.b=b},
dm:function dm(){},
bH:function bH(a,b){this.a=a
this.b=b},
A:function A(a,b){this.a=a
this.b=b},
is(b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=null,a9=t.f,b0=t.N,b1=t.X,b2=a9.a(B.E.bp(b4,a8)).G(0,b0,b1),b3=J.aQ(b2,"rules")
b3.toString
b3=a9.a(b3).G(0,b0,b1)
h=A.fJ(B.a_,t.aJ).l(0,b3.l(0,"manilhas"))
g=A.c7(b3.l(0,"coberta"))
f=A.c7(b3.l(0,"ferro"))
e=A.c7(b3.l(0,"verNoTruco"))
d=A.c7(b3.l(0,"verNaMaoDeOnze"))
c=A.c7(b3.l(0,"terceiraCarta"))
b=A.dA(b3.l(0,"tempo"))
b=b==null?a8:B.o.aS(b)
b3=A.dA(b3.l(0,"lento"))
b3=b3==null?a8:B.o.aS(b3)
if(h==null)h=B.y
if(b==null)b=20
if(b3==null)b3=0
b3=new A.dp("paulista","Truco",h,B.a4,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b,b3)
b=J.aQ(b2,"seed")
b.toString
A.a1(b)
c=J.aQ(b2,"firstDealer")
c.toString
A.a1(c)
d=A.e([],t.cG)
h=J.aQ(b2,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.h
a=0
for(;a<h.length;h.length===g||(0,A.C)(h),++a){a0=h[a]
d.push(a0==null?a8:A.fK(B.a0,A.a5(a0),f))}h=t.d
g=A.e([],h)
f=t.V.a(J.aQ(b2,"log"))
if(f==null)f=B.a3
e=f.length
a=0
for(;a<f.length;f.length===e||(0,A.C)(f),++a)g.push(a9.a(f[a]).G(0,b0,b1))
f=t.S
e=A.cr([B.b,0,B.c,0],t.H,f)
a1=A.D(d,t.ch)
a2=new A.ci(b3,b,c,a1,A.e([],h),B.R,new A.dd(A.J(f,b0),e))
a2.b_(d,c,g,a8,b3,b)
s=a2
r=null
q=null
b3=t.a5.a(J.aQ(b2,"act"))
p=b3==null?a8:b3.G(0,b0,b1)
try{if(J.Q(J.aQ(b2,"timeout"),!0)){a9=s
a3=a9.gaU()
if(a3==null)A.aO(A.bo("nobody to wait for"))
b1=a9.f
b3=a9.r
b3===$&&A.aP()
a4=a9.ai(a3,new A.cI(B.B,b1).aM(new A.bH(b3,a3)))}else if(p==null){a9=s
a5=A.J(f,t.Q)
a9.aB(a5)
if(a5.a===0)a9.a0(a5,0)
a4=a5}else{b3=s
h=p.l(0,"seat")
h.toString
A.a1(h)
g=p.l(0,"action")
g.toString
g=t.G.a(a9.a(g).G(0,b0,b1))
if(J.Q(g.l(0,"t"),"blind")){a9=g.l(0,"i")
a9.toString
A.a1(a9)
b1=b3.r
b1===$&&A.aP()
b1=b1.w
if(!(h>=0&&h<b1.length))return A.c(b1,h)
a6=A.D(b1[h],t.L)
if(a9<0||a9>=a6.length)A.aO(A.bo("no card "+a9))
if(!(a9>=0&&a9<a6.length))return A.c(a6,a9)
a9=b3.ai(h,new A.E(a6[a9],!1,h))}else{a9=A.ew(b0,b1)
a9.a1(0,g)
a9.i(0,"s",h)
a9=b3.ai(h,A.f5(a9))}a4=a9}o=a4
n=A.J(f,t.W)
for(a9=o,a9=new A.a9(a9,A.j(a9).h("a9<1,2>")).gq(0);a9.n();){b1=a9.d
b1.toString
m=b1
b1=m.a
l=[]
for(b3=m.b,h=b3.length,a=0;a<b3.length;b3.length===h||(0,A.C)(b3),++a){k=b3[a]
J.ej(l,k.M())}J.fs(n,b1,l)}r=n}catch(a7){n=A.eg(a7)
if(n instanceof A.ch){j=n
q=j.a
r=B.G}else{i=n
q=A.q(i)
r=B.G}}n=s.r
n===$&&A.aP()
l=t.K
a9=A.J(b0,l)
a9.i(0,"log",s.e)
b1=A.J(b0,t.W)
for(b3=r.gJ(),b3=b3.gq(b3);b3.n();){h=b3.gp()
b1.i(0,""+h.a,h.b)}a9.i(0,"frames",b1)
a9.i(0,"phase",n.r.b)
b1=n.db
if(b1!=null)a9.i(0,"winner",b1.b)
b1=n.c
a9.i(0,"scores",A.e([b1.l(0,B.b),b1.l(0,B.c)],t.c))
b1=s.gaU()
if(b1!=null)a9.i(0,"waitingFor",b1)
b1=A.e([],t.B)
for(b3=n.d,h=B.a.gq(b3),g=new A.aD(h,t.ca),f=t.q;g.n();){e=f.a(h.gp())
d=A.J(b0,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b1.push(d)}a9.i(0,"hands",b1)
if(n.r===B.v){l=A.J(b0,t.aY)
for(n=A.ib(b3,n.a),n=new A.a9(n,A.j(n).h("a9<1,2>")).gq(0);n.n();){m=n.d
b0=m.b
if(b0.gv(b0)){b1=m.a
b0=A.aZ(b0,A.j(b0).c)
l.i(0,""+b1,b0)}}a9.i(0,"feats",l)}n=q
if(n!=null)a9.i(0,"error",n)
return B.E.br(a9,a8)},
ip(){var s,r=v.G.globalThis,q=new A.dN()
if(typeof q=="function")A.aO(A.cX("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hA,q)
s[$.eh()]=q
r.trucoEngine=s},
dN:function dN(){},
fe(a){return v.mangledGlobalNames[a]},
iu(a){throw A.B(new A.aY("Field '"+a+"' has been assigned during initialization."),new Error())},
aP(){throw A.B(A.fU(""),new Error())},
iv(){throw A.B(A.fT(""),new Error())},
hA(a,b,c){t.Z.a(a)
if(A.a1(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.dV.prototype={}
J.ck.prototype={
L(a,b){return a===b},
gu(a){return A.bI(a)},
j(a){return"Instance of '"+A.cD(a)+"'"},
gB(a){return A.aJ(A.e6(this))}}
J.cn.prototype={
j(a){return String(a)},
gu(a){return a?519018:218159},
gB(a){return A.aJ(t.y)},
$in:1,
$it:1}
J.bq.prototype={
L(a,b){return null==b},
j(a){return"null"},
gu(a){return 0},
$in:1}
J.bs.prototype={$iw:1}
J.an.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.cC.prototype={}
J.ba.prototype={}
J.am.prototype={
j(a){var s=a[$.fg()]
if(s==null)s=a[$.eh()]
if(s==null)return this.aZ(a)
return"JavaScript function for "+J.c8(s)},
$iav:1}
J.br.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.bt.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.h.prototype={
k(a,b){A.K(a).c.a(b)
a.$flags&1&&A.bi(a,29)
a.push(b)},
bB(a,b){var s
a.$flags&1&&A.bi(a,"remove",1)
for(s=0;s<a.length;++s)if(J.Q(a[s],b)){a.splice(s,1)
return!0}return!1},
P(a){a.$flags&1&&A.bi(a,"clear","clear")
a.length=0},
aO(a,b){var s,r,q
A.K(a).h("t(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.a4(a))}throw A.d(A.cl())},
I(a,b){if(!(b<a.length))return A.c(a,b)
return a[b]},
aY(a,b,c){var s=a.length
if(b>s)throw A.d(A.aA(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aA(c,b,s,"end",null))
if(b===c)return A.e([],A.K(a))
return A.e(a.slice(b,c),A.K(a))},
gR(a){if(a.length>0)return a[0]
throw A.d(A.cl())},
gbA(a){var s=a.length
if(s>0)return a[s-1]
throw A.d(A.cl())},
gY(a){var s=a.length
if(s===1){if(0>=s)return A.c(a,0)
return a[0]}if(s===0)throw A.d(A.cl())
throw A.d(A.es())},
a2(a,b){var s,r
A.K(a).h("t(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.a4(a))}return!1},
aN(a,b){var s,r
A.K(a).h("t(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.a4(a))}return!0},
aX(a){var s,r,q,p,o,n
a.$flags&2&&A.bi(a,"sort")
s=a.length
if(s<2)return
if(s===2){r=a[0]
q=a[1]
p=J.eu(r,q)
if(typeof p!=="number")return p.bH()
if(p>0){a[0]=q
a[1]=r}return}o=0
if(A.K(a).c.b(null))for(n=0;n<a.length;++n)if(a[n]===void 0){a[n]=null;++o}a.sort(A.i5(J.hK(),2))
if(o>0)this.bh(a,o)},
bh(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
av(a,b){var s,r,q,p
a.$flags&2&&A.bi(a,"shuffle")
s=a.length
while(s>1){r=b.a6(s);--s
q=a.length
if(!(s<q))return A.c(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.c(a,r)
a[s]=a[r]
a[r]=p}},
a4(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.c(a,s)
if(J.Q(a[s],b))return s}return-1},
U(a,b){var s
for(s=0;s<a.length;++s)if(J.Q(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gv(a){return a.length!==0},
j(a){return A.dT(a,"[","]")},
gq(a){return new J.ar(a,a.length,A.K(a).h("ar<1>"))},
gu(a){return A.bI(a)},
gm(a){return a.length},
i(a,b,c){A.K(a).c.a(c)
a.$flags&2&&A.bi(a)
if(!(b>=0&&b<a.length))throw A.d(A.f9(a,b))
a[b]=c},
$if:1,
$ib:1,
$ii:1}
J.cm.prototype={
bD(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cD(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.d2.prototype={}
J.ar.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.C(q)
throw A.d(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iv:1}
J.aX.prototype={
aL(a,b){var s
A.eW(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gao(b)
if(this.gao(a)===s)return 0
if(this.gao(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gao(a){return a===0?1/a<0:a<0},
aS(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.cL(""+a+".toInt()"))},
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
O(a,b){return(a|0)===a?a/b|0:this.bl(a,b)},
bl(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.cL("Result of truncating division is "+A.q(s)+": "+A.q(a)+" ~/ "+b))},
aI(a,b){var s
if(a>0)s=this.bj(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bj(a,b){return b>31?0:a>>>b},
gB(a){return A.aJ(t.o)},
$ia8:1,
$ik:1,
$iP:1}
J.bp.prototype={
gB(a){return A.aJ(t.S)},
$in:1,
$ia:1}
J.co.prototype={
gB(a){return A.aJ(t.i)},
$in:1}
J.aw.prototype={
W(a,b,c){return a.substring(b,A.h_(b,c,a.length))},
aL(a,b){var s
A.a5(b)
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
gB(a){return A.aJ(t.N)},
gm(a){return a.length},
$in:1,
$ia8:1,
$il:1}
A.bb.prototype={
gq(a){var s=this.a
return new A.bj(s.gq(s),A.j(this).h("bj<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
j(a){return this.a.j(0)}}
A.bj.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iv:1}
A.as.prototype={}
A.bS.prototype={$if:1}
A.at.prototype={
G(a,b,c){return new A.at(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("at<1,2,3,4>"))},
l(a,b){return this.$ti.h("4?").a(this.a.l(0,b))},
E(a,b){this.a.E(0,new A.d0(this,this.$ti.h("~(3,4)").a(b)))},
gF(){var s=this.$ti
return A.fC(this.a.gF(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gJ(){return this.a.gJ().ap(0,new A.d_(this),this.$ti.h("x<3,4>"))}}
A.d0.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d_.prototype={
$1(a){var s=this.a.$ti
s.h("x<1,2>").a(a)
return new A.x(s.y[2].a(a.a),s.y[3].a(a.b),s.h("x<3,4>"))},
$S(){return this.a.$ti.h("x<3,4>(x<1,2>)")}}
A.aY.prototype={
j(a){return"LateInitializationError: "+this.a}}
A.dc.prototype={}
A.f.prototype={}
A.O.prototype={
gq(a){var s=this
return new A.ax(s,s.gm(s),A.j(s).h("ax<O.E>"))},
gt(a){return this.gm(this)===0},
ap(a,b,c){var s=A.j(this)
return new A.ab(this,s.A(c).h("1(O.E)").a(b),s.h("@<O.E>").A(c).h("ab<1,2>"))},
aT(a){var s,r=this,q=A.ex(A.j(r).h("O.E"))
for(s=0;s<r.gm(r);++s)q.k(0,r.I(0,s))
return q}}
A.bN.prototype={
gba(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbk(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
I(a,b){var s=this,r=s.gbk()+b,q=s.gba()
if(r>=q)throw A.d(A.dS(b,s.gm(0),s,"index"))
return J.ek(s.a,r)}}
A.ax.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dF(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.a4(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.I(q,s);++r.c
return!0},
$iv:1}
A.az.prototype={
gq(a){return new A.bA(J.ag(this.a),this.b,A.j(this).h("bA<1,2>"))},
gm(a){return J.cW(this.a)},
gt(a){return J.fu(this.a)}}
A.bn.prototype={$if:1}
A.bA.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iv:1}
A.ab.prototype={
gm(a){return J.cW(this.a)},
I(a,b){return this.b.$1(J.ek(this.a,b))}}
A.ad.prototype={
gq(a){return new A.bQ(J.ag(this.a),this.b,this.$ti.h("bQ<1>"))}}
A.bQ.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iv:1}
A.bR.prototype={
gq(a){return new A.aD(J.ag(this.a),this.$ti.h("aD<1>"))}}
A.aD.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iv:1}
A.r.prototype={
sm(a,b){throw A.d(A.cL("Cannot change the length of a fixed-length list"))},
k(a,b){A.aL(a).h("r.E").a(b)
throw A.d(A.cL("Cannot add to a fixed-length list"))}}
A.ae.prototype={$r:"+winner(1)",$s:1}
A.af.prototype={$r:"+(1,2)",$s:2}
A.bZ.prototype={$r:"+points,winner(1,2)",$s:3}
A.bl.prototype={}
A.bk.prototype={
G(a,b,c){var s=A.j(this)
return A.ey(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
j(a){return A.dZ(this)},
gJ(){return new A.bd(this.bt(),A.j(this).h("bd<x<1,2>>"))},
bt(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gJ(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gF(),o=o.gq(o),n=A.j(s),m=n.y[1],n=n.h("x<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.l(0,l)
r=4
return a.b=new A.x(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iz:1}
A.X.prototype={
gm(a){return this.b.length},
gaF(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
ak(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
l(a,b){if(!this.ak(b))return null
return this.b[this.a[b]]},
E(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaF()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gF(){return new A.bT(this.gaF(),this.$ti.h("bT<1>"))}}
A.bT.prototype={
gm(a){return this.a.length},
gt(a){return 0===this.a.length},
gv(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.aE(s,s.length,this.$ti.h("aE<1>"))}}
A.aE.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iv:1}
A.bm.prototype={
k(a,b){A.j(this).c.a(b)
A.fI()}}
A.ak.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gv(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aE(s,s.length,this.$ti.h("aE<1>"))},
bd(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.bu(o.$ti.h("bu<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.C)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
U(a,b){return this.bd().ak(b)}}
A.bL.prototype={}
A.dq.prototype={
K(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.bG.prototype={
j(a){return"Null check operator used on a null value"}}
A.cp.prototype={
j(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cK.prototype={
j(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.db.prototype={
j(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.ai.prototype={
j(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.ff(r==null?"unknown":r)+"'"},
$iav:1,
gbG(){return this},
$C:"$1",
$R:1,
$D:null}
A.cb.prototype={$C:"$0",$R:0}
A.cc.prototype={$C:"$2",$R:2}
A.cH.prototype={}
A.cG.prototype={
j(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.ff(s)+"'"}}
A.aR.prototype={
L(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aR))return!1
return this.$_target===b.$_target&&this.a===b.a},
gu(a){return(A.ef(this.a)^A.bI(this.$_target))>>>0},
j(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cD(this.a)+"'")}}
A.cF.prototype={
j(a){return"RuntimeError: "+this.a}}
A.Y.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
gF(){return new A.aa(this,A.j(this).h("aa<1>"))},
gJ(){return new A.a9(this,A.j(this).h("a9<1,2>"))},
ak(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bv(a)},
bv(a){var s=this.d
if(s==null)return!1
return this.a5(this.aE(s,a),a)>=0},
a1(a,b){A.j(this).h("z<1,2>").a(b).E(0,new A.d3(this))},
l(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bw(b)},
bw(a){var s,r,q=this.d
if(q==null)return null
s=this.aE(q,a)
r=this.a5(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.j(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.az(s==null?q.b=q.ag():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.az(r==null?q.c=q.ag():r,b,c)}else q.bx(b,c)},
bx(a,b){var s,r,q,p,o=this,n=A.j(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ag()
r=o.am(a)
q=s[r]
if(q==null)s[r]=[o.aa(a,b)]
else{p=o.a5(q,a)
if(p>=0)q[p].b=b
else q.push(o.aa(a,b))}},
P(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aG()}},
E(a,b){var s,r,q=this
A.j(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.a4(q))
s=s.c}},
az(a,b,c){var s,r=A.j(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.aa(b,c)
else s.b=c},
aG(){this.r=this.r+1&1073741823},
aa(a,b){var s=this,r=A.j(s),q=new A.d7(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aG()
return q},
am(a){return J.a7(a)&1073741823},
aE(a,b){return a[this.am(b)]},
a5(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.Q(a[r].a,b))return r
return-1},
j(a){return A.dZ(this)},
ag(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$idX:1}
A.d3.prototype={
$2(a,b){var s=this.a,r=A.j(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.j(this.a).h("~(1,2)")}}
A.d7.prototype={}
A.aa.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bx(s,s.r,s.e,this.$ti.h("bx<1>"))}}
A.bx.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a4(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iv:1}
A.bz.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.by(s,s.r,s.e,this.$ti.h("by<1>"))}}
A.by.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a4(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iv:1}
A.a9.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bw(s,s.r,s.e,this.$ti.h("bw<1,2>"))}}
A.bw.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.a4(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.x(s.a,s.b,r.$ti.h("x<1,2>"))
r.c=s.c
return!0}},
$iv:1}
A.bu.prototype={
am(a){return A.i4(a)&1073741823},
a5(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.Q(a[r].a,b))return r
return-1}}
A.dJ.prototype={
$1(a){return this.a(a)},
$S:1}
A.dK.prototype={
$2(a,b){return this.a(a,b)},
$S:5}
A.dL.prototype={
$1(a){return this.a(A.a5(a))},
$S:6}
A.a0.prototype={
j(a){return this.aJ(!1)},
aJ(a){var s,r,q,p,o,n=this.bb(),m=this.af(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.c(m,q)
o=m[q]
l=a?l+A.eB(o):l+A.q(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
bb(){var s,r=this.$s
while($.dx.length<=r)B.a.k($.dx,null)
s=$.dx[r]
if(s==null){s=this.b7()
B.a.i($.dx,r,s)}return s},
b7(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.dU(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.D(j,k)}}
A.aH.prototype={
af(){return[this.a,this.b]},
L(a,b){if(b==null)return!1
return b instanceof A.aH&&this.$s===b.$s&&J.Q(this.a,b.a)&&J.Q(this.b,b.b)},
gu(a){return A.ez(this.$s,this.a,this.b,B.h)}}
A.bc.prototype={
af(){return[this.a]},
L(a,b){if(b==null)return!1
return b instanceof A.bc&&this.$s===b.$s&&J.Q(this.a,b.a)},
gu(a){return A.ez(this.$s,this.a,B.h,B.h)}}
A.b1.prototype={
gB(a){return B.ao},
$in:1}
A.bD.prototype={}
A.cs.prototype={
gB(a){return B.ap},
$in:1}
A.b2.prototype={
gm(a){return a.length},
$iR:1}
A.bB.prototype={$if:1,$ib:1,$ii:1}
A.bC.prototype={$if:1,$ib:1,$ii:1}
A.ct.prototype={
gB(a){return B.aq},
$in:1}
A.cu.prototype={
gB(a){return B.ar},
$in:1}
A.cv.prototype={
gB(a){return B.as},
$in:1}
A.cw.prototype={
gB(a){return B.at},
$in:1}
A.cx.prototype={
gB(a){return B.au},
$in:1}
A.cy.prototype={
gB(a){return B.aw},
$in:1}
A.cz.prototype={
gB(a){return B.ax},
$in:1}
A.bE.prototype={
gB(a){return B.ay},
gm(a){return a.length},
$in:1}
A.cA.prototype={
gB(a){return B.az},
gm(a){return a.length},
$in:1}
A.bV.prototype={}
A.bW.prototype={}
A.bX.prototype={}
A.bY.prototype={}
A.a_.prototype={
h(a){return A.c5(v.typeUniverse,this,a)},
A(a){return A.eT(v.typeUniverse,this,a)}}
A.cO.prototype={}
A.cU.prototype={
j(a){return A.T(this.a,null)}}
A.cN.prototype={
j(a){return this.a}}
A.c1.prototype={}
A.c0.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bi(a,b){var s,r,q
a=A.a1(a)
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
o.d=null}q=o.bi(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.eN
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
o.a=A.eN
throw n
return!1}if(0>=p.length)return A.c(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eF("sync*"))}return!1},
bI(a){var s,r,q=this
if(a instanceof A.bd){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.ag(a)
return 2}},
$iv:1}
A.bd.prototype={
gq(a){return new A.c0(this.a(),this.$ti.h("c0<1>"))}}
A.aF.prototype={
gq(a){var s=this,r=new A.bU(s,s.r,A.j(s).h("bU<1>"))
r.c=s.e
return r},
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
U(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.g.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.g.a(r[b])!=null}else return this.b8(b)},
b8(a){var s=this.d
if(s==null)return!1
return this.aD(s[this.aC(a)],a)>=0},
k(a,b){var s,r,q=this
A.j(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aA(s==null?q.b=A.e3():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aA(r==null?q.c=A.e3():r,b)}else return q.b2(b)},
b2(a){var s,r,q,p=this
A.j(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.e3()
r=p.aC(a)
q=s[r]
if(q==null)s[r]=[p.ah(a)]
else{if(p.aD(q,a)>=0)return!1
q.push(p.ah(a))}return!0},
aA(a,b){A.j(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.ah(b)
return!0},
ah(a){var s=this,r=new A.cS(A.j(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
aC(a){return J.a7(a)&1073741823},
aD(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.Q(a[r].a,b))return r
return-1}}
A.cS.prototype={}
A.bU.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.a4(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$iv:1}
A.d8.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:7}
A.p.prototype={
gq(a){return new A.ax(a,a.length,A.aL(a).h("ax<p.E>"))},
I(a,b){if(!(b<a.length))return A.c(a,b)
return a[b]},
gt(a){return a.length===0},
gv(a){return a.length!==0},
k(a,b){var s
A.aL(a).h("p.E").a(b)
s=a.length
this.sm(a,s+1)
if(!(s<a.length))return A.c(a,s)
a[s]=b},
j(a){return A.dT(a,"[","]")}}
A.o.prototype={
G(a,b,c){var s=A.j(this)
return A.ey(this,s.h("o.K"),s.h("o.V"),b,c)},
E(a,b){var s,r,q,p=A.j(this)
p.h("~(o.K,o.V)").a(b)
for(s=this.gF(),s=s.gq(s),p=p.h("o.V");s.n();){r=s.gp()
q=this.l(0,r)
b.$2(r,q==null?p.a(q):q)}},
gJ(){return this.gF().ap(0,new A.d9(this),A.j(this).h("x<o.K,o.V>"))},
gm(a){var s=this.gF()
return s.gm(s)},
gt(a){var s=this.gF()
return s.gt(s)},
gv(a){var s=this.gF()
return s.gv(s)},
j(a){return A.dZ(this)},
$iz:1}
A.d9.prototype={
$1(a){var s=this.a,r=A.j(s)
r.h("o.K").a(a)
s=s.l(0,a)
if(s==null)s=r.h("o.V").a(s)
return new A.x(a,s,r.h("x<o.K,o.V>"))},
$S(){return A.j(this.a).h("x<o.K,o.V>(o.K)")}}
A.da.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.q(a)
r.a=(r.a+=s)+": "
s=A.q(b)
r.a+=s},
$S:2}
A.c6.prototype={}
A.b0.prototype={
G(a,b,c){return this.a.G(0,b,c)},
l(a,b){return this.a.l(0,b)},
E(a,b){this.a.E(0,A.j(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gm(a){var s=this.a
return s.gm(s)},
j(a){return this.a.j(0)},
gJ(){return this.a.gJ()},
$iz:1}
A.aC.prototype={
G(a,b,c){return new A.aC(this.a.G(0,b,c),b.h("@<0>").A(c).h("aC<1,2>"))}}
A.ao.prototype={
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
a1(a,b){var s
for(s=J.ag(A.j(this).h("b<1>").a(b));s.n();)this.k(0,s.gp())},
bo(a){var s
for(s=a.gq(a);s.n();)if(!this.U(0,s.gp()))return!1
return!0},
gY(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.es())
s=r.gq(r)
if(!s.n())throw A.d(A.cl())
return s.gp()},
j(a){return A.dT(this,"{","}")},
$if:1,
$ib:1,
$iaB:1}
A.c_.prototype={}
A.be.prototype={}
A.cQ.prototype={
l(a,b){var s,r=this.b
if(r==null)return this.c.l(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bg(b):s}},
gm(a){return this.b==null?this.c.a:this.Z().length},
gt(a){return this.gm(0)===0},
gv(a){return this.gm(0)>0},
gF(){if(this.b==null){var s=this.c
return new A.aa(s,A.j(s).h("aa<1>"))}return new A.cR(this)},
E(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.E(0,b)
s=o.Z()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dB(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.a4(o))}},
Z(){var s=t.V.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
bg(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dB(this.a[a])
return this.b[a]=s}}
A.cR.prototype={
gm(a){return this.a.gm(0)},
I(a,b){var s=this.a
if(s.b==null)s=s.gF().I(0,b)
else{s=s.Z()
if(!(b<s.length))return A.c(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gF()
s=s.gq(s)}else{s=s.Z()
s=new J.ar(s,s.length,A.K(s).h("ar<1>"))}return s}}
A.cd.prototype={}
A.cf.prototype={}
A.bv.prototype={
j(a){var s=A.cg(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cq.prototype={
j(a){return"Cyclic error in JSON stringify"}}
A.d4.prototype={
bp(a,b){var s=A.hX(a,this.gbq().a)
return s},
br(a,b){var s=A.hb(a,this.gbs().b,null)
return s},
gbs(){return B.Z},
gbq(){return B.Y}}
A.d6.prototype={}
A.d5.prototype={}
A.dv.prototype={
aW(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.j.W(a,r,q)
r=q+1
o=A.G(92)
s.a+=o
o=A.G(117)
s.a+=o
o=A.G(100)
s.a+=o
o=p>>>8&15
o=A.G(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.G(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.G(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.j.W(a,r,q)
r=q+1
o=A.G(92)
s.a+=o
switch(p){case 8:o=A.G(98)
s.a+=o
break
case 9:o=A.G(116)
s.a+=o
break
case 10:o=A.G(110)
s.a+=o
break
case 12:o=A.G(102)
s.a+=o
break
case 13:o=A.G(114)
s.a+=o
break
default:o=A.G(117)
s.a+=o
o=A.G(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.G(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.G(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.j.W(a,r,q)
r=q+1
o=A.G(92)
s.a+=o
o=A.G(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.j.W(a,r,m)},
ab(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.d(new A.cq(a,null))}B.a.k(s,a)},
a8(a){var s,r,q,p,o=this
if(o.aV(a))return
o.ab(a)
try{s=o.b.$1(a)
if(!o.aV(s)){q=A.ev(a,null,o.gaH())
throw A.d(q)}q=o.a
if(0>=q.length)return A.c(q,-1)
q.pop()}catch(p){r=A.eg(p)
q=A.ev(a,r,o.gaH())
throw A.d(q)}},
aV(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.o.j(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.aW(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.ab(a)
q.bE(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.ab(a)
r=q.bF(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return r}else return!1},
bE(a){var s,r=this.c
r.a+="["
if(J.fv(a)){if(0>=a.length)return A.c(a,0)
this.a8(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.a8(a[s])}}r.a+="]"},
bF(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.fX(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.E(0,new A.dw(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.aW(A.a5(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.c(r,n)
m.a8(r[n])}p.a+="}"
return!0}}
A.dw.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:2}
A.du.prototype={
gaH(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cM.prototype={
j(a){return this.S()},
$iaU:1}
A.u.prototype={}
A.c9.prototype={
j(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cg(s)
return"Assertion failed"}}
A.bO.prototype={}
A.ah.prototype={
gae(){return"Invalid argument"+(!this.a?"(s)":"")},
gad(){return""},
j(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gae()+q+o
if(!s.a)return n
return n+s.gad()+": "+A.cg(s.gan())},
gan(){return this.b}}
A.b5.prototype={
gan(){return A.dA(this.b)},
gae(){return"RangeError"},
gad(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.q(q):""
else if(q==null)s=": Not greater than or equal to "+A.q(r)
else if(q>r)s=": Not in inclusive range "+A.q(r)+".."+A.q(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.q(r)
return s}}
A.cj.prototype={
gan(){return A.a1(this.b)},
gae(){return"RangeError"},
gad(){if(A.a1(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bP.prototype={
j(a){return"Unsupported operation: "+this.a}}
A.cJ.prototype={
j(a){return"UnimplementedError: "+this.a}}
A.b7.prototype={
j(a){return"Bad state: "+this.a}}
A.ce.prototype={
j(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cg(s)+"."}}
A.bM.prototype={
j(a){return"Stack Overflow"},
$iu:1}
A.ds.prototype={
j(a){return"Exception: "+this.a}}
A.d1.prototype={
j(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.b.prototype={
ap(a,b,c){var s=A.j(this)
return A.fZ(this,s.A(c).h("1(b.E)").a(b),s.h("b.E"),c)},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gv(a){return!this.gt(this)},
I(a,b){var s,r
A.e0(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.dS(b,b-r,this,"index"))},
j(a){return A.fQ(this,"(",")")}}
A.x.prototype={
j(a){return"MapEntry("+A.q(this.a)+": "+A.q(this.b)+")"}}
A.bF.prototype={
gu(a){return A.m.prototype.gu.call(this,0)},
j(a){return"null"}}
A.m.prototype={$im:1,
L(a,b){return this===b},
gu(a){return A.bI(this)},
j(a){return"Instance of '"+A.cD(this)+"'"},
gB(a){return A.id(this)},
toString(){return this.j(this)}}
A.b8.prototype={
gm(a){return this.a.length},
j(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ih1:1}
A.cP.prototype={
a6(a){if(a<=0||a>4294967296)throw A.d(A.eC(u.c+a))
return Math.random()*a>>>0},
H(){return Math.random()},
$ie_:1}
A.cT.prototype={
b0(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
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
a6(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.d(A.eC(u.c+a))
s=a-1
if((a&s)>>>0===0){p.N()
return(p.a&s)>>>0}do{p.N()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
H(){var s,r=this
r.N()
s=r.a
r.N()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$ie_:1}
A.a3.prototype={
S(){return"AiLevel."+this.b}}
A.cI.prototype={
aM(a){var s,r,q=this,p=a.a,o=a.b,n=p.aQ(o)
if(n.length===0)throw A.d(A.eF("no legal action for "+o))
if(p.cx){p=t.db
s=new A.ad(new A.bR(n,p),p.h("t(b.E)").a(new A.di()),p.h("ad<b.E>"))
return s.I(0,q.b.a6(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.b9(a)
break A}if(B.f===r){p=q.b3(a,n)
break A}p=q.be(a,n)
break A}return p},
ga_(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
b9(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.l){s=a.b
return l.b.H()<0.6?new A.F(s):new A.M(s)}r=l.a7(a,l.ga_())
s=a.a
q=s.a
p=q.f
o=B.a.gR(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.l(0,m)
m.toString
if(m+o>=q.r)return new A.F(n)
return r>(p-o)/(2*p)+l.X(0.08)?new A.F(n):new A.M(n)},
b3(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.a2(t.U.a(b),new A.df()),g=i.a
if(g===B.l){s=i.b.H()
if(h&&s<0.05)return new A.H(a.b)
g=a.b
return s<0.65?new A.F(g):new A.M(g)}r=a.a
q=r.ch
q.toString
p=r.a
o=p.d
n=r.ax
if(!(n<5))return A.c(o,n)
m=o[n]
q=q.b
if(!(q<5))return A.c(o,q)
l=o[q]
q=i.a7(a,i.ga_())
g=g===B.m
k=q-(g?0:0.08)
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.l(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.H(q):new A.F(q)
if(h&&k>0.78+i.X(0.05))return new A.H(q)
j=g&&i.b.H()<0.06
return(2*k-1)*l>-m+i.X(0.3)||j?new A.F(q):new A.M(q)},
be(a,b){t.U.a(b)
if(B.a.a2(b,new A.dg())&&this.bm(a))return new A.H(a.b)
return this.b6(a,b)},
bm(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.l(0,q)
q.toString
if(q+p.gal()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.H()<0.08
case 1:return r.a7(a,r.ga_())>0.72+r.X(0.06)||r.b.H()<0.03
case 2:s=r.a7(a,r.ga_())
if(s>0.9&&a.gV().length>1&&r.b.H()<0.8)return!1
if(s>0.62+r.X(0.03))return!0
return A.D(p.z,t.F).length!==0&&s<0.3&&r.b.H()<0.04}},
X(a){return(this.b.H()*2-1)*a},
b6(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.gV()
r=f.a
if(r===B.l&&f.b.H()<0.55){r=s.length
q=f.b.a6(r)
if(!(q>=0&&q<r))return A.c(s,q)
return new A.E(s[q],!1,a.b)}r=r===B.m
if(r&&s.length>1)p=f.b4(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.D(s[l],n.y))
k=A.e([],t.w)
for(j=A.D(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.D(h.b,n.y)
k.push(new A.af(h.a,g))}m=A.e([],t.v)
for(n=A.D(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.eb(q,k,m,a.b)
if(!(q>=0&&q<o))return A.c(s,q)
p=s[q]}if(r&&a.a.gaj()&&!f.bn(a,p)&&f.b.H()<0.5)return new A.E(p,!0,a.b)
return new A.E(p,!1,a.b)},
bn(a,b){var s=a.a,r=s.a.D(b,s.y)
return B.a.aN(A.D(s.Q,t.n),new A.dh(a,r))},
b4(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.gV(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.D(e[p],r.y))
o=A.e([],t.w)
for(n=A.D(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.D(l.b,r.y)
o.push(new A.af(l.a,k))}q=A.e([],t.v)
for(r=A.D(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.eb(d,o,q,a.b)
if(!(d>=0&&d<s))return A.c(e,d)
j=e[d]
i=this.au(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.L(0,j))continue
f=this.au(a,g,160)
if(f>i){i=f
h=g}}return h},
au(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbz()
r=A.e([],t.Y)
for(q=$.ei(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.U(0,n))r.push(n)}q=b8.b
m=B.d.C(q+2,4)
l=b8.gaq()
if(this.a===B.m){p=b8.a
k=p.ch
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ay
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.av(r,b)
a5.a=0
a6=A.fY(4,new A.dj(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.C(a0,4),B.d.C(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.c(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.b_(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.D(b4.b,p.y)
a8.push(new A.af(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.b_(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.it(a8,j?null:new A.af(q,k.D(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
a7(a,b){return this.au(a,null,b)}}
A.di.prototype={
$1(a){return!t.D.a(a).c},
$S:8}
A.df.prototype={
$1(a){return t.J.a(a) instanceof A.H},
$S:0}
A.dg.prototype={
$1(a){return t.J.a(a) instanceof A.H},
$S:0}
A.dh.prototype={
$1(a){return this.a.a.aw(t.n.a(a))<this.b},
$S:3}
A.dj.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.gV(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.D(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.w:s}else n=B.w
i=i.a
s=i.w
if(!(a<s.length))return A.c(s,a)
m=A.D(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.C)(n),++o)s.push(q.D(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.c(r,k)
s.push(q.D(r[k],i.y))}p.a+=m
return s},
$S:9}
A.dP.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:10}
A.dQ.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:11}
A.dI.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o<s[q])q=p}return q},
$S:4}
A.dH.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o>s[q])q=p}return q},
$S:4}
A.S.prototype={
S(){return"Suit."+this.b}}
A.I.prototype={
S(){return"Rank."+this.b}}
A.L.prototype={
ga3(){var s=this.b.b
if(0>=s.length)return A.c(s,0)
return this.a.c+s[0]},
L(a,b){if(b==null)return!1
return b instanceof A.L&&b.a===this.a&&b.b===this.b},
gu(a){return this.a.a*4+this.b.a},
j(a){return this.ga3()}}
A.cY.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.j.W(s,0,s.length-1)},
$S:12}
A.cZ.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.c(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.c(s,q)
return p===s[q]},
$S:13}
A.dE.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.l(0,r).k(0,b)},
$S:14}
A.dD.prototype={
$1(a){return t.L.a(a).a===B.J},
$S:15}
A.ci.prototype={
b_(a,b,c,d,e,f){var s,r,q,p,o,n=this,m=A.h4(n.c,n.a,n.b)
n.r!==$&&A.iv()
n.r=m
for(s=c.length,r=n.e,q=t.G,p=0;p<c.length;c.length===s||(0,A.C)(c),++p){o=q.a(c[p])
if(J.Q(o.l(0,"t"),"next"))m.a9()
else m.T(A.f5(o))
B.a.k(r,o)}m=m.d
n.w.T(m)
n.x=m.length},
by(a){var s
A.a1(a)
s=this.d
if(!(a>=0&&a<s.length))return A.c(s,a)
return s[a]==null},
gbu(){var s,r,q,p=A.e([],t.t)
for(s=this.d,r=s.length,q=0;q<4;++q){if(!(q<r))return A.c(s,q)
if(s[q]==null)p.push(q)}return p},
ai(a,b){var s,r=this,q=r.d
if(!(a>=0&&a<q.length))return A.c(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.bo("seat "+a+" is not a person"))
q=r.r
q===$&&A.aP()
q.T(b)
B.a.k(r.e,A.f6(b))
s=A.J(t.S,t.Q)
r.a0(s,0)
r.aB(s)
return s},
gaU(){var s,r,q,p,o,n=this,m=null,l=n.r
l===$&&A.aP()
s=l.r
switch(s.a){case 1:l=l.as
s=n.d
if(!(l>=0&&l<s.length))return A.c(s,l)
if(!(s[l]==null))l=m
return l
case 2:case 0:if(s===B.e){r=l.CW
r.toString
q=r}else q=((l.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
p=l.gar()
if(p!=null){r=n.d
if(p>>>0!==p||p>=r.length)return A.c(r,p)
r=r[p]==null}else r=!1
if(r)return p
if(s===B.f&&l.ch.c!=null)return m
for(l=n.d,s=l.length,o=0;o<4;++o){if(((o&1)===0?B.b:B.c)===q){if(!(o<s))return A.c(l,o)
r=l[o]==null}else r=!1
if(r)return o}return m
case 3:case 4:return m}},
aB(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
t.p.a(a)
for(s=h.e,r=h.d,q=r.length,p=h.f,o=h.w;;){n=h.r
n===$&&A.aP()
m=n.r
if(m===B.v)return
if(m===B.n){n.a9()
B.a.k(s,B.a8)
h.a0(a,2200)
continue}l=h.b5()
if(l==null)return
k=o.e?1400:850
if(l>>>0!==l||l>=q)return A.c(r,l)
j=r[l]
j.toString
i=new A.cI(j,p).aM(new A.bH(n,l))
n.T(i)
B.a.k(s,A.f6(i))
h.a0(a,k)}},
b5(){var s,r,q,p,o=this,n=null,m=o.r
m===$&&A.aP()
s=m.r
switch(s.a){case 1:m=m.as
s=o.d
if(!(m>=0&&m<s.length))return A.c(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.f&&m.ch.c!=null){m=m.gar()
m.toString
s=o.d
if(!(m>=0&&m<s.length))return A.c(s,m)
if(s[m]==null)m=n
return m}s=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)s.push(p)
if(B.a.a2(s,o.gaP()))return n
return m.gar()
case 3:case 4:return n}},
a0(a,b){var s,r,q,p,o,n,m,l,k,j=this
t.p.a(a)
s=j.w
r=j.r
r===$&&A.aP()
q=r.d
s.T(A.h2(q,j.x,null,A.K(q).c))
j.x=r.d.length
for(q=j.gbu(),p=q.length,o=j.gaP(),n=t.bw,m=0;m<q.length;q.length===p||(0,A.C)(q),++m){l=q[m]
k=a.l(0,l)
if(k==null){k=A.e([],n)
a.i(0,l,k)}J.ej(k,A.h3(r,l,b,o,s))}}}
A.ay.prototype={
S(){return"ManilhaMode."+this.b}}
A.dp.prototype={
M(){var s,r=this,q=A.J(t.N,t.X)
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
case 1:s=B.a.a4(B.a5,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b3.prototype={
M(){var s,r=A.J(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.ga3())
if(this.c)r.i(0,"x",!0)
return r}}
A.cE.prototype={
M(){var s,r,q,p=A.J(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.C)(s),++q)o.push(s[q].M())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.b9.prototype={
M(){var s,r,q,p,o,n,m,l=this,k=t.N,j=A.J(k,t.X)
j.i(0,"me",l.a)
j.i(0,"rules",l.b.M())
j.i(0,"phase",l.c.b)
j.i(0,"turn",l.d)
j.i(0,"dealer",l.e)
j.i(0,"foot",l.f)
j.i(0,"hand#",l.r)
s=l.w
if(s!=null)j.i(0,"vira",s.ga3())
j.i(0,"value",l.x)
j.i(0,"level",l.y)
s=l.z
if(s!=null){r=A.e([s.a,s.b],t.t)
s=s.c
if(s!=null)r.push(s)
j.i(0,"pending",r)}s=l.Q
if(s!=null)j.i(0,"decision",s.b)
if(l.as)j.i(0,"iron",!0)
s=l.at
j.i(0,"scores",A.e([s.l(0,B.b),s.l(0,B.c)],t.c))
s=t.d
r=A.e([],s)
for(q=l.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.C)(q),++o)r.push(q[o].M())
j.i(0,"rounds",r)
s=A.e([],s)
for(r=l.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.C)(r),++o)s.push(r[o].M())
j.i(0,"plays",s)
s=t.s
r=A.e([],s)
for(q=l.ch,p=q.length,o=0;o<p;++o){n=q[o]
m=n.b.b
if(0>=m.length)return A.c(m,0)
r.push(n.a.c+m[0])}j.i(0,"hand",r)
j.i(0,"counts",l.CW)
r=l.cx
if(r!=null){s=A.e([],s)
for(q=r.length,o=0;o<r.length;r.length===q||(0,A.C)(r),++o){n=r[o]
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
if(s.gv(s)){k=A.J(k,k)
for(s=s.gJ(),s=s.gq(s);s.n();){r=s.gp()
k.i(0,""+r.a,r.b)}j.i(0,"speech",k)}k=l.go
if(k!=null)j.i(0,"toast",k)
if(l.id)j.i(0,"showLast",!0)
k=l.k1
if(k>0)j.i(0,"delay",k)
return j}}
A.de.prototype={
$1(a){var s,r=a.a,q=a.c
if(q){s=this.a
s=r!==s&&r!==B.d.C(s+2,4)}else s=!1
return new A.b3(r,s?null:a.b,q)},
$S:17}
A.dd.prototype={
T(a){var s,r,q,p,o,n=this
t.x.a(a)
n.e=!1
for(s=J.ag(a),r=n.r,q=n.a;s.n();){p=s.gp()
if(p instanceof A.aW){q.P(0)
n.b=null
n.d=!1
n.c=p.f
continue}if(p instanceof A.aS){n.c=n.e=n.d=!1
continue}if(p instanceof A.b4){q.i(0,p.a,p.c+"!")
continue}if(p instanceof A.bJ){q.i(0,p.a,"Cai dentro!")
continue}if(p instanceof A.au){o=p.a
q.i(0,o,p.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(p instanceof A.aT){o=p.a
q.i(0,o,p.b?"Vamos jogar!":"Corro.")
continue}if(p instanceof A.b6){n.e=n.d=!0
continue}if(p instanceof A.al){o=p.a
n.b=new A.bZ(p.b,o)
continue}if(p instanceof A.aV){p=p.a
o=r.l(0,p)
o.toString
r.i(0,p,o+1)}}},
bC(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.aj.prototype={
S(){return"GamePhase."+this.b}}
A.V.prototype={}
A.E.prototype={
j(a){var s=this.b.j(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.H.prototype={
j(a){return"Raise("+this.a+")"}}
A.F.prototype={
j(a){return"Accept("+this.a+")"}}
A.M.prototype={
j(a){return"Fold("+this.a+")"}}
A.N.prototype={}
A.aW.prototype={}
A.aT.prototype={}
A.aS.prototype={}
A.b4.prototype={}
A.bJ.prototype={}
A.au.prototype={}
A.b6.prototype={}
A.al.prototype={}
A.aV.prototype={}
A.Z.prototype={}
A.bK.prototype={}
A.cB.prototype={}
A.ch.prototype={
j(a){return"GameRuleError: "+this.a}}
A.dk.prototype={
gal(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.c(s,r)
return s[r]},
gar(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.C(r+2,4):B.d.C(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.C(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.C(q+1,4)
default:return null}},
aw(a){return a.c?-1:this.a.D(a.b,this.y)},
a9(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.n)throw A.d(A.bo("hand still in progress"));++j.f
j.e=B.d.C(j.e+1,4)
s=t.L
r=A.aZ($.ei(),s)
B.a.av(r,j.b)
q=t.E
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.aY(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.C)(p),++m){l=A.b_(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.y){if(12>=r.length)return A.c(r,12)
r=r[12]}else r=null
j.y=r
B.a.P(j.z)
B.a.P(j.Q)
m=j.ax=0
j.ch=j.ay=null
j.at=j.as=B.d.C(j.e+1,4)
r=A.e([],t.a)
for(q=j.c,p=s.e;m<2;++m){k=B.a1[m]
if(q.l(0,k)===p)r.push(k)}q=r.length
p=q===2
j.cy=p
j.cx=p&&s.x
s=q===1?B.a.gY(r):null
j.CW=s
j.r=s!=null?B.e:B.i
r=j.y
q=j.cx
B.a.k(j.d,new A.aW(j.x,r,s,q))},
aQ(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.CW)return B.k
return A.e([new A.F(a),new A.M(a)],t.u)
case 2:s=o.ch
if(n===((s.a&1)===0?B.b:B.c))return B.k
if(s.c===a)return B.k
s=A.e([new A.F(a),new A.M(a)],t.u)
if(o.ch.b+1<5)s.push(new A.H(a))
return s
case 1:if(a!==o.as)return B.k
s=A.e([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.C)(r),++p)s.push(new A.E(r[p],!1,a))
if(o.gaj()){r=o.w
if(!(a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.C)(r),++p)s.push(new A.E(r[p],!0,a))}if(o.aK(a))s.push(new A.H(a))
return s
case 3:case 4:return B.k}},
gaj(){return this.a.w&&!this.cx&&this.z.length!==0},
aK(a){var s=this,r=!1
if(s.r===B.i)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
T(a){var s,r,q,p,o=this,n=a.a
if(!B.a.a2(o.aQ(n),new A.dn(a)))throw A.d(A.bo("illegal "+a.j(0)+" in "+o.r.j(0)))
A:{if(a instanceof A.E){o.bf(a)
break A}if(a instanceof A.H){s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cB(n,p,null)
o.r=B.f
s=o.a.d
if(!(p<5))return A.c(s,p)
B.a.k(o.d,new A.b4(n,s[p],B.a2[p-1]))
break A}if(a instanceof A.F){o.b1(n)
break A}if(a instanceof A.M)o.bc(n)}},
b1(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.aT(a,!0))
q.r=B.i
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.i
if(!(r<5))return A.c(q.a.d,r)
B.a.k(q.d,new A.bJ(a))},
bc(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.k(o.d,new A.aT(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.ac(s,B.a.gR(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cB(r.a,r.b,a)
B.a.k(o.d,new A.au(a,!0))
return}B.a.k(o.d,new A.au(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.c(q,p)
o.ac(s,q[p])},
bf(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.c(s,r)
q=a.b
B.a.bB(s[r],q)
s=f.Q
p=a.c
B.a.k(s,new A.Z(r,q,p))
o=f.d
B.a.k(o,new A.aS(r,q,p))
r=s.length
if(r<4){f.as=B.d.C(f.as+1,4)
return}q=e.a=-2
for(p=f.a,n=0;n<s.length;s.length===r||(0,A.C)(s),++n,q=k){m=s[n]
l=m.c?-1:p.D(m.b,f.y)
k=Math.max(q,l)
e.a=k}r=A.K(s)
q=r.h("ad<1>")
j=A.aZ(new A.ad(s,r.h("t(1)").a(new A.dl(e,f)),q),q.h("b.E"))
r=A.K(j)
i=new A.ab(j,r.h("A(1)").a(new A.dm()),r.h("ab<1,A>")).aT(0)
h=i.a===1?i.gY(0):null
r=A.D(s,t.n)
q=B.a.gR(j).a
p=f.z
B.a.k(p,new A.bK(r,h,q))
B.a.P(s)
B.a.k(o,new A.b6(p.length))
g=A.ig(p)
if(g!=null)f.ac(g.a,f.gal())
else f.at=f.as=h==null?f.at:q},
ac(a,b){var s,r,q,p,o=this
o.ch=null
s=o.d
r=a==null
B.a.k(s,new A.al(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.l(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.l(0,a)
r.toString
if(r>=q){o.db=a
o.r=B.v
B.a.k(s,new A.aV(a))
return}}o.r=B.n}}
A.dn.prototype={
$1(a){return A.h5(t.J.a(a),this.a)},
$S:0}
A.dl.prototype={
$1(a){return this.b.aw(t.n.a(a))===this.a.a},
$S:3}
A.dm.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:18}
A.bH.prototype={
gV(){var s,r=this.a
if(r.cx)r=B.w
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.c(r,s)
s=A.D(r[s],t.L)
r=s}return r},
gaq(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gaR()
else q=!0
s=B.d.C(r+2,4)
p=l.w
if(!(s<p.length))return A.c(p,s)
o=t.L
n=A.D(p[s],o)
if(q)return n
if(k.Q&&l.e===r){r=l.x
if(!(s<r.length))return A.c(r,s)
o=A.D(r[s],o)
if(2>=o.length)return A.c(o,2)
m=o[2]
if(B.a.U(n,m))return A.e([m],t.Y)}return null},
gaR(){var s=this.a,r=!1
if(s.a.y)if(!s.cy)if(s.r===B.f){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbz(){var s,r,q,p,o,n,m=A.fW(this.gV(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gaq()
if(k!=null)m.a1(0,k)
for(k=A.D(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.D(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.A.prototype={
S(){return"Team."+this.b}}
A.dN.prototype={
$1(a){return A.is(A.a5(a))},
$S:19};(function aliases(){var s=J.an.prototype
s.aZ=s.j})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_1,q=hunkHelpers._instance_1u
s(J,"hK","eu",20)
r(A,"i7","hB",1)
q(A.ci.prototype,"gaP","by",16)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.m,null)
q(A.m,[A.dV,J.ck,A.bL,J.ar,A.b,A.bj,A.o,A.ai,A.u,A.dc,A.ax,A.bA,A.bQ,A.aD,A.r,A.a0,A.b0,A.bk,A.aE,A.ao,A.dq,A.db,A.d7,A.bx,A.by,A.bw,A.a_,A.cO,A.cU,A.c0,A.cS,A.bU,A.p,A.c6,A.cd,A.cf,A.dv,A.cM,A.bM,A.ds,A.d1,A.x,A.bF,A.b8,A.cP,A.cT,A.cI,A.L,A.ci,A.dp,A.b3,A.cE,A.b9,A.dd,A.V,A.N,A.Z,A.bK,A.cB,A.ch,A.dk,A.bH])
q(J.ck,[J.cn,J.bq,J.bs,J.br,J.bt,J.aX,J.aw])
q(J.bs,[J.an,J.h,A.b1,A.bD])
q(J.an,[J.cC,J.ba,J.am])
r(J.cm,A.bL)
r(J.d2,J.h)
q(J.aX,[J.bp,J.co])
q(A.b,[A.bb,A.f,A.az,A.ad,A.bR,A.bT,A.bd])
r(A.as,A.bb)
r(A.bS,A.as)
q(A.o,[A.at,A.Y,A.cQ])
q(A.ai,[A.cc,A.d_,A.cb,A.cH,A.dJ,A.dL,A.d9,A.di,A.df,A.dg,A.dh,A.dj,A.dP,A.dQ,A.cY,A.cZ,A.dD,A.de,A.dn,A.dl,A.dm,A.dN])
q(A.cc,[A.d0,A.d3,A.dK,A.d8,A.da,A.dw,A.dE])
q(A.u,[A.aY,A.bO,A.cp,A.cK,A.cF,A.cN,A.bv,A.c9,A.ah,A.bP,A.cJ,A.b7,A.ce])
q(A.f,[A.O,A.aa,A.bz,A.a9])
q(A.O,[A.bN,A.ab,A.cR])
r(A.bn,A.az)
q(A.a0,[A.bc,A.aH])
r(A.ae,A.bc)
q(A.aH,[A.af,A.bZ])
r(A.be,A.b0)
r(A.aC,A.be)
r(A.bl,A.aC)
r(A.X,A.bk)
q(A.ao,[A.bm,A.c_])
r(A.ak,A.bm)
r(A.bG,A.bO)
q(A.cH,[A.cG,A.aR])
r(A.bu,A.Y)
q(A.bD,[A.cs,A.b2])
q(A.b2,[A.bV,A.bX])
r(A.bW,A.bV)
r(A.bB,A.bW)
r(A.bY,A.bX)
r(A.bC,A.bY)
q(A.bB,[A.ct,A.cu])
q(A.bC,[A.cv,A.cw,A.cx,A.cy,A.cz,A.bE,A.cA])
r(A.c1,A.cN)
r(A.aF,A.c_)
r(A.cq,A.bv)
r(A.d4,A.cd)
q(A.cf,[A.d6,A.d5])
r(A.du,A.dv)
q(A.ah,[A.b5,A.cj])
q(A.cM,[A.a3,A.S,A.I,A.ay,A.aj,A.A])
q(A.cb,[A.dI,A.dH])
q(A.V,[A.E,A.H,A.F,A.M])
q(A.N,[A.aW,A.aT,A.aS,A.b4,A.bJ,A.au,A.b6,A.al,A.aV])
s(A.bV,A.p)
s(A.bW,A.r)
s(A.bX,A.p)
s(A.bY,A.r)
s(A.be,A.c6)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",k:"double",P:"num",l:"String",t:"bool",bF:"Null",i:"List",m:"Object",z:"Map",w:"JSObject"},mangledNames:{},types:["t(V)","@(@)","~(m?,m?)","t(Z)","a()","@(@,l)","@(l)","~(@,@)","t(E)","i<a>(a)","t(+(a,a))","A(+(a,a))","t(I)","t(S)","~(A,l)","t(L)","t(a)","b3(Z)","A(Z)","l(l)","a(@,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ae&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.af&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.bZ&&a.b(c.a)&&b.b(c.b)}}
A.hq(v.typeUniverse,JSON.parse('{"am":"an","cC":"an","ba":"an","iB":"b1","cn":{"t":[],"n":[]},"bq":{"n":[]},"bs":{"w":[]},"an":{"w":[]},"h":{"i":["1"],"f":["1"],"w":[],"b":["1"]},"cm":{"bL":[]},"d2":{"h":["1"],"i":["1"],"f":["1"],"w":[],"b":["1"]},"ar":{"v":["1"]},"aX":{"k":[],"P":[],"a8":["P"]},"bp":{"k":[],"a":[],"P":[],"a8":["P"],"n":[]},"co":{"k":[],"P":[],"a8":["P"],"n":[]},"aw":{"l":[],"a8":["l"],"n":[]},"bb":{"b":["2"]},"bj":{"v":["2"]},"as":{"bb":["1","2"],"b":["2"],"b.E":"2"},"bS":{"as":["1","2"],"bb":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"at":{"o":["3","4"],"z":["3","4"],"o.K":"3","o.V":"4"},"aY":{"u":[]},"f":{"b":["1"]},"O":{"f":["1"],"b":["1"]},"bN":{"O":["1"],"f":["1"],"b":["1"],"O.E":"1","b.E":"1"},"ax":{"v":["1"]},"az":{"b":["2"],"b.E":"2"},"bn":{"az":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"bA":{"v":["2"]},"ab":{"O":["2"],"f":["2"],"b":["2"],"O.E":"2","b.E":"2"},"ad":{"b":["1"],"b.E":"1"},"bQ":{"v":["1"]},"bR":{"b":["1"],"b.E":"1"},"aD":{"v":["1"]},"ae":{"bc":[],"a0":[]},"af":{"aH":[],"a0":[]},"bZ":{"aH":[],"a0":[]},"bl":{"aC":["1","2"],"be":["1","2"],"b0":["1","2"],"c6":["1","2"],"z":["1","2"]},"bk":{"z":["1","2"]},"X":{"bk":["1","2"],"z":["1","2"]},"bT":{"b":["1"],"b.E":"1"},"aE":{"v":["1"]},"bm":{"ao":["1"],"aB":["1"],"f":["1"],"b":["1"]},"ak":{"bm":["1"],"ao":["1"],"aB":["1"],"f":["1"],"b":["1"]},"bG":{"u":[]},"cp":{"u":[]},"cK":{"u":[]},"ai":{"av":[]},"cb":{"av":[]},"cc":{"av":[]},"cH":{"av":[]},"cG":{"av":[]},"aR":{"av":[]},"cF":{"u":[]},"Y":{"o":["1","2"],"dX":["1","2"],"z":["1","2"],"o.K":"1","o.V":"2"},"aa":{"f":["1"],"b":["1"],"b.E":"1"},"bx":{"v":["1"]},"bz":{"f":["1"],"b":["1"],"b.E":"1"},"by":{"v":["1"]},"a9":{"f":["x<1,2>"],"b":["x<1,2>"],"b.E":"x<1,2>"},"bw":{"v":["x<1,2>"]},"bu":{"Y":["1","2"],"o":["1","2"],"dX":["1","2"],"z":["1","2"],"o.K":"1","o.V":"2"},"aH":{"a0":[]},"bc":{"a0":[]},"b1":{"w":[],"n":[]},"bD":{"w":[]},"cs":{"w":[],"n":[]},"b2":{"R":["1"],"w":[]},"bB":{"p":["k"],"i":["k"],"R":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"]},"bC":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"]},"ct":{"p":["k"],"i":["k"],"R":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"],"n":[],"p.E":"k","r.E":"k"},"cu":{"p":["k"],"i":["k"],"R":["k"],"f":["k"],"w":[],"b":["k"],"r":["k"],"n":[],"p.E":"k","r.E":"k"},"cv":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cw":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cx":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cy":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cz":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"bE":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cA":{"p":["a"],"i":["a"],"R":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"p.E":"a","r.E":"a"},"cN":{"u":[]},"c1":{"u":[]},"c0":{"v":["1"]},"bd":{"b":["1"],"b.E":"1"},"aF":{"ao":["1"],"aB":["1"],"f":["1"],"b":["1"]},"bU":{"v":["1"]},"o":{"z":["1","2"]},"b0":{"z":["1","2"]},"aC":{"be":["1","2"],"b0":["1","2"],"c6":["1","2"],"z":["1","2"]},"ao":{"aB":["1"],"f":["1"],"b":["1"]},"c_":{"ao":["1"],"aB":["1"],"f":["1"],"b":["1"]},"cQ":{"o":["l","@"],"z":["l","@"],"o.K":"l","o.V":"@"},"cR":{"O":["l"],"f":["l"],"b":["l"],"O.E":"l","b.E":"l"},"bv":{"u":[]},"cq":{"u":[]},"k":{"P":[],"a8":["P"]},"a":{"P":[],"a8":["P"]},"i":{"f":["1"],"b":["1"]},"P":{"a8":["P"]},"aB":{"f":["1"],"b":["1"]},"l":{"a8":["l"]},"cM":{"aU":[]},"c9":{"u":[]},"bO":{"u":[]},"ah":{"u":[]},"b5":{"u":[]},"cj":{"u":[]},"bP":{"u":[]},"cJ":{"u":[]},"b7":{"u":[]},"ce":{"u":[]},"bM":{"u":[]},"b8":{"h1":[]},"cP":{"e_":[]},"cT":{"e_":[]},"a3":{"aU":[]},"S":{"aU":[]},"I":{"aU":[]},"ay":{"aU":[]},"E":{"V":[]},"al":{"N":[]},"aj":{"aU":[]},"H":{"V":[]},"F":{"V":[]},"M":{"V":[]},"aW":{"N":[]},"aT":{"N":[]},"aS":{"N":[]},"b4":{"N":[]},"bJ":{"N":[]},"au":{"N":[]},"b6":{"N":[]},"aV":{"N":[]},"A":{"aU":[]},"fP":{"i":["a"],"f":["a"],"b":["a"]},"h9":{"i":["a"],"f":["a"],"b":["a"]},"h8":{"i":["a"],"f":["a"],"b":["a"]},"fN":{"i":["a"],"f":["a"],"b":["a"]},"h6":{"i":["a"],"f":["a"],"b":["a"]},"fO":{"i":["a"],"f":["a"],"b":["a"]},"h7":{"i":["a"],"f":["a"],"b":["a"]},"fL":{"i":["k"],"f":["k"],"b":["k"]},"fM":{"i":["k"],"f":["k"],"b":["k"]}}'))
A.hp(v.typeUniverse,JSON.parse('{"b2":1,"c_":1,"cd":2,"cf":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.a6
return{l:s("F"),h:s("a3"),L:s("L"),e:s("a8<@>"),O:s("f<@>"),C:s("u"),k:s("M"),Z:s("av"),J:s("V"),I:s("ak<S>"),q:s("al"),x:s("b<N>"),r:s("b<@>"),Y:s("h<L>"),u:s("h<V>"),A:s("h<N>"),E:s("h<i<L>>"),B:s("h<z<l,m>>"),d:s("h<z<l,m?>>"),c5:s("h<Z>"),cd:s("h<b3>"),w:s("h<+(a,a)>"),d2:s("h<bK>"),bP:s("h<cE>"),s:s("h<l>"),bw:s("h<b9>"),a:s("h<A>"),b:s("h<@>"),t:s("h<a>"),cG:s("h<a3?>"),v:s("h<A?>"),c:s("h<a?>"),T:s("bq"),m:s("w"),M:s("am"),da:s("R<@>"),cm:s("i<L>"),U:s("i<V>"),aY:s("i<l>"),Q:s("i<b9>"),j:s("i<@>"),aH:s("i<a>"),W:s("i<m?>"),aJ:s("ay"),f:s("z<@,@>"),G:s("z<l,m?>"),p:s("z<a,i<b9>>"),P:s("bF"),K:s("m"),n:s("Z"),D:s("E"),aN:s("H"),al:s("I"),cY:s("iC"),cD:s("+()"),R:s("+(a,a)"),F:s("bK"),at:s("aB<l>"),N:s("l"),_:s("S"),H:s("A"),bW:s("n"),cr:s("ba"),db:s("bR<E>"),ca:s("aD<al>"),y:s("t"),i:s("k"),S:s("a"),ch:s("a3?"),bc:s("er<bF>?"),z:s("w?"),V:s("i<@>?"),a5:s("z<@,@>?"),X:s("m?"),aD:s("l?"),bM:s("A?"),g:s("cS?"),az:s("t?"),dd:s("k?"),a3:s("a?"),ae:s("P?"),o:s("P"),cQ:s("~(l,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.V=J.ck.prototype
B.a=J.h.prototype
B.d=J.bp.prototype
B.o=J.aX.prototype
B.j=J.aw.prototype
B.W=J.am.prototype
B.X=J.bs.prototype
B.H=J.cC.prototype
B.A=J.ba.prototype
B.l=new A.a3(0,"easy")
B.B=new A.a3(1,"medium")
B.m=new A.a3(2,"hard")
B.C=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.L=function() {
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
B.Q=function(getTagFallback) {
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
B.M=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.P=function(hooks) {
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
B.O=function(hooks) {
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
B.N=function(hooks) {
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

B.E=new A.d4()
B.h=new A.dc()
B.R=new A.cP()
B.I=new A.I("A",7,"ace")
B.r=new A.S(1,"espadas")
B.F=new A.L(B.I,B.r)
B.e=new A.aj(0,"decision")
B.i=new A.aj(1,"playing")
B.f=new A.aj(2,"raisePending")
B.n=new A.aj(3,"handOver")
B.v=new A.aj(4,"gameOver")
B.Y=new A.d5(null)
B.Z=new A.d6(null)
B.q=new A.S(0,"ouros")
B.t=new A.S(2,"copas")
B.u=new A.S(3,"paus")
B.p=s([B.q,B.r,B.t,B.u],A.a6("h<S>"))
B.y=new A.ay(0,"vira")
B.a6=new A.ay(1,"fixed")
B.a_=s([B.y,B.a6],A.a6("h<ay>"))
B.a0=s([B.l,B.B,B.m],A.a6("h<a3>"))
B.b=new A.A(0,"a")
B.c=new A.A(1,"b")
B.a1=s([B.b,B.c],t.a)
B.a2=s(["Truco","Seis","Nove","Doze"],t.s)
B.w=s([],t.Y)
B.k=s([],t.u)
B.aA=s([],t.d)
B.a3=s([],t.b)
B.a4=s([1,3,6,9,12],t.t)
B.K=new A.I("4",0,"four")
B.af=new A.I("5",1,"five")
B.J=new A.I("6",2,"six")
B.z=new A.I("7",3,"seven")
B.ag=new A.I("Q",4,"queen")
B.ad=new A.I("J",5,"jack")
B.ae=new A.I("K",6,"king")
B.ah=new A.I("2",8,"two")
B.ac=new A.I("3",9,"three")
B.x=s([B.K,B.af,B.J,B.z,B.ag,B.ad,B.ae,B.I,B.ah,B.ac],A.a6("h<I>"))
B.S=new A.L(B.z,B.q)
B.T=new A.L(B.z,B.t)
B.U=new A.L(B.K,B.u)
B.a5=s([B.S,B.F,B.T,B.U],t.Y)
B.a9={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.al=new A.ak([B.u,B.t],t.I)
B.ak=new A.ak([B.q,B.r],t.I)
B.am=new A.ak([B.r,B.u],t.I)
B.an=new A.ak([B.q,B.t],t.I)
B.a7=new A.X(B.a9,[B.al,B.ak,B.am,B.an],A.a6("X<l,aB<S>>"))
B.aa={}
B.G=new A.X(B.aa,[],A.a6("X<a,i<m?>>"))
B.ab={t:0}
B.a8=new A.X(B.ab,["next"],A.a6("X<l,m?>"))
B.ai=new A.ae(B.b)
B.aj=new A.ae(B.c)
B.ao=A.a2("ix")
B.ap=A.a2("iy")
B.aq=A.a2("fL")
B.ar=A.a2("fM")
B.as=A.a2("fN")
B.at=A.a2("fO")
B.au=A.a2("fP")
B.av=A.a2("m")
B.aw=A.a2("h6")
B.ax=A.a2("h7")
B.ay=A.a2("h8")
B.az=A.a2("h9")})();(function staticFields(){$.dt=null
$.U=A.e([],A.a6("h<m>"))
$.eA=null
$.en=null
$.em=null
$.fa=null
$.f7=null
$.fd=null
$.dC=null
$.dM=null
$.ec=null
$.dx=A.e([],A.a6("h<i<m>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iA","fg",()=>A.dG("_$dart_dartClosure"))
s($,"iz","eh",()=>A.dG("_$dart_dartClosure_dartJSInterop"))
s($,"iO","fr",()=>A.e([new J.cm()],A.a6("h<bL>")))
s($,"iD","fh",()=>A.ac(A.dr({
toString:function(){return"$receiver$"}})))
s($,"iE","fi",()=>A.ac(A.dr({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iF","fj",()=>A.ac(A.dr(null)))
s($,"iG","fk",()=>A.ac(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iJ","fn",()=>A.ac(A.dr(void 0)))
s($,"iK","fo",()=>A.ac(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iI","fm",()=>A.ac(A.eH(null)))
s($,"iH","fl",()=>A.ac(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iM","fq",()=>A.ac(A.eH(void 0)))
s($,"iL","fp",()=>A.ac(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iN","dR",()=>A.ef(B.av))
s($,"iP","ei",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.x[r]
for(p=0;p<4;++p)o.push(A.fA(q,B.p[p]))}return A.D(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b1,SharedArrayBuffer:A.b1,ArrayBufferView:A.bD,DataView:A.cs,Float32Array:A.ct,Float64Array:A.cu,Int16Array:A.cv,Int32Array:A.cw,Int8Array:A.cx,Uint16Array:A.cy,Uint32Array:A.cz,Uint8ClampedArray:A.bE,CanvasPixelArray:A.bE,Uint8Array:A.cA})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b2.$nativeSuperclassTag="ArrayBufferView"
A.bV.$nativeSuperclassTag="ArrayBufferView"
A.bW.$nativeSuperclassTag="ArrayBufferView"
A.bB.$nativeSuperclassTag="ArrayBufferView"
A.bX.$nativeSuperclassTag="ArrayBufferView"
A.bY.$nativeSuperclassTag="ArrayBufferView"
A.bC.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.ip
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()