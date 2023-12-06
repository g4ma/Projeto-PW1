import { Router } from "express";
import { ReservationController } from "../controller/reservationController";
import { checkLogin } from "../middlewares/checkLogin";

const routesReservation = Router();
const reservationController = new ReservationController();

routesReservation.post("/reservations", checkLogin, reservationController.create);
routesReservation.get("/reservations/user", checkLogin, reservationController.listAll);
routesReservation.get("/reservations/owner", checkLogin, reservationController.listOwner);
routesReservation.delete("/reservations/:reservationId", checkLogin, reservationController.delete);
routesReservation.patch("/reservations/payment/:reservationId", checkLogin, reservationController.updatePaymentStatus);
routesReservation.patch("/reservations/date/:reservationId", checkLogin, reservationController.updateReservationDate);

export default routesReservation;