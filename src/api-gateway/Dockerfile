FROM node:19-alpine

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

CMD ["npm", "start"]