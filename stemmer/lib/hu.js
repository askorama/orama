/*
 * -----------------------------------------------------------------------------
 * GENERATED FILE - DO NOT EDIT!
 * This file has been compiled using the Snowball stemmer generator.
 * Don't edit this file directly.
 * -----------------------------------------------------------------------------
 */

const g = !0
const p = !1

function C () {
  this.p = function (k) {
    this.j = k
    this.cursor = 0
    this.a = this.j.length
    this.f = 0
    this.c = this.cursor
    this.d = this.a
  }
  this.z = function () {
    return this.j
  }
  this.w = function (k) {
    this.j = k.j
    this.cursor = k.cursor
    this.a = k.a
    this.f = k.f
    this.c = k.c
    this.d = k.d
  }
  this.i = function (k, l, h) {
    if (this.cursor >= this.a) return p
    let c = this.j.charCodeAt(this.cursor)
    if (c > h || c < l) return p
    c -= l
    if ((k[c >>> 3] & (1 << (c & 7))) == 0) return p
    this.cursor++
    return g
  }
  this.n = function (k, l, h) {
    if (this.cursor <= this.f) return p
    let c = this.j.charCodeAt(this.cursor - 1)
    if (c > h || c < l) return p
    c -= l
    if ((k[c >>> 3] & (1 << (c & 7))) == 0) return p
    this.cursor--
    return g
  }
  this.k = function (k, l, h) {
    if (this.cursor >= this.a) return p
    let c = this.j.charCodeAt(this.cursor)
    if (c > h || c < l) return this.cursor++, g
    c -= l
    return (k[c >>> 3] & (1 << (c & 7))) == 0 ? (this.cursor++, g) : p
  }
  this.q = function (k, l, h) {
    if (this.cursor <= this.f) return p
    let c = this.j.charCodeAt(this.cursor - 1)
    if (c > h || c < l) return this.cursor--, g
    c -= l
    return (k[c >>> 3] & (1 << (c & 7))) == 0 ? (this.cursor--, g) : p
  }
  this.m = function (k) {
    if (this.a - this.cursor < k.length || this.j.slice(this.cursor, this.cursor + k.length) != k) return p
    this.cursor += k.length
    return g
  }
  this.g = function (k) {
    if (this.cursor - this.f < k.length || this.j.slice(this.cursor - k.length, this.cursor) != k) return p
    this.cursor -= k.length
    return g
  }
  this.o = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.a, d = 0, n = 0, v = p; ;) {
      const b = l + ((h - l) >>> 1)
      let f = 0
      let q = d < n ? d : n
      var t = k[b]
      var s
      for (s = q; s < t[0].length; s++) {
        if (c + q == a) {
          f = -1
          break
        }
        f = this.j.charCodeAt(c + q) - t[0].charCodeAt(s)
        if (f != 0) break
        q++
      }
      f < 0 ? ((h = b), (n = q)) : ((l = b), (d = q))
      if (h - l <= 1) {
        if (l > 0) break
        if (h == l) break
        if (v) break
        v = g
      }
    }
    for (;;) {
      t = k[l]
      if (d >= t[0].length) {
        this.cursor = c + t[0].length
        if (t.length < 4) return t[2]
        l = t[3](this)
        this.cursor = c + t[0].length
        if (l) return t[2]
      }
      l = t[1]
      if (l < 0) return 0
    }
  }
  this.h = function (k) {
    for (var l = 0, h = k.length, c = this.cursor, a = this.f, d = 0, n = 0, v = p; ;) {
      const b = l + ((h - l) >> 1)
      let f = 0
      let q = d < n ? d : n
      var t = k[b]
      var s
      for (s = t[0].length - 1 - q; s >= 0; s--) {
        if (c - q == a) {
          f = -1
          break
        }
        f = this.j.charCodeAt(c - 1 - q) - t[0].charCodeAt(s)
        if (f != 0) break
        q++
      }
      f < 0 ? ((h = b), (n = q)) : ((l = b), (d = q))
      if (h - l <= 1) {
        if (l > 0) break
        if (h == l) break
        if (v) break
        v = g
      }
    }
    for (;;) {
      t = k[l]
      if (d >= t[0].length) {
        this.cursor = c - t[0].length
        if (t.length < 4) return t[2]
        l = t[3](this)
        this.cursor = c - t[0].length
        if (l) return t[2]
      }
      l = t[1]
      if (l < 0) return 0
    }
  }
  this.s = function (k, l, h) {
    const c = h.length - (l - k)
    this.j = this.j.slice(0, k) + h + this.j.slice(l)
    this.a += c
    this.cursor >= l ? (this.cursor += c) : this.cursor > k && (this.cursor = k)
    return c
  }
  this.t = function () {
    return this.c < 0 || this.c > this.d || this.d > this.a || this.a > this.j.length ? p : g
  }
  this.b = function (k) {
    let l = p
    this.t() && (this.s(this.c, this.d, k), (l = g))
    return l
  }
  this.e = function () {
    return this.b('')
  }
  this.r = function (k, l, h) {
    l = this.s(k, l, h)
    k <= this.c && (this.c += l)
    k <= this.d && (this.d += l)
  }
  this.u = function () {
    let k = ''
    this.t() && (k = this.j.slice(this.c, this.d))
    return k
  }
  this.v = function () {
    return this.j.slice(0, this.a)
  }
}

