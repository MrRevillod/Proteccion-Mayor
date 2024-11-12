import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { useState, useEffect } from "react"
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from "react-native"
import { Colors } from "@/components/colors"
import DataDisplayer from "@/components/dataDisplayer"
import { calculateAge, formatRUT } from "@/utils/formatter"
import MenuBar from "@/components/menuBar"
import { SERVER_URL } from "@/utils/request"
import axios from "axios"
import { makeAuthenticatedRequest } from "@/utils/request"
import { useAuth } from "@/contexts/authContext"
import GoBackButton from "@/components/goBack"
import CustomButton from "@/components/button"

const rutImg = require("@/assets/images/profile/rut.png")
const emailImg = require("@/assets/images/profile/email.png")
const birthImg = require("@/assets/images/profile/birth.png")
const ccImg = require("@/assets/images/profile/cc.png")
const keyImg = require("@/assets/images/profile/key.png")
const fontImg = require("@/assets/images/profile/font.png")


const { width } = Dimensions.get("window")

const Profile = ({ navigation }: any) => {
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [profileUri, setProfileUri] = useState<string | null>(null)

	const { logout } = useAuth()

	useEffect(() => {
		const getUser = async () => {
			try {
				const user = await AsyncStorage.getItem("user")
				if (!user) {
					throw new Error("El usuario no existe")
				}
				const parsedUser = JSON.parse(user)
				setUser(parsedUser)
			} catch (error) {
				console.error("Error al obtener el usuario", error)
			}
		}
		getUser()
	}, [])

	useEffect(() => {
		if (user) {
			const checkProfilePhoto = async () => {
				try {
					await axios.get(`${SERVER_URL}/api/storage/${user.id}/profile.jpg`, {
						headers: { "x-storage-key": "STORAGE_KEY_SECRET" },
					})
					setProfileUri(`${SERVER_URL}/api/storage/${user.id}/profile.jpg`)
				} catch (error) {
					await axios.get(`${SERVER_URL}/api/storage/default-profile.jpg`, {
						headers: { "x-storage-key": "STORAGE_KEY_SECRET" },
					})
					setProfileUri(`${SERVER_URL}/api/storage/default-profile.jpg`)
					console.error("Error verificando la foto de perfil", error)
					setProfileUri(null)
				}
			}
			checkProfilePhoto()
			setLoading(false)
		}
	}, [user])

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}

	const { id, name, email, birthDate } = user
	const formattedRUT = formatRUT(id)
	const age = calculateAge(birthDate)

	const deleteAccount = async () => {
		try {
			const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/seniors/${id}`, "DELETE")
			if (response?.status === 200) {
				logout()
				Alert.alert("Cuenta Eliminada", "Su cuenta ha sido eliminada exitosamente")
				await AsyncStorage.removeItem("user")
				navigation.navigate("Login")
			}
		} catch (error) {
			console.error(error)
		}
	}

	const deleteAlert = () => {
		Alert.alert("Eliminar Cuenta", "¿Está seguro que desea eliminar su cuenta?", [
			{
				text: "Cancelar",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{ text: "Eliminar", onPress: () => deleteAccount() },
		])
	}

	return (
		<>
			<GoBackButton navigation={navigation} visible />
			<View style={styles.greenContainer}>
				<>
					<TouchableOpacity style={styles.circle} onPress={() => navigation.navigate("NewProfile")}>
						{profileUri && (
							<Image source={{ uri: profileUri }} style={{ width: width * 0.25, height: width * 0.25, borderRadius: 100 }} />
						)}
					</TouchableOpacity>
					<Text style={{ color: Colors.white, fontSize: 18, fontWeight: "500" }}>{name}</Text>
				</>
			</View>
			<View style={styles.dataContainer}>
				<View>
					<DataDisplayer imgPath={rutImg} titleField="RUT" descriptionField={formattedRUT} />
					{email ? (
						<DataDisplayer imgPath={emailImg} titleField="Correo Eléctronico" descriptionField={email} actionButton="Cambiar" />
					) : (
						<DataDisplayer imgPath={emailImg} titleField="Aún no ingresa su Correo Eléctronico" actionButton="Ingresar" />
					)}
					<DataDisplayer
						imgPath={ccImg}
						titleField="Centro Comunitario Preferido"
						descriptionField="CC Pedro de Valdivia"
						actionButton="Cambiar"
					/>
					<DataDisplayer imgPath={birthImg} titleField="Edad" descriptionField={`${age} Años`} />
					<DataDisplayer imgPath={keyImg} titleField="Cambiar Contraseña" actionButton="Cambiar" />
                    <DataDisplayer imgPath={fontImg} titleField="Cambiar tamaño de fuente" onPress={() => navigation.navigate("FontSize")} actionButton="Cambiar" />

                    <DataDisplayer titleField="Eliminar Cuenta" actionButton="ELIMINAR" onPress={deleteAlert} />
				</View>
			</View>
			<MenuBar navigation={navigation} />
		</>
	)
}

export default Profile

const styles = StyleSheet.create({
	greenContainer: {
		backgroundColor: Colors.green,
		height: "30%",
		alignItems: "center",
		justifyContent: "center",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 50,
	},
	circle: {
		margin: 20,
		width: width * 0.25,
		height: width * 0.25,
		borderRadius: 100,
		borderColor: Colors.white,
		borderWidth: 2,
		backgroundColor: Colors.gray,
	},

	dataContainer: {
		height: "61.53%",
		margin: 0,
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
	},
})
