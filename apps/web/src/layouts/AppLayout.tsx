import React from "react"
import Header from "../components/ui/Header"

import { Show } from "../components/ui/Show"
import { useAuth } from "../context/AuthContext"
import { Loading } from "../components/Loading"
import { useEffect } from "react"

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

	const normalizeScale = () => {
		const scale = window.devicePixelRatio
		document.body.style.zoom = `${1 / scale}`
	}

	const { isAuthenticated, user, loading } = useAuth()

	useEffect(() => {

		normalizeScale()
		window.addEventListener('resize', normalizeScale)

		return () => {
			window.removeEventListener('resize', normalizeScale)
		}

	}, [])

	return (
		<article className="min-h-screen w-screen bg-gray-50 dark:bg-primary-darker">
			<Show when={loading}>
				<Loading />
			</Show>

			<Show when={isAuthenticated && user !== null}>
				<Header />
			</Show>
			<main className="w-full">{children}</main>
		</article>
	)
}

export default AppLayout
