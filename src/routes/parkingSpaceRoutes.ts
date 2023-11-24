import { Router } from "express"
import { ParkingSpaceController } from "../controller/parkingSpaceController"

const parkingSpaceRoutes = Router()
const parkingSpaceController = new ParkingSpaceController()

parkingSpaceRoutes.post("/parkingSpaces", parkingSpaceController.create)
parkingSpaceRoutes.get("/parkingSpaces/:id", parkingSpaceController.detail)

export default parkingSpaceRoutes
