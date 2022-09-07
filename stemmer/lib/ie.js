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
      ["b'", -1, 1],
      ["bh", -1, 4],
      ["bhf", 1, 2],
      ["bp", -1, 8],
      ["ch", -1, 5],
      ["d'", -1, 1],
      ["d'fh", 5, 2],
      ["dh", -1, 6],
      ["dt", -1, 9],
      ["fh", -1, 2],
      ["gc", -1, 5],
      ["gh", -1, 7],
      ["h-", -1, 1],
      ["m'", -1, 1],
      ["mb", -1, 4],
      ["mh", -1, 10],
      ["n-", -1, 1],
      ["nd", -1, 6],
      ["ng", -1, 7],
      ["ph", -1, 8],
      ["sh", -1, 3],
      ["t-", -1, 1],
      ["th", -1, 9],
      ["ts", -1, 3],
    ],
    h = [
      ["\u00edochta", -1, 1],
      ["a\u00edochta", 0, 1],
      ["ire", -1, 2],
      ["aire", 2, 2],
      ["abh", -1, 1],
      ["eabh", 4, 1],
      ["ibh", -1, 1],
      ["aibh", 6, 1],
      ["amh", -1, 1],
      ["eamh", 8, 1],
      ["imh", -1, 1],
      ["aimh", 10, 1],
      ["\u00edocht", -1, 1],
      ["a\u00edocht", 12, 1],
      ["ir\u00ed", -1, 2],
      ["air\u00ed", 14, 2],
    ],
    c = [
      ["\u00f3ideacha", -1, 6],
      ["patacha", -1, 5],
      ["achta", -1, 1],
      ["arcachta", 2, 2],
      ["eachta", 2, 1],
      ["grafa\u00edochta", -1, 4],
      ["paite", -1, 5],
      ["ach", -1, 1],
      ["each", 7, 1],
      ["\u00f3ideach", 8, 6],
      ["gineach", 8, 3],
      ["patach", 7, 5],
      ["grafa\u00edoch", -1, 4],
      ["pataigh", -1, 5],
      ["\u00f3idigh", -1, 6],
      ["acht\u00fail", -1, 1],
      ["eacht\u00fail", 15, 1],
      ["gineas", -1, 3],
      ["ginis", -1, 3],
      ["acht", -1, 1],
      ["arcacht", 19, 2],
      ["eacht", 19, 1],
      ["grafa\u00edocht", -1, 4],
      ["arcachta\u00ed", -1, 2],
      ["grafa\u00edochta\u00ed", -1, 4],
    ],
    a = [
      ["imid", -1, 1],
      ["aimid", 0, 1],
      ["\u00edmid", -1, 1],
      ["a\u00edmid", 2, 1],
      ["adh", -1, 2],
      ["eadh", 4, 2],
      ["faidh", -1, 1],
      ["fidh", -1, 1],
      ["\u00e1il", -1, 2],
      ["ain", -1, 2],
      ["tear", -1, 2],
      ["tar", -1, 2],
    ],
    d = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 4, 2],
    n = 0,
    v = 0,
    b = 0;
  this.l = function () {
    var f = k.cursor,
      q;
    k.c = k.cursor;
    q = k.o(l);
    if (0 != q)
      switch (((k.d = k.cursor), q)) {
        case 1:
          if (!k.e()) break;
          break;
        case 2:
          if (!k.b("f")) break;
          break;
        case 3:
          if (!k.b("s")) break;
          break;
        case 4:
          if (!k.b("b")) break;
          break;
        case 5:
          if (!k.b("c")) break;
          break;
        case 6:
          if (!k.b("d")) break;
          break;
        case 7:
          if (!k.b("g")) break;
          break;
        case 8:
          if (!k.b("p")) break;
          break;
        case 9:
          if (!k.b("t")) break;
          break;
        case 10:
          k.b("m");
      }
    k.cursor = f;
    n = v = b = k.a;
    f = k.cursor;
    a: {
      b: for (;;) {
        if (k.i(d, 97, 250)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      b = k.cursor;
      b: for (;;) {
        if (k.k(d, 97, 250)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      v = k.cursor;
      b: for (;;) {
        if (k.i(d, 97, 250)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      b: for (;;) {
        if (k.k(d, 97, 250)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      n = k.cursor;
    }
    k.cursor = f;
    k.f = k.cursor;
    k.cursor = k.a;
    f = k.a - k.cursor;
    k.d = k.cursor;
    q = k.h(h);
    if (0 != q)
      switch (((k.c = k.cursor), q)) {
        case 1:
          if (!(v <= k.cursor) || !k.e()) break;
          break;
        case 2:
          !(n <= k.cursor) || k.e();
      }
    k.cursor = k.a - f;
    f = k.a - k.cursor;
    k.d = k.cursor;
    q = k.h(c);
    if (0 != q)
      switch (((k.c = k.cursor), q)) {
        case 1:
          if (!(n <= k.cursor) || !k.e()) break;
          break;
        case 2:
          if (!k.b("arc")) break;
          break;
        case 3:
          if (!k.b("gin")) break;
          break;
        case 4:
          if (!k.b("graf")) break;
          break;
        case 5:
          if (!k.b("paite")) break;
          break;
        case 6:
          k.b("\u00f3id");
      }
    k.cursor = k.a - f;
    f = k.a - k.cursor;
    k.d = k.cursor;
    q = k.h(a);
    if (0 != q)
      switch (((k.c = k.cursor), q)) {
        case 1:
          if (!(b <= k.cursor) || !k.e()) break;
          break;
        case 2:
          !(v <= k.cursor) || k.e();
      }
    k.cursor = k.a - f;
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
