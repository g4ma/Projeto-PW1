import { ParkingSpaceType } from "@prisma/client"
import { prisma } from "../database/prisma"
import { parkingSpaceValidateZod, parkingSpaceValidateZodUpd } from "../utils/parkingSpaceValidateZod"
import { ParkingSpaceError } from "../utils/parkingSpaceError"

type Params = {
	pictures: Express.Multer.File[]
    latitude: number
    longitude: number
    pricePerHour: number
    description: string
    type: ParkingSpaceType
    ownerId: string
}

type ParamsUpdate = {
	id: string
	userId: string
	disponibility?: boolean
	description?: string
	pricePerHour?: number
}

export class ParkingSpaceService{

	async create({pictures, latitude, longitude, pricePerHour, description, type, ownerId}: Params){
		try{
			const owner = await prisma.owner.findUnique({
				where: {
					userId: ownerId
				}
			})

			if(!owner){
				throw new ParkingSpaceError("user is not owner type")
			}

			const result = parkingSpaceValidateZod({latitude, longitude, pricePerHour, description, type, ownerId})
			
			if (!result.success) {
				const formattedError = result.error.format()
				console.log(formattedError)
				throw new Error(...formattedError._errors)
			}

			const parkingSpace = await prisma.parkingSpace.findFirst({
				where:{
					longitude,
					latitude
				}
			})

			if(parkingSpace){
				throw new ParkingSpaceError("parking space at this location already exists")
			}

			const newParkingSpace = await prisma.parkingSpace.create({
				data: {
					latitude: parseFloat(latitude.toString()),
					longitude: parseFloat(longitude.toString()), 
					type,
					pricePerHour: parseInt(pricePerHour.toString()),
					description,
					ownerId,
					picture: {
						create: pictures.map(pic => ({
							path: pic.filename
						}))
					}
				}
			})

			return newParkingSpace
		} catch(error){
			console.error(error)
			throw error
		}
	}

	async detail(id: string){
		try{
			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id
				},
				include: {
					picture: {
						select: {
							path: true
						}
					}
				}
			})

			if(!parkingSpace){
				throw new ParkingSpaceError("parking space doens't exists")
			}

			return parkingSpace
		} catch(error){
			console.error(error)
			throw error
		}
	}

	async listAll(){
		try{
			const parkingSpaces = await prisma.parkingSpace.findMany()
			return parkingSpaces
		} catch(error){
			console.error(error)
			throw error
		}
	}

	async update({id, userId, disponibility, description, pricePerHour}: ParamsUpdate){
		try{
			const owner = await prisma.owner.findUnique({
				where: {
					userId
				}
			})

			if(!owner){
				throw new ParkingSpaceError("user is not owner type")
			}

			const ownerId = owner.userId

			const result = parkingSpaceValidateZodUpd({pricePerHour, disponibility, description, ownerId})
			
			if (!result.success) {
				const formattedError = result.error.format()
				console.log(formattedError)
				throw new Error(...formattedError._errors)
			}

			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id,
					ownerId
				}
			})

			if(!parkingSpace){
				throw new ParkingSpaceError("parking space doens't exists")
			}

			console.log(pricePerHour)
			const parkingSpaceUpdated = await prisma.parkingSpace.update({
				where: {
					id
				},
				data: {
					disponibility: disponibility ?? parkingSpace.disponibility,
					description: description ?? parkingSpace.description,
					pricePerHour: pricePerHour ?? parkingSpace.pricePerHour,
				}
			})
			console.log(parkingSpaceUpdated)

			return parkingSpaceUpdated
		} catch(error){
			console.error(error)
			throw error
		}
	}

	async delete(id: string, userId: string){
		try{
			const owner = await prisma.owner.findUnique({
				where: {
					userId
				}
			})

			if(!owner){
				throw new ParkingSpaceError("user is not owner type")
			}


			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id,
					ownerId: owner.userId
				}
			})

			if(!parkingSpace){
				throw new ParkingSpaceError("parking space doens't exists")
			}

			const pictures = await prisma.picture.findMany({
				where: {
					parkingSpaceId: parkingSpace.id,
				},
			})

			if(pictures){
				await prisma.picture.deleteMany({
					where: {
						parkingSpaceId: parkingSpace.id,
					},
				})
			}

			const reservations = await prisma.reservation.findMany({
				where: {
					parkingSpaceId: parkingSpace.id
				}
			})

			if(reservations){
				await prisma.reservation.deleteMany({
					where: {
						parkingSpaceId: parkingSpace.id
					}
				})
			}

			const parkingSpaceDeleted = await prisma.parkingSpace.delete({
				where: {
					id
				}
			})

			return parkingSpaceDeleted
		} catch(error){
			console.error(error)
			throw error
		}
	}

}
