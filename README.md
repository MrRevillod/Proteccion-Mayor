<p align="center">
    <h1>Protección Mayor</h1>
</p>

<p align="center">
  <img src="./apps/web/public/logo-pmtemuco.png" alt="Protección Mayor" width="100"/>
</p>

<p align="center">
    <h2>Sistema de reservas y gestión de servicios para personas mayores</h2>
</p>

Este proyecto tiene como objetivo la creación de un sistema de reservas y gestión de servicios para personas mayores. La plataforma permite realizar tareas de administración de una manera ordenada y eficiente, además de contar con un sistema de agenda compartida para la coordinación de actividades.

Además, se cuenta con una aplicación con alta accesibilidad para personas mayores, la cual permite realizar reservas de servicios de manera sencilla y rápida.

Puedes acceder a la descarga de la aplicación en formato APK en su primera versión leyendo el archivo el código QR:

<img src="./apps/web/public/qr-code.png" alt="Protección Mayor" width="100"/>

## Requerimientos de despliegue

El sistema está compuesto por varios servicios que deben ser desplegados en un servidor con las siguientes características:

-   MySQL
-   Node.js LTS
-   pNPM
-   Nginx

Además, se requiere la instalación de las siguientes librerías globales:

##### PM2 (Gestor de procesos y servidores en modo cluster)

```bash
pnpm install -g @socket.io/pm2
```

##### Dotenv-cli (Carga de variables de entorno desde un archivo .env)

```bash
pnpm install -g dotenv-cli
```

##### TS-Node (Ejecución de scripts TypeScript)

```bash
pnpm install -g ts-node
```

## Despliegue

Para desplegar el sistema, se deben seguir los siguientes pasos:

1. Clonar el repositorio

```bash
git clone https://github.com/MrRevillod/Proteccion-Mayor.git
```

2. Instalar las dependencias de los servicios

```bash
pnpm install
```

3. Configurar variables de entorno

4. Iniciar proceso de compilación

```bash
./deployment.sh build
```

5. Clonar el repositorio en el servidor
6. Configurar variables de entorno

7. Iniciar proceso de despliegue

```bash
./deployment.sh deploy
```

8. Configurar Nginx

```nginx
cp ./nginx/nginx.prod.conf /etc/nginx/nginx.conf
```

9. Reiniciar Nginx

```bash
sudo systemctl restart nginx
```

## Autores

-   [Luciano Revillod - Scrum Master - Desarrollador](https://github.com/MrRevillod)
-   [Tomás Curihual - Desarrollador](https://github.com/tcurihual)
-   [Benjamín Espinoza - Desarrollador](https://github.com/benjita2002djsjsda)
-   [Carlos Riquelme - Desarrollador](https://github.com/SrCarlito)
-   [Cristóbal Sandoval](https://github.com/CristobalSg)
