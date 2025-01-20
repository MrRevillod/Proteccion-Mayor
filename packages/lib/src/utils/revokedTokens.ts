import { prisma } from "@repo/database"
import dayjs from "dayjs"
import { jwt } from ".."

export const saveRevokedToken = async (token: string) => {
        
    const payload = jwt.verify(token)

    if (!payload || !payload.exp) return
    
    const expires = dayjs(payload.exp * 1000).toDate()
    
    await prisma.revokedToken.create({ data: { token, expiresAt: expires } })
}

export const  isRevokedToken = async (token: string) => {
    const revoked = await prisma.revokedToken.findFirst({ where: { token } })

     return revoked ? true : false
}