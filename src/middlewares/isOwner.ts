import {Request,Response,NextFunction } from "express"
import { prisma } from "../database/prisma"

export async function isOwner(req: Request, res:Response, next:NextFunction,){
	const userId = req.params.userId
    
	const owner = await prisma.owner.findUnique({
		where: {
			userId
		}
	})
    
	if(!owner){
		return res.status(403).json({ message: "user is not owner type" })
	}

	next()
}