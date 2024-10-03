// Copyright 2018 Prescryptive Health, Inc.

export const LoginMessages = {
  AUTHENTICATION_FAILED:
    'Authentication failed! Age requirement is not met for creating an account',
  AUTHENTICATION_SUCCESSFUL: 'Authentication successful!',
  ADD_MEMBERSHIP_SUCCESS: 'Membership added successfully!',
  INVALID_MEMBER_RXID: 'Invalid primaryMemberRxId',
  INVALID_USER_DETAILS: 'Invalid user details',
  PHONE_NUMBER_EXISTS: 'Phone number already exists for this account.',
  PHONE_NUMBER_INVALID: 'Phone number is associated with another person',
  PHONE_NUMBER_MISMATCHED: 'Phone number mismatched. Please re-login',
  PROVISIONAL_LOGIN_SUCCESSFUL:
    'Provisional login successful. You must register with a valid phone number.',
};

export const SmartPriceRegistrationCodes = {
  DATE_OF_BIRTH_NOT_ALLOWED: {
    error_code: 'V-310',
    message: 'Date of Birth outside allowed range',
  },
  VALID_PHONE_NUMBER_REQUIRED: {
    error_code: 'V-320',
    message: 'Valid  phone number is required',
  },
};

export const LoginRequestValidationCodes = {
  DATE_OF_BIRTH_REQUIRED: {
    error_code: 'V-100',
    message: 'Date of Birth is Required',
  },
  FIRSTNAME_REQUIRED: {
    error_code: 'V-101',
    message: 'First Name is Required',
  },
  INVALID_DATE_FORMAT: {
    error_code: 'V-105',
    message: 'Invalid Date Format',
  },
  LASTNAME_REQUIRED: {
    error_code: 'V-102',
    message: 'Last Name is Required',
  },
  MAX_LENGTH_EXCEEDED: {
    error_code: 'V-104',
    message: 'Field Exceeds Max allowed Length',
  },
  RX_ID_REQUIRED: {
    error_code: 'V-103',
    message: 'Primary RX ID is Required',
  },
  EMAIL_ID_REQUIRED: {
    error_code: 'V-110',
    message: 'Email Id is Required',
  },
  INVALID_EMAIL_ID: {
    error_code: 'V-111',
    message: 'Invalid Email Id ',
  },
};

export const MemberUpdateRequestValidationCodes = {
  EMAIL_ID_REQUIRED: {
    error_code: 'V-110',
    message: 'Email Id is Required',
  },
  INVALID_EMAIL_ID: {
    error_code: 'V-111',
    message: 'Invalid Email Id ',
  },
  PHONE_NUMBER_REQUIRED: {
    error_code: 'V-112',
    message: 'Phone number is Required',
  },
  LANGUAGE_CODE_REQUIRED: {
    error_code: 'V-113',
    message: 'Language code is Required',
  },
};

export const SendOneTimePasswordRequestValidationCodes = {
  PHONE_NUMBER_REQUIRED: {
    error_code: 'V-2001',
    message: 'Phone number is Required',
  },
};

export const VerifyPhoneNumberValidationCodes = {
  CODE_REQUIRED: {
    error_code: 'V-2002',
    message: 'Verification Code is Required',
  },
  INVALID_CODE: {
    error_code: 'V-2003',
    message: 'Invalid code',
  },
  PHONE_NUMBER_REQUIRED: {
    error_code: 'V-2004',
    message: 'Phone number is Required',
  },
};

export const AddPinValidationCodes = {
  ENCRYPTED_PIN_REQUIRED: {
    error_code: 'V-2006',
    message: 'Encrypted pin is Required',
  },
};

export const UpdatePinValidationMessage = {
  ENCRYPTED_PIN_CURRENT_REQUIRED: {
    error_code: 'V-2007',
    message: 'Current Encryption Pin required',
  },
  ENCRYPTED_PIN_NEW_REQUIRED: {
    error_code: 'V-2008',
    message: 'New Encryption Pin required',
  },
};

