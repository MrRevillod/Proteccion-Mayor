import { constants } from "../config"
import { IncomingHttpHeaders } from "http"
import { JwtPayload, sign, verify, JsonWebTokenError } from "jsonwebtoken"

const { JWT_SECRET } = constants

type JwtExpiration = `${number}${"s" | "m" | "h" | "d"}`

type TokenOptions = {
	key: string
	exp?: string
	payload?: Object
}

export const AccessTokenOpts: TokenOptions = {
	exp: "15m",
	key: JWT_SECRET,
}

export const RefreshTokenOpts: TokenOptions = {
	exp: "30d",
	key: JWT_SECRET,
}

export const CustomTokenOpts = (customKey: string, exp: JwtExpiration): TokenOptions => {
	return { key: `${JWT_SECRET}${customKey}`, exp }
}

export const signJsonwebtoken = (payload: JwtPayload | Object, opts: TokenOptions) => {
	try {
		return sign(payload, opts.key, { expiresIn: opts.exp })
	} catch (error) {
		throw new JsonWebTokenError("Error signing jsonwebtoken")
	}
}

export const verifyJsonwebtoken = (token: string, opts: TokenOptions): JwtPayload => {
	try {
		return verify(token, opts.key) as JwtPayload
	} catch (error) {
		throw new JsonWebTokenError("Error verifying jsonwebtoken")
	}
}

export type ServerTokens = {
	access: string | null
	refresh: string | null
}

export const getServerTokens = (headers: IncomingHttpHeaders, cookies: any) => {
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
