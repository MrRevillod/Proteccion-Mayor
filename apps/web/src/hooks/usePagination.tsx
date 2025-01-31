import { useState, useEffect } from "react"

interface UsePaginationProps<T> {
	data: T[]
	defaultPageSize?: number
}

export const usePagination = <T,>({ data, defaultPageSize = 6 }: UsePaginationProps<T>) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(defaultPageSize)

	// Ajustar la página actual si se queda vacía
	useEffect(() => {
		const totalPages = Math.ceil(data.length / pageSize)
		if (currentPage > totalPages) {
			setCurrentPage(Math.max(1, totalPages)) // Retrocede si la página queda vacía
		}
	}, [data.length, pageSize, currentPage])

	const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

	const onPageChange = (page: number, size: number) => {
		setCurrentPage(page)
		setPageSize(size)
	}

	return {
		paginatedData,
		currentPage,
		pageSize,
		total: data.length,
		onPageChange,
	}
}
