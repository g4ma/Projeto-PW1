import { Router } from "express";
import { ReservationController } from "../controller/reservationController";

const routesReservation = Router();
const reservationController = new ReservationController();

routesReservation.post("/reservations/:id", reservationController.create);
routesReservation.get("/reservations/user/:id", reservationController.listAll);
routesReservation.get("/reservations/owner/:id", reservationController.listOwner);
routesReservation.delete("/reservations", reservationController.delete);
routesReservation.patch("/reservations/payment", reservationController.updatePaymentStatus);
routesReservation.patch("/reservations/date", reservationController.updateReservationDate);

export default routesReservation;