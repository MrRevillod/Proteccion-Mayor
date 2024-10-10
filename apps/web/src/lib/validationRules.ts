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

export const rutSchema = z.string().refine(isValidRut, {
	message: "El RUT ingresado no es válido",
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

export const birthDateSchema = z.coerce.date({
	message: "La fecha de nacimiento ingresada no es válida",
})

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

export const imageSchemaCreate = z
	.any()
	.refine((files) => files?.length === 1, "La imagen es obligatoria")
	.refine((files) => files?.[0]?.size <= 5 * 1048576, "La imagen debe ser menor a 5MB")
	.refine(
		(files) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(files?.[0]?.type),
		"Formato de imagen no permitido. Solo se permiten JPEG, PNG, JPG y WEBP",
	)

export const imageSchemaUpdate = z
	.any()
	.nullable()
	.refine((files) => !files || files.length === 0 || files.length === 1, "Solo puedes subir una imagen")
	.refine((files) => !files || files.length === 0 || files[0].size <= 5 * 1048576, "La imagen debe ser menor a 5MB")
	.refine(
		(files) =>
			!files ||
			files.length === 0 ||
			["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(files[0].type),
		"Formato de imagen no permitido. Solo se permiten JPEG, PNG, JPG y WEBP",
	)
