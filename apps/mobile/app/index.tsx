import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"
import Login from "./login"
import Menu from "../screens/menu"
import Profile from "../screens/myProfile"
import NewProfile from "@/screens/newProfile"
import Camera from "@/components/camera"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider } from "@/contexts/authContext"
import ProtectedRoute from "@/components/protectedRoute"
import Home from "@/screens/home/home"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<AuthProvider>
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
					<Stack.Screen name="Home" component={Home} />

					<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
				</Stack.Navigator>
			</NavigationContainer>
		</AuthProvider>
	)
}

export default App
