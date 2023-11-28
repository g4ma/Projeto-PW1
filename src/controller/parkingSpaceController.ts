import { ParkingSpaceService } from "../service/parkingSpaceService"
import { Request, Response } from "express"

const parkingSpaceService = new ParkingSpaceService()

export class ParkingSpaceController{
	async create(req: Request, res: Response){
		const ownerId = req.params.userId
		const pictures = req.files as Express.Multer.File[]

		const { latitude, longitude, description, pricePerHour, disponibility, type } = req.body
		try{
			const parkingSpace = await parkingSpaceService.create({pictures, latitude, longitude, pricePerHour, disponibility, description, type, ownerId })
			return res.status(201).json(parkingSpace)
		} catch(error){
			console.log(error)
			return res.status(400).json({ error: "something went wrong"})
		}
	}

	async detail(req: Request, res: Response){
		const { id } = req.params
		try{
			const parkingSpace = await parkingSpaceService.detail(id)
			return res.status(200).json(parkingSpace)
		} catch(error){
			return res.status(404).json({ error: "something went wrong" })
		}
	}

	async listAll(req: Request, res: Response){
		try{
			const parkingSpaces = await parkingSpaceService.listAll()
			return res.status(200).json(parkingSpaces)
		} catch(error){
			return res.status(400).json({ error: "something went wrong" })
		}
	}

	async update(req: Request, res: Response){
		const { id } = req.params
		const userId = req.params.userId

		const { description, pricePerHour, disponibility } = req.body
		try{
			const parkingSpace = await parkingSpaceService.update({id, userId, disponibility, description, pricePerHour})
			return res.status(200).json(parkingSpace)
		} catch(error){
			return res.status(400).json({ error: "something went wrong" })
		}
	}

	async delete(req: Request, res: Response){
		const { id } = req.params
		const userId = req.params.userId
		try{
			const parkingSpace = await parkingSpaceService.delete(id, userId)
			return res.status(200).json(parkingSpace)
		} catch(error){
			return res.status(400).json({ error: "something went wrong" })
		}
	}

}