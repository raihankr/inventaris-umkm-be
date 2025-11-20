import prisma from "../../utils/client.js"
import { terminateSession } from "../../utils/sessionManagement.js";

export const deleteUserService = async (userId) => {
    try {
        const result = await prisma.users.update({
            where: {
                id_user: userId
            },
            data: {
                isActive: false
            },
            include: {
                session: true
            }
        })

        const session = await terminateSession(result?.session?.[0]?.id_session, false)

        return result;
    } catch (error) {
        throw error
    }
}