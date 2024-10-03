# Identity Service

## Postman Information

In postman, under "MyRx" workspace, find "QA Identity Service API" collection.
It has all the APIs set up

## Get Auth0 Token

There is a "Get Auth0 Token for Identity Service" endpoint.

Generate token from it and use it for any API calls below.

All the endpoints below will need 2 headers

1. Authorization (Auth0 token - Need to generate as it expires every 24 hours)
2. Ocp-Apim-Subscription-Key (This is already set up in postman)

Alternatively: the same information can be retrieved from "Product - MyRx" under
Files ->myrx-ux -> env-test folder

https://prescryptivehealth.sharepoint.com/:t:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test/Auth0TokenInformation.md?csf=1&web=1&e=6Rti5M

## Find Identity record by masterId

Get User from Identity Service by MasterId
https://gears.test.prescryptive.io/identity/patient/{masterId}

## Find Identity record(s) by phone number

To be created

## Find Identity record(s) by identifier

GET endpoint

https://gears.test.prescryptive.io/identity/patient/identifier?value={identifier1}

It will return a bundle and in entry array would be 1 or more identity records
matching the identifier

Each resource will have an id. This id is the `masterId`

## Find Identity record(s) by first name/last name/dob

https://gears.test.prescryptive.io/identity/patient/query

POST Endpoint

Request Body (Replace the correct value of birthDate, firstName and familyName)

```
{
  "birthDate": "YYYY-MM-DD",
  "familyName": "LASTNAME",
  "firstName": "FIRSTNAME"
}
```

## Update Identity record by masterId

First get identity record by master Id and then update the information that you
need to update and then use "PUT" endpoint to update it.

PUT endpoint

https://gears.test.prescryptive.io/identity/patient/{masterId}

## Soft Delete Identity record by masterId

First get identity record by master Id and then update phone number in all
places to 000-000-0000. Also update first name and Family Name to "XXXX" and
then use "PUT" endpoint to update it.

PUT endpoint

https://gears.test.prescryptive.io/identity/patient/{masterId}
