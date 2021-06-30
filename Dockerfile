FROM node:14.17.1-alpine3.13

COPY package.json /home/node/app/
COPY app /home/node/app/app

WORKDIR /home/node/app
CMD [ "npm", "start" ]
