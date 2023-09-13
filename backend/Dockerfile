FROM ubuntu:22.04
WORKDIR /usr/app
RUN apt update
RUN apt install -y curl sudo wget vim
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm i -g yarn
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build
ENV PORT=5000
CMD [ "node","build" ]