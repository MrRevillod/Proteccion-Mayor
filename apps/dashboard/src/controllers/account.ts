import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import sendMail from "../utils/mailer"
import { AppError, CustomTokenOpts, signJsonwebtoken, services, findUser, verifyJsonwebtoken, AccessTokenOpts, isValidUserRole } from "@repo/lib"
import { match } from "ts-pattern"
import { resetPasswordBody } from "../utils/emailTemplates"

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
	const userRole = req.query.variant

	if (userRole !== "ADMIN" && userRole !== "PROFESSIONAL" && userRole !== "SENIOR") {
		throw new AppError(400, "Rol de usuario no válido")
	}

	try {
		const { email } = req.body

		if (!email) {
			throw new AppError(400, "Se requiere un correo electrónico")
		}

		const user = await findUser({ email }, userRole)

		if (!user) throw new AppError(404, "El usuario no existe.")

		const payload = { id: user.id, email: email }
		const tokenOpt = CustomTokenOpts(user.password, "30d")
		const token = signJsonwebtoken(payload, tokenOpt)

		const rolePayload = { role: userRole }
		const roleToken = signJsonwebtoken(rolePayload, CustomTokenOpts("", "30d"))

		const resetLink = `${services.WEB_APP.url}auth/reset-password/${user.id}/${token}/${roleToken}`

		const htmlTemplate = resetPasswordBody(user.name, resetLink)

		await sendMail(email, "Restablecimiento de contraseña", htmlTemplate)

		return res.status(200).json({
			message: "Correo de restauración enviado correctamente",
			type: "success",
		})
	} catch (error) {
		next(error)
	}
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, token, role } = req.params
		const { password } = req.body

		const rolePayload = verifyJsonwebtoken(role, AccessTokenOpts)
		if (!rolePayload.role || !isValidUserRole(rolePayload.role)) throw new AppError(401, "No autorizado.")

		const user = await findUser({ id }, rolePayload.role)

		if (!user) throw new AppError(404, "Usuario no econtrado.")

		verifyJsonwebtoken(token, CustomTokenOpts(user?.password || "", "30d"))

		const hashedPassword = await hash(password, 10)

		let updatedUser
		const updated = await match(rolePayload.role)
			.with("SENIOR", async () => {
				updatedUser = await prisma.senior.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.with("ADMIN", async () => {
				updatedUser = await prisma.administrator.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.with("PROFESSIONAL", async () => {
				updatedUser = await prisma.professional.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.run()

		if (!updatedUser) {
			return res.status(500).json({
				message: "Error actualizando la contraseña",
				type: "error",
			})
		}

		return res.status(200).json({
			message: "Contraseña actualizada correctamente",
			type: "success",
		})
	} catch (error) {
		next(error)
	}
}
