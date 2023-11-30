import { PrismaClient } from "@prisma/client"
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended"

// This import path should match the location of your actual PrismaClient instance
import {prisma} from "../database/prisma"

// Mock the entire module with a deep mock of PrismaClient
jest.mock("../database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}))

// Cast the mocked prisma to DeepMockProxy<PrismaClient>
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// Reset the mock before each test
beforeEach(() => {
	mockReset(prismaMock)
})
