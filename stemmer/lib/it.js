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
    for (var b, c = a.cursor; ; ) {
      var f = a.cursor;
      a: if (((a.c = a.cursor), (b = a.o(d)), 0 != b)) {
        a.d = a.cursor;
        switch (b) {
          case 1:
            if (!a.b("\u00e0")) return;
            break;
          case 2:
            if (!a.b("\u00e8")) return;
            break;
          case 3:
            if (!a.b("\u00ec")) return;
            break;
          case 4:
            if (!a.b("\u00f2")) return;
            break;
          case 5:
            if (!a.b("\u00f9")) return;
            break;
          case 6:
            if (!a.b("qU")) return;
            break;
          case 7:
            if (a.cursor >= a.a) break a;
            a.cursor++;
        }
        continue;
      }
      a.cursor = f;
      break;
    }
    for (a.cursor = c; ; ) {
      b = a.cursor;
      a: {
        b: for (;;) {
          c = a.cursor;
          c: if (a.i(r, 97, 249)) {
            a.c = a.cursor;
            d: {
              f = a.cursor;
              if (a.m("u") && ((a.d = a.cursor), a.i(r, 97, 249))) {
                if (!a.b("U")) return;
                break d;
              }
              a.cursor = f;
              if (!a.m("i")) break c;
              a.d = a.cursor;
              if (!a.i(r, 97, 249)) break c;
              if (!a.b("I")) return;
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
    return !(z <= a.cursor) ? p : g;
  }
  function h() {
    return !(u <= a.cursor) ? p : g;
  }
  function c() {
    var b;
    a.d = a.cursor;
    b = a.h(t);
    if (0 == b) return p;
    a.c = a.cursor;
    switch (b) {
      case 1:
        if (!h() || !a.e()) return p;
        break;
      case 2:
        if (!h() || !a.e()) return p;
        b = a.a - a.cursor;
        a.d = a.cursor;
        if (a.g("ic"))
          if (((a.c = a.cursor), h())) {
            if (!a.e()) return p;
          } else a.cursor = a.a - b;
        else a.cursor = a.a - b;
        break;
      case 3:
        if (!h() || !a.b("log")) return p;
        break;
      case 4:
        if (!h() || !a.b("u")) return p;
        break;
      case 5:
        if (!h() || !a.b("ente")) return p;
        break;
      case 6:
        if (!l() || !a.e()) return p;
        break;
      case 7:
        if (!(y <= a.cursor) || !a.e()) return p;
        var c = a.a - a.cursor;
        a: if (((a.d = a.cursor), (b = a.h(f)), 0 == b)) a.cursor = a.a - c;
        else if (((a.c = a.cursor), h())) {
          if (!a.e()) return p;
          switch (b) {
            case 1:
              a.d = a.cursor;
              if (!a.g("at")) {
                a.cursor = a.a - c;
                break a;
              }
              a.c = a.cursor;
              if (!h()) {
                a.cursor = a.a - c;
                break a;
              }
              if (!a.e()) return p;
          }
        } else a.cursor = a.a - c;
        break;
      case 8:
        if (!h() || !a.e()) return p;
        b = a.a - a.cursor;
        a.d = a.cursor;
        if (0 == a.h(q)) a.cursor = a.a - b;
        else if (((a.c = a.cursor), h())) {
          if (!a.e()) return p;
        } else a.cursor = a.a - b;
        break;
      case 9:
        if (!h() || !a.e()) return p;
        b = a.a - a.cursor;
        a.d = a.cursor;
        if (a.g("at"))
          if (((a.c = a.cursor), h())) {
            if (!a.e()) return p;
            a.d = a.cursor;
            if (a.g("ic"))
              if (((a.c = a.cursor), h())) {
                if (!a.e()) return p;
              } else a.cursor = a.a - b;
            else a.cursor = a.a - b;
          } else a.cursor = a.a - b;
        else a.cursor = a.a - b;
    }
    return g;
  }
  var a = new C(),
    d = [
      ["", -1, 7],
      ["qu", 0, 6],
      ["\u00e1", 0, 1],
      ["\u00e9", 0, 2],
      ["\u00ed", 0, 3],
      ["\u00f3", 0, 4],
      ["\u00fa", 0, 5],
    ],
    n = [
      ["", -1, 3],
      ["I", 0, 1],
      ["U", 0, 2],
    ],
    v = [
      ["la", -1, -1],
      ["cela", 0, -1],
      ["gliela", 0, -1],
      ["mela", 0, -1],
      ["tela", 0, -1],
      ["vela", 0, -1],
      ["le", -1, -1],
      ["cele", 6, -1],
      ["gliele", 6, -1],
      ["mele", 6, -1],
      ["tele", 6, -1],
      ["vele", 6, -1],
      ["ne", -1, -1],
      ["cene", 12, -1],
      ["gliene", 12, -1],
      ["mene", 12, -1],
      ["sene", 12, -1],
      ["tene", 12, -1],
      ["vene", 12, -1],
      ["ci", -1, -1],
      ["li", -1, -1],
      ["celi", 20, -1],
      ["glieli", 20, -1],
      ["meli", 20, -1],
      ["teli", 20, -1],
      ["veli", 20, -1],
      ["gli", 20, -1],
      ["mi", -1, -1],
      ["si", -1, -1],
      ["ti", -1, -1],
      ["vi", -1, -1],
      ["lo", -1, -1],
      ["celo", 31, -1],
      ["glielo", 31, -1],
      ["melo", 31, -1],
      ["telo", 31, -1],
      ["velo", 31, -1],
    ],
    b = [
      ["ando", -1, 1],
      ["endo", -1, 1],
      ["ar", -1, 2],
      ["er", -1, 2],
      ["ir", -1, 2],
    ],
    f = [
      ["ic", -1, -1],
      ["abil", -1, -1],
      ["os", -1, -1],
      ["iv", -1, 1],
    ],
    q = [
      ["ic", -1, 1],
      ["abil", -1, 1],
      ["iv", -1, 1],
    ],
    t = [
      ["ica", -1, 1],
      ["logia", -1, 3],
      ["osa", -1, 1],
      ["ista", -1, 1],
      ["iva", -1, 9],
      ["anza", -1, 1],
      ["enza", -1, 5],
      ["ice", -1, 1],
      ["atrice", 7, 1],
      ["iche", -1, 1],
      ["logie", -1, 3],
      ["abile", -1, 1],
      ["ibile", -1, 1],
      ["usione", -1, 4],
      ["azione", -1, 2],
      ["uzione", -1, 4],
      ["atore", -1, 2],
      ["ose", -1, 1],
      ["ante", -1, 1],
      ["mente", -1, 1],
      ["amente", 19, 7],
      ["iste", -1, 1],
      ["ive", -1, 9],
      ["anze", -1, 1],
      ["enze", -1, 5],
      ["ici", -1, 1],
      ["atrici", 25, 1],
      ["ichi", -1, 1],
      ["abili", -1, 1],
      ["ibili", -1, 1],
      ["ismi", -1, 1],
      ["usioni", -1, 4],
      ["azioni", -1, 2],
      ["uzioni", -1, 4],
      ["atori", -1, 2],
      ["osi", -1, 1],
      ["anti", -1, 1],
      ["amenti", -1, 6],
      ["imenti", -1, 6],
      ["isti", -1, 1],
      ["ivi", -1, 9],
      ["ico", -1, 1],
      ["ismo", -1, 1],
      ["oso", -1, 1],
      ["amento", -1, 6],
      ["imento", -1, 6],
      ["ivo", -1, 9],
      ["it\u00e0", -1, 8],
      ["ist\u00e0", -1, 1],
      ["ist\u00e8", -1, 1],
      ["ist\u00ec", -1, 1],
    ],
    s = [
      ["isca", -1, 1],
      ["enda", -1, 1],
      ["ata", -1, 1],
      ["ita", -1, 1],
      ["uta", -1, 1],
      ["ava", -1, 1],
      ["eva", -1, 1],
      ["iva", -1, 1],
      ["erebbe", -1, 1],
      ["irebbe", -1, 1],
      ["isce", -1, 1],
      ["ende", -1, 1],
      ["are", -1, 1],
      ["ere", -1, 1],
      ["ire", -1, 1],
      ["asse", -1, 1],
      ["ate", -1, 1],
      ["avate", 16, 1],
      ["evate", 16, 1],
      ["ivate", 16, 1],
      ["ete", -1, 1],
      ["erete", 20, 1],
      ["irete", 20, 1],
      ["ite", -1, 1],
      ["ereste", -1, 1],
      ["ireste", -1, 1],
      ["ute", -1, 1],
      ["erai", -1, 1],
      ["irai", -1, 1],
      ["isci", -1, 1],
      ["endi", -1, 1],
      ["erei", -1, 1],
      ["irei", -1, 1],
      ["assi", -1, 1],
      ["ati", -1, 1],
      ["iti", -1, 1],
      ["eresti", -1, 1],
      ["iresti", -1, 1],
      ["uti", -1, 1],
      ["avi", -1, 1],
      ["evi", -1, 1],
      ["ivi", -1, 1],
      ["isco", -1, 1],
      ["ando", -1, 1],
      ["endo", -1, 1],
      ["Yamo", -1, 1],
      ["iamo", -1, 1],
      ["avamo", -1, 1],
      ["evamo", -1, 1],
      ["ivamo", -1, 1],
      ["eremo", -1, 1],
      ["iremo", -1, 1],
      ["assimo", -1, 1],
      ["ammo", -1, 1],
      ["emmo", -1, 1],
      ["eremmo", 54, 1],
      ["iremmo", 54, 1],
      ["immo", -1, 1],
      ["ano", -1, 1],
      ["iscano", 58, 1],
      ["avano", 58, 1],
      ["evano", 58, 1],
      ["ivano", 58, 1],
      ["eranno", -1, 1],
      ["iranno", -1, 1],
      ["ono", -1, 1],
      ["iscono", 65, 1],
      ["arono", 65, 1],
      ["erono", 65, 1],
      ["irono", 65, 1],
      ["erebbero", -1, 1],
      ["irebbero", -1, 1],
      ["assero", -1, 1],
      ["essero", -1, 1],
      ["issero", -1, 1],
      ["ato", -1, 1],
      ["ito", -1, 1],
      ["uto", -1, 1],
      ["avo", -1, 1],
      ["evo", -1, 1],
      ["ivo", -1, 1],
      ["ar", -1, 1],
      ["ir", -1, 1],
      ["er\u00e0", -1, 1],
      ["ir\u00e0", -1, 1],
      ["er\u00f2", -1, 1],
      ["ir\u00f2", -1, 1],
    ],
    r = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 128, 8, 2, 1],
    m = [17, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 128, 8, 2],
    w = [17],
    u = 0,
    y = 0,
    z = 0;
  this.l = function () {
    var e = a.cursor;
    k();
    a.cursor = e;
    u = y = z = a.a;
    e = a.cursor;
    a: {
      b: {
        var d = a.cursor;
        c: if (a.i(r, 97, 249)) {
          d: {
            var f = a.cursor;
            e: if (a.k(r, 97, 249)) {
              f: for (;;) {
                if (a.i(r, 97, 249)) break f;
                if (a.cursor >= a.a) break e;
                a.cursor++;
              }
              break d;
            }
            a.cursor = f;
            if (!a.i(r, 97, 249)) break c;
            e: for (;;) {
              if (a.k(r, 97, 249)) break e;
              if (a.cursor >= a.a) break c;
              a.cursor++;
            }
          }
          break b;
        }
        a.cursor = d;
        if (!a.k(r, 97, 249)) break a;
        c: {
          d = a.cursor;
          d: if (a.k(r, 97, 249)) {
            e: for (;;) {
              if (a.i(r, 97, 249)) break e;
              if (a.cursor >= a.a) break d;
              a.cursor++;
            }
            break c;
          }
          a.cursor = d;
          if (!a.i(r, 97, 249)) break a;
          if (a.cursor >= a.a) break a;
          a.cursor++;
        }
      }
      z = a.cursor;
    }
    a.cursor = e;
    e = a.cursor;
    a: {
      b: for (;;) {
        if (a.i(r, 97, 249)) break b;
        if (a.cursor >= a.a) break a;
        a.cursor++;
      }
      b: for (;;) {
        if (a.k(r, 97, 249)) break b;
        if (a.cursor >= a.a) break a;
        a.cursor++;
      }
      y = a.cursor;
      b: for (;;) {
        if (a.i(r, 97, 249)) break b;
        if (a.cursor >= a.a) break a;
        a.cursor++;
      }
      b: for (;;) {
        if (a.k(r, 97, 249)) break b;
        if (a.cursor >= a.a) break a;
        a.cursor++;
      }
      u = a.cursor;
    }
    a.cursor = e;
    a.f = a.cursor;
    a.cursor = a.a;
    e = a.a - a.cursor;
    a.d = a.cursor;
    if (0 != a.h(v) && ((a.c = a.cursor), (d = a.h(b)), 0 != d && l()))
      switch (d) {
        case 1:
          if (!a.e()) break;
          break;
        case 2:
          a.b("e");
      }
    a.cursor = a.a - e;
    e = a.a - a.cursor;
    b: {
      d = a.a - a.cursor;
      if (c()) break b;
      a.cursor = a.a - d;
      a.cursor < z ||
        ((d = a.f), (a.f = z), (a.d = a.cursor), 0 == a.h(s) ? (a.f = d) : ((a.c = a.cursor), a.e() && (a.f = d)));
    }
    a.cursor = a.a - e;
    e = a.a - a.cursor;
    a: {
      d = a.a - a.cursor;
      a.d = a.cursor;
      if (a.n(m, 97, 242))
        if (((a.c = a.cursor), l())) {
          if (!a.e()) break a;
          a.d = a.cursor;
          if (a.g("i"))
            if (((a.c = a.cursor), l())) {
              if (!a.e()) break a;
            } else a.cursor = a.a - d;
          else a.cursor = a.a - d;
        } else a.cursor = a.a - d;
      else a.cursor = a.a - d;
      d = a.a - a.cursor;
      a.d = a.cursor;
      a.g("h")
        ? ((a.c = a.cursor), a.n(w, 99, 103) ? (l() ? a.e() : (a.cursor = a.a - d)) : (a.cursor = a.a - d))
        : (a.cursor = a.a - d);
    }
    a.cursor = a.a - e;
    a.cursor = a.f;
    e = a.cursor;
    a: for (;;) {
      f = a.cursor;
      b: if (((a.c = a.cursor), (d = a.o(n)), 0 != d)) {
        a.d = a.cursor;
        switch (d) {
          case 1:
            if (!a.b("i")) break a;
            break;
          case 2:
            if (!a.b("u")) break a;
            break;
          case 3:
            if (a.cursor >= a.a) break b;
            a.cursor++;
        }
        continue;
      }
      a.cursor = f;
      break;
    }
    a.cursor = e;
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
