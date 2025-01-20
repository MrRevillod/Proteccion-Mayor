import clsx from "clsx"
import React from "react"

import { Modal as AntDModal } from "antd"
import { ModalType, useModal } from "../context/ModalContext"

import "@/main.css"

interface ModalProps {
	title: string
	type: ModalType
	loading?: boolean
	children: React.ReactNode
	size?: "small" | "middle" | "large"
}

export const Modal: React.FC<ModalProps> = ({ title, type, loading, size, children }) => {
	const { isModalOpen, handleOk, handleCancel, modalType, handleClose } = useModal()

	const modalSizeClass = clsx({
		"modal-small": size === "small",
		"modal-middle": size === "middle",
		"modal-large": size === "large",
	})

	return (
		<AntDModal
			title={title}
			open={isModalOpen && modalType === type}
			onOk={handleOk}
			onCancel={handleCancel}
			closable={true}
			footer={[]}
			onClose={handleClose}
			className={modalSizeClass}
			width={
				size === "small"
					? 400
					: size === "middle"
					? 500
					: size === "large"
					? 800
					: undefined
			}
			style={size === "large" ? { top: 40 } : {}}
			styles={{
				body: {
					transition: "width 0.3s ease-in-out",
					height: size === "large" ? "calc(100vh - 180px)" : "auto",
				},
			}}
		>
			{children}
		</AntDModal>
	)
}
