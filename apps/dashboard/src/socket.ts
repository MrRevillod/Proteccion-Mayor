import { Event } from "@prisma/client"

type EventName = `event:${string}`
export type SocketEvents = Record<EventName, (data: Event) => void>

export interface ServerToClientEvents {
	newEvent: (event: Event) => void
	deletedEvent: (event: Event) => void
	updatedEvent: (event: Event) => void
}
