// memformat data agar sesuai dengan standar format pagination
export const formatPagination = (data, totalData, limit, page) => {
    return {
        page: page,
        limit: limit,
        count: totalData,
        total_page: totalData < limit ? 1 : Math.ceil(totalData / limit),
        has_next_page: page < Math.ceil(totalData / limit),
        data: data
    }
}
