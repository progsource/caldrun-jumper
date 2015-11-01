#! /bin/sh
docker run -it --rm -p 127.0.0.1:8080:80 -v `pwd`:/usr/share/nginx/html -w /usr/share/nginx/html richarvey/nginx-nodejs $@
