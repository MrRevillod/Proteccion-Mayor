import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { Table } from "@/components/Table"
import { ConfirmAction } from "@/components/ConfirmAction"
import { UpdateStaff } from "@/components/forms/update/Staff"
import { CreateStaff } from "@/components/forms/create/Administrator"

import { message } from "antd"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { Staff } from "@/lib/types"
import {  StaffColumns } from "@/lib/columns"
import { deleteStaff, getStaff } from "@/lib/actions"

const StaffPage: React.FC = () => {
	const [staff, setStaff] = useState<Staff[]>([])

	const { loading, data } = useRequest<Staff[]>({
		action: getStaff,
		onSuccess: (data) => setStaff(data),
		onError: () => message.error("Error al cargar los datos"),
	})

	return (
		<PageLayout
			pageTitle="Funcionarios"
			create={true}
			data={data}
			setData={setStaff}
			searchKeys={["id", "name", "email"]}
		>
			<section className="w-full bg-white dark:bg-primary-dark p-4 rounded-lg">
				<Table<Staff>
					editable
					deletable
					loading={loading}
					data={staff}
					columnsConfig={StaffColumns}
				/>
			</section>

			<CreateStaff data={staff} setData={setStaff} />
			<UpdateStaff data={staff} setData={setStaff} />

			<ConfirmAction<Staff>
				text="¿Estás seguro(a) de que deseas eliminar este usuario?"
				data={staff}
				setData={setStaff}
				action={deleteStaff}
			/>
		</PageLayout>
	)
}

export default StaffPage
