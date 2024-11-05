import React from "react"
import ImgCrop from "antd-img-crop"

import { Upload } from "antd"
import { FileType } from "../lib/types"
import { UploadFile, UploadProps } from "antd"
import { Dispatch, SetStateAction } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface ImageSelectorProps {
	imageLabel: string
	imageFile?: UploadFile[]
	setImageFile?: Dispatch<SetStateAction<UploadFile[]>>
	size: [number, number]
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ imageLabel, imageFile, setImageFile, size }) => {
	const {
		control,
		setValue,
		formState: { errors },
	} = useFormContext()

	const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
		setImageFile && setImageFile(newFileList)
	}

	const beforeUpload = (file: FileType) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)

		reader.onload = () => {
			setValue("image", file)
		}

		return false
	}

	const handleRemove = () => {
		setValue("image", null)
		setImageFile && setImageFile([])
	}

	return (
		<Controller
			control={control}
			name="image"
			render={() => (
				<ImgCrop
					rotationSlider
					modalTitle="Editar imagen"
					modalOk="Confirmar"
					modalCancel="Cancelar"
					cropperProps={{
						cropSize: { width: size[0], height: size[1] },
						style: {},
						zoomSpeed: 1,
						restrictPosition: true,
						mediaProps: {},
					}}
				>
					<Upload
						fileList={imageFile}
						beforeUpload={beforeUpload}
						onChange={onChange}
						showUploadList={true}
						listType="text"
						accept=".jpg,.jpeg,.png,.webp"
						maxCount={1}
						onRemove={handleRemove}
					>
						<div className="flex flex-col gap-2 w-full">
							<p className="font-semibold text-dark dark:text-light text-sm">{imageLabel}</p>

							<div className="flex flex-row justify-center w-full rounded-lg cursor-pointer">
								<div className="flex flex-col gap-1">
									{errors["image"] && (
										<p className="text-red">{errors["image"].message?.toString()}</p>
									)}
									<p className="text-neutral-500 dark:text-gray-light">
										Haga click para subir una imagen
									</p>
									<p className="text-neutral-500 dark:text-gray-light">
										Formatos permitidos: .jpg, .jpeg, .png .webp
									</p>
								</div>
							</div>
						</div>
					</Upload>
				</ImgCrop>
			)}
		/>
	)
}
