var mqtt   = require('mqtt');

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .options({
        'm': {
            alias: 'mqtt',
            demand: true,
            default: 'tcp://localhost:1883',
            describe: 'MQTT address',
            type: 'string'
        },
        't': {
            alias: 'topicPrefix',
            demand: false,
            default: 'youless',
            describe: 'MQTT topic prefix',
            type: 'string'
        },
        'q': {
            alias: 'qos',
            demand: false,
            default: '0',
            describe: 'MQTT QoS',
            type: 'string'
        },
        'y': {
            alias: 'youless',
            demand: true,
            describe: 'Youless',
            type: 'string'
        }
    })
    .help('h').alias('h', 'help')
    .argv;

var retain = true;
var topicPrefix = argv.t;
var qos = parseInt(argv.q);

var Youless = require('./lib/youless');

var mqttConnection = mqtt.connect(argv.m, {
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    will: {topic: topicPrefix + '/connect', payload: null, qos: qos, retain: retain}
});

mqttConnection.on('connect', function () {
    console.log('MQTT connect');

    Youless.on('connect', function() {
        console.log('Youless connected');
        mqttConnection.publish(topicPrefix + '/connect', Math.floor(Date.now() / 1000).toString(), {retain: retain, qos: qos});
    });

    Youless.on('data', function(data) {
        //console.log(data);
        data = JSON.parse(data);
        Object.keys(data).forEach(function(key) {
            mqttConnection.publish(topicPrefix + '/status/' + key, data[key]+'', {retain: retain, qos: qos});
        });
        mqttConnection.publish(topicPrefix + '/status/ts', Math.floor(Date.now() / 1000).toString(), {retain: retain, qos: qos});
    });

    Youless.connect(argv.y);
});
