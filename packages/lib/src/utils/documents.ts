import { RSH } from '@prisma/client'
import dayjs from 'dayjs'
import { Workbook } from 'exceljs'

const rshParser = (rsh: RSH | null): string => {
    if (rsh === null) return ''

    const splited = rsh.split('_')

    return splited[1] + "-" + splited[2]
}

export interface EventPrismaResult {
    assistance: boolean
    start: Date
    seniorId: string | null
    centerId: number | null
    serviceId: number | null
    professionalId: string | null
    createdAt: Date
    end: Date
    updatedAt: Date
    center: { name: string } | null
    professional: { name: string } | null
    senior: {
        name: string,
        rsh: RSH | null,
        birthDate: Date,
        sector: {
            name: string
        } | null
    } | null
    service: { name: string } | null


}

export const generarExcel = async (datos: EventPrismaResult[]): Promise<Buffer> => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Reporte')
  
    // Definir columnas
    const columnas = [
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Horario', key: 'horario', width: 20 },
        { header: 'Centro', key: 'centro', width: 30 },
        { header: 'Profesional', key: 'profesional', width: 25 },
        { header: 'Servicio', key: 'servicio', width: 20 },
        { header: 'Persona Mayor', key: 'personaMayor', width: 25 },
        { header: 'Asistencia', key: 'asistencia', width: 15 },
        { header: 'RSH', key: 'rsh', width: 15 },
        { header: 'Edad', key: 'edad', width: 10 },
        { header: 'Sector', key: 'sector', width: 30 },

    ]
  
    worksheet.columns = columnas
  
    // Agregar filas con datos
    datos.forEach((dato) => {
        worksheet.addRow({
            fecha: dato.start.toISOString().split('T')[0],
            horario: `${dato.start.toISOString().split('T')[1].slice(0, 5)} - ${dato.end.toISOString().split('T')[1].slice(0, 5)}`,
            centro: dato.center?.name || "", // Convierte el ID del centro a un nombre
            profesional: dato.professional?.name || '',
            servicio: dato.service?.name || "", // Convierte el ID del servicio a un nombre
            personaMayor: dato.senior?.name || '',
            rsh: dato.senior?.rsh ? rshParser(dato.senior?.rsh) : '',
            edad: dayjs().diff(dayjs(dato.senior?.birthDate), "year") || '',
            sector: dato.senior?.sector?.name || '',
            asistencia: dato.assistance ? 'Sí' : 'No',
      })
    })
  
    // Estilo del encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } } // Texto blanco
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '046c4e' }, // Fondo verde oscuro
      }
    })
  
    // Estilo de las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
  
        if (rowNumber !== 1) {
          cell.font = { color: { argb: 'FF000000' } } // Texto negro
        }
      })
  
      // Alternar colores de fila
      if (rowNumber % 2 === 0 && rowNumber !== 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: "b8daba" }, // Fondo verde claro
          }
        })
      }
    })
  
    // Ajustar el alto de las filas
    worksheet.eachRow((row) => {
      row.height = 20
    })
  
    // Generar archivo como buffer
    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
}
