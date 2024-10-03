# Patient Account

## Endpoint Details

POST https://gears.test.prescryptive.io/myrx-account/accounts

All the endpoints below will need 1 header

1. Ocp-Apim-Subscription-Key (This is already set up in postman) or taken from
   https://prescryptivehealth.sharepoint.com/:t:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test/Auth0TokenInformation.md?csf=1&web=1&e=6Rti5M

## Patient Account Creation

> **Note**: To generate phone hash for your phone number use this tool. Make
> sure to enter phone number with country code e.g. +12223334444
> https://codebeautify.org/sha512-hash-generator

### Create Complete PatientAccount: Primary

If you have a current MyRx account with pin set and you want to create a patient
account/patient identity record for the same, then create the payload as below

```
{
  "accountType": "myrx",
  "authentication":
    {
        "metadata":{
                "pin": [
                {
                "key": "accountKeyFromAccount",
                "value": "pinHashFromAccount"
                }
            ]
        }
    },
  "source": "myrx",
  "roles": [],
  "reference": [
    "value of phoneHash for your phone number",
    "cash primaryMemberRxId from Person"
  ],
    "userPreferences": {
      "favorites": [{"type":"pharmacies", "value":["12345"]}],
      "notifications": [{"type":"favoritePharmacies", "enabled":true}],
      "features": []
  },
  "termsAndCondition": {
    "hasAccepted": true,
    "allowSmsMessages": true,
    "allowEmailMessages": true,
    "fromIP": "12.0.0.0",
    "acceptedDateTime": "2022-09-23",
    "browser": true
},
  "status": { "state": "VERIFIED" },
  "patient": {
    "active": true,
    "birthDate": "2000-05-05",
    "communication": [
      {
        "language": {
          "coding": [
            {
              "code": "English",
              "system": "urn:ietf:bcp:47"
            }
          ]
        },
        "preferred": true
      }
    ],
    "gender": "female",
    "identifier": [
      {
       "use": "secondary",
        "value": "MyRx"
      },
      {
        "type": {
          "coding": [
            {
              "code": "MYRX-PHONE",
              "display": "Patient's MyRx Phone Number",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "your phone number with country code +12223334444"
      },
      {
        "type": {
          "coding": [
            {
              "code": "MYRX",
              "display": "Unique MyRx ID",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberRxId from Person e.g. CADCV601"
      },
      {
        "type": {
          "coding": [
            {
              "code": "CASH-FAMILY",
              "display": "Patient's Cash Family Id",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberFamilyId from Person e.g. CADCV6"
      }
    ],
    "name": [
      {
        "family": "LAST",
        "given": ["FIRST", "MIDDLE"],
        "use": "official"
      }
    ],
    "resourceType": "Patient",
    "telecom": [
      {
        "system": "phone",
        "use": "mobile",
        "value": "your phone number with country code +12223334444"
      },
      {
        "system": "email",
       "use": "home",
        "value": "recoveryEmail from Account"
      }
    ],
    "address": [
      {
        "use": "home",
        "type": "postal",
        "line": ["Street Address", "Apt Number"],
        "city": "HICKSVILLE",
        "state": "NY",
        "postalCode": "11753"
      }
    ]
  }
}
```

### Create PatientAccount when pin is not set

If you have a current MyRx account with pin not set and you want to create a
patient account/patient identity record for the same, then create the payload as
below (note: Pin info and the address wont be there)

```
{
  "accountType": "myrx",
  "authentication":
    {
        "metadata":{
        }
    },
  "source": "myrx",
  "roles": [],
  "reference": [
    "value of phoneHash for your phone number",
    "cash primaryMemberRxId from Person"
  ],
  "status": { "state": "VERIFIED" },
    "termsAndCondition": {
    "hasAccepted": true,
    "allowSmsMessages": true,
    "allowEmailMessages": true,
    "fromIP": "12.0.0.0",
    "acceptedDateTime": "2022-09-23",
    "browser": true
},
  "patient": {
    "active": true,
    "birthDate": "2000-05-05",
    "communication": [
      {
        "language": {
          "coding": [
            {
              "code": "English",
              "system": "urn:ietf:bcp:47"
            }
          ]
        },
        "preferred": true
      }
    ],
    "gender": "female",
    "identifier": [
      {
       "use": "secondary",
        "value": "MyRx"
      },
      {
        "type": {
          "coding": [
            {
              "code": "MYRX-PHONE",
              "display": "Patient's MyRx Phone Number",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "your phone number with country code +12223334444"
      },
      {
        "type": {
          "coding": [
            {
              "code": "MYRX",
              "display": "Unique MyRx ID",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberRxId from Person e.g. CADCV601"
      },
      {
        "type": {
          "coding": [
            {
              "code": "CASH-FAMILY",
              "display": "Patient's Cash Family Id",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberFamilyId from Person e.g. CADCV6"
      }
    ],
    "name": [
      {
        "family": "LAST",
        "given": ["FIRST", "MIDDLE"],
        "use": "official"
      }
    ],
    "resourceType": "Patient",
    "telecom": [
      {
        "system": "phone",
        "use": "mobile",
        "value": "your phone number with country code +12223334444"
      },
      {
        "system": "email",
       "use": "home",
        "value": "recoveryEmail from Account"
      }
    ]
  }
}
```

### Create PatientAccount for a CASH dependent

If you have a dependent and you want to create a patient account/patient
identity record for the same, then create the payload as below (Not pin info
wont be there and phone identifier wont be there and phoneHash wont be there in
references)

```
{
  "accountType": "myrx",
  "authentication":
    {
        "metadata":{

        }
    },
  "source": "myrx",
  "roles": [],
  "reference": [
    "cash primaryMemberRxId from Dependent"
  ],
  "status": { "state": "VERIFIED" },
  "patient": {
    "active": true,
    "birthDate": "2000-05-05",
    "communication": [
      {
        "language": {
          "coding": [
            {
              "code": "English",
              "system": "urn:ietf:bcp:47"
            }
          ]
        },
        "preferred": true
      }
    ],
    "gender": "female",
    "identifier": [
      {
       "use": "secondary",
        "value": "MyRx"
      },
      {
        "type": {
          "coding": [
            {
              "code": "MYRX",
              "display": "Unique MyRx ID",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberRxId from Dependent Person e.g. CADCV603"
      },
      {
        "type": {
          "coding": [
            {
              "code": "CASH-FAMILY",
              "display": "Patient's Cash Family Id",
              "system": "http://hl7.org/fhir/ValueSet/identifier-type"
            }
          ]
        },
        "value": "cash primaryMemberFamilyId from Dependent Person e.g. CADCV6"
      }
    ],
    "name": [
      {
        "family": "LAST",
        "given": ["FIRST", "MIDDLE"],
        "use": "official"
      }
    ],
    "resourceType": "Patient",
    "telecom": [
      {
        "system": "phone",
        "use": "mobile",
        "value": "Primary person phone number with country code +12223334444"
      },
      {
        "system": "email",
        "use": "home",
        "value": "recoveryEmail from Primary Person Account"
      }
    ],
    "address": [
    {
      "use": "home",
      "type": "postal",
      "line": ["Street Address", "Apt Number"],
      "city": "HICKSVILLE",
      "state": "NY",
      "postalCode": "11753"
    }
  ]
  }
}
```
