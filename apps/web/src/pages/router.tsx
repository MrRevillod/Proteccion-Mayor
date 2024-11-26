import React from "react"
import LoginPage from "./auth/Login"
import CentersPage from "./administration/Centers"
import SeniorsPage from "./administration/seniors/Seniors"
import ProfilePage from "./Profile"
import ServicesPage from "./administration/Services"
import NotFoundPage from "./NotFound"
import NewSeniorsPage from "./administration/seniors/SeniorsNew"
import StatisticsPage from "./administration/Statistics"
import AdministratorPage from "./administration/Administrators"
import ProfessionalsPage from "./administration/Professionals"
import ResetPasswordPage from "./auth/ResetPassword"
import ValidatePasswordPage from "./auth/Password"
import ProfessionalAgendaPage from "./agenda/Professional"
import AdministrationAgendaPage from "./agenda/Administration"
import SeniorHistoryRequestPage from "./administration/History"
import SeniorRegisterRequestPage from "./administration/seniors/SeniorRegisterRequest"
import DownloadApkButton from "../components/DownloadApkButton";
import { useAuth } from "../context/AuthContext"
import { UserRole } from "../lib/types"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"

interface RouteProps {
	redirectTo?: string
	allowedRoles?: UserRole[] // ["ADMIN", "PROFESSIONAL"]
}

// Componente para proteger rutas de la aplicación
// Recibe ruta de dirección a la que redirigir en caso de no estar autenticado
// o de no cumplir con los roles permitidos para ingresar a la ruta

const ProtectedRoute: React.FC<RouteProps> = ({ redirectTo = "/auth/iniciar-sesion", allowedRoles }) => {
	// Obtenemos los datos de autenticación del contexto de autenticación
	const { isAuthenticated, role, loading } = useAuth()

	if (loading) {
		return null
	}

	// Si no se especifican roles se lanza un error (desarrollo)
	if (allowedRoles && !allowedRoles.at(0)) {
		throw new Error("Se debe especificar al menos un rol permitido")
	}

	// Si no está autenticado o no tiene un rol o no tiene un rol permitido
	// se redirige a la ruta especificada
	if (!isAuthenticated || !role || !allowedRoles?.includes(role)) {
		return <Navigate to={redirectTo} />
	}

	// Si cumple con los requisitos se renderiza la ruta
	// El componente Outlet es necesario para renderizar las rutas hijas

	return <Outlet />
}

const RedirectRoute: React.FC<{ redirectTo?: string }> = ({ redirectTo }) => {
	const { isAuthenticated, role } = useAuth()

	// Si el usuario está autenticado, redirigirlo dependiendo del rol
	if (isAuthenticated) {
		// Return el componente Navigate para que funcione correctamente
		return role === "PROFESSIONAL" ? <Navigate to="/agenda/profesionales" /> : <Navigate to="/agenda/administradores" />
	}

	// Si no está autenticado, se renderiza la ruta hija (como el login)
	return redirectTo ? <Navigate to={redirectTo} /> : <Outlet />
}

const Router: React.FC = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
				<Route path="/administracion/administradores" element={<AdministratorPage />} />
				<Route path="/administracion/profesionales" element={<ProfessionalsPage />} />
				<Route path="/administracion/personas-mayores/" element={<SeniorsPage />} />
				<Route path="/administracion/personas-mayores/nuevos" element={<NewSeniorsPage />} />
				<Route
					path="/administracion/personas-mayores/solicitud-de-registro"
					element={<SeniorRegisterRequestPage />}
				/>
				<Route path="/administracion/servicios" element={<ServicesPage />} />
				<Route path="/administracion/centros-de-atencion" element={<CentersPage />} />
				<Route path="/agenda/administradores" element={<AdministrationAgendaPage />} />
			</Route>

			<Route element={<ProtectedRoute allowedRoles={["PROFESSIONAL"]} />}>
				<Route path="/agenda/profesionales" element={<ProfessionalAgendaPage />} />
			</Route>

			<Route element={<ProtectedRoute allowedRoles={["ADMIN", "PROFESSIONAL"]} />}>
				<Route path="/estadisticas" element={<StatisticsPage />} />
				<Route path="/historial" element={<SeniorHistoryRequestPage />} />
				<Route path="/perfil" element={<ProfilePage />} />
			</Route>

			<Route path="/" element={<RedirectRoute redirectTo="/auth/iniciar-sesion" />} />

			<Route element={<RedirectRoute />}>
				<Route path="/auth/iniciar-sesion" element={<LoginPage />} />
				<Route path="/auth/restaurar-contrasena" element={<ResetPasswordPage />} />
				<Route path="/auth/restaurar-contrasena/:id/:token/:role" element={<ValidatePasswordPage />} />
			</Route>
			<Route path="/descargar-apk" element={<DownloadApkButton />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default Router
