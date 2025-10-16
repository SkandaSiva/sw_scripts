/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(9);
var isBuffer = __webpack_require__(41);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return subscribe_case; });
/* unused harmony export permission_status */
/* unused harmony export popup_action */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return yes_no; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return shop_plans; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return pending_action; });
/* unused harmony export popup_widget_type */
/* unused harmony export popup_priority_config */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return sub_channel; });
/* unused harmony export widget_theme */
/* unused harmony export extras_imported_shop */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return subscribe_popup_trigger; });
/* unused harmony export country_iso_phone_code */

var subscribe_case = {
    marketing: 'marketing',
    back_in_stock: 'back_in_stock',
    price_drop_alert: 'price_drop_alert',
    shipping_info: 'shipping_info',
    abandoned_cart: 'abandoned_cart',
    abandoned_browser: 'abandoned_browser',
    customer_winback: 'customer_winback',
    checkout_sms_phone: 'checkout_sms_phone'
};

var permission_status = {
    Granted: 'granted',
    Default: 'default',
    Denied: 'denied'
};

var popup_action = {
    Close: 'close',
    Close_browser_popup: 'close_browser',
    Close_ios_prompt: 'close_ios_prompt',
    Subscribe: 'subscribe'
};

var yes_no = {
    Yes: 'yes',
    No: 'no'
};

var shop_plans = {
    free_go: 'free_go',
    free_stop: 'free_stop',
    legacy: 'legacy',
    paid: 'paid',
    v2_go: 'v2_go',
    v2_stop: 'v2_stop',
    v3: 'v3',
    v3_paid: 'v3_paid'
};

var pending_action = {
    sub_price_drop: 'sub_price_drop',
    sub_out_of_stock: 'sub_out_of_stock'
};

var popup_widget_type = {
    push: 'push',
    sms: 'sms',
    success: 'success',
    success_sms: 'success'
};

var popup_priority_config = {
    sms: 'popup_sms',
    push: 'popup_push',
    sms_push: 'popup_sms_push',
    push_sms: 'popup_push_sms',
    floating_sms: 'floating_sms',
    floating_push: 'floating_push',
    floating_sms_push: 'floating_sms_push',
    floating_push_sms: 'floating_push_sms'
};

var sub_channel = {
    sms: 'sms',
    push: 'webpush',
    whatsapp: 'wa',
    all: 'all',
    either: 'either',
    none: 'none'
};

var widget_theme = {
    back_image: 'background',
    right_image: 'right',
    left_image: 'left',
    top_image: 'top'
};

var extras_imported_shop = 'imports';

var subscribe_popup_trigger = {
    floating_button: 'floating',
    marketing: 'marketing',
    automation: 'automation',
    floating_button_reopen: 'reopen'
};

var country_iso_phone_code = {
    "AF": "+93",
    "AL": "+355",
    "DZ": "+213",
    "AD": "+376",
    "AO": "+244",
    "AR": "+54",
    "AM": "+374",
    "AU": "+61",
    "AT": "+43",
    "AZ": "+994",
    "BS": "+1",
    "BH": "+973",
    "BD": "+880",
    "BB": "+1",
    "BY": "+375",
    "BE": "+32",
    "BZ": "+501",
    "BJ": "+229",
    "BT": "+975",
    "BO": "+591",
    "BA": "+387",
    "BW": "+267",
    "BR": "+55",
    "BN": "+673",
    "BG": "+359",
    "BF": "+226",
    "BI": "+257",
    "CV": "+238",
    "KH": "+855",
    "CM": "+237",
    "CA": "+1",
    "CF": "+236",
    "TD": "+235",
    "CL": "+56",
    "CN": "+86",
    "CO": "+57",
    "KM": "+269",
    "CD": "+243",
    "CG": "+242",
    "CR": "+506",
    "HR": "+385",
    "CU": "+53",
    "CY": "+357",
    "CZ": "+420",
    "DK": "+45",
    "DJ": "+253",
    "DM": "+1",
    "DO": "+1",
    "EC": "+593",
    "EG": "+20",
    "SV": "+503",
    "GQ": "+240",
    "ER": "+291",
    "EE": "+372",
    "SZ": "+268",
    "ET": "+251",
    "FJ": "+679",
    "FI": "+358",
    "FR": "+33",
    "GA": "+241",
    "GM": "+220",
    "GE": "+995",
    "DE": "+49",
    "GH": "+233",
    "GR": "+30",
    "GD": "+1",
    "GT": "+502",
    "GN": "+224",
    "GW": "+245",
    "GY": "+592",
    "HT": "+509",
    "HN": "+504",
    "HU": "+36",
    "IS": "+354",
    "IN": "+91",
    "ID": "+62",
    "IR": "+98",
    "IQ": "+964",
    "IE": "+353",
    "IL": "+972",
    "IT": "+39",
    "JM": "+1",
    "JP": "+81",
    "JO": "+962",
    "KZ": "+7",
    "KE": "+254",
    "KI": "+686",
    "KW": "+965",
    "KG": "+996",
    "LA": "+856",
    "LV": "+371",
    "LB": "+961",
    "LS": "+266",
    "LR": "+231",
    "LY": "+218",
    "LI": "+423",
    "LT": "+370",
    "LU": "+352",
    "MG": "+261",
    "MW": "+265",
    "MY": "+60",
    "MV": "+960",
    "ML": "+223",
    "MT": "+356",
    "MH": "+692",
    "MR": "+222",
    "MU": "+230",
    "MX": "+52",
    "FM": "+691",
    "MD": "+373",
    "MC": "+377",
    "MN": "+976",
    "ME": "+382",
    "MA": "+212",
    "MZ": "+258",
    "MM": "+95",
    "NA": "+264",
    "NR": "+674",
    "NP": "+977",
    "NL": "+31",
    "NZ": "+64",
    "NI": "+505",
    "NE": "+227",
    "NG": "+234",
    "KP": "+850",
    "MK": "+389",
    "NO": "+47",
    "OM": "+968",
    "PK": "+92",
    "PW": "+680",
    "PS": "+970",
    "PA": "+507",
    "PG": "+675",
    "PY": "+595",
    "PE": "+51",
    "PH": "+63",
    "PL": "+48",
    "PT": "+351",
    "QA": "+974",
    "RO": "+40",
    "RU": "+7",
    "RW": "+250",
    "KN": "+1",
    "LC": "+1",
    "VC": "+1",
    "WS": "+685",
    "SM": "+378",
    "ST": "+239",
    "SA": "+966",
    "SN": "+221",
    "RS": "+381",
    "SC": "+248",
    "SL": "+232",
    "SG": "+65",
    "SK": "+421",
    "SI": "+386",
    "SB": "+677",
    "SO": "+252",
    "ZA": "+27",
    "KR": "+82",
    "SS": "+211",
    "ES": "+34",
    "LK": "+94",
    "SD": "+249",
    "SR": "+597",
    "SE": "+46",
    "CH": "+41",
    "SY": "+963",
    "TW": "+886",
    "TJ": "+992",
    "TZ": "+255",
    "TH": "+66",
    "TL": "+670",
    "TG": "+228",
    "TO": "+676",
    "TT": "+1",
    "TN": "+216",
    "TR": "+90",
    "TM": "+993",
    "TV": "+688",
    "UG": "+256",
    "UA": "+380",
    "AE": "+971",
    "GB": "+44",
    "US": "+1",
    "UY": "+598",
    "UZ": "+998",
    "VU": "+678",
    "VA": "+379",
    "VE": "+58",
    "VN": "+84",
    "YE": "+967",
    "ZM": "+260",
    "ZW": "+263",
    "AS": "+1",
    "AI": "+1",
    "AG": "+1",
    "AW": "+297",
    "BM": "+1",
    "IO": "+246",
    "VG": "+1",
    "KY": "+1",
    "CK": "+682",
    "FK": "+500",
    "FO": "+298",
    "GF": "+594",
    "PF": "+689",
    "GI": "+350",
    "GL": "+299",
    "GP": "+590",
    "GU": "+1",
    "HK": "+852",
    "CI": "+225",
    "XK": "+383",
    "MO": "+853",
    "MQ": "+596",
    "YT": "+262",
    "MS": "+1",
    "AN": "+599",
    "NC": "+687",
    "NU": "+683",
    "NF": "+672",
    "MP": "+1",
    "PR": "+1",
    "RE": "+262",
    "SH": "+290",
    "PM": "+508",
    "TK": "+690",
    "TC": "+1",
    "WF": "+681"
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __spm_env; });
var __spm_env = 'prod';

var config = {};

config['dev'] = {
    config_env: 'dev',
    web_push: {
        vapid_key: 'BIDXN1Q2bXJYLK_iCQA5zvPAlJXrm-gTjxfm5M2l5D_BUJ4UD65Yfo33zeZgvgAMIWV2FQ-H2sjXroybCYGbIKk'
    },
    urls: {
        subscriber: 'https://spmbeta.hexjerry.com/spm_save_subscriber',
        link_subscriber: 'https://spmbeta.hexjerry.com/spm_link_subscriber',
        update_stats: 'https://spmbeta.hexjerry.com/spm_update_stats',
        static: 'https://cdn2.hexjerry.com/js',
        server: '//127.0.0.1:8000/',
        cdn_url: 'http://127.0.0.1:8000/static/',
        load_app_config: 'http://127.0.0.1:8000/spm_load_config',
        insert_liquid: 'http://127.0.0.1:8000/spm_insert_liquid',
        spm_save_device_cart_token: '//127.0.0.1:8000/spm_save_device_cart_token',
        unsubscribe: 'https://spmbeta.hexjerry.com/spm_cancel_subscriber',
        save_subscriber_checkout_sms: 'https://spmbeta.hexjerry.com/save_subscriber_checkout_sms',
        new_subscriber: 'https://spmbeta.hexjerry.com/spm_save_new_subscriber',
        subscriber_automation_signup: 'https://spmbeta.hexjerry.com/spm_save_automation_signup'
    },
    static_url: 'https://s3.amazonaws.com/shopifyspmbeta',
    service_worker_url: '/a/a/ht-hard-worker-sw.js?v=32'
};

config['staging'] = {
    config_env: 'staging',
    web_push: {
        vapid_key: 'BIDXN1Q2bXJYLK_iCQA5zvPAlJXrm-gTjxfm5M2l5D_BUJ4UD65Yfo33zeZgvgAMIWV2FQ-H2sjXroybCYGbIKk'
    },
    urls: {
        subscriber: 'https://spmbeta.hexjerry.com/spm_save_subscriber',
        link_subscriber: 'https://spmbeta.hexjerry.com/spm_link_subscriber',
        update_stats: 'https://spmbeta.hexjerry.com/spm_update_stats',
        static: 'https://cdn2.hexjerry.com/js',
        server: 'https://spmbeta.hexjerry.com/',
        cdn_url: 'https://cdn2.hexjerry.com/',
        load_app_config: 'https://spmbeta.hexjerry.com/spm_load_config',
        insert_liquid: 'https://spmbeta.hexjerry.com/spm_insert_liquid',
        spm_save_device_cart_token: 'https://spmbeta.hexjerry.com/spm_save_device_cart_token',
        unsubscribe: 'https://spmbeta.hexjerry.com/spm_cancel_subscriber',
        save_subscriber_checkout_sms: 'https://spmbeta.hexjerry.com/save_subscriber_checkout_sms',
        new_subscriber: 'https://spmbeta.hexjerry.com/spm_save_new_subscriber',
        subscriber_automation_signup: 'https://spmbeta.hexjerry.com/spm_save_automation_signup'
    },
    static_url: 'https://s3.amazonaws.com/shopifyspmbeta',
    service_worker_url: '/a/a/ht-hard-worker-sw.js?v=32'
};

config['prod'] = {
    config_env: 'prod',
    web_push: {
        vapid_key: 'BIDXN1Q2bXJYLK_iCQA5zvPAlJXrm-gTjxfm5M2l5D_BUJ4UD65Yfo33zeZgvgAMIWV2FQ-H2sjXroybCYGbIKk'
    },
    urls: {
        subscriber: 'https://spm.hextom.com/spm_save_subscriber',
        link_subscriber: 'https://spm.hextom.com/spm_link_subscriber',
        update_stats: 'https://spm.hextom.com/spm_update_stats',
        static: 'https://cdn2.hextom.com/js',
        server: 'https://spm.hextom.com/',
        cdn_url: 'https://cdn2.hextom.com/',
        load_app_config: 'https://spm.hextom.com/spm_load_config',
        insert_liquid: 'https://spm.hextom.com/spm_insert_liquid',
        spm_save_device_cart_token: 'https://spm.hextom.com/spm_save_device_cart_token',
        unsubscribe: 'https://spm.hextom.com/spm_cancel_subscriber',
        save_subscriber_checkout_sms: 'https://spm.hextom.com/save_subscriber_checkout_sms',
        new_subscriber: 'https://spm.hextom.com/spm_save_new_subscriber',
        subscriber_automation_signup: 'https://spm.hextom.com/spm_save_automation_signup'
    },
    static_url: 'https://s3.amazonaws.com/shopifyspmprod',
    service_worker_url: '/apps/ht_spm/ht-hard-worker-sw.js?v=32'
};

/* harmony default export */ __webpack_exports__["b"] = (config[__spm_env]);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export inject_spm_css */
/* unused harmony export get_shop_domain */
/* unused harmony export url_b64_to_uint8_array */
/* unused harmony export is_numeric */
/* unused harmony export generate_device_id */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return get_now_in_seconds; });
/* unused harmony export get_url_parameter */
/* unused harmony export page_is_home_page */
/* unused harmony export page_is_cart_page */
/* unused harmony export page_is_product_page */
/* unused harmony export is_remove_branding_plan */
/* unused harmony export get_image_url */
/* unused harmony export get_customer_id */
/* unused harmony export get_subscribe_out_of_stock_btn */
/* unused harmony export get_backup_subscribe_out_of_stock_widget */
/* unused harmony export get_subscribe_price_drop_widget */
/* unused harmony export get_subscribe_shipping_btn */
/* unused harmony export get_variant_from_url */
/* unused harmony export get_variant_id */
/* unused harmony export get_product_id */
/* unused harmony export get_product_price */
/* unused harmony export get_spm_atc_id */
/* unused harmony export parse_product_stock */
/* unused harmony export support_push */
/* unused harmony export is_ios_device */
/* unused harmony export is_ios_standalone */
/* unused harmony export show_ios_prompt_widget */
/* unused harmony export new_discount_code_applied */
/* unused harmony export parse_subscription */
/* unused harmony export is_valid_webpush_plan_func */
/* harmony export (immutable) */ __webpack_exports__["c"] = is_mobile_browser;
/* unused harmony export is_google_chrome */
/* unused harmony export is_edge_browser */
/* unused harmony export get_current_browser */
/* unused harmony export get_customer_info */
/* unused harmony export get_product_stock */
/* unused harmony export is_imported_shop */
/* unused harmony export get_shop_locale */
/* unused harmony export get_thankyou_page_phone_number */
/* harmony export (immutable) */ __webpack_exports__["d"] = is_undefined_or_null;
/* harmony export (immutable) */ __webpack_exports__["b"] = is_empty;
/* unused harmony export is_valid_phone_number */
/* unused harmony export clean_phone_number */
/* unused harmony export get_popup_priority_case */
/* unused harmony export get_floating_priority_case */
/* unused harmony export parse_priority_config_to_array */
/* unused harmony export popup_type_to_sub_channel */
/* unused harmony export get_popup_theme */
/* unused harmony export check_cart_value_threshold */
/* unused harmony export convert_hex_to_filter */
/* unused harmony export load_font_from_app_config */
/* unused harmony export load_selected_font */
/* unused harmony export valid_subscription_sig */
/* unused harmony export get_valid_sub_channel */
/* unused harmony export timeout_promise */
/* unused harmony export get_browser_meta_info */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return spm_logger; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid_v4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_uuid_v4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_query_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ua_parser_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ua_parser_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ua_parser_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_parse_domain__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_parse_domain___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_parse_domain__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_axios__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__price_drop_widget__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__backup_back_in_stock_widget__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__storage__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__unblock_modal__ = __webpack_require__(63);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }















// import {get_back_in_stock_text} from "./translater";

/**
 * inject spm css to webpage
 */
function get_spm_widget_style() {
    var container_width = '56px';
    var title_size = '20px';

    if (is_mobile_browser()) {
        container_width = '56px';
        title_size = '16px';
    }

    // opacity: 0;
    var __hextom_spm_header_style = '\n    .hextom__spm__widget {\n      position: fixed;\n      bottom: 100px;\n      right: 0%;\n      width: ' + container_width + ';\n      height: 58px;\n      overflow: hidden;\n      contain: content;\n      border-radius: 6px;\n      box-shadow: rgba(0, 0, 0, 0.22) 0px 0px 22px 0px;\n      z-index: 999999999;\n      pointer-events: none;\n      opacity: 0;\n    }\n    .hextom__spm__widget:hover {\n      cursor:pointer;\n    }\n    .spm__wrapper__bell {\n      width: 56px;\n    }\n    .hextom__spm__widget__contents {\n      width:100%;\n      contain: content;\n      display: flex;\n      flex-direction: column;\n      opacity: 0;\n    }\n    .hextom__spm__widget__toggle {\n      text-align: left;\n      padding: 0;\n      margin: 0;\n      margin-top: 8px;\n      border: none;\n      background: none;\n      cursor: pointer;\n      width: 100%;\n      outline: 0;\n    }\n    .hextom__spm__widget__title {\n      padding: 0;\n      margin: 0;\n      font-size: ' + title_size + ';\n      font-weight: 400;\n      font-family: -apple-system, \'BlinkMacSystemFont\', \'San Francisco\', \'Roboto\', \'Segoe UI\', \'Helvetica Neue\', sans-serif;\n      -webkit-font-smoothing: antialiased;\n      display: inline-block;\n      padding-top: 4px;\n      padding-left: 20px;\n      padding-right: 20px;\n    }\n    .hextom__spm__widget__title_expand{\n      flex:1;\n    }\n    .hextom__spm__widget__shrink {\n      height: 100%;\n      width: 15px;\n      display: \'flex\';\n      justifyContent: \'center\';\n      alignItems: \'center\';\n    }\n    .hextom__spm__widget__detail {\n      position: relative;\n      font-family: -apple-system, \'BlinkMacSystemFont\', \'San Francisco\', \'Roboto\', \'Segoe UI\', \'Helvetica Neue\', sans-serif;\n      -webkit-font-smoothing: antialiased;\n      padding-bottom: 20px;\n      list-style: none;\n      margin: 0;\n    }\n    .hextom__spm__widget__detail:hover {\n        cursor: default !important;\n    }\n    .hextom__spm__widget__items {\n      position: relative;\n      list-style: none;\n      padding: 0;\n      margin: 0;\n      background: #FFF;\n      z-index: 1;\n    }\n    .hextom__spm__widget__item {\n      padding: 8px 12px;\n      border-top: 1px solid #DDD;\n    }\n    .hextom__spm__widget--active {\n      opacity: 1 !important;\n      pointer-events: auto;\n    }\n    .hextom__spm__widget--expanded {\n      animation-name: hextomSpmWidgetExpandAnimation;\n    }\n    .hextom__spm__widget__contents--expanded {\n      animation-name: hextomSpmWidgetExpandContentsAnimation;\n    }\n    .hextom__spm__widget--collapsed {\n      animation-name: hextomSpmWidgetCollapseAnimation;\n    }\n    .hextom__spm__widget__contents--collapsed {\n      animation-name: hextomSpmWidgetCollapseContentsAnimation;\n    }\n    #sms_subscription_dom_wrapper:focus-within {\n      border-color: var(--sms-button-background-color, black) !important;\n    }\n    #sms_subscription_country_dom:focus{\n      border-color: var(--sms-button-background-color, black) !important;\n    }\n    input#sms_subscription_dom::placeholder {\n      color: darkgray !important;\n    }\n    input[type=number]::-webkit-inner-spin-button, \n    input[type=number]::-webkit-outer-spin-button { \n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n        margin: 0; \n    }\n  ';

    return __hextom_spm_header_style;
}

var inject_spm_css = function inject_spm_css(app_context) {
    var sms_button_background = 'black';
    if (!is_empty(app_context.shop_config) && !is_empty(app_context.shop_config.widget) && !is_empty(app_context.shop_config.widget.sms_button_color)) {
        sms_button_background = app_context.shop_config.widget.sms_button_color;
    }

    var hxt_spm_animation = '\n  .hxt__spm-ht-animation {\n    animation-duration: 4s;\n    animation-fill-mode: both;\n    animation-delay: 1s;\n    animation-iteration-count: infinite;\n  }\n  \n  .hxt__spm-ht-bounce {\n    animation-name: hxt-spm-animation-bounce;\n    transform-origin: center bottom;\n  }\n  \n  \n  @keyframes hxt-spm-animation-bounce {\n    13%, 20%, 25%, 5%, from, to {\n      animation-timing-function: cubic-bezier(.215, .61, .355, 1);\n      transform: translate3d(0, 0, 0)\n    }\n    10%, 12% {\n      animation-timing-function: cubic-bezier(.755, .05, .855, .06);\n      transform: translate3d(0, -30px, 0)\n    }\n    17% {\n      animation-timing-function: cubic-bezier(.755, .05, .855, .06);\n      transform: translate3d(0, -15px, 0)\n    }\n    23% {\n      transform: translate3d(0, -4px, 0)\n    }\n  }\n  \n  .hxt__spm-ht-emitting {\n    animation-name: hxt-spm-animation-emitting;\n    transform-origin: center bottom;\n  }\n  \n  @keyframes hxt-spm-animation-emitting {\n    13% {\n      box-shadow: 0 0 5px 5px var(--emitting-color)\n    }\n    100%, 25% {\n      box-shadow: 0 0 0 0 var(--emitting-color)\n    }\n  }\n  \n  .hxt__spm-ht-flash {\n    animation-name: hxt-spm-animation-flash;\n  }\n  \n  @keyframes hxt-spm-animation-flash {\n    12%, 6%, from, to {\n      opacity: 1\n    }\n    3%, 9% {\n      opacity: 0\n    }\n  }\n  \n  .hxt__spm-ht-flip {\n    animation-name: hxt-spm-animation-flip;\n    backface-visibility: visible;\n  }\n  \n  \n  @keyframes hxt-spm-animation-flip {\n    from {\n      transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n      animation-timing-function: ease-out\n    }\n    5% {\n      transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n      animation-timing-function: ease-out\n    }\n    6% {\n      transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n      animation-timing-function: ease-in\n    }\n    10% {\n      transform: perspective(400px) scale3d(.95, .95, .95);\n      animation-timing-function: ease-in\n    }\n    12%, to {\n      transform: perspective(400px);\n      animation-timing-function: ease-in\n    }\n  }\n  \n  \n  .hxt__spm-ht-jello {\n    animation-name: hxt-spm-animation-jello;\n    transform-origin: center;\n  }\n  \n  \n  @keyframes hxt-spm-animation-jello {\n    5.6%, 50%, from, to {\n      transform: translate3d(0, 0, 0)\n    }\n    11.1% {\n      transform: skewX(-12.5deg) skewY(-12.5deg)\n    }\n    16.6% {\n      transform: skewX(6.25deg) skewY(6.25deg)\n    }\n    22.2% {\n      transform: skewX(-3.125deg) skewY(-3.125deg)\n    }\n    27.7% {\n      transform: skewX(1.5625deg) skewY(1.5625deg)\n    }\n    33.3% {\n      transform: skewX(-.78125deg) skewY(-.78125deg)\n    }\n    38.8% {\n      transform: skewX(.390625deg) skewY(.390625deg)\n    }\n    44.4% {\n      transform: skewX(-.1953125deg) skewY(-.1953125deg)\n    }\n  }\n  \n  \n  .hxt__spm-ht-band {\n    animation-name: hxt-spm-animation-rubber-band;\n  }\n  \n  \n  @keyframes hxt-spm-animation-rubber-band {\n    25%, from, to {\n      transform: scale3d(1, 1, 1)\n    }\n    7% {\n      transform: scale3d(1.25, .75, 1)\n    }\n    10% {\n      transform: scale3d(.75, 1.25, 1)\n    }\n    12% {\n      transform: scale3d(1.15, .85, 1)\n    }\n    16% {\n      transform: scale3d(.95, 1.05, 1)\n    }\n    18% {\n      transform: scale3d(1.05, .95, 1)\n    }\n  }\n  \n  \n  .hxt__spm-ht-swing {\n    animation-name: hxt-spm-animation-swing;\n    transform-origin: top center;\n  }\n  \n  \n  @keyframes hxt-spm-animation-swing {\n    5% {\n      transform: rotate3d(0, 0, 1, 15deg)\n    }\n    10% {\n      transform: rotate3d(0, 0, 1, -10deg)\n    }\n    15% {\n      transform: rotate3d(0, 0, 1, 5deg)\n    }\n    20% {\n      transform: rotate3d(0, 0, 1, -5deg)\n    }\n    25%, to {\n      transform: rotate3d(0, 0, 1, 0deg)\n    }\n  }\n  \n  \n  .hxt__spm-ht-tada {\n    animation-name: hxt-spm-animation-tada;\n  }\n  \n  \n  @keyframes hxt-spm-animation-tada {\n    25%, from, to {\n      transform: scale3d(1, 1, 1)\n    }\n    2%, 5% {\n      transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)\n    }\n    12%, 17%, 22%, 7% {\n      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)\n    }\n    10%, 15%, 20% {\n      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)\n    }\n  }\n  \n  .hxt__spm-ht-wobble {\n    animation-name: hxt-spm-animation-wobble;\n  }\n  \n  \n  @keyframes hxt-spm-animation-wobble {\n    25%, from, to {\n      transform: translate3d(0, 0, 0)\n    }\n    3% {\n      transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)\n    }\n    7% {\n      transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)\n    }\n    11% {\n      transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)\n    }\n    15% {\n      transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)\n    }\n    18% {\n      transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)\n    }\n  }\n\n  .hxt__spm-ht-pulse {\n    animation-name: hxt-spm-animation-pulse;\n    box-shadow: 0 0 0 0 rgba(var(--vimotia-play-button-theme-color-rgb), 0.5);\n  }\n  \n  @keyframes hxt-spm-animation-pulse {\n    0% {\n      transform: scale(0.9);\n    }\n  \n    70% {\n      transform: scale(1);\n      box-shadow: 0 0 0 50px rgba(var(--vimotia-play-button-theme-color-rgb), 0);\n    }\n  \n    100% {\n      transform: scale(0.9);\n      box-shadow: 0 0 0 0 rgba(var(--vimotia-play-button-theme-color-rgb), 0);\n    }\n  }\n  \n  .hxt__spm-ht-shine {\n    animation-name: hxt-spm-animation-shine;\n  }\n  \n  @keyframes hxt-spm-animation-shine {\n  \n    0% {\n      filter: drop-shadow(0px 0px 10px var(--vimotia-play-button-theme-color));\n    }\n  \n    25% {\n      filter: drop-shadow(0px 0px 0px var(--vimotia-play-button-theme-color));\n    }\n  \n    100% {\n      filter: drop-shadow(0px 0px 0px var(--vimotia-play-button-theme-color));\n    }\n  }\n  ';
    var hxt_spm_widget_style = get_spm_widget_style();
    var inject_css_style = '\n    :root{\n       --sms-button-background-color:' + sms_button_background + ';\n   }\n   \n' + hxt_spm_animation + '\n\n' + hxt_spm_widget_style + '\n\n.hxt_popup_form_placeholder::placeholder { color: lightgrey; } .hxt_popup_form_submit:hover { opacity: .75; } .hxt_popup_form_submit:focus { opacity: .75; }\n     .hxt-spm-modal-in {\n        animation: hxtSpmFadeIn 0.5s, hxtSpmSlideIn 0.5s linear;\n     }\n     .hxt-spm-modal-out {\n         animation: hxtSpmFadeOut 0.5s, hxtSpmSlideOut 0.5s linear;\n     }\n     .hxt-spm-modal-in-mobile {\n        animation: hxtSpmSlideIn 0.5s linear;\n     }\n     .hxt-spm-modal-out-mobile {\n         animation: hxtSpmSlideOut 0.5s linear;\n     }\n     .hxt-spm-floating-button-in {\n        animation: hxtSpmFadeIn 0.3s linear;\n     }\n     .hxt-spm-floating-button-out {\n        animation: hxtSpmFadeOut 0.3s linear;\n     }\n     .hxt-spm-clickable:hover {\n        cursor:pointer;\n     }\n     @keyframes hxtSpmSlideOut {\n       0% {\n         transform: translateY(0px);\n         animation-timing-function: ease-out;\n       }\n       100% {\n         transform: translateY(550px);\n         animation-timing-function: ease-out;\n       }\n     }\n     @keyframes hxtSpmSlideIn {\n       0% {\n         transform: translateY(500px);\n         animation-timing-function: ease-out;\n       }\n       100% {\n         transform: translateY(0px);\n         animation-timing-function: ease-out;\n       }\n     }\n     @keyframes hxtSpmFadeIn {\n       0% {\n         opacity: 0;\n       }\n       100% {\n         opacity: 1;\n       }\n     }\n     @keyframes hxtSpmFadeOut {\n       100% {\n         opacity: 0;\n       }\n       0% {\n         opacity: 1;\n       }\n     }\n';
    var com_hxt_spm_style_sheet = '' + inject_css_style;
    var com_hxt_spm_style_dom = document.createElement('style');
    com_hxt_spm_style_dom.appendChild(document.createTextNode(com_hxt_spm_style_sheet));
    document.head.appendChild(com_hxt_spm_style_dom);
};

var get_shop_domain = function get_shop_domain(filename) {
    var shop_domain = '';

    // try get from on-page data
    if (_typeof(window.Shopify) === 'object' && window.Shopify.hasOwnProperty('shop')) {
        shop_domain = window.Shopify.shop;
    }

    // try get the domain from SPM script
    if (!shop_domain) {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {

            if (scripts[i].src.indexOf(filename) > -1) {
                shop_domain = scripts[i].src.substring(scripts[i].src.indexOf('shop=') + 5, scripts[i].src.length);
            }

            if (shop_domain) break;
        }
    }

    if (!shop_domain) {
        shop_domain = document.domain;
    }

    return shop_domain;
};

// from https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js#L31
var url_b64_to_uint8_array = function url_b64_to_uint8_array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var generate_device_id = function generate_device_id() {
    // const str = `${config.auth}_${config.p256dh}_${Date.now()}`;
    // return uuidv3('smartpushmarketing.hextom.com', uuidv3.DNS);
    return __WEBPACK_IMPORTED_MODULE_0_uuid_v4___default()();
};

var get_now_in_seconds = function get_now_in_seconds() {
    return parseInt(Date.now() / 1000, 10);
};

var get_url_parameter = function get_url_parameter() {

    var params = {
        platform: 'push'
    };

    var urlParams = new URLSearchParams(window.location.search);

    var _get_or_default = function _get_or_default(urlParams, paramName, defaultValue) {
        var _val = urlParams.get(paramName);
        if (is_undefined_or_null(_val)) {
            return defaultValue;
        }

        return _val;
    };

    var platform = _get_or_default(urlParams, 'platform', __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push);
    var device_id = _get_or_default(urlParams, 'device_id', '');
    var has_discount = _get_or_default(urlParams, 'has_discount', false);
    var signup_id = _get_or_default(urlParams, 'signup_id', '');
    var expiry_seconds = _get_or_default(urlParams, 'expiry_seconds', 0);
    var campaign_id = _get_or_default(urlParams, 'campaign_id', '');

    if (!is_undefined_or_null(platform)) {
        params.platform = platform;
    }

    params = Object.assign({}, params, {
        platform: platform,
        device_id: device_id,
        has_discount: has_discount,
        signup_id: signup_id,
        expiry_seconds: expiry_seconds,
        campaign_id: campaign_id
    });

    return params;
};

var page_is_home_page = function page_is_home_page() {
    return window.location.pathname === '/';
};

// pathname includes /cart
var page_is_cart_page = function page_is_cart_page() {
    return window.location.pathname.indexOf('/cart') > -1;
};

