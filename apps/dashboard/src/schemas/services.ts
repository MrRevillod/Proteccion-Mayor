import { z } from "zod"
import { rules } from "@repo/lib"
import { parseSelectString } from "../utils/query"

const selectOptions = ["id", "name", "title"] as const

export const ServiceSchemas = {
	query: z.object({
		select: z
			.string()
			.optional()
			.transform((value) => parseSelectString(value, selectOptions)),
	}),

	defaultSelect: {
		id: true,
		name: true,
		title: true,
		description: true,
		color: true,
	},

	create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		color: rules.colorSchema,
	}),

	update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		color: rules.colorSchema,
	}),
}
