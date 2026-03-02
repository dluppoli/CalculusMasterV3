docker run --rm \
  -v keysvolume:/keys \
  alpine:latest sh -lc '
    apk add --no-cache openssl &&
    umask 077 &&
    openssl genpkey -algorithm RSA -out /keys/private.key -pkeyopt rsa_keygen_bits:2048 &&
    openssl rsa -pubout -in /keys/private.key -out /keys/public.key
  '

docker run --rm -it \
    -v keysvolume:/keys \
    alpine:latest sh
