#!/usr/bin/env bash

sudo apt-get update

#install node js
#https://github.com/nodesource/distributions/blob/master/README.md
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs


#install pm2 to run everything
sudo npm i -g pm2 


####nginx

#install nginx, the -y says yes to "Do you want to continue? [Y/n] " questions
sudo apt-get install -y nginx
#remove default
sudo unlink /etc/nginx/sites-enabled/default

#copy file to sites avaible
cd ~/
sudo mv custom_server.conf /etc/nginx/sites-available/

#link file
cd ~/
sudo ln -s /etc/nginx/sites-available/custom_server.conf /etc/nginx/sites-enabled/custom_server.conf




###Git Clone
cd ~/
rm -rf spotifyProducers/
git clone https://github.com/kianyewest/spotifyProducers.git

### Clean up any existing pm2 instances


###Start Api

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

export NODE_OPTIONS=--max_old_space_size=4096

npm install
npm run build

#serve static files with nginx instead
#pm2 serve build/ 3000 --name "react-spotify-build" --spa

##Restart
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx




