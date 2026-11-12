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
if(a[b]!==s){A.iB(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.e(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.eg(b)
return new s(c,this)}:function(){if(s===null)s=A.eg(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.eg(a).prototype
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
el(a,b,c,d){return{i:a,p:b,e:c,x:d}},
eh(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.ej==null){A.iq()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.eP("Return interceptor for "+A.t(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.dx
if(o==null)o=$.dx=A.dL(n)
p=q[o]}if(p!=null)return p
p=A.iv(a)
if(p!=null)return p
if(typeof a=="function")return B.W
s=Object.getPrototypeOf(a)
if(s==null)return B.H
if(s===Object.prototype)return B.H
if(typeof q=="function"){o=$.dx
if(o==null)o=$.dx=A.dL(n)
Object.defineProperty(q,o,{value:B.A,enumerable:false,writable:true,configurable:true})
return B.A}return B.A},
fZ(a,b){if(a<0||a>4294967295)throw A.d(A.aG(a,0,4294967295,"length",null))
return J.h_(new Array(a),b)},
ez(a,b){if(a<0)throw A.d(A.cZ("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("i<0>"))},
e_(a,b){if(a<0)throw A.d(A.cZ("Length must be a non-negative integer: "+a))
return A.e(new Array(a),b.h("i<0>"))},
h_(a,b){var s=A.e(a,b.h("i<0>"))
s.$flags=1
return s},
eA(a,b){var s=t.k
return J.fB(s.a(a),s.a(b))},
aQ(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bq.prototype
return J.ct.prototype}if(typeof a=="string")return J.aD.prototype
if(a==null)return J.br.prototype
if(typeof a=="boolean")return J.cs.prototype
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ap.prototype
if(typeof a=="symbol")return J.bu.prototype
if(typeof a=="bigint")return J.bs.prototype
return a}if(a instanceof A.m)return a
return J.eh(a)},
dK(a){if(typeof a=="string")return J.aD.prototype
if(a==null)return a
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ap.prototype
if(typeof a=="symbol")return J.bu.prototype
if(typeof a=="bigint")return J.bs.prototype
return a}if(a instanceof A.m)return a
return J.eh(a)},
cc(a){if(a==null)return a
if(Array.isArray(a))return J.i.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ap.prototype
if(typeof a=="symbol")return J.bu.prototype
if(typeof a=="bigint")return J.bs.prototype
return a}if(a instanceof A.m)return a
return J.eh(a)},
ik(a){if(typeof a=="number")return J.aZ.prototype
if(typeof a=="string")return J.aD.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.bb.prototype
return a},
I(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aQ(a).L(a,b)},
a7(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.it(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.dK(a).k(a,b)},
fz(a,b,c){return J.cc(a).i(a,b,c)},
eq(a,b){return J.cc(a).l(a,b)},
fA(a,b){return J.cc(a).P(a,b)},
fB(a,b){return J.ik(a).aM(a,b)},
dX(a,b){return J.cc(a).H(a,b)},
a8(a){return J.aQ(a).gu(a)},
fC(a){return J.dK(a).gt(a)},
fD(a){return J.cc(a).gv(a)},
aj(a){return J.cc(a).gq(a)},
cY(a){return J.dK(a).gm(a)},
fE(a){return J.aQ(a).gB(a)},
cd(a){return J.aQ(a).j(a)},
cp:function cp(){},
cs:function cs(){},
br:function br(){},
bt:function bt(){},
aq:function aq(){},
cG:function cG(){},
bb:function bb(){},
ap:function ap(){},
bs:function bs(){},
bu:function bu(){},
i:function i(a){this.$ti=a},
cr:function cr(){},
d6:function d6(a){this.$ti=a},
aw:function aw(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aZ:function aZ(){},
bq:function bq(){},
ct:function ct(){},
aD:function aD(){}},A={e0:function e0(){},
fK(a,b,c){if(t.O.b(a))return new A.bW(a,b.h("@<0>").A(c).h("bW<1,2>"))
return new A.ax(a,b.h("@<0>").A(c).h("ax<1,2>"))},
h1(a){return new A.b_("Field '"+a+"' has not been initialized.")},
h0(a){return new A.b_("Field '"+a+"' has already been initialized.")},
as(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
e8(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ek(a){var s,r
for(s=$.V.length,r=0;r<s;++r)if(a===$.V[r])return!0
return!1},
ha(a,b,c,d){A.e6(b,"start")
if(c!=null){A.e6(c,"end")
if(b>c)A.bj(A.aG(b,0,c,"start",null))}return new A.bQ(a,b,c,d.h("bQ<0>"))},
h6(a,b,c,d){if(t.O.b(a))return new A.bo(a,b,c.h("@<0>").A(d).h("bo<1,2>"))
return new A.aF(a,b,c.h("@<0>").A(d).h("aF<1,2>"))},
cq(){return new A.b9("No element")},
ey(){return new A.b9("Too many elements")},
bc:function bc(){},
bk:function bk(a,b){this.a=a
this.$ti=b},
ax:function ax(a,b){this.a=a
this.$ti=b},
bW:function bW(a,b){this.a=a
this.$ti=b},
ay:function ay(a,b){this.a=a
this.$ti=b},
d2:function d2(a,b){this.a=a
this.b=b},
d1:function d1(a){this.a=a},
b_:function b_(a){this.a=a},
dg:function dg(){},
f:function f(){},
F:function F(){},
bQ:function bQ(a,b,c,d){var _=this
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
aF:function aF(a,b,c){this.a=a
this.b=b
this.$ti=c},
bo:function bo(a,b,c){this.a=a
this.b=b
this.$ti=c},
bC:function bC(a,b,c){var _=this
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
bU:function bU(a,b,c){this.a=a
this.b=b
this.$ti=c},
bV:function bV(a,b){this.a=a
this.$ti=b},
aJ:function aJ(a,b){this.a=a
this.$ti=b},
r:function r(){},
bM:function bM(a,b){this.a=a
this.$ti=b},
ew(a,b,c){var s,r,q,p,o,n,m,l=A.j(a),k=A.b1(new A.ab(a,l.h("ab<1>")),!0,b),j=k.length,i=0
for(;;){if(!(i<j)){s=!0
break}r=k[i]
if(typeof r!="string"||"__proto__"===r){s=!1
break}++i}if(s){q={}
for(p=0,i=0;i<k.length;k.length===j||(0,A.z)(k),++i,p=o){r=k[i]
c.a(a.k(0,r))
o=p+1
q[r]=p}n=A.b1(new A.bA(a,l.h("bA<2>")),!0,c)
m=new A.Z(q,n,b.h("@<0>").A(c).h("Z<1,2>"))
m.$keys=k
return m}return new A.bm(A.h2(a,b,c),b.h("@<0>").A(c).h("bm<1,2>"))},
fQ(){throw A.d(A.bT("Cannot modify constant Set"))},
fm(a){var s=A.fl(a)
if(s!=null)return s
return"minified:"+a},
it(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.da.b(a)},
t(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.cd(a)
return s},
bK(a){var s,r=$.eH
if(r==null)r=$.eH=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
cH(a){var s,r,q,p
if(a instanceof A.m)return A.U(A.ai(a),null)
s=J.aQ(a)
if(s===B.V||s===B.X||t.cr.b(a)){r=B.C(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.U(A.ai(a),null)},
eI(a){var s,r,q
if(a==null||typeof a=="number"||A.ed(a))return J.cd(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.al)return a.j(0)
if(a instanceof A.a2)return a.aK(!0)
s=$.fy()
for(r=0;r<1;++r){q=s[r].bI(a)
if(q!=null)return q}return"Instance of '"+A.cH(a)+"'"},
L(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.d.aJ(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.aG(a,0,1114111,null,null))},
c(a,b){if(a==null)J.cY(a)
throw A.d(A.fg(a,b))},
fg(a,b){var s,r="index"
if(!A.ee(b))return new A.ak(!0,b,r,null)
s=J.cY(a)
if(b<0||b>=s)return A.dY(b,s,a,r)
return A.eK(b,r)},
d(a){return A.D(a,new Error())},
D(a,b){var s
if(a==null)a=new A.bR()
b.dartException=a
s=A.iD
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
iD(){return J.cd(this.dartException)},
bj(a,b){throw A.D(a,b==null?new Error():b)},
aT(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.bj(A.hJ(a,b,c),s)},
hJ(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.bS("'"+s+"': Cannot "+o+" "+l+k+n)},
z(a){throw A.d(A.Y(a))},
ae(a){var s,r,q,p,o,n
a=A.iy(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.e([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.du(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
dv(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
eO(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
e1(a,b){var s=b==null,r=s?null:b.method
return new A.cu(a,r,s?null:b.receiver)},
en(a){if(a==null)return new A.df(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.aS(a,a.dartException)
return A.ia(a)},
aS(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
ia(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.d.aJ(r,16)&8191)===10)switch(q){case 438:return A.aS(a,A.e1(A.t(s)+" (Error "+q+")",null))
case 445:case 5007:A.t(s)
return A.aS(a,new A.bI())}}if(a instanceof TypeError){p=$.fo()
o=$.fp()
n=$.fq()
m=$.fr()
l=$.fu()
k=$.fv()
j=$.ft()
$.fs()
i=$.fx()
h=$.fw()
g=p.K(s)
if(g!=null)return A.aS(a,A.e1(A.a5(s),g))
else{g=o.K(s)
if(g!=null){g.method="call"
return A.aS(a,A.e1(A.a5(s),g))}else if(n.K(s)!=null||m.K(s)!=null||l.K(s)!=null||k.K(s)!=null||j.K(s)!=null||m.K(s)!=null||i.K(s)!=null||h.K(s)!=null){A.a5(s)
return A.aS(a,new A.bI())}}return A.aS(a,new A.cO(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.bP()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.aS(a,new A.ak(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.bP()
return a},
em(a){if(a==null)return J.a8(a)
if(typeof a=="object")return A.bK(a)
return J.a8(a)},
ib(a){if(typeof a=="number")return B.p.gu(a)
if(a instanceof A.cX)return A.bK(a)
if(a instanceof A.a2)return a.gu(a)
return A.em(a)},
ii(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
hS(a,b,c,d,e,f){t.Z.a(a)
switch(A.Q(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(new A.dw("Unsupported number of arguments for wrapped closure"))},
ic(a,b){var s=a.$identity
if(!!s)return s
s=A.id(a,b)
a.$identity=s
return s},
id(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.hS)},
fP(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.cK().constructor.prototype):Object.create(new A.aU(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ev(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.fL(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ev(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
fL(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.fG)}throw A.d("Error in functionType of tearoff")},
fM(a,b,c,d){var s=A.eu
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ev(a,b,c,d){if(c)return A.fO(a,b,d)
return A.fM(b.length,d,a,b)},
fN(a,b,c,d){var s=A.eu,r=A.fH
switch(b?-1:a){case 0:throw A.d(new A.cJ("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
fO(a,b,c){var s,r
if($.es==null)$.es=A.er("interceptor")
if($.et==null)$.et=A.er("receiver")
s=b.length
r=A.fN(s,c,a,b)
return r},
eg(a){return A.fP(a)},
fG(a,b){return A.c9(v.typeUniverse,A.ai(a.a),b)},
eu(a){return a.a},
fH(a){return a.b},
er(a){var s,r,q,p=new A.aU("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.cZ("Field name "+a+" not found."))},
dL(a){return v.getIsolateTag(a)},
iv(a){var s,r,q,p,o,n=A.a5($.fh.$1(a)),m=$.dG[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dR[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.f5($.fe.$2(a,n))
if(q!=null){m=$.dG[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.dR[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.dT(s)
$.dG[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.dR[n]=s
return s}if(p==="-"){o=A.dT(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.fj(a,s)
if(p==="*")throw A.d(A.eP(n))
if(v.leafTags[n]===true){o=A.dT(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.fj(a,s)},
fj(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.el(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
dT(a){return J.el(a,!1,null,!!a.$iS)},
ix(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.dT(s)
else return J.el(s,c,null,null)},
iq(){if(!0===$.ej)return
$.ej=!0
A.ir()},
ir(){var s,r,q,p,o,n,m,l
$.dG=Object.create(null)
$.dR=Object.create(null)
A.ip()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.fk.$1(o)
if(n!=null){m=A.ix(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
ip(){var s,r,q,p,o,n,m=B.L()
m=A.bh(B.M,A.bh(B.N,A.bh(B.D,A.bh(B.D,A.bh(B.O,A.bh(B.P,A.bh(B.Q(B.C),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.fh=new A.dO(p)
$.fe=new A.dP(o)
$.fk=new A.dQ(n)},
bh(a,b){return a(b)||b},
ig(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
iy(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ag:function ag(a){this.a=a},
ah:function ah(a,b){this.a=a
this.b=b},
c2:function c2(a,b){this.a=a
this.b=b},
bm:function bm(a,b){this.a=a
this.$ti=b},
bl:function bl(){},
Z:function Z(a,b,c){this.a=a
this.b=b
this.$ti=c},
bX:function bX(a,b){this.a=a
this.$ti=b},
aK:function aK(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bn:function bn(){},
an:function an(a,b){this.a=a
this.$ti=b},
bO:function bO(){},
du:function du(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bI:function bI(){},
cu:function cu(a,b,c){this.a=a
this.b=b
this.c=c},
cO:function cO(a){this.a=a},
df:function df(a){this.a=a},
al:function al(){},
cg:function cg(){},
ch:function ch(){},
cL:function cL(){},
cK:function cK(){},
aU:function aU(a,b){this.a=a
this.b=b},
cJ:function cJ(a){this.a=a},
a_:function a_(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
d7:function d7(a){this.a=a},
db:function db(a,b){this.a=a
this.b=b
this.c=null},
ab:function ab(a,b){this.a=a
this.$ti=b},
by:function by(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bA:function bA(a,b){this.a=a
this.$ti=b},
bz:function bz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
aa:function aa(a,b){this.a=a
this.$ti=b},
bx:function bx(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bv:function bv(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
dO:function dO(a){this.a=a},
dP:function dP(a){this.a=a},
dQ:function dQ(a){this.a=a},
a2:function a2(){},
aN:function aN(){},
bd:function bd(){},
b3:function b3(){},
bF:function bF(){},
cw:function cw(){},
b4:function b4(){},
bD:function bD(){},
bE:function bE(){},
cx:function cx(){},
cy:function cy(){},
cz:function cz(){},
cA:function cA(){},
cB:function cB(){},
cC:function cC(){},
cD:function cD(){},
bG:function bG(){},
cE:function cE(){},
bZ:function bZ(){},
c_:function c_(){},
c0:function c0(){},
c1:function c1(){},
e7(a,b){var s=b.c
return s==null?b.c=A.c7(a,"ex",[b.x]):s},
eL(a){var s=a.w
if(s===6||s===7)return A.eL(a.x)
return s===11||s===12},
h8(a){return a.as},
a6(a){return A.dC(v.typeUniverse,a,!1)},
aO(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.aO(a1,s,a3,a4)
if(r===s)return a2
return A.eX(a1,r,!0)
case 7:s=a2.x
r=A.aO(a1,s,a3,a4)
if(r===s)return a2
return A.eW(a1,r,!0)
case 8:q=a2.y
p=A.bg(a1,q,a3,a4)
if(p===q)return a2
return A.c7(a1,a2.x,p)
case 9:o=a2.x
n=A.aO(a1,o,a3,a4)
m=a2.y
l=A.bg(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ea(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.bg(a1,j,a3,a4)
if(i===j)return a2
return A.eY(a1,k,i)
case 11:h=a2.x
g=A.aO(a1,h,a3,a4)
f=a2.y
e=A.i7(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.eV(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.bg(a1,d,a3,a4)
o=a2.x
n=A.aO(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.eb(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.cf("Attempted to substitute unexpected RTI kind "+a0))}},
bg(a,b,c,d){var s,r,q,p,o=b.length,n=A.dD(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.aO(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
i8(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.dD(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.aO(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
i7(a,b,c,d){var s,r=b.a,q=A.bg(a,r,c,d),p=b.b,o=A.bg(a,p,c,d),n=b.c,m=A.i8(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.cR()
s.a=q
s.b=o
s.c=m
return s},
e(a,b){a[v.arrayRti]=b
return a},
ff(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.im(s)
return a.$S()}return null},
is(a,b){var s
if(A.eL(b))if(a instanceof A.al){s=A.ff(a)
if(s!=null)return s}return A.ai(a)},
ai(a){if(a instanceof A.m)return A.j(a)
if(Array.isArray(a))return A.C(a)
return A.ec(J.aQ(a))},
C(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
j(a){var s=a.$ti
return s!=null?s:A.ec(a)},
ec(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.hQ(a,s)},
hQ(a,b){var s=a instanceof A.al?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.hz(v.typeUniverse,s.name)
b.$ccache=r
return r},
im(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.dC(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
il(a){return A.aP(A.j(a))},
ef(a){var s
if(a instanceof A.a2)return A.ih(a.$r,a.ag())
s=a instanceof A.al?A.ff(a):null
if(s!=null)return s
if(t.bW.b(a))return J.fE(a).a
if(Array.isArray(a))return A.C(a)
return A.ai(a)},
aP(a){var s=a.r
return s==null?a.r=new A.cX(a):s},
ih(a,b){var s,r,q=b,p=q.length
if(p===0)return t.cD
if(0>=p)return A.c(q,0)
s=A.c9(v.typeUniverse,A.ef(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.c(q,r)
s=A.f_(v.typeUniverse,s,A.ef(q[r]))}return A.c9(v.typeUniverse,s,a)},
a3(a){return A.aP(A.dC(v.typeUniverse,a,!1))},
hP(a){var s=this
s.b=A.i6(s)
return s.b(a)},
i6(a){var s,r,q,p,o
if(a===t.K)return A.hY
if(A.aR(a))return A.i1
s=a.w
if(s===6)return A.hN
if(s===1)return A.fa
if(s===7)return A.hT
r=A.i5(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.aR)){a.f="$i"+q
if(q==="h")return A.hW
if(a===t.m)return A.hV
return A.i0}}else if(s===10){p=A.ig(a.x,a.y)
o=p==null?A.fa:p
return o==null?A.f4(o):o}return A.hL},
i5(a){if(a.w===8){if(a===t.S)return A.ee
if(a===t.i||a===t.o)return A.hX
if(a===t.N)return A.i_
if(a===t.y)return A.ed}return null},
hO(a){var s=this,r=A.hK
if(A.aR(s))r=A.hG
else if(s===t.K)r=A.f4
else if(A.bi(s)){r=A.hM
if(s===t.a3)r=A.f2
else if(s===t.aD)r=A.f5
else if(s===t.az)r=A.cb
else if(s===t.ae)r=A.dE
else if(s===t.dd)r=A.hD
else if(s===t.z)r=A.hF}else if(s===t.S)r=A.Q
else if(s===t.N)r=A.a5
else if(s===t.y)r=A.hB
else if(s===t.o)r=A.f3
else if(s===t.i)r=A.hC
else if(s===t.m)r=A.hE
s.a=r
return s.a(a)},
hL(a){var s=this
if(a==null)return A.bi(s)
return A.iu(v.typeUniverse,A.is(a,s),s)},
hN(a){if(a==null)return!0
return this.x.b(a)},
i0(a){var s,r=this
if(a==null)return A.bi(r)
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.aQ(a)[s]},
hW(a){var s,r=this
if(a==null)return A.bi(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.aQ(a)[s]},
hV(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.m)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
f9(a){if(typeof a=="object"){if(a instanceof A.m)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
hK(a){var s=this
if(a==null){if(A.bi(s))return a}else if(s.b(a))return a
throw A.D(A.f6(a,s),new Error())},
hM(a){var s=this
if(a==null||s.b(a))return a
throw A.D(A.f6(a,s),new Error())},
f6(a,b){return new A.c5("TypeError: "+A.eQ(a,A.U(b,null)))},
eQ(a,b){return A.cl(a)+": type '"+A.U(A.ef(a),null)+"' is not a subtype of type '"+b+"'"},
X(a,b){return new A.c5("TypeError: "+A.eQ(a,b))},
hT(a){var s=this
return s.x.b(a)||A.e7(v.typeUniverse,s).b(a)},
hY(a){return a!=null},
f4(a){if(a!=null)return a
throw A.D(A.X(a,"Object"),new Error())},
i1(a){return!0},
hG(a){return a},
fa(a){return!1},
ed(a){return!0===a||!1===a},
hB(a){if(!0===a)return!0
if(!1===a)return!1
throw A.D(A.X(a,"bool"),new Error())},
cb(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.D(A.X(a,"bool?"),new Error())},
hC(a){if(typeof a=="number")return a
throw A.D(A.X(a,"double"),new Error())},
hD(a){if(typeof a=="number")return a
if(a==null)return a
throw A.D(A.X(a,"double?"),new Error())},
ee(a){return typeof a=="number"&&Math.floor(a)===a},
Q(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.D(A.X(a,"int"),new Error())},
f2(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.D(A.X(a,"int?"),new Error())},
hX(a){return typeof a=="number"},
f3(a){if(typeof a=="number")return a
throw A.D(A.X(a,"num"),new Error())},
dE(a){if(typeof a=="number")return a
if(a==null)return a
throw A.D(A.X(a,"num?"),new Error())},
i_(a){return typeof a=="string"},
a5(a){if(typeof a=="string")return a
throw A.D(A.X(a,"String"),new Error())},
f5(a){if(typeof a=="string")return a
if(a==null)return a
throw A.D(A.X(a,"String?"),new Error())},
hE(a){if(A.f9(a))return a
throw A.D(A.X(a,"JSObject"),new Error())},
hF(a){if(a==null)return a
if(A.f9(a))return a
throw A.D(A.X(a,"JSObject?"),new Error())},
fb(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.U(a[q],b)
return s},
i4(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.fb(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.U(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
f7(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.e([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.l(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.c(a4,l)
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
if(l===8){p=A.i9(a.x)
o=a.y
return o.length>0?p+("<"+A.fb(o,b)+">"):p}if(l===10)return A.i4(a,b)
if(l===11)return A.f7(a,b,null)
if(l===12)return A.f7(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.c(b,n)
return b[n]}return"?"},
i9(a){var s=A.fl(a)
if(s!=null)return s
return"minified:"+a},
hA(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
hz(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.dC(a,b,!1)
else if(typeof m=="number"){s=m
r=A.c8(a,5,"#")
q=A.dD(s)
for(p=0;p<s;++p)q[p]=r
o=A.c7(a,b,q)
n[b]=o
return o}else return m},
hy(a,b){return A.f0(a.tR,b)},
hx(a,b){return A.f0(a.eT,b)},
dC(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.eZ(a,null,b,!1)
r.set(b,s)
return s},
c9(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.eZ(a,b,c,!0)
q.set(c,r)
return r},
f_(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ea(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
eZ(a,b,c,d){return A.hq(A.hk(a,b,c,d))},
au(a,b){b.a=A.hO
b.b=A.hP
return b},
c8(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.a1(null,null)
s.w=b
s.as=c
r=A.au(a,s)
a.eC.set(c,r)
return r},
eX(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.hv(a,b,r,c)
a.eC.set(r,s)
return s},
hv(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.aR(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.bi(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.a1(null,null)
q.w=6
q.x=b
q.as=c
return A.au(a,q)},
eW(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.ht(a,b,r,c)
a.eC.set(r,s)
return s},
ht(a,b,c,d){var s,r
if(d){s=b.w
if(A.aR(b)||b===t.K)return b
else if(s===1)return A.c7(a,"ex",[b])
else if(b===t.P||b===t.T)return t.cR}r=new A.a1(null,null)
r.w=7
r.x=b
r.as=c
return A.au(a,r)},
hw(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.a1(null,null)
s.w=13
s.x=b
s.as=q
r=A.au(a,s)
a.eC.set(q,r)
return r},
c6(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
hs(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
c7(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.c6(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.a1(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.au(a,r)
a.eC.set(p,q)
return q},
ea(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.c6(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.a1(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.au(a,o)
a.eC.set(q,n)
return n},
eY(a,b,c){var s,r,q="+"+(b+"("+A.c6(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.a1(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.au(a,s)
a.eC.set(q,r)
return r},
eV(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.c6(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.c6(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.hs(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.a1(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.au(a,p)
a.eC.set(r,o)
return o},
eb(a,b,c,d){var s,r=b.as+("<"+A.c6(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.hu(a,b,c,r,d)
a.eC.set(r,s)
return s},
hu(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.dD(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.aO(a,b,r,0)
m=A.bg(a,c,r,0)
return A.eb(a,n,m,c!==m)}}l=new A.a1(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.au(a,l)},
hk(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
hq(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.hm(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.eS(a,r,l,k,!1)
else if(q===46)r=A.eS(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.aM(a.u,a.e,k.pop()))
break
case 94:k.push(A.hw(a.u,k.pop()))
break
case 35:k.push(A.c8(a.u,5,"#"))
break
case 64:k.push(A.c8(a.u,2,"@"))
break
case 126:k.push(A.c8(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.ho(a,k)
break
case 38:A.hn(a,k)
break
case 63:p=a.u
k.push(A.eX(p,A.aM(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.eW(p,A.aM(p,a.e,k.pop()),a.n))
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
A.eT(a.u,a.e,o)
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
return A.aM(a.u,a.e,m)},
hm(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
eS(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.hA(s,o.x)[p]
if(n==null)A.bj('No "'+p+'" in "'+A.h8(o)+'"')
d.push(A.c9(s,o,n))}else d.push(p)
return m},
ho(a,b){var s,r=a.u,q=A.eR(a,b),p=b.pop()
if(typeof p=="string")b.push(A.c7(r,p,q))
else{s=A.aM(r,a.e,p)
switch(s.w){case 11:b.push(A.eb(r,s,q,a.n))
break
default:b.push(A.ea(r,s,q))
break}}},
hl(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.eR(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.aM(p,a.e,o)
q=new A.cR()
q.a=s
q.b=n
q.c=m
b.push(A.eV(p,r,q))
return
case-4:b.push(A.eY(p,b.pop(),s))
return
default:throw A.d(A.cf("Unexpected state under `()`: "+A.t(o)))}},
hn(a,b){var s=b.pop()
if(0===s){b.push(A.c8(a.u,1,"0&"))
return}if(1===s){b.push(A.c8(a.u,4,"1&"))
return}throw A.d(A.cf("Unexpected extended operation "+A.t(s)))},
eR(a,b){var s=b.splice(a.p)
A.eT(a.u,a.e,s)
a.p=b.pop()
return s},
aM(a,b,c){if(typeof c=="string")return A.c7(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.hp(a,b,c)}else return c},
eT(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.aM(a,b,c[s])},
hr(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.aM(a,b,c[s])},
hp(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.cf("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.cf("Bad index "+c+" for "+b.j(0)))},
iu(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.A(a,b,null,c,null)
r.set(c,s)}return s},
A(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.aR(d))return!0
s=b.w
if(s===4)return!0
if(A.aR(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.A(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.A(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.A(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.A(a,b.x,c,d,e))return!1
return A.A(a,A.e7(a,b),c,d,e)}if(s===6)return A.A(a,p,c,d,e)&&A.A(a,b.x,c,d,e)
if(q===7){if(A.A(a,b,c,d.x,e))return!0
return A.A(a,b,c,A.e7(a,d),e)}if(q===6)return A.A(a,b,c,p,e)||A.A(a,b,c,d.x,e)
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
if(!A.A(a,j,c,i,e)||!A.A(a,i,e,j,c))return!1}return A.f8(a,b.x,c,d.x,e)}if(q===11){if(b===t.V)return!0
if(p)return!1
return A.f8(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.hU(a,b,c,d,e)}if(o&&q===10)return A.hZ(a,b,c,d,e)
return!1},
f8(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.A(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.A(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.A(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.A(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.A(a3,e[a+2],a7,g,a5))return!1
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
for(o=0;o<q;++o)p[o]=A.c9(a,b,r[o])
return A.f1(a,p,null,c,d.y,e)}return A.f1(a,b.y,null,c,d.y,e)},
f1(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.A(a,b[s],d,e[s],f))return!1
return!0},
hZ(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.A(a,r[s],c,q[s],e))return!1
return!0},
bi(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.aR(a))if(s!==6)r=s===7&&A.bi(a.x)
return r},
aR(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
f0(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
dD(a){return a>0?new Array(a):v.typeUniverse.sEA},
a1:function a1(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cR:function cR(){this.c=this.b=this.a=null},
cX:function cX(a){this.a=a},
cQ:function cQ(){},
c5:function c5(a){this.a=a},
eU(a,b,c){return 0},
c4:function c4(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
be:function be(a,b){this.a=a
this.$ti=b},
eC(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
bB(a,b,c){return b.h("@<0>").A(c).h("e2<1,2>").a(A.ii(a,new A.a_(b.h("@<0>").A(c).h("a_<1,2>"))))},
K(a,b){return new A.a_(a.h("@<0>").A(b).h("a_<1,2>"))},
eE(a){return new A.aL(a.h("aL<0>"))},
e3(a){return new A.aL(a.h("aL<0>"))},
e9(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
h2(a,b,c){var s=A.eC(b,c)
a.E(0,new A.dc(s,b,c))
return s},
eD(a,b,c){var s=A.eC(b,c)
s.P(0,a)
return s},
h3(a,b){var s=A.eE(b)
s.P(0,a)
return s},
e4(a){var s,r
if(A.ek(a))return"{...}"
s=new A.ba("")
try{r={}
B.a.l($.V,a)
s.a+="{"
r.a=!0
a.E(0,new A.de(r,s))
s.a+="}"}finally{if(0>=$.V.length)return A.c($.V,-1)
$.V.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
aL:function aL(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cV:function cV(a){this.a=a
this.b=null},
bY:function bY(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
dc:function dc(a,b,c){this.a=a
this.b=b
this.c=c},
q:function q(){},
o:function o(){},
dd:function dd(a){this.a=a},
de:function de(a,b){this.a=a
this.b=b},
ca:function ca(){},
b2:function b2(){},
aI:function aI(a,b){this.a=a
this.$ti=b},
ar:function ar(){},
c3:function c3(){},
bf:function bf(){},
i3(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.en(r)
q=String(s)
throw A.d(new A.d3(q))}q=A.dF(p)
return q},
dF(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cT(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.dF(a[s])
return a},
eB(a,b,c){return new A.bw(a,b)},
hI(a){return a.M()},
hi(a,b){return new A.dy(a,[],A.ie())},
hj(a,b,c){var s,r=new A.ba(""),q=A.hi(r,b)
q.a9(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
cT:function cT(a,b){this.a=a
this.b=b
this.c=null},
cU:function cU(a){this.a=a},
ci:function ci(){},
ck:function ck(){},
bw:function bw(a,b){this.a=a
this.b=b},
cv:function cv(a,b){this.a=a
this.b=b},
d8:function d8(){},
da:function da(a){this.b=a},
d9:function d9(a){this.a=a},
dz:function dz(){},
dA:function dA(a,b){this.a=a
this.b=b},
dy:function dy(a,b,c){this.c=a
this.a=b
this.b=c},
h4(a,b,c,d){var s,r=c?J.ez(a,d):J.fZ(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
b1(a,b,c){var s,r=A.e([],c.h("i<0>"))
for(s=J.aj(a);s.n();)B.a.l(r,c.a(s.gp()))
if(b)return r
r.$flags=1
return r},
b0(a,b){var s,r
if(Array.isArray(a))return A.e(a.slice(0),b.h("i<0>"))
s=A.e([],b.h("i<0>"))
for(r=J.aj(a);r.n();)B.a.l(s,r.gp())
return s},
h5(a,b,c){var s,r=J.ez(a,c)
for(s=0;s<a;++s)B.a.i(r,s,b.$1(s))
return r},
G(a,b){var s=A.b1(a,!1,b)
s.$flags=3
return s},
eN(a,b,c){var s=J.aj(b)
if(!s.n())return a
if(c.length===0){do a+=A.t(s.gp())
while(s.n())}else{a+=A.t(s.gp())
while(s.n())a=a+c+A.t(s.gp())}return a},
fS(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.d(A.fF(b,"name","No enum value with that name"))},
fR(a,b){var s,r,q=A.K(t.N,b)
for(s=0;s<2;++s){r=a[s]
q.i(0,r.b,r)}return q},
cl(a){if(typeof a=="number"||A.ed(a)||a==null)return J.cd(a)
if(typeof a=="string")return JSON.stringify(a)
return A.eI(a)},
cf(a){return new A.ce(a)},
cZ(a){return new A.ak(!1,null,null,a)},
fF(a,b,c){return new A.ak(!0,a,b,c)},
eJ(a){var s=null
return new A.b7(s,s,!1,s,s,a)},
eK(a,b){return new A.b7(null,null,!0,a,b,"Value not in range")},
aG(a,b,c,d,e){return new A.b7(b,c,!0,a,d,"Invalid value")},
h7(a,b,c){if(0>a||a>c)throw A.d(A.aG(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.aG(b,a,c,"end",null))
return b}return c},
e6(a,b){if(a<0)throw A.d(A.aG(a,0,null,b,null))
return a},
dY(a,b,c,d){return new A.co(b,!0,a,d,"Index out of range")},
bT(a){return new A.bS(a)},
eP(a){return new A.cN(a)},
eM(a){return new A.b9(a)},
Y(a){return new A.cj(a)},
fY(a,b,c){var s,r
if(A.ek(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.e([],t.s)
B.a.l($.V,a)
try{A.i2(a,s)}finally{if(0>=$.V.length)return A.c($.V,-1)
$.V.pop()}r=A.eN(b,t.A.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
dZ(a,b,c){var s,r
if(A.ek(a))return b+"..."+c
s=new A.ba(b)
B.a.l($.V,a)
try{r=s
r.a=A.eN(r.a,a,", ")}finally{if(0>=$.V.length)return A.c($.V,-1)
$.V.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
i2(a,b){var s,r,q,p,o,n,m,l=a.gq(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.t(l.gp())
B.a.l(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.c(b,-1)
r=b.pop()
if(0>=b.length)return A.c(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.l(b,A.t(p))
return}r=A.t(p)
if(0>=b.length)return A.c(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.c(b,-1)
k-=b.pop().length+2;--j}B.a.l(b,"...")
return}}q=A.t(p)
r=A.t(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.c(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.l(b,m)
B.a.l(b,q)
B.a.l(b,r)},
eF(a,b,c,d,e){return new A.ay(a,b.h("@<0>").A(c).A(d).A(e).h("ay<1,2,3,4>"))},
eG(a,b,c,d){var s
if(B.i===c){s=B.d.gu(a)
b=J.a8(b)
return A.e8(A.as(A.as($.dW(),s),b))}if(B.i===d){s=B.d.gu(a)
b=J.a8(b)
c=J.a8(c)
return A.e8(A.as(A.as(A.as($.dW(),s),b),c))}s=B.d.gu(a)
b=J.a8(b)
c=J.a8(c)
d=J.a8(d)
d=A.e8(A.as(A.as(A.as(A.as($.dW(),s),b),c),d))
return d},
cP:function cP(){},
u:function u(){},
ce:function ce(a){this.a=a},
bR:function bR(){},
ak:function ak(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b7:function b7(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
co:function co(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
bS:function bS(a){this.a=a},
cN:function cN(a){this.a=a},
b9:function b9(a){this.a=a},
cj:function cj(a){this.a=a},
bP:function bP(){},
dw:function dw(a){this.a=a},
d3:function d3(a){this.a=a},
b:function b(){},
y:function y(a,b,c){this.a=a
this.b=b
this.$ti=c},
bH:function bH(){},
m:function m(){},
ba:function ba(a){this.a=a},
cS:function cS(){},
cW:function cW(){this.b=this.a=0},
iA(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b0(a1,t.bM),c=A.b0(a,t.R)
for(s=A.C(c),r=s.h("p(1)"),s=s.h("af<1>"),q=s.h("b.E"),p=b,o=a2;;){n={}
m=A.fi(d)
if(m!=null)return m.a
while(l=c.length,l<4){if(!(o>=0&&o<4))return A.c(a0,o)
k=a0[o]
if(p!=null&&p.a===o){j=B.a.a5(k,p.b)
p=null}else j=A.ei(k,c,d,o)
k.$flags&1&&A.aT(k,"removeAt",1)
if(j<0||j>=k.length)A.bj(A.eK(j,null))
B.a.l(c,new A.ah(o,k.splice(j,1)[0]))
o=B.d.C(o+1,4)}i=n.a=-2
for(h=0;h<l;++h,i=g){g=Math.max(i,c[h].b)
n.a=g}f=A.b0(new A.af(c,r.a(new A.dU(n)),s),q)
l=A.C(f)
e=new A.ad(f,l.h("B(1)").a(new A.dV()),l.h("ad<1,B>")).aU(0)
B.a.l(d,e.a===1?e.ga1(0):null)
o=B.a.gS(f).a
B.a.R(c)}},
ei(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=new A.dN(a),d=new A.dM(a)
if(a.length===1)return 0
s=(a0&1)===0?B.b:B.c
if(c.length!==0)r=B.a.gS(c)!==s||c.length>1
else r=!1
q=b.length
if(q===0){if(c.length!==0)return r?d.$0():e.$0()
q=A.b0(a,t.S)
B.a.aY(q)
if(B.a.gbC(q)>=10){p=q.length
o=p-2
if(!(o>=0))return A.c(q,o)
o=q[o]>=6
p=o}else p=!1
if(p){p=q.length
o=p-2
if(!(o>=0))return A.c(q,o)
return B.a.a5(a,q[o])}return d.$0()}for(n=-2,m=-2,l=0;l<q;++l){p=b[l]
k=p.b
if(((p.a&1)===0?B.b:B.c)===s)m=Math.max(m,k)
else n=Math.max(n,k)}if(q===1)q=((B.a.gS(b).a&1)===0?B.b:B.c)!==s
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
if(c.length!==0&&B.a.gS(c)===s){f=B.a.a5(a,n)
if(f>=0)return f}return e.$0()},
a4:function a4(a,b){this.a=a
this.b=b},
cM:function cM(a,b){this.a=a
this.b=b},
dm:function dm(){},
dj:function dj(){},
dk:function dk(){},
dl:function dl(a,b){this.a=a
this.b=b},
dn:function dn(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dU:function dU(a){this.a=a},
dV:function dV(){},
dN:function dN(a){this.a=a},
dM:function dM(a){this.a=a},
fI(a,b){return new A.O(a,b)},
fJ(a){return new A.O(B.a.aP(B.x,new A.d_(a)),B.a.aP(B.q,new A.d0(a)))},
T:function T(a,b){this.a=a
this.b=b},
N:function N(a,b,c){this.c=a
this.a=b
this.b=c},
O:function O(a,b){this.a=a
this.b=b},
d_:function d_(a){this.a=a},
d0:function d0(a){this.a=a},
ij(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=t.S,a6=A.K(a5,t.at)
for(s=t.N,r=0;r<4;++r)a6.i(0,r,A.e3(s))
if(B.a.a_(a7,new A.dH()))return a6
q=new A.dJ(a6)
p=A.e3(t.H)
o=A.K(a5,t.L)
for(a5=a7.length,s=t._,n=!1,m=null,l=1,k=0,j=!1,i=!1,h=0;h<a7.length;a7.length===a5||(0,A.z)(a7),++h){g=a7[h]
A:{if(g instanceof A.aY){o.R(0)
m=g
l=1
k=0
j=!1
i=!1
break A}if(g instanceof A.b6){k=g.b
break A}f=g instanceof A.az
if(f&&g.b)break A
if(f){p.l(0,(g.a&1)===0?B.b:B.c)
i=k===6
j=!0
break A}if(g instanceof A.aV){if(l===3&&!g.c)o.i(0,g.a,g.b)
break A}if(g instanceof A.b8){l=g.a+1
break A}if(g instanceof A.ao){e=g.a
f=m!=null
if(f&&m.e==null&&g.b>1)n=!0
if(!f||e==null)continue
if(i)q.$2(e,"game_seis_burro")
f=!j
if(f&&g.b===12)q.$2(e,"game_truco_12")
if(m.f)q.$2(e,"game_iron_hand")
for(d=m.d,c=m.b,r=0;r<4;++r){if(((r&1)===0?B.b:B.c)!==e)continue
if(f&&J.I(o.k(0,r),B.F))a6.k(0,r).l(0,"game_ace_river")
b=c.length
if(b!==4)continue
if(!(r<b))return A.c(c,r)
a=c[r]
if(a.length===3&&B.a.aO(a,new A.dI()))a6.k(0,r).l(0,"game_666")
b=A.e3(s)
for(a0=a.length,a1=0;a1<a.length;a.length===a0||(0,A.z)(a),++a1){a2=a[a1]
if(a8.D(a2,d)>=10){a3=a8.D(a2,d)-10
if(!(a3>=0&&a3<4))return A.c(B.q,a3)
b.l(0,B.q[a3])}}for(a0=B.a7.gJ(),a0=a0.gq(a0);a0.n();){a3=a0.gp()
a4=a3.a
if(b.bq(a3.b))a6.k(0,r).l(0,a4)}}break A}if(g instanceof A.aA)break A
if(g instanceof A.aC){if(!n)q.$2(g.a,"game_comadre")
f=g.a
if(p.V(0,f))q.$2(f,"game_ran_won")
break A}}}return a6},
dH:function dH(){},
dJ:function dJ(a){this.a=a},
dI:function dI(){},
fd(a){var s
A:{if(a instanceof A.H){s=A.K(t.N,t.X)
s.i(0,"t","play")
s.i(0,"s",a.a)
s.i(0,"c",a.b.ga4())
if(a.c)s.i(0,"x",!0)
break A}if(a instanceof A.M){s=A.bB(["t","raise","s",a.a],t.N,t.X)
break A}if(a instanceof A.J){s=A.bB(["t","accept","s",a.a],t.N,t.X)
break A}if(a instanceof A.P){s=A.bB(["t","fold","s",a.a],t.N,t.X)
break A}s=null}return s},
fc(a){var s,r,q=a.k(0,"s")
q.toString
A.Q(q)
s=a.k(0,"t")
A:{if("play"===s){r=a.k(0,"c")
r.toString
q=new A.H(A.fJ(A.a5(r)),J.I(a.k(0,"x"),!0),q)
break A}if("raise"===s){q=new A.M(q)
break A}if("accept"===s){q=new A.J(q)
break A}if("fold"===s){q=new A.P(q)
break A}q=A.bj(A.bp("unknown action "+A.t(a.k(0,"t"))))}return q},
cn:function cn(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$
_.w=g
_.x=0},
d4:function d4(a){this.a=a},
d5:function d5(a){this.a=a},
aE:function aE(a,b){this.a=a
this.b=b},
dt:function dt(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
hb(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=new A.bJ(b3,b4),b0=new A.di(b4),b1=(b4&1)===0?B.b:B.c,b2=b3.r
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
l=b3.gam()
k=b3.ax
j=b3.ch
i=b3.CW
h=b3.cx
g=t.S
f=A.ew(b3.c,t.H,g)
e=A.e([],t.bP)
for(d=A.G(b3.z,t.F),c=d.length,b=t.cd,a=0;a<c;++a){a0=d[a]
a1=A.e([],b)
for(a2=a0.a,a3=a2.length,a4=0;a4<a3;++a4)a1.push(b0.$1(a2[a4]))
e.push(new A.cI(a1,a0.b,a0.c))}d=A.e([],b)
for(c=A.G(b3.Q,t.n),b=c.length,a=0;a<b;++a)d.push(b0.$1(c[a]))
c=a9.gW()
b=A.e([],t.t)
for(a1=t.L,a5=0;a5<4;++a5){a2=b3.w
if(!(a5<a2.length))return A.c(a2,a5)
a6=A.b1(a2[a5],!1,a1)
a6.$flags=3
b.push(a6.length)}a1=a9.gar()
a2=a9.gaS()
a3=b3.gak()
a7=b3.aL(b4)
a8=b3.r===B.j&&b3.as===b4
return new A.at(b4,b3.a,r,q,p,o,n,m,l,k,j,i,h,f,e,d,c,b,a1,a2,a3,a7,s,a8,b3.db,b3.dx,A.ew(b7.a,g,t.N),b7.bH(b1),b7.d,b5)},
b5:function b5(a,b,c){this.a=a
this.b=b
this.c=c},
cI:function cI(a,b,c){this.a=a
this.b=b
this.c=c},
at:function at(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0){var _=this
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
_.k2=b0},
di:function di(a){this.a=a},
dh:function dh(a,b){var _=this
_.a=a
_.b=null
_.e=_.d=_.c=!1
_.r=b},
bp(a){return new A.cm(a)},
hc(a,b,c){var s,r,q,p,o=A.bB([B.b,0,B.c,0],t.H,t.S),n=A.e([],t.B),m=t.cm,l=J.e_(4,m)
for(s=t.Y,r=0;r<4;++r)l[r]=A.e([],s)
q=J.e_(4,m)
for(r=0;r<4;++r)q[r]=A.e([],s)
m=A.e([],t.d2)
s=A.e([],t.c5)
p=new A.cW()
p.b1(c)
o=new A.dp(b,p,o,n,B.d.C(a+3,4),B.o,l,q,m,s)
o.aa()
return o},
hd(a,b){var s,r,q,p,o=null
A:{s=a instanceof A.H
r=!1
if(s){r=b instanceof A.H
q=a
p=b}else{q=o
p=q}if(r){r=s?p:b
t.D.a(r)
r=q.b.L(0,r.b)&&q.c===r.c&&q.a===r.a
break A}r=!1
if(a instanceof A.M){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.M
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
if(a instanceof A.P){if(s)r=p
else{r=b
p=r
s=!0}r=r instanceof A.P
q=a}else q=o
if(r){r=s?p:b
t.q.a(r)
r=q.a===r.a
break A}r=!1
break A}return r},
io(a){var s,r,q=A.e([],t.v)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.z)(a),++r)q.push(a[r].b)
return A.fi(q)},
fi(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0,p=0;p<s;++p){o=a[p]
if(o===B.b)++r
if(o===B.c)++q}if(r>=2)return B.ai
if(q>=2)return B.aj
if(s>=2){n=a[0]
m=a[1]
l=n==null
if(!l&&m==null)return new A.ag(n)
if(l&&m!=null)return new A.ag(m)}if(s===3){if(2>=s)return A.c(a,2)
s=a[2]
return new A.ag(s==null?a[0]:s)}return null},
am:function am(a,b){this.a=a
this.b=b},
W:function W(){},
H:function H(a,b,c){this.b=a
this.c=b
this.a=c},
M:function M(a){this.a=a},
J:function J(a){this.a=a},
P:function P(a){this.a=a},
E:function E(){},
aY:function aY(a,b,c,d){var _=this
_.b=a
_.d=b
_.e=c
_.f=d},
aW:function aW(a,b){this.a=a
this.b=b},
aV:function aV(a,b,c){this.a=a
this.b=b
this.c=c},
b6:function b6(a,b,c){this.a=a
this.b=b
this.c=c},
bL:function bL(a){this.a=a},
az:function az(a,b){this.a=a
this.b=b},
b8:function b8(a){this.a=a},
ao:function ao(a,b){this.a=a
this.b=b},
aC:function aC(a){this.a=a},
aA:function aA(){},
a0:function a0(a,b,c){this.a=a
this.b=b
this.c=c},
bN:function bN(a,b,c){this.a=a
this.b=b
this.c=c},
cF:function cF(a,b,c){this.a=a
this.b=b
this.c=c},
cm:function cm(a){this.a=a},
dp:function dp(a,b,c,d,e,f,g,h,i,j){var _=this
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
_.dx=_.db=null},
ds:function ds(a){this.a=a},
dq:function dq(a,b){this.a=a
this.b=b},
dr:function dr(){},
bJ:function bJ(a,b){this.a=a
this.b=b},
B:function B(a,b){this.a=a
this.b=b},
iz(b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8="forfeit",a9=t.G,b0=t.N,b1=t.X,b2=a9.a(B.E.br(b4,a7)).G(0,b0,b1),b3=J.a7(b2,"rules")
b3.toString
b3=a9.a(b3).G(0,b0,b1)
h=A.fR(B.a_,t.aJ).k(0,b3.k(0,"manilhas"))
g=A.cb(b3.k(0,"coberta"))
f=A.cb(b3.k(0,"ferro"))
e=A.cb(b3.k(0,"verNoTruco"))
d=A.cb(b3.k(0,"verNaMaoDeOnze"))
c=A.cb(b3.k(0,"terceiraCarta"))
b=A.dE(b3.k(0,"tempo"))
b=b==null?a7:B.p.aT(b)
b3=A.dE(b3.k(0,"lento"))
b3=b3==null?a7:B.p.aT(b3)
if(h==null)h=B.y
if(b==null)b=20
if(b3==null)b3=0
b3=new A.dt("paulista","Truco",h,B.a4,11,3,12,g!==!1,f!==!1,e!==!1,d!==!1,c!==!1,b,b3)
b=J.a7(b2,"seed")
b.toString
A.Q(b)
c=J.a7(b2,"firstDealer")
c.toString
A.Q(c)
d=A.e([],t.cG)
h=J.a7(b2,"bots")
h.toString
t.j.a(h)
g=h.length
f=t.h
a=0
for(;a<h.length;h.length===g||(0,A.z)(h),++a){a0=h[a]
d.push(a0==null?a7:A.fS(B.a0,A.a5(a0),f))}h=t.d
g=A.e([],h)
f=t.e.a(J.a7(b2,"log"))
if(f==null)f=B.a3
e=f.length
a=0
for(;a<f.length;f.length===e||(0,A.z)(f),++a)g.push(a9.a(f[a]).G(0,b0,b1))
f=t.S
e=A.bB([B.b,0,B.c,0],t.H,f)
a1=A.G(d,t.ch)
a2=new A.cn(b3,b,c,a1,A.e([],h),B.R,new A.dh(A.K(f,b0),e))
a2.b0(d,c,g,a7,b3,b)
s=a2
r=null
q=null
b3=t.a5.a(J.a7(b2,"act"))
p=b3==null?a7:b3.G(0,b0,b1)
try{if(A.ee(J.a7(b2,a8))){a9=J.a7(b2,a8)
a9.toString
a3=s.a0(A.Q(a9))}else if(J.I(J.a7(b2,"timeout"),!0)){a9=s.bG(A.f2(J.a7(b2,"missLimit")))
a3=a9}else{if(p==null){a9=s
a4=A.K(f,t.Q)
a9.aC(a4)
if(a4.a===0)a9.Z(a4,0)
a9=a4}else{b3=s
h=p.k(0,"seat")
h.toString
A.Q(h)
g=p.k(0,"action")
g.toString
g=t.f.a(a9.a(g).G(0,b0,b1))
if(J.I(g.k(0,"t"),"blind")){a9=g.k(0,"i")
a9.toString
A.Q(a9)
b1=b3.r
b1===$&&A.av()
b1=b1.w
if(!(h>=0&&h<b1.length))return A.c(b1,h)
a5=A.G(b1[h],t.L)
if(a9<0||a9>=a5.length)A.bj(A.bp("no card "+a9))
if(!(a9>=0&&a9<a5.length))return A.c(a5,a9)
a9=b3.aj(h,new A.H(a5[a9],!1,h))}else{a9=A.eD(g,b0,b1)
a9.i(0,"s",h)
a9=b3.aj(h,A.fc(a9))}}a3=a9}o=a3
n=A.K(f,t.W)
for(a9=o,a9=new A.aa(a9,A.j(a9).h("aa<1,2>")).gq(0);a9.n();){b1=a9.d
b1.toString
m=b1
b1=m.a
l=[]
for(b3=m.b,h=b3.length,a=0;a<b3.length;b3.length===h||(0,A.z)(b3),++a){k=b3[a]
J.eq(l,k.M())}J.fz(n,b1,l)}r=n}catch(a6){n=A.en(a6)
if(n instanceof A.cm){j=n
q=j.a
r=B.G}else{i=n
q=A.t(i)
r=B.G}}n=s.r
n===$&&A.av()
l=t.K
a9=A.K(b0,l)
a9.i(0,"log",s.e)
b1=A.K(b0,t.W)
for(b3=r.gJ(),b3=b3.gq(b3);b3.n();){h=b3.gp()
b1.i(0,""+h.a,h.b)}a9.i(0,"frames",b1)
a9.i(0,"phase",n.r.b)
b1=n.db
if(b1!=null)a9.i(0,"winner",b1.b)
b1=n.c
a9.i(0,"scores",A.e([b1.k(0,B.b),b1.k(0,B.c)],t.c))
b1=s.gaV()
if(b1!=null)a9.i(0,"waitingFor",b1)
b1=A.e([],t.bc)
for(b3=n.d,h=B.a.gq(b3),g=new A.aJ(h,t.ca),f=t.r;g.n();){e=f.a(h.gp())
d=A.K(b0,l)
c=e.a
if(c!=null)d.i(0,"w",c.b)
d.i(0,"p",e.b)
b1.push(d)}a9.i(0,"hands",b1)
if(n.r===B.h){l=A.K(b0,t.aY)
for(b0=A.ij(b3,n.a),b0=new A.aa(b0,A.j(b0).h("aa<1,2>")).gq(0);b0.n();){m=b0.d
b1=m.b
if(b1.gv(b1)){b3=m.a
b1=A.b0(b1,A.j(b1).c)
l.i(0,""+b3,b1)}}a9.i(0,"feats",l)}n=n.dx
if(n!=null)a9.i(0,a8,n.b)
n=q
if(n!=null)a9.i(0,"error",n)
return B.E.bt(a9,a7)},
iw(){var s,r=v.G.globalThis,q=new A.dS()
if(typeof q=="function")A.bj(A.cZ("Attempting to rewrap a JS function."))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.hH,q)
s[$.eo()]=q
r.trucoEngine=s},
dS:function dS(){},
fl(a){return v.mangledGlobalNames[a]},
iB(a){throw A.D(new A.b_("Field '"+a+"' has been assigned during initialization."),new Error())},
av(){throw A.D(A.h1(""),new Error())},
iC(){throw A.D(A.h0(""),new Error())},
hH(a,b,c){t.Z.a(a)
if(A.Q(c)>=1)return a.$1(b)
return a.$0()}},B={}
var w=[A,J,B]
var $={}
A.e0.prototype={}
J.cp.prototype={
L(a,b){return a===b},
gu(a){return A.bK(a)},
j(a){return"Instance of '"+A.cH(a)+"'"},
gB(a){return A.aP(A.ec(this))}}
J.cs.prototype={
j(a){return String(a)},
gu(a){return a?519018:218159},
gB(a){return A.aP(t.y)},
$in:1,
$ip:1}
J.br.prototype={
L(a,b){return null==b},
j(a){return"null"},
gu(a){return 0},
$in:1}
J.bt.prototype={$iw:1}
J.aq.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.cG.prototype={}
J.bb.prototype={}
J.ap.prototype={
j(a){var s=a[$.fn()]
if(s==null)s=a[$.eo()]
if(s==null)return this.b_(a)
return"JavaScript function for "+J.cd(s)},
$iaB:1}
J.bs.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.bu.prototype={
gu(a){return 0},
j(a){return String(a)}}
J.i.prototype={
l(a,b){A.C(a).c.a(b)
a.$flags&1&&A.aT(a,29)
a.push(b)},
bF(a,b){var s
a.$flags&1&&A.aT(a,"remove",1)
for(s=0;s<a.length;++s)if(J.I(a[s],b)){a.splice(s,1)
return!0}return!1},
P(a,b){var s,r
A.C(a).h("b<1>").a(b)
a.$flags&1&&A.aT(a,"addAll",2)
if(Array.isArray(b)){this.b4(a,b)
return}for(s=b.length,r=0;r<b.length;b.length===s||(0,A.z)(b),++r)a.push(b[r])},
b4(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.Y(a))
for(r=0;r<s;++r)a.push(b[r])},
R(a){a.$flags&1&&A.aT(a,"clear","clear")
a.length=0},
aP(a,b){var s,r,q
A.C(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.d(A.Y(a))}throw A.d(A.cq())},
H(a,b){if(!(b>=0&&b<a.length))return A.c(a,b)
return a[b]},
aZ(a,b,c){var s=a.length
if(b>s)throw A.d(A.aG(b,0,s,"start",null))
if(c<b||c>s)throw A.d(A.aG(c,b,s,"end",null))
if(b===c)return A.e([],A.C(a))
return A.e(a.slice(b,c),A.C(a))},
gS(a){if(a.length>0)return a[0]
throw A.d(A.cq())},
gbC(a){var s=a.length
if(s>0)return a[s-1]
throw A.d(A.cq())},
ga1(a){var s=a.length
if(s===1){if(0>=s)return A.c(a,0)
return a[0]}if(s===0)throw A.d(A.cq())
throw A.d(A.ey())},
a_(a,b){var s,r
A.C(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.Y(a))}return!1},
aO(a,b){var s,r
A.C(a).h("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.Y(a))}return!0},
aY(a){var s,r,q,p,o,n
a.$flags&2&&A.aT(a,"sort")
s=a.length
if(s<2)return
if(s===2){r=a[0]
q=a[1]
p=J.eA(r,q)
if(typeof p!=="number")return p.bM()
if(p>0){a[0]=q
a[1]=r}return}o=0
if(A.C(a).c.b(null))for(n=0;n<a.length;++n)if(a[n]===void 0){a[n]=null;++o}a.sort(A.ic(J.hR(),2))
if(o>0)this.bj(a,o)},
bj(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aw(a,b){var s,r,q,p
a.$flags&2&&A.aT(a,"shuffle")
s=a.length
while(s>1){r=b.a7(s);--s
q=a.length
if(!(s<q))return A.c(a,s)
p=a[s]
if(!(r>=0&&r<q))return A.c(a,r)
a[s]=a[r]
a[r]=p}},
a5(a,b){var s,r=a.length
if(0>=r)return-1
for(s=0;s<r;++s){if(!(s<a.length))return A.c(a,s)
if(J.I(a[s],b))return s}return-1},
V(a,b){var s
for(s=0;s<a.length;++s)if(J.I(a[s],b))return!0
return!1},
gt(a){return a.length===0},
gv(a){return a.length!==0},
j(a){return A.dZ(a,"[","]")},
gq(a){return new J.aw(a,a.length,A.C(a).h("aw<1>"))},
gu(a){return A.bK(a)},
gm(a){return a.length},
i(a,b,c){A.C(a).c.a(c)
a.$flags&2&&A.aT(a)
if(!(b>=0&&b<a.length))throw A.d(A.fg(a,b))
a[b]=c},
bD(a,b){var s,r
A.C(a).h("p(1)").a(b)
s=a.length-1
if(s<0)return-1
for(r=s;r>=0;--r){if(!(r<a.length))return A.c(a,r)
if(b.$1(a[r]))return r}return-1},
$if:1,
$ib:1,
$ih:1}
J.cr.prototype={
bI(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.cH(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.d6.prototype={}
J.aw.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.z(q)
throw A.d(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iv:1}
J.aZ.prototype={
aM(a,b){var s
A.f3(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gap(b)
if(this.gap(a)===s)return 0
if(this.gap(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gap(a){return a===0?1/a<0:a<0},
aT(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.bT(""+a+".toInt()"))},
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
O(a,b){return(a|0)===a?a/b|0:this.bn(a,b)},
bn(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.bT("Result of truncating division is "+A.t(s)+": "+A.t(a)+" ~/ "+b))},
aJ(a,b){var s
if(a>0)s=this.bl(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bl(a,b){return b>31?0:a>>>b},
gB(a){return A.aP(t.o)},
$ia9:1,
$il:1,
$iR:1}
J.bq.prototype={
gB(a){return A.aP(t.S)},
$in:1,
$ia:1}
J.ct.prototype={
gB(a){return A.aP(t.i)},
$in:1}
J.aD.prototype={
X(a,b,c){return a.substring(b,A.h7(b,c,a.length))},
aM(a,b){var s
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
gB(a){return A.aP(t.N)},
gm(a){return a.length},
$in:1,
$ia9:1,
$ik:1}
A.bc.prototype={
gq(a){var s=this.a
return new A.bk(s.gq(s),A.j(this).h("bk<1,2>"))},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
j(a){return this.a.j(0)}}
A.bk.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iv:1}
A.ax.prototype={}
A.bW.prototype={$if:1}
A.ay.prototype={
G(a,b,c){return new A.ay(this.a,this.$ti.h("@<1,2>").A(b).A(c).h("ay<1,2,3,4>"))},
k(a,b){return this.$ti.h("4?").a(this.a.k(0,b))},
E(a,b){this.a.E(0,new A.d2(this,this.$ti.h("~(3,4)").a(b)))},
gF(){var s=this.$ti
return A.fK(this.a.gF(),s.c,s.y[2])},
gm(a){var s=this.a
return s.gm(s)},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gJ(){return this.a.gJ().aq(0,new A.d1(this),this.$ti.h("y<3,4>"))}}
A.d2.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d1.prototype={
$1(a){var s=this.a.$ti
s.h("y<1,2>").a(a)
return new A.y(s.y[2].a(a.a),s.y[3].a(a.b),s.h("y<3,4>"))},
$S(){return this.a.$ti.h("y<3,4>(y<1,2>)")}}
A.b_.prototype={
j(a){return"LateInitializationError: "+this.a}}
A.dg.prototype={}
A.f.prototype={}
A.F.prototype={
gq(a){var s=this
return new A.ac(s,s.gm(s),A.j(s).h("ac<F.E>"))},
gt(a){return this.gm(this)===0},
aq(a,b,c){var s=A.j(this)
return new A.ad(this,s.A(c).h("1(F.E)").a(b),s.h("@<F.E>").A(c).h("ad<1,2>"))},
aU(a){var s,r=this,q=A.eE(A.j(r).h("F.E"))
for(s=0;s<r.gm(r);++s)q.l(0,r.H(0,s))
return q}}
A.bQ.prototype={
gbc(){var s=this.a.length,r=this.c
if(r==null||r>s)return s
return r},
gbm(){var s=this.a.length,r=this.b
if(r>s)return s
return r},
gm(a){var s,r=this.a.length,q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
H(a,b){var s=this,r=s.gbm()+b,q=s.gbc()
if(r>=q)throw A.d(A.dY(b,s.gm(0),s,"index"))
return J.dX(s.a,r)}}
A.ac.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.dK(q),o=p.gm(q)
if(r.b!==o)throw A.d(A.Y(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.H(q,s);++r.c
return!0},
$iv:1}
A.aF.prototype={
gq(a){return new A.bC(J.aj(this.a),this.b,A.j(this).h("bC<1,2>"))},
gm(a){return J.cY(this.a)},
gt(a){return J.fC(this.a)}}
A.bo.prototype={$if:1}
A.bC.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iv:1}
A.ad.prototype={
gm(a){return J.cY(this.a)},
H(a,b){return this.b.$1(J.dX(this.a,b))}}
A.af.prototype={
gq(a){return new A.bU(J.aj(this.a),this.b,this.$ti.h("bU<1>"))}}
A.bU.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iv:1}
A.bV.prototype={
gq(a){return new A.aJ(J.aj(this.a),this.$ti.h("aJ<1>"))}}
A.aJ.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iv:1}
A.r.prototype={
sm(a,b){throw A.d(A.bT("Cannot change the length of a fixed-length list"))},
l(a,b){A.ai(a).h("r.E").a(b)
throw A.d(A.bT("Cannot add to a fixed-length list"))},
P(a,b){A.ai(a).h("b<r.E>").a(b)
throw A.d(A.bT("Cannot add to a fixed-length list"))}}
A.bM.prototype={
gm(a){return this.a.length},
H(a,b){var s=this.a
return J.dX(s,s.length-1-b)}}
A.ag.prototype={$r:"+winner(1)",$s:1}
A.ah.prototype={$r:"+(1,2)",$s:2}
A.c2.prototype={$r:"+points,winner(1,2)",$s:3}
A.bm.prototype={}
A.bl.prototype={
G(a,b,c){var s=A.j(this)
return A.eF(this,s.c,s.y[1],b,c)},
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
j(a){return A.e4(this)},
gJ(){return new A.be(this.bv(),A.j(this).h("be<y<1,2>>"))},
bv(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gJ(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gF(),o=o.gq(o),n=A.j(s),m=n.y[1],n=n.h("y<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.k(0,l)
r=4
return a.b=new A.y(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$ix:1}
A.Z.prototype={
gm(a){return this.b.length},
gaG(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
al(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
k(a,b){if(!this.al(b))return null
return this.b[this.a[b]]},
E(a,b){var s,r,q,p
this.$ti.h("~(1,2)").a(b)
s=this.gaG()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gF(){return new A.bX(this.gaG(),this.$ti.h("bX<1>"))}}
A.bX.prototype={
gm(a){return this.a.length},
gt(a){return 0===this.a.length},
gv(a){return 0!==this.a.length},
gq(a){var s=this.a
return new A.aK(s,s.length,this.$ti.h("aK<1>"))}}
A.aK.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iv:1}
A.bn.prototype={
l(a,b){A.j(this).c.a(b)
A.fQ()}}
A.an.prototype={
gm(a){return this.a.length},
gt(a){return this.a.length===0},
gv(a){return this.a.length!==0},
gq(a){var s=this.a
return new A.aK(s,s.length,this.$ti.h("aK<1>"))},
bf(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.bv(o.$ti.h("bv<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.z)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
V(a,b){return this.bf().al(b)}}
A.bO.prototype={}
A.du.prototype={
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
A.bI.prototype={
j(a){return"Null check operator used on a null value"}}
A.cu.prototype={
j(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.cO.prototype={
j(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.df.prototype={
j(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.al.prototype={
j(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.fm(r==null?"unknown":r)+"'"},
$iaB:1,
gbL(){return this},
$C:"$1",
$R:1,
$D:null}
A.cg.prototype={$C:"$0",$R:0}
A.ch.prototype={$C:"$2",$R:2}
A.cL.prototype={}
A.cK.prototype={
j(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.fm(s)+"'"}}
A.aU.prototype={
L(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.aU))return!1
return this.$_target===b.$_target&&this.a===b.a},
gu(a){return(A.em(this.a)^A.bK(this.$_target))>>>0},
j(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cH(this.a)+"'")}}
A.cJ.prototype={
j(a){return"RuntimeError: "+this.a}}
A.a_.prototype={
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
gF(){return new A.ab(this,A.j(this).h("ab<1>"))},
gJ(){return new A.aa(this,A.j(this).h("aa<1,2>"))},
al(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.bx(a)},
bx(a){var s=this.d
if(s==null)return!1
return this.a6(this.aF(s,a),a)>=0},
P(a,b){A.j(this).h("x<1,2>").a(b).E(0,new A.d7(this))},
k(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.by(b)},
by(a){var s,r,q=this.d
if(q==null)return null
s=this.aF(q,a)
r=this.a6(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.j(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.aA(s==null?q.b=q.ah():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.aA(r==null?q.c=q.ah():r,b,c)}else q.bz(b,c)},
bz(a,b){var s,r,q,p,o=this,n=A.j(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ah()
r=o.an(a)
q=s[r]
if(q==null)s[r]=[o.ab(a,b)]
else{p=o.a6(q,a)
if(p>=0)q[p].b=b
else q.push(o.ab(a,b))}},
R(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.aH()}},
E(a,b){var s,r,q=this
A.j(q).h("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.Y(q))
s=s.c}},
aA(a,b,c){var s,r=A.j(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ab(b,c)
else s.b=c},
aH(){this.r=this.r+1&1073741823},
ab(a,b){var s=this,r=A.j(s),q=new A.db(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else s.f=s.f.c=q;++s.a
s.aH()
return q},
an(a){return J.a8(a)&1073741823},
aF(a,b){return a[this.an(b)]},
a6(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.I(a[r].a,b))return r
return-1},
j(a){return A.e4(this)},
ah(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ie2:1}
A.d7.prototype={
$2(a,b){var s=this.a,r=A.j(s)
s.i(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.j(this.a).h("~(1,2)")}}
A.db.prototype={}
A.ab.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.by(s,s.r,s.e,this.$ti.h("by<1>"))}}
A.by.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iv:1}
A.bA.prototype={
gm(a){return this.a.a},
gt(a){return this.a.a===0},
gq(a){var s=this.a
return new A.bz(s,s.r,s.e,this.$ti.h("bz<1>"))}}
A.bz.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
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
return new A.bx(s,s.r,s.e,this.$ti.h("bx<1,2>"))}}
A.bx.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.Y(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.y(s.a,s.b,r.$ti.h("y<1,2>"))
r.c=s.c
return!0}},
$iv:1}
A.bv.prototype={
an(a){return A.ib(a)&1073741823},
a6(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.I(a[r].a,b))return r
return-1}}
A.dO.prototype={
$1(a){return this.a(a)},
$S:1}
A.dP.prototype={
$2(a,b){return this.a(a,b)},
$S:5}
A.dQ.prototype={
$1(a){return this.a(A.a5(a))},
$S:6}
A.a2.prototype={
j(a){return this.aK(!1)},
aK(a){var s,r,q,p,o,n=this.bd(),m=this.ag(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.c(m,q)
o=m[q]
l=a?l+A.eI(o):l+A.t(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
bd(){var s,r=this.$s
while($.dB.length<=r)B.a.l($.dB,null)
s=$.dB[r]
if(s==null){s=this.b9()
B.a.i($.dB,r,s)}return s},
b9(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.e_(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.i(j,q,r[s])}}return A.G(j,k)}}
A.aN.prototype={
ag(){return[this.a,this.b]},
L(a,b){if(b==null)return!1
return b instanceof A.aN&&this.$s===b.$s&&J.I(this.a,b.a)&&J.I(this.b,b.b)},
gu(a){return A.eG(this.$s,this.a,this.b,B.i)}}
A.bd.prototype={
ag(){return[this.a]},
L(a,b){if(b==null)return!1
return b instanceof A.bd&&this.$s===b.$s&&J.I(this.a,b.a)},
gu(a){return A.eG(this.$s,this.a,B.i,B.i)}}
A.b3.prototype={
gB(a){return B.ao},
$in:1}
A.bF.prototype={}
A.cw.prototype={
gB(a){return B.ap},
$in:1}
A.b4.prototype={
gm(a){return a.length},
$iS:1}
A.bD.prototype={$if:1,$ib:1,$ih:1}
A.bE.prototype={$if:1,$ib:1,$ih:1}
A.cx.prototype={
gB(a){return B.aq},
$in:1}
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
gB(a){return B.aw},
$in:1}
A.cD.prototype={
gB(a){return B.ax},
$in:1}
A.bG.prototype={
gB(a){return B.ay},
gm(a){return a.length},
$in:1}
A.cE.prototype={
gB(a){return B.az},
gm(a){return a.length},
$in:1}
A.bZ.prototype={}
A.c_.prototype={}
A.c0.prototype={}
A.c1.prototype={}
A.a1.prototype={
h(a){return A.c9(v.typeUniverse,this,a)},
A(a){return A.f_(v.typeUniverse,this,a)}}
A.cR.prototype={}
A.cX.prototype={
j(a){return A.U(this.a,null)}}
A.cQ.prototype={
j(a){return this.a}}
A.c5.prototype={}
A.c4.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
bk(a,b){var s,r,q
a=A.Q(a)
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
o.d=null}q=o.bk(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.eU
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
o.a=A.eU
throw n
return!1}if(0>=p.length)return A.c(p,-1)
o.a=p.pop()
m=1
continue}throw A.d(A.eM("sync*"))}return!1},
bN(a){var s,r,q=this
if(a instanceof A.be){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.l(r,q.a)
q.a=s
return 2}else{q.d=J.aj(a)
return 2}},
$iv:1}
A.be.prototype={
gq(a){return new A.c4(this.a(),this.$ti.h("c4<1>"))}}
A.aL.prototype={
gq(a){var s=this,r=new A.bY(s,s.r,A.j(s).h("bY<1>"))
r.c=s.e
return r},
gm(a){return this.a},
gt(a){return this.a===0},
gv(a){return this.a!==0},
V(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.g.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.g.a(r[b])!=null}else return this.ba(b)},
ba(a){var s=this.d
if(s==null)return!1
return this.aE(s[this.aD(a)],a)>=0},
l(a,b){var s,r,q=this
A.j(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.aB(s==null?q.b=A.e9():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.aB(r==null?q.c=A.e9():r,b)}else return q.b3(b)},
b3(a){var s,r,q,p=this
A.j(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.e9()
r=p.aD(a)
q=s[r]
if(q==null)s[r]=[p.ai(a)]
else{if(p.aE(q,a)>=0)return!1
q.push(p.ai(a))}return!0},
aB(a,b){A.j(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.ai(b)
return!0},
ai(a){var s=this,r=new A.cV(A.j(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
aD(a){return J.a8(a)&1073741823},
aE(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.I(a[r].a,b))return r
return-1}}
A.cV.prototype={}
A.bY.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.Y(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.h("1?").a(r.a)
s.c=r.b
return!0}},
$iv:1}
A.dc.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:7}
A.q.prototype={
gq(a){return new A.ac(a,a.length,A.ai(a).h("ac<q.E>"))},
H(a,b){if(!(b>=0&&b<a.length))return A.c(a,b)
return a[b]},
gt(a){return a.length===0},
gv(a){return a.length!==0},
l(a,b){var s
A.ai(a).h("q.E").a(b)
s=a.length
this.sm(a,s+1)
if(!(s<a.length))return A.c(a,s)
a[s]=b},
P(a,b){var s,r,q
A.ai(a).h("b<q.E>").a(b)
s=a.length
for(r=b.length,q=0;q<b.length;b.length===r||(0,A.z)(b),++q){this.l(a,b[q]);++s}},
j(a){return A.dZ(a,"[","]")}}
A.o.prototype={
G(a,b,c){var s=A.j(this)
return A.eF(this,s.h("o.K"),s.h("o.V"),b,c)},
E(a,b){var s,r,q,p=A.j(this)
p.h("~(o.K,o.V)").a(b)
for(s=this.gF(),s=s.gq(s),p=p.h("o.V");s.n();){r=s.gp()
q=this.k(0,r)
b.$2(r,q==null?p.a(q):q)}},
gJ(){return this.gF().aq(0,new A.dd(this),A.j(this).h("y<o.K,o.V>"))},
gm(a){var s=this.gF()
return s.gm(s)},
gt(a){var s=this.gF()
return s.gt(s)},
gv(a){var s=this.gF()
return s.gv(s)},
j(a){return A.e4(this)},
$ix:1}
A.dd.prototype={
$1(a){var s=this.a,r=A.j(s)
r.h("o.K").a(a)
s=s.k(0,a)
if(s==null)s=r.h("o.V").a(s)
return new A.y(a,s,r.h("y<o.K,o.V>"))},
$S(){return A.j(this.a).h("y<o.K,o.V>(o.K)")}}
A.de.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.t(a)
r.a=(r.a+=s)+": "
s=A.t(b)
r.a+=s},
$S:2}
A.ca.prototype={}
A.b2.prototype={
G(a,b,c){return this.a.G(0,b,c)},
k(a,b){return this.a.k(0,b)},
E(a,b){this.a.E(0,A.j(this).h("~(1,2)").a(b))},
gt(a){var s=this.a
return s.gt(s)},
gv(a){var s=this.a
return s.gv(s)},
gm(a){var s=this.a
return s.gm(s)},
j(a){return this.a.j(0)},
gJ(){return this.a.gJ()},
$ix:1}
A.aI.prototype={
G(a,b,c){return new A.aI(this.a.G(0,b,c),b.h("@<0>").A(c).h("aI<1,2>"))}}
A.ar.prototype={
gt(a){return this.gm(this)===0},
gv(a){return this.gm(this)!==0},
P(a,b){var s
for(s=J.aj(A.j(this).h("b<1>").a(b));s.n();)this.l(0,s.gp())},
bq(a){var s
for(s=a.gq(a);s.n();)if(!this.V(0,s.gp()))return!1
return!0},
ga1(a){var s,r=this
if(r.gm(r)>1)throw A.d(A.ey())
s=r.gq(r)
if(!s.n())throw A.d(A.cq())
return s.gp()},
j(a){return A.dZ(this,"{","}")},
$if:1,
$ib:1,
$iaH:1}
A.c3.prototype={}
A.bf.prototype={}
A.cT.prototype={
k(a,b){var s,r=this.b
if(r==null)return this.c.k(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.bi(b):s}},
gm(a){return this.b==null?this.c.a:this.a2().length},
gt(a){return this.gm(0)===0},
gv(a){return this.gm(0)>0},
gF(){if(this.b==null){var s=this.c
return new A.ab(s,A.j(s).h("ab<1>"))}return new A.cU(this)},
E(a,b){var s,r,q,p,o=this
t.cQ.a(b)
if(o.b==null)return o.c.E(0,b)
s=o.a2()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.dF(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.Y(o))}},
a2(){var s=t.e.a(this.c)
if(s==null)s=this.c=A.e(Object.keys(this.a),t.s)
return s},
bi(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.dF(this.a[a])
return this.b[a]=s}}
A.cU.prototype={
gm(a){return this.a.gm(0)},
H(a,b){var s=this.a
if(s.b==null)s=s.gF().H(0,b)
else{s=s.a2()
if(!(b<s.length))return A.c(s,b)
s=s[b]}return s},
gq(a){var s=this.a
if(s.b==null){s=s.gF()
s=s.gq(s)}else{s=s.a2()
s=new J.aw(s,s.length,A.C(s).h("aw<1>"))}return s}}
A.ci.prototype={}
A.ck.prototype={}
A.bw.prototype={
j(a){var s=A.cl(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.cv.prototype={
j(a){return"Cyclic error in JSON stringify"}}
A.d8.prototype={
br(a,b){var s=A.i3(a,this.gbs().a)
return s},
bt(a,b){var s=A.hj(a,this.gbu().b,null)
return s},
gbu(){return B.Z},
gbs(){return B.Y}}
A.da.prototype={}
A.d9.prototype={}
A.dz.prototype={
aX(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.k.X(a,r,q)
r=q+1
o=A.L(92)
s.a+=o
o=A.L(117)
s.a+=o
o=A.L(100)
s.a+=o
o=p>>>8&15
o=A.L(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.L(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.L(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.k.X(a,r,q)
r=q+1
o=A.L(92)
s.a+=o
switch(p){case 8:o=A.L(98)
s.a+=o
break
case 9:o=A.L(116)
s.a+=o
break
case 10:o=A.L(110)
s.a+=o
break
case 12:o=A.L(102)
s.a+=o
break
case 13:o=A.L(114)
s.a+=o
break
default:o=A.L(117)
s.a+=o
o=A.L(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.L(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.L(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.k.X(a,r,q)
r=q+1
o=A.L(92)
s.a+=o
o=A.L(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.k.X(a,r,m)},
ac(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.d(new A.cv(a,null))}B.a.l(s,a)},
a9(a){var s,r,q,p,o=this
if(o.aW(a))return
o.ac(a)
try{s=o.b.$1(a)
if(!o.aW(s)){q=A.eB(a,null,o.gaI())
throw A.d(q)}q=o.a
if(0>=q.length)return A.c(q,-1)
q.pop()}catch(p){r=A.en(p)
q=A.eB(a,r,o.gaI())
throw A.d(q)}},
aW(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.p.j(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.aX(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.ac(a)
q.bJ(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return!0}else if(t.G.b(a)){q.ac(a)
r=q.bK(a)
s=q.a
if(0>=s.length)return A.c(s,-1)
s.pop()
return r}else return!1},
bJ(a){var s,r=this.c
r.a+="["
if(J.fD(a)){if(0>=a.length)return A.c(a,0)
this.a9(a[0])
for(s=1;s<a.length;++s){r.a+=","
this.a9(a[s])}}r.a+="]"},
bK(a){var s,r,q,p,o,n,m=this,l={}
if(a.gt(a)){m.c.a+="{}"
return!0}s=a.gm(a)*2
r=A.h4(s,null,!1,t.X)
q=l.a=0
l.b=!0
a.E(0,new A.dA(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.aX(A.a5(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.c(r,n)
m.a9(r[n])}p.a+="}"
return!0}}
A.dA.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.i(s,r.a++,a)
B.a.i(s,r.a++,b)},
$S:2}
A.dy.prototype={
gaI(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.cP.prototype={
j(a){return this.T()},
$iaX:1}
A.u.prototype={}
A.ce.prototype={
j(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.cl(s)
return"Assertion failed"}}
A.bR.prototype={}
A.ak.prototype={
gaf(){return"Invalid argument"+(!this.a?"(s)":"")},
gae(){return""},
j(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+p,n=s.gaf()+q+o
if(!s.a)return n
return n+s.gae()+": "+A.cl(s.gao())},
gao(){return this.b}}
A.b7.prototype={
gao(){return A.dE(this.b)},
gaf(){return"RangeError"},
gae(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.t(q):""
else if(q==null)s=": Not greater than or equal to "+A.t(r)
else if(q>r)s=": Not in inclusive range "+A.t(r)+".."+A.t(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.t(r)
return s}}
A.co.prototype={
gao(){return A.Q(this.b)},
gaf(){return"RangeError"},
gae(){if(A.Q(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gm(a){return this.f}}
A.bS.prototype={
j(a){return"Unsupported operation: "+this.a}}
A.cN.prototype={
j(a){return"UnimplementedError: "+this.a}}
A.b9.prototype={
j(a){return"Bad state: "+this.a}}
A.cj.prototype={
j(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cl(s)+"."}}
A.bP.prototype={
j(a){return"Stack Overflow"},
$iu:1}
A.dw.prototype={
j(a){return"Exception: "+this.a}}
A.d3.prototype={
j(a){var s=this.a,r=""!==s?"FormatException: "+s:"FormatException"
return r}}
A.b.prototype={
aq(a,b,c){var s=A.j(this)
return A.h6(this,s.A(c).h("1(b.E)").a(b),s.h("b.E"),c)},
gm(a){var s,r=this.gq(this)
for(s=0;r.n();)++s
return s},
gt(a){return!this.gq(this).n()},
gv(a){return!this.gt(this)},
H(a,b){var s,r
A.e6(b,"index")
s=this.gq(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.d(A.dY(b,b-r,this,"index"))},
j(a){return A.fY(this,"(",")")}}
A.y.prototype={
j(a){return"MapEntry("+A.t(this.a)+": "+A.t(this.b)+")"}}
A.bH.prototype={
gu(a){return A.m.prototype.gu.call(this,0)},
j(a){return"null"}}
A.m.prototype={$im:1,
L(a,b){return this===b},
gu(a){return A.bK(this)},
j(a){return"Instance of '"+A.cH(this)+"'"},
gB(a){return A.il(this)},
toString(){return this.j(this)}}
A.ba.prototype={
gm(a){return this.a.length},
j(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ih9:1}
A.cS.prototype={
a7(a){if(a<=0||a>4294967296)throw A.d(A.eJ(u.c+a))
return Math.random()*a>>>0},
I(){return Math.random()},
$ie5:1}
A.cW.prototype={
b1(a){var s,r,q,p,o,n,m,l=this,k=4294967296,j=a<0?-1:0
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
a7(a){var s,r,q,p=this
if(a<=0||a>4294967296)throw A.d(A.eJ(u.c+a))
s=a-1
if((a&s)>>>0===0){p.N()
return(p.a&s)>>>0}do{p.N()
r=p.a
q=r%a}while(r-q+a>=4294967296)
return q},
I(){var s,r=this
r.N()
s=r.a
r.N()
return((s&67108863)*134217728+(r.a&134217727))/9007199254740992},
$ie5:1}
A.a4.prototype={
T(){return"AiLevel."+this.b}}
A.cM.prototype={
aN(a){var s,r,q=this,p=a.a,o=a.b,n=p.aR(o)
if(n.length===0)throw A.d(A.eM("no legal action for "+o))
if(p.cx){p=t.db
s=new A.af(new A.bV(n,p),p.h("p(b.E)").a(new A.dm()),p.h("af<b.E>"))
return s.H(0,q.b.a7(s.gm(0)))}r=p.r
A:{if(B.e===r){p=q.bb(a)
break A}if(B.f===r){p=q.b5(a,n)
break A}p=q.bg(a,n)
break A}return p},
ga3(){switch(this.a.a){case 0:var s=0
break
case 1:s=40
break
case 2:s=220
break
default:s=null}return s},
bb(a){var s,r,q,p,o,n,m,l=this
if(l.a===B.m){s=a.b
return l.b.I()<0.6?new A.J(s):new A.P(s)}r=l.a8(a,l.ga3())
s=a.a
q=s.a
p=q.f
o=B.a.gS(q.d)
n=a.b
m=((n&1)===0?B.b:B.c)===B.b?B.c:B.b
m=s.c.k(0,m)
m.toString
if(m+o>=q.r)return new A.J(n)
return r>(p-o)/(2*p)+l.Y(0.08)?new A.J(n):new A.P(n)},
b5(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=B.a.a_(t.U.a(b),new A.dj()),g=i.a
if(g===B.m){s=i.b.I()
if(h&&s<0.05)return new A.M(a.b)
g=a.b
return s<0.65?new A.J(g):new A.P(g)}r=a.a
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
q=i.a8(a,i.ga3())
g=g===B.n
k=q-(g?0:0.08)
q=a.b
o=((q&1)===0?B.b:B.c)===B.b?B.c:B.b
o=r.c.k(0,o)
o.toString
if(o+m>=p.r)return h&&k>0.7?new A.M(q):new A.J(q)
if(h&&k>0.78+i.Y(0.05))return new A.M(q)
j=g&&i.b.I()<0.06
return(2*k-1)*l>-m+i.Y(0.3)||j?new A.J(q):new A.P(q)},
bg(a,b){t.U.a(b)
if(B.a.a_(b,new A.dk())&&this.bo(a))return new A.M(a.b)
return this.b8(a,b)},
bo(a){var s,r=this,q=(a.b&1)===0?B.b:B.c,p=a.a
q=p.c.k(0,q)
q.toString
if(q+p.gam()>=p.a.r)return!1
switch(r.a.a){case 0:return r.b.I()<0.08
case 1:return r.a8(a,r.ga3())>0.72+r.Y(0.06)||r.b.I()<0.03
case 2:s=r.a8(a,r.ga3())
if(s>0.9&&a.gW().length>1&&r.b.I()<0.8)return!1
if(s>0.62+r.Y(0.03))return!0
return A.G(p.z,t.F).length!==0&&s<0.3&&r.b.I()<0.04}},
Y(a){return(this.b.I()*2-1)*a},
b8(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.U.a(b)
s=a.gW()
r=f.a
if(r===B.m&&f.b.I()<0.55){r=s.length
q=f.b.a7(r)
if(!(q>=0&&q<r))return A.c(s,q)
return new A.H(s[q],!1,a.b)}r=r===B.n
if(r&&s.length>1)p=f.b6(a)
else{q=A.e([],t.t)
for(o=s.length,n=a.a,m=n.a,l=0;l<o;++l)q.push(m.D(s[l],n.y))
k=A.e([],t.w)
for(j=A.G(n.Q,t.n),i=j.length,l=0;l<i;++l){h=j[l]
g=h.c?-1:m.D(h.b,n.y)
k.push(new A.ah(h.a,g))}m=A.e([],t.v)
for(n=A.G(n.z,t.F),j=n.length,l=0;l<j;++l)m.push(n[l].b)
q=A.ei(q,k,m,a.b)
if(!(q>=0&&q<o))return A.c(s,q)
p=s[q]}if(r&&a.a.gak()&&!f.bp(a,p)&&f.b.I()<0.5)return new A.H(p,!0,a.b)
return new A.H(p,!1,a.b)},
bp(a,b){var s=a.a,r=s.a.D(b,s.y)
return B.a.aO(A.G(s.Q,t.n),new A.dl(a,r))},
b6(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.gW(),d=A.e([],t.t)
for(s=e.length,r=a.a,q=r.a,p=0;p<s;++p)d.push(q.D(e[p],r.y))
o=A.e([],t.w)
for(n=A.G(r.Q,t.n),m=n.length,p=0;p<m;++p){l=n[p]
k=l.c?-1:q.D(l.b,r.y)
o.push(new A.ah(l.a,k))}q=A.e([],t.v)
for(r=A.G(r.z,t.F),n=r.length,p=0;p<n;++p)q.push(r[p].b)
d=A.ei(d,o,q,a.b)
if(!(d>=0&&d<s))return A.c(e,d)
j=e[d]
i=this.av(a,j,160)+0.04
for(h=j,p=0;p<s;++p){g=e[p]
if(g.L(0,j))continue
f=this.av(a,g,160)
if(f>i){i=f
h=g}}return h},
av(b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7
if(c0<=0)return 0.5
s=b8.gbB()
r=A.e([],t.Y)
for(q=$.ep(),p=q.length,o=0;o<p;++o){n=q[o]
if(!s.V(0,n))r.push(n)}q=b8.b
m=B.d.C(q+2,4)
l=b8.gar()
if(this.a===B.n){p=b8.a
k=p.ch
if(k==null)k=null
else k=(k.a&1)===0?B.b:B.c
j=(q&1)===0
if(k!==((j?B.b:B.c)===B.b?B.c:B.b)){p=p.ay
p=p===((j?B.b:B.c)===B.b?B.c:B.b)
i=p}else i=!0}else i=!1
for(p=b8.a,k=p.a,j=b9==null,h=p.z,g=t.F,f=t.v,e=p.Q,d=t.n,c=t.w,b=this.b,a=t.aH,a0=q+1,a1=m+1,a2=0,a3=0,a4=0;a4<c0;++a4){a5={}
B.a.aw(r,b)
a5.a=0
a6=A.h5(4,new A.dn(a5,b8,m,l,r),a)
a7=1
if(i)for(a8=[B.d.C(a0,4),B.d.C(a1,4)],o=0;o<2;++o){a9=a8[o]
if(!(a9>=0&&a9<4))return A.c(a6,a9)
b0=a6[a9]
b1=b0.length
b2=0
for(;b2<b1;++b2)if(b0[b2]>=8)a7*=1.8}a8=A.e([],c)
b3=A.b1(e,!1,d)
b3.$flags=3
b0=b3
b1=b0.length
o=0
for(;o<b1;++o){b4=b0[o]
b5=b4.c?-1:k.D(b4.b,p.y)
a8.push(new A.ah(b4.a,b5))}b0=p.as
b1=A.e([],f)
b3=A.b1(h,!1,g)
b3.$flags=3
b5=b3
b6=b5.length
o=0
for(;o<b6;++o)b1.push(b5[o].b)
b7=A.iA(a8,j?null:new A.ah(q,k.D(b9,p.y)),a6,b1,b0)
a3+=a7
if(b7===((q&1)===0?B.b:B.c))a2+=a7
else if(b7==null)a2+=a7/2}return a2/a3},
a8(a,b){return this.av(a,null,b)}}
A.dm.prototype={
$1(a){return!t.D.a(a).c},
$S:8}
A.dj.prototype={
$1(a){return t.J.a(a) instanceof A.M},
$S:0}
A.dk.prototype={
$1(a){return t.J.a(a) instanceof A.M},
$S:0}
A.dl.prototype={
$1(a){return this.a.a.az(t.n.a(a))<this.b},
$S:3}
A.dn.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.b
if(a===i.b){s=A.e([],t.t)
for(r=i.gW(),q=r.length,i=i.a,p=i.a,o=0;o<q;++o)s.push(p.D(r[o],i.y))
return s}if(a===j.c){s=j.d
n=s==null?B.w:s}else n=B.w
i=i.a
s=i.w
if(!(a<s.length))return A.c(s,a)
m=A.G(s[a],t.L).length-n.length
s=A.e([],t.t)
for(r=n.length,q=i.a,o=0;o<n.length;n.length===r||(0,A.z)(n),++o)s.push(q.D(n[o],i.y))
for(r=j.e,p=j.a,l=0;l<m;++l){k=p.a+l
if(!(k>=0&&k<r.length))return A.c(r,k)
s.push(q.D(r[k],i.y))}p.a+=m
return s},
$S:9}
A.dU.prototype={
$1(a){return t.R.a(a).b===this.a.a},
$S:10}
A.dV.prototype={
$1(a){return(t.R.a(a).a&1)===0?B.b:B.c},
$S:11}
A.dN.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o<s[q])q=p}return q},
$S:4}
A.dM.prototype={
$0(){var s,r,q,p,o
for(s=this.a,r=s.length,q=0,p=1;p<r;++p){o=s[p]
if(!(q>=0&&q<r))return A.c(s,q)
if(o>s[q])q=p}return q},
$S:4}
A.T.prototype={
T(){return"Suit."+this.b}}
A.N.prototype={
T(){return"Rank."+this.b}}
A.O.prototype={
ga4(){var s=this.b.b
if(0>=s.length)return A.c(s,0)
return this.a.c+s[0]},
L(a,b){if(b==null)return!1
return b instanceof A.O&&b.a===this.a&&b.b===this.b},
gu(a){return this.a.a*4+this.b.a},
j(a){return this.ga4()}}
A.d_.prototype={
$1(a){var s=this.a
return t.al.a(a).c===B.k.X(s,0,s.length-1)},
$S:12}
A.d0.prototype={
$1(a){var s,r,q,p=t._.a(a).b
if(0>=p.length)return A.c(p,0)
p=p[0]
s=this.a
r=s.length
q=r-1
if(!(q>=0))return A.c(s,q)
return p===s[q]},
$S:13}
A.dH.prototype={
$1(a){return t.E.a(a) instanceof A.aA},
$S:14}
A.dJ.prototype={
$2(a,b){var s,r
t.H.a(a)
for(s=this.a,r=0;r<4;++r)if(((r&1)===0?B.b:B.c)===a)s.k(0,r).l(0,b)},
$S:15}
A.dI.prototype={
$1(a){return t.L.a(a).a===B.J},
$S:16}
A.cn.prototype={
b0(a,b,c,d,e,f){var s,r,q,p,o,n,m=this,l=A.hc(m.c,m.a,m.b)
m.r!==$&&A.iC()
m.r=l
for(s=c.length,r=m.e,q=t.f,p=0;p<c.length;c.length===s||(0,A.z)(c),++p){o=q.a(c[p])
if(J.I(o.k(0,"t"),"next"))l.aa()
else if(J.I(o.k(0,"t"),"forfeit")){n=o.k(0,"s")
n.toString
l.a0((A.Q(n)&1)===0?B.b:B.c)}else l.U(A.fc(o))
B.a.l(r,o)}l=l.d
m.w.U(l)
m.x=l.length},
bA(a){var s
A.Q(a)
s=this.d
if(!(a>=0&&a<s.length))return A.c(s,a)
return s[a]==null},
gbw(){var s,r,q,p=A.e([],t.t)
for(s=this.d,r=s.length,q=0;q<4;++q){if(!(q<r))return A.c(s,q)
if(s[q]==null)p.push(q)}return p},
aj(a,b){var s,r=this,q=r.d
if(!(a>=0&&a<q.length))return A.c(q,a)
if(q[a]!=null||b.a!==a)throw A.d(A.bp("seat "+a+" is not a person"))
q=r.r
q===$&&A.av()
q.U(b)
B.a.l(r.e,A.fd(b))
s=A.K(t.S,t.Q)
r.Z(s,0)
r.aC(s)
return s},
gaV(){var s,r,q,p,o,n=this,m=null,l=n.r
l===$&&A.av()
s=l.r
switch(s.a){case 1:l=l.as
s=n.d
if(!(l>=0&&l<s.length))return A.c(s,l)
if(!(s[l]==null))l=m
return l
case 2:case 0:if(s===B.e){r=l.CW
r.toString
q=r}else q=((l.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
p=l.gau()
if(p!=null){r=n.d
if(p>>>0!==p||p>=r.length)return A.c(r,p)
r=r[p]==null}else r=!1
if(r)return p
if(s===B.f&&l.ch.c!=null)return m
for(l=n.d,s=l.length,o=0;o<4;++o){if(((o&1)===0?B.b:B.c)===q){if(!(o<s))return A.c(l,o)
r=l[o]==null}else r=!1
if(r)return o}return m
case 3:case 4:return m}},
bG(a){var s,r,q,p,o,n=this,m=n.gaV()
if(m==null)throw A.d(A.bp("nobody to wait for"))
s=n.r
s===$&&A.av()
r=n.aj(m,new A.cM(B.B,n.f).aN(new A.bJ(s,m)))
q=n.e
p=B.a.bD(q,new A.d4(m))
if(!(p>=0&&p<q.length))return A.c(q,p)
o=A.eD(q[p],t.N,t.X)
o.i(0,"to",!0)
B.a.i(q,p,o)
if(a!=null&&s.r!==B.h&&n.bE(m)>=a)n.a0(m).E(0,new A.d5(r))
return r},
bE(a){var s,r,q,p
for(s=this.e,r=A.C(s).h("bM<1>"),s=new A.bM(s,r),s=new A.ac(s,s.gm(0),r.h("ac<F.E>")),r=r.h("F.E"),q=0;s.n();){p=s.d
if(p==null)p=r.a(p)
if(!J.I(p.k(0,"s"),a))continue
if(!J.I(p.k(0,"to"),!0))break;++q}return q},
a0(a){var s,r=this.r
r===$&&A.av()
r.a0((a&1)===0?B.b:B.c)
B.a.l(this.e,A.bB(["t","forfeit","s",a],t.N,t.X))
s=A.K(t.S,t.Q)
this.Z(s,0)
return s},
aC(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
t.p.a(a)
for(s=h.e,r=h.d,q=r.length,p=h.f,o=h.w;;){n=h.r
n===$&&A.av()
m=n.r
if(m===B.h)return
if(m===B.o){n.aa()
B.a.l(s,B.a8)
h.Z(a,2200)
continue}l=h.b7()
if(l==null)return
k=o.e?1400:850
if(l>>>0!==l||l>=q)return A.c(r,l)
j=r[l]
j.toString
i=new A.cM(j,p).aN(new A.bJ(n,l))
n.U(i)
B.a.l(s,A.fd(i))
h.Z(a,k)}},
b7(){var s,r,q,p,o=this,n=null,m=o.r
m===$&&A.av()
s=m.r
switch(s.a){case 1:m=m.as
s=o.d
if(!(m>=0&&m<s.length))return A.c(s,m)
if(s[m]==null)m=n
return m
case 2:case 0:if(s===B.e){r=m.CW
r.toString
q=r}else q=((m.ch.a&1)===0?B.b:B.c)===B.b?B.c:B.b
if(s===B.f&&m.ch.c!=null){m=m.gau()
m.toString
s=o.d
if(!(m>=0&&m<s.length))return A.c(s,m)
if(s[m]==null)m=n
return m}s=A.e([],t.t)
for(p=0;p<4;++p)if(((p&1)===0?B.b:B.c)===q)s.push(p)
if(B.a.a_(s,o.gaQ()))return n
return m.gau()
case 3:case 4:return n}},
Z(a,b){var s,r,q,p,o,n,m,l,k,j=this
t.p.a(a)
s=j.w
r=j.r
r===$&&A.av()
q=r.d
s.U(A.ha(q,j.x,null,A.C(q).c))
j.x=r.d.length
for(q=j.gbw(),p=q.length,o=j.gaQ(),n=t.M,m=0;m<q.length;q.length===p||(0,A.z)(q),++m){l=q[m]
k=a.k(0,l)
if(k==null){k=A.e([],n)
a.i(0,l,k)}J.eq(k,A.hb(r,l,b,o,s))}}}
A.d4.prototype={
$1(a){return J.I(t.f.a(a).k(0,"s"),this.a)},
$S:18}
A.d5.prototype={
$2(a,b){var s,r
A.Q(a)
t.Q.a(b)
s=this.a
r=s.k(0,a)
if(r==null){r=A.e([],t.M)
s.i(0,a,r)
s=r}else s=r
return J.fA(s,b)},
$S:19}
A.aE.prototype={
T(){return"ManilhaMode."+this.b}}
A.dt.prototype={
M(){var s,r=this,q=A.K(t.N,t.X)
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
case 1:s=B.a.a5(B.a5,a)
if(s>=0)return 10+s
break}return a.a.a}}
A.b5.prototype={
M(){var s,r=A.K(t.N,t.X)
r.i(0,"s",this.a)
s=this.b
if(s!=null)r.i(0,"c",s.ga4())
if(this.c)r.i(0,"x",!0)
return r}}
A.cI.prototype={
M(){var s,r,q,p=A.K(t.N,t.X),o=A.e([],t.d)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.z)(s),++q)o.push(s[q].M())
p.i(0,"p",o)
o=this.b
if(o!=null)p.i(0,"w",o.b)
p.i(0,"t",this.c)
return p}}
A.at.prototype={
M(){var s,r,q,p,o,n,m,l=this,k=t.N,j=A.K(k,t.X)
j.i(0,"me",l.a)
j.i(0,"rules",l.b.M())
j.i(0,"phase",l.c.b)
j.i(0,"turn",l.d)
j.i(0,"dealer",l.e)
j.i(0,"foot",l.f)
j.i(0,"hand#",l.r)
s=l.w
if(s!=null)j.i(0,"vira",s.ga4())
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
j.i(0,"scores",A.e([s.k(0,B.b),s.k(0,B.c)],t.c))
s=t.d
r=A.e([],s)
for(q=l.ax,p=q.length,o=0;o<q.length;q.length===p||(0,A.z)(q),++o)r.push(q[o].M())
j.i(0,"rounds",r)
s=A.e([],s)
for(r=l.ay,q=r.length,o=0;o<r.length;r.length===q||(0,A.z)(r),++o)s.push(r[o].M())
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
for(q=r.length,o=0;o<r.length;r.length===q||(0,A.z)(r),++o){n=r[o]
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
if(s!=null)j.i(0,"wo",s.b)
s=l.go
if(s.gv(s)){k=A.K(k,k)
for(s=s.gJ(),s=s.gq(s);s.n();){r=s.gp()
k.i(0,""+r.a,r.b)}j.i(0,"speech",k)}k=l.id
if(k!=null)j.i(0,"toast",k)
if(l.k1)j.i(0,"showLast",!0)
k=l.k2
if(k>0)j.i(0,"delay",k)
return j}}
A.di.prototype={
$1(a){var s,r=a.a,q=a.c
if(q){s=this.a
s=r!==s&&r!==B.d.C(s+2,4)}else s=!1
return new A.b5(r,s?null:a.b,q)},
$S:20}
A.dh.prototype={
U(a){var s,r,q,p,o,n=this
t.x.a(a)
n.e=!1
for(s=J.aj(a),r=n.r,q=n.a;s.n();){p=s.gp()
if(p instanceof A.aY){q.R(0)
n.b=null
n.d=!1
n.c=p.f
continue}if(p instanceof A.aV){n.c=n.e=n.d=!1
continue}if(p instanceof A.b6){q.i(0,p.a,p.c+"!")
continue}if(p instanceof A.bL){q.i(0,p.a,"Cai dentro!")
continue}if(p instanceof A.az){o=p.a
q.i(0,o,p.b?"Eu corro\u2026 parceiro?":"Corro.")
continue}if(p instanceof A.aW){o=p.a
q.i(0,o,p.b?"Vamos jogar!":"Corro.")
continue}if(p instanceof A.b8){n.e=n.d=!0
continue}if(p instanceof A.ao){o=p.a
n.b=new A.c2(p.b,o)
continue}if(p instanceof A.aC){p=p.a
o=r.k(0,p)
o.toString
r.i(0,p,o+1)
continue}if(p instanceof A.aA){n.b=null
n.d=!1}}},
bH(a){var s,r=this.b
if(r!=null){s=r.b
if(s==null)return"Embuchou tudo, ningu\xe9m marca."
s=s===a?"N\xf3s":"Eles"
return s+" +"+r.a}if(this.c)return"M\xe3o de ferro! Ningu\xe9m v\xea as cartas."
return null}}
A.am.prototype={
T(){return"GamePhase."+this.b}}
A.W.prototype={}
A.H.prototype={
j(a){var s=this.b.j(0),r=this.c?", covered":""
return"PlayCard("+this.a+", "+s+r+")"}}
A.M.prototype={
j(a){return"Raise("+this.a+")"}}
A.J.prototype={
j(a){return"Accept("+this.a+")"}}
A.P.prototype={
j(a){return"Fold("+this.a+")"}}
A.E.prototype={}
A.aY.prototype={}
A.aW.prototype={}
A.aV.prototype={}
A.b6.prototype={}
A.bL.prototype={}
A.az.prototype={}
A.b8.prototype={}
A.ao.prototype={}
A.aC.prototype={}
A.aA.prototype={}
A.a0.prototype={}
A.bN.prototype={}
A.cF.prototype={}
A.cm.prototype={
j(a){return"GameRuleError: "+this.a}}
A.dp.prototype={
gam(){var s,r,q=this
if(q.CW!=null)return q.a.f
s=q.a.d
r=q.ax
if(!(r<5))return A.c(s,r)
return s[r]},
gau(){var s,r,q,p=this
switch(p.r.a){case 2:s=p.ch
r=s.c
return r!=null?B.d.C(r+2,4):B.d.C(s.a+1,4)
case 0:s=p.CW
s.toString
q=B.d.C(p.e+1,4)
return((q&1)===0?B.b:B.c)===s?q:B.d.C(q+1,4)
default:return null}},
az(a){return a.c?-1:this.a.D(a.b,this.y)},
aa(){var s,r,q,p,o,n,m,l,k,j=this
if(j.r!==B.o)throw A.d(A.bp("hand still in progress"));++j.f
j.e=B.d.C(j.e+1,4)
s=t.L
r=A.b0($.ep(),s)
B.a.aw(r,j.b)
q=t.ba
p=A.e([],q)
for(o=0;o<4;++o){n=o*3
p.push(B.a.aZ(r,n,n+3))}j.w=p
q=A.e([],q)
for(p=j.w,n=p.length,m=0;m<p.length;p.length===n||(0,A.z)(p),++m){l=A.b1(p[m],!1,s)
l.$flags=3
q.push(l)}j.x=q
s=j.a
if(s.c===B.y){if(12>=r.length)return A.c(r,12)
r=r[12]}else r=null
j.y=r
B.a.R(j.z)
B.a.R(j.Q)
m=j.ax=0
j.ch=j.ay=null
j.at=j.as=B.d.C(j.e+1,4)
r=A.e([],t.a)
for(q=j.c,p=s.e;m<2;++m){k=B.a1[m]
if(q.k(0,k)===p)r.push(k)}q=r.length
p=q===2
j.cy=p
j.cx=p&&s.x
s=q===1?B.a.ga1(r):null
j.CW=s
j.r=s!=null?B.e:B.j
r=j.y
q=j.cx
B.a.l(j.d,new A.aY(j.x,r,s,q))},
aR(a){var s,r,q,p,o=this,n=(a&1)===0?B.b:B.c
switch(o.r.a){case 0:if(n!==o.CW)return B.l
return A.e([new A.J(a),new A.P(a)],t.u)
case 2:s=o.ch
if(n===((s.a&1)===0?B.b:B.c))return B.l
if(s.c===a)return B.l
s=A.e([new A.J(a),new A.P(a)],t.u)
if(o.ch.b+1<5)s.push(new A.M(a))
return s
case 1:if(a!==o.as)return B.l
s=A.e([],t.u)
r=o.w
if(!(a>=0&&a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.z)(r),++p)s.push(new A.H(r[p],!1,a))
if(o.gak()){r=o.w
if(!(a<r.length))return A.c(r,a)
r=r[a]
q=r.length
p=0
for(;p<r.length;r.length===q||(0,A.z)(r),++p)s.push(new A.H(r[p],!0,a))}if(o.aL(a))s.push(new A.M(a))
return s
case 3:case 4:return B.l}},
gak(){return this.a.w&&!this.cx&&this.z.length!==0},
aL(a){var s=this,r=!1
if(s.r===B.j)if(a===s.as)if(s.CW==null)if(!s.cy){r=s.ay
r=r!==((a&1)===0?B.b:B.c)&&s.ax+1<5}return r},
U(a){var s,r,q,p,o=this,n=a.a
if(!B.a.a_(o.aR(n),new A.ds(a)))throw A.d(A.bp("illegal "+a.j(0)+" in "+o.r.j(0)))
A:{if(a instanceof A.H){o.bh(a)
break A}if(a instanceof A.M){s=o.ch
r=s==null
q=r?null:s.b
if(q==null)q=o.ax
if(!r){o.ax=s.b
o.ay=(s.a&1)===0?B.b:B.c}p=q+1
o.ch=new A.cF(n,p,null)
o.r=B.f
s=o.a.d
if(!(p<5))return A.c(s,p)
B.a.l(o.d,new A.b6(n,s[p],B.a2[p-1]))
break A}if(a instanceof A.J){o.b2(n)
break A}if(a instanceof A.P)o.be(n)}},
b2(a){var s,r,q=this
if(q.r===B.e){B.a.l(q.d,new A.aW(a,!0))
q.r=B.j
return}s=q.ch
r=s.b
q.ax=r
q.ay=(s.a&1)===0?B.b:B.c
q.ch=null
q.r=B.j
if(!(r<5))return A.c(q.a.d,r)
B.a.l(q.d,new A.bL(a))},
be(a){var s,r,q,p,o=this
if(o.r===B.e){B.a.l(o.d,new A.aW(a,!1))
s=((a&1)===0?B.b:B.c)===B.b?B.c:B.b
o.ad(s,B.a.gS(o.a.d))
return}r=o.ch
if(r.c==null){o.ch=new A.cF(r.a,r.b,a)
B.a.l(o.d,new A.az(a,!0))
return}B.a.l(o.d,new A.az(a,!1))
s=(o.ch.a&1)===0?B.b:B.c
q=o.a.d
p=o.ax
if(!(p<5))return A.c(q,p)
o.ad(s,q[p])},
bh(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={}
t.D.a(a)
s=f.w
r=a.a
if(!(r>=0&&r<s.length))return A.c(s,r)
q=a.b
B.a.bF(s[r],q)
s=f.Q
p=a.c
B.a.l(s,new A.a0(r,q,p))
o=f.d
B.a.l(o,new A.aV(r,q,p))
r=s.length
if(r<4){f.as=B.d.C(f.as+1,4)
return}q=e.a=-2
for(p=f.a,n=0;n<s.length;s.length===r||(0,A.z)(s),++n,q=k){m=s[n]
l=m.c?-1:p.D(m.b,f.y)
k=Math.max(q,l)
e.a=k}r=A.C(s)
q=r.h("af<1>")
j=A.b0(new A.af(s,r.h("p(1)").a(new A.dq(e,f)),q),q.h("b.E"))
r=A.C(j)
i=new A.ad(j,r.h("B(1)").a(new A.dr()),r.h("ad<1,B>")).aU(0)
h=i.a===1?i.ga1(0):null
r=A.G(s,t.n)
q=B.a.gS(j).a
p=f.z
B.a.l(p,new A.bN(r,h,q))
B.a.R(s)
B.a.l(o,new A.b8(p.length))
g=A.io(p)
if(g!=null)f.ad(g.a,f.gam())
else f.at=f.as=h==null?f.at:q},
ad(a,b){var s,r,q,p,o=this
o.ch=null
s=o.d
r=a==null
B.a.l(s,new A.ao(a,r?0:b))
if(!r){r=o.c
q=o.a.r
p=r.k(0,a)
p.toString
r.i(0,a,Math.min(q,p+b))
r=r.k(0,a)
r.toString
if(r>=q){o.db=a
o.r=B.h
B.a.l(s,new A.aC(a))
return}}o.r=B.o},
a0(a){var s,r,q=this
if(q.r===B.h)return
s=a===B.b?B.c:B.b
q.ch=null
q.dx=a
q.c.i(0,s,q.a.r)
q.db=s
q.r=B.h
r=q.d
B.a.l(r,new A.aA())
B.a.l(r,new A.aC(s))}}
A.ds.prototype={
$1(a){return A.hd(t.J.a(a),this.a)},
$S:0}
A.dq.prototype={
$1(a){return this.b.az(t.n.a(a))===this.a.a},
$S:3}
A.dr.prototype={
$1(a){return(t.n.a(a).a&1)===0?B.b:B.c},
$S:21}
A.bJ.prototype={
gW(){var s,r=this.a
if(r.cx)r=B.w
else{s=this.b
r=r.w
if(!(s>=0&&s<r.length))return A.c(r,s)
s=A.G(r[s],t.L)
r=s}return r},
gar(){var s,r,q,p,o,n,m,l=this.a,k=l.a
if(l.cy)return null
s=l.CW
r=this.b
if(s!==((r&1)===0?B.b:B.c))q=s!=null&&k.z||this.gaS()
else q=!0
s=B.d.C(r+2,4)
p=l.w
if(!(s<p.length))return A.c(p,s)
o=t.L
n=A.G(p[s],o)
if(q)return n
if(k.Q&&l.e===r){r=l.x
if(!(s<r.length))return A.c(r,s)
o=A.G(r[s],o)
if(2>=o.length)return A.c(o,2)
m=o[2]
if(B.a.V(n,m))return A.e([m],t.Y)}return null},
gaS(){var s=this.a,r=!1
if(s.a.y)if(!s.cy)if(s.r===B.f){s=(s.ch.a&1)===0?B.b:B.c
s=s!==((this.b&1)===0?B.b:B.c)}else s=r
else s=r
else s=r
return s},
gbB(){var s,r,q,p,o,n,m=A.h3(this.gW(),t.L),l=this.a,k=l.y
if(k!=null)m.l(0,k)
k=this.gar()
if(k!=null)m.P(0,k)
for(k=A.G(l.z,t.F),s=k.length,r=0;r<s;++r)for(q=k[r].a,p=q.length,o=0;o<p;++o){n=q[o]
if(!n.c)m.l(0,n.b)}for(l=A.G(l.Q,t.n),k=l.length,r=0;r<k;++r){n=l[r]
if(!n.c)m.l(0,n.b)}return m}}
A.B.prototype={
T(){return"Team."+this.b}}
A.dS.prototype={
$1(a){return A.iz(A.a5(a))},
$S:22};(function aliases(){var s=J.aq.prototype
s.b_=s.j})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_1,q=hunkHelpers._instance_1u
s(J,"hR","eA",23)
r(A,"ie","hI",1)
q(A.cn.prototype,"gaQ","bA",17)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.m,null)
q(A.m,[A.e0,J.cp,A.bO,J.aw,A.b,A.bk,A.o,A.al,A.u,A.dg,A.ac,A.bC,A.bU,A.aJ,A.r,A.a2,A.b2,A.bl,A.aK,A.ar,A.du,A.df,A.db,A.by,A.bz,A.bx,A.a1,A.cR,A.cX,A.c4,A.cV,A.bY,A.q,A.ca,A.ci,A.ck,A.dz,A.cP,A.bP,A.dw,A.d3,A.y,A.bH,A.ba,A.cS,A.cW,A.cM,A.O,A.cn,A.dt,A.b5,A.cI,A.at,A.dh,A.W,A.E,A.a0,A.bN,A.cF,A.cm,A.dp,A.bJ])
q(J.cp,[J.cs,J.br,J.bt,J.bs,J.bu,J.aZ,J.aD])
q(J.bt,[J.aq,J.i,A.b3,A.bF])
q(J.aq,[J.cG,J.bb,J.ap])
r(J.cr,A.bO)
r(J.d6,J.i)
q(J.aZ,[J.bq,J.ct])
q(A.b,[A.bc,A.f,A.aF,A.af,A.bV,A.bX,A.be])
r(A.ax,A.bc)
r(A.bW,A.ax)
q(A.o,[A.ay,A.a_,A.cT])
q(A.al,[A.ch,A.d1,A.cg,A.cL,A.dO,A.dQ,A.dd,A.dm,A.dj,A.dk,A.dl,A.dn,A.dU,A.dV,A.d_,A.d0,A.dH,A.dI,A.d4,A.di,A.ds,A.dq,A.dr,A.dS])
q(A.ch,[A.d2,A.d7,A.dP,A.dc,A.de,A.dA,A.dJ,A.d5])
q(A.u,[A.b_,A.bR,A.cu,A.cO,A.cJ,A.cQ,A.bw,A.ce,A.ak,A.bS,A.cN,A.b9,A.cj])
q(A.f,[A.F,A.ab,A.bA,A.aa])
q(A.F,[A.bQ,A.ad,A.bM,A.cU])
r(A.bo,A.aF)
q(A.a2,[A.bd,A.aN])
r(A.ag,A.bd)
q(A.aN,[A.ah,A.c2])
r(A.bf,A.b2)
r(A.aI,A.bf)
r(A.bm,A.aI)
r(A.Z,A.bl)
q(A.ar,[A.bn,A.c3])
r(A.an,A.bn)
r(A.bI,A.bR)
q(A.cL,[A.cK,A.aU])
r(A.bv,A.a_)
q(A.bF,[A.cw,A.b4])
q(A.b4,[A.bZ,A.c0])
r(A.c_,A.bZ)
r(A.bD,A.c_)
r(A.c1,A.c0)
r(A.bE,A.c1)
q(A.bD,[A.cx,A.cy])
q(A.bE,[A.cz,A.cA,A.cB,A.cC,A.cD,A.bG,A.cE])
r(A.c5,A.cQ)
r(A.aL,A.c3)
r(A.cv,A.bw)
r(A.d8,A.ci)
q(A.ck,[A.da,A.d9])
r(A.dy,A.dz)
q(A.ak,[A.b7,A.co])
q(A.cP,[A.a4,A.T,A.N,A.aE,A.am,A.B])
q(A.cg,[A.dN,A.dM])
q(A.W,[A.H,A.M,A.J,A.P])
q(A.E,[A.aY,A.aW,A.aV,A.b6,A.bL,A.az,A.b8,A.ao,A.aC,A.aA])
s(A.bZ,A.q)
s(A.c_,A.r)
s(A.c0,A.q)
s(A.c1,A.r)
s(A.bf,A.ca)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",l:"double",R:"num",k:"String",p:"bool",bH:"Null",h:"List",m:"Object",x:"Map",w:"JSObject"},mangledNames:{},types:["p(W)","@(@)","~(m?,m?)","p(a0)","a()","@(@,k)","@(k)","~(@,@)","p(H)","h<a>(a)","p(+(a,a))","B(+(a,a))","p(N)","p(T)","p(E)","~(B,k)","p(O)","p(a)","p(x<k,m?>)","~(a,h<at>)","b5(a0)","B(a0)","k(k)","a(@,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;winner":a=>b=>b instanceof A.ag&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.ah&&a.b(c.a)&&b.b(c.b),"2;points,winner":(a,b)=>c=>c instanceof A.c2&&a.b(c.a)&&b.b(c.b)}}
A.hy(v.typeUniverse,JSON.parse('{"ap":"aq","cG":"aq","bb":"aq","iI":"b3","cs":{"p":[],"n":[]},"br":{"n":[]},"bt":{"w":[]},"aq":{"w":[]},"i":{"h":["1"],"f":["1"],"w":[],"b":["1"]},"cr":{"bO":[]},"d6":{"i":["1"],"h":["1"],"f":["1"],"w":[],"b":["1"]},"aw":{"v":["1"]},"aZ":{"l":[],"R":[],"a9":["R"]},"bq":{"l":[],"a":[],"R":[],"a9":["R"],"n":[]},"ct":{"l":[],"R":[],"a9":["R"],"n":[]},"aD":{"k":[],"a9":["k"],"n":[]},"bc":{"b":["2"]},"bk":{"v":["2"]},"ax":{"bc":["1","2"],"b":["2"],"b.E":"2"},"bW":{"ax":["1","2"],"bc":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"ay":{"o":["3","4"],"x":["3","4"],"o.K":"3","o.V":"4"},"b_":{"u":[]},"f":{"b":["1"]},"F":{"f":["1"],"b":["1"]},"bQ":{"F":["1"],"f":["1"],"b":["1"],"F.E":"1","b.E":"1"},"ac":{"v":["1"]},"aF":{"b":["2"],"b.E":"2"},"bo":{"aF":["1","2"],"f":["2"],"b":["2"],"b.E":"2"},"bC":{"v":["2"]},"ad":{"F":["2"],"f":["2"],"b":["2"],"F.E":"2","b.E":"2"},"af":{"b":["1"],"b.E":"1"},"bU":{"v":["1"]},"bV":{"b":["1"],"b.E":"1"},"aJ":{"v":["1"]},"bM":{"F":["1"],"f":["1"],"b":["1"],"F.E":"1","b.E":"1"},"ag":{"bd":[],"a2":[]},"ah":{"aN":[],"a2":[]},"c2":{"aN":[],"a2":[]},"bm":{"aI":["1","2"],"bf":["1","2"],"b2":["1","2"],"ca":["1","2"],"x":["1","2"]},"bl":{"x":["1","2"]},"Z":{"bl":["1","2"],"x":["1","2"]},"bX":{"b":["1"],"b.E":"1"},"aK":{"v":["1"]},"bn":{"ar":["1"],"aH":["1"],"f":["1"],"b":["1"]},"an":{"bn":["1"],"ar":["1"],"aH":["1"],"f":["1"],"b":["1"]},"bI":{"u":[]},"cu":{"u":[]},"cO":{"u":[]},"al":{"aB":[]},"cg":{"aB":[]},"ch":{"aB":[]},"cL":{"aB":[]},"cK":{"aB":[]},"aU":{"aB":[]},"cJ":{"u":[]},"a_":{"o":["1","2"],"e2":["1","2"],"x":["1","2"],"o.K":"1","o.V":"2"},"ab":{"f":["1"],"b":["1"],"b.E":"1"},"by":{"v":["1"]},"bA":{"f":["1"],"b":["1"],"b.E":"1"},"bz":{"v":["1"]},"aa":{"f":["y<1,2>"],"b":["y<1,2>"],"b.E":"y<1,2>"},"bx":{"v":["y<1,2>"]},"bv":{"a_":["1","2"],"o":["1","2"],"e2":["1","2"],"x":["1","2"],"o.K":"1","o.V":"2"},"aN":{"a2":[]},"bd":{"a2":[]},"b3":{"w":[],"n":[]},"bF":{"w":[]},"cw":{"w":[],"n":[]},"b4":{"S":["1"],"w":[]},"bD":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"w":[],"b":["l"],"r":["l"]},"bE":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"]},"cx":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"w":[],"b":["l"],"r":["l"],"n":[],"q.E":"l","r.E":"l"},"cy":{"q":["l"],"h":["l"],"S":["l"],"f":["l"],"w":[],"b":["l"],"r":["l"],"n":[],"q.E":"l","r.E":"l"},"cz":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cA":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cB":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cC":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cD":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"bG":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cE":{"q":["a"],"h":["a"],"S":["a"],"f":["a"],"w":[],"b":["a"],"r":["a"],"n":[],"q.E":"a","r.E":"a"},"cQ":{"u":[]},"c5":{"u":[]},"c4":{"v":["1"]},"be":{"b":["1"],"b.E":"1"},"aL":{"ar":["1"],"aH":["1"],"f":["1"],"b":["1"]},"bY":{"v":["1"]},"o":{"x":["1","2"]},"b2":{"x":["1","2"]},"aI":{"bf":["1","2"],"b2":["1","2"],"ca":["1","2"],"x":["1","2"]},"ar":{"aH":["1"],"f":["1"],"b":["1"]},"c3":{"ar":["1"],"aH":["1"],"f":["1"],"b":["1"]},"cT":{"o":["k","@"],"x":["k","@"],"o.K":"k","o.V":"@"},"cU":{"F":["k"],"f":["k"],"b":["k"],"F.E":"k","b.E":"k"},"bw":{"u":[]},"cv":{"u":[]},"l":{"R":[],"a9":["R"]},"a":{"R":[],"a9":["R"]},"h":{"f":["1"],"b":["1"]},"R":{"a9":["R"]},"aH":{"f":["1"],"b":["1"]},"k":{"a9":["k"]},"cP":{"aX":[]},"ce":{"u":[]},"bR":{"u":[]},"ak":{"u":[]},"b7":{"u":[]},"co":{"u":[]},"bS":{"u":[]},"cN":{"u":[]},"b9":{"u":[]},"cj":{"u":[]},"bP":{"u":[]},"ba":{"h9":[]},"cS":{"e5":[]},"cW":{"e5":[]},"a4":{"aX":[]},"T":{"aX":[]},"N":{"aX":[]},"aE":{"aX":[]},"H":{"W":[]},"ao":{"E":[]},"am":{"aX":[]},"M":{"W":[]},"J":{"W":[]},"P":{"W":[]},"aY":{"E":[]},"aW":{"E":[]},"aV":{"E":[]},"b6":{"E":[]},"bL":{"E":[]},"az":{"E":[]},"b8":{"E":[]},"aC":{"E":[]},"aA":{"E":[]},"B":{"aX":[]},"fX":{"h":["a"],"f":["a"],"b":["a"]},"hh":{"h":["a"],"f":["a"],"b":["a"]},"hg":{"h":["a"],"f":["a"],"b":["a"]},"fV":{"h":["a"],"f":["a"],"b":["a"]},"he":{"h":["a"],"f":["a"],"b":["a"]},"fW":{"h":["a"],"f":["a"],"b":["a"]},"hf":{"h":["a"],"f":["a"],"b":["a"]},"fT":{"h":["l"],"f":["l"],"b":["l"]},"fU":{"h":["l"],"f":["l"],"b":["l"]}}'))
A.hx(v.typeUniverse,JSON.parse('{"b4":1,"c3":1,"ci":2,"ck":2}'))
var u={c:"max must be in range 0 < max \u2264 2^32, was "}
var t=(function rtii(){var s=A.a6
return{l:s("J"),h:s("a4"),L:s("O"),k:s("a9<@>"),O:s("f<@>"),C:s("u"),q:s("P"),Z:s("aB"),J:s("W"),E:s("E"),I:s("an<T>"),r:s("ao"),x:s("b<E>"),A:s("b<@>"),Y:s("i<O>"),u:s("i<W>"),B:s("i<E>"),ba:s("i<h<O>>"),bc:s("i<x<k,m>>"),d:s("i<x<k,m?>>"),c5:s("i<a0>"),cd:s("i<b5>"),w:s("i<+(a,a)>"),d2:s("i<bN>"),bP:s("i<cI>"),s:s("i<k>"),M:s("i<at>"),a:s("i<B>"),b:s("i<@>"),t:s("i<a>"),cG:s("i<a4?>"),v:s("i<B?>"),c:s("i<a?>"),T:s("br"),m:s("w"),V:s("ap"),da:s("S<@>"),cm:s("h<O>"),U:s("h<W>"),aY:s("h<k>"),Q:s("h<at>"),j:s("h<@>"),aH:s("h<a>"),W:s("h<m?>"),aJ:s("aE"),G:s("x<@,@>"),f:s("x<k,m?>"),p:s("x<a,h<at>>"),P:s("bH"),K:s("m"),n:s("a0"),D:s("H"),aN:s("M"),al:s("N"),cY:s("iJ"),cD:s("+()"),R:s("+(a,a)"),F:s("bN"),at:s("aH<k>"),N:s("k"),_:s("T"),H:s("B"),bW:s("n"),cr:s("bb"),db:s("bV<H>"),ca:s("aJ<ao>"),y:s("p"),i:s("l"),S:s("a"),ch:s("a4?"),cR:s("ex<bH>?"),z:s("w?"),e:s("h<@>?"),a5:s("x<@,@>?"),X:s("m?"),aD:s("k?"),bM:s("B?"),g:s("cV?"),az:s("p?"),dd:s("l?"),a3:s("a?"),ae:s("R?"),o:s("R"),cQ:s("~(k,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.V=J.cp.prototype
B.a=J.i.prototype
B.d=J.bq.prototype
B.p=J.aZ.prototype
B.k=J.aD.prototype
B.W=J.ap.prototype
B.X=J.bt.prototype
B.H=J.cG.prototype
B.A=J.bb.prototype
B.m=new A.a4(0,"easy")
B.B=new A.a4(1,"medium")
B.n=new A.a4(2,"hard")
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

B.E=new A.d8()
B.i=new A.dg()
B.R=new A.cS()
B.I=new A.N("A",7,"ace")
B.t=new A.T(1,"espadas")
B.F=new A.O(B.I,B.t)
B.e=new A.am(0,"decision")
B.j=new A.am(1,"playing")
B.f=new A.am(2,"raisePending")
B.o=new A.am(3,"handOver")
B.h=new A.am(4,"gameOver")
B.Y=new A.d9(null)
B.Z=new A.da(null)
B.r=new A.T(0,"ouros")
B.u=new A.T(2,"copas")
B.v=new A.T(3,"paus")
B.q=s([B.r,B.t,B.u,B.v],A.a6("i<T>"))
B.y=new A.aE(0,"vira")
B.a6=new A.aE(1,"fixed")
B.a_=s([B.y,B.a6],A.a6("i<aE>"))
B.a0=s([B.m,B.B,B.n],A.a6("i<a4>"))
B.b=new A.B(0,"a")
B.c=new A.B(1,"b")
B.a1=s([B.b,B.c],t.a)
B.a2=s(["Truco","Seis","Nove","Doze"],t.s)
B.w=s([],t.Y)
B.l=s([],t.u)
B.aA=s([],t.d)
B.a3=s([],t.b)
B.a4=s([1,3,6,9,12],t.t)
B.K=new A.N("4",0,"four")
B.af=new A.N("5",1,"five")
B.J=new A.N("6",2,"six")
B.z=new A.N("7",3,"seven")
B.ag=new A.N("Q",4,"queen")
B.ad=new A.N("J",5,"jack")
B.ae=new A.N("K",6,"king")
B.ah=new A.N("2",8,"two")
B.ac=new A.N("3",9,"three")
B.x=s([B.K,B.af,B.J,B.z,B.ag,B.ad,B.ae,B.I,B.ah,B.ac],A.a6("i<N>"))
B.S=new A.O(B.z,B.r)
B.T=new A.O(B.z,B.u)
B.U=new A.O(B.K,B.v)
B.a5=s([B.S,B.F,B.T,B.U],t.Y)
B.a9={game_casal_maior:0,game_casal_menor:1,game_casal_preto:2,game_casal_vermelho:3}
B.al=new A.an([B.v,B.u],t.I)
B.ak=new A.an([B.r,B.t],t.I)
B.am=new A.an([B.t,B.v],t.I)
B.an=new A.an([B.r,B.u],t.I)
B.a7=new A.Z(B.a9,[B.al,B.ak,B.am,B.an],A.a6("Z<k,aH<T>>"))
B.aa={}
B.G=new A.Z(B.aa,[],A.a6("Z<a,h<m?>>"))
B.ab={t:0}
B.a8=new A.Z(B.ab,["next"],A.a6("Z<k,m?>"))
B.ai=new A.ag(B.b)
B.aj=new A.ag(B.c)
B.ao=A.a3("iE")
B.ap=A.a3("iF")
B.aq=A.a3("fT")
B.ar=A.a3("fU")
B.as=A.a3("fV")
B.at=A.a3("fW")
B.au=A.a3("fX")
B.av=A.a3("m")
B.aw=A.a3("he")
B.ax=A.a3("hf")
B.ay=A.a3("hg")
B.az=A.a3("hh")})();(function staticFields(){$.dx=null
$.V=A.e([],A.a6("i<m>"))
$.eH=null
$.et=null
$.es=null
$.fh=null
$.fe=null
$.fk=null
$.dG=null
$.dR=null
$.ej=null
$.dB=A.e([],A.a6("i<h<m>?>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"iH","fn",()=>A.dL("_$dart_dartClosure"))
s($,"iG","eo",()=>A.dL("_$dart_dartClosure_dartJSInterop"))
s($,"iV","fy",()=>A.e([new J.cr()],A.a6("i<bO>")))
s($,"iK","fo",()=>A.ae(A.dv({
toString:function(){return"$receiver$"}})))
s($,"iL","fp",()=>A.ae(A.dv({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"iM","fq",()=>A.ae(A.dv(null)))
s($,"iN","fr",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iQ","fu",()=>A.ae(A.dv(void 0)))
s($,"iR","fv",()=>A.ae(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"iP","ft",()=>A.ae(A.eO(null)))
s($,"iO","fs",()=>A.ae(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"iT","fx",()=>A.ae(A.eO(void 0)))
s($,"iS","fw",()=>A.ae(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"iU","dW",()=>A.em(B.av))
s($,"iW","ep",()=>{var r,q,p,o=[]
for(r=0;r<10;++r){q=B.x[r]
for(p=0;p<4;++p)o.push(A.fI(q,B.q[p]))}return A.G(o,t.L)})})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.b3,SharedArrayBuffer:A.b3,ArrayBufferView:A.bF,DataView:A.cw,Float32Array:A.cx,Float64Array:A.cy,Int16Array:A.cz,Int32Array:A.cA,Int8Array:A.cB,Uint16Array:A.cC,Uint32Array:A.cD,Uint8ClampedArray:A.bG,CanvasPixelArray:A.bG,Uint8Array:A.cE})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.b4.$nativeSuperclassTag="ArrayBufferView"
A.bZ.$nativeSuperclassTag="ArrayBufferView"
A.c_.$nativeSuperclassTag="ArrayBufferView"
A.bD.$nativeSuperclassTag="ArrayBufferView"
A.c0.$nativeSuperclassTag="ArrayBufferView"
A.c1.$nativeSuperclassTag="ArrayBufferView"
A.bE.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.iw
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()