import { CONSTANTS } from "../env"
import { createTransport, Transporter } from "nodemailer"

type SendMailOpts = {
	to: string
	subject: string
	html: string
}

const { PROJECT_EMAIL_ADDRESS, PROJECT_EMAIL_PASSWORD, PROJECT_EMAIL_HOST } = CONSTANTS

export class MailerService {
	private transporter: Transporter

	constructor() {
		this.transporter = createTransport({
			service: PROJECT_EMAIL_HOST,
			auth: {
				user: PROJECT_EMAIL_ADDRESS,
				pass: PROJECT_EMAIL_PASSWORD,
			},
		})
	}

	public async send({ to, subject, html }: SendMailOpts): Promise<void> {
		await this.transporter
			.sendMail({
				from: process.env.MAIL_FROM,
				to,
				subject,
				html,
			})
			.catch(() => {
				throw new Error("Error al enviar el correo")
			})
	}
}
