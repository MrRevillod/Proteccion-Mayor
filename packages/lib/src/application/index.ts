import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import cookieParser from "cookie-parser"

import { Module } from "./module"
import { Express } from "express"
import { extensions } from "./extensions"
import { errorHandler } from "../errors/handler"

export const createApplication = (modules: Module[] = []): Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))

	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	app.use(cors({ origin: "*", credentials: true }))

	app.use(cookieParser())
	app.use(extensions)

	modules.forEach((module) => app.use(module.routes))

	app.use(errorHandler)

	return app
}
