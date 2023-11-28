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

export function parkingSpaceValidateZod(parkingSpace: ParkingSpaceParamsValidate){
	const schemaZod = z.object({
		type: z.nativeEnum(ParkingSpaceType),
		latitude: z.number({required_error: "latitude is required"}),
		longitude: z.number({required_error: "longitude is required"}),
		pricePerHour: z.number({required_error: "pricePerHour is required"}).int().positive(),
		disponibility: z.boolean({required_error: "disponibility is required"}),
		description: z.string({required_error:"description is required"}),
		ownerId: z.string({required_error:"ownerId is required"}),
	})

	const result = schemaZod.safeParse(parkingSpace)
	return result
}