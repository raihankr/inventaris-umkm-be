import prisma from "../../utils/client.js"
import { Prisma } from "../../../generated/prisma/index.js"

export const updateProductService = async (productId, payload) => {
    try {
        const productData = await prisma.products.update({
            where: {
                id_product: productId
            },
            data: {
                SKU: payload.SKU,
                name: payload.name,
                description: payload.description,
                unit: payload.unit,
                id_category: payload.id_category,
                minimum: payload.stock_minimum,
                image: payload.image
            }
        })

        return productData;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.message = 'Product not found.'
                error.statusCode = 404
            } else if (error.code === 'P2002') {
                error.message = 'The provided SKU is already used.'
                error.statusCode = 400
            }
        };
        throw error;
    }
}