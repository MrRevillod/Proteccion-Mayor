import React from "react"

import { useMutation } from "@/hooks/useMutation"
import { EventCard } from "@/components/EventCard"
import { reservateEvent } from "@/lib/actions"
import { ReservationStep } from "@/components/ReservationStep"
import { useRouter, useLocalSearchParams } from "expo-router"

const ConfirmEventScreen = () => {
	const router = useRouter()
	const params = useLocalSearchParams()
	const event = JSON.parse(params.event as string)

	const { loading, mutate } = useMutation({
		mutateFn: reservateEvent,
	})

	const handleConfirm = async () => {
		await mutate({
			params: { id: event.id },
			onSuccess: () => {
				router.replace({ pathname: "/(reservation)/final", params: { status: "success" } })
			},
			onError: (error) => {
				const message = error.response?.data?.message || "Error desconocido"
				router.replace({
					pathname: "/(reservation)/final",
					params: { status: "error", message },
				})
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
			<EventCard event={event} />
		</ReservationStep>
	)
}

export default ConfirmEventScreen
