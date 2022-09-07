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
    a.d = a.cursor;
    if (0 == a.h(v)) return p;
    a.c = a.cursor;
    if (!a.e()) return p;
    s -= 1;
    return g;
  }
  function l() {
    return !a.i(q, 97, 117) ? p : g;
  }
  function h() {
    var c;
    a.c = a.cursor;
    c = a.o(b);
    if (0 == c) return p;
    a.d = a.cursor;
    switch (c) {
      case 1:
        if (!a.e()) return p;
        t = 1;
        s -= 1;
        break;
      case 2:
        if (!a.e()) return p;
        t = 3;
        s -= 1;
        break;
      case 3:
        t = 1;
        if (!a.b("s")) return p;
        s -= 1;
        break;
      case 4:
        t = 3;
        if (!a.b("s")) return p;
        s -= 1;
        break;
      case 5:
        t = 1;
        s -= 1;
        a: {
          c = a.cursor;
          var d = a.cursor;
          if (a.i(q, 97, 117)) {
            a.cursor = d;
            if (!a.b("p")) return p;
            break a;
          }
          a.cursor = c;
          if (!a.e()) return p;
        }
        break;
      case 6:
        t = 3;
        s -= 1;
        a: {
          c = a.cursor;
          d = a.cursor;
          if (a.i(q, 97, 117)) {
            a.cursor = d;
            if (!a.b("p")) return p;
            break a;
          }
          a.cursor = c;
          if (!a.e()) return p;
        }
    }
    return g;
  }
  function c() {
    var b;
    a.c = a.cursor;
    b = a.o(f);
    if (0 != b)
      switch (((a.d = a.cursor), b)) {
        case 1:
          if (!a.e()) break;
          t = 2;
          s -= 1;
          break;
        case 2:
          if (!a.b("ajar")) break;
          s -= 1;
          break;
        case 3:
          if (!a.e()) break;
          t = 4;
          s -= 1;
          break;
        case 4:
          if (!a.b("ajar")) break;
          t = 4;
          s -= 1;
      }
  }
  var a = new C(),
    d = [
      ["kah", -1, 1],
      ["lah", -1, 1],
      ["pun", -1, 1],
    ],
    n = [
      ["nya", -1, 1],
      ["ku", -1, 1],
      ["mu", -1, 1],
    ],
    v = [
      [
        "i",
        -1,
        1,
        function () {
          if (!(2 >= t)) return p;
          var b = a.a - a.cursor;
          if (a.g("s")) return p;
          a.cursor = a.a - b;
          return g;
        },
      ],
      [
        "an",
        -1,
        1,
        function () {
          return 1 == t ? p : g;
        },
      ],
      [
        "kan",
        1,
        1,
        function () {
          return 3 == t || 2 == t ? p : g;
        },
      ],
    ],
    b = [
      ["di", -1, 1],
      ["ke", -1, 2],
      ["me", -1, 1],
      ["mem", 2, 5],
      ["men", 2, 1],
      ["meng", 4, 1],
      ["meny", 4, 3, l],
      ["pem", -1, 6],
      ["pen", -1, 2],
      ["peng", 8, 2],
      ["peny", 8, 4, l],
      ["ter", -1, 1],
    ],
    f = [
      [
        "be",
        -1,
        3,
        function () {
          return !a.k(q, 97, 117) || !a.m("er") ? p : g;
        },
      ],
      ["belajar", 0, 4],
      ["ber", 0, 3],
      ["pe", -1, 1],
      ["pelajar", 3, 2],
      ["per", 3, 1],
    ],
    q = [17, 65, 16],
    t = 0,
    s = 0;
  this.l = function () {
    s = 0;
    var b = a.cursor;
    for (;;) {
      var f = a.cursor;
      b: {
        c: for (;;) {
          if (a.i(q, 97, 117)) break c;
          if (a.cursor >= a.a) break b;
          a.cursor++;
        }
        s += 1;
        continue;
      }
      a.cursor = f;
      break;
    }
    a.cursor = b;
    if (!(2 < s)) return p;
    t = 0;
    a.f = a.cursor;
    a.cursor = a.a;
    b = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(d) && ((a.c = a.cursor), a.e() && (s -= 1));
    a.cursor = a.a - b;
    if (!(2 < s)) return p;
    b = a.a - a.cursor;
    a.d = a.cursor;
    0 != a.h(n) && ((a.c = a.cursor), a.e() && (s -= 1));
    a.cursor = a.a - b;
    a.cursor = a.f;
    if (!(2 < s)) return p;
    a: {
      f = a.cursor;
      b = a.cursor;
      if (h()) {
        f = a.cursor;
        var l = a.cursor;
        2 < s && ((a.f = a.cursor), (a.cursor = a.a), k() && ((a.cursor = a.f), (a.cursor = l), 2 < s && c()));
        a.cursor = f;
        a.cursor = b;
        break a;
      }
      a.cursor = f;
      b = a.cursor;
      c();
      a.cursor = b;
      b = a.cursor;
      2 < s && ((a.f = a.cursor), (a.cursor = a.a), k() && (a.cursor = a.f));
      a.cursor = b;
    }
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
