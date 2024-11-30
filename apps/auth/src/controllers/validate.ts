import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, RefreshTokenOpts } from "@repo/lib"
import { AppError, JsonResponse, signJsonwebtoken, verifyJsonwebtoken, getServerTokens } from "@repo/lib"

/// Controlador para validar una sesion

export const validateSession = (req: Request, res: Response, next: NextFunction) => {
	const user = req.getExtension("user")
	const role = req.getExtension("role")

	const response: JsonResponse<any> = {
		type: "success",
		values: { user, role },
		message: "Usuario autenticado",
	}

	return res.status(200).json(response)
}

/// Controlador para refrescar el token de acceso

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Obtenemos los tokens del servidor
		// Si no hay un token de refresco, lanzamos un error

		const tokens = getServerTokens(req.headers, req.cookies)
		if (!tokens?.refresh) throw new AppError(401, "No autorizado")

		const payload = verifyJsonwebtoken(tokens.refresh, RefreshTokenOpts)
		const newAccessToken = signJsonwebtoken({ id: payload.id, role: payload.role }, AccessTokenOpts)

		const expireDate = new Date()
		expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)

		// De lo contrario se verifica el token de refresco
		// De ser valido, se genera un nuevo token de acceso que se envia en una cookie
		res.cookie("ACCESS_TOKEN", newAccessToken, {
			expires: expireDate,
			httpOnly: true,
			path: "/",
		})

		res.set({
			"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
			Pragma: "no-cache",
			Expires: "0",
		})

		const authHeader = req.headers["authorization"]
		if (authHeader && authHeader.startsWith("Bearer ")) {
			return res.status(200).json({
				message: "Token de acceso actualizado",
				type: "success",
				values: {
					role: payload.role,
					newAccessToken: newAccessToken,
				},
			})
		}

		return res.status(200).json({
			message: "Token de acceso actualizado",
			type: "success",
			values: { role: payload.role },
		})
	} catch (error) {
		next(error)
	}
}
