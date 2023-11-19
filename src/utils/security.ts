import crypto from 'crypto'
const algorithm = 'aes-256-ctr'
const ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64')
const IV_LENGTH = 16

export function encrypt(text) {
	const iv = crypto.randomBytes(IV_LENGTH)
	const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv)
	let encrypted = cipher.update(text)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return encrypted.toString('hex')
}