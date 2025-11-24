import prisma from "../../utils/client.js"
import { Prisma } from "../../../generated/prisma/index.js"

export const updateCategoryService = async (payload, categoryId) => {
    try {
        const categoryData = await prisma.categories.update({
            where: {
                id_category: categoryId,
                isActive: true
            },
            data: payload
        })

        return categoryData
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.message = 'Category not found.'
                error.statusCode = 404
            }
        }

        throw error
    }
}