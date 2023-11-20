import crypto from 'crypto'


export function encrypt(text) {
	return crypto.createHash('md5').update(text).digest('hex')
}
