import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { ReactNode } from "react"
import { useMutation } from "@/hooks/useMutation"
import { useFormContext } from "react-hook-form"
import { Href, useRouter } from "expo-router"
import { checkUniqueField } from "@/lib/actions"
import { StyleSheet, View } from "react-native"

interface RegisterScreenProps {
	fieldName: string
	nextScreen: Href
	children: ReactNode
	step: string
}

const uniqueValues = ["rut", "email"]

export const RegisterScreen = ({ fieldName, nextScreen, step, children }: RegisterScreenProps) => {
	const router = useRouter()
	const methods = useFormContext()

	const { mutate } = useMutation({ mutateFn: checkUniqueField })

	const handleNextStep = async () => {
		const isValidField = await methods.trigger(fieldName)

		if (uniqueValues.includes(fieldName) && isValidField) {
			await mutate({
				params: { body: { [fieldName]: methods.getValues(fieldName) } },
				onSuccess: () => {
					router.push(nextScreen)
				},
				onError: (e) => {
					const error = e?.response?.data?.values
					if (error[fieldName]) methods.setError(fieldName, { message: error[fieldName] })
				},
			})
		}

		if (!uniqueValues.includes(fieldName) && isValidField) {
			router.push(nextScreen)
		}
	}

	return (
		<View style={styles.container}>
			<View style={{ width: "80%" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
					Paso {step}
				</Text>
			</View>

			{children}

			<View style={{ width: "100%", marginTop: 5, alignItems: "center" }}>
				<Button
					variant="primary"
					text="Siguiente"
					onPress={() => handleNextStep()}
					size="xxl"
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 50,
		backgroundColor: "white",
	},
})
