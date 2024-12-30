import { z } from "zod"
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

	get defaultSelect() {
		return {
			id: true,
			name: true,
			address: true,
			phone: true,
			color: true,
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
}
