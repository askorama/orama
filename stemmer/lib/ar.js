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
    var a,
      b = m.cursor;
    for (;;) {
      var c = m.cursor;
      b: {
        c: {
          var e = m.cursor;
          m.c = m.cursor;
          a = m.o(w);
          if (0 != a) {
            m.d = m.cursor;
            switch (a) {
              case 1:
                if (!m.e()) return;
                break;
              case 2:
                if (!m.b("0")) return;
                break;
              case 3:
                if (!m.b("1")) return;
                break;
              case 4:
                if (!m.b("2")) return;
                break;
              case 5:
                if (!m.b("3")) return;
                break;
              case 6:
                if (!m.b("4")) return;
                break;
              case 7:
                if (!m.b("5")) return;
                break;
              case 8:
                if (!m.b("6")) return;
                break;
              case 9:
                if (!m.b("7")) return;
                break;
              case 10:
                if (!m.b("8")) return;
                break;
              case 11:
                if (!m.b("9")) return;
                break;
              case 12:
                if (!m.b("\u0621")) return;
                break;
              case 13:
                if (!m.b("\u0623")) return;
                break;
              case 14:
                if (!m.b("\u0625")) return;
                break;
              case 15:
                if (!m.b("\u0626")) return;
                break;
              case 16:
                if (!m.b("\u0622")) return;
                break;
              case 17:
                if (!m.b("\u0624")) return;
                break;
              case 18:
                if (!m.b("\u0627")) return;
                break;
              case 19:
                if (!m.b("\u0628")) return;
                break;
              case 20:
                if (!m.b("\u0629")) return;
                break;
              case 21:
                if (!m.b("\u062a")) return;
                break;
              case 22:
                if (!m.b("\u062b")) return;
                break;
              case 23:
                if (!m.b("\u062c")) return;
                break;
              case 24:
                if (!m.b("\u062d")) return;
                break;
              case 25:
                if (!m.b("\u062e")) return;
                break;
              case 26:
                if (!m.b("\u062f")) return;
                break;
              case 27:
                if (!m.b("\u0630")) return;
                break;
              case 28:
                if (!m.b("\u0631")) return;
                break;
              case 29:
                if (!m.b("\u0632")) return;
                break;
              case 30:
                if (!m.b("\u0633")) return;
                break;
              case 31:
                if (!m.b("\u0634")) return;
                break;
              case 32:
                if (!m.b("\u0635")) return;
                break;
              case 33:
                if (!m.b("\u0636")) return;
                break;
              case 34:
                if (!m.b("\u0637")) return;
                break;
              case 35:
                if (!m.b("\u0638")) return;
                break;
              case 36:
                if (!m.b("\u0639")) return;
                break;
              case 37:
                if (!m.b("\u063a")) return;
                break;
              case 38:
                if (!m.b("\u0641")) return;
                break;
              case 39:
                if (!m.b("\u0642")) return;
                break;
              case 40:
                if (!m.b("\u0643")) return;
                break;
              case 41:
                if (!m.b("\u0644")) return;
                break;
              case 42:
                if (!m.b("\u0645")) return;
                break;
              case 43:
                if (!m.b("\u0646")) return;
                break;
              case 44:
                if (!m.b("\u0647")) return;
                break;
              case 45:
                if (!m.b("\u0648")) return;
                break;
              case 46:
                if (!m.b("\u0649")) return;
                break;
              case 47:
                if (!m.b("\u064a")) return;
                break;
              case 48:
                if (!m.b("\u0644\u0627")) return;
                break;
              case 49:
                if (!m.b("\u0644\u0623")) return;
                break;
              case 50:
                if (!m.b("\u0644\u0625")) return;
                break;
              case 51:
                if (!m.b("\u0644\u0622")) return;
            }
            break c;
          }
          m.cursor = e;
          if (m.cursor >= m.a) break b;
          m.cursor++;
        }
        continue;
      }
      m.cursor = c;
      break;
    }
    m.cursor = b;
  }
  function l() {
    var a;
    a = m.cursor;
    m.f = m.cursor;
    m.cursor = m.a;
    m.d = m.cursor;
    if (0 != m.h(u)) {
      m.c = m.cursor;
      if (!m.b("\u0621")) return;
      m.cursor = m.f;
    }
    m.cursor = a;
    var b = m.cursor;
    for (;;) {
      var c = m.cursor;
      b: {
        c: {
          var e = m.cursor;
          m.c = m.cursor;
          a = m.o(y);
          if (0 != a) {
            m.d = m.cursor;
            switch (a) {
              case 1:
                if (!m.b("\u0627")) return;
                break;
              case 2:
                if (!m.b("\u0648")) return;
                break;
              case 3:
                if (!m.b("\u064a")) return;
            }
            break c;
          }
          m.cursor = e;
          if (m.cursor >= m.a) break b;
          m.cursor++;
        }
        continue;
      }
      m.cursor = c;
      break;
    }
    m.cursor = b;
  }
  function h() {
    var a;
    m.c = m.cursor;
    a = m.o(e);
    if (0 == a) return p;
    m.d = m.cursor;
    switch (a) {
      case 1:
        if (!(3 < m.j.length) || !m.b("\u0623")) return p;
        break;
      case 2:
        if (!(3 < m.j.length) || !m.b("\u0622")) return p;
        break;
      case 3:
        if (!(3 < m.j.length) || !m.b("\u0627")) return p;
        break;
      case 4:
        if (!(3 < m.j.length) || !m.b("\u0625")) return p;
    }
    return g;
  }
  function c() {
    m.c = m.cursor;
    if (0 == m.o(A)) return p;
    m.d = m.cursor;
    if (!(3 < m.j.length)) return p;
    var a = m.cursor;
    if (m.m("\u0627")) return p;
    m.cursor = a;
    return !m.e() ? p : g;
  }
  function a() {
    var a;
    m.c = m.cursor;
    a = m.o(H);
    if (0 == a) return p;
    m.d = m.cursor;
    switch (a) {
      case 1:
        if (!(5 < m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(4 < m.j.length) || !m.e()) return p;
    }
    return g;
  }
  function d() {
    var a;
    m.c = m.cursor;
    a = m.o(G);
    if (0 == a) return p;
    m.d = m.cursor;
    switch (a) {
      case 1:
        if (!(3 < m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(3 < m.j.length) || !m.b("\u0628")) return p;
        break;
      case 3:
        if (!(3 < m.j.length) || !m.b("\u0643")) return p;
    }
    return g;
  }
  function n() {
    var a;
    m.c = m.cursor;
    a = m.o(E);
    if (0 == a) return p;
    m.d = m.cursor;
    switch (a) {
      case 1:
        if (!(4 < m.j.length) || !m.b("\u064a")) return p;
        break;
      case 2:
        if (!(4 < m.j.length) || !m.b("\u062a")) return p;
        break;
      case 3:
        if (!(4 < m.j.length) || !m.b("\u0646")) return p;
        break;
      case 4:
        if (!(4 < m.j.length) || !m.b("\u0623")) return p;
    }
    return g;
  }
  function v() {
    var a;
    m.d = m.cursor;
    a = m.h(O);
    if (0 == a) return p;
    m.c = m.cursor;
    switch (a) {
      case 1:
        if (!(4 <= m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(5 <= m.j.length) || !m.e()) return p;
        break;
      case 3:
        if (!(6 <= m.j.length) || !m.e()) return p;
    }
    return g;
  }
  function b() {
    m.d = m.cursor;
    if (0 == m.h(M)) return p;
    m.c = m.cursor;
    return !(4 < m.j.length) || !m.e() ? p : g;
  }
  function f() {
    m.d = m.cursor;
    if (0 == m.h(P)) return p;
    m.c = m.cursor;
    return !(5 <= m.j.length) || !m.e() ? p : g;
  }
  function q() {
    m.d = m.cursor;
    if (0 == m.h(Q)) return p;
    m.c = m.cursor;
    return !(4 <= m.j.length) || !m.e() ? p : g;
  }
  function t() {
    var a;
    m.d = m.cursor;
    a = m.h(R);
    if (0 == a) return p;
    m.c = m.cursor;
    switch (a) {
      case 1:
        if (!(4 <= m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(5 <= m.j.length) || !m.e()) return p;
        break;
      case 3:
        if (!(6 <= m.j.length) || !m.e()) return p;
    }
    return g;
  }
  function s() {
    var a;
    m.d = m.cursor;
    a = m.h(S);
    if (0 == a) return p;
    m.c = m.cursor;
    switch (a) {
      case 1:
        if (!(4 <= m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(5 <= m.j.length) || !m.e()) return p;
        break;
      case 3:
        if (!(5 < m.j.length) || !m.e()) return p;
        break;
      case 4:
        if (!(6 <= m.j.length) || !m.e()) return p;
    }
    return g;
  }
  function r() {
    var a;
    m.d = m.cursor;
    a = m.h(I);
    if (0 == a) return p;
    m.c = m.cursor;
    switch (a) {
      case 1:
        if (!(4 <= m.j.length) || !m.e()) return p;
        break;
      case 2:
        if (!(6 <= m.j.length) || !m.e()) return p;
    }
    return g;
  }
  var m = new C(),
    w = [
      ["\u0640", -1, 1],
      ["\u064b", -1, 1],
      ["\u064c", -1, 1],
      ["\u064d", -1, 1],
      ["\u064e", -1, 1],
      ["\u064f", -1, 1],
      ["\u0650", -1, 1],
      ["\u0651", -1, 1],
      ["\u0652", -1, 1],
      ["\u0660", -1, 2],
      ["\u0661", -1, 3],
      ["\u0662", -1, 4],
      ["\u0663", -1, 5],
      ["\u0664", -1, 6],
      ["\u0665", -1, 7],
      ["\u0666", -1, 8],
      ["\u0667", -1, 9],
      ["\u0668", -1, 10],
      ["\u0669", -1, 11],
      ["\ufe80", -1, 12],
      ["\ufe81", -1, 16],
      ["\ufe82", -1, 16],
      ["\ufe83", -1, 13],
      ["\ufe84", -1, 13],
      ["\ufe85", -1, 17],
      ["\ufe86", -1, 17],
      ["\ufe87", -1, 14],
      ["\ufe88", -1, 14],
      ["\ufe89", -1, 15],
      ["\ufe8a", -1, 15],
      ["\ufe8b", -1, 15],
      ["\ufe8c", -1, 15],
      ["\ufe8d", -1, 18],
      ["\ufe8e", -1, 18],
      ["\ufe8f", -1, 19],
      ["\ufe90", -1, 19],
      ["\ufe91", -1, 19],
      ["\ufe92", -1, 19],
      ["\ufe93", -1, 20],
      ["\ufe94", -1, 20],
      ["\ufe95", -1, 21],
      ["\ufe96", -1, 21],
      ["\ufe97", -1, 21],
      ["\ufe98", -1, 21],
      ["\ufe99", -1, 22],
      ["\ufe9a", -1, 22],
      ["\ufe9b", -1, 22],
      ["\ufe9c", -1, 22],
      ["\ufe9d", -1, 23],
      ["\ufe9e", -1, 23],
      ["\ufe9f", -1, 23],
      ["\ufea0", -1, 23],
      ["\ufea1", -1, 24],
      ["\ufea2", -1, 24],
      ["\ufea3", -1, 24],
      ["\ufea4", -1, 24],
      ["\ufea5", -1, 25],
      ["\ufea6", -1, 25],
      ["\ufea7", -1, 25],
      ["\ufea8", -1, 25],
      ["\ufea9", -1, 26],
      ["\ufeaa", -1, 26],
      ["\ufeab", -1, 27],
      ["\ufeac", -1, 27],
      ["\ufead", -1, 28],
      ["\ufeae", -1, 28],
      ["\ufeaf", -1, 29],
      ["\ufeb0", -1, 29],
      ["\ufeb1", -1, 30],
      ["\ufeb2", -1, 30],
      ["\ufeb3", -1, 30],
      ["\ufeb4", -1, 30],
      ["\ufeb5", -1, 31],
      ["\ufeb6", -1, 31],
      ["\ufeb7", -1, 31],
      ["\ufeb8", -1, 31],
      ["\ufeb9", -1, 32],
      ["\ufeba", -1, 32],
      ["\ufebb", -1, 32],
      ["\ufebc", -1, 32],
      ["\ufebd", -1, 33],
      ["\ufebe", -1, 33],
      ["\ufebf", -1, 33],
      ["\ufec0", -1, 33],
      ["\ufec1", -1, 34],
      ["\ufec2", -1, 34],
      ["\ufec3", -1, 34],
      ["\ufec4", -1, 34],
      ["\ufec5", -1, 35],
      ["\ufec6", -1, 35],
      ["\ufec7", -1, 35],
      ["\ufec8", -1, 35],
      ["\ufec9", -1, 36],
      ["\ufeca", -1, 36],
      ["\ufecb", -1, 36],
      ["\ufecc", -1, 36],
      ["\ufecd", -1, 37],
      ["\ufece", -1, 37],
      ["\ufecf", -1, 37],
      ["\ufed0", -1, 37],
      ["\ufed1", -1, 38],
      ["\ufed2", -1, 38],
      ["\ufed3", -1, 38],
      ["\ufed4", -1, 38],
      ["\ufed5", -1, 39],
      ["\ufed6", -1, 39],
      ["\ufed7", -1, 39],
      ["\ufed8", -1, 39],
      ["\ufed9", -1, 40],
      ["\ufeda", -1, 40],
      ["\ufedb", -1, 40],
      ["\ufedc", -1, 40],
      ["\ufedd", -1, 41],
      ["\ufede", -1, 41],
      ["\ufedf", -1, 41],
      ["\ufee0", -1, 41],
      ["\ufee1", -1, 42],
      ["\ufee2", -1, 42],
      ["\ufee3", -1, 42],
      ["\ufee4", -1, 42],
      ["\ufee5", -1, 43],
      ["\ufee6", -1, 43],
      ["\ufee7", -1, 43],
      ["\ufee8", -1, 43],
      ["\ufee9", -1, 44],
      ["\ufeea", -1, 44],
      ["\ufeeb", -1, 44],
      ["\ufeec", -1, 44],
      ["\ufeed", -1, 45],
      ["\ufeee", -1, 45],
      ["\ufeef", -1, 46],
      ["\ufef0", -1, 46],
      ["\ufef1", -1, 47],
      ["\ufef2", -1, 47],
      ["\ufef3", -1, 47],
      ["\ufef4", -1, 47],
      ["\ufef5", -1, 51],
      ["\ufef6", -1, 51],
      ["\ufef7", -1, 49],
      ["\ufef8", -1, 49],
      ["\ufef9", -1, 50],
      ["\ufefa", -1, 50],
      ["\ufefb", -1, 48],
      ["\ufefc", -1, 48],
    ],
    u = [
      ["\u0622", -1, 1],
      ["\u0623", -1, 1],
      ["\u0624", -1, 1],
      ["\u0625", -1, 1],
      ["\u0626", -1, 1],
    ],
    y = [
      ["\u0622", -1, 1],
      ["\u0623", -1, 1],
      ["\u0624", -1, 2],
      ["\u0625", -1, 1],
      ["\u0626", -1, 3],
    ],
    z = [
      ["\u0627\u0644", -1, 2],
      ["\u0628\u0627\u0644", -1, 1],
      ["\u0643\u0627\u0644", -1, 1],
      ["\u0644\u0644", -1, 2],
    ],
    e = [
      ["\u0623\u0622", -1, 2],
      ["\u0623\u0623", -1, 1],
      ["\u0623\u0624", -1, 1],
      ["\u0623\u0625", -1, 4],
      ["\u0623\u0627", -1, 3],
    ],
    A = [
      ["\u0641", -1, 1],
      ["\u0648", -1, 1],
    ],
    H = [
      ["\u0627\u0644", -1, 2],
      ["\u0628\u0627\u0644", -1, 1],
      ["\u0643\u0627\u0644", -1, 1],
      ["\u0644\u0644", -1, 2],
    ],
    G = [
      ["\u0628", -1, 1],
      ["\u0628\u0627", 0, -1],
      ["\u0628\u0628", 0, 2],
      ["\u0643\u0643", -1, 3],
    ],
    E = [
      ["\u0633\u0623", -1, 4],
      ["\u0633\u062a", -1, 2],
      ["\u0633\u0646", -1, 3],
      ["\u0633\u064a", -1, 1],
    ],
    x = [
      ["\u062a\u0633\u062a", -1, 1],
      ["\u0646\u0633\u062a", -1, 1],
      ["\u064a\u0633\u062a", -1, 1],
    ],
    O = [
      ["\u0643\u0645\u0627", -1, 3],
      ["\u0647\u0645\u0627", -1, 3],
      ["\u0646\u0627", -1, 2],
      ["\u0647\u0627", -1, 2],
      ["\u0643", -1, 1],
      ["\u0643\u0645", -1, 2],
      ["\u0647\u0645", -1, 2],
      ["\u0647\u0646", -1, 2],
      ["\u0647", -1, 1],
      ["\u064a", -1, 1],
    ],
    N = [["\u0646", -1, 1]],
    M = [
      ["\u0627", -1, 1],
      ["\u0648", -1, 1],
      ["\u064a", -1, 1],
    ],
    P = [["\u0627\u062a", -1, 1]],
    Q = [["\u062a", -1, 1]],
    T = [["\u0629", -1, 1]],
    U = [["\u064a", -1, 1]],
    R = [
      ["\u0643\u0645\u0627", -1, 3],
      ["\u0647\u0645\u0627", -1, 3],
      ["\u0646\u0627", -1, 2],
      ["\u0647\u0627", -1, 2],
      ["\u0643", -1, 1],
      ["\u0643\u0645", -1, 2],
      ["\u0647\u0645", -1, 2],
      ["\u0643\u0646", -1, 2],
      ["\u0647\u0646", -1, 2],
      ["\u0647", -1, 1],
      ["\u0643\u0645\u0648", -1, 3],
      ["\u0646\u064a", -1, 2],
    ],
    S = [
      ["\u0627", -1, 1],
      ["\u062a\u0627", 0, 2],
      ["\u062a\u0645\u0627", 0, 4],
      ["\u0646\u0627", 0, 2],
      ["\u062a", -1, 1],
      ["\u0646", -1, 1],
      ["\u0627\u0646", 5, 3],
      ["\u062a\u0646", 5, 2],
      ["\u0648\u0646", 5, 3],
      ["\u064a\u0646", 5, 3],
      ["\u064a", -1, 1],
    ],
    V = [
      ["\u0648\u0627", -1, 1],
      ["\u062a\u0645", -1, 1],
    ],
    I = [
      ["\u0648", -1, 1],
      ["\u062a\u0645\u0648", 0, 2],
    ],
    D = [["\u0649", -1, 1]],
    L = p,
    J = p,
    K = p;
  this.l = function () {
    J = K = g;
    L = p;
    var e = m.cursor,
      u;
    m.c = m.cursor;
    u = m.o(z);
    if (0 != u)
      switch (((m.d = m.cursor), u)) {
        case 1:
          if (!(4 < m.j.length)) break;
          K = g;
          J = p;
          L = g;
          break;
        case 2:
          if (!(3 < m.j.length)) break;
          K = g;
          J = p;
          L = g;
      }
    m.cursor = e;
    k();
    m.f = m.cursor;
    m.cursor = m.a;
    e = m.a - m.cursor;
    b: {
      u = m.a - m.cursor;
      c: if (J) {
        d: {
          var w = m.a - m.cursor;
          e: {
            for (var y = 1; ; ) {
              var A = m.a - m.cursor;
              if (t()) {
                y--;
                continue;
              }
              m.cursor = m.a - A;
              break;
            }
            if (!(0 < y)) {
              f: {
                y = m.a - m.cursor;
                if (s()) break f;
                m.cursor = m.a - y;
                if (r()) break f;
                m.cursor = m.a - y;
                if (m.cursor <= m.f) break e;
                m.cursor--;
              }
              break d;
            }
          }
          m.cursor = m.a - w;
          m.d = m.cursor;
          0 == m.h(V) ? (y = p) : ((m.c = m.cursor), (y = !(5 <= m.j.length) || !m.e() ? p : g));
          if (y) break d;
          m.cursor = m.a - w;
          if (!s()) break c;
        }
        break b;
      }
      m.cursor = m.a - u;
      if (K) {
        w = m.a - m.cursor;
        e: {
          y = m.a - m.cursor;
          m.d = m.cursor;
          0 == m.h(T) ? (A = p) : ((m.c = m.cursor), (A = !(4 <= m.j.length) || !m.e() ? p : g));
          if (A) break e;
          m.cursor = m.a - y;
          f: {
            if (L) break f;
            if (v()) {
              g: {
                A = m.a - m.cursor;
                if (b()) break g;
                m.cursor = m.a - A;
                if (f()) break g;
                m.cursor = m.a - A;
                if (q()) break g;
                m.cursor = m.a - A;
                if (m.cursor <= m.f) break f;
                m.cursor--;
              }
              break e;
            }
          }
          m.cursor = m.a - y;
          f: if (
            ((m.d = m.cursor), 0 == m.h(N) ? (A = p) : ((m.c = m.cursor), (A = !(5 < m.j.length) || !m.e() ? p : g)), A)
          ) {
            g: {
              A = m.a - m.cursor;
              if (b()) break g;
              m.cursor = m.a - A;
              if (f()) break g;
              m.cursor = m.a - A;
              if (!q()) break f;
            }
            break e;
          }
          m.cursor = m.a - y;
          f: {
            if (L) break f;
            if (b()) break e;
          }
          m.cursor = m.a - y;
          f() || (m.cursor = m.a - w);
        }
        m.d = m.cursor;
        0 == m.h(U) ? (w = p) : ((m.c = m.cursor), (w = !(3 <= m.j.length) || !m.e() ? p : g));
        if (w) break b;
      }
      m.cursor = m.a - u;
      m.d = m.cursor;
      0 != m.h(D) && ((m.c = m.cursor), m.b("\u064a"));
    }
    m.cursor = m.a - e;
    m.cursor = m.f;
    e = m.cursor;
    u = m.cursor;
    h() || (m.cursor = u);
    u = m.cursor;
    c() || (m.cursor = u);
    b: {
      u = m.cursor;
      if (a()) break b;
      m.cursor = u;
      if (K && d()) break b;
      m.cursor = u;
      J &&
        ((u = m.cursor),
        n() || (m.cursor = u),
        (m.c = m.cursor),
        0 != m.o(x) && ((m.d = m.cursor), 4 < m.j.length && ((J = g), (K = p), m.b("\u0627\u0633\u062a"))));
    }
    m.cursor = e;
    l();
    return g;
  };
  this.stemWord = function (a) {
    m.p(a);
    this.l();
    return m.j;
  };
}

const stemmerInstance = new stem();

export function stemmer(word) {
  return stemmerInstance.stemWord(word);
}
