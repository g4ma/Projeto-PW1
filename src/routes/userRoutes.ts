import {Router} from 'express'
import { UserController } from '../controller/userController'
import { checkLogin } from '../middlewares/checkLogin'

const routesUser = Router()

const userController = new UserController()
routesUser.post('/users',userController.create)
routesUser.patch('/users/:id',checkLogin, userController.update)

export default routesUser