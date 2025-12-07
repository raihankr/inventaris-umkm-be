import prisma from "../../utils/client.js"
import { createNewSession } from "../../utils/sessionManagement.js";
import { Prisma } from "../../../generated/prisma/index.js";

export const createUserService = async (payload) => {
    try {
        const result = await prisma.users.create({
            data: {
                ...payload,
                isActive: true,
            }
        })

        const createSession = await createNewSession(result.id_user, '-', false)

        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.statusCode = 400
                error.message = `${error.meta.target} sudah digunakan`
                error.cause = error.meta.target
            }
        }

        throw error
    }
}
