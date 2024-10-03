# Settings

> See the [README.md](./README.md) for Quick Start instructions

> NOTE: the Quick Start includes finding the default settings needed for the
> Test Environment

---

## Settings and Values

- `APPINSIGHTS_INSTRUMENTATION_KEY`: Instrumentation key for azure application
  insights

- `GUESTMEMBEREXPERIENCE_CORS_HOSTS`: comma delimited allowed hosts
  ('test.prescryptive.io,other.com')

- `SERVICE_BUS_CONNECTION_STRING` : Connection String for azure service bus

- `TOPIC_NAME_UPDATE_PERSON` : Azure service bus topic name to update person
  details

- `TOPIC_NAME_UPDATE_ACCOUNT` : Azure service bus topic name to update account
  details

- `TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT` : Azure service bus topic name to
  create health record event

- `TOPIC_NAME_APPOINTMENT_CANCELLED_EVENT` : Azure service bus topic name to
  send a Cancellation request for an appointment

- `TOPIC_NAME_COMMON_BUSINESS_EVENT` : Azure service bus topic name to write
  business events to common business event

- `TOPIC_NAME_COMMON_MONITORING_EVENT` : Azure service bus topic name to write
  exception details to common monitoring event

- `DATABASE_CONNECTION` : Connection String for azure RxAssistant_dev DB
  <"mongodb://hostname:port/database">

- `NODE_ENV` : Defaults to development <"development">

- `PORT` : <4300>

- `JWT_TOKEN_SECRET_KEY`: Secret key to generate the token. Key must be at least
  32 bytes

- `JWT_TOKEN_EXPIRES_IN`: Duration for which the token must be valid

- `TWILIO_VERIFICATION_SERVICE_ID`: Your Twilio Verify service SID from
  https://www.twilio.com/console/verify/services

- `TWILIO_ACCOUNT_SID`: Your Account SID from www.twilio.com/console

- `TWILIO_AUTH_TOKEN`: Your Auth Token from www.twilio.com/console

- `CERTIFICATE_PFX_FILE`: Base64 encoded content of the .pfx file. Replace line
  breaks with \n

- `CERTIFICATE_PFX_PASS`: PFX Password

- `CHILD_MEMBER_AGE_LIMIT`: Age limit for child dependents

- `DEVICE_TOKEN_EXPIRES_IN` : Expiry time of phone token ( 30 days )

- `REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN` : Expiry time of phone token key stored in
  redis ( 30 days )

- `ACCOUNT_TOKEN_EXPIRES_IN` : Expiry time of account token ( 30 min )

- `REDIS_HOST` : "hostname of redis cache"

- `REDIS_AUTH_PASS` : "Auth pass to connect to redis"

- `REDIS_PORT` : "port of redis client" ( 6380 )

- `REDIS_PIN_RESET_SCAN_DELETE_COUNT` : "count of records to scan/delete the
  keys in redis"

- `HEALTHBOT_WEBCHAT_SECRET` : Secret to validate connection to webchat

- `HEALTHBOT_APP_SECRET` : Secret used to sign jwt for healthbot

- `ORDER_NUMBER_BLOCK_LENGTH`: Length of the block by which order number value
  is increased in redis (Default 100)

- `CANCEL_APPOINTMENT_WINDOW_HOURS`: Buffer time to allow users to cancel their
  scheduled appointment

- `TWILIO_REMOVE_WAITLIST_URL` : Configuring this url in Twilio to remove a
  person from waitlist.

- `PARTNER_JWKS_ENDPOINTS` : Comma delimited string of semicolon key;value pairs
  that representing our partners' jwks end points.
