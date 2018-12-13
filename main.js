/*
* Provide a connection object
* Show status of connection (it should try to connect when loaded)
* Format form to JSON to publish
* Publish JSON to topic, use QOS 1
* ?? Verify that publish happened before clearing + success message
*/

// DEFINE CLIENT VARIABLES
const SUB_TOPIC = typeof submitTopic !== "undefined" ? submitTopic : "mqtt-webform/status";
const BIRTH_DEATH_TOPIC = typeof statusTopic !== "undefined" ? statusTopic : "mqtt-webform/submissions";
const DEATH_MESSAGE = typeof lastWillMessage !== "undefined" ? lastWillMessage : "web-form offline";
const BIRTH_MESSAGE = typeof birthMessage !== "undefined" ? birthMessage : "web-form online";
const WS_PORT = typeof websocketPort !== "undefined" ? websocketPort : 9001;
const MQTT_BROKER = typeof brokerHost !== "undefined" ? brokerHost : "localhost";
const CLIENT_ID = typeof clientID !== "undefined" ? clientID : "mqtt-webform";

let myDeathMessage = new Paho.Message(DEATH_MESSAGE);
myDeathMessage.destinationName = BIRTH_DEATH_TOPIC;
let myBirthMessage = new Paho.Message(BIRTH_MESSAGE);
myBirthMessage.destinationName = BIRTH_DEATH_TOPIC;

const MESSAGES = {
    BIRTH: myBirthMessage,
    DEATH: myDeathMessage
};

// CREATE CLIENT
let client = new Paho.Client(MQTT_BROKER, WS_PORT, CLIENT_ID);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect,willMessage:MESSAGES.DEATH});


// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(SUB_TOPIC);
    client.send(MESSAGES.BIRTH);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
}