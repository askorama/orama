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
    var a;
    l.d = l.cursor;
    a = l.h(d);
    if (0 != a)
      switch (((l.c = l.cursor), a)) {
        case 1:
          if (!l.b("t")) break;
          break;
        case 2:
          l.b("d");
      }
  }
  var l = new C(),
    h = [
      ["a", -1, -1],
      ["ia", 0, -1],
      ["eria", 1, -1],
      ["osna", 0, -1],
      ["iosna", 3, -1],
      ["uosna", 3, -1],
      ["iuosna", 5, -1],
      ["ysna", 0, -1],
      ["\u0117sna", 0, -1],
      ["e", -1, -1],
      ["ie", 9, -1],
      ["enie", 10, -1],
      ["erie", 10, -1],
      ["oje", 9, -1],
      ["ioje", 13, -1],
      ["uje", 9, -1],
      ["iuje", 15, -1],
      ["yje", 9, -1],
      ["enyje", 17, -1],
      ["eryje", 17, -1],
      ["\u0117je", 9, -1],
      ["ame", 9, -1],
      ["iame", 21, -1],
      ["sime", 9, -1],
      ["ome", 9, -1],
      ["\u0117me", 9, -1],
      ["tum\u0117me", 25, -1],
      ["ose", 9, -1],
      ["iose", 27, -1],
      ["uose", 27, -1],
      ["iuose", 29, -1],
      ["yse", 9, -1],
      ["enyse", 31, -1],
      ["eryse", 31, -1],
      ["\u0117se", 9, -1],
      ["ate", 9, -1],
      ["iate", 35, -1],
      ["ite", 9, -1],
      ["kite", 37, -1],
      ["site", 37, -1],
      ["ote", 9, -1],
      ["tute", 9, -1],
      ["\u0117te", 9, -1],
      ["tum\u0117te", 42, -1],
      ["i", -1, -1],
      ["ai", 44, -1],
      ["iai", 45, -1],
      ["eriai", 46, -1],
      ["ei", 44, -1],
      ["tumei", 48, -1],
      ["ki", 44, -1],
      ["imi", 44, -1],
      ["erimi", 51, -1],
      ["umi", 44, -1],
      ["iumi", 53, -1],
      ["si", 44, -1],
      ["asi", 55, -1],
      ["iasi", 56, -1],
      ["esi", 55, -1],
      ["iesi", 58, -1],
      ["siesi", 59, -1],
      ["isi", 55, -1],
      ["aisi", 61, -1],
      ["eisi", 61, -1],
      ["tumeisi", 63, -1],
      ["uisi", 61, -1],
      ["osi", 55, -1],
      ["\u0117josi", 66, -1],
      ["uosi", 66, -1],
      ["iuosi", 68, -1],
      ["siuosi", 69, -1],
      ["usi", 55, -1],
      ["ausi", 71, -1],
      ["\u010diausi", 72, -1],
      ["\u0105si", 55, -1],
      ["\u0117si", 55, -1],
      ["\u0173si", 55, -1],
      ["t\u0173si", 76, -1],
      ["ti", 44, -1],
      ["enti", 78, -1],
      ["inti", 78, -1],
      ["oti", 78, -1],
      ["ioti", 81, -1],
      ["uoti", 81, -1],
      ["iuoti", 83, -1],
      ["auti", 78, -1],
      ["iauti", 85, -1],
      ["yti", 78, -1],
      ["\u0117ti", 78, -1],
      ["tel\u0117ti", 88, -1],
      ["in\u0117ti", 88, -1],
      ["ter\u0117ti", 88, -1],
      ["ui", 44, -1],
      ["iui", 92, -1],
      ["eniui", 93, -1],
      ["oj", -1, -1],
      ["\u0117j", -1, -1],
      ["k", -1, -1],
      ["am", -1, -1],
      ["iam", 98, -1],
      ["iem", -1, -1],
      ["im", -1, -1],
      ["sim", 101, -1],
      ["om", -1, -1],
      ["tum", -1, -1],
      ["\u0117m", -1, -1],
      ["tum\u0117m", 105, -1],
      ["an", -1, -1],
      ["on", -1, -1],
      ["ion", 108, -1],
      ["un", -1, -1],
      ["iun", 110, -1],
      ["\u0117n", -1, -1],
      ["o", -1, -1],
      ["io", 113, -1],
      ["enio", 114, -1],
      ["\u0117jo", 113, -1],
      ["uo", 113, -1],
      ["s", -1, -1],
      ["as", 118, -1],
      ["ias", 119, -1],
      ["es", 118, -1],
      ["ies", 121, -1],
      ["is", 118, -1],
      ["ais", 123, -1],
      ["iais", 124, -1],
      ["tumeis", 123, -1],
      ["imis", 123, -1],
      ["enimis", 127, -1],
      ["omis", 123, -1],
      ["iomis", 129, -1],
      ["umis", 123, -1],
      ["\u0117mis", 123, -1],
      ["enis", 123, -1],
      ["asis", 123, -1],
      ["ysis", 123, -1],
      ["ams", 118, -1],
      ["iams", 136, -1],
      ["iems", 118, -1],
      ["ims", 118, -1],
      ["enims", 139, -1],
      ["erims", 139, -1],
      ["oms", 118, -1],
      ["ioms", 142, -1],
      ["ums", 118, -1],
      ["\u0117ms", 118, -1],
      ["ens", 118, -1],
      ["os", 118, -1],
      ["ios", 147, -1],
      ["uos", 147, -1],
      ["iuos", 149, -1],
      ["ers", 118, -1],
      ["us", 118, -1],
      ["aus", 152, -1],
      ["iaus", 153, -1],
      ["ius", 152, -1],
      ["ys", 118, -1],
      ["enys", 156, -1],
      ["erys", 156, -1],
      ["\u0105s", 118, -1],
      ["i\u0105s", 159, -1],
      ["\u0117s", 118, -1],
      ["am\u0117s", 161, -1],
      ["iam\u0117s", 162, -1],
      ["im\u0117s", 161, -1],
      ["kim\u0117s", 164, -1],
      ["sim\u0117s", 164, -1],
      ["om\u0117s", 161, -1],
      ["\u0117m\u0117s", 161, -1],
      ["tum\u0117m\u0117s", 168, -1],
      ["at\u0117s", 161, -1],
      ["iat\u0117s", 170, -1],
      ["sit\u0117s", 161, -1],
      ["ot\u0117s", 161, -1],
      ["\u0117t\u0117s", 161, -1],
      ["tum\u0117t\u0117s", 174, -1],
      ["\u012fs", 118, -1],
      ["\u016bs", 118, -1],
      ["t\u0173s", 118, -1],
      ["at", -1, -1],
      ["iat", 179, -1],
      ["it", -1, -1],
      ["sit", 181, -1],
      ["ot", -1, -1],
      ["\u0117t", -1, -1],
      ["tum\u0117t", 184, -1],
      ["u", -1, -1],
      ["au", 186, -1],
      ["iau", 187, -1],
      ["\u010diau", 188, -1],
      ["iu", 186, -1],
      ["eniu", 190, -1],
      ["siu", 190, -1],
      ["y", -1, -1],
      ["\u0105", -1, -1],
      ["i\u0105", 194, -1],
      ["\u0117", -1, -1],
      ["\u0119", -1, -1],
      ["\u012f", -1, -1],
      ["en\u012f", 198, -1],
      ["er\u012f", 198, -1],
      ["\u0173", -1, -1],
      ["i\u0173", 201, -1],
      ["er\u0173", 201, -1],
    ],
    c = [
      ["ing", -1, -1],
      ["aj", -1, -1],
      ["iaj", 1, -1],
      ["iej", -1, -1],
      ["oj", -1, -1],
      ["ioj", 4, -1],
      ["uoj", 4, -1],
      ["iuoj", 6, -1],
      ["auj", -1, -1],
      ["\u0105j", -1, -1],
      ["i\u0105j", 9, -1],
      ["\u0117j", -1, -1],
      ["\u0173j", -1, -1],
      ["i\u0173j", 12, -1],
      ["ok", -1, -1],
      ["iok", 14, -1],
      ["iuk", -1, -1],
      ["uliuk", 16, -1],
      ["u\u010diuk", 16, -1],
      ["i\u0161k", -1, -1],
      ["iul", -1, -1],
      ["yl", -1, -1],
      ["\u0117l", -1, -1],
      ["am", -1, -1],
      ["dam", 23, -1],
      ["jam", 23, -1],
      ["zgan", -1, -1],
      ["ain", -1, -1],
      ["esn", -1, -1],
      ["op", -1, -1],
      ["iop", 29, -1],
      ["ias", -1, -1],
      ["ies", -1, -1],
      ["ais", -1, -1],
      ["iais", 33, -1],
      ["os", -1, -1],
      ["ios", 35, -1],
      ["uos", 35, -1],
      ["iuos", 37, -1],
      ["aus", -1, -1],
      ["iaus", 39, -1],
      ["\u0105s", -1, -1],
      ["i\u0105s", 41, -1],
      ["\u0119s", -1, -1],
      ["ut\u0117ait", -1, -1],
      ["ant", -1, -1],
      ["iant", 45, -1],
      ["siant", 46, -1],
      ["int", -1, -1],
      ["ot", -1, -1],
      ["uot", 49, -1],
      ["iuot", 50, -1],
      ["yt", -1, -1],
      ["\u0117t", -1, -1],
      ["yk\u0161t", -1, -1],
      ["iau", -1, -1],
      ["dav", -1, -1],
      ["sv", -1, -1],
      ["\u0161v", -1, -1],
      ["yk\u0161\u010d", -1, -1],
      ["\u0119", -1, -1],
      ["\u0117j\u0119", 60, -1],
    ],
    a = [
      ["ojime", -1, 7],
      ["\u0117jime", -1, 3],
      ["avime", -1, 6],
      ["okate", -1, 8],
      ["aite", -1, 1],
      ["uote", -1, 2],
      ["asius", -1, 5],
      ["okat\u0117s", -1, 8],
      ["ait\u0117s", -1, 1],
      ["uot\u0117s", -1, 2],
      ["esiu", -1, 4],
    ],
    d = [
      ["\u010d", -1, 1],
      ["d\u017e", -1, 2],
    ],
    n = [["gd", -1, 1]],
    v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 64, 1, 0, 64, 0, 0, 0, 0, 0, 0, 0, 4, 4],
    b = 0;
  this.l = function () {
    b = l.a;
    var d = l.cursor;
    a: {
      var q = l.cursor;
      var t = l.cursor;
      l.m("a")
        ? ((l.cursor = t), 6 < l.j.length ? ((t = l.cursor + 1), (l.cursor = t > l.a ? q : t)) : (l.cursor = q))
        : (l.cursor = q);
      b: for (;;) {
        if (l.i(v, 97, 371)) break b;
        if (l.cursor >= l.a) break a;
        l.cursor++;
      }
      b: for (;;) {
        if (l.k(v, 97, 371)) break b;
        if (l.cursor >= l.a) break a;
        l.cursor++;
      }
      b = l.cursor;
    }
    l.cursor = d;
    l.f = l.cursor;
    l.cursor = l.a;
    d = l.a - l.cursor;
    l.d = l.cursor;
    q = l.h(a);
    if (0 != q)
      switch (((l.c = l.cursor), q)) {
        case 1:
          if (!l.b("ait\u0117")) break;
          break;
        case 2:
          if (!l.b("uot\u0117")) break;
          break;
        case 3:
          if (!l.b("\u0117jimas")) break;
          break;
        case 4:
          if (!l.b("esys")) break;
          break;
        case 5:
          if (!l.b("asys")) break;
          break;
        case 6:
          if (!l.b("avimas")) break;
          break;
        case 7:
          if (!l.b("ojimas")) break;
          break;
        case 8:
          l.b("okat\u0117");
      }
    l.cursor = l.a - d;
    d = l.a - l.cursor;
    l.cursor < b ||
      ((q = l.f),
      (l.f = b),
      (l.d = l.cursor),
      0 == l.h(h) ? (l.f = q) : ((l.c = l.cursor), (l.f = q), !(b <= l.cursor) || l.e()));
    l.cursor = l.a - d;
    d = l.a - l.cursor;
    k();
    l.cursor = l.a - d;
    d = l.a - l.cursor;
    a: for (;;) {
      q = l.a - l.cursor;
      if (!(l.cursor < b))
        if (((t = l.f), (l.f = b), (l.d = l.cursor), 0 == l.h(c))) l.f = t;
        else {
          l.c = l.cursor;
          l.f = t;
          if (!l.e()) break a;
          continue;
        }
      l.cursor = l.a - q;
      break;
    }
    l.cursor = l.a - d;
    d = l.a - l.cursor;
    k();
    l.cursor = l.a - d;
    d = l.a - l.cursor;
    l.d = l.cursor;
    0 != l.h(n) && ((l.c = l.cursor), l.b("g"));
    l.cursor = l.a - d;
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
