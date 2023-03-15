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
    const a = e.a - e.cursor
    a: for (;;) {
      var b = e.a - e.cursor
      if (e.n(F, 97, 305)) {
        e.cursor = e.a - b
        break a
      }
      e.cursor = e.a - b
      if (e.cursor <= e.f) return p
      e.cursor--
    }
    a: {
      b = e.a - e.cursor
      b: if (e.g('a')) {
        c: for (;;) {
          var c = e.a - e.cursor
          if (e.n(da, 97, 305)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('e')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(ea, 101, 252)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('\u0131')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(fa, 97, 305)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('i')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(ga, 101, 105)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('o')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(Y, 111, 117)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('\u00f6')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(Z, 246, 252)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      b: if (e.g('u')) {
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(Y, 111, 117)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        break a
      }
      e.cursor = e.a - b
      if (!e.g('\u00fc')) return p
      b: for (;;) {
        b = e.a - e.cursor
        if (e.n(Z, 246, 252)) {
          e.cursor = e.a - b
          break b
        }
        e.cursor = e.a - b
        if (e.cursor <= e.f) return p
        e.cursor--
      }
    }
    e.cursor = e.a - a
    return g
  }
  function l () {
    a: {
      let a = e.a - e.cursor
      if (e.g('n')) {
        var b = e.a - e.cursor
        if (e.n(F, 97, 305)) {
          e.cursor = e.a - b
          break a
        }
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      b = e.a - e.cursor
      if (e.g('n')) return (e.cursor = e.a - b), p
      e.cursor = e.a - a
      a = e.a - e.cursor
      if (e.cursor <= e.f) return p
      e.cursor--
      if (!e.n(F, 97, 305)) return p
      e.cursor = e.a - a
    }
    return g
  }
  function h () {
    a: {
      let a = e.a - e.cursor
      if (e.g('s')) {
        var b = e.a - e.cursor
        if (e.n(F, 97, 305)) {
          e.cursor = e.a - b
          break a
        }
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      b = e.a - e.cursor
      if (e.g('s')) return (e.cursor = e.a - b), p
      e.cursor = e.a - a
      a = e.a - e.cursor
      if (e.cursor <= e.f) return p
      e.cursor--
      if (!e.n(F, 97, 305)) return p
      e.cursor = e.a - a
    }
    return g
  }
  function c () {
    a: {
      let a = e.a - e.cursor
      if (e.g('y')) {
        var b = e.a - e.cursor
        if (e.n(F, 97, 305)) {
          e.cursor = e.a - b
          break a
        }
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      b = e.a - e.cursor
      if (e.g('y')) return (e.cursor = e.a - b), p
      e.cursor = e.a - a
      a = e.a - e.cursor
      if (e.cursor <= e.f) return p
      e.cursor--
      if (!e.n(F, 97, 305)) return p
      e.cursor = e.a - a
    }
    return g
  }
  function a () {
    a: {
      let a = e.a - e.cursor
      if (e.n(W, 105, 305)) {
        var b = e.a - e.cursor
        if (e.q(F, 97, 305)) {
          e.cursor = e.a - b
          break a
        }
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      b = e.a - e.cursor
      if (e.n(W, 105, 305)) return (e.cursor = e.a - b), p
      e.cursor = e.a - a
      a = e.a - e.cursor
      if (e.cursor <= e.f) return p
      e.cursor--
      if (!e.q(F, 97, 305)) return p
      e.cursor = e.a - a
    }
    return g
  }
  function d () {
    return e.h(A) == 0 || !a() ? p : g
  }
  function n () {
    return !k() || !e.n(W, 105, 305) || !h() ? p : g
  }
  function v () {
    return e.h(H) == 0 ? p : g
  }
  function b () {
    return !k() || e.h(R) == 0 || !c() ? p : g
  }
  function f () {
    return !k() || e.h(S) == 0 ? p : g
  }
  function q () {
    return !k() || e.h(V) == 0 || !c() ? p : g
  }
  function t () {
    return !k() || e.h(D) == 0 ? p : g
  }
  function s () {
    return !k() || e.h($) == 0 || !c() ? p : g
  }
  function r () {
    return e.h(aa) == 0 || !c() ? p : g
  }
  function m () {
    return !k() || e.h(ba) == 0 || !c() ? p : g
  }
  function w () {
    e.d = e.cursor
    X = g
    a: {
      let a = e.a - e.cursor
      b: {
        c: {
          var d = e.a - e.cursor
          if (m()) break c
          e.cursor = e.a - d
          if (s()) break c
          e.cursor = e.a - d
          if (r()) break c
          e.cursor = e.a - d
          if (!e.g('ken') || !c()) break b
        }
        break a
      }
      e.cursor = e.a - a
      if (e.h(K) != 0) {
        c: {
          d = e.a - e.cursor
          if (e.h(I) != 0) break c
          e.cursor = e.a - d
          if (t()) break c
          e.cursor = e.a - d
          if (b()) break c
          e.cursor = e.a - d
          if (f()) break c
          e.cursor = e.a - d
          if (q()) break c
          e.cursor = e.a - d
        }
        if (m()) break a
      }
      e.cursor = e.a - a
      if (t()) {
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        e.d = e.cursor
        d: {
          d = e.a - e.cursor
          if (k() && e.h(J) != 0) break d
          e.cursor = e.a - d
          if (s()) break d
          e.cursor = e.a - d
          if (r()) break d
          e.cursor = e.a - d
          m() || (e.cursor = e.a - a)
        }
        X = p
        break a
      }
      e.cursor = e.a - a
      b: if (k() && e.h(L) != 0) {
        c: {
          d = e.a - e.cursor
          if (s()) break c
          e.cursor = e.a - d
          if (!r()) break b
        }
        break a
      }
      e.cursor = e.a - a
      b: {
        c: {
          d = e.a - e.cursor
          if (e.h(I) != 0) break c
          e.cursor = e.a - d
          if (q()) break c
          e.cursor = e.a - d
          if (f()) break c
          e.cursor = e.a - d
          if (!b()) break b
        }
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        e.d = e.cursor
        m() || (e.cursor = e.a - a)
        break a
      }
      e.cursor = e.a - a
      if (!k() || e.h(J) == 0) return
      e.c = e.cursor
      if (!e.e()) return
      a = e.a - e.cursor
      e.d = e.cursor
      c: {
        d = e.a - e.cursor
        if (e.h(I) != 0) break c
        e.cursor = e.a - d
        if (t()) break c
        e.cursor = e.a - d
        if (b()) break c
        e.cursor = e.a - d
        if (f()) break c
        e.cursor = e.a - d
        if (q()) break c
        e.cursor = e.a - d
      }
      m() || (e.cursor = e.a - a)
    }
    e.c = e.cursor
    e.e()
  }
  function u () {
    e.d = e.cursor
    if (!e.g('ki')) return p
    a: {
      let a = e.a - e.cursor
      if (k() && e.h(N) != 0) {
        e.c = e.cursor
        if (!e.e()) return p
        a = e.a - e.cursor
        e.d = e.cursor
        d: {
          var b = e.a - e.cursor
          if (t()) {
            e.c = e.cursor
            if (!e.e()) return p
            a = e.a - e.cursor
            u() || (e.cursor = e.a - a)
            break d
          }
          e.cursor = e.a - b
          if (d()) {
            e.c = e.cursor
            if (!e.e()) return p
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return p
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
          } else e.cursor = e.a - a
        }
        break a
      }
      e.cursor = e.a - a
      if (k() && e.h(E) != 0 && l()) {
        e.c = e.cursor
        if (!e.e()) return p
        a = e.a - e.cursor
        e.d = e.cursor
        d: {
          b = e.a - e.cursor
          if (v()) {
            e.c = e.cursor
            if (!e.e()) return p
            break d
          }
          e.cursor = e.a - b
          e: {
            e.d = e.cursor
            f: {
              const c = e.a - e.cursor
              if (d()) break f
              e.cursor = e.a - c
              if (!n()) break e
            }
            e.c = e.cursor
            if (!e.e()) return p
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return p
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break d
          }
          e.cursor = e.a - b
          u() || (e.cursor = e.a - a)
        }
        break a
      }
      e.cursor = e.a - a
      if (!k() || e.h(M) == 0) return p
      b: {
        a = e.a - e.cursor
        if (v()) {
          e.c = e.cursor
          if (!e.e()) return p
          break b
        }
        e.cursor = e.a - a
        if (n()) {
          e.c = e.cursor
          if (!e.e()) return p
          a = e.a - e.cursor
          e.d = e.cursor
          if (t()) {
            e.c = e.cursor
            if (!e.e()) return p
            u() || (e.cursor = e.a - a)
          } else e.cursor = e.a - a
          break b
        }
        e.cursor = e.a - a
        if (!u()) return p
      }
    }
    return g
  }
  function y () {
    a: {
      let a = e.a - e.cursor
      e.d = e.cursor
      if (t()) {
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        u() || (e.cursor = e.a - a)
        break a
      }
      e.cursor = e.a - a
      e.d = e.cursor
      if (k() && e.h(U) != 0 && l()) {
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        d: {
          var b = e.a - e.cursor
          e.d = e.cursor
          if (v()) {
            e.c = e.cursor
            if (!e.e()) return
            break d
          }
          e.cursor = e.a - b
          e: {
            e.d = e.cursor
            f: {
              var f = e.a - e.cursor
              if (d()) break f
              e.cursor = e.a - f
              if (!n()) break e
            }
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break d
          }
          e.cursor = e.a - b
          e.d = e.cursor
          if (t()) {
            e.c = e.cursor
            if (!e.e()) return
            u() || (e.cursor = e.a - a)
          } else e.cursor = e.a - a
        }
        break a
      }
      e.cursor = e.a - a
      b: {
        e.d = e.cursor
        c: {
          b = e.a - e.cursor
          if (k() && e.h(M) != 0) break c
          e.cursor = e.a - b
          if (!k() || e.h(O) == 0) break b
        }
        c: {
          b = e.a - e.cursor
          if (v()) {
            e.c = e.cursor
            if (!e.e()) return
            break c
          }
          e.cursor = e.a - b
          if (n()) {
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break c
          }
          e.cursor = e.a - b
          if (!u()) break b
        }
        break a
      }
      e.cursor = e.a - a
      b: {
        e.d = e.cursor
        c: {
          b = e.a - e.cursor
          if (k() && e.h(Q) != 0) break c
          e.cursor = e.a - b
          if (!k() || e.h(G) == 0) break b
        }
        c: {
          b = e.a - e.cursor
          if (n()) {
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break c
          }
          e.cursor = e.a - b
          if (!v()) break b
        }
        break a
      }
      e.cursor = e.a - a
      e.d = e.cursor
      if (k() && e.h(P) != 0) {
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        e.d = e.cursor
        d: {
          b = e.a - e.cursor
          if (d()) {
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break d
          }
          e.cursor = e.a - b
          if (t()) {
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            u() || (e.cursor = e.a - a)
            break d
          }
          e.cursor = e.a - b
          u() || (e.cursor = e.a - a)
        }
        break a
      }
      e.cursor = e.a - a
      b: {
        e.d = e.cursor
        c: {
          b = e.a - e.cursor
          if (k() && e.h(E) != 0 && l()) break c
          e.cursor = e.a - b
          if (!k() || e.h(T) == 0 || !c()) break b
        }
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        d: {
          b = e.a - e.cursor
          e.d = e.cursor
          if (t()) {
            e.c = e.cursor
            if (!e.e()) return
            if (u()) break d
          }
          e.cursor = e.a - b
          e: {
            e.d = e.cursor
            f: {
              f = e.a - e.cursor
              if (d()) break f
              e.cursor = e.a - f
              if (!n()) break e
            }
            e.c = e.cursor
            if (!e.e()) return
            a = e.a - e.cursor
            e.d = e.cursor
            if (t()) {
              e.c = e.cursor
              if (!e.e()) return
              u() || (e.cursor = e.a - a)
            } else e.cursor = e.a - a
            break d
          }
          e.cursor = e.a - b
          u() || (e.cursor = e.a - a)
        }
        break a
      }
      e.cursor = e.a - a
      e.d = e.cursor
      if (v()) {
        e.c = e.cursor
        if (!e.e()) return
        break a
      }
      e.cursor = e.a - a
      if (u()) break a
      e.cursor = e.a - a
      b: {
        e.d = e.cursor
        c: {
          b = e.a - e.cursor
          if (k() && e.h(N) != 0) break c
          e.cursor = e.a - b
          if (k() && e.n(W, 105, 305) && c()) break c
          e.cursor = e.a - b
          if (!k() || e.h(x) == 0 || !c()) break b
        }
        e.c = e.cursor
        if (!e.e()) return
        a = e.a - e.cursor
        c: {
          e.d = e.cursor
          d: {
            b = e.a - e.cursor
            if (d()) {
              e.c = e.cursor
              if (!e.e()) return
              b = e.a - e.cursor
              e.d = e.cursor
              t() || (e.cursor = e.a - b)
              break d
            }
            e.cursor = e.a - b
            if (!t()) {
              e.cursor = e.a - a
              break c
            }
          }
          e.c = e.cursor
          if (!e.e()) return
          e.d = e.cursor
          u() || (e.cursor = e.a - a)
        }
        break a
      }
      e.cursor = e.a - a
      e.d = e.cursor
      b: {
        a = e.a - e.cursor
        if (d()) break b
        e.cursor = e.a - a
        if (!n()) return
      }
      e.c = e.cursor
      e.e() &&
        ((a = e.a - e.cursor),
        (e.d = e.cursor),
        t() ? ((e.c = e.cursor), e.e() && !u() && (e.cursor = e.a - a)) : (e.cursor = e.a - a))
    }
  }
  function z () {
    let a = e.a - e.cursor
    a: {
      var b = e.a - e.cursor
      if (e.g('d')) break a
      e.cursor = e.a - b
      if (!e.g('g')) return
    }
    e.cursor = e.a - a
    a: {
      a = e.a - e.cursor
      b: {
        b = e.a - e.cursor
        c: for (;;) {
          var c = e.a - e.cursor
          if (e.n(F, 97, 305)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        c: {
          c = e.a - e.cursor
          if (e.g('a')) break c
          e.cursor = e.a - c
          if (!e.g('\u0131')) break b
        }
        e.cursor = e.a - b
        a = e.cursor
        e.r(e.cursor, e.cursor, '\u0131')
        e.cursor = a
        break a
      }
      e.cursor = e.a - a
      b: {
        b = e.a - e.cursor
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(F, 97, 305)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        c: {
          c = e.a - e.cursor
          if (e.g('e')) break c
          e.cursor = e.a - c
          if (!e.g('i')) break b
        }
        e.cursor = e.a - b
        a = e.cursor
        e.r(e.cursor, e.cursor, 'i')
        e.cursor = a
        break a
      }
      e.cursor = e.a - a
      b: {
        b = e.a - e.cursor
        c: for (;;) {
          c = e.a - e.cursor
          if (e.n(F, 97, 305)) {
            e.cursor = e.a - c
            break c
          }
          e.cursor = e.a - c
          if (e.cursor <= e.f) break b
          e.cursor--
        }
        c: {
          c = e.a - e.cursor
          if (e.g('o')) break c
          e.cursor = e.a - c
          if (!e.g('u')) break b
        }
        e.cursor = e.a - b
        a = e.cursor
        e.r(e.cursor, e.cursor, 'u')
        e.cursor = a
        break a
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      b: for (;;) {
        b = e.a - e.cursor
        if (e.n(F, 97, 305)) {
          e.cursor = e.a - b
          break b
        }
        e.cursor = e.a - b
        if (e.cursor <= e.f) return
        e.cursor--
      }
      b: {
        b = e.a - e.cursor
        if (e.g('\u00f6')) break b
        e.cursor = e.a - b
        if (!e.g('\u00fc')) return
      }
      e.cursor = e.a - a
      a = e.cursor
      e.r(e.cursor, e.cursor, '\u00fc')
      e.cursor = a
    }
  }
  var e = new C()
  var A = [
    ['m', -1, -1],
    ['n', -1, -1],
    ['miz', -1, -1],
    ['niz', -1, -1],
    ['muz', -1, -1],
    ['nuz', -1, -1],
    ['m\u00fcz', -1, -1],
    ['n\u00fcz', -1, -1],
    ['m\u0131z', -1, -1],
    ['n\u0131z', -1, -1]
  ]
  var H = [
    ['leri', -1, -1],
    ['lar\u0131', -1, -1]
  ]
  var G = [
    ['ni', -1, -1],
    ['nu', -1, -1],
    ['n\u00fc', -1, -1],
    ['n\u0131', -1, -1]
  ]
  var E = [
    ['in', -1, -1],
    ['un', -1, -1],
    ['\u00fcn', -1, -1],
    ['\u0131n', -1, -1]
  ]
  var x = [
    ['a', -1, -1],
    ['e', -1, -1]
  ]
  var O = [
    ['na', -1, -1],
    ['ne', -1, -1]
  ]
  var N = [
    ['da', -1, -1],
    ['ta', -1, -1],
    ['de', -1, -1],
    ['te', -1, -1]
  ]
  var M = [
    ['nda', -1, -1],
    ['nde', -1, -1]
  ]
  var P = [
    ['dan', -1, -1],
    ['tan', -1, -1],
    ['den', -1, -1],
    ['ten', -1, -1]
  ]
  var Q = [
    ['ndan', -1, -1],
    ['nden', -1, -1]
  ]
  var T = [
    ['la', -1, -1],
    ['le', -1, -1]
  ]
  var U = [
    ['ca', -1, -1],
    ['ce', -1, -1]
  ]
  var R = [
    ['im', -1, -1],
    ['um', -1, -1],
    ['\u00fcm', -1, -1],
    ['\u0131m', -1, -1]
  ]
  var S = [
    ['sin', -1, -1],
    ['sun', -1, -1],
    ['s\u00fcn', -1, -1],
    ['s\u0131n', -1, -1]
  ]
  var V = [
    ['iz', -1, -1],
    ['uz', -1, -1],
    ['\u00fcz', -1, -1],
    ['\u0131z', -1, -1]
  ]
  var I = [
    ['siniz', -1, -1],
    ['sunuz', -1, -1],
    ['s\u00fcn\u00fcz', -1, -1],
    ['s\u0131n\u0131z', -1, -1]
  ]
  var D = [
    ['lar', -1, -1],
    ['ler', -1, -1]
  ]
  var L = [
    ['niz', -1, -1],
    ['nuz', -1, -1],
    ['n\u00fcz', -1, -1],
    ['n\u0131z', -1, -1]
  ]
  var J = [
    ['dir', -1, -1],
    ['tir', -1, -1],
    ['dur', -1, -1],
    ['tur', -1, -1],
    ['d\u00fcr', -1, -1],
    ['t\u00fcr', -1, -1],
    ['d\u0131r', -1, -1],
    ['t\u0131r', -1, -1]
  ]
  var K = [
    ['cas\u0131na', -1, -1],
    ['cesine', -1, -1]
  ]
  var $ = [
    ['di', -1, -1],
    ['ti', -1, -1],
    ['dik', -1, -1],
    ['tik', -1, -1],
    ['duk', -1, -1],
    ['tuk', -1, -1],
    ['d\u00fck', -1, -1],
    ['t\u00fck', -1, -1],
    ['d\u0131k', -1, -1],
    ['t\u0131k', -1, -1],
    ['dim', -1, -1],
    ['tim', -1, -1],
    ['dum', -1, -1],
    ['tum', -1, -1],
    ['d\u00fcm', -1, -1],
    ['t\u00fcm', -1, -1],
    ['d\u0131m', -1, -1],
    ['t\u0131m', -1, -1],
    ['din', -1, -1],
    ['tin', -1, -1],
    ['dun', -1, -1],
    ['tun', -1, -1],
    ['d\u00fcn', -1, -1],
    ['t\u00fcn', -1, -1],
    ['d\u0131n', -1, -1],
    ['t\u0131n', -1, -1],
    ['du', -1, -1],
    ['tu', -1, -1],
    ['d\u00fc', -1, -1],
    ['t\u00fc', -1, -1],
    ['d\u0131', -1, -1],
    ['t\u0131', -1, -1]
  ]
  var aa = [
    ['sa', -1, -1],
    ['se', -1, -1],
    ['sak', -1, -1],
    ['sek', -1, -1],
    ['sam', -1, -1],
    ['sem', -1, -1],
    ['san', -1, -1],
    ['sen', -1, -1]
  ]
  var ba = [
    ['mi\u015f', -1, -1],
    ['mu\u015f', -1, -1],
    ['m\u00fc\u015f', -1, -1],
    ['m\u0131\u015f', -1, -1]
  ]
  const ca = [
    ['b', -1, 1],
    ['c', -1, 2],
    ['d', -1, 3],
    ['\u011f', -1, 4]
  ]
  var F = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 8, 0, 0, 0, 0, 0, 0, 1]
  var W = [1, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 1]
  var da = [1, 64, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  var ea = [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130]
  var fa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  var ga = [17]
  var Y = [65]
  var Z = [65]
  var X = p
  this.l = function () {
    let a
    a = e.cursor
    for (var b = 2; ;) {
      const c = e.cursor
      b: {
        c: for (;;) {
          if (e.i(F, 97, 305)) break c
          if (e.cursor >= e.a) break b
          e.cursor++
        }
        b--
        continue
      }
      e.cursor = c
      break
    }
    b > 0 ? (a = p) : ((e.cursor = a), (a = g))
    if (!a) return p
    e.f = e.cursor
    e.cursor = e.a
    a = e.a - e.cursor
    w()
    e.cursor = e.a - a
    if (!X) return p
    a = e.a - e.cursor
    y()
    e.cursor = e.a - a
    e.cursor = e.f
    a: {
      e.f = e.cursor
      e.cursor = e.a
      a = e.a - e.cursor
      e.g('ad') ? ((b = e.a - e.cursor), e.g('soy') || (e.cursor = e.a - b), (b = e.cursor > e.f ? p : g)) : (b = p)
      if (b) {
        a = p
        break a
      }
      e.cursor = e.a - a
      a = e.a - e.cursor
      z()
      e.cursor = e.a - a
      a = e.a - e.cursor
      e.d = e.cursor
      b = e.h(ca)
      if (b != 0) {
        switch (((e.c = e.cursor), b)) {
          case 1:
            if (!e.b('p')) break
            break
          case 2:
            if (!e.b('\u00e7')) break
            break
          case 3:
            if (!e.b('t')) break
            break
          case 4:
            e.b('k')
        }
      }
      e.cursor = e.a - a
      e.cursor = e.f
      a = g
    }
    return !a ? p : g
  }
  this.stemWord = function (a) {
    e.p(a)
    this.l()
    return e.j
  }
}

const stemmerInstance = new stem()

export function stemmer (word) {
  return stemmerInstance.stemWord(word)
}
