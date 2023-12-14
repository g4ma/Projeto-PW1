import request from "supertest"
import { prisma } from "../database/prisma"
import app from "../app"

describe("Users", () => {
	let token: string
	let userId: string
	
	afterAll( async () => {
		await prisma.owner.deleteMany()
		await prisma.user.deleteMany()
	})

	beforeAll(async () => {
		const newUser = {
			name: "Maria da Silva",
			email: "mariasilva@gmail.com",
			phoneNumber: "(83)99168-4630",
			password: "Senha2023"
		}
	
		const user = await request(app).post("/users").send(newUser)
		console.log(user.body)
		userId = user.body.id
		const tokenResponse = await request(app).post("/login").send({email: newUser.email, password: newUser.password})
		token = tokenResponse.body.token
		console.log(userId, token)
	})

	test("cadastro de usuário com todas as informações corretas", async () => {
		const newUser = {
			name: "Gal Costa",
			email: "galcosta@gmail.com",
			phoneNumber: "(83)99547-8246",
			password: "Senha2200"
		}

		const response = await request(app).post("/users").set("Content-type", "application/json").send({name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber, password: newUser.password})

		const receivedUser = response.body 

		expect({
			email: newUser.email,
			name: newUser.name,
			phoneNumber: newUser.phoneNumber
		}).toEqual({
			email: receivedUser.email,
			name: receivedUser.name,
			phoneNumber: receivedUser.phoneNumber
		})
		expect(response.status).toBe(201)
	}, 10000)


	test("Registro de usuário com campos em branco", async() =>{
		const newUser = {
			name: "Marisa Monte",
			email: "marisamonte@gmail.com",
			password: "Senha8427"
		}
		const response = await request(app).post("/users").set("Content-type", "application/json").send({name: newUser.name, email: newUser.email, password: newUser.password})

		const receivedUser = response.body 

		expect(receivedUser).toBeInstanceOf(Array)
		expect(response.status).toBe(400)
	}, 10000)

	test("Usuário pode fazer upgrade para proprietário com chave pix válida", async () => {
		const pixKey = "111.222.333-44"
	
		const response = await request(app)
			.put(`/users/${userId}`)
			.set("authorization", token)
			.send({ pixKey })
	

		expect(response.body.pixKey).toBe(pixKey)
		expect(response.status).toBe(200)
	
		await expect(prisma.owner.findUnique({
			where: {
				userId: response.body.userId
			},
		})).resolves.not.toBeNull()
	})
})