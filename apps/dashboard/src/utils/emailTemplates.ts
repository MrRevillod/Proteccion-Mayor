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
