import React from "react"

import { useAuth } from "./AuthContext"
import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { createContext, ReactNode, useState } from "react"

interface SocketState {
	socket: Socket | undefined
}

const SocketContext = createContext<SocketState | undefined>(undefined)

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
	const { user, role, isAuthenticated } = useAuth()
	const [socket, setSocket] = useState<Socket>()

	useEffect(() => {
		if (isAuthenticated && !socket) {
			const newSocket = io(import.meta.env.DASHBOARD_SERVICE_URL || "http://localhost:5000", {
				query: { userId: user?.id, userRole: role },
			})

			newSocket.on("connect", () => {
				console.log("Socket conectado:", newSocket)
			})

			newSocket.on("disconnect", (reason) => {
				if (newSocket.active) {
					console.log("....reconectando socket")
				} else {
					// La conexión se cerró forzosamente por el cliente o el servidor
					// para volver a conectar se debe ejecutar`socket.connect()`
					console.log(reason) //Ver https://socket.io/docs/v4/client-socket-instance#disconnect
				}
			})

			setSocket(newSocket)
		}
	}, [user, role, isAuthenticated])

	return <SocketContext.Provider value={{ socket: socket }}>{children}</SocketContext.Provider>
}

export const useSocket = (): SocketState => {
	const context = React.useContext(SocketContext)
	if (!context) {
		throw new Error("useSocket debe ser utilizado dentro de un SocketProvider")
	}
	return context
}

export default SocketContext