export const SsoJwtTokenValidationCodes = {
  JWT_TOKEN_REQUIRED: {
    error_code: 'V-2009',
    message: 'Body field `jwt_token` is Required',
  },
  INVALID_JWT_TOKEN: {
    error_code: 'V-2010',
    message: 'jwt_token is invalid',
  },
  JWT_MISSING_FIELDS: {
    error_code: 'V-2011',
    message: 'jwt_token is missing required fields',
  },
};

export const TwilioErrorMessage = {
  TOO_MANY_TIMES: 'You have tried too many times',
  UNABLE_TO_SEND_CODE:
    'Unable to send verification code to the provided Number',
  UNSUPPORTED_LANDLINE_NUMBER: 'SMS is not supported by landline phone number',
  INVALID_EMAIL_FORMAT:
    'We are unable to send you an email. Please try your phone number.',
  INVALID_PHONE_NUMBER: 'Invalid phone number',
};

export const SuccessConstants = {
  ADD_PIN_SUCCESS: 'pin successfully added',
  CREATE_WITH_PIN: 'User needs to create PIN',
  DOCUMENT_FOUND: 'Document found successfully',
  LOGIN_WITH_PIN: 'User needs to login with PIN',
  MEMBER_UPDATE_SENT_SUCCESSFULLY: 'Member update has been sent successfully',
  PHONE_NUMBER_VERIFIED_SUCCESSFULLY_LOGIN:
    'Phone Number has been verified successfully. Please login',
  PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN:
    'Phone Number has been verified successfully. Please add pin',
  PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN:
    'Phone Number has been verified successfully. Please verify device using pin',
  SUCCESS_OK: 'Ok',
  UPDATE_PIN_SUCCESS: 'Pin updated successfully',
  VERIFY_PIN_SUCCESS: 'pin verified successfully',
  CANCEL_BOOKING_SUCCESS: 'Published cancelled status successfully',
  APPOINTMENT_ALREADY_CANCELED: 'Appointment is already canceled',
  ADD_EMAIL_SUCCESS: 'Recovery email added successfully',
  UPDATE_EMAIL_SUCCESS: 'Recovery email updated successfully',
  UPDATE_FAVORITED_PHARMACIES_SUCCESS:
    'Favorited pharmacies updated successfully',
  UPDATE_FEATURE_KNOWN_SUCCESS: 'Feature known updated successfully',
  UPDATE_LANGUAGE_CODE_SUCCESS: 'Language code updated successfully',
  VERIFY_IDENTITY_SUCCESS: 'Identity verified successfully',
  SEND_REGISTRATION_TEXT_SUCCESS: 'Registration text sent successfully',
  SEND_PRESCRIPTION_SUCCESS: 'Prescription sent successfully',
  TRANSFER_PRESCRIPTION_SUCCESS:
    'Transfer prescription request sent successfully',
  VERIFY_MEMBERSHIP_SUCCESS: 'Membership details are verified successfully',
  PERSON_FOUND_SUCCESSFULLY:
    'Person found successfully from prescription phone number',
  SEND_SUCCESS_MESSAGE: 'One Time Password sent successful',
  VERIFY_SSO_SUCCESS: 'SSO verified successfully',
};

