import request from "supertest"
// import * as fs from "fs"

import { prisma } from "../database/prisma"
import app from "../app"
import path from "path"

describe("Vagas de estacionamento", () => {
	let token: string

	beforeAll(async () => {
		await prisma.picture.deleteMany()
		await prisma.parkingSpace.deleteMany()
		await prisma.owner.deleteMany()
		await prisma.user.deleteMany()
	})
	
	afterAll( async () => {
		await prisma.picture.deleteMany()
		await prisma.parkingSpace.deleteMany()
		await prisma.owner.deleteMany()
		await prisma.user.deleteMany()
	})

	beforeEach(async () => {
		const newUser = {
			name: "Cassia Eller",
			email: "cassiaeller@gmail.com",
			phoneNumber: "(83)99168-4630",
			password: "Senha42iu",
			pixKey: "92847dkj42fh"
		}

		await request(app).post("/users").send(newUser)
		const tokenResponse = await request(app).post("/login").send({email: newUser.email, password: newUser.password})
		token = tokenResponse.body.token
	})

	test("cadastro de vaga de estacionamento com todas as informações corretas", async () => {
		const latitude = "40.7776"
		const longitude = "-74.0054"
		const description = "Vaga segura e conveniente para motos"
		const pricePerHour = "10"
		const type = "Moto"

		const filePath = path.resolve(__dirname, "../../pictures/ifpb.jpg")

		const response = await request(app).post("/parkingSpaces").set("authorization", token).set("Content-Type", "multipart/form-data").field("latitude", latitude).field("longitude", longitude).field("description", description).field("pricePerHour", pricePerHour).field("type", type).attach("pictures", path.resolve(__dirname, filePath))

		const receivedParkingSpace = response.body 

		expect({
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
			description: description,
			pricePerHour: parseFloat(pricePerHour),
			type: type
		}).toEqual({
			latitude: receivedParkingSpace.latitude,
			longitude: receivedParkingSpace.longitude,
			description: receivedParkingSpace.description,
			pricePerHour: receivedParkingSpace.pricePerHour,
			type: receivedParkingSpace.type
		})
		expect(response.status).toBe(201)
	}, 10000)

})