import React from "react"
import Header from "../components/ui/Header"

import { Show } from "../components/ui/Show"
import { useAuth } from "../context/AuthContext"
import { Loading } from "../components/Loading"

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, user, loading } = useAuth()

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
