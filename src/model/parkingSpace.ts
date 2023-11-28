import { ParkingSpaceType } from "@prisma/client"

export interface ParkingSpace{
  id:            string 
  picture:       string 
  location:      string 
  pricePerHour:  number
  disponibility: boolean 
  description:   string 
  type:          ParkingSpaceType
  ownerId:       string 
}