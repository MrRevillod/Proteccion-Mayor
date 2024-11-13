import React from "react"
import PageLayout from "../../layouts/PageLayout"
import CreateService from "../../components/forms/create/Service"
import UpdateService from "../../components/forms/update/Service"
import ConfirmDelete from "../../components/ConfirmAction"

import { message } from "antd"
import { Service } from "../../lib/types"
import { useState } from "react"
import { useModal } from "@/context/ModalContext"
import { ImageCard } from "../../components/ui/ImageCard"
import { CardLayout } from "../../components/CardLayout"
import { useRequest } from "../../hooks/useRequest"
import { useNavigate } from "react-router-dom"
import { deleteService, getServices } from "../../lib/actions"

const ServicesPage: React.FC = () => {
	const navigate = useNavigate()
	const [services, setServices] = useState<Service[]>([])

	const { error, loading, data } = useRequest<Service[]>({
		action: getServices,
		onSuccess: (data) => setServices(data),
	})

	if (error) message.error("Error al cargar los datos")

	const { selectedData } = useModal()

	return (
		<PageLayout pageTitle="Servicios" create data={data} setData={setServices} searchKeys={["name"]}>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<CardLayout<Service>
					data={services}
					loading={loading}
					renderCard={(service: Service) => (
						<ImageCard
							key={service.id}
							item={service}
							title={service.name}
							description={service.description}
							imagePath={`/services`}
							deletable
							updatable
							onCardClick={() => {
								navigate(`/agenda/administradores?serviceId=${service.id}`)
							}}
						/>
					)}
				/>
			</section>

			<CreateService data={services} setData={setServices} />
			<UpdateService data={services} setData={setServices} />
			<ConfirmDelete<Service>
				text="¿Estás seguro(a) de que deseas eliminar este servicio?"
				data={services}
				setData={setServices}
				action={deleteService}
				key={selectedData?.id}
				requirePasswordConfirmation
			/>
		</PageLayout>
	)
}

export default ServicesPage
