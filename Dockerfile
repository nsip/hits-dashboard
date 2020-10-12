# docker build -t nsip/hist-dashboard:latest -t nsip/hits-dashboard:v0.1.0 .
# docker push nsip/hits-dashboard:v0.1.0
# docker push nsip/hits-dashboard:latest
FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

CMD [ "node", "bin/www" ]
