#!/usr/bin/env bash
export IPADDRESS=ec2-13-211-62-242.ap-southeast-2.compute.amazonaws.com
export IPADDRESS_WITH_HTML=http://$IPADDRESS
envsubst '$IPADDRESS_WITH_HTML' < .env.template > .env

export $(grep -v '^#' .env | xargs)

#setUp file for api server

envsubst '$SPOTIFY_CLIENT_ID $SPOTIFY_CLIENT_SECRET $FRONTEND_URI $REDIRECT_URI $GENIUS_BEARER_TOKEN $REACT_APP_BACKEND_LINK' < ecosystem.config.template.js  > ecosystem.config.js

#setup nginx config

envsubst '$SERVER_PORT' < custom_server.template.conf > custom_server.conf

scp -i "adminAWS.pem" ecosystem.config.js ubuntu@$IPADDRESS:/home/ubuntu
scp -i "adminAWS.pem" custom_server.conf ubuntu@$IPADDRESS:/home/ubuntu
scp -i "adminAWS.pem" setup.sh ubuntu@$IPADDRESS:/home/ubuntu
scp -i "adminAWS.pem" .env ubuntu@$IPADDRESS:/home/ubuntu
