import { deleteProductService } from "../../services/products/deleteProduct.service.js"

export const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id

        const result = await deleteProductService(productId)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}