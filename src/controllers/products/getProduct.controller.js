import { getProductService } from "../../services/products/getProduct.service.js"

export const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.id

        const result = await getProductService(productId)

        res.status(200).json({
            success: true,
            message: "Product data retrieved successfully.",
            data: result
        })
    } catch (error) {
        next(error)
    }
}