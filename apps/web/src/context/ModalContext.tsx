import React from "react"

import { Nullable } from "@/lib/types"
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

export type ModalType = "Create" | "Edit" | "Confirm"

// Contexto para manejar los modales.
// Se utiliza un contexto ya que los modales pueden
// ser abiertos desde cualquier parte de la aplicación web

interface ModalContextProps {
	isModalOpen: boolean
	showModal: (type: ModalType, data: any) => void
	handleOk: () => void
	handleCancel: () => void
	handleClose: () => void
	handleDelete: () => void
	modalType: Nullable<ModalType>
	selectedData: any
	setSelectedData: Dispatch<SetStateAction<any>>
	cachedData: any
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

// isModalOpen: Indica si el modal está abierto o no
// modalType: Tipo de modal a mostrar
// selectedData: Datos seleccionados
// setSelectedData: Función para actualizar los datos seleccionados
// cachedData: Datos en caché (lo mismo que selectedData pero sin eliminar al cerrar el modal)

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalType, setModalType] = useState<Nullable<ModalType>>(null)
	const [selectedData, setSelectedData] = useState<any>(null)
	const [cachedData, setCachedData] = useState<any>(null)

	// showModal: Función que abre el modal. Recibe el tipo de modal y los datos a mostrar
	const showModal = (type: ModalType, data: any) => {
		setSelectedData(null)
		setModalType(type)
		setSelectedData(data)
		setCachedData(data)
		setIsModalOpen(true)
	}

	// handleOk: Función que se ejecuta al hacer click en el botón de aceptardel modal
	const handleOk = () => {
		setCachedData(selectedData)
		setSelectedData(null)
		setIsModalOpen(false)
	}

	// handleCancel: Función que se ejecuta al hacer click en el botón de cancelar del modal
	const handleCancel = () => {
		setModalType(null)
		setSelectedData(null)
		setIsModalOpen(false)
		setCachedData(null)
	}

	const handleClose = () => {
		setModalType(null)
		setSelectedData(null)
		setIsModalOpen(false)
		setCachedData(null)
	}

	const handleDelete = () => {
		setIsModalOpen(false)
		showModal("Confirm", selectedData)
	}

	return (
		<ModalContext.Provider
			value={{
				setSelectedData,
				isModalOpen,
				showModal,
				handleOk,
				handleCancel,
				modalType,
				selectedData,
				handleClose,
				handleDelete,
				cachedData,
			}}
		>
			{children}
		</ModalContext.Provider>
	)
}

export const useModal = () => {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error("useModal debe ser usado dentro de un ModalProvider")
	}
	return context
}
