import { createTransactionService } from "../../services/transactions/createTransaction.service.js";
import jwt from "jsonwebtoken";

export const createTransaction = async (req, res, next) => {
    try {
        const payload = req.body;
        const token = req.cookies['authorization']?.split(' ')?.[0];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const result = await createTransactionService({
            ...payload,
            id_user: decodedToken.id_user,
        });

        res.status(200).json({
            success: true,
            message: 'Transaction created successfully.',
            data: result,
        })
    } catch (error) {
        next(error);
    }
}
