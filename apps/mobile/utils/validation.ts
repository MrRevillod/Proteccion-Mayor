import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"
import { getExpTime } from "./storage"

const isValidRutFormat = (rut: string): boolean => {
	const rutRegex = /^[0-9]+[0-9Kk]$/
	return rutRegex.test(rut)
}

const isValidRut = (rut: string): boolean => {
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

const registerSchema = z
	.object({
		rut: z.string().refine(isValidRut, {
			message: "El RUT ingresado no es válido",
		}),
		email: z.string().email({
			message: "El formato del correo electrónico no es válido",
		}),
		pin: z.string().refine((value) => value.length === 4, {
			message: "El PIN debe tener 4 dígitos",
		}),
		pinConfirm: z.string(),
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

export const profileSchema = z.object({
	id: z.string().refine(isValidRut, {
		message: "El RUT ingresado no es válido",
	}),
	profile: z.string().refine((value) => value !== "", {
		message: "Debe subir una foto de perfil",
	}),
})

export default registerSchema

export const isTokenExp = async (): Promise<boolean> => {
	const exp = await getExpTime()
	if (!exp) {
		return true
	}
	const currentTime = Date.now()
	console.log("Current time:", exp)
	return currentTime > exp
}
