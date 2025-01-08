import { z } from "zod"
import { Schema } from "@repo/lib"

export class SessionSchemas extends Schema {
	get webLogin() {
		return z.object({
			email: z.string().min(0, "Credenciales invalidas"),
			password: z.string().min(0, "Credenciales invalidas"),
		})
	}

	get mobileLogin() {
		return z.object({
			rut: z.string().min(0, "Credenciales invalidas"),
			password: z.string().min(0, "Credenciales invalidas"),
		})
	}
}