export const ErrorConstants = {
  ACCOUNT_TOKEN_EXPIRED: 'Account token expired. Please verify with pin',
  ACCOUNT_TOKEN_MISSING: 'Account token is not supplied',
  ACCOUNT_PERSON_DATA_MISMATCH: 'Account and person data mismatch',
  COVERAGE_NOT_FOUND: 'No coverages found for this patient',
  ACTIVE_COVERAGES_NOT_FOUND: 'No active coverages found for this patient',
  COVERAGE_INVALID_DATA: 'Invalid or missing coverages for this patient',
  COVERAGE_MASTER_ID_MISSING: 'Master id missing for patient',
  INVALID_PATIENT_IDENTITY_DATA: 'Invalid or missing patient data',
  ADD_EMAIL_ERROR: 'Recovery email already exists',
  UPDATE_EMAIL_ERROR: 'Old recovery email provided does not match our records',
  UPDATE_FAVORITED_PHARMACIES_ERROR:
    'Invalid or missing favorited pharmacies list',
  UPDATE_FEATURE_KNOWN_ERROR: 'Invalid or missing feature known value',
  AUTH_TOKEN_MISSING: 'Auth token is not supplied',
  BAD_REQUEST_PARAMS: 'Missing/Invalid Request Data',
  DEVICE_NOT_VERIFIED: 'Device Not verified',
  DEVICE_TOKEN_MISSING: 'Device token is not supplied',
  AUTOMATION_PHONE_NUMBER_MISSING: 'Automation token is not supplied',
  WRONG_PHONE_NUMBER_ADDED: 'Entered phone number is incorrect',
  DOCUMENT_NOT_FOUND: 'Document not found',
  ALTERNATIVE_DRUG_SEARCH_FAILURE: 'Invalid or missing alternative drug prices',
  ERROR_FETCHING_REDIS_DATA: 'Error while fetching data from redis',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  INVALID_ANSWERS: 'All required questions are not answered',
  INVALID_IDENTIFIER: 'Invalid identifier',
  INVALID_ISO_DATE: (dateString = '') =>
    `'${dateString}' is not a valid ISO date.`,
  INVALID_MEMBER_RXID: 'Invalid primaryMemberRxId',
  INVALID_PIN: 'Invalid pin',
  INVALID_PIN_KEY: 'Invalid pin key',
  INVALID_TOKEN: 'Token is invalid',
  JWT_TOKEN_EXPIRED: 'Token is expired',
  MISSING_ADDRESS: 'Address is required to create the person',
  AGE_REQUIREMENT_NOT_MET_VACCINE:
    'Required age for vaccine appointment is not met',
  SCHEDULER_AGE_REQUIREMENT_NOT_MET:
    'Required age for scheduling an appointment is not met',
  DEPENDENT_APPOINTMENT_NOT_ALLOWED_VACCINE:
    'Cannot book vaccine appointment for dependent',
  INVALID_DEPENDENT_IDENTIFIER:
    'This identifier is not in allowed list of dependents',
  INVALID_DEPENDENT_MASTER_ID:
    'This master id is not in allowed list of dependents',
  MISSING_DEPENDENT_INFORMATION:
    'Information missing or invalid for new dependent',
  PERSON_NOT_FOUND: 'Person not found from prescription phone number',
  NEW_PIN_SAME: 'Pin entered cannot be same as previous',
  PHONE_NUMBER_MISSING: 'Phone Number is missing',
  PIN_ALREADY_SET: 'Pin already present',
  PIN_MISSING: 'Pin is missing',
  REDIS_MAX_ATTEMPTS_EXHAUSTED:
    'Redis maximum attempts for connection exhausted',
  SERVER_IS_STARTING: 'Server is starting',
  SERVICE_BUS_FAILURE: 'Error due to service bus exception',
  TOO_MANY_ATTEMPTS_FORGET_PIN:
    'You have tried too many times. Please navigate to Forget pin screen',
  TOO_MANY_OR_NO_ACTIVE_COVERAGES:
    'Too many (> 1) or no (0) active coverage found while fetching pricing',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  QUERYSTRING_MISSING: 'Missing required querystring',
  QUERYSTRING_INVALID: 'Invalid query',
  CANCEL_BOOKING_WINDOW_PASSED: 'Appointment cancellation window is closed',
  CANCEL_BOOKING_NOT_ELIGIBLE:
    'Booking/Appointment status is not valid to cancel',
  ORDER_NUMBER_MISSING: 'Order Number is missing in the request',
  TEST_RESULT_NOT_FOUND: 'Test result not found',
  INVITE_CODE_MISSING: 'Invite code is missing in the request',
  INVITE_CODE_EXPIRED: `We’re sorry, but this invitation has expired. Please contact your pharmacy for further assistance.`,
  INVITE_CODE_ALREADY_USED: `We’re sorry, but it looks like this invitation link has been used already. Please contact your pharmacy for a new invitation link.`,
  INVITE_CODE_INVALID_PHONE_NUMBER: `We’re sorry, but the phone number linked to this invitation is incorrect. Please contact your pharmacy for a new invitation link.`,
  INVITE_CODE_ALL_SLOTS_USED: `Unfortunately, all appointments have already been filled, but you haven't lost your place in line on the waitlist. A pharmacy will text you when another appointment opens up.`,
  DEEP_LINK_SCHEDULER_AGE_REQUIREMENT_NOT_MET: `You must be {ageRequirement} years old or older to schedule a {serviceName} appointment. If you think this is due to an error, please contact [{supportEmail}](mailto:{supportEmail})`,
  WAITLIST_INVALID_DEPENDENT:
    'You are not allowed to add this dependent to the waitlist',
  WAITLIST_MISSING_INFORMATION:
    'Information is missing or invalid in this request',
  WAITLIST_AGE_REQUIREMENT_NOT_MET:
    'We currently do not support appointment scheduling for individuals under {age} for {serviceName}',
  WAITLIST_ALREADY_ADDED:
    'This person is already on the {serviceName} waitlist',
  SMARTPRICE_NOT_ELIGIBLE:
    'Our SmartPRICE program is only available for users without a prescription drug plan.',
  SMARTPRICE_BROKER_EXISTS: 'Not available to user',
  RECOVERY_EMAIL_MISSING: 'This account does not have recovery email set',
  SMARTPRICE_USER_DOES_NOT_EXIST:
    'This user does not have a current SmartPRICE membership.',
  IDENTITY_VERIFICATION_FAILED:
    'The information you provided does not match our records. You have {attempts} attempts left before your account is locked.',
  PIN_RESET_LOCKED: 'Your account is locked due to multiple invalid attempts.',
  PIN_RESET_FAILED:
    'Invalid code. You have {attempts} attempts left before your account is locked.',
  IDENTITY_VERIFICATION_LOCKED:
    'The identity verification functionality has been locked.',
  SIE_PROFILE_NOT_FOUND: 'SIE Profile is not found.',
  UPDATE_CONTACT_INFO_FAILED:
    'Unable to update contact info for adult dependents',
  PHARMACY_ID_ALREADY_EXISTS:
    'Pharmacy ID already exists for this prescription',
  ZIPCODE_QUERYSTRING_MISSING: 'Zipcode is required in the request',
  PRESCRIPTION_ID_QUERYSTRING_MISSING:
    'Prescription ID is required in the request',
  PRESCRIPTION_DATA_MISMATCH: 'Prescription data mismatch error',
  PRESCRIPTION_DATA_DOES_NOT_MATCH_WITH_ENTERED:
    "Prescription data doesn't match with Patient entered",
  MISSING_BOOKINGID: 'BookingId is missing to create appointment request.',
  LOCATION_NOT_FOUND: 'Provider location {locationId} not found.',
  SERVICE_TYPE_NOT_FOUND:
    'Service type {serviceType} not found for provider location {location}.',
  SERVICES_SERVICE_TYPE_NOT_FOUND:
    'Service type {serviceType} not found in services.',
  PHARMACY_NOT_FOUND: 'Unable to find pharmacy with given ncpdp',
  NCPDP_MISSING: 'ncpdp is required in the request',
  PATIENT_MASTER_ID_MISSING: (phoneNumber: string) =>
    `Master id missing for patient with phone number ${phoneNumber}.`,
  PRESCRIPTION_ID_MISSING: 'prescription id is required in the request',
  PRESCRIPTION_MASTER_ID_MISSING: 'The prescription does not have master id',
  PRESCRIPTION_PERSON_FOR_MASTER_ID_MISSING:
    'Person does not exist for this master id',
  PRESCRIPTION_DATA_DOES_NOT_MATCH:
    'The prescription data does not match the provided first name and date of birth.',
  PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH:
    'The prescription telephone does not match the provided phone number.',
  PRESCRIPTION_UPDATE_FAILURE: 'Unable to update prescription with memberID',
  PRESCRIPTION_UPDATE_MEMBERID_MISSING: `Update Prescription's clientPatientId is missing`,
  NO_MEMBERSHIP_FOUND: 'No membership exists for logged in user',
  NO_PATIENT_FOUND_PRESCRIPTION:
    'Prescription does not have any patient information',
  INVALID_SERVICE_TYPE: 'Service type is not a valid service type',
  INVALID_SERVICE_LOCATION:
    "We're sorry, but this service is no longer available. Please contact your pharmacy for further assistance",
  INVALID_ZIPCODE_SEARCH:
    "Oops! We couldn't find that zip code. Please search for a different zip code.",
  INVALID_US_LOCATION: `This IP address is not for a valid US zip code {zipCode} {state} {city}`,
  ERROR_COORDINATES_SEARCH:
    'An error occurred in pharmacy search for coordinates.',
  SOURCE_PHARMACY_MISSING: 'Source pharmacy is missing in the request',
  DEST_PHARMACY_MISSING: 'Destination pharmacy is missing in the request',
  ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET: (age: number) =>
    `We currently do not support creating account for under ${age}`,
  NO_IP_FOUND: 'Client IP could not be determined',
  PHARMACY_SEARCH_FAILURE:
    'Sorry, our service is temporarily unavailable. Please check back again later.',
  INVALID_PRESCRIPTION_DATA: 'Prescription is missing some required details.',
  INVALID_PATIENT_DATA: 'Prescription is missing patient info.',
  NO_INSURANCE_ELIGIBILTY_ASSOCIATED_WITH_MEMBER:
    'No insurance eligibility exists with the member data provided',
  SOMETHING_WENT_WRONG: 'something went wrong while sending OTP',
  ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH:
    'user data is not matching with activation record.',
  GEOLOCATION_DETECTION_FAILURE:
    "Sorry, we couldn't detect your location, please enter it manually.",
  MAX_DEPENDENT_LIMIT_REACHED:
    'You have reached maximum people allowed on this MyRx account',
  INVALID_YEAR_FORMAT: 'Year format is invalid',
  PRESCRIBER_DETAILS_NOT_FOUND: 'Prescriber details not found',
  PRESCRIBER_NPI_MISSING: 'Prescriber NPI is missing',
  PATIENT_RECORD_MISSING: 'Patient record does not exist',
  PATIENT_ACCOUNT_MISSING: 'Patient account missing.',
  ACCOUNT_ID_MISSING: 'Account id missing from patient account record.',
  PATIENT_MEMBERSHIP_ALREADY_ACTIVE:
    'Patient membership plan is already active',
  PATIENT_ID_MISSING: 'Patient ID is missing in the patient record.',
  SEND_OTP_CONTACT_DISABLED: 'Phone number is disabled',
  SEND_OTP_CONTACT_NULL: 'Contact cannot be null.',
  SEND_OTP_CONTACT_INVALID_PHONE_NUMBER: 'Invalid phone number.',
  SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS_RESPONSE:
    'Unable to send one-time password.',
  SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS: 'You have tried too many times',
  NO_MAIN_OFFER_FOUND: (identifier: string) =>
    `Main offer not found in offers for identifier: ${identifier}`,
  NO_CONFIRMATION_FOUND: (identifier: string) =>
    `Confirmation not found in prescription for identifier: ${identifier}`,
  NO_FILL_OPTIONS_FOUND: (identifier: string, referenceNumber: string) =>
    `No fill options for prescription ${identifier}-${referenceNumber}`,
  FAMILY_ID_MISSING: 'Family id missing from CASH profile.',
  MEMBER_ID_MISSING: 'Member id missing from CASH profile.',
  PERSON_CODE_MISSING: 'Person code is missing',
  PERSON_DOB_MISSING: 'Person date of birth is missing',
  INVALID_DEPENDENT_PATIENT_DETAILS: 'Invalid dependent patient details',
  INVALID_PERSON_DATA: 'Invalid person data',
  ACTIVATION_PATIENT_USER_DATA_MISMATCH:
    'Activation patient record does not match with user entered information',
  ACTIVATION_PATIENT_COVERAGES_NOT_FOUND: (memberId?: string) =>
    `Patient coverages doesn't exist for ${memberId}.`,
  ACTIVATION_PATIENT_PHONE_NUMBER_NOT_FOUND: (phoneNumber?: string) =>
    `No patient records found for this phone number ${phoneNumber}.`,
  ACTIVATION_PATIENT_MULTIPLE_PBM_PLANS: (phoneNumber?: string) =>
    `Multiple PBM plans exist for this phone number ${phoneNumber}.`,
  APPOINTMENT_DEPENDENT_NOT_FOUND: (masterId?: string) =>
    `No dependent patient record found for ${masterId}.`,
  SMART_CONTRACT_ADDRESS_MISSING: 'Smart contract address missing',
};
