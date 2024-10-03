# RTPB (Real-time Prescription Benefit Service API)

A Prescryptive Web API for the Real-time Prescription Benefit Service

Source:
https://app.swaggerhub.com/apis/Prescryptive/rtpb/1.0.1#/Pricing/v10_pricing_POST_RTPBPayload

## POST /1.0/pricing

Retrieve drug pricing from multiple internal/external RTPB (Real-time
Prescryption Benefits) vendor APIs.

URL: https://gears.test.prescryptive.io/rtpb/1.0/pricing

### Request

```
interface RTPBRequest {
  patient?: RTPBPatient;
  benefitsCoordination?: RTPBBenefitsCoordination;
  requestedProduct?: RTPBProductRequested;
  prescriber?: RTPBPrescriber;
  pharmacy?: RTPBPharmacy;
  extension?: Extension[];
}
```

### Response

```
interface RTPBResponse {
  response?: RTPBResponseType;
  patient: RTPBPatient;
  responseProduct?: RTPBResponseProduct;
  responseAlternativeProduct?: RTPBResponseAlternativeProduct[];
  restrictedPrescriber?: RTPBRestrictedPrescriber;
  extension?: Extension[];
}
```
