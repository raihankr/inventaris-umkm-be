import prisma from "../../utils/client.js";
import { formatPagination } from "../../utils/formatPagination.js";

export const listTransactionsService = async (
    page,
    limit,
    product,
    user,
    type,
) => {
    try {
        const offset = (page - 1) * limit;

        const whereClause = {
            id_user: user,
            type,
            items: {
                some: {
                    id_product: product || undefined,
                },
            },
        };

        const totalTransactionsData = await prisma.transactions.count({
            where: whereClause,
        });

        const transactionsData = await prisma.transactions.findMany({
            where: whereClause,
            orderBy: {
                updatedAt: "desc",
            },
            skip: offset,
            take: limit,
        });

        const paginatedResult = formatPagination(
            transactionsData,
            totalTransactionsData,
            limit,
            page,
        );

        return paginatedResult;
    } catch (error) {
        throw error;
    }
};
