import React from "react"

import { useAuth } from "./AuthContext"
import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { createContext, ReactNode, useState } from "react"

interface SocketState {
	socket: Socket | undefined
	eventListener: (event: string | string[], callback: (...args: any[]) => void) => void
}

const SocketContext = createContext<SocketState | undefined>(undefined)

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
	const { user, role, isAuthenticated } = useAuth()
	const [socket, setSocket] = useState<Socket>()

	const eventListener = (event: string | string[], callback: (...args: any[]) => void) => {
		if (event instanceof Array) {
			event.forEach((e) => {
				socket?.off(e)
				socket?.on(e, callback)
			})
		} else {
			socket?.off(event)
			socket?.on(event, callback)
		}
	}

	useEffect(() => {
		if (isAuthenticated && !socket) {
			const newSocket = io({
				path: "/api/dashboard/socket.io",
				query: { userId: user?.id, userRole: role },
				transports: ["websocket"],
			})

			setSocket(newSocket)
		}
	}, [user, role, isAuthenticated])

	return <SocketContext.Provider value={{ socket: socket, eventListener }}>{children}</SocketContext.Provider>
}

export const useSocket = (): SocketState => {
	const context = React.useContext(SocketContext)
	if (!context) {
		throw new Error("useSocket debe ser utilizado dentro de un SocketProvider")
	}
	return context
}

export default SocketContext
