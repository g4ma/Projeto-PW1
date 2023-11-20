import jwt from 'jsonwebtoken'
import {encrypt} from '../utils/security'
import DotEnv from 'dotenv'
import { prisma } from '../database/prisma'

DotEnv.config()

type ParamsLogin = {
  email: string,
  password: string
}

const { SECRET } = process.env 

class AuthService{
	async login({email, password}: ParamsLogin){
		console.log(password, encrypt(password))
		const user = await prisma.user.findUnique({
			where: {
				email,
				password: encrypt(password)
			}
		})
		if (user !== null){
			const token = jwt.sign({id: user.id}, SECRET, {
				expiresIn: '1h'
			})
			return {token: token}
		}
		throw new Error('User with email and password provided does not exist')
	}

}

export default AuthService