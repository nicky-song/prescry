// Copyright 2022 Prescryptive Health, Inc.

import { ObjectId } from 'mongodb';
import { convertRxAssistantDobToBenefitDob } from '../utils/date-formatter.js';

export const generateSieAndBenefitPersonRecord = (
  i,
  phoneNumber,
  firstName,
  middleInitial,
  lastName,
  dateOfBirth,
  address1,
  address2,
  city,
  state,
  zip,
  effectiveDate,
  createdDate,
  isActivationFlow,
  isSecondary,
  familyIdPrefix
) => {
  var familyId = `${familyIdPrefix}${i.toString().padStart(6, 0)}`;
  var personCode = isSecondary ? '02' : '01';
  var uniqueId = `${familyId}${personCode}`;
  var rxGroup = '1007LPR';
  var rxSubGroup = 'HMA01';
  var rxBin = '610749';
  var pcn = 'PH';
  var gender = i % 2 === 0 ? 'F' : 'M';
  var email = `${lastName}${firstName}@prescryptive.com`;

  var siePerson = {
    identifier: new ObjectId().toHexString(),
    phoneNumber,
    firstName,
    lastName,
    dateOfBirth,
    email,
    address1,
    address2,
    city,
    state,
    zip,
    primaryMemberRxId: uniqueId,
    effectiveDate,
    isPhoneNumberVerified: true,
    isPrimary: isSecondary ? false : true,
    isRxAssistantOnboarded: false,
    isTestMembership: false,
    primaryMemberFamilyId: familyId,
    primaryMemberPersonCode: personCode,
    rxSubGroup,
    rxGroup,
    rxGroupType: 'SIE',
    rxBin,
    carrierPCN: pcn,
    gender,
    isDummy: true,
  };
  var benefitPerson = {
    familyId,
    uniqueId,
    personCode,
    firstName,
    lastName,
    middleInitial,
    gender,
    birthDate: convertRxAssistantDobToBenefitDob(dateOfBirth),
    ssn: '',
    emailAddress: email,
    address1,
    address2,
    city,
    state,
    zip,
    country: '',
    homePhone: `${i.toString().padStart(3, '0')}-home-phone`,
    mobilePhone: `mobile-phone-${i}`,
    brokerAssociation: 'HMA01',
    sponsorOrganization: 'CONFLUENCE',
    group: rxGroup,
    subGroup: rxSubGroup,
    relationshipCode: isSecondary ? 'DEPENDENT' : 'PRIMARY',
    otherCoverage: '',
    clientRiderCode: '',
    clientDefinedField1: '',
    clientDefinedField2: '',
    languageCode: '',
    orderIdCard: '',
    testMember: true,
    department: '',
    updatedAt: createdDate,
    journiOptIn: false,
    createdAt: createdDate,
    isDummy: true,
  };
  if (isActivationFlow) {
    siePerson.activationPhoneNumber = siePerson.phoneNumber;
    siePerson.phoneNumber = '';
    siePerson.isPhoneNumberVerified = false;
  }
  if (isSecondary) {
    var primaryFirstName = `${firstName}-PR`;
    var primaryLastName = `${lastName}-PR`;
    var primaryUniqueId = `${familyId}01`;
    var primaryEmail = `${primaryLastName}${primaryFirstName}@prescryptive.com`;
    // We need to return primary too
    var siePrimaryPerson = {
      identifier: new ObjectId().toHexString(),
      phoneNumber: '',
      firstName: primaryFirstName,
      lastName: primaryLastName,
      dateOfBirth,
      email: primaryEmail,
      primaryMemberRxId: primaryUniqueId,
      effectiveDate,
      isPhoneNumberVerified: false,
      isPrimary: true,
      isRxAssistantOnboarded: false,
      isTestMembership: false,
      primaryMemberFamilyId: familyId,
      primaryMemberPersonCode: '01',
      rxSubGroup,
      rxGroup,
      rxGroupType: 'SIE',
      rxBin,
      carrierPCN: pcn,
      gender,
      isDummy: true,
    };
    var benefitPrimaryPerson = {
      familyId,
      uniqueId: primaryUniqueId,
      personCode: '01',
      firstName: primaryFirstName,
      lastName: primaryLastName,
      middleInitial,
      gender,
      birthDate: convertRxAssistantDobToBenefitDob(dateOfBirth),
      ssn: '',
      emailAddress: primaryEmail,
      address1,
      address2,
      city,
      state,
      zip,
      country: '',
      homePhone: `${i.toString().padStart(3, '0')}-home-phone`,
      mobilePhone: `mobile-phone-${i}`,
      brokerAssociation: 'HMA01',
      sponsorOrganization: 'CONFLUENCE',
      group: rxGroup,
      subGroup: rxSubGroup,
      relationshipCode: 'PRIMARY',
      otherCoverage: '',
      clientRiderCode: '',
      clientDefinedField1: '',
      clientDefinedField2: '',
      languageCode: '',
      orderIdCard: '',
      testMember: true,
      department: '',
      updatedAt: createdDate,
      journiOptIn: false,
      createdAt: createdDate,
      isDummy: true,
    };
  }
  return { siePerson, benefitPerson, siePrimaryPerson, benefitPrimaryPerson };
};
