import { Router } from 'express'
import { AuthControler } from '../controller/authController'
const authRoutes = Router()

const authControler = new AuthControler()
authRoutes.post('/login', authControler.login)

export default authRoutes