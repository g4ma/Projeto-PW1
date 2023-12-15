import { ZodError } from "zod"

export class ReservationError extends Error{
	constructor (message: string){
		super(message)
	}
}

export class ReservationValuesError extends ZodError { 
}