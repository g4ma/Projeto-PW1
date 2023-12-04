import { prisma } from '../database/prisma';
import { CheckReservationAvailability } from '../utils/checkReservationAvailability';

export class ReservationServer {
    async create(userId: string, parkingSpaceId: string, startDate: string, endDate: string, startTime: string, endTime: string) {

        const isAvaiable = await CheckReservationAvailability(parkingSpaceId, startDate, startTime, endDate, endTime);

        if (!isAvaiable) {
            throw new Error("parking space already ocupied");
        }

        const newReservation = prisma.reservation.create({
            data: {
                userId,
                parkingSpaceId,
                startTime,
                endTime,
                startDate,
                endDate,
                paymentStatus: "pending"
            }
        });

        return newReservation;

    }
    async listOwner(id: string) {
        const owner = await prisma.owner.findUnique({
            where: {
                userId: id
            }
        });

        if (!owner) {
            throw new Error("user not owner");
        }

        const reservations = await prisma.reservation.findMany({
            where: {
                parkingSpace: {
                    ownerId: id
                }
            }
        });

        return reservations;

    }
    async listAll(id: string) {
        const reservations = await prisma.reservation.findMany({
            where: {
                userId: id
            }
        });

        return reservations;
    }
    async delete(id: string) {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id: id
            }
        });

        if (!reservation) {
            throw new Error("reservation does not exist");
        }

        const deletedReservation = await prisma.reservation.delete({
            where: {
                id: id
            }
        })

        return deletedReservation;
    }
    async updateStatsPayment(id: string, status: string) {
        try {
            const updatedStatusPayment = prisma.reservation.update({
                where: {
                    id
                },
                data: {
                    paymentStatus: status
                }
            });
            return updatedStatusPayment;
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
    async updateReservationDate(id: string, endTime: string, endDate: string) {

        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            }
        });

        if (!reservation) {
            throw new Error("reservation does not exist");
        }

        const newEndDate = new Date(`${endDate}T${endTime}`);
        const oldEndDate = new Date(`${reservation.endDate}T${reservation.endTime}`);

        if (oldEndDate.getDate() - newEndDate.getDate() < 0) {

            if (reservation.paymentStatus === "pending") {

                const updatedReservation = prisma.reservation.update({
                    where: {
                        id
                    },
                    data: {
                        endTime,
                        endDate,
                        paymentStatus: "pending"
                    }
                });

                return updatedReservation;
            }

            else {
                throw new Error("invalid end time");
            }
        }

        const updatedReservation = prisma.reservation.update({
            where: {
                id
            },
            data: {
                endTime
                endDate,
                paymentStatus: "pending"
            }
        });

        return updatedReservation;

    }
}