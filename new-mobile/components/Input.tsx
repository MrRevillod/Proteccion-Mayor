import React from "react"

import { StyleSheet } from "react-native"
import { primaryGreen } from "@/constants/Colors"
import { Controller, useFormContext } from "react-hook-form"
import { View, TextInput, Text, KeyboardTypeAndroid, KeyboardType } from "react-native"

interface InputFieldProps {
	label: string
	name: string
	placeholder: string
	secureTextEntry?: boolean
	keyboardType?: KeyboardType | KeyboardTypeAndroid
	maxLength?: number
	autoFocus?: boolean
}

export const Input = ({ name, ...props }: InputFieldProps) => {
	const {
		label,
		placeholder,
		secureTextEntry,
		keyboardType = "default",
		maxLength,
		autoFocus = false,
	} = props

	const {
		control,
		formState: { errors },
	} = useFormContext()

	const styles = StyleSheet.create({
		textContainer: {
			marginBottom: errors[name] ? 15 : 0,
			gap: 5,
		},
		label: {
			color: primaryGreen,
			fontSize: 16,
			fontWeight: "bold",
		},
		error: {
			color: "red",
			fontSize: 14,
			fontWeight: "bold",
		},
		input: {
			backgroundColor: "white",
			borderRadius: 10,
			borderColor: errors[name] ? "red" : primaryGreen,
			borderWidth: 1.5,
			paddingVertical: 10,
			width: "auto",
			textAlign: "center",
			fontSize: 18,
		},
	})

	return (
		<View>
			<View style={styles.textContainer}>
				<Text style={styles.label}>{label}</Text>
				<Text style={styles.error}>{errors[name]?.message?.toString()}</Text>
			</View>

			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						style={styles.input}
						placeholder={placeholder}
						value={value}
						onBlur={onBlur}
						onChangeText={onChange}
						secureTextEntry={secureTextEntry}
						keyboardType={keyboardType}
						placeholderTextColor="#d4d3cf"
						maxLength={maxLength || 100}
						autoFocus={autoFocus}
					/>
				)}
			/>
		</View>
	)
}
