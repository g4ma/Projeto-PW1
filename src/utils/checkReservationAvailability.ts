import { prisma } from '../database/prisma';

export async function CheckReservationAvailability(parkingSpaceId: string, startDate: string, startTime: string, endDate: string, endTime: string) {

    const conflictingReservations = await prisma.reservation.findMany({
        where: {
            parkingSpaceId,
            OR: [
                {
                    AND: [
                        { startDate: { lte: endDate } },
                        { endDate: { gte: startDate } },
                        { startTime: { lte: endTime } },
                        { endTime: { gte: startTime } },
                    ],
                },
            ],
        },
    });

    return conflictingReservations.length === 0;
} 