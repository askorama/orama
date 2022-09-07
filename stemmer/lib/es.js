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
    for (var a; ; ) {
      var b = d.cursor;
      a: if (((d.c = d.cursor), (a = d.o(n)), 0 != a)) {
        d.d = d.cursor;
        switch (a) {
          case 1:
            if (!d.b("a")) return;
            break;
          case 2:
            if (!d.b("e")) return;
            break;
          case 3:
            if (!d.b("i")) return;
            break;
          case 4:
            if (!d.b("o")) return;
            break;
          case 5:
            if (!d.b("u")) return;
            break;
          case 6:
            if (d.cursor >= d.a) break a;
            d.cursor++;
        }
        continue;
      }
      d.cursor = b;
      break;
    }
  }
  function l() {
    return !(e <= d.cursor) ? p : g;
  }
  function h() {
    return !(y <= d.cursor) ? p : g;
  }
  function c() {
    var a;
    d.d = d.cursor;
    a = d.h(s);
    if (0 == a) return p;
    d.c = d.cursor;
    switch (a) {
      case 1:
        if (!h() || !d.e()) return p;
        break;
      case 2:
        if (!h() || !d.e()) return p;
        a = d.a - d.cursor;
        d.d = d.cursor;
        if (d.g("ic"))
          if (((d.c = d.cursor), h())) {
            if (!d.e()) return p;
          } else d.cursor = d.a - a;
        else d.cursor = d.a - a;
        break;
      case 3:
        if (!h() || !d.b("log")) return p;
        break;
      case 4:
        if (!h() || !d.b("u")) return p;
        break;
      case 5:
        if (!h() || !d.b("ente")) return p;
        break;
      case 6:
        if (!(z <= d.cursor) || !d.e()) return p;
        var b = d.a - d.cursor;
        a: if (((d.d = d.cursor), (a = d.h(f)), 0 == a)) d.cursor = d.a - b;
        else if (((d.c = d.cursor), h())) {
          if (!d.e()) return p;
          switch (a) {
            case 1:
              d.d = d.cursor;
              if (!d.g("at")) {
                d.cursor = d.a - b;
                break a;
              }
              d.c = d.cursor;
              if (!h()) {
                d.cursor = d.a - b;
                break a;
              }
              if (!d.e()) return p;
          }
        } else d.cursor = d.a - b;
        break;
      case 7:
        if (!h() || !d.e()) return p;
        a = d.a - d.cursor;
        d.d = d.cursor;
        if (0 == d.h(q)) d.cursor = d.a - a;
        else if (((d.c = d.cursor), h())) {
          if (!d.e()) return p;
        } else d.cursor = d.a - a;
        break;
      case 8:
        if (!h() || !d.e()) return p;
        a = d.a - d.cursor;
        d.d = d.cursor;
        if (0 == d.h(t)) d.cursor = d.a - a;
        else if (((d.c = d.cursor), h())) {
          if (!d.e()) return p;
        } else d.cursor = d.a - a;
        break;
      case 9:
        if (!h() || !d.e()) return p;
        a = d.a - d.cursor;
        d.d = d.cursor;
        if (d.g("at"))
          if (((d.c = d.cursor), h())) {
            if (!d.e()) return p;
          } else d.cursor = d.a - a;
        else d.cursor = d.a - a;
    }
    return g;
  }
  function a() {
    if (d.cursor < e) return p;
    var a = d.f;
    d.f = e;
    d.d = d.cursor;
    if (0 == d.h(r)) return (d.f = a), p;
    d.c = d.cursor;
    d.f = a;
    return !d.g("u") || !d.e() ? p : g;
  }
  var d = new C(),
    n = [
      ["", -1, 6],
      ["\u00e1", 0, 1],
      ["\u00e9", 0, 2],
      ["\u00ed", 0, 3],
      ["\u00f3", 0, 4],
      ["\u00fa", 0, 5],
    ],
    v = [
      ["la", -1, -1],
      ["sela", 0, -1],
      ["le", -1, -1],
      ["me", -1, -1],
      ["se", -1, -1],
      ["lo", -1, -1],
      ["selo", 5, -1],
      ["las", -1, -1],
      ["selas", 7, -1],
      ["les", -1, -1],
      ["los", -1, -1],
      ["selos", 10, -1],
      ["nos", -1, -1],
    ],
    b = [
      ["ando", -1, 6],
      ["iendo", -1, 6],
      ["yendo", -1, 7],
      ["\u00e1ndo", -1, 2],
      ["i\u00e9ndo", -1, 1],
      ["ar", -1, 6],
      ["er", -1, 6],
      ["ir", -1, 6],
      ["\u00e1r", -1, 3],
      ["\u00e9r", -1, 4],
      ["\u00edr", -1, 5],
    ],
    f = [
      ["ic", -1, -1],
      ["ad", -1, -1],
      ["os", -1, -1],
      ["iv", -1, 1],
    ],
    q = [
      ["able", -1, 1],
      ["ible", -1, 1],
      ["ante", -1, 1],
    ],
    t = [
      ["ic", -1, 1],
      ["abil", -1, 1],
      ["iv", -1, 1],
    ],
    s = [
      ["ica", -1, 1],
      ["ancia", -1, 2],
      ["encia", -1, 5],
      ["adora", -1, 2],
      ["osa", -1, 1],
      ["ista", -1, 1],
      ["iva", -1, 9],
      ["anza", -1, 1],
      ["log\u00eda", -1, 3],
      ["idad", -1, 8],
      ["able", -1, 1],
      ["ible", -1, 1],
      ["ante", -1, 2],
      ["mente", -1, 7],
      ["amente", 13, 6],
      ["aci\u00f3n", -1, 2],
      ["uci\u00f3n", -1, 4],
      ["ico", -1, 1],
      ["ismo", -1, 1],
      ["oso", -1, 1],
      ["amiento", -1, 1],
      ["imiento", -1, 1],
      ["ivo", -1, 9],
      ["ador", -1, 2],
      ["icas", -1, 1],
      ["ancias", -1, 2],
      ["encias", -1, 5],
      ["adoras", -1, 2],
      ["osas", -1, 1],
      ["istas", -1, 1],
      ["ivas", -1, 9],
      ["anzas", -1, 1],
      ["log\u00edas", -1, 3],
      ["idades", -1, 8],
      ["ables", -1, 1],
      ["ibles", -1, 1],
      ["aciones", -1, 2],
      ["uciones", -1, 4],
      ["adores", -1, 2],
      ["antes", -1, 2],
      ["icos", -1, 1],
      ["ismos", -1, 1],
      ["osos", -1, 1],
      ["amientos", -1, 1],
      ["imientos", -1, 1],
      ["ivos", -1, 9],
    ],
    r = [
      ["ya", -1, 1],
      ["ye", -1, 1],
      ["yan", -1, 1],
      ["yen", -1, 1],
      ["yeron", -1, 1],
      ["yendo", -1, 1],
      ["yo", -1, 1],
      ["yas", -1, 1],
      ["yes", -1, 1],
      ["yais", -1, 1],
      ["yamos", -1, 1],
      ["y\u00f3", -1, 1],
    ],
    m = [
      ["aba", -1, 2],
      ["ada", -1, 2],
      ["ida", -1, 2],
      ["ara", -1, 2],
      ["iera", -1, 2],
      ["\u00eda", -1, 2],
      ["ar\u00eda", 5, 2],
      ["er\u00eda", 5, 2],
      ["ir\u00eda", 5, 2],
      ["ad", -1, 2],
      ["ed", -1, 2],
      ["id", -1, 2],
      ["ase", -1, 2],
      ["iese", -1, 2],
      ["aste", -1, 2],
      ["iste", -1, 2],
      ["an", -1, 2],
      ["aban", 16, 2],
      ["aran", 16, 2],
      ["ieran", 16, 2],
      ["\u00edan", 16, 2],
      ["ar\u00edan", 20, 2],
      ["er\u00edan", 20, 2],
      ["ir\u00edan", 20, 2],
      ["en", -1, 1],
      ["asen", 24, 2],
      ["iesen", 24, 2],
      ["aron", -1, 2],
      ["ieron", -1, 2],
      ["ar\u00e1n", -1, 2],
      ["er\u00e1n", -1, 2],
      ["ir\u00e1n", -1, 2],
      ["ado", -1, 2],
      ["ido", -1, 2],
      ["ando", -1, 2],
      ["iendo", -1, 2],
      ["ar", -1, 2],
      ["er", -1, 2],
      ["ir", -1, 2],
      ["as", -1, 2],
      ["abas", 39, 2],
      ["adas", 39, 2],
      ["idas", 39, 2],
      ["aras", 39, 2],
      ["ieras", 39, 2],
      ["\u00edas", 39, 2],
      ["ar\u00edas", 45, 2],
      ["er\u00edas", 45, 2],
      ["ir\u00edas", 45, 2],
      ["es", -1, 1],
      ["ases", 49, 2],
      ["ieses", 49, 2],
      ["abais", -1, 2],
      ["arais", -1, 2],
      ["ierais", -1, 2],
      ["\u00edais", -1, 2],
      ["ar\u00edais", 55, 2],
      ["er\u00edais", 55, 2],
      ["ir\u00edais", 55, 2],
      ["aseis", -1, 2],
      ["ieseis", -1, 2],
      ["asteis", -1, 2],
      ["isteis", -1, 2],
      ["\u00e1is", -1, 2],
      ["\u00e9is", -1, 1],
      ["ar\u00e9is", 64, 2],
      ["er\u00e9is", 64, 2],
      ["ir\u00e9is", 64, 2],
      ["ados", -1, 2],
      ["idos", -1, 2],
      ["amos", -1, 2],
      ["\u00e1bamos", 70, 2],
      ["\u00e1ramos", 70, 2],
      ["i\u00e9ramos", 70, 2],
      ["\u00edamos", 70, 2],
      ["ar\u00edamos", 74, 2],
      ["er\u00edamos", 74, 2],
      ["ir\u00edamos", 74, 2],
      ["emos", -1, 1],
      ["aremos", 78, 2],
      ["eremos", 78, 2],
      ["iremos", 78, 2],
      ["\u00e1semos", 78, 2],
      ["i\u00e9semos", 78, 2],
      ["imos", -1, 2],
      ["ar\u00e1s", -1, 2],
      ["er\u00e1s", -1, 2],
      ["ir\u00e1s", -1, 2],
      ["\u00eds", -1, 2],
      ["ar\u00e1", -1, 2],
      ["er\u00e1", -1, 2],
      ["ir\u00e1", -1, 2],
      ["ar\u00e9", -1, 2],
      ["er\u00e9", -1, 2],
      ["ir\u00e9", -1, 2],
      ["i\u00f3", -1, 2],
    ],
    w = [
      ["a", -1, 1],
      ["e", -1, 2],
      ["o", -1, 1],
      ["os", -1, 1],
      ["\u00e1", -1, 1],
      ["\u00e9", -1, 2],
      ["\u00ed", -1, 1],
      ["\u00f3", -1, 1],
    ],
    u = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 4, 10],
    y = 0,
    z = 0,
    e = 0;
  this.l = function () {
    y = z = e = d.a;
    var f = d.cursor;
    a: {
      b: {
        var h = d.cursor;
        c: if (d.i(u, 97, 252)) {
          d: {
            var n = d.cursor;
            e: if (d.k(u, 97, 252)) {
              f: for (;;) {
                if (d.i(u, 97, 252)) break f;
                if (d.cursor >= d.a) break e;
                d.cursor++;
              }
              break d;
            }
            d.cursor = n;
            if (!d.i(u, 97, 252)) break c;
            e: for (;;) {
              if (d.k(u, 97, 252)) break e;
              if (d.cursor >= d.a) break c;
              d.cursor++;
            }
          }
          break b;
        }
        d.cursor = h;
        if (!d.k(u, 97, 252)) break a;
        c: {
          h = d.cursor;
          d: if (d.k(u, 97, 252)) {
            e: for (;;) {
              if (d.i(u, 97, 252)) break e;
              if (d.cursor >= d.a) break d;
              d.cursor++;
            }
            break c;
          }
          d.cursor = h;
          if (!d.i(u, 97, 252)) break a;
          if (d.cursor >= d.a) break a;
          d.cursor++;
        }
      }
      e = d.cursor;
    }
    d.cursor = f;
    f = d.cursor;
    a: {
      b: for (;;) {
        if (d.i(u, 97, 252)) break b;
        if (d.cursor >= d.a) break a;
        d.cursor++;
      }
      b: for (;;) {
        if (d.k(u, 97, 252)) break b;
        if (d.cursor >= d.a) break a;
        d.cursor++;
      }
      z = d.cursor;
      b: for (;;) {
        if (d.i(u, 97, 252)) break b;
        if (d.cursor >= d.a) break a;
        d.cursor++;
      }
      b: for (;;) {
        if (d.k(u, 97, 252)) break b;
        if (d.cursor >= d.a) break a;
        d.cursor++;
      }
      y = d.cursor;
    }
    d.cursor = f;
    d.f = d.cursor;
    d.cursor = d.a;
    f = d.a - d.cursor;
    d.d = d.cursor;
    if (0 != d.h(v) && ((d.c = d.cursor), (h = d.h(b)), 0 != h && l()))
      switch (h) {
        case 1:
          d.c = d.cursor;
          if (!d.b("iendo")) break;
          break;
        case 2:
          d.c = d.cursor;
          if (!d.b("ando")) break;
          break;
        case 3:
          d.c = d.cursor;
          if (!d.b("ar")) break;
          break;
        case 4:
          d.c = d.cursor;
          if (!d.b("er")) break;
          break;
        case 5:
          d.c = d.cursor;
          if (!d.b("ir")) break;
          break;
        case 6:
          if (!d.e()) break;
          break;
        case 7:
          !d.g("u") || d.e();
      }
    d.cursor = d.a - f;
    f = d.a - d.cursor;
    b: {
      h = d.a - d.cursor;
      if (c()) break b;
      d.cursor = d.a - h;
      if (a()) break b;
      d.cursor = d.a - h;
      if (!(d.cursor < e))
        if (((n = d.f), (d.f = e), (d.d = d.cursor), (h = d.h(m)), 0 == h)) d.f = n;
        else
          switch (((d.c = d.cursor), (d.f = n), h)) {
            case 1:
              h = d.a - d.cursor;
              d.g("u")
                ? ((n = d.a - d.cursor), d.g("g") ? (d.cursor = d.a - n) : (d.cursor = d.a - h))
                : (d.cursor = d.a - h);
              d.c = d.cursor;
              if (!d.e()) break;
              break;
            case 2:
              d.e();
          }
    }
    d.cursor = d.a - f;
    f = d.a - d.cursor;
    d.d = d.cursor;
    h = d.h(w);
    if (0 != h)
      switch (((d.c = d.cursor), h)) {
        case 1:
          if (!l() || !d.e()) break;
          break;
        case 2:
          if (!l() || !d.e()) break;
          h = d.a - d.cursor;
          d.d = d.cursor;
          d.g("u")
            ? ((d.c = d.cursor),
              (n = d.a - d.cursor),
              d.g("g") ? ((d.cursor = d.a - n), l() ? d.e() : (d.cursor = d.a - h)) : (d.cursor = d.a - h))
            : (d.cursor = d.a - h);
      }
    d.cursor = d.a - f;
    d.cursor = d.f;
    f = d.cursor;
    k();
    d.cursor = f;
    return g;
  };
  this.stemWord = function (a) {
    d.p(a);
    this.l();
    return d.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
