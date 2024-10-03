// Copyright 2018 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { ApiConstants } from './api-constants';
import { SmartPriceConstants } from '@phx/common/src/models/smartprice-constants';

describe('ApiConstants', () => {
  it('should have expected constants', () => {
    const expected = {
      CHILD_MEMBER_AGE_LIMIT: 13,
      MEMBER_MINIMUM_AGE: 18,
      SAME_AS_PRIMARY: 'Same as primary',
      IGM_RESULT_CODE: 'IgM',
      IGG_RESULT_CODE: 'IgG',
      DEFAULT_RX_GROUP_TYPE: 'SIE',
      LONG_DATE_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
      SHORT_DATE_FORMAT: 'YYYY-MM-DD',
      DAY_MONTH_DATE_FORMAT: 'dddd, MMMM Do',
      MONTH_DATE_YEAR_FORMAT: 'MMMM D, YYYY',
      MONTH_DATE_FORMAT: 'MMMM D',
      SLOT_NAME_FORMAT: 'h:mm a',
      DATE_TEST_RESULT_FORMAT: 'MM/DD/YYYY',
      TIME_TEST_RESULT_FORMAT: 'h:mm A',
      EVENT_APPLICATION_NAME: 'rxassistant-api',
      APPOINTMENT_EVENT_TYPE: 'appointment/confirmation',
      ANTIGEN_CONSENT_EVENT_TYPE: 'consent/antigen',
      TEST_RESULT_EVENT_TYPE: 'observation',
      ANTIGEN_TEST_TYPE: '14613033908',
      EXCHANGE_URL:
        'https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token',
      RESOURCE_TOKEN_URL:
        'https://login.microsoftonline.com/{tenantId}/oauth2/token',
      GRAPH_API_SCOPE: 'https://graph.microsoft.com/.default',
      OAUTH_API_BODY:
        'client_id={clientId}&client_secret={clientSecret}&scope={scope}&grant_type=client_credentials',
      OAUTH_API_BODY_RESOURCE:
        'client_id={clientId}&client_secret={clientSecret}&resource={scope}&grant_type=client_credentials',
      CANCEL_APPOINTMENT_REQUEST_URL: `{baseUrl}/appointment/{ordernumber}`,
      PAYMENTS_REDIRECT_SUCCESS_URL: `{baseUrl}/checkout/result?s={CHECKOUT_SESSION_ID}&r=success&p={CHECKOUT_PRODUCT_TYPE}&o={CHECKOUT_ORDER_NUMBER}&op={CHECKOUT_OPERATION_ID}&{switches}`,
      PAYMENTS_REDIRECT_CANCEL_URL: `{baseUrl}/checkout/result?s={CHECKOUT_SESSION_ID}&r=cancel&p={CHECKOUT_PRODUCT_TYPE}&o={CHECKOUT_ORDER_NUMBER}&op={CHECKOUT_OPERATION_ID}&{switches}`,
      SCHEDULER_MIN_AGE_LIMIT: 18,
      APPOINTMENT_MIN_AGE_LIMIT: 0,
      PHARMACY_DISTANCE_FROM_ZIP: 500,
      APPOINTMENT_NO_SHOW_CODE: 'Z02.9',
      IMMUNIZATION_RESULT_TYPE: 'immunization',
      BROKER_REFERRAL_EVENT_TYPE: 'referral/broker',
      SMART_PRICE_EMAIL_SENDER_NAME: 'Prescryptive',
      SMART_PRICE_EMAIL_SENDER_EMAIL: 'noreply@prescryptive.com',
      SMART_PRICE_EMAIL_SUBJECT: 'Savings for your medications',
      SMART_PRICE_EMAIL_TEMPLATE_ID: 'd-fbbc981d41524d079da781562629ddcc',
      CASH_USER_RX_SUB_GROUP: 'CASH01',
      CASH_USER_SMARTPRICE_SUB_GROUP: 'SMARTPRICE',
      CASH_USER_RX_GROUP: SmartPriceConstants.group,
      CASH_USER_RX_GROUP_TYPE: RxGroupTypesEnum.CASH,
      CASH_USER_RX_BIN: SmartPriceConstants.bin,
      CASH_USER_CARRIER_PCN: SmartPriceConstants.pcn,
      PRIMARY_MEMBER_PERSON_CODE: '01',
      AUTHORIZATION_HEADER_KEY: 'Authorization',
      VERSION_HEADER_KEY: 'x-version',
      PLATFORM_API_HEADER_KEY: 'Ocp-Apim-Subscription-Key',
      PRESCRIPTION_PRICE_EVENT_TYPE: 'prescription/price',
      NUM_PHARMACY_LIMIT: 50,
      MAX_NUM_PHARMACY_LIMIT: 150,
      PHARMACY_SEARCH_RADIUS_MILES: 25,
      SIE_USER_RX_SUB_GROUP: 'HMA01',
      MEDICINE_CABINET_PAGE_SIZE: 5,
      MEDICINE_CABINET_DEFAULT_PAGE: '1',
      MEDICINE_CABINET_API_TIMEOUT: 20000,
      SUPPORT_EMAIL: 'support@prescryptive.com',
      COUNTRY_CODE: '+1',
      RETRY_POLICY_DEFAULT_RETRIES: 3,
      RETRY_POLICY_DEFAULT_PAUSE: 2000,
      RETRY_POLICY_DEFAULT_TIMEOUT: 3000,
      WAYSTAR_INSURANCE_ELIGIBILITY_NPI_FALLBACK: '1234567893',
      WAYSTAR_INSURANCE_ELIGIBILITY_API_URL_ENVELOPE_TAG_KEY:
        'WAYSTAR_API_URL_ENVELOPE_TAG_KEY',
      DEFAULT_LANGUAGE: 'English',
      NEARBY_PHARMACIES_DEFAULT_DISTANCE: 25,
      NEARBY_PHARMACIES_DEFAULT_LIMIT: 150,
      AUDIT_VIEW_EVENT_APPOINTMENT: 'myrx-view/appointment',
      AUDIT_VIEW_EVENT_TEST_RESULTS: 'myrx-view/test-result',
      AUDIT_VIEW_EVENT_VACCINE_RECORD: 'myrx-view/vaccine-record',
      AUDIT_VIEW_EVENT_PRESCRIPTION: 'myrx-view/prescription',
      AUDIT_VIEW_EVENT_CLAIM_ALERT: 'myrx-view/claim-alert',
      DEFAULT_API_TIMEOUT: 20000,
      LANGUAGE_SYSTEM: 'urn:ietf:bcp:47',
    };

    expect(ApiConstants).toEqual(expected);
  });
});
