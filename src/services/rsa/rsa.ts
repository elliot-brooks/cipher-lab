import { gcd, generateRandomPrime, isPrime, modInverse, modPow, toBigInt } from './math'

const DEFAULT_PUBLIC_EXPONENT = 65537n

/** RSA key pair without intermediates. */
export interface RsaKeyPair {
  publicKey: RsaPublicKey
  privateKey: RsaPrivateKey
}

/**
 * RSA key pair with intermediate values exposed for display.
 * p: first prime, q: second prime — normally discarded after generation.
 * phi: Euler's totient φ(n) = (p-1)(q-1) — normally discarded after generation.
 */
export interface DebugRsaKeyPair extends RsaKeyPair {
  p: bigint
  q: bigint
  phi: bigint
}

/**
 * RSA public key: shared freely, used to encrypt.
 * n: public modulus (p * q), e: public exponent.
 */
export interface RsaPublicKey {
  n: bigint
  e: bigint
}

/**
 * RSA private key: kept secret, used to decrypt.
 * n: public modulus (p * q), d: private exponent (e⁻¹ mod φ(n)).
 */
export interface RsaPrivateKey {
  n: bigint
  d: bigint
}


/**
 * Generate an RSA key pair from two primes.
 * e defaults to 65537 when valid, otherwise the smallest valid odd value.
 * Throws if p or q is not prime, p equals q, or e is invalid.
 */
export function generateKeyPair(
  p: number | bigint,
  q: number | bigint,
  e?: number | bigint,
): DebugRsaKeyPair {
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

/** Encrypt a numeric message: C = M^e mod n. Message must be in [0, n). */
export function encrypt(message: number | bigint, publicKey: RsaPublicKey): bigint {
  const m = validateMessage(toBigInt(message), publicKey.n)
  return modPow(m, publicKey.e, publicKey.n)
}

/** Decrypt a ciphertext: M = C^d mod n. Ciphertext must be in [0, n). */
export function decrypt(ciphertext: number | bigint, privateKey: RsaPrivateKey): bigint {
  const c = validateMessage(toBigInt(ciphertext), privateKey.n)
  return modPow(c, privateKey.d, privateKey.n)
}

/** Generate a key pair from two random ~256-bit primes, keeping p, q, φ(n) for display. */
export function genRandomKeyPair(debug: true): DebugRsaKeyPair
/** Generate a key pair from two random ~256-bit primes, discarding p, q, φ(n). */
export function genRandomKeyPair(debug: false): RsaKeyPair

export function genRandomKeyPair(debug: boolean): DebugRsaKeyPair | RsaKeyPair {
  const p = generateRandomPrime()
  let q = generateRandomPrime()
  while (q === p) {
    q = generateRandomPrime()
  }
  const pair = generateKeyPair(p, q)
  if (debug) {
    return pair
  }
  return { publicKey: pair.publicKey, privateKey: pair.privateKey }
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
