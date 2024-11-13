import dayjs from "dayjs"
import { z } from "zod"

export const isValidRutFormat = (rut: string): boolean => {
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

export const rutSchema = z
	.string()
	.min(1, { message: "Campo obligatorio" })
	.refine(isValidRut, {
		message: "El RUT ingresado no es válido",
		path: ["rut", "professionalId", "seniorId"],
	})

export const emailSchema = z.string().email("El correo electrónico ingresado no es válido")

export const pinSchema = z.string().refine((value) => value.length === 4, {
	message: "El PIN debe tener 4 dígitos",
})

export const optionalPinSchema = z.string().refine((value) => value === "" || /^[0-9]{4}$/.test(value), {
	message: "El pin debe contener 4 dígitos numéricos",
})

export const optionalPasswordSchema = z
	.string()
	.refine(
		(value) =>
			value === "" ||
			(value.length >= 8 &&
				/[A-Z]/.test(value) &&
				/[a-z]/.test(value) &&
				/[0-9]/.test(value) &&
				/[\W_]/.test(value)),
		{
			message:
				"La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.",
		},
	)

export const passwordSchema = z
	.string()
	.refine(
		(value) =>
			value === "" ||
			(value.length >= 8 &&
				/[A-Z]/.test(value) &&
				/[a-z]/.test(value) &&
				/[0-9]/.test(value) &&
				/[\W_]/.test(value)),
		{
			message:
				"La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.",
		},
	)

export const nameSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

export const descriptionSchema = z
	.string()
	.min(5, "La descripcion debe tener al menos 5 caracteres")
	.refine((value) => value.trim().split(/\s+/).length <= 50, {
		message: "La descripción no debe tener más de 50 palabras",
	})

export const addressSchema = z.string().min(4, "La dirección debe tener al menos 4 caracteres")

export const isValidDate = (value: string): boolean => {
	const date = new Date(value)
	return !isNaN(date.getTime())
}

export const isSeniorBirthDate = (date: string) => {
	const birthDate = new Date(date)
	const now = new Date()
	const age = now.getFullYear() - birthDate.getFullYear()

	return age >= 60
}

export const nameServiceSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(
		/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ\-'.()]+$/,
		"El nombre solo puede contener letras, espacios y caracteres especiales como - ' . ()",
	)

export const titleServiceSchema = z
	.string()
	.min(2, "El título debe tener al menos 2 caracteres")
	.max(50, "El título no debe tener más de 50 caracteres")
	.regex(
		/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ\-'.()]+$/,
		"El título solo puede contener letras, espacios y caracteres especiales como - ' . ()",
	)

export const nameCenterSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

export const addressCenterSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

export const phoneSchema = z
	.string()
	.regex(/^[0-9]+$/, "El teléfono solo puede contener números")
	.min(8, "El número de teléfono debe tener al menos 8 dígitos")
	.max(15, "El número de teléfono no debe tener más de 15 dígitos")

const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export const imageSchemaCreate = z
	.any()
	.refine((file) => !!file, {
		message: "La imagen es obligatoria",
	})
	.refine((file) => ALLOWED_IMAGE_FORMATS.includes(file?.type), {
		message: "Formato de imagen no válido. Debe ser .jpg, .jpeg, .png o .webp",
	})
	.refine((file) => file?.size <= MAX_IMAGE_SIZE, {
		message: "El tamaño máximo de la imagen es de 5 MB",
	})

export const imageSchemaUpdate = z
	.any()
	.refine((file) => !file || ALLOWED_IMAGE_FORMATS.includes(file?.type || ""), {
		message: "Formato de imagen no válido. Debe ser .jpg, .jpeg, .png o .webp",
	})
	.refine((file) => !file || (file?.size || 0) <= MAX_IMAGE_SIZE, {
		message: "El tamaño máximo de la imagen es de 5 MB",
	})

export const colorSchema = z
	.string()
	.regex(/^#?[0-9A-Fa-f]{6}$/, "El color debe ser un hexadecimal válido")
	.transform((val) => {
		return val.startsWith("#") ? val : `#${val}`
	})

export const genderSchema = z.enum(["MA", "FE"], {
	message: "El género seleccionado no es válido",
})

export const isWeekend = (date: string) => {
	const day = dayjs(date).day()
	return day !== 0 && day !== 6
}
