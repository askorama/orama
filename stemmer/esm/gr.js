/*
 * -----------------------------------------------------------------------------
 * GENERATED FILE - DO NOT EDIT!
 * This file has been compiled using the Snowball stemmer generator.
 * Don't edit this file directly.
 * -----------------------------------------------------------------------------
 */

var g = !0,
  p = !1;

function C() {
  this.p = function (k) {
    this.j = k;
    this.cursor = 0;
    this.a = this.j.length;
    this.f = 0;
    this.c = this.cursor;
    this.d = this.a;
  };
  this.z = function () {
    return this.j;
  };
  this.w = function (k) {
    this.j = k.j;
    this.cursor = k.cursor;
    this.a = k.a;
    this.f = k.f;
    this.c = k.c;
    this.d = k.d;
  };
  this.i = function (k, l, h) {
    if (this.cursor >= this.a) return p;
    var c = this.j.charCodeAt(this.cursor);
    if (c > h || c < l) return p;
    c -= l;
    if (0 == (k[c >>> 3] & (1 << (c & 7)))) return p;
    this.cursor++;
    return g;
  };
  this.n = function (k, l, h) {
    if (this.cursor <= this.f) return p;
    var c = this.j.charCodeAt(this.cursor - 1);
    if (c > h || c < l) return p;
    c -= l;
    if (0 == (k[c >>> 3] & (1 << (c & 7)))) return p;
    this.cursor--;
    return g;
  };
  this.k = function (k, l, h) {
    if (this.cursor >= this.a) return p;
    var c = this.j.charCodeAt(this.cursor);
    if (c > h || c < l) return this.cursor++, g;
    c -= l;
    return 0 == (k[c >>> 3] & (1 << (c & 7))) ? (this.cursor++, g) : p;
  };
  this.q = function (k, l, h) {
    if (this.cursor <= this.f) return p;
    var c = this.j.charCodeAt(this.cursor - 1);
    if (c > h || c < l) return this.cursor--, g;
    c -= l;
    return 0 == (k[c >>> 3] & (1 << (c & 7))) ? (this.cursor--, g) : p;
  };
  this.m = function (k) {
    if (this.a - this.cursor < k.length || this.j.slice(this.cursor, this.cursor + k.length) != k) return p;
    this.cursor += k.length;
    return g;
  };
  this.g = function (k) {
    if (this.cursor - this.f < k.length || this.j.slice(this.cursor - k.length, this.cursor) != k) return p;
    this.cursor -= k.length;
    return g;
  };
  this.o = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.a, d = 0, n = 0, v = p; ; ) {
      var b = l + ((h - l) >>> 1),
        f = 0,
        q = d < n ? d : n,
        t = k[b],
        s;
      for (s = q; s < t[0].length; s++) {
        if (c + q == a) {
          f = -1;
          break;
        }
        f = this.j.charCodeAt(c + q) - t[0].charCodeAt(s);
        if (0 != f) break;
        q++;
      }
      0 > f ? ((h = b), (n = q)) : ((l = b), (d = q));
      if (1 >= h - l) {
        if (0 < l) break;
        if (h == l) break;
        if (v) break;
        v = g;
      }
    }
    for (;;) {
      t = k[l];
      if (d >= t[0].length) {
        this.cursor = c + t[0].length;
        if (4 > t.length) return t[2];
        l = t[3](this);
        this.cursor = c + t[0].length;
        if (l) return t[2];
      }
      l = t[1];
      if (0 > l) return 0;
    }
  };
  this.h = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.f, d = 0, n = 0, v = p; ; ) {
      var b = l + ((h - l) >> 1),
        f = 0,
        q = d < n ? d : n,
        t = k[b],
        s;
      for (s = t[0].length - 1 - q; 0 <= s; s--) {
        if (c - q == a) {
          f = -1;
          break;
        }
        f = this.j.charCodeAt(c - 1 - q) - t[0].charCodeAt(s);
        if (0 != f) break;
        q++;
      }
      0 > f ? ((h = b), (n = q)) : ((l = b), (d = q));
      if (1 >= h - l) {
        if (0 < l) break;
        if (h == l) break;
        if (v) break;
        v = g;
      }
    }
    for (;;) {
      t = k[l];
      if (d >= t[0].length) {
        this.cursor = c - t[0].length;
        if (4 > t.length) return t[2];
        l = t[3](this);
        this.cursor = c - t[0].length;
        if (l) return t[2];
      }
      l = t[1];
      if (0 > l) return 0;
    }
  };
  this.s = function (k, l, h) {
    var c = h.length - (l - k);
    this.j = this.j.slice(0, k) + h + this.j.slice(l);
    this.a += c;
    this.cursor >= l ? (this.cursor += c) : this.cursor > k && (this.cursor = k);
    return c;
  };
  this.t = function () {
    return 0 > this.c || this.c > this.d || this.d > this.a || this.a > this.j.length ? p : g;
  };
  this.b = function (k) {
    var l = p;
    this.t() && (this.s(this.c, this.d, k), (l = g));
    return l;
  };
  this.e = function () {
    return this.b("");
  };
  this.r = function (k, l, h) {
    l = this.s(k, l, h);
    k <= this.c && (this.c += l);
    k <= this.d && (this.d += l);
  };
  this.u = function () {
    var k = "";
    this.t() && (k = this.j.slice(this.c, this.d));
    return k;
  };
  this.v = function () {
    return this.j.slice(0, this.a);
  };
}

