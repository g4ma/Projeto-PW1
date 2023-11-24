import {Router} from "express"
import { OwnerController } from "../controller/ownerController"
import { checkLogin } from "../middlewares/checkLogin"

const routesOwner = Router()

const ownerController = new OwnerController()

routesOwner.put("/owners/:id", checkLogin, ownerController.updatePixKey)

export default routesOwner