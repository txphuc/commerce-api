FROM node:16
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 5000
CMD [ "node", "dist/main.js" ]
