import { Owner } from "@prisma/client"
import { prisma } from "../database/prisma"

export class ParkingSpace{

	async create(picture: string, location: string, pricePerHour: number, disponibility: string, description: string, owner: Owner){
		try{
			const newParkingSpace = await prisma.parkingSpace.create({
				data: {
					picture,
					location,
					pricePerHour,
					disponibility,
					description,
					ownerId: owner.userId
				}
			})

			return newParkingSpace
		} catch(error){
			console.error(error)
			throw error
		}
	}
}