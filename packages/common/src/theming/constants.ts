// Copyright 2018 Prescryptive Health, Inc.

import { IRecommendationCarouselContent } from '../models/recommendation';
import { formatPhoneNumber } from '../utils/formatters/phone-number.formatter';
import { BlueScale, GreyScale, YellowScale } from './theme';

export const RecommendationAlternativesScreenConstants = {
  callToActionText: '',
  doctorContactNumber: formatPhoneNumber('1-888-888-8888'),
  doctorName: 'Dr. John Snow',
  explanationText: `Alternative drugs require a new prescription. Talk to your doctor or pharmacist about the best option for you.`,
  recommendationBannerHeaderTitle: 'Alternative medication',
};

export const RecommendationGenericScreenConstants = {
  callToActionText: 'Ask your pharmacist to make a switch',
  explanationText:
    'This alternative medication does not require a new prescription and is the same drug as the prescribed brand.',
};

export const GenericSubstitutionCarouselConstants: IRecommendationCarouselContent =
  {
    bodyContent:
      'Ask your pharmacist\n about switching to a generic equivalent',
    buttonCaption: 'Save Now',
    buttonColor: GreyScale.regular,
    buttonTextColor: GreyScale.lightest,
    fontColor: GreyScale.lightest,
    imageName: 'errorCircle',
    priceText: `Paying too much`,
  };

export const AlternativesSubstitutionCarouselConstants: IRecommendationCarouselContent =
  {
    bodyContent:
      'Ask your doctor\nabout alternative drugs that\ncould treat your condition',
    buttonCaption: 'Save Now',
    buttonColor: BlueScale.darker,
    buttonTextColor: GreyScale.darkest,
    fontColor: GreyScale.darkest,
    imageName: 'alertCircle',
    priceText: `You could save`,
  };

export const NotificationCarouselConstants: IRecommendationCarouselContent = {
  bodyContent: `We analyzed your prescription and\nyou are getting the best deal\nunder your plan at your pharmacy`,
  buttonCaption: 'Learn more',
  buttonColor: BlueScale.darker,
  buttonTextColor: GreyScale.darkest,
  fontColor: YellowScale.regular,
  priceText: `Great price`,
};

export const ReversalCarouselConstants: IRecommendationCarouselContent = {
  bodyContent: `Your pharmacy is working on this\nprescription.\n\nCheck back before you pick up your\nprescription to see information that can\nsave your money!`,
  buttonCaption: 'Learn more',
  buttonColor: BlueScale.darker,
  buttonTextColor: GreyScale.darkest,
  fontColor: YellowScale.regular,
  imageName: 'yellowBang',
  priceText: `Oops something changed`,
};

