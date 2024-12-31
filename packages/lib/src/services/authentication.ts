import { Unauthorized } from "../errors/custom"
import { JsonWebTokenError } from "jsonwebtoken"
import { RoleBasedMiddleware } from "../types"
import { IncomingHttpHeaders } from "node:http"

import * as jwt from "../utils/jsonwebtoken"
import * as users from "../utils/users"

type ServerTokens = {
	access: string | null
	refresh: string | null
}

type ClientAuthorization = {
	headers: IncomingHttpHeaders
	cookies: Record<string, string>
}

export class AuthenticationService {
	public authorize: RoleBasedMiddleware = (roles) => async (req, res, next) => {
		const tokens = this.getClientAuthorization({
			headers: req.headers,
			cookies: req.cookies,
		})

		try {
			if (!tokens.access) throw new Unauthorized()
			const payload = jwt.verify(tokens.access)

			if (!payload.id || !payload.role || !users.isValidRole(payload.role)) {
				throw new Unauthorized()
			}

			const user = await users.find({ role: payload.role, filter: { id: payload.id } })
			if (!user) throw new Unauthorized()

			if (roles && !roles.includes(payload.role)) throw new Unauthorized()

			req.setExtension("user", user)
			req.setExtension("role", payload.role)
			req.setExtension("userId", payload.id)

			next()
		} catch (error) {
			next(error)
		}
	}

	public getClientAuthorization = ({ headers, cookies }: ClientAuthorization): ServerTokens => {
		let ACCESS_TOKEN = cookies["ACCESS_TOKEN"]
		let REFRESH_TOKEN = cookies["REFRESH_TOKEN"]

		if ((!ACCESS_TOKEN || !REFRESH_TOKEN) && headers.authorization) {
			const [bearer, tokens] = headers.authorization.split(" ")

			if (bearer !== "Bearer") throw new JsonWebTokenError("Invalid token")
			const [access, refresh] = tokens.split(",")

			if (!access && !refresh) throw new JsonWebTokenError("Invalid token")

			ACCESS_TOKEN = access
			REFRESH_TOKEN = refresh
		}

		return { access: ACCESS_TOKEN, refresh: REFRESH_TOKEN }
	}
}
