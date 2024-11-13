import React from "react"
import Colors from "@/components/colors"

import { Ionicons } from "@expo/vector-icons"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType } from "react-native"

const { width } = Dimensions.get("window")

type DataDisplayerProps = {
	imgPath?: ImageSourcePropType
	titleField: string | number
	descriptionField?: String | number
	actionButton?: "Ingresar" | "Cambiar" | "ELIMINAR"
	onPress?: () => void
	isCC?: boolean
	event?: { bool: boolean; color?: string }
}

const DataDisplayer = ({
	imgPath,
	titleField,
	descriptionField,
	actionButton,
	onPress,
	isCC = false,
	event = { bool: false },
}: DataDisplayerProps) => {
	return (
		<View style={styles.dataContainer}>
			<View style={{ flexDirection: "row", alignItems: "center", padding: width * 0.01 }}>
				{event.bool ? (
					<View style={[styles.colorBar, { backgroundColor: event.color || Colors.gray }]} />
				) : isCC ? (
					<Ionicons name="home-outline" color="black" size={width * 0.11} />
				) : (
					<Image source={imgPath} style={{ width: width * 0.11, height: width * 0.11 }} />
				)}

				{!descriptionField && !actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: "80%" }}>
						<Text style={styles.textTitle}>{titleField}</Text>
					</View>
				)}
				{!descriptionField && actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: width * 0.6 }}>
						<Text style={styles.textTitle}>{titleField}</Text>
					</View>
				)}
				{descriptionField && !actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: "88%" }}>
						<Text style={styles.textTitle}>{titleField}</Text>
						<Text style={{ fontSize: 16, color: Colors.gray, margin: 0, padding: 0, fontWeight: "bold" }}>{descriptionField}</Text>
					</View>
				)}
				{descriptionField && actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: width * 0.6 }}>
						<Text style={styles.textTitle}>{titleField}</Text>
						<Text style={{ fontSize: 16, color: Colors.gray, margin: 0, padding: 0, fontWeight: "bold" }}>{descriptionField}</Text>
					</View>
				)}
			</View>
			{actionButton && (
				<TouchableOpacity onPress={onPress}>
					<Text style={{ fontSize: 16, color: Colors.green, textDecorationLine: "underline", marginHorizontal: width * 0.05 }}>
						{actionButton}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

export default DataDisplayer

const styles = StyleSheet.create({
	dataContainer: {
		borderBottomWidth: 1,
		borderColor: Colors.gray,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 5,
		borderRadius: 5,
	},
	textTitle: {
		fontSize: 16,
		color: Colors.black,
		margin: 0,
		padding: 0,
		fontWeight: "400",
	},
	colorBar: {
		width: 7,
		height: 100,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
})
