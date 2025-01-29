import { message } from "antd"
import { FieldValues } from "react-hook-form"

// Esta función retorna el header http de content Type
// dependiendo del tipo de dato que deciba.

export const getContentType = (body: any) => {
	// Si es una instacia de FormData utilizará el header
	// "multipart/form-data", de lo contrario el json común.
	return body instanceof FormData ? "multipart/form-data" : "application/json"
}

// Esta función recibe data proveniente de un formulario y retorna
// un body estructurado dependiendo del tipo de dato que contenga
// es necesaria para construir bodys de tipo Multipart (con imagenes)

export const buildRequestBody = (data: any): FormData | FieldValues => {
	let formData = new FormData()
	// Si existe una imagen entonces debemos añadir los campos del formulario
	// al objeto formData, el campo "image" se trata de manera especial.

	if (data.image) {
		Object.keys(data).forEach((key) => {
			if (key === "image") {
				formData.append("image", data.image)
			} else if (Array.isArray(data[key])) {
				data[key].forEach((value) => formData.append(`${key}[]`, value))
			} else {
				formData.append(key, data[key])
			}
		})
	}
	// Finalmente si hay un data.image (es multipart) se retorna ese,
	// si no la data original la cual será serializada a JSON.

	return data.image ? formData : data
}

// Esta función setea los errores de conflictos manualmente en cada input correspondiente
// Recordando que el backend envía los conflictos en el formato:
// ["name", "email", "id", "etc"]

export const handleFormError = (error: any, setError: any) => {
	if (error.response) {
		message.error(error.response.data.message)
		if (error.response.status === 409 && error.response.data.values.conflicts) {
			error.response.data.values.conflicts.forEach((element: string) => {
				setError(element, {
					type: "manual",
					message: "El campo ya existe",
				})
			})
		}
	} else {
		message.error("Error. Intente nuevamente.")
	}
}
