# mqtt-form
A small form and javascript that will send the results over mqtt.

## Usage
Simple to set up:

1. Copy example-form.html to index.html
2. Edit the variables in the head of index.html
3. Edit the form in index.html

The only thing index.html requires is main.js and lib/paho-mqtt.min.js to run.

There is a CDN import for a bootswatch theme, but you can easily remove the link in the head of
index.html.

## Development
When testing I set up an docker container with `docker run -ti -p 1883:1883 -p 9001:9001 toke/mosquitto
`. ([Source](https://github.com/toke/docker-mosquitto))