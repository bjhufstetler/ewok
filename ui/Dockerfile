FROM node:alpine

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 5173

CMD ["npx", "serve", "-s", "build"]