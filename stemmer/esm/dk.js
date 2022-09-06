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
    var a = l.a - l.cursor;
    if (!(l.cursor < f)) {
      var b = l.f;
      l.f = f;
      l.d = l.cursor;
      0 == l.h(c)
        ? (l.f = b)
        : ((l.c = l.cursor), (l.f = b), (l.cursor = l.a - a), l.cursor <= l.f || (l.cursor--, (l.c = l.cursor), l.e()));
    }
  }
  var l = new C(),
    h = [
      ["hed", -1, 1],
      ["ethed", 0, 1],
      ["ered", -1, 1],
      ["e", -1, 1],
      ["erede", 3, 1],
      ["ende", 3, 1],
      ["erende", 5, 1],
      ["ene", 3, 1],
      ["erne", 3, 1],
      ["ere", 3, 1],
      ["en", -1, 1],
      ["heden", 10, 1],
      ["eren", 10, 1],
      ["er", -1, 1],
      ["heder", 13, 1],
      ["erer", 13, 1],
      ["s", -1, 2],
      ["heds", 16, 1],
      ["es", 16, 1],
      ["endes", 18, 1],
      ["erendes", 19, 1],
      ["enes", 18, 1],
      ["ernes", 18, 1],
      ["eres", 18, 1],
      ["ens", 16, 1],
      ["hedens", 24, 1],
      ["erens", 24, 1],
      ["ers", 16, 1],
      ["ets", 16, 1],
      ["erets", 28, 1],
      ["et", -1, 1],
      ["eret", 30, 1],
    ],
    c = [
      ["gd", -1, -1],
      ["dt", -1, -1],
      ["gt", -1, -1],
      ["kt", -1, -1],
    ],
    a = [
      ["ig", -1, 1],
      ["lig", 0, 1],
      ["elig", 1, 1],
      ["els", -1, 1],
      ["l\u00f8st", -1, 2],
    ],
    d = [119, 223, 119, 1],
    n = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 128],
    v = [239, 254, 42, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16],
    b = 0,
    f = 0,
    q = "";
  this.l = function () {
    var c = l.cursor;
    a: {
      f = l.a;
      var s = l.cursor,
        r = l.cursor + 3;
      if (!(r > l.a)) {
        l.cursor = r;
        b = l.cursor;
        l.cursor = s;
        b: for (;;) {
          s = l.cursor;
          if (l.i(n, 97, 248)) {
            l.cursor = s;
            break b;
          }
          l.cursor = s;
          if (l.cursor >= l.a) break a;
          l.cursor++;
        }
        b: for (;;) {
          if (l.k(n, 97, 248)) break b;
          if (l.cursor >= l.a) break a;
          l.cursor++;
        }
        f = l.cursor;
        f < b && (f = b);
      }
    }
    l.cursor = c;
    l.f = l.cursor;
    l.cursor = l.a;
    c = l.a - l.cursor;
    if (!(l.cursor < f))
      if (((r = l.f), (l.f = f), (l.d = l.cursor), (s = l.h(h)), 0 == s)) l.f = r;
      else
        switch (((l.c = l.cursor), (l.f = r), s)) {
          case 1:
            if (!l.e()) break;
            break;
          case 2:
            !l.n(v, 97, 229) || l.e();
        }
    l.cursor = l.a - c;
    c = l.a - l.cursor;
    k();
    l.cursor = l.a - c;
    c = l.a - l.cursor;
    a: {
      s = l.a - l.cursor;
      l.d = l.cursor;
      if (l.g("st") && ((l.c = l.cursor), l.g("ig") && !l.e())) break a;
      l.cursor = l.a - s;
      if (!(l.cursor < f))
        if (((r = l.f), (l.f = f), (l.d = l.cursor), (s = l.h(a)), 0 == s)) l.f = r;
        else
          switch (((l.c = l.cursor), (l.f = r), s)) {
            case 1:
              if (!l.e()) break;
              s = l.a - l.cursor;
              k();
              l.cursor = l.a - s;
              break;
            case 2:
              l.b("l\u00f8s");
          }
    }
    l.cursor = l.a - c;
    c = l.a - l.cursor;
    l.cursor < f ||
      ((s = l.f),
      (l.f = f),
      (l.d = l.cursor),
      l.n(d, 98, 122) ? ((l.c = l.cursor), (q = l.u()), "" != q && ((l.f = s), !l.g(q) || l.e())) : (l.f = s));
    l.cursor = l.a - c;
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
