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
    for (var b = a.cursor; ; ) {
      var c = a.cursor;
      a: {
        b: {
          var d = a.cursor;
          a.c = a.cursor;
          if (a.m("\u00df")) {
            a.d = a.cursor;
            if (!a.b("ss")) return;
            break b;
          }
          a.cursor = d;
          if (a.cursor >= a.a) break a;
          a.cursor++;
        }
        continue;
      }
      a.cursor = c;
      break;
    }
    for (a.cursor = b; ; ) {
      b = a.cursor;
      a: {
        b: for (;;) {
          c = a.cursor;
          c: if (a.i(q, 97, 252)) {
            a.c = a.cursor;
            d: {
              d = a.cursor;
              if (a.m("u") && ((a.d = a.cursor), a.i(q, 97, 252))) {
                if (!a.b("U")) return;
                break d;
              }
              a.cursor = d;
              if (!a.m("y")) break c;
              a.d = a.cursor;
              if (!a.i(q, 97, 252)) break c;
              if (!a.b("Y")) return;
            }
            a.cursor = c;
            break b;
          }
          a.cursor = c;
          if (a.cursor >= a.a) break a;
          a.cursor++;
        }
        continue;
      }
      a.cursor = b;
      break;
    }
  }
  function l() {
    m = w = a.a;
    var b = a.cursor,
      c = a.cursor + 3;
    if (!(c > a.a)) {
      a.cursor = c;
      r = a.cursor;
      a.cursor = b;
      a: for (;;) {
        if (a.i(q, 97, 252)) break a;
        if (a.cursor >= a.a) return;
        a.cursor++;
      }
      a: for (;;) {
        if (a.k(q, 97, 252)) break a;
        if (a.cursor >= a.a) return;
        a.cursor++;
      }
      w = a.cursor;
      w < r && (w = r);
      a: for (;;) {
        if (a.i(q, 97, 252)) break a;
        if (a.cursor >= a.a) return;
        a.cursor++;
      }
      a: for (;;) {
        if (a.k(q, 97, 252)) break a;
        if (a.cursor >= a.a) return;
        a.cursor++;
      }
      m = a.cursor;
    }
  }
  function h() {
    for (var b; ; ) {
      var c = a.cursor;
      a: if (((a.c = a.cursor), (b = a.o(d)), 0 != b)) {
        a.d = a.cursor;
        switch (b) {
          case 1:
            if (!a.b("y")) return;
            break;
          case 2:
            if (!a.b("u")) return;
            break;
          case 3:
            if (!a.b("a")) return;
            break;
          case 4:
            if (!a.b("o")) return;
            break;
          case 5:
            if (a.cursor >= a.a) break a;
            a.cursor++;
        }
        continue;
      }
      a.cursor = c;
      break;
    }
  }
  function c() {
    var c,
      d = a.a - a.cursor;
    a: if (((a.d = a.cursor), (c = a.h(n)), 0 != c && ((a.c = a.cursor), w <= a.cursor)))
      switch (c) {
        case 1:
          if (!a.e()) return;
          break;
        case 2:
          if (!a.e()) return;
          c = a.a - a.cursor;
          a.d = a.cursor;
          if (a.g("s"))
            if (((a.c = a.cursor), a.g("nis"))) {
              if (!a.e()) return;
            } else a.cursor = a.a - c;
          else a.cursor = a.a - c;
          break;
        case 3:
          if (!a.n(t, 98, 116)) break a;
          if (!a.e()) return;
      }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), (c = a.h(v)), 0 != c && ((a.c = a.cursor), w <= a.cursor)))
      switch (c) {
        case 1:
          if (!a.e()) return;
          break;
        case 2:
          if (!a.n(s, 98, 116)) break a;
          c = a.cursor - 3;
          if (c < a.f) break a;
          a.cursor = c;
          if (!a.e()) return;
      }
    a.cursor = a.a - d;
    d = a.a - a.cursor;
    a: if (((a.d = a.cursor), (c = a.h(f)), 0 != c && ((a.c = a.cursor), m <= a.cursor)))
      switch (c) {
        case 1:
          if (!a.e()) return;
          c = a.a - a.cursor;
          b: if (((a.d = a.cursor), a.g("ig"))) {
            a.c = a.cursor;
            var h = a.a - a.cursor;
            if (a.g("e")) {
              a.cursor = a.a - c;
              break b;
            }
            a.cursor = a.a - h;
            if (m <= a.cursor) {
              if (!a.e()) return;
            } else a.cursor = a.a - c;
          } else a.cursor = a.a - c;
          break;
        case 2:
          c = a.a - a.cursor;
          if (a.g("e")) break a;
          a.cursor = a.a - c;
          if (!a.e()) return;
          break;
        case 3:
          if (!a.e()) return;
          c = a.a - a.cursor;
          b: {
            a.d = a.cursor;
            c: {
              h = a.a - a.cursor;
              if (a.g("er")) break c;
              a.cursor = a.a - h;
              if (!a.g("en")) {
                a.cursor = a.a - c;
                break b;
              }
            }
            a.c = a.cursor;
            if (w <= a.cursor) {
              if (!a.e()) return;
            } else a.cursor = a.a - c;
          }
          break;
        case 4:
          if (!a.e()) return;
          c = a.a - a.cursor;
          a.d = a.cursor;
          if (0 == a.h(b)) a.cursor = a.a - c;
          else if (((a.c = a.cursor), m <= a.cursor)) {
            if (!a.e()) return;
          } else a.cursor = a.a - c;
      }
    a.cursor = a.a - d;
  }
  var a = new C(),
    d = [
      ["", -1, 5],
      ["U", 0, 2],
      ["Y", 0, 1],
      ["\u00e4", 0, 3],
      ["\u00f6", 0, 4],
      ["\u00fc", 0, 2],
    ],
    n = [
      ["e", -1, 2],
      ["em", -1, 1],
      ["en", -1, 2],
      ["ern", -1, 1],
      ["er", -1, 1],
      ["s", -1, 3],
      ["es", 5, 2],
    ],
    v = [
      ["en", -1, 1],
      ["er", -1, 1],
      ["st", -1, 2],
      ["est", 2, 1],
    ],
    b = [
      ["ig", -1, 1],
      ["lich", -1, 1],
    ],
    f = [
      ["end", -1, 1],
      ["ig", -1, 2],
      ["ung", -1, 1],
      ["lich", -1, 3],
      ["isch", -1, 2],
      ["ik", -1, 2],
      ["heit", -1, 3],
      ["keit", -1, 4],
    ],
    q = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32, 8],
    t = [117, 30, 5],
    s = [117, 30, 4],
    r = 0,
    m = 0,
    w = 0;
  this.l = function () {
    var b = a.cursor;
    k();
    a.cursor = b;
    b = a.cursor;
    l();
    a.cursor = b;
    a.f = a.cursor;
    a.cursor = a.a;
    c();
    a.cursor = a.f;
    b = a.cursor;
    h();
    a.cursor = b;
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
