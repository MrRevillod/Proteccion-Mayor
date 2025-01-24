import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { message } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Operatives } from "@/lib/types"
import { useRequest } from "@/hooks/useRequest"
import { ImageCard } from "@/components/ui/ImageCard"
import { CardLayout } from "@/components/CardLayout"
import { deleteOperative, getOperatives } from "@/lib/actions"
import { CreateOperative } from "@/components/forms/create/Operative"
import { UpdateOperative } from "@/components/forms/update/Operative"
import { ConfirmAction } from "@/components/ConfirmAction"
import { useModal } from "@/context/ModalContext"

const OperativesPage: React.FC = () => {
	const navigate = useNavigate()
	const [operatives, setOperatives] = useState<Operatives[]>([])

	const { error, loading, data } = useRequest<Operatives[]>({
		action: getOperatives,
		onSuccess: (operatives) => setOperatives(operatives),
	})

	if (error) message.error("Error al cargar los datos")
	const { selectedData } = useModal()
	return (
		<PageLayout pageTitle="Operativos" create data={data} setData={setOperatives} searchKeys={["name"]}>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<CardLayout<Operatives>
					data={operatives}
					loading={loading}
					renderCard={(operative: Operatives) => (
						<ImageCard
							key={operative.id}
							item={operative}
							title={operative.name}
							description={operative.description}
							imagePath={`/operatives`}
							deletable
							updatable
							onCardClick={() => {
								navigate(`/detalles-operativo/${operative.id}`)
							}}
						/>
					)}
				/>
			</section>
			<CreateOperative data={operatives} setData={setOperatives} />
			<UpdateOperative data={operatives} setData={setOperatives} />
			<ConfirmAction<Operatives>
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
