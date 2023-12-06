/* eslint-disable no-mixed-spaces-and-tabs */
import { prismaMock } from "./singleton"
import { ReservationService } from "../service/reservationService"
// import * as validate from "../utils/parkingSpaceValidateZod"
import { ReservationPaymentStatus } from "@prisma/client"

describe("Gerenciador de vagas de estacionamento", () => {
	let gerenciador: ReservationService

	beforeEach(() => {
		jest.clearAllMocks()
		gerenciador = new ReservationService()
	})
    
	describe("Fluxo normal", () => {

		test("Listar reservas de vagas de estacionamento de um usuário proprietário", async () => {
			const ownerId = "f0b3d8c8-d739-4998-a107-d82297356a7f"

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

			prismaMock.owner.findUnique.mockResolvedValue({userId: ownerId, pixKey: "fjaskfhaskjfaskj"})
			prismaMock.reservation.findMany.mockResolvedValue(reservationMocks)
			const reservations = await gerenciador.listOwner(ownerId)

			expect(reservations).toBe(reservationMocks)
		})
	})

	describe("Fluxo de exceção", () => {

		test("Atualizar reserva de vaga de estacionamento com valor inválido", async () => {
			const reservation = { 
				id: "4c2d0c18-d696-4bf7-a482-a9b4ce7a6ae5",
				userId: "ea70f261-08c4-44f9-b993-8ad672310136",
				parkingSpaceId: "83dd55f9-ce2c-454d-a10a-a0968b4b3c69",
				startTime: "19:00",
				endTime: "23:35",
				startDate: "2023-11-20",   
				endDate: "2023-11-20",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const { id } = reservation

			prismaMock.reservation.findUnique.mockResolvedValue(reservation)

			await expect(gerenciador.updateReservationDate(id, "23:30", "2023-11-19")).rejects.toEqual(new Error("invalid end time"))	
		})

		test("Deletar reserva que não existe", async () => {
			const reservation = { 
				id: "71d43ea8-5b26-477a-8a7f-4875767b49a7",
				userId: "2224b611-37c3-4478-a66e-3d4ff1a4141d",
				parkingSpaceId: "d67a6a5b-de2d-4061-8669-7bb8481b6cf5",
				startTime: "08:00",
				endTime: "09:00",
				startDate: "2023-11-28",   
				endDate: "2023-11-28",  
				paymentStatus: ReservationPaymentStatus.Aprovado
			}

			const { id } = reservation

			prismaMock.reservation.findUnique.mockResolvedValue(reservation)
			await expect(gerenciador.delete(id)).rejects.toEqual(new Error("reservation does not exist"))	
		})

		// test("Registrar reserva de vaga de estacionamento com horário em uma data não disponível", () => {
			
		// })
	})
})