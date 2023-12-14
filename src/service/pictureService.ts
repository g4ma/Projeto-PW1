import { prisma } from "../database/prisma"

type PictureServiceParamsCreate = {
    pictures: Express.Multer.File[]
    parkingSpaceId: string
}

type PictureServiceParamsDelete = {
	id: string
}

export default class PictureService{
	async create({pictures, parkingSpaceId}: PictureServiceParamsCreate) {
		try{
			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id: parkingSpaceId
				}
			})


			if(!parkingSpace){
				throw new Error("parking space doens't exists")
			}

			pictures.forEach(async (pic) => {
				await prisma.picture.create({
					data: {
						parkingSpaceId,
						path: pic.filename
					}
				})
			})

			const parkingSpaceWithPics = await prisma.parkingSpace.findUnique({
				where: {
					id: parkingSpaceId
				},
				select: {
					id: true,
					picture: {
						select: {
							path: true
						}
					}
				}
			})

			return parkingSpaceWithPics
		} catch(error){
			console.log(error)
			throw error
		}
	}
	async delete({id}: PictureServiceParamsDelete){
		try {
			const picture = await prisma.picture.findUnique({
				where: {
					id
				}
			})


			if(!picture){
				throw new Error("picture doens't exists")
			}


			const deletedPicture = await prisma.picture.findUnique({
				where: {
					id
				}
			})


			return deletedPicture
		} catch(error){
			console.log(error)
			throw error
		}
	}



}
