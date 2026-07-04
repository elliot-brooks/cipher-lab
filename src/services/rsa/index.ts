/**
 * @module @rsa/services
 * @description Pure TypeScript implementation of the RSA cryptosystem for the
 * RSA workbench. Supports toy primes for demonstration and larger values via
 * bigint. Educational only — no padding, so not secure for real-world use.
 */

export {
  decrypt,
  encrypt,
  generateKeyPair,
  genRandomKeyPair,
  type DebugRsaKeyPair as RsaKeyPair,
  type RsaKeyPair as RsaKeys,
  type RsaPrivateKey,
  type RsaPublicKey,
} from './rsa'
export { generateRandomPrime, gcd, isPrime, modInverse, modPow, toBigInt } from './math'
