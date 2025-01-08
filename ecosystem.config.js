module.exports = {
	apps: [
		{
			name: "dashboard",
			cwd: "./apps/dashboard",
			exec_mode: "cluster",
			instances: 3,
			script: "dist/index.js",
			watch: false,
			autorestart: true,
			env: {
				NODE_ENV: "production",
			},
		},
		{
			name: "auth",
			cwd: "./apps/auth",
			exec_mode: "cluster",
			instances: 2,
			script: "dist/index.js",
			watch: false,
			autorestart: true,
			env: {
				NODE_ENV: "production",
			},
		},
		{
			name: "storage",
			cwd: "./apps/storage",
			exec_mode: "cluster",
			instances: 1,
			script: "dist/index.js",
			watch: false,
			autorestart: true,
			env: {
				NODE_ENV: "production",
			},
		},
	],
}
