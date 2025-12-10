import prisma from "../../utils/client.js"
import { terminateSession } from "../../utils/sessionManagement.js";
import { Prisma } from "../../../generated/prisma/index.js";


export const deleteUserService = async (userId) => {
    try {
        // menghapus data user dengan pendekatan soft delete
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.statusCode = 404
                error.message = "User not found."
            }
        }
        throw error
    }
}