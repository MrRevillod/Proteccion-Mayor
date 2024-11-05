import clsx from "clsx"
import React from "react"

import { Select } from "antd"
import { Dispatch, SetStateAction } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface SuperSelectProps {
	name: string
	label: string
	options: any
	setSearch?: Dispatch<SetStateAction<string>>
	defaultValue?: any
	placeholder?: string
}

export const SuperSelect = ({ name, label, options, setSearch, placeholder }: SuperSelectProps) => {
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

	const clientFilterFn = (input: string, option: any) => {
		return (option?.label as string).toLowerCase().includes(input.toLowerCase())
	}

	const filterOption = setSearch ? false : clientFilterFn

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold dark:text-light text-dark">{label}</label>
				{errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value}
						className={classes}
						showSearch
						placeholder={placeholder ? placeholder : `Seleccione una opción`}
						options={options}
						filterOption={filterOption}
						onSearch={(value) => {
							setSearch && setSearch(value)
						}}
						onChange={(value) => {
							field.onChange(value)
						}}
						allowClear={true}
					/>
				)}
			/>
		</div>
	)
}
