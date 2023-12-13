import request from "supertest"
import { prisma } from "../database/prisma"
import app from "../app"

describe("Users", () => {

	afterAll( async () => {
		await prisma.user.deleteMany()
	})

	test("cadastro de usuário com todas as informações corretas", async () => {
		const newUser = {
			name: "Maria da Silva",
			email: "mariasilva@gmail.com",
			phoneNumber: "(83)99168-4630",
			password: "Senha2023"
		}

		const response = await request(app).post("/users").set("Content-type", "application/json").send({name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber, password: newUser.password})

		const receivedUser = response.body 

		expect({
			email: newUser.email,
			name: newUser.name,
			phoneNumber: newUser.phoneNumber,
			password: newUser.password
		}).toEqual({
			email: receivedUser.email,
			name: receivedUser.name,
			phoneNumber: receivedUser.phoneNumber,
			password: receivedUser.password
		})
		expect(response.status).toBe(201)
	}, 10000)

})