import parkingSpaceRoutes from "../routes/parkingSpaceRoutes"
import { UserService } from "../service/userService"
import AuthService from "../service/authService"
import request from "supertest"
import * as fs from "fs"
import routesUser from "../routes/userRoutes"
import authRoutes from "../routes/authRoutes"

describe("Vagas de estacionamento", () => {
	let token: string

	beforeEach(async () => {
		// await connection.migrate.rollback()
		// await connection.migrate.latest()
	})

	afterAll( async () => {
		// await connection.destroy()
	})

	beforeAll(async () => {
		// const newUser = {
		// 	id: "076b915b-c7ee-4910-8f57-8d4e5caf3800",
		// 	name: "Maria da Silva",
		// 	email: "mariasilva@gmail.com",
		// 	phoneNumber: "(83)991684630",
		// 	password: "Senha2023"
		// }

		// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhMzJlNTAzLThkNWQtNDIyYi1iOWQwLWI0MmMzZTI2NzI4NyIsImlhdCI6MTcwMTcyOTExOCwiZXhwIjoxNzAxNzMyNzE4fQ.JCoDulUYp9vL1odFaWWbBxCRPuotmhqx1CpZjF5lhqo"
		// const authService = new AuthService()
		// const userService = new UserService()
		
		// jest.spyOn(userService, "create").mockResolvedValue(newUser)
		// jest.spyOn(authService, "login").mockResolvedValue({token: token})

		// const newUser = {
		// 	name: "Maria da Silva",
		// 	email: "mariasilva@gmail.com",
		// 	phoneNumber: "(83)991684630",
		// 	password: "Senha2023"
		// }

		// await request(routesUser).post("/users").send(newUser)
		// const tokenResponse = await request(authRoutes).post("/login").send({name: newUser.name, password: newUser.password})
		// token = tokenResponse.body.token
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

		const response = await request(parkingSpaceRoutes).post("/parkingSpaces").send(formData).set("authorization", `${token}`).set("Content-Type", "multipart/form-data")

		const receivedParkingSpace = response.body 

		expect({
			latitude: formData.get("latitude"),
			longitude: formData.get("longitude"),
			description: formData.get("getdescription"),
			disponibility: formData.get("getdisponibility"),
			pricePerHour: formData.get("getpricePerHour"),
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
	})

})