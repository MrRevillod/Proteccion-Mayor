import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useModal } from "@/context/ModalContext"
import { useEffect, useState } from "react"
import { updateDailySessions } from "@/lib/actions"
import { FormProvider, useForm } from "react-hook-form"
import { Center, DailySessions, FormProps } from "@/lib/types"

export const UpdateDailySessions: React.FC<FormProps<Center>> = ({ refetch }) => {
	const [loading, setLoading] = useState(false)
	const [dailySessions, setDailySessions] = useState<DailySessions[]>([])

	const methods = useForm({ resolver: undefined })

	const { selectedData } = useModal()

	useEffect(() => {
		if (selectedData) {
			setDailySessions(selectedData.dailySessions)
			selectedData.dailySessions.forEach((dailySession: DailySessions) => {
				methods.setValue(`${dailySession.id}`, dailySession.quantity)
			})
		}
	}, [selectedData])

	return (
		<Modal
			type="Other"
			loading={loading}
			title={`Número de atenciones diarias ${selectedData?.name}`}
		>
			<FormProvider {...methods}>
				<Form
					actionType="update"
					refetch={refetch}
					setLoading={setLoading}
					action={updateDailySessions}
				>
					<p>
						<strong>Nota:</strong> El número de atenciones diarias está relacionado a la
						cantidad de atenciones que realizará un profesional del servicio
						seleccionado en el centro de atención.
					</p>
					{dailySessions.map((dailySession) => (
						<div key={dailySession.id} className="flex items-center w-full bg-blue-800">
							<h3 className="text-sm font-semibold w-3/4">
								{`Servicio de ${dailySession.service?.name}`}
							</h3>
							<div className="w-1/4">
								<Input
									type="number"
									label=""
									name={dailySession.id.toString()}
									minNumber={0}
									maxNumber={180}
									defaultValue={dailySession.quantity}
								/>
							</div>
						</div>
					))}
				</Form>
			</FormProvider>
		</Modal>
	)
}
