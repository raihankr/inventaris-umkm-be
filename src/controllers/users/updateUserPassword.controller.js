import { updateUserPasswordServices } from "../../services/users/updateUserPassword.service.js"

export const updateUserPassword = async (req, res, next) => {
    try {
        const { new_password, validate_password } = req.body
        const userId = req.params.id

        const process = await updateUserPasswordServices(userId, new_password, validate_password)

        res.status(200).json({
            success: true,
            message: 'User password updated successfully'
        })
    } catch (error) {
        next(error)
    }
}