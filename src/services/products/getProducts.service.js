import prisma from "../../utils/client.js"
import { formatPagination } from "../../utils/formatPagination.js"

export const getProductsService = async (page, limit, search, category) => {
    try {
        const offset = (page - 1) * limit
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

        const totalProductsData = await prisma.products.count({ where: whereClause })
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
                updatedAtAt: 'desc'
            },
            skip: offset,
            take: limit
        })
        
        productsData.map((data) => {
            data.total_stock = data.stocks?.reduce((sum, value) => sum + value.amount, 0)
            data.categories = data?.categories.name
            data.status = data.total_stock === 0 ? 'Habis' : data.total_stock < data.minimum ? 'Stok Menipis' :  'Tersedia'
        })

        const paginatedResult = formatPagination(productsData, totalProductsData, limit, page)

        return paginatedResult
    } catch (error) {
        throw error
    }
}