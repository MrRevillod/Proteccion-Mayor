import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { compare } from "bcrypt"
import { AuthError, UserKind } from "@repo/lib"

type Credentials = {
	rut?: string
	email?: string
	password: Required<string>
}

export const checkCredentials = async <T>(userKind: UserKind, credentials: Credentials) => {
	const user = await match(userKind)
		.with("ADMIN", async () => {
			return await prisma.administrator.findFirst({ where: { email: credentials.email } })
		})
		.with("SENIOR", async () => {
			return await prisma.senior.findFirst({ where: { id: credentials.rut } })
		})
		.run()

	if (!user || !(await compare(credentials.password, user.password))) {
		throw new AuthError(401, "Invalid credentials")
	}

	return user as T
}