import clsx from "clsx"
import React from "react"
import SearchBar from "./SearchBar"

import { Show } from "./ui/Show"
import { useModal } from "../context/ModalContext"
import { AiOutlinePlus } from "react-icons/ai"
import { Dispatch, SetStateAction } from "react"

interface PageHeaderProps {
	pageTitle: string
	create?: boolean
	searchKeys?: string[]
	data?: any[] | null
	setData?: Dispatch<SetStateAction<any[]>>
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle, create, searchKeys, data, setData }) => {
	const { showModal } = useModal()

	return (
		<section className="flex flex-col gap-4 w-full mb-4 px-4 py-4 bg-white rounded-lg shadow-sm">
			<div
				className={clsx(
					"flex w-full gap-4 justify-between",
					data && setData && searchKeys && "flex-col md:flex-row",
					!data && !setData && !searchKeys && "flex-row",
				)}
			>
				<div className="flex flex-col w-full md:w-3/6 xl:w-4/6 gap-2">
					<h1 className="text-2xl font-bold text-dark dark:text-light">{pageTitle}</h1>
					<p className="text-sm text-gray-medium">
						Dirección de personas mayores de la municipalidad de Temuco
					</p>
				</div>

				<div className="flex flex-row gap-4 w-full md:w-3/6 xl:w-2/6 items-center justify-end">
					{data && setData && searchKeys && <SearchBar data={data} setData={setData} keys={searchKeys} />}

					<Show when={create != undefined}>
						<button
							className="bg-primary text-light font-semibold w-1/4 h-10 rounded-lg flex items-center justify-center gap-2"
							onClick={() => create && showModal("Create", null)}
						>
							Nuevo
							<AiOutlinePlus className="text-light text-lg" />
						</button>
					</Show>
				</div>
			</div>
		</section>
	)
}

export default PageHeader
