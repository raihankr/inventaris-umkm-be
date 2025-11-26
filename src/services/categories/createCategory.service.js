import prisma from "../../utils/client.js"
import { Prisma } from "../../../generated/prisma/index.js"

export const createCategoryService = async (name, description) => {
    try {
        const categoryData = await prisma.categories.create({
            data: {
                name: name,
                description: description,
                isActive: true
            }
        })

        return categoryData
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.statusCode = 400
                error.message = "The provided category name is already used."
            } 
        }
        throw error
    }
}