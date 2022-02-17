FROM node:16 AS test

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

FROM node:16 AS build

WORKDIR /usr/src/app

ARG REACT_APP_BACKEND_URL

ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY --from=test /usr/src/app /usr/src/app

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build", "-p", "4000"]