import { getUsersServices } from "../../services/users/getUsers.service.js"

export const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const search  = req.query.search || ""

        const result = await getUsersServices(page, limit, search)

        res.status(200).json({
            success: true,
            message: "Users data retrived successfully",
            result
        })
    } catch (error) {
        throw error
    }
}
