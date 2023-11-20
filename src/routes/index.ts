import express from 'express'
const router = express.Router()
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'

router.use(userRoutes)
router.use(authRoutes)

export default router