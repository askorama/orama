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
  var k = new C(),
    l = [
      ["\u0932\u093e\u0907", -1, 1],
      ["\u0932\u093e\u0908", -1, 1],
      ["\u0938\u0901\u0917", -1, 1],
      ["\u0938\u0902\u0917", -1, 1],
      ["\u092e\u093e\u0930\u094d\u092b\u0924", -1, 1],
      ["\u0930\u0924", -1, 1],
      ["\u0915\u093e", -1, 2],
      ["\u092e\u093e", -1, 1],
      ["\u0926\u094d\u0935\u093e\u0930\u093e", -1, 1],
      ["\u0915\u093f", -1, 2],
      ["\u092a\u091b\u093f", -1, 1],
      ["\u0915\u0940", -1, 2],
      ["\u0932\u0947", -1, 1],
      ["\u0915\u0948", -1, 2],
      ["\u0938\u0901\u0917\u0948", -1, 1],
      ["\u092e\u0948", -1, 1],
      ["\u0915\u094b", -1, 2],
    ],
    h = [
      ["\u0901", -1, -1],
      ["\u0902", -1, -1],
      ["\u0948", -1, -1],
    ],
    c = [
      ["\u0901", -1, 1],
      ["\u0902", -1, 1],
      ["\u0948", -1, 2],
    ],
    a = [
      ["\u0925\u093f\u090f", -1, 1],
      ["\u091b", -1, 1],
      ["\u0907\u091b", 1, 1],
      ["\u090f\u091b", 1, 1],
      ["\u093f\u091b", 1, 1],
      ["\u0947\u091b", 1, 1],
      ["\u0928\u0947\u091b", 5, 1],
      ["\u0939\u0941\u0928\u0947\u091b", 6, 1],
      ["\u0907\u0928\u094d\u091b", 1, 1],
      ["\u093f\u0928\u094d\u091b", 1, 1],
      ["\u0939\u0941\u0928\u094d\u091b", 1, 1],
      ["\u090f\u0915\u093e", -1, 1],
      ["\u0907\u090f\u0915\u093e", 11, 1],
      ["\u093f\u090f\u0915\u093e", 11, 1],
      ["\u0947\u0915\u093e", -1, 1],
      ["\u0928\u0947\u0915\u093e", 14, 1],
      ["\u0926\u093e", -1, 1],
      ["\u0907\u0926\u093e", 16, 1],
      ["\u093f\u0926\u093e", 16, 1],
      ["\u0926\u0947\u0916\u093f", -1, 1],
      ["\u092e\u093e\u0925\u093f", -1, 1],
      ["\u090f\u0915\u0940", -1, 1],
      ["\u0907\u090f\u0915\u0940", 21, 1],
      ["\u093f\u090f\u0915\u0940", 21, 1],
      ["\u0947\u0915\u0940", -1, 1],
      ["\u0926\u0947\u0916\u0940", -1, 1],
      ["\u0925\u0940", -1, 1],
      ["\u0926\u0940", -1, 1],
      ["\u091b\u0941", -1, 1],
      ["\u090f\u091b\u0941", 28, 1],
      ["\u0947\u091b\u0941", 28, 1],
      ["\u0928\u0947\u091b\u0941", 30, 1],
      ["\u0928\u0941", -1, 1],
      ["\u0939\u0930\u0941", -1, 1],
      ["\u0939\u0930\u0942", -1, 1],
      ["\u091b\u0947", -1, 1],
      ["\u0925\u0947", -1, 1],
      ["\u0928\u0947", -1, 1],
      ["\u090f\u0915\u0948", -1, 1],
      ["\u0947\u0915\u0948", -1, 1],
      ["\u0928\u0947\u0915\u0948", 39, 1],
      ["\u0926\u0948", -1, 1],
      ["\u0907\u0926\u0948", 41, 1],
      ["\u093f\u0926\u0948", 41, 1],
      ["\u090f\u0915\u094b", -1, 1],
      ["\u0907\u090f\u0915\u094b", 44, 1],
      ["\u093f\u090f\u0915\u094b", 44, 1],
      ["\u0947\u0915\u094b", -1, 1],
      ["\u0928\u0947\u0915\u094b", 47, 1],
      ["\u0926\u094b", -1, 1],
      ["\u0907\u0926\u094b", 49, 1],
      ["\u093f\u0926\u094b", 49, 1],
      ["\u092f\u094b", -1, 1],
      ["\u0907\u092f\u094b", 52, 1],
      ["\u092d\u092f\u094b", 52, 1],
      ["\u093f\u092f\u094b", 52, 1],
      ["\u0925\u093f\u092f\u094b", 55, 1],
      ["\u0926\u093f\u092f\u094b", 55, 1],
      ["\u0925\u094d\u092f\u094b", 52, 1],
      ["\u091b\u094c", -1, 1],
      ["\u0907\u091b\u094c", 59, 1],
      ["\u090f\u091b\u094c", 59, 1],
      ["\u093f\u091b\u094c", 59, 1],
      ["\u0947\u091b\u094c", 59, 1],
      ["\u0928\u0947\u091b\u094c", 63, 1],
      ["\u092f\u094c", -1, 1],
      ["\u0925\u093f\u092f\u094c", 65, 1],
      ["\u091b\u094d\u092f\u094c", 65, 1],
      ["\u0925\u094d\u092f\u094c", 65, 1],
      ["\u091b\u0928\u094d", -1, 1],
      ["\u0907\u091b\u0928\u094d", 69, 1],
      ["\u090f\u091b\u0928\u094d", 69, 1],
      ["\u093f\u091b\u0928\u094d", 69, 1],
      ["\u0947\u091b\u0928\u094d", 69, 1],
      ["\u0928\u0947\u091b\u0928\u094d", 73, 1],
      ["\u0932\u093e\u0928\u094d", -1, 1],
      ["\u091b\u093f\u0928\u094d", -1, 1],
      ["\u0925\u093f\u0928\u094d", -1, 1],
      ["\u092a\u0930\u094d", -1, 1],
      ["\u0907\u0938\u094d", -1, 1],
      ["\u0925\u093f\u0907\u0938\u094d", 79, 1],
      ["\u091b\u0938\u094d", -1, 1],
      ["\u0907\u091b\u0938\u094d", 81, 1],
      ["\u090f\u091b\u0938\u094d", 81, 1],
      ["\u093f\u091b\u0938\u094d", 81, 1],
      ["\u0947\u091b\u0938\u094d", 81, 1],
      ["\u0928\u0947\u091b\u0938\u094d", 85, 1],
      ["\u093f\u0938\u094d", -1, 1],
      ["\u0925\u093f\u0938\u094d", 87, 1],
      ["\u091b\u0947\u0938\u094d", -1, 1],
      ["\u0939\u094b\u0938\u094d", -1, 1],
    ];
  this.l = function () {
    k.f = k.cursor;
    k.cursor = k.a;
    var d = k.a - k.cursor,
      n;
    k.d = k.cursor;
    n = k.h(l);
    if (0 != n)
      switch (((k.c = k.cursor), n)) {
        case 1:
          if (!k.e()) break;
          break;
        case 2:
          a: {
            n = k.a - k.cursor;
            b: {
              c: {
                var v = k.a - k.cursor;
                if (k.g("\u090f")) break c;
                k.cursor = k.a - v;
                if (!k.g("\u0947")) break b;
              }
              break a;
            }
            k.cursor = k.a - n;
            k.e();
          }
      }
    k.cursor = k.a - d;
    d = k.a - k.cursor;
    for (;;) {
      n = k.a - k.cursor;
      v = k.a - k.cursor;
      var b = k.a - k.cursor,
        f;
      k.d = k.cursor;
      0 == k.h(h) ? (f = p) : ((k.c = k.cursor), (f = g));
      if (f && ((k.cursor = k.a - b), (b = void 0), (k.d = k.cursor), (b = k.h(c)), 0 != b))
        switch (((k.c = k.cursor), b)) {
          case 1:
            d: {
              b = k.a - k.cursor;
              if (k.g("\u092f\u094c")) break d;
              k.cursor = k.a - b;
              if (k.g("\u091b\u094c")) break d;
              k.cursor = k.a - b;
              if (k.g("\u0928\u094c")) break d;
              k.cursor = k.a - b;
              if (!k.g("\u0925\u0947")) break;
            }
            if (!k.e()) break;
            break;
          case 2:
            !k.g("\u0924\u094d\u0930") || k.e();
        }
      k.cursor = k.a - v;
      k.d = k.cursor;
      0 == k.h(a) ? (v = p) : ((k.c = k.cursor), (v = !k.e() ? p : g));
      if (v) continue;
      k.cursor = k.a - n;
      break;
    }
    k.cursor = k.a - d;
    k.cursor = k.f;
    return g;
  };
  this.stemWord = function (a) {
    k.p(a);
    this.l();
    return k.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
