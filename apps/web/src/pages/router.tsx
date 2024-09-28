import React from "react"
import Loading from "../components/Loading"
import HomePage from "./Home"
import LoginPage from "./auth/Login"
import EventsPage from "./dashboard/Events"
import CentersPage from "./dashboard/Centers"
import SeniorsPage from "./dashboard/Seniors"
import ProfilePage from "./Profile"
import ServicesPage from "./dashboard/Services"
import NotFoundPage from "./NotFound"
import NewSeniorsPage from "./dashboard/SeniorsNew"
import AdministratorPage from "./dashboard/Administrators"
import ProfessionalsPage from "./dashboard/Professionals"
import SeniorRegisterRequestPage from "./dashboard/SeniorRegisterRequest"

import { useAuth } from "../context/AuthContext"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"

interface RouteProps {
	condition: boolean
	redirectTo: string
}

const RouteProtector: React.FC<RouteProps> = ({ condition, redirectTo }) => {
	const { loading } = useAuth()
	if (loading) return <Loading />
	return condition ? <Navigate to={redirectTo} /> : <Outlet />
}

const Router: React.FC = () => {
	const { user, isAuthenticated } = useAuth()

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />

			<Route
				path="/auth/login"
				element={
					<RouteProtector
						condition={user !== null && isAuthenticated}
						redirectTo="/dashboard/administradores"
					/>
				}
			>
				<Route path="" element={<LoginPage />} />
			</Route>

			<Route element={<RouteProtector condition={!user && !isAuthenticated} redirectTo="/auth/login" />}>
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/dashboard/administradores" element={<AdministratorPage />} />
				<Route path="/dashboard/profesionales" element={<ProfessionalsPage />} />
				<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
				<Route path="/dashboard/adultos-mayores/nuevos" element={<NewSeniorsPage />} />
				<Route path="/dashboard/eventos" element={<EventsPage />} />
				<Route path="/dashboard/servicios" element={<ServicesPage />} />
				<Route path="/dashboard/centros-de-atencion" element={<CentersPage />} />
				<Route path="/dashboard/ver-seniors" element={<SeniorRegisterRequestPage />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default Router
