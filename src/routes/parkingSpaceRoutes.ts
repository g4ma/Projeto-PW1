import { Router } from "express"
import { ParkingSpaceController } from "../controller/parkingSpaceController"

const parkingSpaceRoutes = Router()
const parkingSpaceController = new ParkingSpaceController()

parkingSpaceRoutes.post("/parkingSpaces", parkingSpaceController.create)
parkingSpaceRoutes.get("/parkingSpaces/:id", parkingSpaceController.detail)
parkingSpaceRoutes.get("/parkingSpaces", parkingSpaceController.listAll)
parkingSpaceRoutes.patch("/parkingSpaces/:id", parkingSpaceController.update)

export default parkingSpaceRoutes
