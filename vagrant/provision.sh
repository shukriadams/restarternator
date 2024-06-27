#!/usr/bin/env bash
sudo apt-get update

# docker
sudo apt install docker.io -y
sudo apt install docker-compose -y
sudo usermod -aG docker vagrant

# nodejs
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install nodejs -y

# nodejs packages needed by wbtb
npm install yarn -g
npm install uglify-es -g
npm install concat-cli -g

# force startup folder to vagrant project
echo "cd /vagrant/src" >> /home/vagrant/.bashrc
