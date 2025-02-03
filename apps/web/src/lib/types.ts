import { AxiosResponse } from "axios"
import { GetProp, UploadProps } from "antd"
import { Dispatch, SetStateAction } from "react"

export type HexColor = `#${string}`
export type Nullable<T> = T | null

export type BaseDataType = {
	id: string | number
}

export type UserRole = "ADMIN" | "PROFESSIONAL" | "STAFF" | "FUNCTIONARY"
export type StaffRole = "ADMIN" | "FUNCTIONARY"

export type LoginFormData = {
	email: string
	password: string
	role: UserRole
}

interface IUser {
	id: string
	email: string
	name: string
	createdAt: string
	updatedAt: string
	minutesPerSession?: number
}

export interface Staff extends IUser {
	role: UserRole
	centerId: number | null
}
export interface Professional extends IUser {
	service: Partial<Service>
	serviceId: number
	minutesPerSession: number
}

export type Service = {
	id: number
	name: string
	title: string
	description: string
	color: HexColor
}

export type DailySessions = {
	id: number
	quantity: number
	centerId: number
	serviceId: number
	service: Pick<Service, "id" | "name">
}

export type Center = {
	id: number
	name: string
	address: string
	phone: string
	color: string
	dailySessions: DailySessions[]
}

export interface Senior extends IUser {
	address: string
	birthDate: string
	validated: boolean
	phone: string
	rsh: string
	sectorId: number
	sector: Sector
	registeredBy: string
	registeredByStaff: Partial<Staff>
}

export type UnvalidatedSenior = Omit<Senior, "name" & "address" & "birthDate">
export type User = Staff | Professional

export type ApiResponse = {
	status?: number
	message: string
	type: "success" | "error"
	values: any
}

export type PasswordFields = {
	password: string
	confirmPassword: string
}

export type TableColumnType<T> = Array<{
	title: string
	dataIndex: keyof T | string[]
	key: string
	sorter?: (a: T, b: T) => number
}>

export type FormProps<T> = {
	data: T[] | T
	setData?: Dispatch<SetStateAction<T[]>>
	refetch?: () => void
}

export type Event = {
	id: string
	start: string
	end: string
	assistance: boolean
	backgroundColor: HexColor
	title: string

	seniorId?: string | null
	professionalId: string
	centerId?: number | null
	serviceId?: number | null

	service?: Partial<Service>
	center?: Partial<Center>
	senior?: Partial<Senior>
	professional?: Partial<Professional>

	createdAt: Date
	updatedAt: Date
}

export type Events = {
	formatted: Event[]
	byId: Record<string, Event>
}

export type Sector = {
	id: number
	name: string
	createAt: string
	updateAt: string
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]
export type ApiError = string | string[] | null

export type QueryAction = ({ params, query }: QueryActionProps) => Promise<AxiosResponse<any, any>>
export type MutateAction = ({ id, body }: MutateActionProps) => Promise<AxiosResponse<any, any>>

export interface QueryActionProps {
	params?: Record<string, any>
	query?: string
}

export interface MutateActionProps {
	id?: string | number
	body?: any
}

export type MutationResponse<T> = {
	modified: T
	image?: string
}

export type SuperSelectField = {
	label: string
	value: string
}

export type ReportType = "general" | "byService" | "byCenter" | "byProfessional"
export type AssistanceType = "assistance" | "absence" | "unreserved"

export type Operative = {
	id: number
	name: string
	description: string
	start: string
	end: string
	professionals: Partial<Professional>[]
	services: Pick<Service, "id" | "name">[]
	center: Partial<Center>
	centerId: number
}

export type Operatives = {
	formatted: Operative[]
	byId: Record<number, Operative>
}

export const RSH = {
	RSH_0_40: "0-40%",
	RSH_41_50: "41-50%",
	RSH_51_60: "51-60%",
	RSH_61_70: "61-70%",
	RSH_71_80: "71-80%",
	RSH_81_90: "81-90%",
	RSH_91_100: "91-100%",
}







export type Splitted = { [key: string]: { assistance: number, absence: number, unreserved: number } }

export type reportHead = {
	from: string,
	to: string,
	centerName: string,
	serviceName: string,
	professionalName: string,
}

export type ProfessionalTableRow = {
	id: string,
	professionalName: string,
	assistance: number,
	absence: number,
	unreserved: number,
	total: number
}

export type Report = {
	head: reportHead
	assistance: [number, number][]
	absence: [number, number][]
	unreserved: [number, number][]
	splitted: {
		center: Splitted
		service: Splitted
		professional: Splitted
	}

}

export type StatisticResponse = {
	report: Report[]

}