export const ErrorConstants = {
  errorBadRequest: 'Bad request received',
  errorDrugSearch: (errorMessage: string) =>
    `Error attempting to search for matching drugs -- ${errorMessage}`,
  errorForAddingPin: 'Unable to add pin',
  errorForCreateAccount: 'Unable to create account',
  errorForCreateBooking: 'Unable to book appointment',
  errorForCancelBooking: 'Unable to publish cancel message to service bus',
  errorIncorrectCodeForPhoneVerification: 'Enter the correct code',
  errorInGettingAvailableSlots: 'Unable to get available slots',
  errorForGettingFeed: 'Unable to get feed items',
  errorForGettingMemberContactInfo:
    'Error in getting Member Information. Please try again later.',
  errorForGettingPendingPrescriptions: 'Error in getting pending prescriptions',
  errorForGettingProviderLocations: 'Unable to get provider locations',
  errorForGettingTestResults: 'Unable to get test results',
  errorForGettingPastProceduresList: 'Unable to get past procedures list',
  errorForGettingAppointmentDetails: 'Unable to get appointment details',
  errorForConsent: 'Unable to accept consent',
  errorForUpdatingingPin: 'Unable to update pin',
  errorForVerifyingPin: 'Unable to verify pin',
  errorForVerifyingIdentity: 'Unable to verify identity',
  errorGettingSelectedRecommendationRouteName:
    'Error has occurred while getting selected recommendation route name',
  errorInSendingOneTimePassword: 'Error in sending one time password',
  errorInUpdatingMemberInfo: 'Error has occured while updating member info',
  errorInternalServer: (supportEmail = 'support') =>
    `We’re sorry, an error occurred\n\nPlease try reloading. If the error continues,\ncontact ${supportEmail}`,
  errorInvalidAuthToken: 'Auth Token is invalid or expired',
  errorInvalidMemberDetails: (supportEmail = 'support') =>
    `We could not find your account with this information.\nHaving trouble? [Send us an email](mailto:${supportEmail})`,
  errorInvalidPhoneNumber: 'Invalid Phone Number',
  errorMaxPinVerificationAttemptReached:
    'You have reached max attempts to verify device using pin.',
  errorMissingConfirmedPharmacyOffer:
    'Invalid prescription state for recommendation experience (missing confirmed pharmacy offer)',
  errorMissingProperty: (key: string) => `Missing property '${key}'`,
  errorMissingRecommendedAlternativeSubstitution:
    'Invalid prescription state for recommendation experience (missing recommended alternative substitution)',
  errorMissingSelectedPrescriptionForGenericRecommendationExperience:
    'Invalid prescription state for recommendation experience (missing selected prescription and/or generic recommendation and/or original offer',
  errorMissingSelectedPrescriptionForRecommendationExperience:
    'Invalid prescription state for recommendation experience (missing selected prescription)',
  errorMissingSelectedPrescriptionForRecommendedOfferList:
    'Invalid state for recommended offers list screen (missing selected prescription)',
  errorNoRecommendations:
    'Invalid prescription for working with recommendations (no recommendations)',
  errorNotFound: 'Not Found',
  errorNotificationOriginalOfferMissing:
    'Notification Original Offer is missing',
  errorObjectIsMissing:
    'RecommendationGenericSubstitutionRule object is missing',
  errorPhoneNumberMismatched: 'Phone number mismatched',
  errorRecommendationIdentifierNotFound: 'Recommendation identifier not found',
  errorRequireUserRegistration:
    "We couldn't find account associated with this phone number. Please login with credentials.",
  errorRequireUserSetPin: 'Please add pin.',
  errorRequireUserVerifyPin: 'Please verify your device using pin.',
  errorReversalOriginalOfferMissing: 'Reversal Original Offer is missing',
  errorStroreIsNotAssignedForGuestExperienceNavigation:
    'GuestExperienceNavigation store is not assigned',
  errorStroreIsNotAssignedForPricingExperienceNavigation:
    'PricingExperienceNavigation store is not assigned',
  errorToDispatchSelectedPrescriptionRoute:
    'Invalid state to dispatch selected prescription route',
  errorTooManyRequests: 'You have reached max attempts.',
  errorTwilioMaxSendCodeAttempts:
    'You have reached max attempts to send verification code to the registered mobile number. Please try after 10 minutes.',
  errorTwilioMaxVerifyCodeAttempts:
    'You have reached max attempts to verify code. Please try to re-login after 10 minutes.',
  errorTwilioMaxVerifyDeviceAttempts:
    'You have reached max attempts to verify device. Please try to re-login after 10 minutes.',
  errorUnableToLogin:
    'Unable to login. Please try to re-login after 10 minutes',
  errorUnableToVerifyVerificationCode:
    'Unable to verify verification code. Please try to re-login after 10 minutes.',
  errorUnauthorizedAlertUrlAccess:
    'To view this prescription, please login with the matching MemberRxId',
  errorUnauthorizedToUpdateMemberContactInfo:
    'You are not authorized to update member contact information.\nPlease request primary member to update the information.',
  errorUrlNotFound: (url: string) => `URL '${url}' not found`,
  errorUseMobileBrowser: (supportEmail: string) =>
    `For your convenience and security,\nplease access <b>www.myprescryptive.com</b> from your mobile device\n\nIf you have any questions, please contact us at \n<b>${supportEmail}</b>`,
  errorSlotNotAvailable:
    'Oops, the time you selected is already taken. Please pick another time.',
  errorInvalidDependentInformation: `Information missing or invalid for new dependent`,
  errorForGettingImmunizationRecordDetails:
    'Unable to get the required immunization record details',
  errorForGettingProviderLocationDetails:
    'Unable to get provider location details',
  errorForGettingInviteCodeDetails: 'Unable to get the details for invite code',
  errorForJoinWaitlist: 'Unable to join waitlist',
  errorForAddRecoveryEmail: 'Unable to add recovery email',
  errorForResetPin: ' Unable to reset pin',
  errorForSendVerificationCode: 'Unable to send verification code',
  errorTwilioMaxSendVerificationCodeAttempts:
    'You have reached the maximum number of attempts. Please try again after 10 minutes.',
  errorForGettingPrescriptionInfo: 'Unable to get prescription information',
  errorForGettingPrescriptionPharmacies:
    'Unable to get prescription pharmacies',
  errorSendingPrescription: 'Unable to send prescription',
  errorForLockSlot: 'Unable to lock slot',
  errorForUnlockSlot: 'Unable to unlock slot',
  errorGettingDrugForms: 'Unable to get drug forms',
  errorForGettingPrescription:
    "Sorry! The phone number linked to this prescription doesn't match your login. Please contact support for assistance.",
  errorForUpdateRecoveryEmail: 'Unable to update recovery email',
  errorForUpdateFavoritedPharmacies: 'Unable to update favorited pharmacies',
  errorForGetFavoritedPharmacies: 'Unable to get favorited pharmacies',
  errorForUpdateFeatureKnown: 'Unable to update feature known',
  errorUndefinedSelectedDrugOrConfiguration:
    'selectedDrug and/or selectedConfiguration unexpectedly undefined',
  errorForGettingPharmacies: (zipCode: string) =>
    `Unable to get pharmacies for zip code ${zipCode}`,
  errorForGettingMedicineCabinet: 'Unable to get medicine cabinet',
  errorTransferPrescription: 'Unable to transfer prescription',
  errorInVerifyingMembership:
    'Unable to verify details for PBM account creation',
  errorInVerifyingPrescription: 'Unable to verify prescription',
  errorInGettingUserStatus: 'Unable to get user status from prescriptionId',
  errorForNotFoundPrescription: (supportEmail: string) =>
    `Sorry! This link appears to be invalid. Please try\nagain by clicking on the link directly from \nthe text message or contact us at\n<b>${supportEmail}</b>`,
  errorForGettingAccumulators: 'Unable to get accumulators',
  errorForGettingClaimHistory: 'Unable to get claim history',
  errorForGettingClaimAlert: 'Unable to get claim alert',
  errorForUpdateLanguageCode: 'Unable to update language code',
  errorForGettingAlternativeDrugPrices: 'Unable to get alternative drug prices',
  errorUndefinedPatient: 'Patient info unexpectedly undefined',
};

export const CommonConstants = {
  successText: 'Success',
  pinUpdateSuccess: 'You have changed your PIN!',
  drugServiceMaxResults: '100',
};

export const EndYearForDateOfBirth = 1900;
export const StartYearForDateOfBirth = new Date().getFullYear() - 13;

export const GuestExperienceUiApiResponseConstants = {
  GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR:
    'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
  message:
    'Response received from the api does not match the expected interface',
};

export const PhoneNumberDialingCode = '+1';
export const PhoneNumberOtherCountryDialingCode = '+91';
export const LengthOfPhoneNumber = 10;
export const PrimaryText = '(Primary)';
export const PhoneNumberMaskedValue = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const MaxAllowedFailureAttemptsToVerify = 5;

export const MinimumScheduleDays = 0;
export const MaximumScheduleDays = 90;
export const CancelAppointmentRetryCount = 12;
export const mandatoryIconUsingStrikeThroughStyle = '~~*~~';

export const MedicineCabinetApiConstants = {
  pageSize: 5,
};

export const PinScreenConstants = {
  pinLength: 4,
};
