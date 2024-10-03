// Copyright 2018 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';

export const searchPersonByPrimaryMemberRxId = (
  database: IDatabase,
  primaryMemberRxId: string
) =>
  database.Models.PersonModel.findOne({
    $or: [
      { primaryMemberRxId: primaryMemberRxId.toLowerCase() },
      { primaryMemberRxId: primaryMemberRxId.toUpperCase() },
    ],
  });

export const searchPersonByMasterId = (database: IDatabase, masterId: string) =>
  database.Models.PersonModel.findOne({ masterId });

export const searchPersonByMasterIdAndRxGroupType = (
  database: IDatabase,
  masterId: string,
  rxGroupType: string
) =>
  database.Models.PersonModel.findOne({
    $and: [{ masterId }, { rxGroupType }],
  });

export const searchPersonByPrimaryMemberFamilyId = (
  database: IDatabase,
  primaryMemberFamilyId: string,
  dateOfBirth: string
) =>
  database.Models.PersonModel.find({
    $and: [
      {
        $or: [
          { primaryMemberFamilyId: primaryMemberFamilyId.toLowerCase() },
          { primaryMemberFamilyId: primaryMemberFamilyId.toUpperCase() },
        ],
      },
      {
        dateOfBirth,
      },
    ],
  });

export const searchPersonByPhoneNumber = (
  database: IDatabase,
  phoneNumber: string
) =>
  database.Models.PersonModel.find(
    { phoneNumber: phoneNumber.trim() },
    'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber brokerAssociation rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
  );

export const searchPersonByIdentifier = (
  database: IDatabase,
  identifier: string
) => database.Models.PersonModel.findOne({ identifier: identifier.trim() });

export const searchAllMembersForFamilyId = (
  database: IDatabase,
  primaryMemberFamilyId: string
) =>
  database.Models.PersonModel.find(
    {
      primaryMemberFamilyId,
    },
    'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
  );

export const searchSmartPriceUserByPhoneNumber = (
  database: IDatabase,
  phoneNumber: string
) =>
  database.Models.PersonModel.findOne(
    {
      $and: [{ phoneNumber: phoneNumber.trim() }, { rxSubGroup: 'SMARTPRICE' }],
    },
    'primaryMemberFamilyId primaryMemberPersonCode rxGroup rxBin carrierPCN'
  );

export const searchPersonByActivationPhoneNumber = (
  database: IDatabase,
  phoneNumber: string
) =>
  database.Models.PersonModel.findOne(
    { activationPhoneNumber: phoneNumber.trim() },
    'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
  );
