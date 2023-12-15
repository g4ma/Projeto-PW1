import { prisma } from '../database/prisma';
import { ReservationPaymentStatus } from '../model/reservationPaymentStatus';

type ParamsDate = {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
}

type ParamsUpdate = {
    reservationId?: string;
    endDate?: string;
    endTime?: string;
}

type ParamsAvailability = {
    parkingSpaceId?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
}

export class CheckReservationAvailability {

    async verifyAvailability({ parkingSpaceId, startDate, startTime, endDate, endTime }: ParamsAvailability) {

        const reservations = await prisma.reservation.findMany({
            where: {
                parkingSpaceId
            }
        });

        if (!reservations) {
            return true;
        }

        const newStartDate = new Date(`${startDate}T${startTime}`);
        const newEndDate = new Date(`${endDate}T${endTime}`);


        for (const reservation of reservations) {

            const existentStartDate = new Date(`${reservation.startDate}T${reservation.startTime}`);
            const existentEndDate = new Date(`${reservation.endDate}T${reservation.endTime}`);

            if (
                (newStartDate >= existentStartDate && newStartDate < existentEndDate) ||
                (newEndDate > existentStartDate && newEndDate <= existentEndDate) ||
                (newStartDate <= existentStartDate && newEndDate >= existentEndDate)
            ) {
                return false;
            }
        }
        return true;
    }

    verifyDate({ startDate, startTime, endDate, endTime }: ParamsDate) {

        const StartDate = new Date(`${startDate}T${startTime}`);
        const EndDate = new Date(`${endDate}T${endTime}`);

        if (StartDate > EndDate) {
            return false;
        }

        return true;
    }

    async checkUpdateAvailability({ reservationId, endDate, endTime }: ParamsUpdate) {

        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        const reservations = await prisma.reservation.findMany({
            where: {
                parkingSpaceId: reservation?.parkingSpaceId
            }
        });

        const newEndDate = new Date(`${endDate}T${endTime}`);

        for (const othersReservations of reservations) {

            if (othersReservations.id != reservation?.id) {
                const existentStartDate = new Date(`${othersReservations.startDate}T${othersReservations.startTime}`);
                const existentEndDate = new Date(`${othersReservations.endDate}T${othersReservations.endTime}`);

                if ((newEndDate > existentStartDate && newEndDate <= existentEndDate)) {
                    return false;
                }
            }
        }
        return true;
    }

    async checkUpdateDateStatus({ reservationId, endDate, endTime }: ParamsUpdate) {

        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        const newEndDate = new Date(`${endDate}T${endTime}`);
        const oldEndDate = new Date(`${reservation?.endDate}T${reservation?.endTime}`);

        if (newEndDate < oldEndDate) {
            if (reservation?.paymentStatus != ReservationPaymentStatus.Pendente)
                return false;
        }

        const oldStartDate = new Date(`${reservation?.startDate}T${reservation?.startTime}`);

        if (oldStartDate > newEndDate) {
            return false;
        }

        return true;

    }

    async checkUpdateDateIsNotTheSame({reservationId, endDate, endTime}:ParamsUpdate){

        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        const newEndDate = new Date(`${endDate}T${endTime}`);
        const oldEndDate = new Date(`${reservation?.endDate}T${reservation?.endTime}`);

        if (newEndDate.getTime() === oldEndDate.getTime()) {
            return false;
        }

        return true;

    }
}