function stem() {
  function k() {
    for (var b; ; ) {
      var c = a.a - a.cursor;
      a: if (((a.d = a.cursor), (b = a.h(d)), 0 != b)) {
        a.c = a.cursor;
        switch (b) {
          case 1:
            if (!a.b("\u03b1")) return;
            break;
          case 2:
            if (!a.b("\u03b2")) return;
            break;
          case 3:
            if (!a.b("\u03b3")) return;
            break;
          case 4:
            if (!a.b("\u03b4")) return;
            break;
          case 5:
            if (!a.b("\u03b5")) return;
            break;
          case 6:
            if (!a.b("\u03b6")) return;
            break;
          case 7:
            if (!a.b("\u03b7")) return;
            break;
          case 8:
            if (!a.b("\u03b8")) return;
            break;
          case 9:
            if (!a.b("\u03b9")) return;
            break;
          case 10:
            if (!a.b("\u03ba")) return;
            break;
          case 11:
            if (!a.b("\u03bb")) return;
            break;
          case 12:
            if (!a.b("\u03bc")) return;
            break;
          case 13:
            if (!a.b("\u03bd")) return;
            break;
          case 14:
            if (!a.b("\u03be")) return;
            break;
          case 15:
            if (!a.b("\u03bf")) return;
            break;
          case 16:
            if (!a.b("\u03c0")) return;
            break;
          case 17:
            if (!a.b("\u03c1")) return;
            break;
          case 18:
            if (!a.b("\u03c3")) return;
            break;
          case 19:
            if (!a.b("\u03c4")) return;
            break;
          case 20:
            if (!a.b("\u03c5")) return;
            break;
          case 21:
            if (!a.b("\u03c6")) return;
            break;
          case 22:
            if (!a.b("\u03c7")) return;
            break;
          case 23:
            if (!a.b("\u03c8")) return;
            break;
          case 24:
            if (!a.b("\u03c9")) return;
            break;
          case 25:
            if (a.cursor <= a.f) break a;
            a.cursor--;
        }
        continue;
      }
      a.cursor = a.a - c;
      break;
    }
  }
  function l() {
    var b;
    a.d = a.cursor;
    b = a.h(n);
    if (0 != b) {
      a.c = a.cursor;
      switch (b) {
        case 1:
          if (!a.b("\u03c6\u03b1")) return;
          break;
        case 2:
          if (!a.b("\u03c3\u03ba\u03b1")) return;
          break;
        case 3:
          if (!a.b("\u03bf\u03bb\u03bf")) return;
          break;
        case 4:
          if (!a.b("\u03c3\u03bf")) return;
          break;
        case 5:
          if (!a.b("\u03c4\u03b1\u03c4\u03bf")) return;
          break;
        case 6:
          if (!a.b("\u03ba\u03c1\u03b5")) return;
          break;
        case 7:
          if (!a.b("\u03c0\u03b5\u03c1")) return;
          break;
        case 8:
          if (!a.b("\u03c4\u03b5\u03c1")) return;
          break;
        case 9:
          if (!a.b("\u03c6\u03c9")) return;
          break;
        case 10:
          if (!a.b("\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4")) return;
          break;
        case 11:
          if (!a.b("\u03b3\u03b5\u03b3\u03bf\u03bd")) return;
      }
      B = p;
    }
  }
  function h() {
    var b = a.a - a.cursor;
    a.d = a.cursor;
    if (0 != a.h(ca)) {
      a.c = a.cursor;
      if (!a.e()) return;
      B = p;
      a.d = a.cursor;
      a.c = a.cursor;
      if (0 != a.h(ba) && !(a.cursor > a.f) && !a.b("\u03b1\u03b3\u03b1\u03bd")) return;
    }
    a.cursor = a.a - b;
    a.d = a.cursor;
    if (a.g("\u03b1\u03bd\u03b5") && ((a.c = a.cursor), a.e())) {
      B = p;
      a: {
        b = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (a.n(ha, 945, 969)) {
          if (!a.b("\u03b1\u03bd")) return;
          break a;
        }
        a.cursor = a.a - b;
        a.d = a.cursor;
      }
      a.c = a.cursor;
      0 == a.h(F) || a.cursor > a.f || a.b("\u03b1\u03bd");
    }
  }
  function c() {
    var b = a.a - a.cursor;
    a.d = a.cursor;
    if (0 != a.h(W)) {
      a.c = a.cursor;
      if (!a.e()) return;
      B = p;
    }
    a.cursor = a.a - b;
    a.d = a.cursor;
    if (a.g("\u03b5\u03c4\u03b5") && ((a.c = a.cursor), a.e())) {
      B = p;
      a: {
        b = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (a.n(ha, 945, 969)) {
          if (!a.b("\u03b5\u03c4")) return;
          break a;
        }
        a.cursor = a.a - b;
        a.d = a.cursor;
        a.c = a.cursor;
        if (0 != a.h(da)) {
          if (!a.b("\u03b5\u03c4")) return;
          break a;
        }
        a.cursor = a.a - b;
        a.d = a.cursor;
      }
      a.c = a.cursor;
      0 == a.h(ea) || a.cursor > a.f || a.b("\u03b5\u03c4");
    }
  }
  var a = new C(),
    d = [
      ["", -1, 25],
      ["\u0386", 0, 1],
      ["\u0388", 0, 5],
      ["\u0389", 0, 7],
      ["\u038a", 0, 9],
      ["\u038c", 0, 15],
      ["\u038e", 0, 20],
      ["\u038f", 0, 24],
      ["\u0390", 0, 7],
      ["\u0391", 0, 1],
      ["\u0392", 0, 2],
      ["\u0393", 0, 3],
      ["\u0394", 0, 4],
      ["\u0395", 0, 5],
      ["\u0396", 0, 6],
      ["\u0397", 0, 7],
      ["\u0398", 0, 8],
      ["\u0399", 0, 9],
      ["\u039a", 0, 10],
      ["\u039b", 0, 11],
      ["\u039c", 0, 12],
      ["\u039d", 0, 13],
      ["\u039e", 0, 14],
      ["\u039f", 0, 15],
      ["\u03a0", 0, 16],
      ["\u03a1", 0, 17],
      ["\u03a3", 0, 18],
      ["\u03a4", 0, 19],
      ["\u03a5", 0, 20],
      ["\u03a6", 0, 21],
      ["\u03a7", 0, 22],
      ["\u03a8", 0, 23],
      ["\u03a9", 0, 24],
      ["\u03aa", 0, 9],
      ["\u03ab", 0, 20],
      ["\u03ac", 0, 1],
      ["\u03ad", 0, 5],
      ["\u03ae", 0, 7],
      ["\u03af", 0, 9],
      ["\u03b0", 0, 20],
      ["\u03c2", 0, 18],
      ["\u03ca", 0, 7],
      ["\u03cb", 0, 20],
      ["\u03cc", 0, 15],
      ["\u03cd", 0, 20],
      ["\u03ce", 0, 24],
    ],
    n = [
      ["\u03c3\u03ba\u03b1\u03b3\u03b9\u03b1", -1, 2],
      ["\u03c6\u03b1\u03b3\u03b9\u03b1", -1, 1],
      ["\u03bf\u03bb\u03bf\u03b3\u03b9\u03b1", -1, 3],
      ["\u03c3\u03bf\u03b3\u03b9\u03b1", -1, 4],
      ["\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03b1", -1, 5],
      ["\u03ba\u03c1\u03b5\u03b1\u03c4\u03b1", -1, 6],
      ["\u03c0\u03b5\u03c1\u03b1\u03c4\u03b1", -1, 7],
      ["\u03c4\u03b5\u03c1\u03b1\u03c4\u03b1", -1, 8],
      ["\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03b1", -1, 11],
      ["\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03b1", -1, 10],
      ["\u03c6\u03c9\u03c4\u03b1", -1, 9],
      ["\u03c0\u03b5\u03c1\u03b1\u03c4\u03b7", -1, 7],
      ["\u03c3\u03ba\u03b1\u03b3\u03b9\u03c9\u03bd", -1, 2],
      ["\u03c6\u03b1\u03b3\u03b9\u03c9\u03bd", -1, 1],
      ["\u03bf\u03bb\u03bf\u03b3\u03b9\u03c9\u03bd", -1, 3],
      ["\u03c3\u03bf\u03b3\u03b9\u03c9\u03bd", -1, 4],
      ["\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03c9\u03bd", -1, 5],
      ["\u03ba\u03c1\u03b5\u03b1\u03c4\u03c9\u03bd", -1, 6],
      ["\u03c0\u03b5\u03c1\u03b1\u03c4\u03c9\u03bd", -1, 7],
      ["\u03c4\u03b5\u03c1\u03b1\u03c4\u03c9\u03bd", -1, 8],
      ["\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03c9\u03bd", -1, 11],
      ["\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03c9\u03bd", -1, 10],
      ["\u03c6\u03c9\u03c4\u03c9\u03bd", -1, 9],
      ["\u03ba\u03c1\u03b5\u03b1\u03c3", -1, 6],
      ["\u03c0\u03b5\u03c1\u03b1\u03c3", -1, 7],
      ["\u03c4\u03b5\u03c1\u03b1\u03c3", -1, 8],
      ["\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c3", -1, 11],
      ["\u03ba\u03c1\u03b5\u03b1\u03c4\u03bf\u03c3", -1, 6],
      ["\u03c0\u03b5\u03c1\u03b1\u03c4\u03bf\u03c3", -1, 7],
      ["\u03c4\u03b5\u03c1\u03b1\u03c4\u03bf\u03c3", -1, 8],
      ["\u03b3\u03b5\u03b3\u03bf\u03bd\u03bf\u03c4\u03bf\u03c3", -1, 11],
      ["\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c4\u03bf\u03c3", -1, 10],
      ["\u03c6\u03c9\u03c4\u03bf\u03c3", -1, 9],
      ["\u03ba\u03b1\u03b8\u03b5\u03c3\u03c4\u03c9\u03c3", -1, 10],
      ["\u03c6\u03c9\u03c3", -1, 9],
      ["\u03c3\u03ba\u03b1\u03b3\u03b9\u03bf\u03c5", -1, 2],
      ["\u03c6\u03b1\u03b3\u03b9\u03bf\u03c5", -1, 1],
      ["\u03bf\u03bb\u03bf\u03b3\u03b9\u03bf\u03c5", -1, 3],
      ["\u03c3\u03bf\u03b3\u03b9\u03bf\u03c5", -1, 4],
      ["\u03c4\u03b1\u03c4\u03bf\u03b3\u03b9\u03bf\u03c5", -1, 5],
    ],
    v = [
      ["\u03c0\u03b1", -1, 1],
      ["\u03be\u03b1\u03bd\u03b1\u03c0\u03b1", 0, 1],
      ["\u03b5\u03c0\u03b1", 0, 1],
      ["\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1", 0, 1],
      ["\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1", 0, 1],
      ["\u03b5\u03bc\u03c0\u03b1", 0, 1],
      ["\u03b2", -1, 2],
      ["\u03b4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b2\u03b1\u03b8\u03c5\u03c1\u03b9", -1, 2],
      ["\u03b2\u03b1\u03c1\u03ba", -1, 2],
      ["\u03bc\u03b1\u03c1\u03ba", -1, 2],
      ["\u03bb", -1, 2],
      ["\u03bc", -1, 2],
      ["\u03ba\u03bf\u03c1\u03bd", -1, 2],
      ["\u03b1\u03b8\u03c1\u03bf", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf", 14, 1],
      ["\u03c0", -1, 2],
      ["\u03b9\u03bc\u03c0", 16, 2],
      ["\u03c1", -1, 2],
      ["\u03bc\u03b1\u03c1", 18, 2],
      ["\u03b1\u03bc\u03c0\u03b1\u03c1", 18, 2],
      ["\u03b3\u03ba\u03c1", 18, 2],
      ["\u03b2\u03bf\u03bb\u03b2\u03bf\u03c1", 18, 2],
      ["\u03b3\u03bb\u03c5\u03ba\u03bf\u03c1", 18, 2],
      ["\u03c0\u03b9\u03c0\u03b5\u03c1\u03bf\u03c1", 18, 2],
      ["\u03c0\u03c1", 18, 2],
      ["\u03bc\u03c0\u03c1", 25, 2],
      ["\u03b1\u03c1\u03c1", 18, 2],
      ["\u03b3\u03bb\u03c5\u03ba\u03c5\u03c1", 18, 2],
      ["\u03c0\u03bf\u03bb\u03c5\u03c1", 18, 2],
      ["\u03bb\u03bf\u03c5", -1, 2],
    ],
    b = [
      ["\u03b9\u03b6\u03b1", -1, 1],
      ["\u03b9\u03b6\u03b5", -1, 1],
      ["\u03b9\u03b6\u03b1\u03bc\u03b5", -1, 1],
      ["\u03b9\u03b6\u03bf\u03c5\u03bc\u03b5", -1, 1],
      ["\u03b9\u03b6\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b9\u03b6\u03bf\u03c5\u03bd\u03b5", -1, 1],
      ["\u03b9\u03b6\u03b1\u03c4\u03b5", -1, 1],
      ["\u03b9\u03b6\u03b5\u03c4\u03b5", -1, 1],
      ["\u03b9\u03b6\u03b5\u03b9", -1, 1],
      ["\u03b9\u03b6\u03b1\u03bd", -1, 1],
      ["\u03b9\u03b6\u03bf\u03c5\u03bd", -1, 1],
      ["\u03b9\u03b6\u03b5\u03c3", -1, 1],
      ["\u03b9\u03b6\u03b5\u03b9\u03c3", -1, 1],
      ["\u03b9\u03b6\u03c9", -1, 1],
    ],
    f = [
      ["\u03b2\u03b9", -1, 1],
      ["\u03bb\u03b9", -1, 1],
      ["\u03b1\u03bb", -1, 1],
      ["\u03b5\u03bd", -1, 1],
      ["\u03c3", -1, 1],
      ["\u03c7", -1, 1],
      ["\u03c5\u03c8", -1, 1],
      ["\u03b6\u03c9", -1, 1],
    ],
    q = [
      ["\u03c9\u03b8\u03b7\u03ba\u03b1", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b5", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b1\u03bc\u03b5", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b1\u03bd\u03b5", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b1\u03c4\u03b5", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b1\u03bd", -1, 1],
      ["\u03c9\u03b8\u03b7\u03ba\u03b5\u03c3", -1, 1],
    ],
    t = [
      ["\u03be\u03b1\u03bd\u03b1\u03c0\u03b1", -1, 1],
      ["\u03b5\u03c0\u03b1", -1, 1],
      ["\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1", -1, 1],
      ["\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1", -1, 1],
      ["\u03b5\u03bc\u03c0\u03b1", -1, 1],
      ["\u03c7\u03b1\u03c1\u03c4\u03bf\u03c0\u03b1", -1, 1],
      ["\u03b5\u03be\u03b1\u03c1\u03c7\u03b1", -1, 1],
      ["\u03b3\u03b5", -1, 2],
      ["\u03b3\u03ba\u03b5", -1, 2],
      ["\u03ba\u03bb\u03b5", -1, 1],
      ["\u03b5\u03ba\u03bb\u03b5", 9, 1],
      ["\u03b1\u03c0\u03b5\u03ba\u03bb\u03b5", 10, 1],
      ["\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5", 9, 1],
      ["\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5", 9, 1],
      ["\u03b4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03c0\u03b5", -1, 1],
      ["\u03b5\u03c0\u03b5", 15, 1],
      ["\u03bc\u03b5\u03c4\u03b5\u03c0\u03b5", 16, 1],
      ["\u03b5\u03c3\u03b5", -1, 1],
      ["\u03b3\u03ba", -1, 2],
      ["\u03bc", -1, 2],
      ["\u03c0\u03bf\u03c5\u03ba\u03b1\u03bc", 20, 2],
      ["\u03ba\u03bf\u03bc", 20, 2],
      ["\u03b1\u03bd", -1, 2],
      ["\u03bf\u03bb\u03bf", -1, 2],
      ["\u03b1\u03b8\u03c1\u03bf", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf", 25, 1],
      ["\u03c0", -1, 2],
      ["\u03bb\u03b1\u03c1", -1, 2],
      ["\u03b4\u03b7\u03bc\u03bf\u03ba\u03c1\u03b1\u03c4", -1, 2],
      ["\u03b1\u03c6", -1, 2],
      ["\u03b3\u03b9\u03b3\u03b1\u03bd\u03c4\u03bf\u03b1\u03c6", 30, 2],
    ],
    s = [
      ["\u03b9\u03c3\u03b1", -1, 1],
      ["\u03b9\u03c3\u03b1\u03bc\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b1\u03c4\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b1\u03bd", -1, 1],
      ["\u03b9\u03c3\u03b5\u03c3", -1, 1],
    ],
    r = [
      ["\u03be\u03b1\u03bd\u03b1\u03c0\u03b1", -1, 1],
      ["\u03b5\u03c0\u03b1", -1, 1],
      ["\u03c0\u03b5\u03c1\u03b9\u03c0\u03b1", -1, 1],
      ["\u03b1\u03bd\u03b1\u03bc\u03c0\u03b1", -1, 1],
      ["\u03b5\u03bc\u03c0\u03b1", -1, 1],
      ["\u03c7\u03b1\u03c1\u03c4\u03bf\u03c0\u03b1", -1, 1],
      ["\u03b5\u03be\u03b1\u03c1\u03c7\u03b1", -1, 1],
      ["\u03ba\u03bb\u03b5", -1, 1],
      ["\u03b5\u03ba\u03bb\u03b5", 7, 1],
      ["\u03b1\u03c0\u03b5\u03ba\u03bb\u03b5", 8, 1],
      ["\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5", 7, 1],
      ["\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5", 7, 1],
      ["\u03b4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03c0\u03b5", -1, 1],
      ["\u03b5\u03c0\u03b5", 13, 1],
      ["\u03bc\u03b5\u03c4\u03b5\u03c0\u03b5", 14, 1],
      ["\u03b5\u03c3\u03b5", -1, 1],
      ["\u03b1\u03b8\u03c1\u03bf", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf", 17, 1],
    ],
    m = [
      ["\u03b9\u03c3\u03bf\u03c5\u03bc\u03b5", -1, 1],
      ["\u03b9\u03c3\u03bf\u03c5\u03bd\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b5\u03c4\u03b5", -1, 1],
      ["\u03b9\u03c3\u03b5\u03b9", -1, 1],
      ["\u03b9\u03c3\u03bf\u03c5\u03bd", -1, 1],
      ["\u03b9\u03c3\u03b5\u03b9\u03c3", -1, 1],
      ["\u03b9\u03c3\u03c9", -1, 1],
    ],
    w = [
      ["\u03b1\u03c4\u03b1", -1, 2],
      ["\u03c6\u03b1", -1, 2],
      ["\u03b7\u03c6\u03b1", 1, 2],
      ["\u03bc\u03b5\u03b3", -1, 2],
      ["\u03bb\u03c5\u03b3", -1, 2],
      ["\u03b7\u03b4", -1, 2],
      ["\u03ba\u03bb\u03b5", -1, 1],
      ["\u03b5\u03c3\u03c9\u03ba\u03bb\u03b5", 6, 1],
      ["\u03c0\u03bb\u03b5", -1, 1],
      ["\u03b4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03c3\u03b5", -1, 1],
      ["\u03b1\u03c3\u03b5", 10, 1],
      ["\u03ba\u03b1\u03b8", -1, 2],
      ["\u03b5\u03c7\u03b8", -1, 2],
      ["\u03ba\u03b1\u03ba", -1, 2],
      ["\u03bc\u03b1\u03ba", -1, 2],
      ["\u03c3\u03ba", -1, 2],
      ["\u03c6\u03b9\u03bb", -1, 2],
      ["\u03ba\u03c5\u03bb", -1, 2],
      ["\u03bc", -1, 2],
      ["\u03b3\u03b5\u03bc", 19, 2],
      ["\u03b1\u03c7\u03bd", -1, 2],
      ["\u03c3\u03c5\u03bd\u03b1\u03b8\u03c1\u03bf", -1, 1],
      ["\u03c0", -1, 2],
      ["\u03b1\u03c0", 23, 2],
      ["\u03b5\u03bc\u03c0", 23, 2],
      ["\u03b5\u03c5\u03c0", 23, 2],
      ["\u03b1\u03c1", -1, 2],
      ["\u03b1\u03bf\u03c1", -1, 2],
      ["\u03b3\u03c5\u03c1", -1, 2],
      ["\u03c7\u03c1", -1, 2],
      ["\u03c7\u03c9\u03c1", -1, 2],
      ["\u03ba\u03c4", -1, 2],
      ["\u03b1\u03ba\u03c4", 32, 2],
      ["\u03c7\u03c4", -1, 2],
      ["\u03b1\u03c7\u03c4", 34, 2],
      ["\u03c4\u03b1\u03c7", -1, 2],
      ["\u03c3\u03c7", -1, 2],
      ["\u03b1\u03c3\u03c7", 37, 2],
      ["\u03c5\u03c8", -1, 2],
    ],
    u = [
      ["\u03b9\u03c3\u03c4\u03b1", -1, 1],
      ["\u03b9\u03c3\u03c4\u03b5", -1, 1],
      ["\u03b9\u03c3\u03c4\u03b7", -1, 1],
      ["\u03b9\u03c3\u03c4\u03bf\u03b9", -1, 1],
      ["\u03b9\u03c3\u03c4\u03c9\u03bd", -1, 1],
      ["\u03b9\u03c3\u03c4\u03bf", -1, 1],
      ["\u03b9\u03c3\u03c4\u03b5\u03c3", -1, 1],
      ["\u03b9\u03c3\u03c4\u03b7\u03c3", -1, 1],
      ["\u03b9\u03c3\u03c4\u03bf\u03c3", -1, 1],
      ["\u03b9\u03c3\u03c4\u03bf\u03c5\u03c3", -1, 1],
      ["\u03b9\u03c3\u03c4\u03bf\u03c5", -1, 1],
    ],
    y = [
      ["\u03b5\u03b3\u03ba\u03bb\u03b5", -1, 1],
      ["\u03b1\u03c0\u03bf\u03ba\u03bb\u03b5", -1, 1],
      ["\u03b4\u03b1\u03bd\u03b5", -1, 2],
      ["\u03b1\u03bd\u03c4\u03b9\u03b4\u03b1\u03bd\u03b5", 2, 2],
      ["\u03c3\u03b5", -1, 1],
      ["\u03bc\u03b5\u03c4\u03b1\u03c3\u03b5", 4, 1],
      ["\u03bc\u03b9\u03ba\u03c1\u03bf\u03c3\u03b5", 4, 1],
    ],
    z = [
      ["\u03b1\u03c4\u03bf\u03bc\u03b9\u03ba", -1, 2],
      ["\u03b5\u03b8\u03bd\u03b9\u03ba", -1, 4],
      ["\u03c4\u03bf\u03c0\u03b9\u03ba", -1, 7],
      ["\u03b5\u03ba\u03bb\u03b5\u03ba\u03c4\u03b9\u03ba", -1, 5],
      ["\u03c3\u03ba\u03b5\u03c0\u03c4\u03b9\u03ba", -1, 6],
      ["\u03b3\u03bd\u03c9\u03c3\u03c4\u03b9\u03ba", -1, 3],
      ["\u03b1\u03b3\u03bd\u03c9\u03c3\u03c4\u03b9\u03ba", 5, 1],
      ["\u03b1\u03bb\u03b5\u03be\u03b1\u03bd\u03b4\u03c1\u03b9\u03bd", -1, 8],
      ["\u03b8\u03b5\u03b1\u03c4\u03c1\u03b9\u03bd", -1, 10],
      ["\u03b2\u03c5\u03b6\u03b1\u03bd\u03c4\u03b9\u03bd", -1, 9],
    ],
    e = [
      ["\u03b9\u03c3\u03bc\u03bf\u03b9", -1, 1],
      ["\u03b9\u03c3\u03bc\u03c9\u03bd", -1, 1],
      ["\u03b9\u03c3\u03bc\u03bf", -1, 1],
      ["\u03b9\u03c3\u03bc\u03bf\u03c3", -1, 1],
      ["\u03b9\u03c3\u03bc\u03bf\u03c5\u03c3", -1, 1],
      ["\u03b9\u03c3\u03bc\u03bf\u03c5", -1, 1],
    ],
    A = [
      ["\u03c3", -1, 1],
      ["\u03c7", -1, 1],
    ],
    H = [
      ["\u03bf\u03c5\u03b4\u03b1\u03ba\u03b9\u03b1", -1, 1],
      ["\u03b1\u03c1\u03b1\u03ba\u03b9\u03b1", -1, 1],
      ["\u03bf\u03c5\u03b4\u03b1\u03ba\u03b9", -1, 1],
      ["\u03b1\u03c1\u03b1\u03ba\u03b9", -1, 1],
    ],
    G = [
      ["\u03b2", -1, 2],
      ["\u03b2\u03b1\u03bc\u03b2", 0, 1],
      ["\u03c3\u03bb\u03bf\u03b2", 0, 1],
      ["\u03c4\u03c3\u03b5\u03c7\u03bf\u03c3\u03bb\u03bf\u03b2", 2, 1],
      ["\u03ba\u03b1\u03c1\u03b4", -1, 2],
      ["\u03b6", -1, 2],
      ["\u03c4\u03b6", 5, 1],
      ["\u03ba", -1, 1],
      ["\u03ba\u03b1\u03c0\u03b1\u03ba", 7, 1],
      ["\u03c3\u03bf\u03ba", 7, 1],
      ["\u03c3\u03ba", 7, 1],
      ["\u03b2\u03b1\u03bb", -1, 2],
      ["\u03bc\u03b1\u03bb", -1, 1],
      ["\u03b3\u03bb", -1, 2],
      ["\u03c4\u03c1\u03b9\u03c0\u03bf\u03bb", -1, 2],
      ["\u03c0\u03bb", -1, 1],
      ["\u03bb\u03bf\u03c5\u03bb", -1, 1],
      ["\u03c6\u03c5\u03bb", -1, 1],
      ["\u03ba\u03b1\u03b9\u03bc", -1, 1],
      ["\u03ba\u03bb\u03b9\u03bc", -1, 1],
      ["\u03c6\u03b1\u03c1\u03bc", -1, 1],
      ["\u03b3\u03b9\u03b1\u03bd", -1, 2],
      ["\u03c3\u03c0\u03b1\u03bd", -1, 1],
      ["\u03b7\u03b3\u03bf\u03c5\u03bc\u03b5\u03bd", -1, 2],
      ["\u03ba\u03bf\u03bd", -1, 1],
      ["\u03bc\u03b1\u03ba\u03c1\u03c5\u03bd", -1, 2],
      ["\u03c0", -1, 2],
      ["\u03ba\u03b1\u03c4\u03c1\u03b1\u03c0", 26, 1],
      ["\u03c1", -1, 1],
      ["\u03b2\u03c1", 28, 1],
      ["\u03bb\u03b1\u03b2\u03c1", 29, 1],
      ["\u03b1\u03bc\u03b2\u03c1", 29, 1],
      ["\u03bc\u03b5\u03c1", 28, 1],
      ["\u03c0\u03b1\u03c4\u03b5\u03c1", 28, 2],
      ["\u03b1\u03bd\u03b8\u03c1", 28, 1],
      ["\u03ba\u03bf\u03c1", 28, 1],
      ["\u03c3", -1, 1],
      ["\u03bd\u03b1\u03b3\u03ba\u03b1\u03c3", 36, 1],
      ["\u03c4\u03bf\u03c3", 36, 2],
      ["\u03bc\u03bf\u03c5\u03c3\u03c4", -1, 1],
      ["\u03c1\u03c5", -1, 1],
      ["\u03c6", -1, 1],
      ["\u03c3\u03c6", 41, 1],
      ["\u03b1\u03bb\u03b9\u03c3\u03c6", 42, 1],
      ["\u03bd\u03c5\u03c6", 41, 2],
      ["\u03c7", -1, 1],
    ],
    E = [
      ["\u03b1\u03ba\u03b9\u03b1", -1, 1],
      ["\u03b1\u03c1\u03b1\u03ba\u03b9\u03b1", 0, 1],
      ["\u03b9\u03c4\u03c3\u03b1", -1, 1],
      ["\u03b1\u03ba\u03b9", -1, 1],
      ["\u03b1\u03c1\u03b1\u03ba\u03b9", 3, 1],
      ["\u03b9\u03c4\u03c3\u03c9\u03bd", -1, 1],
      ["\u03b9\u03c4\u03c3\u03b1\u03c3", -1, 1],
      ["\u03b9\u03c4\u03c3\u03b5\u03c3", -1, 1],
    ],
    x = [
      ["\u03c8\u03b1\u03bb", -1, 1],
      ["\u03b1\u03b9\u03c6\u03bd", -1, 1],
      ["\u03bf\u03bb\u03bf", -1, 1],
      ["\u03b9\u03c1", -1, 1],
    ],
    O = [
      ["\u03b5", -1, 1],
      ["\u03c0\u03b1\u03b9\u03c7\u03bd", -1, 1],
    ],
    N = [
      ["\u03b9\u03b4\u03b9\u03b1", -1, 1],
      ["\u03b9\u03b4\u03b9\u03c9\u03bd", -1, 1],
      ["\u03b9\u03b4\u03b9\u03bf", -1, 1],
    ],
    M = [
      ["\u03b9\u03b2", -1, 1],
      ["\u03b4", -1, 1],
      ["\u03c6\u03c1\u03b1\u03b3\u03ba", -1, 1],
      ["\u03bb\u03c5\u03ba", -1, 1],
      ["\u03bf\u03b2\u03b5\u03bb", -1, 1],
      ["\u03bc\u03b7\u03bd", -1, 1],
      ["\u03c1", -1, 1],
    ],
    P = [
      ["\u03b9\u03c3\u03ba\u03b5", -1, 1],
      ["\u03b9\u03c3\u03ba\u03bf", -1, 1],
      ["\u03b9\u03c3\u03ba\u03bf\u03c3", -1, 1],
      ["\u03b9\u03c3\u03ba\u03bf\u03c5", -1, 1],
    ],
    Q = [
      ["\u03b1\u03b4\u03c9\u03bd", -1, 1],
      ["\u03b1\u03b4\u03b5\u03c3", -1, 1],
    ],
    T = [
      ["\u03b3\u03b9\u03b1\u03b3\u03b9", -1, -1],
      ["\u03b8\u03b5\u03b9", -1, -1],
      ["\u03bf\u03ba", -1, -1],
      ["\u03bc\u03b1\u03bc", -1, -1],
      ["\u03bc\u03b1\u03bd", -1, -1],
      ["\u03bc\u03c0\u03b1\u03bc\u03c0", -1, -1],
      ["\u03c0\u03b5\u03b8\u03b5\u03c1", -1, -1],
      ["\u03c0\u03b1\u03c4\u03b5\u03c1", -1, -1],
      ["\u03ba\u03c5\u03c1", -1, -1],
      ["\u03bd\u03c4\u03b1\u03bd\u03c4", -1, -1],
    ],
    U = [
      ["\u03b5\u03b4\u03c9\u03bd", -1, 1],
      ["\u03b5\u03b4\u03b5\u03c3", -1, 1],
    ],
    R = [
      ["\u03bc\u03b9\u03bb", -1, 1],
      ["\u03b4\u03b1\u03c0", -1, 1],
      ["\u03b3\u03b7\u03c0", -1, 1],
      ["\u03b9\u03c0", -1, 1],
      ["\u03b5\u03bc\u03c0", -1, 1],
      ["\u03bf\u03c0", -1, 1],
      ["\u03ba\u03c1\u03b1\u03c3\u03c0", -1, 1],
      ["\u03c5\u03c0", -1, 1],
    ],
    S = [
      ["\u03bf\u03c5\u03b4\u03c9\u03bd", -1, 1],
      ["\u03bf\u03c5\u03b4\u03b5\u03c3", -1, 1],
    ],
    V = [
      ["\u03c4\u03c1\u03b1\u03b3", -1, 1],
      ["\u03c6\u03b5", -1, 1],
      ["\u03ba\u03b1\u03bb\u03b9\u03b1\u03ba", -1, 1],
      ["\u03b1\u03c1\u03ba", -1, 1],
      ["\u03c3\u03ba", -1, 1],
      ["\u03c0\u03b5\u03c4\u03b1\u03bb", -1, 1],
      ["\u03b2\u03b5\u03bb", -1, 1],
      ["\u03bb\u03bf\u03c5\u03bb", -1, 1],
      ["\u03c6\u03bb", -1, 1],
      ["\u03c7\u03bd", -1, 1],
      ["\u03c0\u03bb\u03b5\u03be", -1, 1],
      ["\u03c3\u03c0", -1, 1],
      ["\u03c6\u03c1", -1, 1],
      ["\u03c3", -1, 1],
      ["\u03bb\u03b9\u03c7", -1, 1],
    ],
    I = [
      ["\u03b5\u03c9\u03bd", -1, 1],
      ["\u03b5\u03c9\u03c3", -1, 1],
    ],
    D = [
      ["\u03b4", -1, 1],
      ["\u03b9\u03b4", 0, 1],
      ["\u03b8", -1, 1],
      ["\u03b3\u03b1\u03bb", -1, 1],
      ["\u03b5\u03bb", -1, 1],
      ["\u03bd", -1, 1],
      ["\u03c0", -1, 1],
      ["\u03c0\u03b1\u03c1", -1, 1],
    ],
    L = [
      ["\u03b9\u03b1", -1, 1],
      ["\u03b9\u03c9\u03bd", -1, 1],
      ["\u03b9\u03bf\u03c5", -1, 1],
    ],
    J = [
      ["\u03b9\u03ba\u03b1", -1, 1],
      ["\u03b9\u03ba\u03c9\u03bd", -1, 1],
      ["\u03b9\u03ba\u03bf", -1, 1],
      ["\u03b9\u03ba\u03bf\u03c5", -1, 1],
    ],
    K = [
      ["\u03b1\u03b4", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b1\u03b4", 0, 1],
      ["\u03ba\u03b1\u03c4\u03b1\u03b4", 0, 1],
      ["\u03b1\u03bd\u03c4\u03b9\u03b4", -1, 1],
      ["\u03b5\u03bd\u03b4", -1, 1],
      ["\u03c6\u03c5\u03bb\u03bf\u03b4", -1, 1],
      ["\u03c5\u03c0\u03bf\u03b4", -1, 1],
      ["\u03c0\u03c1\u03c9\u03c4\u03bf\u03b4", -1, 1],
      ["\u03b5\u03be\u03c9\u03b4", -1, 1],
      ["\u03b7\u03b8", -1, 1],
      ["\u03b1\u03bd\u03b7\u03b8", 9, 1],
      ["\u03be\u03b9\u03ba", -1, 1],
      ["\u03b1\u03bb", -1, 1],
      ["\u03b1\u03bc\u03bc\u03bf\u03c7\u03b1\u03bb", 12, 1],
      ["\u03c3\u03c5\u03bd\u03bf\u03bc\u03b7\u03bb", -1, 1],
      ["\u03bc\u03c0\u03bf\u03bb", -1, 1],
      ["\u03bc\u03bf\u03c5\u03bb", -1, 1],
      ["\u03c4\u03c3\u03b1\u03bc", -1, 1],
      ["\u03b2\u03c1\u03c9\u03bc", -1, 1],
      ["\u03b1\u03bc\u03b1\u03bd", -1, 1],
      ["\u03bc\u03c0\u03b1\u03bd", -1, 1],
      ["\u03ba\u03b1\u03bb\u03bb\u03b9\u03bd", -1, 1],
      ["\u03c0\u03bf\u03c3\u03c4\u03b5\u03bb\u03bd", -1, 1],
      ["\u03c6\u03b9\u03bb\u03bf\u03bd", -1, 1],
      ["\u03ba\u03b1\u03bb\u03c0", -1, 1],
      ["\u03b3\u03b5\u03c1", -1, 1],
      ["\u03c7\u03b1\u03c3", -1, 1],
      ["\u03bc\u03c0\u03bf\u03c3", -1, 1],
      ["\u03c0\u03bb\u03b9\u03b1\u03c4\u03c3", -1, 1],
      ["\u03c0\u03b5\u03c4\u03c3", -1, 1],
      ["\u03c0\u03b9\u03c4\u03c3", -1, 1],
      ["\u03c6\u03c5\u03c3", -1, 1],
      ["\u03bc\u03c0\u03b1\u03b3\u03b9\u03b1\u03c4", -1, 1],
      ["\u03bd\u03b9\u03c4", -1, 1],
      ["\u03c0\u03b9\u03ba\u03b1\u03bd\u03c4", -1, 1],
      ["\u03c3\u03b5\u03c1\u03c4", -1, 1],
    ],
    $ = [
      ["\u03b1\u03b3\u03b1\u03bc\u03b5", -1, 1],
      ["\u03b7\u03ba\u03b1\u03bc\u03b5", -1, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b1\u03bc\u03b5", 1, 1],
      ["\u03b7\u03c3\u03b1\u03bc\u03b5", -1, 1],
      ["\u03bf\u03c5\u03c3\u03b1\u03bc\u03b5", -1, 1],
    ],
    aa = [
      ["\u03b2\u03bf\u03c5\u03b2", -1, 1],
      ["\u03be\u03b5\u03b8", -1, 1],
      ["\u03c0\u03b5\u03b8", -1, 1],
      ["\u03b1\u03c0\u03bf\u03b8", -1, 1],
      ["\u03b1\u03c0\u03bf\u03ba", -1, 1],
      ["\u03bf\u03c5\u03bb", -1, 1],
      ["\u03b1\u03bd\u03b1\u03c0", -1, 1],
      ["\u03c0\u03b9\u03ba\u03c1", -1, 1],
      ["\u03c0\u03bf\u03c4", -1, 1],
      ["\u03b1\u03c0\u03bf\u03c3\u03c4", -1, 1],
      ["\u03c7", -1, 1],
      ["\u03c3\u03b9\u03c7", 10, 1],
    ],
    ba = [
      ["\u03c4\u03c1", -1, 1],
      ["\u03c4\u03c3", -1, 1],
    ],
    ca = [
      ["\u03b1\u03b3\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b7\u03ba\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b1\u03bd\u03b5", 1, 1],
      ["\u03b7\u03c3\u03b1\u03bd\u03b5", -1, 1],
      ["\u03bf\u03c5\u03c3\u03b1\u03bd\u03b5", -1, 1],
      ["\u03bf\u03bd\u03c4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b9\u03bf\u03bd\u03c4\u03b1\u03bd\u03b5", 5, 1],
      ["\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd\u03b5", 7, 1],
      ["\u03bf\u03c4\u03b1\u03bd\u03b5", -1, 1],
      ["\u03b9\u03bf\u03c4\u03b1\u03bd\u03b5", 9, 1],
    ],
    F = [
      ["\u03c4\u03b1\u03b2", -1, 1],
      ["\u03bd\u03c4\u03b1\u03b2", 0, 1],
      ["\u03c8\u03b7\u03bb\u03bf\u03c4\u03b1\u03b2", 0, 1],
      ["\u03bb\u03b9\u03b2", -1, 1],
      ["\u03ba\u03bb\u03b9\u03b2", 3, 1],
      ["\u03be\u03b7\u03c1\u03bf\u03ba\u03bb\u03b9\u03b2", 4, 1],
      ["\u03b3", -1, 1],
      ["\u03b1\u03b3", 6, 1],
      ["\u03c4\u03c1\u03b1\u03b3", 7, 1],
      ["\u03c4\u03c3\u03b1\u03b3", 7, 1],
      ["\u03b1\u03b8\u03b9\u03b3\u03b3", 6, 1],
      ["\u03c4\u03c3\u03b9\u03b3\u03b3", 6, 1],
      ["\u03b1\u03c4\u03c3\u03b9\u03b3\u03b3", 11, 1],
      ["\u03c3\u03c4\u03b5\u03b3", 6, 1],
      ["\u03b1\u03c0\u03b7\u03b3", 6, 1],
      ["\u03c3\u03b9\u03b3", 6, 1],
      ["\u03b1\u03bd\u03bf\u03c1\u03b3", 6, 1],
      ["\u03b5\u03bd\u03bf\u03c1\u03b3", 6, 1],
      ["\u03ba\u03b1\u03bb\u03c0\u03bf\u03c5\u03b6", -1, 1],
      ["\u03b8", -1, 1],
      ["\u03bc\u03c9\u03b1\u03bc\u03b5\u03b8", 19, 1],
      ["\u03c0\u03b9\u03b8", 19, 1],
      ["\u03b1\u03c0\u03b9\u03b8", 21, 1],
      ["\u03b4\u03b5\u03ba", -1, 1],
      ["\u03c0\u03b5\u03bb\u03b5\u03ba", -1, 1],
      ["\u03b9\u03ba", -1, 1],
      ["\u03b1\u03bd\u03b9\u03ba", 25, 1],
      ["\u03b2\u03bf\u03c5\u03bb\u03ba", -1, 1],
      ["\u03b2\u03b1\u03c3\u03ba", -1, 1],
      ["\u03b2\u03c1\u03b1\u03c7\u03c5\u03ba", -1, 1],
      ["\u03b3\u03b1\u03bb", -1, 1],
      ["\u03ba\u03b1\u03c4\u03b1\u03b3\u03b1\u03bb", 30, 1],
      ["\u03bf\u03bb\u03bf\u03b3\u03b1\u03bb", 30, 1],
      ["\u03b2\u03b1\u03b8\u03c5\u03b3\u03b1\u03bb", 30, 1],
      ["\u03bc\u03b5\u03bb", -1, 1],
      ["\u03ba\u03b1\u03c3\u03c4\u03b5\u03bb", -1, 1],
      ["\u03c0\u03bf\u03c1\u03c4\u03bf\u03bb", -1, 1],
      ["\u03c0\u03bb", -1, 1],
      ["\u03b4\u03b9\u03c0\u03bb", 37, 1],
      ["\u03bb\u03b1\u03bf\u03c0\u03bb", 37, 1],
      ["\u03c8\u03c5\u03c7\u03bf\u03c0\u03bb", 37, 1],
      ["\u03bf\u03c5\u03bb", -1, 1],
      ["\u03bc", -1, 1],
      ["\u03bf\u03bb\u03b9\u03b3\u03bf\u03b4\u03b1\u03bc", 42, 1],
      ["\u03bc\u03bf\u03c5\u03c3\u03bf\u03c5\u03bb\u03bc", 42, 1],
      ["\u03b4\u03c1\u03b1\u03b4\u03bf\u03c5\u03bc", 42, 1],
      ["\u03b2\u03c1\u03b1\u03c7\u03bc", 42, 1],
      ["\u03bd", -1, 1],
      ["\u03b1\u03bc\u03b5\u03c1\u03b9\u03ba\u03b1\u03bd", 47, 1],
      ["\u03c0", -1, 1],
      ["\u03b1\u03b4\u03b1\u03c0", 49, 1],
      ["\u03c7\u03b1\u03bc\u03b7\u03bb\u03bf\u03b4\u03b1\u03c0", 49, 1],
      ["\u03c0\u03bf\u03bb\u03c5\u03b4\u03b1\u03c0", 49, 1],
      ["\u03ba\u03bf\u03c0", 49, 1],
      ["\u03c5\u03c0\u03bf\u03ba\u03bf\u03c0", 53, 1],
      ["\u03c4\u03c3\u03bf\u03c0", 49, 1],
      ["\u03c3\u03c0", 49, 1],
      ["\u03b5\u03c1", -1, 1],
      ["\u03b3\u03b5\u03c1", 57, 1],
      ["\u03b2\u03b5\u03c4\u03b5\u03c1", 57, 1],
      ["\u03bb\u03bf\u03c5\u03b8\u03b7\u03c1", -1, 1],
      ["\u03ba\u03bf\u03c1\u03bc\u03bf\u03c1", -1, 1],
      ["\u03c0\u03b5\u03c1\u03b9\u03c4\u03c1", -1, 1],
      ["\u03bf\u03c5\u03c1", -1, 1],
      ["\u03c3", -1, 1],
      ["\u03b2\u03b1\u03c3", 64, 1],
      ["\u03c0\u03bf\u03bb\u03b9\u03c3", 64, 1],
      ["\u03c3\u03b1\u03c1\u03b1\u03ba\u03b1\u03c4\u03c3", 64, 1],
      ["\u03b8\u03c5\u03c3", 64, 1],
      ["\u03b4\u03b9\u03b1\u03c4", -1, 1],
      ["\u03c0\u03bb\u03b1\u03c4", -1, 1],
      ["\u03c4\u03c3\u03b1\u03c1\u03bb\u03b1\u03c4", -1, 1],
      ["\u03c4\u03b5\u03c4", -1, 1],
      ["\u03c0\u03bf\u03c5\u03c1\u03b9\u03c4", -1, 1],
      ["\u03c3\u03bf\u03c5\u03bb\u03c4", -1, 1],
      ["\u03bc\u03b1\u03b9\u03bd\u03c4", -1, 1],
      ["\u03b6\u03c9\u03bd\u03c4", -1, 1],
      ["\u03ba\u03b1\u03c3\u03c4", -1, 1],
      ["\u03c6", -1, 1],
      ["\u03b4\u03b9\u03b1\u03c6", 78, 1],
      ["\u03c3\u03c4\u03b5\u03c6", 78, 1],
      ["\u03c6\u03c9\u03c4\u03bf\u03c3\u03c4\u03b5\u03c6", 80, 1],
      ["\u03c0\u03b5\u03c1\u03b7\u03c6", 78, 1],
      ["\u03c5\u03c0\u03b5\u03c1\u03b7\u03c6", 82, 1],
      ["\u03ba\u03bf\u03b9\u03bb\u03b1\u03c1\u03c6", 78, 1],
      ["\u03c0\u03b5\u03bd\u03c4\u03b1\u03c1\u03c6", 78, 1],
      ["\u03bf\u03c1\u03c6", 78, 1],
      ["\u03c7", -1, 1],
      ["\u03b1\u03bc\u03b7\u03c7", 87, 1],
      ["\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7", 87, 1],
      ["\u03bc\u03b5\u03b3\u03bb\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7", 89, 1],
      ["\u03ba\u03b1\u03c0\u03bd\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7", 89, 1],
      ["\u03bc\u03b9\u03ba\u03c1\u03bf\u03b2\u03b9\u03bf\u03bc\u03b7\u03c7", 89, 1],
      ["\u03c0\u03bf\u03bb\u03c5\u03bc\u03b7\u03c7", 87, 1],
      ["\u03bb\u03b9\u03c7", 87, 1],
    ],
    W = [["\u03b7\u03c3\u03b5\u03c4\u03b5", -1, 1]],
    da = [
      ["\u03b5\u03bd\u03b4", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b4", -1, 1],
      ["\u03bf\u03b4", -1, 1],
      ["\u03b4\u03b9\u03b1\u03b8", -1, 1],
      ["\u03ba\u03b1\u03b8", -1, 1],
      ["\u03c1\u03b1\u03b8", -1, 1],
      ["\u03c4\u03b1\u03b8", -1, 1],
      ["\u03c4\u03b9\u03b8", -1, 1],
      ["\u03b5\u03ba\u03b8", -1, 1],
      ["\u03b5\u03bd\u03b8", -1, 1],
      ["\u03c3\u03c5\u03bd\u03b8", -1, 1],
      ["\u03c1\u03bf\u03b8", -1, 1],
      ["\u03c5\u03c0\u03b5\u03c1\u03b8", -1, 1],
      ["\u03c3\u03b8", -1, 1],
      ["\u03b5\u03c5\u03b8", -1, 1],
      ["\u03b1\u03c1\u03ba", -1, 1],
      ["\u03c9\u03c6\u03b5\u03bb", -1, 1],
      ["\u03b2\u03bf\u03bb", -1, 1],
      ["\u03b1\u03b9\u03bd", -1, 1],
      ["\u03c0\u03bf\u03bd", -1, 1],
      ["\u03c1\u03bf\u03bd", -1, 1],
      ["\u03c3\u03c5\u03bd", -1, 1],
      ["\u03b2\u03b1\u03c1", -1, 1],
      ["\u03b2\u03c1", -1, 1],
      ["\u03b1\u03b9\u03c1", -1, 1],
      ["\u03c6\u03bf\u03c1", -1, 1],
      ["\u03b5\u03c5\u03c1", -1, 1],
      ["\u03c0\u03c5\u03c1", -1, 1],
      ["\u03c7\u03c9\u03c1", -1, 1],
      ["\u03bd\u03b5\u03c4", -1, 1],
      ["\u03c3\u03c7", -1, 1],
    ],
    ea = [
      ["\u03c0\u03b1\u03b3", -1, 1],
      ["\u03b4", -1, 1],
      ["\u03b1\u03b4", 1, 1],
      ["\u03b8", -1, 1],
      ["\u03b1\u03b8", 3, 1],
      ["\u03c4\u03bf\u03ba", -1, 1],
      ["\u03c3\u03ba", -1, 1],
      ["\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb", -1, 1],
      ["\u03c3\u03ba\u03b5\u03bb", -1, 1],
      ["\u03b1\u03c0\u03bb", -1, 1],
      ["\u03b5\u03bc", -1, 1],
      ["\u03b1\u03bd", -1, 1],
      ["\u03b2\u03b5\u03bd", -1, 1],
      ["\u03b2\u03b1\u03c1\u03bf\u03bd", -1, 1],
      ["\u03ba\u03bf\u03c0", -1, 1],
      ["\u03c3\u03b5\u03c1\u03c0", -1, 1],
      ["\u03b1\u03b2\u03b1\u03c1", -1, 1],
      ["\u03b5\u03bd\u03b1\u03c1", -1, 1],
      ["\u03b1\u03b2\u03c1", -1, 1],
      ["\u03bc\u03c0\u03bf\u03c1", -1, 1],
      ["\u03b8\u03b1\u03c1\u03c1", -1, 1],
      ["\u03bd\u03c4\u03c1", -1, 1],
      ["\u03c5", -1, 1],
      ["\u03bd\u03b9\u03c6", -1, 1],
      ["\u03c3\u03c5\u03c1\u03c6", -1, 1],
    ],
    fa = [
      ["\u03bf\u03bd\u03c4\u03b1\u03c3", -1, 1],
      ["\u03c9\u03bd\u03c4\u03b1\u03c3", -1, 1],
    ],
    ga = [
      ["\u03bf\u03bc\u03b1\u03c3\u03c4\u03b5", -1, 1],
      ["\u03b9\u03bf\u03bc\u03b1\u03c3\u03c4\u03b5", 0, 1],
    ],
    Y = [
      ["\u03c0", -1, 1],
      ["\u03b1\u03c0", 0, 1],
      ["\u03b1\u03ba\u03b1\u03c4\u03b1\u03c0", 1, 1],
      ["\u03c3\u03c5\u03bc\u03c0", 0, 1],
      ["\u03b1\u03c3\u03c5\u03bc\u03c0", 3, 1],
      ["\u03b1\u03bc\u03b5\u03c4\u03b1\u03bc\u03c6", -1, 1],
    ],
    Z = [
      ["\u03b6", -1, 1],
      ["\u03b1\u03bb", -1, 1],
      ["\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb", 1, 1],
      ["\u03b5\u03ba\u03c4\u03b5\u03bb", -1, 1],
      ["\u03bc", -1, 1],
      ["\u03be", -1, 1],
      ["\u03c0\u03c1\u03bf", -1, 1],
      ["\u03b1\u03c1", -1, 1],
      ["\u03bd\u03b9\u03c3", -1, 1],
    ],
    X = [
      ["\u03b7\u03b8\u03b7\u03ba\u03b1", -1, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b5", -1, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b5\u03c3", -1, 1],
    ],
    ja = [
      ["\u03c0\u03b9\u03b8", -1, 1],
      ["\u03bf\u03b8", -1, 1],
      ["\u03bd\u03b1\u03c1\u03b8", -1, 1],
      ["\u03c3\u03ba\u03bf\u03c5\u03bb", -1, 1],
      ["\u03c3\u03ba\u03c9\u03bb", -1, 1],
      ["\u03c3\u03c6", -1, 1],
    ],
    ka = [
      ["\u03b8", -1, 1],
      ["\u03b4\u03b9\u03b1\u03b8", 0, 1],
      ["\u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03c4\u03b1\u03b8", 0, 1],
      ["\u03c3\u03c5\u03bd\u03b8", 0, 1],
      ["\u03c0\u03c1\u03bf\u03c3\u03b8", 0, 1],
    ],
    la = [
      ["\u03b7\u03ba\u03b1", -1, 1],
      ["\u03b7\u03ba\u03b5", -1, 1],
      ["\u03b7\u03ba\u03b5\u03c3", -1, 1],
    ],
    ma = [
      ["\u03c6\u03b1\u03b3", -1, 1],
      ["\u03bb\u03b7\u03b3", -1, 1],
      ["\u03c6\u03c1\u03c5\u03b4", -1, 1],
      ["\u03bc\u03b1\u03bd\u03c4\u03b9\u03bb", -1, 1],
      ["\u03bc\u03b1\u03bb\u03bb", -1, 1],
      ["\u03bf\u03bc", -1, 1],
      ["\u03b2\u03bb\u03b5\u03c0", -1, 1],
      ["\u03c0\u03bf\u03b4\u03b1\u03c1", -1, 1],
      ["\u03ba\u03c5\u03bc\u03b1\u03c4", -1, 1],
      ["\u03c0\u03c1\u03c9\u03c4", -1, 1],
      ["\u03bb\u03b1\u03c7", -1, 1],
      ["\u03c0\u03b1\u03bd\u03c4\u03b1\u03c7", -1, 1],
    ],
    na = [
      ["\u03c4\u03c3\u03b1", -1, 1],
      ["\u03c7\u03b1\u03b4", -1, 1],
      ["\u03bc\u03b5\u03b4", -1, 1],
      ["\u03bb\u03b1\u03bc\u03c0\u03b9\u03b4", -1, 1],
      ["\u03b4\u03b5", -1, 1],
      ["\u03c0\u03bb\u03b5", -1, 1],
      ["\u03bc\u03b5\u03c3\u03b1\u03b6", -1, 1],
      ["\u03b4\u03b5\u03c3\u03c0\u03bf\u03b6", -1, 1],
      ["\u03b1\u03b9\u03b8", -1, 1],
      ["\u03c6\u03b1\u03c1\u03bc\u03b1\u03ba", -1, 1],
      ["\u03b1\u03b3\u03ba", -1, 1],
      ["\u03b1\u03bd\u03b7\u03ba", -1, 1],
      ["\u03bb", -1, 1],
      ["\u03bc", -1, 1],
      ["\u03b1\u03bc", 13, 1],
      ["\u03b2\u03c1\u03bf\u03bc", 13, 1],
      ["\u03c5\u03c0\u03bf\u03c4\u03b5\u03b9\u03bd", -1, 1],
      ["\u03b5\u03ba\u03bb\u03b9\u03c0", -1, 1],
      ["\u03c1", -1, 1],
      ["\u03b5\u03bd\u03b4\u03b9\u03b1\u03c6\u03b5\u03c1", 18, 1],
      ["\u03b1\u03bd\u03b1\u03c1\u03c1", 18, 1],
      ["\u03c0\u03b1\u03c4", -1, 1],
      ["\u03ba\u03b1\u03b8\u03b1\u03c1\u03b5\u03c5", -1, 1],
      ["\u03b4\u03b5\u03c5\u03c4\u03b5\u03c1\u03b5\u03c5", -1, 1],
      ["\u03bb\u03b5\u03c7", -1, 1],
    ],
    oa = [
      ["\u03bf\u03c5\u03c3\u03b1", -1, 1],
      ["\u03bf\u03c5\u03c3\u03b5", -1, 1],
      ["\u03bf\u03c5\u03c3\u03b5\u03c3", -1, 1],
    ],
    pa = [
      ["\u03c0\u03b5\u03bb", -1, 1],
      ["\u03bb\u03bb", -1, 1],
      ["\u03c3\u03bc\u03b7\u03bd", -1, 1],
      ["\u03c1\u03c0", -1, 1],
      ["\u03c0\u03c1", -1, 1],
      ["\u03c6\u03c1", -1, 1],
      ["\u03c7\u03bf\u03c1\u03c4", -1, 1],
      ["\u03bf\u03c6", -1, 1],
      ["\u03c8\u03bf\u03c6", 7, -1],
      ["\u03c3\u03c6", -1, 1],
      ["\u03bb\u03bf\u03c7", -1, 1],
      ["\u03bd\u03b1\u03c5\u03bb\u03bf\u03c7", 10, -1],
    ],
    qa = [
      ["\u03b1\u03bc\u03b1\u03bb\u03bb\u03b9", -1, 1],
      ["\u03bb", -1, 1],
      ["\u03b1\u03bc\u03b1\u03bb", 1, 1],
      ["\u03bc", -1, 1],
      ["\u03bf\u03c5\u03bb\u03b1\u03bc", 3, 1],
      ["\u03b5\u03bd", -1, 1],
      ["\u03b4\u03b5\u03c1\u03b2\u03b5\u03bd", 5, 1],
      ["\u03c0", -1, 1],
      ["\u03b1\u03b5\u03b9\u03c0", 7, 1],
      ["\u03b1\u03c1\u03c4\u03b9\u03c0", 7, 1],
      ["\u03c3\u03c5\u03bc\u03c0", 7, 1],
      ["\u03bd\u03b5\u03bf\u03c0", 7, 1],
      ["\u03ba\u03c1\u03bf\u03ba\u03b1\u03bb\u03bf\u03c0", 7, 1],
      ["\u03bf\u03bb\u03bf\u03c0", 7, 1],
      ["\u03c0\u03c1\u03bf\u03c3\u03c9\u03c0\u03bf\u03c0", 7, 1],
      ["\u03c3\u03b9\u03b4\u03b7\u03c1\u03bf\u03c0", 7, 1],
      ["\u03b4\u03c1\u03bf\u03c3\u03bf\u03c0", 7, 1],
      ["\u03b1\u03c3\u03c0", 7, 1],
      ["\u03b1\u03bd\u03c5\u03c0", 7, 1],
      ["\u03c1", -1, 1],
      ["\u03b1\u03c3\u03c0\u03b1\u03c1", 19, 1],
      ["\u03c7\u03b1\u03c1", 19, 1],
      ["\u03b1\u03c7\u03b1\u03c1", 21, 1],
      ["\u03b1\u03c0\u03b5\u03c1", 19, 1],
      ["\u03c4\u03c1", 19, 1],
      ["\u03bf\u03c5\u03c1", 19, 1],
      ["\u03c4", -1, 1],
      ["\u03b4\u03b9\u03b1\u03c4", 26, 1],
      ["\u03b5\u03c0\u03b9\u03c4", 26, 1],
      ["\u03c3\u03c5\u03bd\u03c4", 26, 1],
      ["\u03bf\u03bc\u03bf\u03c4", 26, 1],
      ["\u03bd\u03bf\u03bc\u03bf\u03c4", 30, 1],
      ["\u03b1\u03c0\u03bf\u03c4", 26, 1],
      ["\u03c5\u03c0\u03bf\u03c4", 26, 1],
      ["\u03b1\u03b2\u03b1\u03c3\u03c4", 26, 1],
      ["\u03b1\u03b9\u03bc\u03bf\u03c3\u03c4", 26, 1],
      ["\u03c0\u03c1\u03bf\u03c3\u03c4", 26, 1],
      ["\u03b1\u03bd\u03c5\u03c3\u03c4", 26, 1],
      ["\u03bd\u03b1\u03c5", -1, 1],
      ["\u03b1\u03c6", -1, 1],
      ["\u03be\u03b5\u03c6", -1, 1],
      ["\u03b1\u03b4\u03b7\u03c6", -1, 1],
      ["\u03c0\u03b1\u03bc\u03c6", -1, 1],
      ["\u03c0\u03bf\u03bb\u03c5\u03c6", -1, 1],
    ],
    ra = [
      ["\u03b1\u03b3\u03b1", -1, 1],
      ["\u03b1\u03b3\u03b5", -1, 1],
      ["\u03b1\u03b3\u03b5\u03c3", -1, 1],
    ],
    sa = [
      ["\u03b7\u03c3\u03b1", -1, 1],
      ["\u03b7\u03c3\u03b5", -1, 1],
      ["\u03b7\u03c3\u03bf\u03c5", -1, 1],
    ],
    ta = [
      ["\u03bd", -1, 1],
      ["\u03b4\u03c9\u03b4\u03b5\u03ba\u03b1\u03bd", 0, 1],
      ["\u03b5\u03c0\u03c4\u03b1\u03bd", 0, 1],
      ["\u03bc\u03b5\u03b3\u03b1\u03bb\u03bf\u03bd", 0, 1],
      ["\u03b5\u03c1\u03b7\u03bc\u03bf\u03bd", 0, 1],
      ["\u03c7\u03b5\u03c1\u03c3\u03bf\u03bd", 0, 1],
    ],
    ua = [["\u03b7\u03c3\u03c4\u03b5", -1, 1]],
    va = [
      ["\u03c3\u03b2", -1, 1],
      ["\u03b1\u03c3\u03b2", 0, 1],
      ["\u03b1\u03c0\u03bb", -1, 1],
      ["\u03b1\u03b5\u03b9\u03bc\u03bd", -1, 1],
      ["\u03c7\u03c1", -1, 1],
      ["\u03b1\u03c7\u03c1", 4, 1],
      ["\u03ba\u03bf\u03b9\u03bd\u03bf\u03c7\u03c1", 4, 1],
      ["\u03b4\u03c5\u03c3\u03c7\u03c1", 4, 1],
      ["\u03b5\u03c5\u03c7\u03c1", 4, 1],
      ["\u03c0\u03b1\u03bb\u03b9\u03bc\u03c8", -1, 1],
    ],
    wa = [
      ["\u03bf\u03c5\u03bd\u03b5", -1, 1],
      ["\u03b7\u03b8\u03bf\u03c5\u03bd\u03b5", 0, 1],
      ["\u03b7\u03c3\u03bf\u03c5\u03bd\u03b5", 0, 1],
    ],
    xa = [
      ["\u03c3\u03c0\u03b9", -1, 1],
      ["\u03bd", -1, 1],
      ["\u03b5\u03be\u03c9\u03bd", 1, 1],
      ["\u03c1", -1, 1],
      ["\u03c3\u03c4\u03c1\u03b1\u03b2\u03bf\u03bc\u03bf\u03c5\u03c4\u03c3", -1, 1],
      ["\u03ba\u03b1\u03ba\u03bf\u03bc\u03bf\u03c5\u03c4\u03c3", -1, 1],
    ],
    ya = [
      ["\u03bf\u03c5\u03bc\u03b5", -1, 1],
      ["\u03b7\u03b8\u03bf\u03c5\u03bc\u03b5", 0, 1],
      ["\u03b7\u03c3\u03bf\u03c5\u03bc\u03b5", 0, 1],
    ],
    za = [
      ["\u03b1\u03b6", -1, 1],
      ["\u03c9\u03c1\u03b9\u03bf\u03c0\u03bb", -1, 1],
      ["\u03b1\u03c3\u03bf\u03c5\u03c3", -1, 1],
      ["\u03c0\u03b1\u03c1\u03b1\u03c3\u03bf\u03c5\u03c3", 2, 1],
      ["\u03b1\u03bb\u03bb\u03bf\u03c3\u03bf\u03c5\u03c3", -1, 1],
      ["\u03c6", -1, 1],
      ["\u03c7", -1, 1],
    ],
    Aa = [
      ["\u03bc\u03b1\u03c4\u03b1", -1, 1],
      ["\u03bc\u03b1\u03c4\u03c9\u03bd", -1, 1],
      ["\u03bc\u03b1\u03c4\u03bf\u03c3", -1, 1],
    ],
    Ba = [
      ["\u03b1", -1, 1],
      ["\u03b9\u03bf\u03c5\u03bc\u03b1", 0, 1],
      ["\u03bf\u03bc\u03bf\u03c5\u03bd\u03b1", 0, 1],
      ["\u03b9\u03bf\u03bc\u03bf\u03c5\u03bd\u03b1", 2, 1],
      ["\u03bf\u03c3\u03bf\u03c5\u03bd\u03b1", 0, 1],
      ["\u03b9\u03bf\u03c3\u03bf\u03c5\u03bd\u03b1", 4, 1],
      ["\u03b5", -1, 1],
      ["\u03b1\u03b3\u03b1\u03c4\u03b5", 6, 1],
      ["\u03b7\u03ba\u03b1\u03c4\u03b5", 6, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b1\u03c4\u03b5", 8, 1],
      ["\u03b7\u03c3\u03b1\u03c4\u03b5", 6, 1],
      ["\u03bf\u03c5\u03c3\u03b1\u03c4\u03b5", 6, 1],
      ["\u03b5\u03b9\u03c4\u03b5", 6, 1],
      ["\u03b7\u03b8\u03b5\u03b9\u03c4\u03b5", 12, 1],
      ["\u03b9\u03b5\u03bc\u03b1\u03c3\u03c4\u03b5", 6, 1],
      ["\u03bf\u03c5\u03bc\u03b1\u03c3\u03c4\u03b5", 6, 1],
      ["\u03b9\u03bf\u03c5\u03bc\u03b1\u03c3\u03c4\u03b5", 15, 1],
      ["\u03b9\u03b5\u03c3\u03b1\u03c3\u03c4\u03b5", 6, 1],
      ["\u03bf\u03c3\u03b1\u03c3\u03c4\u03b5", 6, 1],
      ["\u03b9\u03bf\u03c3\u03b1\u03c3\u03c4\u03b5", 18, 1],
      ["\u03b7", -1, 1],
      ["\u03b9", -1, 1],
      ["\u03b1\u03bc\u03b1\u03b9", 21, 1],
      ["\u03b9\u03b5\u03bc\u03b1\u03b9", 21, 1],
      ["\u03bf\u03bc\u03b1\u03b9", 21, 1],
      ["\u03bf\u03c5\u03bc\u03b1\u03b9", 21, 1],
      ["\u03b1\u03c3\u03b1\u03b9", 21, 1],
      ["\u03b5\u03c3\u03b1\u03b9", 21, 1],
      ["\u03b9\u03b5\u03c3\u03b1\u03b9", 27, 1],
      ["\u03b1\u03c4\u03b1\u03b9", 21, 1],
      ["\u03b5\u03c4\u03b1\u03b9", 21, 1],
      ["\u03b9\u03b5\u03c4\u03b1\u03b9", 30, 1],
      ["\u03bf\u03bd\u03c4\u03b1\u03b9", 21, 1],
      ["\u03bf\u03c5\u03bd\u03c4\u03b1\u03b9", 21, 1],
      ["\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03b9", 33, 1],
      ["\u03b5\u03b9", 21, 1],
      ["\u03b1\u03b5\u03b9", 35, 1],
      ["\u03b7\u03b8\u03b5\u03b9", 35, 1],
      ["\u03b7\u03c3\u03b5\u03b9", 35, 1],
      ["\u03bf\u03b9", 21, 1],
      ["\u03b1\u03bd", -1, 1],
      ["\u03b1\u03b3\u03b1\u03bd", 40, 1],
      ["\u03b7\u03ba\u03b1\u03bd", 40, 1],
      ["\u03b7\u03b8\u03b7\u03ba\u03b1\u03bd", 42, 1],
      ["\u03b7\u03c3\u03b1\u03bd", 40, 1],
      ["\u03bf\u03c5\u03c3\u03b1\u03bd", 40, 1],
      ["\u03bf\u03bd\u03c4\u03bf\u03c5\u03c3\u03b1\u03bd", 45, 1],
      ["\u03b9\u03bf\u03bd\u03c4\u03bf\u03c5\u03c3\u03b1\u03bd", 46, 1],
      ["\u03bf\u03bd\u03c4\u03b1\u03bd", 40, 1],
      ["\u03b9\u03bf\u03bd\u03c4\u03b1\u03bd", 48, 1],
      ["\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd", 40, 1],
      ["\u03b9\u03bf\u03c5\u03bd\u03c4\u03b1\u03bd", 50, 1],
      ["\u03bf\u03c4\u03b1\u03bd", 40, 1],
      ["\u03b9\u03bf\u03c4\u03b1\u03bd", 52, 1],
      ["\u03bf\u03bc\u03b1\u03c3\u03c4\u03b1\u03bd", 40, 1],
      ["\u03b9\u03bf\u03bc\u03b1\u03c3\u03c4\u03b1\u03bd", 54, 1],
      ["\u03bf\u03c3\u03b1\u03c3\u03c4\u03b1\u03bd", 40, 1],
      ["\u03b9\u03bf\u03c3\u03b1\u03c3\u03c4\u03b1\u03bd", 56, 1],
      ["\u03bf\u03c5\u03bd", -1, 1],
      ["\u03b7\u03b8\u03bf\u03c5\u03bd", 58, 1],
      ["\u03bf\u03bc\u03bf\u03c5\u03bd", 58, 1],
      ["\u03b9\u03bf\u03bc\u03bf\u03c5\u03bd", 60, 1],
      ["\u03b7\u03c3\u03bf\u03c5\u03bd", 58, 1],
      ["\u03bf\u03c3\u03bf\u03c5\u03bd", 58, 1],
      ["\u03b9\u03bf\u03c3\u03bf\u03c5\u03bd", 63, 1],
      ["\u03c9\u03bd", -1, 1],
      ["\u03b7\u03b4\u03c9\u03bd", 65, 1],
      ["\u03bf", -1, 1],
      ["\u03b1\u03c3", -1, 1],
      ["\u03b5\u03c3", -1, 1],
      ["\u03b7\u03b4\u03b5\u03c3", 69, 1],
      ["\u03b7\u03c3\u03b5\u03c3", 69, 1],
      ["\u03b7\u03c3", -1, 1],
      ["\u03b5\u03b9\u03c3", -1, 1],
      ["\u03b7\u03b8\u03b5\u03b9\u03c3", 73, 1],
      ["\u03bf\u03c3", -1, 1],
      ["\u03c5\u03c3", -1, 1],
      ["\u03bf\u03c5\u03c3", 76, 1],
      ["\u03c5", -1, 1],
      ["\u03bf\u03c5", 78, 1],
      ["\u03c9", -1, 1],
      ["\u03b1\u03c9", 80, 1],
      ["\u03b7\u03b8\u03c9", 80, 1],
      ["\u03b7\u03c3\u03c9", 80, 1],
    ],
    Ca = [
      ["\u03bf\u03c4\u03b5\u03c1", -1, 1],
      ["\u03b5\u03c3\u03c4\u03b5\u03c1", -1, 1],
      ["\u03c5\u03c4\u03b5\u03c1", -1, 1],
      ["\u03c9\u03c4\u03b5\u03c1", -1, 1],
      ["\u03bf\u03c4\u03b1\u03c4", -1, 1],
      ["\u03b5\u03c3\u03c4\u03b1\u03c4", -1, 1],
      ["\u03c5\u03c4\u03b1\u03c4", -1, 1],
      ["\u03c9\u03c4\u03b1\u03c4", -1, 1],
    ],
    ia = [81, 65, 16, 1],
    ha = [81, 65, 0, 1],
    B = p;
  this.l = function () {
    a.f = a.cursor;
    a.cursor = a.a;
    var d = a.a - a.cursor;
    k();
    a.cursor = a.a - d;
    if (!(3 <= a.j.length)) return p;
    B = g;
    d = a.a - a.cursor;
    l();
    a.cursor = a.a - d;
    var d = a.a - a.cursor,
      n;
    a.d = a.cursor;
    if (
      0 != a.h(b) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), (n = a.h(v)), !(0 == n || a.cursor > a.f)))
    )
      switch (n) {
        case 1:
          if (!a.b("\u03b9")) break;
          break;
        case 2:
          a.b("\u03b9\u03b6");
      }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(q) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(f) || a.cursor > a.f || a.b("\u03c9\u03bd")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(s) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        if (a.g("\u03b9\u03c3\u03b1") && !(a.cursor > a.f)) {
          if (!a.b("\u03b9\u03c3")) break a;
          break b;
        }
        a.cursor = a.a - n;
        a.d = a.cursor;
        a.c = a.cursor;
        n = a.h(t);
        if (!(0 == n || a.cursor > a.f))
          switch (n) {
            case 1:
              if (!a.b("\u03b9")) break;
              break;
            case 2:
              a.b("\u03b9\u03c3");
          }
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(m) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(r) || a.cursor > a.f || a.b("\u03b9")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    if (
      0 != a.h(u) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), (n = a.h(w)), !(0 == n || a.cursor > a.f)))
    )
      switch (n) {
        case 1:
          if (!a.b("\u03b9")) break;
          break;
        case 2:
          a.b("\u03b9\u03c3\u03c4");
      }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(e) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        var F = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        n = a.h(y);
        if (0 != n && !(a.cursor > a.f)) {
          switch (n) {
            case 1:
              if (!a.b("\u03b9\u03c3\u03bc")) break a;
              break;
            case 2:
              if (!a.b("\u03b9")) break a;
          }
          break b;
        }
        a.cursor = a.a - F;
        a.d = a.cursor;
        n = a.h(z);
        if (0 != n)
          switch (((a.c = a.cursor), n)) {
            case 1:
              if (!a.b("\u03b1\u03b3\u03bd\u03c9\u03c3\u03c4")) break;
              break;
            case 2:
              if (!a.b("\u03b1\u03c4\u03bf\u03bc")) break;
              break;
            case 3:
              if (!a.b("\u03b3\u03bd\u03c9\u03c3\u03c4")) break;
              break;
            case 4:
              if (!a.b("\u03b5\u03b8\u03bd")) break;
              break;
            case 5:
              if (!a.b("\u03b5\u03ba\u03bb\u03b5\u03ba\u03c4")) break;
              break;
            case 6:
              if (!a.b("\u03c3\u03ba\u03b5\u03c0\u03c4")) break;
              break;
            case 7:
              if (!a.b("\u03c4\u03bf\u03c0")) break;
              break;
            case 8:
              if (!a.b("\u03b1\u03bb\u03b5\u03be\u03b1\u03bd\u03b4\u03c1")) break;
              break;
            case 9:
              if (!a.b("\u03b2\u03c5\u03b6\u03b1\u03bd\u03c4")) break;
              break;
            case 10:
              a.b("\u03b8\u03b5\u03b1\u03c4\u03c1");
          }
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(H) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p),
        (a.d = a.cursor),
        (a.c = a.cursor),
        0 == a.h(A) || a.cursor > a.f || a.b("\u03b1\u03c1\u03b1\u03ba")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(E) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        F = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        n = a.h(G);
        if (0 != n && !(a.cursor > a.f)) {
          switch (n) {
            case 1:
              if (!a.b("\u03b1\u03ba")) break a;
              break;
            case 2:
              if (!a.b("\u03b9\u03c4\u03c3")) break a;
          }
          break b;
        }
        a.cursor = a.a - F;
        a.d = a.cursor;
        a.c = a.cursor;
        !a.g("\u03ba\u03bf\u03c1") || a.b("\u03b9\u03c4\u03c3");
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(N) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (0 != a.h(x) && !(a.cursor > a.f)) {
          if (!a.b("\u03b9\u03b4")) break a;
          break b;
        }
        a.cursor = a.a - n;
        a.d = a.cursor;
        a.c = a.cursor;
        0 == a.h(O) || a.b("\u03b9\u03b4");
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(P) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(M) || a.cursor > a.f || a.b("\u03b9\u03c3\u03ba")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(Q) && ((a.c = a.cursor), a.e()))) {
      n = a.a - a.cursor;
      if (0 != a.h(T)) break a;
      a.cursor = a.a - n;
      n = a.cursor;
      a.r(a.cursor, a.cursor, "\u03b1\u03b4");
      a.cursor = n;
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(U) &&
      ((a.c = a.cursor), a.e() && ((a.d = a.cursor), (a.c = a.cursor), 0 == a.h(R) || a.b("\u03b5\u03b4")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(S) &&
      ((a.c = a.cursor), a.e() && ((a.d = a.cursor), (a.c = a.cursor), 0 == a.h(V) || a.b("\u03bf\u03c5\u03b4")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(I) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(D) || a.cursor > a.f || a.b("\u03b5")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(L) &&
      ((a.c = a.cursor), a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), !a.n(ia, 945, 969) || a.b("\u03b9")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(J) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (a.n(ia, 945, 969)) {
          if (!a.b("\u03b9\u03ba")) break a;
          break b;
        }
        a.cursor = a.a - n;
        a.d = a.cursor;
      }
      a.c = a.cursor;
      0 == a.h(K) || a.cursor > a.f || a.b("\u03b9\u03ba");
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: {
      n = a.a - a.cursor;
      if (a.g("\u03b1\u03b3\u03b1\u03bc\u03b5") && !(a.cursor > a.f) && !a.b("\u03b1\u03b3\u03b1\u03bc")) break a;
      a.cursor = a.a - n;
      n = a.a - a.cursor;
      a.d = a.cursor;
      if (0 != a.h($)) {
        a.c = a.cursor;
        if (!a.e()) break a;
        B = p;
      }
      a.cursor = a.a - n;
      a.d = a.cursor;
      a.g("\u03b1\u03bc\u03b5") &&
        ((a.c = a.cursor),
        a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(aa) || a.cursor > a.f || a.b("\u03b1\u03bc")));
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    h();
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    c();
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(fa) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (a.g("\u03b1\u03c1\u03c7") && !(a.cursor > a.f)) {
          if (!a.b("\u03bf\u03bd\u03c4")) break a;
          break b;
        }
        a.cursor = a.a - n;
        a.d = a.cursor;
        a.c = a.cursor;
        !a.g("\u03ba\u03c1\u03b5") || a.b("\u03c9\u03bd\u03c4");
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(ga) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p),
        (a.d = a.cursor),
        (a.c = a.cursor),
        !a.g("\u03bf\u03bd") || a.cursor > a.f || a.b("\u03bf\u03bc\u03b1\u03c3\u03c4")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: {
      n = a.a - a.cursor;
      a.d = a.cursor;
      if (a.g("\u03b9\u03b5\u03c3\u03c4\u03b5")) {
        a.c = a.cursor;
        if (!a.e()) break a;
        B = p;
        a.d = a.cursor;
        a.c = a.cursor;
        if (0 != a.h(Y) && !(a.cursor > a.f) && !a.b("\u03b9\u03b5\u03c3\u03c4")) break a;
      }
      a.cursor = a.a - n;
      a.d = a.cursor;
      a.g("\u03b5\u03c3\u03c4\u03b5") &&
        ((a.c = a.cursor),
        a.e() &&
          ((B = p),
          (a.d = a.cursor),
          (a.c = a.cursor),
          0 == a.h(Z) || a.cursor > a.f || a.b("\u03b9\u03b5\u03c3\u03c4")));
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: {
      n = a.a - a.cursor;
      a.d = a.cursor;
      if (0 != a.h(X)) {
        a.c = a.cursor;
        if (!a.e()) break a;
        B = p;
      }
      a.cursor = a.a - n;
      a.d = a.cursor;
      if (0 != a.h(la) && ((a.c = a.cursor), a.e())) {
        B = p;
        b: {
          n = a.a - a.cursor;
          a.d = a.cursor;
          a.c = a.cursor;
          if (0 != a.h(ja)) {
            if (!a.b("\u03b7\u03ba")) break a;
            break b;
          }
          a.cursor = a.a - n;
          a.d = a.cursor;
          a.c = a.cursor;
          0 == a.h(ka) || a.cursor > a.f || a.b("\u03b7\u03ba");
        }
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(oa) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (0 != a.h(ma)) {
          if (!a.b("\u03bf\u03c5\u03c3")) break a;
          break b;
        }
        a.cursor = a.a - n;
        a.d = a.cursor;
        a.c = a.cursor;
        0 == a.h(na) || a.cursor > a.f || a.b("\u03bf\u03c5\u03c3");
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(sa) &&
      ((a.c = a.cursor),
      a.e() && ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(ta) || a.cursor > a.f || a.b("\u03b7\u03c3")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), 0 != a.h(ra) && ((a.c = a.cursor), a.e()))) {
      B = p;
      b: {
        n = a.a - a.cursor;
        a.d = a.cursor;
        a.c = a.cursor;
        if (a.g("\u03ba\u03bf\u03bb\u03bb")) {
          if (!a.b("\u03b1\u03b3")) break a;
          break b;
        }
        a.cursor = a.a - n;
        c: {
          F = a.a - a.cursor;
          a.d = a.cursor;
          a.c = a.cursor;
          n = a.h(pa);
          if (0 != n) {
            switch (n) {
              case 1:
                if (!a.b("\u03b1\u03b3")) break a;
            }
            break c;
          }
          a.cursor = a.a - F;
          a.d = a.cursor;
          a.c = a.cursor;
          0 == a.h(qa) || a.cursor > a.f || a.b("\u03b1\u03b3");
        }
      }
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(ua) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(va) || a.cursor > a.f || a.b("\u03b7\u03c3\u03c4")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(wa) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(xa) || a.cursor > a.f || a.b("\u03bf\u03c5\u03bd")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(ya) &&
      ((a.c = a.cursor),
      a.e() &&
        ((B = p), (a.d = a.cursor), (a.c = a.cursor), 0 == a.h(za) || a.cursor > a.f || a.b("\u03bf\u03c5\u03bc")));
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: {
      n = a.a - a.cursor;
      a.d = a.cursor;
      if (0 != a.h(Aa) && ((a.c = a.cursor), !a.b("\u03bc\u03b1"))) break a;
      a.cursor = a.a - n;
      B && ((a.d = a.cursor), 0 != a.h(Ba) && ((a.c = a.cursor), a.e()));
    }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(Ca) && ((a.c = a.cursor), a.e());
    a.cursor = a.a - d;
    a.cursor = a.f;
    return g;
  };
  this.stemWord = function (b) {
    a.p(b);
    this.l();
    return a.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
