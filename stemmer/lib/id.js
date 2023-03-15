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
    a.d = a.cursor
    if (a.h(v) == 0) return p
    a.c = a.cursor
    if (!a.e()) return p
    s -= 1
    return g
  }
  function l () {
    return !a.i(q, 97, 117) ? p : g
  }
  function h () {
    let c
    a.c = a.cursor
    c = a.o(b)
    if (c == 0) return p
    a.d = a.cursor
    switch (c) {
      case 1:
        if (!a.e()) return p
        t = 1
        s -= 1
        break
      case 2:
        if (!a.e()) return p
        t = 3
        s -= 1
        break
      case 3:
        t = 1
        if (!a.b('s')) return p
        s -= 1
        break
      case 4:
        t = 3
        if (!a.b('s')) return p
        s -= 1
        break
      case 5:
        t = 1
        s -= 1
        a: {
          c = a.cursor
          var d = a.cursor
          if (a.i(q, 97, 117)) {
            a.cursor = d
            if (!a.b('p')) return p
            break a
          }
          a.cursor = c
          if (!a.e()) return p
        }
        break
      case 6:
        t = 3
        s -= 1
        a: {
          c = a.cursor
          d = a.cursor
          if (a.i(q, 97, 117)) {
            a.cursor = d
            if (!a.b('p')) return p
            break a
          }
          a.cursor = c
          if (!a.e()) return p
        }
    }
    return g
  }
  function c () {
    let b
    a.c = a.cursor
    b = a.o(f)
    if (b != 0) {
      switch (((a.d = a.cursor), b)) {
        case 1:
          if (!a.e()) break
          t = 2
          s -= 1
          break
        case 2:
          if (!a.b('ajar')) break
          s -= 1
          break
        case 3:
          if (!a.e()) break
          t = 4
          s -= 1
          break
        case 4:
          if (!a.b('ajar')) break
          t = 4
          s -= 1
      }
    }
  }
  var a = new C()
  const d = [
    ['kah', -1, 1],
    ['lah', -1, 1],
    ['pun', -1, 1]
  ]
  const n = [
    ['nya', -1, 1],
    ['ku', -1, 1],
    ['mu', -1, 1]
  ]
  var v = [
    [
      'i',
      -1,
      1,
      function () {
        if (!(t <= 2)) return p
        const b = a.a - a.cursor
        if (a.g('s')) return p
        a.cursor = a.a - b
        return g
      }
    ],
    [
      'an',
      -1,
      1,
      function () {
        return t == 1 ? p : g
      }
    ],
    [
      'kan',
      1,
      1,
      function () {
        return t == 3 || t == 2 ? p : g
      }
    ]
  ]
  var b = [
    ['di', -1, 1],
    ['ke', -1, 2],
    ['me', -1, 1],
    ['mem', 2, 5],
    ['men', 2, 1],
    ['meng', 4, 1],
    ['meny', 4, 3, l],
    ['pem', -1, 6],
    ['pen', -1, 2],
    ['peng', 8, 2],
    ['peny', 8, 4, l],
    ['ter', -1, 1]
  ]
  var f = [
    [
      'be',
      -1,
      3,
      function () {
        return !a.k(q, 97, 117) || !a.m('er') ? p : g
      }
    ],
    ['belajar', 0, 4],
    ['ber', 0, 3],
    ['pe', -1, 1],
    ['pelajar', 3, 2],
    ['per', 3, 1]
  ]
  var q = [17, 65, 16]
  var t = 0
  var s = 0
  this.l = function () {
    s = 0
    let b = a.cursor
    for (;;) {
      var f = a.cursor
      b: {
        c: for (;;) {
          if (a.i(q, 97, 117)) break c
          if (a.cursor >= a.a) break b
          a.cursor++
        }
        s += 1
        continue
      }
      a.cursor = f
      break
    }
    a.cursor = b
    if (!(s > 2)) return p
    t = 0
    a.f = a.cursor
    a.cursor = a.a
    b = a.a - a.cursor
    a.d = a.cursor
    a.h(d) != 0 && ((a.c = a.cursor), a.e() && (s -= 1))
    a.cursor = a.a - b
    if (!(s > 2)) return p
    b = a.a - a.cursor
    a.d = a.cursor
    a.h(n) != 0 && ((a.c = a.cursor), a.e() && (s -= 1))
    a.cursor = a.a - b
    a.cursor = a.f
    if (!(s > 2)) return p
    a: {
      f = a.cursor
      b = a.cursor
      if (h()) {
        f = a.cursor
        const l = a.cursor
        s > 2 && ((a.f = a.cursor), (a.cursor = a.a), k() && ((a.cursor = a.f), (a.cursor = l), s > 2 && c()))
        a.cursor = f
        a.cursor = b
        break a
      }
      a.cursor = f
      b = a.cursor
      c()
      a.cursor = b
      b = a.cursor
      s > 2 && ((a.f = a.cursor), (a.cursor = a.a), k() && (a.cursor = a.f))
      a.cursor = b
    }
    return g
  }
  this.stemWord = function (b) {
    a.p(b)
    this.l()
    return a.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
