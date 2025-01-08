import React from "react"

import { Text } from "@/components/Text"
import { primaryGreen } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"

interface Props {
	date: any
	state: string
	isSelected: boolean
	isMarked: boolean
	onPress: () => void
}

export const CustomDayComponent: React.FC<Props> = ({ date, state, ...props }) => {
	const { isSelected, isMarked, onPress } = props

	const childStyles = {
		color:
			isSelected || isMarked
				? "white"
				: state === "disabled"
					? "rgba(0, 0, 0, 0.3)"
					: "black",
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: isSelected || isMarked ? primaryGreen : "transparent",
				width: 40,
				height: 40,
				borderRadius: 50,
				marginVertical: 0,
			}}
		>
			{isSelected ? (
				<MaterialIcons name="check-circle" size={24} color="white" />
			) : (
				<Text style={childStyles}>{date.day}</Text>
			)}
		</TouchableOpacity>
	)
}
