import React from "react"

import { useMutation } from "@/hooks/useMutation"
import { EventConfirm } from "@/components/EventConfirm"
import { reservateEvent } from "@/lib/actions"
import { ReservationStep } from "@/components/ReservationStep"
import { useLocalSearchParams } from "expo-router"

const ConfirmEventScreen = () => {
	const params = useLocalSearchParams()
	const event = JSON.parse(params.event as string)

	const { loading, mutate } = useMutation({
		mutateFn: reservateEvent,
	})

	const handleConfirm = async () => {
		await mutate({
			params: { id: event.id },
			onSuccess: () => {
				console.log("Cita reservada")
			},
			onError: (error) => {
				console.log("Error al reservar cita: ", error)
			},
		})
	}

	return (
		<ReservationStep
			title="Confirmar cita:"
			description="Revise los datos de la cita y confirme para reservar su hora."
			currentStep={5}
			continueHandler={() => handleConfirm()}
			loading={loading}
		>
			<EventConfirm event={event} />
		</ReservationStep>
	)
}

export default ConfirmEventScreen
