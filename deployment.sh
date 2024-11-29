#!/bin/bash

# Usage: ./deployment.sh [mode] [install | dependencies]
# mode: build | deploy | db:deploy | seed:dev

set -a && source .env.production && set +a

mode=$1
install=$2

ip=$VM_IP
port=$VM_PORT
ssh_key=$VM_SSH_KEY_PATH
ssh_user=$VM_USER

echo "Mode: $mode"
echo "Install: $install"

echo "$ip"
echo "$port"
echo "$ssh_key"
echo "$ssh_user"

export NODE_ENV=production

if [ "$mode" = "build" ]; then

    echo "Building the project..."

    pnpm run db:generate:deploy
    pnpm run build

    echo "Copying the dist folders to the server..."

    scp -i $ssh_key -P $port -r ./apps/dashboard/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/dashboard/
    scp -i $ssh_key -P $port -r ./apps/auth/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/auth/
    scp -i $ssh_key -P $port -r ./apps/storage/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/storage/
    scp -i $ssh_key -P $port -r ./apps/web/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/web/

    scp -i $ssh_key -P $port -r ./packages/database/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/packages/database/
    scp -i $ssh_key -P $port -r ./packages/lib/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/packages/lib/

    scp -i $ssh_key -P $port -r ./.env.production $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/

    echo "Done!"

elif [ "$mode" = "deploy" ]; then

    echo "Deploying the project..."

    if [ "$install" = "dependencies" ]; then
        echo "Installing the dependencies..."
        pnpm install --max-network-concurrency=1 -P
    fi

    echo "Generating prisma client..."

    pnpm run db:generate

    echo "Building the project..."

    echo "Copying web bundle to the nginx folder..."

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

elif [ "$mode" = "db:deploy" ]; then

    echo "Migrating to deploy database..."
    cd ./packages/database

    pnpm run db:migrate:deploy

    echo "Generating prisma client..."
    pnpm run db:generate:deploy

    cd ../../

    echo "Done!"

elif [ "$mode" = "seed:dev" ]; then
    echo "Seeding database..."
    pnpm run db:seed:dev

else
    echo "Unknown mode: $mode"
    exit 1
fi

cd ../../

export NODE_ENV=development