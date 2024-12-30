import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class EventsSchemas extends Schema {
	get query() {
		return z.object({
			professionalId: z.string().optional(),
			centerId: z.coerce.number().optional(),
			seniorId: z.string().optional(),
			serviceId: z.coerce.number().optional(),
		})
	}

	get defaultSelect() {
		return {
			id: true,
			start: true,
			end: true,
			assistance: true,
			seniorId: true,
			professionalId: true,
			serviceId: true,
			centerId: true,
			createdAt: true,
			updatedAt: true,
			service: {
				select: { id: true, name: true, color: true },
			},
			center: {
				select: { id: true, name: true, address: true },
			},
			senior: {
				select: { id: true, name: true, email: true },
			},
			professional: { select: { name: true, email: true } },
		}
	}

	get create() {
		return z
			.object({
				start: rules.dateTimeSchema,
				end: rules.dateTimeSchema,
				professionalId: rules.rutSchema,
				serviceId: z.number({ message: "El servicio es obligatorio" }),
				seniorId: z.optional(rules.rutSchema),
				centerId: z.number({ message: "El centro es obligatorio" }),
				repeat: z.optional(z.enum(["daily", "weekly"])),
			})
			.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
				message: "No es posible crear eventos los fin de semana",
				path: ["end", "start"],
			})
	}

	get update() {
		return z
			.object({
				start: rules.dateTimeSchema,
				end: rules.dateTimeSchema,
				professionalId: rules.rutSchema,
				serviceId: z.number(),
				assistance: z.boolean(),
				seniorId: z.optional(rules.rutSchema),
				centerId: z.number(),
			})
			.refine((data) => data.start < data.end, {
				message: "La fecha de inicio no puede ser mayor a la fecha de finalización",
				path: ["start", "end"],
			})

			.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
				message: "No es posible crear eventos los fin de semana",
				path: ["end", "start"],
			})
	}
}
