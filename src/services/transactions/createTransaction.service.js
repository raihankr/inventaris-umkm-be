import prisma from "../../utils/client.js";
import { Prisma, transaction_type } from "../../../generated/prisma/index.js";

export const createTransactionService = async (payload) => {
    let { type, items, description, id_user } = payload;

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
                [item.price]: stock.amount,
            };
        }

        let total_price = 0;

        for (let item in items) {
            // update stok

            let subtotal = item.amount * item.price;
            total_price += subtotal;

            await prisma.stocks.upsert({
                where: {
                    id_product: item.id_product,
                    price: item.price,
                },
                update: {
                    amount:
                        stocks[item.id_product]?.[item.price] +
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
        }

        // catat transaksi
        const result = await prisma.transactions.create({
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
            },
        });

        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // error handling
        }

        throw error;
    }
};
