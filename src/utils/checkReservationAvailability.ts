import { prisma } from '../database/prisma';
import { parse, isWithinInterval, isBefore, isAfter } from 'date-fns';
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
                parkingSpaceId,
                paymentStatus: {
                    not: ReservationPaymentStatus.Cancelado
                }
            }
        });

        if (!reservations) {
            return true;
        }

        const newStartDate = parse(`${startDate} ${startTime}`, 'dd/MM/yyyy HH:mm', new Date());
        const newEndDate = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());


        for (const reservation of reservations) {

            const existentStartDate = parse(`${reservation.startDate} ${reservation.startTime}`, 'dd/MM/yyyy HH:mm', new Date());
            const existentEndDate = parse(`${reservation.endDate} ${reservation.endTime}`, 'dd/MM/yyyy HH:mm', new Date());

            if (isWithinInterval(newStartDate, { start: existentStartDate, end: existentEndDate })) {
                return (`Data inicial coincide com uma reserva existente (${reservation.startDate} ${reservation.startTime} - ${reservation.endDate} ${reservation.endTime}).`);
            }
            if (isWithinInterval(newEndDate, { start: existentStartDate, end: existentEndDate })) {
                return (`Data final coincide com uma reserva existente (${reservation.startDate} ${reservation.startTime} - ${reservation.endDate} ${reservation.endTime}).`);
            }
            if (isBefore(newStartDate, existentStartDate) && isAfter(newEndDate, existentEndDate)) {
                return (`O período da nova reserva coincide completamente com a reserva existente (${reservation.startDate} ${reservation.startTime} - ${reservation.endDate} ${reservation.endTime}).`);
            }

        }
        return true;
    }

    verifyDate({ startDate, startTime, endDate, endTime }: ParamsDate) {

        const StartDate = parse(`${startDate} ${startTime}`, 'dd/MM/yyyy HH:mm', new Date());
        const EndDate = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());

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

        const newEndDate = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());

        for (const othersReservations of reservations) {

            if (othersReservations.id != reservation?.id) {

                const existentStartDate = parse(`${othersReservations.startDate} ${othersReservations.startTime}`, 'dd/MM/yyyy HH:mm', new Date());
                const existentEndDate = parse(`${othersReservations.endDate} ${othersReservations.endTime}`, 'dd/MM/yyyy HH:mm', new Date());

                if (isWithinInterval(newEndDate, { start: existentStartDate, end: existentEndDate })) {
                    return `Data final coincide com uma reserva existente (${othersReservations.startDate} ${othersReservations.startTime} - ${othersReservations.endDate} ${othersReservations.endTime}).`;
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

        const newEndDate = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());
        const oldEndDate = parse(`${reservation?.endDate} ${reservation?.endTime}`, 'dd/MM/yyyy HH:mm', new Date());

        if (newEndDate < oldEndDate) {
            if (reservation?.paymentStatus != ReservationPaymentStatus.Pendente)
                return false;
        }

        const oldStartDate = parse(`${reservation?.startDate} ${reservation?.startTime}`, 'dd/MM/yyyy HH:mm', new Date());


        if (oldStartDate > newEndDate) {
            return false;
        }

        return true;

    }

    async checkUpdateDateIsNotTheSame({ reservationId, endDate, endTime }: ParamsUpdate) {

        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId
            }
        });

        const newEndDate = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());
        const oldEndDate = parse(`${reservation?.endDate} ${reservation?.endTime}`, 'dd/MM/yyyy HH:mm', new Date());

        if (newEndDate.getTime() === oldEndDate.getTime()) {
            return false;
        }

        return true;

    }
}
