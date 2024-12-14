import { prisma } from "@repo/database"
import { compare } from "bcrypt"
import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, AppError, RefreshTokenOpts, signJsonwebtoken, toPublicUser, findUser } from "@repo/lib"

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	const loginKind = req.query.variant

	if (loginKind !== "ADMIN" && loginKind !== "PROFESSIONAL") {
		throw new AppError(400, "Inicio de sesión inválido")
	}

	const expireDate = new Date()
	expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)

	const refreshDate = new Date()
	refreshDate.setDate(refreshDate.getDate() + 30)

	try {
		const user = await findUser({ email: req.body.email }, loginKind)

		if (!user || !(await compare(req.body.password, user.password))) {
			throw new AppError(401, "Correo electrónico o contraseña incorrectos")
		}

		const payload = { id: user.id, role: loginKind }

		const accessToken = signJsonwebtoken(payload, AccessTokenOpts)
		const refreshToken = signJsonwebtoken(payload, RefreshTokenOpts)

		res.cookie("ACCESS_TOKEN", accessToken, { expires: expireDate, httpOnly: true, path: "/" })
		res.cookie("REFRESH_TOKEN", refreshToken, { expires: refreshDate, httpOnly: true, path: "/" })

		return res.status(200).json({
			message: "Has iniciado sesión correctamente",
			type: "success",
			values: { user: toPublicUser(user), role: loginKind },
		})
	} catch (error) {
		next(error)
	}
}

export const loginSeniorMobile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await prisma.senior.findUnique({ where: { id: req.body.rut } })

		if (!user || !(await compare(req.body.password, user.password))) {
			throw new AppError(401, "El RUT o PIN son incorrectos")
		}

		if (!user.validated) {
			throw new AppError(401, "Su cuenta aun no ha sido validada")
		}
		const accessToken = signJsonwebtoken({ id: user.id, role: "SENIOR" }, AccessTokenOpts)
		const refreshToken = signJsonwebtoken({ id: user.id, role: "SENIOR" }, RefreshTokenOpts)
		const publicUser = toPublicUser(user)

		return res.status(200).json({
			message: "Inicio de sesión correcto",
			type: "success",
			values: { accessToken, refreshToken, user: publicUser, publicUser },
		})
	} catch (error: unknown) {
		next(error)
	}
}
