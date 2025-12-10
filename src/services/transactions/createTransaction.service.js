import prisma from "../../utils/client.js";
import { Prisma, transaction_type } from "../../../generated/prisma/index.js";

export const createTransactionService = async (payload, seed = false) => {
    let { type, items, description, id_user, date } = payload;

    // sanitasi input items untuk menghindari properti yang tidak diharapkan
    items = items.map((item) => ({
        amount: item.amount,
        id_product: item.id_product,
        price: item.price,
    }));

    try {
        const stocks = {};

        for (let item of items) {
            const stock = await prisma.stocks.findFirst({
                where: {
                    id_product: item.id_product,
                    price: item.price,
                },
                select: {
                    id_stock: true,
                    amount: true,
                },
            });

            // Cek semua item dapat dijual
            if (type == transaction_type.sell) {
                if (!stock)
                    throw new Error(
                        `No stock found for product: ${item.id_product} with price: ${item.price}. Cannot sell`,
                    );

                if (item.amount > stock.amount)
                    throw new Error(
                        `Cannot sell more than owned for product ${item.id_product}`,
                    );
            } else if (!stock) continue;

            stocks[item.id_product] = {
                [item.price]: {
                    amount: stock.amount,
                    id_stock: stock.id_stock,
                },
            };
        }

        let total_price = 0;

        const createStocks = [];
        for (let item of items) {
            // update stok

            let subtotal = item.amount * item.price;
            total_price += subtotal;
            const stockData = stocks[item.id_product]?.[item.price];

            const createStock = prisma.stocks.upsert({
                where: {
                    product_price: {
                        id_product: item.id_product,
                        price: item.price,
                    },
                },
                update: {
                    amount:
                        (stockData?.amount || 0) +
                        (type == transaction_type.buy
                            ? item.amount
                            : -item.amount),
                },
                create: {
                    id_product: item.id_product,
                    price: item.price,
                    amount: item.amount,
                },
            });

            createStocks.push(createStock);
        }

        // catat transaksi
        const createTransaction = prisma.transactions.create({
            data: {
                type,
                description,
                id_user,
                items: {
                    createMany: {
                        data: items,
                    },
                },
                total_price,
                createdAt: seed ? date : null,
            },
        });

        const result = await prisma.$transaction([
            ...createStocks,
            createTransaction,
        ]);

        const transactionResult = result.slice(-1);

        return transactionResult;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // error handling
        }

        throw error;
    }
};
