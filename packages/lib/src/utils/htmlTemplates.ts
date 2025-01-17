    import dayjs from "dayjs"

import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/es"

dayjs.locale("es")
dayjs.extend(utc)
dayjs.extend(timezone)

import { SERVICES } from "../env"

const formatDate = (date: string | Date, format = "dddd DD [de] MMMM [a las] HH:mm") => {
	return dayjs(date).tz("America/Santiago").format(format)
}

const headerTemplate = (title: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #046C4E; text-align: center;">${title}</h2>
`

const footerTemplate = `
    <hr style="margin-top: 40px; border-color: #ddd;">
    <p style="text-align: center; color: #888;">© ${new Date().toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})}.</p>
  </div>
`

export const resetPasswordRequest = (name: string, resetLink: string) => `
  ${headerTemplate("Restablecer contraseña")}
  <p>Hola, <strong>${name}</strong>.</p>
  <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el enlace a continuación para continuar con el proceso de restablecimiento:</p>
  <p style="text-align: center;">
    <a href="${resetLink}" style="background-color: #046C4E; color: white; padding: 8px 20px; text-decoration: none; border-radius: 5px;">
    Restablecer contraseña
    </a>
  </p>
  <p>Este enlace expirará en 30 días. Si no solicitaste este cambio, simplemente ignora este correo.</p>
  ${footerTemplate}
`
export const reservation = (event: any) => {
	const { professional, service, senior, center, start, end } = event

	const professionalTemplate = `
    ${headerTemplate("Cita Confirmada")}
    <p>Hola, <strong>${professional?.name}</strong>.</p>
    <p>Le informamos que se ha confirmado una cita para el servicio de <strong>${
		service?.name
	}</strong>.</p>
    <ul>
        <li><strong>Persona mayor:</strong> ${senior?.name}</li>
        <li><strong>Hora:</strong> ${formatDate(start)} 
        a ${formatDate(end, "HH:mm")}</li>
        <li><strong>Ubicación:</strong> ${center?.name}</li>
    </ul>
    <p>Por favor, contáctenos si necesita más detalles.</p>
    ${footerTemplate}
`

	const seniorTemplate = `
        ${headerTemplate("Confirmación de tu reserva")}
        <p>Estimado(a) ${senior?.name},</p>
        <p>Tu reserva ha sido confirmada con éxito. Aquí tienes los detalles de tu cita:</p>
        <ul>
            <li><strong>Servicio:</strong> ${service?.name}</li>
            <li><strong>Fecha y hora:</strong> ${formatDate(start)}
            <li><strong>Centro:</strong> ${center?.name}</li>
            <li><strong>Profesional:</strong> ${professional?.name}</li>
        </ul>
        <p>Si necesitas cancelar o modificar esta cita, no dudes en ponerte en contacto con nosotros.</p>
        <p>¡Gracias por confiar en nuestros servicios!</p>
        ${footerTemplate}
    `

	return { professionalTemplate, seniorTemplate }
}

export const cancelReservation = (event: any) => {
	const { professional, service, senior, start } = event

	const professionalTemplate = `
        ${headerTemplate("Notificación de cancelación de cita")}
        <p>Hola <strong>${professional?.name}</strong>,</p>
        <p>Lamentamos informarte que la cita programada con <strong>${
			senior?.name
		}</strong> ha sido cancelada.</p>
        <p><strong>Detalles de la cita cancelada:</strong></p>
        <ul>
            <li><strong>Fecha y hora:</strong> ${formatDate(start)}</li>
        </ul>
        ${footerTemplate}
    `

	const seniorTemplate = `
        ${headerTemplate("Notificación de cancelación de cita")}
        <p>Estimado(a) <strong>${senior?.name}</strong>,</p>
        <p>La cita programada del servicio de <strong>${
			service?.name
		}</strong> ha sido cancelada.</p>
        <p><strong>Detalles:</strong></p>
        <ul>
            <li><strong>Fecha y hora:</strong> ${formatDate(start)}</li>
        </ul>
        ${footerTemplate}
    `

	return { professionalTemplate, seniorTemplate }
}

export const welcome = (name: string, email: string, password: string) => `
  ${headerTemplate("Bienvenido")}
  <p>Hola, <strong>${name}</strong>.</p>
  <p>¡Bienvenido a la plataforma! Tus credenciales de acceso son:</p>
  <ul>
    <li><strong>Correo electrónico:</strong> ${email}</li>
    <li><strong>Contraseña:</strong> ${password}</li>
  </ul>
  <p>Por favor, inicia sesión en la plataforma y cambia tu contraseña por una más segura.</p>
  <p style="text-align: center;">
  <a href="${
		SERVICES.WEB_APP.URL
  }auth/iniciar-sesion" style="display: inline-block; background-color: #046C4E; color: white; padding: 8px 20px; text-decoration: none; border-radius: 5px;">
    Ir a la plataforma
  </a>
  </p>
  ${footerTemplate}
`

export const seniorWelcome = (name: string) => `
  ${headerTemplate("Bienvenido a la Plataforma de Protección Mayor de la Municipalidad de Temuco")}
  <p>Estimado(a) ${name},</p>
  <p>Nos complace informarle que su cuenta ha sido validada exitosamente. Ahora puede acceder a todos los servicios disponibles en nuestra plataforma.</p>
  <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
  <p>¡Gracias por confiar en nosotros!</p>
  ${footerTemplate}
`

export const registerDenegation = (name: string) => `
  ${headerTemplate("Solicitud de registro de cuenta rechazada")}
  <p>Estimado(a) ${name},</p>
  <p>Lamentamos informarle que su cuenta ha sido rechazada.</p>
  <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
  ${footerTemplate}
`

export const seniorCredentialsWelcome = (name: string, rut: string, pin: string) => `
  ${headerTemplate("Bienvenido a la Plataforma de Protección Mayor de la Municipalidad de Temuco")}
  <p>Estimado(a) ${name},</p>
  <p>Nos complace informarle que ha sido registrado en el sistema de Protección Mayor. Ahora puede acceder a todos los servicios disponibles en nuestra plataforma.</p>
  <p>¡Bienvenido! Sus credenciales de acceso son:</p>
  <ul>
    <li><strong>Rut:</strong> ${rut}</li>
    <li><strong>Pin:</strong> ${pin}</li>
  </ul>
  <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
  <p>¡Gracias por confiar en nosotros!</p>
  ${footerTemplate}
`
