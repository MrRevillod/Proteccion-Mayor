import React from "react"
import Menu from "../screens/menu"
import Home from "@/screens/home/home"
import Login from "./login"
import Center from "@/screens/home/center"
import Schelude from "@/screens/home/schelude"
import Camera from "@/components/camera"
import Profile from "../screens/myProfile"
import Register from "./register"
import ProtectedRoute from "@/components/protectedRoute"
import FontSizeSelector from "@/components/fontSizeSelector"

import { AuthProvider } from "@/contexts/authContext"
import { FontSizeProvider } from "@/contexts/fontSizeContext"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<AuthProvider>
			<FontSizeProvider>
				<NavigationContainer independent={true}>
					<Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Menu" component={Menu} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Profile">
							{(props) => (
								<ProtectedRoute navigation={props.navigation}>
									<Profile {...props} />
								</ProtectedRoute>
							)}
						</Stack.Screen>
						<Stack.Screen name="Home">
							{(props) => (
								<ProtectedRoute navigation={props.navigation}>
									<Home {...props} />
								</ProtectedRoute>
							)}
						</Stack.Screen>
						<Stack.Screen name="FontSize" component={FontSizeSelector} />
						<Stack.Screen name="Centers" component={Center} />
						<Stack.Screen name="Schelude" component={Schelude} />
						<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
					</Stack.Navigator>
				</NavigationContainer>
			</FontSizeProvider>
		</AuthProvider>
	)
}

export default App
