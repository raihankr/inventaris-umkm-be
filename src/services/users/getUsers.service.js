import prisma from "../../utils/client.js";
import { formatPagination } from "../../utils/formatPagination.js";
import { calculateElapsedTimeHours, formatTime } from "../../utils/time.js";

/**
 * Mengambil data user dengan mengimplementasikan pagination dan fitur search
 * @param {*} page 
 * @param {*} limit 
 * @param {*} search 
 * @returns 
 */
export const getUsersServices = async (page, limit, search) => {
    try {
        const offset = (page - 1) * limit;

        const whereClause = {
            isActive: true,
            OR: [
                { username: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        };

        const totalData = await prisma.users.count({ where: whereClause });

        const usersData = await prisma.users.findMany({
            where: whereClause,
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                session: true,
            },
            omit: {
                password: true,
            },
            take: limit,
            skip: offset || undefined,
        });

        console.log("Search:", search);

        const checkUsersSession = (data) => {
            if (data?.session?.[0]?.isActive) {
                const elapsedTime = calculateElapsedTimeHours(
                    data?.session?.[0]?.updatedAt,
                );

                data.userStatus = elapsedTime >= 24 ? "offline" : "online";
                data.onlineTime =
                    elapsedTime < 24 ? formatTime(elapsedTime) : formatTime(0);
            } else {
                data.userStatus = "offline";
                data.onlineTime = formatTime(0);
            }
        };

        usersData.map((data) => {
            checkUsersSession(data);
            data.session = data.session?.[0]?.id_session;
        });

        const result = formatPagination(usersData, totalData, limit, page);

        return result;
    } catch (error) {
        throw error;
    }
};
