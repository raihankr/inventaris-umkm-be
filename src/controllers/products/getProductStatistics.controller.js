import { getProductStatisticsService } from "../../services/products/getProductStatistics.service.js"

export const getProductStatistics = async (req, res, next) => {
    try {
        const result = await getProductStatisticsService()

        res.status(200).json({
            success: true,
            message: 'Product statistics data retrieved successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}