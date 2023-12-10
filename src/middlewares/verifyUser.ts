import {Request,Response,NextFunction } from "express"


export function verifyUser(req: Request, res: Response, next: NextFunction) {
	const userId = req.params.userId
	const id = req.params.id

	if (userId !== id) {
		return res.status(403).json({message: "User not authorized" })
	}
	return next()
}