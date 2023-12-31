import { z } from "zod"
import { ReservationPaymentStatus } from "../model/reservationPaymentStatus";

interface ReservationParamsValidate {
    userId?: string
    parkingSpaceId?: string
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
}

interface ReservationStatusValidate {
    newStatus?: ReservationPaymentStatus
}

interface ReservationDateValidate {
    endDate?: string
    endTime?: string
}

const isDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTimeFormat = (value: string): boolean => /^\d{2}:\d{2}$/.test(value);

const isValidTime = (value: string): boolean => {
    if (!isTimeFormat(value)) {
        return false;
    }
    const [hours, minutes] = value.split(':');
    const parsedHours = parseInt(hours, 10);
    const parsedMinutes = parseInt(minutes, 10);
    return parsedHours >= 0 && parsedHours <= 23 && parsedMinutes >= 0 && parsedMinutes <= 59;
};


export function reservationCreateValidateZod(reservation: ReservationParamsValidate) {
    const schemaZod = z.object({
        parkingSpaceId: z.string({ required_error: "parking space id is required" }),
        startDate: z.string({ required_error: "start date is required" }).refine(isDateFormat, { message: "the date must be in 0000-00-00 format" }),
        endDate: z.string({ required_error: "end date is required" }).refine(isDateFormat, { message: "the date must be in 0000-00-00 format" }),
        startTime: z.string({ required_error: "start time is required" }).refine((value: string) => isValidTime(value), { message: "the time must be in 00:00 format" }),
        endTime: z.string({ required_error: "end time is required" }).refine((value: string) => isValidTime(value), { message: "the time must be in 00:00 format" })
    })

    const result = schemaZod.safeParse(reservation);
    return result;
}

export function reservationUpdateStatusValidateZod(reservationStatus: ReservationStatusValidate) {
    const schemaZod = z.object({
        newStatus: z.nativeEnum(ReservationPaymentStatus)
    });

    const result = schemaZod.safeParse(reservationStatus);
    return result;
}

export function reservationUpdateDateValidateZod(reservationDate: ReservationDateValidate) {
    const schemaZod = z.object({
        endDate: z.string({ required_error: "end date is required" }).refine(isDateFormat, { message: "the date must be in 0000-00-00 format" }),
        endTime: z.string({ required_error: "end time is required" }).refine((value: string) => isValidTime(value), { message: "the time must be in 00:00 format" })
    })

    const result = schemaZod.safeParse(reservationDate);
    return result;
}