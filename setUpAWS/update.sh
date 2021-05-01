#!/usr/bin/env bash

#copy file to sites avaible
cd ~/
sudo mv custom_server.conf /etc/nginx/sites-available/

###Start Api
cd ~/
cd spotifyProducers/
git pull
#copy template into server
cd ~/
sudo mv ./ecosystem.config.js spotifyProducers/server/
cd spotifyProducers/server
npm install
pm2 delete all
pm2 start ecosystem.config.js

### Start front end

cd ~/
mv .env spotifyProducers/client/
cd spotifyProducers/client/


npm install
npm run memoryBuild

#serve static files with nginx instead
#pm2 serve build/ 3000 --name "react-spotify-build" --spa

##Restart
sudo systemctl restart nginx




