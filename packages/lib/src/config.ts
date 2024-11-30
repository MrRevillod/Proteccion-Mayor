import dotenv from "dotenv"
import { ServiceName, ServiceInfo } from "./types"

console.log("NODE_ENV", process.env.NODE_ENV)

dotenv.config({
	path: process.env.NODE_ENV === "production" ? "../../.env.production" : "../../.env",
})

const envPortAsInt = (envVar: string, defaultPort: number) => {
	return parseInt(process.env[envVar] ?? defaultPort.toString())
}

export const services: Record<ServiceName, ServiceInfo> = {
	AUTH: {
		url: (process.env.AUTH_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("AUTH_SERVICE_PORT", 3000),
	},
	STORAGE: {
		url: (process.env.STORAGE_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("STORAGE_SERVICE_PORT", 4000),
	},
	DASHBOARD: {
		url: (process.env.DASHBOARD_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("DASHBOARD_SERVICE_PORT", 5000),
	},
	WEB_APP: {
		url: (process.env.WEB_APP_URL ?? "http://localhost") as string,
		port: envPortAsInt("WEB_APP_PORT", 8000),
	},
} as const

export const constants = {
	JWT_SECRET: process.env.JWT_SECRET ?? "secret",
	REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET ?? "refresh_secret",
	IMAGE_MAX_SIZE_MB: process.env.IMAGE_MAX_SIZE_MB ?? 5,
	STORAGE_KEY: process.env.STORAGE_KEY ?? "secret",

	DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD ?? "admin",
	DEFAULT_PROFESSIONAL_PASSWORD: process.env.DEFAULT_PROFESSIONAL_PASSWORD ?? "professional",
	DEFAULT_SENIOR_PASSWORD: process.env.DEFAULT_SENIOR_PASSWORD ?? "1234",

	PROJECT_EMAIL_ADDRESS: process.env.PROJECT_EMAIL_ADDRESS ?? "",
	PROJECT_EMAIL_PASSWORD: process.env.PROJECT_EMAIL_PASSWORD ?? "",
	PROJECT_EMAIL_HOST: process.env.PROJECT_EMAIL_HOST ?? "",
	PROJECT_EMAIL_PORT: process.env.PROJECT_EMAIL_PORT ?? "",
} as const

console.table(services)
