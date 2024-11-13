import React from "react"
import DataTable from "@/components/Table"
import PageLayout from "@/layouts/PageLayout"
import CreateSenior from "@/components/forms/create/Senior"
import UpdateSenior from "@/components/forms/update/Senior"
import ConfirmAction from "@/components/ConfirmAction"

import { Senior } from "@/lib/types"
import { message } from "antd"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { useNavigate } from "react-router-dom"
import { SeniorsColumns } from "@/lib/columns"
import { deleteSenior, getSeniors } from "@/lib/actions"

const SeniorsPage: React.FC = () => {
	const [seniors, setSeniors] = useState<Senior[]>([])
	const navigate = useNavigate()

	const { error, loading, data } = useRequest<Senior[]>({
		action: getSeniors,
		query: "validated=1",
		onSuccess: (data) => setSeniors(data),
	})

	if (error) message.error("Error al cargar los datos")

	const handleHistory = (senior: Senior) => {
		navigate(`/historial?id=${senior.id}`, {
			state: { type: "senior", data: senior },
		})
	}

	return (
		<PageLayout
			pageTitle="Personas mayores"
			create
			data={data}
			setData={setSeniors}
			searchKeys={["id", "name", "email"]}
		>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<DataTable<Senior>
					data={seniors}
					columnsConfig={SeniorsColumns}
					editable
					deletable
					history
					onHistory={handleHistory}
					loading={loading}
					viewable={false}
				/>
			</section>

			<CreateSenior data={seniors} setData={setSeniors} />
			<UpdateSenior data={seniors} setData={setSeniors} />

			<ConfirmAction<Senior>
				text="¿Estás seguro(a) de que deseas eliminar esta persona mayor?"
				data={seniors}
				setData={setSeniors}
				action={deleteSenior}
			/>
		</PageLayout>
	)
}

export default SeniorsPage
