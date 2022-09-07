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
    return !l.n(c, 2325, 2399) ? p : g;
  }
  var l = new C(),
    h = [
      ["\u0906\u0901", -1, -1],
      ["\u093e\u0901", -1, -1],
      ["\u0907\u092f\u093e\u0901", 1, -1],
      ["\u0906\u0907\u092f\u093e\u0901", 2, -1],
      ["\u093e\u0907\u092f\u093e\u0901", 2, -1],
      ["\u093f\u092f\u093e\u0901", 1, -1],
      ["\u0906\u0902", -1, -1],
      ["\u0909\u0906\u0902", 6, -1],
      ["\u0941\u0906\u0902", 6, -1],
      ["\u0908\u0902", -1, -1],
      ["\u0906\u0908\u0902", 9, -1],
      ["\u093e\u0908\u0902", 9, -1],
      ["\u090f\u0902", -1, -1],
      ["\u0906\u090f\u0902", 12, -1],
      ["\u0909\u090f\u0902", 12, -1],
      ["\u093e\u090f\u0902", 12, -1],
      ["\u0924\u093e\u090f\u0902", 15, -1, k],
      ["\u0905\u0924\u093e\u090f\u0902", 16, -1],
      ["\u0928\u093e\u090f\u0902", 15, -1, k],
      ["\u0905\u0928\u093e\u090f\u0902", 18, -1],
      ["\u0941\u090f\u0902", 12, -1],
      ["\u0913\u0902", -1, -1],
      ["\u0906\u0913\u0902", 21, -1],
      ["\u0909\u0913\u0902", 21, -1],
      ["\u093e\u0913\u0902", 21, -1],
      ["\u0924\u093e\u0913\u0902", 24, -1, k],
      ["\u0905\u0924\u093e\u0913\u0902", 25, -1],
      ["\u0928\u093e\u0913\u0902", 24, -1, k],
      ["\u0905\u0928\u093e\u0913\u0902", 27, -1],
      ["\u0941\u0913\u0902", 21, -1],
      ["\u093e\u0902", -1, -1],
      ["\u0907\u092f\u093e\u0902", 30, -1],
      ["\u0906\u0907\u092f\u093e\u0902", 31, -1],
      ["\u093e\u0907\u092f\u093e\u0902", 31, -1],
      ["\u093f\u092f\u093e\u0902", 30, -1],
      ["\u0940\u0902", -1, -1],
      ["\u0924\u0940\u0902", 35, -1, k],
      ["\u0905\u0924\u0940\u0902", 36, -1],
      ["\u0906\u0924\u0940\u0902", 36, -1],
      ["\u093e\u0924\u0940\u0902", 36, -1],
      ["\u0947\u0902", -1, -1],
      ["\u094b\u0902", -1, -1],
      ["\u0907\u092f\u094b\u0902", 41, -1],
      ["\u0906\u0907\u092f\u094b\u0902", 42, -1],
      ["\u093e\u0907\u092f\u094b\u0902", 42, -1],
      ["\u093f\u092f\u094b\u0902", 41, -1],
      ["\u0905", -1, -1],
      ["\u0906", -1, -1],
      ["\u0907", -1, -1],
      ["\u0908", -1, -1],
      ["\u0906\u0908", 49, -1],
      ["\u093e\u0908", 49, -1],
      ["\u0909", -1, -1],
      ["\u090a", -1, -1],
      ["\u090f", -1, -1],
      ["\u0906\u090f", 54, -1],
      ["\u0907\u090f", 54, -1],
      ["\u0906\u0907\u090f", 56, -1],
      ["\u093e\u0907\u090f", 56, -1],
      ["\u093e\u090f", 54, -1],
      ["\u093f\u090f", 54, -1],
      ["\u0913", -1, -1],
      ["\u0906\u0913", 61, -1],
      ["\u093e\u0913", 61, -1],
      ["\u0915\u0930", -1, -1, k],
      ["\u0905\u0915\u0930", 64, -1],
      ["\u0906\u0915\u0930", 64, -1],
      ["\u093e\u0915\u0930", 64, -1],
      ["\u093e", -1, -1],
      ["\u090a\u0902\u0917\u093e", 68, -1],
      ["\u0906\u090a\u0902\u0917\u093e", 69, -1],
      ["\u093e\u090a\u0902\u0917\u093e", 69, -1],
      ["\u0942\u0902\u0917\u093e", 68, -1],
      ["\u090f\u0917\u093e", 68, -1],
      ["\u0906\u090f\u0917\u093e", 73, -1],
      ["\u093e\u090f\u0917\u093e", 73, -1],
      ["\u0947\u0917\u093e", 68, -1],
      ["\u0924\u093e", 68, -1, k],
      ["\u0905\u0924\u093e", 77, -1],
      ["\u0906\u0924\u093e", 77, -1],
      ["\u093e\u0924\u093e", 77, -1],
      ["\u0928\u093e", 68, -1, k],
      ["\u0905\u0928\u093e", 81, -1],
      ["\u0906\u0928\u093e", 81, -1],
      ["\u093e\u0928\u093e", 81, -1],
      ["\u0906\u092f\u093e", 68, -1],
      ["\u093e\u092f\u093e", 68, -1],
      ["\u093f", -1, -1],
      ["\u0940", -1, -1],
      ["\u090a\u0902\u0917\u0940", 88, -1],
      ["\u0906\u090a\u0902\u0917\u0940", 89, -1],
      ["\u093e\u090a\u0902\u0917\u0940", 89, -1],
      ["\u090f\u0902\u0917\u0940", 88, -1],
      ["\u0906\u090f\u0902\u0917\u0940", 92, -1],
      ["\u093e\u090f\u0902\u0917\u0940", 92, -1],
      ["\u0942\u0902\u0917\u0940", 88, -1],
      ["\u0947\u0902\u0917\u0940", 88, -1],
      ["\u090f\u0917\u0940", 88, -1],
      ["\u0906\u090f\u0917\u0940", 97, -1],
      ["\u093e\u090f\u0917\u0940", 97, -1],
      ["\u0913\u0917\u0940", 88, -1],
      ["\u0906\u0913\u0917\u0940", 100, -1],
      ["\u093e\u0913\u0917\u0940", 100, -1],
      ["\u0947\u0917\u0940", 88, -1],
      ["\u094b\u0917\u0940", 88, -1],
      ["\u0924\u0940", 88, -1, k],
      ["\u0905\u0924\u0940", 105, -1],
      ["\u0906\u0924\u0940", 105, -1],
      ["\u093e\u0924\u0940", 105, -1],
      ["\u0928\u0940", 88, -1, k],
      ["\u0905\u0928\u0940", 109, -1],
      ["\u0941", -1, -1],
      ["\u0942", -1, -1],
      ["\u0947", -1, -1],
      ["\u090f\u0902\u0917\u0947", 113, -1],
      ["\u0906\u090f\u0902\u0917\u0947", 114, -1],
      ["\u093e\u090f\u0902\u0917\u0947", 114, -1],
      ["\u0947\u0902\u0917\u0947", 113, -1],
      ["\u0913\u0917\u0947", 113, -1],
      ["\u0906\u0913\u0917\u0947", 118, -1],
      ["\u093e\u0913\u0917\u0947", 118, -1],
      ["\u094b\u0917\u0947", 113, -1],
      ["\u0924\u0947", 113, -1, k],
      ["\u0905\u0924\u0947", 122, -1],
      ["\u0906\u0924\u0947", 122, -1],
      ["\u093e\u0924\u0947", 122, -1],
      ["\u0928\u0947", 113, -1, k],
      ["\u0905\u0928\u0947", 126, -1],
      ["\u0906\u0928\u0947", 126, -1],
      ["\u093e\u0928\u0947", 126, -1],
      ["\u094b", -1, -1],
      ["\u094d", -1, -1],
    ],
    c = [255, 255, 255, 255, 159, 0, 0, 0, 248, 7];
  this.l = function () {
    if (l.cursor >= l.a) return p;
    l.cursor++;
    l.f = l.cursor;
    l.cursor = l.a;
    l.d = l.cursor;
    if (0 == l.h(h)) return p;
    l.c = l.cursor;
    if (!l.e()) return p;
    l.cursor = l.f;
    return g;
  };
  this.stemWord = function (a) {
    l.p(a);
    this.l();
    return l.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
