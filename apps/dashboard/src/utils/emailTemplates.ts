import dayjs from "dayjs"

import "dayjs/locale/es"

dayjs.locale("es")

import { services } from "@repo/lib"

const headerTemplate = (title: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #046C4E; text-align: center;">${title}</h2>
`

const footerTemplate = `
    <hr style="margin-top: 40px; border-color: #ddd;">
    <p style="text-align: center; color: #888;">© ${new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}.</p>
  </div>
`

export const resetPasswordBody = (name: string, resetLink: string) => `
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

export const appointmentNotification = (
	nameProfessional: string,
	nameService: string,
	nameSenior: string | undefined,
	nameCenter: string,
	start: any,
	end: any,
) => `
${headerTemplate("Cita Confirmada")}
  <p>Hola, <strong>${nameProfessional}</strong>.</p>
  <p>Le informamos que se ha confirmado una cita para el servicio de <strong>${nameService}</strong>.</p>
  <ul>
    <li><strong>Cliente:</strong> ${nameSenior}</li>
    <li><strong>Hora:</strong> ${dayjs(start).format("dddd DD [de] MMMM HH:mm")} a ${dayjs(end).format("HH:mm ,YYYY")}</li>
    <li><strong>Ubicación:</strong> ${nameCenter}</li>
  </ul>
  <p>Por favor, contáctenos si necesita más detalles.</p>
`

export const cancelEventNotification = (nameProfessional: string, nameSenior: string, eventDate: any, eventTime: any) => `
${headerTemplate("Notificación de cancelación de cita")}
  <p>Hola <strong>${nameProfessional}</strong>,</p>
  <p>Lamentamos informarte que la cita programada con <strong>${nameSenior}</strong> ha sido cancelada.</p>
  <p><strong>Detalles del evento cancelado:</strong></p>
  <ul>
    <li><strong>Fecha:</strong> ${dayjs(eventDate).format("dddd DD [de] MMMM YYYY")}</li>
    <li><strong>Hora:</strong> ${dayjs(eventTime).format("HH:mm")}</li>
  </ul>
  <p>Gracias por tu comprensión.</p>
`

export const welcomeBody = (name: string, email: string, password: string) => `
  ${headerTemplate("Bienvenido")}
  <p>Hola, <strong>${name}</strong>.</p>
  <p>¡Bienvenido a la plataforma! Tus credenciales de acceso son:</p>
  <ul>
    <li><strong>Correo electrónico:</strong> ${email}</li>
    <li><strong>Contraseña:</strong> ${password}</li>
  </ul>
  <p>Por favor, inicia sesión en la plataforma y cambia tu contraseña por una más segura.</p>
  <p style="text-align: center;">
  <a href="${services.WEB_APP.url}auth/iniciar-sesion" style="display: inline-block; background-color: #046C4E; color: white; padding: 8px 20px; text-decoration: none; border-radius: 5px;">
    Ir a la plataforma
  </a>
  </p>
  ${footerTemplate}
`

export const seniorWelcomeEmailBody = (name: string) => `
  ${headerTemplate("Bienvenido a la Plataforma de Protección Mayor de la Municipalidad de Temuco")}
  <p>Estimado(a) ${name},</p>
  <p>Nos complace informarle que su cuenta ha sido validada exitosamente. Ahora puede acceder a todos los servicios disponibles en nuestra plataforma.</p>
  <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
  <p>¡Gracias por confiar en nosotros!</p>
  ${footerTemplate}
`
