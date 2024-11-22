
#!/bin/bash

# Usage: ./deployment.sh [mode] [migrate] [seed]
# mode: prod-nginx | prod-preview

mode=$1

migrate=$2
seed=$3

pnpm install
pnpm run build --filter=!mobile-app

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
    pnpm run db:migrate:dev
    pnpm run db:generate
fi

if [ "$seed" = "seed" ]; then
    echo "Seeding database..."
    pnpm run db:seed
fi

cd ../../

pm2 list