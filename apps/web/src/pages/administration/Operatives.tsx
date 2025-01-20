import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { message } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Operatives } from "@/lib/types"
import { useRequest } from "@/hooks/useRequest"
import { ImageCard } from "@/components/ui/ImageCard"
import { CardLayout } from "@/components/CardLayout"
import { getOperatives } from "@/lib/actions"

const OperativesPage: React.FC = () => {
	const navigate = useNavigate()
	const [operatives, setOperatives] = useState<Operatives[]>([])

	const { error, loading, data } = useRequest<Operatives[]>({
		action: getOperatives,
		onSuccess: (operatives) => setOperatives(operatives),
	})

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Operativos" data={data} setData={setOperatives} searchKeys={["name"]}>
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
							onCardClick={() => {
								navigate(`/detalles-operativo/${operative.id}`)
							}}
						/>
					)}
				/>
			</section>
		</PageLayout>
	)
}

export default OperativesPage
