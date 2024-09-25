import { parse, differenceInMinutes } from 'date-fns';

type ParamsPrice = {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    parkingSpacePrice: number;
}

export function calculateReservationPrice({ startDate, startTime, endDate, endTime, parkingSpacePrice }: ParamsPrice) {

    const startDateTime = parse(`${startDate} ${startTime}`, 'dd/MM/yyyy HH:mm', new Date());
    const endDateTime = parse(`${endDate} ${endTime}`, 'dd/MM/yyyy HH:mm', new Date());

    const totalMinutes = differenceInMinutes(endDateTime, startDateTime);
    const hours = totalMinutes / 60;

    return (hours * parkingSpacePrice);

}