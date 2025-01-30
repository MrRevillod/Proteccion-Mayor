import clsx from "clsx"
import React from "react"
import dayjs from "dayjs"

import { Dayjs } from "dayjs"
import { DatePicker } from "antd"
import { Controller, useFormContext } from "react-hook-form"

interface DatetimeSelectProps {
	label: string
	name: string
	showTime?: boolean
	defaultValue?: Dayjs
	width?: string
	disabled?: boolean
	disablePast?: boolean    
    onChange?: ((date: Dayjs, dateString: string | string[]) => void)
}

export const DatetimeSelect = ({
	label,
	name,
	showTime = true,
	defaultValue,
	width,
	disabled = false,
    disablePast = false,
    onChange,
}: DatetimeSelectProps) => {
	const {
		control,
		setValue,
		formState: { errors },
	} = useFormContext()

	const classes = clsx(
		errors[name] ? "border-red" : "border-gray-dark",
		"rounded-lg text-sm focus:outline-none focus:ring-primary-green",
		"focus:border-primary-green w-full h-10 placeholder-neutral-400",
		"text-dark dark:text-light mb-1 border-1 bg-light dark:bg-primary-dark",
		width ? width : "w-full",
	)

	const minYear = dayjs().subtract(110, "year").startOf("year")
	const today = dayjs()

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold text-dark dark:text-light">{label}</label>
				{errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
                    <DatePicker
                        
						{...field}
						className={classes}
						showTime={
							showTime && {
								hideDisabledOptions: true,
							}
						}
						disabledTime={(_) => {
							return {
								disabledHours: () => [0, 1, 2, 3, 4, 4, 5, 6, 7, 19, 20, 21, 22, 23],
							}
						}}
						disabledDate={(current) => {
							// Si disablePast es true, deshabilita las fechas pasadas
							if (disablePast && current && current.isBefore(today, "day")) {
								return true
							}
							// Deshabilita fechas antes del mínimo año
							return current && current.isBefore(minYear, "day")
						}}
						showNow={showTime}
						value={field.value ? dayjs(field.value) : null}
						defaultValue={defaultValue ? dayjs(defaultValue) : null}
                        onChange={onChange || ((event) => setValue(name, event ? dayjs(event).toISOString() : null))}
                        disabled={disabled}
					/>
				)}
			/>
		</div>
	)
}
