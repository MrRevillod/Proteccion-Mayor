import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Camera from "@/components/camera"
import RUT from "@/screens/register/rut"
import Email from "@/screens/register/email"
import Pin from "@/screens/register/pin"
import ConfirmPin from "@/screens/register/confirmPin"
import DNI from "@/screens/register/dni"
import Social from "@/screens/register/social"
import Final from "@/screens/register/final"
import registerSchema from "@/utils/validation"

const Stack = createNativeStackNavigator()

// FormNavigator que maneja las pantallas y la navegación
const FormNavigator = () => {
    // Usamos trigger y otras funciones sin tener que pasarlas explícitamente
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RUT" component={RUT} />
            <Stack.Screen name="Email" component={Email} />
            <Stack.Screen name="Pin" component={Pin} />
            <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
            <Stack.Screen name="DNI" component={DNI} />
            <Stack.Screen name="Social" component={Social} />
            <Stack.Screen name="Final" component={Final} />
            <Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
        </Stack.Navigator>
    )
}

// Componente principal de Registro
const Register = () => {
    // Inicializamos useForm con zodResolver y defaultValues
    const methods = useForm({
        defaultValues: {
            rut: "",
            email: "",
            pin: "",
            pinConfirm: "",
            dni_a: "",
            dni_b: "",
            social: "",
        },
        resolver: zodResolver(registerSchema), // Resolver de Zod
    })

    return (
        <FormProvider {...methods}>
            <FormNavigator />
        </FormProvider>
    )
}

export default Register
