import { Controller } from "@repo/lib"
import { Router as ExpressRouter, RequestHandler } from "express"

interface Route {
	path: `/${string}`
	handler: Controller
	middlewares?: RequestHandler[]
}

export class Router {
	public router: ExpressRouter = ExpressRouter()

	constructor() {
		this.router = ExpressRouter()
	}

	protected get({ path, handler, middlewares = [] }: Route) {
		this.router.get(path, ...middlewares, handler)
	}

	protected post({ path, handler, middlewares = [] }: Route) {
		this.router.post(path, ...middlewares, handler)
	}

	protected patch({ path, handler, middlewares = [] }: Route) {
		this.router.patch(path, ...middlewares, handler)
	}

	protected delete({ path, handler, middlewares = [] }: Route) {
		this.router.delete(path, ...middlewares, handler)
	}
}
