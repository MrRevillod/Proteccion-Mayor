import { z } from "zod"
import { match } from "ts-pattern"
import { NextFunction, Request, Response } from "express"

type ValidationRule = "LOGIN_FIELDS" | "SENIOR_LOGIN_FIELDS"

const LoginFields = z.object({
	email: z.string().min(0, "Credenciales invalida"),
	password: z.string().min(0, "Credenciales invalida"),
})

const SeniorLoginFields = z.object({
	rut: z.string().min(0, "Credenciales invalida"),
	password: z.string().min(0, "Credenciales invalida"),
})

export const validateFields = (rule: ValidationRule) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const body = req.body

		try {
			match(rule)
				.with("LOGIN_FIELDS", () => LoginFields.parse(body))
				.with("SENIOR_LOGIN_FIELDS", () => SeniorLoginFields.parse(body))
				.run()

			next()
		} catch (error: unknown) {
			next(error)
		}
	}
}
