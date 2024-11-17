import React from "react"

import { useAuth } from "./AuthContext"
import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { createContext, ReactNode, useState } from "react"

const DASHBOARD_SOCKET_SERVER = `${import.meta.env.VITE_API_URL}/dashboard`

interface SocketState {
	socket: Socket | undefined
}

const SocketContext = createContext<SocketState | undefined>(undefined)

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
	const { user, role, isAuthenticated } = useAuth()
	const [socket, setSocket] = useState<Socket>()

	useEffect(() => {
		if (isAuthenticated && !socket) {
			const newSocket = io(DASHBOARD_SOCKET_SERVER, {
				query: { userId: user?.id, userRole: role },
			})

			newSocket.on("connect", () => { })

			newSocket.on("disconnect", (reason) => {
				if (newSocket.active) {
					console.log("....reconectando socket")
				} else {
					console.log(reason)
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
