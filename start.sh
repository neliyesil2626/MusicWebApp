#! /bin/bash
#/usr/local/bin/mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
sudo service mongod start #used to start the Mongodb on the ubuntu linux machine.
echo "db launched"

cd backend
npm start