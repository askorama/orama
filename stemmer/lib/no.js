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
      ["a", -1, 1],
      ["e", -1, 1],
      ["ede", 1, 1],
      ["ande", 1, 1],
      ["ende", 1, 1],
      ["ane", 1, 1],
      ["ene", 1, 1],
      ["hetene", 6, 1],
      ["erte", 1, 3],
      ["en", -1, 1],
      ["heten", 9, 1],
      ["ar", -1, 1],
      ["er", -1, 1],
      ["heter", 12, 1],
      ["s", -1, 2],
      ["as", 14, 1],
      ["es", 14, 1],
      ["edes", 16, 1],
      ["endes", 16, 1],
      ["enes", 16, 1],
      ["hetenes", 19, 1],
      ["ens", 14, 1],
      ["hetens", 21, 1],
      ["ers", 14, 1],
      ["ets", 14, 1],
      ["et", -1, 1],
      ["het", 25, 1],
      ["ert", -1, 3],
      ["ast", -1, 1],
    ],
    h = [
      ["dt", -1, -1],
      ["vt", -1, -1],
    ],
    c = [
      ["leg", -1, 1],
      ["eleg", 0, 1],
      ["ig", -1, 1],
      ["eig", 2, 1],
      ["lig", 2, 1],
      ["elig", 4, 1],
      ["els", -1, 1],
      ["lov", -1, 1],
      ["elov", 7, 1],
      ["slov", 7, 1],
      ["hetslov", 9, 1],
    ],
    a = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 128],
    d = [119, 125, 149, 1],
    n = 0,
    v = 0;
  this.l = function () {
    var b = k.cursor;
    a: {
      v = k.a;
      var f = k.cursor,
        q = k.cursor + 3;
      if (!(q > k.a)) {
        k.cursor = q;
        n = k.cursor;
        k.cursor = f;
        b: for (;;) {
          f = k.cursor;
          if (k.i(a, 97, 248)) {
            k.cursor = f;
            break b;
          }
          k.cursor = f;
          if (k.cursor >= k.a) break a;
          k.cursor++;
        }
        b: for (;;) {
          if (k.k(a, 97, 248)) break b;
          if (k.cursor >= k.a) break a;
          k.cursor++;
        }
        v = k.cursor;
        v < n && (v = n);
      }
    }
    k.cursor = b;
    k.f = k.cursor;
    k.cursor = k.a;
    b = k.a - k.cursor;
    if (!(k.cursor < v))
      if (((q = k.f), (k.f = v), (k.d = k.cursor), (f = k.h(l)), 0 == f)) k.f = q;
      else
        switch (((k.c = k.cursor), (k.f = q), f)) {
          case 1:
            if (!k.e()) break;
            break;
          case 2:
            a: {
              f = k.a - k.cursor;
              if (k.n(d, 98, 122)) break a;
              k.cursor = k.a - f;
              if (!k.g("k") || !k.q(a, 97, 248)) break;
            }
            if (!k.e()) break;
            break;
          case 3:
            k.b("er");
        }
    k.cursor = k.a - b;
    b = k.a - k.cursor;
    f = k.a - k.cursor;
    k.cursor < v ||
      ((q = k.f),
      (k.f = v),
      (k.d = k.cursor),
      0 == k.h(h)
        ? (k.f = q)
        : ((k.c = k.cursor),
          (k.f = q),
          (k.cursor = k.a - f),
          k.cursor <= k.f || (k.cursor--, (k.c = k.cursor), k.e())));
    k.cursor = k.a - b;
    b = k.a - k.cursor;
    k.cursor < v ||
      ((f = k.f), (k.f = v), (k.d = k.cursor), 0 == k.h(c) ? (k.f = f) : ((k.c = k.cursor), (k.f = f), k.e()));
    k.cursor = k.a - b;
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
