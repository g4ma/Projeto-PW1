import { Request, Response } from "express"
import PictureService from "../service/pictureService"

const pictureService = new PictureService()

export class PictureController {

	async create(req: Request, res: Response){
       
		const ownerId = req.params.userId
		const pictures = req.files as Express.Multer.File[]
		const { parkingSpaceId } = req.body


		try{
			const parkingSpace = await pictureService.create({pictures, ownerId, parkingSpaceId })
			return res.status(201).json(parkingSpace)
		} catch(error){
			console.log(error)
			return res.status(400).json({ error: "something went wrong"})
		}
	}
}

