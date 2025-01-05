import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { Table } from "@/components/Table"
import { ConfirmAction } from "@/components/ConfirmAction"
import { CreateProfessional } from "@/components/forms/create/Professional"
import { UpdateProfessional } from "@/components/forms/update/Professional"

import { message } from "antd"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { useNavigate } from "react-router-dom"
import { Professional } from "@/lib/types"
import { ProfessionalColumns } from "@/lib/columns"
import { deleteProfessional, getProfessionals } from "@/lib/actions"

const ProfessionalsPage: React.FC = () => {
	const [professionals, setProfessionals] = useState<Professional[]>([])
	const navigate = useNavigate()

	const { error, loading, data } = useRequest<Professional[]>({
		action: getProfessionals,
		onSuccess: (data) => setProfessionals(data),
	})

	if (error) message.error("Error al cargar los datos")

	const handleHistory = (professional: Professional) => {
		navigate(`/historial?id=${professional.id}`, {
			state: { type: "professional", data: professional },
		})
	}

	return (
		<PageLayout
			pageTitle="Profesionales"
			create={true}
			data={data}
			setData={setProfessionals}
			searchKeys={["id", "name", "email"]}
		>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<Table<Professional>
					loading={loading}
					data={professionals}
					onHistory={handleHistory}
					columnsConfig={ProfessionalColumns}
					editable
					deletable
					history
				/>
			</section>

			<CreateProfessional data={professionals} setData={setProfessionals} />
			<UpdateProfessional data={professionals} setData={setProfessionals} />

			<ConfirmAction<Professional>
				text="¿Estás seguro de que deseas eliminar este profesional?"
				data={professionals}
				setData={setProfessionals}
				action={deleteProfessional}
			/>
		</PageLayout>
	)
}

export default ProfessionalsPage
