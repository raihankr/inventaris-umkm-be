import prisma from "./client.js"

export const createNewSession = async (userId, token, role, isActive) => {
    try {
        const result = await prisma.session.create({
            data: {
                id_user: userId,
                token: token,
                role: role,
                isActive: isActive
            }
        })

        return result;
    } catch (error) {
        throw error
    }
}

export const updateSession = async (sessionId, token, isActive) => {
    try {
        const result = await prisma.session.update({
            where: {
                id_session: sessionId
            },
            data: {
                token: token,
                isActive: isActive
            }
        });

        return result;
    } catch (error) {
        throw error
    }

}

export const terminateSession = async (sessionId, isActive) => {
    try {
        const result = await prisma.session.update({
            where: {
                id_session: sessionId || '-'
            },
            data: {
                isActive: isActive,
                token: '-'
            }
        });

        return result;
    } catch (error) {
        throw error
    }
}