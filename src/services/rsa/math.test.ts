import { describe, expect, test } from 'vitest'

import { gcd, isPrime, modInverse, modPow, toBigInt } from './math'

describe('toBigInt', () => {
  test('passes bigints through unchanged', () => {
    expect(toBigInt(123n)).toBe(123n)
  })

  test('converts safe integers', () => {
    expect(toBigInt(42)).toBe(42n)
    expect(toBigInt(0)).toBe(0n)
  })

  test('rejects unsafe numbers', () => {
    expect(() => toBigInt(Number.MAX_SAFE_INTEGER + 1)).toThrow('not a safe integer')
    expect(() => toBigInt(1.5)).toThrow('not a safe integer')
  })
})

describe('gcd', () => {
  test('computes greatest common divisor', () => {
    expect(gcd(12n, 18n)).toBe(6n)
    expect(gcd(17n, 5n)).toBe(1n)
    expect(gcd(0n, 7n)).toBe(7n)
  })

  test('handles negative inputs', () => {
    expect(gcd(-12n, 18n)).toBe(6n)
    expect(gcd(12n, -18n)).toBe(6n)
  })
})

describe('modPow', () => {
  test('computes modular exponentiation', () => {
    expect(modPow(2n, 10n, 1000n)).toBe(24n)
    expect(modPow(65n, 17n, 3233n)).toBe(2790n)
    expect(modPow(5n, 0n, 7n)).toBe(1n)
  })

  test('normalises negative bases', () => {
    expect(modPow(-2n, 3n, 7n)).toBe(6n)
  })

  test('handles large operands', () => {
    // Fermat's little theorem: a^(p-1) ≡ 1 mod p for prime p
    const p = 2305843009213693951n // Mersenne prime 2^61 - 1
    expect(modPow(3n, p - 1n, p)).toBe(1n)
  })

  test('rejects invalid inputs', () => {
    expect(() => modPow(2n, 3n, 0n)).toThrow('Modulus must be positive')
    expect(() => modPow(2n, -1n, 7n)).toThrow('Exponent must not be negative')
  })
})

describe('modInverse', () => {
  test('computes the modular inverse', () => {
    expect(modInverse(17n, 3120n)).toBe(2753n)
    expect(modInverse(3n, 7n)).toBe(5n)
  })

  test('result is always in [1, modulus)', () => {
    const inverse = modInverse(-3n, 7n)
    expect(inverse).toBeGreaterThanOrEqual(1n)
    expect(inverse).toBeLessThan(7n)
    expect(((-3n * inverse) % 7n + 7n) % 7n).toBe(1n)
  })

  test('throws when no inverse exists', () => {
    expect(() => modInverse(4n, 8n)).toThrow('not coprime')
  })
})

describe('isPrime', () => {
  test('identifies small primes', () => {
    expect(isPrime(2)).toBe(true)
    expect(isPrime(3)).toBe(true)
    expect(isPrime(61)).toBe(true)
    expect(isPrime(65537)).toBe(true)
  })

  test('identifies small composites and non-primes', () => {
    expect(isPrime(0)).toBe(false)
    expect(isPrime(1)).toBe(false)
    expect(isPrime(4)).toBe(false)
    expect(isPrime(561)).toBe(false) // Carmichael number
    expect(isPrime(65536)).toBe(false)
  })

  test('rejects negative numbers', () => {
    expect(isPrime(-7)).toBe(false)
  })

  test('identifies large primes and composites', () => {
    expect(isPrime(1000000007n)).toBe(true)
    expect(isPrime(2305843009213693951n)).toBe(true) // 2^61 - 1
    expect(isPrime(1000000007n * 998244353n)).toBe(false)
  })
})
