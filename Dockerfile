FROM node:20.14.0-alpine

WORKDIR /app

COPY package.json ./

RUN chown node:node . -R

RUN npm install

CMD ["node","./node_modules/gulp/bin/gulp.js","-f","/app/gulp/gulpfile.js","serve"]
#CMD ["tail", "-f", "/dev/null"]

EXPOSE 3000 3001