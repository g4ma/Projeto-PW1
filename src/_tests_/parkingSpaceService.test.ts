/* eslint-disable no-mixed-spaces-and-tabs */
import { Readable } from "stream"
import { prismaMock } from "./singleton"
import { ParkingSpaceService } from "../service/parkingSpaceService"
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

			prismaMock.owner.findUnique.mockResolvedValue({ userId: "owner-id", pixKey: "kjfaj28f8hak" })

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

			expect(parkingSpace).toBe(parkingSpaceMock)
		})
		
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

			prismaMock.owner.findUnique.mockResolvedValue({ userId: "owner-id", pixKey: "kjfaj28f8hak" })

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

			expect(parkingSpace).toBe(parkingSpaceMock)
		})
    
	})
})
