#!/bin/sh
set -e

case $1 in

  ""|http)
    exec nginx -g "daemon off;"
  ;;

  *)
    exec "$@"
  ;;

esac

exit 0
