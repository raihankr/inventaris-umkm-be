import { stat } from "fs";
import prisma from "../../utils/client.js"

export const getProductStatisticsService = async () => {
    try {

        const statistics = {
            total_product: 0,
            available_product: 0,
            low_product: 0,
            out_of_stock_product: 0,
            total_aset: 0
        }

        statistics.total_product = await prisma.products.count({ where: { isActive: true } })

        const productAndStock = await prisma.$queryRaw`
        SELECT p.id_product,  p.minimum, COALESCE(SUM(s.amount)) AS stock
        FROM stocks AS s
        RIGHT JOIN products AS p ON p.id_product = s.id_product WHERE p."isActive" = true
        GROUP BY p.id_product;`

        productAndStock.map((data) => {
            data.stock = Number(data.stock) ?? 0

            if (data.stock > data.minimum) {
                statistics.available_product += 1
            } else if (data.stock > 0 && data.stock <= data.minimum) {
                statistics.low_product += 1
            } else {
                statistics.out_of_stock_product += 1
            }
        })

        const totalAset = await prisma.$queryRaw`
        SELECT SUM(total_per_stock) AS total_aset FROM (
        SELECT s.amount, s.price, (s.price * s.amount) AS total_per_stock
        FROM stocks AS s
        JOIN products AS p ON p.id_product = s.id_product 
        WHERE p."isActive" = true)`

        statistics.total_aset = Number(totalAset?.[0]?.total_aset)

        return { statistics }
    } catch (error) {
        throw error
    }
}
