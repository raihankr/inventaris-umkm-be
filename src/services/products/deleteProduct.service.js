import prisma from "../../utils/client.js"
import { Prisma } from "../../../generated/prisma/index.js"

// menghapus data product menggunakan pendekatan soft delete dan juga
// menghapus data stock terkait product tersebut
export const deleteProductService = async (productId) => {
    try {
        const productData = await prisma.products.update({
            where: {
                id_product: productId,
                isActive: true
            },
            data: {
                isActive: false,
                stocks: {
                    updateMany:{
                        where: {
                            id_product: productId
                        },
                        data: {
                            isActive: false
                        }
                    }
                }
            }
        });

        return productData;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.message = 'Product not found.'
                error.statusCode = 404
            }
        };
        throw error;
    }
}