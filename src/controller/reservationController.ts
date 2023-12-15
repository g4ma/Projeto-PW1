import { ReservationService } from "../service/reservationService";
import { Request, Response } from "express"

const reservationService = new ReservationService();

export class ReservationController {

    async create(req: Request, res: Response) {

        const userId = req.params.userId;
        const { parkingSpaceId, startDate, endDate, startTime, endTime } = req.body;

        try {
            const result = await reservationService.create({
                userId,
                parkingSpaceId,
                startDate,
                endDate,
                startTime,
                endTime
            });
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json(error.issues ?? { error: error.message});
        }

    }

    async listOwner(req: Request, res: Response) {
        const userId = req.params.userId;

        try {
            const result = await reservationService.listOwner({ userId });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    }

    async listAll(req: Request, res: Response) {
        const userId = req.params.userId;

        try {
            const result = await reservationService.listAll({ userId });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        const { reservationId } = req.params;
        const userId = req.params.userId;

        try {
            const result = await reservationService.delete({
                userId,
                reservationId
            });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    }

    async updatePaymentStatus(req: Request, res: Response) {
        const { newStatus } = req.body;
        const { reservationId } = req.params;
        const userId = req.params.userId;
        
        try {
            const result = await reservationService.updateStatusPayment({
                userId,
                reservationId,
                newStatus
            });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json(error.issues ?? { error: error.message});
        }
    }

    async updateReservationDate(req: Request, res: Response) {
        const { endDate, endTime } = req.body;
        const { reservationId } = req.params;
        const userId = req.params.userId;

        try {
            const result = await reservationService.updateReservationDate({
                userId,
                reservationId,
                endDate,
                endTime
            });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json(error.issues ?? { error: error.message});
        }
    }

}