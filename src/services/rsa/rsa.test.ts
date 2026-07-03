import { describe, expect, test } from 'vitest'

import { decrypt, encrypt, generateKeyPair } from './rsa'

describe('generateKeyPair', () => {
  test('computes n, φ(n), and d for the classic textbook example', () => {
    // Wikipedia's worked example: p=61, q=53, e=17
    const keyPair = generateKeyPair(61, 53, 17)
    expect(keyPair.publicKey).toEqual({ n: 3233n, e: 17n })
    expect(keyPair.privateKey).toEqual({ n: 3233n, d: 2753n })
    expect(keyPair.phi).toBe(3120n)
    expect(keyPair.p).toBe(61n)
    expect(keyPair.q).toBe(53n)
  })

  test('defaults to e = 65537 when it fits the totient', () => {
    const keyPair = generateKeyPair(1000003, 999983)
    expect(keyPair.publicKey.e).toBe(65537n)
  })

  test('falls back to a small valid exponent for toy primes', () => {
    // φ = 2 * 10 = 20, so 65537 is too large; smallest valid odd e is 3
    const keyPair = generateKeyPair(3, 11)
    expect(keyPair.publicKey.e).toBe(3n)
  })

  test('rejects non-prime inputs', () => {
    expect(() => generateKeyPair(4, 11)).toThrow('p = 4 is not prime')
    expect(() => generateKeyPair(3, 12)).toThrow('q = 12 is not prime')
  })

  test('rejects equal primes', () => {
    expect(() => generateKeyPair(11, 11)).toThrow('distinct')
  })

  test('rejects invalid public exponents', () => {
    expect(() => generateKeyPair(61, 53, 1)).toThrow('1 < e < φ(n)')
    expect(() => generateKeyPair(61, 53, 3120)).toThrow('1 < e < φ(n)')
    expect(() => generateKeyPair(61, 53, 4)).toThrow('not coprime')
  })
})

describe('encrypt and decrypt', () => {
  test('matches the textbook example values', () => {
    const { publicKey, privateKey } = generateKeyPair(61, 53, 17)
    expect(encrypt(65, publicKey)).toBe(2790n)
    expect(decrypt(2790, privateKey)).toBe(65n)
  })

  test('round-trips with toy primes', () => {
    const { publicKey, privateKey } = generateKeyPair(3, 11)
    for (let message = 0n; message < publicKey.n; message++) {
      expect(decrypt(encrypt(message, publicKey), privateKey)).toBe(message)
    }
  })

  test('round-trips with large primes', () => {
    const { publicKey, privateKey } = generateKeyPair(1000000007n, 998244353n)
    const message = 424242424242424242n
    const ciphertext = encrypt(message, publicKey)
    expect(ciphertext).not.toBe(message)
    expect(decrypt(ciphertext, privateKey)).toBe(message)
  })

  test('rejects messages outside [0, n)', () => {
    const { publicKey, privateKey } = generateKeyPair(61, 53, 17)
    expect(() => encrypt(-1, publicKey)).toThrow('range')
    expect(() => encrypt(3233, publicKey)).toThrow('range')
    expect(() => decrypt(-1, privateKey)).toThrow('range')
    expect(() => decrypt(3233, privateKey)).toThrow('range')
  })
})
