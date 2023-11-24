import { prisma } from "../database/prisma"

enum parkingSpaceType{
    Moto,
    Carro,
}

type Params = {
    latitude: number
    longitude: number
    pricePerHour: number
    disponibility: string
    description: string
    type: parkingSpaceType
    ownerId: string
}

type ParamsUpdate = {
	id: string
	userId: string
	disponibility?: string
	description?: string
	pricePerHour?: number
}

export class ParkingSpaceService{

	async create({latitude, longitude, pricePerHour, disponibility, description, type, ownerId}: Params){
		try{
			const newParkingSpace = await prisma.parkingSpace.create({
				data: {
					latitude,
					longitude, 
					type,
					pricePerHour,
					disponibility,
					description,
					ownerId
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
