import { z } from "zod"

const isValidRutFormat = (rut: string): boolean => {
	const rutRegex = /^[0-9]+[0-9Kk]$/
	return rutRegex.test(rut)
}

export const isValidRut = (rut: string): boolean => {
	if (!isValidRutFormat(rut)) {
		return false
	}

	const body = rut.slice(0, -1)
	const verifier = rut.slice(-1).toUpperCase()

	let sum = 0
	let multiplier = 2

	for (let i = body.length - 1; i >= 0; i--) {
		sum += parseInt(body[i], 10) * multiplier
		multiplier = multiplier === 7 ? 2 : multiplier + 1
	}

	const mod11 = 11 - (sum % 11)
	const expectedVerifier = mod11 === 11 ? "0" : mod11 === 10 ? "K" : mod11.toString()

	return verifier === expectedVerifier
}

export const RegisterSchema = z
	.object({
		rut: z.string().min(1, { message: "Este campo es requerido" }).refine(isValidRut, {
			message: "El RUT ingresado no es válido",
		}),
		email: z.string().min(1, { message: "Este campo es requerido" }).email({
			message: "El formato del correo electrónico no es válido",
		}),
		pin: z
			.string()
			.min(1, { message: "Este campo es requerido" })
			.regex(/^\d+$/, "El Pin debe contener solo números")
			.refine((value) => value.length === 4, {
				message: "El PIN debe tener 4 dígitos",
			}),
		pinConfirm: z.string().min(1, { message: "Este campo es requerido" }),
		dni_a: z.string().refine((value) => value !== "", {
			message: "Debe subir una foto del documento",
		}),
		dni_b: z.string().refine((value) => value !== "", {
			message: "Debe subir una foto del documento",
		}),
		social: z.string().refine((value) => value !== "", {
			message: "Debe subir una foto del documento",
		}),
	})
	.refine((data) => data.pin === data.pinConfirm, {
		message: "Los PIN ingresados no coinciden",
		path: ["pinConfirm"],
	})
