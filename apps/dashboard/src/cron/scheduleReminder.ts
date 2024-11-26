import cron from "node-cron"
import dayjs from "dayjs"
import { seniorNextHourBody } from "../utils/emailTemplates" // Template del correo
import { prisma } from "@repo/database"
import { eventSelect } from "../utils/filters"
import { sendMail } from "../utils/mailer"

// Programar el cron para que se ejecute cada 5 minutos
cron.schedule("0 */6 * * *", async () => {
  console.log("Iniciando tarea de recordatorios para citas próximas...")

  try {
    // Obtener la hora actual y la hora límite (próximas 60 minutos)
    const now = new Date()
    const HourFromNow = dayjs(now).add(24, "hour").toDate()

    // Buscar eventos próximos
    const upcomingEvents = await prisma.event.findMany({
      where: {
        start: {
          gte: now, // Comienza desde ahora
          lte: HourFromNow, // Dentro de las proximas 24h
        },
        seniorId: { not: null }, // Asegurarse de que estén reservados
      },
      select: eventSelect, // Utilizamos el mismo eventSelect definido previamente
    })

    // Enviar correos para cada evento encontrado
    const emailPromises = upcomingEvents.map( (event) => {
      const seniorEmail = event.senior?.email
      const seniorName = event.senior?.name
        if (seniorEmail && seniorName) {

        const emailBody = seniorNextHourBody(seniorName, event)
        return sendMail(seniorEmail, "Recordatorio de tu cita próxima", emailBody)
      }
      return Promise.resolve() // Si falta información, ignoramos este evento
    })

    // Ejecutar todos los envíos de correo en paralelo
    await Promise.all(emailPromises)

  } catch (error) {
    console.error("Error en la tarea de recordatorios:", error)
  }
})
