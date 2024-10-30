import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { api } from "@/lib/axios"

const SeniorHistoryRequestPage: React.FC = () => {
	return (
		<PageLayout pageTitle="Historial personal" searchKeys={[""]}>
			<h1>History</h1>
		</PageLayout>
	)
}

export default SeniorHistoryRequestPage
