/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind")

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
	darkMode: "class",
	theme: {
		extend: {
			borderWidth: {
				1: "1px",
			},
			colors: {
				light: "#FFF",
				dark: "#000",
				"gray-light": "#f3f4f3",
				"gray-medium": "#6b7280",
				"gray-dark": "#9ca3af",
				red: "#b91c1c",
				blue: "#1a202c",
				primary: "#046c4e",
				"primary-dark": "#1a202c",
				"primary-darker": "#171923",
			},
			height: {
				"screen-without-header": "calc(100vh - 4.5rem)",
			},
		},
	},
	plugins: [flowbite.plugin()],
}
