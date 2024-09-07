import { Administrator } from "@prisma/client"
import { checkCredentials } from "../utils/credentials"
import { Request, Response, NextFunction } from "express"

export const administratorsLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: Administrator = await checkCredentials("ADMIN", req.body)
		return res.status(200).json({ message: "Logged in", values: { user } })
	} catch (err) {
		next(err)
	}
}

export const professionalsLogin = async (req: Request, res: Response, next: NextFunction) => {}
export const seniorsLogin = async (req: Request, res: Response, next: NextFunction) => {}
