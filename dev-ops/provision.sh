#!/usr/bin/env bash

echo "Configuring appropriate versions for Node, etc, for Esri project"
echo "Note that grunt-cli requires newer version of node than apt-get was providing"
apt-get update >/dev/null 2>&1

wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-x64.tar.gz

gunzip node-v0.10.24-linux-x64.tar.gz

tar -xf node-v0.10.24-linux-x64.tar

echo "Downloaded - now installing for availability"
mv node-v0.10.24-linux-x64 /usr/local/sbin
cd /usr/local/sbin
ln -s node-v0.10.24-linux-x64/bin/node node
ln -s node-v0.10.24-linux-x64/bin/npm npm

echo "Node version " & node -v
echo "Npm version " & npm -v

echo "Setting up grunt"
npm install -g grunt-cli

apt-get --yes install git

# To run jsdoc, need Java installed and JAVA_HOME available
apt-get --yes install openjdk-7-jdk
export JAVA_HOME=/usr/bin/java

cd /home/vagrant

# eventually, be able to download code from Git.
#  But while it's still a private repo, we'll have to stop here...

# download code - pulling into esri directory for ease in linking from web application server
# git clone https://github.com/Esri/Esri-Ozone-Map-Widget.git esri
# cd esri

# npm install

# grunt





