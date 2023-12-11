import { ZodError } from "zod"

export class ParkingSpaceError extends Error{
	constructor (message: string){
		super(message)
	}
}

export class ParkingSpaceValuesError extends ZodError { 
}