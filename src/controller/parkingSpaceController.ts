import { ParkingSpaceService } from "../service/parkingSpaceService"
import { Request, Response } from "express"

const parkingSpaceService = new ParkingSpaceService()

export class ParkingSpaceController{
	async create(req: Request, res: Response){
		const ownerId = req.params.userId
		const { picture, latitude, longitude, description, pricePerHour, disponibility, type } = req.body
		try{
			const parkingSpace = await parkingSpaceService.create({ picture, latitude, longitude, pricePerHour, disponibility, description, type, ownerId })
			return res.status(201).json(parkingSpace)
		} catch(error){
			console.log(error)
			return res.status(400).json({ error: "something went wrong"})
		}
	}
}