import AuthService from "../service/authService"
import { Request, Response } from "express"

const authService = new AuthService

export class AuthControler{
	async login(req: Request, res: Response){
		const {email, password} = req.body
		try{
			const result = await authService.login({email, password})
			res.status(200).json(result)
		} catch (error: unknown) {
			res.status(400).json({ error: "something went wrong" })
		}
	}}
