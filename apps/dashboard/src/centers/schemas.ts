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
			dailySessions: {
				select: {
					id: true,
					quantity: true,
					centerId: true,
					serviceId: true,
					service: {
						select: { id: true, name: true },
					},
				},
			},
		}
	}

	get create() {
		return z.object({
			name: rules.nameCenterSchema,
			address: rules.addressCenterSchema,
			phone: rules.phoneSchema,
			color: rules.colorSchema,
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

	get updateDailySessions() {
		return z.object({
			servicesDailyAttentions: z.array(
				z.object({
					id: rules.numberIdSchema,
					quantity: z.number().int().min(1),
					serviceId: rules.numberIdSchema,
					centerId: rules.numberIdSchema,
				}),
			),
		})
	}
}
