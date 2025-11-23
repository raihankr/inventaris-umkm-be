import { getProductsService } from "../../services/products/getProducts.service.js"

export const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const category = req.query.category || ''
        const search = req.query.search || ''

        const result = await getProductsService(page, limit, search, category)

        res.status(200).json({
            success: true,
            message: 'Products data retrieved successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}