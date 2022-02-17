FROM node:16 AS test

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test

FROM node:16 AS build

WORKDIR /usr/src/app

ENV REACT_APP_BACKEND_URL="http://localhost:3000"

COPY --from=test /usr/src/app /usr/src/app

RUN npm run build

RUN npm install -g serve

CMD ["serve", "build", "-p", "3000"]