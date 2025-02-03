import { Modal } from "@/components/Modal"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useModal } from "@/context/ModalContext"
import dayjs from "dayjs"

export const OperativeDetails: React.FC = () => {
	const methods = useForm()
	const { selectedData: operative } = useModal()

	if (!operative || !operative.professionals) {
		return
	}

	const groupedProfessionals = operative?.professionals.reduce((acc, professional) => {
		const serviceTitle = professional.service?.title || "Sin servicio"

		if (!acc[serviceTitle]) {
			acc[serviceTitle] = []
		}
		acc[serviceTitle].push(professional)

		return acc
	}, {} as Record<string, any[]>)
	console.log(operative?.start)

	return (
		<Modal type="Details" title={`Detalles del operativo: ${operative?.name}`}>
			<FormProvider {...methods}>
				<div className="space-y-4">
					<p>
						<strong>Descripción:</strong> {operative?.description}
					</p>

					<div className="flex flex-row gap-8">
						<p>
							<strong>Inicio:</strong> {dayjs(operative?.start).format("DD/MM/YYYY - HH:mm")}
						</p>
						<p>
							<strong>Fin:</strong> {dayjs(operative?.end).format("DD/MM/YYYY - HH:mm")}
						</p>
					</div>

					<p>
						<strong>Centro de atención:</strong> {operative?.center?.name}
					</p>

					<div className="flex flex-col gap-4">
						<strong className="text-lg">Servicios y Profesionales:</strong>
						<div className="grid grid-cols-2 gap-8">
							{Object.keys(groupedProfessionals || {}).map((serviceTitle) => (
								<div key={serviceTitle} className="space-y-2">
									<h4 className="text-sm font-semibold">{serviceTitle}:</h4>
									<div className="flex flex-col gap-2">
										{groupedProfessionals[serviceTitle].map((professional) => (
											<p key={professional.id} className="text-sm">
												{professional.name}
											</p>
										))}
									</div>
								</div>

							))
							}
						</div>
					</div>
				</div>
			</FormProvider>
		</Modal>
	)
}
