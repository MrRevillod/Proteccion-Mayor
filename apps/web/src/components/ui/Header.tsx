import clsx from "clsx"
import React from "react"

import { Show } from "./Show"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { IMAGE_BASE_URL } from "../../lib/axios"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Avatar, Dropdown, Navbar } from "flowbite-react"

export const Header: React.FC = () => {
	const location = useLocation()

	const { toggleTheme, isDarkMode } = useTheme()
	const { isAuthenticated, user, logout, role, profilePicture, setProfilePicture } = useAuth()
	const [selectedPage, setSelectedPage] = useState<string>("Inicio")

	const handleImageError = () => {
		setProfilePicture(`${IMAGE_BASE_URL}/users/default-profile.webp`)
	}

	const logoutHandler = async () => {
		await logout()
	}

	const linkClasses = (page: string, isDropdownItem: boolean = false) => {
		return clsx(
			!isDropdownItem && selectedPage === page
				? "text-neutral-50 underline decoration-2 underline-offset-8"
				: "text-neutral-200",
			"hover:text-neutral-50 cursor-pointer",
		)
	}

	const handlePageSelected = (page: string) => {
		setSelectedPage(page)
	}

	useEffect(() => {
		const path = location.pathname.split("/")[1]

		if (path === "agenda") {
			setSelectedPage("Agenda")
			return
		}
	}, [location])

	return (
		<Navbar
			fluid
			className="py-4 h-18 w-full bg-primary dark:bg-primary-darker rounded-none px-8 md:px-12 lg:px-20"
		>
			<Navbar.Brand className="ml-2 2xl:ml-4">
				<img src="/logo.webp" alt="logo" width="50" />
			</Navbar.Brand>

			<Show when={isAuthenticated && user !== null}>
				<div className="flex md:order-2">
					<Dropdown
						arrowIcon={false}
						inline
						className="relative z-50"
						label={
							<Avatar
								alt="User settings"
								img={profilePicture ?? `${IMAGE_BASE_URL}/users/default-profile.webp`}
								onError={handleImageError}
								rounded
							/>
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">{user?.name}</span>
							<span className="block truncate text-sm font-medium">{user?.email}</span>
						</Dropdown.Header>
						<Dropdown.Item onClick={() => toggleTheme()}>
							<span className="block truncate text-sm font-medium">
								{`Tema: ${isDarkMode ? "Oscuro" : "Claro"}`}
							</span>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Link to="/perfil">
							<Dropdown.Item>Mi perfil</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => logoutHandler()}>Cerrar sesión</Dropdown.Item>
					</Dropdown>
					<Navbar.Toggle />
				</div>
				<Navbar.Collapse className="">
					<Show when={role === "ADMIN"}>
						<Dropdown
							label=""
							dismissOnClick={false}
							onClick={() => handlePageSelected("Personas")}
							renderTrigger={() => <span className={linkClasses("Personas")}>Personas</span>}
						>
							<Link
								to="/administracion/administradores"
								className={linkClasses("Personas", true)}
								onClick={() => handlePageSelected("Personas")}
							>
								<Dropdown.Item>Administradores</Dropdown.Item>
							</Link>

							<Link
								to="/administracion/profesionales"
								className={linkClasses("Personas", true)}
								onClick={() => handlePageSelected("Personas")}
							>
								<Dropdown.Item>Profesionales</Dropdown.Item>
							</Link>

							<Dropdown.Item>
								<Dropdown
									label=""
									placement="right-start"
									dismissOnClick={false}
									renderTrigger={() => <span className={`cursor-pointer`}>Personas Mayores</span>}
									className="w-48"
								>
									<Link
										to="/administracion/personas-mayores"
										onClick={() => handlePageSelected("Personas")}
										className={linkClasses("Personas", true)}
									>
										<Dropdown.Item as="div">Todos</Dropdown.Item>
									</Link>

									<Link
										to="/administracion/personas-mayores/nuevos"
										onClick={() => handlePageSelected("Personas")}
										className={linkClasses("Personas", true)}
									>
										<Dropdown.Item as="div">Solicitudes de registro</Dropdown.Item>
									</Link>
								</Dropdown>
							</Dropdown.Item>
						</Dropdown>

						<Link
							to="/agenda/administradores"
							className={linkClasses("Agenda")}
							onClick={() => handlePageSelected("Agenda")}
						>
							Agenda
						</Link>

						<Link
							to="/administracion/servicios"
							className={linkClasses("Servicios")}
							onClick={() => handlePageSelected("Servicios")}
						>
							Servicios
						</Link>

						<Link
							to="/administracion/centros-de-atencion"
							className={linkClasses("Centros de atención")}
							onClick={() => handlePageSelected("Centros de atención")}
						>
							Centros de atención
						</Link>

						<Link
							to="/estadisticas"
							className={linkClasses("Estadisticas")}
							onClick={() => handlePageSelected("Estadisticas")}
						>
							Estadísticas
						</Link>
					</Show>
				</Navbar.Collapse>
			</Show>
		</Navbar>
	)
}
