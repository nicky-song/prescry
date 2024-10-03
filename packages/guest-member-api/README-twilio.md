# TWILIO Verify Service

> see the [README.md](./README.md) for Quick Start instructions

---

## Custom HTTP Status Codes

Twilio returns the following status codes for errors

- 551 : Server data error, when identifier not found in database

- 429 : Twilio error:
  - Error code 60203: Max send attempts reached
  - Error code 60202: Max verification check attempts reached
  - Error code 20003: Twillio account expired
  - Error code 60200: Invalid Parameter

---

## Setting up new instance of Twilio service

- Login to twilio (https://www.twilio.com/)
- Navigate to your project on twilio dashboard.
- Visit https://www.twilio.com/console/verify/services
- Create a new service.
- Provide a name to your service ( e.g Prescryptive Health Care).
- Your service will be created.
- Update `CODE LENGTH` in General settings to set the length of the code which
  will be sent to the user.

- In the API .env file, assign the following values (see
  [Environment Settings in README.md](./README.md#environment-settings) ):

  - `TWILIO_VERIFICATION_SERVICE_ID`: Your Twilio Verify service SID from
    https://www.twilio.com/console/verify/services

  - `TWILIO_ACCOUNT_SID`: Your Account SID from www.twilio.com/console

  - `TWILIO_AUTH_TOKEN`: Your Auth Token from www.twilio.com/console

---

Related Links: https://www.twilio.com/docs/verify/developer-best-practices
