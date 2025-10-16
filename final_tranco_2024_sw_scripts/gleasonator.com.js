var X = function(t, e) {
  return X = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, n) {
    i.__proto__ = n;
  } || function(i, n) {
    for (var r in n)
      Object.prototype.hasOwnProperty.call(n, r) && (i[r] = n[r]);
  }, X(t, e);
};
function U(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  X(t, e);
  function i() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (i.prototype = e.prototype, new i());
}
var w = function() {
  return w = Object.assign || function(e) {
    for (var i, n = 1, r = arguments.length; n < r; n++) {
      i = arguments[n];
      for (var h in i)
        Object.prototype.hasOwnProperty.call(i, h) && (e[h] = i[h]);
    }
    return e;
  }, w.apply(this, arguments);
};
function re(t, e) {
  var i = {};
  for (var n in t)
    Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (i[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, n = Object.getOwnPropertySymbols(t); r < n.length; r++)
      e.indexOf(n[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[r]) && (i[n[r]] = t[n[r]]);
  return i;
}
function F(t, e, i) {
  if (i || arguments.length === 2)
    for (var n = 0, r = e.length, h; n < r; n++)
      (h || !(n in e)) && (h || (h = Array.prototype.slice.call(e, 0, n)), h[n] = e[n]);
  return t.concat(h || Array.prototype.slice.call(e));
}
var y;
(function(t) {
  t[t.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", t[t.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", t[t.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", t[t.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", t[t.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", t[t.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", t[t.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", t[t.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", t[t.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", t[t.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", t[t.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", t[t.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", t[t.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", t[t.INVALID_TAG = 23] = "INVALID_TAG", t[t.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", t[t.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", t[t.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(y || (y = {}));
var x;
(function(t) {
  t[t.literal = 0] = "literal", t[t.argument = 1] = "argument", t[t.number = 2] = "number", t[t.date = 3] = "date", t[t.time = 4] = "time", t[t.select = 5] = "select", t[t.plural = 6] = "plural", t[t.pound = 7] = "pound", t[t.tag = 8] = "tag";
})(x || (x = {}));
var P;
(function(t) {
  t[t.number = 0] = "number", t[t.dateTime = 1] = "dateTime";
})(P || (P = {}));
function ht(t) {
  return t.type === x.literal;
}
function se(t) {
  return t.type === x.argument;
}
function Ot(t) {
  return t.type === x.number;
}
function Lt(t) {
  return t.type === x.date;
}
function Ct(t) {
  return t.type === x.time;
}
function Mt(t) {
  return t.type === x.select;
}
function Gt(t) {
  return t.type === x.plural;
}
function ue(t) {
  return t.type === x.pound;
}
function Ut(t) {
  return t.type === x.tag;
}
function Dt(t) {
  return !!(t && typeof t == "object" && t.type === P.number);
}
function $(t) {
  return !!(t && typeof t == "object" && t.type === P.dateTime);
}
var Ft = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, fe = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function le(t) {
  var e = {};
  return t.replace(fe, function(i) {
    var n = i.length;
    switch (i[0]) {
      case "G":
        e.era = n === 4 ? "long" : n === 5 ? "narrow" : "short";
        break;
      case "y":
        e.year = n === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      case "M":
      case "L":
        e.month = ["numeric", "2-digit", "short", "long", "narrow"][n - 1];
        break;
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        e.day = ["numeric", "2-digit"][n - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      case "E":
        e.weekday = n === 4 ? "long" : n === 5 ? "narrow" : "short";
        break;
      case "e":
        if (n < 4)
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        e.weekday = ["short", "long", "narrow", "short"][n - 4];
        break;
      case "c":
        if (n < 4)
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        e.weekday = ["short", "long", "narrow", "short"][n - 4];
        break;
      case "a":
        e.hour12 = !0;
        break;
      case "b":
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      case "h":
        e.hourCycle = "h12", e.hour = ["numeric", "2-digit"][n - 1];
        break;
      case "H":
        e.hourCycle = "h23", e.hour = ["numeric", "2-digit"][n - 1];
        break;
      case "K":
        e.hourCycle = "h11", e.hour = ["numeric", "2-digit"][n - 1];
        break;
      case "k":
        e.hourCycle = "h24", e.hour = ["numeric", "2-digit"][n - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      case "m":
        e.minute = ["numeric", "2-digit"][n - 1];
        break;
      case "s":
        e.second = ["numeric", "2-digit"][n - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      case "z":
        e.timeZoneName = n < 4 ? "short" : "long";
        break;
      case "Z":
      case "O":
      case "v":
      case "V":
      case "X":
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  }), e;
}
var ce = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function me(t) {
  if (t.length === 0)
    throw new Error("Number skeleton cannot be empty");
  for (var e = t.split(ce).filter(function(c) {
    return c.length > 0;
  }), i = [], n = 0, r = e; n < r.length; n++) {
    var h = r[n], p = h.split("/");
    if (p.length === 0)
      throw new Error("Invalid number skeleton");
    for (var f = p[0], u = p.slice(1), o = 0, a = u; o < a.length; o++) {
      var s = a[o];
      if (s.length === 0)
        throw new Error("Invalid number skeleton");
    }
    i.push({ stem: f, options: u });
  }
  return i;
}
function he(t) {
  return t.replace(/^(.*?)-/, "");
}
var pt = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g, qt = /^(@+)?(\+|#+)?[rs]?$/g, pe = /(\*)(0+)|(#+)(0+)|(0+)/g, zt = /^(0+)$/;
function dt(t) {
  var e = {};
  return t[t.length - 1] === "r" ? e.roundingPriority = "morePrecision" : t[t.length - 1] === "s" && (e.roundingPriority = "lessPrecision"), t.replace(qt, function(i, n, r) {
    return typeof r != "string" ? (e.minimumSignificantDigits = n.length, e.maximumSignificantDigits = n.length) : r === "+" ? e.minimumSignificantDigits = n.length : n[0] === "#" ? e.maximumSignificantDigits = n.length : (e.minimumSignificantDigits = n.length, e.maximumSignificantDigits = n.length + (typeof r == "string" ? r.length : 0)), "";
  }), e;
}
function Vt(t) {
  switch (t) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function de(t) {
  var e;
  if (t[0] === "E" && t[1] === "E" ? (e = {
    notation: "engineering"
  }, t = t.slice(2)) : t[0] === "E" && (e = {
    notation: "scientific"
  }, t = t.slice(1)), e) {
    var i = t.slice(0, 2);
    if (i === "+!" ? (e.signDisplay = "always", t = t.slice(2)) : i === "+?" && (e.signDisplay = "exceptZero", t = t.slice(2)), !zt.test(t))
      throw new Error("Malformed concise eng/scientific notation");
    e.minimumIntegerDigits = t.length;
  }
  return e;
}
function vt(t) {
  var e = {}, i = Vt(t);
  return i || e;
}
function ve(t) {
  for (var e = {}, i = 0, n = t; i < n.length; i++) {
    var r = n[i];
    switch (r.stem) {
      case "percent":
      case "%":
        e.style = "percent";
        continue;
      case "%x100":
        e.style = "percent", e.scale = 100;
        continue;
      case "currency":
        e.style = "currency", e.currency = r.options[0];
        continue;
      case "group-off":
      case ",_":
        e.useGrouping = !1;
        continue;
      case "precision-integer":
      case ".":
        e.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        e.style = "unit", e.unit = he(r.options[0]);
        continue;
      case "compact-short":
      case "K":
        e.notation = "compact", e.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        e.notation = "compact", e.compactDisplay = "long";
        continue;
      case "scientific":
        e = w(w(w({}, e), { notation: "scientific" }), r.options.reduce(function(u, o) {
          return w(w({}, u), vt(o));
        }, {}));
        continue;
      case "engineering":
        e = w(w(w({}, e), { notation: "engineering" }), r.options.reduce(function(u, o) {
          return w(w({}, u), vt(o));
        }, {}));
        continue;
      case "notation-simple":
        e.notation = "standard";
        continue;
      case "unit-width-narrow":
        e.currencyDisplay = "narrowSymbol", e.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        e.currencyDisplay = "code", e.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        e.currencyDisplay = "name", e.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        e.currencyDisplay = "symbol";
        continue;
      case "scale":
        e.scale = parseFloat(r.options[0]);
        continue;
      case "rounding-mode-floor":
        e.roundingMode = "floor";
        continue;
      case "rounding-mode-ceiling":
        e.roundingMode = "ceil";
        continue;
      case "rounding-mode-down":
        e.roundingMode = "trunc";
        continue;
      case "rounding-mode-up":
        e.roundingMode = "expand";
        continue;
      case "rounding-mode-half-even":
        e.roundingMode = "halfEven";
        continue;
      case "rounding-mode-half-down":
        e.roundingMode = "halfTrunc";
        continue;
      case "rounding-mode-half-up":
        e.roundingMode = "halfExpand";
        continue;
      case "integer-width":
        if (r.options.length > 1)
          throw new RangeError("integer-width stems only accept a single optional option");
        r.options[0].replace(pe, function(u, o, a, s, c, l) {
          if (o)
            e.minimumIntegerDigits = a.length;
          else {
            if (s && c)
              throw new Error("We currently do not support maximum integer digits");
            if (l)
              throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (zt.test(r.stem)) {
      e.minimumIntegerDigits = r.stem.length;
      continue;
    }
    if (pt.test(r.stem)) {
      if (r.options.length > 1)
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      r.stem.replace(pt, function(u, o, a, s, c, l) {
        return a === "*" ? e.minimumFractionDigits = o.length : s && s[0] === "#" ? e.maximumFractionDigits = s.length : c && l ? (e.minimumFractionDigits = c.length, e.maximumFractionDigits = c.length + l.length) : (e.minimumFractionDigits = o.length, e.maximumFractionDigits = o.length), "";
      });
      var h = r.options[0];
      h === "w" ? e = w(w({}, e), { trailingZeroDisplay: "stripIfInteger" }) : h && (e = w(w({}, e), dt(h)));
      continue;
    }
    if (qt.test(r.stem)) {
      e = w(w({}, e), dt(r.stem));
      continue;
    }
    var p = Vt(r.stem);
    p && (e = w(w({}, e), p));
    var f = de(r.stem);
    f && (e = w(w({}, e), f));
  }
  return e;
}
var C = {
  "001": [
    "H",
    "h"
  ],
  AC: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  AD: [
    "H",
    "hB"
  ],
  AE: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  AF: [
    "H",
    "hb",
    "hB",
    "h"
  ],
  AG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  AI: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  AL: [
    "h",
    "H",
    "hB"
  ],
  AM: [
    "H",
    "hB"
  ],
  AO: [
    "H",
    "hB"
  ],
  AR: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  AS: [
    "h",
    "H"
  ],
  AT: [
    "H",
    "hB"
  ],
  AU: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  AW: [
    "H",
    "hB"
  ],
  AX: [
    "H"
  ],
  AZ: [
    "H",
    "hB",
    "h"
  ],
  BA: [
    "H",
    "hB",
    "h"
  ],
  BB: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BD: [
    "h",
    "hB",
    "H"
  ],
  BE: [
    "H",
    "hB"
  ],
  BF: [
    "H",
    "hB"
  ],
  BG: [
    "H",
    "hB",
    "h"
  ],
  BH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  BI: [
    "H",
    "h"
  ],
  BJ: [
    "H",
    "hB"
  ],
  BL: [
    "H",
    "hB"
  ],
  BM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BN: [
    "hb",
    "hB",
    "h",
    "H"
  ],
  BO: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  BQ: [
    "H"
  ],
  BR: [
    "H",
    "hB"
  ],
  BS: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BT: [
    "h",
    "H"
  ],
  BW: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  BY: [
    "H",
    "h"
  ],
  BZ: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CA: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  CC: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CD: [
    "hB",
    "H"
  ],
  CF: [
    "H",
    "h",
    "hB"
  ],
  CG: [
    "H",
    "hB"
  ],
  CH: [
    "H",
    "hB",
    "h"
  ],
  CI: [
    "H",
    "hB"
  ],
  CK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CL: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  CM: [
    "H",
    "h",
    "hB"
  ],
  CN: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  CO: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  CP: [
    "H"
  ],
  CR: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  CU: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  CV: [
    "H",
    "hB"
  ],
  CW: [
    "H",
    "hB"
  ],
  CX: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CY: [
    "h",
    "H",
    "hb",
    "hB"
  ],
  CZ: [
    "H"
  ],
  DE: [
    "H",
    "hB"
  ],
  DG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  DJ: [
    "h",
    "H"
  ],
  DK: [
    "H"
  ],
  DM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  DO: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  DZ: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  EA: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  EC: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  EE: [
    "H",
    "hB"
  ],
  EG: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  EH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  ER: [
    "h",
    "H"
  ],
  ES: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  ET: [
    "hB",
    "hb",
    "h",
    "H"
  ],
  FI: [
    "H"
  ],
  FJ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  FK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  FM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  FO: [
    "H",
    "h"
  ],
  FR: [
    "H",
    "hB"
  ],
  GA: [
    "H",
    "hB"
  ],
  GB: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GD: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GE: [
    "H",
    "hB",
    "h"
  ],
  GF: [
    "H",
    "hB"
  ],
  GG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GH: [
    "h",
    "H"
  ],
  GI: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GL: [
    "H",
    "h"
  ],
  GM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GN: [
    "H",
    "hB"
  ],
  GP: [
    "H",
    "hB"
  ],
  GQ: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  GR: [
    "h",
    "H",
    "hb",
    "hB"
  ],
  GT: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  GU: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GW: [
    "H",
    "hB"
  ],
  GY: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  HK: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  HN: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  HR: [
    "H",
    "hB"
  ],
  HU: [
    "H",
    "h"
  ],
  IC: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  ID: [
    "H"
  ],
  IE: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IL: [
    "H",
    "hB"
  ],
  IM: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IN: [
    "h",
    "H"
  ],
  IO: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IQ: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  IR: [
    "hB",
    "H"
  ],
  IS: [
    "H"
  ],
  IT: [
    "H",
    "hB"
  ],
  JE: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  JM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  JO: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  JP: [
    "H",
    "K",
    "h"
  ],
  KE: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  KG: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  KH: [
    "hB",
    "h",
    "H",
    "hb"
  ],
  KI: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KM: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  KN: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KP: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  KR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  KW: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  KY: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KZ: [
    "H",
    "hB"
  ],
  LA: [
    "H",
    "hb",
    "hB",
    "h"
  ],
  LB: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  LC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  LI: [
    "H",
    "hB",
    "h"
  ],
  LK: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  LR: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  LS: [
    "h",
    "H"
  ],
  LT: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  LU: [
    "H",
    "h",
    "hB"
  ],
  LV: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  LY: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MA: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  MC: [
    "H",
    "hB"
  ],
  MD: [
    "H",
    "hB"
  ],
  ME: [
    "H",
    "hB",
    "h"
  ],
  MF: [
    "H",
    "hB"
  ],
  MG: [
    "H",
    "h"
  ],
  MH: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  ML: [
    "H"
  ],
  MM: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  MN: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  MO: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MP: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MQ: [
    "H",
    "hB"
  ],
  MR: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MS: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  MT: [
    "H",
    "h"
  ],
  MU: [
    "H",
    "h"
  ],
  MV: [
    "H",
    "h"
  ],
  MW: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MX: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  MY: [
    "hb",
    "hB",
    "h",
    "H"
  ],
  MZ: [
    "H",
    "hB"
  ],
  NA: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  NC: [
    "H",
    "hB"
  ],
  NE: [
    "H"
  ],
  NF: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NI: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  NL: [
    "H",
    "hB"
  ],
  NO: [
    "H",
    "h"
  ],
  NP: [
    "H",
    "h",
    "hB"
  ],
  NR: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NU: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NZ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  OM: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PA: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  PE: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  PF: [
    "H",
    "h",
    "hB"
  ],
  PG: [
    "h",
    "H"
  ],
  PH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PK: [
    "h",
    "hB",
    "H"
  ],
  PL: [
    "H",
    "h"
  ],
  PM: [
    "H",
    "hB"
  ],
  PN: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  PR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  PS: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PT: [
    "H",
    "hB"
  ],
  PW: [
    "h",
    "H"
  ],
  PY: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  QA: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  RE: [
    "H",
    "hB"
  ],
  RO: [
    "H",
    "hB"
  ],
  RS: [
    "H",
    "hB",
    "h"
  ],
  RU: [
    "H"
  ],
  RW: [
    "H",
    "h"
  ],
  SA: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SB: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SC: [
    "H",
    "h",
    "hB"
  ],
  SD: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SE: [
    "H"
  ],
  SG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SH: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  SI: [
    "H",
    "hB"
  ],
  SJ: [
    "H"
  ],
  SK: [
    "H"
  ],
  SL: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SM: [
    "H",
    "h",
    "hB"
  ],
  SN: [
    "H",
    "h",
    "hB"
  ],
  SO: [
    "h",
    "H"
  ],
  SR: [
    "H",
    "hB"
  ],
  SS: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  ST: [
    "H",
    "hB"
  ],
  SV: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  SX: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  SY: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SZ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TA: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  TC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TD: [
    "h",
    "H",
    "hB"
  ],
  TF: [
    "H",
    "h",
    "hB"
  ],
  TG: [
    "H",
    "hB"
  ],
  TH: [
    "H",
    "h"
  ],
  TJ: [
    "H",
    "h"
  ],
  TL: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  TM: [
    "H",
    "h"
  ],
  TN: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  TO: [
    "h",
    "H"
  ],
  TR: [
    "H",
    "hB"
  ],
  TT: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TW: [
    "hB",
    "hb",
    "h",
    "H"
  ],
  TZ: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  UA: [
    "H",
    "hB",
    "h"
  ],
  UG: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  UM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  US: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  UY: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  UZ: [
    "H",
    "hB",
    "h"
  ],
  VA: [
    "H",
    "h",
    "hB"
  ],
  VC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VE: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  VG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VI: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VN: [
    "H",
    "h"
  ],
  VU: [
    "h",
    "H"
  ],
  WF: [
    "H",
    "hB"
  ],
  WS: [
    "h",
    "H"
  ],
  XK: [
    "H",
    "hB",
    "h"
  ],
  YE: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  YT: [
    "H",
    "hB"
  ],
  ZA: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  ZM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  ZW: [
    "H",
    "h"
  ],
  "af-ZA": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "ar-001": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "ca-ES": [
    "H",
    "h",
    "hB"
  ],
  "en-001": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "es-BO": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-BR": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-EC": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-ES": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-GQ": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-PE": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "fr-CA": [
    "H",
    "h",
    "hB"
  ],
  "gl-ES": [
    "H",
    "h",
    "hB"
  ],
  "gu-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "hi-IN": [
    "hB",
    "h",
    "H"
  ],
  "it-CH": [
    "H",
    "h",
    "hB"
  ],
  "it-IT": [
    "H",
    "h",
    "hB"
  ],
  "kn-IN": [
    "hB",
    "h",
    "H"
  ],
  "ml-IN": [
    "hB",
    "h",
    "H"
  ],
  "mr-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "pa-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "ta-IN": [
    "hB",
    "h",
    "hb",
    "H"
  ],
  "te-IN": [
    "hB",
    "h",
    "H"
  ],
  "zu-ZA": [
    "H",
    "hB",
    "hb",
    "h"
  ]
};
function ge(t, e) {
  for (var i = "", n = 0; n < t.length; n++) {
    var r = t.charAt(n);
    if (r === "j") {
      for (var h = 0; n + 1 < t.length && t.charAt(n + 1) === r; )
        h++, n++;
      var p = 1 + (h & 1), f = h < 2 ? 1 : 3 + (h >> 1), u = "a", o = be(e);
      for ((o == "H" || o == "k") && (f = 0); f-- > 0; )
        i += u;
      for (; p-- > 0; )
        i = o + i;
    } else
      r === "J" ? i += "H" : i += r;
  }
  return i;
}
function be(t) {
  var e = t.hourCycle;
  if (e === void 0 && // @ts-ignore hourCycle(s) is not identified yet
  t.hourCycles && // @ts-ignore
  t.hourCycles.length && (e = t.hourCycles[0]), e)
    switch (e) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
  var i = t.language, n;
  i !== "root" && (n = t.maximize().region);
  var r = C[n || ""] || C[i || ""] || C["".concat(i, "-001")] || C["001"];
  return r[0];
}
var q, ye = new RegExp("^".concat(Ft.source, "*")), _e = new RegExp("".concat(Ft.source, "*$"));
function _(t, e) {
  return { start: t, end: e };
}
var we = !!String.prototype.startsWith && "_a".startsWith("a", 1), xe = !!String.fromCodePoint, Ee = !!Object.fromEntries, Se = !!String.prototype.codePointAt, Te = !!String.prototype.trimStart, He = !!String.prototype.trimEnd, Ne = !!Number.isSafeInteger, Be = Ne ? Number.isSafeInteger : function(t) {
  return typeof t == "number" && isFinite(t) && Math.floor(t) === t && Math.abs(t) <= 9007199254740991;
}, Z = !0;
try {
  var Ae = Xt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Z = ((q = Ae.exec("a")) === null || q === void 0 ? void 0 : q[0]) === "a";
} catch {
  Z = !1;
}
var gt = we ? (
  // Native
  function(e, i, n) {
    return e.startsWith(i, n);
  }
) : (
  // For IE11
  function(e, i, n) {
    return e.slice(n, n + i.length) === i;
  }
), J = xe ? String.fromCodePoint : (
  // IE11
  function() {
    for (var e = [], i = 0; i < arguments.length; i++)
      e[i] = arguments[i];
    for (var n = "", r = e.length, h = 0, p; r > h; ) {
      if (p = e[h++], p > 1114111)
        throw RangeError(p + " is not a valid code point");
      n += p < 65536 ? String.fromCharCode(p) : String.fromCharCode(((p -= 65536) >> 10) + 55296, p % 1024 + 56320);
    }
    return n;
  }
), bt = (
  // native
  Ee ? Object.fromEntries : (
    // Ponyfill
    function(e) {
      for (var i = {}, n = 0, r = e; n < r.length; n++) {
        var h = r[n], p = h[0], f = h[1];
        i[p] = f;
      }
      return i;
    }
  )
), Wt = Se ? (
  // Native
  function(e, i) {
    return e.codePointAt(i);
  }
) : (
  // IE 11
  function(e, i) {
    var n = e.length;
    if (!(i < 0 || i >= n)) {
      var r = e.charCodeAt(i), h;
      return r < 55296 || r > 56319 || i + 1 === n || (h = e.charCodeAt(i + 1)) < 56320 || h > 57343 ? r : (r - 55296 << 10) + (h - 56320) + 65536;
    }
  }
), Pe = Te ? (
  // Native
  function(e) {
    return e.trimStart();
  }
) : (
  // Ponyfill
  function(e) {
    return e.replace(ye, "");
  }
), je = He ? (
  // Native
  function(e) {
    return e.trimEnd();
  }
) : (
  // Ponyfill
  function(e) {
    return e.replace(_e, "");
  }
);
function Xt(t, e) {
  return new RegExp(t, e);
}
var Q;
if (Z) {
  var yt = Xt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Q = function(e, i) {
    var n;
    yt.lastIndex = i;
    var r = yt.exec(e);
    return (n = r[1]) !== null && n !== void 0 ? n : "";
  };
} else
  Q = function(e, i) {
    for (var n = []; ; ) {
      var r = Wt(e, i);
      if (r === void 0 || $t(r) || Oe(r))
        break;
      n.push(r), i += r >= 65536 ? 2 : 1;
    }
    return J.apply(void 0, n);
  };
var Ie = (
  /** @class */
  function() {
    function t(e, i) {
      i === void 0 && (i = {}), this.message = e, this.position = { offset: 0, line: 1, column: 1 }, this.ignoreTag = !!i.ignoreTag, this.locale = i.locale, this.requiresOtherClause = !!i.requiresOtherClause, this.shouldParseSkeletons = !!i.shouldParseSkeletons;
    }
    return t.prototype.parse = function() {
      if (this.offset() !== 0)
        throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }, t.prototype.parseMessage = function(e, i, n) {
      for (var r = []; !this.isEOF(); ) {
        var h = this.char();
        if (h === 123) {
          var p = this.parseArgument(e, n);
          if (p.err)
            return p;
          r.push(p.val);
        } else {
          if (h === 125 && e > 0)
            break;
          if (h === 35 && (i === "plural" || i === "selectordinal")) {
            var f = this.clonePosition();
            this.bump(), r.push({
              type: x.pound,
              location: _(f, this.clonePosition())
            });
          } else if (h === 60 && !this.ignoreTag && this.peek() === 47) {
            if (n)
              break;
            return this.error(y.UNMATCHED_CLOSING_TAG, _(this.clonePosition(), this.clonePosition()));
          } else if (h === 60 && !this.ignoreTag && Y(this.peek() || 0)) {
            var p = this.parseTag(e, i);
            if (p.err)
              return p;
            r.push(p.val);
          } else {
            var p = this.parseLiteral(e, i);
            if (p.err)
              return p;
            r.push(p.val);
          }
        }
      }
      return { val: r, err: null };
    }, t.prototype.parseTag = function(e, i) {
      var n = this.clonePosition();
      this.bump();
      var r = this.parseTagName();
      if (this.bumpSpace(), this.bumpIf("/>"))
        return {
          val: {
            type: x.literal,
            value: "<".concat(r, "/>"),
            location: _(n, this.clonePosition())
          },
          err: null
        };
      if (this.bumpIf(">")) {
        var h = this.parseMessage(e + 1, i, !0);
        if (h.err)
          return h;
        var p = h.val, f = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Y(this.char()))
            return this.error(y.INVALID_TAG, _(f, this.clonePosition()));
          var u = this.clonePosition(), o = this.parseTagName();
          return r !== o ? this.error(y.UNMATCHED_CLOSING_TAG, _(u, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: x.tag,
              value: r,
              children: p,
              location: _(n, this.clonePosition())
            },
            err: null
          } : this.error(y.INVALID_TAG, _(f, this.clonePosition())));
        } else
          return this.error(y.UNCLOSED_TAG, _(n, this.clonePosition()));
      } else
        return this.error(y.INVALID_TAG, _(n, this.clonePosition()));
    }, t.prototype.parseTagName = function() {
      var e = this.offset();
      for (this.bump(); !this.isEOF() && ke(this.char()); )
        this.bump();
      return this.message.slice(e, this.offset());
    }, t.prototype.parseLiteral = function(e, i) {
      for (var n = this.clonePosition(), r = ""; ; ) {
        var h = this.tryParseQuote(i);
        if (h) {
          r += h;
          continue;
        }
        var p = this.tryParseUnquoted(e, i);
        if (p) {
          r += p;
          continue;
        }
        var f = this.tryParseLeftAngleBracket();
        if (f) {
          r += f;
          continue;
        }
        break;
      }
      var u = _(n, this.clonePosition());
      return {
        val: { type: x.literal, value: r, location: u },
        err: null
      };
    }, t.prototype.tryParseLeftAngleBracket = function() {
      return !this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
      !Re(this.peek() || 0)) ? (this.bump(), "<") : null;
    }, t.prototype.tryParseQuote = function(e) {
      if (this.isEOF() || this.char() !== 39)
        return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (e === "plural" || e === "selectordinal")
            break;
          return null;
        default:
          return null;
      }
      this.bump();
      var i = [this.char()];
      for (this.bump(); !this.isEOF(); ) {
        var n = this.char();
        if (n === 39)
          if (this.peek() === 39)
            i.push(39), this.bump();
          else {
            this.bump();
            break;
          }
        else
          i.push(n);
        this.bump();
      }
      return J.apply(void 0, i);
    }, t.prototype.tryParseUnquoted = function(e, i) {
      if (this.isEOF())
        return null;
      var n = this.char();
      return n === 60 || n === 123 || n === 35 && (i === "plural" || i === "selectordinal") || n === 125 && e > 0 ? null : (this.bump(), J(n));
    }, t.prototype.parseArgument = function(e, i) {
      var n = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF())
        return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE, _(n, this.clonePosition()));
      if (this.char() === 125)
        return this.bump(), this.error(y.EMPTY_ARGUMENT, _(n, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r)
        return this.error(y.MALFORMED_ARGUMENT, _(n, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF())
        return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE, _(n, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: x.argument,
              // value does not include the opening and closing braces.
              value: r,
              location: _(n, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE, _(n, this.clonePosition())) : this.parseArgumentOptions(e, i, r, n);
        default:
          return this.error(y.MALFORMED_ARGUMENT, _(n, this.clonePosition()));
      }
    }, t.prototype.parseIdentifierIfPossible = function() {
      var e = this.clonePosition(), i = this.offset(), n = Q(this.message, i), r = i + n.length;
      this.bumpTo(r);
      var h = this.clonePosition(), p = _(e, h);
      return { value: n, location: p };
    }, t.prototype.parseArgumentOptions = function(e, i, n, r) {
      var h, p = this.clonePosition(), f = this.parseIdentifierIfPossible().value, u = this.clonePosition();
      switch (f) {
        case "":
          return this.error(y.EXPECT_ARGUMENT_TYPE, _(p, u));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var o = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var a = this.clonePosition(), s = this.parseSimpleArgStyleIfPossible();
            if (s.err)
              return s;
            var c = je(s.val);
            if (c.length === 0)
              return this.error(y.EXPECT_ARGUMENT_STYLE, _(this.clonePosition(), this.clonePosition()));
            var l = _(a, this.clonePosition());
            o = { style: c, styleLocation: l };
          }
          var m = this.tryParseArgumentClose(r);
          if (m.err)
            return m;
          var d = _(r, this.clonePosition());
          if (o && gt(o == null ? void 0 : o.style, "::", 0)) {
            var v = Pe(o.style.slice(2));
            if (f === "number") {
              var s = this.parseNumberSkeletonFromString(v, o.styleLocation);
              return s.err ? s : {
                val: { type: x.number, value: n, location: d, style: s.val },
                err: null
              };
            } else {
              if (v.length === 0)
                return this.error(y.EXPECT_DATE_TIME_SKELETON, d);
              var g = v;
              this.locale && (g = ge(v, this.locale));
              var c = {
                type: P.dateTime,
                pattern: g,
                location: o.styleLocation,
                parsedOptions: this.shouldParseSkeletons ? le(g) : {}
              }, b = f === "date" ? x.date : x.time;
              return {
                val: { type: b, value: n, location: d, style: c },
                err: null
              };
            }
          }
          return {
            val: {
              type: f === "number" ? x.number : f === "date" ? x.date : x.time,
              value: n,
              location: d,
              style: (h = o == null ? void 0 : o.style) !== null && h !== void 0 ? h : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var T = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(","))
            return this.error(y.EXPECT_SELECT_ARGUMENT_OPTIONS, _(T, w({}, T)));
          this.bumpSpace();
          var A = this.parseIdentifierIfPossible(), S = 0;
          if (f !== "select" && A.value === "offset") {
            if (!this.bumpIf(":"))
              return this.error(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, _(this.clonePosition(), this.clonePosition()));
            this.bumpSpace();
            var s = this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, y.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
            if (s.err)
              return s;
            this.bumpSpace(), A = this.parseIdentifierIfPossible(), S = s.val;
          }
          var L = this.tryParsePluralOrSelectOptions(e, f, i, A);
          if (L.err)
            return L;
          var m = this.tryParseArgumentClose(r);
          if (m.err)
            return m;
          var mt = _(r, this.clonePosition());
          return f === "select" ? {
            val: {
              type: x.select,
              value: n,
              options: bt(L.val),
              location: mt
            },
            err: null
          } : {
            val: {
              type: x.plural,
              value: n,
              options: bt(L.val),
              offset: S,
              pluralType: f === "plural" ? "cardinal" : "ordinal",
              location: mt
            },
            err: null
          };
        }
        default:
          return this.error(y.INVALID_ARGUMENT_TYPE, _(p, u));
      }
    }, t.prototype.tryParseArgumentClose = function(e) {
      return this.isEOF() || this.char() !== 125 ? this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE, _(e, this.clonePosition())) : (this.bump(), { val: !0, err: null });
    }, t.prototype.parseSimpleArgStyleIfPossible = function() {
      for (var e = 0, i = this.clonePosition(); !this.isEOF(); ) {
        var n = this.char();
        switch (n) {
          case 39: {
            this.bump();
            var r = this.clonePosition();
            if (!this.bumpUntil("'"))
              return this.error(y.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, _(r, this.clonePosition()));
            this.bump();
            break;
          }
          case 123: {
            e += 1, this.bump();
            break;
          }
          case 125: {
            if (e > 0)
              e -= 1;
            else
              return {
                val: this.message.slice(i.offset, this.offset()),
                err: null
              };
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return {
        val: this.message.slice(i.offset, this.offset()),
        err: null
      };
    }, t.prototype.parseNumberSkeletonFromString = function(e, i) {
      var n = [];
      try {
        n = me(e);
      } catch {
        return this.error(y.INVALID_NUMBER_SKELETON, i);
      }
      return {
        val: {
          type: P.number,
          tokens: n,
          location: i,
          parsedOptions: this.shouldParseSkeletons ? ve(n) : {}
        },
        err: null
      };
    }, t.prototype.tryParsePluralOrSelectOptions = function(e, i, n, r) {
      for (var h, p = !1, f = [], u = /* @__PURE__ */ new Set(), o = r.value, a = r.location; ; ) {
        if (o.length === 0) {
          var s = this.clonePosition();
          if (i !== "select" && this.bumpIf("=")) {
            var c = this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_SELECTOR, y.INVALID_PLURAL_ARGUMENT_SELECTOR);
            if (c.err)
              return c;
            a = _(s, this.clonePosition()), o = this.message.slice(s.offset, this.offset());
          } else
            break;
        }
        if (u.has(o))
          return this.error(i === "select" ? y.DUPLICATE_SELECT_ARGUMENT_SELECTOR : y.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, a);
        o === "other" && (p = !0), this.bumpSpace();
        var l = this.clonePosition();
        if (!this.bumpIf("{"))
          return this.error(i === "select" ? y.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : y.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, _(this.clonePosition(), this.clonePosition()));
        var m = this.parseMessage(e + 1, i, n);
        if (m.err)
          return m;
        var d = this.tryParseArgumentClose(l);
        if (d.err)
          return d;
        f.push([
          o,
          {
            value: m.val,
            location: _(l, this.clonePosition())
          }
        ]), u.add(o), this.bumpSpace(), h = this.parseIdentifierIfPossible(), o = h.value, a = h.location;
      }
      return f.length === 0 ? this.error(i === "select" ? y.EXPECT_SELECT_ARGUMENT_SELECTOR : y.EXPECT_PLURAL_ARGUMENT_SELECTOR, _(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !p ? this.error(y.MISSING_OTHER_CLAUSE, _(this.clonePosition(), this.clonePosition())) : { val: f, err: null };
    }, t.prototype.tryParseDecimalInteger = function(e, i) {
      var n = 1, r = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (n = -1);
      for (var h = !1, p = 0; !this.isEOF(); ) {
        var f = this.char();
        if (f >= 48 && f <= 57)
          h = !0, p = p * 10 + (f - 48), this.bump();
        else
          break;
      }
      var u = _(r, this.clonePosition());
      return h ? (p *= n, Be(p) ? { val: p, err: null } : this.error(i, u)) : this.error(e, u);
    }, t.prototype.offset = function() {
      return this.position.offset;
    }, t.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    }, t.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }, t.prototype.char = function() {
      var e = this.position.offset;
      if (e >= this.message.length)
        throw Error("out of bound");
      var i = Wt(this.message, e);
      if (i === void 0)
        throw Error("Offset ".concat(e, " is at invalid UTF-16 code unit boundary"));
      return i;
    }, t.prototype.error = function(e, i) {
      return {
        val: null,
        err: {
          kind: e,
          message: this.message,
          location: i
        }
      };
    }, t.prototype.bump = function() {
      if (!this.isEOF()) {
        var e = this.char();
        e === 10 ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += e < 65536 ? 1 : 2);
      }
    }, t.prototype.bumpIf = function(e) {
      if (gt(this.message, e, this.offset())) {
        for (var i = 0; i < e.length; i++)
          this.bump();
        return !0;
      }
      return !1;
    }, t.prototype.bumpUntil = function(e) {
      var i = this.offset(), n = this.message.indexOf(e, i);
      return n >= 0 ? (this.bumpTo(n), !0) : (this.bumpTo(this.message.length), !1);
    }, t.prototype.bumpTo = function(e) {
      if (this.offset() > e)
        throw Error("targetOffset ".concat(e, " must be greater than or equal to the current offset ").concat(this.offset()));
      for (e = Math.min(e, this.message.length); ; ) {
        var i = this.offset();
        if (i === e)
          break;
        if (i > e)
          throw Error("targetOffset ".concat(e, " is at invalid UTF-16 code unit boundary"));
        if (this.bump(), this.isEOF())
          break;
      }
    }, t.prototype.bumpSpace = function() {
      for (; !this.isEOF() && $t(this.char()); )
        this.bump();
    }, t.prototype.peek = function() {
      if (this.isEOF())
        return null;
      var e = this.char(), i = this.offset(), n = this.message.charCodeAt(i + (e >= 65536 ? 2 : 1));
      return n ?? null;
    }, t;
  }()
);
function Y(t) {
  return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
function Re(t) {
  return Y(t) || t === 47;
}
function ke(t) {
  return t === 45 || t === 46 || t >= 48 && t <= 57 || t === 95 || t >= 97 && t <= 122 || t >= 65 && t <= 90 || t == 183 || t >= 192 && t <= 214 || t >= 216 && t <= 246 || t >= 248 && t <= 893 || t >= 895 && t <= 8191 || t >= 8204 && t <= 8205 || t >= 8255 && t <= 8256 || t >= 8304 && t <= 8591 || t >= 11264 && t <= 12271 || t >= 12289 && t <= 55295 || t >= 63744 && t <= 64975 || t >= 65008 && t <= 65533 || t >= 65536 && t <= 983039;
}
function $t(t) {
  return t >= 9 && t <= 13 || t === 32 || t === 133 || t >= 8206 && t <= 8207 || t === 8232 || t === 8233;
}
function Oe(t) {
  return t >= 33 && t <= 35 || t === 36 || t >= 37 && t <= 39 || t === 40 || t === 41 || t === 42 || t === 43 || t === 44 || t === 45 || t >= 46 && t <= 47 || t >= 58 && t <= 59 || t >= 60 && t <= 62 || t >= 63 && t <= 64 || t === 91 || t === 92 || t === 93 || t === 94 || t === 96 || t === 123 || t === 124 || t === 125 || t === 126 || t === 161 || t >= 162 && t <= 165 || t === 166 || t === 167 || t === 169 || t === 171 || t === 172 || t === 174 || t === 176 || t === 177 || t === 182 || t === 187 || t === 191 || t === 215 || t === 247 || t >= 8208 && t <= 8213 || t >= 8214 && t <= 8215 || t === 8216 || t === 8217 || t === 8218 || t >= 8219 && t <= 8220 || t === 8221 || t === 8222 || t === 8223 || t >= 8224 && t <= 8231 || t >= 8240 && t <= 8248 || t === 8249 || t === 8250 || t >= 8251 && t <= 8254 || t >= 8257 && t <= 8259 || t === 8260 || t === 8261 || t === 8262 || t >= 8263 && t <= 8273 || t === 8274 || t === 8275 || t >= 8277 && t <= 8286 || t >= 8592 && t <= 8596 || t >= 8597 && t <= 8601 || t >= 8602 && t <= 8603 || t >= 8604 && t <= 8607 || t === 8608 || t >= 8609 && t <= 8610 || t === 8611 || t >= 8612 && t <= 8613 || t === 8614 || t >= 8615 && t <= 8621 || t === 8622 || t >= 8623 && t <= 8653 || t >= 8654 && t <= 8655 || t >= 8656 && t <= 8657 || t === 8658 || t === 8659 || t === 8660 || t >= 8661 && t <= 8691 || t >= 8692 && t <= 8959 || t >= 8960 && t <= 8967 || t === 8968 || t === 8969 || t === 8970 || t === 8971 || t >= 8972 && t <= 8991 || t >= 8992 && t <= 8993 || t >= 8994 && t <= 9e3 || t === 9001 || t === 9002 || t >= 9003 && t <= 9083 || t === 9084 || t >= 9085 && t <= 9114 || t >= 9115 && t <= 9139 || t >= 9140 && t <= 9179 || t >= 9180 && t <= 9185 || t >= 9186 && t <= 9254 || t >= 9255 && t <= 9279 || t >= 9280 && t <= 9290 || t >= 9291 && t <= 9311 || t >= 9472 && t <= 9654 || t === 9655 || t >= 9656 && t <= 9664 || t === 9665 || t >= 9666 && t <= 9719 || t >= 9720 && t <= 9727 || t >= 9728 && t <= 9838 || t === 9839 || t >= 9840 && t <= 10087 || t === 10088 || t === 10089 || t === 10090 || t === 10091 || t === 10092 || t === 10093 || t === 10094 || t === 10095 || t === 10096 || t === 10097 || t === 10098 || t === 10099 || t === 10100 || t === 10101 || t >= 10132 && t <= 10175 || t >= 10176 && t <= 10180 || t === 10181 || t === 10182 || t >= 10183 && t <= 10213 || t === 10214 || t === 10215 || t === 10216 || t === 10217 || t === 10218 || t === 10219 || t === 10220 || t === 10221 || t === 10222 || t === 10223 || t >= 10224 && t <= 10239 || t >= 10240 && t <= 10495 || t >= 10496 && t <= 10626 || t === 10627 || t === 10628 || t === 10629 || t === 10630 || t === 10631 || t === 10632 || t === 10633 || t === 10634 || t === 10635 || t === 10636 || t === 10637 || t === 10638 || t === 10639 || t === 10640 || t === 10641 || t === 10642 || t === 10643 || t === 10644 || t === 10645 || t === 10646 || t === 10647 || t === 10648 || t >= 10649 && t <= 10711 || t === 10712 || t === 10713 || t === 10714 || t === 10715 || t >= 10716 && t <= 10747 || t === 10748 || t === 10749 || t >= 10750 && t <= 11007 || t >= 11008 && t <= 11055 || t >= 11056 && t <= 11076 || t >= 11077 && t <= 11078 || t >= 11079 && t <= 11084 || t >= 11085 && t <= 11123 || t >= 11124 && t <= 11125 || t >= 11126 && t <= 11157 || t === 11158 || t >= 11159 && t <= 11263 || t >= 11776 && t <= 11777 || t === 11778 || t === 11779 || t === 11780 || t === 11781 || t >= 11782 && t <= 11784 || t === 11785 || t === 11786 || t === 11787 || t === 11788 || t === 11789 || t >= 11790 && t <= 11798 || t === 11799 || t >= 11800 && t <= 11801 || t === 11802 || t === 11803 || t === 11804 || t === 11805 || t >= 11806 && t <= 11807 || t === 11808 || t === 11809 || t === 11810 || t === 11811 || t === 11812 || t === 11813 || t === 11814 || t === 11815 || t === 11816 || t === 11817 || t >= 11818 && t <= 11822 || t === 11823 || t >= 11824 && t <= 11833 || t >= 11834 && t <= 11835 || t >= 11836 && t <= 11839 || t === 11840 || t === 11841 || t === 11842 || t >= 11843 && t <= 11855 || t >= 11856 && t <= 11857 || t === 11858 || t >= 11859 && t <= 11903 || t >= 12289 && t <= 12291 || t === 12296 || t === 12297 || t === 12298 || t === 12299 || t === 12300 || t === 12301 || t === 12302 || t === 12303 || t === 12304 || t === 12305 || t >= 12306 && t <= 12307 || t === 12308 || t === 12309 || t === 12310 || t === 12311 || t === 12312 || t === 12313 || t === 12314 || t === 12315 || t === 12316 || t === 12317 || t >= 12318 && t <= 12319 || t === 12320 || t === 12336 || t === 64830 || t === 64831 || t >= 65093 && t <= 65094;
}
function K(t) {
  t.forEach(function(e) {
    if (delete e.location, Mt(e) || Gt(e))
      for (var i in e.options)
        delete e.options[i].location, K(e.options[i].value);
    else
      Ot(e) && Dt(e.style) || (Lt(e) || Ct(e)) && $(e.style) ? delete e.style.location : Ut(e) && K(e.children);
  });
}
function Le(t, e) {
  e === void 0 && (e = {}), e = w({ shouldParseSkeletons: !0, requiresOtherClause: !0 }, e);
  var i = new Ie(t, e).parse();
  if (i.err) {
    var n = SyntaxError(y[i.err.kind]);
    throw n.location = i.err.location, n.originalMessage = i.err.message, n;
  }
  return e != null && e.captureLocation || K(i.val), i.val;
}
function z(t, e) {
  var i = e && e.cache ? e.cache : Fe, n = e && e.serializer ? e.serializer : De, r = e && e.strategy ? e.strategy : Me;
  return r(t, {
    cache: i,
    serializer: n
  });
}
function Ce(t) {
  return t == null || typeof t == "number" || typeof t == "boolean";
}
function Zt(t, e, i, n) {
  var r = Ce(n) ? n : i(n), h = e.get(r);
  return typeof h > "u" && (h = t.call(this, n), e.set(r, h)), h;
}
function Jt(t, e, i) {
  var n = Array.prototype.slice.call(arguments, 3), r = i(n), h = e.get(r);
  return typeof h > "u" && (h = t.apply(this, n), e.set(r, h)), h;
}
function et(t, e, i, n, r) {
  return i.bind(e, t, n, r);
}
function Me(t, e) {
  var i = t.length === 1 ? Zt : Jt;
  return et(t, this, i, e.cache.create(), e.serializer);
}
function Ge(t, e) {
  return et(t, this, Jt, e.cache.create(), e.serializer);
}
function Ue(t, e) {
  return et(t, this, Zt, e.cache.create(), e.serializer);
}
var De = function() {
  return JSON.stringify(arguments);
};
function ot() {
  this.cache = /* @__PURE__ */ Object.create(null);
}
ot.prototype.get = function(t) {
  return this.cache[t];
};
ot.prototype.set = function(t, e) {
  this.cache[t] = e;
};
var Fe = {
  create: function() {
    return new ot();
  }
}, V = {
  variadic: Ge,
  monadic: Ue
}, j;
(function(t) {
  t.MISSING_VALUE = "MISSING_VALUE", t.INVALID_VALUE = "INVALID_VALUE", t.MISSING_INTL_API = "MISSING_INTL_API";
})(j || (j = {}));
var D = (
  /** @class */
  function(t) {
    U(e, t);
    function e(i, n, r) {
      var h = t.call(this, i) || this;
      return h.code = n, h.originalMessage = r, h;
    }
    return e.prototype.toString = function() {
      return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
    }, e;
  }(Error)
), _t = (
  /** @class */
  function(t) {
    U(e, t);
    function e(i, n, r, h) {
      return t.call(this, 'Invalid values for "'.concat(i, '": "').concat(n, '". Options are "').concat(Object.keys(r).join('", "'), '"'), j.INVALID_VALUE, h) || this;
    }
    return e;
  }(D)
), qe = (
  /** @class */
  function(t) {
    U(e, t);
    function e(i, n, r) {
      return t.call(this, 'Value for "'.concat(i, '" must be of type ').concat(n), j.INVALID_VALUE, r) || this;
    }
    return e;
  }(D)
), ze = (
  /** @class */
  function(t) {
    U(e, t);
    function e(i, n) {
      return t.call(this, 'The intl string context variable "'.concat(i, '" was not provided to the string "').concat(n, '"'), j.MISSING_VALUE, n) || this;
    }
    return e;
  }(D)
), E;
(function(t) {
  t[t.literal = 0] = "literal", t[t.object = 1] = "object";
})(E || (E = {}));
function Ve(t) {
  return t.length < 2 ? t : t.reduce(function(e, i) {
    var n = e[e.length - 1];
    return !n || n.type !== E.literal || i.type !== E.literal ? e.push(i) : n.value += i.value, e;
  }, []);
}
function We(t) {
  return typeof t == "function";
}
function M(t, e, i, n, r, h, p) {
  if (t.length === 1 && ht(t[0]))
    return [
      {
        type: E.literal,
        value: t[0].value
      }
    ];
  for (var f = [], u = 0, o = t; u < o.length; u++) {
    var a = o[u];
    if (ht(a)) {
      f.push({
        type: E.literal,
        value: a.value
      });
      continue;
    }
    if (ue(a)) {
      typeof h == "number" && f.push({
        type: E.literal,
        value: i.getNumberFormat(e).format(h)
      });
      continue;
    }
    var s = a.value;
    if (!(r && s in r))
      throw new ze(s, p);
    var c = r[s];
    if (se(a)) {
      (!c || typeof c == "string" || typeof c == "number") && (c = typeof c == "string" || typeof c == "number" ? String(c) : ""), f.push({
        type: typeof c == "string" ? E.literal : E.object,
        value: c
      });
      continue;
    }
    if (Lt(a)) {
      var l = typeof a.style == "string" ? n.date[a.style] : $(a.style) ? a.style.parsedOptions : void 0;
      f.push({
        type: E.literal,
        value: i.getDateTimeFormat(e, l).format(c)
      });
      continue;
    }
    if (Ct(a)) {
      var l = typeof a.style == "string" ? n.time[a.style] : $(a.style) ? a.style.parsedOptions : n.time.medium;
      f.push({
        type: E.literal,
        value: i.getDateTimeFormat(e, l).format(c)
      });
      continue;
    }
    if (Ot(a)) {
      var l = typeof a.style == "string" ? n.number[a.style] : Dt(a.style) ? a.style.parsedOptions : void 0;
      l && l.scale && (c = c * (l.scale || 1)), f.push({
        type: E.literal,
        value: i.getNumberFormat(e, l).format(c)
      });
      continue;
    }
    if (Ut(a)) {
      var m = a.children, d = a.value, v = r[d];
      if (!We(v))
        throw new qe(d, "function", p);
      var g = M(m, e, i, n, r, h), b = v(g.map(function(S) {
        return S.value;
      }));
      Array.isArray(b) || (b = [b]), f.push.apply(f, b.map(function(S) {
        return {
          type: typeof S == "string" ? E.literal : E.object,
          value: S
        };
      }));
    }
    if (Mt(a)) {
      var T = a.options[c] || a.options.other;
      if (!T)
        throw new _t(a.value, c, Object.keys(a.options), p);
      f.push.apply(f, M(T.value, e, i, n, r));
      continue;
    }
    if (Gt(a)) {
      var T = a.options["=".concat(c)];
      if (!T) {
        if (!Intl.PluralRules)
          throw new D(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, j.MISSING_INTL_API, p);
        var A = i.getPluralRules(e, { type: a.pluralType }).select(c - (a.offset || 0));
        T = a.options[A] || a.options.other;
      }
      if (!T)
        throw new _t(a.value, c, Object.keys(a.options), p);
      f.push.apply(f, M(T.value, e, i, n, r, c - (a.offset || 0)));
      continue;
    }
  }
  return Ve(f);
}
function Xe(t, e) {
  return e ? w(w(w({}, t || {}), e || {}), Object.keys(t).reduce(function(i, n) {
    return i[n] = w(w({}, t[n]), e[n] || {}), i;
  }, {})) : t;
}
function $e(t, e) {
  return e ? Object.keys(t).reduce(function(i, n) {
    return i[n] = Xe(t[n], e[n]), i;
  }, w({}, t)) : t;
}
function W(t) {
  return {
    create: function() {
      return {
        get: function(e) {
          return t[e];
        },
        set: function(e, i) {
          t[e] = i;
        }
      };
    }
  };
}
function Ze(t) {
  return t === void 0 && (t = {
    number: {},
    dateTime: {},
    pluralRules: {}
  }), {
    getNumberFormat: z(function() {
      for (var e, i = [], n = 0; n < arguments.length; n++)
        i[n] = arguments[n];
      return new ((e = Intl.NumberFormat).bind.apply(e, F([void 0], i, !1)))();
    }, {
      cache: W(t.number),
      strategy: V.variadic
    }),
    getDateTimeFormat: z(function() {
      for (var e, i = [], n = 0; n < arguments.length; n++)
        i[n] = arguments[n];
      return new ((e = Intl.DateTimeFormat).bind.apply(e, F([void 0], i, !1)))();
    }, {
      cache: W(t.dateTime),
      strategy: V.variadic
    }),
    getPluralRules: z(function() {
      for (var e, i = [], n = 0; n < arguments.length; n++)
        i[n] = arguments[n];
      return new ((e = Intl.PluralRules).bind.apply(e, F([void 0], i, !1)))();
    }, {
      cache: W(t.pluralRules),
      strategy: V.variadic
    })
  };
}
var Je = (
  /** @class */
  function() {
    function t(e, i, n, r) {
      var h = this;
      if (i === void 0 && (i = t.defaultLocale), this.formatterCache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      }, this.format = function(u) {
        var o = h.formatToParts(u);
        if (o.length === 1)
          return o[0].value;
        var a = o.reduce(function(s, c) {
          return !s.length || c.type !== E.literal || typeof s[s.length - 1] != "string" ? s.push(c.value) : s[s.length - 1] += c.value, s;
        }, []);
        return a.length <= 1 ? a[0] || "" : a;
      }, this.formatToParts = function(u) {
        return M(h.ast, h.locales, h.formatters, h.formats, u, void 0, h.message);
      }, this.resolvedOptions = function() {
        var u;
        return {
          locale: ((u = h.resolvedLocale) === null || u === void 0 ? void 0 : u.toString()) || Intl.NumberFormat.supportedLocalesOf(h.locales)[0]
        };
      }, this.getAst = function() {
        return h.ast;
      }, this.locales = i, this.resolvedLocale = t.resolveLocale(i), typeof e == "string") {
        if (this.message = e, !t.__parse)
          throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
        var p = r || {};
        p.formatters;
        var f = re(p, ["formatters"]);
        this.ast = t.__parse(e, w(w({}, f), { locale: this.resolvedLocale }));
      } else
        this.ast = e;
      if (!Array.isArray(this.ast))
        throw new TypeError("A message must be provided as a String or AST.");
      this.formats = $e(t.formats, n), this.formatters = r && r.formatters || Ze(this.formatterCache);
    }
    return Object.defineProperty(t, "defaultLocale", {
      get: function() {
        return t.memoizedDefaultLocale || (t.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale), t.memoizedDefaultLocale;
      },
      enumerable: !1,
      configurable: !0
    }), t.memoizedDefaultLocale = null, t.resolveLocale = function(e) {
      if (!(typeof Intl.Locale > "u")) {
        var i = Intl.NumberFormat.supportedLocalesOf(e);
        return i.length > 0 ? new Intl.Locale(i[0]) : new Intl.Locale(typeof e == "string" ? e : e[0]);
      }
    }, t.__parse = Le, t.formats = {
      number: {
        integer: {
          maximumFractionDigits: 0
        },
        currency: {
          style: "currency"
        },
        percent: {
          style: "percent"
        }
      },
      date: {
        short: {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        },
        medium: {
          month: "short",
          day: "numeric",
          year: "numeric"
        },
        long: {
          month: "long",
          day: "numeric",
          year: "numeric"
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: {
          hour: "numeric",
          minute: "numeric"
        },
        medium: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    }, t;
  }()
), N = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qe(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ye(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var i = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    i.prototype = e.prototype;
  } else
    i = {};
  return Object.defineProperty(i, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(i, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), i;
}
function G(t) {
  "@babel/helpers - typeof";
  return G = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, G(t);
}
function Ke(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function wt(t, e) {
  for (var i = 0; i < e.length; i++) {
    var n = e[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, oo(n.key), n);
  }
}
function to(t, e, i) {
  return e && wt(t.prototype, e), i && wt(t, i), Object.defineProperty(t, "prototype", {
    writable: !1
  }), t;
}
function eo(t, e) {
  if (typeof t != "object" || t === null)
    return t;
  var i = t[Symbol.toPrimitive];
  if (i !== void 0) {
    var n = i.call(t, e || "default");
    if (typeof n != "object")
      return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function oo(t) {
  var e = eo(t, "string");
  return typeof e == "symbol" ? e : String(e);
}
function H(t, e) {
  var i = Qt(t, e, "get");
  return io(t, i);
}
function R(t, e, i) {
  var n = Qt(t, e, "set");
  return no(t, n, i), i;
}
function Qt(t, e, i) {
  if (!e.has(t))
    throw new TypeError("attempted to " + i + " private field on non-instance");
  return e.get(t);
}
function io(t, e) {
  return e.get ? e.get.call(t) : e.value;
}
function no(t, e, i) {
  if (e.set)
    e.set.call(t, i);
  else {
    if (!e.writable)
      throw new TypeError("attempted to set read only private field");
    e.value = i;
  }
}
function ao(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function k(t, e, i) {
  ao(t, e), e.set(t, i);
}
var xt = function(e) {
  if (!e)
    return [];
  Array.isArray(e) || (e = [e]);
  for (var i = {}, n = 0; n < e.length; ++n) {
    var r, h = e[n];
    if (h && G(h) === "object" && (h = String(h)), typeof h != "string") {
      var p = "Locales should be strings, ".concat(JSON.stringify(h), " isn't.");
      throw new TypeError(p);
    }
    var f = h.split("-");
    if (!f.every(function(s) {
      return /[a-z0-9]+/i.test(s);
    })) {
      var u = JSON.stringify(h), o = "The locale ".concat(u, " is not a structurally valid BCP 47 language tag.");
      throw new RangeError(o);
    }
    var a = f[0].toLowerCase();
    f[0] = (r = {
      in: "id",
      iw: "he",
      ji: "yi"
    }[a]) !== null && r !== void 0 ? r : a, i[f.join("-")] = !0;
  }
  return Object.keys(i);
};
function ro(t) {
  var e = Object.prototype.hasOwnProperty.call(t, "type") && t.type;
  if (!e)
    return "cardinal";
  if (e === "cardinal" || e === "ordinal")
    return e;
  throw new RangeError("Not a valid plural type: " + JSON.stringify(e));
}
function Et(t) {
  switch (G(t)) {
    case "number":
      return t;
    case "bigint":
      throw new TypeError("Cannot convert a BigInt value to a number");
    default:
      return Number(t);
  }
}
function so(t, e, i, n) {
  var r = function(l) {
    do {
      if (e(l))
        return l;
      l = l.replace(/-?[^-]*$/, "");
    } while (l);
    return null;
  }, h = function(l) {
    for (var m = xt(l), d = 0; d < m.length; ++d) {
      var v = r(m[d]);
      if (v)
        return v;
    }
    var g = new t().resolvedOptions().locale;
    return r(g);
  }, p = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ function() {
    function c() {
      var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      Ke(this, c), k(this, p, {
        writable: !0,
        value: void 0
      }), k(this, f, {
        writable: !0,
        value: void 0
      }), k(this, u, {
        writable: !0,
        value: void 0
      }), k(this, o, {
        writable: !0,
        value: void 0
      }), k(this, a, {
        writable: !0,
        value: void 0
      }), R(this, p, h(l)), R(this, u, e(H(this, p))), R(this, f, n(H(this, p))), R(this, o, ro(m)), R(this, a, new t("en", m));
    }
    return to(c, [{
      key: "resolvedOptions",
      value: function() {
        var m = H(this, a).resolvedOptions(), d = m.minimumIntegerDigits, v = m.minimumFractionDigits, g = m.maximumFractionDigits, b = m.minimumSignificantDigits, T = m.maximumSignificantDigits, A = m.roundingPriority, S = {
          locale: H(this, p),
          type: H(this, o),
          minimumIntegerDigits: d,
          minimumFractionDigits: v,
          maximumFractionDigits: g
        };
        return typeof b == "number" && (S.minimumSignificantDigits = b, S.maximumSignificantDigits = T), S.pluralCategories = i(H(this, p), H(this, o) === "ordinal").slice(0), S.roundingPriority = A || "auto", S;
      }
    }, {
      key: "select",
      value: function(m) {
        if (!(this instanceof c))
          throw new TypeError("select() called on incompatible ".concat(this));
        if (typeof m != "number" && (m = Number(m)), !isFinite(m))
          return "other";
        var d = H(this, a).format(Math.abs(m));
        return H(this, u).call(this, d, H(this, o) === "ordinal");
      }
    }, {
      key: "selectRange",
      value: function(m, d) {
        if (!(this instanceof c))
          throw new TypeError("selectRange() called on incompatible ".concat(this));
        if (m === void 0)
          throw new TypeError("start is undefined");
        if (d === void 0)
          throw new TypeError("end is undefined");
        var v = Et(m), g = Et(d);
        if (!isFinite(v))
          throw new RangeError("start must be finite");
        if (!isFinite(g))
          throw new RangeError("end must be finite");
        return H(this, f).call(this, this.select(v), this.select(g));
      }
    }], [{
      key: "supportedLocalesOf",
      value: function(m) {
        return xt(m).filter(r);
      }
    }]), c;
  }();
  return typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s.prototype, Symbol.toStringTag, {
    value: "Intl.PluralRules",
    writable: !1,
    configurable: !0
  }), Object.defineProperty(s, "prototype", {
    writable: !1
  }), s;
}
const uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: so
}, Symbol.toStringTag, { value: "Module" })), fo = /* @__PURE__ */ Ye(uo);
var lo = fo;
function co(t) {
  return t && typeof t == "object" && "default" in t ? t : { default: t };
}
function it(t, e) {
  return e.forEach(function(i) {
    i && typeof i != "string" && !Array.isArray(i) && Object.keys(i).forEach(function(n) {
      if (n !== "default" && !(n in t)) {
        var r = Object.getOwnPropertyDescriptor(i, n);
        Object.defineProperty(t, n, r.get ? r : {
          enumerable: !0,
          get: function() {
            return i[n];
          }
        });
      }
    });
  }), Object.freeze(t);
}
var mo = /* @__PURE__ */ co(lo), nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof N < "u" ? N : typeof self < "u" ? self : {};
function at(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var rt = { exports: {} };
(function(t, e) {
  var i = function(o, a) {
    return a ? "other" : o == 1 ? "one" : "other";
  }, n = function(o, a) {
    return a ? "other" : o == 0 || o == 1 ? "one" : "other";
  }, r = function(o, a) {
    return a ? "other" : o >= 0 && o <= 1 ? "one" : "other";
  }, h = function(o, a) {
    var s = String(o).split("."), c = !s[1];
    return a ? "other" : o == 1 && c ? "one" : "other";
  }, p = function(o, a) {
    return "other";
  }, f = function(o, a) {
    return a ? "other" : o == 1 ? "one" : o == 2 ? "two" : "other";
  };
  (function(u, o) {
    Object.defineProperty(o, "__esModule", {
      value: !0
    }), t.exports = o;
  })(nt, {
    af: i,
    ak: n,
    am: r,
    an: i,
    ar: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-2);
      return a ? "other" : o == 0 ? "zero" : o == 1 ? "one" : o == 2 ? "two" : l >= 3 && l <= 10 ? "few" : l >= 11 && l <= 99 ? "many" : "other";
    },
    ars: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-2);
      return a ? "other" : o == 0 ? "zero" : o == 1 ? "one" : o == 2 ? "two" : l >= 3 && l <= 10 ? "few" : l >= 11 && l <= 99 ? "many" : "other";
    },
    as: function(o, a) {
      return a ? o == 1 || o == 5 || o == 7 || o == 8 || o == 9 || o == 10 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : o == 6 ? "many" : "other" : o >= 0 && o <= 1 ? "one" : "other";
    },
    asa: i,
    ast: h,
    az: function(o, a) {
      var s = String(o).split("."), c = s[0], l = c.slice(-1), m = c.slice(-2), d = c.slice(-3);
      return a ? l == 1 || l == 2 || l == 5 || l == 7 || l == 8 || m == 20 || m == 50 || m == 70 || m == 80 ? "one" : l == 3 || l == 4 || d == 100 || d == 200 || d == 300 || d == 400 || d == 500 || d == 600 || d == 700 || d == 800 || d == 900 ? "few" : c == 0 || l == 6 || m == 40 || m == 60 || m == 90 ? "many" : "other" : o == 1 ? "one" : "other";
    },
    bal: function(o, a) {
      return o == 1 ? "one" : "other";
    },
    be: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-1), m = c && s[0].slice(-2);
      return a ? (l == 2 || l == 3) && m != 12 && m != 13 ? "few" : "other" : l == 1 && m != 11 ? "one" : l >= 2 && l <= 4 && (m < 12 || m > 14) ? "few" : c && l == 0 || l >= 5 && l <= 9 || m >= 11 && m <= 14 ? "many" : "other";
    },
    bem: i,
    bez: i,
    bg: i,
    bho: n,
    bm: p,
    bn: function(o, a) {
      return a ? o == 1 || o == 5 || o == 7 || o == 8 || o == 9 || o == 10 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : o == 6 ? "many" : "other" : o >= 0 && o <= 1 ? "one" : "other";
    },
    bo: p,
    br: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-1), m = c && s[0].slice(-2), d = c && s[0].slice(-6);
      return a ? "other" : l == 1 && m != 11 && m != 71 && m != 91 ? "one" : l == 2 && m != 12 && m != 72 && m != 92 ? "two" : (l == 3 || l == 4 || l == 9) && (m < 10 || m > 19) && (m < 70 || m > 79) && (m < 90 || m > 99) ? "few" : o != 0 && c && d == 0 ? "many" : "other";
    },
    brx: i,
    bs: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = c.slice(-2), g = l.slice(-1), b = l.slice(-2);
      return a ? "other" : m && d == 1 && v != 11 || g == 1 && b != 11 ? "one" : m && d >= 2 && d <= 4 && (v < 12 || v > 14) || g >= 2 && g <= 4 && (b < 12 || b > 14) ? "few" : "other";
    },
    ca: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? o == 1 || o == 3 ? "one" : o == 2 ? "two" : o == 4 ? "few" : "other" : o == 1 && l ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    ce: i,
    ceb: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = l.slice(-1);
      return a ? "other" : m && (c == 1 || c == 2 || c == 3) || m && d != 4 && d != 6 && d != 9 || !m && v != 4 && v != 6 && v != 9 ? "one" : "other";
    },
    cgg: i,
    chr: i,
    ckb: i,
    cs: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1];
      return a ? "other" : o == 1 && l ? "one" : c >= 2 && c <= 4 && l ? "few" : l ? "other" : "many";
    },
    cy: function(o, a) {
      return a ? o == 0 || o == 7 || o == 8 || o == 9 ? "zero" : o == 1 ? "one" : o == 2 ? "two" : o == 3 || o == 4 ? "few" : o == 5 || o == 6 ? "many" : "other" : o == 0 ? "zero" : o == 1 ? "one" : o == 2 ? "two" : o == 3 ? "few" : o == 6 ? "many" : "other";
    },
    da: function(o, a) {
      var s = String(o).split("."), c = s[0], l = Number(s[0]) == o;
      return a ? "other" : o == 1 || !l && (c == 0 || c == 1) ? "one" : "other";
    },
    de: h,
    doi: r,
    dsb: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-2), v = l.slice(-2);
      return a ? "other" : m && d == 1 || v == 1 ? "one" : m && d == 2 || v == 2 ? "two" : m && (d == 3 || d == 4) || v == 3 || v == 4 ? "few" : "other";
    },
    dv: i,
    dz: p,
    ee: i,
    el: i,
    en: function(o, a) {
      var s = String(o).split("."), c = !s[1], l = Number(s[0]) == o, m = l && s[0].slice(-1), d = l && s[0].slice(-2);
      return a ? m == 1 && d != 11 ? "one" : m == 2 && d != 12 ? "two" : m == 3 && d != 13 ? "few" : "other" : o == 1 && c ? "one" : "other";
    },
    eo: i,
    es: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? "other" : o == 1 ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    et: h,
    eu: i,
    fa: r,
    ff: function(o, a) {
      return a ? "other" : o >= 0 && o < 2 ? "one" : "other";
    },
    fi: h,
    fil: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = l.slice(-1);
      return a ? o == 1 ? "one" : "other" : m && (c == 1 || c == 2 || c == 3) || m && d != 4 && d != 6 && d != 9 || !m && v != 4 && v != 6 && v != 9 ? "one" : "other";
    },
    fo: i,
    fr: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? o == 1 ? "one" : "other" : o >= 0 && o < 2 ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    fur: i,
    fy: h,
    ga: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? o == 1 ? "one" : "other" : o == 1 ? "one" : o == 2 ? "two" : c && o >= 3 && o <= 6 ? "few" : c && o >= 7 && o <= 10 ? "many" : "other";
    },
    gd: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? o == 1 || o == 11 ? "one" : o == 2 || o == 12 ? "two" : o == 3 || o == 13 ? "few" : "other" : o == 1 || o == 11 ? "one" : o == 2 || o == 12 ? "two" : c && o >= 3 && o <= 10 || c && o >= 13 && o <= 19 ? "few" : "other";
    },
    gl: h,
    gsw: i,
    gu: function(o, a) {
      return a ? o == 1 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : o == 6 ? "many" : "other" : o >= 0 && o <= 1 ? "one" : "other";
    },
    guw: n,
    gv: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-1), d = c.slice(-2);
      return a ? "other" : l && m == 1 ? "one" : l && m == 2 ? "two" : l && (d == 0 || d == 20 || d == 40 || d == 60 || d == 80) ? "few" : l ? "other" : "many";
    },
    ha: i,
    haw: i,
    he: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1];
      return a ? "other" : c == 1 && l || c == 0 && !l ? "one" : c == 2 && l ? "two" : "other";
    },
    hi: function(o, a) {
      return a ? o == 1 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : o == 6 ? "many" : "other" : o >= 0 && o <= 1 ? "one" : "other";
    },
    hnj: p,
    hr: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = c.slice(-2), g = l.slice(-1), b = l.slice(-2);
      return a ? "other" : m && d == 1 && v != 11 || g == 1 && b != 11 ? "one" : m && d >= 2 && d <= 4 && (v < 12 || v > 14) || g >= 2 && g <= 4 && (b < 12 || b > 14) ? "few" : "other";
    },
    hsb: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-2), v = l.slice(-2);
      return a ? "other" : m && d == 1 || v == 1 ? "one" : m && d == 2 || v == 2 ? "two" : m && (d == 3 || d == 4) || v == 3 || v == 4 ? "few" : "other";
    },
    hu: function(o, a) {
      return a ? o == 1 || o == 5 ? "one" : "other" : o == 1 ? "one" : "other";
    },
    hy: function(o, a) {
      return a ? o == 1 ? "one" : "other" : o >= 0 && o < 2 ? "one" : "other";
    },
    ia: h,
    id: p,
    ig: p,
    ii: p,
    io: h,
    is: function(o, a) {
      var s = String(o).split("."), c = s[0], l = (s[1] || "").replace(/0+$/, ""), m = Number(s[0]) == o, d = c.slice(-1), v = c.slice(-2);
      return a ? "other" : m && d == 1 && v != 11 || l % 10 == 1 && l % 100 != 11 ? "one" : "other";
    },
    it: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? o == 11 || o == 8 || o == 80 || o == 800 ? "many" : "other" : o == 1 && l ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    iu: f,
    ja: p,
    jbo: p,
    jgo: i,
    jmc: i,
    jv: p,
    jw: p,
    ka: function(o, a) {
      var s = String(o).split("."), c = s[0], l = c.slice(-2);
      return a ? c == 1 ? "one" : c == 0 || l >= 2 && l <= 20 || l == 40 || l == 60 || l == 80 ? "many" : "other" : o == 1 ? "one" : "other";
    },
    kab: function(o, a) {
      return a ? "other" : o >= 0 && o < 2 ? "one" : "other";
    },
    kaj: i,
    kcg: i,
    kde: p,
    kea: p,
    kk: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-1);
      return a ? l == 6 || l == 9 || c && l == 0 && o != 0 ? "many" : "other" : o == 1 ? "one" : "other";
    },
    kkj: i,
    kl: i,
    km: p,
    kn: r,
    ko: p,
    ks: i,
    ksb: i,
    ksh: function(o, a) {
      return a ? "other" : o == 0 ? "zero" : o == 1 ? "one" : "other";
    },
    ku: i,
    kw: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-2), m = c && s[0].slice(-3), d = c && s[0].slice(-5), v = c && s[0].slice(-6);
      return a ? c && o >= 1 && o <= 4 || l >= 1 && l <= 4 || l >= 21 && l <= 24 || l >= 41 && l <= 44 || l >= 61 && l <= 64 || l >= 81 && l <= 84 ? "one" : o == 5 || l == 5 ? "many" : "other" : o == 0 ? "zero" : o == 1 ? "one" : l == 2 || l == 22 || l == 42 || l == 62 || l == 82 || c && m == 0 && (d >= 1e3 && d <= 2e4 || d == 4e4 || d == 6e4 || d == 8e4) || o != 0 && v == 1e5 ? "two" : l == 3 || l == 23 || l == 43 || l == 63 || l == 83 ? "few" : o != 1 && (l == 1 || l == 21 || l == 41 || l == 61 || l == 81) ? "many" : "other";
    },
    ky: i,
    lag: function(o, a) {
      var s = String(o).split("."), c = s[0];
      return a ? "other" : o == 0 ? "zero" : (c == 0 || c == 1) && o != 0 ? "one" : "other";
    },
    lb: i,
    lg: i,
    lij: function(o, a) {
      var s = String(o).split("."), c = !s[1], l = Number(s[0]) == o;
      return a ? o == 11 || o == 8 || l && o >= 80 && o <= 89 || l && o >= 800 && o <= 899 ? "many" : "other" : o == 1 && c ? "one" : "other";
    },
    lkt: p,
    ln: n,
    lo: function(o, a) {
      return a && o == 1 ? "one" : "other";
    },
    lt: function(o, a) {
      var s = String(o).split("."), c = s[1] || "", l = Number(s[0]) == o, m = l && s[0].slice(-1), d = l && s[0].slice(-2);
      return a ? "other" : m == 1 && (d < 11 || d > 19) ? "one" : m >= 2 && m <= 9 && (d < 11 || d > 19) ? "few" : c != 0 ? "many" : "other";
    },
    lv: function(o, a) {
      var s = String(o).split("."), c = s[1] || "", l = c.length, m = Number(s[0]) == o, d = m && s[0].slice(-1), v = m && s[0].slice(-2), g = c.slice(-2), b = c.slice(-1);
      return a ? "other" : m && d == 0 || v >= 11 && v <= 19 || l == 2 && g >= 11 && g <= 19 ? "zero" : d == 1 && v != 11 || l == 2 && b == 1 && g != 11 || l != 2 && b == 1 ? "one" : "other";
    },
    mas: i,
    mg: n,
    mgo: i,
    mk: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = c.slice(-2), g = l.slice(-1), b = l.slice(-2);
      return a ? d == 1 && v != 11 ? "one" : d == 2 && v != 12 ? "two" : (d == 7 || d == 8) && v != 17 && v != 18 ? "many" : "other" : m && d == 1 && v != 11 || g == 1 && b != 11 ? "one" : "other";
    },
    ml: i,
    mn: i,
    mo: function(o, a) {
      var s = String(o).split("."), c = !s[1], l = Number(s[0]) == o, m = l && s[0].slice(-2);
      return a ? o == 1 ? "one" : "other" : o == 1 && c ? "one" : !c || o == 0 || o != 1 && m >= 1 && m <= 19 ? "few" : "other";
    },
    mr: function(o, a) {
      return a ? o == 1 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : "other" : o == 1 ? "one" : "other";
    },
    ms: function(o, a) {
      return a && o == 1 ? "one" : "other";
    },
    mt: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-2);
      return a ? "other" : o == 1 ? "one" : o == 2 ? "two" : o == 0 || l >= 3 && l <= 10 ? "few" : l >= 11 && l <= 19 ? "many" : "other";
    },
    my: p,
    nah: i,
    naq: f,
    nb: i,
    nd: i,
    ne: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? c && o >= 1 && o <= 4 ? "one" : "other" : o == 1 ? "one" : "other";
    },
    nl: h,
    nn: i,
    nnh: i,
    no: i,
    nqo: p,
    nr: i,
    nso: n,
    ny: i,
    nyn: i,
    om: i,
    or: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? o == 1 || o == 5 || c && o >= 7 && o <= 9 ? "one" : o == 2 || o == 3 ? "two" : o == 4 ? "few" : o == 6 ? "many" : "other" : o == 1 ? "one" : "other";
    },
    os: i,
    osa: p,
    pa: n,
    pap: i,
    pcm: r,
    pl: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-1), d = c.slice(-2);
      return a ? "other" : o == 1 && l ? "one" : l && m >= 2 && m <= 4 && (d < 12 || d > 14) ? "few" : l && c != 1 && (m == 0 || m == 1) || l && m >= 5 && m <= 9 || l && d >= 12 && d <= 14 ? "many" : "other";
    },
    prg: function(o, a) {
      var s = String(o).split("."), c = s[1] || "", l = c.length, m = Number(s[0]) == o, d = m && s[0].slice(-1), v = m && s[0].slice(-2), g = c.slice(-2), b = c.slice(-1);
      return a ? "other" : m && d == 0 || v >= 11 && v <= 19 || l == 2 && g >= 11 && g <= 19 ? "zero" : d == 1 && v != 11 || l == 2 && b == 1 && g != 11 || l != 2 && b == 1 ? "one" : "other";
    },
    ps: i,
    pt: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? "other" : c == 0 || c == 1 ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    pt_PT: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? "other" : o == 1 && l ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    rm: i,
    ro: function(o, a) {
      var s = String(o).split("."), c = !s[1], l = Number(s[0]) == o, m = l && s[0].slice(-2);
      return a ? o == 1 ? "one" : "other" : o == 1 && c ? "one" : !c || o == 0 || o != 1 && m >= 1 && m <= 19 ? "few" : "other";
    },
    rof: i,
    ru: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-1), d = c.slice(-2);
      return a ? "other" : l && m == 1 && d != 11 ? "one" : l && m >= 2 && m <= 4 && (d < 12 || d > 14) ? "few" : l && m == 0 || l && m >= 5 && m <= 9 || l && d >= 11 && d <= 14 ? "many" : "other";
    },
    rwk: i,
    sah: p,
    saq: i,
    sat: f,
    sc: function(o, a) {
      var s = String(o).split("."), c = !s[1];
      return a ? o == 11 || o == 8 || o == 80 || o == 800 ? "many" : "other" : o == 1 && c ? "one" : "other";
    },
    scn: function(o, a) {
      var s = String(o).split("."), c = !s[1];
      return a ? o == 11 || o == 8 || o == 80 || o == 800 ? "many" : "other" : o == 1 && c ? "one" : "other";
    },
    sd: i,
    sdh: i,
    se: f,
    seh: i,
    ses: p,
    sg: p,
    sh: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = c.slice(-2), g = l.slice(-1), b = l.slice(-2);
      return a ? "other" : m && d == 1 && v != 11 || g == 1 && b != 11 ? "one" : m && d >= 2 && d <= 4 && (v < 12 || v > 14) || g >= 2 && g <= 4 && (b < 12 || b > 14) ? "few" : "other";
    },
    shi: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? "other" : o >= 0 && o <= 1 ? "one" : c && o >= 2 && o <= 10 ? "few" : "other";
    },
    si: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "";
      return a ? "other" : o == 0 || o == 1 || c == 0 && l == 1 ? "one" : "other";
    },
    sk: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1];
      return a ? "other" : o == 1 && l ? "one" : c >= 2 && c <= 4 && l ? "few" : l ? "other" : "many";
    },
    sl: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-2);
      return a ? "other" : l && m == 1 ? "one" : l && m == 2 ? "two" : l && (m == 3 || m == 4) || !l ? "few" : "other";
    },
    sma: f,
    smi: f,
    smj: f,
    smn: f,
    sms: f,
    sn: i,
    so: i,
    sq: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-1), m = c && s[0].slice(-2);
      return a ? o == 1 ? "one" : l == 4 && m != 14 ? "many" : "other" : o == 1 ? "one" : "other";
    },
    sr: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = c.slice(-2), g = l.slice(-1), b = l.slice(-2);
      return a ? "other" : m && d == 1 && v != 11 || g == 1 && b != 11 ? "one" : m && d >= 2 && d <= 4 && (v < 12 || v > 14) || g >= 2 && g <= 4 && (b < 12 || b > 14) ? "few" : "other";
    },
    ss: i,
    ssy: i,
    st: i,
    su: p,
    sv: function(o, a) {
      var s = String(o).split("."), c = !s[1], l = Number(s[0]) == o, m = l && s[0].slice(-1), d = l && s[0].slice(-2);
      return a ? (m == 1 || m == 2) && d != 11 && d != 12 ? "one" : "other" : o == 1 && c ? "one" : "other";
    },
    sw: h,
    syr: i,
    ta: i,
    te: i,
    teo: i,
    th: p,
    ti: n,
    tig: i,
    tk: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o, l = c && s[0].slice(-1);
      return a ? l == 6 || l == 9 || o == 10 ? "few" : "other" : o == 1 ? "one" : "other";
    },
    tl: function(o, a) {
      var s = String(o).split("."), c = s[0], l = s[1] || "", m = !s[1], d = c.slice(-1), v = l.slice(-1);
      return a ? o == 1 ? "one" : "other" : m && (c == 1 || c == 2 || c == 3) || m && d != 4 && d != 6 && d != 9 || !m && v != 4 && v != 6 && v != 9 ? "one" : "other";
    },
    tn: i,
    to: p,
    tpi: p,
    tr: i,
    ts: i,
    tzm: function(o, a) {
      var s = String(o).split("."), c = Number(s[0]) == o;
      return a ? "other" : o == 0 || o == 1 || c && o >= 11 && o <= 99 ? "one" : "other";
    },
    ug: i,
    uk: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = Number(s[0]) == o, d = m && s[0].slice(-1), v = m && s[0].slice(-2), g = c.slice(-1), b = c.slice(-2);
      return a ? d == 3 && v != 13 ? "few" : "other" : l && g == 1 && b != 11 ? "one" : l && g >= 2 && g <= 4 && (b < 12 || b > 14) ? "few" : l && g == 0 || l && g >= 5 && g <= 9 || l && b >= 11 && b <= 14 ? "many" : "other";
    },
    und: p,
    ur: h,
    uz: i,
    ve: i,
    vec: function(o, a) {
      var s = String(o).split("."), c = s[0], l = !s[1], m = c.slice(-6);
      return a ? o == 11 || o == 8 || o == 80 || o == 800 ? "many" : "other" : o == 1 && l ? "one" : c != 0 && m == 0 && l ? "many" : "other";
    },
    vi: function(o, a) {
      return a && o == 1 ? "one" : "other";
    },
    vo: i,
    vun: i,
    wa: n,
    wae: i,
    wo: p,
    xh: i,
    xog: i,
    yi: h,
    yo: p,
    yue: p,
    zh: p,
    zu: r
  });
})(rt);
var Yt = /* @__PURE__ */ at(rt.exports), ho = /* @__PURE__ */ it({
  __proto__: null,
  default: Yt
}, [rt.exports]), st = { exports: {} };
(function(t, e) {
  var i = "zero", n = "one", r = "two", h = "few", p = "many", f = "other", u = {
    cardinal: [n, f],
    ordinal: [f]
  }, o = {
    cardinal: [n, f],
    ordinal: [n, f]
  }, a = {
    cardinal: [f],
    ordinal: [f]
  }, s = {
    cardinal: [n, r, f],
    ordinal: [f]
  };
  (function(c, l) {
    Object.defineProperty(l, "__esModule", {
      value: !0
    }), t.exports = l;
  })(nt, {
    af: u,
    ak: u,
    am: u,
    an: u,
    ar: {
      cardinal: [i, n, r, h, p, f],
      ordinal: [f]
    },
    ars: {
      cardinal: [i, n, r, h, p, f],
      ordinal: [f]
    },
    as: {
      cardinal: [n, f],
      ordinal: [n, r, h, p, f]
    },
    asa: u,
    ast: u,
    az: {
      cardinal: [n, f],
      ordinal: [n, h, p, f]
    },
    bal: o,
    be: {
      cardinal: [n, h, p, f],
      ordinal: [h, f]
    },
    bem: u,
    bez: u,
    bg: u,
    bho: u,
    bm: a,
    bn: {
      cardinal: [n, f],
      ordinal: [n, r, h, p, f]
    },
    bo: a,
    br: {
      cardinal: [n, r, h, p, f],
      ordinal: [f]
    },
    brx: u,
    bs: {
      cardinal: [n, h, f],
      ordinal: [f]
    },
    ca: {
      cardinal: [n, p, f],
      ordinal: [n, r, h, f]
    },
    ce: u,
    ceb: u,
    cgg: u,
    chr: u,
    ckb: u,
    cs: {
      cardinal: [n, h, p, f],
      ordinal: [f]
    },
    cy: {
      cardinal: [i, n, r, h, p, f],
      ordinal: [i, n, r, h, p, f]
    },
    da: u,
    de: u,
    doi: u,
    dsb: {
      cardinal: [n, r, h, f],
      ordinal: [f]
    },
    dv: u,
    dz: a,
    ee: u,
    el: u,
    en: {
      cardinal: [n, f],
      ordinal: [n, r, h, f]
    },
    eo: u,
    es: {
      cardinal: [n, p, f],
      ordinal: [f]
    },
    et: u,
    eu: u,
    fa: u,
    ff: u,
    fi: u,
    fil: o,
    fo: u,
    fr: {
      cardinal: [n, p, f],
      ordinal: [n, f]
    },
    fur: u,
    fy: u,
    ga: {
      cardinal: [n, r, h, p, f],
      ordinal: [n, f]
    },
    gd: {
      cardinal: [n, r, h, f],
      ordinal: [n, r, h, f]
    },
    gl: u,
    gsw: u,
    gu: {
      cardinal: [n, f],
      ordinal: [n, r, h, p, f]
    },
    guw: u,
    gv: {
      cardinal: [n, r, h, p, f],
      ordinal: [f]
    },
    ha: u,
    haw: u,
    he: s,
    hi: {
      cardinal: [n, f],
      ordinal: [n, r, h, p, f]
    },
    hnj: a,
    hr: {
      cardinal: [n, h, f],
      ordinal: [f]
    },
    hsb: {
      cardinal: [n, r, h, f],
      ordinal: [f]
    },
    hu: o,
    hy: o,
    ia: u,
    id: a,
    ig: a,
    ii: a,
    io: u,
    is: u,
    it: {
      cardinal: [n, p, f],
      ordinal: [p, f]
    },
    iu: s,
    ja: a,
    jbo: a,
    jgo: u,
    jmc: u,
    jv: a,
    jw: a,
    ka: {
      cardinal: [n, f],
      ordinal: [n, p, f]
    },
    kab: u,
    kaj: u,
    kcg: u,
    kde: a,
    kea: a,
    kk: {
      cardinal: [n, f],
      ordinal: [p, f]
    },
    kkj: u,
    kl: u,
    km: a,
    kn: u,
    ko: a,
    ks: u,
    ksb: u,
    ksh: {
      cardinal: [i, n, f],
      ordinal: [f]
    },
    ku: u,
    kw: {
      cardinal: [i, n, r, h, p, f],
      ordinal: [n, p, f]
    },
    ky: u,
    lag: {
      cardinal: [i, n, f],
      ordinal: [f]
    },
    lb: u,
    lg: u,
    lij: {
      cardinal: [n, f],
      ordinal: [p, f]
    },
    lkt: a,
    ln: u,
    lo: {
      cardinal: [f],
      ordinal: [n, f]
    },
    lt: {
      cardinal: [n, h, p, f],
      ordinal: [f]
    },
    lv: {
      cardinal: [i, n, f],
      ordinal: [f]
    },
    mas: u,
    mg: u,
    mgo: u,
    mk: {
      cardinal: [n, f],
      ordinal: [n, r, p, f]
    },
    ml: u,
    mn: u,
    mo: {
      cardinal: [n, h, f],
      ordinal: [n, f]
    },
    mr: {
      cardinal: [n, f],
      ordinal: [n, r, h, f]
    },
    ms: {
      cardinal: [f],
      ordinal: [n, f]
    },
    mt: {
      cardinal: [n, r, h, p, f],
      ordinal: [f]
    },
    my: a,
    nah: u,
    naq: s,
    nb: u,
    nd: u,
    ne: o,
    nl: u,
    nn: u,
    nnh: u,
    no: u,
    nqo: a,
    nr: u,
    nso: u,
    ny: u,
    nyn: u,
    om: u,
    or: {
      cardinal: [n, f],
      ordinal: [n, r, h, p, f]
    },
    os: u,
    osa: a,
    pa: u,
    pap: u,
    pcm: u,
    pl: {
      cardinal: [n, h, p, f],
      ordinal: [f]
    },
    prg: {
      cardinal: [i, n, f],
      ordinal: [f]
    },
    ps: u,
    pt: {
      cardinal: [n, p, f],
      ordinal: [f]
    },
    pt_PT: {
      cardinal: [n, p, f],
      ordinal: [f]
    },
    rm: u,
    ro: {
      cardinal: [n, h, f],
      ordinal: [n, f]
    },
    rof: u,
    ru: {
      cardinal: [n, h, p, f],
      ordinal: [f]
    },
    rwk: u,
    sah: a,
    saq: u,
    sat: s,
    sc: {
      cardinal: [n, f],
      ordinal: [p, f]
    },
    scn: {
      cardinal: [n, f],
      ordinal: [p, f]
    },
    sd: u,
    sdh: u,
    se: s,
    seh: u,
    ses: a,
    sg: a,
    sh: {
      cardinal: [n, h, f],
      ordinal: [f]
    },
    shi: {
      cardinal: [n, h, f],
      ordinal: [f]
    },
    si: u,
    sk: {
      cardinal: [n, h, p, f],
      ordinal: [f]
    },
    sl: {
      cardinal: [n, r, h, f],
      ordinal: [f]
    },
    sma: s,
    smi: s,
    smj: s,
    smn: s,
    sms: s,
    sn: u,
    so: u,
    sq: {
      cardinal: [n, f],
      ordinal: [n, p, f]
    },
    sr: {
      cardinal: [n, h, f],
      ordinal: [f]
    },
    ss: u,
    ssy: u,
    st: u,
    su: a,
    sv: o,
    sw: u,
    syr: u,
    ta: u,
    te: u,
    teo: u,
    th: a,
    ti: u,
    tig: u,
    tk: {
      cardinal: [n, f],
      ordinal: [h, f]
    },
    tl: o,
    tn: u,
    to: a,
    tpi: a,
    tr: u,
    ts: u,
    tzm: u,
    ug: u,
    uk: {
      cardinal: [n, h, p, f],
      ordinal: [h, f]
    },
    und: a,
    ur: u,
    uz: u,
    ve: u,
    vec: {
      cardinal: [n, p, f],
      ordinal: [p, f]
    },
    vi: {
      cardinal: [f],
      ordinal: [n, f]
    },
    vo: u,
    vun: u,
    wa: u,
    wae: u,
    wo: a,
    xh: u,
    xog: u,
    yi: u,
    yo: a,
    yue: a,
    zh: a,
    zu: u
  });
})(st);
var Kt = /* @__PURE__ */ at(st.exports), po = /* @__PURE__ */ it({
  __proto__: null,
  default: Kt
}, [st.exports]), ut = { exports: {} };
(function(t, e) {
  var i = function(p, f) {
    return "other";
  }, n = function(p, f) {
    return p === "other" && f === "one" ? "one" : "other";
  }, r = function(p, f) {
    return f || "other";
  };
  (function(h, p) {
    Object.defineProperty(p, "__esModule", {
      value: !0
    }), t.exports = p;
  })(nt, {
    af: i,
    ak: n,
    am: r,
    an: i,
    ar: function(p, f) {
      return f === "few" ? "few" : f === "many" ? "many" : p === "zero" && f === "one" || p === "zero" && f === "two" ? "zero" : "other";
    },
    as: r,
    az: r,
    be: r,
    bg: i,
    bn: r,
    bs: r,
    ca: i,
    cs: r,
    cy: r,
    da: r,
    de: r,
    el: r,
    en: i,
    es: i,
    et: i,
    eu: i,
    fa: n,
    fi: i,
    fil: r,
    fr: r,
    ga: r,
    gl: r,
    gsw: r,
    gu: r,
    he: i,
    hi: r,
    hr: r,
    hu: r,
    hy: r,
    ia: i,
    id: i,
    io: i,
    is: r,
    it: r,
    ja: i,
    ka: function(p, f) {
      return p || "other";
    },
    kk: r,
    km: i,
    kn: r,
    ko: i,
    ky: r,
    lij: r,
    lo: i,
    lt: r,
    lv: function(p, f) {
      return f === "one" ? "one" : "other";
    },
    mk: i,
    ml: r,
    mn: r,
    mr: r,
    ms: i,
    my: i,
    nb: i,
    ne: r,
    nl: r,
    no: i,
    or: n,
    pa: r,
    pcm: i,
    pl: r,
    ps: r,
    pt: r,
    ro: function(p, f) {
      return f === "few" || f === "one" ? "few" : "other";
    },
    ru: r,
    sc: r,
    scn: r,
    sd: n,
    si: function(p, f) {
      return p === "one" && f === "one" ? "one" : "other";
    },
    sk: r,
    sl: function(p, f) {
      return f === "few" || f === "one" ? "few" : f === "two" ? "two" : "other";
    },
    sq: r,
    sr: r,
    sv: i,
    sw: r,
    ta: r,
    te: r,
    th: i,
    tk: r,
    tr: r,
    ug: r,
    uk: r,
    ur: i,
    uz: r,
    vi: i,
    yue: i,
    zh: i,
    zu: r
  });
})(ut);
var te = /* @__PURE__ */ at(ut.exports), vo = /* @__PURE__ */ it({
  __proto__: null,
  default: te
}, [ut.exports]), go = Yt || ho, bo = Kt || po, yo = te || vo, ft = function(e) {
  return e === "pt-PT" ? "pt_PT" : e;
}, _o = function(e) {
  return go[ft(e)];
}, wo = function(e, i) {
  return bo[ft(e)][i ? "ordinal" : "cardinal"];
}, xo = function(e) {
  return yo[ft(e)];
}, Eo = mo.default(Intl.NumberFormat, _o, wo, xo), So = Eo, To = So;
function Ho(t) {
  return t && typeof t == "object" && "default" in t ? t : { default: t };
}
var B = /* @__PURE__ */ Ho(To);
if (typeof Intl > "u")
  typeof N < "u" ? N.Intl = {
    PluralRules: B.default
  } : typeof window < "u" ? window.Intl = {
    PluralRules: B.default
  } : N.Intl = {
    PluralRules: B.default
  }, B.default.polyfill = !0;
