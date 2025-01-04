import EventEmitter from "eventemitter3"

export const eventEmitter = new EventEmitter()

export const emitEvent = (eventName: string, payload?: any) => {
	eventEmitter.emit(eventName, payload)
}

export const subscribeToEvent = (eventName: string, callback: (payload?: any) => void) => {
	eventEmitter.on(eventName, callback)
	return () => eventEmitter.off(eventName, callback)
}
