import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import parkingSpaceRoutes from "./parkingSpaceRoutes"
import ownerRoutes from "./ownerRoutes"

router.use(userRoutes)
router.use(authRoutes)
router.use(parkingSpaceRoutes)
router.use(ownerRoutes)

export default router