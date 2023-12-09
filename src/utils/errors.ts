import { ZodError } from "zod"

export class UserNotFoundError extends Error {
	constructor(message: string) {
		super(message)
	}
}

export class UserValuesError extends ZodError { 
}

export class AlreadyExistsError extends Error{
	constructor(message: string) {
		super(message)
	}
}

export class PixKeyError extends ZodError{
}
