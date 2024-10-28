import React from "react"
import PageHeader from "../components/PageHeader"

import { Helmet } from "react-helmet"
import { Fragment, Dispatch, ReactNode, SetStateAction } from "react"

interface PageLayoutProps {
	pageTitle: string
	create?: boolean
	searchKeys?: string[]
	data?: any[] | null
	setData?: Dispatch<SetStateAction<any[]>>
	children: ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageTitle, create, data, searchKeys, setData, children }) => {
	return (
		<Fragment>
			<Helmet>
				<title>{pageTitle} - Dirección de personas mayores de la municipalidad de Temuco</title>
			</Helmet>
			<section className="pt-8 px-20 flex flex-col gap-2 w-full">
				<PageHeader
					pageTitle={pageTitle}
					create={create}
					searchKeys={searchKeys}
					data={data}
					setData={setData}
				/>
				<section className="w-full dark:bg-primary-dark rounded-lg">{children}</section>
			</section>
		</Fragment>
	)
}

export default PageLayout
