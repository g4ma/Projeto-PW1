import client from '../database/redis'
import jwt from 'jsonwebtoken'
import DotEnv from 'dotenv'

DotEnv.config()

const { SECRET } = process.env 


export async function banToken(token){
	const result = jwt.verify(token.toString(), SECRET)
	const expirationTime = result.exp - Math.floor(Date.now() / 1000)
	
	await client.setEx(token, expirationTime, 'banned')
}

export async function isBan(token: string) {
	const banned = await client.get(token)
	if(banned){
		return true
	}
	return false
}