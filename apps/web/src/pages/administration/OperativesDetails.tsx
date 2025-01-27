import { Modal } from "@/components/Modal"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useModal } from "@/context/ModalContext"

export const OperativeDetails: React.FC = () => {
	const methods = useForm()
	const { selectedData: operative } = useModal()
	return (
		<Modal type="Other" title={`Detalles del operativo: ${operative?.name}`}>
			<FormProvider {...methods}>
				<div className="space-y-4">
					<p>
						<strong>Nombre:</strong> {operative?.name}
					</p>
					<p>
						<strong>Descripción:</strong> {operative?.description}
					</p>
					<p>
						<strong>Inicio:</strong> {new Date(operative?.start).toLocaleString()}
					</p>
					<p>
						<strong>Fin:</strong> {new Date(operative?.end).toLocaleString()}
					</p>
					<p>
						<strong>Centro de atención:</strong> {operative?.center?.name}
					</p>
					<div>
						<strong>Servicios:</strong>
						<ul>
							{operative?.services?.map((service) => (
								<li key={service.id}>{service.name}</li>
							))}
						</ul>
					</div>
					<div>
						<strong>Profesionales:</strong>
						<ul>
							{operative?.professionals?.map((professional) => (
								<li key={professional.id}>{professional.name}</li>
							))}
						</ul>
					</div>
				</div>
			</FormProvider>
		</Modal>
	)
}
