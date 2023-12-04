import AuthService from "../service/authService"
import { prismaMock } from "./singleton"
import * as security from "../utils/security"
import  jwt  from "jsonwebtoken"



test("Autenticação de usuário com valores corretos", async()=>{
	const authMock = {
		email: "mariasilva@gmail.com",
		password: "Senha2023"
	}

	const userMock = {
		id: "d6d546d7-f651-4d36-8a28-5f1fe410bdd6",
		name: "Maria da Silva",
		email: "mariasilva@gmail.com",
		phoneNumber: "(83)99168-4630",
		password: "Senha2023"
	}

	prismaMock.user.findUnique.mockResolvedValue(userMock)
	const encryptMock = jest.spyOn(security, "encrypt").mockReturnValue("")
	const signMock = jest.spyOn(jwt, "sign").mockImplementation( () => "CTFVUYIBGOUVBHUCNIJ")
	const authService = new AuthService()
  
	await expect(authService.login(authMock)).resolves.toEqual({token: "CTFVUYIBGOUVBHUCNIJ" })

	expect(encryptMock).toHaveBeenCalledTimes(1)
	expect(signMock).toHaveBeenCalledTimes(1)
})

test("Autenticação de usuário com valores incorretos", async()=>{
	const authMock = {
		email: "silvamaria@gmail.com",
		password: "#Senha"
	}

	prismaMock.user.findUnique.mockResolvedValue(null)
	const encryptMock = jest.spyOn(security, "encrypt").mockReturnValue("")
	const signMock = jest.spyOn(jwt, "sign").mockImplementation(() => "")
	const authService = new AuthService()
  
	await expect(authService.login(authMock)).rejects.toThrow(Error)

	expect(encryptMock).toHaveBeenCalledTimes(1)
	expect(signMock).toHaveBeenCalledTimes(0)
})
