import { prisma } from '../database/prisma';
import { ReservationPaymentStatus } from '../model/reservationPaymentStatus';
import { CheckReservationAvailability } from '../utils/checkReservationAvailability';
import { ReservationError, ReservationValuesError } from '../utils/reservationError';
import { reservationCreateValidateZod, reservationUpdateDateValidateZod, reservationUpdateStatusValidateZod } from '../utils/reservationValidateZod';


type ParamsCreate = {
    userId: string;
    parkingSpaceId: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
}
type ParamsUser = {
    userId: string;
}
type ParamsDelete = {
    userId: string;
    reservationId?: string;
}
type ParamsUpdateStatus = {
    userId: string;
    reservationId?: string;
    newStatus?: ReservationPaymentStatus;
}
type ParamsUpdateDate = {
    userId: string;
    reservationId?: string;
    endDate?: string;
    endTime?: string;
}


export class ReservationService {
    async create({ userId, parkingSpaceId, startDate, endDate, startTime, endTime }: ParamsCreate) {

        try {

            const result = reservationCreateValidateZod({ userId, parkingSpaceId, startDate, endDate, startTime, endTime });
            if (!result.success) {
                throw new ReservationValuesError(result.error.issues);
            }

            const checkReservationAvailability = new CheckReservationAvailability();

            const isDateValid = checkReservationAvailability.verifyDate({ startDate, startTime, endDate, endTime });
            if (!isDateValid) {
                throw new ReservationError("date is invalid");
            }

            const isAvaiable = await checkReservationAvailability.verifyAvailability({ parkingSpaceId, startDate, startTime, endDate, endTime });
            if (!isAvaiable) {
                throw new ReservationError("parking space already ocupied");
            }

            const newReservation = await prisma.reservation.create({
                data: {
                    userId,
                    parkingSpaceId,
                    startTime,
                    endTime,
                    startDate,
                    endDate
                }
            });

            return newReservation;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async listOwner({ userId }: ParamsUser) {

        try {

            const owner = await prisma.owner.findUnique({
                where: {
                    userId
                }
            });
            if (!owner) {
                throw new ReservationError("user is not an owner");
            }

            const reservations = await prisma.reservation.findMany({
                where: {
                    parkingSpace: {
                        ownerId: userId
                    }
                }
            });
            if (reservations.length === 0) {
                return { message: "does not have any reservations" };
            }

            return reservations;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async listAll({ userId }: ParamsUser) {

        try {

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new ReservationError("user does not exists");
            }

            const reservations = await prisma.reservation.findMany({
                where: {
                    userId
                }
            });
            if (reservations.length === 0) {
                return { message: "user does not have any reservations" }
            }

            return reservations;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async delete({ userId, reservationId }: ParamsDelete) {

        try {

            const reservation = await prisma.reservation.findUnique({
                where: {
                    id: reservationId
                }
            });

            if (!reservation) {
                throw new ReservationError("reservation does not exist");
            }

            if (reservation.userId != userId) {
                throw new ReservationError("user can not delete this reservation");
            }

            const deletedReservation = await prisma.reservation.delete({
                where: {
                    id: reservationId
                }
            })

            return deletedReservation;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async updateStatusPayment({ userId, reservationId, newStatus }: ParamsUpdateStatus) {

        try {

            const result = reservationUpdateStatusValidateZod({ newStatus });
            if (!result.success) {
                throw new ReservationValuesError(result.error.issues);
            }

            const reservation = await prisma.reservation.findUnique({
                where: {
                    id: reservationId
                }
            })
            if (!reservation) {
                throw new ReservationError("reservation does not exist");
            }

            const parkingSpace = await prisma.parkingSpace.findUnique({
                where: {
                    id: reservation.parkingSpaceId
                }
            })
            if (parkingSpace?.ownerId != userId) {
                throw new ReservationError("user can not update this reservation");
            }

            const updatedStatusPayment = await prisma.reservation.update({
                where: {
                    id: reservationId
                },
                data: {
                    paymentStatus: newStatus as ReservationPaymentStatus
                }
            });

            return updatedStatusPayment;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }
    async updateReservationDate({ userId, reservationId, endDate, endTime }: ParamsUpdateDate) {

        try {

            const result = reservationUpdateDateValidateZod({ endDate, endTime });
            if (!result.success) {
                throw new ReservationValuesError(result.error.issues);
            }

            const reservation = await prisma.reservation.findUnique({
                where: {
                    id: reservationId
                }
            });
            if (!reservation) {
                throw new ReservationError("reservation does not exist");
            }
            if (reservation.userId != userId) {
                throw new ReservationError("user can not update this reservation");
            }


            const checkReservationAvailability = new CheckReservationAvailability();

            const isUpdateValid = await checkReservationAvailability.checkUpdateAvailability({ reservationId, endDate, endTime });
            if (!isUpdateValid) {
                throw new ReservationError("new end date has conflict with other reservation")
            }

            const isUpdateDateValid = await checkReservationAvailability.checkUpdateDateStatus({ reservationId, endDate, endTime });
            if (!isUpdateDateValid) {
                throw new ReservationError("invalid end time");
            }


            const isUpdateDateNotTheSame = await checkReservationAvailability.checkUpdateDateIsNotTheSame({ reservationId, endDate, endTime });
            if (!isUpdateDateNotTheSame) {
                throw new ReservationError("new end date is the same");
            }

            const updatedReservation = prisma.reservation.update({
                where: {
                    id: reservationId
                },
                data: {
                    endTime,
                    endDate,
                    paymentStatus: ReservationPaymentStatus.Pendente
                }
            });

            return updatedReservation;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }
}