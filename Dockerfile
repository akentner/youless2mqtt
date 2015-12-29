FROM node:latest

ADD . /app
WORKDIR /app

RUN npm install

ENV NODE_ENV production
ENV MQTT_TOPIC youless
ENV MQTT_QOS 0
ENV YOULESS_HOST null

CMD ./run.sh