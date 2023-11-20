import {Request,Response,NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import DotEnv from 'dotenv'

DotEnv.config()

const { SECRET } = process.env 

export async function checkLogin(
	req: Request, 
	res:Response, 
	next:NextFunction,
){
	const token = req.headers['authorization']
	if (!token){
		return res.status(401).json({ message: 'Token not sent.' })
	}
	try{
		const result = jwt.verify(token.toString(), SECRET)
		req.params.userId = result.id
	}catch(error: unknown){
		return res.status(401).json({message: 'Token expired or invalid'})
	}
	return next()
}