import multer from "multer"

import { AppError } from "@repo/lib"
import { RequestHandler } from "express"

export const fileWhitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"]

const storage = multer.memoryStorage()

export const upload = multer({
	storage: storage,
	limits: { fileSize: 15 * 1048576 },
	fileFilter: (req, file, cb) => {
		if (!fileWhitelist.includes(file.mimetype)) {
			return cb(new AppError(400, "Este tipo de archivo no esta permitido"))
		}
		cb(null, true)
	},
})

export const seniorsRegisterMobileImages: RequestHandler = upload.fields([
	{ name: "dni-a", maxCount: 1 },
	{ name: "dni-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])

export const singleImageupload: RequestHandler = upload.single("image")
export const seniorsProfileImage: RequestHandler = upload.single("profile")
