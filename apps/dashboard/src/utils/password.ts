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

	const hashedPassword = await hash(password, 10)

	return [password, hashedPassword]
}
