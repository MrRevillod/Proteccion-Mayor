import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { message } from "antd"
import { useState } from "react"
import { Operative, Operatives } from "@/lib/types"
import { useRequest } from "@/hooks/useRequest"
import { ImageCard } from "@/components/ui/ImageCard"
import { CardLayout } from "@/components/CardLayout"
import { deleteOperative, getOperatives } from "@/lib/actions"
import { CreateOperative } from "@/components/forms/create/Operative"
import { UpdateOperative } from "@/components/forms/update/Operative"
import { ConfirmAction } from "@/components/ConfirmAction"
import { useModal } from "@/context/ModalContext"
import { OperativeDetails } from "@/components/OperativesDetails"

const OperativesPage: React.FC = () => {
	const [operatives, setOperatives] = useState<Operative[]>([])

	const { showModal } = useModal()

	const { error, loading, data } = useRequest<Operatives>({
		action: getOperatives,
		onSuccess: (operatives) => setOperatives(operatives.formatted),
	})

	if (error) message.error("Error al cargar los datos")
	const { selectedData } = useModal()
	return (
		<PageLayout pageTitle="Operativos" create data={data?.formatted} setData={setOperatives} searchKeys={["name"]}>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<CardLayout<Operative>
					data={operatives}
					loading={loading}
					renderCard={(operative: Operative) => (
						<ImageCard
							key={operative.id}
							item={operative}
							title={operative.name}
							description={operative.description}
							imagePath={`/operatives`}
							deletable
							updatable
							onCardClick={(operative) => showModal("Details", operative)}
						/>
					)}
				/>
			</section>

			<CreateOperative data={operatives} setData={setOperatives} />
			<UpdateOperative data={operatives} setData={setOperatives} />
			<OperativeDetails />

			<ConfirmAction<Operative>
				text="¿Estás seguro(a) de que deseas eliminar este operativo?"
				data={operatives}
				setData={setOperatives}
				action={deleteOperative}
				key={selectedData?.id}
				requirePasswordConfirmation
			/>
		</PageLayout>
	)
}

export default OperativesPage
