FROM node:alpine
RUN npm install -g pnpm
RUN mkdir -p /opt/node
COPY . /opt/node
WORKDIR /opt/node
RUN pnpm install
EXPOSE 8080
CMD ["pnpm", "run", "server"]
