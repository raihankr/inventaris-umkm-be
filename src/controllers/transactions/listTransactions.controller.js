import { listTransactionsService } from "../../services/transactions/listTransactions.service.js";

export const listTransactions = async (req, res, next) => {
    try {
        const { page, limit, product, user, type } = req.query;

        const result = await listTransactionsService(
            parseInt(page) || 1,
            parseInt(limit) || 10,
            product,
            user,
            type,
        );

        res.status(200).json({
            success: true,
            message: "Transactions data retrieved successfully.",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
