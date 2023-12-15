import { Request, Response } from "express"
import PictureService from "../service/pictureService"

const pictureService = new PictureService()

export class PictureController {

	async create(req: Request, res: Response) {

		const pictures = req.files as Express.Multer.File[]
		const { parkingSpaceId } = req.body


		try {
			const parkingSpace = await pictureService.create({ pictures, parkingSpaceId })
			return res.status(201).json(parkingSpace)
		} catch (error) {
			console.log(error)
			return res.status(400).json({ error: "something went wrong" })
		}
	}
	async delete(req: Request, res: Response) {

		const { id } = req.params


		try {
			const picture = await pictureService.delete({ id })
			return res.status(200).json(picture)
		} catch (error) {
			console.log(error)
			return res.status(400).json({ error: "something went wrong" })
		}
	}

	async listAllByParkingSpace(req: Request, res: Response) {
		const { parkingSpaceId } = req.body


		try {
			const picture = await pictureService.listAllByParkingSpace({ parkingSpaceId })
			return res.status(200).json(picture)
		} catch (error) {
			console.log(error)
			return res.status(400).json({ error: "something went wrong" })
		}
	}

}

