import React from "react"
import { Checkbox } from "antd"

interface AssistanceSelectionProps {
	assistanceSelection: string[]
	setSelection: (selection: string) => void
}

export const AssistanceSelection: React.FC<AssistanceSelectionProps> = ({ assistanceSelection, setSelection }) => {
	return (
		<div className="flex flex-row gap-8 w-full items-center justify-center">
			<div className="flex flex-row gap-2 items-center">
				<div className="h-3 w-3 bg-primary rounded-full"></div>
				<label className="dark:text-light text-dark">Asistencia</label>
				<Checkbox
					checked={assistanceSelection.includes("assistance")}
					onChange={() => setSelection("assistance")}
				/>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<div className="h-3 w-3 bg-red rounded-full"></div>
				<label className="dark:text-light text-dark">Inasistencia</label>
				<Checkbox checked={assistanceSelection.includes("absence")} onChange={() => setSelection("absence")} />
			</div>
			<div className="flex flex-row gap-2 items-center">
				<div className="h-3 w-3 bg-sky-600 rounded-full"></div>
				<label className="dark:text-light text-dark">No reservado</label>
				<Checkbox
					checked={assistanceSelection.includes("unreserved")}
					onChange={() => setSelection("unreserved")}
				/>
			</div>
		</div>
	)
}