var page_is_product_page = function page_is_product_page() {
    var product_id = get_product_id();

    if (typeof product_id === 'undefined' || product_id === null || product_id === '') {

        return false;
    }

    // if we have a product id then we are in product page
    return true;
};

var is_remove_branding_plan = function is_remove_branding_plan(shop_plan) {
    var is_free_plan = shop_plan !== __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].paid && shop_plan !== __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v2_go && shop_plan !== __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v2_stop && shop_plan !== __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v3_paid;

    return !is_free_plan;
};

var get_image_url = function get_image_url(image_url) {
    if (is_empty(image_url)) {
        return '';
    }

    return '' + __WEBPACK_IMPORTED_MODULE_4__config__["b" /* default */].urls.cdn_url + image_url;
};

var get_customer_id = function get_customer_id() {
    var customer_id = undefined;
    if (window.meta && window.meta.page && window.meta.page.customerId) {
        customer_id = window.meta.page.customerId;
    }

    return customer_id;
};

function get_subscribe_out_of_stock_btn(title, cb) {
    var wrapper = document.createElement('div');
    var btn = document.createElement('button');
    var btn_class_list = 'btn product-form__cart-submit button button--full-width';
    try {
        var shop_theme_id = window.Shopify.theme.id;
        // for shop pro-edge-paintball.myshopify.com
        if ('' + shop_theme_id === '160419840274') {
            btn_class_list = 'product-form--atc-button ' + btn_class_list;
        }
    } catch (e) {}
    btn.className = btn_class_list;
    btn.id = 'spm_subscribe_out_of_stock';
    btn.innerHTML = title;
    btn.onclick = cb;
    // btn.style.cssText = 'margin-top: 10px; transition: opacity 1s ease-in-out';
    btn.style.cssText = 'margin-top: 10px; opacity: 1;';
    // btn.onclick = (e) => {
    //     e.preventDefault();
    //     spm_logger.info('click out of stock')
    // };

    wrapper.appendChild(btn);
    return wrapper;
}

function get_backup_subscribe_out_of_stock_widget(app_context, cb) {
    spm_logger.info('creating back in stock widget');
    spm_logger.info(app_context);
    var widget = new __WEBPACK_IMPORTED_MODULE_7__backup_back_in_stock_widget__["a" /* default */](app_context, cb);
    return widget;
}

function get_subscribe_price_drop_widget(app_context) {
    var on_subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    return new __WEBPACK_IMPORTED_MODULE_6__price_drop_widget__["a" /* default */](app_context.price_drop_widget_config, app_context.shop_plan, function (e) {
        e.preventDefault();
        if (!app_context.automation_enabled(__WEBPACK_IMPORTED_MODULE_8__constants__["d" /* subscribe_case */].price_drop_alert)) {
            return;
        }

        var variant_id = get_variant_id(true);
        if (app_context.block_notification) {
            // save pending action
            __WEBPACK_IMPORTED_MODULE_9__storage__["d" /* set_pending_price_drop_action */](app_context.shop_domain, {
                action_type: __WEBPACK_IMPORTED_MODULE_8__constants__["a" /* pending_action */].sub_price_drop,
                variant_id: variant_id
            });

            __WEBPACK_IMPORTED_MODULE_10__unblock_modal__["a" /* show_unblock_modal */](get_current_browser(), app_context.shop_plan);
            return;
        }

        on_subscribe(variant_id);
    });
}

function get_subscribe_shipping_btn(title, cb) {
    var btn = document.createElement('button');
    btn.className = 'step__footer__continue-btn btn button';
    btn.id = 'spm_subscribe_shipping';
    btn.innerHTML = title;
    btn.onclick = cb;
    // btn.onclick = (e) => {
    //     e.preventDefault();
    //     spm_logger.info('click out of stock')
    // };
    return btn;
}

var get_variant_from_url = function get_variant_from_url() {
    if (!window.location || !window.location.search) {
        return undefined;
    }

    var url_info = __WEBPACK_IMPORTED_MODULE_1_query_string___default.a.parse(window.location.search);

    if (!url_info.variant) {
        return undefined;
    }

    return url_info.variant;
};

var get_variant_id = function get_variant_id(exclude_inventory_policy) {

    if (window.__debug_spm) {
        return '123';
    }

    var variant = get_variant_from_url();

    // check if we have injected code
    if (!variant) {
        if (window.hextom_spm && window.hextom_spm.p1 && window.hextom_spm.p1.length > 0) {
            variant = window.hextom_spm.p1[0].v5;
        }
    }

    if (variant && !exclude_inventory_policy) {
        if (window.hextom_spm && window.hextom_spm.p1 && window.hextom_spm.p1.length > 0) {
            // find the right p1
            var p1 = window.hextom_spm.p1;
            var i = 0;
            for (; i < p1.length; i++) {
                if ('' + p1[i].v5 === variant) {
                    if (p1[i].v3 !== 'deny') {
                        variant = undefined;
                    }
                    break;
                }
            }
        }
    }

    return variant;
};

var get_product_id = function get_product_id() {
    var product_id = void 0;
    if (window.hextom_spm) {
        if (window.hextom_spm.p1 && window.hextom_spm.p1.length > 0) {
            product_id = window.hextom_spm.p1[0].v6;
        }
    }

    if (product_id === 'null') {
        return null;
    }

    return product_id;
};

var get_product_price = function get_product_price(variant_id) {
    if (window.hextom_spm && window.hextom_spm.p1 && window.hextom_spm.p1.length > 0) {
        // find the right p1
        var p1 = window.hextom_spm.p1;
        var i = 0;
        for (; i < p1.length; i++) {
            if ('' + p1[i].v5 === variant_id) {
                return p1[i].v7;
            }
        }
    }

    return undefined;
};

var get_spm_atc_id = function get_spm_atc_id() {
    if (!window.location || !window.location.search) {
        return undefined;
    }

    var url_info = __WEBPACK_IMPORTED_MODULE_1_query_string___default.a.parse(window.location.search);

    if (!url_info['SPM-ATC']) {
        return undefined;
    }

    return url_info['SPM-ATC'];
};

var parse_product_stock = function parse_product_stock(stock_str) {
    var elems = stock_str.split(',');
    try {
        var stock = parseInt(elems[0], 10) * 7 + parseInt(elems[1], 10);
        return stock;
    } catch (e) {
        return -1;
    }
};

var support_push = function support_push() {
    var browser_support = 'serviceWorker' in navigator && 'PushManager' in window;

    // for ios we display a different prompt for user to add the app to their home page
    // if(is_ios) {
    //     // Check if "standalone" property exists
    //     if (("standalone" in window.navigator) && window.navigator.standalone) {
    //         return browser_support;
    //     }
    // }

    return browser_support || is_ios_device();
};

var is_ios_device = function is_ios_device() {
    var is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    return is_ios;
    // return true;
};

var is_ios_standalone = function is_ios_standalone() {
    if ("standalone" in window.navigator && window.navigator.standalone) {
        return true;
    }

    return false;
};

var show_ios_prompt_widget = function show_ios_prompt_widget() {
    return is_ios_device() && !is_ios_standalone();
};

function new_discount_code_applied() {
    spm_logger.info('checking discount code');
    // check if we have a discount code in cookie
    var new_discount_code = document.cookie.replace(/(?:(?:^|.*;\s*)discount_code\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // eslint-disable-line no-useless-escape
    spm_logger.info('new discount code: ' + new_discount_code);

    // no new discount code in cookie
    if (!new_discount_code) {
        return false;
    }

    var applied_discount_code = document.cookie.replace(/(?:(?:^|.*;\s*)com_hextom_smartpushmarketing_applied_discount_code\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // eslint-disable-line no-useless-escape
    spm_logger.info('new discount code: ' + applied_discount_code);

    // store new discount code to spm cookie
    document.cookie = 'com_hextom_smartpushmarketing_applied_discount_code=' + new_discount_code;

    // no previous discount code exist or a new discount code is applied
    if (!applied_discount_code || applied_discount_code !== new_discount_code) {
        return true;
    }

    return false;
}

function parse_subscription(subscription) {
    if (is_undefined_or_null(subscription)) {
        return {
            endpoint: '',
            p256dh: '',
            auth: '',
            expiration_time: 0
        };
    }
    var subStr = JSON.stringify(subscription);
    var subJson = JSON.parse(subStr);
    var keys = subJson.keys;

    keys = keys ? keys : {};

    var expiration_time = subJson.expirationTime ? subJson.expirationTime : '';
    if (expiration_time !== '' && is_numeric(expiration_time)) {
        expiration_time = parseInt(expiration_time / 1000, 10);
    }

    return {
        endpoint: subscription.endpoint,
        p256dh: keys.p256dh ? keys.p256dh : '',
        auth: keys.auth ? keys.auth : '',
        expiration_time: expiration_time
    };
}

var is_valid_webpush_plan_func = function is_valid_webpush_plan_func(shop_plan, shop_domain) {
    var FreePassPlans = [__WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].free_go, __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].legacy, __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].paid, __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v2_go, __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v3, __WEBPACK_IMPORTED_MODULE_8__constants__["b" /* shop_plans */].v3_paid];

    // if free_go, legacy or paid we move forward
    if (FreePassPlans.indexOf(shop_plan) > -1) {
        return true;
    }

    spm_logger.info('in free stop or v2 stop plan');
    spm_logger.info('get sig ' + shop_domain);

    // we need to check to see if this device has already subscribed
    if (__WEBPACK_IMPORTED_MODULE_9__storage__["a" /* get_is_subscribed */](shop_domain)) {
        spm_logger.info('user is subscribed before stop');
        return true;
    }

    spm_logger.info('not valid shop plan');
    return false;
};

function is_mobile_browser() {
    var uaParser = __WEBPACK_IMPORTED_MODULE_2_ua_parser_js___default()(navigator.userAgent);

    // desktop will return undefined for this one
    if (!uaParser.device.type) {
        return false;
    }

    return true;
}

function is_google_chrome() {
    return navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(function (b) {
        return b.brand === 'Google Chrome';
    });
}

// from this post https://stackoverflow.com/questions/31721250/how-to-target-edge-browser-with-javascript
function is_edge_browser() {
    var is_edge = window.navigator.userAgent.indexOf("Edge/") > -1;
    var is_chromium_edge = window.navigator.userAgent.indexOf("Edg/") > -1;

    var agent_lower_case = window.navigator.userAgent.toLowerCase();
    var is_new_window_edge = agent_lower_case.indexOf("windows") > -1 && agent_lower_case.indexOf("safari") > -1 ? true : false;

    return is_edge || is_chromium_edge || is_new_window_edge;
}

function get_current_browser() {
    var uaParser = __WEBPACK_IMPORTED_MODULE_2_ua_parser_js___default()(navigator.userAgent);

    // desktop will return undefined for this one
    if (!uaParser.device.type) {
        if (uaParser.browser.name === 'Firefox') {
            return 'firefox';
        }
        return 'chrome';
    }

    return 'mobile';
}

function get_customer_info() {
    try {
        if (window.hextom_spm) {
            // we have stock info for this product
            if (window.hextom_spm.p2 && window.hextom_spm.p2.length > 0) {
                var customer_id = window.hextom_spm.p2.v6;

                return {
                    customer_id: customer_id
                };
            }
        }
    } catch (e) {
        return undefined;
    }

    return undefined;
}

function get_product_stock() {
    try {
        if (window.hextom_spm) {
            // we have stock info for this product
            if (window.hextom_spm.p1 && window.hextom_spm.p1.length > 0) {
                var url_variant = get_variant_from_url();
                var p1 = window.hextom_spm.p1;
                var stock_str = void 0;
                spm_logger.info('gps variant: ' + url_variant);
                var i = 0;
                for (; i < p1.length; i++) {
                    if (p1[i].v2 !== "") {
                        // if we are tracking inventory using some sort of system. e.g shopify or oberlo
                        // if variant shows up in url, we find the match
                        if (url_variant) {
                            if ('' + p1[i].v5 === url_variant) {
                                if (p1[i].v3 === 'deny') {
                                    stock_str = p1[i].v1;
                                }
                                break;
                            }
                        } else {
                            // if variant not showing up in url, we find the first one with stock
                            // everything is out of stock, then we return out of stock
                            if (p1[i].v1 !== '0,0') {
                                if (p1[i].v3 === 'deny') {
                                    stock_str = p1[i].v1;
                                    break;
                                }
                            } else if (p1[i].v1 === '0,0') {
                                if (p1[i].v3 === 'deny') {
                                    stock_str = p1[i].v1;
                                }
                            }
                        }
                    }
                }

                spm_logger.info('stock str 1: ' + stock_str);
                if (!stock_str) {
                    return undefined;
                }

                spm_logger.info('stock str 2: ' + stock_str);
                return parse_product_stock(stock_str);
            }
        }
    } catch (e) {
        spm_logger.info(e);
        return undefined;
    }

    return undefined;
}

function is_imported_shop(config) {
    if (config.vapid_public_key && config.vapid_public_key !== '') {
        spm_logger.info('shop is imported');
        return true;
    }

    spm_logger.info('shop is NOT imported');
    return false;
}

function get_shop_locale() {
    var pathname = window.location.pathname;
    var hostname = window.location.hostname;
    var locale_string = null;
    // we dont have any path variables, try find locale in domain
    if (pathname === '/' || pathname === '') {
        // get rid of myshopify.com if necessary
        if (hostname.indexOf('.myshopify.com') > -1) {
            var hostnames = hostname.split('.');
            if (hostnames.length > 3) {
                locale_string = hostnames[hostnames.length - 4]; // xx.shopname.myshopify.com
            }
        } else {
            var domain_info = __WEBPACK_IMPORTED_MODULE_3_parse_domain___default()(hostname);
            var subdomain = domain_info.subdomain;
            // more than 1 subdomain
            if (subdomain.indexOf('.') > -1) {
                var subdomains = subdomain.split('.');
                // check if any of the subdomains is a locale string
                var i = subdomains.length - 1;
                for (; i > -1; i--) {
                    if (is_locale_string(subdomains[i])) {
                        locale_string = subdomains[i];
                        break;
                    }
                }
            } else {
                locale_string = subdomain;
            }
        }

        if (is_locale_string(locale_string)) {
            return window.location.protocol + '//' + hostname;
        }
    } else {
        var pathnames = pathname.split('/');
        if (is_locale_string(pathnames[0])) {
            return window.location.protocol + '//' + hostname + '/' + pathnames[0];
        }
    }

    return null;
}

function get_thankyou_page_phone_number() {
    var customer_phone = Shopify.checkout.phone; // eslint-disable-line no-undef

    if (is_undefined_or_null(customer_phone)) {
        // customer_phone = Shopify.checkout.billing_address.phone;

        // if(is_undefined_or_null(customer_phone)) {
        return undefined;
        // }
    }

    return customer_phone;
}

function is_undefined_or_null(obj) {
    return typeof obj === 'undefined' || obj === null;
}

function is_empty(obj) {
    return is_undefined_or_null(obj) || '' + obj === '';
}

function is_valid_phone_number(phone_number) {
    var valid_number = true;
    valid_number = !is_empty(phone_number);

    var cleaned_phone = ('' + phone_number).replace(/\D/g, '');

    // most number should be at least 10 digits long
    if (cleaned_phone.length < 10) {
        valid_number = false;
    }

    // if (valid_number) {
    //     let us_phone_pattern = /^(1|)?(\d{3})(\d{3})(\d{4})$/;
    //     valid_number = cleaned_phone.match(us_phone_pattern);
    // }

    return valid_number;
}

function clean_phone_number(phone_number) {
    var cleaned_phone = ('' + phone_number).replace(/\D/g, '');

    // if(cleaned_phone.length === 10) {
    //     return `+1${cleaned_phone}`;
    // }

    // remove starting +
    if (cleaned_phone.startsWith('+')) {
        return ('' + cleaned_phone).replace('+', '');
    }

    return cleaned_phone;
}

function get_popup_priority_case(config) {
    if (config.widget !== '') {
        return config.widget.type;
    }
    return '';
}

function get_floating_priority_case(config) {
    // floating button is not shown if we have popup widget configured with a floating button
    if (config.widget !== '' && config.widget.floating_button) {
        return '';
    }

    if (config.floating_widget_config !== '') {
        return config.floating_widget_config.type;
    }

    return '';
}

function parse_priority_config_to_array(config) {
    var supported_channels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // no widget config, we only support push in this case
    if (config === '') {
        if (supported_channels.includes(__WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push)) {
            return [__WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push];
        }

        return [];
    }

    var case_string = config.replace('floating_', '');
    case_string = case_string.replace('popup_', '');

    var channel_array = [];
    var result_array = [];
    if (case_string.includes("_")) {
        var case_elements = case_string.split('_');
        channel_array = [].concat(_toConsumableArray(case_elements));
    } else {
        channel_array = [case_string];
    }

    channel_array.forEach(function (c) {
        if (supported_channels.includes(c)) {
            result_array.push(c);
        }
    });

    return result_array;
}

function popup_type_to_sub_channel(popup_type) {
    if (popup_type === 'sms') {
        return __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].sms;
    }

    return __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push;
}

function get_popup_theme(config) {
    if (config.widget) {
        return config.widget.image_position;
    }

    return config.image_position ? config.image_position : '';
}

function check_cart_value_threshold(config) {
    var on_cart_value_reach = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    // ignore empty ocnfig
    if (config === '' || is_undefined_or_null(config.id)) {
        return;
    }

    if (Number(config.cart_value) === 0 || '' + config.trigger !== 'cart_value') {
        on_cart_value_reach();
        return;
    }

    __WEBPACK_IMPORTED_MODULE_5_axios___default.a.get('/cart.json').then(function (r) {
        // check if cart is empty or not
        var total_price = r.data.total_price;
        var total_price_in_dollar = Number(total_price) / 100;

        if (total_price_in_dollar >= Number(config.cart_value)) {
            on_cart_value_reach();
        } else {
            setTimeout(function () {
                check_cart_value_threshold(config, on_cart_value_reach);
            }, 2500);
        }
    });
}

function convert_hex_to_filter(hex_string) {
    var rgb = hexToRgb(hex_string);
    if (rgb.length !== 3) {
        return '';
    }

    var color = new Color(rgb[0], rgb[1], rgb[2]);
    var solver = new Solver(color);
    var result = solver.solve();

    return result.filter;
}

var Color = function () {
    function Color(r, g, b) {
        _classCallCheck(this, Color);

        this.set(r, g, b);
    }

    _createClass(Color, [{
        key: 'toString',
        value: function toString() {
            return 'rgb(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ')';
        }
    }, {
        key: 'set',
        value: function set(r, g, b) {
            this.r = this.clamp(r);
            this.g = this.clamp(g);
            this.b = this.clamp(b);
        }
    }, {
        key: 'hueRotate',
        value: function hueRotate() {
            var angle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            angle = angle / 180 * Math.PI;
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);

            this.multiply([0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928, 0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283, 0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072]);
        }
    }, {
        key: 'grayscale',
        value: function grayscale() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.multiply([0.2126 + 0.7874 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0.2126 - 0.2126 * (1 - value), 0.7152 + 0.2848 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0.2126 - 0.2126 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 + 0.9278 * (1 - value)]);
        }
    }, {
        key: 'sepia',
        value: function sepia() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.multiply([0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)]);
        }
    }, {
        key: 'saturate',
        value: function saturate() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.multiply([0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value]);
        }
    }, {
        key: 'multiply',
        value: function multiply(matrix) {
            var newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
            var newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
            var newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
            this.r = newR;
            this.g = newG;
            this.b = newB;
        }
    }, {
        key: 'brightness',
        value: function brightness() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.linear(value);
        }
    }, {
        key: 'contrast',
        value: function contrast() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.linear(value, -(0.5 * value) + 0.5);
        }
    }, {
        key: 'linear',
        value: function linear() {
            var slope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var intercept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            this.r = this.clamp(this.r * slope + intercept * 255);
            this.g = this.clamp(this.g * slope + intercept * 255);
            this.b = this.clamp(this.b * slope + intercept * 255);
        }
    }, {
        key: 'invert',
        value: function invert() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
            this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
            this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
        }
    }, {
        key: 'hsl',
        value: function hsl() {
            // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
            var r = this.r / 255;
            var g = this.g / 255;
            var b = this.b / 255;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var h = void 0,
                s = void 0,
                l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;

                    case g:
                        h = (b - r) / d + 2;
                        break;

                    case b:
                        h = (r - g) / d + 4;
                        break;

                    default:
                        break;
                }
                h /= 6;
            }

            return {
                h: h * 100,
                s: s * 100,
                l: l * 100
            };
        }
    }, {
        key: 'clamp',
        value: function clamp(value) {
            if (value > 255) {
                value = 255;
            } else if (value < 0) {
                value = 0;
            }
            return value;
        }
    }]);

    return Color;
}();

var Solver = function () {
    function Solver(target, baseColor) {
        _classCallCheck(this, Solver);

        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = new Color(0, 0, 0);
    }

    _createClass(Solver, [{
        key: 'solve',
        value: function solve() {
            var result = this.solveNarrow(this.solveWide());
            return {
                values: result.values,
                loss: result.loss,
                filter: this.css(result.values)
            };
        }
    }, {
        key: 'solveWide',
        value: function solveWide() {
            var A = 5;
            var c = 15;
            var a = [60, 180, 18000, 600, 1.2, 1.2];

            var best = { loss: Infinity };
            for (var i = 0; best.loss > 25 && i < 3; i++) {
                var initial = [50, 20, 3750, 50, 100, 100];
                var result = this.spsa(A, a, c, initial, 1000);
                if (result.loss < best.loss) {
                    best = result;
                }
            }
            return best;
        }
    }, {
        key: 'solveNarrow',
        value: function solveNarrow(wide) {
            var A = wide.loss;
            var c = 2;
            var A1 = A + 1;
            var a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
            return this.spsa(A, a, c, wide.values, 500);
        }
    }, {
        key: 'spsa',
        value: function spsa(A, a, c, values, iters) {
            var alpha = 1;
            var gamma = 0.16666666666666666;

            var best = null;
            var bestLoss = Infinity;
            var deltas = new Array(6);
            var highArgs = new Array(6);
            var lowArgs = new Array(6);

            for (var k = 0; k < iters; k++) {
                var ck = c / Math.pow(k + 1, gamma);
                for (var i = 0; i < 6; i++) {
                    deltas[i] = Math.random() > 0.5 ? 1 : -1;
                    highArgs[i] = values[i] + ck * deltas[i];
                    lowArgs[i] = values[i] - ck * deltas[i];
                }

                var lossDiff = this.loss(highArgs) - this.loss(lowArgs);
                for (var _i = 0; _i < 6; _i++) {
                    var g = lossDiff / (2 * ck) * deltas[_i];
                    var ak = a[_i] / Math.pow(A + k + 1, alpha);
                    values[_i] = fix(values[_i] - ak * g, _i);
                }

                var loss = this.loss(values);
                if (loss < bestLoss) {
                    best = values.slice(0);
                    bestLoss = loss;
                }
            }
            return { values: best, loss: bestLoss };

            function fix(value, idx) {
                var max = 100;
                if (idx === 2 /* saturate */) {
                        max = 7500;
                    } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
                        max = 200;
                    }

                if (idx === 3 /* hue-rotate */) {
                        if (value > max) {
                            value %= max;
                        } else if (value < 0) {
                            value = max + value % max;
                        }
                    } else if (value < 0) {
                    value = 0;
                } else if (value > max) {
                    value = max;
                }
                return value;
            }
        }
    }, {
        key: 'loss',
        value: function loss(filters) {
            // Argument is array of percentages.
            var color = this.reusedColor;
            color.set(0, 0, 0);

            color.invert(filters[0] / 100);
            color.sepia(filters[1] / 100);
            color.saturate(filters[2] / 100);
            color.hueRotate(filters[3] * 3.6);
            color.brightness(filters[4] / 100);
            color.contrast(filters[5] / 100);

            var colorHSL = color.hsl();
            return Math.abs(color.r - this.target.r) + Math.abs(color.g - this.target.g) + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.h - this.targetHSL.h) + Math.abs(colorHSL.s - this.targetHSL.s) + Math.abs(colorHSL.l - this.targetHSL.l);
        }
    }, {
        key: 'css',
        value: function css(filters) {
            function fmt(idx) {
                var multiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                return Math.round(filters[idx] * multiplier);
            }
            return 'filter: invert(' + fmt(0) + '%) sepia(' + fmt(1) + '%) saturate(' + fmt(2) + '%) hue-rotate(' + fmt(3, 3.6) + 'deg) brightness(' + fmt(4) + '%) contrast(' + fmt(5) + '%);';
        }
    }]);

    return Solver;
}();

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

function is_locale_string(str) {
    if (typeof str === 'undefined' || str === null || str === '') {

        return false;
    }

    if (str.length !== 2 && str.length !== 5) {
        return false;
    }

    if (str.length === 5 && str.indexOf('-') !== 2) {
        return false;
    }

    return true;
}

function load_font_from_app_config(app_config) {
    var font_list = [];
    var update_font_list = function update_font_list(_font_name) {
        if (font_list.indexOf(_font_name) < 0 && !is_empty(_font_name)) {
            font_list.push(_font_name);
        }
    };

    if (app_config.widget !== '') {
        update_font_list(app_config.widget.floating_button_text_font);
        update_font_list(app_config.widget.confirmation_text_font_style);
        update_font_list(app_config.widget.confirmation_description_font_style);
        update_font_list(app_config.widget.confirmation_button_text_font_style);

        update_font_list(app_config.widget.title_1_font_style);
        update_font_list(app_config.widget.title_2_font_style);
        update_font_list(app_config.widget.button_text_font_style);

        update_font_list(app_config.widget.sms_text_title_font_style);
        update_font_list(app_config.widget.sms_text_description_font_style);
        update_font_list(app_config.widget.sms_button_text_font_style);
    }

    if (app_config.price_drop_alert_widget !== '') {
        if (app_config.price_drop_alert_widget.widget_font_style !== 'inherit') {
            update_font_list(app_config.price_drop_alert_widget.widget_font_style);
        }
    }

    if (app_config.floating_widget_config !== '') {
        update_font_list(app_config.floating_widget_config.floating_button_text_font);
    }

    font_list.forEach(function (font_entry) {
        load_selected_font(font_entry);
    });
}

function load_selected_font(fontName) {
    if (is_undefined_or_null(fontName)) {
        return;
    }

    if (fontName === 'inherit') {
        return;
    }

    var link = document.createElement('link');
    link.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + fontName.replace(/ /g, '+'));
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.async = 'true';
    link.onload = function () {
        var rs = link.readyState;
        if (rs && rs !== 'complete' && rs !== 'loaded') return;
        // const body = document.querySelector('body');
        // toggleClass(body, 'usb-selected-font-loaded', true);
    };
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(link, head.firstChild);
}

function valid_subscription_sig(sub_info, shop_domain) {
    var expiration_time = sub_info.expiration_time;
    // subscription expired
    if (!is_undefined_or_null(expiration_time) && !is_empty(expiration_time) && is_numeric(expiration_time)) {
        var now = Date.now() / 1000;

        if (now - 20 > expiration_time) {
            return false;
        }
    }

    var sub_sig = __WEBPACK_IMPORTED_MODULE_9__storage__["c" /* get_subscribe_sig */](shop_domain);
    if (sub_info !== undefined && sub_sig !== undefined) {
        var curr_sig = window.btoa(sub_info.auth + '_' + sub_info.p256dh + '_' + sub_info.endpoint);
        if (curr_sig !== sub_sig) {
            spm_logger.info('sub info not matching, not valid');
            return false;
        } else if (curr_sig === sub_sig) {
            spm_logger.info('sub info matched');
            return true;
        }
    }

    return true;
}

var get_valid_sub_channel = function get_valid_sub_channel(app_context) {
    var sub_push = __WEBPACK_IMPORTED_MODULE_9__storage__["a" /* get_is_subscribed */](app_context.shop_domain, __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push);
    var sub_sms = __WEBPACK_IMPORTED_MODULE_9__storage__["a" /* get_is_subscribed */](app_context.shop_domain, __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].sms);

    var sub_channel = __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].either;

    if (sub_push && sub_sms) {
        sub_channel = __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].all;
    } else if (sub_push) {
        sub_channel = __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].push;
    } else if (sub_sms) {
        sub_channel = __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].sms;
    } else {
        sub_channel = __WEBPACK_IMPORTED_MODULE_8__constants__["c" /* sub_channel */].none;
    }

    return sub_channel;
};

var timeout_promise = function timeout_promise() {
    var my_func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var delay = arguments[1];

    return new Promise(function (resolve, _) {
        if (is_undefined_or_null(delay)) {
            setTimeout(function () {
                my_func();
                resolve();
            });
        } else {
            setTimeout(function () {
                my_func();
                resolve();
            }, delay);
        }
    });
};

var get_browser_meta_info = function get_browser_meta_info() {
    var date = new Date();
    var timezone = (date.getTimezoneOffset() / 60).toFixed(2);
    var uaParser = __WEBPACK_IMPORTED_MODULE_2_ua_parser_js___default()(navigator.userAgent);
    var viewport = window.innerWidth + '*' + window.innerHeight;

    var browser = uaParser.browser.name;
    if (uaParser.os && uaParser.os.name && uaParser.os.name === 'Android') {
        if (uaParser.browser && uaParser.browser.name && uaParser.browser.name === 'Chrome') {
            // check if userAgent contain edga
            if (navigator.userAgent && navigator.userAgent.toLowerCase && navigator.userAgent.toLowerCase().indexOf('edga') > -1) {
                browser = 'Edge';
            }
        }
    }

    return {
        browser: browser,
        viewport: viewport,
        timezone: timezone,
        device_os: uaParser.os.name
    };
};

var __spm_g_d_f = __WEBPACK_IMPORTED_MODULE_9__storage__["b" /* get_spm_debug_enabled */]();

var spm_logger = {
    info: function () {
        // if (__spm_env !== 'prod' && window.__spm_g_d_f){
        if (__spm_g_d_f) {
            var log_fun = Function.prototype.bind.call(console.log, console, '[SPM]');
            return log_fun;
        }

        return function () {};
    }(),

    log: function log() {
        if (__spm_g_d_f) {
            var log_fun = Function.prototype.bind.call(console.log, console, '');
            return log_fun;
        }

        return function () {};
    },

    error: function () {
        // if (__spm_env !== 'prod'){
        if (__spm_g_d_f) {
            var log_fun = Function.prototype.bind.call(console.error, console, '');
            return log_fun;
        }

        return function () {};
    }(),

    // error: (msg) => {
    //     if (__spm_env !== 'prod'){
    //         console.error(msg);
    //     }
    // },

    log_to_storage: function log_to_storage(msg) {
        // if (__spm_env !== 'prod') {
        try {
            if (__spm_g_d_f) {
                if (typeof Storage !== "undefined" && window.localStorage) {
                    window.localStorage.setItem('com_hextom_smartpushmarketing_log_last_entry', msg);
                }
            }
        } catch (e) {}
    },

    sw_log: function sw_log(msg) {
        // service worker logger
        // if (__spm_env !== 'prod'){
        // if (__spm_env !== 'prod') {
        try {
            if (__WEBPACK_IMPORTED_MODULE_4__config__["a" /* __spm_env */] !== 'prod') {
                if (msg && typeof msg.indexOf === 'function' && msg.indexOf('[SPM') < 0) {
                    msg = '[SPM Worker] ' + msg;
                }
                console.log(msg);
            }
            console.log(msg);
        } catch (e) {}
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(44);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(10);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(10);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(18);

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._75 = 0;
  this._83 = 0;
  this._18 = null;
  this._38 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._47 = null;
Promise._71 = null;
Promise._44 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._83 === 3) {
    self = self._18;
  }
  if (Promise._47) {
    Promise._47(self);
  }
  if (self._83 === 0) {
    if (self._75 === 0) {
      self._75 = 1;
      self._38 = deferred;
      return;
    }
    if (self._75 === 1) {
      self._75 = 2;
      self._38 = [self._38, deferred];
      return;
    }
    self._38.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._83 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._83 === 1) {
        resolve(deferred.promise, self._18);
      } else {
        reject(deferred.promise, self._18);
      }
      return;
    }
    var ret = tryCallOne(cb, self._18);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._83 = 3;
      self._18 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._83 = 1;
  self._18 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._83 = 2;
  self._18 = newValue;
  if (Promise._71) {
    Promise._71(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._75 === 1) {
    handle(self, self._38);
    self._38 = null;
  }
  if (self._75 === 2) {
    for (var i = 0; i < self._38.length; i++) {
      handle(self, self._38[i]);
    }
    self._38 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var characters = __webpack_require__(8);

var _require = __webpack_require__(33),
    createNode = _require.createNode,
    createOrGetChild = _require.createOrGetChild; // Parsing is complex... :)
// eslint-disable-next-line complexity


function parse(serialized) {
  var rootNode = createNode();
  var domain = "";
  var parentNode = rootNode;
  var node;

  function addDomain() {
    node = createOrGetChild(parentNode, domain);
    domain = "";
  }

  for (var i = 0; i < serialized.length; i++) {
    var _char = serialized.charAt(i);

    switch (_char) {
      case characters.SAME:
        {
          addDomain();
          continue;
        }

      case characters.DOWN:
        {
          addDomain();
          parentNode = node;
          continue;
        }

      case characters.RESET:
        {
          addDomain();
          parentNode = rootNode;
          continue;
        }

      case characters.UP:
        {
          addDomain();
          parentNode = parentNode.parent;
          continue;
        }
    }

    domain += _char;
  }

  if (domain !== "") {
    addDomain();
  }

  return rootNode;
}

module.exports = parse;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  UP: "<",
  // one level up
  SAME: ",",
  // same level
  DOWN: ">",
  // one level down
  RESET: "|",
  // reset level index and start new
  WILDCARD: "*",
  // as defined by publicsuffix.org
  EXCEPTION: "!" // as defined by publicsuffix.org

};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var settle = __webpack_require__(45);
var buildURL = __webpack_require__(47);
var parseHeaders = __webpack_require__(48);
var isURLSameOrigin = __webpack_require__(49);
var createError = __webpack_require__(11);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(50);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(51);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(46);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

// Defaults

var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};

