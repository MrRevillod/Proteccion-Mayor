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
	customRightSide?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle, create, ...props }) => {
	const { searchKeys, data, setData, customRightSide } = props
	const { showModal } = useModal()

	return (
		<section className="flex flex-col gap-4 w-full mb-4 px-4 py-4 bg-white dark:bg-primary-dark rounded-lg">
			<div
				className={clsx(
					"flex w-full gap-4 justify-between",
					data && setData && searchKeys && "flex-col md:flex-row",
					!data && !setData && !searchKeys && "flex-row",
				)}
			>
				<div className="flex flex-col w-full md:w-3/6 xl:w-4/6 gap-2">
					<h1 className="text-2xl font-bold text-dark dark:text-light">{pageTitle}</h1>
					<p className="text-sm text-gray-medium dark:text-gray-light truncate overflow-hidden whitespace-nowrap">
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
							<span className="hidden lg:block">Nuevo</span>
							<AiOutlinePlus className="text-light text-lg" />
						</button>
					</Show>

					<Show when={customRightSide != undefined}>{customRightSide}</Show>
				</div>
			</div>
		</section>
	)
}
