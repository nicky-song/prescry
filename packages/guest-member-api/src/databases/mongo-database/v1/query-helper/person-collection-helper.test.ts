// Copyright 2018 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { IDatabase } from '../setup/setup-database';
import {
  searchPersonByIdentifier,
  searchPersonByPhoneNumber,
  searchPersonByPrimaryMemberFamilyId,
  searchPersonByPrimaryMemberRxId,
  searchAllMembersForFamilyId,
  searchSmartPriceUserByPhoneNumber,
  searchPersonByActivationPhoneNumber,
  searchPersonByMasterId,
  searchPersonByMasterIdAndRxGroupType,
} from './person-collection-helper';

const findMock = jest.fn();
const findOneMock = jest.fn();
const databaseMock = {
  Models: {
    PersonModel: {
      find: findMock,
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;

const documentsMock = {
  dateOfBirth: '1980-10-05',
  firstName: 'John',
  identifier: '1234',
  lastName: 'Doe',
  phoneNumber: '  +11111111111  ',
  primaryMemberFamilyId: 'AFT2017040710',
  primaryMemberRxId: 'AFT201704071001',
  masterId: 'master-id-mock',
  rxGroupType: RxGroupTypesEnum.CASH,
};

beforeEach(() => {
  findMock.mockReset();
  findOneMock.mockReset();
});

describe('searchPersonByPrimaryMemberRxId', () => {
  it('should call findOne() with required paramas', () => {
    searchPersonByPrimaryMemberRxId(
      databaseMock,
      documentsMock.primaryMemberRxId
    );
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      $or: [
        { primaryMemberRxId: 'aft201704071001' },
        { primaryMemberRxId: 'AFT201704071001' },
      ],
    });
  });
});

describe('searchPersonByMasterId', () => {
  it('should call findOne() with required paramas', () => {
    searchPersonByMasterId(databaseMock, documentsMock.masterId);
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      masterId: 'master-id-mock',
    });
  });
});

describe('searchPersonByMasterIdAndRxGroupType', () => {
  it('should call findOne() with required paramas', () => {
    searchPersonByMasterIdAndRxGroupType(
      databaseMock,
      documentsMock.masterId,
      documentsMock.rxGroupType
    );
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      $and: [
        { masterId: 'master-id-mock' },
        { rxGroupType: RxGroupTypesEnum.CASH },
      ],
    });
  });
});

describe('searchPersonByPrimaryMemberFamilyId', () => {
  it('should call find() with required paramas', () => {
    searchPersonByPrimaryMemberFamilyId(
      databaseMock,
      documentsMock.primaryMemberRxId,
      documentsMock.dateOfBirth
    );
    expect(findMock).toHaveBeenNthCalledWith(1, {
      $and: [
        {
          $or: [
            { primaryMemberFamilyId: 'aft201704071001' },
            { primaryMemberFamilyId: 'AFT201704071001' },
          ],
        },
        { dateOfBirth: '1980-10-05' },
      ],
    });
  });
});

describe('searchPersonByPhoneNumber', () => {
  it('should call find() with required phoneNumber paramas', () => {
    searchPersonByPhoneNumber(databaseMock, documentsMock.phoneNumber);
    expect(findMock).toHaveBeenNthCalledWith(
      1,
      {
        phoneNumber: '+11111111111',
      },
      'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber brokerAssociation rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
    );
  });
});

describe('searchPersonByIdentifier', () => {
  it('should call findOne() with required identifier params', () => {
    searchPersonByIdentifier(databaseMock, documentsMock.identifier);
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      identifier: '1234',
    });
  });
});

describe('searchAllMembersForFamilyId', () => {
  it('should call find with primaryMemberFamilyId param', () => {
    searchAllMembersForFamilyId(databaseMock, 'mock-family-id');
    expect(findMock).toHaveBeenCalledWith(
      {
        primaryMemberFamilyId: 'mock-family-id',
      },
      'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
    );
  });
});

describe('searchSmartPriceUserByPhoneNumber', () => {
  it('should call count() with required phoneNumber params', () => {
    searchSmartPriceUserByPhoneNumber(databaseMock, documentsMock.phoneNumber);
    expect(findOneMock).toHaveBeenNthCalledWith(
      1,
      {
        $and: [{ phoneNumber: '+11111111111' }, { rxSubGroup: 'SMARTPRICE' }],
      },
      'primaryMemberFamilyId primaryMemberPersonCode rxGroup rxBin carrierPCN'
    );
  });
});

describe('searchPersonByActivationPhoneNumber', () => {
  it('should call findOne() with required phoneNumber params', () => {
    searchPersonByActivationPhoneNumber(
      databaseMock,
      documentsMock.phoneNumber
    );
    expect(findOneMock).toHaveBeenNthCalledWith(
      1,
      {
        activationPhoneNumber: '+11111111111',
      },
      'identifier firstName lastName dateOfBirth isPhoneNumberVerified primaryMemberFamilyId primaryMemberRxId phoneNumber isPrimary email secondaryAlertCarbonCopyIdentifier issuerNumber rxSubGroup rxGroup rxGroupType rxBin carrierPCN secondaryAlertChildCareTakerIdentifier primaryMemberPersonCode address1 address2 county city state zip masterId isTestMembership'
    );
  });
});
