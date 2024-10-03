
openssl req \
  -new \
  -newkey rsa:2048 \
  -days 999 \
  -nodes -x509 \
  -subj "/C=US/ST=localhost/L=localhost/O=localhost/CN=localhost" \
  -keyout ./localhost.key \
  -out ./localhost.crt \
  -passout pass:localhost

openssl pkcs12 \
  -inkey ./localhost.key \
  -in ./localhost.crt \
  -export \
  -out ./localhost.pfx \
  -password pass:localhost

openssl base64 \
  -in ./localhost.pfx \
  -out ./localhost.base64.pfx

cat ./localhost.base64.pfx | \
sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g'