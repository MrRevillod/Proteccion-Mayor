export class AppError extends Error {
	public code: number
	public data: Record<string, unknown> | unknown[] | null

	constructor(code: number, message: string, data: Record<string, unknown> = {}) {
		super(message)
		this.code = code
		this.data = data
	}
}

export class AuthError extends AppError {
	constructor(code: number, message: string) {
		super(code ?? 401, message)
	}
}

export class Conflict extends AppError {
	constructor(message: string, details?: Record<string, string[]>) {
		super(409, message, details)
	}
}

export class BadRequest extends AppError {
	constructor(message: string, details?: Record<string, string[]>) {
		super(400, message, details ?? {})
	}
}

export class Unauthorized extends AuthError {
	constructor(message?: string) {
		super(401, message ?? "No tienes autorización para acceder a este recurso")
	}
}

export class NotFound extends AppError {
	constructor(message: string) {
		super(404, message)
	}
}
