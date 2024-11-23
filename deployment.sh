
#!/bin/bash

# Usage: ./deployment.sh [mode] [install]
# mode: build | deploy

set -a && source .env && set +a

mode=$1
install=$2
db=$3
seed=$4

ip=$VM_IP
port=$VM_PORT
ssh_key=$VM_SSH_KEY_PATH
ssh_user=$VM_USER

# Arguments:
# Mode: "build" | "start"

# Mode: "build"
# - Build the project
# - Copy the dist folders to the server

# Mode: "start"
# - Start the server

# Mode: "db:setup:dev" | "db:setup:prod"
# - Run the migrations
# - Generate the prisma client
# - Run the seeds

# - dev -> use the dev database (local)
# - prod -> use the prod database (server)

# Install: "install"
# - install -> install the dependencies

if [ "$mode" = "build" ]; then

    export NODE_ENV=production

    echo "Building the project..."

    if [ "$install" = "install" ]; then
        echo "Installing the dependencies..."
        pnpm run build --filter=!mobile-app
    fi

    echo "Copying the dist folders to the server..."

    scp -i $ssh_key -P $port -r ./apps/dashboard/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/dashboard/
    scp -i $ssh_key -P $port -r ./apps/auth/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/auth/
    scp -i $ssh_key -P $port -r ./apps/storage/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/storage/
    scp -i $ssh_key -P $port -r ./apps/web/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/web/

    scp -i $ssh_key -P $port -r ./packages/database/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/packages/database/
    scp -i $ssh_key -P $port -r ./packages/lib/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/packages/lib/

    scp -i $ssh_key -P $port -r ./.env.prod $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/

    echo "Done!"

elif [ "$mode" = "deploy" ]; then

    echo "Deploying the project..."

    if [ "$install" = "install" ]; then
        echo "Installing the dependencies..."
        pnpm run build --filter=!mobile-app
    fi

    echo "Copiying web bundle to the nginx folder..."

    sudo mkdir -p /var/www/pmtemuco
    sudo rm -rf /var/www/pmtemuco/*
    sudo cp -r ./apps/web/dist/* /var/www/pmtemuco/

    sudo chown -R www-data:www-data /var/www/pmtemuco
    sudo chmod -R 755 /var/www/pmtemuco

    echo "Initializing the services..."

    pm2 stop all
    pm2 delete all
    pm2 flush

    cd ./apps/auth/
    pm2 start "./dist/index.js" --name "Authentication Service" -i 2

    cd ../../apps/dashboard/
    pm2 start "./dist/index.js" --name "Dashboard Service" -i 3

    cd ../../apps/storage/
    pm2 start "./dist/index.js" --name "Storage Service" -i 1

    cd ../../

    pm2 list
fi

if [ "$db" = "db:deploy" ]; then
    echo "Migrating to deploy database..."
    cd ./packages/database

    dotenv -e ../../.env.production -- prisma migrate deploy

    echo "Generating prisma client..."
    pnpm run db:generate

    cd ../../

    echo "Done!"
fi

if [ "$seed" = "seed:dev" ]; then
    echo "Seeding database..."
    pnpm run db:seed:dev
fi

cd ../../

export NODE_ENV=development
