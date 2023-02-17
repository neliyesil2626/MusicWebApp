#! /bin/bash
/usr/local/bin/mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
echo "db launched"