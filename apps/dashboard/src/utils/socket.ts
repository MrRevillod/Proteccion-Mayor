import { UserRole } from "@repo/lib"
import { Server, Socket } from "socket.io"

export const initSocket = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		const role = socket.handshake.query.userRole as UserRole
		const userId = socket.handshake.query.userId as string

		socket.join(role)
		socket.join(userId)

		socket.on("disconnect", () => {
			socket.leave(role)
			socket.leave(userId)
		})
	})
}
