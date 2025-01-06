import { CONSTANTS } from "../env"
import { JwtPayload, sign as JwtSign, verify as JwtVerify, JsonWebTokenError } from "jsonwebtoken"

type Payload = JwtPayload | Object
type JwtExpiration = `${number}${"s" | "m" | "h" | "d"}`

type TokenOptions = {
	key?: string
	exp?: JwtExpiration
	payload?: Object
}

export const accessTokenOpts: TokenOptions = {
	exp: "15m",
	key: CONSTANTS.JWT_SECRET,
}

export const refreshTokenOpts: TokenOptions = {
	exp: "30d",
	key: CONSTANTS.JWT_SECRET,
}

export const sign = (payload: Payload, opts: TokenOptions): string => {
	try {
		return JwtSign(payload, opts.key ?? CONSTANTS.JWT_SECRET, { expiresIn: opts.exp })
	} catch (error) {
		throw new JsonWebTokenError("Error verifying jsonwebtoken")
	}
}

export const verify = (token: string, key?: string): JwtPayload => {
	try {
		return JwtVerify(token, key ?? CONSTANTS.JWT_SECRET) as JwtPayload
	} catch (error) {
		throw new JsonWebTokenError("Error signing jsonwebtoken")
	}
}

export const generateCustomOpts = ({ key = "", exp }: TokenOptions): TokenOptions => {
	return { key: `${CONSTANTS.JWT_SECRET}${key}`, exp }
}
