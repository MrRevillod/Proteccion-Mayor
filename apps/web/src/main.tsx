import React from "react"
import Router from "@/pages/router"
import ReactDOM from "react-dom/client"
import AppLayout from "@/layouts/AppLayout"

import { BrowserRouter } from "react-router-dom"

import { AuthProvider } from "@/context/AuthContext"
import { ModalProvider } from "@/context/ModalContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { StyleProvider } from "@ant-design/cssinjs"
import { SocketProvider } from "@/context/SocketContext"

import "./main.css"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
	<BrowserRouter>
		<StyleProvider>
			<ThemeProvider>
				<AuthProvider>
					<SocketProvider>
						<ModalProvider>
							<AppLayout>
								<Router />
							</AppLayout>
						</ModalProvider>
					</SocketProvider>
				</AuthProvider>
			</ThemeProvider>
		</StyleProvider>
	</BrowserRouter>,
)
