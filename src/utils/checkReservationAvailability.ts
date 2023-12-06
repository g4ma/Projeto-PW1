import { log } from 'console';
import { prisma } from '../database/prisma';
import { setTextRange } from 'typescript';

export class CheckReservationAvailability {

    verifyDate(startDate: string, startTime: string, endDate: string, endTime: string) {

        const StartDate = new Date(`${startDate}T${startTime}`);
        const EndDate = new Date(`${endDate}T${endTime}`);

        console.log(StartDate + "  " + EndDate);

        if (StartDate > EndDate || EndDate < StartDate) {
            return false;
        }

        return true;
    }

    async verifyAvailability(parkingSpaceId: string, startDate: string, startTime: string, endDate: string, endTime: string) {

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
}
