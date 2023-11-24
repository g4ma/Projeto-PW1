import { prisma } from "../database/prisma"

type Params = {
    userId: string
    pixKey: string
}
export class OwnerService{
	async updatePixKey({userId, pixKey}: Params){
		try {
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

			const ownerUpdated = await prisma.owner.update({
				where: {
					userId
				},
				data: {
					pixKey
				}
			})

			return ownerUpdated
		} catch(error){
			console.error(error)
			throw error
		}
	}
}