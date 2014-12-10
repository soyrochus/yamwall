FROM node:latest
MAINTAINER Iwan van der Kleijn <iwan@encamina.com>
CMD mkdir /enciosco
ADD . /enciosco/
WORKDIR /enciosco
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/node"]
CMD ["server.js"]