else if (!Intl.PluralRules || !Intl.PluralRules.prototype.selectRange)
  Intl.PluralRules = B.default, B.default.polyfill = !0;
else {
  var St = ["en", "es", "ru", "zh"], No = Intl.PluralRules.supportedLocalesOf(St);
  No.length < St.length && (Intl.PluralRules = B.default, B.default.polyfill = !0);
}
var Bo = typeof N == "object" && N && N.Object === Object && N, Ao = Bo, Po = Ao, jo = typeof self == "object" && self && self.Object === Object && self, Io = Po || jo || Function("return this")(), Ro = Io, ko = Ro, Oo = ko.Symbol, lt = Oo;
function Lo(t, e) {
  for (var i = -1, n = t == null ? 0 : t.length, r = Array(n); ++i < n; )
    r[i] = e(t[i], i, t);
  return r;
}
var Co = Lo, Mo = Array.isArray, Go = Mo, Tt = lt, ee = Object.prototype, Uo = ee.hasOwnProperty, Do = ee.toString, O = Tt ? Tt.toStringTag : void 0;
function Fo(t) {
  var e = Uo.call(t, O), i = t[O];
  try {
    t[O] = void 0;
    var n = !0;
  } catch {
  }
  var r = Do.call(t);
  return n && (e ? t[O] = i : delete t[O]), r;
}
var qo = Fo, zo = Object.prototype, Vo = zo.toString;
function Wo(t) {
  return Vo.call(t);
}
var Xo = Wo, Ht = lt, $o = qo, Zo = Xo, Jo = "[object Null]", Qo = "[object Undefined]", Nt = Ht ? Ht.toStringTag : void 0;
function Yo(t) {
  return t == null ? t === void 0 ? Qo : Jo : Nt && Nt in Object(t) ? $o(t) : Zo(t);
}
var Ko = Yo;
function ti(t) {
  return t != null && typeof t == "object";
}
var ei = ti, oi = Ko, ii = ei, ni = "[object Symbol]";
function ai(t) {
  return typeof t == "symbol" || ii(t) && oi(t) == ni;
}
var ri = ai, Bt = lt, si = Co, ui = Go, fi = ri, li = 1 / 0, At = Bt ? Bt.prototype : void 0, Pt = At ? At.toString : void 0;
function oe(t) {
  if (typeof t == "string")
    return t;
  if (ui(t))
    return si(t, oe) + "";
  if (fi(t))
    return Pt ? Pt.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -li ? "-0" : e;
}
var ci = oe, mi = ci;
function hi(t) {
  return t == null ? "" : mi(t);
}
var pi = hi;
function di(t) {
  return function(e) {
    return t == null ? void 0 : t[e];
  };
}
var vi = di, gi = vi, bi = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, yi = gi(bi), _i = yi, wi = pi, xi = _i, ie = /&(?:amp|lt|gt|quot|#39);/g, Ei = RegExp(ie.source);
function Si(t) {
  return t = wi(t), t && Ei.test(t) ? t.replace(ie, xi) : t;
}
var Ti = Si;
const Hi = /* @__PURE__ */ Qe(Ti), Ni = { ar: { "notification.favourite": "أُعجِب {name} بمنشورك", "notification.follow": "قام {name} بمتابعتك", "notification.follow_request": "طلب {name} متابعتك", "notification.mention": "قام {name} بذكرك", "notification.reblog": "قام {name} بمشاركة منشورك", "notification.poll": "لقد انتهى استفتاء شاركت فيه", "notification.status": "{name} نشر للتو", "notification.move": "{name} تغير إلى {targetName}", "notification.user_approved": "مرحباً بك في {instance}!", "notification.pleroma:chat_mention": "{name} أرسل لك رسالة", "notification.pleroma:emoji_reaction": "تفاعل {name} مع منشورك", "status.show_more": "", "status.reblog": "مشاركة", "status.favourite": "تفاعل مع المنشور", "notifications.group": "{count, plural, one {# إشعار} two {# إشعاران} few {#إشعارات } many {# إشعارًا} other {# إشعارٍ}}" }, ast: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} siguióte", "notification.follow_request": "", "notification.mention": "{name} mentóte", "notification.reblog": "{name} compartió'l to estáu", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Compartir", "status.favourite": "Favorite", "notifications.group": "{count} avisos" }, bg: { "notification.favourite": "{name} хареса твоята публикация", "notification.follow": "{name} те последва", "notification.follow_request": "", "notification.mention": "{name} те спомена", "notification.reblog": "{name} сподели твоята публикация", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Споделяне", "status.favourite": "Предпочитани", "notifications.group": "{count} notifications" }, bn: { "notification.favourite": "{name} আপনার কার্যক্রম পছন্দ করেছেন", "notification.follow": "{name} আপনাকে অনুসরণ করেছেন", "notification.follow_request": "", "notification.mention": "{name} আপনাকে উল্লেখ করেছেন", "notification.reblog": "{name} আপনার কার্যক্রমে সমর্থন দেখিয়েছেন", "notification.poll": "আপনি ভোট দিয়েছিলেন এমন এক  নির্বাচনের ভোটের সময় শেষ হয়েছে", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "সমর্থন দিতে", "status.favourite": "পছন্দের করতে", "notifications.group": "{count} প্রজ্ঞাপন" }, br: { "notification.favourite": "{name} favorited your post", "notification.follow": "", "notification.follow_request": "", "notification.mention": "", "notification.reblog": "", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, bs: { "notification.favourite": "", "notification.follow": "", "notification.follow_request": "", "notification.mention": "", "notification.reblog": "", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "", "status.favourite": "", "notifications.group": "" }, ca: { "notification.favourite": "{name} ha afavorit el teu estat", "notification.follow": "{name} t'ha seguit", "notification.follow_request": "{name} ha sol·licitat seguir-te", "notification.mention": "{name} t'ha esmentat", "notification.reblog": "{name} ha impulsat el teu estat", "notification.poll": "Ha finalitzat una enquesta en la que has votat", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "{name} t'ha enviat un missatge", "notification.pleroma:emoji_reaction": "{name} ha reaccionat a la teva publicació", "status.show_more": "", "status.reblog": "Impuls", "status.favourite": "Favorit", "notifications.group": "{count} notificacions" }, co: { "notification.favourite": "{name} hà aghjuntu u vostru statutu à i so favuriti", "notification.follow": "{name} v'hà seguitatu", "notification.follow_request": "", "notification.mention": "{name} v'hà mintuvatu", "notification.reblog": "{name} hà spartutu u vostru statutu", "notification.poll": "Un scandagliu induve avete vutatu hè finitu", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Sparte", "status.favourite": "Aghjunghje à i favuriti", "notifications.group": "{count} nutificazione" }, cs: { "notification.favourite": "{name} si oblíbil/a váš příspěvek", "notification.follow": "{name} vás začal/a sledovat", "notification.follow_request": "", "notification.mention": "{name} vás zmínil/a", "notification.reblog": "{name} boostnul/a váš příspěvek", "notification.poll": "Anketa, ve které jste hlasoval/a, skončila", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "{name} vám poslal/a zprávu", "notification.pleroma:emoji_reaction": "{name} reagoval/a na váš příspěvek", "status.show_more": "", "status.reblog": "Boostnout", "status.favourite": "Oblíbit", "notifications.group": "{count} oznámení" }, cy: { "notification.favourite": "Hoffodd {name} eich neges", "notification.follow": "Dilynodd {name} chi", "notification.follow_request": "Hoffai {name} eich dilyn chi", "notification.mention": "Soniodd {name} amdanoch chi", "notification.reblog": "Hysbysebodd {name} eich tŵt", "notification.poll": "Mae arolwg rydych wedi cymryd rhan ynddo wedi dod i ben", "notification.status": "", "notification.move": "", "notification.user_approved": "Croeso i {instance}!", "notification.pleroma:chat_mention": "Anfonodd {name} neges atoch", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Hybu", "status.favourite": "Hoffi", "notifications.group": "{count} o hysbysiadau" }, da: { "notification.favourite": "{name} favoriserede din status", "notification.follow": "{name} fulgte dig", "notification.follow_request": "", "notification.mention": "{name} nævnte dig", "notification.reblog": "{name} boostede din status", "notification.poll": "En afstemning, du stemte i, er slut", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "", "status.favourite": "Favorit", "notifications.group": "{count} notifikationer" }, de: { "notification.favourite": "{name} hat deinen Beitrag favorisiert", "notification.follow": "{name} folgt dir", "notification.follow_request": "{name} möchte dir folgen", "notification.mention": "{name} hat dich erwähnt", "notification.reblog": "{name} hat deinen Beitrag geteilt", "notification.poll": "Eine Umfrage, in der du abgestimmt hast, ist vorbei", "notification.status": "{name} einen neuen Beitrag erstellt", "notification.move": "{name} ist nach {targetName} umgezogen", "notification.user_approved": "Willkommen bei {instance}!", "notification.pleroma:chat_mention": "{name} hat dir eine Nachricht gesendet", "notification.pleroma:emoji_reaction": "{name} hat auf deinen Beitrag reagiert", "status.show_more": "", "status.reblog": "Teilen", "status.favourite": "Favorisieren", "notifications.group": "{count, plural, one {# Benachrichtigung} other {# Benachrichtigungen}}" }, el: { "notification.favourite": "Ο/Η {name} σημείωσε ως αγαπημένη την κατάστασή σου", "notification.follow": "Ο/Η {name} σε ακολούθησε", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "Ο/Η {name} σε ανέφερε", "notification.reblog": "Ο/Η {name} προώθησε την κατάστασή σου", "notification.poll": "Τελείωσε μια από τις ψηφοφορίες που συμμετείχες", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Προώθησε", "status.favourite": "Σημείωσε ως αγαπημένο", "notifications.group": "{count} ειδοποιήσεις" }, "en-Shaw": { "notification.favourite": "{name} 𐑤𐑲𐑒𐑑 𐑘𐑹 𐑐𐑴𐑕𐑑", "notification.follow": "{name} 𐑓𐑪𐑤𐑴𐑛 𐑿", "notification.follow_request": "{name} 𐑣𐑨𐑟 𐑮𐑦𐑒𐑢𐑧𐑕𐑑𐑩𐑛 𐑑 𐑓𐑪𐑤𐑴 𐑿", "notification.mention": "{name} 𐑥𐑧𐑯𐑖𐑩𐑯𐑛 𐑿", "notification.reblog": "{name} 𐑮𐑰𐑐𐑴𐑕𐑑𐑩𐑛 𐑘𐑹 𐑐𐑴𐑕𐑑", "notification.poll": "A 𐑐𐑴𐑤 𐑿 𐑣𐑨𐑝 𐑝𐑴𐑑𐑩𐑛 𐑦𐑯 𐑣𐑨𐑟 𐑧𐑯𐑛𐑩𐑛", "notification.status": "{name} just posted", "notification.move": "{name} 𐑥𐑵𐑝𐑛 𐑑 {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} 𐑕𐑧𐑯𐑑 𐑿 𐑩 𐑥𐑧𐑕𐑦𐑡", "notification.pleroma:emoji_reaction": "{name} 𐑮𐑦𐑨𐑒𐑑𐑩𐑛 𐑑 𐑘𐑹 𐑐𐑴𐑕𐑑", "status.show_more": "", "status.reblog": "𐑮𐑰𐑐𐑴𐑕𐑑", "status.favourite": "𐑤𐑲𐑒", "notifications.group": "{count} 𐑯𐑴𐑑𐑦𐑓𐑦𐑒𐑱𐑖𐑩𐑯𐑟" }, en: { "notification.favourite": "{name} liked your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Like", "notifications.group": "{count, plural, one {# notification} other {# notifications}}" }, eo: { "notification.favourite": "{name} stelumis vian mesaĝon", "notification.follow": "{name} eksekvis vin", "notification.follow_request": "", "notification.mention": "{name} menciis vin", "notification.reblog": "{name} diskonigis vian mesaĝon", "notification.poll": "Partoprenita balotenketo finiĝis", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Diskonigi", "status.favourite": "Stelumi", "notifications.group": "{count} sciigoj" }, "es-AR": { "notification.favourite": "{name} marcó tu estado como favorito", "notification.follow": "{name} te empezó a seguir", "notification.follow_request": "", "notification.mention": "{name} te mencionó", "notification.reblog": "{name} retooteó tu estado", "notification.poll": "Finalizó una encuesta en la que votaste", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Retootear", "status.favourite": "Favorito", "notifications.group": "{count} notificaciones" }, es: { "notification.favourite": "{name} marcó tu estado como favorito", "notification.follow": "{name} te empezó a seguir", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} te ha mencionado", "notification.reblog": "{name} ha retooteado tu estado", "notification.poll": "Una encuesta en la que has votado ha terminado", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Retootear", "status.favourite": "Favorito", "notifications.group": "{count, plural, one {# notificación} other {# notificaciones}}" }, et: { "notification.favourite": "{name} märkis su staatuse lemmikuks", "notification.follow": "{name} jälgib sind", "notification.follow_request": "", "notification.mention": "{name} mainis sind", "notification.reblog": "{name} upitas su staatust", "notification.poll": "Küsitlus, milles osalesid, on lõppenud", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Upita", "status.favourite": "Lemmik", "notifications.group": "{count} teated" }, eu: { "notification.favourite": "{name}(e)k zure mezua gogoko du", "notification.follow": "{name}(e)k jarraitzen zaitu", "notification.follow_request": "", "notification.mention": "{name}(e)k aipatu zaitu", "notification.reblog": "{name}(e)k bultzada eman dio zure mezuari", "notification.poll": "Zuk erantzun duzun inkesta bat bukatu da", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Bultzada", "status.favourite": "Gogokoa", "notifications.group": "{count} jakinarazpen" }, fa: { "notification.favourite": "‫{name}‬ نوشتهٔ شما را پسندید", "notification.follow": "‫{name}‬ پیگیر شما شد", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "‫{name}‬ از شما نام برد", "notification.reblog": "‫{name}‬ نوشتهٔ شما را بازبوقید", "notification.poll": "نظرسنجی‌ای که در آن رأی دادید به پایان رسیده است", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "بازبوقیدن", "status.favourite": "پسندیدن", "notifications.group": "{count} اعلان" }, fi: { "notification.favourite": "{name} tykkäsi tilastasi", "notification.follow": "{name} seurasi sinua", "notification.follow_request": "", "notification.mention": "{name} mainitsi sinut", "notification.reblog": "{name} buustasi tilaasi", "notification.poll": "Kysely, johon osallistuit, on päättynyt", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Buustaa", "status.favourite": "Tykkää", "notifications.group": "{count} ilmoitusta" }, fr: { "notification.favourite": "{name} a ajouté à ses favoris", "notification.follow": "{name} vous suit", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} vous a mentionné", "notification.reblog": "{name} a partagé votre statut", "notification.poll": "Un sondage auquel vous avez participé vient de se terminer", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Bienvenue sur {instance} !", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Partager", "status.favourite": "Ajouter aux favoris", "notifications.group": "{count, plural, one {# notification} other {# notifications}}" }, ga: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, gl: { "notification.favourite": "{name} marcou como favorito o seu estado", "notification.follow": "{name} está a seguila", "notification.follow_request": "", "notification.mention": "{name} mencionoute", "notification.reblog": "{name} promoveu o seu estado", "notification.poll": "Unha sondaxe na que votou xa rematou", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Promover", "status.favourite": "Favorita", "notifications.group": "{count} notificacións" }, he: { "notification.favourite": "הפוסט שלך חובב על ידי {name}", "notification.follow": "{name} במעקב אחרייך", "notification.follow_request": "{name} ביקש לעקוב אחריך", "notification.mention": "אוזכרת על ידי {name}", "notification.reblog": "הפוסט שלך הודהד על ידי {name}", "notification.poll": "סקר שהצבעת בו הסתיים", "notification.status": "{name} just posted", "notification.move": "{name} הועבר אל {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} שלח לך הודעה", "notification.pleroma:emoji_reaction": "{name} הגיב לפוסט שלך", "status.show_more": "", "status.reblog": "הדהוד", "status.favourite": "חיבוב", "notifications.group": "{count} התראות" }, hi: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, hr: { "notification.favourite": "{name} se sviđa tvoj status", "notification.follow": "{name} te sada prati", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} te je spomenuo", "notification.reblog": "{name} je proslijedio/la objavu", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Proslijedi objavu", "status.favourite": "Reagiraj na objavu", "notifications.group": "{count} obavijesti" }, hu: { "notification.favourite": "{name} kedvencnek jelölte egy tülködet", "notification.follow": "{name} követ téged", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} megemlített", "notification.reblog": "{name} megtolta a tülködet", "notification.poll": "Egy szavazás, melyben részt vettél, véget ért", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Megtolás", "status.favourite": "Kedvenc", "notifications.group": "{count} értesítés" }, hy: { "notification.favourite": "{name} հավանեց թութդ", "notification.follow": "{name} սկսեց հետեւել քեզ", "notification.follow_request": "", "notification.mention": "{name} նշեց քեզ", "notification.reblog": "{name} տարածեց թութդ", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Տարածել", "status.favourite": "Հավանել", "notifications.group": "{count} notifications" }, id: { "notification.favourite": "{name} menyukai status anda", "notification.follow": "{name} mengikuti anda", "notification.follow_request": "{name} telah meminta untuk mengikuti Anda", "notification.mention": "{name} menyebut Anda", "notification.reblog": "{name} mem-boost status anda", "notification.poll": "Japat yang Anda ikuti telah berakhir", "notification.status": "{name} baru saja diposting", "notification.move": "{name} pindah ke {targetName}", "notification.user_approved": "Selamat Datang di {instance}!", "notification.pleroma:chat_mention": "{name} mengirimimu pesan", "notification.pleroma:emoji_reaction": "{name} bereaksi terhadap postingan Anda", "status.show_more": "", "status.reblog": "Posting ulang", "status.favourite": "Difavoritkan", "notifications.group": "{count, plural, one {# notification} lainya {# notifications}}" }, io: { "notification.favourite": "{name} favorizis tua mesajo", "notification.follow": "{name} sequeskis tu", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mencionis tu", "notification.reblog": "{name} repetis tua mesajo", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repetar", "status.favourite": "Favorizar", "notifications.group": "{count} notifications" }, is: { "notification.favourite": "{name} liked your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} minntist á þig", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Endurbirta", "status.favourite": "Setja í eftirlæti", "notifications.group": "{count} tilkynningar" }, it: { "notification.favourite": "{name} ha preferito la pubblicazione", "notification.follow": "{name} adesso ti segue", "notification.follow_request": "{name} ha chiesto di seguirti", "notification.mention": "{name} ti ha menzionato", "notification.reblog": "{name} ha condiviso la tua pubblicazione", "notification.poll": "Un sondaggio in cui hai votato è terminato", "notification.status": "{name} ha pubblicato", "notification.move": "{name} ha migrato su {targetName}", "notification.user_approved": "Eccoci su {instance}!", "notification.pleroma:chat_mention": "{name} ti ha scritto in chat", "notification.pleroma:emoji_reaction": "{name} ha reagito alla pubblicazione", "status.show_more": "", "status.reblog": "Condividi", "status.favourite": "Reazioni", "notifications.group": "{count, plural, one {# notifica} other {# notifiche}}" }, ja: { "notification.favourite": "{name}さんがあなたの投稿をお気に入りに登録しました", "notification.follow": "{name}さんにフォローされました", "notification.follow_request": "{name} があなたにフォロー申請しました", "notification.mention": "{name}さんがあなたに返信しました", "notification.reblog": "{name}さんがあなたの投稿をリピートしました", "notification.poll": "アンケートが終了しました", "notification.status": "{name} がたった今投稿", "notification.move": "", "notification.user_approved": "{instance} へようこそ!", "notification.pleroma:chat_mention": "{name}さんがあなたにメッセージを送りました", "notification.pleroma:emoji_reaction": "{name}さんがあなたの投稿に反応しました", "status.show_more": "", "status.reblog": "リピート", "status.favourite": "お気に入り", "notifications.group": "{count} 件の通知" }, jv: { "notification.favourite": "", "notification.follow": "", "notification.follow_request": "", "notification.mention": "", "notification.reblog": "", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "", "status.favourite": "", "notifications.group": "" }, ka: { "notification.favourite": "{name}-მა თქვენი სტატუსი აქცია ფავორიტად", "notification.follow": "{name} გამოგყვათ", "notification.follow_request": "", "notification.mention": "{name}-მა გასახელათ", "notification.reblog": "{name}-მა დაბუსტა თქვენი სტატუსი", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "ბუსტი", "status.favourite": "ფავორიტი", "notifications.group": "{count} შეტყობინება" }, kk: { "notification.favourite": "{name} жазбаңызды таңдаулыға қосты", "notification.follow": "{name} сізге жазылды", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} сізді атап өтті", "notification.reblog": "{name} жазбаңызды бөлісті", "notification.poll": "Бұл сауалнаманың мерзімі аяқталыпты", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Бөлісу", "status.favourite": "Таңдаулы", "notifications.group": "{count} ескертпе" }, ko: { "notification.favourite": "{name}님이 즐겨찾기 했습니다", "notification.follow": "{name}님이 나를 팔로우 했습니다", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name}님이 답글을 보냈습니다", "notification.reblog": "{name}님이 부스트 했습니다", "notification.poll": "당신이 참여 한 투표가 종료되었습니다", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "부스트", "status.favourite": "즐겨찾기", "notifications.group": "{count} 개의 알림" }, lt: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, lv: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, mk: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, ms: { "notification.favourite": "{name} favorited your post", "notification.follow": "{name} followed you", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} mentioned you", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, nl: { "notification.favourite": "{name} voegde jouw toot als favoriet toe", "notification.follow": "{name} volgt jou nu", "notification.follow_request": "", "notification.mention": "{name} vermeldde jou", "notification.reblog": "{name} repostte jouw toot", "notification.poll": "Een poll waaraan jij hebt meegedaan is beëindigd", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "", "status.favourite": "Favoriet", "notifications.group": "{count} meldingen" }, nn: { "notification.favourite": "{name} likte din status", "notification.follow": "{name} fulgte deg", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} nevnte deg", "notification.reblog": "{name} reposted your post", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Repost", "status.favourite": "Favorite", "notifications.group": "{count} notifications" }, no: { "notification.favourite": "{name} likte din status", "notification.follow": "{name} fulgte deg", "notification.follow_request": "{name} har bedt om å følge deg", "notification.mention": "{name} nevnte deg", "notification.reblog": "{name} fremhevde din status", "notification.poll": "En avstemning du har stemt i er avsluttet", "notification.status": "{name} har nettopp lagt ut", "notification.move": "{name} flyttet til {targetName}", "notification.user_approved": "Velkommen til {instance}!", "notification.pleroma:chat_mention": "{name} sendte deg en melding", "notification.pleroma:emoji_reaction": "{name} reagerte på innlegget ditt", "status.show_more": "", "status.reblog": "Fremhev", "status.favourite": "Lik", "notifications.group": "{count, plural, one {# notification} other {# notifications}}" }, oc: { "notification.favourite": "{name} a ajustat a sos favorits", "notification.follow": "{name} vos sèc", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} vos a mencionat", "notification.reblog": "{name} a partejat vòstre estatut", "notification.poll": "Avètz participat a un sondatge que ven de s’acabar", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Partejar", "status.favourite": "Apondre als favorits", "notifications.group": "{count} notificacions" }, pl: { "notification.favourite": "{name} dodał(a) Twój wpis do ulubionych", "notification.follow": "{name} zaczął(-ęła) Cię obserwować", "notification.follow_request": "{name} poprosił(a) Cię o możliwość obserwacji", "notification.mention": "{name} wspomniał(a) o tobie", "notification.reblog": "{name} podbił(a) Twój wpis", "notification.poll": "Głosowanie w którym brałeś(-aś) udział zakończyła się", "notification.status": "{name} właśnie opublikował(a) wpis", "notification.move": "{name} przeniósł(-osła) się na {targetName}", "notification.user_approved": "Witamy w {instance}!", "notification.pleroma:chat_mention": "{name} wysłał(a) Ci wiadomośść", "notification.pleroma:emoji_reaction": "{name} zareagował(a) na Twój wpis", "status.show_more": "", "status.reblog": "Podbij", "status.favourite": "Zareaguj", "notifications.group": "{count, plural, one {# powiadomienie} few {# powiadomienia} many {# powiadomień} more {# powiadomień}}" }, "pt-BR": { "notification.favourite": "{name} adicionou a sua postagem aos favoritos", "notification.follow": "{name} te seguiu", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} te mencionou", "notification.reblog": "{name} compartilhou a sua postagem", "notification.poll": "Uma enquete em que você votou chegou ao fim", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Compartilhar", "status.favourite": "Adicionar aos favoritos", "notifications.group": "{count} notificações" }, pt: { "notification.favourite": "{name} gostou desta publicação", "notification.follow": "{name} começou a seguir-te", "notification.follow_request": "{name} pediu para te seguir", "notification.mention": "{name} mencionou-te", "notification.reblog": "{name} partilhou o teu estado", "notification.poll": "Uma sondagem em que participaste chegou ao fim", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} enviou-te uma mensagem", "notification.pleroma:emoji_reaction": "{name} reagiu à tua publicação", "status.show_more": "", "status.reblog": "Partilhar", "status.favourite": "Gostar", "notifications.group": "{count} notificações" }, ro: { "notification.favourite": "{name} a adăugat statusul tău la favorite", "notification.follow": "{name} te urmărește", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} te-a menționat", "notification.reblog": "{name} a redistribuit postarea ta", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Redistribuie", "status.favourite": "Favorite", "notifications.group": "{count} notificări" }, ru: { "notification.favourite": "{name} понравился Ваш статус", "notification.follow": "{name} подписался (-лась) на вас", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} упомянул(а) вас", "notification.reblog": "{name} продвинул(а) Ваш статус", "notification.poll": "Опрос, в котором вы приняли участие, завершился", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Продвинуть", "status.favourite": "Нравится", "notifications.group": "{count} уведомл." }, sk: { "notification.favourite": "{name} si obľúbil/a tvoj príspevok", "notification.follow": "{name} ťa začal/a následovať", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} ťa spomenul/a", "notification.reblog": "{name} zdieľal/a tvoj príspevok", "notification.poll": "Anketa v ktorej si hlasoval/a sa skončila", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Vyzdvihni", "status.favourite": "Páči sa mi", "notifications.group": "{count} oboznámení" }, sl: { "notification.favourite": "{name} je vzljubil/a vaš status", "notification.follow": "{name} vam sledi", "notification.follow_request": "", "notification.mention": "{name} vas je omenil/a", "notification.reblog": "{name} je spodbudil/a vaš status", "notification.poll": "Glasovanje, v katerem ste sodelovali, se je končalo", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Spodbudi", "status.favourite": "Priljubljen", "notifications.group": "{count} obvestil" }, sq: { "notification.favourite": "{name} parapëlqeu gjendjen tuaj", "notification.follow": "{name} zuri t’ju ndjekë", "notification.follow_request": "", "notification.mention": "{name} ju ka përmendur", "notification.reblog": "{name} përforcoi gjendjen tuaj", "notification.poll": "", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Përforcojeni", "status.favourite": "I parapëlqyer", "notifications.group": "{count}s njoftime" }, "sr-Latn": { "notification.favourite": "{name} je stavio Vaš status kao omiljeni", "notification.follow": "{name} Vas je zapratio", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} Vas je pomenuo", "notification.reblog": "{name} je podržao(la) Vaš status", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Podrži", "status.favourite": "Omiljeno", "notifications.group": "{count} notifications" }, sr: { "notification.favourite": "{name} је ставио/ла Ваш статус као омиљени", "notification.follow": "{name} Вас је запратио/ла", "notification.follow_request": "{name} has requested to follow you", "notification.mention": "{name} Вас је поменуо/ла", "notification.reblog": "{name} је подржао/ла Ваш статус", "notification.poll": "A poll you have voted in has ended", "notification.status": "{name} just posted", "notification.move": "{name} moved to {targetName}", "notification.user_approved": "Welcome to {instance}!", "notification.pleroma:chat_mention": "{name} sent you a message", "notification.pleroma:emoji_reaction": "{name} reacted to your post", "status.show_more": "", "status.reblog": "Подржи", "status.favourite": "Омиљено", "notifications.group": "{count} обавештења" }, sv: { "notification.favourite": "{name} favoriserade din status", "notification.follow": "{name} följer dig", "notification.follow_request": "", "notification.mention": "{name} nämnde dig", "notification.reblog": "{name} knuffade din status", "notification.poll": "En omröstning du röstat i har avslutats", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Knuffa", "status.favourite": "Favorit", "notifications.group": "{count} aviseringar" }, ta: { "notification.favourite": "{name} ஆர்வம் கொண்டவர், உங்கள் நிலை", "notification.follow": "{name} நீங்கள் தொடர்ந்து வந்தீர்கள்", "notification.follow_request": "", "notification.mention": "{name} நீங்கள் குறிப்பிட்டுள்ளீர்கள்", "notification.reblog": "{name} உங்கள் நிலை அதிகரித்தது", "notification.poll": "நீங்கள் வாக்களித்த வாக்கெடுப்பு முடிவடைந்தது", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "மதிப்பை உயர்த்து", "status.favourite": "விருப்பத்துக்குகந்த", "notifications.group": "{count} notifications" }, te: { "notification.favourite": "{name} మీ స్టేటస్ ను ఇష్టపడ్డారు", "notification.follow": "{name} మిమ్మల్ని అనుసరిస్తున్నారు", "notification.follow_request": "", "notification.mention": "{name} మిమ్మల్ని ప్రస్తావించారు", "notification.reblog": "{name} మీ స్టేటస్ ను బూస్ట్ చేసారు", "notification.poll": "మీరు పాల్గొనిన ఎన్సిక ముగిసినది", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "బూస్ట్", "status.favourite": "ఇష్టపడు", "notifications.group": "{count} ప్రకటనలు" }, th: { "notification.favourite": "{name} ได้ชื่นชอบสถานะของคุณ", "notification.follow": "{name} ได้ติดตามคุณ", "notification.follow_request": "", "notification.mention": "{name} ได้กล่าวถึงคุณ", "notification.reblog": "{name} ได้ดันสถานะของคุณ", "notification.poll": "โพลที่คุณได้ลงคะแนนได้สิ้นสุดแล้ว", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "ดัน", "status.favourite": "ชื่นชอบ", "notifications.group": "{count} การแจ้งเตือน" }, tr: { "notification.favourite": "{name} senin gönderini beğenilere ekledi", "notification.follow": "{name} seni takip ediyor", "notification.follow_request": "{name} sizi takip etmek istiyor", "notification.mention": "{name} senden bahsetti", "notification.reblog": "{name} senin durumunu yeniden gönderdi", "notification.poll": "Oy verdiğiniz bir anket bitti", "notification.status": "{name} az önce gönderdi", "notification.move": "{name}, {targetName} konumuna taşındı", "notification.user_approved": "{instance}'a hoş geldiniz!", "notification.pleroma:chat_mention": "{name} sana bir mesaj gönderdi", "notification.pleroma:emoji_reaction": "{name} gönderinize tepki verdi", "status.show_more": "", "status.reblog": "Yeniden Gönder", "status.favourite": "Beğen", "notifications.group": "{count, plural, one {# bildirim} ve diğer {# bildirimler}}" }, uk: { "notification.favourite": "{name} вподобав(-ла) ваш допис", "notification.follow": "{name} підписався(-лась) на Вас", "notification.follow_request": "{name} відправив(-ла) запит на підписку", "notification.mention": "{name} згадав(-ла) Вас", "notification.reblog": "{name} передмухнув(-ла) Ваш допис", "notification.poll": "Опитування, у якому ви голосували, закінчилося", "notification.status": "", "notification.move": "", "notification.user_approved": "", "notification.pleroma:chat_mention": "", "notification.pleroma:emoji_reaction": "", "status.show_more": "", "status.reblog": "Передмухнути", "status.favourite": "Подобається", "notifications.group": "{count} сповіщень" }, "zh-CN": { "notification.favourite": "{name} 点赞了您的帖文", "notification.follow": "{name} 开始关注您", "notification.follow_request": "{name} 请求关注您", "notification.mention": "{name} 提及了您", "notification.reblog": "{name} 转载了您的帖文", "notification.poll": "一项您参加的投票已经结束", "notification.status": "{name} 刚刚发帖", "notification.move": "{name} 移动到了 {targetName}", "notification.user_approved": "欢迎来到 {instance}！", "notification.pleroma:chat_mention": "{name} 给您发送了信息", "notification.pleroma:emoji_reaction": "{name} 表情回应了您的帖文", "status.show_more": "", "status.reblog": "转发", "status.favourite": "点赞", "notifications.group": "{count} 条通知" }, "zh-HK": { "notification.favourite": "{name} 讚了你的帖文", "notification.follow": "{name} 追蹤了你", "notification.follow_request": "{name} 請求追蹤你", "notification.mention": "{name} 提到了你", "notification.reblog": "{name} 轉帖了你的帖文", "notification.poll": "你參與的一項投票已經結束", "notification.status": "{name} 剛剛發帖", "notification.move": "{name} 移動到了 {targetName}", "notification.user_approved": "歡迎來到 {instance}！", "notification.pleroma:chat_mention": "{name} 給你發送了訊息", "notification.pleroma:emoji_reaction": "{name} 用表情回應了你的帖文", "status.show_more": "", "status.reblog": "轉帖", "status.favourite": "最愛", "notifications.group": "{count} 條通知" }, "zh-TW": { "notification.favourite": "{name} 最愛了你的貼文", "notification.follow": "{name} 追隨了你", "notification.follow_request": "{name} 請求追隨你", "notification.mention": "{name} 提到了你", "notification.reblog": "{name} 轉發了你的貼文", "notification.poll": "你參與的一項投票已經結束", "notification.status": "{name} 剛剛發文", "notification.move": "{name} 移動到了 {targetName}", "notification.user_approved": "歡迎來到 {instance}！", "notification.pleroma:chat_mention": "{name} 發送了訊息給你", "notification.pleroma:emoji_reaction": "{name} 用表情回應了你的貼文", "status.show_more": "", "status.reblog": "轉發", "status.favourite": "最愛", "notifications.group": "{count} 條通知" } }, Bi = 5, jt = "tag", It = (t) => self.registration.getNotifications().then((e) => {
  if (e.length >= Bi) {
    const i = {
      title: I("notifications.group", t.data.preferred_locale, { count: e.length + 1 }),
      body: e.map((n) => n.title).join(`
`),
      tag: jt,
      data: {
        url: new URL("/notifications", self.location.href).href,
        count: e.length + 1,
        preferred_locale: t.data.preferred_locale
      }
    };
    return e.forEach((n) => n.close()), self.registration.showNotification(i.title, i);
  } else if (e.length === 1 && e[0].tag === jt) {
    const i = ct(e[0]), n = (i.data.count || 0) + 1;
    return i.title = I("notifications.group", t.data.preferred_locale, { count: n }), i.body = `${t.title}
${i.body}`, i.data = { ...i.data, count: n }, self.registration.showNotification(i.title, i);
  }
  return self.registration.showNotification(t.title, t);
}), tt = (t, e, i) => {
  const n = new URL(t, self.location.href).href;
  return fetch(n, {
    headers: {
      Authorization: `Bearer ${i}`,
      "Content-Type": "application/json"
    },
    method: e,
    credentials: "include"
  }).then((r) => {
    if (r.ok)
      return r;
    throw new Error(String(r.status));
  }).then((r) => r.json());
}, ct = (t) => {
  const e = {};
  let i;
  for (i in t)
    e[i] = t[i];
  return e;
}, I = (t, e, i = {}) => new Je(Ni[e][t], e).format(i), Rt = (t) => Hi(t.replace(/<br\s*\/?>/g, `
`).replace(/<\/p><[^>]*>/g, `

`).replace(/<[^>]*>/g, "")), Ai = (t) => {
  if (!t.data) {
    console.error("An empty web push event was received.", { event: t });
    return;
  }
  const { access_token: e, notification_id: i, preferred_locale: n, title: r, body: h, icon: p } = t.data.json();
  t.waitUntil(
    tt(`/api/v1/notifications/${i}`, "get", e).then((f) => {
      var o, a, s, c, l, m, d, v;
      const u = {
        title: I(`notification.${f.type}`, n, { name: f.account.display_name.length > 0 ? f.account.display_name : f.account.username }),
        body: f.status && Rt(f.status.content),
        icon: f.account.avatar_static,
        timestamp: f.created_at && Number(new Date(f.created_at)),
        tag: f.id,
        image: (a = (o = f.status) == null ? void 0 : o.media_attachments[0]) == null ? void 0 : a.preview_url,
        data: { access_token: e, preferred_locale: n, id: f.status ? f.status.id : f.account.id, url: f.status ? `/@${f.account.acct}/posts/${f.status.id}` : `/@${f.account.acct}` }
      };
      return (s = f.status) != null && s.spoiler_text || (c = f.status) != null && c.sensitive ? (u.data.hiddenBody = Rt((l = f.status) == null ? void 0 : l.content), u.data.hiddenImage = (d = (m = f.status) == null ? void 0 : m.media_attachments[0]) == null ? void 0 : d.preview_url, (v = f.status) != null && v.spoiler_text && (u.body = f.status.spoiler_text), u.image = void 0, u.actions = [Pi(n)]) : f.type === "mention" && (u.actions = [ne(n), ae(n)]), It(u);
    }).catch(() => It({
      title: r,
      body: h,
      icon: p,
      tag: i,
      timestamp: Number(/* @__PURE__ */ new Date()),
      data: { access_token: e, preferred_locale: n, url: "/notifications" }
    }))
  );
}, Pi = (t) => ({
  action: "expand",
  icon: `/${require("../../assets/images/web-push/web-push-icon_expand.png")}`,
  title: I("status.show_more", t)
}), ne = (t) => ({
  action: "reblog",
  icon: `/${require("../../assets/images/web-push/web-push-icon_reblog.png")}`,
  title: I("status.reblog", t)
}), ae = (t) => ({
  action: "favourite",
  icon: `/${require("../../assets/images/web-push/web-push-icon_favourite.png")}`,
  title: I("status.favourite", t)
}), ji = (t) => {
  const e = t.find((n) => n.focused), i = t.find((n) => n.visibilityState === "visible");
  return e || i || t[0];
}, Ii = (t) => {
  const e = ct(t);
  return e.body = e.data.hiddenBody, e.image = e.data.hiddenImage, e.actions = [ne(t.data.preferred_locale), ae(t.data.preferred_locale)], self.registration.showNotification(e.title, e);
}, kt = (t, e) => {
  var n;
  const i = ct(t);
  return i.actions = (n = i.actions) == null ? void 0 : n.filter((r) => r.action !== e), self.registration.showNotification(i.title, i);
}, Ri = (t) => self.clients.matchAll({ type: "window" }).then((e) => e.length === 0 ? self.clients.openWindow(t) : ji(e).navigate(t).then((n) => n == null ? void 0 : n.focus())), ki = (t) => {
  const e = new Promise((i, n) => {
    if (t.action)
      if (t.action === "expand")
        i(Ii(t.notification));
      else if (t.action === "reblog") {
        const { data: r } = t.notification;
        i(tt(`/api/v1/statuses/${r.id}/reblog`, "post", r.access_token).then(() => kt(t.notification, "reblog")));
      } else if (t.action === "favourite") {
        const { data: r } = t.notification;
        i(tt(`/api/v1/statuses/${r.id}/favourite`, "post", r.access_token).then(() => kt(t.notification, "favourite")));
      } else
        n(`Unknown action: ${t.action}`);
    else
      t.notification.close(), i(Ri(t.notification.data.url));
  });
  t.waitUntil(e);
};
self.addEventListener("push", Ai);
self.addEventListener("notificationclick", ki);
//# sourceMappingURL=sw.js.map
