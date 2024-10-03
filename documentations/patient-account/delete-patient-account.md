Since there is no endpoint to delete and it wont allow to create new if
phonehash exists in source, so update the phoneHash in reference to some other
value.

All the endpoints mentioned will need one header

1. Ocp-Apim-Subscription-Key (This is already set up in postman) or taken from
   https://prescryptivehealth.sharepoint.com/:t:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test/Auth0TokenInformation.md?csf=1&web=1&e=6Rti5M

## Cancel Patient Account for a given accountId

For a given accountId (from PatientAccount collection), get current
PatientAccount record by using

GET https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}

and change the references array and remove the phone hash and then call PUT
endpoint with this changed object

PUT https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}

## Cancel Patient Account for a given phone number

First generate the phone hash for the given phone number (phone number should be
in format +12223334444)

then find the accountId using this API

GET
https://gears.test.prescryptive.io/myrx-account/accounts?sourceReference={phoneHash}

If any result is returned, get accountId from it and follow steps in "Cancel
Patient Account for a given accountId" as listed above.
