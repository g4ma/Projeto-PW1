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

const isDateFormat = (value: string) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value);
const isTimeFormat = (value: string): boolean => /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(value);

export function reservationCreateValidateZod(reservation: ReservationParamsValidate) {
    const schemaZod = z.object({
        parkingSpaceId: z.string({ required_error: "parking space id is required" }),
        startDate: z.string({ required_error: "start date is required" }).refine(isDateFormat, { message: "the date must be in dd/mm/yyyy format" }),
        endDate: z.string({ required_error: "end date is required" }).refine(isDateFormat, { message: "the date must be in dd/mm/yyyy format" }),
        startTime: z.string({ required_error: "start time is required" }).refine((value: string) => isTimeFormat, { message: "the time must be in HH:mm format" }),
        endTime: z.string({ required_error: "end time is required" }).refine((value: string) => isTimeFormat, { message: "the time must be in HH:mm format" })
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
        endDate: z.string({ required_error: "end date is required" }).refine(isDateFormat, { message: "the date must be in dd/mm/yyyy format" }),
        endTime: z.string({ required_error: "end time is required" }).refine((value: string) => isTimeFormat, { message: "the time must be in HH:mm format" })
    })

    const result = schemaZod.safeParse(reservationDate);
    return result;
}