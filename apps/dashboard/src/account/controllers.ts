import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { compare, hash } from "bcrypt"
import { AppError, Unauthorized, NotFound, Conflict } from "@repo/lib"
import {
	services,
	findUser,
	Controller,
	AuthenticationService,
	constants,
	UserRole,
	jwt,
	MailerService,
	templates,
} from "@repo/lib"

const { JWT_SECRET } = constants

export class AccountController {
	constructor(
		private auth: AuthenticationService,
		private mailer: MailerService,
	) {}

	public requestPasswordReset: Controller = async (req, res, handleError) => {
		const email = req.body.email
		const userRole = req.query.variant

		if (!this.auth.isValidRole(userRole as string)) {
			throw new AppError(400, "Rol de usuario inválido")
		}

		try {
			if (!email) throw new AppError(400, "Se requiere un correo electrónico")
			const user = await findUser({ email }, userRole as UserRole)
			if (!user) throw new NotFound("Usuario no encontrado.")

			const payload = { id: user.id, email: email }
			const rolePayload = { role: userRole }

			const tokenOpts = jwt.generateCustomOpts({
				key: user.password,
				exp: "30d",
			})

			const roleTokenOpts = jwt.generateCustomOpts({
				exp: "30d",
			})

			const token = jwt.sign(payload, tokenOpts)
			const roleToken = jwt.sign(rolePayload, roleTokenOpts)

			const resetLink = `${services.WEB_APP.url}auth/restaurar-contrasena/${user.id}/${token}/${roleToken}`

			this.mailer.send({
				to: email,
				subject: "Restablecimiento de contraseña",
				html: templates.resetPasswordRequest(user.name, resetLink),
			})

			const message = `Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.`
			return res.status(200).json({ message })
		} catch (error) {
			handleError(error)
		}
	}

	public resetPassword: Controller = async (req, res, handleError) => {
		try {
			const { password } = req.body
			const { id, token, role } = req.params

			const rolePayload = jwt.verify(role)

			if (!rolePayload.role || !this.auth.isValidRole(rolePayload.role)) {
				throw new Unauthorized()
			}

			const user = await findUser({ id }, rolePayload.role)
			if (!user) throw new NotFound("Usuario no encontrado.")

			jwt.verify(token, `${JWT_SECRET}${user.password}`)

			if (await compare(password, user.password)) {
				throw new Conflict("La nueva contraseña no puede ser igual a la anterior.")
			}

			const queryData = {
				where: { id },
				data: { password: await hash(password, 10) },
			}

			await match(rolePayload.role)
				.with("SENIOR", async () => {
					await prisma.senior.update(queryData)
				})
				.with("ADMIN", async () => {
					await prisma.administrator.update(queryData)
				})
				.with("PROFESSIONAL", async () => {
					await prisma.professional.update(queryData)
				})
				.run()

			return res.status(200).json({ message: "Contraseña actualizada correctamente" })
		} catch (error) {
			handleError(error)
		}
	}

	public compareLinkToken: Controller = async (req, res, handleError) => {
		try {
			const { id, token, role } = req.params
			const rolePayload = jwt.verify(role)

			if (!rolePayload.role || !this.auth.isValidRole(rolePayload.role)) {
				throw new Unauthorized()
			}

			const user = await findUser({ id }, rolePayload.role)
			if (!user) throw new NotFound("Usuario no encontrado.")

			jwt.verify(token, `${JWT_SECRET}${user.password}`)

			return res.status(200).json({ message: "OK" })
		} catch (error) {
			handleError(error)
		}
	}
}