var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};

var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];

// Caching

var cache = {
  CSS: {},
  springs: {}
};

// Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) { return Array.isArray(a); },
  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
  svg: function (a) { return a instanceof SVGElement; },
  inp: function (a) { return a instanceof HTMLInputElement; },
  dom: function (a) { return a.nodeType || is.svg(a); },
  str: function (a) { return typeof a === 'string'; },
  fnc: function (a) { return typeof a === 'function'; },
  und: function (a) { return typeof a === 'undefined'; },
  nil: function (a) { return is.und(a) || a === null; },
  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
  rgb: function (a) { return /^rgb/.test(a); },
  hsl: function (a) { return /^hsl/.test(a); },
  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },
};

// Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
}

// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js

function spring(string, duration) {

  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? (duration * t) / 1000 : t;
    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }
    if (t === 0 || t === 1) { return t; }
    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];
    if (cached) { return cached; }
    var frame = 1/6;
    var elapsed = 0;
    var rest = 0;
    while(true) {
      elapsed += frame;
      if (solver(elapsed) === 1) {
        rest++;
        if (rest >= 16) { break; }
      } else {
        rest = 0;
      }
    }
    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;

}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

function steps(steps) {
  if ( steps === void 0 ) steps = 10;

  return function (t) { return Math.ceil((minMax(t, 0.000001, 1)) * steps) * (1 / steps); };
}

// BezierEasing https://github.com/gre/bezier-easing

var bezier = (function () {

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
  function C(aA1)      { return 3.0 * aA1 }

  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }
    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {

      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }

    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) { return x; }
      if (x === 0 || x === 1) { return x; }
      return calcBezier(getTForX(x), mY1, mY2);
    }

  }

  return bezier;

})();

var penner = (function () {

  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = { linear: function () { return function (t) { return t; }; } };

  var functionEasings = {
    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
    Bounce: function () { return function (t) {
      var pow2, b = 4;
      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
    }; },
    Elastic: function (amplitude, period) {
      if ( amplitude === void 0 ) amplitude = 1;
      if ( period === void 0 ) period = .5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return (t === 0 || t === 1) ? t : 
          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
      }
    }
  };

  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
  });

  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;
    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases['easeOutIn' + name] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });

  return eases;

})();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) { return easing; }
  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);
  switch (name) {
    case 'spring' : return spring(easing, duration);
    case 'cubicBezier' : return applyArguments(bezier, args);
    case 'steps' : return applyArguments(steps, args);
    default : return applyArguments(ease, args);
  }
}

// Strings

function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch(e) {
    return;
  }
}

// Arrays

function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }
  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
}

function toArray(o) {
  if (is.arr(o)) { return o; }
  if (is.str(o)) { o = selectString(o) || o; }
  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }
  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) { return a === val; });
}

// Objects

function cloneObject(o) {
  var clone = {};
  for (var p in o) { clone[p] = o[p]; }
  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }
  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }
  return o;
}

// Colors

function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? ("rgba(" + (rgb[1]) + ",1)") : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return ("rgba(" + r + "," + g + "," + b + ",1)");
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;
  function hue2rgb(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
  }
  var r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return ("rgba(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + "," + a + ")");
}

function colorToRgb(val) {
  if (is.rgb(val)) { return rgbToRgba(val); }
  if (is.hex(val)) { return hexToRgba(val); }
  if (is.hsl(val)) { return hslToRgba(val); }
}

// Units

function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  if (split) { return split[1]; }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }
}

// Values

function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) { return val; }
  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);
  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }
  var cached = cache.CSS[value + unit];
  if (!is.und(cached)) { return cached; }
  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || (is.svg(el) && el[prop]))) { return 'attribute'; }
  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }
  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }
  if (el[prop] != null) { return 'object'; }
}

function getElementTransforms(el) {
  if (!is.dom(el)) { return; }
  var str = el.style.transform || '';
  var reg  = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;
  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }
  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform': return getTransformValue(target, propName, animatable, unit);
    case 'css': return getCSSValue(target, propName, unit);
    case 'attribute': return getAttribute(target, propName);
    default: return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);
  if (!operator) { return to; }
  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) { return colorToRgb(val); }
  if (/\s/g.test(val)) { return val; }
  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) { return unitLess + unit; }
  return unitLess;
}

// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);
}

function getLineLength(el) {
  return getDistance(
    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, 
    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}
  );
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;
  for (var i = 0 ; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);
    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }
    previousPos = currentPos;
  }
  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
}

// Path animation

function getTotalLength(el) {
  if (el.getTotalLength) { return el.getTotalLength(); }
  switch(el.tagName.toLowerCase()) {
    case 'circle': return getCircleLength(el);
    case 'rect': return getRectLength(el);
    case 'line': return getLineLength(el);
    case 'polyline': return getPolylineLength(el);
    case 'polygon': return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
}

// Motion path

function getParentSvgEl(el) {
  var parentEl = el.parentNode;
  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) { break; }
    parentEl = parentEl.parentNode;
  }
  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  }
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function(property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    }
  }
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if ( offset === void 0 ) offset = 0;

    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }
  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;
  switch (path.property) {
    case 'x': return (p.x - svg.x) * scaleX;
    case 'y': return (p.y - svg.y) * scaleY;
    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
}

// Decompose value

function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: (is.str(val) || unit) ? value.split(rgx) : []
  }
}

// Animatables

function parseTargets(targets) {
  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
  });
}

// Properties

function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings);
  // Override duration if easing is a spring
  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }
  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = (l === 2 && !is.obj(prop[0]));
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {value: prop};
    }
  }
  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};
    // Default delay value should only be applied to the first tween
    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }
    // Default endDelay value should only be applied to the last tween
    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }
    return obj;
  }).map(function (k) { return mergeObjects(k, settings); });
}


function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })
  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
  var properties = {};
  var loop = function ( i ) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};
      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) { newKey.value = key[p]; }
        } else {
          newKey[p] = key[p];
        }
      }
      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop( i );
  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;
  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }
  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }
  return properties;
}

// Tweens

function normalizeTweenValues(tween, animatable) {
  var t = {};
  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);
    if (is.arr(value)) {
      value = value.map(function (v) { return getFunctionValue(v, animatable); });
      if (value.length === 1) { value = value[0]; }
    }
    t[p] = value;
  }
  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;
    if (is.und(to)) { to = previousValue; }
    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) { tween.round = 1; }
    previousTween = tween;
    return tween;
  });
}

// Tween progress

var setProgressValue = {
  css: function (t, p, v) { return t.style[p] = v; },
  attribute: function (t, p, v) { return t.setAttribute(p, v); },
  object: function (t, p, v) { return t[p] = v; },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) { str += prop + "(" + value + ") "; });
      t.style.transform = str;
    }
  }
};

// Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
}

// Animations

function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);
  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    }
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) { return !is.und(a); });
}

// Create Instance

function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;
  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };
  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
}

// Core

var activeInstances = [];

var engine = (function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }
  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;
    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];
      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }
    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) { return; }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else { // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(
        function (instance) { return instance ._onDocumentVisibility(); }
      );
      engine();
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
})();

function isDocumentHidden() {
  return !!document && document.hidden;
}

// Public Instance

function anime(params) {
  if ( params === void 0 ) params = {};


  var startTime = 0, lastTime = 0, now = 0;
  var children, childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;
    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }
    instance.reversed = !instance.reversed;
    children.forEach(function (child) { return child.reversed = instance.reversed; });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) { child.seek(time - child.timelineOffset); }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }
    } else {
      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;
    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength];
      // Only check for keyframes if there is more than one tween
      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }
      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = (void 0);
      for (var n = 0; n < toNumbersLength; n++) {
        var value = (void 0);
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;
        if (!tween.isPath) {
          value = fromNumber + (eased * (toNumber - fromNumber));
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }
        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }
        numbers.push(value);
      }
      // Manual Array.reduce for better performances
      var stringsLength = strings.length;
      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];
        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];
          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }
      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) { syncInstanceChildren(insTime); }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }
      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }
    instance.currentTime = minMax(insTime, 0, insDuration);
    if (instance.began) { setCallback('update'); }
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remaining) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');
          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;
        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function() {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (var i = childrenLength; i--;) { instance.children[i].reset(); }
    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  };

  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
  instance._onDocumentVisibility = resetTime;

  // Set Value helper

  instance.set = function(targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function(t) {
    now = t;
    if (!startTime) { startTime = now; }
    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function() {
    instance.paused = true;
    resetTime();
  };

  instance.play = function() {
    if (!instance.paused) { return; }
    if (instance.completed) { instance.reset(); }
    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function() {
    instance.reset();
    instance.play();
  };

  instance.remove = function(targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) { instance.play(); }

  return instance;

}

// Remove targets from animation

function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);
  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }
  }
  if (!animations.length && !children.length) { instance.pause(); }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);
  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
}

// Stagger helpers

function stagger(val, params) {
  if ( params === void 0 ) params = {};

  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) { fromIndex = 0; }
    if (fromCenter) { fromIndex = (t - 1) / 2; }
    if (fromLast) { fromIndex = t - 1; }
    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;
          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;
          var toX = index%grid[0];
          var toY = Math.floor(index/grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === 'x') { value = -distanceX; }
          if (axis === 'y') { value = -distanceY; }
          values.push(value);
        }
        maxValue = Math.max.apply(Math, values);
      }
      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }
      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }
    }
    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;
  }
}

// Timeline

function timeline(params) {
  if ( params === void 0 ) params = {};

  var tl = anime(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;
    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }
    function passThrough(ins) { ins.passThrough = true; }
    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }
    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();
    if (tl.autoplay) { tl.play(); }
    return tl;
  };
  return tl;
}

anime.version = '3.2.1';
anime.speed = 1;
// TODO:#review: naming, documentation
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/* harmony default export */ __webpack_exports__["a"] = (anime);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
module.exports = __webpack_require__(22);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  __webpack_require__(17).enable();
  window.Promise = __webpack_require__(20);
}

// fetch() polyfill for making API calls.
__webpack_require__(21);

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = __webpack_require__(6);

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (false) {
  require('raf').polyfill(global);
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(5);

var DEFAULT_WHITELIST = [
  ReferenceError,
  TypeError,
  RangeError
];

var enabled = false;
exports.disable = disable;
function disable() {
  enabled = false;
  Promise._47 = null;
  Promise._71 = null;
}

exports.enable = enable;
function enable(options) {
  options = options || {};
  if (enabled) disable();
  enabled = true;
  var id = 0;
  var displayId = 0;
  var rejections = {};
  Promise._47 = function (promise) {
    if (
      promise._83 === 2 && // IS REJECTED
      rejections[promise._56]
    ) {
      if (rejections[promise._56].logged) {
        onHandled(promise._56);
      } else {
        clearTimeout(rejections[promise._56].timeout);
      }
      delete rejections[promise._56];
    }
  };
  Promise._71 = function (promise, err) {
    if (promise._75 === 0) { // not yet handled
      promise._56 = id++;
      rejections[promise._56] = {
        displayId: null,
        error: err,
        timeout: setTimeout(
          onUnhandled.bind(null, promise._56),
          // For reference errors and type errors, this almost always
          // means the programmer made a mistake, so log them after just
          // 100ms
          // otherwise, wait 2 seconds to see if they get handled
          matchWhitelist(err, DEFAULT_WHITELIST)
            ? 100
            : 2000
        ),
        logged: false
      };
    }
  };
  function onUnhandled(id) {
    if (
      options.allRejections ||
      matchWhitelist(
        rejections[id].error,
        options.whitelist || DEFAULT_WHITELIST
      )
    ) {
      rejections[id].displayId = displayId++;
      if (options.onUnhandled) {
        rejections[id].logged = true;
        options.onUnhandled(
          rejections[id].displayId,
          rejections[id].error
        );
      } else {
        rejections[id].logged = true;
        logError(
          rejections[id].displayId,
          rejections[id].error
        );
      }
    }
  }
  function onHandled(id) {
    if (rejections[id].logged) {
      if (options.onHandled) {
        options.onHandled(rejections[id].displayId, rejections[id].error);
      } else if (!rejections[id].onUnhandled) {
        console.warn(
          'Promise Rejection Handled (id: ' + rejections[id].displayId + '):'
        );
        console.warn(
          '  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id ' +
          rejections[id].displayId + '.'
        );
      }
    }
  }
}

function logError(id, error) {
  console.warn('Possible Unhandled Promise Rejection (id: ' + id + '):');
  var errStr = (error && (error.stack || error)) + '';
  errStr.split('\n').forEach(function (line) {
    console.warn('  ' + line);
  });
}

function matchWhitelist(error, list) {
  return list.some(function (cls) {
    return error instanceof cls;
  });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = __webpack_require__(5);

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._44);
  p._83 = 1;
  p._18 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._83 === 3) {
            val = val._18;
          }
          if (val._83 === 1) return res(i, val._18);
          if (val._83 === 2) reject(val._18);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__database__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(1);
/* eslint-env browser, serviceworker, es6 */


function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }








// {
//     "//": "Visual Options",
//     "body": "<String>",
//     "icon": "<URL String>",
//     "image": "<URL String>",
//     "badge": "<URL String>",
//     "vibrate": "<Array of Integers>",
//     "sound": "<URL String>",
//     "dir": "<String of 'auto' | 'ltr' | 'rtl'>",

//     "//": "Behavioural Options",
//     "tag": "<String>",
//     "data": "<Anything>",
//     "requireInteraction": "<boolean>",
//     "renotify": "<Boolean>",
//     "silent": "<Boolean>",

//     "//": "Both Visual & Behavioural Options",
//     "actions": "<Array of Strings>",

//     "//": "Information Option. No visual affect.",
//     "timestamp": "<Long>"
//   }

self.addEventListener("install", function (event) {
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('ht sw installed');
    // event.waitUntil(self.skipWaiting());
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(self.pushManager);
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('ht sw activate');
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('[Service Hard Worker] Push Received.');
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('[Service Hard Worker] Push had this data: "' + JSON.stringify(event) + '"');
    // spm_logger.sw_log(`[Service Hard Worker] Push had this data: "${event.data}"`);
    // spm_logger.sw_log(`[Service Hard Worker] Push had this data: "${event.data.json()}"`);
    // spm_logger.sw_log(event.data.json());
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('event data');
    var payload = event.data.json();

    // received message info is saved in format of '{channel}_{automation/campaign/widget id}'
    var sub_channel = __WEBPACK_IMPORTED_MODULE_3__constants__["c" /* sub_channel */].push;
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(payload);

    var title = payload.title,
        options = payload.options;

    var primary_link = options.primary_link,
        signup_id = options.signup_id,
        campaign_id = options.campaign_id,
        automation_id = options.automation_id,
        widget_id = options.widget_id,
        expiry_seconds = options.expiry_seconds,
        actions = options.actions,
        has_discount = options.has_discount,
        payloadOptions = _objectWithoutProperties(options, ['primary_link', 'signup_id', 'campaign_id', 'automation_id', 'widget_id', 'expiry_seconds', 'actions', 'has_discount']);

    var notificationActions = [];
    var data = {};

    if (primary_link) {
        data['primary_link'] = primary_link;
    }

    if (automation_id && automation_id !== '') {
        data['automation_id'] = automation_id;
        data['automation_expires_in'] = expiry_seconds; // in seconds
    }

    if (campaign_id && campaign_id !== '') {
        data['campaign_id'] = campaign_id;
        data['campaign_expires_in'] = expiry_seconds; // in seconds
    }

    if (signup_id) {
        data['signup_id'] = signup_id;
    }

    if (typeof widget_id !== 'undefined' && widget_id !== null) {
        data['widget_id'] = widget_id;
    }

    data['has_discount'] = has_discount;

    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('notify data: ' + JSON.stringify(data));

    if (actions) {
        actions.forEach(function (action) {
            var _action = action.action.toLowerCase().replace(/ /g, '-');
            var notificationAction = {
                action: _action,
                title: action.title,
                icon: action.icon
            };
            notificationActions.push(notificationAction);
            data[_action] = action.action;
        });
    }

    if (automation_id) {
        event.waitUntil(self.registration.showNotification(title, Object.assign({}, payloadOptions, {
            actions: notificationActions,
            data: data
        })).then(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["d" /* set_automation_id */])(sub_channel + '_' + automation_id);
        }).then(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["e" /* set_automation_signup_id */])(signup_id);
        }).then(function () {
            var now_in_seconds = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* get_now_in_seconds */])();
            var expire_time = now_in_seconds + expiry_seconds;
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["c" /* set_automation_expire_time */])(expire_time);
        }));
    } else if (campaign_id) {
        // campaign does not have signup id
        event.waitUntil(self.registration.showNotification(title, Object.assign({}, payloadOptions, {
            actions: notificationActions,
            data: data
        })).then(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["g" /* set_campaign_id */])(sub_channel + '_' + campaign_id);
        }).then(function () {
            var now_in_seconds = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* get_now_in_seconds */])();
            var expire_time = now_in_seconds + expiry_seconds;
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["f" /* set_campaign_expire_time */])(expire_time);
        }));
    } else if (widget_id) {
        // campaign does not have signup id
        event.waitUntil(self.registration.showNotification(title, Object.assign({}, payloadOptions, {
            actions: notificationActions,
            data: data
        })).then(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_1__database__["j" /* set_widget_id */])(sub_channel + '_' + widget_id);
        }));
    } else {
        event.waitUntil(self.registration.showNotification(title, Object.assign({}, payloadOptions, {
            actions: notificationActions,
            data: data
        })));
    }
    // TODO: should we renew the subscription upon receive the push notification
    // event.waitUntil(self.registration.showNotification(title,
    //     {
    //         ...payloadOptions,
    //         actions: notificationActions,
    //         data,
    //     }).then((e) => {
    //         return self.registration.pushManager.getSubscription();
    //     }).then((subscription) => {
    //         if(subscription !== null){
    //             const subStr = JSON.stringify(subscription);
    //             const subJson = JSON.parse(subStr);
    //             const subscriber = {
    //                 endpoint: subscription.endpoint,
    //                 p256dh: keys.p256dh ? keys.p256dh : '',
    //                 auth: keys.auth ? keys.auth : '',
    //                 expirationTime: subJson.expirationTime ? subJson.expirationTime : ''
    //             }
    //             return Database.get_device_id_with_subscription(subscriber);
    //         }
    //     }).then((subscriber) => {
    //         spm_logger.sw_log(`updating subscriber: ${subscriber}`);
    //         return axios.post(Config.urls.subscriber, {
    //             ...subscriber,
    //         });
    //     }).then(() => {
    //         spm_logger.sw_log('finish update subscription');
    //     })
    // );
});

self.addEventListener('notificationclick', function (event) {
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('[Service Worker] Notification click Received.');
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(event.notification.data);

    var link = "/";
    // TODO remove this dummy value
    var campaign_id = void 0;
    var automation_id = void 0;
    var signup_id = void 0;
    var widget_id = void 0;
    var has_discount = false;
    var data = event.notification.data;
    if (data) {
        link = data.primary_link;
        campaign_id = data.campaign_id;
        automation_id = data.automation_id;
        signup_id = data.signup_id;
        has_discount = data.has_discount;
        widget_id = data.widget_id;
        // const storeId = data.storeId;
        // fetch information
    }

    if (event.action) {
        var action_str = event.action;
        // get link based on clicked action
        if (data && data[action_str]) {
            link = data[action_str];
        }
    }

    event.notification.close();
    // notify server after click to open

    // TODO update campaign/automation click
    var _shop_domain = void 0;
    event.waitUntil(clients.openWindow(link).then(function () {
        return Object(__WEBPACK_IMPORTED_MODULE_1__database__["b" /* get_shop_domain */])();
    }).then(function (shop_domain) {
        _shop_domain = shop_domain;
        return Object(__WEBPACK_IMPORTED_MODULE_1__database__["a" /* get_device_id */])();
    }).then(function (device_id) {
        // send back click confirmation based on campaign id
        var payload = {
            device_id: device_id,
            click: true,
            shop: _shop_domain,
            sub_channel: __WEBPACK_IMPORTED_MODULE_3__constants__["c" /* sub_channel */].push
        };

        if (automation_id) {
            var _body = Object.assign({
                automation_id: automation_id,
                sub_channel: __WEBPACK_IMPORTED_MODULE_3__constants__["c" /* sub_channel */].push
            }, payload);
            if (signup_id) {
                _body.signup_id = signup_id;
            }
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('automation posting to ' + __WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats);
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(JSON.stringify(_body));
            return fetch(__WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(_body)
            });
        } else if (campaign_id) {
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('posting to ' + __WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats);
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(JSON.stringify(Object.assign({ campaign_id: campaign_id }, payload)));
            return fetch(__WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(Object.assign({ campaign_id: campaign_id }, payload))
            });
        } else if (typeof widget_id !== 'undefined' && widget_id !== null) {
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('posting to ' + __WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats);
            __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(JSON.stringify(Object.assign({ widget_id: widget_id }, payload)));
            return fetch(__WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(Object.assign({ widget_id: widget_id }, payload))
            });
        }
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('not posting to: ' + __WEBPACK_IMPORTED_MODULE_0__config__["b" /* default */].urls.update_stats);
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(JSON.stringify(payload));
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('automation_id: ' + automation_id);
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('campaign_id: ' + campaign_id);
        return;
    }).then(function (r) {
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('tracking click result');
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(r);

        return Object(__WEBPACK_IMPORTED_MODULE_1__database__["h" /* set_has_discount */])(has_discount);
    }).then(function (r) {
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('tracking rencent channel');
        __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log(r);

        return Object(__WEBPACK_IMPORTED_MODULE_1__database__["i" /* set_recent_click_channel */])(__WEBPACK_IMPORTED_MODULE_3__constants__["c" /* sub_channel */].push);
    }));
});

self.addEventListener('notificationclose', function (event) {
    // do something
    __WEBPACK_IMPORTED_MODULE_2__utils__["e" /* spm_logger */].sw_log('notification cloased');
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DEVICE_ID */
/* unused harmony export SHOP_DOMAIN */
/* unused harmony export CAMPAIGN_ID */
/* unused harmony export CAMPAIGN_EXPIRE_TIME */
/* unused harmony export AUTOMATION_ID */
/* unused harmony export AUTOMATION_EXPIRE_TIME */
/* unused harmony export AUTOMATION_SIGNUP_ID */
/* unused harmony export HAS_DISCOUNT */
/* unused harmony export WIDGET_ID */
/* unused harmony export RECENT_CLICK_CHANNEL */
/* unused harmony export clear_all_data */
/* unused harmony export clear_device_id */
/* unused harmony export clear_automation_id */
/* unused harmony export clear_campaign_id */
/* unused harmony export clear_expire_time */
/* unused harmony export clear_automation_expire_time */
/* unused harmony export clear_widget_id */
/* unused harmony export clear_signup_id */
/* unused harmony export clear_is_having_discount */
/* unused harmony export is_having_discount */
/* harmony export (immutable) */ __webpack_exports__["h"] = set_has_discount;
/* unused harmony export set_device_id */
/* harmony export (immutable) */ __webpack_exports__["a"] = get_device_id;
/* unused harmony export get_device_id_with_subscriber */
/* harmony export (immutable) */ __webpack_exports__["g"] = set_campaign_id;
/* unused harmony export get_campaign_id */
/* harmony export (immutable) */ __webpack_exports__["f"] = set_campaign_expire_time;
/* unused harmony export get_campaign_expire_time */
/* harmony export (immutable) */ __webpack_exports__["d"] = set_automation_id;
/* unused harmony export get_automation_id */
/* harmony export (immutable) */ __webpack_exports__["c"] = set_automation_expire_time;
/* unused harmony export get_automation_expire_time */
/* harmony export (immutable) */ __webpack_exports__["e"] = set_automation_signup_id;
/* unused harmony export get_automation_signup_id */
/* unused harmony export set_shop_domain */
/* harmony export (immutable) */ __webpack_exports__["b"] = get_shop_domain;
/* harmony export (immutable) */ __webpack_exports__["j"] = set_widget_id;
/* unused harmony export get_widget_id */
/* harmony export (immutable) */ __webpack_exports__["i"] = set_recent_click_channel;
/* unused harmony export get_recent_click_channel */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const APP_DB = 'com.hextom.smartpushmarketing.db';

var DEVICE_ID = 'com_hextom_smartpushmarketing_subscribers_device_id';
var SHOP_DOMAIN = 'com_hextom_smartpushmarketing_shop_domain';

var CAMPAIGN_ID = 'com_hextom_smartpushmarketing_notification_campaign_id';
var CAMPAIGN_EXPIRE_TIME = 'com_hextom_smartpushmarketing_notification_expire_time';

var AUTOMATION_ID = 'com_hextom_smartpushmarketing_subscribers_automation_id';
var AUTOMATION_EXPIRE_TIME = 'com_hextom_smartpushmarketing_subscribers_expire_time';

var AUTOMATION_SIGNUP_ID = 'com_hextom_smartpushmarketing_automation_signup_id';

var HAS_DISCOUNT = 'com_hextom_smartpushmarketing_has_discount';

var WIDGET_ID = 'com_hextom_smartpushmarketing_widget_id';

var RECENT_CLICK_CHANNEL = 'com_hextom_smartpushmarketing_recent_click_channel';

function clear_all_data() {
    return clear_automation_id().then(function () {
        return clear_campaign_id();
    }).then(function () {
        return clear_expire_time();
    }).then(function () {
        return clear_automation_expire_time();
    }).then(function () {
        return clear_widget_id();
    }).then(function () {
        return clear_signup_id();
    });
}

function clear_device_id() {
    return del(DEVICE_ID);
}

function clear_automation_id() {
    return del(AUTOMATION_ID);
}

function clear_campaign_id() {
    return del(CAMPAIGN_ID);
}

function clear_expire_time() {
    return del(CAMPAIGN_EXPIRE_TIME);
}

function clear_automation_expire_time() {
    return del(AUTOMATION_EXPIRE_TIME);
}

function clear_widget_id() {
    return del(WIDGET_ID);
}

function clear_signup_id() {
    return del(AUTOMATION_SIGNUP_ID);
}

function clear_is_having_discount() {
    return del(HAS_DISCOUNT);
}

function is_having_discount() {
    return get(HAS_DISCOUNT);
}

function set_has_discount(has_discount) {
    return set(HAS_DISCOUNT, has_discount);
}

function set_device_id(device_id) {
    return set(DEVICE_ID, device_id);
}

function get_device_id() {
    return get(DEVICE_ID);
}

function get_device_id_with_subscriber(subscriber) {
    return get_with_subscriber(DEVICE_ID, subscriber);
}

function set_campaign_id(campaign_id) {
    return set(CAMPAIGN_ID, campaign_id);
}

function get_campaign_id() {
    return get(CAMPAIGN_ID);
}

function set_campaign_expire_time(expire_time) {
    return set(CAMPAIGN_EXPIRE_TIME, expire_time);
}

function get_campaign_expire_time() {
    return get(CAMPAIGN_EXPIRE_TIME);
}

function set_automation_id(automation_id) {
    return set(AUTOMATION_ID, automation_id);
}

function get_automation_id() {
    return get(AUTOMATION_ID);
}

function set_automation_expire_time(expire_time) {
    return set(AUTOMATION_EXPIRE_TIME, expire_time);
}

function get_automation_expire_time() {
    return get(AUTOMATION_EXPIRE_TIME);
}

function set_automation_signup_id(signup_id) {
    return set(AUTOMATION_SIGNUP_ID, signup_id);
}

function get_automation_signup_id() {
    return get(AUTOMATION_SIGNUP_ID);
}

function set_shop_domain(domain) {
    return set(SHOP_DOMAIN, domain);
}

function get_shop_domain() {
    return get(SHOP_DOMAIN);
}

function set_widget_id(widget_id) {
    return set(WIDGET_ID, widget_id);
}

function get_widget_id() {
    return get(WIDGET_ID);
}

function set_recent_click_channel(channel) {
    return set(RECENT_CLICK_CHANNEL, channel);
}

function get_recent_click_channel() {
    return get(RECENT_CLICK_CHANNEL);
}

var Store = function () {
    function Store() {
        var dbName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'keyval-store';
        var storeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'keyval';

        _classCallCheck(this, Store);

        this.storeName = storeName;
        this._dbp = new Promise(function (resolve, reject) {
            var openreq = indexedDB.open(dbName, 1);
            openreq.onerror = function () {
                return reject(openreq.error);
            };
            openreq.onsuccess = function () {
                return resolve(openreq.result);
            };
            // First time setup: create an empty object store
            openreq.onupgradeneeded = function () {
                openreq.result.createObjectStore(storeName);
            };
        });
    }

    _createClass(Store, [{
        key: '_withIDBStore',
        value: function _withIDBStore(type, callback) {
            var _this = this;

            return this._dbp.then(function (db) {
                return new Promise(function (resolve, reject) {
                    var transaction = db.transaction(_this.storeName, type);
                    transaction.oncomplete = function () {
                        return resolve();
                    };
                    transaction.onabort = transaction.onerror = function () {
                        return reject(transaction.error);
                    };
                    callback(transaction.objectStore(_this.storeName));
                });
            });
        }
    }]);

    return Store;
}();

var store = void 0;
function getDefaultStore() {
    if (!store) store = new Store();
    return store;
}
function get(key) {
    var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultStore();

    var req = void 0;
    return store._withIDBStore('readonly', function (store) {
        req = store.get(key);
    }).then(function () {
        return req.result;
    });
}
function get_with_subscriber(key, subscriber) {
    var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getDefaultStore();

    var req = void 0;
    return store._withIDBStore('readonly', function (store) {
        req = store.get(key);
    }).then(function () {
        return Object.assign({}, subscriber, {
            device_id: req.result
        });
    });
}
function set(key, value) {
    var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getDefaultStore();

    return store._withIDBStore('readwrite', function (store) {
        store.put(value, key);
    });
}

function del(key) {
    var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultStore();

    return store._withIDBStore('readwrite', function (store) {
        store.delete(key);
    });
}

function clear() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultStore();
    // eslint-disable-line
    return store._withIDBStore('readwrite', function (store) {
        store.clear();
    });
}

function keys() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultStore();
    // eslint-disable-line
    var keys = [];
    return store._withIDBStore('readonly', function (store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result) return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(function () {
        return keys;
    });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(25);
var bytesToUuid = __webpack_require__(26);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(28);
var objectAssign = __webpack_require__(6);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * UAParser.js v0.7.18
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 or MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.18',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            // console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i,                                             // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge|edgios|edgea)\/((\d+)?[\w\.]+)/i                             // Microsoft Edge
            ], [[NAME, 'Edge'], VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(qqbrowserlite)\/([\w\.]+)/i                                       // QQBrowserLite
            ], [NAME, VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /(BIDUBrowser)[\/\s]?([\w\.]+)/i                                    // Baidu Browser
            ], [NAME, VERSION], [

            /(2345Explorer)[\/\s]?([\w\.]+)/i                                   // 2345 Browser
            ], [NAME, VERSION], [

            /(MetaSr)[\/\s]?([\w\.]+)/i                                         // SouGouBrowser
            ], [NAME], [

            /(LBBROWSER)/i                                      // LieBao Browser
            ], [NAME], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]*)/i,                                         // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/.+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i                         // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w*)/i,                                                     // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i
                                                                                // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w*)/i                                                        // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]*)/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+;\s(\w+)\s+build\/hm\1/i,                                 // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,    // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i       // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i            // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i,                                        // OnePlus
            /android.+oneplus\s(a\d{4})\s+build/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i                      // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+;\s(k88)\sbuild/i                                         // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i        // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i                            // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i                    // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i          // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i                      // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android[\w\.\s\-]{0,9});.+build/i                                 // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]


        /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9}).+(gecko)/i                                       // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,                   // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]*)/i,                                     // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i                  // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i,                                            // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i,                                        // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i                                                // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.\d]*)/i                                            // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i                    // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                   // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i             // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,                             // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,                                // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]*)/i                                               // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    /*
    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;
    */
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        //var browser = new Browser();
        //var cpu = new CPU();
        //var device = new Device();
        //var engine = new Engine();
        //var os = new OS();

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            //browser = new Browser();
            //cpu = new CPU();
            //device = new Device();
            //engine = new Engine();
            //os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        // TODO: test!!!!!!!!
        /*
        if (require && require.main === module && process) {
            // cli
            var jsonize = function (arr) {
                var res = [];
                for (var i in arr) {
                    res.push(new UAParser(arr[i]).getResult());
                }
                process.stdout.write(JSON.stringify(res, null, 2) + '\n');
            };
            if (process.stdin.isTTY) {
                // via args
                jsonize(process.argv.slice(2));
            } else {
                // via pipe
                var str = '';
                process.stdin.on('readable', function() {
                    var read = process.stdin.read();
                    if (read !== null) {
                        str += read;
                    }
                });
                process.stdin.on('end', function () {
                    jsonize(str.replace(/\n$/, '').split('\n'));
                });
            }
        }
        */
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if ("function" === FUNC_TYPE && __webpack_require__(30)) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                return UAParser;
            }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var icannTrie = __webpack_require__(32);

