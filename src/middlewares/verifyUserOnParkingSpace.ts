import { NextFunction, Request, Response } from "express"
import { prisma } from "../database/prisma"

export async function verifyUserOnParkingSpace(req: Request, res:Response, next:NextFunction,){
	const userId = req.params.userId
	const { id } = req.params

	const parkingSpace = await prisma.parkingSpace.findUnique({
		where: {
			id
		}
	})
    
	if(parkingSpace && parkingSpace.ownerId !== userId){
		return res.status(403).json({ message: "user not authorized" })
	}

	next()
}