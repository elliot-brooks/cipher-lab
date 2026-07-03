/**
 * Number-theory helpers for the RSA service.
 * All functions operate on bigint so both toy primes and large values are supported.
 */

/** Witnesses making Miller-Rabin deterministic for all n < 3.3 * 10^24. */
const MILLER_RABIN_WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]

/**
 * Normalise a number or bigint input to bigint.
 * @param {number | bigint} value - Value to convert
 * @returns {bigint} The value as a bigint
 * @throws {Error} If a number input is not a safe integer
 */
export function toBigInt(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return value
  }
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Value ${value} is not a safe integer; pass a bigint instead`)
  }
  return BigInt(value)
}

/**
 * Greatest common divisor via the Euclidean algorithm.
 * @param {bigint} a - First value
 * @param {bigint} b - Second value
 * @returns {bigint} gcd(a, b), always non-negative
 */
export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b !== 0n) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * Modular exponentiation by repeated squaring: base^exponent mod modulus.
 * @param {bigint} base - Base value
 * @param {bigint} exponent - Non-negative exponent
 * @param {bigint} modulus - Modulus, must be positive
 * @returns {bigint} base^exponent mod modulus
 * @throws {Error} If exponent is negative or modulus is not positive
 */
export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) {
    throw new Error('Modulus must be positive')
  }
  if (exponent < 0n) {
    throw new Error('Exponent must not be negative')
  }
  let result = 1n
  base = ((base % modulus) + modulus) % modulus
  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * base) % modulus
    }
    base = (base * base) % modulus
    exponent >>= 1n
  }
  return result
}

/**
 * Modular multiplicative inverse via the extended Euclidean algorithm.
 * @param {bigint} value - Value to invert
 * @param {bigint} modulus - Modulus, must be positive
 * @returns {bigint} x in [1, modulus) such that value * x ≡ 1 (mod modulus)
 * @throws {Error} If the inverse does not exist (value and modulus not coprime)
 */
export function modInverse(value: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) {
    throw new Error('Modulus must be positive')
  }
  let [oldRemainder, remainder] = [((value % modulus) + modulus) % modulus, modulus]
  let [oldCoefficient, coefficient] = [1n, 0n]
  while (remainder !== 0n) {
    const quotient = oldRemainder / remainder
    ;[oldRemainder, remainder] = [remainder, oldRemainder - quotient * remainder]
    ;[oldCoefficient, coefficient] = [coefficient, oldCoefficient - quotient * coefficient]
  }
  if (oldRemainder !== 1n) {
    throw new Error(`No modular inverse: ${value} and ${modulus} are not coprime`)
  }
  return ((oldCoefficient % modulus) + modulus) % modulus
}

/**
 * Primality test: trial division for small values, then deterministic
 * Miller-Rabin (exact for all n < 3.3 * 10^24, covering any value this lab uses).
 * @param {number | bigint} candidate - Value to test
 * @returns {boolean} True if the value is prime
 */
export function isPrime(candidate: number | bigint): boolean {
  const n = toBigInt(candidate)
  if (n < 2n) {
    return false
  }
  for (const smallPrime of MILLER_RABIN_WITNESSES) {
    if (n === smallPrime) {
      return true
    }
    if (n % smallPrime === 0n) {
      return false
    }
  }

  // Write n - 1 as 2^s * d with d odd
  let d = n - 1n
  let s = 0n
  while ((d & 1n) === 0n) {
    d >>= 1n
    s += 1n
  }

  for (const witness of MILLER_RABIN_WITNESSES) {
    let x = modPow(witness, d, n)
    if (x === 1n || x === n - 1n) {
      continue
    }
    let composite = true
    for (let round = 1n; round < s; round++) {
      x = (x * x) % n
      if (x === n - 1n) {
        composite = false
        break
      }
    }
    if (composite) {
      return false
    }
  }
  return true
}
