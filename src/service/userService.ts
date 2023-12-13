import { prisma } from "../database/prisma"
import { AlreadyExistsError, PixKeyError, UserValuesError } from "../utils/errors"
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
			throw new UserValuesError(result.error.issues)
		}
		const user = await prisma.user.findUnique({
			where:{
				email,
			}
		})
		if(user !== null){
			throw new AlreadyExistsError("user already exists")
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
				throw new UserValuesError(result.error.issues)
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
			console.error(err)
			throw err
		}
	}
	async delete({id} : ParamsUpdate){
		const isOwner = await prisma.owner.findUnique({
			where:{
				userId: id
			}
		})
		if(isOwner){
			await prisma.owner.delete({
				where:{
					userId: id
				}
			})
		}
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
			throw new PixKeyError(result.error.issues)
		}
		if(!id || !pixKey){
			throw new Error("Invalid data")
		} 
		try{
			const upgradedUser = await prisma.owner.create({
				data:{
					userId: id,
					pixKey
				},
			})
			return upgradedUser
		}catch(error: unknown){
			throw new Error("User is already owner")
		}
	}
}
