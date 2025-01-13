import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

import { defineConfig } from "vite"

export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		{
			name: "custom-dev-greeter",
			configureServer(server) {
				server.httpServer?.once("listening", () => {
					console.table({
						WEB_APP: {
							url: "http://localhost/ at nginx /",
							port: 8000,
						},
					})
				})
			},
		},
	],
	server: { port: 8000 },
	logLevel: "silent",
	envDir: "../../",
})
