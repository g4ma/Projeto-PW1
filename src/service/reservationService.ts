import { prisma } from "../database/prisma"
import { ReservationPaymentStatus } from "../model/reservationPaymentStatus"
import { CheckReservationAvailability } from "../utils/checkReservationAvailability"
import { reservationCreateValidateZod, reservationUpdateDateValidateZod, reservationUpdateStatusValidateZod } from "../utils/reservationValidateZod"

type ParamsCreate = {
    userId: string;
    parkingSpaceId: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
}
type ParamsUser = {
    userId: string;
}
type ParamsDelete = {
    userId: string;
    reservationId?: string;
}
type ParamsUpdateStatus = {
    userId: string;
    reservationId?: string;
    newStatus?: ReservationPaymentStatus;
}
type ParamsUpdateDate = {
    userId: string;
    reservationId?: string;
    endDate?: string;
    endTime?: string;
}
export class ReservationService {
	async create({ userId, parkingSpaceId, startDate, endDate, startTime, endTime }: ParamsCreate) {

		const checkReservationAvailability = new CheckReservationAvailability()

		const isDateValid = checkReservationAvailability.verifyDate({startDate,startTime,endDate,endTime})

		if(!isDateValid){
			throw new Error("dates invalid")
		}

		const isAvaiable = await checkReservationAvailability.verifyAvailability({parkingSpaceId, startDate, startTime, endDate, endTime})

		if (!isAvaiable) {
			throw new Error("parking space already ocupied")
		}

		const result = reservationCreateValidateZod({ userId, parkingSpaceId, startDate, endDate, startTime, endTime })

		if (!result.success) {
			const formattedError = result.error.format()
			console.log(formattedError)
			throw new Error(...formattedError._errors)
		}

		const newReservation = await prisma.reservation.create({
			data: {
				userId,
				parkingSpaceId,
				startTime,
				endTime,
				startDate,
				endDate
			}
		})

		return newReservation

	}
	async listOwner({ userId }: ParamsUser) {
		const owner = await prisma.owner.findUnique({
			where: {
				userId
			}
		})

		if (!owner) {
			throw new Error("user not owner")
		}

		const reservations = await prisma.reservation.findMany({
			where: {
				parkingSpace: {
					ownerId: userId
				}
			}
		})
        

		if(reservations.length === 0) {
			return { message: "does not have any reservations"}
		}

		return reservations

	}
	async listAll({ userId }: ParamsUser) {
		const user = await prisma.user.findUnique({
			where:{
				id: userId
			}
		})

		if(!user) {
			throw new Error("user does not exists")
		}
        
		const reservations = await prisma.reservation.findMany({
			where: {
				userId
			}
		})

		if(reservations.length === 0) {
			return {message: "user does not have any reservations"}
		}

		return reservations
	}
	async delete({ userId, reservationId }: ParamsDelete) {
		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId
			}
		})

		if (!reservation) {
			throw new Error("reservation does not exist")
		}

		if (reservation.userId != userId) {
			throw new Error("user can not delete this reservation")
		}

		const deletedReservation = await prisma.reservation.delete({
			where: {
				id: reservationId
			}
		})

		return deletedReservation
	}
	async updateStatusPayment({ userId, reservationId, newStatus }: ParamsUpdateStatus) {

		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId
			}
		})
		if (!reservation) {
			throw new Error("reservation does not exist")
		}

		const parkingSpace = await prisma.parkingSpace.findUnique({
			where:{
				id: reservation.parkingSpaceId
			}
		})
		if (parkingSpace?.ownerId != userId) {
			throw new Error("user can not update this reservation")
		}


		const result = reservationUpdateStatusValidateZod({ newStatus })
		if (!result.success) {
			const formattedError = result.error.format()
			console.log(formattedError)
			throw new Error(...formattedError._errors)
		}


		const updatedStatusPayment = await prisma.reservation.update({
			where: {
				id: reservationId
			},
			data: {
				paymentStatus: newStatus as ReservationPaymentStatus
			}
		})

		return updatedStatusPayment

	}
	async updateReservationDate({ userId, reservationId, endDate, endTime }: ParamsUpdateDate) {

		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId
			}
		})
		if (!reservation) {
			throw new Error("reservation does not exist")
		}
		if (reservation.userId != userId) {
			throw new Error("user can not update this reservation")
		}

		const result = reservationUpdateDateValidateZod({ endDate, endTime })
		if (!result.success) {
			const formattedError = result.error.format()
			console.log(formattedError)
			throw new Error(...formattedError._errors)
		}

		const checkReservationAvailability = new CheckReservationAvailability()

		const isUpdateValid = await checkReservationAvailability.checkUpdateAvailability({reservationId,endDate,endTime})

		if(!isUpdateValid){
			throw new Error("new end date has conflict with other reservation")
		}

		const isUpdateDateValid = await checkReservationAvailability.checkUpdateDateStatus({reservationId,endDate,endTime})

		if(!isUpdateDateValid) {
			throw new Error("invalid end time")
		}

		const newEndDate = new Date(`${endDate}T${endTime}`)
		const oldEndDate = new Date(`${reservation.endDate}T${reservation.endTime}`)

		if (newEndDate.getTime() === oldEndDate.getTime()) {
			throw new Error("new end date is the same")
		}

		const updatedReservation = prisma.reservation.update({
			where: {
				id: reservationId
			},
			data: {
				endTime,
				endDate,
				paymentStatus: ReservationPaymentStatus.Pendente
			}
		})

		return updatedReservation

	}
}