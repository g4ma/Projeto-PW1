import { z } from "zod"

interface UserParamsValidate {
  name:       string 
  email:      string 
  phoneNumber: string
  password :   string
  pixKey?: string
  userId?: string
}

interface UserParamsUpdate{
  phoneNumber?: string
  email?:string
}

interface OwnerParamsValidate{
  pixKey?: string
}

function validatePhoneNumber(phoneNumber: string): boolean {
	let validate = true
	const phoneNumberRegex = /^\(\d{2}\)9\d{4}-\d{4}$/
	if (!phoneNumber.match(phoneNumberRegex)) {
		validate = false
	}
	return validate
}

export function userCreateValidateZod(user: UserParamsValidate){
	const schemaZod = z.object({
		name: z.string({required_error: "name is required"}).max(80).refine((value) => /^[a-zA-Z\s]+$/.test(value), {
			message: "The name field must contain only letters and spaces.",
		}),
		email: z.string({required_error: "email is required"}).email().max(256),
		phoneNumber: z.string({required_error: "phone number is required"}).max(14).trim().refine((value)=> validatePhoneNumber(value),{message:"number format must be (99)99999-9999"}),
		password: z.string({required_error: "password is required"}).max(255),
		pixKey: z.string().max(32).optional()
	})
	const result = schemaZod.safeParse(user)
	return result
}

export function userUpdateValidateZod(user: UserParamsUpdate){
	const schemaZod = z.object({
		email: z.string({required_error: "email is required"}).email().max(256),
		phoneNumber: z.string({required_error: "phone number is required"}).max(16),
	})
	const result = schemaZod.safeParse(user)
	return result
}

export function ownerValidateZod(owner: OwnerParamsValidate){
	const schemaZod = z.object({
		pixKey: z.string({required_error: "pixKey is required"}).max(32),
	})
	const resultOwner = schemaZod.safeParse(owner)
	return resultOwner
}
