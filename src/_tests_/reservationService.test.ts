/* eslint-disable no-mixed-spaces-and-tabs */
import { prismaMock } from "./singleton"
import { ReservationService } from "../service/reservationService"
import * as validate from "../utils/reservationValidateZod"
import { ReservationPaymentStatus } from "@prisma/client"
import * as validateReservation from "../utils/checkReservationAvailability"
import { CheckReservationAvailability } from "../utils/checkReservationAvailability"



describe("Gerenciador de vagas de estacionamento", () => {
	let gerenciador: ReservationService

	beforeEach(() => {
		jest.clearAllMocks()
		gerenciador = new ReservationService()
	})
    
	describe("Fluxo normal", () => {

		test("Registro de reserva", async ()=>{
			const reservationMock = {
				id: "05c57c12-9b2b-47a3-a2dd-b42c031c5028",
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const verifyDate = jest.spyOn(CheckReservationAvailability.prototype, "verifyDate").mockReturnValue(true)
			const verifyAvailability = jest.spyOn(CheckReservationAvailability.prototype, "verifyAvailability").mockResolvedValue(true)


			const reservationValidateZod = jest.spyOn(validate, "reservationCreateValidateZod").mockReturnValue({
				success: true,
				data: {
					parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
					startTime: "10:20",
					endTime: "11:40",
					startDate: "19/11/2023",   
					endDate: "19/11/2023", 
				},
			})

			prismaMock.reservation.create.mockResolvedValue(reservationMock)
      
			await expect(gerenciador.create({
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023"
			})).resolves.toEqual(reservationMock)


			expect(verifyDate).toHaveBeenCalledTimes(1)
			expect(verifyAvailability).toHaveBeenCalledTimes(1)
			expect(reservationValidateZod).toHaveBeenCalledTimes(1)
			expect(prismaMock.reservation.create).toHaveBeenCalledTimes(1)
		
		})

		test("Listar reservas de vagas de estacionamento de um usuário proprietário", async () => {
			const userId = "f0b3d8c8-d739-4998-a107-d82297356a7f"

			const reservationMocks = [
				{
					id: "05c57c12-9b2b-47a3-a2dd-b42c031c5028",
					userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
					parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
					startTime: "10:20",
					endTime: "11:40",
					startDate: "19/11/2023",   
					endDate: "19/11/2023",  
					paymentStatus: ReservationPaymentStatus.Aprovado
				},
				{
					id: "8d1d7659-abe8-439d-a08b-b298c2d97252",
					userId: "74a0819d-6dea-467d-96cf-9122d76f0171",
					parkingSpaceId: "30e94b68-dbce-4857-a2fc-6b99b9bcd67e",
					startTime: "12:00",
					endTime: "14:00",
					startDate: "20/11/2023",   
					endDate: "20/11/2023",  
					paymentStatus: ReservationPaymentStatus.Aprovado
				},
				{ 
					id: "4c2d0c18-d696-4bf7-a482-a9b4ce7a6ae5",
					userId: "ea70f261-08c4-44f9-b993-8ad672310136",
					parkingSpaceId: "83dd55f9-ce2c-454d-a10a-a0968b4b3c69",
					startTime: "19:00",
					endTime: "23:35",
					startDate: "28/11/2023",   
					endDate: "28/11/2023",  
					paymentStatus: ReservationPaymentStatus.Aprovado
				}
			]

			prismaMock.owner.findUnique.mockResolvedValue({userId, pixKey: "fjaskfhaskjfaskj"})
			prismaMock.reservation.findMany.mockResolvedValue(reservationMocks)
			const reservations = await gerenciador.listOwner({userId})

			expect(reservations).toBe(reservationMocks)
		})

		test("Deletar reserva de vaga de estacionamento", async () => {
			const reservation = {
				id: "05c57c12-9b2b-47a3-a2dd-b42c031c5028",
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const { userId, id } = reservation
			const reservationId = id

			prismaMock.reservation.findUnique.mockResolvedValue(reservation)
			prismaMock.reservation.delete.mockResolvedValue(reservation)

			const deletedReservation = await gerenciador.delete({userId, reservationId})
			
			expect(deletedReservation).toBe(reservation)	
		})

		test("Atualizar reserva de vaga de estacionamento", async()=>{

			const reservation = {
				id: "05c57c12-9b2b-47a3-a2dd-b42c031c5028",
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}
			
			const { id, userId } = reservation

			const reservationId = id
			const endDate = "2023-11-19"
			const endTime = "14:00"
			

			prismaMock.reservation.findUnique.mockResolvedValue(reservation)

			const reservationUpdateDateValidateZod = jest.spyOn(validate, "reservationUpdateDateValidateZod").mockReturnValue({
				success: true,
				data: {
					endTime: "14:00",
					endDate: "19/11/2023",  
				},
			})

			const checkUpdateAvailability = jest.spyOn(CheckReservationAvailability.prototype, "checkUpdateAvailability").mockResolvedValue(true)
			const checkUpdateDateStatus = jest.spyOn(CheckReservationAvailability.prototype, "checkUpdateDateStatus").mockResolvedValue(true)

			prismaMock.reservation.update.mockResolvedValue(reservation)

			const checkUpdateAvailabilityMock = jest.spyOn(CheckReservationAvailability.prototype, "checkUpdateAvailability").mockResolvedValue(true)

			await expect(gerenciador.updateReservationDate({userId, reservationId, endDate, endTime})).resolves.toEqual(reservation)
			expect(reservationUpdateDateValidateZod).toHaveBeenCalledTimes(1)
			expect(checkUpdateAvailability).toHaveBeenCalledTimes(1)
			expect(checkUpdateDateStatus).toHaveBeenCalledTimes(1)
			expect(checkUpdateAvailabilityMock).toHaveBeenCalledTimes(1)
		})
	})

	describe("Fluxo de exceção", () => {

		test("Atualizar reserva de vaga de estacionamento com data conflitante", async () => {
			const reservation = { 
				id: "4c2d0c18-d696-4bf7-a482-a9b4ce7a6ae5",
				userId: "ea70f261-08c4-44f9-b993-8ad672310136",
				parkingSpaceId: "83dd55f9-ce2c-454d-a10a-a0968b4b3c69",
				startTime: "12:00",
				endTime: "13:35",
				startDate: "2023-11-20",   
				endDate: "2023-11-20",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const { id, userId } = reservation

			const reservationId = id
			const endDate = "2023-11-19"
			const endTime = "14:00"

			prismaMock.reservation.findUnique.mockResolvedValue(reservation)
			const reservationUpdateDateValidateZod = jest.spyOn(validate, "reservationUpdateDateValidateZod").mockReturnValue({
				success: true,
				data: {
					endDate,
					endTime
				},
			})
			const checkUpdateAvailabilityMock = jest.spyOn(CheckReservationAvailability.prototype, "checkUpdateAvailability").mockResolvedValue(false)

			await expect(gerenciador.updateReservationDate({userId, reservationId, endDate, endTime})).rejects.toEqual(new Error("new end date has conflict with other reservation"))
			expect(reservationUpdateDateValidateZod).toHaveBeenCalledTimes(1)
			expect(checkUpdateAvailabilityMock).toHaveBeenCalledTimes(1)
		})

		test("Realizar registro de reserva de vaga de estacionamento que está ocupada", async () => {
			const userId = "ea70f261-08c4-44f9-b993-8ad672310136"
			const parkingSpaceId = "83dd55f9-ce2c-454d-a10a-a0968b4b3c69"
			const startTime = "12:00"
			const endTime = "13:35"
			const startDate = "2023-11-20"   
			const endDate = "2023-11-20"  

			const checkReservation = new validateReservation.CheckReservationAvailability()
			jest.spyOn(checkReservation, "verifyDate").mockReturnValue(true)
			jest.spyOn(checkReservation, "verifyAvailability").mockReturnValue(Promise.resolve(false))

			await expect(gerenciador.create({userId, parkingSpaceId, endDate, endTime, startDate, startTime})).rejects.toEqual(new Error("parking space already ocupied"))
		})

		test("Registrar reserva de vaga de estacionamento com horário em uma data não disponível", async () =>{
			const reservationMock = {
				id: "05c57c12-9b2b-47a3-a2dd-b42c031c5028",
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const verifyDate = jest.spyOn(CheckReservationAvailability.prototype, "verifyDate").mockReturnValue(true)
			const verifyAvailability = jest.spyOn(CheckReservationAvailability.prototype, "verifyAvailability").mockResolvedValue(false)

			const reservationValidateZod = jest.spyOn(validate, "reservationCreateValidateZod")

			prismaMock.reservation.create.mockResolvedValue(reservationMock)
      
			await expect(gerenciador.create({
				userId: "b3e29220-e5e0-4339-b612-0b85e3ef4ceb",
				parkingSpaceId: "d3d650f9-898f-4331-917a-c06ead6a9024",
				startTime: "10:20",
				endTime: "11:40",
				startDate: "19/11/2023",   
				endDate: "19/11/2023"
			})).rejects.toBeInstanceOf(Error)

			expect(verifyDate).toHaveBeenCalledTimes(1)
			expect(verifyAvailability).toHaveBeenCalledTimes(1)
			expect(reservationValidateZod).toHaveBeenCalledTimes(0)
			expect(prismaMock.reservation.create).toHaveBeenCalledTimes(0)
		
		})

	})
})