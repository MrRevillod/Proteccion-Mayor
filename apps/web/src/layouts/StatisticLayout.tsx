import clsx from "clsx"
import React from "react"

import { SuperSelect } from "@/components/ui/SuperSelect"
import { generateMonths, generateYears } from "@/lib/formatters"
import { FormProvider, useForm } from "react-hook-form"
import { SetStateAction, Dispatch, useEffect } from "react"

import "../main.css"
import "dayjs/locale/es"

import dayjs from "dayjs"

dayjs.locale("es")

interface StatisticLayoutProps {
	title?: string
	size?: "sm" | "lg"
	yearSelect?: boolean
	monthSelect?: boolean
	setDate?: Dispatch<SetStateAction<string>>
	reportSelection?: string
	children: React.ReactNode
}

export const StatisticMainLayout: React.FC<StatisticLayoutProps> = ({ children }) => {
	return <div className="flex flex-row gap-4 w-full h-full">{children}</div>
}

export const ChartLayout: React.FC<StatisticLayoutProps> = ({ title, ...props }) => {
	const { size, yearSelect, monthSelect, setDate, reportSelection, children } = props
	const methods = useForm({
		defaultValues: {
			year: dayjs().year().toString(),
			month: dayjs().month() + 1,
		},
	})

	const { watch } = methods

	const year = watch("year") ?? new Date().getFullYear().toString()
	const month = watch("month") ?? new Date().getMonth().toString()

	useEffect(() => {
		const date = `${year}${month && monthSelect ? `-${month.toString().padStart(2, "0")}` : ""}`
		setDate && setDate(date)
	}, [year, month, setDate, reportSelection])

	return (
		<div
			className={clsx(
				size === "sm" && "w-1/4",
				size === "lg" && "w-3/4",
				"flex flex-col gap-4 items-start justify-center bg-white dark:bg-primary-darker rounded-lg p-4",
			)}
		>
			<div className={clsx(size === "lg" && "px-4", "w-full flex flex-row items-center justify-between")}>
				<h2 className="text-xl font-semibold text-dark dark:text-light">{title}</h2>

				<FormProvider {...methods}>
					<form className="w-1/4 flex flex-row gap-4">
						{monthSelect && (
							<div className={yearSelect ? "w-1/2" : "w-full"}>
								<SuperSelect label="" placeholder="Mes" name="month" options={generateMonths()} />
							</div>
						)}
						{yearSelect && (
							<div className={monthSelect ? "w-1/2" : "w-full"}>
								<SuperSelect label="" placeholder="Año" name="year" options={generateYears()} />
							</div>
						)}
					</form>
				</FormProvider>
			</div>
			{children}
		</div>
	)
}
