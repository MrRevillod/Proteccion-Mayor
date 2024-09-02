import { existsSync, mkdirSync } from "fs"
import multer from "multer"
import path from "path"

export const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = `public/${req.params["id"]}`

		//Crear directorio personal
		if (!existsSync(dir)) {
			mkdirSync(dir)
		}
		cb(null, "public/" + req.params["id"] + "/")
    },
    
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		cb(null, file.fieldname + ext)
	},
})

export const upload = multer({ storage })
