import { deleteUserService } from "../../services/users/deleteUser.service.js"


export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id

        const result = await deleteUserService(userId)

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
            data: result
        })
    } catch (error) {
        next(error)
    }
}