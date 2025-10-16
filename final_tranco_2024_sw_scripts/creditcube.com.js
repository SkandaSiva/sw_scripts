!function(){var e={742:function(e,t){"use strict";t.byteLength=byteLength,t.toByteArray=toByteArray,t.fromByteArray=fromByteArray;for(var r=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=0,s=a.length;o<s;++o)r[o]=a[o],n[a.charCodeAt(o)]=o;function getLens(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var n=r===t?0:4-r%4;return[r,n]}function byteLength(e){var t=getLens(e),r=t[0],n=t[1];return(r+n)*3/4-n}function _byteLength(e,t,r){return(t+r)*3/4-r}function toByteArray(e){var t,r,a=getLens(e),o=a[0],s=a[1],c=new i(_byteLength(e,o,s)),l=0,u=s>0?o-4:o;for(r=0;r<u;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],c[l++]=t>>16&255,c[l++]=t>>8&255,c[l++]=255&t;return 2===s&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,c[l++]=255&t),1===s&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,c[l++]=t>>8&255,c[l++]=255&t),c}function tripletToBase64(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function encodeChunk(e,t,r){for(var n=[],i=t;i<r;i+=3)n.push(tripletToBase64((e[i]<<16&16711680)+(e[i+1]<<8&65280)+(255&e[i+2])));return n.join("")}function fromByteArray(e){for(var t,n=e.length,i=n%3,a=[],o=0,s=n-i;o<s;o+=16383)a.push(encodeChunk(e,o,o+16383>s?s:o+16383));return 1===i?a.push(r[(t=e[n-1])>>2]+r[t<<4&63]+"=="):2===i&&a.push(r[(t=(e[n-2]<<8)+e[n-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),a.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},764:function(e,t,r){"use strict";/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var n=r(742),i=r(645),a="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function typedArraySupport(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}function createBuffer(e){if(e>2147483647)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,Buffer.prototype),t}function Buffer(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return allocUnsafe(e)}return from(e,t,r)}function from(e,t,r){if("string"==typeof e)return fromString(e,t);if(ArrayBuffer.isView(e))return fromArrayView(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer)))return fromArrayBuffer(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return Buffer.from(n,t,r);var i=fromObject(e);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return Buffer.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function assertSize(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function alloc(e,t,r){return(assertSize(e),e<=0)?createBuffer(e):void 0!==t?"string"==typeof r?createBuffer(e).fill(t,r):createBuffer(e).fill(t):createBuffer(e)}function allocUnsafe(e){return assertSize(e),createBuffer(e<0?0:0|checked(e))}function fromString(e,t){if(("string"!=typeof t||""===t)&&(t="utf8"),!Buffer.isEncoding(t))throw TypeError("Unknown encoding: "+t);var r=0|byteLength(e,t),n=createBuffer(r),i=n.write(e,t);return i!==r&&(n=n.slice(0,i)),n}function fromArrayLike(e){for(var t=e.length<0?0:0|checked(e.length),r=createBuffer(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}function fromArrayView(e){if(isInstance(e,Uint8Array)){var t=new Uint8Array(e);return fromArrayBuffer(t.buffer,t.byteOffset,t.byteLength)}return fromArrayLike(e)}function fromArrayBuffer(e,t,r){var n;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),Buffer.prototype),n}function fromObject(e){if(Buffer.isBuffer(e)){var t,r=0|checked(e.length),n=createBuffer(r);return 0===n.length||e.copy(n,0,0,r),n}return void 0!==e.length?"number"!=typeof e.length||(t=e.length)!=t?createBuffer(0):fromArrayLike(e):"Buffer"===e.type&&Array.isArray(e.data)?fromArrayLike(e.data):void 0}function checked(e){if(e>=2147483647)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function byteLength(e,t){if(Buffer.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var i=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(e).length;default:if(i)return n?-1:utf8ToBytes(e).length;t=(""+t).toLowerCase(),i=!0}}function slowToString(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return hexSlice(this,t,r);case"utf8":case"utf-8":return utf8Slice(this,t,r);case"ascii":return asciiSlice(this,t,r);case"latin1":case"binary":return latin1Slice(this,t,r);case"base64":return base64Slice(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,t,r);default:if(n)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function swap(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function bidirectionalIndexOf(e,t,r,n,i){var a;if(0===e.length)return -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),(a=r=+r)!=a&&(r=i?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(i)return -1;r=e.length-1}else if(r<0){if(!i)return -1;r=0}if("string"==typeof t&&(t=Buffer.from(t,n)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,n,i);if("number"==typeof t)return(t&=255,"function"==typeof Uint8Array.prototype.indexOf)?i?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,n,i);throw TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,t,r,n,i){var a,o=1,s=e.length,c=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return -1;o=2,s/=2,c/=2,r/=2}function read(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}if(i){var l=-1;for(a=r;a<s;a++)if(read(e,a)===read(t,-1===l?0:a-l)){if(-1===l&&(l=a),a-l+1===c)return l*o}else -1!==l&&(a-=a-l),l=-1}else for(r+c>s&&(r=s-c),a=r;a>=0;a--){for(var u=!0,f=0;f<c;f++)if(read(e,a+f)!==read(t,f)){u=!1;break}if(u)return a}return -1}function hexWrite(e,t,r,n){r=Number(r)||0;var i=e.length-r;n?(n=Number(n))>i&&(n=i):n=i;var a=t.length;n>a/2&&(n=a/2);for(var o=0;o<n;++o){var s=parseInt(t.substr(2*o,2),16);if(s!=s)break;e[r+o]=s}return o}function utf8Write(e,t,r,n){return blitBuffer(utf8ToBytes(t,e.length-r),e,r,n)}function asciiWrite(e,t,r,n){return blitBuffer(asciiToBytes(t),e,r,n)}function base64Write(e,t,r,n){return blitBuffer(base64ToBytes(t),e,r,n)}function ucs2Write(e,t,r,n){return blitBuffer(utf16leToBytes(t,e.length-r),e,r,n)}function base64Slice(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function utf8Slice(e,t,r){r=Math.min(e.length,r);for(var n=[],i=t;i<r;){var a,o,s,c,l=e[i],u=null,f=l>239?4:l>223?3:l>191?2:1;if(i+f<=r)switch(f){case 1:l<128&&(u=l);break;case 2:(192&(a=e[i+1]))==128&&(c=(31&l)<<6|63&a)>127&&(u=c);break;case 3:a=e[i+1],o=e[i+2],(192&a)==128&&(192&o)==128&&(c=(15&l)<<12|(63&a)<<6|63&o)>2047&&(c<55296||c>57343)&&(u=c);break;case 4:a=e[i+1],o=e[i+2],s=e[i+3],(192&a)==128&&(192&o)==128&&(192&s)==128&&(c=(15&l)<<18|(63&a)<<12|(63&o)<<6|63&s)>65535&&c<1114112&&(u=c)}null===u?(u=65533,f=1):u>65535&&(u-=65536,n.push(u>>>10&1023|55296),u=56320|1023&u),n.push(u),i+=f}return decodeCodePointsArray(n)}function decodeCodePointsArray(e){var t=e.length;if(t<=4096)return String.fromCharCode.apply(String,e);for(var r="",n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=4096));return r}function asciiSlice(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(127&e[i]);return n}function latin1Slice(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(e[i]);return n}function hexSlice(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var i="",a=t;a<r;++a)i+=s[e[a]];return i}function utf16leSlice(e,t,r){for(var n=e.slice(t,r),i="",a=0;a<n.length-1;a+=2)i+=String.fromCharCode(n[a]+256*n[a+1]);return i}function checkOffset(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function checkInt(e,t,r,n,i,a){if(!Buffer.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<a)throw RangeError('"value" argument is out of bounds');if(r+n>e.length)throw RangeError("Index out of range")}function checkIEEE754(e,t,r,n,i,a){if(r+n>e.length||r<0)throw RangeError("Index out of range")}function writeFloat(e,t,r,n,a){return t=+t,r>>>=0,a||checkIEEE754(e,t,r,4,34028234663852886e22,-34028234663852886e22),i.write(e,t,r,n,23,4),r+4}function writeDouble(e,t,r,n,a){return t=+t,r>>>=0,a||checkIEEE754(e,t,r,8,17976931348623157e292,-17976931348623157e292),i.write(e,t,r,n,52,8),r+8}t.lW=Buffer,t.h2=50,Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(Buffer.prototype,"parent",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.buffer}}),Object.defineProperty(Buffer.prototype,"offset",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.byteOffset}}),Buffer.poolSize=8192,Buffer.from=function(e,t,r){return from(e,t,r)},Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype),Object.setPrototypeOf(Buffer,Uint8Array),Buffer.alloc=function(e,t,r){return alloc(e,t,r)},Buffer.allocUnsafe=function(e){return allocUnsafe(e)},Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)},Buffer.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==Buffer.prototype},Buffer.compare=function(e,t){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),isInstance(t,Uint8Array)&&(t=Buffer.from(t,t.offset,t.byteLength)),!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,i=0,a=Math.min(r,n);i<a;++i)if(e[i]!==t[i]){r=e[i],n=t[i];break}return r<n?-1:n<r?1:0},Buffer.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,n=Buffer.allocUnsafe(t),i=0;for(r=0;r<e.length;++r){var a=e[r];if(isInstance(a,Uint8Array))i+a.length>n.length?Buffer.from(a).copy(n,i):Uint8Array.prototype.set.call(n,a,i);else if(Buffer.isBuffer(a))a.copy(n,i);else throw TypeError('"list" argument must be an Array of Buffers');i+=a.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)swap(this,t,t+1);return this},Buffer.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this},Buffer.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this},Buffer.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?utf8Slice(this,0,e):slowToString.apply(this,arguments)},Buffer.prototype.toLocaleString=Buffer.prototype.toString,Buffer.prototype.equals=function(e){if(!Buffer.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===Buffer.compare(this,e)},Buffer.prototype.inspect=function(){var e="",r=t.h2;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},a&&(Buffer.prototype[a]=Buffer.prototype.inspect),Buffer.prototype.compare=function(e,t,r,n,i){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),!Buffer.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),t<0||r>e.length||n<0||i>this.length)throw RangeError("out of range index");if(n>=i&&t>=r)return 0;if(n>=i)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,i>>>=0,this===e)return 0;for(var a=i-n,o=r-t,s=Math.min(a,o),c=this.slice(n,i),l=e.slice(t,r),u=0;u<s;++u)if(c[u]!==l[u]){a=c[u],o=l[u];break}return a<o?-1:o<a?1:0},Buffer.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},Buffer.prototype.indexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!0)},Buffer.prototype.lastIndexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!1)},Buffer.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var i=this.length-t;if((void 0===r||r>i)&&(r=i),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var a=!1;;)switch(n){case"hex":return hexWrite(this,e,t,r);case"utf8":case"utf-8":return utf8Write(this,e,t,r);case"ascii":case"latin1":case"binary":return asciiWrite(this,e,t,r);case"base64":return base64Write(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,t,r);default:if(a)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),a=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},Buffer.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return Object.setPrototypeOf(n,Buffer.prototype),n},Buffer.prototype.readUintLE=Buffer.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],i=1,a=0;++a<t&&(i*=256);)n+=this[e+a]*i;return n},Buffer.prototype.readUintBE=Buffer.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i;return n},Buffer.prototype.readUint8=Buffer.prototype.readUInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),this[e]},Buffer.prototype.readUint16LE=Buffer.prototype.readUInt16LE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8},Buffer.prototype.readUint16BE=Buffer.prototype.readUInt16BE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]<<8|this[e+1]},Buffer.prototype.readUint32LE=Buffer.prototype.readUInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Buffer.prototype.readUint32BE=Buffer.prototype.readUInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Buffer.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],i=1,a=0;++a<t&&(i*=256);)n+=this[e+a]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*t)),n},Buffer.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=t,i=1,a=this[e+--n];n>0&&(i*=256);)a+=this[e+--n]*i;return a>=(i*=128)&&(a-=Math.pow(2,8*t)),a},Buffer.prototype.readInt8=function(e,t){return(e>>>=0,t||checkOffset(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},Buffer.prototype.readInt16LE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Buffer.prototype.readInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Buffer.prototype.readFloatLE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),i.read(this,e,!0,23,4)},Buffer.prototype.readFloatBE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),i.read(this,e,!1,23,4)},Buffer.prototype.readDoubleLE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),i.read(this,e,!0,52,8)},Buffer.prototype.readDoubleBE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),i.read(this,e,!1,52,8)},Buffer.prototype.writeUintLE=Buffer.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;checkInt(this,e,t,r,i,0)}var a=1,o=0;for(this[t]=255&e;++o<r&&(a*=256);)this[t+o]=e/a&255;return t+r},Buffer.prototype.writeUintBE=Buffer.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;checkInt(this,e,t,r,i,0)}var a=r-1,o=1;for(this[t+a]=255&e;--a>=0&&(o*=256);)this[t+a]=e/o&255;return t+r},Buffer.prototype.writeUint8=Buffer.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,255,0),this[t]=255&e,t+1},Buffer.prototype.writeUint16LE=Buffer.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeUint16BE=Buffer.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeUint32LE=Buffer.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},Buffer.prototype.writeUint32BE=Buffer.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var i=Math.pow(2,8*r-1);checkInt(this,e,t,r,i-1,-i)}var a=0,o=1,s=0;for(this[t]=255&e;++a<r&&(o*=256);)e<0&&0===s&&0!==this[t+a-1]&&(s=1),this[t+a]=(e/o>>0)-s&255;return t+r},Buffer.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var i=Math.pow(2,8*r-1);checkInt(this,e,t,r,i-1,-i)}var a=r-1,o=1,s=0;for(this[t+a]=255&e;--a>=0&&(o*=256);)e<0&&0===s&&0!==this[t+a+1]&&(s=1),this[t+a]=(e/o>>0)-s&255;return t+r},Buffer.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},Buffer.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},Buffer.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeFloatLE=function(e,t,r){return writeFloat(this,e,t,!0,r)},Buffer.prototype.writeFloatBE=function(e,t,r){return writeFloat(this,e,t,!1,r)},Buffer.prototype.writeDoubleLE=function(e,t,r){return writeDouble(this,e,t,!0,r)},Buffer.prototype.writeDoubleBE=function(e,t,r){return writeDouble(this,e,t,!1,r)},Buffer.prototype.copy=function(e,t,r,n){if(!Buffer.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var i=n-r;return this===e&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(t,r,n):Uint8Array.prototype.set.call(e,this.subarray(r,n),t),i},Buffer.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===e.length){var i,a=e.charCodeAt(0);("utf8"===n&&a<128||"latin1"===n)&&(e=a)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,n),s=o.length;if(0===s)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=o[i%s]}return this};var o=/[^+/0-9A-Za-z-_]/g;function base64clean(e){if((e=(e=e.split("=")[0]).trim().replace(o,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}function utf8ToBytes(e,t){t=t||1/0;for(var r,n=e.length,i=null,a=[],o=0;o<n;++o){if((r=e.charCodeAt(o))>55295&&r<57344){if(!i){if(r>56319||o+1===n){(t-=3)>-1&&a.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&a.push(239,191,189),i=r;continue}r=(i-55296<<10|r-56320)+65536}else i&&(t-=3)>-1&&a.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;a.push(r)}else if(r<2048){if((t-=2)<0)break;a.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;a.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;a.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return a}function asciiToBytes(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function utf16leToBytes(e,t){for(var r,n,i=[],a=0;a<e.length&&!((t-=2)<0);++a)n=(r=e.charCodeAt(a))>>8,i.push(r%256),i.push(n);return i}function base64ToBytes(e){return n.toByteArray(base64clean(e))}function blitBuffer(e,t,r,n){for(var i=0;i<n&&!(i+r>=t.length)&&!(i>=e.length);++i)t[i+r]=e[i];return i}function isInstance(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var s=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var n=16*r,i=0;i<16;++i)t[n+i]=e[r]+e[i];return t}()},645:function(e,t){/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */t.read=function(e,t,r,n,i){var a,o,s=8*i-n-1,c=(1<<s)-1,l=c>>1,u=-7,f=r?i-1:0,h=r?-1:1,p=e[t+f];for(f+=h,a=p&(1<<-u)-1,p>>=-u,u+=s;u>0;a=256*a+e[t+f],f+=h,u-=8);for(o=a&(1<<-u)-1,a>>=-u,u+=n;u>0;o=256*o+e[t+f],f+=h,u-=8);if(0===a)a=1-l;else{if(a===c)return o?NaN:(p?-1:1)*(1/0);o+=Math.pow(2,n),a-=l}return(p?-1:1)*o*Math.pow(2,a-n)},t.write=function(e,t,r,n,i,a){var o,s,c,l=8*a-i-1,u=(1<<l)-1,f=u>>1,h=23===i?5960464477539062e-23:0,p=n?0:a-1,d=n?1:-1,g=t<0||0===t&&1/t<0?1:0;for(isNaN(t=Math.abs(t))||t===1/0?(s=isNaN(t)?1:0,o=u):(o=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-o))<1&&(o--,c*=2),o+f>=1?t+=h/c:t+=h*Math.pow(2,1-f),t*c>=2&&(o++,c/=2),o+f>=u?(s=0,o=u):o+f>=1?(s=(t*c-1)*Math.pow(2,i),o+=f):(s=t*Math.pow(2,f-1)*Math.pow(2,i),o=0));i>=8;e[r+p]=255&s,p+=d,s/=256,i-=8);for(o=o<<i|s,l+=i;l>0;e[r+p]=255&o,p+=d,o/=256,l-=8);e[r+p-d]|=128*g}},454:function(e,t,r){"use strict";var n,i;e.exports=(null==(n=r.g.process)?void 0:n.env)&&"object"==typeof(null==(i=r.g.process)?void 0:i.env)?r.g.process:r(663)},663:function(e){!function(){var t={229:function(e){var t,r,n,i=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(t===setTimeout)return setTimeout(e,0);if((t===defaultSetTimout||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}function runClearTimeout(e){if(r===clearTimeout)return clearTimeout(e);if((r===defaultClearTimeout||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{return r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){t=defaultSetTimout}try{r="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){r=defaultClearTimeout}}();var a=[],o=!1,s=-1;function cleanUpNextTick(){o&&n&&(o=!1,n.length?a=n.concat(a):s=-1,a.length&&drainQueue())}function drainQueue(){if(!o){var e=runTimeout(cleanUpNextTick);o=!0;for(var t=a.length;t;){for(n=a,a=[];++s<t;)n&&n[s].run();s=-1,t=a.length}n=null,o=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];a.push(new Item(e,t)),1!==a.length||o||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=noop,i.addListener=noop,i.once=noop,i.off=noop,i.removeListener=noop,i.removeAllListeners=noop,i.emit=noop,i.prependListener=noop,i.prependOnceListener=noop,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}}},r={};function __nccwpck_require__(e){var n=r[e];if(void 0!==n)return n.exports;var i=r[e]={exports:{}},a=!0;try{t[e](i,i.exports,__nccwpck_require__),a=!1}finally{a&&delete r[e]}return i.exports}__nccwpck_require__.ab="//";var n=__nccwpck_require__(229);e.exports=n}()},408:function(e,t){"use strict";/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),i=(Symbol.for("react.fragment"),Symbol.for("react.strict_mode"),Symbol.for("react.profiler"),Symbol.for("react.provider"),Symbol.for("react.context"),Symbol.for("react.forward_ref"),Symbol.for("react.suspense"),Symbol.for("react.memo"),Symbol.for("react.lazy"),Symbol.iterator);function A(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=i&&e[i]||e["@@iterator"])?e:null}var a={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},o=Object.assign,s={};function E(e,t,r){this.props=e,this.context=t,this.refs=s,this.updater=r||a}function F(){}function G(e,t,r){this.props=e,this.context=t,this.refs=s,this.updater=r||a}E.prototype.isReactComponent={},E.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},E.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},F.prototype=E.prototype;var c=G.prototype=new F;c.constructor=G,o(c,E.prototype),c.isPureReactComponent=!0;var l=Array.isArray;function N(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function O(e){return"object"==typeof e&&null!==e&&e.$$typeof===r}function escape(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(e){return t[e]})}Object.prototype.hasOwnProperty;var u=/\/+/g;function Q(e,t){return"object"==typeof e&&null!==e&&null!=e.key?escape(""+e.key):t.toString(36)}},294:function(e,t,r){"use strict";r(408)}},t={};function __webpack_require__(r){var n=t[r];if(void 0!==n)return n.exports;var i=t[r]={exports:{}},a=!0;try{e[r](i,i.exports,__webpack_require__),a=!1}finally{a&&delete t[r]}return i.exports}__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),function(){"use strict";let e,t;var r,n,i,a,o,s,c,l,u,f,h=__webpack_require__(454);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let stringToByteArray$1=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:((64512&i)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128):t[r++]=i>>12|224,t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},byteArrayToString=function(e){let t=[],r=0,n=0;for(;r<e.length;){let i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){let a=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&a)}else if(i>239&&i<365){let a=e[r++],o=e[r++],s=e[r++],c=((7&i)<<18|(63&a)<<12|(63&o)<<6|63&s)-65536;t[n++]=String.fromCharCode(55296+(c>>10)),t[n++]=String.fromCharCode(56320+(1023&c))}else{let a=e[r++],o=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&a)<<6|63&o)}}return t.join("")},p={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let i=e[t],a=t+1<e.length,o=a?e[t+1]:0,s=t+2<e.length,c=s?e[t+2]:0,l=i>>2,u=(3&i)<<4|o>>4,f=(15&o)<<2|c>>6,h=63&c;s||(h=64,a||(f=64)),n.push(r[l],r[u],r[f],r[h])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let i=r[e.charAt(t++)],a=t<e.length,o=a?r[e.charAt(t)]:0;++t;let s=t<e.length,c=s?r[e.charAt(t)]:64;++t;let l=t<e.length,u=l?r[e.charAt(t)]:64;if(++t,null==i||null==o||null==c||null==u)throw new DecodeBase64StringError;let f=i<<2|o>>4;if(n.push(f),64!==c){let e=o<<4&240|c>>2;if(n.push(e),64!==u){let e=c<<6&192|u;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let t=stringToByteArray$1(e);return p.encodeByteArray(t,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},base64Decode=function(e){try{return p.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getGlobal(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==__webpack_require__.g)return __webpack_require__.g;throw Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let getDefaultsFromGlobal=()=>getGlobal().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===h||void 0===h.env)return;let e=h.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&base64Decode(e[1]);return t&&JSON.parse(t)},getDefaults=()=>{try{return getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultAppConfig=()=>{var e;return null===(e=getDefaults())||void 0===e?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Deferred=class Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}};function isIndexedDBAvailable(){try{return"object"==typeof indexedDB}catch(e){return!1}}function validateIndexedDBOpenable(){return new Promise((e,t)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}let FirebaseError=class FirebaseError extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},n=`${this.service}/${e}`,i=this.errors[e],a=i?replaceTemplate(i,r):"Error",o=`${this.serviceName}: ${a} (${n}).`,s=new FirebaseError(n,o,r);return s}};function replaceTemplate(e,t){return e.replace(d,(e,r)=>{let n=t[r];return null!=n?String(n):`<${r}?>`})}let d=/\{\$([^}]+)}/g;function deepEqual(e,t){if(e===t)return!0;let r=Object.keys(e),n=Object.keys(t);for(let i of r){if(!n.includes(i))return!1;let r=e[i],a=t[i];if(isObject(r)&&isObject(a)){if(!deepEqual(r,a))return!1}else if(r!==a)return!1}for(let e of n)if(!r.includes(e))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_getModularInstance(e){return e&&e._delegate?e._delegate:e}let Component=class Component{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let g="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Provider=class Provider{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(isComponentEager(e))try{this.getOrInitializeService({instanceIdentifier:g})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=g){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=g){return this.instances.has(e)}getOptions(e=g){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(e);r===i&&t.resolve(n)}return n}onInit(e,t){var r;let n=this.normalizeInstanceIdentifier(t),i=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;i.add(e),this.onInitCallbacks.set(n,i);let a=this.instances.get(n);return a&&e(a,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let n of r)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:normalizeIdentifierForFactory(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(e){}return r||null}normalizeInstanceIdentifier(e=g){return this.component?this.component.multipleInstances?e:g:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};function normalizeIdentifierForFactory(e){return e===g?void 0:e}function isComponentEager(e){return"EAGER"===e.instantiationMode}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ComponentContainer=class ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Provider(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let m=[];(r=s||(s={}))[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT";let y={debug:s.DEBUG,verbose:s.VERBOSE,info:s.INFO,warn:s.WARN,error:s.ERROR,silent:s.SILENT},b=s.INFO,w={[s.DEBUG]:"log",[s.VERBOSE]:"log",[s.INFO]:"info",[s.WARN]:"warn",[s.ERROR]:"error"},defaultLogHandler=(e,t,...r)=>{if(t<e.logLevel)return;let n=new Date().toISOString(),i=w[t];if(i)console[i](`[${n}]  ${e.name}:`,...r);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=b,this._logHandler=defaultLogHandler,this._userLogHandler=null,m.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in s))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?y[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,s.DEBUG,...e),this._logHandler(this,s.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,s.VERBOSE,...e),this._logHandler(this,s.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,s.INFO,...e),this._logHandler(this,s.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,s.WARN,...e),this._logHandler(this,s.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,s.ERROR,...e),this._logHandler(this,s.ERROR,...e)}};let instanceOfAny=(e,t)=>t.some(t=>e instanceof t);function getIdbProxyableTypes(){return e||(e=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return t||(t=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}let v=new WeakMap,I=new WeakMap,B=new WeakMap,S=new WeakMap,_=new WeakMap;function promisifyRequest(e){let t=new Promise((t,r)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap(e.result)),unlisten()},error=()=>{r(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&v.set(t,e)}).catch(()=>{}),_.set(t,e),t}function cacheDonePromiseForTransaction(e){if(I.has(e))return;let t=new Promise((t,r)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{r(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});I.set(e,t)}let k={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return I.get(e);if("objectStoreNames"===t)return e.objectStoreNames||B.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return wrap(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function replaceTraps(e){k=e(k)}function wrapFunction(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?getCursorAdvanceMethods().includes(e)?function(...t){return e.apply(unwrap(this),t),wrap(v.get(this))}:function(...t){return wrap(e.apply(unwrap(this),t))}:function(t,...r){let n=e.call(unwrap(this),t,...r);return B.set(n,t.sort?t.sort():[t]),wrap(n)}}function transformCachableValue(e){return"function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes()))?new Proxy(e,k):e}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(S.has(e))return S.get(e);let t=transformCachableValue(e);return t!==e&&(S.set(e,t),_.set(t,e)),t}let unwrap=e=>_.get(e);function openDB(e,t,{blocked:r,upgrade:n,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=wrap(o);return n&&o.addEventListener("upgradeneeded",e=>{n(wrap(o.result),e.oldVersion,e.newVersion,wrap(o.transaction),e)}),r&&o.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener("close",()=>a()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}function deleteDB(e,{blocked:t}={}){let r=indexedDB.deleteDatabase(e);return t&&r.addEventListener("blocked",e=>t(e.oldVersion,e)),wrap(r).then(()=>void 0)}let T=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],D=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(D.get(t))return D.get(t);let r=t.replace(/FromIndex$/,""),n=t!==r,i=C.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||T.includes(r)))return;let method=async function(e,...t){let a=this.transaction(e,i?"readwrite":"readonly"),o=a.store;return n&&(o=o.index(t.shift())),(await Promise.all([o[r](...t),i&&a.done]))[0]};return D.set(t,method),method}replaceTraps(e=>({...e,get:(t,r,n)=>getMethod(t,r)||e.get(t,r,n),has:(t,r)=>!!getMethod(t,r)||e.has(t,r)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!isVersionServiceProvider(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}};function isVersionServiceProvider(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}let x="@firebase/app",L="0.9.27",P=new Logger("@firebase/app"),M="[DEFAULT]",U={[x]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},R=new Map,j=new Map;function _addComponent(e,t){try{e.container.addComponent(t)}catch(r){P.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function _registerComponent(e){let t=e.name;if(j.has(t))return P.debug(`There were multiple attempts to register component ${t}.`),!1;for(let r of(j.set(t,e),R.values()))_addComponent(r,e);return!0}function index_esm2017_getProvider(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}let q=new ErrorFactory("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Component("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw q.create("app-deleted",{appName:this._name})}};function initializeApp(e,t={}){let r=e;if("object"!=typeof t){let e=t;t={name:e}}let n=Object.assign({name:M,automaticDataCollectionEnabled:!1},t),i=n.name;if("string"!=typeof i||!i)throw q.create("bad-app-name",{appName:String(i)});if(r||(r=getDefaultAppConfig()),!r)throw q.create("no-options");let a=R.get(i);if(a){if(deepEqual(r,a.options)&&deepEqual(n,a.config))return a;throw q.create("duplicate-app",{appName:i})}let o=new ComponentContainer(i);for(let e of j.values())o.addComponent(e);let s=new FirebaseAppImpl(r,n,o);return R.set(i,s),s}function index_esm2017_getApp(e=M){let t=R.get(e);if(!t&&e===M&&getDefaultAppConfig())return initializeApp();if(!t)throw q.create("no-app",{appName:e});return t}function registerVersion(e,t,r){var n;let i=null!==(n=U[e])&&void 0!==n?n:e;r&&(i+=`-${r}`);let a=i.match(/\s|\//),o=t.match(/\s|\//);if(a||o){let e=[`Unable to register library "${i}" with version "${t}":`];a&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),a&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),P.warn(e.join(" "));return}_registerComponent(new Component(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}let H="firebase-heartbeat-store",$=null;function getDbPromise(){return $||($=openDB("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(H)}catch(e){console.warn(e)}}}).catch(e=>{throw q.create("idb-open",{originalErrorMessage:e.message})})),$}async function readHeartbeatsFromIndexedDB(e){try{let t=await getDbPromise(),r=t.transaction(H),n=await r.objectStore(H).get(computeKey(e));return await r.done,n}catch(e){if(e instanceof FirebaseError)P.warn(e.message);else{let t=q.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});P.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{let r=await getDbPromise(),n=r.transaction(H,"readwrite"),i=n.objectStore(H);await i.put(t,computeKey(e)),await n.done}catch(e){if(e instanceof FirebaseError)P.warn(e.message);else{let t=q.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});P.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;let r=this.container.getProvider("platform-logger").getImmediate(),n=r.getPlatformInfoString(),i=getUTCDateString();return(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)==null)?void 0:this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(e=>e.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf(),r=Date.now();return r-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){var e;if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null||0===this._heartbeatsCache.heartbeats.length)return"";let t=getUTCDateString(),{heartbeatsToSend:r,unsentEntries:n}=extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats),i=base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}function extractHeartbeatsForHeader(e,t=1024){let r=[],n=e.slice();for(let i of e){let e=r.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),countBytes(r)>t){e.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),countBytes(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!isIndexedDBAvailable()&&validateIndexedDBOpenable().then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}}async overwrite(e){var t;let r=await this._canUseIndexedDBPromise;if(r){let r=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;let r=await this._canUseIndexedDBPromise;if(r){let r=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}};function countBytes(e){return base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:e})).length}_registerComponent(new Component("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new Component("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(x,L,""),registerVersion(x,L,"esm2017"),registerVersion("fire-js",""),/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */registerVersion("firebase","10.8.0","app");let V="@firebase/installations",W="0.6.5",z=`w:${W}`,K="FIS_v2",J=new ErrorFactory("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function isServerError(e){return e instanceof FirebaseError&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getInstallationsEndpoint({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function extractAuthTokenInfoFromResponse(e){return{token:e.token,requestStatus:2,expiresIn:getExpiresInFromResponseExpiresIn(e.expiresIn),creationTime:Date.now()}}async function getErrorFromResponse(e,t){let r=await t.json(),n=r.error;return J.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function getHeaders({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function getHeadersWithAuth(e,{refreshToken:t}){let r=getHeaders(e);return r.append("Authorization",getAuthorizationHeader(t)),r}async function retryIfServerError(e){let t=await e();return t.status>=500&&t.status<600?e():t}function getExpiresInFromResponseExpiresIn(e){return Number(e.replace("s","000"))}function getAuthorizationHeader(e){return`${K} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function createInstallationRequest({appConfig:e,heartbeatServiceProvider:t},{fid:r}){let n=getInstallationsEndpoint(e),i=getHeaders(e),a=t.getImmediate({optional:!0});if(a){let e=await a.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={fid:r,authVersion:K,appId:e.appId,sdkVersion:z},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await retryIfServerError(()=>fetch(n,s));if(c.ok){let e=await c.json(),t={fid:e.fid||r,registrationStatus:2,refreshToken:e.refreshToken,authToken:extractAuthTokenInfoFromResponse(e.authToken)};return t}throw await getErrorFromResponse("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sleep(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bufferToBase64UrlSafe(e){let t=btoa(String.fromCharCode(...e));return t.replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Y=/^[cdef][\w-]{21}$/;function generateFid(){try{let e=new Uint8Array(17),t=self.crypto||self.msCrypto;t.getRandomValues(e),e[0]=112+e[0]%16;let r=encode(e);return Y.test(r)?r:""}catch(e){return""}}function encode(e){let t=bufferToBase64UrlSafe(e);return t.substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getKey(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Z=new Map;function fidChanged(e,t){let r=getKey(e);callFidChangeCallbacks(r,t),broadcastFidChange(r,t)}function callFidChangeCallbacks(e,t){let r=Z.get(e);if(r)for(let e of r)e(t)}function broadcastFidChange(e,t){let r=getBroadcastChannel();r&&r.postMessage({key:e,fid:t}),closeBroadcastChannel()}let X=null;function getBroadcastChannel(){return!X&&"BroadcastChannel"in self&&((X=new BroadcastChannel("[Firebase] FID Change")).onmessage=e=>{callFidChangeCallbacks(e.data.key,e.data.fid)}),X}function closeBroadcastChannel(){0===Z.size&&X&&(X.close(),X=null)}let ee="firebase-installations-store",et=null;function index_esm2017_getDbPromise(){return et||(et=openDB("firebase-installations-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(ee)}})),et}async function set(e,t){let r=getKey(e),n=await index_esm2017_getDbPromise(),i=n.transaction(ee,"readwrite"),a=i.objectStore(ee),o=await a.get(r);return await a.put(t,r),await i.done,o&&o.fid===t.fid||fidChanged(e,t.fid),t}async function remove(e){let t=getKey(e),r=await index_esm2017_getDbPromise(),n=r.transaction(ee,"readwrite");await n.objectStore(ee).delete(t),await n.done}async function update(e,t){let r=getKey(e),n=await index_esm2017_getDbPromise(),i=n.transaction(ee,"readwrite"),a=i.objectStore(ee),o=await a.get(r),s=t(o);return void 0===s?await a.delete(r):await a.put(s,r),await i.done,s&&(!o||o.fid!==s.fid)&&fidChanged(e,s.fid),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getInstallationEntry(e){let t;let r=await update(e.appConfig,r=>{let n=updateOrCreateInstallationEntry(r),i=triggerRegistrationIfNecessary(e,n);return t=i.registrationPromise,i.installationEntry});return""===r.fid?{installationEntry:await t}:{installationEntry:r,registrationPromise:t}}function updateOrCreateInstallationEntry(e){let t=e||{fid:generateFid(),registrationStatus:0};return clearTimedOutRequest(t)}function triggerRegistrationIfNecessary(e,t){if(0===t.registrationStatus){if(!navigator.onLine){let e=Promise.reject(J.create("app-offline"));return{installationEntry:t,registrationPromise:e}}let r={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},n=registerInstallation(e,r);return{installationEntry:r,registrationPromise:n}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:waitUntilFidRegistration(e)}:{installationEntry:t}}async function registerInstallation(e,t){try{let r=await createInstallationRequest(e,t);return set(e.appConfig,r)}catch(r){throw isServerError(r)&&409===r.customData.serverCode?await remove(e.appConfig):await set(e.appConfig,{fid:t.fid,registrationStatus:0}),r}}async function waitUntilFidRegistration(e){let t=await updateInstallationRequest(e.appConfig);for(;1===t.registrationStatus;)await sleep(100),t=await updateInstallationRequest(e.appConfig);if(0===t.registrationStatus){let{installationEntry:t,registrationPromise:r}=await getInstallationEntry(e);return r||t}return t}function updateInstallationRequest(e){return update(e,e=>{if(!e)throw J.create("installation-not-found");return clearTimedOutRequest(e)})}function clearTimedOutRequest(e){return hasInstallationRequestTimedOut(e)?{fid:e.fid,registrationStatus:0}:e}function hasInstallationRequestTimedOut(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function generateAuthTokenRequest({appConfig:e,heartbeatServiceProvider:t},r){let n=getGenerateAuthTokenEndpoint(e,r),i=getHeadersWithAuth(e,r),a=t.getImmediate({optional:!0});if(a){let e=await a.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={installation:{sdkVersion:z,appId:e.appId}},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await retryIfServerError(()=>fetch(n,s));if(c.ok){let e=await c.json(),t=extractAuthTokenInfoFromResponse(e);return t}throw await getErrorFromResponse("Generate Auth Token",c)}function getGenerateAuthTokenEndpoint(e,{fid:t}){return`${getInstallationsEndpoint(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function refreshAuthToken(e,t=!1){let r;let n=await update(e.appConfig,n=>{if(!isEntryRegistered(n))throw J.create("not-registered");let i=n.authToken;if(!t&&isAuthTokenValid(i))return n;if(1===i.requestStatus)return r=waitUntilAuthTokenRequest(e,t),n;{if(!navigator.onLine)throw J.create("app-offline");let t=makeAuthTokenRequestInProgressEntry(n);return r=fetchAuthTokenFromServer(e,t),t}}),i=r?await r:n.authToken;return i}async function waitUntilAuthTokenRequest(e,t){let r=await updateAuthTokenRequest(e.appConfig);for(;1===r.authToken.requestStatus;)await sleep(100),r=await updateAuthTokenRequest(e.appConfig);let n=r.authToken;return 0===n.requestStatus?refreshAuthToken(e,t):n}function updateAuthTokenRequest(e){return update(e,e=>{if(!isEntryRegistered(e))throw J.create("not-registered");let t=e.authToken;return hasAuthTokenRequestTimedOut(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function fetchAuthTokenFromServer(e,t){try{let r=await generateAuthTokenRequest(e,t),n=Object.assign(Object.assign({},t),{authToken:r});return await set(e.appConfig,n),r}catch(r){if(isServerError(r)&&(401===r.customData.serverCode||404===r.customData.serverCode))await remove(e.appConfig);else{let r=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await set(e.appConfig,r)}throw r}}function isEntryRegistered(e){return void 0!==e&&2===e.registrationStatus}function isAuthTokenValid(e){return 2===e.requestStatus&&!isAuthTokenExpired(e)}function isAuthTokenExpired(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}function makeAuthTokenRequestInProgressEntry(e){let t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function hasAuthTokenRequestTimedOut(e){return 1===e.requestStatus&&e.requestTime+1e4<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getId(e){let{installationEntry:t,registrationPromise:r}=await getInstallationEntry(e);return r?r.catch(console.error):refreshAuthToken(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getToken(e,t=!1){await completeInstallationRegistration(e);let r=await refreshAuthToken(e,t);return r.token}async function completeInstallationRegistration(e){let{registrationPromise:t}=await getInstallationEntry(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function extractAppConfig(e){if(!e||!e.options)throw getMissingValueError("App Configuration");if(!e.name)throw getMissingValueError("App Name");for(let t of["projectId","apiKey","appId"])if(!e.options[t])throw getMissingValueError(t);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function getMissingValueError(e){return J.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let er="installations";_registerComponent(new Component(er,e=>{let t=e.getProvider("app").getImmediate(),r=extractAppConfig(t),n=index_esm2017_getProvider(t,"heartbeat");return{app:t,appConfig:r,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},"PUBLIC")),_registerComponent(new Component("installations-internal",e=>{let t=e.getProvider("app").getImmediate(),r=index_esm2017_getProvider(t,er).getImmediate();return{getId:()=>getId(r),getToken:e=>getToken(r,e)}},"PRIVATE")),registerVersion(V,W),registerVersion(V,W,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let en="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",ei="FCM_MSG";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function arrayToBase64(e){let t=new Uint8Array(e),r=btoa(String.fromCharCode(...t));return r.replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function base64ToArray(e){let t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(r),i=new Uint8Array(n.length);for(let e=0;e<n.length;++e)i[e]=n.charCodeAt(e);return i}(n=c||(c={}))[n.DATA_MESSAGE=1]="DATA_MESSAGE",n[n.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION",(i=l||(l={})).PUSH_RECEIVED="push-received",i.NOTIFICATION_CLICKED="notification-clicked";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ea="fcm_token_details_db",eo="fcm_token_object_Store";async function migrateOldDatabase(e){if("databases"in indexedDB){let e=await indexedDB.databases(),t=e.map(e=>e.name);if(!t.includes(ea))return null}let t=null,r=await openDB(ea,5,{upgrade:async(r,n,i,a)=>{var o;if(n<2||!r.objectStoreNames.contains(eo))return;let s=a.objectStore(eo),c=await s.index("fcmSenderId").get(e);if(await s.clear(),c){if(2===n){if(!c.auth||!c.p256dh||!c.endpoint)return;t={token:c.fcmToken,createTime:null!==(o=c.createTime)&&void 0!==o?o:Date.now(),subscriptionOptions:{auth:c.auth,p256dh:c.p256dh,endpoint:c.endpoint,swScope:c.swScope,vapidKey:"string"==typeof c.vapidKey?c.vapidKey:arrayToBase64(c.vapidKey)}}}else 3===n?t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:arrayToBase64(c.auth),p256dh:arrayToBase64(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:arrayToBase64(c.vapidKey)}}:4===n&&(t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:arrayToBase64(c.auth),p256dh:arrayToBase64(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:arrayToBase64(c.vapidKey)}})}}});return r.close(),await deleteDB(ea),await deleteDB("fcm_vapid_details_db"),await deleteDB("undefined"),checkTokenDetails(t)?t:null}function checkTokenDetails(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}let es="firebase-messaging-store",ec=null;function index_sw_esm2017_getDbPromise(){return ec||(ec=openDB("firebase-messaging-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(es)}})),ec}async function dbGet(e){let t=function({appConfig:e}){return e.appId}(e),r=await index_sw_esm2017_getDbPromise(),n=await r.transaction(es).objectStore(es).get(t);if(n)return n;{let t=await migrateOldDatabase(e.appConfig.senderId);if(t)return await dbSet(e,t),t}}async function dbSet(e,t){let r=function({appConfig:e}){return e.appId}(e),n=await index_sw_esm2017_getDbPromise(),i=n.transaction(es,"readwrite");return await i.objectStore(es).put(t,r),await i.done,t}async function dbRemove(e){let t=function({appConfig:e}){return e.appId}(e),r=await index_sw_esm2017_getDbPromise(),n=r.transaction(es,"readwrite");await n.objectStore(es).delete(t),await n.done}let el=new ErrorFactory("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function requestGetToken(e,t){let r;let n=await index_sw_esm2017_getHeaders(e),i=getBody(t),a={method:"POST",headers:n,body:JSON.stringify(i)};try{let t=await fetch(getEndpoint(e.appConfig),a);r=await t.json()}catch(e){throw el.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(r.error){let e=r.error.message;throw el.create("token-subscribe-failed",{errorInfo:e})}if(!r.token)throw el.create("token-subscribe-no-token");return r.token}async function requestUpdateToken(e,t){let r;let n=await index_sw_esm2017_getHeaders(e),i=getBody(t.subscriptionOptions),a={method:"PATCH",headers:n,body:JSON.stringify(i)};try{let n=await fetch(`${getEndpoint(e.appConfig)}/${t.token}`,a);r=await n.json()}catch(e){throw el.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(r.error){let e=r.error.message;throw el.create("token-update-failed",{errorInfo:e})}if(!r.token)throw el.create("token-update-no-token");return r.token}async function requestDeleteToken(e,t){let r=await index_sw_esm2017_getHeaders(e);try{let n=await fetch(`${getEndpoint(e.appConfig)}/${t}`,{method:"DELETE",headers:r}),i=await n.json();if(i.error){let e=i.error.message;throw el.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw el.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function getEndpoint({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function index_sw_esm2017_getHeaders({appConfig:e,installations:t}){let r=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${r}`})}function getBody({p256dh:e,auth:t,endpoint:r,vapidKey:n}){let i={web:{endpoint:r,auth:t,p256dh:e}};return n!==en&&(i.web.applicationPubKey=n),i}async function getTokenInternal(e){let t=await getPushSubscription(e.swRegistration,e.vapidKey),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:arrayToBase64(t.getKey("auth")),p256dh:arrayToBase64(t.getKey("p256dh"))},n=await dbGet(e.firebaseDependencies);if(!n)return getNewToken(e.firebaseDependencies,r);if(isTokenValid(n.subscriptionOptions,r))return Date.now()>=n.createTime+6048e5?updateToken(e,{token:n.token,createTime:Date.now(),subscriptionOptions:r}):n.token;try{await requestDeleteToken(e.firebaseDependencies,n.token)}catch(e){console.warn(e)}return getNewToken(e.firebaseDependencies,r)}async function deleteTokenInternal(e){let t=await dbGet(e.firebaseDependencies);t&&(await requestDeleteToken(e.firebaseDependencies,t.token),await dbRemove(e.firebaseDependencies));let r=await e.swRegistration.pushManager.getSubscription();return!r||r.unsubscribe()}async function updateToken(e,t){try{let r=await requestUpdateToken(e.firebaseDependencies,t),n=Object.assign(Object.assign({},t),{token:r,createTime:Date.now()});return await dbSet(e.firebaseDependencies,n),r}catch(t){throw await deleteTokenInternal(e),t}}async function getNewToken(e,t){let r=await requestGetToken(e,t),n={token:r,createTime:Date.now(),subscriptionOptions:t};return await dbSet(e,n),n.token}async function getPushSubscription(e,t){let r=await e.pushManager.getSubscription();return r||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:base64ToArray(t)})}function isTokenValid(e,t){let r=t.vapidKey===e.vapidKey,n=t.endpoint===e.endpoint,i=t.auth===e.auth,a=t.p256dh===e.p256dh;return r&&n&&i&&a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function externalizePayload(e){let t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return propagateNotificationPayload(t,e),propagateDataPayload(t,e),propagateFcmOptions(t,e),t}function propagateNotificationPayload(e,t){if(!t.notification)return;e.notification={};let r=t.notification.title;r&&(e.notification.title=r);let n=t.notification.body;n&&(e.notification.body=n);let i=t.notification.image;i&&(e.notification.image=i);let a=t.notification.icon;a&&(e.notification.icon=a)}function propagateDataPayload(e,t){t.data&&(e.data=t.data)}function propagateFcmOptions(e,t){var r,n,i,a,o;if(!t.fcmOptions&&!(null===(r=t.notification)||void 0===r?void 0:r.click_action))return;e.fcmOptions={};let s=null!==(i=null===(n=t.fcmOptions)||void 0===n?void 0:n.link)&&void 0!==i?i:null===(a=t.notification)||void 0===a?void 0:a.click_action;s&&(e.fcmOptions.link=s);let c=null===(o=t.fcmOptions)||void 0===o?void 0:o.analytics_label;c&&(e.fcmOptions.analyticsLabel=c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function isConsoleMessage(e){return"object"==typeof e&&!!e&&"google.c.a.c_id"in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_sw_esm2017_sleep(e){return new Promise(t=>{setTimeout(t,e)})}async function stageLog(e,t){let r=createFcmEvent(t,await e.firebaseDependencies.installations.getId());createAndEnqueueLogEvent(e,r,t.productId)}function createFcmEvent(e,t){var r,n;let i={};return e.from&&(i.project_number=e.from),e.fcmMessageId&&(i.message_id=e.fcmMessageId),i.instance_id=t,e.notification?i.message_type=c.DISPLAY_NOTIFICATION.toString():i.message_type=c.DATA_MESSAGE.toString(),i.sdk_platform="3",i.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),e.collapse_key&&(i.collapse_key=e.collapse_key),i.event="1",(null===(r=e.fcmOptions)||void 0===r?void 0:r.analytics_label)&&(i.analytics_label=null===(n=e.fcmOptions)||void 0===n?void 0:n.analytics_label),i}function createAndEnqueueLogEvent(e,t,r){let n={};n.event_time_ms=Math.floor(Date.now()).toString(),n.source_extension_json_proto3=JSON.stringify(t),r&&(n.compliance_data=buildComplianceData(r)),e.logEvents.push(n)}function buildComplianceData(e){return{privacy_context:{prequest:{origin_associated_product_id:e}}}}function _mergeStrings(e,t){let r=[];for(let n=0;n<e.length;n++)r.push(e.charAt(n)),n<t.length&&r.push(t.charAt(n));return r.join("")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function onSubChange(e,t){var r,n;let{newSubscription:i}=e;if(!i){await deleteTokenInternal(t);return}let a=await dbGet(t.firebaseDependencies);await deleteTokenInternal(t),t.vapidKey=null!==(n=null===(r=null==a?void 0:a.subscriptionOptions)||void 0===r?void 0:r.vapidKey)&&void 0!==n?n:en,await getTokenInternal(t)}async function onPush(e,t){let r=getMessagePayloadInternal(e);if(!r)return;t.deliveryMetricsExportedToBigQueryEnabled&&await stageLog(t,r);let n=await getClientList();if(hasVisibleClients(n))return sendMessagePayloadInternalToWindows(n,r);if(r.notification&&await showNotification(wrapInternalPayload(r)),t&&t.onBackgroundMessageHandler){let e=externalizePayload(r);"function"==typeof t.onBackgroundMessageHandler?await t.onBackgroundMessageHandler(e):t.onBackgroundMessageHandler.next(e)}}async function onNotificationClick(e){var t,r;let n=null===(r=null===(t=e.notification)||void 0===t?void 0:t.data)||void 0===r?void 0:r[ei];if(!n||e.action)return;e.stopImmediatePropagation(),e.notification.close();let i=getLink(n);if(!i)return;let a=new URL(i,self.location.href),o=new URL(self.location.origin);if(a.host!==o.host)return;let s=await getWindowClient(a);if(s?s=await s.focus():(s=await self.clients.openWindow(i),await index_sw_esm2017_sleep(3e3)),s)return n.messageType=l.NOTIFICATION_CLICKED,n.isFirebaseMessaging=!0,s.postMessage(n)}function wrapInternalPayload(e){let t=Object.assign({},e.notification);return t.data={[ei]:e},t}function getMessagePayloadInternal({data:e}){if(!e)return null;try{return e.json()}catch(e){return null}}async function getWindowClient(e){let t=await getClientList();for(let r of t){let t=new URL(r.url,self.location.href);if(e.host===t.host)return r}return null}function hasVisibleClients(e){return e.some(e=>"visible"===e.visibilityState&&!e.url.startsWith("chrome-extension://"))}function sendMessagePayloadInternalToWindows(e,t){for(let r of(t.isFirebaseMessaging=!0,t.messageType=l.PUSH_RECEIVED,e))r.postMessage(t)}function getClientList(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function showNotification(e){var t;let{actions:r}=e,{maxActions:n}=Notification;return r&&n&&r.length>n&&console.warn(`This browser only supports ${n} actions. The remaining actions will not be displayed.`),self.registration.showNotification(null!==(t=e.title)&&void 0!==t?t:"",e)}function getLink(e){var t,r,n;let i=null!==(r=null===(t=e.fcmOptions)||void 0===t?void 0:t.link)&&void 0!==r?r:null===(n=e.notification)||void 0===n?void 0:n.click_action;return i||(isConsoleMessage(e.data)?self.location.origin:null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_sw_esm2017_extractAppConfig(e){if(!e||!e.options)throw index_sw_esm2017_getMissingValueError("App Configuration Object");if(!e.name)throw index_sw_esm2017_getMissingValueError("App Name");let{options:t}=e;for(let e of["projectId","apiKey","appId","messagingSenderId"])if(!t[e])throw index_sw_esm2017_getMissingValueError(e);return{appName:e.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function index_sw_esm2017_getMissingValueError(e){return el.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_mergeStrings("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),_mergeStrings("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let MessagingService=class MessagingService{constructor(e,t,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;let n=index_sw_esm2017_extractAppConfig(e);this.firebaseDependencies={app:e,appConfig:n,installations:t,analyticsProvider:r}}_delete(){return Promise.resolve()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function isSwSupported(){return isIndexedDBAvailable()&&await validateIndexedDBOpenable()&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function onBackgroundMessage$1(e,t){if(void 0!==self.document)throw el.create("only-available-in-sw");return e.onBackgroundMessageHandler=t,()=>{e.onBackgroundMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getMessagingInSw(e=index_esm2017_getApp()){return isSwSupported().then(e=>{if(!e)throw el.create("unsupported-browser")},e=>{throw el.create("indexed-db-unsupported")}),index_esm2017_getProvider(index_esm2017_getModularInstance(e),"messaging-sw").getImmediate()}function onBackgroundMessage(e,t){return onBackgroundMessage$1(e=index_esm2017_getModularInstance(e),t)}_registerComponent(new Component("messaging-sw",e=>{let t=new MessagingService(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return self.addEventListener("push",e=>{e.waitUntil(onPush(e,t))}),self.addEventListener("pushsubscriptionchange",e=>{e.waitUntil(onSubChange(e,t))}),self.addEventListener("notificationclick",e=>{e.waitUntil(onNotificationClick(e))}),t},"PUBLIC"));var eu=JSON.parse('{"apiKey":"AIzaSyAwUMV3zg6ypouir56usWI6jD-SV_iJt_Q","authDomain":"loanriskengine.firebaseapp.com","projectId":"loanriskengine","storageBucket":"loanriskengine.appspot.com","messagingSenderId":"728183798332","appId":"1:728183798332:web:4bc521a55bedfbbb20e139","measurementId":"G-WDT573KGRY"}');let ServiceWorkerHelper=class ServiceWorkerHelper{prepareUrl(e,t){var r;return t?e.replace("{customerId}",(null==t?void 0:null===(r=t.customerId)||void 0===r?void 0:r.toString())||""):e}prepareJsUrl(e){return this.removeParameter(e,"ts")}getPageUrls(e){return this.getImgUrls(e).concat(this.getJsUrls(e)).concat(this.getResponsiveImgUrls(e)).concat(this.getBackgroundImgUrls(e))}isCacheFirst(e){if(this.isDevelopment)return!1;let t=location.origin;return!!e.startsWith(t)&&(this.rxInitApp.test(e)||this.cacheAfterUrls.map(e=>"".concat(t,"/").concat(e)).every(t=>!e.startsWith(t)))}getJsUrls(e){return this.matchAll(e,this.jsUrlsRegex).map(e=>this.prepareJsUrl(e))}getBackgroundImgUrls(e){return this.matchAll(e,this.backgroundImgUrlsRegex)}getResponsiveImgUrls(e){let t=this.matchAll(e,this.responsiveImgUrlsRegex),r=[];for(let e of t){let t=e.split(",");r=r.concat(t.map(e=>e.trim().split(" ")[0]))}return r}getImgUrls(e){return this.matchAll(e,this.imgUrlsRegex)}matchAll(e,t){let r;let n=[];for(;r=t.exec(e);){let e=this.decodeEntities(r[1]);n.push(e)}return n}decodeEntities(e){let t={nbsp:" ",amp:"&",quot:'"',lt:"<",gt:">"};return e.replace(this.decodeSymbolsRegex,function(e,r){return t[r]}).replace(this.decodeSymbolCodesRegex,function(e,t){let r=parseInt(t,10);return String.fromCharCode(r)})}removeParameter(e,t){let r=e.split("?"),n=r[1];if(!n)return e;let i=n.split("&");for(let e=0;e<i.length;e++)if(i[e].startsWith(t+"=")){i.splice(e,1);break}return r[0]+(i.length?"?"+i.join("&"):"")}get isDevelopment(){return"development"===this.cacheName}constructor(){this.cacheName=new URL(location.toString()).searchParams.get("buildId"),this.decodeSymbolsRegex=/&(nbsp|amp|quot|lt|gt);/g,this.decodeSymbolCodesRegex=/&#(\d+);/gi,this.imgUrlsRegex=/<img\s+[^>]*\s*src\s*=\s*"((?!data:).+?)"[^>]*>/ig,this.responsiveImgUrlsRegex=/<img\s+[^>]*\s*srcset\s*=\s*"((?!data:).+?)"[^>]*>/ig,this.backgroundImgUrlsRegex=/background-image\s*:\s*url\("([^"]+)"\)/ig,this.jsUrlsRegex=/<script\s+[^>]*\s*src\s*=\s*"(.+?)"[^>]*>/ig,this.cacheAfterUrls=["api","app","pdf","_next/data"],this.rxInitApp=/api\/app/}};let ef=new ServiceWorkerHelper;var eh={info(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];setTimeout(()=>console.info(...t))},log(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];setTimeout(()=>console.log(...t))},warn(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];setTimeout(()=>console.warn(...t))},error(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];setTimeout(()=>console.error(...t))},debug(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];setTimeout(()=>console.debug(...t))},ignore(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r]}};function setConsoleHook(e){for(let t of Object.keys(eh)){let r=eh[t];eh[t]=function(){for(var n=arguments.length,i=Array(n),a=0;a<n;a++)i[a]=arguments[a];return e({level:t,args:i,origin:r})}}}function toConsoleMessage(e){return{level:e.level,args:e.args}}__webpack_require__(294),(a=u||(u={}))[a.web=0]="web",a[a.pwa=1]="pwa",a[a.wrapper=2]="wrapper",(o=f||(f={}))[o.WAITING=0]="WAITING",o[o.IN_PROGRESS=1]="IN_PROGRESS";let FetcherIndexedDb=class FetcherIndexedDb{isOutdated(e){let t=e.lastModified,r=this.DEADLOCK_TIMEOUT_MS;return!t||Date.now()-new Date(t).getTime()>=r}async next(){let e;let t=await this.connect(),r=t.transaction(FetcherIndexedDb.storeName,"readwrite"),n=r.objectStore(FetcherIndexedDb.storeName),i=n.index("priority").openCursor(),a=new Promise(t=>e=t);return i.onsuccess=t=>{var n;let i=null===(n=t.target)||void 0===n?void 0:n.result;if(i){let t=i.value;this.isOutdated(t)||1!==t.state?(t.state=1,t.lastModified=new Date().toISOString(),i.update(t),r.commit(),e(t)):i.continue()}else e(void 0)},a}async complete(e){let t=await this.connect(),r=t.transaction(FetcherIndexedDb.storeName,"readwrite"),n=r.objectStore(FetcherIndexedDb.storeName),i=e.url,a=await new Promise((e,t)=>{let r=n.get(i);r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)});1===a.state&&n.delete(i),r.commit()}async merge(e){if(!e.length)return;let t=await this.connect(),r=t.transaction(FetcherIndexedDb.storeName,"readwrite"),n=r.objectStore(FetcherIndexedDb.storeName);for(let t of e){let e=t.url,r=new Date().toISOString();try{let i=await new Promise((t,r)=>{let i=n.get(e);i.onsuccess=()=>t(i.result),i.onerror=()=>r(i.error)});i?0!==i.state&&(i.state=0,i.lastModified=r,n.put(i).onerror=()=>this.logger.error("Cannot update fetcher record")):(i={...t,state:0,lastModified:r},n.add(i).onerror=()=>this.logger.error("Cannot add fetcher record"))}catch(t){this.logger.error("Cannot merge url '".concat(e,"': ").concat(t))}}r.commit()}async connect(){return this.db?this.db:this.connecting?await this.connecting:this.connecting=new Promise((e,t)=>{let r=indexedDB.open(this.name);r.onupgradeneeded=()=>{let e=r.result,t=e.createObjectStore(FetcherIndexedDb.storeName,{keyPath:"url"});t.createIndex("priority","priority",{unique:!1})},r.onerror=()=>t(r.error),r.onsuccess=()=>e(r.result)})}constructor(e,t=console){if(this.name=e,this.logger=t,this.DEADLOCK_TIMEOUT_MS=3e4,"undefined"==typeof indexedDB)throw Error("Cannot create IndexedDB");this.connect().catch(e=>this.logger.error("Cannot initialize IndexedDB:",e))}};FetcherIndexedDb.storeName="url-store";let Fetcher=class Fetcher{async fetch(e){await this.db.merge(e),this.start().catch()}async watch(){this.start().then(()=>{setTimeout(()=>this.watch(),this.WATCH_DELAY_MS)})}async start(){if(!this.inProgress){this.inProgress=!0;try{let t;for(;t=await this.db.next();){let r;let n=t.url,i={...t.headers||{},"x-client-date":new Date().toISOString()};try{r=await fetch(n,{headers:i}).then(this.fetchMiddleware)}catch(e){r=await fetch(n,{headers:i,mode:"no-cors"}).then(this.fetchMiddleware)}if(r.status>=100&&r.status<400){var e;await (null===(e=this.cache)||void 0===e?void 0:e.put(n,r.clone()))}await this.db.complete(t)}}catch(e){this.logger.error("Fetcher start error:",e)}finally{this.inProgress=!1}}}constructor(e,t,r=console,n=e=>e){this.db=e,this.logger=r,this.fetchMiddleware=n,this.inProgress=!1,this.WATCH_DELAY_MS=1e3,t&&t.then&&t.then(e=>this.cache=e)}};let SwLock=class SwLock{async acquire(){let e=await this.connect(),t=e.transaction(SwLock.storeName,"readwrite"),r=t.objectStore(SwLock.storeName);return new Promise(n=>{t.oncomplete=()=>{this.debug&&eh.log("lock acquired"),n(!0)},t.onerror=t=>{this.debug&&eh.log("lock error",t);let r=e.transaction(SwLock.storeName,"readonly"),i=r.objectStore(SwLock.storeName);i.get(this.name).onsuccess=async e=>{let t=e.target.result;if(this.debug&&eh.log("lock record",t),t&&this.isOutdated(t))return this.debug&&eh.log("lock record is outdated"),await this.release(),n(await this.acquire());n(!1)},r.commit()},r.add({acquire:this.name,date:new Date().toISOString()}),t.commit()})}async release(){let e=await this.connect(),t=e.transaction(SwLock.storeName,"readwrite"),r=t.objectStore(SwLock.storeName);return new Promise(e=>{t.oncomplete=()=>{this.debug&&eh.log("lock released"),e(!0)},t.onerror=t.onabort=()=>{this.debug&&eh.log("lock release error"),e(!1)},r.delete(this.name),t.commit()})}async connect(){return this.db?this.db:this.connecting?await this.connecting:this.connecting=new Promise((e,t)=>{let r=indexedDB.open(SwLock.dbName);r.onupgradeneeded=()=>{r.result.createObjectStore(SwLock.storeName,{keyPath:"acquire"})},r.onerror=()=>t(r.error),r.onsuccess=()=>e(r.result)})}isOutdated(e){let{date:t}=e;return!t||Date.now()-new Date(t).getTime()>=1e3*this.timeout}constructor(e){this.name=e,this.debug=!1,this.timeout=10,this.debug=this.debug||SwLock.debug}};SwLock.debug=!1,SwLock.storeName="lock-store",SwLock.dbName="ws-sw-lock";var ep=__webpack_require__(764).lW;let ed=[];async function fire(e,t){let r=await self.clients.matchAll({includeUncontrolled:!0,type:"window"});r.forEach(r=>{r.postMessage({type:e,data:t})})}function finalize(e){return fire("fetch").catch(),e}eh.ignore(ed);let eg=new Fetcher(new FetcherIndexedDb("ws-url-queue",eh),caches.open(ef.cacheName),eh,finalize);eg.watch().catch(),self.addEventListener("notificationclick",e=>{let t=e.notification;t.close(),e.waitUntil((async()=>{var e;let r=null===(e=t.data)||void 0===e?void 0:e.url;if(r)return self.clients.openWindow(r);let n=await self.clients.matchAll({type:"window"});if(n.length){let e=n[0];return e.focus&&e.focus()}if(self.clients.openWindow)return self.clients.openWindow("/app")})())});let em=initializeApp(eu),ey=getMessagingInSw(em);async function areBlobsEqual(e,t){if(304===e.status)return!1;let r=await t.blob(),n=await e.clone().blob();return!ep.from(await r.arrayBuffer()).compare(ep.from(await n.arrayBuffer()))}onBackgroundMessage(ey,async e=>{var t,r,n,i;await self.registration.showNotification((null===(t=e.notification)||void 0===t?void 0:t.title)||"",{body:null===(r=e.notification)||void 0===r?void 0:r.body,icon:self.pushIcon,badge:self.pushBadge,data:e.data,tag:(null===(n=e.data)||void 0===n?void 0:n.id)||(null===(i=e.data)||void 0===i?void 0:i.tag),renotify:!0});let a=await self.clients.matchAll({includeUncontrolled:!0,type:"window"});a.forEach(t=>t.postMessage({type:"backgroundMsg",message:e}))}),self.addEventListener("install",async e=>{eh.log("[Service worker] Installing..."),e.waitUntil((async()=>{eh.log("[Service worker] Installed")})())}),self.addEventListener("activate",e=>{eh.log("[Service worker] Activating..."),e.waitUntil((async()=>{await self.clients.claim();let e=(await caches.keys()).filter(e=>e!==ef.cacheName);e.length&&(await Promise.all(e.map(e=>caches.delete(e))),eh.log("[Service worker] Old caches removed:",e)),eh.log("[Service worker] Activated")})())}),self.addEventListener("fetch",function(e){e.respondWith(async function(){let t,r=e.request,n=r.url,i=n.split("?")[0].endsWith(".js")?ef.prepareJsUrl(n):n,a=await caches.open(ef.cacheName);new URL(n).host===new URL(self.serviceWorker.scriptURL).host&&(r=new Request(r)).headers.append("x-client-date",new Date().toISOString());try{if("GET"!==r.method)return await fetch(r).then(finalize);if(ef.isCacheFirst(i)&&(t=await a.match(i)))return fetch(r).then(async e=>(await areBlobsEqual(e,t)||(await a.put(i,e.clone()),self.refreshed=!0,fire("refresh").catch()),fire("fetch").catch(),e)),t.clone();t=await fetch(r).then(finalize);let e=~i.indexOf("_next/data")&&await a.match(i)&&0===Object.keys(await t.clone().json()).length;if(!e){let e=t.clone();await a.put(i,e)}return t}catch(t){let e=await a.match(i);if(e)return e;if("GET"!==r.method||i.includes("_next")||i.includes("api/"))return null;return await a.match("/error/offline")}}())}),self.addEventListener("message",async e=>{try{let t=!1;switch(e.data.type){case"init":{if(self.initialized)return;self.initialized=!0,Object.assign(self,e.data),t=void 0!==self.runtimeEnvironmentType&&self.runtimeEnvironmentType!==u.web;let r=self.runtimeEnvironmentType;r===u.wrapper&&initConsole().catch(),prefetch(r===u.web).catch(),await self.skipWaiting(),self.refreshed&&(fire("refresh").catch(),self.refreshed=!1);break}case"prefetch":self.runtimeEnvironmentType=u.pwa,t=!0,await prefetch();break;case"login":t||await updateCache(self.loginUpdates.concat(self.resourcesToCache).filter((e,t,r)=>r.indexOf(e)===t).map(t=>ef.prepareUrl(t,e.data)));break;case"logout":t||await updateCache(self.loginUpdates.concat(self.resourcesToCache).filter((e,t,r)=>r.indexOf(e)===t).filter(e=>!~e.indexOf("{customerId}")));break;case"invalidate":{let t=await caches.open(ef.cacheName);await Promise.all((e.data.urls||[]).map(e=>t.delete(e))),fire("invalidated",e.data).catch()}}}catch(e){eh.error(e)}});let eb=!1,initConsole=async()=>{if(eb)return;let e=await self.clients.matchAll({includeUncontrolled:!0,type:"window"});setConsoleHook(t=>{t.origin.apply(console,t.args),e.forEach(e=>{e.postMessage({type:"console",message:toConsoleMessage(t)})})}),eb=!0},prefetch=async function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=new SwLock("prefetch");if(!await t.acquire())return;let r="/prefetched",n=await caches.open(ef.cacheName);if(await n.match(r))return await t.release().catch();eh.log("[Service worker] Resources pre-fetching...");try{let t=[],i=self.requiredPages;for(let r of(e||(i=i.concat(self.pagesToCache)),i))try{t.push(r);let e=await fetch(r).then(finalize).catch(),n=await e.text(),i=ef.getPageUrls(n);t=t.concat(i)}catch(e){}t=[...new Set(t),...e?[]:self.resourcesToCache.map(e=>ef.prepareUrl(e))],await updateCache(t),await n.put(r,new Response).catch(),eh.log("[Service worker] Resources pre-fetched")}catch(e){eh.error("Prefetch error:",e)}finally{await t.release().catch()}},ew=/^.*\.([a-z0-9]+)$/i;function urlPriority(e){var t;let r=(null===(t=e.split("?")[0])||void 0===t?void 0:t.split("/").pop())||"",n=r.replace(ew,"$1");switch(n){case r:return 1;case"css":return 2;case"js":return 3;default:return 4}}let updateCache=async e=>{let t=e.map(e=>({url:e,headers:{},priority:urlPriority(e)}));eg.fetch(t).catch()}}()}();