import prisma from "../../utils/client.js"
import { Prisma } from "../../../generated/prisma/index.js"

export const createProductService = async (payload) => {
    try {
        const productData = await prisma.products.create({
            data: {
                SKU: payload.SKU,
                id_category: payload.id_category,
                name: payload.name,
                description: payload.description,
                unit: payload.unit,
                minimum: payload.stock_minimum,
                isActive: true
            }
        })

        return productData
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.statusCode = 400
                error.message = "The provided SKU product is already used."
            }
        }

        throw error
    }
}