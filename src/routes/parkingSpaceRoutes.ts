import { Router } from "express"
import { ParkingSpaceController } from "../controller/parkingSpaceController"
import { checkLogin } from "../middlewares/checkLogin"

const parkingSpaceRoutes = Router()
const parkingSpaceController = new ParkingSpaceController()

parkingSpaceRoutes.post("/parkingSpaces", checkLogin, parkingSpaceController.create)
parkingSpaceRoutes.get("/parkingSpaces/:id", checkLogin, parkingSpaceController.detail)
parkingSpaceRoutes.get("/parkingSpaces", checkLogin, parkingSpaceController.listAll)
parkingSpaceRoutes.patch("/parkingSpaces/:id", checkLogin, parkingSpaceController.update)
parkingSpaceRoutes.delete("/parkingSpaces/:id", checkLogin, parkingSpaceController.delete)

export default parkingSpaceRoutes
