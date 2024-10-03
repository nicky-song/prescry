// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';
import { findCashProfile, findPbmProfile } from './find-profile.helper';

describe('findProfileHelper', () => {
  const cashProfileMock = {
    firstName: 'cash-first-name',
    lastName: 'cash-last-name',
    rxGroupType: RxGroupTypesEnum.CASH,
  } as IPerson;
  const pbmProfileMock = {
    firstName: 'sie-first-name',
    lastName: 'sie-last-name',
    rxGroupType: RxGroupTypesEnum.SIE,
  } as IPerson;
  const covidProfileMock = {
    firstName: 'covid-first-name',
    lastName: 'covid-last-name',
    rxGroupType: RxGroupTypesEnum.COVID19,
  } as IPerson;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findCashProfile', () => {
    it.each([
      [undefined, undefined],
      [[], undefined],
      [[covidProfileMock, pbmProfileMock], undefined],
      [[covidProfileMock, cashProfileMock, pbmProfileMock], cashProfileMock],
    ])(
      'finds cash profile if present (personList: %p)',
      (
        personListMock: undefined | IPerson[],
        expectedPerson: IPerson | undefined
      ) => {
        expect(findCashProfile(personListMock)).toEqual(expectedPerson);
      }
    );
  });

  describe('findPbmProfile', () => {
    it.each([
      [undefined, undefined],
      [[], undefined],
      [[covidProfileMock, cashProfileMock], undefined],
      [[covidProfileMock, cashProfileMock, pbmProfileMock], pbmProfileMock],
    ])(
      'finds PBM profile if present (personList: %p)',
      (
        personListMock: undefined | IPerson[],
        expectedPerson: IPerson | undefined
      ) => {
        expect(findPbmProfile(personListMock)).toEqual(expectedPerson);
      }
    );
  });
});
