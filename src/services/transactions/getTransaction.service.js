import prisma from "../../utils/client.js";

export const getTransactionService = async (id_transaction) => {
    try {
        const trxData = await prisma.transactions.findUnique({
            where: {
                id_transaction,
            },
            include: {
                items: {
                    
                }
            }
        });

        if (!trxData) {
            const error = new Error("Transaction not found");
            error.statusCode = 404;
            throw error;
        }

        return trxData;
    } catch (error) {
        throw error;
    }
};
