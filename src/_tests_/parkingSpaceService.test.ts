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

			prismaMock.owner.findUnique.mockResolvedValue({ userId: ownerId, pixKey: "kjfaj28f8hak" })

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
            
			const pictures: Express.Multer.File[] = [picture1, picture2]
			const latitude = 12.3456
			const longitude = 78.9012
			const pricePerHour = 100
			const disponibility = true
			const description = "Spacious parking spot in a central location"
			const type = ParkingSpaceType.Moto
			const ownerId = "1dc092e1-819b-4a24-b373-7fd6c5fd8601"

			prismaMock.owner.findUnique.mockResolvedValue({ userId: ownerId, pixKey: "kjfaj28f8hak" })

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

			await gerenciador.create({pictures, latitude, longitude, pricePerHour, disponibility, description, type, ownerId})

			const id = "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5"

			prismaMock.parkingSpace.findUniqueOrThrow.mockResolvedValue(parkingSpaceMock)

			const parkingSpace = await gerenciador.detail(id)

			expect(parkingSpace).toBe(parkingSpaceMock)
		})

		// nesse aqui meio que desisti já
		// test("Listagem de vagas de estacionamento", async () => {
		// 	const content = "Conteúdo do arquivo fake"
		// 	const stream = Readable.from(content)

		// 	const picture1 = {
		// 		fieldname: "file",
		// 		originalname: "fakeFile1.txt",
		// 		encoding: "7bit",
		// 		mimetype: "text/plain",
		// 		buffer: Buffer.from(content),
		// 		size: Buffer.byteLength(content),
		// 		destination: "", // (opcional) Diretório onde o arquivo foi armazenado
		// 		filename: "fakeFile1.txt", // Nome do arquivo
		// 		path: "caminho/fakeFile1.txt", // Caminho do arquivo
		// 		stream, // Incluindo o stream no objeto FakeFile
		// 	}

		// 	const picture2 = {
		// 		fieldname: "file",
		// 		originalname: "fakeFile2.txt",
		// 		encoding: "7bit",
		// 		mimetype: "text/plain",
		// 		buffer: Buffer.from(content),
		// 		size: Buffer.byteLength(content),
		// 		destination: "", // (opcional) Diretório onde o arquivo foi armazenado
		// 		filename: "fakeFile2.txt", // Nome do arquivo
		// 		path: "caminho/fakeFile2.txt", // Caminho do arquivo
		// 		stream, // Incluindo o stream no objeto FakeFile
		// 	}

		// 	const pictures1: Express.Multer.File[] = [picture1, picture2]
		// 	const latitude1 = 12.3456
		// 	const longitude1 = 78.9012
		// 	const pricePerHour1 = 12
		// 	const disponibility1 = true
		// 	const description1 = "Spacious parking spot in a central location 1"
		// 	const type1 = ParkingSpaceType.Moto
		// 	const ownerId1 = "1dc092e1-819b-4a24-b373-7fd6c5fd8601"
			
		// 	const pictures2: Express.Multer.File[] = [picture2, picture1]
		// 	const latitude2 = 11.1111
		// 	const longitude2 = 79.9999
		// 	const pricePerHour2 = 15
		// 	const disponibility2 = true
		// 	const description2 = "Spacious parking spot in a central location 2"
		// 	const type2 = ParkingSpaceType.Carro
		// 	const ownerId2 = "2dc092e1-819b-4a24-b373-7fd6c5fd8602"

		// 	const parkingSpaceMock1 = {
		// 		id: "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5",
		// 		latitude: latitude1,
		// 		longitude: longitude1,
		// 		type: type1,
		// 		pricePerHour: pricePerHour1,
		// 		disponibility: disponibility1,
		// 		description: description1,
		// 		ownerId: ownerId1,
		// 		picture: pictures1
		// 	}

		// 	const parkingSpaceMock2 = {
		// 		id: "9b8c7d6e-5432-1a2b-0c9d-8e7f6a5b4c3d",
		// 		latitude: latitude2,
		// 		longitude: longitude2,
		// 		type: type2,
		// 		pricePerHour: pricePerHour2,
		// 		disponibility: disponibility2,
		// 		description: description2,
		// 		ownerId: ownerId2,
		// 		picture: pictures2
		// 	}
			
		// 	prismaMock.parkingSpace.create.mockResolvedValue(parkingSpaceMock1)
		// 	const parkingSpace1 = await gerenciador.create({pictures1, latitude1, longitude1, pricePerHour1, disponibility1, description1, type1, ownerId1})
			
		// 	prismaMock.parkingSpace.create.mockResolvedValue(parkingSpaceMock2)


		// 	const id = "3b4fea6d-8257-4d8d-baf1-3ea03b907ac5"
			
		// 	prismaMock.parkingSpace.findUniqueOrThrow.mockResolvedValue(parkingSpaceMock)

		// 	const parkingSpace = await gerenciador.detail(id)

		// 	expect(parkingSpace).toEqual(parkingSpaceMock)
		// })
    
	})
})
