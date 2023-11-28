import { ParkingSpaceType } from "@prisma/client"
import { prisma } from "../database/prisma"
import { parkingSpaceValidateZod } from "../utils/parkingSpaceValidateZod"

type Params = {
	pictures: Express.Multer.File[]
    latitude: number
    longitude: number
    pricePerHour: number
    disponibility: boolean
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

	async create({pictures, latitude, longitude, pricePerHour, disponibility, description, type, ownerId}: Params){
		try{
			const owner = await prisma.owner.findUnique({
				where: {
					userId: ownerId
				}
			})

			if(!owner){
				throw new Error("user is not owner type")
			}

			const result = parkingSpaceValidateZod({latitude, longitude, pricePerHour, disponibility, description, type, ownerId})

			if (!result.success) {
				const formattedError = result.error.format()
				throw new Error(...formattedError._errors)
			}
	
			const newParkingSpace = await prisma.parkingSpace.create({
				data: {
					latitude,
					longitude, 
					type,
					pricePerHour,
					disponibility,
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
			const parkingSpace = await prisma.parkingSpace.findUniqueOrThrow({
				where: {
					id
				}
			})
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
				throw new Error("user is not owner type")
			}


			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id,
					ownerId: owner.userId
				}
			})

			if(!parkingSpace){
				throw new Error("parking space doens't exists")
			}


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
				throw new Error("user is not owner type")
			}


			const parkingSpace = await prisma.parkingSpace.findUnique({
				where: {
					id,
					ownerId: owner.userId
				}
			})

			if(!parkingSpace){
				throw new Error("parking space doens't exists")
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
