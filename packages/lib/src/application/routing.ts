import { Router as ExpressRouter, RequestHandler } from "express"

interface Route {
	path: `/${string}`
	handler: RequestHandler
	middlewares?: RequestHandler[]
}

interface Options {
	prefix?: string
}

export class Router {
	public router: ExpressRouter = ExpressRouter()
	private prefix: string

	constructor({ prefix = "" }: Options) {
		this.prefix = prefix
	}

	get routes() {
		return this.router
	}

	private withPrefix(path: string): string {
		return `${this.prefix}${path}`
	}

	protected get({ path, handler, middlewares = [] }: Route) {
		this.router.get(this.withPrefix(path), ...middlewares, handler)
	}

	protected post({ path, handler, middlewares = [] }: Route) {
		this.router.post(this.withPrefix(path), ...middlewares, handler)
	}

	protected put({ path, handler, middlewares = [] }: Route) {
		this.router.put(this.withPrefix(path), ...middlewares, handler)
	}

	protected patch({ path, handler, middlewares = [] }: Route) {
		this.router.patch(this.withPrefix(path), ...middlewares, handler)
	}

	protected delete({ path, handler, middlewares = [] }: Route) {
		this.router.delete(this.withPrefix(path), ...middlewares, handler)
	}
}
