#!/usr/bin/env bash

if [ -z "$MQTT_PORT_1883_TCP" ]; then
    echo "Need to set MQTT_PORT_1883_TCP"
    exit 1
fi

if [ -z "$YOULESS_HOST" ]; then
    echo "Need to set YOULESS_HOST"
    exit 1
fi

echo node src/app.js -m $MQTT_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YOULESS_HOST
node -v
node src/app.js -m $MQTT_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YOULESS_HOST



