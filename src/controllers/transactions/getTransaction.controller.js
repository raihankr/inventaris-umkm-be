import { getTransactionService } from "../../services/transactions/getTransaction.service.js";

export const getTransaction = async (req, res, next) => {
    try {
        const id_transaction = req.params.id;

        const result = await getTransactionService(id_transaction);

        res.status(200).json({
            success: true,
            message: "Transaction data retrieved succesfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
