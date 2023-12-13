import { Router } from "express"
import { PictureController } from "../controller/pictureController"
import { checkLogin } from "../middlewares/checkLogin"
import { isOwner } from "../middlewares/isOwner"
import multer  from "multer"
import uploadConfig from "../config/upload"
import { verifyUserOnParkingSpace } from "../middlewares/verifyUserOnParkingSpace"

const upload = multer(uploadConfig.upload("./pictures"))

const pictureRoutes = Router()
const pictureController = new PictureController()

pictureRoutes.post("/pictures", checkLogin, isOwner, verifyUserOnParkingSpace,  upload.array("pictures"), pictureController.create)

export default pictureRoutes