var privateTrie = __webpack_require__(35);

var normalize = __webpack_require__(37);

var lookUp = __webpack_require__(38); // eslint-disable-next-line


var urlParts = /^(:?\/\/|https?:\/\/)?([^/]*@)?(.+?)(:\d{2,5})?([/?].*)?$/; // 1 = protocol, 2 = auth, 3 = hostname, 4 = port, 5 = path

var dot = /\./g;
var emptyArr = [];

function matchTld(hostname, options) {
  // for potentially unrecognized tlds, try matching against custom tlds
  if (options.customTlds) {
    // try matching against a built regexp of custom tlds
    var tld = hostname.match(options.customTlds);

    if (tld !== null) {
      return tld[0];
    }
  }

  var domains = hostname.split(".");
  var icannTlds = lookUp(icannTrie, domains);
  var privateTlds = options.privateTlds ? lookUp(privateTrie, domains) : emptyArr;

  if (privateTlds.length > icannTlds.length) {
    return "." + privateTlds.join(".");
  }

  if (icannTlds.length > 0) {
    return "." + icannTlds.join(".");
  }

  return null;
}
/* eslint-disable jsdoc/no-undefined-types */

/**
 * Removes all unnecessary parts of the domain (e.g. protocol, auth, port, path, query)
 * and parses the remaining domain. The returned object contains the properties 'subdomain', 'domain' and 'tld'.
 *
 * Since the top-level domain is handled differently by every country, this function only
 * supports all tlds listed in src/build/tld.txt.
 *
 * If the given url is not valid or isn't supported by the tld.txt, this function returns null.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {Array<string>|RegExp} [options.customTlds]
 * @param {boolean} [options.privateTlds]
 * @returns {Object|null}
 */


function parseDomain(url, options) {
  var normalizedUrl = normalize.url(url);
  var tld = null;
  var urlSplit;
  var hostname;

  if (!normalizedUrl) {
    return null;
  }

  var normalizedOptions = normalize.options(options);
  urlSplit = normalizedUrl.match(urlParts); // urlSplit is null if the url contains certain characters like '\n', '\r'.

  if (urlSplit === null) {
    return null;
  }

  hostname = urlSplit[3]; // domain will now be something like sub.domain.example.com

  tld = matchTld(hostname, normalizedOptions);

  if (tld === null) {
    return null;
  } // remove tld and split by dot


  urlSplit = hostname.slice(0, -tld.length).split(dot);

  if (tld.charAt(0) === ".") {
    // removes the remaining dot, if present (added to handle localhost)
    tld = tld.slice(1);
  }

  hostname = urlSplit.pop();
  var subdomain = urlSplit.join(".");
  return {
    tld: tld,
    domain: hostname,
    subdomain: subdomain
  };
}

module.exports = parseDomain;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const parse = __webpack_require__(7);

module.exports = parse(__webpack_require__(34).trie);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function createNode() {
  var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return {
    domain: domain,
    children: new Map(),
    parent: null
  };
}

function createOrGetChild(parent, domain) {
  var child = parent.children.get(domain);

  if (child === undefined) {
    child = createNode(domain);
    adoptChild(parent, child);
  }

  return child;
}

function adoptChild(parent, child) {
  if (typeof child.domain !== "string") {
    throw new Error("Cannot adopt child: child.domain must be a string");
  }

  if (parent.children.has(child.domain)) {
    throw new Error("Cannot adopt child: parent has already a child with the domain '".concat(child.domain, "'"));
  }

  parent.children.set(child.domain, child);
  child.parent = parent;
}

