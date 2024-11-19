import nodemailer from "nodemailer"
import { constants } from "@repo/lib"

const { PROJECT_EMAIL_ADDRESS, PROJECT_EMAIL_PASSWORD, PROJECT_EMAIL_HOST } = constants

const transporter = nodemailer.createTransport({
	service: PROJECT_EMAIL_HOST,
	auth: {
		user: PROJECT_EMAIL_ADDRESS,
		pass: PROJECT_EMAIL_PASSWORD,
	},
})

export const sendMail = async (to: string, subject: string, html: string) => {
	const mailOptions = {
		from: PROJECT_EMAIL_ADDRESS,
		to,
		subject,
		html,
	}

	await transporter.sendMail(mailOptions).catch(() => {
		throw new Error("Error al enviar el correo")
	})
}
