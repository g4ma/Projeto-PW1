import { Request, Response } from "express"
import { OwnerService } from "../service/ownerService"

const ownerService = new OwnerService()

export class OwnerController{
	async updatePixKey(req: Request, res: Response){
		const userId = req.params.userId
		const {id} = req.params
		const {pixKey} = req.body
        
		if(userId != id){
			return res.status(403).json("error")
		}

		try{
			const ownerUpdated = await ownerService.updatePixKey({userId, pixKey})
			res.status(200).json(ownerUpdated)
		}catch(error: unknown){
			console.log(error)
			res.status(400).json({ error: "something went wrong" })
		}
	}
}