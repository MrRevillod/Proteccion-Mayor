import React from "react"
import PageLayout from "../../layouts/PageLayout"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmAction from "../../components/ConfirmAction"

import { Center } from "../../lib/types"
import { message } from "antd"
import { useState } from "react"
import { ImageCard } from "../../components/ui/ImageCard"
import { CardLayout } from "../../components/CardLayout"
import { useRequest } from "../../hooks/useRequest"
import { useNavigate } from "react-router-dom"
import { deleteCenter, getCenters } from "../../lib/actions"

const CentersPage: React.FC = () => {
	const navigate = useNavigate()

	const [centers, setCenters] = useState<Center[]>([])
	const { error, loading, data } = useRequest<Center[]>({
		action: getCenters,
		onSuccess: (centers) => setCenters(centers),
	})

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout
			pageTitle="Centros de atención"
			create
			data={data}
			setData={setCenters}
			searchKeys={["name", "address", "phone"]}
		>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<CardLayout<Center>
					data={centers}
					loading={loading}
					itemsPerPage={6}
					renderCard={(center: Center) => (
						<ImageCard
							key={center.id}
							item={center}
							title={center.name}
							description={center.address}
							other={`Teléfono: ${center.phone}`}
							imagePath={`/centers`}
							deletable
							updatable
							onCardClick={(item) => {
								navigate(`/agenda/administradores?centerId=${item.id}`)
							}}
						/>
					)}
				/>
			</section>

			<CreateCenter data={centers} setData={setCenters} />
			<UpdateCenter data={centers} setData={setCenters} />

			<ConfirmAction<Center>
				text="¿Estás seguro(a) de que deseas eliminar este centro de atención?"
				data={centers}
				setData={setCenters}
				action={deleteCenter}
				requirePasswordConfirmation
			/>
		</PageLayout>
	)
}

export default CentersPage
