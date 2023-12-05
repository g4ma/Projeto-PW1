import { ReservationService } from "../service/reservationService";
import { Request, Response } from "express"

const reservationService = new ReservationService();

export class ReservationController {

    async create(req: Request, res: Response) {

        const userId = req.params.userId;
        const { parkingSpaceId, startDate, endDate, startTime, endTime } = req.body;

        try {
            const result = await reservationService.create(
                userId,
                parkingSpaceId,
                startDate,
                endDate,
                startTime,
                endTime
            );
            res.status(201).json(result);
        } catch (error: unknown) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }

    }

    async listOwner(req: Request, res: Response) {
        const ownerId = req.params.userId;

        try {
            const result = await reservationService.listOwner(ownerId);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }
    }

    async listAll(req: Request, res: Response) {
        const userId = req.params.userId;

        try {
            const result = await reservationService.listAll(userId);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }
    }

    async delete(req: Request, res: Response) {
        const { reservationId } = req.body;

        try {
            const result = await reservationService.delete(reservationId);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }
    }

    async updatePaymentStatus(req: Request, res: Response) {
        const { reservationId, paymentStatus } = req.body;

        try {
            const result = await reservationService.updateStatusPayment(reservationId, paymentStatus);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }
    }

    async updateReservationDate(req: Request, res: Response) {
        const { reservationId, endDate, endTime } = req.body;

        try {
            const result = await reservationService.updateReservationDate(reservationId, endTime, endDate);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "something went wrong" });
        }
    }

}