module.exports = {
  createNode: createNode,
  createOrGetChild: createOrGetChild,
  adoptChild: adoptChild
};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = {"trie":"aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac>com,edu,gov,mil,net,org|academy|accenture|accountant|accountants|aco|actor|ad>nom|adac|ads|adult|ae>ac,co,gov,mil,net,org,sch|aeg|aero>accident-investigation,accident-prevention,aerobatic,aeroclub,aerodrome,agents,air-surveillance,air-traffic-control,aircraft,airline,airport,airtraffic,ambulance,amusement,association,author,ballooning,broker,caa,cargo,catering,certification,championship,charter,civilaviation,club,conference,consultant,consulting,control,council,crew,design,dgca,educator,emergency,engine,engineer,entertainment,equipment,exchange,express,federation,flight,fuel,gliding,government,groundhandling,group,hanggliding,homebuilt,insurance,journal,journalist,leasing,logistics,magazine,maintenance,media,microlight,modelling,navigation,parachuting,paragliding,passenger-association,pilot,press,production,recreation,repbody,res,research,rotorcraft,safety,scientist,services,show,skydiving,software,student,trader,trading,trainer,union,workinggroup,works|aetna|af>com,edu,gov,net,org|afl|africa|ag>co,com,net,nom,org|agakhan|agency|ai>com,net,off,org|aig|airbus|airforce|airtel|akdn|al>com,edu,gov,mil,net,org|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am>co,com,commune,net,org|amazon|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao>co,ed,gv,it,og,pb|aol|apartments|app|apple|aq|aquarelle|ar>bet,com,coop,edu,gob,gov,int,mil,musica,mutual,net,org,senasa,tur|arab|aramco|archi|army|arpa>e164,in-addr,ip6,iris,uri,urn|art|arte|as>gov|asda|asia|associates|at>ac>sth<co,gv,or|athleta|attorney|au>act,asn,com,conf,edu>act,catholic,nsw>schools<nt,qld,sa,tas,vic,wa<gov>qld,sa,tas,vic,wa<id,info,net,nsw,nt,org,oz,qld,sa,tas,vic,wa|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw>com|aws|ax|axa|az>biz,com,edu,gov,info,int,mil,name,net,org,pp,pro|azure|ba>com,edu,gov,mil,net,org|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb>biz,co,com,edu,gov,info,net,org,store,tv|bbc|bbt|bbva|bcg|bcn|bd>*|be>ac|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf>gov|bg>0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z|bh>com,edu,gov,net,org|bharti|bi>co,com,edu,or,org|bible|bid|bike|bing|bingo|bio|biz|bj>asso,barreau,gouv|black|blackfriday|blockbuster|blog|bloomberg|blue|bm>com,edu,gov,net,org|bms|bmw|bn>com,edu,gov,net,org|bnpparibas|bo>academia,agro,arte,blog,bolivia,ciencia,com,cooperativa,democracia,deporte,ecologia,economia,edu,empresa,gob,indigena,industria,info,int,medicina,mil,movimiento,musica,natural,net,nombre,noticias,org,patria,plurinacional,politica,profesional,pueblo,revista,salud,tecnologia,tksat,transporte,tv,web,wiki|boats|boehringer|bofa|bom|bond|boo|book|booking|bosch|bostik|boston|bot|boutique|box|br>9guacu,abc,adm,adv,agr,aju,am,anani,aparecida,app,arq,art,ato,b,barueri,belem,bhz,bib,bio,blog,bmd,boavista,bsb,campinagrande,campinas,caxias,cim,cng,cnt,com,contagem,coop,coz,cri,cuiaba,curitiba,def,des,det,dev,ecn,eco,edu,emp,enf,eng,esp,etc,eti,far,feira,flog,floripa,fm,fnd,fortal,fot,foz,fst,g12,geo,ggf,goiania,gov>ac,al,am,ap,ba,ce,df,es,go,ma,mg,ms,mt,pa,pb,pe,pi,pr,rj,rn,ro,rr,rs,sc,se,sp,to<gru,imb,ind,inf,jab,jampa,jdf,joinville,jor,jus,leg,lel,log,londrina,macapa,maceio,manaus,maringa,mat,med,mil,morena,mp,mus,natal,net,niteroi,nom>*<not,ntr,odo,ong,org,osasco,palmas,poa,ppg,pro,psc,psi,pvh,qsl,radio,rec,recife,rep,ribeirao,rio,riobranco,riopreto,salvador,sampa,santamaria,santoandre,saobernardo,saogonca,seg,sjc,slg,slz,sorocaba,srv,taxi,tc,tec,teo,the,tmp,trd,tur,tv,udi,vet,vix,vlog,wiki,zlg|bradesco|bridgestone|broadway|broker|brother|brussels|bs>com,edu,gov,net,org|bt>com,edu,gov,net,org|bugatti|build|builders|business|buy|buzz|bv|bw>co,org|by>com,gov,mil,of|bz>com,edu,gov,net,org|bzh|ca>ab,bc,gc,mb,nb,nf,nl,ns,nt,nu,on,pe,qc,sk,yk|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|casa|case|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd>gov|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|charity|chase|chat|cheap|chintai|christmas|chrome|church|ci>ac,aéroport,asso,co,com,ed,edu,go,gouv,int,md,net,or,org,presse|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck>!www,*|cl>co,gob,gov,mil|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm>co,com,gov,net|cn>ac,ah,bj,com,cq,edu,fj,gd,gov,gs,gx,gz,ha,hb,he,hi,hk,hl,hn,jl,js,jx,ln,mil,mo,net,nm,nx,org,qh,sc,sd,sh,sn,sx,tj,tw,xj,xz,yn,zj,公司,網絡,网络|co>arts,com,edu,firm,gov,info,int,mil,net,nom,org,rec,web|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cpa|cr>ac,co,ed,fi,go,or,sa|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|cu>com,edu,gov,inf,net,org|cuisinella|cv>com,edu,int,nome,org|cw>com,edu,net,org|cx>gov|cy>ac,biz,com,ekloges,gov,ltd,mil,net,org,press,pro,tm|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm>com,edu,gov,net,org|dnp|do>art,com,edu,gob,gov,mil,net,org,sld,web|docs|doctor|dog|domains|dot|download|drive|dtv|dubai|dunlop|dupont|durban|dvag|dvr|dz>art,asso,com,edu,gov,net,org,pol,soc,tm|earth|eat|ec>com,edu,fin,gob,gov,info,k12,med,mil,net,org,pro|eco|edeka|edu|education|ee>aip,com,edu,fie,gov,lib,med,org,pri,riik|eg>com,edu,eun,gov,mil,name,net,org,sci|email|emerck|energy|engineer|engineering|enterprises|epson|equipment|er>*|ericsson|erni|es>com,edu,gob,nom,org|esq|estate|et>biz,com,edu,gov,info,name,net,org|etisalat|eu|eurovision|eus|events|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi>aland|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj>ac,biz,com,gov,info,mil,name,net,org,pro|fk>*|flickr|flights|flir|florist|flowers|fly|fm>com,edu,net,org|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr>aeroport,asso,avocat,avoues,cci,chambagri,chirurgiens-dentistes,com,experts-comptables,geometre-expert,gouv,greta,huissier-justice,medecin,nom,notaires,pharmacien,port,prd,tm,veterinaire|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gay|gb|gbiz|gd>edu,gov|gdn|ge>com,edu,gov,mil,net,org,pvt|gea|gent|genting|george|gf|gg>co,net,org|ggee|gh>com,edu,gov,mil,org|gi>com,edu,gov,ltd,mod,org|gift|gifts|gives|giving|gl>co,com,edu,net,org|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn>ac,com,edu,gov,net,org|godaddy|gold|goldpoint|golf|goo|goodyear|goog|google|gop|got|gov|gp>asso,com,edu,mobi,net,org|gq|gr>com,edu,gov,net,org|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt>com,edu,gob,ind,mil,net,org|gu>com,edu,gov,guam,info,net,org,web|guardian|gucci|guge|guide|guitars|guru|gw|gy>co,com,edu,gov,net,org|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk>com,edu,gov,idv,net,org,个人,個人,公司,政府,敎育,教育,箇人,組織,組织,網絡,網络,组織,组织,网絡,网络|hkt|hm|hn>com,edu,gob,mil,net,org|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr>com,from,iz,name|hsbc|ht>adult,art,asso,com,coop,edu,firm,gouv,info,med,net,org,perso,pol,pro,rel,shop|hu>2000,agrar,bolt,casino,city,co,erotica,erotika,film,forum,games,hotel,info,ingatlan,jogasz,konyvelo,lakas,media,news,org,priv,reklam,sex,shop,sport,suli,szex,tm,tozsde,utazas,video|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id>ac,biz,co,desa,go,mil,my,net,or,ponpes,sch,web|ie>gov|ieee|ifm|ikano|il>ac,co,gov,idf,k12,muni,net,org|im>ac,co>ltd,plc<com,net,org,tt,tv|imamat|imdb|immo|immobilien|in>5g,6g,ac,ai,am,bihar,biz,business,ca,cn,co,com,coop,cs,delhi,dr,edu,er,firm,gen,gov,gujarat,ind,info,int,internet,io,me,mil,net,nic,org,pg,post,pro,res,travel,tv,uk,up,us|inc|industries|infiniti|info|ing|ink|institute|insurance|insure|int>eu|international|intuit|investments|io>com|ipiranga|iq>com,edu,gov,mil,net,org|ir>ac,co,gov,id,net,org,sch,ايران,ایران|irish|is>com,edu,gov,int,net,org|ismaili|ist|istanbul|it>abr,abruzzo,ag,agrigento,al,alessandria,alto-adige,altoadige,an,ancona,andria-barletta-trani,andria-trani-barletta,andriabarlettatrani,andriatranibarletta,ao,aosta,aosta-valley,aostavalley,aoste,ap,aq,aquila,ar,arezzo,ascoli-piceno,ascolipiceno,asti,at,av,avellino,ba,balsan,balsan-sudtirol,balsan-südtirol,balsan-suedtirol,bari,barletta-trani-andria,barlettatraniandria,bas,basilicata,belluno,benevento,bergamo,bg,bi,biella,bl,bn,bo,bologna,bolzano,bolzano-altoadige,bozen,bozen-sudtirol,bozen-südtirol,bozen-suedtirol,br,brescia,brindisi,bs,bt,bulsan,bulsan-sudtirol,bulsan-südtirol,bulsan-suedtirol,bz,ca,cagliari,cal,calabria,caltanissetta,cam,campania,campidano-medio,campidanomedio,campobasso,carbonia-iglesias,carboniaiglesias,carrara-massa,carraramassa,caserta,catania,catanzaro,cb,ce,cesena-forli,cesena-forlì,cesenaforli,cesenaforlì,ch,chieti,ci,cl,cn,co,como,cosenza,cr,cremona,crotone,cs,ct,cuneo,cz,dell-ogliastra,dellogliastra,edu,emilia-romagna,emiliaromagna,emr,en,enna,fc,fe,fermo,ferrara,fg,fi,firenze,florence,fm,foggia,forli-cesena,forlì-cesena,forlicesena,forlìcesena,fr,friuli-v-giulia,friuli-ve-giulia,friuli-vegiulia,friuli-venezia-giulia,friuli-veneziagiulia,friuli-vgiulia,friuliv-giulia,friulive-giulia,friulivegiulia,friulivenezia-giulia,friuliveneziagiulia,friulivgiulia,frosinone,fvg,ge,genoa,genova,go,gorizia,gov,gr,grosseto,iglesias-carbonia,iglesiascarbonia,im,imperia,is,isernia,kr,la-spezia,laquila,laspezia,latina,laz,lazio,lc,le,lecce,lecco,li,lig,liguria,livorno,lo,lodi,lom,lombardia,lombardy,lt,lu,lucania,lucca,macerata,mantova,mar,marche,massa-carrara,massacarrara,matera,mb,mc,me,medio-campidano,mediocampidano,messina,mi,milan,milano,mn,mo,modena,mol,molise,monza,monza-brianza,monza-e-della-brianza,monzabrianza,monzaebrianza,monzaedellabrianza,ms,mt,na,naples,napoli,no,novara,nu,nuoro,og,ogliastra,olbia-tempio,olbiatempio,or,oristano,ot,pa,padova,padua,palermo,parma,pavia,pc,pd,pe,perugia,pesaro-urbino,pesarourbino,pescara,pg,pi,piacenza,piedmont,piemonte,pisa,pistoia,pmn,pn,po,pordenone,potenza,pr,prato,pt,pu,pug,puglia,pv,pz,ra,ragusa,ravenna,rc,re,reggio-calabria,reggio-emilia,reggiocalabria,reggioemilia,rg,ri,rieti,rimini,rm,rn,ro,roma,rome,rovigo,sa,salerno,sar,sardegna,sardinia,sassari,savona,si,sic,sicilia,sicily,siena,siracusa,so,sondrio,sp,sr,ss,südtirol,suedtirol,sv,ta,taa,taranto,te,tempio-olbia,tempioolbia,teramo,terni,tn,to,torino,tos,toscana,tp,tr,trani-andria-barletta,trani-barletta-andria,traniandriabarletta,tranibarlettaandria,trapani,trentin-sud-tirol,trentin-süd-tirol,trentin-sudtirol,trentin-südtirol,trentin-sued-tirol,trentin-suedtirol,trentino,trentino-a-adige,trentino-aadige,trentino-alto-adige,trentino-altoadige,trentino-s-tirol,trentino-stirol,trentino-sud-tirol,trentino-süd-tirol,trentino-sudtirol,trentino-südtirol,trentino-sued-tirol,trentino-suedtirol,trentinoa-adige,trentinoaadige,trentinoalto-adige,trentinoaltoadige,trentinos-tirol,trentinostirol,trentinosud-tirol,trentinosüd-tirol,trentinosudtirol,trentinosüdtirol,trentinosued-tirol,trentinosuedtirol,trentinsud-tirol,trentinsüd-tirol,trentinsudtirol,trentinsüdtirol,trentinsued-tirol,trentinsuedtirol,trento,treviso,trieste,ts,turin,tuscany,tv,ud,udine,umb,umbria,urbino-pesaro,urbinopesaro,va,val-d-aosta,val-daosta,vald-aosta,valdaosta,valle-aosta,valle-d-aosta,valle-daosta,valleaosta,valled-aosta,valledaosta,vallee-aoste,vallée-aoste,vallee-d-aoste,vallée-d-aoste,valleeaoste,valléeaoste,valleedaoste,valléedaoste,vao,varese,vb,vc,vda,ve,ven,veneto,venezia,venice,verbania,vercelli,verona,vi,vibo-valentia,vibovalentia,vicenza,viterbo,vr,vs,vt,vv|itau|itv|jaguar|java|jcb|je>co,net,org|jeep|jetzt|jewelry|jio|jll|jm>*|jmp|jnj|jo>com,edu,gov,mil,name,net,org,sch|jobs|joburg|jot|joy|jp>ac,ad,aichi>aisai,ama,anjo,asuke,chiryu,chita,fuso,gamagori,handa,hazu,hekinan,higashiura,ichinomiya,inazawa,inuyama,isshiki,iwakura,kanie,kariya,kasugai,kira,kiyosu,komaki,konan,kota,mihama,miyoshi,nishio,nisshin,obu,oguchi,oharu,okazaki,owariasahi,seto,shikatsu,shinshiro,shitara,tahara,takahama,tobishima,toei,togo,tokai,tokoname,toyoake,toyohashi,toyokawa,toyone,toyota,tsushima,yatomi<akita>akita,daisen,fujisato,gojome,hachirogata,happou,higashinaruse,honjo,honjyo,ikawa,kamikoani,kamioka,katagami,kazuno,kitaakita,kosaka,kyowa,misato,mitane,moriyoshi,nikaho,noshiro,odate,oga,ogata,semboku,yokote,yurihonjo<aomori>aomori,gonohe,hachinohe,hashikami,hiranai,hirosaki,itayanagi,kuroishi,misawa,mutsu,nakadomari,noheji,oirase,owani,rokunohe,sannohe,shichinohe,shingo,takko,towada,tsugaru,tsuruta<chiba>abiko,asahi,chonan,chosei,choshi,chuo,funabashi,futtsu,hanamigawa,ichihara,ichikawa,ichinomiya,inzai,isumi,kamagaya,kamogawa,kashiwa,katori,katsuura,kimitsu,kisarazu,kozaki,kujukuri,kyonan,matsudo,midori,mihama,minamiboso,mobara,mutsuzawa,nagara,nagareyama,narashino,narita,noda,oamishirasato,omigawa,onjuku,otaki,sakae,sakura,shimofusa,shirako,shiroi,shisui,sodegaura,sosa,tako,tateyama,togane,tohnosho,tomisato,urayasu,yachimata,yachiyo,yokaichiba,yokoshibahikari,yotsukaido<co,ed,ehime>ainan,honai,ikata,imabari,iyo,kamijima,kihoku,kumakogen,masaki,matsuno,matsuyama,namikata,niihama,ozu,saijo,seiyo,shikokuchuo,tobe,toon,uchiko,uwajima,yawatahama<fukui>echizen,eiheiji,fukui,ikeda,katsuyama,mihama,minamiechizen,obama,ohi,ono,sabae,sakai,takahama,tsuruga,wakasa<fukuoka>ashiya,buzen,chikugo,chikuho,chikujo,chikushino,chikuzen,chuo,dazaifu,fukuchi,hakata,higashi,hirokawa,hisayama,iizuka,inatsuki,kaho,kasuga,kasuya,kawara,keisen,koga,kurate,kurogi,kurume,minami,miyako,miyama,miyawaka,mizumaki,munakata,nakagawa,nakama,nishi,nogata,ogori,okagaki,okawa,oki,omuta,onga,onojo,oto,saigawa,sasaguri,shingu,shinyoshitomi,shonai,soeda,sue,tachiarai,tagawa,takata,toho,toyotsu,tsuiki,ukiha,umi,usui,yamada,yame,yanagawa,yukuhashi<fukushima>aizubange,aizumisato,aizuwakamatsu,asakawa,bandai,date,fukushima,furudono,futaba,hanawa,higashi,hirata,hirono,iitate,inawashiro,ishikawa,iwaki,izumizaki,kagamiishi,kaneyama,kawamata,kitakata,kitashiobara,koori,koriyama,kunimi,miharu,mishima,namie,nango,nishiaizu,nishigo,okuma,omotego,ono,otama,samegawa,shimogo,shirakawa,showa,soma,sukagawa,taishin,tamakawa,tanagura,tenei,yabuki,yamato,yamatsuri,yanaizu,yugawa<gifu>anpachi,ena,gifu,ginan,godo,gujo,hashima,hichiso,hida,higashishirakawa,ibigawa,ikeda,kakamigahara,kani,kasahara,kasamatsu,kawaue,kitagata,mino,minokamo,mitake,mizunami,motosu,nakatsugawa,ogaki,sakahogi,seki,sekigahara,shirakawa,tajimi,takayama,tarui,toki,tomika,wanouchi,yamagata,yaotsu,yoro<go,gr,gunma>annaka,chiyoda,fujioka,higashiagatsuma,isesaki,itakura,kanna,kanra,katashina,kawaba,kiryu,kusatsu,maebashi,meiwa,midori,minakami,naganohara,nakanojo,nanmoku,numata,oizumi,ora,ota,shibukawa,shimonita,shinto,showa,takasaki,takayama,tamamura,tatebayashi,tomioka,tsukiyono,tsumagoi,ueno,yoshioka<hiroshima>asaminami,daiwa,etajima,fuchu,fukuyama,hatsukaichi,higashihiroshima,hongo,jinsekikogen,kaita,kui,kumano,kure,mihara,miyoshi,naka,onomichi,osakikamijima,otake,saka,sera,seranishi,shinichi,shobara,takehara<hokkaido>abashiri,abira,aibetsu,akabira,akkeshi,asahikawa,ashibetsu,ashoro,assabu,atsuma,bibai,biei,bifuka,bihoro,biratori,chippubetsu,chitose,date,ebetsu,embetsu,eniwa,erimo,esan,esashi,fukagawa,fukushima,furano,furubira,haboro,hakodate,hamatonbetsu,hidaka,higashikagura,higashikawa,hiroo,hokuryu,hokuto,honbetsu,horokanai,horonobe,ikeda,imakane,ishikari,iwamizawa,iwanai,kamifurano,kamikawa,kamishihoro,kamisunagawa,kamoenai,kayabe,kembuchi,kikonai,kimobetsu,kitahiroshima,kitami,kiyosato,koshimizu,kunneppu,kuriyama,kuromatsunai,kushiro,kutchan,kyowa,mashike,matsumae,mikasa,minamifurano,mombetsu,moseushi,mukawa,muroran,naie,nakagawa,nakasatsunai,nakatombetsu,nanae,nanporo,nayoro,nemuro,niikappu,niki,nishiokoppe,noboribetsu,numata,obihiro,obira,oketo,okoppe,otaru,otobe,otofuke,otoineppu,oumu,ozora,pippu,rankoshi,rebun,rikubetsu,rishiri,rishirifuji,saroma,sarufutsu,shakotan,shari,shibecha,shibetsu,shikabe,shikaoi,shimamaki,shimizu,shimokawa,shinshinotsu,shintoku,shiranuka,shiraoi,shiriuchi,sobetsu,sunagawa,taiki,takasu,takikawa,takinoue,teshikaga,tobetsu,tohma,tomakomai,tomari,toya,toyako,toyotomi,toyoura,tsubetsu,tsukigata,urakawa,urausu,uryu,utashinai,wakkanai,wassamu,yakumo,yoichi<hyogo>aioi,akashi,ako,amagasaki,aogaki,asago,ashiya,awaji,fukusaki,goshiki,harima,himeji,ichikawa,inagawa,itami,kakogawa,kamigori,kamikawa,kasai,kasuga,kawanishi,miki,minamiawaji,nishinomiya,nishiwaki,ono,sanda,sannan,sasayama,sayo,shingu,shinonsen,shiso,sumoto,taishi,taka,takarazuka,takasago,takino,tamba,tatsuno,toyooka,yabu,yashiro,yoka,yokawa<ibaraki>ami,asahi,bando,chikusei,daigo,fujishiro,hitachi,hitachinaka,hitachiomiya,hitachiota,ibaraki,ina,inashiki,itako,iwama,joso,kamisu,kasama,kashima,kasumigaura,koga,miho,mito,moriya,naka,namegata,oarai,ogawa,omitama,ryugasaki,sakai,sakuragawa,shimodate,shimotsuma,shirosato,sowa,suifu,takahagi,tamatsukuri,tokai,tomobe,tone,toride,tsuchiura,tsukuba,uchihara,ushiku,yachiyo,yamagata,yawara,yuki<ishikawa>anamizu,hakui,hakusan,kaga,kahoku,kanazawa,kawakita,komatsu,nakanoto,nanao,nomi,nonoichi,noto,shika,suzu,tsubata,tsurugi,uchinada,wajima<iwate>fudai,fujisawa,hanamaki,hiraizumi,hirono,ichinohe,ichinoseki,iwaizumi,iwate,joboji,kamaishi,kanegasaki,karumai,kawai,kitakami,kuji,kunohe,kuzumaki,miyako,mizusawa,morioka,ninohe,noda,ofunato,oshu,otsuchi,rikuzentakata,shiwa,shizukuishi,sumita,tanohata,tono,yahaba,yamada<kagawa>ayagawa,higashikagawa,kanonji,kotohira,manno,marugame,mitoyo,naoshima,sanuki,tadotsu,takamatsu,tonosho,uchinomi,utazu,zentsuji<kagoshima>akune,amami,hioki,isa,isen,izumi,kagoshima,kanoya,kawanabe,kinko,kouyama,makurazaki,matsumoto,minamitane,nakatane,nishinoomote,satsumasendai,soo,tarumizu,yusui<kanagawa>aikawa,atsugi,ayase,chigasaki,ebina,fujisawa,hadano,hakone,hiratsuka,isehara,kaisei,kamakura,kiyokawa,matsuda,minamiashigara,miura,nakai,ninomiya,odawara,oi,oiso,sagamihara,samukawa,tsukui,yamakita,yamato,yokosuka,yugawara,zama,zushi<kawasaki>!city,*<kitakyushu>!city,*<kobe>!city,*<kochi>aki,geisei,hidaka,higashitsuno,ino,kagami,kami,kitagawa,kochi,mihara,motoyama,muroto,nahari,nakamura,nankoku,nishitosa,niyodogawa,ochi,okawa,otoyo,otsuki,sakawa,sukumo,susaki,tosa,tosashimizu,toyo,tsuno,umaji,yasuda,yusuhara<kumamoto>amakusa,arao,aso,choyo,gyokuto,kamiamakusa,kikuchi,kumamoto,mashiki,mifune,minamata,minamioguni,nagasu,nishihara,oguni,ozu,sumoto,takamori,uki,uto,yamaga,yamato,yatsushiro<kyoto>ayabe,fukuchiyama,higashiyama,ide,ine,joyo,kameoka,kamo,kita,kizu,kumiyama,kyotamba,kyotanabe,kyotango,maizuru,minami,minamiyamashiro,miyazu,muko,nagaokakyo,nakagyo,nantan,oyamazaki,sakyo,seika,tanabe,uji,ujitawara,wazuka,yamashina,yawata<lg,mie>asahi,inabe,ise,kameyama,kawagoe,kiho,kisosaki,kiwa,komono,kumano,kuwana,matsusaka,meiwa,mihama,minamiise,misugi,miyama,nabari,shima,suzuka,tado,taiki,taki,tamaki,toba,tsu,udono,ureshino,watarai,yokkaichi<miyagi>furukawa,higashimatsushima,ishinomaki,iwanuma,kakuda,kami,kawasaki,marumori,matsushima,minamisanriku,misato,murata,natori,ogawara,ohira,onagawa,osaki,rifu,semine,shibata,shichikashuku,shikama,shiogama,shiroishi,tagajo,taiwa,tome,tomiya,wakuya,watari,yamamoto,zao<miyazaki>aya,ebino,gokase,hyuga,kadogawa,kawaminami,kijo,kitagawa,kitakata,kitaura,kobayashi,kunitomi,kushima,mimata,miyakonojo,miyazaki,morotsuka,nichinan,nishimera,nobeoka,saito,shiiba,shintomi,takaharu,takanabe,takazaki,tsuno<nagano>achi,agematsu,anan,aoki,asahi,azumino,chikuhoku,chikuma,chino,fujimi,hakuba,hara,hiraya,iida,iijima,iiyama,iizuna,ikeda,ikusaka,ina,karuizawa,kawakami,kiso,kisofukushima,kitaaiki,komagane,komoro,matsukawa,matsumoto,miasa,minamiaiki,minamimaki,minamiminowa,minowa,miyada,miyota,mochizuki,nagano,nagawa,nagiso,nakagawa,nakano,nozawaonsen,obuse,ogawa,okaya,omachi,omi,ookuwa,ooshika,otaki,otari,sakae,sakaki,saku,sakuho,shimosuwa,shinanomachi,shiojiri,suwa,suzaka,takagi,takamori,takayama,tateshina,tatsuno,togakushi,togura,tomi,ueda,wada,yamagata,yamanouchi,yasaka,yasuoka<nagasaki>chijiwa,futsu,goto,hasami,hirado,iki,isahaya,kawatana,kuchinotsu,matsuura,nagasaki,obama,omura,oseto,saikai,sasebo,seihi,shimabara,shinkamigoto,togitsu,tsushima,unzen<nagoya>!city,*<nara>ando,gose,heguri,higashiyoshino,ikaruga,ikoma,kamikitayama,kanmaki,kashiba,kashihara,katsuragi,kawai,kawakami,kawanishi,koryo,kurotaki,mitsue,miyake,nara,nosegawa,oji,ouda,oyodo,sakurai,sango,shimoichi,shimokitayama,shinjo,soni,takatori,tawaramoto,tenkawa,tenri,uda,yamatokoriyama,yamatotakada,yamazoe,yoshino<ne,niigata>aga,agano,gosen,itoigawa,izumozaki,joetsu,kamo,kariwa,kashiwazaki,minamiuonuma,mitsuke,muika,murakami,myoko,nagaoka,niigata,ojiya,omi,sado,sanjo,seiro,seirou,sekikawa,shibata,tagami,tainai,tochio,tokamachi,tsubame,tsunan,uonuma,yahiko,yoita,yuzawa<oita>beppu,bungoono,bungotakada,hasama,hiji,himeshima,hita,kamitsue,kokonoe,kuju,kunisaki,kusu,oita,saiki,taketa,tsukumi,usa,usuki,yufu<okayama>akaiwa,asakuchi,bizen,hayashima,ibara,kagamino,kasaoka,kibichuo,kumenan,kurashiki,maniwa,misaki,nagi,niimi,nishiawakura,okayama,satosho,setouchi,shinjo,shoo,soja,takahashi,tamano,tsuyama,wake,yakage<okinawa>aguni,ginowan,ginoza,gushikami,haebaru,higashi,hirara,iheya,ishigaki,ishikawa,itoman,izena,kadena,kin,kitadaito,kitanakagusuku,kumejima,kunigami,minamidaito,motobu,nago,naha,nakagusuku,nakijin,nanjo,nishihara,ogimi,okinawa,onna,shimoji,taketomi,tarama,tokashiki,tomigusuku,tonaki,urasoe,uruma,yaese,yomitan,yonabaru,yonaguni,zamami<or,osaka>abeno,chihayaakasaka,chuo,daito,fujiidera,habikino,hannan,higashiosaka,higashisumiyoshi,higashiyodogawa,hirakata,ibaraki,ikeda,izumi,izumiotsu,izumisano,kadoma,kaizuka,kanan,kashiwara,katano,kawachinagano,kishiwada,kita,kumatori,matsubara,minato,minoh,misaki,moriguchi,neyagawa,nishi,nose,osakasayama,sakai,sayama,sennan,settsu,shijonawate,shimamoto,suita,tadaoka,taishi,tajiri,takaishi,takatsuki,tondabayashi,toyonaka,toyono,yao<saga>ariake,arita,fukudomi,genkai,hamatama,hizen,imari,kamimine,kanzaki,karatsu,kashima,kitagata,kitahata,kiyama,kouhoku,kyuragi,nishiarita,ogi,omachi,ouchi,saga,shiroishi,taku,tara,tosu,yoshinogari<saitama>arakawa,asaka,chichibu,fujimi,fujimino,fukaya,hanno,hanyu,hasuda,hatogaya,hatoyama,hidaka,higashichichibu,higashimatsuyama,honjo,ina,iruma,iwatsuki,kamiizumi,kamikawa,kamisato,kasukabe,kawagoe,kawaguchi,kawajima,kazo,kitamoto,koshigaya,kounosu,kuki,kumagaya,matsubushi,minano,misato,miyashiro,miyoshi,moroyama,nagatoro,namegawa,niiza,ogano,ogawa,ogose,okegawa,omiya,otaki,ranzan,ryokami,saitama,sakado,satte,sayama,shiki,shiraoka,soka,sugito,toda,tokigawa,tokorozawa,tsurugashima,urawa,warabi,yashio,yokoze,yono,yorii,yoshida,yoshikawa,yoshimi<sapporo>!city,*<sendai>!city,*<shiga>aisho,gamo,higashiomi,hikone,koka,konan,kosei,koto,kusatsu,maibara,moriyama,nagahama,nishiazai,notogawa,omihachiman,otsu,ritto,ryuoh,takashima,takatsuki,torahime,toyosato,yasu<shimane>akagi,ama,gotsu,hamada,higashiizumo,hikawa,hikimi,izumo,kakinoki,masuda,matsue,misato,nishinoshima,ohda,okinoshima,okuizumo,shimane,tamayu,tsuwano,unnan,yakumo,yasugi,yatsuka<shizuoka>arai,atami,fuji,fujieda,fujikawa,fujinomiya,fukuroi,gotemba,haibara,hamamatsu,higashiizu,ito,iwata,izu,izunokuni,kakegawa,kannami,kawanehon,kawazu,kikugawa,kosai,makinohara,matsuzaki,minamiizu,mishima,morimachi,nishiizu,numazu,omaezaki,shimada,shimizu,shimoda,shizuoka,susono,yaizu,yoshida<tochigi>ashikaga,bato,haga,ichikai,iwafune,kaminokawa,kanuma,karasuyama,kuroiso,mashiko,mibu,moka,motegi,nasu,nasushiobara,nikko,nishikata,nogi,ohira,ohtawara,oyama,sakura,sano,shimotsuke,shioya,takanezawa,tochigi,tsuga,ujiie,utsunomiya,yaita<tokushima>aizumi,anan,ichiba,itano,kainan,komatsushima,matsushige,mima,minami,miyoshi,mugi,nakagawa,naruto,sanagochi,shishikui,tokushima,wajiki<tokyo>adachi,akiruno,akishima,aogashima,arakawa,bunkyo,chiyoda,chofu,chuo,edogawa,fuchu,fussa,hachijo,hachioji,hamura,higashikurume,higashimurayama,higashiyamato,hino,hinode,hinohara,inagi,itabashi,katsushika,kita,kiyose,kodaira,koganei,kokubunji,komae,koto,kouzushima,kunitachi,machida,meguro,minato,mitaka,mizuho,musashimurayama,musashino,nakano,nerima,ogasawara,okutama,ome,oshima,ota,setagaya,shibuya,shinagawa,shinjuku,suginami,sumida,tachikawa,taito,tama,toshima<tottori>chizu,hino,kawahara,koge,kotoura,misasa,nanbu,nichinan,sakaiminato,tottori,wakasa,yazu,yonago<toyama>asahi,fuchu,fukumitsu,funahashi,himi,imizu,inami,johana,kamiichi,kurobe,nakaniikawa,namerikawa,nanto,nyuzen,oyabe,taira,takaoka,tateyama,toga,tonami,toyama,unazuki,uozu,yamada<wakayama>arida,aridagawa,gobo,hashimoto,hidaka,hirogawa,inami,iwade,kainan,kamitonda,katsuragi,kimino,kinokawa,kitayama,koya,koza,kozagawa,kudoyama,kushimoto,mihama,misato,nachikatsuura,shingu,shirahama,taiji,tanabe,wakayama,yuasa,yura<yamagata>asahi,funagata,higashine,iide,kahoku,kaminoyama,kaneyama,kawanishi,mamurogawa,mikawa,murayama,nagai,nakayama,nanyo,nishikawa,obanazawa,oe,oguni,ohkura,oishida,sagae,sakata,sakegawa,shinjo,shirataka,shonai,takahata,tendo,tozawa,tsuruoka,yamagata,yamanobe,yonezawa,yuza<yamaguchi>abu,hagi,hikari,hofu,iwakuni,kudamatsu,mitou,nagato,oshima,shimonoseki,shunan,tabuse,tokuyama,toyota,ube,yuu<yamanashi>chuo,doshi,fuefuki,fujikawa,fujikawaguchiko,fujiyoshida,hayakawa,hokuto,ichikawamisato,kai,kofu,koshu,kosuge,minami-alps,minobu,nakamichi,nanbu,narusawa,nirasaki,nishikatsura,oshino,otsuki,showa,tabayama,tsuru,uenohara,yamanakako,yamanashi<yokohama>!city,*<三重,京都,佐賀,兵庫,北海道,千葉,和歌山,埼玉,大分,大阪,奈良,宮城,宮崎,富山,山口,山形,山梨,岐阜,岡山,岩手,島根,広島,徳島,愛媛,愛知,新潟,東京,栃木,沖縄,滋賀,熊本,石川,神奈川,福井,福岡,福島,秋田,群馬,茨城,長崎,長野,青森,静岡,香川,高知,鳥取,鹿児島|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke>ac,co,go,info,me,mobi,ne,or,sc|kerryhotels|kerrylogistics|kerryproperties|kfh|kg>com,edu,gov,mil,net,org|kh>*|ki>biz,com,edu,gov,info,net,org|kia|kids|kim|kinder|kindle|kitchen|kiwi|km>ass,asso,com,coop,edu,gouv,gov,medecin,mil,nom,notaires,org,pharmaciens,prd,presse,tm,veterinaire|kn>edu,gov,net,org|koeln|komatsu|kosher|kp>com,edu,gov,org,rep,tra|kpmg|kpn|kr>ac,busan,chungbuk,chungnam,co,daegu,daejeon,es,gangwon,go,gwangju,gyeongbuk,gyeonggi,gyeongnam,hs,incheon,jeju,jeonbuk,jeonnam,kg,mil,ms,ne,or,pe,re,sc,seoul,ulsan|krd|kred|kuokgroup|kw>com,edu,emb,gov,ind,net,org|ky>com,edu,net,org|kyoto|kz>com,edu,gov,mil,net,org|la>com,edu,gov,info,int,net,org,per|lacaixa|lamborghini|lamer|lancaster|lancia|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb>com,edu,gov,net,org|lc>co,com,edu,gov,net,org|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lk>ac,assn,com,edu,gov,grp,hotel,int,ltd,net,ngo,org,sch,soc,web|llc|llp|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr>com,edu,gov,net,org|ls>ac,biz,co,edu,gov,info,net,org,sc|lt>gov|ltd|ltda|lu|lundbeck|luxe|luxury|lv>asn,com,conf,edu,gov,id,mil,net,org|ly>com,edu,gov,id,med,net,org,plc,sch|ma>ac,co,gov,net,org,press|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc>asso,tm|mckinsey|md|me>ac,co,edu,gov,its,net,org,priv|med|media|meet|melbourne|meme|memorial|men|menu|merckmsd|mg>co,com,edu,gov,mil,nom,org,prd,tm|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk>com,edu,gov,inf,name,net,org|ml>com,edu,gouv,gov,net,org,presse|mlb|mls|mm>*|mma|mn>edu,gov,org|mo>com,edu,gov,net,org|mobi|mobile|moda|moe|moi|mom|monash|money|monster|mormon|mortgage|moscow|moto|motorcycles|mov|movie|mp|mq|mr>gov|ms>com,edu,gov,net,org|msd|mt>com,edu,net,org|mtn|mtr|mu>ac,co,com,gov,net,or,org|museum>academy,agriculture,air,airguard,alabama,alaska,amber,ambulance,american,americana,americanantiques,americanart,amsterdam,and,annefrank,anthro,anthropology,antiques,aquarium,arboretum,archaeological,archaeology,architecture,art,artanddesign,artcenter,artdeco,arteducation,artgallery,arts,artsandcrafts,asmatart,assassination,assisi,association,astronomy,atlanta,austin,australia,automotive,aviation,axis,badajoz,baghdad,bahn,bale,baltimore,barcelona,baseball,basel,baths,bauern,beauxarts,beeldengeluid,bellevue,bergbau,berkeley,berlin,bern,bible,bilbao,bill,birdart,birthplace,bonn,boston,botanical,botanicalgarden,botanicgarden,botany,brandywinevalley,brasil,bristol,british,britishcolumbia,broadcast,brunel,brussel,brussels,bruxelles,building,burghof,bus,bushey,cadaques,california,cambridge,can,canada,capebreton,carrier,cartoonart,casadelamoneda,castle,castres,celtic,center,chattanooga,cheltenham,chesapeakebay,chicago,children,childrens,childrensgarden,chiropractic,chocolate,christiansburg,cincinnati,cinema,circus,civilisation,civilization,civilwar,clinton,clock,coal,coastaldefence,cody,coldwar,collection,colonialwilliamsburg,coloradoplateau,columbia,columbus,communication,communications,community,computer,computerhistory,comunicações,contemporary,contemporaryart,convent,copenhagen,corporation,correios-e-telecomunicações,corvette,costume,countryestate,county,crafts,cranbrook,creation,cultural,culturalcenter,culture,cyber,cymru,dali,dallas,database,ddr,decorativearts,delaware,delmenhorst,denmark,depot,design,detroit,dinosaur,discovery,dolls,donostia,durham,eastafrica,eastcoast,education,educational,egyptian,eisenbahn,elburg,elvendrell,embroidery,encyclopedic,england,entomology,environment,environmentalconservation,epilepsy,essex,estate,ethnology,exeter,exhibition,family,farm,farmequipment,farmers,farmstead,field,figueres,filatelia,film,fineart,finearts,finland,flanders,florida,force,fortmissoula,fortworth,foundation,francaise,frankfurt,franziskaner,freemasonry,freiburg,fribourg,frog,fundacio,furniture,gallery,garden,gateway,geelvinck,gemological,geology,georgia,giessen,glas,glass,gorge,grandrapids,graz,guernsey,halloffame,hamburg,handson,harvestcelebration,hawaii,health,heimatunduhren,hellas,helsinki,hembygdsforbund,heritage,histoire,historical,historicalsociety,historichouses,historisch,historisches,history,historyofscience,horology,house,humanities,illustration,imageandsound,indian,indiana,indianapolis,indianmarket,intelligence,interactive,iraq,iron,isleofman,jamison,jefferson,jerusalem,jewelry,jewish,jewishart,jfk,journalism,judaica,judygarland,juedisches,juif,karate,karikatur,kids,koebenhavn,koeln,kunst,kunstsammlung,kunstunddesign,labor,labour,lajolla,lancashire,landes,lans,läns,larsson,lewismiller,lincoln,linz,living,livinghistory,localhistory,london,losangeles,louvre,loyalist,lucerne,luxembourg,luzern,mad,madrid,mallorca,manchester,mansion,mansions,manx,marburg,maritime,maritimo,maryland,marylhurst,media,medical,medizinhistorisches,meeres,memorial,mesaverde,michigan,midatlantic,military,mill,miners,mining,minnesota,missile,missoula,modern,moma,money,monmouth,monticello,montreal,moscow,motorcycle,muenchen,muenster,mulhouse,muncie,museet,museumcenter,museumvereniging,music,national,nationalfirearms,nationalheritage,nativeamerican,naturalhistory,naturalhistorymuseum,naturalsciences,nature,naturhistorisches,natuurwetenschappen,naumburg,naval,nebraska,neues,newhampshire,newjersey,newmexico,newport,newspaper,newyork,niepce,norfolk,north,nrw,nyc,nyny,oceanographic,oceanographique,omaha,online,ontario,openair,oregon,oregontrail,otago,oxford,pacific,paderborn,palace,paleo,palmsprings,panama,paris,pasadena,pharmacy,philadelphia,philadelphiaarea,philately,phoenix,photography,pilots,pittsburgh,planetarium,plantation,plants,plaza,portal,portland,portlligat,posts-and-telecommunications,preservation,presidio,press,project,public,pubol,quebec,railroad,railway,research,resistance,riodejaneiro,rochester,rockart,roma,russia,saintlouis,salem,salvadordali,salzburg,sandiego,sanfrancisco,santabarbara,santacruz,santafe,saskatchewan,satx,savannahga,schlesisches,schoenbrunn,schokoladen,school,schweiz,science,science-fiction,scienceandhistory,scienceandindustry,sciencecenter,sciencecenters,sciencehistory,sciences,sciencesnaturelles,scotland,seaport,settlement,settlers,shell,sherbrooke,sibenik,silk,ski,skole,society,sologne,soundandvision,southcarolina,southwest,space,spy,square,stadt,stalbans,starnberg,state,stateofdelaware,station,steam,steiermark,stjohn,stockholm,stpetersburg,stuttgart,suisse,surgeonshall,surrey,svizzera,sweden,sydney,tank,tcm,technology,telekommunikation,television,texas,textile,theater,time,timekeeping,topology,torino,touch,town,transport,tree,trolley,trust,trustee,uhren,ulm,undersea,university,usa,usantiques,usarts,uscountryestate,usculture,usdecorativearts,usgarden,ushistory,ushuaia,uslivinghistory,utah,uvic,valley,vantaa,versailles,viking,village,virginia,virtual,virtuel,vlaanderen,volkenkunde,wales,wallonie,war,washingtondc,watch-and-clock,watchandclock,western,westfalen,whaling,wildlife,williamsburg,windmill,workshop,york,yorkshire,yosemite,youth,zoological,zoology,иком,ירושלים|music|mutual|mv>aero,biz,com,coop,edu,gov,info,int,mil,museum,name,net,org,pro|mw>ac,biz,co,com,coop,edu,gov,int,museum,net,org|mx>com,edu,gob,net,org|my>biz,com,edu,gov,mil,name,net,org|mz>ac,adv,co,edu,gov,mil,net,org|na>ca,cc,co,com,dr,in,info,mobi,mx,name,or,org,pro,school,tv,us,ws|nab|nagoya|name|natura|navy|nba|nc>asso,nom|ne|nec|net|netbank|netflix|network|neustar|new|news|next|nextdirect|nexus|nf>arts,com,firm,info,net,other,per,rec,store,web|nfl|ng>com,edu,gov,i,mil,mobi,name,net,org,sch|ngo|nhk|ni>ac,biz,co,com,edu,gob,in,info,int,mil,net,nom,org,web|nico|nike|nikon|ninja|nissan|nissay|nl|no>aa>gs<aarborte,aejrie,afjord,åfjord,agdenes,ah>gs<akershus>nes<aknoluokta,ákŋoluokta,akrehamn,åkrehamn,al,ål,alaheadju,álaheadju,alesund,ålesund,algard,ålgård,alstahaug,alta,áltá,alvdal,amli,åmli,amot,åmot,andasuolo,andebu,andoy,andøy,ardal,årdal,aremark,arendal,arna,ås,aseral,åseral,asker,askim,askoy,askøy,askvoll,asnes,åsnes,audnedaln,aukra,aure,aurland,aurskog-holand,aurskog-høland,austevoll,austrheim,averoy,averøy,badaddja,bådåddjå,bærum,bahcavuotna,báhcavuotna,bahccavuotna,báhccavuotna,baidar,báidár,bajddar,bájddar,balat,bálát,balestrand,ballangen,balsfjord,bamble,bardu,barum,batsfjord,båtsfjord,bearalvahki,bearalváhki,beardu,beiarn,berg,bergen,berlevag,berlevåg,bievat,bievát,bindal,birkenes,bjarkoy,bjarkøy,bjerkreim,bjugn,bodo,bodø,bokn,bomlo,bømlo,bremanger,bronnoy,brønnøy,bronnoysund,brønnøysund,brumunddal,bryne,bu>gs<budejju,buskerud>nes<bygland,bykle,cahcesuolo,čáhcesuolo,davvenjarga,davvenjárga,davvesiida,deatnu,dep,dielddanuorri,divtasvuodna,divttasvuotna,donna,dønna,dovre,drammen,drangedal,drobak,drøbak,dyroy,dyrøy,egersund,eid,eidfjord,eidsberg,eidskog,eidsvoll,eigersund,elverum,enebakk,engerdal,etne,etnedal,evenassi,evenášši,evenes,evje-og-hornnes,farsund,fauske,fedje,fet,fetsund,fhs,finnoy,finnøy,fitjar,fjaler,fjell,fla,flå,flakstad,flatanger,flekkefjord,flesberg,flora,floro,florø,fm>gs<folkebibl,folldal,forde,førde,forsand,fosnes,fræna,frana,fredrikstad,frei,frogn,froland,frosta,froya,frøya,fuoisku,fuossko,fusa,fylkesbibl,fyresdal,gaivuotna,gáivuotna,galsa,gálsá,gamvik,gangaviika,gáŋgaviika,gaular,gausdal,giehtavuoatna,gildeskal,gildeskål,giske,gjemnes,gjerdrum,gjerstad,gjesdal,gjovik,gjøvik,gloppen,gol,gran,grane,granvin,gratangen,grimstad,grong,grue,gulen,guovdageaidnu,ha,hå,habmer,hábmer,hadsel,hægebostad,hagebostad,halden,halsa,hamar,hamaroy,hammarfeasta,hámmárfeasta,hammerfest,hapmir,hápmir,haram,hareid,harstad,hasvik,hattfjelldal,haugesund,hedmark>os,valer,våler<hemne,hemnes,hemsedal,herad,hitra,hjartdal,hjelmeland,hl>gs<hm>gs<hobol,hobøl,hof,hokksund,hol,hole,holmestrand,holtalen,holtålen,honefoss,hønefoss,hordaland>os<hornindal,horten,hoyanger,høyanger,hoylandet,høylandet,hurdal,hurum,hvaler,hyllestad,ibestad,idrett,inderoy,inderøy,iveland,ivgu,jan-mayen>gs<jessheim,jevnaker,jolster,jølster,jondal,jorpeland,jørpeland,kafjord,kåfjord,karasjohka,kárášjohka,karasjok,karlsoy,karmoy,karmøy,kautokeino,kirkenes,klabu,klæbu,klepp,kommune,kongsberg,kongsvinger,kopervik,kraanghke,kråanghke,kragero,kragerø,kristiansand,kristiansund,krodsherad,krødsherad,krokstadelva,kvæfjord,kvænangen,kvafjord,kvalsund,kvam,kvanangen,kvinesdal,kvinnherad,kviteseid,kvitsoy,kvitsøy,laakesvuemie,lærdal,lahppi,láhppi,langevag,langevåg,lardal,larvik,lavagis,lavangen,leangaviika,leaŋgaviika,lebesby,leikanger,leirfjord,leirvik,leka,leksvik,lenvik,lerdal,lesja,levanger,lier,lierne,lillehammer,lillesand,lindas,lindås,lindesnes,loabat,loabát,lodingen,lødingen,lom,loppa,lorenskog,lørenskog,loten,løten,lund,lunner,luroy,lurøy,luster,lyngdal,lyngen,malatvuopmi,málatvuopmi,malselv,målselv,malvik,mandal,marker,marnardal,masfjorden,masoy,måsøy,matta-varjjat,mátta-várjjat,meland,meldal,melhus,meloy,meløy,meraker,meråker,midsund,midtre-gauldal,mil,mjondalen,mjøndalen,mo-i-rana,moareke,moåreke,modalen,modum,molde,more-og-romsdal>heroy,sande<møre-og-romsdal>herøy,sande<mosjoen,mosjøen,moskenes,moss,mosvik,mr>gs<muosat,muosát,museum,naamesjevuemie,nååmesjevuemie,nærøy,namdalseid,namsos,namsskogan,nannestad,naroy,narviika,narvik,naustdal,navuotna,návuotna,nedre-eiker,nesna,nesodden,nesoddtangen,nesseby,nesset,nissedal,nittedal,nl>gs<nord-aurdal,nord-fron,nord-odal,norddal,nordkapp,nordland>bo,bø,heroy,herøy<nordre-land,nordreisa,nore-og-uvdal,notodden,notteroy,nøtterøy,nt>gs<odda,of>gs<oksnes,øksnes,ol>gs<omasvuotna,oppdal,oppegard,oppegård,orkanger,orkdal,orland,ørland,orskog,ørskog,orsta,ørsta,osen,oslo>gs<osoyro,osøyro,osteroy,osterøy,ostfold>valer<østfold>våler<ostre-toten,østre-toten,overhalla,ovre-eiker,øvre-eiker,oyer,øyer,oygarden,øygarden,oystre-slidre,øystre-slidre,porsanger,porsangu,porsáŋgu,porsgrunn,priv,rade,råde,radoy,radøy,rælingen,rahkkeravju,ráhkkerávju,raholt,råholt,raisa,ráisa,rakkestad,ralingen,rana,randaberg,rauma,rendalen,rennebu,rennesoy,rennesøy,rindal,ringebu,ringerike,ringsaker,risor,risør,rissa,rl>gs<roan,rodoy,rødøy,rollag,romsa,romskog,rømskog,roros,røros,rost,røst,royken,røyken,royrvik,røyrvik,ruovat,rygge,salangen,salat,sálat,sálát,saltdal,samnanger,sandefjord,sandnes,sandnessjoen,sandnessjøen,sandoy,sandøy,sarpsborg,sauda,sauherad,sel,selbu,selje,seljord,sf>gs<siellak,sigdal,siljan,sirdal,skanit,skánit,skanland,skånland,skaun,skedsmo,skedsmokorset,ski,skien,skierva,skiervá,skiptvet,skjak,skjåk,skjervoy,skjervøy,skodje,slattum,smola,smøla,snaase,snåase,snasa,snåsa,snillfjord,snoasa,sogndal,sogne,søgne,sokndal,sola,solund,somna,sømna,sondre-land,søndre-land,songdalen,sor-aurdal,sør-aurdal,sor-fron,sør-fron,sor-odal,sør-odal,sor-varanger,sør-varanger,sorfold,sørfold,sorreisa,sørreisa,sortland,sorum,sørum,spjelkavik,spydeberg,st>gs<stange,stat,stathelle,stavanger,stavern,steigen,steinkjer,stjordal,stjørdal,stjordalshalsen,stjørdalshalsen,stokke,stor-elvdal,stord,stordal,storfjord,strand,stranda,stryn,sula,suldal,sund,sunndal,surnadal,svalbard>gs<sveio,svelvik,sykkylven,tana,tananger,telemark>bo,bø<time,tingvoll,tinn,tjeldsund,tjome,tjøme,tm>gs<tokke,tolga,tonsberg,tønsberg,torsken,tr>gs<træna,trana,tranby,tranoy,tranøy,troandin,trogstad,trøgstad,tromsa,tromso,tromsø,trondheim,trysil,tvedestrand,tydal,tynset,tysfjord,tysnes,tysvær,tysvar,ullensaker,ullensvang,ulvik,unjarga,unjárga,utsira,va>gs<vaapste,vadso,vadsø,værøy,vaga,vågå,vagan,vågan,vagsoy,vågsøy,vaksdal,valle,vang,vanylven,vardo,vardø,varggat,várggát,varoy,vefsn,vega,vegarshei,vegårshei,vennesla,verdal,verran,vestby,vestfold>sande<vestnes,vestre-slidre,vestre-toten,vestvagoy,vestvågøy,vevelstad,vf>gs<vgs,vik,vikna,vindafjord,voagat,volda,voss,vossevangen|nokia|northwesternmutual|norton|now|nowruz|nowtv|np>*|nr>biz,com,edu,gov,info,net,org|nra|nrw|ntt|nu|nyc|nz>ac,co,cri,geek,gen,govt,health,iwi,kiwi,maori,māori,mil,net,org,parliament,school|obi|observer|office|okinawa|olayan|olayangroup|oldnavy|ollo|om>co,com,edu,gov,med,museum,net,org,pro|omega|one|ong|onion|onl|online|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa>abo,ac,com,edu,gob,ing,med,net,nom,org,sld|page|panasonic|paris|pars|partners|parts|party|passagens|pay|pccw|pe>com,edu,gob,mil,net,nom,org|pet|pf>com,edu,org|pfizer|pg>*|ph>com,edu,gov,i,mil,net,ngo,org|pharmacy|phd|philips|phone|photo|photography|photos|physio|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk>biz,com,edu,fam,gob,gok,gon,gop,gos,gov,info,net,org,web|pl>agro,aid,atm,augustow,auto,babia-gora,bedzin,beskidy,bialowieza,bialystok,bielawa,bieszczady,biz,boleslawiec,bydgoszcz,bytom,cieszyn,com,czeladz,czest,dlugoleka,edu,elblag,elk,glogow,gmina,gniezno,gorlice,gov>ap,griw,ic,is,kmpsp,konsulat,kppsp,kwp,kwpsp,mup,mw,oirm,oum,pa,pinb,piw,po,psp,psse,pup,rzgw,sa,sdn,sko,so,sr,starostwo,ug,ugim,um,umig,upow,uppo,us,uw,uzs,wif,wiih,winb,wios,witd,wiw,wsa,wskr,wuoz,wzmiuw,zp<grajewo,gsm,ilawa,info,jaworzno,jelenia-gora,jgora,kalisz,karpacz,kartuzy,kaszuby,katowice,kazimierz-dolny,kepno,ketrzyn,klodzko,kobierzyce,kolobrzeg,konin,konskowola,kutno,lapy,lebork,legnica,lezajsk,limanowa,lomza,lowicz,lubin,lukow,mail,malbork,malopolska,mazowsze,mazury,media,miasta,mielec,mielno,mil,mragowo,naklo,net,nieruchomosci,nom,nowaruda,nysa,olawa,olecko,olkusz,olsztyn,opoczno,opole,org,ostroda,ostroleka,ostrowiec,ostrowwlkp,pc,pila,pisz,podhale,podlasie,polkowice,pomorskie,pomorze,powiat,priv,prochowice,pruszkow,przeworsk,pulawy,radom,rawa-maz,realestate,rel,rybnik,rzeszow,sanok,sejny,sex,shop,sklep,skoczow,slask,slupsk,sos,sosnowiec,stalowa-wola,starachowice,stargard,suwalki,swidnica,swiebodzin,swinoujscie,szczecin,szczytno,szkola,targi,tarnobrzeg,tgory,tm,tourism,travel,turek,turystyka,tychy,ustka,walbrzych,warmia,warszawa,waw,wegrow,wielun,wlocl,wloclawek,wodzislaw,wolomin,wroclaw,zachpomor,zagan,zarow,zgora,zgorzelec|place|play|playstation|plumbing|plus|pm|pn>co,edu,gov,net,org|pnc|pohl|poker|politie|porn|post|pr>ac,biz,com,edu,est,gov,info,isla,name,net,org,pro,prof|pramerica|praxi|press|prime|pro>aaa,aca,acct,avocat,bar,cpa,eng,jur,law,med,recht|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps>com,edu,gov,net,org,plo,sec|pt>com,edu,gov,int,net,nome,org,publ|pub|pw>belau,co,ed,go,ne,or|pwc|py>com,coop,edu,gov,mil,net,org|qa>com,edu,gov,mil,name,net,org,sch|qpon|quebec|quest|racing|radio|re>asso,com,nom|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|ril|rio|rip|ro>arts,com,firm,info,nom,nt,org,rec,store,tm,www|rocher|rocks|rodeo|rogers|room|rs>ac,co,edu,gov,in,org|rsvp|ru|rugby|ruhr|run|rw>ac,co,coop,gov,mil,net,org|rwe|ryukyu|sa>com,edu,gov,med,net,org,pub,sch|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sarl|sas|save|saxo|sb>com,edu,gov,net,org|sbi|sbs|sc>com,edu,gov,net,org|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scot|sd>com,edu,gov,info,med,net,org,tv|se>a,ac,b,bd,brand,c,d,e,f,fh,fhsk,fhv,g,h,i,k,komforb,kommunalforbund,komvux,l,lanbib,m,n,naturbruksgymn,o,org,p,parti,pp,press,r,s,t,tm,u,w,x,y,z|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg>com,edu,gov,net,org,per|sh>com,gov,mil,net,org|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl>com,edu,gov,net,org|sling|sm|smart|smile|sn>art,com,edu,gouv,org,perso,univ|sncf|so>com,edu,gov,me,net,org|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|spa|space|sport|spot|sr|srl|ss>biz,com,edu,gov,me,net,org,sch|st>co,com,consulado,edu,embaixada,mil,net,org,principe,saotome,store|stada|staples|star|statebank|statefarm|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv>com,edu,gob,org,red|swatch|swiss|sx>gov|sy>com,edu,gov,mil,net,org|sydney|systems|sz>ac,co,org|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|temasek|tennis|teva|tf|tg|th>ac,co,go,in,mi,net,or|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj>ac,biz,co,com,edu,go,gov,int,mil,name,net,nic,org,test,web|tjmaxx|tjx|tk|tkmaxx|tl>gov|tm>co,com,edu,gov,mil,net,nom,org|tmall|tn>com,ens,fin,gov,ind,info,intl,mincom,nat,net,org,perso,tourism|to>com,edu,gov,mil,net,org|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr>av,bbs,bel,biz,com,dr,edu,gen,gov,info,k12,kep,mil,name,nc>gov<net,org,pol,tel,tsk,tv,web|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt>aero,biz,co,com,coop,edu,gov,info,int,jobs,mobi,museum,name,net,org,pro,travel|tube|tui|tunes|tushu|tv|tvs|tw>club,com,ebiz,edu,game,gov,idv,mil,net,org,商業,組織,網路|tz>ac,co,go,hotel,info,me,mil,mobi,ne,or,sc,tv|ua>cherkassy,cherkasy,chernigov,chernihiv,chernivtsi,chernovtsy,ck,cn,com,cr,crimea,cv,dn,dnepropetrovsk,dnipropetrovsk,donetsk,dp,edu,gov,if,in,ivano-frankivsk,kh,kharkiv,kharkov,kherson,khmelnitskiy,khmelnytskyi,kiev,kirovograd,km,kr,krym,ks,kv,kyiv,lg,lt,lugansk,lutsk,lv,lviv,mk,mykolaiv,net,nikolaev,od,odesa,odessa,org,pl,poltava,rivne,rovno,rv,sb,sebastopol,sevastopol,sm,sumy,te,ternopil,uz,uzhgorod,vinnica,vinnytsia,vn,volyn,yalta,zaporizhzhe,zaporizhzhia,zhitomir,zhytomyr,zp,zt|ubank|ubs|ug>ac,co,com,go,ne,or,org,sc|uk>ac,co,gov,ltd,me,net,nhs,org,plc,police,sch>*|unicom|university|uno|uol|ups|us>ak>cc,k12,lib<al>cc,k12,lib<ar>cc,k12,lib<as>cc,k12,lib<az>cc,k12,lib<ca>cc,k12,lib<co>cc,k12,lib<ct>cc,k12,lib<dc>cc,k12,lib<de>cc,k12<dni,fed,fl>cc,k12,lib<ga>cc,k12,lib<gu>cc,k12,lib<hi>cc,lib<ia>cc,k12,lib<id>cc,k12,lib<il>cc,k12,lib<in>cc,k12,lib<isa,kids,ks>cc,k12,lib<ky>cc,k12,lib<la>cc,k12,lib<ma>cc,k12>chtr,paroch,pvt<lib<md>cc,k12,lib<me>cc,k12,lib<mi>ann-arbor,cc,cog,dst,eaton,gen,k12,lib,mus,tec,washtenaw<mn>cc,k12,lib<mo>cc,k12,lib<ms>cc,k12,lib<mt>cc,k12,lib<nc>cc,k12,lib<nd>cc,lib<ne>cc,k12,lib<nh>cc,k12,lib<nj>cc,k12,lib<nm>cc,k12,lib<nsn,nv>cc,k12,lib<ny>cc,k12,lib<oh>cc,k12,lib<ok>cc,k12,lib<or>cc,k12,lib<pa>cc,k12,lib<pr>cc,k12,lib<ri>cc,lib<sc>cc,k12,lib<sd>cc,lib<tn>cc,k12,lib<tx>cc,k12,lib<ut>cc,k12,lib<va>cc,k12,lib<vi>cc,k12,lib<vt>cc,k12,lib<wa>cc,k12,lib<wi>cc,k12,lib<wv>cc<wy>cc,k12,lib|uy>com,edu,gub,mil,net,org|uz>co,com,net,org|va|vacations|vana|vanguard|vc>com,edu,gov,mil,net,org|ve>arts,bib,co,com,e12,edu,firm,gob,gov,info,int,mil,net,nom,org,rar,rec,store,tec,web|vegas|ventures|verisign|vermögensberater|vermögensberatung|versicherung|vet|vg|vi>co,com,k12,net,org|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|viva|vivo|vlaanderen|vn>ac,biz,com,edu,gov,health,info,int,name,net,org,pro|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu>com,edu,net,org|vuelos|wales|walmart|walter|wang|wanggou|watch|watches|weather|weatherchannel|webcam|weber|website|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws>com,edu,gov,net,org|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye>com,edu,gov,mil,net,org|yodobashi|yoga|yokohama|you|youtube|yt|yun|za>ac,agric,alt,co,edu,gov,grondar,law,mil,net,ngo,nic,nis,nom,org,school,tm,web|zappos|zara|zero|zip|zm>ac,biz,co,com,edu,gov,info,mil,net,org,sch|zone|zuerich|zw>ac,co,gov,mil,org|ελ|ευ|бг|бел|дети|ею|католик|ком|қаз|мкд|мон|москва|онлайн|орг|рус|рф|сайт|срб>ак,обр,од,орг,пр,упр|укр|გე|հայ|ישראל>אקדמיה,ישוב,ממשל,צהל|קום|ابوظبي|اتصالات|ارامكو|الاردن|البحرين|الجزائر|السعودية|السعوديه|السعودیة|السعودیۃ|العليان|المغرب|اليمن|امارات|ايران|ایران|بارت|بازار|بھارت|بيتك|پاكستان|پاکستان|ڀارت|تونس|سودان|سوريا|سورية|شبكة|عراق|عرب|عمان|فلسطين|قطر|كاثوليك|كوم|مصر|مليسيا|موريتانيا|موقع|همراه|कॉम|नेट|भारत|भारतम्|भारोत|संगठन|বাংলা|ভারত|ভাৰত|ਭਾਰਤ|ભારત|ଭାରତ|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ಭಾರತ|ഭാരതം|ලංකා|คอม|ไทย>ทหาร,ธุรกิจ,เน็ต,รัฐบาล,ศึกษา,องค์กร|ລາວ|닷넷|닷컴|삼성|한국|アマゾン|グーグル|クラウド|コム|ストア|セール|ファッション|ポイント|みんな|世界|中信|中国|中國|中文网|亚马逊|企业|佛山|信息|健康|八卦|公司|公益|台湾|台灣|商城|商店|商标|嘉里|嘉里大酒店|在线|大拿|天主教|娱乐|家電|广东|微博|慈善|我爱你|手机|招聘|政务|政府|新加坡|新闻|时尚|書籍|机构|淡马锡|游戏|澳門|澳门|点看|移动|组织机构|网址|网店|网站|网络|联通|臺灣|诺基亚|谷歌|购物|通販|集团|電訊盈科|飞利浦|食品|餐厅|香格里拉|香港>個人,公司,政府,教育,組織,網絡"}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const parse = __webpack_require__(7);

