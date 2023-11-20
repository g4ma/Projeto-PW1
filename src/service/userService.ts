import { prisma } from '../database/prisma'
import { encrypt } from '../utils/security'

type Params ={
  name:string;
  email: string;
  phoneNumber: string;
  password: string;
  pixKey?: string
}

type ParamsUpdate = {
	email: string;
  phoneNumber: string;
	id: string
}

export class UserService{
	async create ({name, email, phoneNumber, password, pixKey}:Params){
		const user = await prisma.user.findUnique({
			where:{
				email,
			}
		})
		if(user !== null){
			throw new Error('user already exists')
		}

		const encryptedPassword = encrypt(password)
		const userNew = await prisma.user.create({
			data:{
				name,
				email,
				phoneNumber,
				password: encryptedPassword
			},
		})
		if(pixKey){
			await prisma.owner.create({
				data:{
					userId:userNew.id,
					pixKey
				},
			})
			return {...userNew, pixKey}
		}
		return userNew
	}
	async update({email, phoneNumber, id}: ParamsUpdate){
		try{
			const userUpdate = prisma.user.update({
				where:{
					id
				},
				data:{
					email,
					phoneNumber
				}
			})
			return userUpdate
		}catch (err) {
			console.log(err)
			throw new Error()
		}
	}
}