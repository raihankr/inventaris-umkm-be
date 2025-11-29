import prisma from "../../utils/client.js"

export const getTransactionTrendService = async (period) => {
    try {
        const periodMaps = {
            one_month: 1,
            three_month: 3,
            six_month: 6,
            one_year: 12,
        }

        const trendPeriod = periodMaps?.[period] || undefined
        const timeDimension = trendPeriod === 1 ? 'day' : 'month'

        if (!trendPeriod) {
            const error = new Error('The provided period do not macthed any of available periods')
            error.statusCode = 400
            throw error
        }

        const todayDate = new Date()
        const currentYear = todayDate.getFullYear()
        const currentMonth = todayDate.getMonth()

        let startDate = new Date(currentYear, trendPeriod == 12 ? 0 : currentMonth - (trendPeriod - 1), 1);
        let endDate = new Date(currentYear, trendPeriod == 12 ? 12 : currentMonth + 1, 0, 23, 59, 59, 999);

        const transactionTrendData = await prisma.$queryRaw`
        -- CTE dibawah berisikan temporary set data semua rentang tanggal berdasarkan time dimension
        WITH date_filter AS (
            SELECT GENERATE_SERIES(
            DATE_TRUNC(${timeDimension}, ${startDate}), 
            (DATE_TRUNC(${timeDimension}, ${endDate}))::date,
            ${'1' + timeDimension}::interval
            )::date AS date_period
        ),
        -- CTE dibawah ini berisikan column type dengan 2 row data yaitu sell dan buy 
        -- yang nantinya akan dilakukan cross join
        trx_type AS (
            SELECT * FROM (VALUES
            ('sell'),
            ('buy')
        ) as t(trx_type)
        ),
        -- CTE dibawah ini berisikan hasil dari cross join 2 temp tabel diatas
        -- RESULT: setiap data di CTE pertama akan diubah menjadi dua data dates
        --         yang sama namun dengan value pada kolom type yang berbeda
        dt_merge AS ( SELECT * FROM date_filter
        CROSS JOIN trx_type )

        SELECT 
            dt_merge.date_period, 
            COALESCE(SUM(CASE WHEN data.type = 'sell' THEN data.total ELSE 0 END)::int, 0) AS total_sell,
            COALESCE(SUM(CASE WHEN data.type = 'buy' THEN data.total ELSE 0 END)::int, 0) AS total_buy
            FROM (
                SELECT     
                    t.type,
                    COALESCE(CAST(SUM(t.total_price) AS INT), 0) AS total,
                    DATE_TRUNC(${timeDimension}, t."createdAt") AS date_period
                    FROM transactions as t
                    WHERE t."createdAt" <= ${endDate} AND t."createdAt" >= ${startDate}
                GROUP BY
                    type, 
                    date_period
                ORDER BY
                    date_period
                ) AS data
        RIGHT JOIN dt_merge 
        ON data.date_period = dt_merge.date_period
        AND data.type::text = dt_merge.trx_type
        GROUP BY dt_merge.date_period
        ORDER BY dt_merge.date_period`

        const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        transactionTrendData.map((data) => {
            if (timeDimension === 'day') {
                data.date_period = data.date_period.toLocaleString('id-ID', { day: "numeric", month: "long", year: "numeric"})
            } else {
                data.date_period = month[data.date_period.getMonth()]
            }
        })

        return { period: period, 
        transaction_trend_data: transactionTrendData}
    } catch (error) {
        throw error
    }
}