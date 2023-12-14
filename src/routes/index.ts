import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import parkingSpaceRoutes from "./parkingSpaceRoutes"
import ownerRoutes from "./ownerRoutes"
import reservationRoutes from "./reservationRoutes"
import pictureRoutes from "./pictureRoutes"

router.use(userRoutes)
router.use(authRoutes)
router.use(parkingSpaceRoutes)
router.use(ownerRoutes)
router.use(reservationRoutes)
router.use(pictureRoutes)

export default router