module.exports = parse(__webpack_require__(36).trie);


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = {"trie":"ac>drr|academy>official|ae>blogspot|ai>uwu|al>blogspot|am>blogspot,neko,nyaa,radio|app>beget>*<bookonline,clerk,clerkstage,deta,developer>*<easypanel,edgecompute,encr,fireweb,framer,hasura,loginline,messerli,netlify,noop,northflank>*<ondigitalocean,onflashdrive,platform0,run>a<telebit,typedream,vercel,web,wnext|ar>com>blogspot|asia>cloudns|at>12hp,2ix,4lima,biz,co>blogspot<funkfeuer>wien<futurecms>*,ex>*<in>*<<futurehosting,futuremailing,info,lima-city,myspreadshop,ortsinfo>ex>*<kunden>*<<priv|au>com>blogspot,cloudlets>mel<myspreadshop|ax>be,cat,es,eu,gg,mc,us,xy|ba>blogspot,rs|basketball>aus,nz|be>blogspot,interhostsolutions>cloud<kuleuven>ezproxy<myspreadshop,transurl>*<webhosting|bg>barsy,blogspot|biz>cloudns,dscloud,dyndns,for-better,for-more,for-some,for-the,jozi,mmafan,myftp,no-ip,orx,selfip,webhop|bj>blogspot|bn>co|br>com>blogspot,virtualcloud>scale>users<<<leg>ac,al,am,ap,ba,ce,df,es,go,ma,mg,ms,mt,pa,pb,pe,pi,pr,rj,rn,ro,rr,rs,sc,se,sp,to|bs>we|builders>cloudsite|business>co|by>com>blogspot<mediatech,mycloud|bz>gsj,za|ca>awdev>*<barsy,blogspot,co,myspreadshop,no-ip|casa>nabu>ui|cc>cloudns,csx,fantasyleague,ftpaccess,game-server,myphotos,scrapping,spawn>instances<twmail|cf>blogspot|ch>12hp,2ix,4lima,blogspot,dnsking,firenet>*,svc>*<<flow>ae>alp1<appengine<gotdns,lima-city,linkyard-cloud,myspreadshop,square7|ci>fin,nl|cl>blogspot|cloud>axarnet>es-1<banzai>*<diadem,elementor,encoway>eu<jelastic>vip<jele,jenv-aruba>aruba>eur>it1<<it1<jotelulu,keliweb>cs<kuleuven,linkyard,magentosite>*<on-rancher>*<oxa>tn,uk<perspecta,primetel>uk<ravendb,reclaim>ca,uk,us<scw>baremetal>fr-par-1,fr-par-2,nl-ams-1<fr-par>fnc>functions<k8s>nodes<s3,s3-website,whm<instances>priv,pub<k8s,nl-ams>k8s>nodes<s3,s3-website,whm<pl-waw>k8s>nodes<s3,s3-website<scalebook,smartlabeling<sensiosite>*<statics>*<trafficplex,trendhosting>ch,de<urown,vapor,voorloper|club>barsy,cloudns,jele,pony|cn>com>amazonaws>cn-north-1>s3<compute>*<eb>cn-north-1,cn-northwest-1<elb>*<<<instantcloud,quickconnect>direct|co>carrd,com>blogspot<crd,leadpages,lpages,mypi,n4t,otap>*<repl>id<supabase|codes>owo>*|com>001www,0emm>*<1kapp,3utilities,4u,adobeaemcloud>dev>*<<africa,airkitapps,airkitapps-au,aivencloud,alpha-myqnapcloud,amazonaws>ap-northeast-1>dualstack>s3<<ap-northeast-2>dualstack>s3<s3,s3-website<ap-south-1>dualstack>s3<s3,s3-website<ap-southeast-1>dualstack>s3<<ap-southeast-2>dualstack>s3<<ca-central-1>dualstack>s3<s3,s3-website<compute>*<compute-1>*<elb>*<eu-central-1>dualstack>s3<s3,s3-website<eu-west-1>dualstack>s3<<eu-west-2>dualstack>s3<s3,s3-website<eu-west-3>dualstack>s3<s3,s3-website<s3,s3-ap-northeast-1,s3-ap-northeast-2,s3-ap-south-1,s3-ap-southeast-1,s3-ap-southeast-2,s3-ca-central-1,s3-eu-central-1,s3-eu-west-1,s3-eu-west-2,s3-eu-west-3,s3-external-1,s3-fips-us-gov-west-1,s3-sa-east-1,s3-us-east-2,s3-us-gov-west-1,s3-us-west-1,s3-us-west-2,s3-website-ap-northeast-1,s3-website-ap-southeast-1,s3-website-ap-southeast-2,s3-website-eu-west-1,s3-website-sa-east-1,s3-website-us-east-1,s3-website-us-west-1,s3-website-us-west-2,sa-east-1>dualstack>s3<<us-east-1>dualstack>s3<<us-east-2>dualstack>s3<s3,s3-website<<amscompute,appchizi,applinzi,appspacehosted,appspaceusercontent,appspot>r>*<<ar,authgear-staging,authgearapps,awsglobalaccelerator,awsmppl,balena-devices,barsycenter,barsyonline,betainabox,blogdns,blogspot,blogsyte,bloxcms,bounty-full>alpha,beta<boutir,bplaced,br,builtwithdark,cafjs,cechire,ciscofreak,clicketcloud,cloudcontrolapp,cloudcontrolled,cn,co,code>builder>*<dev-builder>*<stg-builder>*<<codespot,customer-oci>*,oci>*<ocp>*<ocs>*<<damnserver,datadetect>demo,instance<dattolocal,dattorelay,dattoweb,ddns5,ddnsfree,ddnsgeek,ddnsking,ddnslive,de,dev-myqnapcloud,devcdnaccesso>*<digitaloceanspaces>*<discordsays,discordsez,ditchyourip,dnsalias,dnsdojo,dnsiskinky,doesntexist,dontexist,doomdns,dopaas,drayddns,dreamhosters,dsmynas,dyn-o-saur,dynalias,dyndns-at-home,dyndns-at-work,dyndns-blog,dyndns-free,dyndns-home,dyndns-ip,dyndns-mail,dyndns-office,dyndns-pics,dyndns-remote,dyndns-server,dyndns-web,dyndns-wiki,dyndns-work,dynns,elasticbeanstalk>ap-northeast-1,ap-northeast-2,ap-northeast-3,ap-south-1,ap-southeast-1,ap-southeast-2,ca-central-1,eu-central-1,eu-west-1,eu-west-2,eu-west-3,sa-east-1,us-east-1,us-east-2,us-gov-west-1,us-west-1,us-west-2<encoreapi,est-a-la-maison,est-a-la-masion,est-le-patron,est-mon-blogueur,eu,evennode>eu-1,eu-2,eu-3,eu-4,us-1,us-2,us-3,us-4<familyds,fastly-terrarium,fastvps-server,fbsbx>apps<firebaseapp,firewall-gateway,fldrv,forgeblocks,framercanvas,freebox-os,freeboxos,freemyip,from-ak,from-al,from-ar,from-ca,from-ct,from-dc,from-de,from-fl,from-ga,from-hi,from-ia,from-id,from-il,from-in,from-ks,from-ky,from-ma,from-md,from-mi,from-mn,from-mo,from-ms,from-mt,from-nc,from-nd,from-ne,from-nh,from-nj,from-nm,from-nv,from-oh,from-ok,from-or,from-pa,from-pr,from-ri,from-sc,from-sd,from-tn,from-tx,from-ut,from-va,from-vt,from-wa,from-wi,from-wv,from-wy,geekgalaxy,gentapps,gentlentapis,getmyip,giize,githubusercontent,gleeze,googleapis,googlecode,gotdns,gotpantheon,gr,health-carereform,herokuapp,herokussl,hidora,hk,hobby-site,homelinux,homesecuritymac,homesecuritypc,homeunix,hosted-by-previder>paas<hostedpi,hosteur>rag-cloud,rag-cloud-ch<hotelwithflight,hu,iamallama,ik-server>jcloud,jcloud-ver-jpc<impertrix,impertrixcdn,is-a-anarchist,is-a-blogger,is-a-bookkeeper,is-a-bulls-fan,is-a-caterer,is-a-chef,is-a-conservative,is-a-cpa,is-a-cubicle-slave,is-a-democrat,is-a-designer,is-a-doctor,is-a-financialadvisor,is-a-geek,is-a-green,is-a-guru,is-a-hard-worker,is-a-hunter,is-a-landscaper,is-a-lawyer,is-a-liberal,is-a-libertarian,is-a-llama,is-a-musician,is-a-nascarfan,is-a-nurse,is-a-painter,is-a-personaltrainer,is-a-photographer,is-a-player,is-a-republican,is-a-rockstar,is-a-socialist,is-a-student,is-a-teacher,is-a-techie,is-a-therapist,is-an-accountant,is-an-actor,is-an-actress,is-an-anarchist,is-an-artist,is-an-engineer,is-an-entertainer,is-certified,is-gone,is-into-anime,is-into-cars,is-into-cartoons,is-into-games,is-leet,is-not-certified,is-slick,is-uberleet,is-with-theband,isa-geek,isa-hockeynut,issmarterthanyou,jdevcloud,jelastic>demo<joyent>cns>*<<jpn,kasserver,kilatiron,kozow,kr,ktistory,likes-pie,likescandy,linode>members,nodebalancer>*<<linodeobjects>*<linodeusercontent>ip<lmpm>app<logoip,loseyourip,lpusercontent,massivegrid>paas<mazeplay,messwithdns,meteorapp>eu<mex,miniserver,myactivedirectory,myasustor,mydatto,mydobiss,mydrobo,myiphost,myqnapcloud,myravendb,mysecuritycamera,myshopblocks,myshopify,myspreadshop,mythic-beasts>caracal,customer,fentiger,lynx,ocelot,oncilla,onza,sphinx,vs,x,yali<mytuleap,myvnc,neat-url,net-freaks,nfshost,no,nospamproxy>cloud<observableusercontent>static<on-aptible,onfabrica,onrender,onthewifi,ooguy,operaunite,orsites,outsystemscloud,ownprovider,pagefrontapp,pagespeedmobilizer,pagexl,paywhirl>*<pgfog,pixolino,platter-app,playstation-cloud,pleskns,point2this,postman-echo,prgmr>xen<publishproxy,pythonanywhere>eu<qa2,qbuser,qc,qualifioapp,quicksytes,quipelements>*<rackmaze,remotewd,render>app<reservd,reserve-online,rhcloud,ru,sa,saves-the-whales,scrysec,securitytactics,selfip,sells-for-less,sells-for-u,servebbs,servebeer,servecounterstrike,serveexchange,serveftp,servegame,servehalflife,servehttp,servehumour,serveirc,servemp3,servep2p,servepics,servequake,servesarcasm,shopitsite,siiites,simple-url,sinaapp,skygearapp,smushcdn,space-to-rent,stackhero-network,stdlib>api<streamlitapp,stufftoread,tb-hosting>site<teaches-yoga,temp-dns,theworkpc,thingdustdata,townnews-staging,try-snowplow,trycloudflare,tuleap-partners,typeform>pro<uk,unusualperson,us,uy,vipsinaapp,vultrobjects>*<wafaicloud>jed,lon,ryd<wafflecell,wiardweb>pages<withgoogle,withyoutube,wixsite,woltlab-demo,workisboring,wpdevcloud,wpenginepowered>js<wphostedmail,wpmucdn,writesthisblog,xnbay>u2,u2-local<yolasite,za|community>myforum,nog,ravendb|cool>de,elementor|cv>blogspot|cx>ath,info|cy>com>blogspot,scaleforce>j|cz>blogspot,co,e4,metacentrum>cloud>*<custom<muni>cloud>flt,usr<<realm|de>12hp,2ix,4lima,barsy,blogspot,bplaced,com,community-pro,cosidns>dyn<dd-dns,ddnss>dyn,dyndns<diskussionsbereich,dnshome,dnsupdater,dray-dns,draydns,dyn-berlin,dyn-ip24,dyn-vpn,dynamisches-dns,dyndns1,dynvpn,firewall-gateway,frusky>*<fuettertdasnetz,git-repos,goip,günstigbestellen,günstigliefern,home-webserver>dyn<hs-heilbronn>it>pages<<in-berlin,in-brb,in-butter,in-dsl,in-vpn,internet-dns,iservschule,isteingeek,istmein,keymachine,l-o-g-i-n,lcube-server,lebtimnetz,leitungsen,lima-city,logoip,mein-iserv,mein-vigor,my-gateway,my-router,my-vigor,my-wan,myhome-server,myspreadshop,schulplattform,schulserver,spdns,speedpartner>customer<square7,svn-repos,syno-ds,synology-diskstation,synology-ds,taifun-dns,test-iserv,traeumtgerade,uberspace>*<virtual-user,virtualuser|design>bss|dev>curv,deno,deno-staging,deta,fly,gateway>*<githubpreview,iserv,lcl>*<lclstage>*<localcert>user>*<<loginline,mediatech,pages,platter-app,shiftcrypto,stg>*<stgstage>*<vercel,webhare>*<workers|digital>cloudapps>london|dk>biz,blogspot,co,firm,myspreadshop,reg,store|earth>dapps>*,bzz>*|ec>base,official|edu>rit>git-pages|education>co|ee>com>blogspot|eg>com>blogspot|es>com>blogspot<myspreadshop|estate>compute>*|eu>airkitapps,barsy,cloudns,diskstation,dogado>jelastic<mycd,spdns,transurl>*<wellbeingzone|eus>party>user|events>co,koobin|faith>ybo|farm>storj|fashion>of|fi>blogspot,cloudplatform>fi<datacenter>demo,paas<dy,häkkinen,iki,kapsi,myspreadshop|financial>co|fm>radio|fr>blogspot,chirurgiens-dentistes-en-france,dedibox,en-root,fbx-os,fbxos,freebox-os,freeboxos,goupile,myspreadshop,on-web,ynh|gdn>cnpy|gg>cya,kaas,panel>daemon|gl>biz,xx|goog>cloud,translate,usercontent>*|gp>app|gr>blogspot|group>discourse|gt>blog,de,to|gy>be|health>hra|hk>blogspot,inc,ltd,secaas|hn>cc|host>cloudaccess,easypanel,fastvps,freesite,half,jele,mircloud,myfast,pcloud,tempurl,wpmudev|hosting>opencraft|hr>blogspot,free|hu>blogspot|id>co>blogspot<flap,forte,my>rss>*|ie>blogspot,myspreadshop|il>co>blogspot,ravpage,tabitorder|im>ro|in>barsy,blogspot,cloudns,supabase,web|info>barrel-of-knowledge,barrell-of-knowledge,barsy,cloudns,dnsupdate,dvrcam,dynamic-dns,dyndns,for-our,forumz,groks-the,groks-this,here-for-more,ilovecollege,knowsitall,mayfirst,no-ip,nsupdate,selfip,v-info,webhop|io>2038,apigee,azurecontainer>*<b-data,backplaneapp,banzaicloud>app,backyards>*<<barsy,basicserver,beagleboard,beebyte>paas<beebyteapp>sekd1<bigv>uk0<bitbucket,bluebite,boxfuse,browsersafetymark,cleverapps,dappnode>dyndns<dedyn,definima,drud,dyn53,editorx,edugit,fh-muenster,forgerock>id<ghost,github,gitlab,hasura-app,hostyhosting,hzc,jele,lair>apps<loginline,lolipop,mo-siemens,moonscale>*<musician,ngrok,nid,nodeart>stage<on-k3s>*<on-rio>*<pantheonsite,protonet,pstmn>mock<qcx>sys>*<<qoto,readthedocs,resindevice,resinstaging>devices<s5y>*<sandcats,shiftcrypto,shiftedit,shw,spacekit,stolos>*<telebit,thingdust>dev>cust,reservd<disrec>cust,reservd<prod>cust<testing>cust,reservd<<tickets,unispace>cloud-fr1<upli,utwente,vaporcloud,vbrplsbx>g<virtualserver,webthings,wedeploy|is>blogspot,cupcake|it>16-b,32-b,64-b,blogspot,ibxos,iliadboxos,myspreadshop,neen>jc<syncloud,tim>open>jelastic>cloud|je>of|jp>angry,babyblue,babymilk,backdrop,bambina,bitter,blogspot,blush,boo,boy,boyfriend,but,buyshop,candypop,capoo,catfood,cheap,chicappa,chillout,chips,chowder,chu,ciao,cocotte,coolblog,cranky,cutegirl,daa,deca,deci,digick,egoism,fakefur,fashionstore,fem,flier,floppy,fool,frenchkiss,girlfriend,girly,gloomy,gonna,greater,hacca,handcrafted,heavy,her,hiho,hippy,holy,hungry,icurus,itigo,jellybean,kawaiishop,kikirara,kill,kilo,kuron,littlestar,lolipopmc,lolitapunk,lomo,lovepop,lovesick,main,mods,mond,mongolian,moo,namaste,ne>aseinet>user<gehirn<nikita,nobushi,noor,oops,parallel,parasite,pecori,peewee,penne,pepper,perma,pigboat,pinoko,punyu,pupu,pussycat,pya,raindrop,readymade,sadist,schoolbus,secret,staba,stripper,sub,sunnyday,supersale,theshop,thick,tonkotsu,under,upper,usercontent,velvet,verse,versus,vivian,watson,weblike,whitesnow,zombie|ke>co>blogspot|kg>blog,io,jp,tv,uk,us|kr>blogspot|krd>co,edu|kz>jcloud,kazteleport>upaas|la>bnr,c|land>static>dev,sites|lc>oy|li>blogspot,caa|link>cyon,dweb>*<mypep|live>hlx|lol>omg|london>in,of|ls>de|lt>blogspot|lu>blogspot|management>router|marketing>from,with|md>at,blogspot,de,jp,to|me>barsy,brasilia,c66,daplie>localhost<ddns,diskstation,dnsfor,dscloud,edgestack,filegear,filegear-au,filegear-de,filegear-gb,filegear-ie,filegear-jp,filegear-sg,glitch,hopto,i234,loginto,lohmus,mcdir,mcpe,myds,nohost,noip,ravendb,soundcast,synology,tbits,tcp4,transip>site<vp4,webhop,wedeploy,yombo|media>framer|men>for,repair|menu>barsy|mk>blogspot|mn>nyc|mobi>barsy,dscloud|mom>and,for|mp>ju|mr>blogspot|ms>lab,minisite|mt>com>blogspot|mx>blogspot|my>blogspot|name>her>forgot<his>forgot|net>adobeaemcloud,alwaysdata,appudo,at-band-camp,atlassian-dev>prod>cdn<<azure-mobile,azurestaticapps>1,centralus,eastasia,eastus2,westeurope,westus2<azurewebsites,bar0,bar1,bar2,barsy,bitbridge,blackbaudcdn,blogdns,boomla,bounceme,bplaced,broke-it,buyshouses,casacam,cdn-edges,cdn77>r<cdn77-ssl,channelsdvr>u<clickrising,cloudaccess,cloudapp,cloudfront,cloudfunctions,cloudjiffy>fra1-de,west1-us<cloudycluster,community-pro,cryptonomic>*<dattolocal,ddns,debian,definima,dnsalias,dnsdojo,dnsup,does-it,dontexist,dsmynas,dynalias,dynathome,dynu,dynv6,eating-organic,edgeapp,elastx>jls-sto1,jls-sto2,jls-sto3<endofinternet,familyds,fastly>freetls,map,prod>a,global<ssl>a,b,global<<fastlylb>map<faststacks,feste-ip,firewall-gateway,flynnhosting,from-az,from-co,from-la,from-ny,gb,gets-it,ham-radio-op,heteml,hicam,homeftp,homeip,homelinux,homeunix,hu,in,in-dsl,in-the-band,in-vpn,iobb,ipifony,is-a-chef,is-a-geek,isa-geek,jp,kicks-ass,kinghost,knx-server,krellian,massivegrid>paas>fr-1,lon-1,lon-2,ny-1,ny-2,sg-1<<meinforum,memset,moonscale,mydatto,mydissent,myeffect,myfritz,mymediapc,mypsx,mysecuritycamera,myspreadshop,nhlfan,no-ip,now-dns,office-on-the,onavstack,ovh>hosting>*<webpaas>*<<ownip,pgafan,podzone,privatizehealthinsurance,rackmaze,redirectme,reserve-online,ru,saveincloud>jelastic,nordeste-idc<scaleforce>j<schokokeks,scrapper-site,se,seidat,selfip,sells-it,senseering,servebbs,serveblog,serveftp,serveminecraft,shopselect,siteleaf,square7,srcf>soc,user<static-access,supabase,sytes,t3l3p0rt,tailscale>beta<thruhere,torproject>pages<ts,tsukaeru>jelastic<twmail,uk,uni5,vpndns,vps-host>jelastic>atl,njs,ric<<webhop,yandexcloud>storage,website<za|network>alces>*<arvo,azimuth,co,tlon|news>noticeable|ng>col,com>blogspot<firm,gen,ltd,ngo|nl>blogspot,cistron,co,demon,gov,hosting-cluster,khplay,myspreadshop,transurl>*|no>blogspot,co,myspreadshop|nu>enterprisecloud,merseine,mine,shacknet|nz>co>blogspot|one>for,homelink,onred>staging<service,under|online>barsy,eero,eero-stage|orange>tech|org>accesscam,ae,altervista,amune>tele<barsy,blogdns,blogsite,bmoattachments,boldlygoingnowhere,cable-modem,camdvr,cdn77>c,rsc<cdn77-secure>origin>ssl<<certmgr,cloudns,collegefan,couchpotatofries,ddnss,diskstation,dnsalias,dnsdojo,doesntexist,dontexist,doomdns,dsmynas,duckdns,dvrdns,dynalias,dyndns>go,home<dynserv,endofinternet,endoftheinternet,eu>al,asso,at,au,be,bg,ca,cd,ch,cn,cy,cz,de,dk,edu,ee,es,fi,fr,gr,hr,hu,ie,il,in,int,is,it,jp,kr,lt,lu,lv,mc,me,mk,mt,my,net,ng,nl,no,nz,paris,pl,pt,q-a,ro,ru,se,si,sk,tr,uk,us<familyds,fedorainfracloud,fedorapeople,fedoraproject>cloud,os>app<stg>os>app<<<freeddns,freedesktop,from-me,game-host,gotdns,hepforge,hk,hobby-site,homedns,homeftp,homelinux,homeunix,hopto,httpbin,in-dsl,in-vpn,is-a-bruinsfan,is-a-candidate,is-a-celticsfan,is-a-chef,is-a-geek,is-a-knight,is-a-linux-user,is-a-patsfan,is-a-soxfan,is-found,is-lost,is-saved,is-very-bad,is-very-evil,is-very-good,is-very-nice,is-very-sweet,isa-geek,js,kicks-ass,mayfirst,misconfused,mlbfan,mozilla-iot,my-firewall,myfirewall,myftp,mysecuritycamera,mywire,nflfan,no-ip,now-dns,pimienta,podzone,poivron,potager,pubtls,read-books,readmyblog,selfip,sellsyourhome,servebbs,serveftp,servegame,small-web,spdns,stuff-4-sale,sweetpepper,teckids>s3<toolforge,tunk,tuxfamily,twmail,ufcfan,us,webhop,webredirect,wmcloud,wmflabs,za,zapto|ovh>nerdpol|page>codeberg,hlx,hlx3,magnet,pdns,plesk,prvcy,rocky,translated|party>ybo|pe>blogspot|photos>framer|pictures>1337|pl>art,beep,co,ecommerce-shop,gda,gdansk,gdynia,gliwice,homesklep,krakow,krasnik,leczna,lubartow,lublin,med,myspreadshop,poniatowa,poznan,sdscloud,shoparena,sopot,swidnik,unicloud,wroc,zakopane|place>co|pm>name,own|porn>indie|pro>barsy,cloudns,dnstrace>bci|pt>blogspot|pub>barsy|pw>cloudns,x443|qa>blogspot|re>blogspot|review>ybo|rip>clan|ro>barsy,blogspot,co,shop|rocks>lima-city,myddns,webspace|rs>blogspot,brendly>shop<ox,ua|ru>ac,adygeya,bashkiria,bir,blogspot,cbg,cldmail>hb<com,dagestan,edu,eurodir,gov,grozny,int,kalmykia,kustanai,lk3,marine,mcdir>vps<mcpre,mil,mircloud,mordovia,msk,myjino>hosting>*<landing>*<spectrum>*<vps>*<<mytis,na4u,nalchik,net,nov,org,pp,pyatigorsk,ras,regruhosting>jelastic<spb,test,vladikavkaz,vladimir|run>build>*<code>*<database>*<development,hs,migration>*<onporter,ravendb,repl,servers|sale>for|science>ybo|scot>edu,gov>service|se>blogspot,com,conf,iopsys,itcouldbewor,myspreadshop,paba>su|services>loginline|sg>blogspot,enscaled|sh>bip,hashbang,now,platform>bc,ent,eu,us<vxl,wedeploy|shop>barsy,base,hoplix|si>blogspot,gitapp,gitpage|site>barsy,byen,cloudera>*<cyon,fastvps,fnwk,folionetwork,jele,lelux,loginline,mintere,novecore,omniwe,opensocial,platformsh>*<srht,tst>*|sk>blogspot|sn>blogspot|so>sch|solutions>diher>*|space>myfast,uber,xs4all|st>noho|store>sellfy,shopware,storebase|su>abkhazia,adygeya,aktyubinsk,arkhangelsk,armenia,ashgabad,azerbaijan,balashov,bashkiria,bryansk,bukhara,chimkent,dagestan,east-kazakhstan,exnet,georgia,grozny,ivanovo,jambyl,kalmykia,kaluga,karacol,karaganda,karelia,khakassia,krasnodar,kurgan,kustanai,lenug,mangyshlak,mordovia,msk,murmansk,nalchik,navoi,north-kazakhstan,nov,obninsk,penza,pokrovsk,sochi,spb,tashkent,termez,togliatti,troitsk,tselinograd,tula,tuva,vladikavkaz,vladimir,vologda|support>barsy|systems>knightpoint|tc>ch,me,we|td>blogspot|team>discourse,jelastic|technology>co|tf>sch|th>online,shop|tn>orangecloud|to>611,nyan,oya,quickconnect>direct<rdv,vpnplus|today>prequalifyme|top>now-dns,ntdll|tr>com>blogspot|trade>ybo|tv>better-than,dyndns,on-the-web,worse-than|tw>blogspot,com>mymailer<url|ua>biz,cc,co,cx,inf,ltd,pp,v|ug>blogspot|uk>barsy,co>adimo,barsy,barsyonline,blogspot,bytemark>dh,vm<gwiddle,layershift>j<myspreadshop,nh-serv,no-ip,retrosnub>cust<wellbeingzone<conn,copro,gov>api,campaign,homeoffice,service<hosp,independent-commission,independent-inquest,independent-inquiry,independent-panel,independent-review,org>affinitylottery,glug,lug,lugs,raffleentry,weeklylottery<public-inquiry,pymnt,royal-commission|us>cloudns,de>lib<drud,enscaled>phx<freeddns,golffan,graphox,is-by,land-4-sale,mircloud,noip,platterp,pointto,stuff-4-sale|uy>com>blogspot|vc>0e,gv>d|vg>at|vn>blogspot|vu>blog,cn,dev,me|website>framer|wf>biz,sch|wiki>framer|win>that|work>from,to|ws>advisor>*<cloud66,dyndns,mypets|xyz>blogsite,crafting,localzone,telebit>*<zapto|yt>org|za>co>blogspot|zone>cloud66,hs,lima,triton>*|рус>биз,ком,крым,мир,мск,орг,самара,сочи,спб,я"}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  return url.trim().toLowerCase();
}

