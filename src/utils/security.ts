import crypto from "crypto"


export function encrypt(text: string) {
	return crypto.createHash("md5").update(text).digest("hex")
}
