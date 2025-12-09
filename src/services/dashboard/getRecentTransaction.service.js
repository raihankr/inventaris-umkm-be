import prisma from "../../utils/client.js"

export const getRecentTransactionService = async () => {
    try {
        // mengambil lima (5) data transaksi sekaligus dengan item di dalam transaksi tersebut dan
        // pengguna yang mencatat transaksi.
        const transactionData = await prisma.transactions.findMany({
            orderBy: {
                createdAt: "desc"
            },
            omit: {
                id_user: true
            },
            include: {
                items: {
                    select: {
                        id_trx_item: true,
                        amount: true,
                        price: true,
                        product: {
                            select: {
                                id_product: true,
                                name: true,
                                SKU: true
                            }
                        }
                    }
                },
                users: {
                    select: {
                        id_user: true,
                        name: true
                    }
                }
            },
            take: 5
        })

        return transactionData
    } catch (error) {
        throw error
    }
}