function normalizeOptions(options) {
  var normalized = !options || _typeof(options) !== "object" ? Object.create(null) : options;

  if ("privateTlds" in normalized === false) {
    normalized.privateTlds = false;
  }

  if ("customTlds" in normalized && normalized.customTlds instanceof RegExp === false) {
    normalized.customTlds = new RegExp("\\.(" + normalized.customTlds.join("|") + ")$");
  }

  return normalized;
}

exports.url = normalizeUrl;
exports.options = normalizeOptions;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var characters = __webpack_require__(8);

function lookUp(trie, domains) {
  var domainsToCheck = domains.slice();
  var topLevel = [];
  var node = trie;

  while (domainsToCheck.length) {
    var domain = domainsToCheck.pop();

    if (node.children.has(characters.WILDCARD)) {
      if (node.children.has(characters.EXCEPTION + domain)) {
        break;
      }

      node = node.children.get(characters.WILDCARD);
    } else {
      if (node.children.has(domain) === false) {
        break;
      }

      node = node.children.get(domain);
    }

    topLevel.unshift(domain);
  }

  return topLevel;
}

module.exports = lookUp;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(40);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(9);
var Axios = __webpack_require__(42);
var defaults = __webpack_require__(4);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(13);
axios.CancelToken = __webpack_require__(57);
axios.isCancel = __webpack_require__(12);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(58);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var utils = __webpack_require__(0);
var InterceptorManager = __webpack_require__(52);
var dispatchRequest = __webpack_require__(53);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(11);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(54);
var isCancel = __webpack_require__(12);
var defaults = __webpack_require__(4);
var isAbsoluteURL = __webpack_require__(55);
var combineURLs = __webpack_require__(56);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(13);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_animejs__ = __webpack_require__(14);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Modification
 * Copyright 2018 Chen Liu, All rights reserved.
 * Copyright 2018 Hextom Inc. All rights reserved.
 */






function __get_animation_class(widget_floating_button_animation) {
  return 'hxt__spm-' + widget_floating_button_animation;
}

function __get_widget(config, shop_plan) {
  var title = config.title,
      text_color = config.text_color,
      background_color = config.background_color,
      button_color = config.button_color,
      widget_floating_button_icon = config.widget_floating_button_icon,
      widget_floating_button_animation = config.widget_floating_button_animation,
      widget_font_style = config.widget_font_style,
      widget_title_font_size = config.widget_title_font_size;


  var widget = document.createElement('div');

  var animation_class = __get_animation_class(widget_floating_button_animation);

  widget.className = 'hextom__spm__widget js-hextom__spm__widget ' + animation_class + ' hxt__spm-ht-animation';
  widget.id = 'spm_subscribe_price_drop_alert';

  widget.style.border = '1px solid ' + button_color;
  // widget.style.borderRightWidth = `0px`;
  widget.style.opacity = 0;
  widget.style.backgroundColor = 'white';

  var svg_src = __get_widget_svg_icon(widget_floating_button_icon);

  var font_family_style = '';

  if (widget_font_style !== 'inherit') {
    font_family_style = 'font-family:' + widget_font_style + ';';
  }

  widget.innerHTML = '\n  <div class="hextom__spm__widget__bell" \n    style="background-color: ' + background_color + ';overflow:hidden;">\n    <div class="hextom__spm__widget__contents js-hextom__spm__widget-contents"\n      style="background-color: ' + background_color + ';position:fixed;left:0px;top:0px">\n      <button class="hextom__spm__widget__toggle js-hextom__spm__widget_title-toggle" style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;">\n        <span class="hextom__spm__widget__title js-hextom__spm__widget-title" id="hextom__spm__widget__title_id" style="color: ' + text_color + ';font-size: ' + widget_title_font_size + 'px;' + font_family_style + '">' + title + '</span>\n        <span class="hextom__spm__widget__shrink" id="hextom__spm__widget__shrink_id" style="color: ' + text_color + ';width: 30px;display:flex;align-items:center;justify-content:flex-start">\n          <span style="background-color:black;height:3px;width:15px;">\n          </span>\n        </span>\n      </button>\n      <div class="hextom__spm__widget__detail" id="spm_subscribe_price_drop_alert_detail">\n        ' + __get_widget_detail_html(config, shop_plan) + '\n      </div>\n    </div>\n    <div class="spm__wrapper__bell js-hextom__spm__widget-toggle" style="display:flex;justify-content:center;align-items:center;height:56px;position:fixed;left:0px;top:0px">\n<!--      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 20px;"><path d="M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71zM67.53 368c21.22-27.97 44.42-74.33 44.53-159.42 0-.2-.06-.38-.06-.58 0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58.11 85.1 23.31 131.46 44.53 159.42H67.53zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64z"/></svg>-->\n<!--      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style="width: 20px;"><g id="_01_align_center" data-name="01 align center"><path d="M23.259,16.2l-2.6-9.371A9.321,9.321,0,0,0,2.576,7.3L.565,16.35A3,3,0,0,0,3.493,20H7.1a5,5,0,0,0,9.8,0h3.47a3,3,0,0,0,2.89-3.8ZM12,22a3,3,0,0,1-2.816-2h5.632A3,3,0,0,1,12,22Zm9.165-4.395a.993.993,0,0,1-.8.395H3.493a1,1,0,0,1-.976-1.217l2.011-9.05a7.321,7.321,0,0,1,14.2-.372l2.6,9.371A.993.993,0,0,1,21.165,17.605Z"></path></g></svg>-->\n      <img style="max-height:20px;max-width:20px;object-fit:contain;" src="' + svg_src + '" alt="icon"/>\n    </div>\n  </div>\n    ';

  return widget;
}

var __get_widget_detail_html = function __get_widget_detail_html(config, shop_plan) {
  var message = config.message,
      text_color = config.text_color,
      button_text_color = config.button_text_color,
      button_text = config.button_text,
      button_color = config.button_color,
      widget_button_text_font_size = config.widget_button_text_font_size,
      widget_font_style = config.widget_font_style,
      widget_message_font_size = config.widget_message_font_size;


  var hextom_logo = '<div></div>';
  if (shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].paid && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_go && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_stop && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v3_paid) {
    hextom_logo = '\n          <a href="https://hextom.com" style="display:flex;text-decoration:none;align-items:center;" target="_blank">\n              <img width="107" height="26" src="' + __WEBPACK_IMPORTED_MODULE_2__config__["b" /* default */].urls.cdn_url + 'img/spm_img/Hextom-logo-power-by.png" style="margin-left:10px;">\n          </a>\n  ';
  }

  var font_family_style = '';

  if (widget_font_style !== 'inherit') {
    font_family_style = 'font-family:' + widget_font_style + ';';
  }

  return '\n      <div style="text-align:center;margin:24px 0;min-height:36px;display:flex;justify-content:center;align-items:center;">\n        <span style="color: ' + text_color + ';font-size: ' + widget_message_font_size + 'px;' + font_family_style + '">\n            ' + message + '\n        </span>\n      </div>\n      <div style="padding-left: 20px; padding-right: 20px; display:flex; align-items:center;justify-content:space-between;">\n        <button id="hextom__spm__widget__spm_price_drop_subscribe" \n          class="hxt-spm-clickable"\n          style="\n            background:' + button_color + '; \n            border:none;\n            padding:8px 12px;\n            height:42px;\n          "\n        >\n          <span style="color: ' + button_text_color + ';font-size:' + widget_button_text_font_size + 'px;' + font_family_style + '" id="hextom__spm__widget__spm_price_drop_subscribe_text">\n            ' + button_text + '\n          </span>\n        </button>\n        ' + hextom_logo + '\n      </div>\n  ';
};

var __get_widget_svg_icon = function __get_widget_svg_icon(icon) {
  // let icon_list = ['notification', 'sms_4', 'gift', 'heart_2', 'thumbup', 'happy_face_2', 'mobile', 'percent_1']
  var icon_url = __WEBPACK_IMPORTED_MODULE_2__config__["b" /* default */].static_url + ('/img/spm_img/icons/' + icon + '.svg');

  return icon_url;
};

var price_drop_widget = function () {
  function price_drop_widget(config, shop_plan, subscribe_callback) {
    _classCallCheck(this, price_drop_widget);

    this._create_header_style();

    // this._widget = document.querySelector('.js-hextom__spm__widget');
    this._widget = __get_widget(config, shop_plan);
    this._config = config;
    this._shop_plan = shop_plan;
    this._subscribe_callback = subscribe_callback;
    document.body.appendChild(this._widget);

    this._widget_contents = this._widget.querySelector('.js-hextom__spm__widget-contents');
    this._widget_toggle_button = this._widget.querySelector('.js-hextom__spm__widget-toggle');
    this._widget_toggle_title_button = this._widget.querySelector('.js-hextom__spm__widget_title-toggle');
    this._widget_title = this._widget.querySelector('.js-hextom__spm__widget-title');
    this._widget_detail = this._widget.querySelector('#spm_subscribe_price_drop_alert_detail');

    this._widget_subscribe_button = this._widget.querySelector('#hextom__spm__widget__spm_price_drop_subscribe');

    this._widget_subscribe_button.onclick = subscribe_callback;

    this._expanded = false;
    this._collapsed; // eslint-disable-line

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._add_event_listeners();

    this.collapse();
  }

  // an array or key/value object


  _createClass(price_drop_widget, [{
    key: 'activate',
    value: function activate(key_values) {
      if (key_values) {
        var configHtml = __get_widget_detail_html(this._config, this._shop_plan);

        key_values.forEach(function (kv) {
          if (configHtml.indexOf(kv.key) > -1) {
            var escapedKey = kv.key.replace('[', '\\[').replace(']', '\\]');
            var rex = new RegExp(escapedKey, "g");
            var replaceValue = kv.value;
            if (kv.value === 'NaN') {
              replaceValue = '';
            }
            configHtml = configHtml.replace(rex, replaceValue);
          }
        });

        this._widget_detail.innerHTML = configHtml;

        this._widget_subscribe_button = this._widget.querySelector('#hextom__spm__widget__spm_price_drop_subscribe');

        this._widget_subscribe_button.onclick = this._subscribe_callback;
      }

      // window.jQuery('#spm_subscribe_price_drop_alert').addClass('hextom__spm__widget--active');
      var dom = document.getElementById('spm_subscribe_price_drop_alert');
      if (dom) {
        dom.classList.add("hextom__spm__widget--active");
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      // window.jQuery('#spm_subscribe_price_drop_alert').removeClass('hextom__spm__widget--active');
      var dom = document.getElementById('spm_subscribe_price_drop_alert');
      if (dom) {
        dom.classList.remove("hextom__spm__widget--active");
      }
      this._animate = false;
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      if (!this._expanded) {
        return;
      }
      this._expanded = false;

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '.hextom__spm__widget__contents',
        opacity: 0,
        duration: 500,
        delay: 200
      });

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '#spm_subscribe_price_drop_alert',
        width: '56px',
        height: '58px',
        easing: 'easeInOutExpo',
        duration: 800
      });

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '.spm__wrapper__bell',
        opacity: 1,
        duration: 600,
        delay: 500
      });
    }
  }, {
    key: 'expand',
    value: function expand() {
      if (this._expanded) {
        return;
      }

      this._expanded = true;
      var width = '400px';
      if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* is_mobile_browser */])()) {
        width = '100%';
      }

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '.spm__wrapper__bell',
        opacity: 0,
        duration: 400
      });

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '.hextom__spm__widget__contents',
        opacity: 1,
        duration: 200,
        delay: 400
      });

      Object(__WEBPACK_IMPORTED_MODULE_3_animejs__["a" /* default */])({
        targets: '#spm_subscribe_price_drop_alert',
        width: width,
        height: '190px',
        easing: 'easeInOutExpo',
        duration: 700
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var animation_class = __get_animation_class(this._config.widget_floating_button_animation);
      if (this._expanded) {
        this.collapse();
        // window.jQuery('#spm_subscribe_price_drop_alert').addClass(animation_class)

        var _dom = document.getElementById('spm_subscribe_price_drop_alert');
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(_dom)) {
          _dom.classList.add(animation_class);
        }

        return;
      }

      // window.jQuery('#spm_subscribe_price_drop_alert').removeClass(animation_class)

      var dom = document.getElementById('spm_subscribe_price_drop_alert');
      if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(dom)) {
        dom.classList.remove(animation_class);
      }
      this.expand();
    }
  }, {
    key: '_add_event_listeners',
    value: function _add_event_listeners() {
      this._widget_toggle_button.addEventListener('click', this.toggle);
      this._widget_toggle_title_button.addEventListener('click', this.toggle);
    }

    // header style is inserted when app init

  }, {
    key: '_create_header_style',
    value: function _create_header_style() {}
  }]);

  return price_drop_widget;
}();

/* harmony default export */ __webpack_exports__["a"] = (price_drop_widget);

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__translater__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_animejs__ = __webpack_require__(14);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Modification
 * Copyright 2018 Chen Liu, All rights reserved.
 * Copyright 2018 Hextom Inc. All rights reserved.
 */







function __get_widget(app_context) {
  var shop_plan = app_context;
  var back_in_stock_text = 'Get notified when back in stock';
  try {
    back_in_stock_text = Object(__WEBPACK_IMPORTED_MODULE_2__translater__["a" /* get_back_in_stock_text */])(app_context, window.Shopify.shop);
  } catch (e) {}

  var widget = document.createElement('div');
  widget.className = 'hextom__spm__widget js-hextom__spm__widget';
  widget.id = 'spm_subscribe_back_in_stock_alert';

  //   widget.style.border = `1px solid }`;
  widget.style.borderRightWidth = '0px';
  widget.style.opacity = 0;
  widget.style.backgroundColor = 'white';

  widget.innerHTML = '\n  <div class="hextom__spm__widget__bell" \n    style="background-color: white;overflow:hidden;">\n    <div class="hextom__spm__widget__contents js-hextom__spm__widget-contents"\n      style="background-color: white;position:fixed;left:0px;top:0px">\n      <button class="hextom__spm__widget__toggle js-hextom__spm__widget_title-toggle" style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding-bottom:12px;">\n        <span class="hextom__spm__widget__title js-hextom__spm__widget-title" id="hextom__spm__widget__title_id" style="color: black;">' + back_in_stock_text + '</span>\n        <span class="hextom__spm__widget__shrink" id="hextom__spm__widget__shrink_id" style="color: black;width: 30px;display:flex;align-items:center;justify-content:flex-start">\n          <span style="background-color:black;height:3px;width:15px;">\n          </span>\n        </span>\n      </button>\n      <div class="hextom__spm__widget__detail" id="spm_subscribe_back_in_stock_alert_detail">\n        ' + __get_widget_detail_html(shop_plan) + '\n      </div>\n    </div>\n    <div class="spm__wrapper__bell js-hextom__spm__widget-toggle" style="display:flex;justify-content:center;align-items:center;height:56px;position:fixed;left:0px;top:0px">\n      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 20px;"><path d="M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71zM67.53 368c21.22-27.97 44.42-74.33 44.53-159.42 0-.2-.06-.38-.06-.58 0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58.11 85.1 23.31 131.46 44.53 159.42H67.53zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64z"/></svg>\n    </div>\n  </div>\n    ';

  return widget;
}

var __get_widget_detail_html = function __get_widget_detail_html(shop_plan) {
  var hextom_logo = '<div></div>';
  if (shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].paid && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_go && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_stop && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v3_paid) {
    hextom_logo = '\n          <a href="https://hextom.com" style="display:flex;text-decoration:none;align-items:center;" target="_blank">\n              <img width="107" height="26" src="' + __WEBPACK_IMPORTED_MODULE_3__config__["b" /* default */].urls.cdn_url + 'img/spm_img/Hextom-logo-power-by.png" style="margin-left:10px;">\n          </a>\n  ';
  }

  return '\n      <div style="padding-left:20px;padding-right:20px;display:flex;align-items:center;justify-content:space-between;margin-top:36px;">\n        <button id="hextom__spm__widget__spm_back_in_stock_subscribe" \n          style="\n            background:#5563c1; \n            border:none;\n            padding:8px 12px;\n            height:42px;\n          "\n        >\n          <span style="color: white;font-size:16px;" id="hextom__spm__widget__spm_back_in_stock_subscribe_text">\n            ' + 'Subscribe' + '\n          </span>\n        </button>\n        ' + hextom_logo + '\n      </div>\n  ';
};

var back_in_stock_widget = function () {
  function back_in_stock_widget(app_context, subscribe_callback) {
    _classCallCheck(this, back_in_stock_widget);

    this._create_header_style();

    // this._widget = document.querySelector('.js-hextom__spm__widget');
    this._widget = __get_widget(app_context);
    this._shop_plan = app_context.shop_plan;
    // this._subscribe_callback = subscribe_callback;
    document.body.appendChild(this._widget);

    this._widget_contents = this._widget.querySelector('.js-hextom__spm__widget-contents');
    this._widget_toggle_button = this._widget.querySelector('.js-hextom__spm__widget-toggle');
    this._widget_toggle_title_button = this._widget.querySelector('.js-hextom__spm__widget_title-toggle');
    this._widget_title = this._widget.querySelector('.js-hextom__spm__widget-title');
    this._widget_detail = this._widget.querySelector('#spm_subscribe_back_in_stock_alert_detail');

    this._widget_subscribe_button = this._widget.querySelector('#hextom__spm__widget__spm_back_in_stock_subscribe');

    this._widget_subscribe_button.onclick = subscribe_callback;

    this._expanded = false;
    this._collapsed; // eslint-disable-line

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._add_event_listeners();

    this.collapse();
  }

  // an array or key/value object


  _createClass(back_in_stock_widget, [{
    key: 'activate',
    value: function activate() {
      // window.jQuery('#spm_subscribe_back_in_stock_alert').addClass('hextom__spm__widget--active');
      var dom = document.getElementById('spm_subscribe_back_in_stock_alert');
      if (dom) {
        dom.classList.add("hextom__spm__widget--active");
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      // window.jQuery('#spm_subscribe_back_in_stock_alert').removeClass('hextom__spm__widget--active');
      var dom = document.getElementById('spm_subscribe_back_in_stock_alert');
      if (dom) {
        dom.classList.remove("hextom__spm__widget--active");
      }
      this._animate = false;
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      if (!this._expanded) {
        return;
      }
      this._expanded = false;

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '.hextom__spm__widget__contents',
        opacity: 0,
        duration: 500,
        delay: 200
      });

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '#spm_subscribe_back_in_stock_alert',
        width: '56px',
        height: '58px',
        easing: 'easeInOutExpo',
        duration: 800
      });

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '.spm__wrapper__bell',
        opacity: 1,
        duration: 600,
        delay: 500
      });
    }
  }, {
    key: 'expand',
    value: function expand() {
      if (this._expanded) {
        return;
      }

      this._expanded = true;
      var width = '400px';
      if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* is_mobile_browser */])()) {
        width = '100%';
      }

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '.spm__wrapper__bell',
        opacity: 0,
        duration: 400
      });

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '.hextom__spm__widget__contents',
        opacity: 1,
        duration: 200,
        delay: 400
      });

      Object(__WEBPACK_IMPORTED_MODULE_4_animejs__["a" /* default */])({
        targets: '#spm_subscribe_back_in_stock_alert',
        width: width,
        height: '190px',
        easing: 'easeInOutExpo',
        duration: 700
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this._expanded) {
        this.collapse();
        return;
      }

      this.expand();
    }
  }, {
    key: '_add_event_listeners',
    value: function _add_event_listeners() {
      this._widget_toggle_button.addEventListener('click', this.toggle);
      this._widget_toggle_title_button.addEventListener('click', this.toggle);
    }
  }, {
    key: '_create_header_style',
    value: function _create_header_style() {
      // const header_style = get_hextom_spm_header_style();
      // const head = document.head;
      // const style = document.createElement('style');
      //
      // style.type = 'text/css';
      // if (style.styleSheet) {
      //   // This is required for IE8 and below.
      //   style.styleSheet.cssText = header_style;
      // } else {
      //   style.appendChild(document.createTextNode(header_style));
      // }
      //
      // head.appendChild(style);
    }
  }]);

  return back_in_stock_widget;
}();

/* harmony default export */ __webpack_exports__["a"] = (back_in_stock_widget);

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = get_back_in_stock_text;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(3);


function get_back_in_stock_text(app_context) {
    var back_in_stock_text = 'Get notified when back in stock';

    try {
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* is_undefined_or_null */])(app_context.back_in_stock_widget_config) && !Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* is_empty */])(app_context.back_in_stock_widget_config.title)) {
            back_in_stock_text = app_context.back_in_stock_widget_config.title;
        }
    } catch (e) {
        console.log(e);
    }

    return back_in_stock_text;
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export init_sync_session_storage */
/* harmony export (immutable) */ __webpack_exports__["d"] = set_pending_price_drop_action;
/* unused harmony export set_pending_out_of_stock_action */
/* unused harmony export has_pending_action */
/* unused harmony export get_all_pending_actions */
/* unused harmony export set_blocked_subscribed */
/* unused harmony export is_blocked_subscribed */
/* unused harmony export set_not_allowed */
/* unused harmony export clear_not_allowed */
/* unused harmony export set_floating_button_closed */
/* unused harmony export get_floating_button_closed */
/* unused harmony export set_popup_closed */
/* unused harmony export is_popup_closed */
/* unused harmony export clear_popup_closed_by_trigger_flag */
/* unused harmony export is_popup_closed_by_trigger */
/* unused harmony export is_discount_banner_shown */
/* unused harmony export set_discount_banner_shown */
/* unused harmony export is_not_allowed */
/* unused harmony export set_device_id_subscribed */
/* unused harmony export set_unsubscribed */
/* unused harmony export set_is_subscribed */
/* harmony export (immutable) */ __webpack_exports__["a"] = get_is_subscribed;
/* unused harmony export set_subscribe_sig_info */
/* harmony export (immutable) */ __webpack_exports__["c"] = get_subscribe_sig;
/* unused harmony export get_subscribe_info */
/* unused harmony export clear_subscribe_sig_info */
/* unused harmony export set_shop_config */
/* unused harmony export get_shop_config */
/* unused harmony export set_customer_linked */
/* unused harmony export is_customer_linked */
/* unused harmony export get_tracked_start_checkout */
/* unused harmony export get_cart_token */
/* unused harmony export subscribed_abandoned_cart */
/* unused harmony export is_subscribed_abandoned_cart */
/* unused harmony export clear_automation_cache_config */
/* unused harmony export add_displayed_price_drop_alert */
/* unused harmony export is_displayed_price_drop_alert */
/* unused harmony export add_subscribe_back_in_stock */
/* unused harmony export is_subscribed_back_in_stock */
/* unused harmony export add_subscribe_price_drop_alert */
/* unused harmony export is_subscribed_price_drop_alert */
/* unused harmony export set_subscriber_device_id */
/* unused harmony export get_subscriber_device_id */
/* unused harmony export get_subscriber_id */
/* unused harmony export remove_cart_item_counter */
/* unused harmony export set_cart_item_counter */
/* unused harmony export get_cart_item_counter */
/* unused harmony export is_subscribed_to_shipping */
/* unused harmony export set_subscribe_to_shipping */
/* unused harmony export get_subscribe_to_shipping */
/* unused harmony export page_counter_time_exist */
/* unused harmony export enter_page */
/* unused harmony export sync_subscribed_to_abandon_cart_session */
/* unused harmony export update_subscribed_to_abandon_cart_session */
/* unused harmony export sync_page_counter_session */
/* unused harmony export update_page_counter_session */
/* unused harmony export leave_page */
/* unused harmony export set_abandon_browser_product_cache */
/* unused harmony export get_abandon_browser_product_cache */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return get_spm_debug_enabled; });
/* unused harmony export set_sms_subscriber_id_tracking_info */
/* unused harmony export set_sms_click_tracking_info */
/* unused harmony export get_sms_click_tracking_info */
/* unused harmony export set_stored_cart_token */
/* unused harmony export get_stored_cart_token */
/* unused harmony export set_disable_push_widget */
/* unused harmony export get_disable_push_widget */
/* unused harmony export get_subscribed_to_abandon_cart_key */
/* unused harmony export get_cart_item_count_key */
/* unused harmony export get_page_counter_timer_key */
/* unused harmony export get_sync_session_timer_key */
/* unused harmony export get_page_counter_key */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);




function init_sync_session_storage() {
    var on_session_synced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var sync_session_key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    };
    var on_session_updated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var sync_session_key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    };

    if (window.localStorage && window.sessionStorage) {
        // setup storage listener
        var sync_session_key_prefix = hextom_spm_prefix + '__sync__session__';
        var sync_broadcast_session_key_prefix = hextom_spm_prefix + '__sync__broadcast__session__';
        var sync_local_storage_message_key_prefix = hextom_spm_prefix + '__sync__local_storage_message__';
        __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('[SPM-Storage]init_sync_session_storage storage listener init');
        window.addEventListener('storage', function (event) {
            __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('[SPM-Storage]init_sync_session_storage event received: ' + JSON.stringify(event));
            if (event.newValue === null) {
                return;
            }

            if (event.key.startsWith(sync_session_key_prefix)) {
                var event_key = '' + event.key;

                // parse the key to remove the prefix
                var sync_session_key = event_key.replace(sync_session_key_prefix, '');

                // get the value from session storage
                var curr_value = window.sessionStorage.getItem(sync_session_key);
                localStorage.setItem('' + sync_local_storage_message_key_prefix + sync_session_key, curr_value);

                localStorage.removeItem('' + sync_local_storage_message_key_prefix + sync_session_key);
                // we receive message in the local storage
            } else if (event.key.startsWith(sync_local_storage_message_key_prefix)) {
                var _event_key = '' + event.key;
                var _sync_session_key = _event_key.replace(sync_local_storage_message_key_prefix, '');

                // check if we already have this value in current session
                var new_value = event.newValue;
                // sync the value if for current session storage
                if (new_value !== null) {
                    on_session_synced(new_value, _sync_session_key);
                }
            } else if (event.key.startsWith(sync_broadcast_session_key_prefix)) {
                var _event_key2 = '' + event.key;
                var _sync_session_key2 = _event_key2.replace(sync_broadcast_session_key_prefix, '');
                var _new_value = event.newValue;
                if (_new_value !== null) {
                    on_session_updated(_new_value, _sync_session_key2);
                }
            }
        });
    }
}

function set_pending_price_drop_action(shop_domain, action) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        if (action === undefined) {
            window.sessionStorage.removeItem('pending_price_drop_' + shop_domain);
        } else {
            window.sessionStorage.setItem('pending_price_drop_' + shop_domain, JSON.stringify(action));
        }
    }
}

function set_pending_out_of_stock_action(shop_domain, action) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        if (action === undefined) {
            window.sessionStorage.removeItem('pending_out_of_stock_' + shop_domain);
        } else {
            window.sessionStorage.setItem('pending_out_of_stock_' + shop_domain, JSON.stringify(action));
        }
    }
}

function has_pending_action(shop_domain) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var pending_price_drop = window.sessionStorage.getItem('pending_price_drop_' + shop_domain);
        var pending_out_of_stock = window.sessionStorage.getItem('pending_out_of_stock_' + shop_domain);

        if (pending_price_drop !== undefined || pending_out_of_stock !== undefined) {
            return true;
        }
    }

    return false;
}

function get_all_pending_actions(shop_domain) {
    if (has_pending_action(shop_domain)) {
        var pending_actions = [];
        var pending_price_drop = window.sessionStorage.getItem('pending_price_drop_' + shop_domain);
        if (pending_price_drop !== undefined && pending_price_drop !== null) {
            pending_actions.push(JSON.parse(pending_price_drop));
        }

        var pending_out_of_stock = window.sessionStorage.getItem('pending_out_of_stock_' + shop_domain);

        if (pending_out_of_stock !== undefined && pending_out_of_stock !== null) {
            pending_actions.push(JSON.parse(pending_out_of_stock));
        }

        return pending_actions;
    }

    return [];
}

function set_blocked_subscribed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(get_block_subscribe_key(shop_domain), __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes);
    }
}

function is_blocked_subscribed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        return '' + window.sessionStorage.getItem(get_block_subscribe_key(shop_domain)) === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes;
    }

    return true;
}

function set_not_allowed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(get_not_allowed_key(shop_domain), __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes);
    }

    document.cookie = hextom_spm_prefix + '_not_allowed_' + shop_domain + '=' + __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes;
}

function clear_not_allowed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(get_not_allowed_key(shop_domain));
    }
}

function set_floating_button_closed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(get_close_floating_button_key(shop_domain), __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes);
    }
}

