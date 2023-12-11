import { Request, Response } from "express"
import { UserService } from "../service/userService"
import { banToken } from "../utils/cache"
import {AlreadyExistsError, PixKeyError, UserValuesError } from "../utils/errors"

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
			if(error instanceof UserValuesError){
				res.status(400).json(error.issues)
			} else if(error instanceof AlreadyExistsError){
				res.status(400).json({message: error.message})
			}
			else {
				res.status(400).json({ error: "something went wrong" })
			}
		}
	}
	async update(req: Request, res: Response){
		const  id  = req.params.id
		const {email, phoneNumber} = req.body
		try{
			const result = await userService.update({email, phoneNumber, id})
			res.status(200).json(result)
		}catch (error: unknown) {
			if(error instanceof UserValuesError){
				res.status(400).json(error.issues)
			} else{
				res.status(500).json({ error: "something went wrong" })
			}
		}
	}
	async delete(req: Request, res: Response){
		const  id  = req.params.id
		const result = await userService.delete({ id })
		await banToken(req.headers["authorization"])
		res.status(200).json(result)
	}
	async detail(req: Request, res: Response){
		const  id  = req.params.id
		try{
			const result = await userService.detail({id})
			res.status(200).json(result)
		}catch(error: unknown){
			res.status(500).json({ error: "something went wrong" })
		}
	}
	async upgrade(req: Request, res: Response){
		const  id  = req.params.id
		const {pixKey} = req.body
		try{
			const result = await userService.upgrade({id, pixKey})
			res.status(200).json(result)
		}catch(error: unknown){
			if(error instanceof PixKeyError){
				res.status(400).json(error)
			}
			else if(error instanceof Error)
				res.status(400).json({ error: error.message})
		}
	}
}


