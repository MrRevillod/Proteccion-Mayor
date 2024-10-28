import React from "react"
import DataTable from "../../../components/Table"
import PageLayout from "../../../layouts/PageLayout"

import { message } from "antd"
import { useState } from "react"
import { useRequest } from "../../../hooks/useRequest"
import { getSeniors } from "../../../lib/actions"
import { useNavigate } from "react-router-dom"
import { Senior, UnvalidatedSenior } from "../../../lib/types"
import { UnvalidatedSeniorsColumns } from "../../../lib/columns"

const NewSeniorsPage: React.FC = () => {
	const [seniors, setSeniors] = useState<Senior[]>([])
	const navigate = useNavigate()

	const { error, loading } = useRequest<Senior[]>({
		action: getSeniors,
		query: "validated=0",
		onSuccess: (data) => setSeniors(data),
	})

	if (error) message.error("Error al cargar los datos")

	const handleView = (senior: UnvalidatedSenior) => {
		navigate(`/administracion/personas-mayores/solicitud-de-registro`, {
			state: { senior },
		})
	}

	return (
		<PageLayout pageTitle="Solicitudes de registro de personas mayores">
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<DataTable<UnvalidatedSenior>
					data={seniors}
					loading={loading}
					onView={handleView}
					viewable
					columnsConfig={UnvalidatedSeniorsColumns}
				/>
			</section>
		</PageLayout>
	)
}

export default NewSeniorsPage
