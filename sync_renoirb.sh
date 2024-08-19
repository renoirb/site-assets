#!/usr/bin/env bash

function error { printf "Error: %s \n " "$@" >&2; exit 1; }

if [[ ! -d /volume1/web-vhosts/renoirb.com/site/esm-modules ]]; then
  error "Directory not found '/volume1/web-vhosts/renoirb.com/site/esm-modules' Are you on the NAS?"
fi


rsync -avz static/esm-modules/ /volume1/web-vhosts/renoirb.com/site/esm-modules/
