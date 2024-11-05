import { UserRole } from "@repo/lib"
import { Server, Socket } from "socket.io"

// interface Client {
// 	socketId: string
// 	userId: string
// }

// // Diccionario para almacenar los clientes conectados
// const clients: Record<string, Client> = {}

// // Función para agregar un cliente al diccionario
// export const addClient = (client: Client): void => {
// 	clients[client.userId] = client
// }

// // Función para remover un cliente cuando se desconecta
// export const removeClient = (socketId: string): void => {
// 	// Buscar el cliente por socketId y eliminarlo si se encuentra
// 	for (const userId in clients) {
// 		if (clients[userId].socketId === socketId) {
// 			delete clients[userId]
// 			break
// 		}
// 	}
// }

// // Función para encontrar un cliente por userId
// export const getClientByUserId = (userId: string): Client => {
// 	return clients[userId] || "ADMIN"
// }

// // Exportar el diccionario de clientes por si es necesario en otro lugar
// export const getClients = (): Record<string, Client> => clients

export const initSocket = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		const role = socket.handshake.query.userRole as UserRole
		const userId = socket.handshake.query.userId as string

		// Asociar al cliente con su rol (grupo)
		socket.join(role)
		socket.join(userId)

		// Agregar el cliente al diccionario
		//addClient({ socketId: socket.id, userId })

		//console.log("Clientes",getClients())
		// Eliminar el cliente cuando se desconecta
		socket.on("disconnect", () => {
			//  removeClient(socket.id)
			//console.log("Clientes",getClients())
			socket.leave(role)
			socket.leave(userId)
		})
	})
}
