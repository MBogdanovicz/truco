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
if(a[b]!==s){A.iH(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.er(b)
return new s(c,this)}:function(){if(s===null)s=A.er(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.er(a).prototype
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
ew(a,b,c,d){return{i:a,p:b,e:c,x:d}},
es(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.eu==null){A.iw()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eY("Return interceptor for "+A.u(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dF
if(o==null)o=$.dF=A.dT(n)
p=q[o]}if(p!=null)return p
p=A.iB(a)
if(p!=null)return p
if(typeof a=="function")return B.Y
s=Object.getPrototypeOf(a)
if(s==null)return B.J
if(s===Object.prototype)return B.J
if(typeof q=="function"){o=$.dF
if(o==null)o=$.dF=A.dT(n)
Object.defineProperty(q,o,{value:B.B,enumerable:false,writable:true,configurable:true})
return B.B}return B.B},
h7(a,b){if(a<0||a>4294967295)throw A.d(A.aN(a,0,4294967295,"length",null))
return J.h8(new Array(a),b)},
ea(a,b){if(a<0)throw A.d(A.d2("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
e9(a,b){if(a<0)throw A.d(A.d2("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("j<0>"))},
h8(a,b){var s=A.e(a,b.h("j<0>"))
s.$flags=1
return s},
eH(a,b){var s=t.r
return J.fK(s.a(a),s.a(b))},
ay(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bv.prototype
return J.cy.prototype}if(typeof a=="string")return J.aH.prototype
if(a==null)return J.bw.prototype
if(typeof a=="boolean")return J.cx.prototype
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.as.prototype
if(typeof a=="symbol")return J.bz.prototype
if(typeof a=="bigint")return J.bx.prototype
return a}if(a instanceof A.k)return a
return J.es(a)},
dS(a){if(typeof a=="string")return J.aH.prototype
if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.as.prototype
if(typeof a=="symbol")return J.bz.prototype
if(typeof a=="bigint")return J.bx.prototype
return a}if(a instanceof A.k)return a
return J.es(a)},
bn(a){if(a==null)return a
if(Array.isArray(a))return J.j.prototype
if(typeof a!="object"){if(typeof a=="function")return J.as.prototype
if(typeof a=="symbol")return J.bz.prototype
if(typeof a=="bigint")return J.bx.prototype
return a}if(a instanceof A.k)return a
return J.es(a)},
ir(a){if(typeof a=="number")return J.b5.prototype
if(typeof a=="string")return J.aH.prototype
if(a==null)return a
if(!(a instanceof A.k))return J.bf.prototype
return a},
J(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ay(a).C(a,b)},
a9(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.iz(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dS(a).j(a,b)},
fI(a,b,c){return J.bn(a).i(a,b,c)},
e5(a,b){return J.bn(a).k(a,b)},
fJ(a,b){return J.bn(a).W(a,b)},
fK(a,b){return J.ir(a).b1(a,b)},
e6(a,b){return J.bn(a).G(a,b)},
ae(a){return J.ay(a).gv(a)},
fL(a){return J.dS(a).gt(a)},
fM(a){return J.bn(a).gu(a)},
az(a){return J.bn(a).gq(a)},
d1(a){return J.dS(a).gm(a)},
fN(a){return J.ay(a).gB(a)},
ci(a){return J.ay(a).l(a)},
cv:function cv(){},
cx:function cx(){},
bw:function bw(){},
by:function by(){},
at:function at(){},
cL:function cL(){},
bf:function bf(){},
as:function as(){},
bx:function bx(){},
bz:function bz(){},
j:function j(a){this.$ti=a},
cw:function cw(){},
dd:function dd(a){this.$ti=a},
aA:function aA(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
b5:function b5(){},
bv:function bv(){},
cy:function cy(){},
aH:function aH(){}},A={eb:function eb(){},
fT(a,b,c){if(t.V.b(a))return new A.c1(a,b.h("@<0>").A(c).h("c1<1,2>"))
return new A.aB(a,b.h("@<0>").A(c).h("aB<1,2>"))},
h9(a){return new A.bC("Field '"+a+"' has not been initialized.")},
av(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
ej(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ih(a,b,c){return a},
ev(a){var s,r
for(s=$.Y.length,r=0;r<s;++r)if(a===$.Y[r])return!0
return!1},
ei(a,b,c,d){A.eg(b,"start")
if(c!=null){A.eg(c,"end")
if(b>c)A.am(A.aN(b,0,c,"start",null))}return new A.bU(a,b,c,d.h("bU<0>"))},
hd(a,b,c,d){if(t.V.b(a))return new A.bt(a,b,c.h("@<0>").A(d).h("bt<1,2>"))
return new A.aM(a,b,c.h("@<0>").A(d).h("aM<1,2>"))},
bu(){return new A.bd("No element")},
eG(){return new A.bd("Too many elements")},
bg:function bg(){},
bp:function bp(a,b){this.a=a
this.$ti=b},
aB:function aB(a,b){this.a=a
this.$ti=b},
c1:function c1(a,b){this.a=a
this.$ti=b},
aC:function aC(a,b){this.a=a
this.$ti=b},
d6:function d6(a,b){this.a=a
this.b=b},
d5:function d5(a){this.a=a},
bC:function bC(a){this.a=a},
dq:function dq(){},
f:function f(){},
D:function D(){},
bU:function bU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a4:function a4(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aM:function aM(a,b,c){this.a=a
this.b=b
this.$ti=c},
bt:function bt(a,b,c){this.a=a
this.b=b
this.$ti=c},
bG:function bG(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ag:function ag(a,b,c){this.a=a
this.b=b
this.$ti=c},
ai:function ai(a,b,c){this.a=a
this.b=b
this.$ti=c},
c_:function c_(a,b,c){this.a=a
this.b=b
this.$ti=c},
c0:function c0(a,b){this.a=a
this.$ti=b},
aQ:function aQ(a,b){this.a=a
this.$ti=b},
t:function t(){},
bQ:function bQ(a,b){this.a=a
this.$ti=b},
cp(a,b,c){var s,r,q,p,o,n,m,l=A.h(a),k=A.aK(new A.V(a,l.h("V<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.w)(k),++i,p=o){r=k[i]
c.a(a.j(0,r))
o=p+1
q[r]=p}n=A.aK(new A.bF(a,l.h("bF<2>")),!0,c)
m=new A.R(q,n,b.h("@<0>").A(c).h("R<1,2>"))
m.$keys=k
return m}return new A.br(A.ha(a,b,c),b.h("@<0>").A(c).h("br<1,2>"))},
fZ(){throw A.d(A.bZ("Cannot modify constant Set"))},
fv(a){var s=A.fu(a)
if(s!=null)return s
return"minified:"+a},
iz(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
u(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.ci(a)
return s},
bO(a){var s,r=$.eP
if(r==null)r=$.eP=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cM(a){var s,r,q,p
if(a instanceof A.k)return A.X(A.al(a),null)
s=J.ay(a)
if(s===B.X||s===B.Z||t.cr.b(a)){r=B.D(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.X(A.al(a),null)},
eQ(a){var s,r,q
if(a==null||typeof a=="number"||A.eo(a))return J.ci(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.ao)return a.l(0)
if(a instanceof A.a7)return a.aZ(!0)
s=$.fH()
for(r=0;r<1;++r){q=s[r].c_(a)
if(q!=null)return q}return"Instance of '"+A.cM(a)+"'"},
N(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aY(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aN(a,0,1114111,null,null))},
b(a,b){if(a==null)J.d1(a)
throw A.d(A.fp(a,b))},
fp(a,b){var s,r="index"
if(!A.ep(b))return new A.an(!0,b,r,null)
s=J.d1(a)
if(b<0||b>=s)return A.e7(b,s,a,r)
return A.eS(b,r)},
d(a){return A.L(a,new Error())},
L(a,b){var s
if(a==null)a=new A.bX()
b.dartException=a
s=A.iI
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iI(){return J.ci(this.dartException)},
am(a,b){throw A.L(a,b==null?new Error():b)},
aZ(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.am(A.hO(a,b,c),s)},
hO(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.bY("'"+s+"': Cannot "+o+" "+l+k+n)},
w(a){throw A.d(A.Z(a))},
ah(a){var s,r,q,p,o,n
a=A.iE(a.replace(String({}),"$receiver$"))
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
eX(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
ec(a,b){var s=b==null,r=s?null:b.method
return new A.cz(a,r,s?null:b.receiver)},
ey(a){if(a==null)return new A.dp(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aY(a,a.dartException)
return A.ig(a)},
aY(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
ig(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aY(r,16)&8191)===10)switch(q){case 438:return A.aY(a,A.ec(A.u(s)+" (Error "+q+")",null))
case 445:case 5007:A.u(s)
return A.aY(a,new A.bM())}}if(a instanceof TypeError){p=$.fx()
o=$.fy()
n=$.fz()
m=$.fA()
l=$.fD()
k=$.fE()
j=$.fC()
$.fB()
i=$.fG()
h=$.fF()
g=p.P(s)
if(g!=null)return A.aY(a,A.ec(A.ac(s),g))
else{g=o.P(s)
if(g!=null){g.method="call"
return A.aY(a,A.ec(A.ac(s),g))}else if(n.P(s)!=null||m.P(s)!=null||l.P(s)!=null||k.P(s)!=null||j.P(s)!=null||m.P(s)!=null||i.P(s)!=null||h.P(s)!=null){A.ac(s)
return A.aY(a,new A.bM())}}return A.aY(a,new A.cT(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bT()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aY(a,new A.an(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bT()
return a},
ex(a){if(a==null)return J.ae(a)
if(typeof a=="object")return A.bO(a)
return J.ae(a)},
ii(a){if(typeof a=="number")return B.p.gv(a)
if(a instanceof A.d0)return A.bO(a)
if(a instanceof A.a7)return a.gv(a)
return A.ex(a)},
ip(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
hX(a,b,c,d,e,f){t.Z.a(a)
switch(A.E(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(new A.dE("Unsupported number of arguments for wrapped closure"))},
ij(a,b){var s=a.$identity
if(!!s)return s
s=A.ik(a,b)
a.$identity=s
return s},
ik(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.hX)},
fY(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cP().constructor.prototype):Object.create(new A.b_(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.eE(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fU(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.eE(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fU(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fP)}throw A.d("Error in functionType of tearoff")},
fV(a,b,c,d){var s=A.eD
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
eE(a,b,c,d){if(c)return A.fX(a,b,d)
return A.fV(b.length,d,a,b)},
fW(a,b,c,d){var s=A.eD,r=A.fQ
switch(b?-1:a){case 0:throw A.d(new A.cO("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fX(a,b,c){var s,r
if($.eB==null)$.eB=A.eA("interceptor")
if($.eC==null)$.eC=A.eA("receiver")
s=b.length
r=A.fW(s,c,a,b)
return r},
er(a){return A.fY(a)},
fP(a,b){return A.cf(v.typeUniverse,A.al(a.a),b)},
eD(a){return a.a},
fQ(a){return a.b},
eA(a){var s,r,q,p=new A.b_("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.d2("Field name "+a+" not found."))},
dT(a){return v.getIsolateTag(a)},
iB(a){var s,r,q,p,o,n=A.ac($.fq.$1(a)),m=$.dO[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dZ[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.fe($.fn.$2(a,n))
if(q!=null){m=$.dO[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dZ[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.e0(s)
$.dO[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dZ[n]=s
return s}if(p==="-"){o=A.e0(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fs(a,s)
if(p==="*")throw A.d(A.eY(n))
if(v.leafTags[n]===true){o=A.e0(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fs(a,s)},
fs(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.ew(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
e0(a){return J.ew(a,!1,null,!!a.$iU)},
iD(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.e0(s)
else return J.ew(s,c,null,null)},
iw(){if(!0===$.eu)return
$.eu=!0
A.ix()},
ix(){var s,r,q,p,o,n,m,l
$.dO=Object.create(null)
$.dZ=Object.create(null)
A.iv()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.ft.$1(o)
if(n!=null){m=A.iD(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
iv(){var s,r,q,p,o,n,m=B.N()
m=A.bm(B.O,A.bm(B.P,A.bm(B.E,A.bm(B.E,A.bm(B.Q,A.bm(B.R,A.bm(B.S(B.D),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fq=new A.dW(p)
$.fn=new A.dX(o)
$.ft=new A.dY(n)},
bm(a,b){return a(b)||b},
im(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
iE(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
aj:function aj(a){this.a=a},
ak:function ak(a,b){this.a=a
this.b=b},
c8:function c8(a,b){this.a=a
this.b=b},
br:function br(a,b){this.a=a
this.$ti=b},
bq:function bq(){},
R:function R(a,b,c){this.a=a
this.b=b
this.$ti=c},
c2:function c2(a,b){this.a=a
this.$ti=b},
aR:function aR(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bs:function bs(){},
aq:function aq(a,b){this.a=a
this.$ti=b},
bS:function bS(){},
dC:function dC(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bM:function bM(){},
cz:function cz(a,b,c){this.a=a
this.b=b
this.c=c},
cT:function cT(a){this.a=a},
dp:function dp(a){this.a=a},
ao:function ao(){},
cl:function cl(){},
cm:function cm(){},
cQ:function cQ(){},
cP:function cP(){},
b_:function b_(a,b){this.a=a
this.b=b},
cO:function cO(a){this.a=a},
a0:function a0(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
df:function df(a,b){this.a=a
this.b=b},
de:function de(a){this.a=a},
dj:function dj(a,b){this.a=a
this.b=b
this.c=null},
V:function V(a,b){this.a=a
this.$ti=b},
aI:function aI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bF:function bF(a,b){this.a=a
this.$ti=b},
bE:function bE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
a2:function a2(a,b){this.a=a
this.$ti=b},
bD:function bD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bA:function bA(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
dW:function dW(a){this.a=a},
dX:function dX(a){this.a=a},
dY:function dY(a){this.a=a},
a7:function a7(){},
aU:function aU(){},
bi:function bi(){},
b7:function b7(){},
bJ:function bJ(){},
cB:function cB(){},
b8:function b8(){},
bH:function bH(){},
bI:function bI(){},
cC:function cC(){},
cD:function cD(){},
cE:function cE(){},
cF:function cF(){},
cG:function cG(){},
cH:function cH(){},
cI:function cI(){},
bK:function bK(){},
cJ:function cJ(){},
c4:function c4(){},
c5:function c5(){},
c6:function c6(){},
c7:function c7(){},
eh(a,b){var s=b.c
return s==null?b.c=A.cd(a,"eF",[b.x]):s},
eT(a){var s=a.w
if(s===6||s===7)return A.eT(a.x)
return s===11||s===12},
hf(a){return a.as},
ad(a){return A.dK(v.typeUniverse,a,!1)},
aV(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aV(a1,s,a3,a4)
if(r===s)return a2
return A.f5(a1,r,!0)
case 7:s=a2.x
r=A.aV(a1,s,a3,a4)
if(r===s)return a2
return A.f4(a1,r,!0)
case 8:q=a2.y
p=A.bl(a1,q,a3,a4)
if(p===q)return a2
return A.cd(a1,a2.x,p)
case 9:o=a2.x
n=A.aV(a1,o,a3,a4)
m=a2.y
l=A.bl(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.el(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bl(a1,j,a3,a4)
if(i===j)return a2
return A.f6(a1,k,i)
case 11:h=a2.x
g=A.aV(a1,h,a3,a4)
f=a2.y
e=A.ic(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.f3(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bl(a1,d,a3,a4)
o=a2.x
n=A.aV(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.em(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.ck("Attempted to substitute unexpected RTI kind "+a0))}},
bl(a,b,c,d){var s,r,q,p,o=b.length,n=A.dL(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aV(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
id(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dL(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aV(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
ic(a,b,c,d){var s,r=b.a,q=A.bl(a,r,c,d),p=b.b,o=A.bl(a,p,c,d),n=b.c,m=A.id(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cW()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
fo(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.it(s)
return a.$S()}return null},
iy(a,b){var s
if(A.eT(b))if(a instanceof A.ao){s=A.fo(a)
if(s!=null)return s}return A.al(a)},
al(a){if(a instanceof A.k)return A.h(a)
if(Array.isArray(a))return A.C(a)
return A.en(J.ay(a))},
C(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
h(a){var s=a.$ti
return s!=null?s:A.en(a)},
en(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hV(a,s)},
hV(a,b){var s=a instanceof A.ao?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hE(v.typeUniverse,s.name)
b.$ccache=r
return r},
it(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dK(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
is(a){return A.aW(A.h(a))},
eq(a){var s
if(a instanceof A.a7)return A.io(a.$r,a.am())
s=a instanceof A.ao?A.fo(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fN(a).a
if(Array.isArray(a))return A.C(a)
return A.al(a)},
aW(a){var s=a.r
return s==null?a.r=new A.d0(a):s},
io(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.b(q,0)
s=A.cf(v.typeUniverse,A.eq(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.b(q,r)
s=A.f8(v.typeUniverse,s,A.eq(q[r]))}return A.cf(v.typeUniverse,s,a)},
a8(a){return A.aW(A.dK(v.typeUniverse,a,!1))},
hU(a){var s=this
s.b=A.ib(s)
return s.b(a)},
ib(a){var s,r,q,p,o
if(a===t.K)return A.i2
if(A.aX(a))return A.i6
s=a.w
if(s===6)return A.hS
if(s===1)return A.fj
if(s===7)return A.hY
r=A.ia(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aX)){a.f="$i"+q
if(q==="i")return A.i0
if(a===t.m)return A.i_
return A.i5}}else if(s===10){p=A.im(a.x,a.y)
o=p==null?A.fj:p
return o==null?A.fd(o):o}return A.hQ},
ia(a){if(a.w===8){if(a===t.S)return A.ep
if(a===t.i||a===t.o)return A.i1
if(a===t.N)return A.i4
if(a===t.y)return A.eo}return null},
hT(a){var s=this,r=A.hP
if(A.aX(s))r=A.hL
else if(s===t.K)r=A.fd
else if(A.bo(s)){r=A.hR
if(s===t.a3)r=A.fb
else if(s===t.aD)r=A.fe
else if(s===t.az)r=A.ch
else if(s===t.ae)r=A.dM
else if(s===t.dd)r=A.hI
else if(s===t.z)r=A.hK}else if(s===t.S)r=A.E
else if(s===t.N)r=A.ac
else if(s===t.y)r=A.hG
else if(s===t.o)r=A.fc
else if(s===t.i)r=A.hH
else if(s===t.m)r=A.hJ
s.a=r
return s.a(a)},
hQ(a){var s=this
if(a==null)return A.bo(s)
return A.iA(v.typeUniverse,A.iy(a,s),s)},
hS(a){if(a==null)return!0
return this.x.b(a)},
i5(a){var s,r=this
if(a==null)return A.bo(r)
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.ay(a)[s]},
i0(a){var s,r=this
if(a==null)return A.bo(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.k)return!!a[s]
return!!J.ay(a)[s]},
i_(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.k)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
fi(a){if(typeof a=="object"){if(a instanceof A.k)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hP(a){var s=this
if(a==null){if(A.bo(s))return a}else if(s.b(a))return a
throw A.L(A.ff(a,s),new Error())},
hR(a){var s=this
if(a==null||s.b(a))return a
throw A.L(A.ff(a,s),new Error())},
ff(a,b){return new A.cb("TypeError: "+A.eZ(a,A.X(b,null)))},
eZ(a,b){return A.cr(a)+": type '"+A.X(A.eq(a),null)+"' is not a subtype of type '"+b+"'"},
a1(a,b){return new A.cb("TypeError: "+A.eZ(a,b))},
hY(a){var s=this
return s.x.b(a)||A.eh(v.typeUniverse,s).b(a)},
i2(a){return a!=null},
fd(a){if(a!=null)return a
throw A.L(A.a1(a,"Object"),new Error())},
i6(a){return!0},
hL(a){return a},
fj(a){return!1},
eo(a){return!0===a||!1===a},
hG(a){if(!0===a)return!0
if(!1===a)return!1
throw A.L(A.a1(a,"bool"),new Error())},
ch(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.L(A.a1(a,"bool?"),new Error())},
hH(a){if(typeof a=="number")return a
throw A.L(A.a1(a,"double"),new Error())},
hI(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a1(a,"double?"),new Error())},
ep(a){return typeof a=="number"&&Math.floor(a)===a},
E(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.L(A.a1(a,"int"),new Error())},
fb(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.L(A.a1(a,"int?"),new Error())},
i1(a){return typeof a=="number"},
fc(a){if(typeof a=="number")return a
throw A.L(A.a1(a,"num"),new Error())},
dM(a){if(typeof a=="number")return a
if(a==null)return a
throw A.L(A.a1(a,"num?"),new Error())},
i4(a){return typeof a=="string"},
ac(a){if(typeof a=="string")return a
throw A.L(A.a1(a,"String"),new Error())},
fe(a){if(typeof a=="string")return a
if(a==null)return a
throw A.L(A.a1(a,"String?"),new Error())},
hJ(a){if(A.fi(a))return a
throw A.L(A.a1(a,"JSObject"),new Error())},
hK(a){if(a==null)return a
if(A.fi(a))return a
throw A.L(A.a1(a,"JSObject?"),new Error())},
fk(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.X(a[q],b)
return s},
i9(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.fk(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.X(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
fg(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.X(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.X(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.X(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.X(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.X(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
X(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.X(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.X(a.x,b)+">"
if(l===8){p=A.ie(a.x)
o=a.y
return o.length>0?p+("<"+A.fk(o,b)+">"):p}if(l===10)return A.i9(a,b)
if(l===11)return A.fg(a,b,null)
if(l===12)return A.fg(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.b(b,n)
return b[n]}return"?"},
ie(a){var s=A.fu(a)
if(s!=null)return s
return"minified:"+a},
hF(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hE(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dK(a,b,!1)
else if(typeof m=="number"){s=m
r=A.ce(a,5,"#")
q=A.dL(s)
for(p=0;p<s;++p)q[p]=r
o=A.cd(a,b,q)
n[b]=o
return o}else return m},
hD(a,b){return A.f9(a.tR,b)},
hC(a,b){return A.f9(a.eT,b)},
dK(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.f7(a,null,b,!1)
r.set(b,s)
return s},
cf(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.f7(a,b,c,!0)
q.set(c,r)
return r},
f8(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.el(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
f7(a,b,c,d){return A.hv(A.hp(a,b,c,d))},
ax(a,b){b.a=A.hT
b.b=A.hU
return b},
ce(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a6(null,null)
s.w=b
s.as=c
r=A.ax(a,s)
a.eC.set(c,r)
return r},
f5(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hA(a,b,r,c)
a.eC.set(r,s)
return s},
hA(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aX(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bo(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a6(null,null)
q.w=6
q.x=b
q.as=c
return A.ax(a,q)},
f4(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.hy(a,b,r,c)
a.eC.set(r,s)
return s},
hy(a,b,c,d){var s,r
if(d){s=b.w
if(A.aX(b)||b===t.K)return b
else if(s===1)return A.cd(a,"eF",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.a6(null,null)
r.w=7
r.x=b
r.as=c
return A.ax(a,r)},
hB(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a6(null,null)
s.w=13
s.x=b
s.as=q
r=A.ax(a,s)
a.eC.set(q,r)
return r},
cc(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hx(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
cd(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.cc(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a6(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.ax(a,r)
a.eC.set(p,q)
return q},
el(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.cc(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a6(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.ax(a,o)
a.eC.set(q,n)
return n},
f6(a,b,c){var s,r,q="+"+(b+"("+A.cc(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a6(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.ax(a,s)
a.eC.set(q,r)
return r},
f3(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.cc(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.cc(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hx(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a6(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.ax(a,p)
a.eC.set(r,o)
return o},
em(a,b,c,d){var s,r=b.as+("<"+A.cc(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hz(a,b,c,r,d)
a.eC.set(r,s)
return s},
hz(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dL(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aV(a,b,r,0)
m=A.bl(a,c,r,0)
return A.em(a,n,m,c!==m)}}l=new A.a6(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.ax(a,l)},
hp(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hv(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.hr(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.f0(a,r,l,k,!1)
else if(q===46)r=A.f0(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aT(a.u,a.e,k.pop()))
break
case 94:k.push(A.hB(a.u,k.pop()))
break
case 35:k.push(A.ce(a.u,5,"#"))
break
case 64:k.push(A.ce(a.u,2,"@"))
break
case 126:k.push(A.ce(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.ht(a,k)
break
case 38:A.hs(a,k)
break
case 63:p=a.u
k.push(A.f5(p,A.aT(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.f4(p,A.aT(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.hq(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.f1(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.hw(a.u,a.e,o)
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
return A.aT(a.u,a.e,m)},
hr(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
f0(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hF(s,o.x)[p]
if(n==null)A.am('No "'+p+'" in "'+A.hf(o)+'"')
d.push(A.cf(s,o,n))}else d.push(p)
return m},
ht(a,b){var s,r=a.u,q=A.f_(a,b),p=b.pop()
if(typeof p=="string")b.push(A.cd(r,p,q))
else{s=A.aT(r,a.e,p)
switch(s.w){case 11:b.push(A.em(r,s,q,a.n))
break
default:b.push(A.el(r,s,q))
break}}},
hq(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.f_(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aT(p,a.e,o)
q=new A.cW()
q.a=s
q.b=n
q.c=m
b.push(A.f3(p,r,q))
return
case-4:b.push(A.f6(p,b.pop(),s))
return
default:throw A.d(A.ck("Unexpected state under `()`: "+A.u(o)))}},
hs(a,b){var s=b.pop()
if(0===s){b.push(A.ce(a.u,1,"0&"))
return}if(1===s){b.push(A.ce(a.u,4,"1&"))
return}throw A.d(A.ck("Unexpected extended operation "+A.u(s)))},
f_(a,b){var s=b.splice(a.p)
A.f1(a.u,a.e,s)
a.p=b.pop()
return s},
aT(a,b,c){if(typeof c=="string")return A.cd(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hu(a,b,c)}else return c},
f1(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aT(a,b,c[s])},
hw(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aT(a,b,c[s])},
hu(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.ck("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.ck("Bad index "+c+" for "+b.l(0)))},
iA(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.F(a,b,null,c,null)
r.set(c,s)}return s},
F(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aX(d))return!0
s=b.w
if(s===4)return!0
if(A.aX(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.F(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.F(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.F(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.F(a,b.x,c,d,e))return!1
return A.F(a,A.eh(a,b),c,d,e)}if(s===6)return A.F(a,p,c,d,e)&&A.F(a,b.x,c,d,e)
if(q===7){if(A.F(a,b,c,d.x,e))return!0
return A.F(a,b,c,A.eh(a,d),e)}if(q===6)return A.F(a,b,c,p,e)||A.F(a,b,c,d.x,e)
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
if(!A.F(a,j,c,i,e)||!A.F(a,i,e,j,c))return!1}return A.fh(a,b.x,c,d.x,e)}if(q===11){if(b===t.h)return!0
if(p)return!1
return A.fh(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hZ(a,b,c,d,e)}if(o&&q===10)return A.i3(a,b,c,d,e)
return!1},
fh(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
hZ(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.cf(a,b,r[o])
return A.fa(a,p,null,c,d.y,e)}return A.fa(a,b.y,null,c,d.y,e)},
fa(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.F(a,b[s],d,e[s],f))return!1
return!0},
i3(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.F(a,r[s],c,q[s],e))return!1
return!0},
bo(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aX(a))if(s!==6)r=s===7&&A.bo(a.x)
return r},
aX(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
f9(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dL(a){return a>0?new Array(a):v.typeUniverse.sEA},
a6:function a6(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cW:function cW(){this.c=this.b=this.a=null},
d0:function d0(a){this.a=a},
cV:function cV(){},
cb:function cb(a){this.a=a},
f2(a,b,c){return 0},
ca:function ca(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
bj:function bj(a,b){this.a=a
this.$ti=b},
eJ(a,b){return new A.a0(a.h("@<0>").A(b).h("a0<1,2>"))},
a3(a,b,c){return b.h("@<0>").A(c).h("ed<1,2>").a(A.ip(a,new A.a0(b.h("@<0>").A(c).h("a0<1,2>"))))},
o(a,b){return new A.a0(a.h("@<0>").A(b).h("a0<1,2>"))},
eL(a){return new A.aS(a.h("aS<0>"))},
dl(a){return new A.aS(a.h("aS<0>"))},
ek(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
ha(a,b,c){var s=A.eJ(b,c)
a.I(0,new A.dk(s,b,c))
return s},
eK(a,b,c){var s=A.eJ(b,c)
s.W(0,a)
return s},
hb(a,b){var s=A.eL(b)
s.W(0,a)
return s},
ee(a){var s,r
if(A.ev(a))return"{...}"
s=new A.be("")
try{r={}
B.a.k($.Y,a)
s.a+="{"
r.a=!0
a.I(0,new A.dn(r,s))
s.a+="}"}finally{if(0>=$.Y.length)return A.b($.Y,-1)
$.Y.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
aS:function aS(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
d_:function d_(a){this.a=a
this.c=this.b=null},
c3:function c3(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
dk:function dk(a,b,c){this.a=a
this.b=b
this.c=c},
r:function r(){},
q:function q(){},
dm:function dm(a){this.a=a},
dn:function dn(a,b){this.a=a
this.b=b},
cg:function cg(){},
b6:function b6(){},
aP:function aP(a,b){this.a=a
this.$ti=b},
au:function au(){},
c9:function c9(){},
bk:function bk(){},
i8(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ey(r)
q=String(s)
throw A.d(new A.d8(q))}q=A.dN(p)
return q},
dN(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cY(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dN(a[s])
return a},
eI(a,b,c){return new A.bB(a,b)},
hN(a){return a.M()},
hn(a,b){return new A.dG(a,[],A.il())},
ho(a,b,c){var s,r=new A.be(""),q=A.hn(r,b)
q.ad(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cY:function cY(a,b){this.a=a
this.b=b
this.c=null},
cZ:function cZ(a){this.a=a},
cn:function cn(){},
cq:function cq(){},
bB:function bB(a,b){this.a=a
this.b=b},
cA:function cA(a,b){this.a=a
this.b=b},
dg:function dg(){},
di:function di(a){this.b=a},
dh:function dh(a){this.a=a},
dH:function dH(){},
dI:function dI(a,b){this.a=a
this.b=b},
dG:function dG(a,b,c){this.c=a
this.a=b
this.b=c},
eM(a,b,c,d){var s,r=c?J.ea(a,d):J.h7(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
aK(a,b,c){var s,r=A.e([],c.h("j<0>"))
for(s=J.az(a);s.n();)B.a.k(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
aJ(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("j<0>"))
s=A.e([],b.h("j<0>"))
for(r=J.az(a);r.n();)B.a.k(s,r.gp())
return s},
hc(a,b,c){var s,r=J.ea(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
z(a,b){var s=A.aK(a,!1,b)
s.$flags=3
return s},
eV(a,b,c){var s=J.az(b)
if(!s.n())return a
if(c.length===0){do a+=A.u(s.gp())
while(s.n())}else{a+=A.u(s.gp())
while(s.n())a=a+c+A.u(s.gp())}return a},
h0(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fO(b,"name","No enum value with that name"))},
h_(a,b){var s,r,q=A.o(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cr(a){if(typeof a=="number"||A.eo(a)||a==null)return J.ci(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eQ(a)},
ck(a){return new A.cj(a)},
d2(a){return new A.an(!1,null,null,a)},
fO(a,b,c){return new A.an(!0,a,b,c)},
eR(a){var s=null
return new A.bb(s,s,!1,s,s,a)},
eS(a,b){return new A.bb(null,null,!0,a,b,"Value not in range")},
aN(a,b,c,d,e){return new A.bb(b,c,!0,a,d,"Invalid value")},
he(a,b,c){if(0>a||a>c)throw A.d(A.aN(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aN(b,a,c,"end",null))
return b}return c},
eg(a,b){if(a<0)throw A.d(A.aN(a,0,null,b,null))
return a},
e7(a,b,c,d){return new A.cu(b,!0,a,d,"Index out of range")},
bZ(a){return new A.bY(a)},
eY(a){return new A.cS(a)},
eU(a){return new A.bd(a)},
Z(a){return new A.co(a)},
h6(a,b,c){var s,r
if(A.ev(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.k($.Y,a)
try{A.i7(a,s)}finally{if(0>=$.Y.length)return A.b($.Y,-1)
$.Y.pop()}r=A.eV(b,t.bi.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
e8(a,b,c){var s,r
if(A.ev(a))return b+"..."+c
s=new A.be(b)
B.a.k($.Y,a)
try{r=s
r.a=A.eV(r.a,a,", ")}finally{if(0>=$.Y.length)return A.b($.Y,-1)
$.Y.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
i7(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
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
eN(a,b,c,d,e){return new A.aC(a,b.h("@<0>").A(c).A(d).A(e).h("aC<1,2,3,4>"))},
eO(a,b,c,d){var s
if(B.j===c){s=B.d.gv(a)
b=J.ae(b)
return A.ej(A.av(A.av($.e3(),s),b))}if(B.j===d){s=B.d.gv(a)
b=J.ae(b)
c=J.ae(c)
return A.ej(A.av(A.av(A.av($.e3(),s),b),c))}s=B.d.gv(a)
b=J.ae(b)
c=J.ae(c)
d=J.ae(d)
d=A.ej(A.av(A.av(A.av(A.av($.e3(),s),b),c),d))
return d},
cU:function cU(){},
v:function v(){},
cj:function cj(a){this.a=a},
bX:function bX(){},
an:function an(a,b,c,d){var _=this
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
cu:function cu(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bY:function bY(a){this.a=a},
cS:function cS(a){this.a=a},
bd:function bd(a){this.a=a},
co:function co(a){this.a=a},
bT:function bT(){},
dE:function dE(a){this.a=a},
d8:function d8(a){this.a=a},
c:function c(){},
B:function B(a,b,c){this.a=a
this.b=b
this.$ti=c},
bL:function bL(){},
k:function k(){},
be:function be(a){this.a=a},
cX:function cX(){},
bh:function bh(){this.b=this.a=0},
iG(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.aJ(a1,t.bM),c=A.aJ(a,t.R)
for(s=A.C(c),r=s.h("m(1)"),s=s.h("ai<1>"),q=s.h("c.E"),p=b,o=a2;;){n={}
m=A.fr(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.b(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.aa(k,p.b)
p=null}else j=A.et(k,c,d,o)
k.$flags&1&&A.aZ(k,"removeAt",1)
if(j<0||j>=k.length)A.am(A.eS(j,null))
B.a.k(c,new A.ak(o,k.splice(j,1)[0]))
o=B.d.D(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.aJ(new A.ai(c,r.a(new A.e1(n)),s),q)
l=A.C(f)
e=new A.ag(f,l.h("H(1)").a(new A.e2()),l.h("ag<1,H>")).ba(0)
B.a.k(d,e.a===1?e.ga5(0):null)
o=B.a.gO(f).a
B.a.E(c)}},
et(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=new A.dV(a),d=new A.dU(a)
if(a.length===1)return 0
s=(a0&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gO(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?d.$0():e.$0()
q=A.aJ(a,t.S)
B.a.bd(q)
if(B.a.gbT(q)>=10){p=q.length
o=p-2
if(!(o>=0))return A.b(q,o)
o=q[o]>=6
p=o}else p=!1
if(p){p=q.length
o=p-2
if(!(o>=0))return A.b(q,o)
return B.a.aa(a,q[o])}return d.$0()}for(n=-2,m=-2,l=0;l<q;++l){p=b[l]
k=p.b
if(((p.a&1)===0?B.b:B.c)===s)m=Math.max(m,k)
else n=Math.max(n,k)}if(q===1)q=((B.a.gO(b).a&1)===0?B.b:B.c)!==s
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
if(c.length!==0&&B.a.gO(c)===s){f=B.a.aa(a,n)
if(f>=0)return f}return e.$0()},
aa:function aa(a,b){this.a=a
this.b=b},
cR:function cR(a,b){this.a=a
this.b=b},
dv:function dv(){},
ds:function ds(){},
dt:function dt(){},
du:function du(a,b){this.a=a
this.b=b},
dw:function dw(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
e1:function e1(a){this.a=a},
e2:function e2(){},
dV:function dV(a){this.a=a},
dU:function dU(a){this.a=a},
fR(a,b){return new A.Q(a,b)},
fS(a){return new A.Q(B.a.b4(B.y,new A.d3(a)),B.a.b4(B.q,new A.d4(a)))},
W:function W(a,b){this.a=a
this.b=b},
P:function P(a,b,c){this.c=a
this.a=b
this.b=c},
Q:function Q(a,b){this.a=a
this.b=b},
d3:function d3(a){this.a=a},
d4:function d4(a){this.a=a},
iq(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.o(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.dl(s))
if(B.a.S(a7,new A.dP()))return a6
q=new A.dR(a6)
p=A.dl(t.H)
o=A.o(a5,t.L)
for(a5=a7.length,s=t._,n=!1,m=null,l=1,k=0,j=!1,i=!1,h=0;h<a7.length;a7.length===a5||(0,A.w)(a7),++h){g=a7[h]
A:{if(g instanceof A.b4){o.E(0)
m=g
l=1
k=0
j=!1
i=!1
break A}if(g instanceof A.ba){k=g.b
break A}f=g instanceof A.aD
if(f&&g.b)break A
if(f){p.k(0,(g.a&1)===0?B.b:B.c)
i=k===6
j=!0
break A}if(g instanceof A.b0){if(l===3&&!g.c)o.i(0,g.a,g.b)
break A}if(g instanceof A.bc){l=g.a+1
break A}if(g instanceof A.ar){e=g.a
f=m!=null
if(f&&m.e==null&&g.b>1)n=!0
if(!f||e==null)continue
if(i)q.$2(e,"game_seis_burro")
f=!j
if(f&&g.b===12)q.$2(e,"game_truco_12")
if(m.f)q.$2(e,"game_iron_hand")
for(d=m.d,c=m.b,r=0;r<4;++r){if(((r&1)===0?B.b:B.c)!==e)continue
if(f&&J.J(o.j(0,r),B.G))a6.j(0,r).k(0,"game_ace_river")
b=c.length
if(b!==4)continue
if(!(r<b))return A.b(c,r)
a=c[r]
if(a.length===3&&B.a.b3(a,new A.dQ()))a6.j(0,r).k(0,"game_666")
b=A.dl(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.w)(a),++a1){a2=a[a1]
if(a8.F(a2,d)>=10){a3=a8.F(a2,d)-10
if(!(a3>=0&&a3<4))return A.b(B.q,a3)
b.k(0,B.q[a3])}}for(a0=B.a9.gH(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.bH(a3.b))a6.j(0,r).k(0,a4)}}break A}if(g instanceof A.aE||g instanceof A.b1)break A
if(g instanceof A.aG){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.T(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dP:function dP(){},
dR:function dR(a){this.a=a},
dQ:function dQ(){},
fm(a){var s
A:{if(a instanceof A.K){s=A.o(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.ga9())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.O){s=A.a3(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.M){s=A.a3(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.S){s=A.a3(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
fl(a){var s,r,q=a.j(0,"s")
q.toString
A.E(q)
s=a.j(0,"t")
A:{if("play"===s){r=a.j(0,"c")
r.toString
q=new A.K(A.fS(A.ac(r)),J.J(a.j(0,"x"),!0),q)
break A}if("raise"===s){q=new A.O(q)
break A}if("accept"===s){q=new A.M(q)
break A}if("fold"===s){q=new A.S(q)
break A}q=A.am(A.ab("unknown action "+A.u(a.j(0,"t"))))}return q},
ct:function ct(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
d9:function d9(){},
da:function da(a){this.a=a},
db:function db(a){this.a=a},
dc:function dc(a){this.a=a},
aL:function aL(a,b){this.a=a
this.b=b},
dB:function dB(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
eW(b3,b4,b5,b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bN(b3,b4),b0=new A.dr(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
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
l=b3.gaw()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.cp(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.z(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cN(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.z(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.ga_()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.b(a2,a5)
a6=A.aK(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gaD()
a2=a9.gb7()
a3=b3.gar()
a7=b3.b_(b4)
a8=b3.r===B.k&&b3.as===b4
return new A.aw(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,b3.fr,A.cp(b3.dy,g,t.x),b9,b5,A.cp(c0.a,g,t.N),c0.bZ(b1),c0.d,b6,b7)},
hh(){var s=t.S
return new A.bV(A.o(s,t.N),A.a3([B.b,0,B.c,0],t.H,s))},
b9:function b9(a,b,c){this.a=a
this.b=b
this.c=c},
cN:function cN(a,b,c){this.a=a
this.b=b
this.c=c},
aw:function aw(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var _=this
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
dr:function dr(a){this.a=a},
d7:function d7(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bV:function bV(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
ab(a){return new A.cs(a)},
bW(a,b,c){var s,r,q,p,o,n=t.S,m=A.a3([B.b,0,B.c,0],t.H,n),l=A.e([],t.c4),k=t.x,j=J.e9(4,k)
for(s=t.Y,r=0;r<4;++r)j[r]=A.e([],s)
q=J.e9(4,k)
for(r=0;r<4;++r)q[r]=A.e([],s)
s=A.e([],t.d2)
p=A.e([],t.c5)
o=new A.bh()
o.ag(c)
n=new A.dx(b,o,m,l,B.d.D(a+3,4),B.h,j,q,s,p,A.o(n,k))
n.af()
return n},
hi(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.K
r=!1
if(s){r=b instanceof A.K
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
t.A.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
iu(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.w)(a),++r)q.push(a[r].b)
return A.fr(q)},
fr(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.am
if(q>=2)return B.an
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.aj(n)
if(l&&m!=null)return new A.aj(m)}if(s===3){if(2>=s)return A.b(a,2)
s=a[2]
return new A.aj(s==null?a[0]:s)}return null},
ap:function ap(a,b){this.a=a
this.b=b},
a_:function a_(){},
K:function K(a,b,c){this.b=a
this.c=b
this.a=c},
O:function O(a){this.a=a},
M:function M(a){this.a=a},
S:function S(a){this.a=a},
G:function G(){},
b4:function b4(a,b,c,d){var _=this
_.b=a
_.d=b
_.e=c
_.f=d},
b2:function b2(a,b){this.a=a
this.b=b},
b0:function b0(a,b,c){this.a=a
this.b=b
this.c=c},
ba:function ba(a,b,c){this.a=a
this.b=b
this.c=c},
bP:function bP(a){this.a=a},
aD:function aD(a,b){this.a=a
this.b=b},
bc:function bc(a){this.a=a},
ar:function ar(a,b){this.a=a
this.b=b},
aG:function aG(a){this.a=a},
b1:function b1(){},
aE:function aE(){},
a5:function a5(a,b,c){this.a=a
this.b=b
this.c=c},
bR:function bR(a,b,c){this.a=a
this.b=b
this.c=c},
cK:function cK(a,b,c){this.a=a
this.b=b
this.c=c},
cs:function cs(a){this.a=a},
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
bN:function bN(a,b){this.a=a
this.b=b},
H:function H(a,b){this.a=a
this.b=b},
iF(b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=null,a9="forfeit",b0=t.G,b1=t.N,b2=t.X,b3=b0.a(B.F.bJ(b5,a8)).K(0,b1,b2),b4=J.a9(b3,"rules")
b4.toString
b4=b0.a(b4).K(0,b1,b2)
h=A.h_(B.a1,t.aJ).j(0,b4.j(0,"manilhas"))
g=A.ch(b4.j(0,"coberta"))
f=A.ch(b4.j(0,"ferro"))
e=A.ch(b4.j(0,"verNoTruco"))
d=A.ch(b4.j(0,"verNaMaoDeOnze"))
c=A.ch(b4.j(0,"terceiraCarta"))
b=A.dM(b4.j(0,"tempo"))
b=b==null?a8:B.p.b9(b)
b4=A.dM(b4.j(0,"lento"))
b4=b4==null?a8:B.p.b9(b4)
if(h==null)h=B.z
if(b==null)b=20
if(b4==null)b4=0
b4=new A.dB("paulista","Truco",h,B.a6,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b,b4)
b=J.a9(b3,"seed")
b.toString
A.E(b)
c=J.a9(b3,"firstDealer")
c.toString
A.E(c)
d=J.J(J.a9(b3,"drawDealer"),!0)
e=A.e([],t.cG)
h=J.a9(b3,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.q
a=0
for(;a<h.length;h.length===g||(0,A.w)(h),++a){a0=h[a]
e.push(a0==null?a8:A.h0(B.a2,A.ac(a0),f))}h=t.d
g=A.e([],h)
f=t.k.a(J.a9(b3,"log"))
if(f==null)f=B.a5
a1=f.length
a=0
for(;a<f.length;f.length===a1||(0,A.w)(f),++a)g.push(b0.a(f[a]).K(0,b1,b2))
f=t.S
a1=A.hh()
a2=A.z(e,t.ch)
if(!d)a3=g.length!==0&&J.J(B.a.gO(g).j(0,"t"),"draw")
else a3=!0
a4=new A.ct(a3,B.r,A.o(f,f),b4,b,c,a2,A.e([],h),B.T,a1,A.dl(f))
a4.bg(e,d,c,g,a8,b4,b)
s=a4
r=null
q=null
b=t.a5.a(J.a9(b3,"act"))
p=b==null?a8:b.K(0,b1,b2)
try{if(A.ep(J.a9(b3,a9))){b0=J.a9(b3,a9)
b0.toString
a5=s.a4(A.E(b0))}else if(J.J(J.a9(b3,"timeout"),!0)){b0=s.bX(A.fb(J.a9(b3,"missLimit")))
a5=b0}else{if(p==null){b0=s
a6=A.o(f,t.Q)
b0.X(a6)
if(a6.a===0)b0.R(a6,0)
b0=a6}else{b4=p.j(0,"seat")
b4.toString
A.E(b4)
h=p.j(0,"action")
h.toString
b2=s.bG(b4,b0.a(h).K(0,b1,b2))
b0=b2}a5=b0}o=a5
n=A.o(f,t.W)
for(b0=o,b0=new A.a2(b0,A.h(b0).h("a2<1,2>")).gq(0);b0.n();){b2=b0.d
b2.toString
m=b2
b2=m.a
l=[]
for(b4=m.b,h=b4.length,a=0;a<b4.length;b4.length===h||(0,A.w)(b4),++a){k=b4[a]
J.e5(l,k.M())}J.fI(n,b2,l)}r=n}catch(a7){n=A.ey(a7)
if(n instanceof A.cs){j=n
q=j.a
r=B.H}else{i=n
q=A.u(i)
r=B.H}}n=s.z
n===$&&A.I()
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
b2=s.gaF()
if(b2!=null)b0.i(0,"waitingFor",b2)
if(s.ga1())b0.i(0,"reveal",!0)
if(s.b)b0.i(0,"draw",!0)
b2=A.e([],t.bc)
for(b4=n.d,h=B.a.gq(b4),g=new A.aQ(h,t.ca),f=t.B;g.n();){e=f.a(h.gp())
d=A.o(b1,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b2.push(d)}b0.i(0,"hands",b2)
if(n.r===B.i){l=A.o(b1,t.a)
for(b1=A.iq(b4,n.a),b1=new A.a2(b1,A.h(b1).h("a2<1,2>")).gq(0);b1.n();){m=b1.d
b2=m.b
if(b2.gu(b2)){b4=m.a
b2=A.aJ(b2,A.h(b2).c)
l.i(0,""+b4,b2)}}b0.i(0,"feats",l)}n=n.fr
if(n!=null)b0.i(0,a9,n.b)
n=q
if(n!=null)b0.i(0,"error",n)
return B.F.bL(b0,a8)},
iC(){var s,r=v.G.globalThis,q=new A.e_()
if(typeof q=="function")A.am(A.d2("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hM,q)
s[$.ez()]=q
r.trucoEngine=s},
e_:function e_(){},
fu(a){return v.mangledGlobalNames[a]},
iH(a){throw A.L(new A.bC("Field '"+a+"' has been assigned during initialization."),new Error())},
I(){throw A.L(A.h9(""),new Error())},
hM(a,b,c){t.Z.a(a)
if(A.E(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.eb.prototype={}
J.cv.prototype={
C(a,b){return a===b},
gv(a){return A.bO(a)},
l(a){return"Instance of '"+A.cM(a)+"'"},
gB(a){return A.aW(A.en(this))}}
J.cx.prototype={
l(a){return String(a)},
gv(a){return a?519018:218159},
gB(a){return A.aW(t.y)},
$ip:1,
$im:1}
J.bw.prototype={
C(a,b){return null==b},
l(a){return"null"},
gv(a){return 0},
$ip:1}
J.by.prototype={$iy:1}
J.at.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.cL.prototype={}
J.bf.prototype={}
J.as.prototype={
l(a){var s=a[$.fw()]
if(s==null)s=a[$.ez()]
if(s==null)return this.bf(a)
return"JavaScript function for "+J.ci(s)},
$iaF:1}
J.bx.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.bz.prototype={
gv(a){return 0},
l(a){return String(a)}}
J.j.prototype={
k(a,b){A.C(a).c.a(b)
a.$flags&1&&A.aZ(a,29)
a.push(b)},
bW(a,b){var s
a.$flags&1&&A.aZ(a,"remove",1)
for(s=0;s<a.length;++s)if(J.J(a[s],b)){a.splice(s,1)
return!0}return!1},
W(a,b){var s,r
A.C(a).h("c<1>").a(b)
a.$flags&1&&A.aZ(a,"addAll",2)
if(Array.isArray(b)){this.bj(a,b)
return}for(s=b.length,r=0;r<b.length;b.length===s||(0,A.w)(b),++r)a.push(b[r])},
bj(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.Z(a))
for(r=0;r<s;++r)a.push(b[r])},
E(a){a.$flags&1&&A.aZ(a,"clear","clear")
a.length=0},
b4(a,b){var s,r,q
A.C(a).h("m(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.Z(a))}throw A.d(A.bu())},
G(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
be(a,b,c){var s=a.length
if(b>s)throw A.d(A.aN(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aN(c,b,s,"end",null))
if(b===c)return A.e([],A.C(a))
return A.e(a.slice(b,c),A.C(a))},
gO(a){if(a.length>0)return a[0]
throw A.d(A.bu())},
gbT(a){var s=a.length
if(s>0)return a[s-1]
throw A.d(A.bu())},
ga5(a){var s=a.length
if(s===1){if(0>=s)return A.b(a,0)
return a[0]}if(s===0)throw A.d(A.bu())
throw A.d(A.eG())},
S(a,b){var s,r
A.C(a).h("m(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.Z(a))}return!1},
b3(a,b){var s,r
A.C(a).h("m(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.Z(a))}return!0},
bd(a){var s,r,q,p,o,n
a.$flags&2&&A.aZ(a,"sort")
s=a.length
if(s<2)return
if(s===2){r=a[0]
q=a[1]
p=J.eH(r,q)
if(typeof p!=="number")return p.c3()
if(p>0){a[0]=q
a[1]=r}return}o=0
if(A.C(a).c.b(null))for(n=0;n<a.length;++n)if(a[n]===void 0){a[n]=null;++o}a.sort(A.ij(J.hW(),2))
if(o>0)this.bz(a,o)},
bz(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
ae(a,b){var s,r,q,p
a.$flags&2&&A.aZ(a,"shuffle")
s=a.length
while(s>1){r=b.a0(s);--s
q=a.length
if(!(s<q))return A.b(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.b(a,r)
a[s]=a[r]
a[r]=p}},
aa(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.b(a,s)
if(J.J(a[s],b))return s}return-1},
T(a,b){var s
for(s=0;s<a.length;++s)if(J.J(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gu(a){return a.length!==0},
l(a){return A.e8(a,"[","]")},
gq(a){return new J.aA(a,a.length,A.C(a).h("aA<1>"))},
gv(a){return A.bO(a)},
gm(a){return a.length},
i(a,b,c){A.C(a).c.a(c)
a.$flags&2&&A.aZ(a)
if(!(b>=0&&b<a.length))throw A.d(A.fp(a,b))
a[b]=c},
bU(a,b){var s,r
A.C(a).h("m(1)").a(b)
s=a.length-1
if(s<0)return-1
for(r=s;r>=0;--r){if(!(r<a.length))return A.b(a,r)
if(b.$1(a[r]))return r}return-1},
$if:1,
$ic:1,
$ii:1}
J.cw.prototype={
c_(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cM(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.dd.prototype={}
J.aA.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.w(q)
throw A.d(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ix:1}
J.b5.prototype={
b1(a,b){var s
A.fc(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gaB(b)
if(this.gaB(a)===s)return 0
if(this.gaB(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gaB(a){return a===0?1/a<0:a<0},
b9(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.bZ(""+a+".toInt()"))},
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
V(a,b){return(a|0)===a?a/b|0:this.bD(a,b)},
bD(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.bZ("Result of truncating division is "+A.u(s)+": "+A.u(a)+" ~/ "+b))},
aY(a,b){var s
if(a>0)s=this.bB(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bB(a,b){return b>31?0:a>>>b},
gB(a){return A.aW(t.o)},
$iaf:1,
$in:1,
$iT:1}
J.bv.prototype={
gB(a){return A.aW(t.S)},
$ip:1,
$ia:1}
J.cy.prototype={
gB(a){return A.aW(t.i)},
$ip:1}
J.aH.prototype={
a2(a,b,c){return a.substring(b,A.he(b,c,a.length))},
b1(a,b){var s
A.ac(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
l(a){return a},
gv(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gB(a){return A.aW(t.N)},
gm(a){return a.length},
$ip:1,
$iaf:1,
$il:1}
A.bg.prototype={
gq(a){var s=this.a
return new A.bp(s.gq(s),A.h(this).h("bp<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
l(a){return this.a.l(0)}}
A.bp.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$ix:1}
A.aB.prototype={}
A.c1.prototype={$if:1}
A.aC.prototype={
K(a,b,c){return new A.aC(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("aC<1,2,3,4>"))},
j(a,b){return this.$ti.h("4?").a(this.a.j(0,b))},
I(a,b){this.a.I(0,new A.d6(this,this.$ti.h("~(3,4)").a(b)))},
gJ(){var s=this.$ti
return A.fT(this.a.gJ(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gu(a){var s=this.a
return s.gu(s)},
gH(){return this.a.gH().aC(0,new A.d5(this),this.$ti.h("B<3,4>"))}}
A.d6.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d5.prototype={
$1(a){var s=this.a.$ti
s.h("B<1,2>").a(a)
return new A.B(s.y[2].a(a.a),s.y[3].a(a.b),s.h("B<3,4>"))},
$S(){return this.a.$ti.h("B<3,4>(B<1,2>)")}}
A.bC.prototype={
l(a){return"LateInitializationError: "+this.a}}
A.dq.prototype={}
A.f.prototype={}
A.D.prototype={
gq(a){var s=this
return new A.a4(s,s.gm(s),A.h(s).h("a4<D.E>"))},
gt(a){return this.gm(this)===0},
aC(a,b,c){var s=A.h(this)
return new A.ag(this,s.A(c).h("1(D.E)").a(b),s.h("@<D.E>").A(c).h("ag<1,2>"))},
ba(a){var s,r=this,q=A.eL(A.h(r).h("D.E"))
for(s=0;s<r.gm(r);++s)q.k(0,r.G(0,s))
return q}}
A.bU.prototype={
gbs(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbC(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
G(a,b){var s=this,r=s.gbC()+b,q=s.gbs()
if(r>=q)throw A.d(A.e7(b,s.gm(0),s,"index"))
return J.e6(s.a,r)},
bY(a){var s,r,q,p,o=this,n=o.b,m=o.a,l=m.length,k=o.c
if(k!=null&&k<l)l=k
s=l-n
if(s<=0){m=J.ea(0,o.$ti.c)
return m}r=J.bn(m)
q=A.eM(s,r.G(m,n),!0,o.$ti.c)
for(p=1;p<s;++p){B.a.i(q,p,r.G(m,n+p))
if(m.length<l)throw A.d(A.Z(o))}return q}}
A.a4.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dS(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.Z(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.G(q,s);++r.c
return!0},
$ix:1}
A.aM.prototype={
gq(a){return new A.bG(J.az(this.a),this.b,A.h(this).h("bG<1,2>"))},
gm(a){return J.d1(this.a)},
gt(a){return J.fL(this.a)}}
A.bt.prototype={$if:1}
A.bG.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$ix:1}
A.ag.prototype={
gm(a){return J.d1(this.a)},
G(a,b){return this.b.$1(J.e6(this.a,b))}}
A.ai.prototype={
gq(a){return new A.c_(J.az(this.a),this.b,this.$ti.h("c_<1>"))}}
A.c_.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$ix:1}
A.c0.prototype={
gq(a){return new A.aQ(J.az(this.a),this.$ti.h("aQ<1>"))}}
A.aQ.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$ix:1}
A.t.prototype={
sm(a,b){throw A.d(A.bZ("Cannot change the length of a fixed-length list"))},
k(a,b){A.al(a).h("t.E").a(b)
throw A.d(A.bZ("Cannot add to a fixed-length list"))},
W(a,b){A.al(a).h("c<t.E>").a(b)
throw A.d(A.bZ("Cannot add to a fixed-length list"))}}
A.bQ.prototype={
gm(a){return this.a.length},
G(a,b){var s=this.a
return J.e6(s,s.length-1-b)}}
A.aj.prototype={$r:"+winner(1)",$s:1}
A.ak.prototype={$r:"+(1,2)",$s:2}
A.c8.prototype={$r:"+points,winner(1,2)",$s:3}
A.br.prototype={}
A.bq.prototype={
K(a,b,c){var s=A.h(this)
return A.eN(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
l(a){return A.ee(this)},
gH(){return new A.bj(this.bN(),A.h(this).h("bj<B<1,2>>"))},
bN(){var s=this
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
gaV(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
N(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
j(a,b){if(!this.N(b))return null
return this.b[this.a[b]]},
I(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaV()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gJ(){return new A.c2(this.gaV(),this.$ti.h("c2<1>"))}}
A.c2.prototype={
gm(a){return this.a.length},
gt(a){return 0===this.a.length},
gu(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.aR(s,s.length,this.$ti.h("aR<1>"))}}
A.aR.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ix:1}
A.bs.prototype={
k(a,b){A.h(this).c.a(b)
A.fZ()}}
A.aq.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gu(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aR(s,s.length,this.$ti.h("aR<1>"))},
bv(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.bA(o.$ti.h("bA<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.w)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
T(a,b){return this.bv().N(b)}}
A.bS.prototype={}
A.dC.prototype={
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
A.bM.prototype={
l(a){return"Null check operator used on a null value"}}
A.cz.prototype={
l(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cT.prototype={
l(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.dp.prototype={
l(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.ao.prototype={
l(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.fv(r==null?"unknown":r)+"'"},
$iaF:1,
gc2(){return this},
$C:"$1",
$R:1,
$D:null}
A.cl.prototype={$C:"$0",$R:0}
A.cm.prototype={$C:"$2",$R:2}
A.cQ.prototype={}
A.cP.prototype={
l(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.fv(s)+"'"}}
A.b_.prototype={
C(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.b_))return!1
return this.$_target===b.$_target&&this.a===b.a},
gv(a){return(A.ex(this.a)^A.bO(this.$_target))>>>0},
l(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cM(this.a)+"'")}}
A.cO.prototype={
l(a){return"RuntimeError: "+this.a}}
A.a0.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gu(a){return this.a!==0},
gJ(){return new A.V(this,A.h(this).h("V<1>"))},
gH(){return new A.a2(this,A.h(this).h("a2<1,2>"))},
N(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bO(a)},
bO(a){var s=this.d
if(s==null)return!1
return this.ab(this.aU(s,a),a)>=0},
av(a){return new A.V(this,A.h(this).h("V<1>")).S(0,new A.df(this,a))},
W(a,b){A.h(this).h("A<1,2>").a(b).I(0,new A.de(this))},
j(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.bP(b)},
bP(a){var s,r,q=this.d
if(q==null)return null
s=this.aU(q,a)
r=this.ab(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.h(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.aJ(s==null?q.b=q.ao():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.aJ(r==null?q.c=q.ao():r,b,c)}else q.bQ(b,c)},
bQ(a,b){var s,r,q,p,o=this,n=A.h(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ao()
r=o.az(a)
q=s[r]
if(q==null)s[r]=[o.ah(a,b)]
else{p=o.ab(q,a)
if(p>=0)q[p].b=b
else q.push(o.ah(a,b))}},
E(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aW()}},
I(a,b){var s,r,q=this
A.h(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.Z(q))
s=s.c}},
aJ(a,b,c){var s,r=A.h(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ah(b,c)
else s.b=c},
aW(){this.r=this.r+1&1073741823},
ah(a,b){var s=this,r=A.h(s),q=new A.dj(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aW()
return q},
az(a){return J.ae(a)&1073741823},
aU(a,b){return a[this.az(b)]},
ab(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.J(a[r].a,b))return r
return-1},
l(a){return A.ee(this)},
ao(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ied:1}
A.df.prototype={
$1(a){var s=this.a
return J.J(s.j(0,A.h(s).c.a(a)),this.b)},
$S(){return A.h(this.a).h("m(1)")}}
A.de.prototype={
$2(a,b){var s=this.a,r=A.h(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.h(this.a).h("~(1,2)")}}
A.dj.prototype={}
A.V.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.aI(s,s.r,s.e,this.$ti.h("aI<1>"))}}
A.aI.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Z(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ix:1}
A.bF.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bE(s,s.r,s.e,this.$ti.h("bE<1>"))}}
A.bE.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Z(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ix:1}
A.a2.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bD(s,s.r,s.e,this.$ti.h("bD<1,2>"))}}
A.bD.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Z(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.B(s.a,s.b,r.$ti.h("B<1,2>"))
r.c=s.c
return!0}},
$ix:1}
A.bA.prototype={
az(a){return A.ii(a)&1073741823},
ab(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.J(a[r].a,b))return r
return-1}}
A.dW.prototype={
$1(a){return this.a(a)},
$S:2}
A.dX.prototype={
$2(a,b){return this.a(a,b)},
$S:7}
A.dY.prototype={
$1(a){return this.a(A.ac(a))},
$S:8}
A.a7.prototype={
l(a){return this.aZ(!1)},
aZ(a){var s,r,q,p,o,n=this.bt(),m=this.am(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.b(m,q)
o=m[q]
l=a?l+A.eQ(o):l+A.u(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
bt(){var s,r=this.$s
while($.dJ.length<=r)B.a.k($.dJ,null)
s=$.dJ[r]
if(s==null){s=this.bo()
B.a.i($.dJ,r,s)}return s},
bo(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.e9(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.z(j,k)}}
A.aU.prototype={
am(){return[this.a,this.b]},
C(a,b){if(b==null)return!1
return b instanceof A.aU&&this.$s===b.$s&&J.J(this.a,b.a)&&J.J(this.b,b.b)},
gv(a){return A.eO(this.$s,this.a,this.b,B.j)}}
A.bi.prototype={
am(){return[this.a]},
C(a,b){if(b==null)return!1
return b instanceof A.bi&&this.$s===b.$s&&J.J(this.a,b.a)},
gv(a){return A.eO(this.$s,this.a,B.j,B.j)}}
A.b7.prototype={
gB(a){return B.as},
$ip:1}
A.bJ.prototype={}
A.cB.prototype={
gB(a){return B.at},
$ip:1}
A.b8.prototype={
gm(a){return a.length},
$iU:1}
A.bH.prototype={$if:1,$ic:1,$ii:1}
A.bI.prototype={$if:1,$ic:1,$ii:1}
A.cC.prototype={
gB(a){return B.au},
$ip:1}
A.cD.prototype={
gB(a){return B.av},
$ip:1}
A.cE.prototype={
gB(a){return B.aw},
$ip:1}
A.cF.prototype={
gB(a){return B.ax},
$ip:1}
A.cG.prototype={
gB(a){return B.ay},
$ip:1}
A.cH.prototype={
gB(a){return B.aA},
$ip:1}
A.cI.prototype={
gB(a){return B.aB},
$ip:1}
A.bK.prototype={
gB(a){return B.aC},
gm(a){return a.length},
$ip:1}
A.cJ.prototype={
gB(a){return B.aD},
gm(a){return a.length},
$ip:1}
A.c4.prototype={}
A.c5.prototype={}
A.c6.prototype={}
A.c7.prototype={}
A.a6.prototype={
h(a){return A.cf(v.typeUniverse,this,a)},
A(a){return A.f8(v.typeUniverse,this,a)}}
A.cW.prototype={}
A.d0.prototype={
l(a){return A.X(this.a,null)}}
A.cV.prototype={
l(a){return this.a}}
A.cb.prototype={}
A.ca.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bA(a,b){var s,r,q
a=A.E(a)
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
o.d=null}q=o.bA(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.f2
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
o.a=A.f2
throw n
return!1}if(0>=p.length)return A.b(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eU("sync*"))}return!1},
c4(a){var s,r,q=this
if(a instanceof A.bj){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.az(a)
return 2}},
$ix:1}
A.bj.prototype={
gq(a){return new A.ca(this.a(),this.$ti.h("ca<1>"))}}
A.aS.prototype={
gq(a){var s=this,r=new A.c3(s,s.r,A.h(s).h("c3<1>"))
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
return t.g.a(r[b])!=null}else return this.bp(b)},
bp(a){var s=this.d
if(s==null)return!1
return this.aS(s[this.aO(a)],a)>=0},
k(a,b){var s,r,q=this
A.h(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aK(s==null?q.b=A.ek():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aK(r==null?q.c=A.ek():r,b)}else return q.bi(b)},
bi(a){var s,r,q,p=this
A.h(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.ek()
r=p.aO(a)
q=s[r]
if(q==null)s[r]=[p.ap(a)]
else{if(p.aS(q,a)>=0)return!1
q.push(p.ap(a))}return!0},
E(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aN()}},
aK(a,b){A.h(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.ap(b)
return!0},
aN(){this.r=this.r+1&1073741823},
ap(a){var s,r=this,q=new A.d_(A.h(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.aN()
return q},
aO(a){return J.ae(a)&1073741823},
aS(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.J(a[r].a,b))return r
return-1}}
A.d_.prototype={}
A.c3.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.Z(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$ix:1}
A.dk.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:9}
A.r.prototype={
gq(a){return new A.a4(a,a.length,A.al(a).h("a4<r.E>"))},
G(a,b){if(!(b>=0&&b<a.length))return A.b(a,b)
return a[b]},
gt(a){return a.length===0},
gu(a){return a.length!==0},
k(a,b){var s
A.al(a).h("r.E").a(b)
s=a.length
this.sm(a,s+1)
if(!(s<a.length))return A.b(a,s)
a[s]=b},
W(a,b){var s,r,q
A.al(a).h("c<r.E>").a(b)
s=a.length
for(r=b.length,q=0;q<b.length;b.length===r||(0,A.w)(b),++q){this.k(a,b[q]);++s}},
l(a){return A.e8(a,"[","]")}}
A.q.prototype={
K(a,b,c){var s=A.h(this)
return A.eN(this,s.h("q.K"),s.h("q.V"),b,c)},
I(a,b){var s,r,q,p=A.h(this)
p.h("~(q.K,q.V)").a(b)
for(s=this.gJ(),s=s.gq(s),p=p.h("q.V");s.n();){r=s.gp()
q=this.j(0,r)
b.$2(r,q==null?p.a(q):q)}},
gH(){return this.gJ().aC(0,new A.dm(this),A.h(this).h("B<q.K,q.V>"))},
gm(a){var s=this.gJ()
return s.gm(s)},
gt(a){var s=this.gJ()
return s.gt(s)},
gu(a){var s=this.gJ()
return s.gu(s)},
l(a){return A.ee(this)},
$iA:1}
A.dm.prototype={
$1(a){var s=this.a,r=A.h(s)
r.h("q.K").a(a)
s=s.j(0,a)
if(s==null)s=r.h("q.V").a(s)
return new A.B(a,s,r.h("B<q.K,q.V>"))},
$S(){return A.h(this.a).h("B<q.K,q.V>(q.K)")}}
A.dn.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.u(a)
r.a=(r.a+=s)+": "
s=A.u(b)
r.a+=s},
$S:3}
A.cg.prototype={}
A.b6.prototype={
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
A.aP.prototype={
K(a,b,c){return new A.aP(this.a.K(0,b,c),b.h("@<0>").A(c).h("aP<1,2>"))}}
A.au.prototype={
gt(a){return this.gm(this)===0},
gu(a){return this.gm(this)!==0},
W(a,b){var s
for(s=J.az(A.h(this).h("c<1>").a(b));s.n();)this.k(0,s.gp())},
bH(a){var s
for(s=a.gq(a);s.n();)if(!this.T(0,s.gp()))return!1
return!0},
ga5(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.eG())
s=r.gq(r)
if(!s.n())throw A.d(A.bu())
return s.gp()},
l(a){return A.e8(this,"{","}")},
$if:1,
$ic:1,
$iaO:1}
A.c9.prototype={}
A.bk.prototype={}
A.cY.prototype={
j(a,b){var s,r=this.b
if(r==null)return this.c.j(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.by(b):s}},
gm(a){return this.b==null?this.c.a:this.a6().length},
gt(a){return this.gm(0)===0},
gu(a){return this.gm(0)>0},
gJ(){if(this.b==null){var s=this.c
return new A.V(s,A.h(s).h("V<1>"))}return new A.cZ(this)},
I(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.I(0,b)
s=o.a6()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dN(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.Z(o))}},
a6(){var s=t.k.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
by(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dN(this.a[a])
return this.b[a]=s}}
A.cZ.prototype={
gm(a){return this.a.gm(0)},
G(a,b){var s=this.a
if(s.b==null)s=s.gJ().G(0,b)
else{s=s.a6()
if(!(b<s.length))return A.b(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gJ()
s=s.gq(s)}else{s=s.a6()
s=new J.aA(s,s.length,A.C(s).h("aA<1>"))}return s}}
A.cn.prototype={}
A.cq.prototype={}
A.bB.prototype={
l(a){var s=A.cr(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cA.prototype={
l(a){return"Cyclic error in JSON stringify"}}
A.dg.prototype={
bJ(a,b){var s=A.i8(a,this.gbK().a)
return s},
bL(a,b){var s=A.ho(a,this.gbM().b,null)
return s},
gbM(){return B.a0},
gbK(){return B.a_}}
A.di.prototype={}
A.dh.prototype={}
A.dH.prototype={
bc(a){var s,r,q,p,o,n,m=a.length
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
if(a==null?p==null:a===p)throw A.d(new A.cA(a,null))}B.a.k(s,a)},
ad(a){var s,r,q,p,o=this
if(o.bb(a))return
o.ai(a)
try{s=o.b.$1(a)
if(!o.bb(s)){q=A.eI(a,null,o.gaX())
throw A.d(q)}q=o.a
if(0>=q.length)return A.b(q,-1)
q.pop()}catch(p){r=A.ey(p)
q=A.eI(a,r,o.gaX())
throw A.d(q)}},
bb(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.p.l(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.bc(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.ai(a)
q.c0(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return!0}else if(t.G.b(a)){q.ai(a)
r=q.c1(a)
s=q.a
if(0>=s.length)return A.b(s,-1)
s.pop()
return r}else return!1},
c0(a){var s,r=this.c
r.a+="["
if(J.fM(a)){if(0>=a.length)return A.b(a,0)
this.ad(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.ad(a[s])}}r.a+="]"},
c1(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.eM(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.I(0,new A.dI(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.bc(A.ac(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.b(r,n)
m.ad(r[n])}p.a+="}"
return!0}}
A.dI.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:3}
A.dG.prototype={
gaX(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cU.prototype={
l(a){return this.Y()},
$ib3:1}
A.v.prototype={}
A.cj.prototype={
l(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cr(s)
return"Assertion failed"}}
A.bX.prototype={}
A.an.prototype={
gal(){return"Invalid argument"+(!this.a?"(s)":"")},
gak(){return""},
l(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gal()+q+o
if(!s.a)return n
return n+s.gak()+": "+A.cr(s.gaA())},
gaA(){return this.b}}
A.bb.prototype={
gaA(){return A.dM(this.b)},
gal(){return"RangeError"},
gak(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.u(q):""
else if(q==null)s=": Not greater than or equal to "+A.u(r)
else if(q>r)s=": Not in inclusive range "+A.u(r)+".."+A.u(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.u(r)
return s}}
A.cu.prototype={
gaA(){return A.E(this.b)},
gal(){return"RangeError"},
gak(){if(A.E(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bY.prototype={
l(a){return"Unsupported operation: "+this.a}}
A.cS.prototype={
l(a){return"UnimplementedError: "+this.a}}
A.bd.prototype={
l(a){return"Bad state: "+this.a}}
A.co.prototype={
l(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cr(s)+"."}}
A.bT.prototype={
l(a){return"Stack Overflow"},
$iv:1}
A.dE.prototype={
l(a){return"Exception: "+this.a}}
A.d8.prototype={
l(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.c.prototype={
aC(a,b,c){var s=A.h(this)
return A.hd(this,s.A(c).h("1(c.E)").a(b),s.h("c.E"),c)},
S(a,b){var s
A.h(this).h("m(c.E)").a(b)
for(s=this.gq(this);s.n();)if(b.$1(s.gp()))return!0
return!1},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gu(a){return!this.gt(this)},
gO(a){var s=this.gq(this)
if(!s.n())throw A.d(A.bu())
return s.gp()},
G(a,b){var s,r
A.eg(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.e7(b,b-r,this,"index"))},
l(a){return A.h6(this,"(",")")}}
A.B.prototype={
l(a){return"MapEntry("+A.u(this.a)+": "+A.u(this.b)+")"}}
A.bL.prototype={
gv(a){return A.k.prototype.gv.call(this,0)},
l(a){return"null"}}
A.k.prototype={$ik:1,
C(a,b){return this===b},
gv(a){return A.bO(this)},
l(a){return"Instance of '"+A.cM(this)+"'"},
gB(a){return A.is(this)},
toString(){return this.l(this)}}
A.be.prototype={
gm(a){return this.a.length},
l(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ihg:1}
A.cX.prototype={
a0(a){if(a<=0||a>4294967296)throw A.d(A.eR(u.c+a))
return Math.random()*a>>>0},
L(){return Math.random()},
$ief:1}
A.bh.prototype={
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
if(a<=0||a>4294967296)throw A.d(A.eR(u.c+a))
s=a-1
if((a&s)>>>0===0){p.U()
return(p.a&s)>>>0}do{p.U()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
L(){var s,r=this
r.U()
s=r.a
r.U()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$ief:1}
A.aa.prototype={
Y(){return"AiLevel."+this.b}}
A.cR.prototype={
b2(a){var s,r,q=this,p=a.a,o=a.b,n=p.b6(o)
if(n.length===0)throw A.d(A.eU("no legal action for "+o))
if(p.cx){p=t.db
s=new A.ai(new A.c0(n,p),p.h("m(c.E)").a(new A.dv()),p.h("ai<c.E>"))
return s.G(0,q.b.a0(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.bq(a)
break A}if(B.f===r){p=q.bk(a,n)
break A}p=q.bw(a,n)
break A}return p},
ga7(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
bq(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.n){s=a.b
return l.b.L()<0.6?new A.M(s):new A.S(s)}r=l.ac(a,l.ga7())
s=a.a
q=s.a
p=q.f
o=B.a.gO(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.j(0,m)
m.toString
if(m+o>=q.r)return new A.M(n)
return r>(p-o)/(2*p)+l.a3(0.08)?new A.M(n):new A.S(n)},
bk(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.S(t.U.a(b),new A.ds()),g=i.a
if(g===B.n){s=i.b.L()
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
q=i.ac(a,i.ga7())
g=g===B.o
k=q-(g?0:0.08)
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.j(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.O(q):new A.M(q)
if(h&&k>0.78+i.a3(0.05))return new A.O(q)
j=g&&i.b.L()<0.06
return(2*k-1)*l>-m+i.a3(0.3)||j?new A.M(q):new A.S(q)},
bw(a,b){t.U.a(b)
if(B.a.S(b,new A.dt())&&this.bE(a))return new A.O(a.b)
return this.bn(a,b)},
bE(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.j(0,q)
q.toString
if(q+p.gaw()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.L()<0.08
case 1:return r.ac(a,r.ga7())>0.72+r.a3(0.06)||r.b.L()<0.03
case 2:s=r.ac(a,r.ga7())
if(s>0.9&&a.ga_().length>1&&r.b.L()<0.8)return!1
if(s>0.62+r.a3(0.03))return!0
return A.z(p.z,t.F).length!==0&&s<0.3&&r.b.L()<0.04}},
a3(a){return(this.b.L()*2-1)*a},
bn(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.ga_()
r=f.a
if(r===B.n&&f.b.L()<0.55){r=s.length
q=f.b.a0(r)
if(!(q>=0&&q<r))return A.b(s,q)
return new A.K(s[q],!1,a.b)}r=r===B.o
if(r&&s.length>1)p=f.bl(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.F(s[l],n.y))
k=A.e([],t.w)
for(j=A.z(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.F(h.b,n.y)
k.push(new A.ak(h.a,g))}m=A.e([],t.v)
for(n=A.z(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.et(q,k,m,a.b)
if(!(q>=0&&q<o))return A.b(s,q)
p=s[q]}if(r&&a.a.gar()&&!f.bF(a,p)&&f.b.L()<0.5)return new A.K(p,!0,a.b)
return new A.K(p,!1,a.b)},
bF(a,b){var s=a.a,r=s.a.F(b,s.y)
return B.a.b3(A.z(s.Q,t.n),new A.du(a,r))},
bl(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.ga_(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.F(e[p],r.y))
o=A.e([],t.w)
for(n=A.z(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.F(l.b,r.y)
o.push(new A.ak(l.a,k))}q=A.e([],t.v)
for(r=A.z(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.et(d,o,q,a.b)
if(!(d>=0&&d<s))return A.b(e,d)
j=e[d]
i=this.aG(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.C(0,j))continue
f=this.aG(a,g,160)
if(f>i){i=f
h=g}}return h},
aG(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbS()
r=A.e([],t.Y)
for(q=$.e4(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.T(0,n))r.push(n)}q=b8.b
m=B.d.D(q+2,4)
l=b8.gaD()
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
a6=A.hc(4,new A.dw(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.D(a0,4),B.d.D(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.b(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.aK(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.F(b4.b,p.y)
a8.push(new A.ak(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.aK(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.iG(a8,j?null:new A.ak(q,k.F(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
ac(a,b){return this.aG(a,null,b)}}
A.dv.prototype={
$1(a){return!t.D.a(a).c},
$S:10}
A.ds.prototype={
$1(a){return t.M.a(a) instanceof A.O},
$S:0}
A.dt.prototype={
$1(a){return t.M.a(a) instanceof A.O},
$S:0}
A.du.prototype={
$1(a){return this.a.a.aI(t.n.a(a))<this.b},
$S:4}
A.dw.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.ga_(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.F(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.r:s}else n=B.r
i=i.a
s=i.w
if(!(a<s.length))return A.b(s,a)
m=A.z(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.w)(n),++o)s.push(q.F(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.b(r,k)
s.push(q.F(r[k],i.y))}p.a+=m
return s},
$S:11}
A.e1.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:12}
A.e2.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:13}
A.dV.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o<s[q])q=p}return q},
$S:5}
A.dU.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.b(s,q)
if(o>s[q])q=p}return q},
$S:5}
A.W.prototype={
Y(){return"Suit."+this.b}}
A.P.prototype={
Y(){return"Rank."+this.b}}
A.Q.prototype={
ga9(){var s=this.b.b
if(0>=s.length)return A.b(s,0)
return this.a.c+s[0]},
C(a,b){if(b==null)return!1
return b instanceof A.Q&&b.a===this.a&&b.b===this.b},
gv(a){return this.a.a*4+this.b.a},
l(a){return this.ga9()}}
A.d3.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.l.a2(s,0,s.length-1)},
$S:14}
A.d4.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.b(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.b(s,q)
return p===s[q]},
$S:15}
A.dP.prototype={
$1(a){return t.E.a(a) instanceof A.aE},
$S:16}
A.dR.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.j(0,r).k(0,b)},
$S:17}
A.dQ.prototype={
$1(a){return t.L.a(a).a===B.L},
$S:18}
A.ct.prototype={
bg(a,b,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
if(c.a){if(a1.length===0)B.a.k(c.x,B.ae)
c.b=!0
s=A.aJ($.e4(),t.L)
r=c.f
q=new A.bh()
q.ag((r^625341585)>>>0)
B.a.ae(s,q)
c.c=A.ei(s,0,A.ih(20,"count",t.S),A.C(s).c).bY(0)
s=c.e
c.z=A.bW(3,s,(r^1540483477)>>>0)
p=r
r=s
s=p}else{s=c.e
r=c.f
c.z=A.bW(c.r,s,r)
p=r
r=s
s=p}for(q=a1.length,o=c.x,n=t.f,m=c.r,l=c.Q,k=l.a,j=c.at,i=c.d,h=0;h<a1.length;a1.length===q||(0,A.w)(a1),++h){g=n.a(a1[h])
f=g.j(0,"t")
e=J.ay(f)
if(!e.C(f,"draw"))if(e.C(f,"pick")){e=g.j(0,"s")
e.toString
A.E(e)
d=g.j(0,"i")
d.toString
i.i(0,e,A.E(d))
if(i.a===4){e=c.an()
c.b=!1
c.z=A.bW(e,r,s)
k.E(0)
l.b=null
l.d=l.c=!1
c.as=0}}else if(e.C(f,"draw-end")){e=c.aM()
if(e==null)e=m
c.b=!1
c.z=A.bW(e,r,s)
k.E(0)
l.b=null
l.d=l.c=!1
c.as=0}else if(e.C(f,"next")){e=c.z
e===$&&A.I()
e.af()
j.E(0)
c.ax=!1}else if(e.C(f,"show")){e=c.z
e===$&&A.I()
d=g.j(0,"s")
d.toString
e.aH(A.E(d))}else if(e.C(f,"ready")){e=g.j(0,"s")
e.toString
j.k(0,A.E(e))}else if(e.C(f,"reveal-end"))c.ax=!0
else if(J.J(g.j(0,"t"),"forfeit")){if(c.b){c.b=!1
c.z=A.bW(m,r,s)
k.E(0)
l.b=null
l.d=l.c=!1
c.as=0}e=c.z
e===$&&A.I()
d=g.j(0,"s")
d.toString
e.a4((A.E(d)&1)===0?B.b:B.c)}else{e=c.z
e===$&&A.I()
e.Z(A.fl(g))}B.a.k(o,g)}if(!c.b){s=c.z
s===$&&A.I()
s=s.d
l.Z(A.ei(s,c.as,null,A.C(s).c))}s=c.z
s===$&&A.I()
c.as=s.d.length},
an(){var s,r,q,p,o=this.d,n=A.h(o),m=new A.V(o,n.h("V<1>")).gO(0)
for(n=new A.aI(o,o.r,o.e,n.h("aI<1>"));n.n();){s=n.d
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
aR(a,b,c){var s,r,q,p,o,n=this,m=n.c.length,l=n.d,k=t.S,j=A.cp(l,k,k),i=b==null
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
l=i[a]==null&&!l.N(a)}else l=s
else l=s
return new A.d7(m,j,k,b,c,l)},
br(a){return this.aR(a,null,!1)},
aQ(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i
t.p.a(a)
for(s=this.ga8(),r=s.length,q=t.S,p=t.N,o=t.H,n=t.O,m=0;m<s.length;s.length===r||(0,A.w)(s),++m){l=s[m]
k=a.j(0,l)
if(k==null){k=A.e([],n)
a.i(0,l,k)}j=this.z
j===$&&A.I()
i=A.a3([B.b,0,B.c,0],o,q)
J.e5(k,A.eW(j,l,!1,b,this.aR(l,c,d),new A.d9(),!1,new A.bV(A.o(q,p),i)))}},
aP(a,b){return this.aQ(a,b,null,!1)},
aL(a){var s,r=this
r.b=!1
r.z=A.bW(a,r.e,r.f)
s=r.Q
s.a.E(0)
s.b=null
s.d=s.c=!1
r.as=0},
aM(){var s,r,q,p,o,n,m=this,l=m.d
if(!B.a.S(m.ga8(),l.gbI()))return null
s=new A.bh()
s.ag(m.f)
for(r=t.t,q=0;q<4;++q){if(l.N(q))continue
p=A.e([],r)
for(o=0;o<m.c.length;++o)if(!l.av(o))p.push(o)
n=s.a0(p.length)
if(!(n>=0&&n<p.length))return A.b(p,n)
l.i(0,q,p[n])}return m.an()},
bR(a){var s
A.E(a)
s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
return s[a]==null},
ga8(){var s,r,q,p=A.e([],t.t)
for(s=this.w,r=s.length,q=0;q<4;++q){if(!(q<r))return A.b(s,q)
if(s[q]==null)p.push(q)}return p},
ga1(){var s=this,r=!1
if(!s.b)if(s.e.at<=0)if(!s.ax){r=s.z
r===$&&A.I()
r=r.gb8()&&B.a.S(s.ga8(),new A.da(s))}return r},
b0(a){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
s=!1
if(q[a]==null)if(r.ga1()){q=r.z
q===$&&A.I()
q=q.au(a)&&!r.at.T(0,a)}else q=s
else q=s
return q},
aq(a,b){var s,r=this,q=r.w
if(!(a>=0&&a<q.length))return A.b(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.ab("seat "+a+" is not a person"))
if(r.b)throw A.d(A.ab("drawing for the dealer"))
q=r.z
q===$&&A.I()
q.Z(b)
B.a.k(r.x,A.fm(b))
s=A.o(t.S,t.Q)
r.R(s,0)
r.X(s)
return s},
gaF(){var s,r,q,p,o,n,m=this,l=null
if(m.b)return l
s=m.z
s===$&&A.I()
r=s.r
switch(r.a){case 1:s=s.as
r=m.w
if(!(s>=0&&s<r.length))return A.b(r,s)
if(!(r[s]==null))s=l
return s
case 2:case 0:if(r===B.e){q=s.CW
q.toString
p=q}else p=((s.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
o=s.gaE()
if(o!=null){q=m.w
if(o>>>0!==o||o>=q.length)return A.b(q,o)
q=q[o]==null}else q=!1
if(q)return o
if(r===B.f&&s.ch.c!=null)return l
for(s=m.w,r=s.length,n=0;n<4;++n){if(((n&1)===0?B.b:B.c)===p){if(!(n<r))return A.b(s,n)
q=s[n]==null}else q=!1
if(q)return n}return l
case 3:case 4:return l}},
bX(a){var s,r,q,p,o,n=this
if(n.b){B.a.k(n.x,B.ab)
s=A.o(t.S,t.Q)
n.aT(s,n.aM())
n.X(s)
return s}if(n.gaF()==null&&n.ga1()){n.ax=!0
B.a.k(n.x,B.ac)
s=A.o(t.S,t.Q)
n.X(s)
if(s.a===0)n.R(s,0)
return s}r=n.gaF()
if(r==null)throw A.d(A.ab("nobody to wait for"))
q=n.z
q===$&&A.I()
s=n.aq(r,new A.cR(B.C,n.y).b2(new A.bN(q,r)))
q=n.x
p=B.a.bU(q,new A.db(r))
if(!(p>=0&&p<q.length))return A.b(q,p)
o=A.eK(q[p],t.N,t.X)
o.i(0,"to",!0)
B.a.i(q,p,o)
if(a!=null&&n.z.r!==B.i&&n.bV(r)>=a)n.a4(r).I(0,new A.dc(s))
return s},
bV(a){var s,r,q,p
for(s=this.x,r=A.C(s).h("bQ<1>"),s=new A.bQ(s,r),s=new A.a4(s,s.gm(0),r.h("a4<D.E>")),r=r.h("D.E"),q=0;s.n();){p=s.d
if(p==null)p=r.a(p)
if(!J.J(p.j(0,"s"),a))continue
if(!J.J(p.j(0,"to"),!0))break;++q}return q},
a4(a){var s,r,q=this
if(q.b)q.aL(q.r)
s=q.z
s===$&&A.I()
s.a4((a&1)===0?B.b:B.c)
B.a.k(q.x,A.a3(["t","forfeit","s",a],t.N,t.X))
r=A.o(t.S,t.Q)
q.R(r,0)
return r},
bG(a,b){var s,r,q,p,o,n,m=this
t.f.a(b)
s=b.j(0,"t")
A:{if("blind"===s){r=b.j(0,"i")
r.toString
A.E(r)
q=m.z
q===$&&A.I()
q=q.w
if(!(a>=0&&a<q.length))return A.b(q,a)
p=A.z(q[a],t.L)
if(r<0||r>=p.length)A.am(A.ab("no card "+r))
if(!(r>=0&&r<p.length))return A.b(p,r)
r=m.aq(a,new A.K(p[r],!1,a))
break A}if("pick"===s){r=b.j(0,"i")
r.toString
A.E(r)
q=!0
if(m.b){o=m.w
if(!(a>=0&&a<o.length))return A.b(o,a)
if(o[a]==null){q=m.d
q=q.N(a)||r<0||r>=m.c.length||q.av(r)}}if(q)A.am(A.ab("cannot draw "+r))
m.d.i(0,a,r)
B.a.k(m.x,A.a3(["t","pick","s",a,"i",r],t.N,t.X))
n=A.o(t.S,t.Q)
m.aP(n,0)
m.X(n)
r=n
break A}if("show"===s){if(!m.b0(a))A.am(A.ab("nothing to show"))
r=m.z
r===$&&A.I()
r.aH(a)
B.a.k(m.x,A.a3(["t","show","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.R(n,0)
m.X(n)
r=n
break A}if("ready"===s){if(!m.b0(a))A.am(A.ab("nothing to pass"))
m.at.k(0,a)
B.a.k(m.x,A.a3(["t","ready","s",a],t.N,t.X))
n=A.o(t.S,t.Q)
m.X(n)
if(n.a===0)m.R(n,0)
r=n
break A}r=A.eK(b,t.N,t.X)
r.i(0,"s",a)
r=m.aq(a,A.fl(r))
break A}return r},
aT(a,b){var s,r,q=this
t.p.a(a)
s=b==null
r=s?q.r:b
q.aQ(a,s?0:850,r,s)
q.aL(r)
q.R(a,s?1800:2800)},
X(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
t.p.a(a)
if(c.b){for(s=c.d,r=c.y,q=c.x,p=t.N,o=t.X,n=t.t,m=c.w,l=m.length,k=0;k<4;++k){if(!(k<l))return A.b(m,k)
if(m[k]==null||s.N(k))continue
j=A.e([],n)
for(i=0;i<c.c.length;++i)if(!s.av(i))j.push(i)
h=r.a0(j.length)
if(!(h>=0&&h<j.length))return A.b(j,h)
s.i(0,k,j[h])
B.a.k(q,A.a3(["t","pick","s",k,"i",s.j(0,k)],p,o))
c.aP(a,600)}if(s.a<4)return
c.aT(a,c.an())}for(s=c.x,r=c.w,q=r.length,p=c.y,o=c.Q,n=c.at,m=t.S,l=t.x;;){j=c.z
j===$&&A.I()
g=j.r
if(g===B.i)return
if(g===B.h){if(c.ga1())return
j=A.cp(c.z.dy,m,l)
f=j.gt(j)?2200:3500
c.z.af()
n.E(0)
c.ax=!1
B.a.k(s,B.ad)
c.R(a,f)
continue}e=c.bm()
if(e==null)return
f=o.e?1400:850
if(e>>>0!==e||e>=q)return A.b(r,e)
j=r[e]
j.toString
d=new A.cR(j,p).b2(new A.bN(c.z,e))
c.z.Z(d)
B.a.k(s,A.fm(d))
c.R(a,f)}},
bm(){var s,r,q,p,o=this,n=null,m=o.z
m===$&&A.I()
s=m.r
switch(s.a){case 1:m=m.as
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.f&&m.ch.c!=null){m=m.gaE()
m.toString
s=o.w
if(!(m>=0&&m<s.length))return A.b(s,m)
if(s[m]==null)m=n
return m}m=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)m.push(p)
if(B.a.S(m,o.gb5()))return n
return o.z.gaE()
case 3:case 4:return n}},
R(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
t.p.a(a4)
s=a3.Q
r=a3.z
r===$&&A.I()
r=r.d
s.Z(A.ei(r,a3.as,null,A.C(r).c))
a3.as=a3.z.d.length
for(r=a3.ga8(),q=r.length,p=a3.w,o=p.length,n=a3.gb5(),m=t.O,l=t.S,k=t.N,j=t.H,i=t.L,h=a3.at,g=0;g<r.length;r.length===q||(0,A.w)(r),++g){f=r[g]
e=a4.j(0,f)
if(e==null){e=A.e([],m)
a4.i(0,f,e)}d=a3.z
c=a3.b?new A.bV(A.o(l,k),A.a3([B.b,0,B.c,0],j,l)):s
b=a3.ga1()
if(!(f<o))return A.b(p,f)
a=!1
if(p[f]==null)if(a3.ga1()){a=a3.z
if(a.r===B.h)a0=a.dx||a.CW!=null
else a0=!1
a1=!1
if(a0)if(!a.dy.N(f)){a=a.w
if(!(f<a.length))return A.b(a,f)
a2=A.aK(a[f],!1,i)
a2.$flags=3
a=a2.length!==0}else a=a1
else a=a1
a=a&&!h.T(0,f)}J.e5(e,A.eW(d,f,a,a5,a3.b?a3.br(f):null,n,b,c))}}}
A.d9.prototype={
$1(a){return!1},
$S:1}
A.da.prototype={
$1(a){var s,r
A.E(a)
s=this.a
r=s.z
r===$&&A.I()
return r.au(a)&&!s.at.T(0,a)},
$S:1}
A.db.prototype={
$1(a){return J.J(t.f.a(a).j(0,"s"),this.a)},
$S:19}
A.dc.prototype={
$2(a,b){var s,r
A.E(a)
t.Q.a(b)
s=this.a
r=s.j(0,a)
if(r==null){r=A.e([],t.O)
s.i(0,a,r)
s=r}else s=r
return J.fJ(s,b)},
$S:20}
A.aL.prototype={
Y(){return"ManilhaMode."+this.b}}
A.dB.prototype={
M(){var s,r=this,q=A.o(t.N,t.X)
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
F(a,b){var s
switch(this.c.a){case 0:if(b!=null&&a.a===B.y[(b.a.a+1)%10])return 10+a.b.a
break
case 1:s=B.a.aa(B.a7,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b9.prototype={
M(){var s,r=A.o(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.ga9())
if(this.c)r.i(0,"x",!0)
return r}}
A.cN.prototype={
M(){var s,r,q,p=A.o(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.w)(s),++q)o.push(s[q].M())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.aw.prototype={
M(){var s,r,q,p,o,n,m,l,k,j,i=this,h=t.N,g=A.o(h,t.X)
g.i(0,"me",i.a)
g.i(0,"rules",i.b.M())
g.i(0,"phase",i.c.b)
g.i(0,"turn",i.d)
g.i(0,"dealer",i.e)
g.i(0,"foot",i.f)
g.i(0,"hand#",i.r)
s=i.w
if(s!=null)g.i(0,"vira",s.ga9())
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
for(q=i.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.w)(q),++o)r.push(q[o].M())
g.i(0,"rounds",r)
s=A.e([],s)
for(r=i.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.w)(r),++o)s.push(r[o].M())
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
for(p=r.length,o=0;o<r.length;r.length===p||(0,A.w)(r),++o){n=r[o]
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
for(p=p.b,k=p.length,o=0;o<p.length;p.length===k||(0,A.w)(p),++o){n=p[o]
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
if(h!=null)g.i(0,"draw",h.M())
return g}}
A.dr.prototype={
$1(a){var s,r=a.a,q=a.c
if(q){s=this.a
s=r!==s&&r!==B.d.D(s+2,4)}else s=!1
return new A.b9(r,s?null:a.b,q)},
$S:21}
A.d7.prototype={
M(){var s,r,q,p,o=this,n=t.N,m=A.o(n,t.X)
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
A.bV.prototype={
Z(a){var s,r,q,p,o,n,m=this
t.cA.a(a)
m.e=!1
for(s=a.$ti,r=new A.a4(a,a.gm(0),s.h("a4<D.E>")),s=s.h("D.E"),q=m.r,p=m.a;r.n();){o=r.d
if(o==null)o=s.a(o)
if(o instanceof A.b4){p.E(0)
m.b=null
m.d=!1
m.c=o.f
continue}if(o instanceof A.b0){m.c=m.e=m.d=!1
continue}if(o instanceof A.ba){p.i(0,o.a,o.c+"!")
continue}if(o instanceof A.bP){p.i(0,o.a,"Cai dentro!")
continue}if(o instanceof A.aD){n=o.a
p.i(0,n,o.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(o instanceof A.b2){n=o.a
p.i(0,n,o.b?"Vamos jogar!":"Corro.")
continue}if(o instanceof A.bc){m.e=m.d=!0
continue}if(o instanceof A.ar){n=o.a
m.b=new A.c8(o.b,n)
continue}if(o instanceof A.aG){o=o.a
n=q.j(0,o)
n.toString
q.i(0,o,n+1)
continue}if(o instanceof A.aE){m.b=null
m.d=!1
continue}if(o instanceof A.b1)continue}},
bZ(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.ap.prototype={
Y(){return"GamePhase."+this.b}}
A.a_.prototype={}
A.K.prototype={
l(a){var s=this.b.l(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.O.prototype={
l(a){return"Raise("+this.a+")"}}
A.M.prototype={
l(a){return"Accept("+this.a+")"}}
A.S.prototype={
l(a){return"Fold("+this.a+")"}}
A.G.prototype={}
A.b4.prototype={}
A.b2.prototype={}
A.b0.prototype={}
A.ba.prototype={}
A.bP.prototype={}
A.aD.prototype={}
A.bc.prototype={}
A.ar.prototype={}
A.aG.prototype={}
A.b1.prototype={}
A.aE.prototype={}
A.a5.prototype={}
A.bR.prototype={}
A.cK.prototype={}
A.cs.prototype={
l(a){return"GameRuleError: "+this.a}}
A.dx.prototype={
gaw(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.b(s,r)
return s[r]},
gaE(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.D(r+2,4):B.d.D(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.D(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.D(q+1,4)
default:return null}},
aI(a){return a.c?-1:this.a.F(a.b,this.y)},
af(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.h)throw A.d(A.ab("hand still in progress"));++j.f
j.e=B.d.D(j.e+1,4)
s=t.L
r=A.aJ($.e4(),s)
B.a.ae(r,j.b)
q=t.ba
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.be(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.w)(p),++m){l=A.aK(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.z){if(12>=r.length)return A.b(r,12)
r=r[12]}else r=null
j.y=r
B.a.E(j.z)
B.a.E(j.Q)
m=j.ax=0
j.ch=j.ay=null
r=j.dx=!1
j.dy.E(0)
j.at=j.as=B.d.D(j.e+1,4)
q=A.e([],t.c)
for(p=j.c,n=s.e;m<2;++m){k=B.a3[m]
if(p.j(0,k)===n)q.push(k)}p=q.length
n=p===2
j.cy=n
j.cx=n?s.x:r
s=p===1?B.a.ga5(q):null
j.CW=s
j.r=s!=null?B.e:B.k
r=j.y
q=j.cx
B.a.k(j.d,new A.b4(j.x,r,s,q))},
b6(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
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
for(;p<r.length;r.length===q||(0,A.w)(r),++p)s.push(new A.K(r[p],!1,a))
if(o.gar()){r=o.w
if(!(a<r.length))return A.b(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.w)(r),++p)s.push(new A.K(r[p],!0,a))}if(o.b_(a))s.push(new A.O(a))
return s
case 3:case 4:return B.m}},
gar(){return this.a.w&&!this.cx&&this.z.length!==0},
b_(a){var s=this,r=!1
if(s.r===B.k)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
Z(a){var s,r,q,p,o=this,n=a.a
if(!B.a.S(o.b6(n),new A.dA(a)))throw A.d(A.ab("illegal "+a.l(0)+" in "+o.r.l(0)))
A:{if(a instanceof A.K){o.bx(a)
break A}if(a instanceof A.O){o.dx=!0
s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cK(n,p,null)
o.r=B.f
s=o.a.d
if(!(p<5))return A.b(s,p)
B.a.k(o.d,new A.ba(n,s[p],B.a4[p-1]))
break A}if(a instanceof A.M){o.bh(n)
break A}if(a instanceof A.S)o.bu(n)}},
bh(a){var s,r,q=this
if(q.r===B.e){B.a.k(q.d,new A.b2(a,!0))
q.r=B.k
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.k
if(!(r<5))return A.b(q.a.d,r)
B.a.k(q.d,new A.bP(a))},
bu(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.k(o.d,new A.b2(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.aj(s,B.a.gO(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cK(r.a,r.b,a)
B.a.k(o.d,new A.aD(a,!0))
return}B.a.k(o.d,new A.aD(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.b(q,p)
o.aj(s,q[p])},
bx(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.b(s,r)
q=a.b
B.a.bW(s[r],q)
s=f.Q
p=a.c
B.a.k(s,new A.a5(r,q,p))
o=f.d
B.a.k(o,new A.b0(r,q,p))
r=s.length
if(r<4){f.as=B.d.D(f.as+1,4)
return}q=e.a=-2
for(p=f.a,n=0;n<s.length;s.length===r||(0,A.w)(s),++n,q=k){m=s[n]
l=m.c?-1:p.F(m.b,f.y)
k=Math.max(q,l)
e.a=k}r=A.C(s)
q=r.h("ai<1>")
j=A.aJ(new A.ai(s,r.h("m(1)").a(new A.dy(e,f)),q),q.h("c.E"))
r=A.C(j)
i=new A.ag(j,r.h("H(1)").a(new A.dz()),r.h("ag<1,H>")).ba(0)
h=i.a===1?i.ga5(0):null
r=A.z(s,t.n)
q=B.a.gO(j).a
p=f.z
B.a.k(p,new A.bR(r,h,q))
B.a.E(s)
B.a.k(o,new A.bc(p.length))
g=A.iu(p)
if(g!=null)f.aj(g.a,f.gaw())
else f.at=f.as=h==null?f.at:q},
aj(a,b){var s,r,q,p,o=this
o.ch=null
s=o.d
r=a==null
B.a.k(s,new A.ar(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.j(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.j(0,a)
r.toString
if(r>=q){o.db=a
o.r=B.i
B.a.k(s,new A.aG(a))
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
B.a.k(r,new A.aE())
B.a.k(r,new A.aG(s))},
gb8(){if(this.r===B.h)var s=this.dx||this.CW!=null
else s=!1
return s},
au(a){var s=!1
if(this.gb8())if(!this.dy.N(a)){s=this.w
if(!(a>=0&&a<s.length))return A.b(s,a)
s=A.z(s[a],t.L).length!==0}return s},
aH(a){var s,r,q=this
if(!q.au(a))throw A.d(A.ab("nothing to show"))
s=q.w
if(!(a>=0&&a<s.length))return A.b(s,a)
r=t.L
q.dy.i(0,a,A.z(A.z(s[a],r),r))
B.a.k(q.d,new A.b1())}}
A.dA.prototype={
$1(a){return A.hi(t.M.a(a),this.a)},
$S:0}
A.dy.prototype={
$1(a){return this.b.aI(t.n.a(a))===this.a.a},
$S:4}
A.dz.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:22}
A.bN.prototype={
ga_(){var s,r=this.a
if(r.cx)r=B.r
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.b(r,s)
s=A.z(r[s],t.L)
r=s}return r},
gaD(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gb7()
else q=!0
s=B.d.D(r+2,4)
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
if(B.a.T(n,m))return A.e([m],t.Y)}return null},
gb7(){var s=this.a,r=!1
if(s.a.y)if(!s.cy)if(s.r===B.f){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbS(){var s,r,q,p,o,n,m=A.hb(this.ga_(),t.L),l=this.a,k=l.y
if(k!=null)m.k(0,k)
k=this.gaD()
if(k!=null)m.W(0,k)
for(k=A.z(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.k(0,n.b)}for(l=A.z(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.k(0,n.b)}return m}}
A.H.prototype={
Y(){return"Team."+this.b}}
A.e_.prototype={
$1(a){return A.iF(A.ac(a))},
$S:23};(function aliases(){var s=J.at.prototype
s.bf=s.l})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1u,q=hunkHelpers._static_1
s(J,"hW","eH",24)
r(A.a0.prototype,"gbI","N",6)
q(A,"il","hN",2)
r(A.ct.prototype,"gb5","bR",1)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.k,null)
q(A.k,[A.eb,J.cv,A.bS,J.aA,A.c,A.bp,A.q,A.ao,A.v,A.dq,A.a4,A.bG,A.c_,A.aQ,A.t,A.a7,A.b6,A.bq,A.aR,A.au,A.dC,A.dp,A.dj,A.aI,A.bE,A.bD,A.a6,A.cW,A.d0,A.ca,A.d_,A.c3,A.r,A.cg,A.cn,A.cq,A.dH,A.cU,A.bT,A.dE,A.d8,A.B,A.bL,A.be,A.cX,A.bh,A.cR,A.Q,A.ct,A.dB,A.b9,A.cN,A.aw,A.d7,A.bV,A.a_,A.G,A.a5,A.bR,A.cK,A.cs,A.dx,A.bN])
q(J.cv,[J.cx,J.bw,J.by,J.bx,J.bz,J.b5,J.aH])
q(J.by,[J.at,J.j,A.b7,A.bJ])
q(J.at,[J.cL,J.bf,J.as])
r(J.cw,A.bS)
r(J.dd,J.j)
q(J.b5,[J.bv,J.cy])
q(A.c,[A.bg,A.f,A.aM,A.ai,A.c0,A.c2,A.bj])
r(A.aB,A.bg)
r(A.c1,A.aB)
q(A.q,[A.aC,A.a0,A.cY])
q(A.ao,[A.cm,A.d5,A.cl,A.cQ,A.df,A.dW,A.dY,A.dm,A.dv,A.ds,A.dt,A.du,A.dw,A.e1,A.e2,A.d3,A.d4,A.dP,A.dQ,A.d9,A.da,A.db,A.dr,A.dA,A.dy,A.dz,A.e_])
q(A.cm,[A.d6,A.de,A.dX,A.dk,A.dn,A.dI,A.dR,A.dc])
q(A.v,[A.bC,A.bX,A.cz,A.cT,A.cO,A.cV,A.bB,A.cj,A.an,A.bY,A.cS,A.bd,A.co])
q(A.f,[A.D,A.V,A.bF,A.a2])
q(A.D,[A.bU,A.ag,A.bQ,A.cZ])
r(A.bt,A.aM)
q(A.a7,[A.bi,A.aU])
r(A.aj,A.bi)
q(A.aU,[A.ak,A.c8])
r(A.bk,A.b6)
r(A.aP,A.bk)
r(A.br,A.aP)
r(A.R,A.bq)
q(A.au,[A.bs,A.c9])
r(A.aq,A.bs)
r(A.bM,A.bX)
q(A.cQ,[A.cP,A.b_])
r(A.bA,A.a0)
q(A.bJ,[A.cB,A.b8])
q(A.b8,[A.c4,A.c6])
r(A.c5,A.c4)
r(A.bH,A.c5)
r(A.c7,A.c6)
r(A.bI,A.c7)
q(A.bH,[A.cC,A.cD])
q(A.bI,[A.cE,A.cF,A.cG,A.cH,A.cI,A.bK,A.cJ])
r(A.cb,A.cV)
r(A.aS,A.c9)
r(A.cA,A.bB)
r(A.dg,A.cn)
q(A.cq,[A.di,A.dh])
r(A.dG,A.dH)
q(A.an,[A.bb,A.cu])
q(A.cU,[A.aa,A.W,A.P,A.aL,A.ap,A.H])
q(A.cl,[A.dV,A.dU])
q(A.a_,[A.K,A.O,A.M,A.S])
q(A.G,[A.b4,A.b2,A.b0,A.ba,A.bP,A.aD,A.bc,A.ar,A.aG,A.b1,A.aE])
s(A.c4,A.r)
s(A.c5,A.t)
s(A.c6,A.r)
s(A.c7,A.t)
s(A.bk,A.cg)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",n:"double",T:"num",l:"String",m:"bool",bL:"Null",i:"List",k:"Object",A:"Map",y:"JSObject"},mangledNames:{},types:["m(a_)","m(a)","@(@)","~(k?,k?)","m(a5)","a()","m(k?)","@(@,l)","@(l)","~(@,@)","m(K)","i<a>(a)","m(+(a,a))","H(+(a,a))","m(P)","m(W)","m(G)","~(H,l)","m(Q)","m(A<l,k?>)","~(a,i<aw>)","b9(a5)","H(a5)","l(l)","a(@,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.aj&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ak&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.c8&&a.b(c.a)&&b.b(c.b)}}
A.hD(v.typeUniverse,JSON.parse('{"as":"at","cL":"at","bf":"at","iN":"b7","cx":{"m":[],"p":[]},"bw":{"p":[]},"by":{"y":[]},"at":{"y":[]},"j":{"i":["1"],"f":["1"],"y":[],"c":["1"]},"cw":{"bS":[]},"dd":{"j":["1"],"i":["1"],"f":["1"],"y":[],"c":["1"]},"aA":{"x":["1"]},"b5":{"n":[],"T":[],"af":["T"]},"bv":{"n":[],"a":[],"T":[],"af":["T"],"p":[]},"cy":{"n":[],"T":[],"af":["T"],"p":[]},"aH":{"l":[],"af":["l"],"p":[]},"bg":{"c":["2"]},"bp":{"x":["2"]},"aB":{"bg":["1","2"],"c":["2"],"c.E":"2"},"c1":{"aB":["1","2"],"bg":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"aC":{"q":["3","4"],"A":["3","4"],"q.K":"3","q.V":"4"},"bC":{"v":[]},"f":{"c":["1"]},"D":{"f":["1"],"c":["1"]},"bU":{"D":["1"],"f":["1"],"c":["1"],"D.E":"1","c.E":"1"},"a4":{"x":["1"]},"aM":{"c":["2"],"c.E":"2"},"bt":{"aM":["1","2"],"f":["2"],"c":["2"],"c.E":"2"},"bG":{"x":["2"]},"ag":{"D":["2"],"f":["2"],"c":["2"],"D.E":"2","c.E":"2"},"ai":{"c":["1"],"c.E":"1"},"c_":{"x":["1"]},"c0":{"c":["1"],"c.E":"1"},"aQ":{"x":["1"]},"bQ":{"D":["1"],"f":["1"],"c":["1"],"D.E":"1","c.E":"1"},"aj":{"bi":[],"a7":[]},"ak":{"aU":[],"a7":[]},"c8":{"aU":[],"a7":[]},"br":{"aP":["1","2"],"bk":["1","2"],"b6":["1","2"],"cg":["1","2"],"A":["1","2"]},"bq":{"A":["1","2"]},"R":{"bq":["1","2"],"A":["1","2"]},"c2":{"c":["1"],"c.E":"1"},"aR":{"x":["1"]},"bs":{"au":["1"],"aO":["1"],"f":["1"],"c":["1"]},"aq":{"bs":["1"],"au":["1"],"aO":["1"],"f":["1"],"c":["1"]},"bM":{"v":[]},"cz":{"v":[]},"cT":{"v":[]},"ao":{"aF":[]},"cl":{"aF":[]},"cm":{"aF":[]},"cQ":{"aF":[]},"cP":{"aF":[]},"b_":{"aF":[]},"cO":{"v":[]},"a0":{"q":["1","2"],"ed":["1","2"],"A":["1","2"],"q.K":"1","q.V":"2"},"V":{"f":["1"],"c":["1"],"c.E":"1"},"aI":{"x":["1"]},"bF":{"f":["1"],"c":["1"],"c.E":"1"},"bE":{"x":["1"]},"a2":{"f":["B<1,2>"],"c":["B<1,2>"],"c.E":"B<1,2>"},"bD":{"x":["B<1,2>"]},"bA":{"a0":["1","2"],"q":["1","2"],"ed":["1","2"],"A":["1","2"],"q.K":"1","q.V":"2"},"aU":{"a7":[]},"bi":{"a7":[]},"b7":{"y":[],"p":[]},"bJ":{"y":[]},"cB":{"y":[],"p":[]},"b8":{"U":["1"],"y":[]},"bH":{"r":["n"],"i":["n"],"U":["n"],"f":["n"],"y":[],"c":["n"],"t":["n"]},"bI":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"]},"cC":{"r":["n"],"i":["n"],"U":["n"],"f":["n"],"y":[],"c":["n"],"t":["n"],"p":[],"r.E":"n","t.E":"n"},"cD":{"r":["n"],"i":["n"],"U":["n"],"f":["n"],"y":[],"c":["n"],"t":["n"],"p":[],"r.E":"n","t.E":"n"},"cE":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cF":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cG":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cH":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cI":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"bK":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cJ":{"r":["a"],"i":["a"],"U":["a"],"f":["a"],"y":[],"c":["a"],"t":["a"],"p":[],"r.E":"a","t.E":"a"},"cV":{"v":[]},"cb":{"v":[]},"ca":{"x":["1"]},"bj":{"c":["1"],"c.E":"1"},"aS":{"au":["1"],"aO":["1"],"f":["1"],"c":["1"]},"c3":{"x":["1"]},"q":{"A":["1","2"]},"b6":{"A":["1","2"]},"aP":{"bk":["1","2"],"b6":["1","2"],"cg":["1","2"],"A":["1","2"]},"au":{"aO":["1"],"f":["1"],"c":["1"]},"c9":{"au":["1"],"aO":["1"],"f":["1"],"c":["1"]},"cY":{"q":["l","@"],"A":["l","@"],"q.K":"l","q.V":"@"},"cZ":{"D":["l"],"f":["l"],"c":["l"],"D.E":"l","c.E":"l"},"bB":{"v":[]},"cA":{"v":[]},"n":{"T":[],"af":["T"]},"a":{"T":[],"af":["T"]},"i":{"f":["1"],"c":["1"]},"T":{"af":["T"]},"aO":{"f":["1"],"c":["1"]},"l":{"af":["l"]},"cU":{"b3":[]},"cj":{"v":[]},"bX":{"v":[]},"an":{"v":[]},"bb":{"v":[]},"cu":{"v":[]},"bY":{"v":[]},"cS":{"v":[]},"bd":{"v":[]},"co":{"v":[]},"bT":{"v":[]},"be":{"hg":[]},"cX":{"ef":[]},"bh":{"ef":[]},"aa":{"b3":[]},"W":{"b3":[]},"P":{"b3":[]},"aL":{"b3":[]},"K":{"a_":[]},"ar":{"G":[]},"ap":{"b3":[]},"O":{"a_":[]},"M":{"a_":[]},"S":{"a_":[]},"b4":{"G":[]},"b2":{"G":[]},"b0":{"G":[]},"ba":{"G":[]},"bP":{"G":[]},"aD":{"G":[]},"bc":{"G":[]},"aG":{"G":[]},"b1":{"G":[]},"aE":{"G":[]},"H":{"b3":[]},"h5":{"i":["a"],"f":["a"],"c":["a"]},"hm":{"i":["a"],"f":["a"],"c":["a"]},"hl":{"i":["a"],"f":["a"],"c":["a"]},"h3":{"i":["a"],"f":["a"],"c":["a"]},"hj":{"i":["a"],"f":["a"],"c":["a"]},"h4":{"i":["a"],"f":["a"],"c":["a"]},"hk":{"i":["a"],"f":["a"],"c":["a"]},"h1":{"i":["n"],"f":["n"],"c":["n"]},"h2":{"i":["n"],"f":["n"],"c":["n"]}}'))
A.hC(v.typeUniverse,JSON.parse('{"b8":1,"c9":1,"cn":2,"cq":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.ad
return{l:s("M"),q:s("aa"),L:s("Q"),r:s("af<@>"),J:s("R<l,k?>"),V:s("f<@>"),C:s("v"),A:s("S"),Z:s("aF"),M:s("a_"),E:s("G"),I:s("aq<W>"),B:s("ar"),cA:s("c<G>"),bi:s("c<@>"),Y:s("j<Q>"),u:s("j<a_>"),c4:s("j<G>"),ba:s("j<i<Q>>"),bc:s("j<A<l,k>>"),d:s("j<A<l,k?>>"),c5:s("j<a5>"),cd:s("j<b9>"),w:s("j<+(a,a)>"),d2:s("j<bR>"),bP:s("j<cN>"),s:s("j<l>"),O:s("j<aw>"),c:s("j<H>"),b:s("j<@>"),t:s("j<a>"),cG:s("j<aa?>"),v:s("j<H?>"),e:s("j<a?>"),T:s("bw"),m:s("y"),h:s("as"),da:s("U<@>"),x:s("i<Q>"),U:s("i<a_>"),a:s("i<l>"),Q:s("i<aw>"),j:s("i<@>"),aH:s("i<a>"),W:s("i<k?>"),aJ:s("aL"),G:s("A<@,@>"),f:s("A<l,k?>"),p:s("A<a,i<aw>>"),P:s("bL"),K:s("k"),n:s("a5"),D:s("K"),aN:s("O"),al:s("P"),cY:s("iO"),cD:s("+()"),R:s("+(a,a)"),F:s("bR"),at:s("aO<l>"),N:s("l"),_:s("W"),H:s("H"),bW:s("p"),cr:s("bf"),db:s("c0<K>"),ca:s("aQ<ar>"),y:s("m"),i:s("n"),S:s("a"),ch:s("aa?"),cR:s("eF<bL>?"),z:s("y?"),k:s("i<@>?"),a5:s("A<@,@>?"),X:s("k?"),aD:s("l?"),bM:s("H?"),g:s("d_?"),az:s("m?"),dd:s("n?"),a3:s("a?"),ae:s("T?"),o:s("T"),cQ:s("~(l,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.X=J.cv.prototype
B.a=J.j.prototype
B.d=J.bv.prototype
B.p=J.b5.prototype
B.l=J.aH.prototype
B.Y=J.as.prototype
B.Z=J.by.prototype
B.J=J.cL.prototype
B.B=J.bf.prototype
B.n=new A.aa(0,"easy")
B.C=new A.aa(1,"medium")
B.o=new A.aa(2,"hard")
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

B.F=new A.dg()
B.j=new A.dq()
B.T=new A.cX()
B.K=new A.P("A",7,"ace")
B.v=new A.W(1,"espadas")
B.G=new A.Q(B.K,B.v)
B.e=new A.ap(0,"decision")
B.k=new A.ap(1,"playing")
B.f=new A.ap(2,"raisePending")
B.h=new A.ap(3,"handOver")
B.i=new A.ap(4,"gameOver")
B.a_=new A.dh(null)
B.a0=new A.di(null)
B.u=new A.W(0,"ouros")
B.w=new A.W(2,"copas")
B.x=new A.W(3,"paus")
B.q=s([B.u,B.v,B.w,B.x],A.ad("j<W>"))
B.z=new A.aL(0,"vira")
B.a8=new A.aL(1,"fixed")
B.a1=s([B.z,B.a8],A.ad("j<aL>"))
B.a2=s([B.n,B.C,B.o],A.ad("j<aa>"))
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
B.y=s([B.M,B.aj,B.L,B.A,B.ak,B.ah,B.ai,B.K,B.al,B.ag],A.ad("j<P>"))
B.U=new A.Q(B.A,B.u)
B.V=new A.Q(B.A,B.w)
B.W=new A.Q(B.M,B.x)
B.a7=s([B.U,B.G,B.V,B.W],t.Y)
B.af={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.ap=new A.aq([B.x,B.w],t.I)
B.ao=new A.aq([B.u,B.v],t.I)
B.aq=new A.aq([B.v,B.x],t.I)
B.ar=new A.aq([B.u,B.w],t.I)
B.a9=new A.R(B.af,[B.ap,B.ao,B.aq,B.ar],A.ad("R<l,aO<W>>"))
B.I={}
B.aa=new A.R(B.I,[],A.ad("R<a,Q>"))
B.H=new A.R(B.I,[],A.ad("R<a,i<k?>>"))
B.t={t:0}
B.ab=new A.R(B.t,["draw-end"],t.J)
B.ac=new A.R(B.t,["reveal-end"],t.J)
B.ad=new A.R(B.t,["next"],t.J)
B.ae=new A.R(B.t,["draw"],t.J)
B.am=new A.aj(B.b)
B.an=new A.aj(B.c)
B.as=A.a8("iJ")
B.at=A.a8("iK")
B.au=A.a8("h1")
B.av=A.a8("h2")
B.aw=A.a8("h3")
B.ax=A.a8("h4")
B.ay=A.a8("h5")
B.az=A.a8("k")
B.aA=A.a8("hj")
B.aB=A.a8("hk")
B.aC=A.a8("hl")
B.aD=A.a8("hm")})();(function staticFields(){$.dF=null
$.Y=A.e([],A.ad("j<k>"))
$.eP=null
$.eC=null
$.eB=null
$.fq=null
$.fn=null
$.ft=null
$.dO=null
$.dZ=null
$.eu=null
$.dJ=A.e([],A.ad("j<i<k>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iM","fw",()=>A.dT("_$dart_dartClosure"))
s($,"iL","ez",()=>A.dT("_$dart_dartClosure_dartJSInterop"))
s($,"j_","fH",()=>A.e([new J.cw()],A.ad("j<bS>")))
s($,"iP","fx",()=>A.ah(A.dD({
toString:function(){return"$receiver$"}})))
s($,"iQ","fy",()=>A.ah(A.dD({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iR","fz",()=>A.ah(A.dD(null)))
s($,"iS","fA",()=>A.ah(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iV","fD",()=>A.ah(A.dD(void 0)))
s($,"iW","fE",()=>A.ah(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iU","fC",()=>A.ah(A.eX(null)))
s($,"iT","fB",()=>A.ah(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iY","fG",()=>A.ah(A.eX(void 0)))
s($,"iX","fF",()=>A.ah(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iZ","e3",()=>A.ex(B.az))
s($,"j0","e4",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.y[r]
for(p=0;p<4;++p)o.push(A.fR(q,B.q[p]))}return A.z(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b7,SharedArrayBuffer:A.b7,ArrayBufferView:A.bJ,DataView:A.cB,Float32Array:A.cC,Float64Array:A.cD,Int16Array:A.cE,Int32Array:A.cF,Int8Array:A.cG,Uint16Array:A.cH,Uint32Array:A.cI,Uint8ClampedArray:A.bK,CanvasPixelArray:A.bK,Uint8Array:A.cJ})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b8.$nativeSuperclassTag="ArrayBufferView"
A.c4.$nativeSuperclassTag="ArrayBufferView"
A.c5.$nativeSuperclassTag="ArrayBufferView"
A.bH.$nativeSuperclassTag="ArrayBufferView"
A.c6.$nativeSuperclassTag="ArrayBufferView"
A.c7.$nativeSuperclassTag="ArrayBufferView"
A.bI.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.iC
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()