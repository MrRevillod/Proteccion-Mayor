import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class StaffSchemas extends Schema {
	get defaultSelect() {
		return {
			id: true,
			name: true,
            email: true,
            centerId: true,
            role: true,
			createdAt: true,
			updatedAt: true,
		}
	}

	get create() {
		return z.object({
			id: rules.rutSchema,
			name: rules.nameSchema,
			email: rules.emailSchema,
            role: rules.staffRoleSchema,
            centerId: rules.centerIdSchema,
		})
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				email: rules.emailSchema,
                centerId: rules.centerIdSchema,
                role: rules.staffRoleSchema,
				password: rules.optionalPasswordSchema,
				confirmPassword: rules.optionalPasswordSchema,  
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Las contraseñas ingresadas no coinciden",
			})
	}
}   
