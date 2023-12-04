/* eslint-disable no-mixed-spaces-and-tabs */
import { Readable } from "stream"
import { prismaMock } from "./singleton"
import { ParkingSpaceService } from "../service/parkingSpaceService"
import * as validate from "../utils/parkingSpaceValidateZod"
import { ParkingSpaceType } from "@prisma/client"

describe("Gerenciador de vagas de estacionamento", () => {
	let gerenciador: ParkingSpaceService

	beforeEach(() => {
		jest.clearAllMocks()
		gerenciador = new ParkingSpaceService()
	})
    
	describe("Fluxo normal", () => {
    
		test("Registro de Vaga de Estacionamento", async () => {
			const content = "Conteúdo do arquivo fake"
			const stream = Readable.from(content)

			const picture1: Express.Multer.File = {
            	fieldname: "file",
            	originalname: "fakeFile.txt",
            	encoding: "7bit",
            	mimetype: "text/plain",
            	buffer: Buffer.from(content),
            	size: Buffer.byteLength(content),
            	destination: "", // (opcional) Diretório onde o arquivo foi armazenado
            	filename: "fakeFile.txt", // Nome do arquivo
            	path: "caminho/fakeFile.txt", // Caminho do arquivo
            	stream, // Incluindo o stream no objeto FakeFile
			}

			const picture2: Express.Multer.File = {
            	fieldname: "file",
            	originalname: "fakeFile.txt",
            	encoding: "7bit",
            	mimetype: "text/plain",
            	buffer: Buffer.from(content),
            	size: Buffer.byteLength(content),
            	destination: "", // (opcional) Diretório onde o arquivo foi armazenado
            	filename: "fakeFile.txt", // Nome do arquivo
            	path: "caminho/fakeFile.txt", // Caminho do arquivo
            	stream, // Incluindo o stream no objeto FakeFile
			}
            
			const pictures: Express.Multer.File[] = [picture1, picture2]
			const latitude = 12.3456
			const longitude = 78.9012
			const pricePerHour = 100
			const disponibility = true
			const description = "Spacious parking spot in a central location"
			const type = ParkingSpaceType.Moto
			const ownerId = "1dc092e1-819b-4a24-b373-7fd6c5fd8601"

			prismaMock.owner.findUnique.mockResolvedValue({ userId: ownerId, pixKey: "kjfaj28f8hak" })

			const parkingSpaceValidateZod = jest.spyOn(validate, "parkingSpaceValidateZod").mockReturnValue({
				success: true,
				data: {
					latitude,
					longitude,
					pricePerHour,
					disponibility,
					description,
					type,
					ownerId
				},
			})

			const parkingSpaceMock = {
				id: "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5",
				latitude: 12.3456,
				longitude: 78.9012,
				type: ParkingSpaceType.Moto,
				pricePerHour: 10,
				disponibility: true,
				description: "Spacious parking spot in a central location",
				ownerId: "1dc092e1-819b-4a24-b373-7fd6c5fd8601"
			}
			
			prismaMock.parkingSpace.create.mockResolvedValue(parkingSpaceMock)

			const parkingSpace = await gerenciador.create({pictures, latitude, longitude, pricePerHour, disponibility, description, type, ownerId})

			expect(parkingSpace).toEqual(parkingSpaceMock)
			expect(parkingSpaceValidateZod).toHaveBeenCalledTimes(1)
		})

		test("Exibir dados de Vaga de Estacionamento", async () => {
			const content = "Conteúdo do arquivo fake"
			const stream = Readable.from(content)

			const picture1: Express.Multer.File = {
            	fieldname: "file",
            	originalname: "fakeFile.txt",
            	encoding: "7bit",
            	mimetype: "text/plain",
            	buffer: Buffer.from(content),
            	size: Buffer.byteLength(content),
            	destination: "", // (opcional) Diretório onde o arquivo foi armazenado
            	filename: "fakeFile.txt", // Nome do arquivo
            	path: "caminho/fakeFile.txt", // Caminho do arquivo
            	stream, // Incluindo o stream no objeto FakeFile
			}

			const picture2: Express.Multer.File = {
            	fieldname: "file",
            	originalname: "fakeFile.txt",
            	encoding: "7bit",
            	mimetype: "text/plain",
            	buffer: Buffer.from(content),
            	size: Buffer.byteLength(content),
            	destination: "", // (opcional) Diretório onde o arquivo foi armazenado
            	filename: "fakeFile.txt", // Nome do arquivo
            	path: "caminho/fakeFile.txt", // Caminho do arquivo
            	stream, // Incluindo o stream no objeto FakeFile
			}

			const parkingSpaceMock = {
				id: "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5",
				latitude: 12.3456,
				longitude: 78.9012,
				type: ParkingSpaceType.Moto,
				pricePerHour: 10,
				disponibility: true,
				description: "Spacious parking spot in a central location",
				ownerId: "1dc092e1-819b-4a24-b373-7fd6c5fd8601",
				picture: [picture1, picture2]
			}

			const id = "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5"

			prismaMock.parkingSpace.findUniqueOrThrow.mockResolvedValue(parkingSpaceMock)

			const parkingSpace = await gerenciador.detail(id)

			expect(parkingSpace).toBe(parkingSpaceMock)
		})

		test("Listagem de vagas de estacionamento", async () => {
			const parkingSpacesMocks = [
				{
					id: "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5",
					latitude: 12.3456,
					longitude: 78.9012,
					pricePerHour: 12,
					disponibility: true,
					description: "Spacious parking spot in a central location 1",
					type: ParkingSpaceType.Moto,
					ownerId: "1dc092e1-819b-4a24-b373-7fd6c5fd8601"
				},
				{
					id: "9b8c7d6e-5432-1a2b-0c9d-8e7f6a5b4c3d",
					latitude: 11.1111,
					longitude: 79.9999,
					pricePerHour: 15,
					disponibility: true,
					description: "Spacious parking spot in a central location 2",
					type: ParkingSpaceType.Carro,
					ownerId: "2dc092e1-819b-4a24-b373-7fd6c5fd8602"
				}
			]

			
			prismaMock.parkingSpace.findMany.mockResolvedValue(parkingSpacesMocks)
			const parkingSpacesAll = await gerenciador.listAll()
			expect(parkingSpacesAll).toBe(parkingSpacesMocks)
		})
    
	})

	describe("Fluxo de exceção", () => {

		test("Exibir dados de uma vaga de estacionamento que não existe", async () => {
			const userId = "18cad0e9-8710-448b-a08c-dc193eb3c55b"
			const id = "1467ad4c-fe49-4c44-b360-61774a1f91e2"

			prismaMock.owner.findUnique.mockResolvedValue({ userId, pixKey: "fkjakfjajfkah"})
			prismaMock.parkingSpace.findUnique.mockResolvedValue(null)

			await expect(gerenciador.delete(id, userId)).rejects.toEqual(new Error("parking space doens't exists"))
		})
	})
})
