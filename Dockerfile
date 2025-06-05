FROM node:20.14.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN chown node:node . -R

CMD ["npx", "gulp", "serve", "--gulpfile", "gulp/gulpfile.js"]

EXPOSE 3000 3001