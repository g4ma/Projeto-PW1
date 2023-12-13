import { prisma } from "../database/prisma"


type PictureServiceParamsCreate = {
    pictures: Express.Multer.File[]
    ownerId: string
    parkingSpaceId: string
}

export default class PictureService{
	async create({pictures, parkingSpaceId, ownerId}: PictureServiceParamsCreate) {
		try{
			const owner = await prisma.owner.findUnique({
				where: {
					userId: ownerId
				}
			})


			if(!owner){
				throw new Error("user is not owner type")
			}


			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id: parkingSpaceId
				}
			})


			if(!parkingSpace){
				throw new Error("parking space doens't exists")
			}


			let picture
			pictures.forEach(async (pic) => {
				picture.push(await prisma.picture.create({
					data: {
						parkingSpaceId,
						path: pic.filename
					}
				}))
			})


			return parkingSpace
		} catch(error){
			console.log(error)
			throw error
		}
	}
}