function stem () {
  function k () {
    return !(y <= c.cursor) ? p : g
  }
  function l () {
    const a = c.a - c.cursor
    if (c.h(n) == 0) return p
    c.cursor = c.a - a
    return g
  }
  function h () {
    if (!(c.cursor <= c.f)) {
      c.cursor--
      c.d = c.cursor
      const a = c.cursor - 1
      a < c.f || ((c.cursor = a), (c.c = c.cursor), c.e())
    }
  }
  var c = new C()
  const a = [
    ['cs', -1, -1],
    ['dzs', -1, -1],
    ['gy', -1, -1],
    ['ly', -1, -1],
    ['ny', -1, -1],
    ['sz', -1, -1],
    ['ty', -1, -1],
    ['zs', -1, -1]
  ]
  const d = [
    ['\u00e1', -1, 1],
    ['\u00e9', -1, 2]
  ]
  var n = [
    ['bb', -1, -1],
    ['cc', -1, -1],
    ['dd', -1, -1],
    ['ff', -1, -1],
    ['gg', -1, -1],
    ['jj', -1, -1],
    ['kk', -1, -1],
    ['ll', -1, -1],
    ['mm', -1, -1],
    ['nn', -1, -1],
    ['pp', -1, -1],
    ['rr', -1, -1],
    ['ccs', -1, -1],
    ['ss', -1, -1],
    ['zzs', -1, -1],
    ['tt', -1, -1],
    ['vv', -1, -1],
    ['ggy', -1, -1],
    ['lly', -1, -1],
    ['nny', -1, -1],
    ['tty', -1, -1],
    ['ssz', -1, -1],
    ['zz', -1, -1]
  ]
  const v = [
    ['al', -1, 1],
    ['el', -1, 1]
  ]
  const b = [
    ['ba', -1, -1],
    ['ra', -1, -1],
    ['be', -1, -1],
    ['re', -1, -1],
    ['ig', -1, -1],
    ['nak', -1, -1],
    ['nek', -1, -1],
    ['val', -1, -1],
    ['vel', -1, -1],
    ['ul', -1, -1],
    ['n\u00e1l', -1, -1],
    ['n\u00e9l', -1, -1],
    ['b\u00f3l', -1, -1],
    ['r\u00f3l', -1, -1],
    ['t\u00f3l', -1, -1],
    ['\u00fcl', -1, -1],
    ['b\u0151l', -1, -1],
    ['r\u0151l', -1, -1],
    ['t\u0151l', -1, -1],
    ['n', -1, -1],
    ['an', 19, -1],
    ['ban', 20, -1],
    ['en', 19, -1],
    ['ben', 22, -1],
    ['k\u00e9ppen', 22, -1],
    ['on', 19, -1],
    ['\u00f6n', 19, -1],
    ['k\u00e9pp', -1, -1],
    ['kor', -1, -1],
    ['t', -1, -1],
    ['at', 29, -1],
    ['et', 29, -1],
    ['k\u00e9nt', 29, -1],
    ['ank\u00e9nt', 32, -1],
    ['enk\u00e9nt', 32, -1],
    ['onk\u00e9nt', 32, -1],
    ['ot', 29, -1],
    ['\u00e9rt', 29, -1],
    ['\u00f6t', 29, -1],
    ['hez', -1, -1],
    ['hoz', -1, -1],
    ['h\u00f6z', -1, -1],
    ['v\u00e1', -1, -1],
    ['v\u00e9', -1, -1]
  ]
  const f = [
    ['\u00e1n', -1, 2],
    ['\u00e9n', -1, 1],
    ['\u00e1nk\u00e9nt', -1, 2]
  ]
  const q = [
    ['stul', -1, 1],
    ['astul', 0, 1],
    ['\u00e1stul', 0, 2],
    ['st\u00fcl', -1, 1],
    ['est\u00fcl', 3, 1],
    ['\u00e9st\u00fcl', 3, 3]
  ]
  const t = [
    ['\u00e1', -1, 1],
    ['\u00e9', -1, 1]
  ]
  const s = [
    ['k', -1, 3],
    ['ak', 0, 3],
    ['ek', 0, 3],
    ['ok', 0, 3],
    ['\u00e1k', 0, 1],
    ['\u00e9k', 0, 2],
    ['\u00f6k', 0, 3]
  ]
  const r = [
    ['\u00e9i', -1, 1],
    ['\u00e1\u00e9i', 0, 3],
    ['\u00e9\u00e9i', 0, 2],
    ['\u00e9', -1, 1],
    ['k\u00e9', 3, 1],
    ['ak\u00e9', 4, 1],
    ['ek\u00e9', 4, 1],
    ['ok\u00e9', 4, 1],
    ['\u00e1k\u00e9', 4, 3],
    ['\u00e9k\u00e9', 4, 2],
    ['\u00f6k\u00e9', 4, 1],
    ['\u00e9\u00e9', 3, 2]
  ]
  const m = [
    ['a', -1, 1],
    ['ja', 0, 1],
    ['d', -1, 1],
    ['ad', 2, 1],
    ['ed', 2, 1],
    ['od', 2, 1],
    ['\u00e1d', 2, 2],
    ['\u00e9d', 2, 3],
    ['\u00f6d', 2, 1],
    ['e', -1, 1],
    ['je', 9, 1],
    ['nk', -1, 1],
    ['unk', 11, 1],
    ['\u00e1nk', 11, 2],
    ['\u00e9nk', 11, 3],
    ['\u00fcnk', 11, 1],
    ['uk', -1, 1],
    ['juk', 16, 1],
    ['\u00e1juk', 17, 2],
    ['\u00fck', -1, 1],
    ['j\u00fck', 19, 1],
    ['\u00e9j\u00fck', 20, 3],
    ['m', -1, 1],
    ['am', 22, 1],
    ['em', 22, 1],
    ['om', 22, 1],
    ['\u00e1m', 22, 2],
    ['\u00e9m', 22, 3],
    ['o', -1, 1],
    ['\u00e1', -1, 2],
    ['\u00e9', -1, 3]
  ]
  const w = [
    ['id', -1, 1],
    ['aid', 0, 1],
    ['jaid', 1, 1],
    ['eid', 0, 1],
    ['jeid', 3, 1],
    ['\u00e1id', 0, 2],
    ['\u00e9id', 0, 3],
    ['i', -1, 1],
    ['ai', 7, 1],
    ['jai', 8, 1],
    ['ei', 7, 1],
    ['jei', 10, 1],
    ['\u00e1i', 7, 2],
    ['\u00e9i', 7, 3],
    ['itek', -1, 1],
    ['eitek', 14, 1],
    ['jeitek', 15, 1],
    ['\u00e9itek', 14, 3],
    ['ik', -1, 1],
    ['aik', 18, 1],
    ['jaik', 19, 1],
    ['eik', 18, 1],
    ['jeik', 21, 1],
    ['\u00e1ik', 18, 2],
    ['\u00e9ik', 18, 3],
    ['ink', -1, 1],
    ['aink', 25, 1],
    ['jaink', 26, 1],
    ['eink', 25, 1],
    ['jeink', 28, 1],
    ['\u00e1ink', 25, 2],
    ['\u00e9ink', 25, 3],
    ['aitok', -1, 1],
    ['jaitok', 32, 1],
    ['\u00e1itok', -1, 2],
    ['im', -1, 1],
    ['aim', 35, 1],
    ['jaim', 36, 1],
    ['eim', 35, 1],
    ['jeim', 38, 1],
    ['\u00e1im', 35, 2],
    ['\u00e9im', 35, 3]
  ]
  const u = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 36, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  var y = 0
  this.l = function () {
    let n = c.cursor
    a: {
      y = c.a
      b: {
        var e = c.cursor
        c: if (c.i(u, 97, 369)) {
          d: for (;;) {
            var A = c.cursor
            if (c.k(u, 97, 369)) {
              c.cursor = A
              break d
            }
            c.cursor = A
            if (c.cursor >= c.a) break c
            c.cursor++
          }
          d: {
            A = c.cursor
            if (c.o(a) != 0) break d
            c.cursor = A
            if (c.cursor >= c.a) break c
            c.cursor++
          }
          y = c.cursor
          break b
        }
        c.cursor = e
        if (c.k(u, 97, 369)) {
          c: for (;;) {
            if (c.i(u, 97, 369)) break c
            if (c.cursor >= c.a) break a
            c.cursor++
          }
          y = c.cursor
        }
      }
    }
    c.cursor = n
    c.f = c.cursor
    c.cursor = c.a
    n = c.a - c.cursor
    c.d = c.cursor
    c.h(v) != 0 && ((c.c = c.cursor), !k() || !l() || !c.e() || h())
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    if (
      c.h(b) != 0 &&
      ((c.c = c.cursor), k() && c.e() && ((c.d = c.cursor), (e = c.h(d)), e != 0 && ((c.c = c.cursor), k())))
    ) {
      switch (e) {
        case 1:
          if (!c.b('a')) break
          break
        case 2:
          c.b('e')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(f)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.b('e')) break
          break
        case 2:
          c.b('a')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(q)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.e()) break
          break
        case 2:
          if (!c.b('a')) break
          break
        case 3:
          c.b('e')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    c.h(t) != 0 && ((c.c = c.cursor), !k() || !l() || !c.e() || h())
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(r)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.e()) break
          break
        case 2:
          if (!c.b('e')) break
          break
        case 3:
          c.b('a')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(m)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.e()) break
          break
        case 2:
          if (!c.b('a')) break
          break
        case 3:
          c.b('e')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(w)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.e()) break
          break
        case 2:
          if (!c.b('a')) break
          break
        case 3:
          c.b('e')
      }
    }
    c.cursor = c.a - n
    n = c.a - c.cursor
    c.d = c.cursor
    e = c.h(s)
    if (e != 0 && ((c.c = c.cursor), k())) {
      switch (e) {
        case 1:
          if (!c.b('a')) break
          break
        case 2:
          if (!c.b('e')) break
          break
        case 3:
          c.e()
      }
    }
    c.cursor = c.a - n
    c.cursor = c.f
    return g
  }
  this.stemWord = function (a) {
    c.p(a)
    this.l()
    return c.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
