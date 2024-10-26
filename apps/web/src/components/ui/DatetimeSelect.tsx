import clsx from "clsx"
import React from "react"
import dayjs from "dayjs"

import "react-datetime/css/react-datetime.css"

import { Dayjs } from "dayjs"
import { DatePicker } from "antd"
import { Controller, useFormContext } from "react-hook-form"

interface DatetimeSelectProps {
	label: string
	name: string
	showTime?: boolean
	defaultValue?: Dayjs
}

const DatetimeSelect = ({ label, name, showTime = true, defaultValue }: DatetimeSelectProps) => {
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
	)

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<DatePicker
						{...field}
						className={classes}
						showTime={showTime}
						value={field.value ? dayjs(field.value) : null}
						defaultValue={defaultValue ? dayjs(defaultValue) : null}
						onChange={(event) => setValue(name, event ? dayjs(event).toISOString() : null)}
					/>
				)}
			/>
		</div>
	)
}

export default DatetimeSelect
