# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
ARG MONGO_TOOLS_VERSION=6.0
RUN wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-6.0.3.tgz &&  tar -zxvf mongodb-linux-x86_64-debian10-6.0.3.tgz \
   && sudo ln -s /mongodb-linux-x86_64-debian10-6.0.3/bin/* /usr/local/bin \
   && mkdir -p /var/lib/mongo && chown node /var/lib/mongo \
   && mkdir -p /var/log/mongodb && sudo chown node /var/log/mongodb

# to start mongo
# /usr/local/bin/mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork

RUN . /etc/os-release \
    && curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | gpg --dearmor > /usr/share/keyrings/mongodb-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian ${VERSION_CODENAME}/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y mongodb-mongosh \
    && if [ "$(dpkg --print-architecture)" = "amd64" ]; then apt-get install -y mongodb-database-tools; fi \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/* 

# cannot use systemctl
# && apt-get install -y mongodb-org \
# && systemctl start mongod \

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
CMD /usr/local/bin/mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork