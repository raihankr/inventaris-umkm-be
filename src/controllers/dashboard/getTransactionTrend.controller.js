import { getTransactionTrendService } from "../../services/dashboard/getTransactionTrend.service.js"

export const getTransactionTrend = async (req, res, next) => {
    try {
        const period = req.query.period

        const result = await getTransactionTrendService(period)

        res.status(200).json({
            success: true,
            message: `Transaction trend for ${period.replace('_', ' ')} periods retrived successfully.`,
            data: result    
        })
    } catch (error) {
        next(error)
    }
}