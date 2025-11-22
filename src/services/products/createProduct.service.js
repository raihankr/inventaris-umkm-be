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
                isActive: true
            }
        })

        const stockData = await prisma.stocks.create({
            data: {
                id_product: productData.id_product,
                amount: payload.amount,
                minimum: payload.stock_minimum,
                price: payload.price
            }
        })

        return { productData, stockData }
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