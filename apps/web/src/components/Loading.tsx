import clsx from "clsx"
import React from "react"
import { Spin } from "antd"

const Spinner: React.FC = () => {
	return (
		<div className="flex items-center justify-center">
			<Spin size="large" />
		</div>
	)
}

export const Loading: React.FC = () => {
	return (
		<div className={clsx("fixed inset-0 z-50 flex items-center justify-center h-screen bg-transparent")}>
			<Spinner />
		</div>
	)
}
