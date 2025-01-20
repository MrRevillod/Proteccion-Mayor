import React from "react"
import { Radio } from "antd"
import { Controller, useFormContext } from "react-hook-form"

type Opt = {
	value: Boolean
	label: String
}

type Props = {
	name: string
	options: Array<Opt>
    disabled?: boolean
}

export const BooleanSelect: React.FC<Props> = ({ name, options, disabled = false }) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Radio.Group
					value={field.value}
					defaultValue={field.value}
                    onChange={(ev) => field.onChange(ev.target.value)}
                    disabled={disabled}
				>
					{options.map((op, index) => (
						<Radio.Button key={index} value={op.value}>
							{op.label}
						</Radio.Button>
					))}
				</Radio.Group>
			)}
		></Controller>
	)
}
