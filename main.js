/*
* Format form to JSON to publish
* Publish JSON to topic, use QOS 1
* ?? Verify that publish happened before clearing + success message
*/

// DEFINE CLIENT VARIABLES
const SUB_TOPIC = typeof submitTopic !== "undefined" ? submitTopic : "mqtt-webform/submissions";
const BIRTH_DEATH_TOPIC = typeof statusTopic !== "undefined" ? statusTopic : "mqtt-webform/status";
const DEATH_MESSAGE = typeof lastWillMessage !== "undefined" ? lastWillMessage : "web-form offline";
const BIRTH_MESSAGE = typeof birthMessage !== "undefined" ? birthMessage : "web-form online";
const WS_PORT = typeof websocketPort !== "undefined" ? websocketPort : 9001;
const MQTT_BROKER = typeof brokerHost !== "undefined" ? brokerHost : "localhost";
const CLIENT_ID = typeof clientID !== "undefined" ? clientID : "mqtt-webform";

let myDeathMessage = new Paho.Message(DEATH_MESSAGE);
myDeathMessage.destinationName = BIRTH_DEATH_TOPIC;
let myBirthMessage = new Paho.Message(BIRTH_MESSAGE);
myBirthMessage.destinationName = BIRTH_DEATH_TOPIC;

document.getElementById("brokerName").innerText = MQTT_BROKER;
document.getElementById("brokerPort").innerText = ""+WS_PORT;

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


function sendFormData(form) {
    let data = {
        name: document.getElementById("name").value
    };
    let dataMessage = new Paho.Message(JSON.stringify(data));
    dataMessage.destinationName = SUB_TOPIC;

    client.send(dataMessage);
}

//** CLIENT FUNCTIONS **////
// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(SUB_TOPIC);
    client.send(MESSAGES.BIRTH);
    document.getElementById("clientStatus").innerText = "connected";
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    document.getElementById("clientStatus").innerText = "disconnected";
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
}