import {Router} from "express"
import { OwnerController } from "../controller/ownerController"
import { checkLogin } from "../middlewares/checkLogin"
import { verifyUser } from "../middlewares/verifyUser"

const routesOwner = Router()

const ownerController = new OwnerController()

routesOwner.put("/owners/:id", checkLogin, verifyUser, ownerController.updatePixKey)

export default routesOwner