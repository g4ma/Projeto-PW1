import { prisma } from '../database/prisma';

export async function CheckReservationAvailability(parkingSpaceId: string, startDate: string, startTime: string, endDate: string, endTime: string) {

    const reservations = await prisma.reservation.findMany({
        where: {
            parkingSpaceId
        }
    });

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
