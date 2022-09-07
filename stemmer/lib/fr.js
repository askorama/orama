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
    for (;;) {
      var a = f.cursor;
      a: {
        b: for (;;) {
          var b = f.cursor;
          c: {
            d: {
              var c = f.cursor;
              e: if (f.i(e, 97, 251)) {
                f.c = f.cursor;
                f: {
                  var d = f.cursor;
                  if (f.m("u") && ((f.d = f.cursor), f.i(e, 97, 251))) {
                    if (!f.b("U")) return;
                    break f;
                  }
                  f.cursor = d;
                  if (f.m("i") && ((f.d = f.cursor), f.i(e, 97, 251))) {
                    if (!f.b("I")) return;
                    break f;
                  }
                  f.cursor = d;
                  if (!f.m("y")) break e;
                  f.d = f.cursor;
                  if (!f.b("Y")) return;
                }
                break d;
              }
              f.cursor = c;
              f.c = f.cursor;
              if (f.m("\u00eb")) {
                f.d = f.cursor;
                if (!f.b("He")) return;
                break d;
              }
              f.cursor = c;
              f.c = f.cursor;
              if (f.m("\u00ef")) {
                f.d = f.cursor;
                if (!f.b("Hi")) return;
                break d;
              }
              f.cursor = c;
              f.c = f.cursor;
              if (f.m("y") && ((f.d = f.cursor), f.i(e, 97, 251))) {
                if (!f.b("Y")) return;
                break d;
              }
              f.cursor = c;
              if (!f.m("q")) break c;
              f.c = f.cursor;
              if (!f.m("u")) break c;
              f.d = f.cursor;
              if (!f.b("U")) return;
            }
            f.cursor = b;
            break b;
          }
          f.cursor = b;
          if (f.cursor >= f.a) break a;
          f.cursor++;
        }
        continue;
      }
      f.cursor = a;
      break;
    }
  }
  function l() {
    for (var a; ; ) {
      var b = f.cursor;
      a: if (((f.c = f.cursor), (a = f.o(t)), 0 != a)) {
        f.d = f.cursor;
        switch (a) {
          case 1:
            if (!f.b("i")) return;
            break;
          case 2:
            if (!f.b("u")) return;
            break;
          case 3:
            if (!f.b("y")) return;
            break;
          case 4:
            if (!f.b("\u00eb")) return;
            break;
          case 5:
            if (!f.b("\u00ef")) return;
            break;
          case 6:
            if (!f.e()) return;
            break;
          case 7:
            if (f.cursor >= f.a) break a;
            f.cursor++;
        }
        continue;
      }
      f.cursor = b;
      break;
    }
  }
  function h() {
    return !(E <= f.cursor) ? p : g;
  }
  function c() {
    return !(G <= f.cursor) ? p : g;
  }
  function a() {
    return !(H <= f.cursor) ? p : g;
  }
  function d() {
    var b;
    f.d = f.cursor;
    b = f.h(m);
    if (0 == b) return p;
    f.c = f.cursor;
    switch (b) {
      case 1:
        if (!a() || !f.e()) return p;
        break;
      case 2:
        if (!a() || !f.e()) return p;
        b = f.a - f.cursor;
        f.d = f.cursor;
        if (f.g("ic")) {
          f.c = f.cursor;
          b: {
            b = f.a - f.cursor;
            if (a()) {
              if (!f.e()) return p;
              break b;
            }
            f.cursor = f.a - b;
            if (!f.b("iqU")) return p;
          }
        } else f.cursor = f.a - b;
        break;
      case 3:
        if (!a() || !f.b("log")) return p;
        break;
      case 4:
        if (!a() || !f.b("u")) return p;
        break;
      case 5:
        if (!a() || !f.b("ent")) return p;
        break;
      case 6:
        if (!h() || !f.e()) return p;
        var d = f.a - f.cursor;
        a: if (((f.d = f.cursor), (b = f.h(s)), 0 == b)) f.cursor = f.a - d;
        else
          switch (((f.c = f.cursor), b)) {
            case 1:
              if (!a()) {
                f.cursor = f.a - d;
                break a;
              }
              if (!f.e()) return p;
              f.d = f.cursor;
              if (!f.g("at")) {
                f.cursor = f.a - d;
                break a;
              }
              f.c = f.cursor;
              if (!a()) {
                f.cursor = f.a - d;
                break a;
              }
              if (!f.e()) return p;
              break;
            case 2:
              b: {
                b = f.a - f.cursor;
                if (a()) {
                  if (!f.e()) return p;
                  break b;
                }
                f.cursor = f.a - b;
                if (!c()) {
                  f.cursor = f.a - d;
                  break a;
                }
                if (!f.b("eux")) return p;
              }
              break;
            case 3:
              if (!a()) {
                f.cursor = f.a - d;
                break a;
              }
              if (!f.e()) return p;
              break;
            case 4:
              if (!h()) {
                f.cursor = f.a - d;
                break a;
              }
              if (!f.b("i")) return p;
          }
        break;
      case 7:
        if (!a() || !f.e()) return p;
        d = f.a - f.cursor;
        a: if (((f.d = f.cursor), (b = f.h(r)), 0 == b)) f.cursor = f.a - d;
        else
          switch (((f.c = f.cursor), b)) {
            case 1:
              b: {
                b = f.a - f.cursor;
                if (a()) {
                  if (!f.e()) return p;
                  break b;
                }
                f.cursor = f.a - b;
                if (!f.b("abl")) return p;
              }
              break;
            case 2:
              b: {
                b = f.a - f.cursor;
                if (a()) {
                  if (!f.e()) return p;
                  break b;
                }
                f.cursor = f.a - b;
                if (!f.b("iqU")) return p;
              }
              break;
            case 3:
              if (!a()) {
                f.cursor = f.a - d;
                break a;
              }
              if (!f.e()) return p;
          }
        break;
      case 8:
        if (!a() || !f.e()) return p;
        b = f.a - f.cursor;
        f.d = f.cursor;
        if (f.g("at"))
          if (((f.c = f.cursor), a())) {
            if (!f.e()) return p;
            f.d = f.cursor;
            if (f.g("ic")) {
              f.c = f.cursor;
              b: {
                b = f.a - f.cursor;
                if (a()) {
                  if (!f.e()) return p;
                  break b;
                }
                f.cursor = f.a - b;
                if (!f.b("iqU")) return p;
              }
            } else f.cursor = f.a - b;
          } else f.cursor = f.a - b;
        else f.cursor = f.a - b;
        break;
      case 9:
        if (!f.b("eau")) return p;
        break;
      case 10:
        if (!c() || !f.b("al")) return p;
        break;
      case 11:
        a: {
          b = f.a - f.cursor;
          if (a()) {
            if (!f.e()) return p;
            break a;
          }
          f.cursor = f.a - b;
          if (!c() || !f.b("eux")) return p;
        }
        break;
      case 12:
        if (!c() || !f.q(e, 97, 251) || !f.e()) return p;
        break;
      case 13:
        if (!h()) return p;
        f.b("ant");
        return p;
      case 14:
        if (!h()) return p;
        f.b("ent");
        return p;
      case 15:
        b = f.a - f.cursor;
        if (!f.n(e, 97, 251) || !h()) return p;
        f.cursor = f.a - b;
        f.e();
        return p;
    }
    return g;
  }
  function n() {
    if (f.cursor < E) return p;
    var a = f.f;
    f.f = E;
    f.d = f.cursor;
    if (0 == f.h(w)) return (f.f = a), p;
    f.c = f.cursor;
    var b = f.a - f.cursor;
    if (f.g("H")) return (f.f = a), p;
    f.cursor = f.a - b;
    if (!f.q(e, 97, 251)) return (f.f = a), p;
    if (!f.e()) return p;
    f.f = a;
    return g;
  }
  function v() {
    var b;
    if (f.cursor < E) return p;
    var c = f.f;
    f.f = E;
    f.d = f.cursor;
    b = f.h(u);
    if (0 == b) return (f.f = c), p;
    f.c = f.cursor;
    switch (b) {
      case 1:
        if (!a()) return (f.f = c), p;
        if (!f.e()) return p;
        break;
      case 2:
        if (!f.e()) return p;
        break;
      case 3:
        if (!f.e()) return p;
        b = f.a - f.cursor;
        f.d = f.cursor;
        if (f.g("e")) {
          if (((f.c = f.cursor), !f.e())) return p;
        } else f.cursor = f.a - b;
    }
    f.f = c;
    return g;
  }
  function b() {
    var b,
      c = f.a - f.cursor;
    a: if (((f.d = f.cursor), f.g("s"))) {
      f.c = f.cursor;
      b = f.a - f.cursor;
      b: {
        var e = f.a - f.cursor;
        if (f.g("Hi")) break b;
        f.cursor = f.a - e;
        if (!f.q(A, 97, 232)) {
          f.cursor = f.a - c;
          break a;
        }
      }
      f.cursor = f.a - b;
      if (!f.e()) return;
    } else f.cursor = f.a - c;
    if (!(f.cursor < E)) {
      c = f.f;
      f.f = E;
      f.d = f.cursor;
      b = f.h(y);
      if (0 != b)
        switch (((f.c = f.cursor), b)) {
          case 1:
            if (!a()) {
              f.f = c;
              return;
            }
            a: {
              b = f.a - f.cursor;
              if (f.g("s")) break a;
              f.cursor = f.a - b;
              if (!f.g("t")) {
                f.f = c;
                return;
              }
            }
            if (!f.e()) return;
            break;
          case 2:
            if (!f.b("i")) return;
            break;
          case 3:
            if (!f.e()) return;
        }
      f.f = c;
    }
  }
  var f = new C(),
    q = [
      ["col", -1, -1],
      ["par", -1, -1],
      ["tap", -1, -1],
    ],
    t = [
      ["", -1, 7],
      ["H", 0, 6],
      ["He", 1, 4],
      ["Hi", 1, 5],
      ["I", 0, 1],
      ["U", 0, 2],
      ["Y", 0, 3],
    ],
    s = [
      ["iqU", -1, 3],
      ["abl", -1, 3],
      ["I\u00e8r", -1, 4],
      ["i\u00e8r", -1, 4],
      ["eus", -1, 2],
      ["iv", -1, 1],
    ],
    r = [
      ["ic", -1, 2],
      ["abil", -1, 1],
      ["iv", -1, 3],
    ],
    m = [
      ["iqUe", -1, 1],
      ["atrice", -1, 2],
      ["ance", -1, 1],
      ["ence", -1, 5],
      ["logie", -1, 3],
      ["able", -1, 1],
      ["isme", -1, 1],
      ["euse", -1, 11],
      ["iste", -1, 1],
      ["ive", -1, 8],
      ["if", -1, 8],
      ["usion", -1, 4],
      ["ation", -1, 2],
      ["ution", -1, 4],
      ["ateur", -1, 2],
      ["iqUes", -1, 1],
      ["atrices", -1, 2],
      ["ances", -1, 1],
      ["ences", -1, 5],
      ["logies", -1, 3],
      ["ables", -1, 1],
      ["ismes", -1, 1],
      ["euses", -1, 11],
      ["istes", -1, 1],
      ["ives", -1, 8],
      ["ifs", -1, 8],
      ["usions", -1, 4],
      ["ations", -1, 2],
      ["utions", -1, 4],
      ["ateurs", -1, 2],
      ["ments", -1, 15],
      ["ements", 30, 6],
      ["issements", 31, 12],
      ["it\u00e9s", -1, 7],
      ["ment", -1, 15],
      ["ement", 34, 6],
      ["issement", 35, 12],
      ["amment", 34, 13],
      ["emment", 34, 14],
      ["aux", -1, 10],
      ["eaux", 39, 9],
      ["eux", -1, 1],
      ["it\u00e9", -1, 7],
    ],
    w = [
      ["ira", -1, 1],
      ["ie", -1, 1],
      ["isse", -1, 1],
      ["issante", -1, 1],
      ["i", -1, 1],
      ["irai", 4, 1],
      ["ir", -1, 1],
      ["iras", -1, 1],
      ["ies", -1, 1],
      ["\u00eemes", -1, 1],
      ["isses", -1, 1],
      ["issantes", -1, 1],
      ["\u00eetes", -1, 1],
      ["is", -1, 1],
      ["irais", 13, 1],
      ["issais", 13, 1],
      ["irions", -1, 1],
      ["issions", -1, 1],
      ["irons", -1, 1],
      ["issons", -1, 1],
      ["issants", -1, 1],
      ["it", -1, 1],
      ["irait", 21, 1],
      ["issait", 21, 1],
      ["issant", -1, 1],
      ["iraIent", -1, 1],
      ["issaIent", -1, 1],
      ["irent", -1, 1],
      ["issent", -1, 1],
      ["iront", -1, 1],
      ["\u00eet", -1, 1],
      ["iriez", -1, 1],
      ["issiez", -1, 1],
      ["irez", -1, 1],
      ["issez", -1, 1],
    ],
    u = [
      ["a", -1, 3],
      ["era", 0, 2],
      ["asse", -1, 3],
      ["ante", -1, 3],
      ["\u00e9e", -1, 2],
      ["ai", -1, 3],
      ["erai", 5, 2],
      ["er", -1, 2],
      ["as", -1, 3],
      ["eras", 8, 2],
      ["\u00e2mes", -1, 3],
      ["asses", -1, 3],
      ["antes", -1, 3],
      ["\u00e2tes", -1, 3],
      ["\u00e9es", -1, 2],
      ["ais", -1, 3],
      ["erais", 15, 2],
      ["ions", -1, 1],
      ["erions", 17, 2],
      ["assions", 17, 3],
      ["erons", -1, 2],
      ["ants", -1, 3],
      ["\u00e9s", -1, 2],
      ["ait", -1, 3],
      ["erait", 23, 2],
      ["ant", -1, 3],
      ["aIent", -1, 3],
      ["eraIent", 26, 2],
      ["\u00e8rent", -1, 2],
      ["assent", -1, 3],
      ["eront", -1, 2],
      ["\u00e2t", -1, 3],
      ["ez", -1, 2],
      ["iez", 32, 2],
      ["eriez", 33, 2],
      ["assiez", 33, 3],
      ["erez", 32, 2],
      ["\u00e9", -1, 2],
    ],
    y = [
      ["e", -1, 3],
      ["I\u00e8re", 0, 2],
      ["i\u00e8re", 0, 2],
      ["ion", -1, 1],
      ["Ier", -1, 2],
      ["ier", -1, 2],
    ],
    z = [
      ["ell", -1, -1],
      ["eill", -1, -1],
      ["enn", -1, -1],
      ["onn", -1, -1],
      ["ett", -1, -1],
    ],
    e = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 130, 103, 8, 5],
    A = [1, 65, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128],
    H = 0,
    G = 0,
    E = 0;
  this.l = function () {
    var a = f.cursor;
    k();
    f.cursor = a;
    H = G = E = f.a;
    a = f.cursor;
    a: {
      b: {
        var c = f.cursor;
        if (f.i(e, 97, 251) && f.i(e, 97, 251) && !(f.cursor >= f.a)) {
          f.cursor++;
          break b;
        }
        f.cursor = c;
        if (0 != f.o(q)) break b;
        f.cursor = c;
        if (f.cursor >= f.a) break a;
        f.cursor++;
        c: for (;;) {
          if (f.i(e, 97, 251)) break c;
          if (f.cursor >= f.a) break a;
          f.cursor++;
        }
      }
      E = f.cursor;
    }
    f.cursor = a;
    a = f.cursor;
    a: {
      b: for (;;) {
        if (f.i(e, 97, 251)) break b;
        if (f.cursor >= f.a) break a;
        f.cursor++;
      }
      b: for (;;) {
        if (f.k(e, 97, 251)) break b;
        if (f.cursor >= f.a) break a;
        f.cursor++;
      }
      G = f.cursor;
      b: for (;;) {
        if (f.i(e, 97, 251)) break b;
        if (f.cursor >= f.a) break a;
        f.cursor++;
      }
      b: for (;;) {
        if (f.k(e, 97, 251)) break b;
        if (f.cursor >= f.a) break a;
        f.cursor++;
      }
      H = f.cursor;
    }
    f.cursor = a;
    f.f = f.cursor;
    f.cursor = f.a;
    a = f.a - f.cursor;
    b: {
      c = f.a - f.cursor;
      c: {
        var h = f.a - f.cursor;
        d: {
          var m = f.a - f.cursor;
          if (d()) break d;
          f.cursor = f.a - m;
          if (n()) break d;
          f.cursor = f.a - m;
          if (!v()) break c;
        }
        f.cursor = f.a - h;
        c = f.a - f.cursor;
        f.d = f.cursor;
        e: {
          h = f.a - f.cursor;
          if (f.g("Y")) {
            f.c = f.cursor;
            if (!f.b("i")) return p;
            break e;
          }
          f.cursor = f.a - h;
          if (f.g("\u00e7")) {
            if (((f.c = f.cursor), !f.b("c"))) return p;
          } else f.cursor = f.a - c;
        }
        break b;
      }
      f.cursor = f.a - c;
      b();
    }
    f.cursor = f.a - a;
    a = f.a - f.cursor;
    c = f.a - f.cursor;
    0 != f.h(z) && ((f.cursor = f.a - c), (f.d = f.cursor), f.cursor <= f.f || (f.cursor--, (f.c = f.cursor), f.e()));
    f.cursor = f.a - a;
    a = f.a - f.cursor;
    a: {
      for (c = 1; ; ) {
        if (f.q(e, 97, 251)) {
          c--;
          continue;
        }
        break;
      }
      if (!(0 < c)) {
        f.d = f.cursor;
        b: {
          c = f.a - f.cursor;
          if (f.g("\u00e9")) break b;
          f.cursor = f.a - c;
          if (!f.g("\u00e8")) break a;
        }
        f.c = f.cursor;
        f.b("e");
      }
    }
    f.cursor = f.a - a;
    f.cursor = f.f;
    a = f.cursor;
    l();
    f.cursor = a;
    return g;
  };
  this.stemWord = function (a) {
    f.p(a);
    this.l();
    return f.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
