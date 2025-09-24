FROM node:alpine
RUN mkdir -p /opt/node
COPY . /opt/node
WORKDIR /opt/node
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "server"]