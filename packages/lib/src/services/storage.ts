import { AppError } from "../errors/custom"
import { CONSTANTS, SERVICES } from "../env"

type File = Express.Multer.File
type Files = Record<string, File[]>
type Buffer = Express.Multer.File["buffer"]

interface UploadArgs {
	url: string
	input: File | Files
}

interface SingleUploadArgs extends UploadArgs {
	filename?: string
}

export class StorageService {
	public uploadFile = async ({ url, input, filename }: SingleUploadArgs) => {
		const formData = this.fileToFormData(input as File, filename)
		const data = (await this.uploadRequest(url, formData)) as { image: string | null }

		return { status: 200, message: "success", image: data.image }
	}

	public uploadFiles = async ({ url, input }: UploadArgs) => {
		const formData = this.filesToFormData(input as Files)
		await this.uploadRequest(url, formData)

		return { status: 200, message: "success" }
	}

	public deleteFile = async ({ url }: { url: string }) => {
		const addr = `${SERVICES.STORAGE.URL}${url}`

		const response = await fetch(addr, {
			method: "DELETE",
			headers: { "X-storage-key": CONSTANTS.STORAGE_KEY },
		})

		if (!response.ok) {
			throw new AppError(response.status ?? 500, "Error al eliminar la imagen")
		}

		return { status: 200, message: "success" }
	}

	private createBlob = (buffer: Buffer, mimetype: string): Blob => {
		return new Blob([buffer], { type: mimetype })
	}

	private fileToFormData = (input: File, filename?: string): FormData => {
		const formData = new FormData()
		const fileBlob = this.createBlob(input.buffer, input.mimetype)

		formData.append("files", fileBlob, filename ?? input.originalname)
		return formData
	}

	private filesToFormData = (input: Files): FormData => {
		const formData = new FormData()

		Object.entries(input).forEach(([_, file]) => {
			const fileBlob = this.createBlob(file[0].buffer, file[0].mimetype)
			formData.append("files", fileBlob, file[0].originalname)
		})

		return formData
	}

	private uploadRequest = async (path: string, formData: FormData) => {
		const response = await fetch(`${SERVICES.STORAGE.URL}${path}`, {
			method: "POST",
			body: formData,
			headers: { "X-storage-key": CONSTANTS.STORAGE_KEY },
		})

		if (!response.ok) {
			throw new AppError(response.status ?? 500, "Error al subir el archivo")
		}

		const data = (await response.json()) as { values: { image?: string } }
		return data?.values
	}
}
