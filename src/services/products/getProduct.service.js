import prisma from "../../utils/client.js"

export const getProductService = async (productId) => {
    try {
        const productData = await prisma.products.findUnique({
            where: {
                id_product: productId,
                isActive: true
            },
            include: {
                categories: {
                    select: {
                        name: true
                    }
                },
                stocks: true
            },

        })

        if (!productData) {
            const error = new Error("Product not found")
            error.statusCode = 404
            throw error
        }

        productData.categories = productData.categories?.name
        return productData
    } catch (error) {
        throw error
    }
}