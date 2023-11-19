import {Router} from 'express'
import { UserController } from '../controller/userController'

const routesUser = Router()

const userController = new UserController()
routesUser.post('/users',userController.create)

export default routesUser