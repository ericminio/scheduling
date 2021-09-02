FROM node:14.17.1-alpine3.13

COPY app /home/node/app/
COPY yop /home/node/yop/
RUN cd /home/node/app && \
    npm install --only=prod

WORKDIR /home/node/app
CMD [ "npm", "start" ]