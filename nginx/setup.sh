#!/bin/bash

NGINX_DIR="/etc/nginx"
DEV_CONF="./nginx.dev.conf"
PROD_CONF="./nginx.prod.conf"
ACTIVE_CONF="/etc/nginx/nginx.conf"

if [[ $1 == "dev" ]]; then
    sudo cp $DEV_CONF $ACTIVE_CONF
elif [[ $1 == "prod" ]]; then
    sudo cp $PROD_CONF $ACTIVE_CONF
else
    echo "Uso: $0 [dev|prod]"
    exit 1
fi

sudo nginx -s reload

