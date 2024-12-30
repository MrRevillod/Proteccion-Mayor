import { hash } from "bcrypt"
import { generate } from "generate-password"

export const generatePassword = async (): Promise<string[]> => {
	const password = generate({
		length: 10,
		numbers: true,
		symbols: true,
		lowercase: true,
		uppercase: true,
		strict: true,
	})

	return [password, await hash(password, 10)]
}

export const generatePin = async (): Promise<string[]> => {
	const pin = generate({
		length: 4,
		numbers: true,
		symbols: false,
		lowercase: false,
		uppercase: false,
		strict: true,
	})

	return [pin, await hash(pin, 10)]
}
