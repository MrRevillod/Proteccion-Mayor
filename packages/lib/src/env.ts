import dotenv from "dotenv"

const mode = process.env.NODE_ENV

const productionPath = "../../.env.production"
const developmentPath = "../../.env"

dotenv.config({
	path: mode === "production" ? productionPath : developmentPath,
})

class Environtment {
	private envPortAsInt(envVar: string, defaultPort: number) {
		return Number(process.env[envVar] ?? defaultPort)
	}

	private BASE_URL = process.env.SERVER_BASE_URL ?? "http://localhost"

	private formatServiceUrl(service: string) {
		return `${this.BASE_URL}/api/${service}`
	}

	get services() {
		return {
			AUTH: {
				URL: this.formatServiceUrl("auth"),
				PORT: this.envPortAsInt("AUTH_SERVICE_PORT", 3000),
			},
			STORAGE: {
				URL: this.formatServiceUrl("storage"),
				PORT: this.envPortAsInt("STORAGE_SERVICE_PORT", 4000),
			},
			DASHBOARD: {
				URL: this.formatServiceUrl("dashboard"),
				PORT: this.envPortAsInt("DASHBOARD_SERVICE_PORT", 5000),
			},
			WEB_APP: {
				URL: this.BASE_URL ?? "http://localhost:8000",
				PORT: this.envPortAsInt("WEB_APP_PORT", 8000),
			},
		}
	}

	get constants() {
		return {
			JWT_SECRET: process.env.JWT_SECRET ?? "JWT_SECRET",
			REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
			STORAGE_KEY: process.env.STORAGE_KEY ?? "STORAGE_KEY",

			PROJECT_EMAIL_ADDRESS: process.env.PROJECT_EMAIL_ADDRESS ?? "",
			PROJECT_EMAIL_PASSWORD: process.env.PROJECT_EMAIL_PASSWORD ?? "",
			PROJECT_EMAIL_HOST: process.env.PROJECT_EMAIL_HOST ?? "",
			PROJECT_EMAIL_PORT: process.env.PROJECT_EMAIL_PORT ?? "",
		}
	}
}

const instance = new Environtment()

export const CONSTANTS = instance.constants
export const SERVICES = instance.services
