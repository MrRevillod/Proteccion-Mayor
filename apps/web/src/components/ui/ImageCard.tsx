import clsx from "clsx"
import React from "react"

import { useModal } from "../../context/ModalContext"
import { IMAGE_BASE_URL } from "../../lib/axios"
import { useEffect, useState } from "react"
import { MenuProps, Dropdown } from "antd"

interface ImageCardProps {
	title: string
	other?: string
	description: string
	imagePath?: string
	updatable?: boolean
	deletable?: boolean
	dailySessions?: boolean
	item: any
	onCardClick?: (item: any) => void
}

export const ImageCard = ({ imagePath, title, description, other, ...props }: ImageCardProps) => {
	const { updatable, deletable, item, onCardClick, dailySessions } = props

	const [imageSrc, setImagePath] = useState<string>(
		`${IMAGE_BASE_URL}${imagePath}/${item.id}.webp`
	)
	const { showModal, cachedData, modalType, isModalOpen } = useModal()

	useEffect(() => {
		if (!isModalOpen && modalType === "Edit" && cachedData?.id === item?.id) {
			setImagePath(`${imageSrc}?${Date.now()}`)
		}
	}, [isModalOpen, cachedData])

	const menuItems: MenuProps["items"] = [
		updatable && {
			key: "edit",
			label: <span onClick={() => showModal("Edit", item)}>Editar</span>,
		},
		deletable && {
			key: "delete",
			label: <span onClick={() => showModal("Confirm", item)}>Eliminar</span>,
		},
		dailySessions && {
			key: "dailySessions",
			label: <span onClick={() => showModal("Other", item)}>Atenciones diarias</span>,
		},
	].filter(Boolean) as MenuProps["items"]

	const cardClasses = clsx(
		onCardClick &&
			"cursor-pointer hover:shadow-xl hover:bg-opacity-75 transition-transform transform hover:-translate-y-1 duration-300 ease-in-out",
		"relative overflow-hidden bg-opacity-50 rounded-lg shadow-lg max-w-2xl mx-auto w-full max-h-[280px]"
	)

	return (
		<Dropdown trigger={["contextMenu"]} menu={{ items: menuItems }} placement="bottomRight">
			<div className={cardClasses} onClick={() => onCardClick && onCardClick(item)}>
				<div
					className="absolute inset-0 bg-cover bg-center z-0"
					style={{ backgroundImage: `url(${imageSrc})` }}
					aria-hidden="false"
				/>
				<div className="-mt-4 relative bg-black bg-opacity-50 min-h-[300px] p-8 flex flex-col justify-end z-10">
					<div className="flex flex-row justify-between items-center w-full">
						<h2 className="text-3xl font-bold text-white mb-2 truncate" title={title}>
							{title}
						</h2>
					</div>
					<p className="text-gray-light mb-4 line-clamp-3">{description}</p>
					{other && <p className="text-gray-light">{other}</p>}
				</div>
			</div>
		</Dropdown>
	)
}
