import prisma from "./client.js"

// membuat data sesi user baru
export const createNewSession = async (userId, token, isActive) => {
    try {
        const result = await prisma.session.create({
            data: {
                id_user: userId,
                token: token,
                isActive: isActive
            }
        })

        return result;
    } catch (error) {
        throw error
    }
}


// memperbarui data sesi user
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

// menonaktifkan sesi user
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
