FROM node:latest

ADD . /app
WORKDIR /app

RUN npm install

ENV NODE_ENV production
ENV MQTT_PORT_1883_TCP tcp://localhost:1883
ENV MQTT_TOPIC youless
ENV MQTT_QOS 0
ENV YOULESS_HOST null

CMD ./run.sh