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
    E = x = d.a;
    a: for (;;) {
      var a = d.cursor;
      if (d.i(z, 97, 246)) {
        d.cursor = a;
        break a;
      }
      d.cursor = a;
      if (d.cursor >= d.a) return;
      d.cursor++;
    }
    a: for (;;) {
      if (d.k(z, 97, 246)) break a;
      if (d.cursor >= d.a) return;
      d.cursor++;
    }
    x = d.cursor;
    a: for (;;) {
      a = d.cursor;
      if (d.i(z, 97, 246)) {
        d.cursor = a;
        break a;
      }
      d.cursor = a;
      if (d.cursor >= d.a) return;
      d.cursor++;
    }
    a: for (;;) {
      if (d.k(z, 97, 246)) break a;
      if (d.cursor >= d.a) return;
      d.cursor++;
    }
    E = d.cursor;
  }
  function l() {
    return 0 == d.h(t) ? p : g;
  }
  function h() {
    return !d.g("i") || !d.n(e, 97, 246) ? p : g;
  }
  function c() {
    var a;
    if (!(d.cursor < x)) {
      var b = d.f;
      d.f = x;
      d.d = d.cursor;
      a = d.h(s);
      if (0 == a) d.f = b;
      else {
        d.c = d.cursor;
        d.f = b;
        switch (a) {
          case 1:
            if (!d.g("a")) return;
            break;
          case 2:
            if (!d.g("e")) return;
            break;
          case 3:
            if (!d.g("i")) return;
            break;
          case 4:
            if (!d.g("o")) return;
            break;
          case 5:
            if (!d.g("\u00e4")) return;
            break;
          case 6:
            if (!d.g("\u00f6")) return;
            break;
          case 7:
            a = d.a - d.cursor;
            a: {
              b = d.a - d.cursor;
              b: {
                var c = d.a - d.cursor;
                if (l()) break b;
                d.cursor = d.a - c;
                if (!d.g("ie")) {
                  d.cursor = d.a - a;
                  break a;
                }
              }
              d.cursor = d.a - b;
              d.cursor <= d.f ? (d.cursor = d.a - a) : (d.cursor--, (d.c = d.cursor));
            }
            break;
          case 8:
            if (!d.n(z, 97, 246) || !d.n(y, 98, 122)) return;
        }
        d.e() && (H = g);
      }
    }
  }
  function a() {
    if (!(d.cursor < x)) {
      var a = d.f;
      d.f = x;
      var b = d.a - d.cursor;
      var c = d.a - d.cursor;
      if (l() && ((d.cursor = d.a - c), (d.d = d.cursor), !(d.cursor <= d.f) && (d.cursor--, (d.c = d.cursor), !d.e())))
        return;
      d.cursor = d.a - b;
      b = d.a - d.cursor;
      d.d = d.cursor;
      if (d.n(u, 97, 228) && ((d.c = d.cursor), d.n(y, 98, 122) && !d.e())) return;
      d.cursor = d.a - b;
      b = d.a - d.cursor;
      a: if (((d.d = d.cursor), d.g("j"))) {
        d.c = d.cursor;
        b: {
          c = d.a - d.cursor;
          if (d.g("o")) break b;
          d.cursor = d.a - c;
          if (!d.g("u")) break a;
        }
        if (!d.e()) return;
      }
      d.cursor = d.a - b;
      b = d.a - d.cursor;
      d.d = d.cursor;
      if (d.g("o") && ((d.c = d.cursor), d.g("j") && !d.e())) return;
      d.cursor = d.a - b;
      d.f = a;
      a: for (;;) {
        a = d.a - d.cursor;
        if (d.q(z, 97, 246)) {
          d.cursor = d.a - a;
          break a;
        }
        d.cursor = d.a - a;
        if (d.cursor <= d.f) return;
        d.cursor--;
      }
      d.d = d.cursor;
      d.n(y, 98, 122) && ((d.c = d.cursor), (G = d.u()), "" == G || !d.g(G) || d.e());
    }
  }
  var d = new C(),
    n = [
      ["pa", -1, 1],
      ["sti", -1, 2],
      ["kaan", -1, 1],
      ["han", -1, 1],
      ["kin", -1, 1],
      ["h\u00e4n", -1, 1],
      ["k\u00e4\u00e4n", -1, 1],
      ["ko", -1, 1],
      ["p\u00e4", -1, 1],
      ["k\u00f6", -1, 1],
    ],
    v = [
      ["lla", -1, -1],
      ["na", -1, -1],
      ["ssa", -1, -1],
      ["ta", -1, -1],
      ["lta", 3, -1],
      ["sta", 3, -1],
    ],
    b = [
      ["ll\u00e4", -1, -1],
      ["n\u00e4", -1, -1],
      ["ss\u00e4", -1, -1],
      ["t\u00e4", -1, -1],
      ["lt\u00e4", 3, -1],
      ["st\u00e4", 3, -1],
    ],
    f = [
      ["lle", -1, -1],
      ["ine", -1, -1],
    ],
    q = [
      ["nsa", -1, 3],
      ["mme", -1, 3],
      ["nne", -1, 3],
      ["ni", -1, 2],
      ["si", -1, 1],
      ["an", -1, 4],
      ["en", -1, 6],
      ["\u00e4n", -1, 5],
      ["ns\u00e4", -1, 3],
    ],
    t = [
      ["aa", -1, -1],
      ["ee", -1, -1],
      ["ii", -1, -1],
      ["oo", -1, -1],
      ["uu", -1, -1],
      ["\u00e4\u00e4", -1, -1],
      ["\u00f6\u00f6", -1, -1],
    ],
    s = [
      ["a", -1, 8],
      ["lla", 0, -1],
      ["na", 0, -1],
      ["ssa", 0, -1],
      ["ta", 0, -1],
      ["lta", 4, -1],
      ["sta", 4, -1],
      ["tta", 4, 2],
      ["lle", -1, -1],
      ["ine", -1, -1],
      ["ksi", -1, -1],
      ["n", -1, 7],
      ["han", 11, 1],
      ["den", 11, -1, h],
      ["seen", 11, -1, l],
      ["hen", 11, 2],
      ["tten", 11, -1, h],
      ["hin", 11, 3],
      ["siin", 11, -1, h],
      ["hon", 11, 4],
      ["h\u00e4n", 11, 5],
      ["h\u00f6n", 11, 6],
      ["\u00e4", -1, 8],
      ["ll\u00e4", 22, -1],
      ["n\u00e4", 22, -1],
      ["ss\u00e4", 22, -1],
      ["t\u00e4", 22, -1],
      ["lt\u00e4", 26, -1],
      ["st\u00e4", 26, -1],
      ["tt\u00e4", 26, 2],
    ],
    r = [
      ["eja", -1, -1],
      ["mma", -1, 1],
      ["imma", 1, -1],
      ["mpa", -1, 1],
      ["impa", 3, -1],
      ["mmi", -1, 1],
      ["immi", 5, -1],
      ["mpi", -1, 1],
      ["impi", 7, -1],
      ["ej\u00e4", -1, -1],
      ["mm\u00e4", -1, 1],
      ["imm\u00e4", 10, -1],
      ["mp\u00e4", -1, 1],
      ["imp\u00e4", 12, -1],
    ],
    m = [
      ["i", -1, -1],
      ["j", -1, -1],
    ],
    w = [
      ["mma", -1, 1],
      ["imma", 0, -1],
    ],
    u = [17, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    y = [119, 223, 119, 1],
    z = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32],
    e = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32],
    A = [17, 97, 24, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32],
    H = p,
    G = "",
    E = 0,
    x = 0;
  this.l = function () {
    var e = d.cursor;
    k();
    d.cursor = e;
    H = p;
    d.f = d.cursor;
    d.cursor = d.a;
    e = d.a - d.cursor;
    a: {
      var h;
      if (!(d.cursor < x)) {
        var l = d.f;
        d.f = x;
        d.d = d.cursor;
        h = d.h(n);
        if (0 == h) d.f = l;
        else {
          d.c = d.cursor;
          d.f = l;
          switch (h) {
            case 1:
              if (!d.n(A, 97, 246)) break a;
              break;
            case 2:
              if (!(E <= d.cursor)) break a;
          }
          d.e();
        }
      }
    }
    d.cursor = d.a - e;
    e = d.a - d.cursor;
    if (!(d.cursor < x))
      if (((l = d.f), (d.f = x), (d.d = d.cursor), (h = d.h(q)), 0 == h)) d.f = l;
      else
        switch (((d.c = d.cursor), (d.f = l), h)) {
          case 1:
            h = d.a - d.cursor;
            if (d.g("k")) break;
            d.cursor = d.a - h;
            if (!d.e()) break;
            break;
          case 2:
            if (!d.e()) break;
            d.d = d.cursor;
            if (!d.g("kse")) break;
            d.c = d.cursor;
            if (!d.b("ksi")) break;
            break;
          case 3:
            if (!d.e()) break;
            break;
          case 4:
            if (0 == d.h(v) || !d.e()) break;
            break;
          case 5:
            if (0 == d.h(b) || !d.e()) break;
            break;
          case 6:
            0 == d.h(f) || d.e();
        }
    d.cursor = d.a - e;
    e = d.a - d.cursor;
    c();
    d.cursor = d.a - e;
    e = d.a - d.cursor;
    a: if (!(d.cursor < E))
      if (((l = d.f), (d.f = E), (d.d = d.cursor), (h = d.h(r)), 0 == h)) d.f = l;
      else {
        d.c = d.cursor;
        d.f = l;
        switch (h) {
          case 1:
            h = d.a - d.cursor;
            if (d.g("po")) break a;
            d.cursor = d.a - h;
        }
        d.e();
      }
    d.cursor = d.a - e;
    a: {
      if (H) {
        e = d.a - d.cursor;
        d.cursor < x ||
          ((h = d.f), (d.f = x), (d.d = d.cursor), 0 == d.h(m) ? (d.f = h) : ((d.c = d.cursor), (d.f = h), d.e()));
        d.cursor = d.a - e;
        break a;
      }
      e = d.a - d.cursor;
      b: if (!(d.cursor < x))
        if (((h = d.f), (d.f = x), (d.d = d.cursor), d.g("t")))
          if (((d.c = d.cursor), (l = d.a - d.cursor), d.n(z, 97, 246))) {
            if (((d.cursor = d.a - l), d.e() && ((d.f = h), !(d.cursor < E))))
              if (((l = d.f), (d.f = E), (d.d = d.cursor), (h = d.h(w)), 0 == h)) d.f = l;
              else {
                d.c = d.cursor;
                d.f = l;
                switch (h) {
                  case 1:
                    h = d.a - d.cursor;
                    if (d.g("po")) break b;
                    d.cursor = d.a - h;
                }
                d.e();
              }
          } else d.f = h;
        else d.f = h;
      d.cursor = d.a - e;
    }
    e = d.a - d.cursor;
    a();
    d.cursor = d.a - e;
    d.cursor = d.f;
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
