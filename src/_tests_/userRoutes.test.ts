import request from "supertest"
import { prisma } from "../database/prisma"
import app from "../app"

describe("Users", () => {
	let token: string
	let userId: string
	afterAll( async () => {
		await prisma.user.deleteMany()
	})

	beforeEach(async () => {
		const newUser = {
			name: "Maria da Silva",
			email: "mariasilva@gmail.com",
			phoneNumber: "(83)99168-4630",
			password: "Senha2023"
		}
	
		const user = await request(app).post("/users").send(newUser)
		userId = user.body.id
		const tokenResponse = await request(app).post("/login").send({email: newUser.email, password: newUser.password})
		token = tokenResponse.body.token
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


	test("Registro de usuário com campos em branco", async() =>{
		const newUser = {
			name: "Maria da Silva",
			email: "mariasilva@gmail.com",
			password: "Senha2023"
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
	
		expect(response.status).toBe(200)
	
		expect(response.body.pixKey).toBe(pixKey)
	
		await expect(prisma.owner.findUnique({
			where: {
				userId: response.body.userId
			},
		})).resolves.not.toBeNull()
	})
})