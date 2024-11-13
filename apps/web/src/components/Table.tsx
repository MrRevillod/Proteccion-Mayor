import React from "react"

import { useModal } from "../context/ModalContext"
import { Table, Space } from "antd"
import { tableColumnsFormatters } from "../lib/formatters"
import { BaseDataType, TableColumnType } from "../lib/types"
import { AiFillEdit, AiFillDelete, AiFillEye, AiOutlineHistory } from "react-icons/ai"

interface TableProps<T> {
	data: T[]
	columnsConfig: TableColumnType<T>
	loading?: boolean
	viewable?: boolean
	history?: boolean
	editable?: boolean
	deletable?: boolean
	onView?: (record: T) => void
	onHistory?: (record: T) => void
}

const DataTable = <T extends BaseDataType>({ data, ...props }: TableProps<T>) => {
	const { columnsConfig, loading, editable, deletable, viewable, onView, onHistory } = props
	const { showModal } = useModal()

	return (
		<Table
			loading={loading}
			dataSource={data}
			rowKey={(record) => record.id}
			size="middle"
			pagination={{ size: "default" }}
		>
			{columnsConfig.map((col) => (
				<Table.Column
					key={col.key}
					title={col.title}
					dataIndex={col.dataIndex as string}
					render={(value: any) => {
						if (tableColumnsFormatters[col.key as keyof typeof tableColumnsFormatters]) {
							const colKey = col.key as keyof typeof tableColumnsFormatters
							return tableColumnsFormatters[colKey](value as never)
						}

						return value
					}}
				/>
			))}

			<Table.Column
				title="Administrar"
				key="action"
				render={(_, record: T) => (
					<Space size="large">
						{editable && (
							<a title="Editar" onClick={() => showModal("Edit", record)}>
								<AiFillEdit className="text-primary dark:text-light text-md font-light h-6 w-6" />
							</a>
						)}
						{deletable && (
							<a title="Eliminar" onClick={() => showModal("Confirm", record)}>
								<AiFillDelete className="text-red dark:text-light text-md font-light h-6 w-6" />
							</a>
						)}
						{history && onHistory && (
							<a title="Historial" onClick={() => onHistory(record)}>
								<AiOutlineHistory className="text-blue dark:text-light text-md font-light h-6 w-6" />
							</a>
						)}
						{viewable && onView && (
							<a title="Ver" onClick={() => onView(record)}>
								<AiFillEye className="text-blue dark:text-light text-md font-light h-6 w-6" />
							</a>
						)}
					</Space>
				)}
			/>
		</Table>
	)
}

export default DataTable
