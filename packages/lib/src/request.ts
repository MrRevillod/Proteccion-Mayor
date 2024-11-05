import { AppError } from "."
import { constants, services } from "./config"
import { JsonResponse, ContentTypeVariant, ServiceName, AllowedHttpMethod } from "./types"

interface HttpRequestProps {
	service: ServiceName
	endpoint: string
	method?: AllowedHttpMethod
	variant?: ContentTypeVariant
	headers?: Record<string, string>
	body?: any
}

/**
 *
 * @param service Indica el servicio al que se hará la petición
 * @param endpoint Indica el endpoint (ruta HTTP) al que se hará la petición
 * @param method  Indica el método HTTP de la petición (POST, GET, PUT, DELETE, PATCH)
 * @param variant Indica el tipo de contenido de la petición (JSON, MULTIPART)
 * @param headers Indica los headers HTTP de la petición
 * @param body  Indica el cuerpo de la petición
 * @returns Promise<JsonResponse<T>>
 */

export const httpRequest = async <T>({
	service,
	endpoint,
	method,
	variant,
	headers,
	body,
}: HttpRequestProps): Promise<JsonResponse<T>> => {
	if (!services[service]) {
		throw new Error(`Service ${service} not found in services`)
	}

	if (method === "GET" && body) {
		throw new Error("GET requests cannot have a body")
	}

	if (variant === "MULTIPART" && !(body instanceof FormData)) {
		throw new Error("Body must be of type FormData")
	}

	const url = `${services[service].url}${endpoint}`
	const reqheaders = new Headers()

	if (!variant || variant === "JSON") {
		reqheaders.append("Content-Type", "application/json")
	}

	if (service === "STORAGE") {
		reqheaders.append("X-storage-key", constants.STORAGE_KEY)
	}

	if (headers) {
		Object.entries(headers).forEach(([key, value]) => {
			reqheaders.append(key, value)
		})
	}

	try {
		const response = await fetch(url, {
			method: method || "GET",
			headers: reqheaders,
			body: variant === "JSON" ? JSON.stringify(body) : body,
		})

		const result = (await response.json()) as JsonResponse<T>

		if (!response.ok) {
			throw new AppError(
				(result as any).status || 500,
				(result as any).message,
				((result as any).values || {}) as Record<string, unknown>,
			)
		}

		return result as JsonResponse<T>
	} catch (error: unknown) {
		throw error
	}
}
