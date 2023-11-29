import { z } from "zod"
import { ParkingSpaceType } from "@prisma/client"

interface ParkingSpaceParamsValidate {
    latitude: number
    longitude: number
    pricePerHour: number
    disponibility: boolean
    description: string
    type: ParkingSpaceType
    ownerId: string
}
interface ParkingSpaceParamsValidateUpd {
    pricePerHour?: number
    disponibility?: boolean
    description?: string
	ownerId: string
}

export function parkingSpaceValidateZod(parkingSpace: ParkingSpaceParamsValidate){
	const schemaZod = z.object({
		type: z.nativeEnum(ParkingSpaceType),
		latitude: z.coerce.number({required_error: "latitude is required"}),
		longitude: z.coerce.number({required_error: "longitude is required"}),
		pricePerHour: z.coerce.number({required_error: "pricePerHour is required"}),
		disponibility: z.coerce.boolean({required_error: "disponibility is required"}),
		description: z.string({required_error:"description is required"}),
		ownerId: z.string(),
	})

	const result = schemaZod.safeParse(parkingSpace)
	return result
}

export function parkingSpaceValidateZodUpd(parkingSpace: ParkingSpaceParamsValidateUpd){
	const schemaZod = z.object({
		description: z.string().optional(),
		pricePerHour: z.coerce.number().optional(),
		disponibility: z.coerce.boolean().optional(),
		ownerId: z.string(),
	})

	const result = schemaZod.safeParse(parkingSpace)
	return result
}