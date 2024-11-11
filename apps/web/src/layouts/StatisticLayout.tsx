import React from "react"

import "../main.css"
import clsx from "clsx"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { FormProvider, useForm } from "react-hook-form"

interface StatisticLayoutProps {
	title?: string
	size?: "sm" | "lg"
	yearSelect?: boolean
	children: React.ReactNode
}

const StatisticMainLayout: React.FC<StatisticLayoutProps> = ({ children }) => {
	return <div className="flex flex-row gap-4 w-full h-full">{children}</div>
}

const ChartLayout: React.FC<StatisticLayoutProps> = ({ title, size, yearSelect = false, children }) => {
	const methods = useForm({})
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

				{yearSelect && (
					<FormProvider {...methods}>
						<form className="w-1/6">
							<SuperSelect
								label=""
								placeholder="Año"
								name="year"
								options={[
									{ label: "2021", value: "2021" },
									{ label: "2020", value: "2020" },
									{ label: "2019", value: "2019" },
								]}
							/>
						</form>
					</FormProvider>
				)}
			</div>
			{children}
		</div>
	)
}

export { StatisticMainLayout, ChartLayout }
