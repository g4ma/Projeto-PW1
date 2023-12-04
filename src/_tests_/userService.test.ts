import { prismaMock } from "./singleton"
import { UserService } from "../service/userService"
import * as security from "../utils/security"
import * as validate from "../utils/userValidateZod"
import { ZodError } from "zod"


describe("Gerenciador de usuários", () => {
	let gerenciador: UserService

	beforeEach(() => {
		jest.clearAllMocks()
		gerenciador = new UserService()
	})

	describe("Fluxo normal", () =>{
		test("Registro de usuário", async() =>{
			const userMock = {
				id: "d6d546d7-f651-4d36-8a28-5f1fe410bdd6",
				name: "Maria da Silva",
				email: "mariasilva@gmail.com",
				phoneNumber: "(83)991684630",
				password: "Senha2023"
			}

			prismaMock.user.findUnique.mockResolvedValue(null)
			const encryptMock = jest.spyOn(security, "encrypt").mockReturnValue("")
			const userValidateZod = jest.spyOn(validate, "userCreateValidateZod").mockReturnValue({
				success: true,
				data: {
					name: "Maria da Silva",
					email: "mariasilva@gmail.com",
					phoneNumber: "(83)99168-4630",
					password: "Senha2023"
				},
			})
    
			prismaMock.user.create.mockResolvedValue(userMock)
      
			await expect(gerenciador.create({
				name: "Maria da Silva",
				email: "mariasilva@gmail.com",
				phoneNumber: "(83)99168-4630",
				password: "Senha2023"
			})).resolves.toEqual(userMock)
      
			expect(encryptMock).toHaveBeenCalledTimes(1)
			expect(userValidateZod).toHaveBeenCalledTimes(1)
			expect(prismaMock.owner.create).toHaveBeenCalledTimes(0)
    
		})

		test("Registro de usuário com campos em branco", async() =>{
			const userMock = {
				name: "Maria da Silva",
				email: "",
				phoneNumber: "",
				password: "Senha2023"
			}

			const encryptMock = jest.spyOn(security, "encrypt").mockReturnValue("")
			const userValidateZod = jest.spyOn(validate, "userCreateValidateZod").mockReturnValue({
				success: false,
				error: new ZodError([])
			})
      
			await expect(gerenciador.create(userMock)).rejects.toThrow(Error)
      
			expect(encryptMock).toHaveBeenCalledTimes(0)
			expect(userValidateZod).toHaveBeenCalledTimes(1)
			expect(prismaMock.owner.create).toHaveBeenCalledTimes(0)
			expect(prismaMock.user.create).toHaveBeenCalledTimes(0)
		})
	})
})