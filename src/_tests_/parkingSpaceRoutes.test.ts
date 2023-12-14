import request from "supertest"
import * as fs from "fs"

import { prisma } from "../database/prisma"
import app from "../app"

describe("Vagas de estacionamento", () => {
	let token: string

	afterAll( async () => {
		await prisma.parkingSpace.deleteMany()
		await prisma.user.deleteMany()
	})

	beforeEach(async () => {
		const newUser = {
			name: "Maria da Silva",
			email: "mariasilva@gmail.com",
			phoneNumber: "(83)99168-4630",
			password: "Senha2023"
		}

		await request(app).post("/users").send(newUser)
		const tokenResponse = await request(app).post("/login").send({name: newUser.name, password: newUser.password})
		token = tokenResponse.body.token
	})

	test("cadastro de vaga de estacionamento com todas as informações corretas", async () => {
		const formData = new FormData()

		formData.append("latitude", "40.712776")
		formData.append("longitude", "-74.005974")
		formData.append("description", "Vaga segura e conveniente para motos: estacionamento dedicado")
		formData.append("pricePerHour", "10.00")
		formData.append("disponibility", "true")
		formData.append("type", "Moto")

		const filePath = "foto" 
		const fileBuffer = fs.readFileSync(filePath)
		const fileBlob = new Blob([fileBuffer], { type: "application/octet-stream" })

		formData.append("pictures", fileBlob)

		const response = await request(app).post("/parkingSpaces").send(formData).set("authorization", `${token}`).set("Content-Type", "multipart/form-data")

		const receivedParkingSpace = response.body 

		expect({
			latitude: formData.get("latitude"),
			longitude: formData.get("longitude"),
			description: formData.get("description"),
			disponibility: formData.get("disponibility"),
			pricePerHour: formData.get("pricePerHour"),
			type: formData.get("type")
		}).toEqual({
			latitude: receivedParkingSpace.latitude,
			longitude: receivedParkingSpace.longitude,
			description: receivedParkingSpace.description,
			disponibility: receivedParkingSpace.disponibility,
			pricePerHour: receivedParkingSpace.pricePerHour,
			type: receivedParkingSpace.type
		})
		expect(response.status).toBe(201)
	}, 10000)

})