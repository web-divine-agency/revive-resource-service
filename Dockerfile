FROM node:20.18.0-alpine

WORKDIR /var/www/revive-resource-service

COPY package.json /

RUN rm -rf node_modules \
  && rm -rf package-lock.json \
  && npm install -g nodemon \
  && npm install

COPY . .

EXPOSE 8805 4405

CMD ["npm", "start"]