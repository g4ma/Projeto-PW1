import {Request,Response,NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import DotEnv from "dotenv"
import { isBan } from "../utils/cache"

DotEnv.config()

const SECRET = process.env.SECRET as Secret 

type Payload = {
	id: string
}

export async function checkLogin(
	req: Request, 
	res:Response, 
	next:NextFunction,
){
	const token = req.headers["authorization"]
	if (!token){
		return res.status(401).json({ message: "Token not sent." })
	}
	try{
		const isBanned = await isBan(token)
		if(isBanned){
			throw new Error()
		}
		const result = jwt.verify(token.toString(), SECRET) as Payload
		req.params.userId = result.id
	}catch(error: unknown){
		return res.status(401).json({message: "Token expired or invalid"})
	}
	return next()
}