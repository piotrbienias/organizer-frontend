FROM node:9.11.1-alpine

WORKDIR /usr/app/organizer-frontend

ENV PATH /usr/app/organizer-frontend/node_modules/.bin:$PATH

COPY package.json .
RUN npm install --quiet
RUN npm install react-scripts -g --quiet

COPY . .