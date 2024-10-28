import React from "react"
import { View, TextInput, Text } from "react-native"
import { Controller, useFormContext } from "react-hook-form"
import { StyleSheet } from "react-native"
import Colors from "@/components/colors"

type InputFieldProps = {
	name: string
	placeholder: string
	secureTextEntry?: boolean
	children?: React.ReactNode
}

const Input = ({ name, placeholder, secureTextEntry = false, children }: InputFieldProps) => {
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
						/>
						{errors[name] && typeof errors[name].message === "string" && <Text style={{ color: "red" }}>{errors[name].message}</Text>}
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
