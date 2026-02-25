import crypto from 'crypto'

const SALT_BYTES = 16
const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_BYTES)
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH)
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

export function verifyPassword(password: string, encodedHash: string): boolean {
  const [saltHex, hashHex] = encodedHash.split(':')

  if (!saltHex || !hashHex) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const expectedHash = Buffer.from(hashHex, 'hex')
  const actualHash = crypto.scryptSync(password, salt, expectedHash.length)

  if (actualHash.length !== expectedHash.length) {
    return false
  }

  return crypto.timingSafeEqual(actualHash, expectedHash)
}
