import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import ConfirmAction from "../../components/ConfirmAction"
import UpdateAdministrator from "../../components/forms/update/Administrator"
import CreateAdministrator from "../../components/forms/create/Administrator"

import { message } from "antd"
import { useState } from "react"
import { useRequest } from "../../hooks/useRequest"
import { Administrator } from "../../lib/types"
import { AdministratorColumns } from "../../lib/columns"
import { deleteAdministrator, getAdministrators } from "../../lib/actions"

const AdministratorsPage: React.FC = () => {
	const [administrators, setAdministrators] = useState<Administrator[]>([])

	const { loading, data } = useRequest<Administrator[]>({
		action: getAdministrators,
		onSuccess: (data) => setAdministrators(data),
		onError: () => message.error("Error al cargar los datos"),
	})

	return (
		<PageLayout
			pageTitle="Administradores"
			create={true}
			data={data}
			setData={setAdministrators}
			searchKeys={["id", "name", "email"]}
		>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<DataTable<Administrator>
					editable
					deletable
					loading={loading}
					data={administrators}
					columnsConfig={AdministratorColumns}
				/>
			</section>

			<CreateAdministrator data={administrators} setData={setAdministrators} />
			<UpdateAdministrator data={administrators} setData={setAdministrators} />

			<ConfirmAction<Administrator>
				text="¿Estás seguro(a) de que deseas eliminar este usuario?"
				data={administrators}
				setData={setAdministrators}
				action={deleteAdministrator}
			/>
		</PageLayout>
	)
}

export default AdministratorsPage
