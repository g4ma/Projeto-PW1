import {Router} from "express"
import { UserController } from "../controller/userController"
import { checkLogin } from "../middlewares/checkLogin"
import { verifyUser } from "../middlewares/verifyUser"

const routesUser = Router()

const userController = new UserController()
routesUser.post("/users",userController.create)
routesUser.patch("/users/:id",checkLogin, verifyUser, userController.update)
routesUser.delete("/users/:id",checkLogin, verifyUser, userController.delete)
routesUser.get("/users/:id", checkLogin, verifyUser, userController.detail)
routesUser.put("/users/:id", checkLogin, verifyUser, userController.upgrade)


export default routesUser