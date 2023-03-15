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
    for (var a, c = b.cursor; ;) {
      var e = b.cursor
      a: if (((b.c = b.cursor), (a = b.o(f)), a != 0)) {
        b.d = b.cursor
        switch (a) {
          case 1:
            if (!b.b('a')) return
            break
          case 2:
            if (!b.b('e')) return
            break
          case 3:
            if (!b.b('i')) return
            break
          case 4:
            if (!b.b('o')) return
            break
          case 5:
            if (!b.b('u')) return
            break
          case 6:
            if (b.cursor >= b.a) break a
            b.cursor++
        }
        continue
      }
      b.cursor = e
      break
    }
    b.cursor = c
    a = b.cursor
    b.c = b.cursor
    if (b.m('y')) {
      if (((b.d = b.cursor), !b.b('Y'))) return
    } else b.cursor = a
    for (;;) {
      a = b.cursor
      a: {
        b: for (;;) {
          c = b.cursor
          c: if (b.i(w, 97, 232)) {
            b.c = b.cursor
            d: {
              e = b.cursor
              if (b.m('i') && ((b.d = b.cursor), b.i(w, 97, 232))) {
                if (!b.b('I')) return
                break d
              }
              b.cursor = e
              if (!b.m('y')) break c
              b.d = b.cursor
              if (!b.b('Y')) return
            }
            b.cursor = c
            break b
          }
          b.cursor = c
          if (b.cursor >= b.a) break a
          b.cursor++
        }
        continue
      }
      b.cursor = a
      break
    }
  }
  function l () {
    z = e = b.a
    a: for (;;) {
      if (b.i(w, 97, 232)) break a
      if (b.cursor >= b.a) return
      b.cursor++
    }
    a: for (;;) {
      if (b.k(w, 97, 232)) break a
      if (b.cursor >= b.a) return
      b.cursor++
    }
    e = b.cursor
    e < 3 && (e = 3)
    a: for (;;) {
      if (b.i(w, 97, 232)) break a
      if (b.cursor >= b.a) return
      b.cursor++
    }
    a: for (;;) {
      if (b.k(w, 97, 232)) break a
      if (b.cursor >= b.a) return
      b.cursor++
    }
    z = b.cursor
  }
  function h () {
    return !(e <= b.cursor) ? p : g
  }
  function c () {
    return !(z <= b.cursor) ? p : g
  }
  function a () {
    const a = b.a - b.cursor
    if (b.h(t) == 0) return p
    b.cursor = b.a - a
    b.d = b.cursor
    if (b.cursor <= b.f) return p
    b.cursor--
    b.c = b.cursor
    return !b.e() ? p : g
  }
  function d () {
    A = p
    b.d = b.cursor
    if (!b.g('e')) return p
    b.c = b.cursor
    if (!h()) return p
    const c = b.a - b.cursor
    if (!b.q(w, 97, 232)) return p
    b.cursor = b.a - c
    if (!b.e()) return p
    A = g
    return !a() ? p : g
  }
  function n () {
    if (!h()) return p
    let c = b.a - b.cursor
    if (!b.q(w, 97, 232)) return p
    b.cursor = b.a - c
    c = b.a - b.cursor
    if (b.g('gem')) return p
    b.cursor = b.a - c
    return !b.e() || !a() ? p : g
  }
  function v () {
    let e
    let f = b.a - b.cursor
    a: if (((b.d = b.cursor), (e = b.h(s)), e != 0)) {
      switch (((b.c = b.cursor), e)) {
        case 1:
          if (!h()) break a
          if (!b.b('heid')) return
          break
        case 2:
          if (!n()) break a
          break
        case 3:
          if (!h()) break a
          if (!b.q(y, 97, 232)) break a
          if (!b.e()) return
      }
    }
    b.cursor = b.a - f
    f = b.a - b.cursor
    d()
    b.cursor = b.a - f
    f = b.a - b.cursor
    a: if (((b.d = b.cursor), b.g('heid') && ((b.c = b.cursor), c()))) {
      e = b.a - b.cursor
      if (b.g('c')) break a
      b.cursor = b.a - e
      if (!b.e()) return
      b.d = b.cursor
      b.g('en') && ((b.c = b.cursor), n())
    }
    b.cursor = b.a - f
    f = b.a - b.cursor
    a: if (((b.d = b.cursor), (e = b.h(r)), e != 0)) {
      switch (((b.c = b.cursor), e)) {
        case 1:
          if (!c()) break a
          if (!b.e()) return
          b: {
            e = b.a - b.cursor
            c: if (((b.d = b.cursor), b.g('ig') && ((b.c = b.cursor), c()))) {
              const k = b.a - b.cursor
              if (b.g('e')) break c
              b.cursor = b.a - k
              if (!b.e()) return
              break b
            }
            b.cursor = b.a - e
            if (!a()) break a
          }
          break
        case 2:
          if (!c()) break a
          e = b.a - b.cursor
          if (b.g('e')) break a
          b.cursor = b.a - e
          if (!b.e()) return
          break
        case 3:
          if (!c()) break a
          if (!b.e()) return
          if (!d()) break a
          break
        case 4:
          if (!c()) break a
          if (!b.e()) return
          break
        case 5:
          if (!c()) break a
          if (!A) break a
          if (!b.e()) return
      }
    }
    b.cursor = b.a - f
    f = b.a - b.cursor
    if (
      b.q(u, 73, 232) &&
      ((e = b.a - b.cursor),
      b.h(m) != 0 &&
        b.q(w, 97, 232) &&
        ((b.cursor = b.a - e), (b.d = b.cursor), !(b.cursor <= b.f) && (b.cursor--, (b.c = b.cursor), !b.e())))
    ) { return }
    b.cursor = b.a - f
  }
  var b = new C()
  var f = [
    ['', -1, 6],
    ['\u00e1', 0, 1],
    ['\u00e4', 0, 1],
    ['\u00e9', 0, 2],
    ['\u00eb', 0, 2],
    ['\u00ed', 0, 3],
    ['\u00ef', 0, 3],
    ['\u00f3', 0, 4],
    ['\u00f6', 0, 4],
    ['\u00fa', 0, 5],
    ['\u00fc', 0, 5]
  ]
  const q = [
    ['', -1, 3],
    ['I', 0, 2],
    ['Y', 0, 1]
  ]
  var t = [
    ['dd', -1, -1],
    ['kk', -1, -1],
    ['tt', -1, -1]
  ]
  var s = [
    ['ene', -1, 2],
    ['se', -1, 3],
    ['en', -1, 2],
    ['heden', 2, 1],
    ['s', -1, 3]
  ]
  var r = [
    ['end', -1, 1],
    ['ig', -1, 2],
    ['ing', -1, 1],
    ['lijk', -1, 3],
    ['baar', -1, 4],
    ['bar', -1, 5]
  ]
  var m = [
    ['aa', -1, -1],
    ['ee', -1, -1],
    ['oo', -1, -1],
    ['uu', -1, -1]
  ]
  var w = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128]
  var u = [1, 0, 0, 17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128]
  var y = [17, 67, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128]
  var z = 0
  var e = 0
  var A = p
  this.l = function () {
    let a = b.cursor
    k()
    b.cursor = a
    a = b.cursor
    l()
    b.cursor = a
    b.f = b.cursor
    b.cursor = b.a
    v()
    b.cursor = b.f
    a = b.cursor
    a: for (var c; ;) {
      const e = b.cursor
      b: if (((b.c = b.cursor), (c = b.o(q)), c != 0)) {
        b.d = b.cursor
        switch (c) {
          case 1:
            if (!b.b('y')) break a
            break
          case 2:
            if (!b.b('i')) break a
            break
          case 3:
            if (b.cursor >= b.a) break b
            b.cursor++
        }
        continue
      }
      b.cursor = e
      break
    }
    b.cursor = a
    return g
  }
  this.stemWord = function (a) {
    b.p(a)
    this.l()
    return b.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
