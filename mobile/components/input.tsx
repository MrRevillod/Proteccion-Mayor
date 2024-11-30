import React from "react"
import Colors from "@/components/colors"

import { StyleSheet } from "react-native"
import { Controller, useFormContext } from "react-hook-form"
import { View, TextInput, Text, KeyboardTypeAndroid, KeyboardType } from "react-native"

type InputFieldProps = {
	name: string
	placeholder: string
	secureTextEntry?: boolean
	children?: React.ReactNode
	keyboardType?: KeyboardType | KeyboardTypeAndroid
}

const Input = ({ name, ...props }: InputFieldProps) => {
	const { placeholder, secureTextEntry, keyboardType = "default", children } = props

	const {
		control,
		formState: { errors },
	} = useFormContext()
	return (
		<View>
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							style={styles.input}
							placeholder={placeholder}
							value={value}
							onBlur={onBlur}
							onChangeText={onChange}
							secureTextEntry={secureTextEntry}
							keyboardType={keyboardType}
						/>
						<Text>{errors[name] && <Text style={{ color: "red" }}>{errors[name].message?.toString()}</Text>}</Text>
					</>
				)}
			/>
			{children}
		</View>
	)
}

export default Input

const styles = StyleSheet.create({
	input: {
		backgroundColor: Colors.white,
		borderRadius: 10,
		borderColor: Colors.green,
		borderWidth: 1.5,
		width: "auto",
		paddingVertical: 10,
		textAlign: "center",
		color: Colors.gray,
		fontSize: 18,
		marginTop: 30,
		marginBottom: 15,
	},
})
