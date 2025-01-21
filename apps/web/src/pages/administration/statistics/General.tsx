import { StatisticSelection } from "@/components/StatisticSelection"
import PageLayout from "@/layouts/PageLayout"
import React from "react"
import { useState } from "react"

const GeneralStatisticsPage: React.FC = () => {
    const [from, setFrom] = useState<string>("")
    const [to, setTo] = useState<string>("")


    return (
        <PageLayout
            pageTitle="Reporte general del sistema"
            customRightSide={<div />}
        >
            <p>Hola</p>
        </PageLayout>
    )
}

export default GeneralStatisticsPage