import { prisma } from "../database/prisma"
import { PixKeyError} from "../utils/errors"
import { ownerValidateZod } from "../utils/userValidateZod"

type Params = {
    userId: string
    pixKey: string
}
export class OwnerService{
	async updatePixKey({userId, pixKey}: Params){
		if(!pixKey){
			throw new Error("pixkey is not valid")
		}
		const owner = await prisma.owner.findUnique({
			where: {
				userId
			}
		})
		if(!owner){
			throw new Error("user is not owner type")
		}
		const result = ownerValidateZod({pixKey})
		if (!result.success) {
			throw new PixKeyError(result.error.issues)}
			
		const ownerUpdated = await prisma.owner.update({
			where: {
				userId
			},
			data: {
				pixKey
			}
		})
		return ownerUpdated
	}
}
