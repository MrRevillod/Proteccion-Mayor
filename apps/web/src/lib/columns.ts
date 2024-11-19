import { Administrator, Professional, Senior, TableColumnType, UnvalidatedSenior } from "./types"

export const UnvalidatedSeniorsColumns: TableColumnType<UnvalidatedSenior> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Fecha de registro", dataIndex: "createdAt", key: "createdAt" },
]

export const SeniorsColumns: TableColumnType<Partial<Senior>> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Dirección", dataIndex: "address", key: "address" },
	{ title: "Edad", dataIndex: "birthDate", key: "birthDate" },
	{ title: "Verificado", dataIndex: "validated", key: "validated" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
]

export const AdministratorColumns: TableColumnType<Partial<Administrator>> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
	{ title: "Actualizado", dataIndex: "updatedAt", key: "updatedAt" },
]

export const ProfessionalColumns: TableColumnType<Partial<Professional>> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Profesión", dataIndex: ["service", "title"], key: "service.title" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
]

const dataSource = [
	{
		key: "1",
		metric: "Personas atendidas",
		average: "",
		total: "",
	},
	{
		key: "2",
		metric: "Inasistencia",
		average: "",
		total: "",
	},
	{
		key: "3",
		metric: "Horas no reservadas",
		average: "",
		total: "",
	},
]

export const statisticColumns = [
	{
		title: "",
		dataIndex: "metric",
		key: "metric",
	},
	{
		title: "Promedio mensual",
		dataIndex: "average",
		key: "average",
	},
	{
		title: "Total",
		dataIndex: "total",
		key: "total",
	},
]
