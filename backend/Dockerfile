# Use an official node runtime as a parent image
FROM node:12.2.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install and cache dependencies
COPY ./package.json /app
COPY ./ormconfig.json /app
COPY ./tsconfig.json /app

RUN npm install

# Note:
# To enable hot reloading, uncomment the COPY command below
# The volume mount specified in docker-compose will be used mount the src dir 
# Additionally note that on on macOs, the ./frontend folder will have to
# be given Docker File Sharing permissions!
COPY ./src /app

EXPOSE 4000 

CMD ["npm", "run", "dev"]

