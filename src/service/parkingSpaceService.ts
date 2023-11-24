import { prisma } from "../database/prisma"

enum parkingSpaceType{
    Moto,
    Carro,
}

type Params = {
    picture: string
    latitude: number
    longitude: number
    pricePerHour: number
    disponibility: string
    description: string
    type: parkingSpaceType
    ownerId: string
}

export class ParkingSpaceService{

	async create({picture, latitude, longitude, pricePerHour, disponibility, description, type, ownerId}: Params){
		try{
			const newParkingSpace = await prisma.parkingSpace.create({
				data: {
					picture,
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

}
