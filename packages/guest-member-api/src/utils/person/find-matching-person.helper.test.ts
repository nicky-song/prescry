// Copyright 2020 Prescryptive Health, Inc.

import {
  findPersonByPrimaryMemberRxId,
  findPersonByFamilyId,
} from './find-matching-person.helper';
import {
  searchPersonByPrimaryMemberFamilyId,
  searchPersonByPrimaryMemberRxId,
} from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { trackUserLoginMechanism } from '../../utils/custom-event-helper';

jest.mock(
  '../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock('../../utils/custom-event-helper');

const searchPersonByPrimaryMemberRxIdMock =
  searchPersonByPrimaryMemberRxId as jest.Mock;
const trackUserLoginMechanismMock = trackUserLoginMechanism as jest.Mock;
const searchPersonByPrimaryMemberFamilyIdMock =
  searchPersonByPrimaryMemberFamilyId as jest.Mock;

const databaseMock = {
  Models: {
    PersonModel: {
      findOne: jest.fn(),
    },
  },
} as unknown as IDatabase;

const primaryMemberRxIdMock = '1234567890';
const firstNameMock = 'Appleseed';
const dateOfBirthMock = '01/01/2020';
const listOfPersonsMock = [
  {
    firstName: 'Appleseed',
    primaryMemberRxId: '1234567890',
  },
  {
    firstName: 'Einstein',
    primaryMemberRxId: '2357111317',
  },
];

beforeEach(() => {
  searchPersonByPrimaryMemberRxIdMock.mockReset();
  trackUserLoginMechanismMock.mockReset();
  searchPersonByPrimaryMemberFamilyIdMock.mockReset();
});

describe('findPersonByPrimaryMemberRxId -> ', () => {
  it('Test findPersonByPrimaryMemberRxId', async () => {
    await findPersonByPrimaryMemberRxId(databaseMock, primaryMemberRxIdMock);
    expect(searchPersonByPrimaryMemberRxIdMock).toBeCalledWith(
      databaseMock,
      primaryMemberRxIdMock
    );
  });

  it('trackUserLoginMechanism is called when modelFound is a valid value', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValue(true);
    expect(
      await findPersonByPrimaryMemberRxId(databaseMock, primaryMemberRxIdMock)
    ).toBe(true);
    expect(trackUserLoginMechanismMock).toBeCalledWith(
      'PrimaryMemberRxId',
      primaryMemberRxIdMock
    );
  });

  it('findPersonByPrimaryMemberRxId returns null when "searchPersonByPrimaryMemberRxId" returns null', async () => {
    searchPersonByPrimaryMemberRxIdMock.mockReturnValue(null);
    expect(
      await findPersonByPrimaryMemberRxId(databaseMock, primaryMemberRxIdMock)
    ).toBe(null);
    expect(trackUserLoginMechanismMock).not.toHaveBeenCalled();
  });
});

describe('findPersonByFamilyId -> ', () => {
  it('Test findPersonByFamilyId', async () => {
    await findPersonByFamilyId(
      databaseMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(searchPersonByPrimaryMemberFamilyIdMock).toBeCalledWith(
      databaseMock,
      primaryMemberRxIdMock,
      dateOfBirthMock
    );
  });

  it('findPersonByFamilyId returns null when "searchPersonByPrimaryMemberFamilyId" returns a empty list of persons', async () => {
    searchPersonByPrimaryMemberFamilyIdMock.mockReturnValue([]);
    expect(
      await findPersonByFamilyId(
        databaseMock,
        firstNameMock,
        dateOfBirthMock,
        primaryMemberRxIdMock
      )
    ).toBe(null);
    expect(trackUserLoginMechanismMock).not.toHaveBeenCalled();
  });

  it('trackUserLoginMechanism is called with the logged in persons member id when "searchPersonByPrimaryMemberRxId" returns a collection of persons associated with the person', async () => {
    const expectedUser = {
      firstName: 'Appleseed',
      primaryMemberRxId: '1234567890',
    };
    searchPersonByPrimaryMemberFamilyIdMock.mockReturnValue(listOfPersonsMock);
    expect(
      await findPersonByFamilyId(
        databaseMock,
        firstNameMock,
        dateOfBirthMock,
        primaryMemberRxIdMock
      )
    ).toEqual(expectedUser);
    expect(trackUserLoginMechanismMock).toHaveBeenCalledWith(
      'FamilyId',
      expectedUser.primaryMemberRxId
    );
  });
});
