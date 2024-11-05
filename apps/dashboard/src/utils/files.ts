import { ApiResponse, AppError, httpRequest, JsonResponse } from "@repo/lib"

const bufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

export const bufferToBlob = (buffer: Buffer, mimeType: string): Blob => {
	const arrayBuffer = bufferToArrayBuffer(buffer)
	return new Blob([arrayBuffer], { type: mimeType })
}

export const filesToFormData = (files: { [fieldname: string]: Express.Multer.File[] }): FormData => {
	const formData = new FormData()
	Object.keys(files).forEach((key: string) => {
		const file = files[key][0]
		const blob = bufferToBlob(file.buffer, file.mimetype)
		formData.append("files", blob, file.originalname)
	})
	return formData
}

export const fileToFormData = (file: Express.Multer.File, filename: string): FormData => {
	const extFile = file.originalname.split(".")[1]
	file.originalname = `${filename}.${extFile}`
	const formData = new FormData()
	formData.append("files", bufferToBlob(file.buffer, file.mimetype), file.originalname)
	return formData
}

interface UploadProfilePictureProps {
	file: Express.Multer.File
	filename: string
	endpoint: string
}

export const uploadProfilePicture = async ({ file, filename, endpoint }: UploadProfilePictureProps): Promise<ApiResponse> => {
	try {
		const response = await httpRequest({
			service: "STORAGE",
			endpoint: endpoint,
			method: "POST",
			variant: "MULTIPART",
			body: fileToFormData(file, filename),
		})

		return response as JsonResponse<Record<string, any>>
	} catch (error) {
		throw new AppError(500, "Error al subir la imagen")
	}
}

export const deleteProfilePicture = async (endpoint: string): Promise<ApiResponse> => {
	try {
		const response = await httpRequest({
			service: "STORAGE",
			endpoint: endpoint,
			method: "DELETE",
		})

		return response as JsonResponse<Record<string, any>>
	} catch (error) {
		throw new AppError(500, "Error al eliminar la imagen")
	}
}
