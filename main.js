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
document.getElementById("content").style.display = "none";

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


function sendFormData() {
    let data = {};
    // Just grab all the input data.
    let inputs = document.getElementsByTagName("input");
    for (let el of inputs) {
        if (el.id.length > 0 && el.value !== "")
            data[el.id] = el.value;
    }
    // Don't forget <select>
    inputs = document.getElementsByTagName("select");
    for (let el of inputs) {
        let chosen = [];
        console.log(el.children);
        for(let i=0;i<el.children.length;i++) {
            if (el.children[i].selected)
                chosen.push(el.children[i].value);
        }
        data[el.id] = chosen.join(",");
    }
    // Format the message
    let dataMessage = new Paho.Message(JSON.stringify(data));
    dataMessage.destinationName = SUB_TOPIC;
    // Send the message
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
    document.getElementById("connectionDetails").classList.remove("border-danger");
    document.getElementById("connectionDetails").classList.add("border-success");
    document.getElementById("content").style.display = "block";
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    document.getElementById("clientStatus").innerText = "disconnected";
    document.getElementById("connectionDetails").classList.add("border-danger");
    document.getElementById("connectionDetails").classList.remove("border-success");
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
}