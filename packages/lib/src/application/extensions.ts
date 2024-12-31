import { NextFunction, Request, RequestHandler, Response } from "express"

declare global {
	namespace Express {
		interface Request {
			extensions: Map<string, unknown>
			setExtension: (key: string, value: unknown) => void
			getExtension: (key: string) => unknown | undefined
		}
	}
}

export const extensions: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	req.extensions = new Map<string, unknown>()

	req.setExtension = (key: string, value: unknown) => {
		req.extensions.set(key, value)
	}

	req.getExtension = (key: string) => {
		return req.extensions.get(key)
	}

	next()
}
