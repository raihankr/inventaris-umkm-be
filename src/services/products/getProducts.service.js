import prisma from "../../utils/client.js"
import { formatPagination } from "../../utils/formatPagination.js"

/**
 * Service dibawah ini mengambil seluruh data products yang masih aktif dengan mengimplementasikan fitur
 * pagination, search dan filter berdsarkan category
 * @param {*} page 
 * @param {*} limit 
 * @param {*} search 
 * @param {*} category 
 * @returns 
 */
export const getProductsService = async (page, limit, search, category) => {
    try {
        const offset = (page - 1) * limit
        // konfigurasi filter
        // note: jika field berisi undefined maka prisma secara otomatis mengabaikan field tersebut 
        const whereClause = {
            isActive: true,
            id_category: category || undefined,
            OR: [
                {
                    SKU: {
                        contains: search ?? undefined,
                        mode: 'insensitive'
                    }
                },
                {
                    name: {
                        contains: search ?? undefined,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        // mengkalkulasi total data untuk kebutuhan pagination
        const totalProductsData = await prisma.products.count({ where: whereClause })

        // mengambil semua data berdasarkan filter
        const productsData = await prisma.products.findMany({
            where: whereClause,
            include: {
                stocks: {
                    select: {
                        id_stock: true,
                        price: true,
                        amount: true,
                    }
                },
                categories: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            skip: offset,
            take: limit
        })
        
        // formating data product
        productsData.map((data) => {
            data.total_stock = data.stocks?.reduce((sum, value) => sum + value.amount, 0)
            data.categories = data?.categories?.name || 'uncategorized'
            data.status = data.total_stock === 0 ? 'Habis' : data.total_stock < data.minimum ? 'Stok Menipis' :  'Tersedia'
        })

        const paginatedResult = formatPagination(productsData, totalProductsData, limit, page)

        return paginatedResult
    } catch (error) {
        throw error
    }
}
