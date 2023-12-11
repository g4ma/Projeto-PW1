import { Request, Response } from "express"
import { OwnerService } from "../service/ownerService"
import { PixKeyError } from "../utils/errors"

const ownerService = new OwnerService()

export class OwnerController{
	async updatePixKey(req: Request, res: Response){
		const userId = req.params.userId
		const {pixKey} = req.body
		try{
			const ownerUpdated = await ownerService.updatePixKey({userId, pixKey})
			res.status(200).json(ownerUpdated)
		}catch(error: unknown){
			if(error instanceof PixKeyError){
				res.status(400).json(error)
			}
			else if(error instanceof Error)
				res.status(400).json({ error: error.message})
		}
	}
}