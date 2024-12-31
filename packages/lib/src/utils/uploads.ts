import multer from "multer"

import { AppError } from "../errors/custom"
import { memoryStorage } from "multer"

const fileWhitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"]

const upload = multer({
	storage: memoryStorage(),
	limits: { fileSize: 15 * 1048576 },
	fileFilter: async (req, file, cb) => {
		if (!fileWhitelist.includes(file.mimetype)) {
			return cb(new AppError(400, "Tipo de archivo no permitido"))
		}

		cb(null, true)
	},
})

export const singleImage = upload.single("image")
export const mobileregisterFiles = upload.fields([
	{ name: "dni-a", maxCount: 1 },
	{ name: "dni-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])