function get_floating_button_closed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var result = window.sessionStorage.getItem(get_close_floating_button_key(shop_domain));

        return '' + result === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes;
    }

    return false;
}

function set_popup_closed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // set session storage and localstorage with a expire timer
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(get_close_popup_key(shop_domain), __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes);
    }

    if (typeof Storage !== "undefined" && window.localStorage) {
        window.localStorage.setItem(get_close_popup_key(shop_domain), Date.now());
    }
}

function is_popup_closed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var session_popup_closed = window.sessionStorage.getItem(get_close_popup_key(shop_domain));
        if ('' + session_popup_closed === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes) {
            return true;
        }
    }

    if (typeof Storage !== "undefined" && window.localStorage) {
        var session_popup_closed_timestamp = window.localStorage.getItem(get_close_popup_key(shop_domain));

        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(session_popup_closed_timestamp)) {
            // see if this timestamp is 24 hours ago
            var timestamp_number = Number(session_popup_closed_timestamp);
            var time_now = Date.now();
            var time_delta = time_now - timestamp_number;

            // closed within 24 hours
            if (time_delta < 24 * 60 * 60 * 1000) {
                return true;
            }
        }
    }

    return false;
}

function clear_popup_closed_by_trigger_flag(shop_domain) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(get_close_popup_key(shop_domain));
    }

    if (typeof Storage !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(get_close_popup_key(shop_domain));
    }
}

function is_popup_closed_by_trigger() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var popup_trigger = arguments[1];

    if (popup_trigger === __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* subscribe_popup_trigger */].floating_button_reopen || popup_trigger === __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* subscribe_popup_trigger */].floating_button) {
        return false;
    }

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var session_popup_closed = window.sessionStorage.getItem(get_close_popup_key(shop_domain));
        if ('' + session_popup_closed === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes) {
            return true;
        }
    }

    if (typeof Storage !== "undefined" && window.localStorage) {
        var session_popup_closed_timestamp = window.localStorage.getItem(get_close_popup_key(shop_domain));

        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(session_popup_closed_timestamp)) {
            // see if this timestamp is 24 hours ago
            var timestamp_number = Number(session_popup_closed_timestamp);
            var time_now = Date.now();
            var time_delta = time_now - timestamp_number;

            // closed within 24 hours
            if (time_delta < 3 * 60 * 60 * 1000) {
                return true;
            }
        }
    }

    return false;
}

function is_discount_banner_shown() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var discount_banner_shown = window.sessionStorage.getItem(get_discount_banner_key(shop_domain));
        if ('' + discount_banner_shown === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes) {
            return true;
        }
    }

    return true;
}

function set_discount_banner_shown() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(get_discount_banner_key(shop_domain), __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes);
    }
}

// for push
function is_not_allowed() {
    var shop_domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


    var not_allowed = false;
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var not_allowed_session = window.sessionStorage.getItem(get_not_allowed_key(shop_domain));

        not_allowed = not_allowed_session === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes;
    }
    var not_allowed_cookie = document.cookie.replace(/(?:(?:^|.*;\s*)com_hextom_smartpushmarketing_not_allowed\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // eslint-disable-line no-useless-escape

    not_allowed = not_allowed || not_allowed_cookie === __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* yes_no */].Yes;

    return not_allowed;
}

function set_device_id_subscribed(device_id, shop_domain) {
    var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].push;

    try {
        if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].push) {
            if (typeof Storage !== "undefined" && window.localStorage) {
                window.localStorage.setItem(hextom_spm_prefix + '_device_id', device_id);
                window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain, 'true');
            }
        } else if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].sms) {
            if (typeof Storage !== "undefined" && window.localStorage) {
                window.localStorage.setItem(hextom_spm_prefix + '_device_id', device_id);
                window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain + '_sms', 'true');
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function set_unsubscribed(shop_domain) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].push;

    if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].sms) {
        if (typeof Storage !== "undefined" && window.localStorage) {
            window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain + '_sms', 'false');
        }
    } else {
        if (typeof Storage !== "undefined" && window.localStorage) {
            window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain, 'false');
        }
    }
}

/**
 *
 * @param shop_domain
 * @param channel push or sms/wa
 */
function set_is_subscribed(shop_domain) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].push;

    if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].sms || channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].whatsapp) {
        if (typeof Storage !== "undefined" && window.localStorage) {
            window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain + '_sms', 'true');
        }
    } else {
        if (typeof Storage !== "undefined" && window.localStorage) {
            window.localStorage.setItem(hextom_spm_prefix + '_subscribed_' + shop_domain, 'true');
        }
    }
}

function get_is_subscribed(shop_domain) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].either;

    if (typeof Storage !== "undefined" && window.localStorage) {

        if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].sms) {
            var sms_subscribed = window.localStorage.getItem(hextom_spm_prefix + '_subscribed_' + shop_domain + '_sms') === 'true';

            return sms_subscribed;
        } else if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].all || channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].either) {
            // default we use push

            var push_subscribed = window.localStorage.getItem(hextom_spm_prefix + '_subscribed_' + shop_domain) === 'true';
            var _sms_subscribed = window.localStorage.getItem(hextom_spm_prefix + '_subscribed_' + shop_domain + '_sms') === 'true';

            if (channel === __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* sub_channel */].either) {
                return push_subscribed || _sms_subscribed;
            }

            return push_subscribed && _sms_subscribed;
        } else {
            return window.localStorage.getItem(hextom_spm_prefix + '_subscribed_' + shop_domain) === 'true';
        }
    }

    return false;
}

function set_subscribe_sig_info(shop_domain, sub_info) {
    if (typeof Storage !== "undefined" && window.localStorage) {
        var sub_sig = window.btoa(sub_info.auth + '_' + sub_info.p256dh + '_' + sub_info.endpoint);
        window.localStorage.setItem(hextom_spm_prefix + '_subscribed_sig_' + shop_domain, sub_sig);

        var stored_sub_info = {
            auth: sub_info.auth,
            p256dh: sub_info.p256dh,
            endpoint: sub_info.endpoint
        };

        window.localStorage.setItem(hextom_spm_prefix + '_subscribed_sig_info_' + shop_domain, window.btoa(JSON.stringify(stored_sub_info)));
    }
}

function get_subscribe_sig(shop_domain) {
    if (typeof Storage !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(hextom_spm_prefix + '_subscribed_sig_' + shop_domain);
    }

    return undefined;
}

function get_subscribe_info(shop_domain) {
    if (typeof Storage !== "undefined" && window.localStorage) {
        var info_str = window.localStorage.getItem(hextom_spm_prefix + '_subscribed_sig_info_' + shop_domain);

        if (info_str === null || info_str === undefined || info_str === '') {
            return undefined;
        }

        var info_obj = JSON.parse(window.atob(info_str));
        return info_obj;
    }

    return undefined;
}

// clear both sig and subscription flag
function clear_subscribe_sig_info(shop_domain) {
    if (typeof Storage !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(hextom_spm_prefix + '_subscribed_sig_' + shop_domain);
        window.localStorage.removeItem(hextom_spm_prefix + '_subscribed_sig_info_' + shop_domain);
    }

    set_unsubscribed(shop_domain);
}

function set_shop_config(shop_domain, config) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(hextom_spm_prefix + '_config_' + shop_domain, JSON.stringify(config));
    }
}

function get_shop_config(shop_domain) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        var config = window.sessionStorage.getItem(hextom_spm_prefix + '_config_' + shop_domain);
        return JSON.parse(config);
    }

    return undefined;
}

function set_customer_linked(shop_domain, linked) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(hextom_spm_prefix + '_customer_linked_' + shop_domain, linked);
    }
}

function is_customer_linked(shop_domain) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        return window.sessionStorage.getItem(hextom_spm_prefix + '_customer_linked_' + shop_domain) === 'true';
    }

    return false;
}

function get_tracked_start_checkout() {
    var tracked_start_checkout = document.cookie.replace(/(?:(?:^|.*;\s*)tracked_start_checkout\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // eslint-disable-line no-useless-escape
    return tracked_start_checkout;
}

function get_cart_token() {
    var cart_token = document.cookie.replace(/(?:(?:^|.*;\s*)cart\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // eslint-disable-line no-useless-escape
    return cart_token;
}

function subscribed_abandoned_cart(subscribed) {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        // return window.sessionStorage.setItem(`${hextom_spm_prefix}_subscribed_abandoned_cart`, subscribed);
        window.sessionStorage.setItem(get_subscribed_to_abandon_cart_key(), subscribed);

        // update session for other tabs
        update_subscribed_to_abandon_cart_session(subscribed);
        return;
    }
}

function is_subscribed_abandoned_cart() {
    if (typeof Storage !== "undefined" && window.sessionStorage) {
        return window.sessionStorage.getItem(get_subscribed_to_abandon_cart_key()) === 'true';
    }

    return false;
}

function clear_automation_cache_config() {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(get_price_drop_alert_display_key());
        window.sessionStorage.removeItem(get_back_in_stock_key());
        window.sessionStorage.removeItem(get_price_drop_alert_key());
    }

    if (window.localStorage) {
        window.localStorage.removeItem(get_price_drop_alert_display_key());
        window.localStorage.removeItem(get_back_in_stock_key());
        window.localStorage.removeItem(get_price_drop_alert_key());
    }
}

function add_displayed_price_drop_alert(product_id) {
    add_subscribe_key_id_session(get_price_drop_alert_display_key(), product_id);
}

function is_displayed_price_drop_alert(product_id) {
    return is_key_id_subscribed_session(get_price_drop_alert_display_key(), product_id);
}

function add_subscribe_back_in_stock(variant_id) {
    add_subscribe_key_id(get_back_in_stock_key(), variant_id);
}

function is_subscribed_back_in_stock(variant_id) {
    return is_key_id_subscribed(get_back_in_stock_key(), variant_id);
}

function add_subscribe_price_drop_alert(variant_id) {
    add_subscribe_key_id(get_price_drop_alert_key(), variant_id);
}

function is_subscribed_price_drop_alert(variant_id) {
    return is_key_id_subscribed(get_price_drop_alert_key(), variant_id);
}

function set_subscriber_device_id(device_id) {
    var device_id_key = get_device_id_key();

    if (window.localStorage) {
        localStorage.setItem(device_id_key, device_id);
    }
}

function get_subscriber_device_id() {
    var device_id_key = get_device_id_key();

    if (window.localStorage) {
        return localStorage.getItem(device_id_key);
    }
}

function get_subscriber_id() {
    var tracking_info = get_sms_click_tracking_info();

    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(tracking_info)) {
        return '';
    }

    return tracking_info.subscriber_id;
}

function remove_cart_item_counter() {
    if (window.localStorage) {
        window.localStorage.removeItem(get_cart_item_count_key());
    }
}

function set_cart_item_counter(count) {
    if (window.localStorage) {
        window.localStorage.setItem(get_cart_item_count_key(), count);
    }
}

function get_cart_item_counter() {
    if (window.localStorage) {
        var count = window.localStorage.getItem(get_cart_item_count_key());

        if (count === null || count === 'null') {
            return 0;
        }

        var countNum = Number(count);
        if (isNaN(countNum)) {
            return 0;
        }

        return countNum;
    }
}

function is_subscribed_to_shipping(order_info) {
    if (window.localStorage) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(order_info.order_id)) {
            var shipping_orders = get_subscribe_to_shipping();
            if (shipping_orders.includes(order_info.order_id)) {
                return true;
            }
        }
    }

    return false;
}

function set_subscribe_to_shipping(order_info) {
    if (window.localStorage) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(order_info.order_id)) {
            var shipping_orders = get_subscribe_to_shipping();
            if (!shipping_orders.includes(order_info.order_id)) {
                shipping_orders.push(order_info.order_id);

                window.localStorage.setItem(get_shipping_key(), JSON.stringify(shipping_orders));
            }
        }
    }
}

function get_subscribe_to_shipping() {
    if (window.localStorage) {
        var info = window.localStorage.getItem(get_shipping_key());
        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(info) || '' + info === '') {
            return [];
        }

        return JSON.parse(info);
    }

    return null;
}

var page_counter_time_exist = function page_counter_time_exist() {};

var enter_page = function enter_page() {
    if (window.sessionStorage) {
        var page_counter_key = get_page_counter_key();
        var curr_count = window.sessionStorage.getItem(page_counter_key);
        __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('enter_page: ' + curr_count);
        if (curr_count === null || curr_count < 0) {
            curr_count = 1;
        } else {
            try {
                curr_count = Number(curr_count) + 1;
            } catch (e) {
                __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info(e);
            }
        }

        window.sessionStorage.setItem(page_counter_key, curr_count);

        return curr_count;
    }

    return 0;
};

function sync_subscribed_to_abandon_cart_session() {
    __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('[SPM-Storage] Sync session subscribed to abandon cart key timer');
    var atc_timer_key = get_sync_session_timer_key(get_subscribed_to_abandon_cart_key());
    window.localStorage.setItem(atc_timer_key, Date.now());
}

function update_subscribed_to_abandon_cart_session(value) {
    __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('[SPM-Storage] Update session subscribed to abandon cart key timer');
    var sync_session_key = hextom_spm_prefix + '__sync__broadcast__session__' + get_subscribed_to_abandon_cart_key();
    window.localStorage.setItem(sync_session_key, value);
    window.localStorage.removeItem(sync_session_key);
}

function sync_page_counter_session() {
    var page_counter_timer_key = get_page_counter_timer_key();
    // `${hextom_spm_prefix}__sync__session__${get_page_counter_key()}`;
    __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('[SPM-Storage] Update session key timer');
    window.localStorage.setItem(page_counter_timer_key, Date.now());
}

function update_page_counter_session(value) {
    var sync_session_key = hextom_spm_prefix + '__sync__broadcast__session__' + get_page_counter_key();
    window.localStorage.setItem(sync_session_key, value);
    window.localStorage.removeItem(sync_session_key);
}

/**
 * @returns leave current page and the page counter
 */
var leave_page = function leave_page() {
    if (window.sessionStorage) {
        var page_counter_key = get_page_counter_key();
        var curr_count = window.sessionStorage.getItem(page_counter_key);
        __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('leave_page: ' + curr_count);
        if (curr_count === null || curr_count === 0 || curr_count === undefined) {
            curr_count = 0;
        } else {
            try {
                curr_count = Number(curr_count) - 1;
            } catch (e) {
                curr_count = 0;
                __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info(e);
            }
        }

        return curr_count;
    }
};

// TODO remove this
// export const enter_product_page = ({product_id, variant_id}) => {
//     if (window.sessionStorage) {
//         let product_page_key = get_product_page_key(product_id, variant_id);
//         let curr_count = window.sessionStorage.getItem(product_page_key);
//         if(curr_count === null) {
//             curr_count = 1;
//         } else {
//             curr_count = curr_count + 1;
//         }

//         window.sessionStorage.setItem(product_page_key, curr_count);
//     }
// }

// /**
//  *
//  * @param {*} param0 {product_id, variant_id}
//  * @returns true we have 0 or less product record in sessionstorage so we should notify server about adding new abandon product page
//  * false we have 1 or more product record in sessionstorage so we should not notify server about adding new abandon product page
//  *
//  */
// export const leave_product_page = ({product_id, variant_id}) => {
//     if (window.sessionStorage) {
//         let product_page_key = get_product_page_key(product_id, variant_id);
//         let curr_count = window.sessionStorage.getItem(product_page_key);
//         if(curr_count === null) {
//             // somehow the key is not recorded
//             return true;
//         }

//         curr_count = curr_count - 1;
//         window.sessionStorage.setItem(product_page_key, curr_count);
//         if(curr_count > 0) {
//             return false;
//         }

//         return true;
//     }
// }

var set_abandon_browser_product_cache = function set_abandon_browser_product_cache(_ref) {
    var product_id = _ref.product_id,
        variant_id = _ref.variant_id;

    if (window.localStorage) {
        var product_cache_key = get_abandon_browser_product_cache_key();
        var product_variant_key = get_abandon_browser_product_variant_cache_key();

        window.localStorage.setItem(product_cache_key, product_id);
        window.localStorage.setItem(product_variant_key, variant_id);

        __WEBPACK_IMPORTED_MODULE_1__utils__["e" /* spm_logger */].info('Abandon browser product cache is set with product_id: ' + product_id + ' variant_id: ' + variant_id);
    }
};

var get_abandon_browser_product_cache = function get_abandon_browser_product_cache() {
    if (window.localStorage) {
        var product_cache_key = get_abandon_browser_product_cache_key();
        var product_variant_key = get_abandon_browser_product_variant_cache_key();

        var product_id = window.localStorage.getItem(product_cache_key);
        var variant_id = window.localStorage.getItem(product_variant_key);

        return { product_id: product_id, variant_id: variant_id };
    }

    return {
        product_id: null,
        variant_id: null
    };
};

var get_spm_debug_enabled = function get_spm_debug_enabled() {
    try {
        if (window && window.localStorage) {
            var debug_mode = window.localStorage.getItem('__spm_debug');
            return debug_mode === 'yes';
        }
    } catch (e) {}

    return false;
};

function add_subscribe_key_id_session(case_key, variant_id) {
    if (window.sessionStorage) {
        if (is_key_id_subscribed(case_key, variant_id)) {
            return;
        }

        var records = window.sessionStorage.getItem(case_key);
        if (!records) {
            records = [];
        } else {
            records = JSON.parse(records);
        }

        records.push(variant_id);

        window.sessionStorage.setItem(case_key, JSON.stringify(records));
    }
}

function is_key_id_subscribed_session(case_key, variant_id) {
    if (window.sessionStorage) {
        // get current records
        var records = window.sessionStorage.getItem(case_key);
        if (!records) {
            return false;
        }

        records = JSON.parse(records);

        if (records.indexOf(variant_id) > -1) {
            return true;
        }
    }

    return false;
}

function add_subscribe_key_id(case_key, variant_id) {
    if (window.localStorage) {
        if (is_key_id_subscribed(case_key, variant_id)) {
            return;
        }

        var records = window.localStorage.getItem(case_key);
        if (!records) {
            records = [];
        } else {
            records = JSON.parse(records);
        }

        records.push(variant_id);

        window.localStorage.setItem(case_key, JSON.stringify(records));
    }
}

function is_key_id_subscribed(case_key, variant_id) {
    if (window.localStorage) {
        // get current records
        var records = window.localStorage.getItem(case_key);
        if (!records) {
            return false;
        }

        records = JSON.parse(records);

        if (records.indexOf(variant_id) > -1) {
            return true;
        }
    }

    return false;
}

var set_sms_subscriber_id_tracking_info = function set_sms_subscriber_id_tracking_info(subscriber_id) {
    var current_info = get_sms_click_tracking_info();

    var tracking_info = {
        subscriber_id: subscriber_id
    };
    if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(current_info)) {
        tracking_info = Object.assign({}, current_info, tracking_info);
    }

    set_sms_click_tracking_info(tracking_info);
};

var set_sms_click_tracking_info = function set_sms_click_tracking_info(tracking_info_json) {
    if (window.localStorage) {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(tracking_info_json)) {
            window.localStorage.setItem(get_sms_click_tacking_key(), undefined);
        } else {
            window.localStorage.setItem(get_sms_click_tacking_key(), JSON.stringify(tracking_info_json));
        }
    }
};

var get_sms_click_tracking_info = function get_sms_click_tracking_info() {
    if (window.localStorage) {
        var tracking_info_str = window.localStorage.getItem(get_sms_click_tacking_key());

        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(tracking_info_str) && tracking_info_str !== '' && tracking_info_str !== 'undefined' && tracking_info_str !== '{}') {
            try {
                var info_json = JSON.parse(tracking_info_str);
                info_json = Object.assign({
                    campaign_id: '',
                    signup_id: '',
                    automation_id: '',
                    widget_id: ''
                }, info_json);
                return info_json;
            } catch (e) {}
        }
    }

    return undefined;
};

var set_stored_cart_token = function set_stored_cart_token(stored_cart_token) {
    if (window.localStorage) {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(stored_cart_token)) {
            window.localStorage.setItem(get_stored_cart_token_key(), undefined);
        } else {
            window.localStorage.setItem(get_stored_cart_token_key(), stored_cart_token);
        }
    }
};

var get_stored_cart_token = function get_stored_cart_token() {
    if (window.localStorage) {
        return window.localStorage.getItem(get_stored_cart_token_key());
    }

    return undefined;
};

var set_disable_push_widget = function set_disable_push_widget(disable_push) {
    if (window.localStorage) {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* is_undefined_or_null */])(disable_push)) {
            window.localStorage.setItem(hextom_spm_prefix + '_disable_push', undefined);
        } else {
            window.localStorage.setItem(hextom_spm_prefix + '_disable_push', '' + disable_push);
        }
    }
};

var get_disable_push_widget = function get_disable_push_widget() {
    if (window.localStorage) {
        return window.localStorage.getItem(hextom_spm_prefix + '_disable_push') === 'true';
    }

    return false;
};

var get_block_subscribe_key = function get_block_subscribe_key(shop_domain) {
    return hextom_spm_prefix + '_block_subscribe_' + shop_domain;
};

var get_not_allowed_key = function get_not_allowed_key(shop_domain) {
    return hextom_spm_prefix + '_not_allowed_' + shop_domain;
};

var get_shipping_key = function get_shipping_key() {
    return hextom_spm_prefix + '_shipping';
};

var get_back_in_stock_key = function get_back_in_stock_key() {
    return hextom_spm_prefix + '_back_in_stock';
    // if(channel === sub_channel.push) {
    // }
    //
    // return `${hextom_spm_prefix}_back_in_stock_${channel}`;
};

var get_price_drop_alert_key = function get_price_drop_alert_key() {
    return hextom_spm_prefix + '_price_drop_alert';
};

var get_price_drop_alert_display_key = function get_price_drop_alert_display_key() {
    return hextom_spm_prefix + '_price_drop_alert_display';
};

// const get_product_page_key = (product_id, variant_id) => {
//     return `${hextom_spm_prefix}_product_page_read_${product_id}_${variant_id}`;
// }

var get_subscribed_to_abandon_cart_key = function get_subscribed_to_abandon_cart_key() {
    return hextom_spm_prefix + '_subscribed_abandoned_cart';
};

var get_cart_item_count_key = function get_cart_item_count_key() {
    var cart_token = get_cart_token();
    return hextom_spm_prefix + '_cart_' + cart_token + '_item_count';
};

var get_page_counter_timer_key = function get_page_counter_timer_key() {
    return hextom_spm_prefix + '__sync__session__' + get_page_counter_key();
};

var get_sync_session_timer_key = function get_sync_session_timer_key(sync_session_key) {
    return hextom_spm_prefix + '__sync__session__' + sync_session_key;
};

var get_page_counter_key = function get_page_counter_key() {
    return hextom_spm_prefix + '_shop_page_counter';
};

var get_abandon_browser_product_cache_key = function get_abandon_browser_product_cache_key() {
    return hextom_spm_prefix + '_abandon_browser_product_cache';
};

var get_abandon_browser_product_variant_cache_key = function get_abandon_browser_product_variant_cache_key() {
    return hextom_spm_prefix + '_abandon_browser_product_variant_cache';
};

var get_device_id_key = function get_device_id_key() {
    return hextom_spm_prefix + '_subscriber_device_id';
};

var get_close_popup_key = function get_close_popup_key(shop_domain) {
    return hextom_spm_prefix + '_close_popup_' + shop_domain;
};

var get_close_floating_button_key = function get_close_floating_button_key(shop_domain) {
    return hextom_spm_prefix + '_close_floating_button_' + shop_domain;
};

var get_discount_banner_key = function get_discount_banner_key(shop_domain) {
    return hextom_spm_prefix + '_discount_banner_shown_' + shop_domain;
};

var get_sms_click_tacking_key = function get_sms_click_tacking_key() {
    return hextom_spm_prefix + '_sms_click_tracking_info';
};

var get_stored_cart_token_key = function get_stored_cart_token_key() {
    return hextom_spm_prefix + '_cart_token';
};

var hextom_spm_prefix = 'com_hextom_smartpushmarketing';

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return show_unblock_modal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(2);




var unblock_gifs = {
    chrome: __WEBPACK_IMPORTED_MODULE_1__config__["b" /* default */].urls.cdn_url + 'img/spm_img/spm-unlock-notification-mac.png',
    firefox: __WEBPACK_IMPORTED_MODULE_1__config__["b" /* default */].urls.cdn_url + 'img/spm_img/unlock-notification-mac-firefox.png',
    ie: __WEBPACK_IMPORTED_MODULE_1__config__["b" /* default */].urls.cdn_url + 'img/spm_img/spm-unlock-notification-mac.png'
};

var unblock_title = 'Something is wrong';
var unblock_subtitle = 'Change notifications permission to \u2018Allow\u2019 to receive updates from us. No spam, pinky promise.';

var mobile_step_1 = '1. Click on lock icon above';
var mobile_step_2 = '2. Click on \'Permission Settings\'.';
var mobile_step_3 = '3. Change Notifications permission to \'Allow\'.';

var __hextom_spm_header_unblock_modal_style = '\n    .hextom__spm__unblock_modal_content {\n        display: flex;\n        flex-direction: column;\n    }\n\n    .hextom__spm__unblock_modal_content_img_conatiner > img {\n        width: 100%;\n        height: 90%;\n        margin-top: 36px;\n        max-width: 600px;\n        max-height: 450px;\n    }\n\n    .hextom__spm__unblock_modal_logo {\n        color: white;\n        paddingTop: 35px;\n    }\n';

var __get_unblock_modal_html = function __get_unblock_modal_html(browser, shop_plan) {

    var logo = '<span></span>';
    if (shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].paid && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_go && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v2_stop && shop_plan !== __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* shop_plans */].v3_paid) {
        logo = '<img height="48" src="' + __WEBPACK_IMPORTED_MODULE_1__config__["b" /* default */].urls.cdn_url + 'img/spm_img/Hextom-logo-power-by-white-transparent.png" style="margin-left:10px;">';
    }

    var unblock_gif = unblock_gifs[browser];

    var instruction = '';
    var arrow = '';
    var container_height = '';
    // if no gif is presented, we either have a mobile browser or something non chrome/ff
    if (!unblock_gif) {
        instruction = '\n            <div style="display: flex; justify-content: center; max-width: 800px; padding: 24px;">\n                <span style="color: white; font-size: 1.3em;">\n                    ' + unblock_subtitle + '\n                </span>\n            </div>\n            <div style="display: flex; justify-content: center; max-width: 800px; flex-direction: column; max-height: 250px;">\n                <span style="color: white; font-size: 1.2em;">\n                    ' + mobile_step_1 + '\n                </span> <br/>\n                <span style="color: white; font-size: 1.2em;">\n                    ' + mobile_step_2 + '\n                </span> <br/>\n                <span style="color: white; font-size: 1.2em;">\n                    ' + mobile_step_3 + '\n                </span>\n            </div>\n        ';
        arrow = '';
        container_height = 'margin-bottom: 100px;';
    } else {
        instruction = '\n                <div style="display: flex; justify-content: center; max-width: 800px; padding-left: 32px; padding-right: 32px;">\n                    <span style="color: white; font-size: 1.3em;">\n                        ' + unblock_subtitle + '\n                    </span>\n                </div>\n                <div class="hextom__spm__unblock_modal_content_img_conatiner">\n                    <img src=' + unblock_gif + '  />\n                </div>\n        ';

        arrow = '<div style="position: fixed; top: 1%; left: 135px; width: 12%; height: 12%">\n                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.02 72.66"><defs><style>.cls-1{fill:#fff;}</style></defs><title>colorcapture-logo-Artboard 1</title><path class="cls-1" d="M87,72.24a90.5,90.5,0,0,1-29.56-2A68.4,68.4,0,0,1,30.27,57.17,63,63,0,0,1,12.2,32.92a79.06,79.06,0,0,1-6.11-29c2.71,9.46,5.83,18.64,10.36,27a71.08,71.08,0,0,0,17.6,21.64A79.06,79.06,0,0,0,58.76,65.75C67.79,68.84,77.31,70.68,87,72.24Z"/><path class="cls-1" d="M.16,19.77A29.74,29.74,0,0,1,0,15.17c.06-1.51.21-3,.4-4.45s.45-2.9.77-4.33.67-2.84,1.07-4.24A3,3,0,0,1,6,.12a2.82,2.82,0,0,1,.77.34l.06,0c1.3.83,2.56,1.72,3.81,2.63S13,5,14.2,6.07s2.3,2.11,3.39,3.27a32,32,0,0,1,3.05,3.79,30.3,30.3,0,0,1-4.7-1.27c-1.5-.53-2.94-1.14-4.36-1.79S8.8,8.69,7.45,7.94,4.79,6.37,3.5,5.51L8,3.86C7.58,5.25,7.12,6.63,6.59,8S5.5,10.71,4.88,12.05,3.56,14.69,2.79,16A30.6,30.6,0,0,1,.16,19.77Z"/></svg>\n                </div>';

        container_height = 'min-height: 580px;';
        if (browser !== 'chrome') {
            arrow = '';
        }
    }

    return '<style>\n          ' + __hextom_spm_header_unblock_modal_style + '\n        </style>\n        <div class="hextom__spm__unblock_modal_content">\n            <div style="display: flex; flex-direction: column; align-items: center; ' + container_height + '">\n                <div style="display: flex; justify-content: center; max-width: 500px;">\n                    <span style="color: white; font-size: 1.8em;">\n                    ' + unblock_title + '\n                    </span>\n                </div>\n                ' + instruction + '\n            </div>\n        </div>\n        <div class="hextom__spm__unblock_modal_logo">\n           ' + logo + '\n        </div>\n        ' + arrow + '\n    ';
};

// <svg width="1345px" height="1067px" viewBox="0 0 1345 1067" version="1.1" xmlns="http://www.w3.org/2000/svg">
//     <desc>Arrow</desc>
//     <defs></defs>
//     <g id="Interaction-Flow" stroke-width="5" stroke-linecap="round" fill="none" fill-rule="evenodd">
//         <path d="M 421.5 269.4921875 q -290.5 230.88170781850224, -290.5 -230.88170781850224" id="tail" stroke="#FFFFFF"></path>
//         <path d="M 92.38952031850224 77.22095936299553 q 38.610479681497765 -115.8314390444933, 77.22095936299553 0"
//             id="head" stroke="#FFFFFF"></path>
//     </g>
// </svg>
var __get_unblock_modal = function __get_unblock_modal(browser, shop_plan) {
    var div = document.createElement('div');

    // div.style = modal_style;
    div.style.width = modal_style.width;
    div.style.height = modal_style.height;
    div.style.backgroundColor = modal_style.backgroundColor;
    div.style.position = modal_style.position;

    div.style.top = modal_style.top;
    div.style.left = modal_style.left;
    div.style.right = modal_style.right;
    div.style.bottom = modal_style.bottom;

    div.style.display = modal_style.display;
    div.style.flexDirection = modal_style.flexDirection;
    div.style.justifyContent = modal_style.justifyContent;

    div.style.alignItems = modal_style.alignItems;
    div.style.zIndex = modal_style.zIndex;
    div.style.paddingBottom = modal_style.paddingBottom;

    div.innerHTML = __get_unblock_modal_html(browser, shop_plan);

    div.setAttribute('id', 'com-hextom-smartpushmarketing-unblock-modal');
    return div;
};

var modal_style = {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3147483647,
    paddingBottom: '50px'
};

var show_unblock_modal = function show_unblock_modal(browser, shop_plan) {
    var on_close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    var modal = document.getElementById('com-hextom-smartpushmarketing-unblock-modal');
    if (!modal) {
        modal = __get_unblock_modal(browser, shop_plan);
        // see if modal already attached
        document.body.prepend(modal);
    }
    // window.jQuery('#com-hextom-smartpushmarketing-unblock-modal').css('display', 'flex');
    modal.style.display = 'flex';

    // hide when user click
    modal.onclick = function (e) {
        // window.jQuery('#com-hextom-smartpushmarketing-unblock-modal').css('display', 'none');
        modal.style.display = 'none';
        on_close();
    };
};

/***/ })
/******/ ]);
//# sourceMappingURL=ht-hard-worker-sw.js.map