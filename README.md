# mqtt-form
A small form and javascript that will send the results over mqtt.

## Usage

When testing I set up an docker container with `docker run -ti -p 1883:1883 -p 9001:9001 toke/mosquitto
`. ([Source](https://github.com/toke/docker-mosquitto))

To use in your environment, set the variables in `index.html` to match your mqtt broker.
