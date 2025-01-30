import clsx from "clsx"
import React from "react"

import { Select } from "antd"
import { SuperSelectField } from "@/lib/types"
import { Controller, useFormContext } from "react-hook-form"

interface Props {
	data: SuperSelectField[]
	name: string
	label: string
	placeholder: string
}
export const MultipleSelect: React.FC<Props> = ({ data, name, label, placeholder }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()

	const classes = clsx(
		errors[name] ? "border-red" : "border-gray-dark",
		"rounded-lg text-sm focus:outline-none focus:ring-primary-green",
		"focus:border-primary-green h-10 placeholder-neutral-400",
		"text-dark dark:text-light mb-1 border-1 bg-light dark:bg-primary-dark",
		"w-full",
	)
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold dark:text-light text-dark truncate overflow-hidden whitespace-nowrap">
					{label}
				</label>
				{errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				defaultValue={[]}
				render={({ field }) => (
					<Select
						{...field}
						className={classes}
						mode="multiple"
						options={data}
						placeholder={placeholder}
						onChange={(value) => field.onChange(value)}
						onBlur={field.onBlur}
						value={field.value}
						maxTagCount="responsive"
						maxTagTextLength={10}
						style={{ maxHeight: 200, overflow: "auto" }}
					/>
				)}
			/>
		</div>
	)
}
