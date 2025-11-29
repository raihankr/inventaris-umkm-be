import { getRecentTransactionService } from "../../services/dashboard/getRecentTransaction.service.js"

export const getRecentTransaction = async (req, res, next) => {
    try {
        const result = await getRecentTransactionService()

        res.status(200).json({
            success: true,
            message: 'Recent transaction data retrived successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
} 