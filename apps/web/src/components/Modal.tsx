import clsx from "clsx"
import React from "react"

import { Modal as AntDModal } from "antd"
import { ModalType, useModal } from "@/context/ModalContext"

import "@/main.css"

interface ModalProps {
	title: string
	type: ModalType
	loading?: boolean
	children: React.ReactNode
	size?: "small" | "middle" | "large"
	hasDailySessions?: boolean
}

export const Modal: React.FC<ModalProps> = ({ title, type, loading, size, children, hasDailySessions = false }) => {
	const { isModalOpen, handleOk, handleCancel, modalType, handleClose } = useModal()

	const modalSizeClass = clsx({
		"modal-small": size === "small",
		"modal-middle": size === "middle",
		"modal-large": size === "large",
		"modal-expand": hasDailySessions,
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
			width={size === "small" ? 400 : size === "middle" ? 500 : size === "large" ? 800 : undefined}
			style={size === "large" ? { top: 40 } : {}}
			styles={{
				body: {
					transition: "height 0.3s ease-in-out, opacity 0.2s ease-in-out",
					height: hasDailySessions ? "calc(100vh - 180px)" : "auto",
					overflow: "hidden",
					opacity: hasDailySessions ? 1 : 0.95,
				},
			}}
		>
			{children}
		</AntDModal>
	)
}
