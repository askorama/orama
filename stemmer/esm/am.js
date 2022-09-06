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
      ["\u0580\u0578\u0580\u0564", -1, 1],
      ["\u0565\u0580\u0578\u0580\u0564", 0, 1],
      ["\u0561\u056c\u056b", -1, 1],
      ["\u0561\u056f\u056b", -1, 1],
      ["\u0578\u0580\u0561\u056f", -1, 1],
      ["\u0565\u0572", -1, 1],
      ["\u0561\u056f\u0561\u0576", -1, 1],
      ["\u0561\u0580\u0561\u0576", -1, 1],
      ["\u0565\u0576", -1, 1],
      ["\u0565\u056f\u0565\u0576", 8, 1],
      ["\u0565\u0580\u0565\u0576", 8, 1],
      ["\u0578\u0580\u0567\u0576", -1, 1],
      ["\u056b\u0576", -1, 1],
      ["\u0563\u056b\u0576", 12, 1],
      ["\u0578\u057e\u056b\u0576", 12, 1],
      ["\u056c\u0561\u0575\u0576", -1, 1],
      ["\u057e\u0578\u0582\u0576", -1, 1],
      ["\u057a\u0565\u057d", -1, 1],
      ["\u056b\u057e", -1, 1],
      ["\u0561\u057f", -1, 1],
      ["\u0561\u057e\u0565\u057f", -1, 1],
      ["\u056f\u0578\u057f", -1, 1],
      ["\u0562\u0561\u0580", -1, 1],
    ],
    h = [
      ["\u0561", -1, 1],
      ["\u0561\u0581\u0561", 0, 1],
      ["\u0565\u0581\u0561", 0, 1],
      ["\u057e\u0565", -1, 1],
      ["\u0561\u0581\u0580\u056b", -1, 1],
      ["\u0561\u0581\u056b", -1, 1],
      ["\u0565\u0581\u056b", -1, 1],
      ["\u057e\u0565\u0581\u056b", 6, 1],
      ["\u0561\u056c", -1, 1],
      ["\u0568\u0561\u056c", 8, 1],
      ["\u0561\u0576\u0561\u056c", 8, 1],
      ["\u0565\u0576\u0561\u056c", 8, 1],
      ["\u0561\u0581\u0576\u0561\u056c", 8, 1],
      ["\u0565\u056c", -1, 1],
      ["\u0568\u0565\u056c", 13, 1],
      ["\u0576\u0565\u056c", 13, 1],
      ["\u0581\u0576\u0565\u056c", 15, 1],
      ["\u0565\u0581\u0576\u0565\u056c", 16, 1],
      ["\u0579\u0565\u056c", 13, 1],
      ["\u057e\u0565\u056c", 13, 1],
      ["\u0561\u0581\u057e\u0565\u056c", 19, 1],
      ["\u0565\u0581\u057e\u0565\u056c", 19, 1],
      ["\u057f\u0565\u056c", 13, 1],
      ["\u0561\u057f\u0565\u056c", 22, 1],
      ["\u0578\u057f\u0565\u056c", 22, 1],
      ["\u056f\u0578\u057f\u0565\u056c", 24, 1],
      ["\u057e\u0561\u056e", -1, 1],
      ["\u0578\u0582\u0574", -1, 1],
      ["\u057e\u0578\u0582\u0574", 27, 1],
      ["\u0561\u0576", -1, 1],
      ["\u0581\u0561\u0576", 29, 1],
      ["\u0561\u0581\u0561\u0576", 30, 1],
      ["\u0561\u0581\u0580\u056b\u0576", -1, 1],
      ["\u0561\u0581\u056b\u0576", -1, 1],
      ["\u0565\u0581\u056b\u0576", -1, 1],
      ["\u057e\u0565\u0581\u056b\u0576", 34, 1],
      ["\u0561\u056c\u056b\u057d", -1, 1],
      ["\u0565\u056c\u056b\u057d", -1, 1],
      ["\u0561\u057e", -1, 1],
      ["\u0561\u0581\u0561\u057e", 38, 1],
      ["\u0565\u0581\u0561\u057e", 38, 1],
      ["\u0561\u056c\u0578\u057e", -1, 1],
      ["\u0565\u056c\u0578\u057e", -1, 1],
      ["\u0561\u0580", -1, 1],
      ["\u0561\u0581\u0561\u0580", 43, 1],
      ["\u0565\u0581\u0561\u0580", 43, 1],
      ["\u0561\u0581\u0580\u056b\u0580", -1, 1],
      ["\u0561\u0581\u056b\u0580", -1, 1],
      ["\u0565\u0581\u056b\u0580", -1, 1],
      ["\u057e\u0565\u0581\u056b\u0580", 48, 1],
      ["\u0561\u0581", -1, 1],
      ["\u0565\u0581", -1, 1],
      ["\u0561\u0581\u0580\u0565\u0581", 51, 1],
      ["\u0561\u056c\u0578\u0582\u0581", -1, 1],
      ["\u0565\u056c\u0578\u0582\u0581", -1, 1],
      ["\u0561\u056c\u0578\u0582", -1, 1],
      ["\u0565\u056c\u0578\u0582", -1, 1],
      ["\u0561\u0584", -1, 1],
      ["\u0581\u0561\u0584", 57, 1],
      ["\u0561\u0581\u0561\u0584", 58, 1],
      ["\u0561\u0581\u0580\u056b\u0584", -1, 1],
      ["\u0561\u0581\u056b\u0584", -1, 1],
      ["\u0565\u0581\u056b\u0584", -1, 1],
      ["\u057e\u0565\u0581\u056b\u0584", 62, 1],
      ["\u0561\u0576\u0584", -1, 1],
      ["\u0581\u0561\u0576\u0584", 64, 1],
      ["\u0561\u0581\u0561\u0576\u0584", 65, 1],
      ["\u0561\u0581\u0580\u056b\u0576\u0584", -1, 1],
      ["\u0561\u0581\u056b\u0576\u0584", -1, 1],
      ["\u0565\u0581\u056b\u0576\u0584", -1, 1],
      ["\u057e\u0565\u0581\u056b\u0576\u0584", 69, 1],
    ],
    c = [
      ["\u0578\u0580\u0564", -1, 1],
      ["\u0578\u0582\u0575\u0569", -1, 1],
      ["\u0578\u0582\u0570\u056b", -1, 1],
      ["\u0581\u056b", -1, 1],
      ["\u056b\u056c", -1, 1],
      ["\u0561\u056f", -1, 1],
      ["\u0575\u0561\u056f", 5, 1],
      ["\u0561\u0576\u0561\u056f", 5, 1],
      ["\u056b\u056f", -1, 1],
      ["\u0578\u0582\u056f", -1, 1],
      ["\u0561\u0576", -1, 1],
      ["\u057a\u0561\u0576", 10, 1],
      ["\u057d\u057f\u0561\u0576", 10, 1],
      ["\u0561\u0580\u0561\u0576", 10, 1],
      ["\u0565\u0572\u0567\u0576", -1, 1],
      ["\u0575\u0578\u0582\u0576", -1, 1],
      ["\u0578\u0582\u0569\u0575\u0578\u0582\u0576", 15, 1],
      ["\u0561\u056e\u0578", -1, 1],
      ["\u056b\u0579", -1, 1],
      ["\u0578\u0582\u057d", -1, 1],
      ["\u0578\u0582\u057d\u057f", -1, 1],
      ["\u0563\u0561\u0580", -1, 1],
      ["\u057e\u0578\u0580", -1, 1],
      ["\u0561\u057e\u0578\u0580", 22, 1],
      ["\u0578\u0581", -1, 1],
      ["\u0561\u0576\u0585\u0581", -1, 1],
      ["\u0578\u0582", -1, 1],
      ["\u0584", -1, 1],
      ["\u0579\u0565\u0584", 27, 1],
      ["\u056b\u0584", 27, 1],
      ["\u0561\u056c\u056b\u0584", 29, 1],
      ["\u0561\u0576\u056b\u0584", 29, 1],
      ["\u057e\u0561\u056e\u0584", 27, 1],
      ["\u0578\u0582\u0575\u0584", 27, 1],
      ["\u0565\u0576\u0584", 27, 1],
      ["\u0578\u0576\u0584", 27, 1],
      ["\u0578\u0582\u0576\u0584", 27, 1],
      ["\u0574\u0578\u0582\u0576\u0584", 36, 1],
      ["\u056b\u0579\u0584", 27, 1],
      ["\u0561\u0580\u0584", 27, 1],
    ],
    a = [
      ["\u057d\u0561", -1, 1],
      ["\u057e\u0561", -1, 1],
      ["\u0561\u0574\u0562", -1, 1],
      ["\u0564", -1, 1],
      ["\u0561\u0576\u0564", 3, 1],
      ["\u0578\u0582\u0569\u0575\u0561\u0576\u0564", 4, 1],
      ["\u057e\u0561\u0576\u0564", 4, 1],
      ["\u0578\u057b\u0564", 3, 1],
      ["\u0565\u0580\u0564", 3, 1],
      ["\u0576\u0565\u0580\u0564", 8, 1],
      ["\u0578\u0582\u0564", 3, 1],
      ["\u0568", -1, 1],
      ["\u0561\u0576\u0568", 11, 1],
      ["\u0578\u0582\u0569\u0575\u0561\u0576\u0568", 12, 1],
      ["\u057e\u0561\u0576\u0568", 12, 1],
      ["\u0578\u057b\u0568", 11, 1],
      ["\u0565\u0580\u0568", 11, 1],
      ["\u0576\u0565\u0580\u0568", 16, 1],
      ["\u056b", -1, 1],
      ["\u057e\u056b", 18, 1],
      ["\u0565\u0580\u056b", 18, 1],
      ["\u0576\u0565\u0580\u056b", 20, 1],
      ["\u0561\u0576\u0578\u0582\u0574", -1, 1],
      ["\u0565\u0580\u0578\u0582\u0574", -1, 1],
      ["\u0576\u0565\u0580\u0578\u0582\u0574", 23, 1],
      ["\u0576", -1, 1],
      ["\u0561\u0576", 25, 1],
      ["\u0578\u0582\u0569\u0575\u0561\u0576", 26, 1],
      ["\u057e\u0561\u0576", 26, 1],
      ["\u056b\u0576", 25, 1],
      ["\u0565\u0580\u056b\u0576", 29, 1],
      ["\u0576\u0565\u0580\u056b\u0576", 30, 1],
      ["\u0578\u0582\u0569\u0575\u0561\u0576\u0576", 25, 1],
      ["\u0565\u0580\u0576", 25, 1],
      ["\u0576\u0565\u0580\u0576", 33, 1],
      ["\u0578\u0582\u0576", 25, 1],
      ["\u0578\u057b", -1, 1],
      ["\u0578\u0582\u0569\u0575\u0561\u0576\u057d", -1, 1],
      ["\u057e\u0561\u0576\u057d", -1, 1],
      ["\u0578\u057b\u057d", -1, 1],
      ["\u0578\u057e", -1, 1],
      ["\u0561\u0576\u0578\u057e", 40, 1],
      ["\u057e\u0578\u057e", 40, 1],
      ["\u0565\u0580\u0578\u057e", 40, 1],
      ["\u0576\u0565\u0580\u0578\u057e", 43, 1],
      ["\u0565\u0580", -1, 1],
      ["\u0576\u0565\u0580", 45, 1],
      ["\u0581", -1, 1],
      ["\u056b\u0581", 47, 1],
      ["\u057e\u0561\u0576\u056b\u0581", 48, 1],
      ["\u0578\u057b\u056b\u0581", 48, 1],
      ["\u057e\u056b\u0581", 48, 1],
      ["\u0565\u0580\u056b\u0581", 48, 1],
      ["\u0576\u0565\u0580\u056b\u0581", 52, 1],
      ["\u0581\u056b\u0581", 48, 1],
      ["\u0578\u0581", 47, 1],
      ["\u0578\u0582\u0581", 47, 1],
    ],
    d = [209, 4, 128, 0, 18],
    n = 0,
    v = 0;
  this.l = function () {
    n = v = k.a;
    var b = k.cursor;
    a: {
      b: for (;;) {
        if (k.i(d, 1377, 1413)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      v = k.cursor;
      b: for (;;) {
        if (k.k(d, 1377, 1413)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      b: for (;;) {
        if (k.i(d, 1377, 1413)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      b: for (;;) {
        if (k.k(d, 1377, 1413)) break b;
        if (k.cursor >= k.a) break a;
        k.cursor++;
      }
      n = k.cursor;
    }
    k.cursor = b;
    k.f = k.cursor;
    k.cursor = k.a;
    if (k.cursor < v) return p;
    b = k.f;
    k.f = v;
    var f = k.a - k.cursor;
    k.d = k.cursor;
    0 != k.h(a) && ((k.c = k.cursor), !(n <= k.cursor) || k.e());
    k.cursor = k.a - f;
    f = k.a - k.cursor;
    k.d = k.cursor;
    0 != k.h(h) && ((k.c = k.cursor), k.e());
    k.cursor = k.a - f;
    f = k.a - k.cursor;
    k.d = k.cursor;
    0 != k.h(l) && ((k.c = k.cursor), k.e());
    k.cursor = k.a - f;
    f = k.a - k.cursor;
    k.d = k.cursor;
    0 != k.h(c) && ((k.c = k.cursor), k.e());
    k.cursor = k.a - f;
    k.f = b;
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
