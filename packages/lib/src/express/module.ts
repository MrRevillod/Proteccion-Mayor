export abstract class Module {
	public abstract router: { routes: any }

	get routes() {
		return this.router.routes
	}
}
