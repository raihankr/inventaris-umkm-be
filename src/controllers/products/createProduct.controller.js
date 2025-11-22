import { createProductService } from "../../services/products/createProduct.service.js"

export const createProduct = async (req, res, next) => {
    try {
        const payload = {...req.body}

        console.log(payload)
        
        const result = await createProductService(payload)

        const productData = {
            ...result.productData,
            stocks : result.stocks
        }

        res.status(200).json({
            success: true,
            message: 'Product created successfully.',
            data: productData
        })
    } catch (error) {
        next(error)
    }
}