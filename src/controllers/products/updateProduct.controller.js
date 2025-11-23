import { updateProductService } from "../../services/products/updateProduct.service.js"

export const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id
        const payload = {...req.body}

        const result = await updateProductService(productId, payload)

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}