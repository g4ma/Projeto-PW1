import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import parkingSpaceRoutes from "./parkingSpaceRoutes"

router.use(userRoutes)
router.use(authRoutes)
router.use(parkingSpaceRoutes)


export default router