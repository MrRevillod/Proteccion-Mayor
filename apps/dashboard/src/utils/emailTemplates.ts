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


export const seniorNextHourBody = (name: string, event: any) => `
  ${headerTemplate("Recordatorio: Tienes una cita agendada próximamente")}
  <p>Estimado(a) ${name},</p>
  <p>Queremos recordarte que tienes una cita agendada con los siguientes detalles:</p>
  <ul>
    <li><strong>Servicio:</strong> ${event.service?.name || "No especificado"}</li>
    <li><strong>Fecha y hora:</strong> ${new Date(event.start).toLocaleString("es-CL")}</li>
    <li><strong>Centro:</strong> ${event.center?.name || "No especificado"}</li>
    <li><strong>Profesional:</strong> ${event.professional?.name || "No especificado"}</li>
  </ul>
  <p>Por favor, asegúrate de llegar a tiempo para tu cita. Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
  <p>¡Gracias por confiar en nosotros!</p>
  ${footerTemplate}
`

export const reservationConfirmationEmail = (seniorName: string, event: any) => `
  ${headerTemplate("Confirmación de tu reserva")}
  <p>Estimado(a) ${seniorName},</p>
  <p>Tu reserva ha sido confirmada con éxito. Aquí tienes los detalles de tu cita:</p>
  <ul>
    <li><strong>Servicio:</strong> ${event.service?.name || "No especificado"}</li>
    <li><strong>Fecha y hora:</strong> ${new Date(event.start).toLocaleString("es-CL")}</li>
    <li><strong>Centro:</strong> ${event.center?.name || "No especificado"}</li>
    <li><strong>Profesional:</strong> ${event.professional?.name || "No especificado"}</li>
  </ul>
  <p>Si necesitas cancelar o modificar esta cita, no dudes en ponerte en contacto con nosotros.</p>
  <p>¡Gracias por confiar en nuestros servicios!</p>
  ${footerTemplate}
`


export const reservationCancellationEmail = (seniorName: string, event: any) => `
  ${headerTemplate("Cancelación de tu reserva")}
  <p>Estimado(a) ${seniorName},</p>
  <p>Te informamos que has cancelado la siguiente cita:</p>
  <ul>
    <li><strong>Servicio:</strong> ${event.service?.name || "No especificado"}</li>
    <li><strong>Fecha y hora:</strong> ${new Date(event.start).toLocaleString("es-CL")}</li>
    <li><strong>Centro:</strong> ${event.center?.name || "No especificado"}</li>
    <li><strong>Profesional:</strong> ${event.professional?.name || "No especificado"}</li>
  </ul>
  <p>Esperamos verte pronto nuevamente. Si necesitas asistencia, contáctanos.</p>
  <p>¡Gracias por utilizar nuestros servicios!</p>
  ${footerTemplate}
`

export const professionalReservationNotificationEmail = (professionalName: string, event: any) => `
  ${headerTemplate("Nueva reserva confirmada")}
  <p>Estimado(a) ${professionalName},</p>
  <p>Te informamos que un paciente ha reservado una cita contigo. Aquí están los detalles:</p>
  <ul>
    <li><strong>Paciente:</strong> ${event.senior?.name || "No especificado"}</li>
    <li><strong>Servicio:</strong> ${event.service?.name || "No especificado"}</li>
    <li><strong>Fecha y hora:</strong> ${new Date(event.start).toLocaleString("es-CL")}</li>
    <li><strong>Centro:</strong> ${event.center?.name || "No especificado"}</li>
  </ul>
  <p>Por favor, asegúrate de estar preparado para atender esta cita. Si necesitas modificar la cita, contacta al administrador del sistema.</p>
  <p>Gracias por tu dedicación y esfuerzo.</p>
  ${footerTemplate}
`

export const professionalCancellationNotificationEmail = (professionalName: string, event: any) => `
  ${headerTemplate("Cancelación de cita")}
  <p>Estimado(a) ${professionalName},</p>
  <p>Te informamos que un paciente ha cancelado su cita contigo. Aquí están los detalles:</p>
  <ul>
    <li><strong>Paciente:</strong> ${event.senior?.name || "No especificado"}</li>
    <li><strong>Servicio:</strong> ${event.service?.name || "No especificado"}</li>
    <li><strong>Fecha y hora:</strong> ${new Date(event.start).toLocaleString("es-CL")}</li>
    <li><strong>Centro:</strong> ${event.center?.name || "No especificado"}</li>
  </ul>
  <p>Si necesitas más información, contacta al administrador del sistema.</p>
  <p>Agradecemos tu comprensión y disposición.</p>
  ${footerTemplate}
`

