import dayjs from "dayjs"
dayjs.locale("es")

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
    <a href="${resetLink}" style="background-color: #046C4E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
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
