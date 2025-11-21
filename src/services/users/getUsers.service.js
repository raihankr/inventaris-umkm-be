import prisma from "../../utils/client.js"
import { formatPagination } from "../../utils/formatPagination.js"
import { calculateElapsedTimeHours, formatTime } from "../../utils/time.js"

export const getUsersServices = async (page, limit) => {
    try {
        const offset = (page - 1) * limit

        const totalData = await prisma.users.count({ where: { isActive: true }})

        const usersData = await prisma.users.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                session: true
            },
            omit: {
                email: true,
                password: true
            },
            take: limit,
            skip: offset || undefined
        })

        const checkUsersSession = (data) => {
            if (data?.session?.[0]?.isActive) {
                const elapsedTime = calculateElapsedTimeHours(data?.session?.[0]?.updatedAt)

                data.userStatus = elapsedTime >= 24 ? 'offline' : 'online';
                data.onlineTime = elapsedTime < 24 ? formatTime(elapsedTime) : formatTime(0);
            } else {
                data.userStatus = 'offline';
                data.onlineTime = formatTime(0);
            }
        }

        usersData.map((data) => {
            checkUsersSession(data)
            data.session =  data.session?.[0]?.id_session
        })

        const result = formatPagination(usersData, totalData, limit, page);

        return result;
    } catch (error) {
        throw error
    }
}