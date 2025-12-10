import prisma from "../../utils/client.js"
import { formatPagination } from "../../utils/formatPagination.js"

export const getLowStockProductsService = async (page, limit) => {
    try {
        const offset = (page - 1) * limit

        /* query dibawah ini mengelompokkan data stock berdasarkan data product 
           kemudian mengkalkulasi dan memfilter stock yang berada dibawah minimum
           masing masing product.

           note: count over pada query tertinggi berguna untuk mendapatkan jumlah data yg terfilter
                 dan menyimpannya disetiap data. Maka dari itu dihapus menggunakan method map agar setiap data
                 tidak memiliki column baru tersebut.
        */
        const lowStockProducts = await prisma.$queryRaw`
        SELECT *, COALESCE(CAST(COUNT(*) OVER() AS INT), 0) AS total_low_stock FROM (
            SELECT p.id_product, 
                p.name, 
                p.description,  
                p.minimum, 
                COALESCE(CAST(SUM(s.amount) AS INT), 0) AS stock
            FROM stocks AS s
            RIGHT JOIN products AS p ON p.id_product = s.id_product 
            WHERE p."isActive" = true
            GROUP BY p.id_product
            ORDER BY stock ASC
            ) 
        WHERE stock <= minimum
        LIMIT ${limit} OFFSET ${offset}`

        const totalData = lowStockProducts?.[0]?.total_low_stock || 0

        lowStockProducts.map((data) => {
            delete data.total_low_stock
        })

        const paginatedResponse = formatPagination(lowStockProducts, totalData, limit, page)
        return paginatedResponse
    } catch (error) {
        throw error
    }
}