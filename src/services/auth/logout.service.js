import { terminateSession } from "../../utils/sessionManagement.js"

export const logoutServices = async (sessionId) => {
    try {
        const result = await terminateSession(sessionId, false)

        return result
    } catch (error) {
        throw error
    }
}