import { Router } from "express"
import { PictureController } from "../controller/pictureController"
import { checkLogin } from "../middlewares/checkLogin"
import { isOwner } from "../middlewares/isOwner"
import multer  from "multer"
import uploadConfig from "../config/upload"

const upload = multer(uploadConfig.upload("./pictures"))

const pictureRoutes = Router()
const pictureController = new PictureController()

pictureRoutes.post("/pictures/parkingSpace", checkLogin, isOwner,  upload.array("pictures"), pictureController.create)

export default pictureRoutes
