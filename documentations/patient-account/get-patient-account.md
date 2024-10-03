There are many ways to get patient account

All the endpoints mentioned will need one header

1. Ocp-Apim-Subscription-Key (This is already set up in postman) or taken from
   https://prescryptivehealth.sharepoint.com/:t:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test/Auth0TokenInformation.md?csf=1&web=1&e=6Rti5M

## Get Patient account by id

For a given accountId (from PatientAccount collection), get current
PatientAccount record by using

GET https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}

## Get Patient Account by Phone Number

First generate the phone hash for the given phone number (phone number should be
in format +12223334444)

then find the accountId using this API

GET
https://gears.test.prescryptive.io/myrx-account/accounts?sourceReference={phoneHash}

## Get Patient Account by Cash member id

For a given cash member id, get current PatientAccount record by using

GET
https://gears.test.prescryptive.io/myrx-account/accounts?sourceReference={cashMemberId}
