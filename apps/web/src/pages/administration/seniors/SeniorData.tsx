import clsx from "clsx"
import dayjs from "dayjs"
import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { Show } from "@/components/ui/Show"
import { Image } from "antd"
import { RSH, Senior } from "@/lib/types"
import { useRequest } from "@/hooks/useRequest"
import { useLocation } from "react-router-dom"
import { getRegisterImages } from "@/lib/actions"
import { dateToAge, formatRut } from "@/lib/formatters"

const SeniorData: React.FC = () => {
	const location = useLocation()
	const { senior } = location.state as { senior: Senior }

	const [images, setImages] = React.useState<string[]>([])

	const { loading: imageLoading } = useRequest({
		action: getRegisterImages,
		params: { id: senior.id },
		onSuccess: (data) => {
			Array.isArray(data) && setImages(data)
		},
	})

	return (
		<PageLayout pageTitle="Información de la persona mayor">
			<section
				className={clsx(
					imageLoading && "opacity-50",
					"bg-white dark:bg-primary-dark p-4 rounded-lg flex flex-row gap-12",
				)}
			>
				<section className="w-1/3 flex flex-col gap-8">
					<h2 className="text-2xl font-semibold">{senior.name}</h2>

					<section className="w-full flex flex-col gap-4">
						<p>
							<strong>Rut:</strong> {formatRut(senior.id)}
						</p>

						<p>
							<strong>Correo Electrónico:</strong> {senior.email}
						</p>

						<p>
							<strong>Dirección:</strong> {senior.address}
						</p>

						<p>
							<strong>Sector:</strong> {senior.sector.name}
						</p>

						<p>
							<strong>Teléfono:</strong> {senior.phone}
						</p>

						<p>
							<strong>Edad:</strong> {dateToAge(senior.birthDate)} años
						</p>

						<p>
							<strong>Fecha de nacimiento:</strong> {dayjs(senior.birthDate).format("DD/MM/YYYY")}
						</p>

						<p>
							<strong>Registro Social de Hogares:</strong> {RSH[senior.rsh]}
						</p>

						<p>
							<strong>Registrado por:</strong> {senior?.registeredByStaff?.name}
						</p>

						<p>
							<strong>Registrado el:</strong> {dayjs(senior.createdAt).format("DD/MM/YYYY")}
						</p>

						<p>
							<strong>Actualizado el:</strong> {dayjs(senior.updatedAt).format("DD/MM/YYYY")}
						</p>
					</section>
				</section>

				<div className="w-2/3 grid grid-cols-2 gap-2">
					<div className="col-span-1 grid grid-rows-2 gap-1">
						<div className="row-span-1 rounded-lg dni-container max-h-[280px] overflow-hidden">
							<Show when={!!images[0]}>
								<Image
									src={images[0]}
									alt="Cédula Frontal"
									className="object-cover object-center w-full h-full"
									fallback="/fallback.png"
								/>
							</Show>

							<Show when={!images[0]}>
								<div className="flex items-center justify-center w-full h-full">
									<p>No se ha podido cargar la imagen de la cédula frontal</p>
								</div>
							</Show>
						</div>
						<div className="row-span-1 rounded-lg dni-container max-h-[280px] overflow-hidden">
							<Show when={!!images[1]}>
								<Image
									src={images[1]}
									alt="Cédula Trasera"
									className="object-cover object-center w-full h-full"
									fallback="/fallback.png"
								/>
							</Show>

							<Show when={!images[1]}>
								<div className="flex items-center justify-center w-full h-full">
									<p>No se ha podido cargar la imagen de la cédula trasera</p>
								</div>
							</Show>
						</div>
					</div>

					<div className="col-span-1 rounded-lg dni-container overflow-hidden max-h-[580px]">
						<Show when={!!images[2]}>
							<Image
								src={images[2]}
								alt="Foto de la persona mayor"
								className="object-cover object-center w-full h-full"
								fallback="/fallback.png"
							/>
						</Show>

						<Show when={!images[2]}>
							<div className="flex items-center justify-center w-full h-full">
								<p>No se ha podido cargar la imagen de la persona mayor</p>
							</div>
						</Show>
					</div>
				</div>
			</section>
		</PageLayout>
	)
}

export default SeniorData
