import { gcd, isPrime, modInverse, modPow, toBigInt } from './math'

/** Preferred public exponent when it fits the totient (standard choice). */
const DEFAULT_PUBLIC_EXPONENT = 65537n

/** RSA public key: shared freely, used to encrypt. */
export interface RsaPublicKey {
  /** Public modulus n = p * q */
  n: bigint
  /** Public exponent */
  e: bigint
}

/** RSA private key: kept secret, used to decrypt. */
export interface RsaPrivateKey {
  /** Public modulus n = p * q */
  n: bigint
  /** Private exponent d = e⁻¹ mod φ(n) */
  d: bigint
}

/** Full result of key generation, including the intermediate values for display. */
export interface RsaKeyPair {
  publicKey: RsaPublicKey
  privateKey: RsaPrivateKey
  /** First prime factor (normally discarded after generation) */
  p: bigint
  /** Second prime factor (normally discarded after generation) */
  q: bigint
  /** Euler's totient φ(n) = (p-1)(q-1) (normally discarded after generation) */
  phi: bigint
}

/**
 * Generate an RSA key pair from two primes.
 * @param {number | bigint} p - First prime
 * @param {number | bigint} q - Second prime, distinct from p
 * @param {number | bigint} [e] - Public exponent; must satisfy 1 < e < φ(n) and
 *   gcd(e, φ(n)) = 1. Defaults to 65537 when valid, otherwise the smallest valid odd value.
 * @returns {RsaKeyPair} Key pair plus the intermediate values p, q, and φ(n)
 * @throws {Error} If p or q is not prime, p equals q, or e is invalid
 */
export function generateKeyPair(
  p: number | bigint,
  q: number | bigint,
  e?: number | bigint,
): RsaKeyPair {
  const bigP = toBigInt(p)
  const bigQ = toBigInt(q)
  if (!isPrime(bigP)) {
    throw new Error(`p = ${bigP} is not prime`)
  }
  if (!isPrime(bigQ)) {
    throw new Error(`q = ${bigQ} is not prime`)
  }
  if (bigP === bigQ) {
    throw new Error('p and q must be distinct primes')
  }

  const n = bigP * bigQ
  const phi = (bigP - 1n) * (bigQ - 1n)
  const bigE = e === undefined ? choosePublicExponent(phi) : validatePublicExponent(toBigInt(e), phi)
  const d = modInverse(bigE, phi)

  return {
    publicKey: { n, e: bigE },
    privateKey: { n, d },
    p: bigP,
    q: bigQ,
    phi,
  }
}

/**
 * Encrypt a numeric message with a public key: C = M^e mod n.
 * @param {number | bigint} message - Message as a number in [0, n)
 * @param {RsaPublicKey} publicKey - Public key (n, e)
 * @returns {bigint} Ciphertext
 * @throws {Error} If the message is negative or not smaller than the modulus
 */
export function encrypt(message: number | bigint, publicKey: RsaPublicKey): bigint {
  const m = validateMessage(toBigInt(message), publicKey.n)
  return modPow(m, publicKey.e, publicKey.n)
}

/**
 * Decrypt a ciphertext with a private key: M = C^d mod n.
 * @param {number | bigint} ciphertext - Ciphertext as a number in [0, n)
 * @param {RsaPrivateKey} privateKey - Private key (n, d)
 * @returns {bigint} Original message
 * @throws {Error} If the ciphertext is negative or not smaller than the modulus
 */
export function decrypt(ciphertext: number | bigint, privateKey: RsaPrivateKey): bigint {
  const c = validateMessage(toBigInt(ciphertext), privateKey.n)
  return modPow(c, privateKey.d, privateKey.n)
}

function choosePublicExponent(phi: bigint): bigint {
  if (DEFAULT_PUBLIC_EXPONENT < phi && gcd(DEFAULT_PUBLIC_EXPONENT, phi) === 1n) {
    return DEFAULT_PUBLIC_EXPONENT
  }
  for (let candidate = 3n; candidate < phi; candidate += 2n) {
    if (gcd(candidate, phi) === 1n) {
      return candidate
    }
  }
  throw new Error(`No valid public exponent exists for φ(n) = ${phi}`)
}

function validatePublicExponent(e: bigint, phi: bigint): bigint {
  if (e <= 1n || e >= phi) {
    throw new Error(`Public exponent must satisfy 1 < e < φ(n); got e = ${e}, φ(n) = ${phi}`)
  }
  if (gcd(e, phi) !== 1n) {
    throw new Error(`Public exponent ${e} is not coprime with φ(n) = ${phi}`)
  }
  return e
}

function validateMessage(value: bigint, modulus: bigint): bigint {
  if (value < 0n || value >= modulus) {
    throw new Error(`Value must be in the range [0, n); got ${value} with n = ${modulus}`)
  }
  return value
}
