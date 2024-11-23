
#!/bin/bash

# Usage: ./deployment.sh [mode] [migrate] [seed]
# mode: build | deploy

set -a && source .env && set +a

mode=$1
migrate=$2
seed=$3

ip=$VM_IP
port=$VM_PORT
ssh_key=$VM_SSH_KEY_PATH
ssh_user=$VM_USER

if [ -z "$mode" ]; then
    echo "Error: Mode (build | deploy) is required"
    exit 1
fi

if [ "$mode" = "upload" ]; then

    pnpm run build --filter=!mobile-app

    scp -i $ssh_key -P $port -r ./apps/dashboard/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/dashboard/
    scp -i $ssh_key -P $port -r ./apps/auth/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/auth/
    scp -i $ssh_key -P $port -r ./apps/storage/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/storage/
    scp -i $ssh_key -P $port -r ./apps/web/dist $ssh_user@$ip:/home/$ssh_user/Proteccion-Mayor/apps/web/

elif [ "$mode" = "deploy" ]; then

    pnpm install
    sudo mkdir -p /var/www/pmtemuco
    sudo rm -rf /var/www/pmtemuco/*
    sudo mv ./apps/web/dist/* /var/www/pmtemuco/

    sudo chown -R www-data:www-data /var/www/pmtemuco
    sudo chmod -R 755 /var/www/pmtemuco

    pm2 stop all
    pm2 delete all
    pm2 flush

    cd ./apps/auth/
    pm2 start "./dist/index.js" --name "Authentication Service" -i 2

    cd ../../apps/dashboard/
    pm2 start "./dist/index.js" --name "Dashboard Service" -i 3

    cd ../../apps/storage/
    pm2 start "./dist/index.js" --name "Storage Service" -i 1

    cd ../../packages/database/

    if [ "$migrate" = "migrate" ]; then
        echo "Migrating database..."
        pnpm run db:migrate:dev
        echo "Generating prisma client..."
        pnpm run db:generate
    fi

    if [ "$seed" = "seed" ]; then
        echo "Seeding database..."
        pnpm run db:seed
    fi

    cd ../../

    pm2 list
fi
