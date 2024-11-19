#!/bin/bash

NGINX_DIR="/etc/nginx"
DEV_CONF="$NGINX_DIR/nginx.dev.conf"
PROD_CONF="$NGINX_DIR/nginx.prod.conf"
ACTIVE_CONF="$NGINX_DIR/nginx.conf"

if [[ $1 == "dev" ]]; then
    sudo ln -sf $DEV_CONF $ACTIVE_CONF
    echo "Configuración cambiada a desarrollo."
elif [[ $1 == "prod" ]]; then
    sudo ln -sf $PROD_CONF $ACTIVE_CONF
    echo "Configuración cambiada a producción."
else
    echo "Uso: $0 [dev|prod]"
    exit 1
fi

sudo nginx -s reload
