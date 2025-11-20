import { getUserService } from "../../services/users/getUser.service.js"

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id

        const result = await getUserService(userId)

        res.status(200).json({
            success: true,
            message: "User data retrived successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}