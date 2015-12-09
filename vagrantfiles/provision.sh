#!/bin/bash


dpkg -s npm &>/dev/null || {
sudo wget -qO- https://get.docker.com/gpg | apt-key add -
sudo echo deb http://get.docker.com/ubuntu docker main > /etc/apt/sources.list.d/docker.list
sudo apt-get -y update
apt-get -y install nodejs npm
ln -s /usr/bin/nodejs /usr/bin/node
sudo gpasswd -a vagrant docker
}

dpkg -s docker &>/dev/null || {
sudo apt-get install -y lxc-docker
}
