import { Request, Response } from 'express'
import { UserService } from '../service/userService'

const userService = new UserService()

export class UserController {
	async create(req: Request, res: Response) {
		const { name, email, phoneNumber, password, pixKey } = req.body
		try {
			const result = await userService.create({
				name,
				email,
				phoneNumber,
				password,
				pixKey
			})
			res.status(201).json(result)
		} catch (error: unknown) {
			console.log(error)
			res.status(400).json({ error: 'something went wrong' })

		}
	}
	async update(req: Request, res: Response){
		const userId = req.params.userId
		const  id  = req.params.id
		if(userId != id){
			return res.status(403).json('erro')
		}
		const {email, phoneNumber} = req.body
		try{
			const result = userService.update({email, phoneNumber, id})
			res.status(201).json(result)
		}catch (error: unknown) {
			console.log(error)
			res.status(400).json({ error: 'something went wrong' })
		}
	}
	async delete(req: Request, res: Response){
		const userId = req.params.userId
		const  id  = req.params.id
		if(userId != id){
			return res.status(403).json('erro')
		}
		const result = await userService.delete({ id })
		res.status(200).json(result)
	}
}

