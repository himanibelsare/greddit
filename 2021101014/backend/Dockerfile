FROM node:17-alpine

RUN npm install -g nodemon

WORKDIR /backend

COPY package.json .
RUN npm install
# copy the files 
COPY . .
# 
EXPOSE 8000
CMD ["npm", "run", "dev"]
