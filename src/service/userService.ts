import { prisma } from "../database/prisma"
import { encrypt } from "../utils/security"
import { userUpdateValidateZod, userCreateValidateZod, ownerValidateZod } from "../utils/userValidateZod"

type Params ={
  name:string;
  email: string;
  phoneNumber: string;
  password: string;
  pixKey?: string
}

type ParamsUpdate = {
	email?: string;
  phoneNumber?: string;
	id: string;
	pixKey?:string
}

export class UserService{
	async create ({name, email, phoneNumber, password, pixKey}:Params){
		const result = userCreateValidateZod({name, email, phoneNumber, password, pixKey})
		if (!result.success) {
			const formattedError = result.error.format()
			console.log(formattedError)
			throw new Error(...formattedError._errors)
		}
		const user = await prisma.user.findUnique({
			where:{
				email,
			}
		})
		if(user !== null){
			throw new Error("user already exists")
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
			const result = userUpdateValidateZod({email, phoneNumber})
			if (!result.success) {
				const formattedError = result.error.format()
				throw new Error(...formattedError._errors)
			}
			const userUpdate = await prisma.user.update({
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
	async delete({id} : ParamsUpdate){
		const deletedUser = await prisma.user.delete({
			where: {
				id
			},
		})

		return deletedUser
	}
	async detail({id}: ParamsUpdate){
		if(!id){
			throw new Error("Invalid id")
		}
		const detailedUser = await prisma.user.findUnique({
			where:{
				id
			}
		})
		const detailedOwner = await prisma.owner.findUnique({
			where:{
				userId: id
			}
		})
		if(detailedOwner){
			return {...detailedUser, pixKey:detailedOwner.pixKey}
		}
		return detailedUser
	}
	async upgrade({id, pixKey}: ParamsUpdate){
		const result = ownerValidateZod({pixKey})
		if (!result.success) {
			const formattedError = result.error.format()
			throw new Error(...formattedError._errors)
		}
		if(!id || !pixKey){
			throw new Error("Invalid data")
		} 
		
		const upgradedUser = await prisma.owner.create({
			data:{
				userId: id,
				pixKey
			},
		})
		return upgradedUser
	}
}
