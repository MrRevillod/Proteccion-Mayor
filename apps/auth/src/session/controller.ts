import dayjs from "dayjs"

import { prisma } from "@repo/database"
import { compare } from "bcrypt"
import { AuthenticationService } from "@repo/lib"
import { jwt, BadRequest, Controller, users, Unauthorized } from "@repo/lib"

export class SessionController {
	constructor(private auth: AuthenticationService) {}

	public webLogin: Controller = async (req, res, handleError) => {
		const { variant } = req.query
		const { email, password } = req.body

		try {
			if (variant !== "ADMIN" && variant !== "PROFESSIONAL") {
				throw new BadRequest("Inicio de sesión inválido")
			}

			const user = await users.find({ role: variant, filter: { email } })

			if (!user || !(await compare(password, user.password))) {
				throw new Unauthorized("Correo electrónico o contraseña incorrectos")
			}

			const payload = { id: user.id, role: variant }

			const accessToken = jwt.sign(payload, jwt.accessTokenOpts)
			const refreshToken = jwt.sign(payload, jwt.refreshTokenOpts)

			const sessionExpireDate = dayjs().add(15, "minutes").toDate()
			const refreshExpireDate = dayjs().add(30, "days").toDate()

			res.cookie("ACCESS_TOKEN", accessToken, { expires: sessionExpireDate, httpOnly: true, path: "/" })
			res.cookie("REFRESH_TOKEN", refreshToken, { expires: refreshExpireDate, httpOnly: true, path: "/" })

			const { password: pwd, ...userData } = user

			return res.status(200).json({
				message: "Has iniciado sesión correctamente",
				type: "success",
				values: { user: userData, role: variant },
			})
		} catch (error) {
			handleError(error)
		}
	}

	public mobileLogin: Controller = async (req, res, handleError) => {
		try {
			const user = await prisma.senior.findUnique({ where: { id: req.body.rut } })

			if (!user || !(await compare(req.body.password, user.password))) {
				throw new Unauthorized("Creedenciales de acceso incorrectas")
			}

			if (!user.validated) {
				throw new Unauthorized("Su cuenta aun no ha sido validada")
			}

			const accessToken = jwt.sign({ id: user.id, role: "SENIOR" }, jwt.accessTokenOpts)
			const refreshToken = jwt.sign({ id: user.id, role: "SENIOR" }, jwt.refreshTokenOpts)

			const { password: pwd, ...userData } = user

			return res.status(200).json({
				message: "Inicio de sesión correcto",
				type: "success",
				values: { accessToken, refreshToken, user: userData, publicUser: userData },
			})
		} catch (error) {
			handleError(error)
		}
	}

	public refresh: Controller = async (req, res, handleError) => {
		try {
			const tokens = this.auth.getClientAuthorization({
				cookies: req.cookies,
				headers: req.headers,
			})

			if (!tokens.refresh) throw new Unauthorized()

			const payload = jwt.verify(tokens.refresh)

			if (!payload.id || !payload.role || !users.isValidRole(payload.role)) {
				throw new Unauthorized()
			}

			const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, jwt.accessTokenOpts)

			const expireDate = new Date()
			expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)

			const expires = dayjs().add(15, "minutes").toDate()

			res.cookie("ACCESS_TOKEN", newAccessToken, { expires, httpOnly: true, path: "/" })

			return res.status(200).json({ type: "success", values: { role: payload.role } })
		} catch (error) {
			handleError(error)
		}
	}

	public logout: Controller = async (req, res, handleError) => {
		res.clearCookie("ACCESS_TOKEN")
		res.clearCookie("REFRESH_TOKEN")

		return res.status(200).json({
			type: "success",
			message: "Sesión cerrada correctamente",
			status: 200,
			values: null,
		})
	}

	public validate: Controller = async (req, res, handleError) => {
		const user = req.getExtension("user")
		const role = req.getExtension("role")

		return res.status(200).json({
			type: "success",
			values: { user, role },
			message: "Usuario autenticado",
		})
	}
}
