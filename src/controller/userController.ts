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
}
