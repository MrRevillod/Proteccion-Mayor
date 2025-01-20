import dayjs from "dayjs"
import { isNumberObject } from "node:util/types"

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

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const rutSchema = z.string().refine(isValidRut, {
	message: "El RUT ingresado no es válido",
})

export const emailSchema = z.string().refine((value) => value === "" || emailRegex.test(value), {
	message: "El email ingresado no es válido",
})

export const pinSchema = z.string().refine((value) => value.length === 4, {
	message: "El PIN debe tener 4 dígitos",
})

export const optionalPinSchema = z.string().refine((value) => value === "" || value.length === 4, {
	message: "Debe ser una cadena vacía o de exactamente 4 dígitos",
})

export const passwordSchema = z
	.string()
	.min(8, "La contraseña debe tener al menos 8 caracteres")
	.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
	.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
	.regex(/[0-9]/, "La contraseña debe contener al menos un número")
	.regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial")

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
				"La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial, o ser vacía",
		},
	)

export const nameSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

export const addressSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

export const birthDateSchema = z.date({
	invalid_type_error: "La fecha de nacimiento ingresada no es válida",
	required_error: "La fecha de nacimiento es obligatoria ",
})

export const dateTimeSchema = z.string().refine(
	(value) => {
		const date = new Date(value)
		return !isNaN(date.getTime())
	},
	{
		message: "La fecha de ingresada no es válida",
		path: ["startsAt", "endsAt", "birthDate"],
	},
)

export const isValidDate = (value: string): boolean => {
	const date = new Date(value)
	return !isNaN(date.getTime())
}

export const isValidSeniorBirthDate = (date: string) => {
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

export const descriptionSchema = z
	.string()
	.min(5, "La descripcion debe tener al menos 5 caracteres")
	.refine((value) => value.trim().split(/\s+/).length <= 50, {
		message: "La descripción no debe tener más de 50 palabras",
	})

export const addressCenterSchema = z
	.string()
	.min(2, "La dirección debe tener al menos 2 caracteres")

export const phoneSchema = z
	.string()
	.regex(/^[0-9]+$/, "El teléfono solo puede contener números")
	.min(8, "El número de teléfono debe tener al menos 8 dígitos")
	.max(15, "El número de teléfono no debe tener más de 15 dígitos")

export const colorSchema = z
	.string()
	.regex(/^#?[0-9A-Fa-f]{6}$/, "El color debe ser un código hexadecimal válido")

export const genderSchema = z.enum(["MA", "FE"], {
	message: "El género debe ser MA o FE",
})

export const isWeekend = (date: string) => {
	const day = dayjs(date).day()
	return day !== 0 && day !== 6
}
    export const staffRoleSchema =  z.enum(["ADMIN", "FUNCTIONARY"], {
        message: "El rol debe ser administrador o funcionario",
})

export const centerIdSchema = z.string().refine(
    (value) => {
      // Verifica si el valor es un número válido o "null"
      return !isNaN(Number(value)) || value === "null";
    },
    {
      message: "El valor debe ser un número válido o 'null'",
    }
).nullable()