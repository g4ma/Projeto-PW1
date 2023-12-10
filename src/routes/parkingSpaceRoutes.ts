import { Router } from "express"
import { ParkingSpaceController } from "../controller/parkingSpaceController"
import { checkLogin } from "../middlewares/checkLogin"
import multer  from "multer"
import uploadConfig from "../config/upload"
import { isOwner } from "../middlewares/isOwner"

const upload = multer(uploadConfig.upload("./pictures"))

const parkingSpaceRoutes = Router()
const parkingSpaceController = new ParkingSpaceController()

parkingSpaceRoutes.post("/parkingSpaces", checkLogin, isOwner, upload.array("pictures"), parkingSpaceController.create)
parkingSpaceRoutes.get("/parkingSpaces/:id", checkLogin, parkingSpaceController.detail)
parkingSpaceRoutes.get("/parkingSpaces", parkingSpaceController.listAll)
parkingSpaceRoutes.patch("/parkingSpaces/:id", checkLogin, isOwner, parkingSpaceController.update)
parkingSpaceRoutes.delete("/parkingSpaces/:id", checkLogin, isOwner, parkingSpaceController.delete)

export default parkingSpaceRoutes
