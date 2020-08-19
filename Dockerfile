FROM node:14.3.0 AS builder
WORKDIR /app 

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"
RUN cnpm install -g webpack

# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN cnpm install yarn -g
RUN  yarn config set registry https://registry.npm.taobao.org \
  && yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

# Install package cache
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Building
COPY . .
RUN yarn build

FROM nginx:1.19.0
COPY --from=builder app/dist /usr/share/nginx/html/
COPY --from=builder app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
