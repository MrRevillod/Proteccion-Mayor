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
// El template tiene que ser dirijido a el prfessional, entonces:
// Hola, NOMBRE_PROFESSIONAL
// Se a reservado una consulta a PELUQUERIA, con el pasiente NOMBRE_PERSONA_MAYOR a la hora: HORA a tal hora.
// falta el centro comunitario
// export const appointmentNotification = (
// 	nameProfessional: string,
// 	nameService: string,
// 	nameSenior: string | undefined,
// 	nameCenter: string,
// 	start: any,
// 	end: any,
// ) => `
// ${headerTemplate("Cita Confirmada")}
//   <p>Hola, <strong>${nameProfessional}</strong>.</p>
//   <p>Le informamos que se ha confirmado una cita para el servicio de <strong>${nameService}</strong>.</p>
//   <ul>
//     <li><strong>Cliente:</strong> ${nameSenior}</li>
//     <li><strong>Hora:</strong> ${start} a ${end}</li>
//     <li><strong>Ubicación:</strong> ${nameCenter}</li>
//   </ul>
//   <p>Por favor, contáctenos si necesita más detalles.</p>
// `

export const appointmentNotification = (nameProfessional: string) => `
${headerTemplate("Cita Confirmada")}
  <p>Hola, <strong>${nameProfessional}</strong>.</p>
  <p>Esto es una prueba cuando se reserva un evento.</p>

`
export const cancelEventNotification = (nameProfessional: string, nameSenior: string) => `
${headerTemplate("Cancel Event Notificate")}
  <p>Hola, <strong>${nameProfessional} and ${nameSenior}</strong>.</p>
  <p>Esto es una prueba cuando se cancela el evento.</p>

`
