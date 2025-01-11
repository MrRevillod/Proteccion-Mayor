import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"

export class CentersSchemas extends Schema {
	private readonly selectOptions = ["id", "name"]

	get query() {
		return z.object({
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectOptions)),
		})
	}

	get defaultSelect(): Prisma.CenterSelect {
		return {
			id: true,
			name: true,
			address: true,
			phone: true,
			color: true,
			servicesDailyAttentions: true,
		}
	}

	get create() {
		return z.object({
			name: rules.nameCenterSchema,
			address: rules.addressCenterSchema,
			phone: rules.phoneSchema,
			color: rules.colorSchema,
			servicesDailyAttentions: z.array(
				z.object({
					serviceId: z.string(),
					attentions: z.number().int().positive(),
				}),
			),
		})
	}

	get update() {
		return z.object({
			name: rules.nameCenterSchema,
			address: rules.addressCenterSchema,
			phone: rules.phoneSchema,
			color: rules.colorSchema,
		})
	}
}
