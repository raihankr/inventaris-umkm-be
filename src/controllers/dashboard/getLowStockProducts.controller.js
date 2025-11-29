import { getLowStockProductsService } from "../../services/dashboard/getLowStockProducts.service.js"

export const getLowStockProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 1

        const result = await getLowStockProductsService(page, limit)

        res.status(200).json({
            success: true,
            message: 'List of low stock products retrived successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}