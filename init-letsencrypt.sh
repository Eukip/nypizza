#!/bin/bash

#working
docker run -it --rm -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot certonly --webroot --webroot-path=/var/lib/letsencrypt -d sp-crm.nypizza.kg