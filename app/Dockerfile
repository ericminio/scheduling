FROM node:14.17.1-alpine3.13

COPY . /home/node/app/
RUN cd /home/node/app && \
    npm install

WORKDIR /home/node/app
CMD [ "npm", "start" ]