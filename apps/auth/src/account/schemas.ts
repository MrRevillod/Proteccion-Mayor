import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class AccountSchemas extends Schema {
	get resetPasswordRequest() {
		return z.object({
			email: rules.emailSchema,
		})
	}
}
