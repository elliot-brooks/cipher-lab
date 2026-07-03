# RSA Service API

A pure TypeScript implementation of textbook RSA. All operations use `bigint`, so both toy primes for demonstration and large primes for realistic examples are supported.

> **Educational use only.** This implementation has no padding (no OAEP, no PKCS#1), which makes it insecure for real-world use.

## Importing

```ts
import { generateKeyPair, encrypt, decrypt } from './index'
import type { RsaKeyPair, RsaPublicKey, RsaPrivateKey } from './index'
```

Math helpers are also exported if you need them directly:

```ts
import { isPrime, gcd, modPow, modInverse, toBigInt } from './index'
```

## Quick Start

```ts
const { publicKey, privateKey } = generateKeyPair(61, 53, 17)

const ciphertext = encrypt(65, publicKey)   // 2790n
const message    = decrypt(ciphertext, privateKey)  // 65n
```

## Key Generation

```ts
generateKeyPair(p, q, e?)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `p` | `number \| bigint` | First prime |
| `q` | `number \| bigint` | Second prime, must differ from `p` |
| `e` | `number \| bigint` (optional) | Public exponent; defaults to `65537` when valid, otherwise the smallest valid odd value |

Returns an `RsaKeyPair`:

```ts
interface RsaKeyPair {
  publicKey:  { n: bigint; e: bigint }
  privateKey: { n: bigint; d: bigint }
  p:   bigint   // first prime  — discard in production
  q:   bigint   // second prime — discard in production
  phi: bigint   // φ(n)         — discard in production
}
```

`p`, `q`, and `phi` are included so the workbench UI can display the intermediate values; in a real system they would be discarded immediately.

### Errors thrown

| Condition | Message |
| --- | --- |
| `p` or `q` is not prime | `p = X is not prime` / `q = X is not prime` |
| `p === q` | `p and q must be distinct primes` |
| `e` out of range | `Public exponent must satisfy 1 < e < φ(n)` |
| `e` not coprime with `φ(n)` | `Public exponent X is not coprime with φ(n)` |

## Encrypt & Decrypt

```ts
encrypt(message:    number | bigint, publicKey:  RsaPublicKey):  bigint
decrypt(ciphertext: number | bigint, privateKey: RsaPrivateKey): bigint
```

Both functions validate that the value is in `[0, n)` and throw `Value must be in the range [0, n)` otherwise.

```ts
const { publicKey, privateKey, p, q, phi } = generateKeyPair(61n, 53n, 17n)
// publicKey  → { n: 3233n, e: 17n }
// privateKey → { n: 3233n, d: 2753n }
// phi        → 3120n

const c = encrypt(65n, publicKey)   // 2790n  (C = M^e mod n)
const m = decrypt(c,   privateKey)  // 65n    (M = C^d mod n)
```

## Number-Theory Helpers

### `isPrime(candidate: number | bigint): boolean`

Trial division for small values, then deterministic Miller–Rabin using fixed witnesses. Exact (not probabilistic) for all values below 3.3 × 10²⁴, which covers any prime this lab will use.

```ts
isPrime(61)               // true
isPrime(561)              // false  (Carmichael number — fools simple tests)
isPrime(1000000007n)      // true
isPrime(2305843009213693951n)  // true  (2^61 - 1, Mersenne prime)
```

### `modPow(base, exponent, modulus: bigint): bigint`

Fast modular exponentiation by repeated squaring: `base^exponent mod modulus`.

```ts
modPow(65n, 17n, 3233n)  // 2790n
```

### `modInverse(value, modulus: bigint): bigint`

Modular multiplicative inverse via the extended Euclidean algorithm.
Throws if `value` and `modulus` are not coprime.

```ts
modInverse(17n, 3120n)  // 2753n  (17 * 2753 ≡ 1 mod 3120)
```

### `gcd(a, b: bigint): bigint`

Greatest common divisor via the Euclidean algorithm. Accepts negative inputs.

```ts
gcd(3120n, 17n)  // 1n
```

### `toBigInt(value: number | bigint): bigint`

Converts a safe integer to `bigint`, or passes a `bigint` through unchanged.
Throws for non-integer or out-of-safe-range `number` values; pass `bigint` directly for large numbers.

```ts
toBigInt(42)    // 42n
toBigInt(42n)   // 42n
```

## Choosing Primes

- **Toy demos** — use small distinct primes such as `3, 11` or the classic `61, 53`. The message must be a number smaller than `n = p * q`.
- **Realistic demos** — use large primes in the millions or beyond, passed as `bigint` literals (e.g. `1000000007n`). The default exponent `65537` will be chosen automatically.
- **Primality check** — call `isPrime(candidate)` before passing values to `generateKeyPair` to give the user fast feedback.
