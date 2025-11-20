import prisma from "../../utils/client.js"
import { createNewSession } from "../../utils/sessionManagement.js";
import { Prisma } from "../../../generated/prisma/index.js";

export const createUserService = async (payload) => {
    try {
        const result = await prisma.users.create({
            data: {
                email: payload.email,
                password: payload.password,
                name: payload.name,
                role: payload.role,
                address: payload.address,
                contact: payload.contact,
                isActive: true,
            }
        })

        const createSession = await createNewSession(result.id_user, '-', result.role, false)

        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.statusCode = 400
                error.message = "The provided email is already used."
            }
        }

        throw error
    }
}