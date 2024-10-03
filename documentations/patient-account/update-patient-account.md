# Update Account

There are 2 endpoints to update. if you want to update whole record then use
PUT, PATCH can be used to update specific things

All endpoints will need 1 header

1. Ocp-Apim-Subscription-Key (This is already set up in postman) or taken from
   https://prescryptivehealth.sharepoint.com/:t:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test/Auth0TokenInformation.md?csf=1&web=1&e=6Rti5M

## PUT

Note: Not all properties can be updated using PUT

In order to update get the current patient account record by using get
https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}

and change the values you want to change and then call PUT endpoint

PUT https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}

## PATCH

### By PATCH authentication object can be updated

PATCH
https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}/authentication

Request Body

```
    {
        "metadata":{
                "PIN": [
                {
                "key": "new account key",
                "value": "new pin hash"
                }
            ]
        }
    }
```

### By PATCH state object can be updated

PATCH
https://gears.test.prescryptive.io/myrx-account/accounts/{accountId}/status
Request Body

```
    {
        "state":"VERIFIED"
    }
```
