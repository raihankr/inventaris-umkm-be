import { resetPasswordService } from "../../services/users/resetPassword.service.js"

export const resetPassword = async (req, res, next) => {
    try {
        const userId = req.params.id
        const { newPassword } = req.body

        const result = await resetPasswordService(userId, newPassword)

        res.status(200).json({
            success: true,
            message: 'User password updated successfully.'
        })
    } catch (error) {
        next(error)
    }
}