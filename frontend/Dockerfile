# Use an official node runtime as a parent image
FROM node:12.2.0-alpine

#RUN mkdir -p /app/pulp
WORKDIR /app/code_tutorial_nextjs

# add `/app/pulp/node_modules/.bin` to $PATH
ENV PATH /app/code_tutorial_nextjs/node_modules/.bin:$PATH

# Install and cache dependencies
# COPY ./code_tutorial_nextjs/package.json /app/code_tutorial_nextjs
# COPY ./pulp/package-lock.json /app/code_tutorial_nextjs
COPY ./code_tutorial_nextjs /app/code_tutorial_nextjs

RUN npm install

# Note:
# To enable hot reloading, uncomment the COPY command below
# The volume mount specified in docker-compose will be used mount the src dir 
# Additionally note that on on macOs, the ./frontend folder will have to
# be given Docker File Sharing permissions!
# COPY ./pulp/src /app/src

EXPOSE 3000 

RUN npm run build

CMD ["npm", "run", "docker-dev"]
